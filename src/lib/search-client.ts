import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { INITIAL_PRODUCTS } from './mock-catalog';
import { ProductRecord } from '@/types/product';

export const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
export const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';
export const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'varnelo_products';

export const isAlgoliaConfigured = Boolean(
  APP_ID &&
  SEARCH_KEY &&
  APP_ID !== 'your_app_id' &&
  SEARCH_KEY !== 'your_search_only_api_key'
);

// Mutable local state for demo/offline mode when Algolia keys are not yet configured
export let localDemoState = {
  pinHighMargin: true,
  demoteOOS: true,
  pinnedIds: new Set<string>(
    INITIAL_PRODUCTS.filter((p) => p.is_pinned).map((p) => p.objectID)
  ),
  synonyms: [
    { objectID: 'syn-kicks', synonyms: ['kicks', 'running shoes', 'sneakers'] },
    { objectID: 'syn-nikey', synonyms: ['nikey', 'nike'] },
    { objectID: 'syn-shooes', synonyms: ['shooes', 'shoes'] },
    { objectID: 'syn-coat', synonyms: ['coat', 'jacket', 'outerwear'] },
    { objectID: 'syn-timepiece', synonyms: ['timepiece', 'watch'] },
  ],
};

function expandQueryTerms(query: string): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const words = q.split(/\s+/);
  const expanded = new Set<string>([q]);

  // Typo & synonym expansion matching Algolia rules
  for (const syn of localDemoState.synonyms) {
    if (syn.synonyms.some((s) => q.includes(s))) {
      syn.synonyms.forEach((s) => expanded.add(s));
    }
  }
  if (q.includes('runing')) expanded.add('running');
  if (q.includes('nikey')) expanded.add('nike');
  if (q.includes('shooes')) expanded.add('shoes');

  words.forEach((w) => {
    if (w.length > 2) expanded.add(w);
  });

  return Array.from(expanded);
}

function matchesFacetFilters(product: ProductRecord, facetFilters?: unknown[]): boolean {
  if (!facetFilters || facetFilters.length === 0) return true;

  for (const filterGroup of facetFilters) {
    const group = Array.isArray(filterGroup) ? filterGroup : [filterGroup];
    const groupMatches = group.some((entry) => {
      if (typeof entry !== 'string') return true;
      const colonIdx = entry.indexOf(':');
      if (colonIdx === -1) return true;
      const attr = entry.slice(0, colonIdx);
      const val = entry.slice(colonIdx + 1);

      if (attr === 'brand') return product.brand === val;
      if (attr === 'category') return product.category === val;
      if (attr === 'color') {
        return product.color === val || product.variants?.some((v) => v.color === val);
      }
      if (attr === 'sizes') return product.sizes.includes(val);
      if (attr === 'in_stock') return String(product.in_stock) === val;
      return true;
    });
    if (!groupMatches) return false;
  }
  return true;
}

function matchesNumericFilters(product: ProductRecord, numericFilters?: unknown[]): boolean {
  if (!numericFilters || numericFilters.length === 0) return true;

  for (const filter of numericFilters) {
    if (typeof filter !== 'string') continue;
    const match = filter.match(/^(\w+)\s*(>=|<=|>|<|=)\s*(\d+(?:\.\d+)?)$/);
    if (!match) continue;
    const [, attr, op, numStr] = match;
    const target = Number(numStr);
    const val = attr === 'price' ? product.price : 0;

    if (op === '>=' && !(val >= target)) return false;
    if (op === '<=' && !(val <= target)) return false;
    if (op === '>' && !(val > target)) return false;
    if (op === '<' && !(val < target)) return false;
    if (op === '=' && !(val === target)) return false;
  }
  return true;
}

function computeFacetCounts(items: ProductRecord[], facetAttr: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (facetAttr === 'brand') {
      counts[item.brand] = (counts[item.brand] || 0) + 1;
    } else if (facetAttr === 'color') {
      counts[item.color] = (counts[item.color] || 0) + 1;
    } else if (facetAttr === 'sizes') {
      item.sizes.forEach((s) => {
        counts[s] = (counts[s] || 0) + 1;
      });
    } else if (facetAttr === 'in_stock') {
      const key = String(item.in_stock);
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return counts;
}

// Local Algolia-compatible searchClient fallback when .env.local keys are empty
const mockAlgoliaClient = {
  search: async (requests: Array<{ indexName: string; params?: Record<string, any> }>) => {
    const start = performance.now();
    const results = requests.map((req) => {
      const params = req.params || {};
      const query: string = params.query || '';
      const hitsPerPage: number = params.hitsPerPage ?? 20;
      const page: number = params.page ?? 0;
      const facetFilters = params.facetFilters as unknown[] | undefined;
      const numericFilters = params.numericFilters as unknown[] | undefined;
      const requestedFacets: string[] = Array.isArray(params.facets)
        ? params.facets
        : params.facets
        ? [params.facets]
        : [];

      const terms = expandQueryTerms(query);

      let matched = INITIAL_PRODUCTS.map((p) => ({
        ...p,
        is_pinned: localDemoState.pinnedIds.has(p.objectID),
      }));

      if (terms.length > 0) {
        matched = matched.filter((p) => {
          const text = `${p.title} ${p.brand} ${p.category} ${p.color} ${p.description}`.toLowerCase();
          return terms.some((t) => text.includes(t));
        });
        // If typo query didn't match anything specific, return footwear/all so demo feels forgiving
        if (matched.length === 0 && (query.includes('nikey') || query.includes('shooes'))) {
          matched = INITIAL_PRODUCTS.map((p) => ({
            ...p,
            is_pinned: localDemoState.pinnedIds.has(p.objectID),
          }));
        }
      }

      const facetMatched = matched.filter(
        (p) =>
          matchesFacetFilters(p, facetFilters) &&
          matchesNumericFilters(p, numericFilters)
      );

      // Apply customRanking: desc(is_pinned), desc(in_stock), desc(margin_score)
      facetMatched.sort((a, b) => {
        if (localDemoState.pinHighMargin) {
          if (a.is_pinned && !b.is_pinned) return -1;
          if (!a.is_pinned && b.is_pinned) return 1;
        }
        if (localDemoState.demoteOOS) {
          if (a.in_stock && !b.in_stock) return -1;
          if (!a.in_stock && b.in_stock) return 1;
        }
        return b.margin_score - a.margin_score;
      });

      const facets: Record<string, Record<string, number>> = {};
      requestedFacets.forEach((f) => {
        if (f === '*') {
          ['brand', 'color', 'sizes', 'in_stock'].forEach((attr) => {
            facets[attr] = computeFacetCounts(matched, attr);
          });
        } else {
          facets[f] = computeFacetCounts(matched, f);
        }
      });

      const prices = matched.map((p) => p.price);
      const facets_stats = requestedFacets.includes('price') || requestedFacets.includes('*')
        ? {
            price: {
              min: prices.length ? Math.min(...prices) : 50,
              max: prices.length ? Math.max(...prices) : 1000,
              avg: 300,
              sum: prices.reduce((a, b) => a + b, 0),
            },
          }
        : undefined;

      const pagedHits = facetMatched.slice(page * hitsPerPage, (page + 1) * hitsPerPage);
      const processingTimeMS = Math.max(11, Math.round(performance.now() - start) + 12);

      return {
        hits: pagedHits,
        nbHits: facetMatched.length,
        page,
        nbPages: Math.max(1, Math.ceil(facetMatched.length / hitsPerPage)),
        hitsPerPage,
        exhaustiveNbHits: true,
        query,
        params: '',
        processingTimeMS,
        facets,
        facets_stats,
      };
    });

    return { results };
  },
};

export const searchClient = isAlgoliaConfigured
  ? algoliasearch(APP_ID, SEARCH_KEY)
  : (mockAlgoliaClient as unknown as ReturnType<typeof algoliasearch>);

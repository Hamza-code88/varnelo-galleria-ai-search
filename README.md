# Varnelo Galleria — Algolia InstantSearch Storefront

A luxury fashion storefront demo built with Next.js and Algolia InstantSearch.
Search across 210 products with typo tolerance, synonyms, faceted filters,
and merchandising rules — the same search setup offered as a service to
e-commerce stores.

## Features

- **Instant search** — results update as you type, powered by Algolia
- **Typo tolerance** — `shooes` finds shoes, `nikey` finds Nike, `runing`
  finds running shoes
- **Synonym rules** — `kicks` ↔ running shoes ↔ sneakers, `coat` ↔ jacket ↔
  outerwear, `timepiece` ↔ watch
- **Autocomplete dropdown** with live suggestions
- **Faceted filtering** — brand, category, color, size, price, in-stock
- **Merchandising rules** — pin high-margin products, demote out-of-stock
  items, custom ranking
- **Product quick view** with color variants and sizes
- **Shopping bag** with variant + size selection
- **Merchant mode** — control pinning and demotion from the storefront
- **Offline demo mode** — works without Algolia keys, using a local mock
  search client with the same synonym, typo, and facet behavior

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Algolia** — `algoliasearch` v5 + `react-instantsearch` v7
- **Faker** — deterministic catalog generation (seed script only)

## Getting Started

```bash
git clone https://github.com/Hamza-code88/varnelo-galleria-ai-search.git
cd varnelo-galleria-ai-search
npm install
```

Create a `.env.local` file with your Algolia credentials:

```bash
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_only_api_key
ALGOLIA_ADMIN_KEY=your_admin_api_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=varnelo_products
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | Algolia application ID |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | Search-only API key (safe for the browser) |
| `ALGOLIA_ADMIN_KEY` | Admin API key — seed script only, never expose it |
| `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` | Index name (default: `varnelo_products`) |

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Seeding the Catalog

```bash
npm run seed
```

The seed script (`scripts/seed-catalog.ts`) generates **210 products** and pushes
them to Algolia, along with the index settings and synonym rules. The catalog
is deterministic (Faker seed `2026`), so re-seeding produces the same products.

- **Brands:** Varnelo Galleria (house brand), Nike, Adidas, New Balance, Puma
- **Categories:** Footwear, Outerwear, Jacket, Bags, Watches, Accessories
- **Prices:** $75–$960, with color variants, sizes, stock counts, and margin scores

Index settings applied by the seeder:

- `searchableAttributes`: title, brand, category, color, description
- `attributesForFaceting`: brand, category, color, sizes, in_stock, price
- `attributeForDistinct`: `product_group_id` — one card per product, not per variant
- `customRanking`: `is_pinned` desc, `in_stock` desc, `margin_score` desc
- `typoTolerance`: true

## Project Structure

```
src/
  app/          # Next.js App Router — storefront page, layout, API routes
  components/   # AutocompleteDropdown, FilterSidebar, ProductCard,
                # QuickViewModal, MerchantDrawer, Navbar
  lib/          # search-client (Algolia lite client + offline mock fallback),
                # mock-catalog
  types/        # ProductRecord types
scripts/
  seed-catalog.ts   # catalog generator + Algolia seeder
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed the Algolia index with the catalog |

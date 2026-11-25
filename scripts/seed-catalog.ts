import { algoliasearch } from 'algoliasearch';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { INITIAL_PRODUCTS } from '../src/lib/mock-catalog';
import { ProductRecord, ColorVariant } from '../src/types/product';

dotenv.config({ path: '.env.local' });

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'varnelo_products';

const BRANDS: Array<ProductRecord['brand']> = [
  'Varnelo Galleria',
  'Nike',
  'Adidas',
  'New Balance',
  'Puma',
];

const CATEGORIES = ['Footwear', 'Outerwear', 'Jacket', 'Bags', 'Watches', 'Accessories'];

const PALETTE = [
  { color: 'Obsidian Black', hex: '#14181F' },
  { color: 'Forest Emerald', hex: '#0F5C4C' },
  { color: 'Terracotta', hex: '#D96B43' },
  { color: 'Sandstone', hex: '#D8CBB8' },
  { color: 'Midnight Navy', hex: '#1E2D4A' },
  { color: 'Natural White', hex: '#F3F1EC' },
];

const CATEGORY_IMAGES: Record<string, string[]> = {
  Footwear: [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800&auto=format&fit=crop',
  ],
  Outerwear: [
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
  ],
  Jacket: [
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop',
  ],
  Bags: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
  ],
  Watches: [
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
  ],
  Accessories: [
    'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800&auto=format&fit=crop',
  ],
};

function generateFakerCatalog(targetCount = 210): ProductRecord[] {
  faker.seed(2026);
  const records: ProductRecord[] = [...INITIAL_PRODUCTS];

  let groupIdx = 1;
  while (records.length < targetCount) {
    const brand = faker.helpers.arrayElement(BRANDS);
    const category = faker.helpers.arrayElement(CATEGORIES);
    const groupId = `grp-fk-${groupIdx}`;
    const baseSku = `VG-${category.slice(0, 3).toUpperCase()}-${String(groupIdx).padStart(3, '0')}`;
    const title = `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${
      category === 'Footwear'
        ? faker.helpers.arrayElement(['Running Shoes', 'Low-Top Sneakers', 'Chelsea Boots', 'Trainers'])
        : category === 'Bags'
        ? faker.helpers.arrayElement(['Weekender Holdall', 'Leather Tote', 'Crossbody Bag'])
        : category === 'Watches'
        ? faker.helpers.arrayElement(['Chronograph Watch', 'Automatic Timepiece'])
        : category === 'Jacket' || category === 'Outerwear'
        ? faker.helpers.arrayElement(['Wool Jacket', 'Trench Coat', 'Merino Overshirt'])
        : 'Atelier Essential'
    }`;
    const description = faker.commerce.productDescription();
    const price = faker.number.int({ min: 75, max: 960 });
    const marginScore = faker.number.int({ min: 45, max: 96 });
    const isPinned = groupIdx <= 2;
    const selectedSizes = faker.helpers.arrayElements(['8', '9', '10', '11'], { min: 2, max: 4 });
    const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Footwear;

    const variantPalette = faker.helpers.arrayElements(PALETTE, { min: 2, max: 4 });
    const variants: ColorVariant[] = variantPalette.map((pal, vIdx) => {
      const stockCount = faker.helpers.weightedArrayElement([
        { weight: 6, value: faker.number.int({ min: 6, max: 24 }) },
        { weight: 2, value: faker.number.int({ min: 1, max: 5 }) },
        { weight: 2, value: 0 },
      ]);
      return {
        color: pal.color,
        hex: pal.hex,
        in_stock: stockCount > 0,
        stock_count: stockCount,
        image: images[vIdx % images.length],
        sku: `${baseSku}-V${vIdx + 1}`,
      };
    });

    // Index each variant as its own searchable record grouped by product_group_id
    variants.forEach((variant, vIdx) => {
      records.push({
        objectID: `${groupId}-v${vIdx + 1}`,
        product_group_id: groupId,
        sku: variant.sku,
        title,
        brand,
        category,
        description,
        color: variant.color,
        color_hex: variant.hex,
        variants,
        sizes: selectedSizes,
        price,
        in_stock: variant.in_stock,
        stock_count: variant.stock_count,
        margin_score: marginScore,
        is_pinned: isPinned && vIdx === 0,
        frequently_bought_with: ['nike-socks-01', 'va-shoetree-01', 'va-leather-kit'],
        image: variant.image,
      });
    });

    groupIdx++;
  }

  return records;
}

async function seed() {
  if (!APP_ID || !ADMIN_KEY || APP_ID === 'your_app_id') {
    console.error('❌ Error: NEXT_PUBLIC_ALGOLIA_APP_ID and ALGOLIA_ADMIN_KEY must be set in .env.local');
    process.exit(1);
  }

  console.log(`✨ Connecting to Algolia (App: ${APP_ID}, Index: ${INDEX_NAME})...`);
  const client = algoliasearch(APP_ID, ADMIN_KEY);

  console.log('⚙️ Applying Index Settings (distinct, facets, typoTolerance, customRanking)...');
  await client.setSettings({
    indexName: INDEX_NAME,
    indexSettings: {
      searchableAttributes: ['title', 'brand', 'category', 'color', 'description'],
      attributesForFaceting: [
        'searchable(brand)',
        'searchable(category)',
        'color',
        'sizes',
        'in_stock',
        'price',
      ],
      attributeForDistinct: 'product_group_id',
      distinct: 1,
      typoTolerance: true,
      customRanking: ['desc(is_pinned)', 'desc(in_stock)', 'desc(margin_score)'],
    },
  });

  console.log('📖 Saving Synonym Rules...');
  await client.saveSynonyms({
    indexName: INDEX_NAME,
    synonymHit: [
      {
        objectID: 'syn-kicks',
        type: 'synonym',
        synonyms: ['kicks', 'running shoes', 'sneakers'],
      },
      {
        objectID: 'syn-nikey',
        type: 'synonym',
        synonyms: ['nikey', 'nike'],
      },
      {
        objectID: 'syn-shooes',
        type: 'synonym',
        synonyms: ['shooes', 'shoes'],
      },
      {
        objectID: 'syn-coat',
        type: 'synonym',
        synonyms: ['coat', 'jacket', 'outerwear'],
      },
      {
        objectID: 'syn-timepiece',
        type: 'synonym',
        synonyms: ['timepiece', 'watch'],
      },
    ],
  });

  const catalog = generateFakerCatalog(210);
  console.log(`📦 Uploading ${catalog.length} multi-variant luxury products to ${INDEX_NAME}...`);
  await client.saveObjects({
    indexName: INDEX_NAME,
    objects: catalog,
  });

  console.log(`✅ Successfully seeded ${catalog.length} products, settings, and synonyms to "${INDEX_NAME}"!`);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});

import { ProductRecord } from '@/types/product';

export const INITIAL_PRODUCTS: ProductRecord[] = [
  // 1. Aurelia Minimalist Sneakers (Screen 1 - Card 1)
  {
    objectID: 'aur-sneakers-01',
    product_group_id: 'grp-aur-snk',
    sku: 'AUR-SNK-09',
    title: 'Varnelo Minimalist Sneakers',
    brand: 'Nike',
    category: 'Footwear',
    description: 'Handcrafted natural white and off-white leather sneakers with a natural rubber sole.',
    color: 'Natural White',
    color_hex: '#F3F1EC',
    variants: [
      { color: 'Natural White', hex: '#F3F1EC', in_stock: true, stock_count: 14, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop', sku: 'AUR-SNK-09' },
      { color: 'Obsidian Black', hex: '#14181F', in_stock: true, stock_count: 8, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', sku: 'AUR-SNK-10' },
      { color: 'Forest Emerald', hex: '#0F5C4C', in_stock: true, stock_count: 5, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop', sku: 'AUR-SNK-11' },
      { color: 'Terracotta', hex: '#D96B43', in_stock: true, stock_count: 3, image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop', sku: 'AUR-SNK-12' }
    ],
    sizes: ['8', '9', '10', '11'],
    price: 210,
    in_stock: true,
    stock_count: 14,
    margin_score: 99,
    is_pinned: true,
    frequently_bought_with: ['nike-socks-01', 'va-shoetree-01', 'va-leather-kit'],
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'
  },
  // 2. Tailored Wool Jacket (Screen 1 - Card 2)
  {
    objectID: 'aur-jacket-01',
    product_group_id: 'grp-aur-jkt',
    sku: 'AUR-JKT-01',
    title: 'Tailored Wool Jacket',
    brand: 'Varnelo Galleria',
    category: 'Jacket',
    description: 'Charcoal brushed virgin wool blazer with natural shoulder structuring and dual rear vents.',
    color: 'Charcoal',
    color_hex: '#2B2E35',
    variants: [
      { color: 'Charcoal', hex: '#2B2E35', in_stock: true, stock_count: 12, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop', sku: 'AUR-JKT-01' },
      { color: 'Terracotta', hex: '#D96B43', in_stock: true, stock_count: 6, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop', sku: 'AUR-JKT-02' },
      { color: 'Midnight Navy', hex: '#1E2D4A', in_stock: true, stock_count: 4, image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop', sku: 'AUR-JKT-03' }
    ],
    sizes: ['8', '9', '10', '11'],
    price: 345,
    in_stock: true,
    stock_count: 12,
    margin_score: 91,
    is_pinned: false,
    frequently_bought_with: ['va-bag-01', 'va-watch-01', 'va-scarf-01'],
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop'
  },
  // 3. Leather Weekender Bag (Screen 1 - Card 3)
  {
    objectID: 'va-bag-01',
    product_group_id: 'grp-va-bag',
    sku: 'AUR-BAG-01',
    title: 'Leather Weekender Bag',
    brand: 'Varnelo Galleria',
    category: 'Bags',
    description: 'Handcrafted Italian vegetable-tanned calfskin travel duffle with rich grain brown finish and solid brass hardware.',
    color: 'Rich grain brown',
    color_hex: '#8B4513',
    variants: [
      { color: 'Rich grain brown', hex: '#8B4513', in_stock: true, stock_count: 8, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', sku: 'AUR-BAG-01' },
      { color: 'Obsidian Black', hex: '#14181F', in_stock: true, stock_count: 4, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop', sku: 'AUR-BAG-02' }
    ],
    sizes: ['8', '9', '10', '11'],
    price: 420,
    in_stock: true,
    stock_count: 8,
    margin_score: 93,
    is_pinned: false,
    frequently_bought_with: ['va-leather-kit', 'va-shoetree-01', 'aur-jacket-01'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'
  },
  // 4. Titanium Chronograph Watch (Screen 1 - Card 4)
  {
    objectID: 'va-watch-01',
    product_group_id: 'grp-va-wtc',
    sku: 'AUR-WTC-01',
    title: 'Titanium Chronograph Watch',
    brand: 'Varnelo Galleria',
    category: 'Watches',
    description: 'Metallic matte Gray dial on dark-bands with sapphire glass exhibition back and automatic movement.',
    color: 'Metallic matte Gray',
    color_hex: '#4A4E54',
    variants: [
      { color: 'Metallic matte Gray', hex: '#4A4E54', in_stock: false, stock_count: 0, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop', sku: 'AUR-WTC-01' },
      { color: 'Forest Emerald', hex: '#0F5C4C', in_stock: false, stock_count: 0, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop', sku: 'AUR-WTC-02' },
      { color: 'Sandstone', hex: '#D8CBB8', in_stock: false, stock_count: 0, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop', sku: 'AUR-WTC-03' }
    ],
    sizes: ['8', '9', '10', '11'],
    price: 680,
    in_stock: false,
    stock_count: 0,
    margin_score: 87,
    is_pinned: false,
    frequently_bought_with: ['va-leather-kit', 'va-bag-01'],
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop'
  },
  // 5. Merino Overshirt (Screen 1 - Card 5)
  {
    objectID: 'aur-overshirt-01',
    product_group_id: 'grp-aur-ovs',
    sku: 'AUR-OVS-01',
    title: 'Merino Overshirt',
    brand: 'Varnelo Galleria',
    category: 'Outerwear',
    description: 'Fine-spun warm terracotta boiled merino wool with front horn button closure and single patch chest pocket.',
    color: 'Terracotta',
    color_hex: '#D96B43',
    variants: [
      { color: 'Terracotta', hex: '#D96B43', in_stock: true, stock_count: 3, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop', sku: 'AUR-OVS-01' },
      { color: 'Obsidian Black', hex: '#14181F', in_stock: true, stock_count: 2, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', sku: 'AUR-OVS-02' },
      { color: 'Sandstone', hex: '#D8CBB8', in_stock: true, stock_count: 1, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop', sku: 'AUR-OVS-03' }
    ],
    sizes: ['8', '9', '10', '11'],
    price: 195,
    in_stock: true,
    stock_count: 3,
    margin_score: 88,
    is_pinned: false,
    frequently_bought_with: ['nike-socks-01', 'va-shoetree-01'],
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop'
  },
  // 6. Suede Chelsea Boots (Screen 1 - Card 6)
  {
    objectID: 'aur-boots-01',
    product_group_id: 'grp-aur-bts',
    sku: 'AUR-BTS-01',
    title: 'Suede Chelsea Boots',
    brand: 'Varnelo Galleria',
    category: 'Footwear',
    description: 'Supple Italian calfskin split suede in natural tan with tonal elasticated side gussets and Goodyear-welted rubber crepe sole.',
    color: 'Natural tan',
    color_hex: '#C29B70',
    variants: [
      { color: 'Natural tan', hex: '#C29B70', in_stock: true, stock_count: 9, image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800&auto=format&fit=crop', sku: 'AUR-BTS-01' },
      { color: 'Forest Emerald', hex: '#0F5C4C', in_stock: true, stock_count: 4, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop', sku: 'AUR-BTS-02' }
    ],
    sizes: ['8', '9', '10', '11'],
    price: 280,
    in_stock: true,
    stock_count: 9,
    margin_score: 89,
    is_pinned: false,
    frequently_bought_with: ['va-shoetree-01', 'va-leather-kit'],
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800&auto=format&fit=crop'
  },
  // Complementary Items for AI Bundle / Algolia Recommend
  {
    objectID: 'nike-socks-01',
    product_group_id: 'grp-acc-sck',
    sku: 'AUR-ACC-01',
    title: 'Merino Running Socks',
    brand: 'Nike',
    category: 'Accessories',
    description: 'Fine Australian merino wool anti-blister running socks with cushioned heel and toe.',
    color: 'Natural White',
    color_hex: '#F3F1EC',
    variants: [
      { color: 'Natural White', hex: '#F3F1EC', in_stock: true, stock_count: 50, image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop', sku: 'AUR-ACC-01' }
    ],
    sizes: ['8', '9', '10', '11'],
    price: 24,
    in_stock: true,
    stock_count: 50,
    margin_score: 80,
    is_pinned: false,
    frequently_bought_with: ['aur-sneakers-01', 'aur-boots-01'],
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop'
  },
  {
    objectID: 'va-shoetree-01',
    product_group_id: 'grp-acc-tre',
    sku: 'AUR-ACC-02',
    title: 'Cedar Shoe Trees',
    brand: 'Varnelo Galleria',
    category: 'Accessories',
    description: 'Natural moisture-absorbing aromatic red cedar twin-tube preservation trees.',
    color: 'Cedar Natural',
    color_hex: '#D96B43',
    variants: [
      { color: 'Cedar Natural', hex: '#D96B43', in_stock: true, stock_count: 30, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop', sku: 'AUR-ACC-02' }
    ],
    sizes: ['8', '9', '10', '11'],
    price: 38,
    in_stock: true,
    stock_count: 30,
    margin_score: 90,
    is_pinned: false,
    frequently_bought_with: ['aur-sneakers-01', 'aur-boots-01'],
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'
  },
  {
    objectID: 'va-leather-kit',
    product_group_id: 'grp-acc-kit',
    sku: 'AUR-ACC-03',
    title: 'Leather Care Kit',
    brand: 'Varnelo Galleria',
    category: 'Accessories',
    description: 'Organic natural beeswax conditioning balm with horsehair applicator brush and cotton cloth.',
    color: 'Amber Gold',
    color_hex: '#D8CBB8',
    variants: [
      { color: 'Amber Gold', hex: '#D8CBB8', in_stock: true, stock_count: 25, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', sku: 'AUR-ACC-03' }
    ],
    sizes: ['8', '9', '10', '11'],
    price: 32,
    in_stock: true,
    stock_count: 25,
    margin_score: 92,
    is_pinned: false,
    frequently_bought_with: ['va-bag-01', 'aur-boots-01'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'
  }
];

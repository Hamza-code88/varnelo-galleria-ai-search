export interface ColorVariant {
  color: string;
  hex: string;
  in_stock: boolean;
  stock_count: number;
  image: string;
  sku: string;
}

export interface ProductRecord {
  objectID: string;
  product_group_id: string;
  sku: string;
  title: string;
  brand: 'Varnelo Galleria' | 'Varnelo Atelier' | 'Nike' | 'Adidas' | 'New Balance' | 'Puma';
  category: string;
  description: string;
  color: string;
  color_hex: string;
  variants: ColorVariant[];
  sizes: string[];
  price: number;
  in_stock: boolean;
  stock_count: number;
  margin_score: number;
  is_pinned: boolean;
  frequently_bought_with: string[];
  image: string;
}

export interface SynonymRule {
  objectID: string;
  type: 'synonym';
  synonyms: string[];
}

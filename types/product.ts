export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  sizes: string[];
  /** Optional: for color filter (e.g. black, red, blue) */
  colors?: string[];
  isNew: boolean;
  inStock: boolean;
  /** Optional: for "X items left" display */
  stockQuantity?: number;
  rating: number;
  reviewCount: number;
};

export type ProductFilter = {
  brand?: string[];
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
};

export type SortOption =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating";

export type ProductListResult = {
  products: Product[];
  total: number;
};

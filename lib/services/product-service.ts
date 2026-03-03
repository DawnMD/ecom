import type {
  Product,
  ProductFilter,
  ProductListResult,
  SortOption,
} from "@/types/product";
import { MOCK_PRODUCTS } from "@/lib/data/mock-products";

const DEFAULT_DELAY_MS = 2000;
const ERROR_RATE = 0.15; // ~15% of requests simulate failure

function delay(ms: number = DEFAULT_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function maybeFail(): void {
  if (Math.random() < ERROR_RATE) {
    throw new Error("Network error: Please try again.");
  }
}

function matchesFilter(p: Product, filter: ProductFilter): boolean {
  if (filter.brand?.length && !filter.brand.includes(p.brand)) return false;
  if (filter.category && p.category !== filter.category) return false;
  if (filter.minPrice != null && p.price < filter.minPrice) return false;
  if (filter.maxPrice != null && p.price > filter.maxPrice) return false;
  if (filter.sizes?.length) {
    const hasSize = filter.sizes.some((s) => p.sizes.includes(s));
    if (!hasSize) return false;
  }
  if (filter.colors?.length && p.colors) {
    const hasColor = filter.colors.some((c) => p.colors!.includes(c));
    if (!hasColor) return false;
  }
  if (filter.inStock === true && !p.inStock) return false;
  return true;
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "newest":
      return copy.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "popular":
    default:
      return copy.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

/**
 * Fetch a list of products with optional filter and sort.
 * Simulates network delay and occasional errors.
 */
export async function getProducts(options?: {
  filter?: ProductFilter;
  sort?: SortOption;
  limit?: number;
  offset?: number;
}): Promise<ProductListResult> {
  await delay();
  maybeFail();

  let list = MOCK_PRODUCTS;
  const filter = options?.filter;
  if (filter) {
    list = list.filter((p) => matchesFilter(p, filter));
  }
  const total = list.length;
  const sort = options?.sort ?? "popular";
  list = sortProducts(list, sort);
  const offset = options?.offset ?? 0;
  const limit = options?.limit ?? list.length;
  const products = list.slice(offset, offset + limit);

  return { products, total };
}

/**
 * Fetch a single product by id.
 * Simulates network delay.
 */
export async function getProductById(id: string): Promise<Product | null> {
  await delay();

  return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
}

/**
 * Get unique brands from mock data (e.g. for filter dropdown).
 */
export async function getBrands(): Promise<string[]> {
  await delay(Math.round(DEFAULT_DELAY_MS * 0.5));
  maybeFail();

  const set = new Set(MOCK_PRODUCTS.map((p) => p.brand));
  return Array.from(set).sort();
}

export type ProductFilterOptions = {
  brands: string[];
  sizes: string[];
  colors: string[];
  priceMin: number;
  priceMax: number;
};

/**
 * Get all available filter options derived from product data.
 */
export async function getFilterOptions(): Promise<ProductFilterOptions> {
  await delay(Math.round(DEFAULT_DELAY_MS * 0.5));
  maybeFail();

  const brands = new Set<string>();
  const sizes = new Set<string>();
  const colors = new Set<string>();
  let priceMin = Number.POSITIVE_INFINITY;
  let priceMax = Number.NEGATIVE_INFINITY;

  for (const product of MOCK_PRODUCTS) {
    brands.add(product.brand);
    for (const size of product.sizes) sizes.add(size);
    for (const color of product.colors ?? []) colors.add(color);
    priceMin = Math.min(priceMin, product.price);
    priceMax = Math.max(priceMax, product.price);
  }

  return {
    brands: Array.from(brands).sort(),
    sizes: Array.from(sizes).sort(),
    colors: Array.from(colors).sort(),
    priceMin: Number.isFinite(priceMin) ? priceMin : 0,
    priceMax: Number.isFinite(priceMax) ? priceMax : 0,
  };
}

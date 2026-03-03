import React, { type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductFilter } from "@/components/features/products/product-filter";
import { ProductGrid } from "@/components/features/products/product-grid";
import { HeaderSearchInput } from "@/components/header/header-search-input";
import { useSearch } from "@/hooks/use-search";
import { useCartStore } from "@/stores/use-cart-store";
import { useWishlistStore } from "@/stores/use-wishlist-store";
import type {
  Product,
  ProductFilter as ProductFilterType,
  SortOption,
} from "@/types/product";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={typeof href === "string" ? href : "#"} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

const FLOW_PRODUCTS: Product[] = [
  {
    id: "p-1",
    name: "Alpha Tee",
    brand: "Uniqlo",
    category: "Clothes",
    price: 40,
    images: ["https://example.com/alpha.jpg"],
    sizes: ["S", "M"],
    colors: ["Black", "Blue"],
    isNew: true,
    inStock: true,
    stockQuantity: 10,
    rating: 4.5,
    reviewCount: 12,
  },
  {
    id: "p-2",
    name: "Beta Hoodie",
    brand: "Nike",
    category: "Clothes",
    price: 120,
    images: ["https://example.com/beta.jpg"],
    sizes: ["M", "L"],
    colors: ["Red"],
    isNew: false,
    inStock: true,
    stockQuantity: 7,
    rating: 4.2,
    reviewCount: 8,
  },
  {
    id: "p-3",
    name: "Gamma Jacket",
    brand: "Adidas",
    category: "Clothes",
    price: 80,
    images: ["https://example.com/gamma.jpg"],
    sizes: ["L"],
    colors: ["Green"],
    isNew: false,
    inStock: false,
    stockQuantity: 0,
    rating: 4.0,
    reviewCount: 4,
  },
];

const applyFilters = (products: Product[], filter?: ProductFilterType) => {
  if (!filter) {
    return products;
  }

  return products.filter((product) => {
    if (filter.brand?.length && !filter.brand.includes(product.brand)) {
      return false;
    }
    if (filter.category && product.category !== filter.category) {
      return false;
    }
    if (filter.minPrice != null && product.price < filter.minPrice) {
      return false;
    }
    if (filter.maxPrice != null && product.price > filter.maxPrice) {
      return false;
    }
    if (
      filter.sizes?.length &&
      !filter.sizes.some((size) => product.sizes.includes(size))
    ) {
      return false;
    }
    if (
      filter.colors?.length &&
      !(
        product.colors &&
        filter.colors.some((color) => product.colors!.includes(color))
      )
    ) {
      return false;
    }
    if (
      filter.inStock &&
      !(product.inStock && (product.stockQuantity ?? 0) > 0)
    ) {
      return false;
    }

    return true;
  });
};

const sortProducts = (products: Product[], sort?: SortOption) => {
  const list = [...products];
  switch (sort ?? "popular") {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "newest":
      return list.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
    case "rating":
      return list.sort((a, b) => b.rating - a.rating);
    case "popular":
    default:
      return list.sort((a, b) => b.reviewCount - a.reviewCount);
  }
};

const getProductsMock = vi.fn(
  async (options?: {
    filter?: ProductFilterType;
    sort?: SortOption;
    limit?: number;
    offset?: number;
  }) => {
    const filtered = applyFilters(FLOW_PRODUCTS, options?.filter);
    const sorted = sortProducts(filtered, options?.sort);
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? sorted.length;
    return {
      products: sorted.slice(offset, offset + limit),
      total: filtered.length,
    };
  },
);

const getFilterOptionsMock = vi.fn(async () => ({
  brands: ["Adidas", "Nike", "Uniqlo"],
  categories: ["Clothes"],
  sizes: ["S", "M", "L"],
  colors: ["Black", "Blue", "Green", "Red"],
  priceMin: 0,
  priceMax: 200,
}));

const syncCartOperationMock = vi.fn(async <T,>(payload: T) => payload);

vi.mock("@/lib/services/product-service", () => ({
  getProducts: (...args: Parameters<typeof getProductsMock>) =>
    getProductsMock(...args),
  getFilterOptions: () => getFilterOptionsMock(),
}));

vi.mock("@/lib/services/cart-service", () => ({
  syncCartOperation: (...args: Parameters<typeof syncCartOperationMock>) =>
    syncCartOperationMock(...args),
}));

const SearchControl = ({ testId }: { testId: string }) => {
  const { searchQuery, setSearchQuery } = useSearch();
  return (
    <div data-testid={testId}>
      <HeaderSearchInput
        value={searchQuery}
        onValueChange={(value) => setSearchQuery(value)}
        onSubmit={() => setSearchQuery(searchQuery)}
      />
    </div>
  );
};

const FlowHarness = () => (
  <>
    <SearchControl testId="desktop-search" />
    <SearchControl testId="mobile-search" />
    <div data-testid="desktop-filters">
      <ProductFilter />
    </div>
    <div data-testid="mobile-filters">
      <ProductFilter />
    </div>
    <ProductGrid />
  </>
);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function TestWrapper({ children }: PropsWithChildren) {
    return (
      <NuqsTestingAdapter searchParams="" hasMemory>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NuqsTestingAdapter>
    );
  }

  return TestWrapper;
};

describe("shopping flow integration", () => {
  beforeEach(() => {
    getProductsMock.mockClear();
    getFilterOptionsMock.mockClear();
    syncCartOperationMock.mockClear();

    useCartStore.setState({
      cartsByUser: {},
      guestItems: [],
      hasHydrated: true,
    });
    useWishlistStore.setState({
      wishlistProductIds: [],
      hasHydrated: true,
    });
  });

  it("handles desktop/mobile filters and search, then cart + wishlist actions", async () => {
    const user = userEvent.setup();
    const wrapper = createWrapper();

    render(<FlowHarness />, { wrapper });

    await screen.findByText("Alpha Tee");
    expect(screen.getByText("Beta Hoodie")).toBeTruthy();
    expect(screen.getByText("Gamma Jacket")).toBeTruthy();

    const desktopFilters = screen.getByTestId("desktop-filters");
    const desktopStockToggle = within(desktopFilters).getByRole("button", {
      name: "Toggle in stock only filter",
    });
    await user.click(desktopStockToggle);

    await waitFor(() => {
      expect(screen.queryByText("Gamma Jacket")).toBeNull();
    });

    const mobileFilters = screen.getByTestId("mobile-filters");
    const mobileSizeS = within(mobileFilters).getByRole("button", {
      name: "Toggle S",
    });
    await user.click(mobileSizeS);

    await waitFor(() => {
      expect(screen.queryByText("Beta Hoodie")).toBeNull();
      expect(screen.getByText("Alpha Tee")).toBeTruthy();
    });

    const desktopSearchInput = within(
      screen.getByTestId("desktop-search"),
    ).getByPlaceholderText("What are you looking for?");
    await user.clear(desktopSearchInput);
    await user.type(desktopSearchInput, "Alpha");

    await waitFor(() => {
      expect(screen.getByText("Alpha Tee")).toBeTruthy();
    });

    const mobileSearchInput = within(
      screen.getByTestId("mobile-search"),
    ).getByPlaceholderText("What are you looking for?");
    await user.clear(mobileSearchInput);
    await user.type(mobileSearchInput, "Alpha");

    const addToCartButton = screen.getByRole("button", { name: "Add to cart" });
    await user.click(addToCartButton);

    await waitFor(() => {
      expect(useCartStore.getState().guestItems).toEqual([
        { productId: "p-1", size: "S", quantity: 1 },
      ]);
    });

    const wishlistButton = screen.getByRole("button", {
      name: "Add Alpha Tee to wishlist",
    });
    await user.click(wishlistButton);

    await waitFor(() => {
      expect(useWishlistStore.getState().wishlistProductIds).toEqual(["p-1"]);
    });
  });
});

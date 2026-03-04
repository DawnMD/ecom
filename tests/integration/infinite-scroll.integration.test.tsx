import React, { type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it, vi } from "vitest";
import { ProductGrid } from "@/components/features/products/product-grid";
import type { Product, SortOption } from "@/types/product";

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

const pagedProducts: Product[] = Array.from({ length: 15 }, (_, index) => ({
  id: `page-item-${index + 1}`,
  name: `Page Item ${index + 1}`,
  brand: index % 2 === 0 ? "Nike" : "Adidas",
  category: "Clothes",
  price: 40 + index,
  images: [`https://example.com/page-item-${index + 1}.jpg`],
  sizes: ["M"],
  colors: ["Black"],
  isNew: false,
  inStock: true,
  stockQuantity: 10,
  rating: 4,
  reviewCount: 10 + index,
}));

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
    sort?: SortOption;
    limit?: number;
    offset?: number;
  }) => {
    const sorted = sortProducts(pagedProducts, options?.sort);
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? sorted.length;
    return {
      products: sorted.slice(offset, offset + limit),
      total: sorted.length,
    };
  },
);

vi.mock("@/lib/services/product-service", () => ({
  getProducts: (...args: Parameters<typeof getProductsMock>) =>
    getProductsMock(...args),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function TestWrapper({ children }: PropsWithChildren) {
    return (
      <NuqsTestingAdapter searchParams="">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NuqsTestingAdapter>
    );
  }

  return TestWrapper;
};

describe("infinite scroll integration", () => {
  it("loads next page when sentinel intersects", async () => {
    const originalIntersectionObserver = globalThis.IntersectionObserver;
    let observerCallback: ((entries: IntersectionObserverEntry[]) => void) | null = null;

    class MockIntersectionObserver {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        observerCallback = callback;
      }

      observe() {}

      unobserve() {}

      disconnect() {}
    }

    globalThis.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;

    try {
      const wrapper = createWrapper();
      render(<ProductGrid />, { wrapper });

      await screen.findByText("Page Item 15");
      expect(screen.getByText("Page Item 4")).toBeTruthy();
      expect(screen.queryByText("Page Item 3")).toBeNull();

      expect(observerCallback).toBeTruthy();
      await act(async () => {
        observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry]);
      });

      await waitFor(() => {
        expect(screen.getByText("Page Item 3")).toBeTruthy();
      });
      expect(getProductsMock).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 12,
          offset: 12,
        }),
      );
    } finally {
      globalThis.IntersectionObserver = originalIntersectionObserver;
    }
  });
});

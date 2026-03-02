"use client";

import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePopularity } from "@/hooks/use-popularity";
import { useProductFiltersQueryState } from "@/hooks/use-product-query-states";
import { useSearch } from "@/hooks/use-search";
import { useViewMode } from "@/hooks/use-view-mode";
import { getProducts } from "@/lib/services/product-service";
import type { Product } from "@/types/product";

const formatPrice = (price: number) => `SAR ${price.toFixed(2)}`;

const ProductCard = ({ product, isListView }: { product: Product; isListView: boolean }) => {
  const hasLowStock = (product.stockQuantity ?? 0) > 0;

  return (
    <article className={isListView ? "flex gap-4" : "flex flex-col"}>
      <div
        className={
          isListView
            ? "relative w-36 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-44"
            : "relative overflow-hidden rounded-xl bg-muted"
        }
      >
        <div className="aspect-4/5">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes={isListView ? "(max-width: 640px) 144px, 176px" : "(max-width: 1024px) 50vw, 33vw"}
            className="object-cover"
          />
        </div>
        {product.isNew ? (
          <span className="absolute left-2 top-2 rounded-md bg-cyan-400 px-2 py-1 text-[10px] leading-none font-semibold text-white">
            New Arrival
          </span>
        ) : null}
      </div>

      <div className="relative mt-2 flex-1 pr-8">
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <h3 className="mt-0.5 text-[1.65rem] leading-[1.15] font-semibold tracking-tight sm:text-3xl">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-[1.65rem] leading-none font-semibold text-blue-500 sm:text-3xl">
            {formatPrice(product.price)}
          </p>
          {hasLowStock ? (
            <p className="text-sm font-medium text-red-400">{product.stockQuantity} items left!</p>
          ) : null}
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          aria-label={`Add ${product.name} to wishlist`}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
};

const ProductCardSkeleton = ({ isListView }: { isListView: boolean }) => (
  <div className={isListView ? "flex gap-4" : "flex flex-col"}>
    <Skeleton className={isListView ? "aspect-4/5 w-36 rounded-xl sm:w-44" : "aspect-4/5 rounded-xl"} />
    <div className="mt-2 flex-1 space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-7 w-3/4" />
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  </div>
);

export const ProductGrid = () => {
  const [filters] = useProductFiltersQueryState();
  const { sortOption } = usePopularity();
  const { viewMode, isListView } = useViewMode();
  const { searchQuery } = useSearch();

  const { data, isPending, isError } = useQuery({
    queryKey: ["products", filters, sortOption],
    queryFn: () =>
      getProducts({
        filter: {
          brand: filters.brand && filters.brand.length ? filters.brand : undefined,
          minPrice: filters.minPrice,
          maxPrice: Number.isFinite(filters.maxPrice) ? filters.maxPrice : undefined,
          sizes: filters.size && filters.size.length ? filters.size : undefined,
          colors: filters.color && filters.color.length ? filters.color : undefined,
        },
        sort: sortOption,
      }),
  });

  const products = useMemo(() => {
    const list = data?.products ?? [];
    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (!normalizedSearch) return list;

    return list.filter((product) => product.name.toLowerCase().includes(normalizedSearch));
  }, [data?.products, searchQuery]);

  if (isError) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        Failed to load products. Please try again.
      </div>
    );
  }

  if (isPending) {
    return (
      <div
        className={
          isListView
            ? "grid grid-cols-1 gap-6"
            : "grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-7"
        }
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={`product-skeleton-${viewMode}-${index}`} isListView={isListView} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        No products found for the selected filters.
      </div>
    );
  }

  return (
    <div
      className={
        isListView
          ? "grid grid-cols-1 gap-6"
          : "grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-7"
      }
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} isListView={isListView} />
      ))}
    </div>
  );
};

"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineQueryFeedback } from "@/components/ui/inline-query-feedback";
import { useProducts } from "@/hooks/use-products";
import { useViewMode } from "@/hooks/use-view-mode";
import { useWishlistStore } from "@/stores/use-wishlist-store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const formatPrice = (price: number) => `SAR ${price.toFixed(2)}`;

const ProductCard = ({ product, isListView }: { product: Product; isListView: boolean }) => {
  const hasLowStock = (product.stockQuantity ?? 0) > 0;
  const wishlistProductIds = useWishlistStore((state) => state.wishlistProductIds);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const hasHydrated = useWishlistStore((state) => state.hasHydrated);
  const isWishlisted = wishlistProductIds.includes(product.id);

  return (
    <article className={isListView ? "flex gap-4" : "flex flex-col"}>
      <div
        className={
          isListView
            ? "relative w-36 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-44"
            : "relative overflow-hidden rounded-xl bg-muted"
        }
      >
        <Link
          href={`/products/${product.id}`}
          aria-label={`View details for ${product.name}`}
          className="block"
        >
          <div className="relative aspect-4/5">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes={
                isListView ? "(max-width: 640px) 144px, 176px" : "(max-width: 1024px) 50vw, 33vw"
              }
              className="object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
          </div>
        </Link>
        {product.isNew ? (
          <span className="absolute left-2 top-2 rounded-md bg-cyan-400 px-2 py-1 text-[10px] leading-none font-semibold text-white">
            New Arrival
          </span>
        ) : null}
      </div>

      <div className="relative mt-2 flex-1 pr-8">
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <h3 className="mt-0.5 text-[1.65rem] leading-[1.15] font-semibold tracking-tight sm:text-3xl">
          <Link href={`/products/${product.id}`} className="transition-colors hover:text-blue-600">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-[1.65rem] leading-none font-semibold text-blue-500 sm:text-3xl">
            {formatPrice(product.price)}
          </p>
          {hasLowStock ? (
            <p className="text-sm font-medium text-red-400">{product.stockQuantity} items left!</p>
          ) : null}
        </div>
        {hasHydrated ? (
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "absolute right-0 top-0 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground",
              isWishlisted && "text-red-500 hover:text-red-600",
            )}
            aria-label={`${isWishlisted ? "Remove" : "Add"} ${product.name} ${
              isWishlisted ? "from" : "to"
            } wishlist`}
            aria-pressed={isWishlisted}
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
          </Button>
        ) : (
          <Skeleton className="absolute right-0 top-0 h-7 w-7 rounded-full" />
        )}
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
  const { viewMode, isListView } = useViewMode();
  const { products, isPending, isError, refetch } = useProducts();

  if (isError) {
    return (
      <InlineQueryFeedback
        className="p-8 text-center"
        message="Failed to load products. Please try again."
        retryLabel="Retry products"
        onRetry={() => void refetch()}
      />
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

"use client";

import { useQuery } from "@tanstack/react-query";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductFiltersQueryState } from "@/hooks/use-product-query-states";
import { useWishlistStore } from "@/stores/use-wishlist-store";
import { cn } from "@/lib/utils";
import { getProductById } from "@/lib/services/product-service";

const colorMap: Record<string, string> = {
  Black: "#111111",
  Red: "#d0312d",
  Blue: "#1d4ed8",
  Green: "#15803d",
  Yellow: "#facc15",
  Orange: "#f97316",
  Purple: "#8b5cf6",
  Pink: "#ec4899",
  White: "#ffffff",
  Navy: "#1e3a8a",
  Grey: "#6b7280",
};

const formatPrice = (price: number) =>
  `SAR ${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

type ProductCommerceDetailsProps = {
  productId: string;
  fallbackPrice: number;
  fallbackOriginalPrice?: number;
  fallbackRating: number;
  fallbackReviewCount: number;
  fallbackColors: string[];
  fallbackSizes: string[];
  fallbackInStock: boolean;
  fallbackStockQuantity?: number;
};

export function ProductCommerceDetails({
  productId,
  fallbackPrice,
  fallbackOriginalPrice,
  fallbackRating,
  fallbackReviewCount,
  fallbackColors,
  fallbackSizes,
  fallbackInStock,
  fallbackStockQuantity,
}: ProductCommerceDetailsProps) {
  const [filters, setFilters] = useProductFiltersQueryState();
  const wishlistProductIds = useWishlistStore((state) => state.wishlistProductIds);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const hasWishlistHydrated = useWishlistStore((state) => state.hasHydrated);
  const query = useQuery({
    queryKey: ["product-commerce", productId],
    queryFn: () => getProductById(productId),
    refetchInterval: 30_000,
    retry: 1,
  });

  if (query.isPending) {
    return (
      <>
        <div className="mt-4 flex items-center gap-3 text-sm">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="mt-6 py-5 space-y-2">
          <Skeleton className="h-11 w-52 lg:h-14 lg:w-64" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="mt-5 space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-12 rounded-xl" />
              <Skeleton className="h-8 w-12 rounded-xl" />
              <Skeleton className="h-8 w-12 rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>
      </>
    );
  }

  const product = query.data;
  const isWishlisted = wishlistProductIds.includes(productId);
  const rating = product?.rating ?? fallbackRating;
  const reviewCount = product?.reviewCount ?? fallbackReviewCount;
  const price = product?.price ?? fallbackPrice;
  const originalPrice = product?.originalPrice ?? fallbackOriginalPrice;
  const colors = product?.colors ?? fallbackColors;
  const sizes = product?.sizes ?? fallbackSizes;
  const selectedColor = filters.color?.find((value) => colors.includes(value));
  const selectedSize = filters.size?.find((value) => sizes.includes(value));
  const inStock = product?.inStock ?? fallbackInStock;
  const stockQuantity = product?.stockQuantity ?? fallbackStockQuantity ?? 0;
  const stockLabel = inStock && stockQuantity > 0 ? `${stockQuantity} left in stock` : "Out of stock";

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <Card size="sm" className="inline-flex items-center gap-1 rounded-full px-3 py-1 flex-row">
          <Star className="h-3.5 w-3.5" />
          {rating.toFixed(1)}
        </Card>
        <div className="ml-auto flex items-center gap-3">
          <span>{reviewCount} verified reviews</span>
          {hasWishlistHydrated ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className={cn(
                "h-8 w-8 rounded-full text-muted-foreground hover:text-foreground",
                isWishlisted && "text-red-500 hover:text-red-600",
              )}
              aria-label={`${isWishlisted ? "Remove from" : "Add to"} wishlist`}
              aria-pressed={isWishlisted}
              onClick={() => toggleWishlist(productId)}
            >
              <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
            </Button>
          ) : (
            <Skeleton className="h-8 w-8 rounded-full" />
          )}
        </div>
      </div>

      <div className="mt-6 py-5">
        <p className="text-4xl leading-none font-bold tracking-tight lg:text-5xl">
          {formatPrice(price)}
        </p>
        {originalPrice ? <p className="mt-2 text-sm line-through">{formatPrice(originalPrice)}</p> : null}
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em]">Colorway</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button key={color} type="button" onClick={() => setFilters({ color: [color] })}>
                <Card
                  size="sm"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-colors",
                    selectedColor === color ? "bg-primary text-primary-foreground" : "hover:bg-muted/70",
                  )}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: colorMap[color] ?? "#a1a1aa" }}
                  />
                  {color}
                </Card>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em]">Available Sizes</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button key={size} type="button" onClick={() => setFilters({ size: [size] })}>
                <Card
                  size="sm"
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
                    selectedSize === size ? "bg-primary text-primary-foreground" : "hover:bg-muted/70",
                  )}
                >
                  {size}
                </Card>
              </button>
            ))}
          </div>
        </div>

        <Card size="sm" className="rounded-2xl p-3 text-sm">
          <strong>Stock status:</strong> {stockLabel}
        </Card>
      </div>
    </>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  const rating = product?.rating ?? fallbackRating;
  const reviewCount = product?.reviewCount ?? fallbackReviewCount;
  const price = product?.price ?? fallbackPrice;
  const originalPrice = product?.originalPrice ?? fallbackOriginalPrice;
  const colors = product?.colors ?? fallbackColors;
  const sizes = product?.sizes ?? fallbackSizes;
  const inStock = product?.inStock ?? fallbackInStock;
  const stockQuantity = product?.stockQuantity ?? fallbackStockQuantity ?? 0;
  const stockLabel = inStock && stockQuantity > 0 ? `${stockQuantity} left in stock` : "Out of stock";

  return (
    <>
      <div className="mt-4 flex items-center gap-3 text-sm">
        <Card size="sm" className="inline-flex items-center gap-1 rounded-full px-3 py-1 flex-row">
          <Star className="h-3.5 w-3.5" />
          {rating.toFixed(1)}
        </Card>
        <span>{reviewCount} verified reviews</span>
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
              <Card
                key={color}
                size="sm"
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: colorMap[color] ?? "#a1a1aa" }}
                />
                {color}
              </Card>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em]">Available Sizes</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Card key={size} size="sm" className="rounded-xl px-3 py-1.5 text-sm font-medium">
                {size}
              </Card>
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

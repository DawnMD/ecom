"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductById } from "@/lib/services/product-service";

const formatPrice = (price: number) => `SAR ${price.toFixed(2)}`;

export const SuggestedItemPrice = ({
  productId,
  fallbackPrice,
}: {
  productId: string;
  fallbackPrice: number;
}) => {
  const query = useQuery({
    queryKey: ["suggested-item-price", productId],
    queryFn: () => getProductById(productId),
    refetchInterval: 30_000,
    retry: 1,
  });

  if (query.isPending) {
    return <Skeleton className="h-4 w-20" />;
  }

  const price = query.data?.price ?? fallbackPrice;
  return <p className="text-sm">{formatPrice(price)}</p>;
};

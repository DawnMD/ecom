"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/use-products";

export const ProductResultsCount = () => {
  const { totalCount, isPending } = useProducts();

  if (isPending) {
    return <Skeleton className="h-8 w-52" />;
  }

  return (
    <p className="text-2xl font-bold">
      {totalCount} {totalCount === 1 ? "product" : "products"} found
    </p>
  );
};

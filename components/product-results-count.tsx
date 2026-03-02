"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePopularity } from "@/hooks/use-popularity";
import { useProductFiltersQueryState } from "@/hooks/use-product-query-states";
import { useSearch } from "@/hooks/use-search";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/lib/services/product-service";

export const ProductResultsCount = () => {
  const [filters] = useProductFiltersQueryState();
  const { sortOption } = usePopularity();
  const { searchQuery } = useSearch();

  const { data, isPending } = useQuery({
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

  const count = useMemo(() => {
    const list = data?.products ?? [];
    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (!normalizedSearch) return list.length;

    return list.filter((product) => product.name.toLowerCase().includes(normalizedSearch)).length;
  }, [data?.products, searchQuery]);

  if (isPending) {
    return <Skeleton className="h-8 w-52" />;
  }

  return (
    <p className="text-2xl font-bold">
      {count} {count === 1 ? "product" : "products"} found
    </p>
  );
};

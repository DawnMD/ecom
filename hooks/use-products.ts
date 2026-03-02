"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePopularity } from "@/hooks/use-popularity";
import { useProductFiltersQueryState } from "@/hooks/use-product-query-states";
import { useSearch } from "@/hooks/use-search";
import { getProducts } from "@/lib/services/product-service";

export const useProducts = () => {
  const [filters] = useProductFiltersQueryState();
  const { sortOption } = usePopularity();
  const { searchQuery } = useSearch();

  const query = useQuery({
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
    const list = query.data?.products ?? [];
    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (!normalizedSearch) return list;

    return list.filter((product) => product.name.toLowerCase().includes(normalizedSearch));
  }, [query.data?.products, searchQuery]);

  return {
    products,
    productsCount: products.length,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
  };
};

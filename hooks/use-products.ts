"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePopularity } from "@/hooks/use-popularity";
import { useProductFiltersQueryState } from "@/hooks/use-product-query-states";
import { useSearch } from "@/hooks/use-search";
import { getProducts } from "@/lib/services/product-service";

const PAGE_SIZE = 12;

export const useProducts = () => {
  const [filters] = useProductFiltersQueryState();
  const { sortOption } = usePopularity();
  const { searchQuery } = useSearch();
  const normalizedSearch = searchQuery.trim();

  const query = useInfiniteQuery({
    queryKey: ["products", filters, sortOption, normalizedSearch, PAGE_SIZE],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getProducts({
        filter: {
          brand: filters.brand && filters.brand.length ? filters.brand : undefined,
          category: filters.category ?? undefined,
          minPrice: filters.minPrice,
          maxPrice: Number.isFinite(filters.maxPrice) ? filters.maxPrice : undefined,
          sizes: filters.size && filters.size.length ? filters.size : undefined,
          colors: filters.color && filters.color.length ? filters.color : undefined,
          inStock: filters.inStock === "true" ? true : undefined,
        },
        sort: sortOption,
        search: normalizedSearch,
        offset: pageParam,
        limit: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((count, currentPage) => count + currentPage.products.length, 0);
      if (loaded >= lastPage.total) {
        return undefined;
      }
      return loaded;
    },
  });

  const products = useMemo(() => {
    const pages = query.data?.pages ?? [];
    return pages.flatMap((pageResult) => pageResult.products);
  }, [query.data?.pages]);
  const totalCount = query.data?.pages[0]?.total ?? 0;

  return {
    products,
    productsCount: products.length,
    totalCount,
    isPending: query.isPending,
    isError: query.isError,
    isFetchNextPageError: query.isFetchNextPageError,
    error: query.error,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    pageSize: PAGE_SIZE,
  };
};

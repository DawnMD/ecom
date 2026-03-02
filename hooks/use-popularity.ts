"use client";

import { useSortQueryState } from "@/hooks/use-product-query-states";

export const usePopularity = () => {
  const [sortOption, setSortOption] = useSortQueryState();

  return {
    sortOption,
    isPopularitySort: sortOption === "popular",
    setSortOption,
    setPopularitySort: () => setSortOption("popular"),
  };
};

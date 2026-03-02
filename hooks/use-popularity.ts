"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";
import { type SortOption } from "@/types/product";

const SORT_OPTIONS = [
  "popular",
  "price-asc",
  "price-desc",
  "newest",
  // "rating",
] as const;

const DEFAULT_SORT_OPTION: SortOption = "popular";

export const usePopularity = () => {
  const [sortOption, setSortOption] = useQueryState(
    "sort",
    parseAsStringLiteral(SORT_OPTIONS).withDefault(DEFAULT_SORT_OPTION).withOptions({
      history: "replace",
    }),
  );

  return {
    sortOption,
    isPopularitySort: sortOption === "popular",
    setSortOption,
    setPopularitySort: () => setSortOption("popular"),
  };
};

"use client";

import { useSearchQueryState } from "@/hooks/use-product-query-states";

const DEFAULT_SEARCH_QUERY = "";

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useSearchQueryState();

  return {
    searchQuery,
    setSearchQuery,
    clearSearchQuery: () => setSearchQuery(DEFAULT_SEARCH_QUERY),
  };
};

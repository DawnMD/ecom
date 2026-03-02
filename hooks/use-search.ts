"use client";

import { parseAsString, useQueryState } from "nuqs";

const DEFAULT_SEARCH_QUERY = "";

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault(DEFAULT_SEARCH_QUERY).withOptions({
      history: "replace",
    }),
  );

  return {
    searchQuery,
    setSearchQuery,
    clearSearchQuery: () => setSearchQuery(DEFAULT_SEARCH_QUERY),
  };
};

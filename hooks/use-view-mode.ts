"use client";

import { useViewModeQueryState } from "@/hooks/use-product-query-states";
export type { ViewMode } from "@/hooks/use-product-query-states";

export const useViewMode = () => {
  const [viewMode, setViewMode] = useViewModeQueryState();

  return {
    viewMode,
    isListView: viewMode === "list",
    isGridView: viewMode === "grid",
    setViewMode,
    setListView: () => setViewMode("list"),
    setGridView: () => setViewMode("grid"),
  };
};

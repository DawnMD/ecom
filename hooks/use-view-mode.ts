"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";

const VIEW_MODES = ["list", "grid"] as const;
const DEFAULT_VIEW_MODE = "grid";

export type ViewMode = (typeof VIEW_MODES)[number];

export const useViewMode = () => {
  const [viewMode, setViewMode] = useQueryState(
    "view",
    parseAsStringLiteral(VIEW_MODES).withDefault(DEFAULT_VIEW_MODE).withOptions({
      history: "replace",
    }),
  );

  return {
    viewMode,
    isListView: viewMode === "list",
    isGridView: viewMode === "grid",
    setViewMode,
    setListView: () => setViewMode("list"),
    setGridView: () => setViewMode("grid"),
  };
};

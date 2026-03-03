"use client";

import {
  parseAsInteger,
  parseAsNativeArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { type SortOption } from "@/types/product";

const URL_HISTORY_OPTIONS = {
  history: "replace",
} as const;

const FILTER_QUERY_OPTIONS = {
  ...URL_HISTORY_OPTIONS,
  shallow: false,
} as const;

const SEARCH_DEFAULT_VALUE = "";
const VIEW_MODE_OPTIONS = ["list", "grid"] as const;
const VIEW_MODE_DEFAULT = "grid";
const SORT_OPTIONS = ["popular", "price-asc", "price-desc", "newest"] as const;
const SORT_DEFAULT_VALUE: SortOption = "popular";

const FILTER_QUERY_PARSERS = {
  brand: parseAsNativeArrayOf(parseAsString),
  category: parseAsString,
  minPrice: parseAsInteger.withDefault(0),
  maxPrice: parseAsInteger.withDefault(Number.MAX_SAFE_INTEGER),
  size: parseAsNativeArrayOf(parseAsString),
  color: parseAsNativeArrayOf(parseAsString),
  inStock: parseAsStringLiteral(["true"]),
};

const CART_INTENT_QUERY_PARSERS = {
  intent: parseAsString,
  cartProductId: parseAsString,
  cartSize: parseAsString,
  cartQuantity: parseAsInteger,
};

export type ViewMode = (typeof VIEW_MODE_OPTIONS)[number];

export const useSearchQueryState = () =>
  useQueryState(
    "search",
    parseAsString.withDefault(SEARCH_DEFAULT_VALUE).withOptions(URL_HISTORY_OPTIONS),
  );

export const useSortQueryState = () =>
  useQueryState(
    "sort",
    parseAsStringLiteral(SORT_OPTIONS).withDefault(SORT_DEFAULT_VALUE).withOptions(URL_HISTORY_OPTIONS),
  );

export const useViewModeQueryState = () =>
  useQueryState(
    "view",
    parseAsStringLiteral(VIEW_MODE_OPTIONS).withDefault(VIEW_MODE_DEFAULT).withOptions(URL_HISTORY_OPTIONS),
  );

export const useProductFiltersQueryState = () =>
  useQueryStates(FILTER_QUERY_PARSERS, FILTER_QUERY_OPTIONS);

export const useCartIntentQueryState = () =>
  useQueryStates(CART_INTENT_QUERY_PARSERS, FILTER_QUERY_OPTIONS);

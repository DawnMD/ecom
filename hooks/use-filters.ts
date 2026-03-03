"use client";

import { useQuery } from "@tanstack/react-query";
import { debounce } from "nuqs";
import { type StaticMultiselectOption } from "@/components/ui/static-multiselect";
import { useProductFiltersQueryState } from "@/hooks/use-product-query-states";
import { getFilterOptions, type ProductFilterOptions } from "@/lib/services/product-service";

const FALLBACK_PRICE_MIN = 0;
const FALLBACK_PRICE_MAX = 100;
const PRICE_SLIDER_DEBOUNCE_MS = 300;

const FALLBACK_FILTER_OPTIONS: ProductFilterOptions = {
  brands: [],
  sizes: [],
  colors: [],
  priceMin: FALLBACK_PRICE_MIN,
  priceMax: FALLBACK_PRICE_MAX,
};

export const useFilters = () => {
  const [filters, setFilters] = useProductFiltersQueryState();

  const { data: filterOptions, isPending: isLoadingFilters } = useQuery({
    queryKey: ["filters", "options"],
    queryFn: getFilterOptions,
    retry: 1,
    staleTime: 5 * 60_000,
  });

  const resolvedFilterOptions = filterOptions ?? FALLBACK_FILTER_OPTIONS;
  const { priceMin, priceMax } = resolvedFilterOptions;
  const clampPrice = (value: number) => Math.max(priceMin, Math.min(priceMax, value));

  const brandOptions: StaticMultiselectOption[] = resolvedFilterOptions.brands.map((brand) => ({
    label: brand,
    value: brand,
  }));

  const selectedMinPrice = clampPrice(filters.minPrice);
  const selectedMaxPrice = Math.max(selectedMinPrice, clampPrice(filters.maxPrice));

  const handlePriceRangeChange = (value: number | readonly number[]) => {
    const range = Array.isArray(value) ? value : [selectedMinPrice, value];
    const [min = selectedMinPrice, max = selectedMaxPrice] = range;
    const clampedMin = clampPrice(min);
    const clampedMax = Math.max(clampedMin, clampPrice(max));

    setFilters(
      {
        minPrice: clampedMin,
        maxPrice: clampedMax,
      },
      {
        limitUrlUpdates: debounce(PRICE_SLIDER_DEBOUNCE_MS),
      },
    );
  };

  const handleMinPriceChange = (nextValue: string) => {
    const parsed = Number.parseInt(nextValue, 10);
    const nextMin = Number.isNaN(parsed) ? priceMin : clampPrice(parsed);
    const nextMax = Math.max(nextMin, selectedMaxPrice);

    setFilters({
      minPrice: nextMin,
      maxPrice: nextMax,
    });
  };

  const handleMaxPriceChange = (nextValue: string) => {
    const parsed = Number.parseInt(nextValue, 10);
    const nextMax = Number.isNaN(parsed) ? priceMax : clampPrice(parsed);
    const boundedMax = Math.max(selectedMinPrice, nextMax);

    setFilters({
      minPrice: selectedMinPrice,
      maxPrice: boundedMax,
    });
  };

  return {
    filters,
    brandOptions,
    sizeOptions: resolvedFilterOptions.sizes,
    colorOptions: resolvedFilterOptions.colors,
    isLoadingFilters,
    selectedMinPrice,
    selectedMaxPrice,
    priceMin,
    priceMax,
    handlePriceRangeChange,
    handleMinPriceChange,
    handleMaxPriceChange,
    setBrandFilter: (values: string[]) => setFilters({ brand: values }),
    setSizeFilter: (values: string[]) => setFilters({ size: values }),
    setColorFilter: (values: string[]) => setFilters({ color: values }),
  };
};

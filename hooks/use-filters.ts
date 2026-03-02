"use client";

import { useQuery } from "@tanstack/react-query";
import { debounce } from "nuqs";
import { type StaticMultiselectOption } from "@/components/ui/static-multiselect";
import { useProductFiltersQueryState } from "@/hooks/use-product-query-states";
import { MOCK_PRODUCTS } from "@/lib/data/mock-products";
import { getFilterOptions } from "@/lib/services/product-service";

const FALLBACK_PRICE_MIN = 0;
const FALLBACK_PRICE_MAX = 100;
const PRICE_SLIDER_DEBOUNCE_MS = 300;

const getFallbackFilterOptions = () => {
  const brands = new Set<string>();
  const sizes = new Set<string>();
  const colors = new Set<string>();
  let priceMin = Number.POSITIVE_INFINITY;
  let priceMax = Number.NEGATIVE_INFINITY;

  for (const product of MOCK_PRODUCTS) {
    brands.add(product.brand);
    for (const size of product.sizes) sizes.add(size);
    for (const color of product.colors ?? []) colors.add(color);
    priceMin = Math.min(priceMin, product.price);
    priceMax = Math.max(priceMax, product.price);
  }

  return {
    brands: Array.from(brands).sort(),
    sizes: Array.from(sizes).sort(),
    colors: Array.from(colors).sort(),
    priceMin: Number.isFinite(priceMin) ? priceMin : FALLBACK_PRICE_MIN,
    priceMax: Number.isFinite(priceMax) ? priceMax : FALLBACK_PRICE_MAX,
  };
};

export const useFilters = () => {
  const [filters, setFilters] = useProductFiltersQueryState();

  const { data: filterOptions, isPending: isLoadingFilters } = useQuery({
    queryKey: ["filters", "options"],
    queryFn: async () => {
      try {
        return await getFilterOptions();
      } catch {
        return getFallbackFilterOptions();
      }
    },
    staleTime: 5 * 60_000,
  });

  const resolvedFilterOptions = filterOptions ?? getFallbackFilterOptions();
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

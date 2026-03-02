"use client";

import { useEffect, useState } from "react";
import {
  debounce,
  parseAsInteger,
  parseAsNativeArrayOf,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { type StaticMultiselectOption } from "@/components/ui/static-multiselect";

const MOCK_BRAND_OPTIONS: StaticMultiselectOption[] = [
  { label: "Nike", value: "nike" },
  { label: "Adidas", value: "adidas" },
  { label: "Puma", value: "puma" },
  { label: "Under Armour", value: "under-armour" },
  { label: "New Balance", value: "new-balance" },
  { label: "Converse", value: "converse" },
  { label: "Vans", value: "vans" },
  { label: "Reebok", value: "reebok" },
  { label: "Skechers", value: "skechers" },
];

const PRICE_MIN = 0;
const PRICE_MAX = 100;
const PRICE_SLIDER_DEBOUNCE_MS = 300;

const clampPrice = (value: number) => Math.max(PRICE_MIN, Math.min(PRICE_MAX, value));

export const useFilters = () => {
  const [filters, setFilters] = useQueryStates(
    {
      brand: parseAsNativeArrayOf(parseAsString),
      minPrice: parseAsInteger.withDefault(PRICE_MIN),
      maxPrice: parseAsInteger.withDefault(PRICE_MAX),
      size: parseAsNativeArrayOf(parseAsString),
      color: parseAsNativeArrayOf(parseAsString),
    },
    {
      history: "replace",
      shallow: false,
    },
  );

  const [brandOptions, setBrandOptions] = useState<StaticMultiselectOption[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBrandOptions(MOCK_BRAND_OPTIONS);
      setIsLoadingFilters(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

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
    const nextMin = Number.isNaN(parsed) ? PRICE_MIN : clampPrice(parsed);
    const nextMax = Math.max(nextMin, selectedMaxPrice);

    setFilters({
      minPrice: nextMin,
      maxPrice: nextMax,
    });
  };

  const handleMaxPriceChange = (nextValue: string) => {
    const parsed = Number.parseInt(nextValue, 10);
    const nextMax = Number.isNaN(parsed) ? PRICE_MAX : clampPrice(parsed);
    const boundedMax = Math.max(selectedMinPrice, nextMax);

    setFilters({
      minPrice: selectedMinPrice,
      maxPrice: boundedMax,
    });
  };

  return {
    filters,
    brandOptions,
    isLoadingFilters,
    selectedMinPrice,
    selectedMaxPrice,
    priceMin: PRICE_MIN,
    priceMax: PRICE_MAX,
    handlePriceRangeChange,
    handleMinPriceChange,
    handleMaxPriceChange,
    setBrandFilter: (values: string[]) => setFilters({ brand: values }),
    setSizeFilter: (values: string[]) => setFilters({ size: values }),
    setColorFilter: (values: string[]) => setFilters({ color: values }),
  };
};

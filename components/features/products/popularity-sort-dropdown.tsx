"use client";

import type { SortOption } from "@/types/product";
import { usePopularity } from "@/hooks/use-popularity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EnabledSortOption = Exclude<SortOption, "rating">;

const SORT_LABELS: Record<EnabledSortOption, string> = {
  popular: "Most Popular",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  newest: "Newest",
};

const SORT_OPTIONS: EnabledSortOption[] = [
  "popular",
  "price-asc",
  "price-desc",
  "newest",
];

const isEnabledSortOption = (value: string): value is EnabledSortOption =>
  SORT_OPTIONS.includes(value as EnabledSortOption);

export const PopularitySortDropdown = () => {
  const { sortOption, setSortOption } = usePopularity();
  const selectedSortLabel = isEnabledSortOption(sortOption)
    ? SORT_LABELS[sortOption]
    : "Select sorting option";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by</span>
      <Select
        value={sortOption}
        onValueChange={(value) => {
          if (value && isEnabledSortOption(value)) {
            setSortOption(value);
          }
        }}
      >
        <SelectTrigger className="h-9 min-w-48 rounded-md border">
          <SelectValue placeholder="Select sorting option">
            {selectedSortLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {SORT_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

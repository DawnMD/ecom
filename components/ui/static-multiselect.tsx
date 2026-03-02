"use client";

import { Check, ChevronDown, X } from "lucide-react";
import type * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { cn } from "@/lib/utils";

export type StaticMultiselectOption = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

type StaticMultiselectContextValue = {
  value: string[];
  selectedSet: Set<string>;
  query: string;
  setQuery: (value: string) => void;
  toggleValue: (value: string) => void;
};

const StaticMultiselectContext =
  createContext<StaticMultiselectContextValue | null>(null);

function useStaticMultiselectContext() {
  const context = useContext(StaticMultiselectContext);
  if (!context) {
    throw new Error(
      "StaticMultiselect primitives must be used inside StaticMultiselect.",
    );
  }
  return context;
}

type StaticMultiselectProps = {
  value: string[];
  onValueChange: (value: string[]) => void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  children: React.ReactNode;
  className?: string;
};

export function StaticMultiselect({
  value,
  onValueChange,
  query: queryProp,
  defaultQuery = "",
  onQueryChange,
  children,
  className,
}: StaticMultiselectProps) {
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const query = queryProp ?? internalQuery;

  const selectedSet = useMemo(() => new Set(value), [value]);

  const toggleValue = useCallback(
    (itemValue: string) => {
      if (selectedSet.has(itemValue)) {
        onValueChange(value.filter((selected) => selected !== itemValue));
        return;
      }
      onValueChange([...value, itemValue]);
    },
    [onValueChange, selectedSet, value],
  );

  const setQuery = useCallback(
    (nextQuery: string) => {
      if (queryProp === undefined) {
        setInternalQuery(nextQuery);
      }
      onQueryChange?.(nextQuery);
    },
    [onQueryChange, queryProp],
  );

  const contextValue = useMemo(
    () => ({
      value,
      selectedSet,
      query,
      setQuery,
      toggleValue,
    }),
    [query, selectedSet, setQuery, toggleValue, value],
  );

  return (
    <StaticMultiselectContext.Provider value={contextValue}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </StaticMultiselectContext.Provider>
  );
}

function StaticMultiselectControl({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-md border border-input bg-transparent px-3 py-2",
        className,
      )}
      {...props}
    />
  );
}

function StaticMultiselectSelectedBadges({
  options,
  className,
}: {
  options: StaticMultiselectOption[];
  className?: string;
}) {
  const { value, toggleValue } = useStaticMultiselectContext();
  const optionsByValue = useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options],
  );

  const selectedOptions = useMemo(
    () =>
      value
        .map((selectedValue) => optionsByValue.get(selectedValue))
        .filter((option): option is StaticMultiselectOption => Boolean(option)),
    [optionsByValue, value],
  );

  if (selectedOptions.length === 0) return null;

  return (
    <div className={cn("mb-2 flex flex-wrap gap-1.5", className)}>
      {selectedOptions.map((option) => (
        <span
          key={option.value}
          className="inline-flex items-center gap-1 rounded-sm bg-secondary px-2 py-0.5 text-[13px] text-secondary-foreground"
        >
          {option.label}
          <button
            type="button"
            className="rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
            onClick={() => toggleValue(option.value)}
            aria-label={`Remove ${option.label}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
    </div>
  );
}

type StaticMultiselectInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> & {
  hidePlaceholderWhenSelected?: boolean;
};

function StaticMultiselectInput({
  className,
  placeholder = "Search...",
  hidePlaceholderWhenSelected = true,
  ...props
}: StaticMultiselectInputProps) {
  const { query, setQuery, value } = useStaticMultiselectContext();

  const inputPlaceholder =
    hidePlaceholderWhenSelected && value.length > 0 ? "" : placeholder;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    [setQuery],
  );

  return (
    <div className="flex items-center gap-2">
      <input
        value={query}
        onChange={handleChange}
        placeholder={inputPlaceholder}
        className={cn(
          "h-6 w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none",
          className,
        )}
        {...props}
      />
      <ChevronDown className="size-4 text-muted-foreground" />
    </div>
  );
}

function StaticMultiselectList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-h-52 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground",
        className,
      )}
      {...props}
    />
  );
}

function StaticMultiselectItem({
  value,
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  value: string;
  icon?: React.ReactNode;
}) {
  const { selectedSet, toggleValue } = useStaticMultiselectContext();
  const isSelected = selectedSet.has(value);

  return (
    <button
      type="button"
      onClick={() => toggleValue(value)}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2">
        {icon ? <span className="shrink-0">{icon}</span> : null}
        <span className="truncate">{children}</span>
      </span>
      <span className="inline-flex size-4 items-center justify-center">
        {isSelected ? <Check className="size-4" /> : null}
      </span>
    </button>
  );
}

function StaticMultiselectLoading({
  className,
  children = "Loading...",
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("py-6 text-center text-sm", className)} {...props}>
      {children}
    </p>
  );
}

function StaticMultiselectEmpty({
  className,
  children = "No options found.",
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("py-6 text-center text-sm", className)} {...props}>
      {children}
    </p>
  );
}

function StaticMultiselectResults({
  items,
  loading = false,
  emptyText = "No options found.",
  loadingText = "Loading...",
}: {
  items: StaticMultiselectOption[];
  loading?: boolean;
  emptyText?: string;
  loadingText?: string;
}) {
  const { query } = useStaticMultiselectContext();

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;

    return items.filter((item) =>
      item.label.toLowerCase().includes(normalizedQuery),
    );
  }, [items, query]);

  if (loading) {
    return <StaticMultiselectLoading>{loadingText}</StaticMultiselectLoading>;
  }

  if (filteredItems.length === 0) {
    return <StaticMultiselectEmpty>{emptyText}</StaticMultiselectEmpty>;
  }

  return (
    <>
      {filteredItems.map((item) => (
        <StaticMultiselectItem key={item.value} value={item.value} icon={item.icon}>
          {item.label}
        </StaticMultiselectItem>
      ))}
    </>
  );
}

export {
  StaticMultiselectControl,
  StaticMultiselectSelectedBadges,
  StaticMultiselectInput,
  StaticMultiselectList,
  StaticMultiselectItem,
  StaticMultiselectLoading,
  StaticMultiselectEmpty,
  StaticMultiselectResults,
};

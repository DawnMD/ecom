"use client";

import { LayoutGrid, List } from "lucide-react";
import { useViewMode } from "@/hooks/use-view-mode";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ViewModeToggle = () => {
  const { viewMode, setViewMode } = useViewMode();

  return (
    <div className="inline-flex items-center gap-1 rounded-md border p-1" aria-label="Toggle product view mode">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Grid view"
        onClick={() => setViewMode("grid")}
        className={cn(viewMode === "grid" && "bg-accent text-accent-foreground")}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">Grid</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="List view"
        onClick={() => setViewMode("list")}
        className={cn(viewMode === "list" && "bg-accent text-accent-foreground")}
      >
        <List className="h-4 w-4" />
        <span className="sr-only">List</span>
      </Button>
    </div>
  );
};

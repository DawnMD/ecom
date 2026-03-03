"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InlineQueryFeedbackProps = {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
};

export function InlineQueryFeedback({
  message,
  retryLabel = "Try again",
  onRetry,
  className,
}: InlineQueryFeedbackProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-dashed p-4 text-sm text-muted-foreground",
        className,
      )}
    >
      <p>{message}</p>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

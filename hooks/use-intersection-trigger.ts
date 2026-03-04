"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

type UseIntersectionTriggerOptions = {
  elementRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
  onIntersect: () => void;
  rootMargin?: string;
};

export const useIntersectionTrigger = ({
  elementRef,
  enabled,
  onIntersect,
  rootMargin = "0px",
}: UseIntersectionTriggerOptions) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      return;
    }
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }
        onIntersect();
      },
      { rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, enabled, onIntersect, rootMargin]);
};

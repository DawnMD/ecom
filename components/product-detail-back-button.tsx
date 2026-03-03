"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const ProductDetailBackButton = () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} variant="outline" size="lg">
      <ArrowLeft className="h-4 w-4" />
      Back to catalog
    </Button>
  );
};

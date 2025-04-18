"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const Pagination = ({
  className,
  total,
  limit,
}: {
  className?: string;
  limit: number;
  total: number;
}) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const totalPages = Math.ceil(total / limit);
  const router = useRouter();
  const pathnanme = usePathname();

  const prev = () => {
    if (page <= "1") return;
    const pageNumber = parseInt(page);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", `${pageNumber - 1}`);
    router.push(`${pathnanme}?${newSearchParams}`);
  };

  const next = () => {
    if (page >= `${totalPages}`) return;
    const pageNumber = parseInt(page);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", `${pageNumber + 1}`);
    router.push(`${pathnanme}?${newSearchParams}`);
  };

  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={prev}
        disabled={page <= "1"}
        className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      <span className="text-gray-400">
        Page <span className="text-emerald-400">{page}</span> of{" "}
        <span className="text-emerald-400">{totalPages || "1"}</span>
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={next}
        disabled={page >= `${totalPages}`}
        className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default Pagination;

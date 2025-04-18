"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Search = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = React.useState("");

  // Sync input field with URL
  React.useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearch(currentSearch);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      newParams.set("search", search.trim());
    } else {
      newParams.delete("search");
    }

    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      className="flex w-full flex-col sm:flex-row items-center gap-3 sm:gap-6"
    >
      <Input
        type="text"
        placeholder="Search questions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:flex-1 bg-white/5 border border-emerald-400/30 focus:border-emerald-500 text-white placeholder:text-gray-400"
      />
      <button
        type="submit"
        className="w-full sm:w-auto mt-2 sm:mt-0 px-4 sm:px-6 py-2 rounded bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
      >
        Search
      </button>
    </form>
  );
};

export default Search;

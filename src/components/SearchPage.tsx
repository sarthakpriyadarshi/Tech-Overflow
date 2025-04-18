import React from "react";
import { Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchPage = () => {
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
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="min-h-screen pt-32 pb-20">
          {/* Search Hero */}
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Find Your Answer
            </h1>
            <p className="text-gray-400 text-lg">
              Search through thousands of questions from our tech community
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="rounded-xl bg-white/5 border border-emerald-500/20 p-8 backdrop-blur-lg">
              <form className="relative" onSubmit={handleSearch}>
                <SearchIcon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full bg-white/5 border border-emerald-500/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all duration-300"
                >
                  Search
                </Button>
              </form>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              Popular Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "javascript",
                "react",
                "node.js",
                "python",
                "typescript",
                "vue.js",
                "java",
                "css",
              ].map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => {
                    const newParams = new URLSearchParams(
                      searchParams.toString()
                    );
                    newParams.set("search", tag);
                    router.push(`${pathname}?${newParams.toString()}`);
                  }}
                >
                  #{tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

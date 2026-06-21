"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { InfinitePosts } from "@/components/site/infinite-posts";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchQuery(query);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-semibold text-charcoal">
          Search
        </h1>
        <form onSubmit={handleSearch} className="mx-auto mt-6 max-w-xl">
          <Input
            type="search"
            placeholder="Search articles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-center"
          />
        </form>
      </header>
      {searchQuery ? (
        <>
          <p className="mb-8 text-center text-charcoal/60">
            Results for &ldquo;{searchQuery}&rdquo;
          </p>
          <InfinitePosts query={searchQuery} />
        </>
      ) : (
        <p className="text-center text-charcoal/60">
          Enter a search term to find articles.
        </p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="py-12 text-center">Loading…</p>}>
      <SearchContent />
    </Suspense>
  );
}

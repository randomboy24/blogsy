"use client";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export function SearchBox() {
  const [isFocus, setIsFocus] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost/api/blogs/search?q=${encodeURIComponent(query)}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setResults(data.blogs || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative mr-20 w-60">
      <div className=" p-2 rounded-3xl  flex items-center bg-neutral-200">
        <SearchIcon
          strokeWidth={1}
          color={`${isFocus ? "black" : "gray"}`}
          className="ml-1"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="ml-3 w-full focus:outline-none focus:ring-0 focus:border-transparent"
          placeholder="Search"
          onFocus={() => setIsFocus(true)}
          onBlur={() => setTimeout(() => setIsFocus(false), 200)} // delay so user can click
        />
      </div>

      {isFocus && query && (
        <div className="absolute left-0 w-full bg-white rounded-lg top-10 shadow-lg z-10">
          {loading ? (
            <div className="p-3 text-gray-500 text-sm">Loading...</div>
          ) : results.length > 0 ? (
            results.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="block px-3 py-2 hover:bg-gray-100"
              >
                <div className="font-medium">{blog.title}</div>
                <div className="text-sm text-gray-500 truncate">
                  {blog.content}
                </div>
              </Link>
            ))
          ) : (
            <div className="p-3 text-gray-500 text-sm">No results</div>
          )}
        </div>
      )}
    </div>
  );
}

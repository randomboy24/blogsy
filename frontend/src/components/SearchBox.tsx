"use client";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

export function SearchBox() {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <div className=" border p-1 rounded-3xl border-neutral-500 flex mr-20 w-60">
      <span>
        <SearchIcon
          strokeWidth={1}
          color={`${isFocus ? "black" : "gray"}`}
          className="ml-1"
        />
      </span>
      <input
        type="text"
        className="focus:outline-none focus:ring-0 focus:border-transparent ml-3"
        placeholder="Search"
        onClick={(e) => {
          e.preventDefault();
        }}
        onFocus={() => {
          setIsFocus(true);
        }}
        onBlur={() => {
          setIsFocus(false);
        }}
      />
    </div>
  );
}

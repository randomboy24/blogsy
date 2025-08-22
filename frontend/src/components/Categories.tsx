"use client";

import { useState } from "react";

export function Categories() {
  return (
    <div className={`relative hover:cursor-pointer hover:text-black test`}>
      Category
      <div className={`absolute  right-0 dropdown shadow bg-white`}>
        <ul className="p-4 space-y-2">
          <li>Technology</li>
          <li>Lifestyle</li>
          <li>Travel</li>
          <li>Food</li>
          <li>Education</li>
          <li>Health</li>
        </ul>
      </div>
    </div>
  );
}

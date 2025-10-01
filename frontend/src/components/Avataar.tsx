"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

export function Avataar({ char }: { char: any }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <div
        className="h-10 w-10 rounded-4xl border bg-gray-500 text-white flex items-center justify-center hover:cursor-pointer"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {char}
      </div>
      {isOpen && (
        <div className="absolute px-2 py-5 bg-white right-10 shadow-lg">
          <div className="flex flex-col">
            <div
              className="hover:text-black hover:cursor-pointer"
              onClick={async () => {
                await fetch("http://localhost/api/logout", {
                  credentials: "include",
                });

                redirect("/signin");
              }}
            >
              Logout
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

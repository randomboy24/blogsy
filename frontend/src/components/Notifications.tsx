"use client";

import { Bell } from "lucide-react";
import Link from "next/link";

export function Notifications() {
  return (
    <div className="text-neutral-500 hover:cursor-pointer hover:text-black">
      <Link href="/notifications">
        <Bell strokeWidth={1} />
      </Link>
    </div>
  );
}

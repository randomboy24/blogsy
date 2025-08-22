import { Bell, NotebookPen, SearchIcon } from "lucide-react";
import { SearchBox } from "./SearchBox";
import { Categories } from "./Categories";
import Link from "next/link";
import { Notifications } from "./Notifications";
import { BlogsyLogo } from "./BlogsyLogo";

export function Navbar() {
  return (
    <div className="h-16 flex items-center border-b border-neutral-400 px-10 justify-between">
      <div className="flex items-center">
        <div className="">
          <BlogsyLogo height={50} />
        </div>
        <SearchBox />
      </div>
      <div className="flex items-center gap-x-10 text-neutral-500 ">
        <Categories />
        <div className="flex gap-x-1 text-neutral-500 hover:text-black hover:cursor-pointer">
          <NotebookPen strokeWidth={1} />
          <Link href={"/publish"}>Write</Link>
        </div>
        <Notifications />
        <div className="h-10 w-10 rounded-4xl border bg-gray-500 text-white flex items-center justify-center">
          A
        </div>
      </div>
    </div>
  );
}

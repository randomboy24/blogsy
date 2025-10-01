import { Bell, NotebookPen, SearchIcon } from "lucide-react";
import { SearchBox } from "./SearchBox";
import { Categories } from "./Categories";
import Link from "next/link";
import { Notifications } from "./Notifications";
import { BlogsyLogo } from "./BlogsyLogo";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Avataar } from "./Avataar";

export async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = jwt.decode(token || "");

  return (
    <div className="h-16 flex items-center border-b border-neutral-400 px-10 justify-between">
      <div className="flex items-center">
        <div className="">
          <BlogsyLogo height={50} />
        </div>
        <SearchBox />
      </div>
      <div className="flex items-center gap-x-10 text-neutral-500 ">
        {/* <Categories /> */}
        <Link href={"/publish"}>
          <div className="flex gap-x-1 text-neutral-500 hover:text-black hover:cursor-pointer">
            <NotebookPen strokeWidth={1} />
            <span>Write</span>
          </div>
        </Link>
        <Notifications />
        <Avataar char={decoded?.name[0]} />
      </div>
    </div>
  );
}

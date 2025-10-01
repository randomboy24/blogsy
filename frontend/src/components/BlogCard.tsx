// components/BlogCard.tsx
import { BlogCardProps } from "@/types";
import { Heart, MessageCircle } from "lucide-react";
import { Like } from "./Like";
import Link from "next/link";

export default function BlogCard({
  id,
  title,
  content,
  author,
  createdAt,
}: BlogCardProps) {
  console.log("from blogcard" + id);
  console.log("dates = " + createdAt);
  return (
    <div className=" p-6  w-full max-w-6xl border-b border-neutral-300 hover:cursor-pointer">
      <Link href={`/blog/${id}`}>
        {/* Title */}
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">{title}</h2>

        {/* Metadata */}
        <p className="text-sm text-gray-500 mb-4">
          By <span className="font-medium text-gray-700">{author}</span> •{" "}
          {createdAt.split(" ")[0].replaceAll("-", "/")}
        </p>

        {/* Content snippet */}
        <p className="text-gray-700 mb-4">
          {content.length > 150 ? content.substring(0, 150) + "..." : content}
        </p>
      </Link>
      {/* Actions */}
      <div className="flex items-center space-x-4 ">
        <Like blogId={id as string} />
        <button className="flex items-center text-gray-500 hover:text-blue-500 transition hover:cursor-pointer">
          <MessageCircle className="w-5 h-5 mr-1" />
          1k
        </button>
      </div>
    </div>
  );
}

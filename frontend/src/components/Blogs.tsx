import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { cookies } from "next/headers";
import { BlogCardProps } from "@/types";

export default async function Blogs() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const res = await fetch("http://localhost/api/blogs", {
    method: "GET",
    credentials: "include", // if you want to send cookies/session
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
  });

  const { blogs } = await res.json();
  console.log("BLOGS = " + blogs);

  const dummyBlogs = [
    {
      id: 1,
      title: "Getting Started with Next.js",
      content:
        "Next.js is a powerful React framework that makes building full-stack applications easier. It comes with features like file-based routing, API routes, and server-side rendering...",
      author: "Jane Doe",
      createdAt: "2025-08-10",
    },
    {
      id: 2,
      title: "Why Tailwind CSS is Awesome",
      content:
        "Tailwind CSS is a utility-first CSS framework that allows you to build modern designs without leaving your HTML. It saves time, keeps styles consistent, and is highly customizable...",
      author: "Alex Byers",
      createdAt: "2025-08-15",
    },
    {
      id: 3,
      title: "Understanding JWT Authentication",
      content:
        "JSON Web Tokens (JWT) are an industry standard for securely transmitting information between parties. They are commonly used for authentication in APIs and modern web apps...",
      author: "John Smith",
      createdAt: "2025-08-18",
    },
    {
      id: 4,
      title: "5 Tips to Improve Your Coding Skills",
      content:
        "Becoming a better developer takes time and practice. Focus on problem-solving, read code written by others, work on side projects, and don't forget to take breaks...",
      author: "Emily Johnson",
      createdAt: "2025-08-21",
    },
  ];

  // console.log("afdsafsldfjlksd ==== " + blogs[0].id);
  return (
    <>
      {blogs.map((blog: BlogCardProps) => (
        <BlogCard
          key={blog.id}
          id={blog.id}
          title={blog.title}
          content={blog.content}
          author={blog.author}
          createdAt={blog.createdAt}
        />
      ))}
    </>
  );
}

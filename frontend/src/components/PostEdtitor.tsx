"use client";
import { useEffect, useState } from "react";
import { Container } from "./Container";

type blogType = {
  title: string;
  content: string;
  category?: string;
};

type categoryType = {
  id: string;
  name: string;
};

export default function PostEditor() {
  const [blog, setBlog] = useState<blogType>({
    title: "",
    content: "",
    category: "",
  });

  const [categories, setCategories] = useState<categoryType[]>([]);

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost/api/categories", {
          credentials: "include",
        });
        const data = await res.json();
        console.log(data.categories);
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    console.log("jsdjf");
  }, []);

  async function createBlogs() {
    const res = await fetch("http://localhost/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(blog),
    });
    const jsonData = await res.json();
    console.log(jsonData);
  }

  return (
    <Container>
      <div className="flex flex-col gap-4 max-w-xl mx-auto">
        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="font-semibold text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter the title"
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={(e) =>
              setBlog((prevBlog) => ({ ...prevBlog, title: e.target.value }))
            }
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label htmlFor="category" className="font-semibold text-gray-700">
            Category
          </label>
          <select
            id="category"
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            value={blog.categoryId}
            onChange={(e) =>
              setBlog((prevBlog) => ({
                ...prevBlog,
                categoryId: e.target.value,
              }))
            }
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <label htmlFor="content" className="font-semibold text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            placeholder="Enter the description"
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 h-40 resize-none"
            onChange={(e) =>
              setBlog((prevBlog) => ({ ...prevBlog, content: e.target.value }))
            }
          ></textarea>
        </div>

        {/* Publish Button */}
        <button
          className="mt-3 bg-green-600 hover:bg-green-400 rounded-3xl h-10 w-28 text-white hover:text-neutral-500 transition-colors cursor-pointer"
          onClick={createBlogs}
        >
          Publish
        </button>
      </div>
    </Container>
  );
}

"use client";
import React, { useState, useEffect } from "react";

// Container component
function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`max-w-5xl mx-auto p-4 md:p-10 bg-neutral-100 min-h-screen ${className}`}
    >
      {children}
    </div>
  );
}

interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  categoryId: string;
  categoryName: string;
  isBanned: boolean;
}

interface User {
  id: string;
  name: string;
  isBanned: boolean;
}

interface Category {
  id: string;
  name: string;
}

// Initial Dummy Data (blogs & users only)
const initialUsers: User[] = [
  { id: "user1", name: "Alice Smith", isBanned: false },
  { id: "user2", name: "Bob Johnson", isBanned: false },
  { id: "user3", name: "Charlie Brown", isBanned: false },
];

const initialBlogs: Blog[] = [
  {
    id: "blog1",
    title: "Getting Started with Next.js",
    content: "A comprehensive guide...",
    authorId: "user1",
    authorName: "Alice Smith",
    categoryId: "cat4",
    categoryName: "Programming",
    isBanned: false,
  },
  {
    id: "blog2",
    title: "My Journey Through Southeast Asia",
    content: "Exploring ancient temples...",
    authorId: "user2",
    authorName: "Bob Johnson",
    categoryId: "cat3",
    categoryName: "Travel",
    isBanned: false,
  },
];

const AdminPanel: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterUser, setFilterUser] = useState<string>("");

  // --- Fetch Categories from API ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost/api/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // --- Create Category ---
  const handleCreateCategory = async () => {
    if (newCategoryName.trim() === "") return;
    try {
      const res = await fetch("http://localhost/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      const data = await res.json();
      if (res.ok) {
        setCategories((prev) => [...prev, data.category]);
        setNewCategoryName("");
      } else {
        alert(data.message || "Failed to add category");
      }
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  // --- Delete Category ---
  const handleDeleteCategory = async (id: string) => {
    const categoryHasBlogs = blogs.some((blog) => blog.categoryId === id);
    if (categoryHasBlogs) {
      alert(
        "Cannot delete category: Some blogs are associated with this category. Please reassign or delete those blogs first."
      );
      return;
    }

    try {
      const res = await fetch(`http://localhost/api/category/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        if (filterCategory === id) setFilterCategory("");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // --- Filtering Blogs ---
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      filterCategory === "" || blog.categoryId === filterCategory;
    const matchesUser = filterUser === "" || blog.authorId === filterUser;
    return matchesCategory && matchesUser;
  });

  return (
    <Container>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-black">Admin Panel</h1>

        {/* Categories Management */}
        <div className="rounded-xl bg-white p-6 shadow-lg border border-neutral-200">
          <h2 className="mb-6 text-2xl font-semibold text-black">
            Categories Management
          </h2>
          <div className="mb-6 flex gap-3">
            <input
              type="text"
              placeholder="New Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-grow rounded-lg border border-neutral-300 p-3 text-black placeholder-neutral-500 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
            />
            <button
              onClick={handleCreateCategory}
              className="rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2"
            >
              Add Category
            </button>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-medium text-neutral-500">
              Existing Categories:
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between rounded-lg bg-neutral-50 p-4 text-black shadow-sm border border-neutral-200"
                >
                  <span className="font-medium">{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="rounded-full p-2 text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    title="Delete Category"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blogs Management */}
        {/* 🔹 Keep your Blogs Management & User Ban logic unchanged */}
      </div>
    </Container>
  );
};

export default AdminPanel;

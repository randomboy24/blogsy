"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export function Like({ blogId }: { blogId: string }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Fetch initial like status and count (placeholder)
  useEffect(() => {
    async function fetchLikes() {
      try {
        const res = await fetch(`http://localhost/api/blog/${blogId}/likes`, {
          credentials: "include",
        });
        const data = await res.json();
        setLiked(data.liked); // true or false
        setLikeCount(data.count); // total likes
      } catch (err) {
        console.error("Failed to fetch likes:", err);
      }
    }

    fetchLikes();
  }, [blogId]);

  const toggleLike = async () => {
    try {
      const url = liked
        ? "http://localhost/api/unlike" // placeholder unlike URL
        : "http://localhost/api/like"; // placeholder like URL

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ blogId }),
      });

      const data = await res.json();
      console.log(data);

      // Update UI
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  return (
    <button
      className={`flex items-center hover:cursor-pointer transition ${
        liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
      }`}
      onClick={toggleLike}
    >
      <Heart className="h-5 w-5 mr-1" fill={liked ? "red" : "none"} />
      <span>{likeCount}</span>
    </button>
  );
}

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function Blog({ params }: { params: { id: string } }) {
  // Fetch blog from your backend API
  const res = await fetch(`http://localhost/api/blog/${params.id}`, {
    credentials: "include",
    cache: "no-store", // ensures fresh data (optional)
  });

  //   if (!res.ok) {
  //     throw new Error("Failed to fetch blog");
  //   }

  const data = await res.json();

  const blog = data.blog; // assuming API returns { blog: {...} }
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = jwt.decode(token || "");

  return (
    <div>
      <div className="flex flex-row justify-around">
        <div className="flex flex-col ml-10 max-w-screen-sm">
          <div className="mt-10 text-5xl font-bold">{blog.title}</div>
          <div className="text-gray-500 mt-3">
            posted on {new Date(blog.createdAt).toLocaleDateString()}
          </div>
          <div className="mt-4 text-lg">{blog.content}</div>
        </div>

        <div className="flex flex-col mt-12 max-w-md mr-10">
          <div className="text-gray-500">Author</div>
          <div className="flex flex-row">
            <div className="mt-5">
              <div className="h-10 w-10 rounded-4xl border bg-gray-500 text-white flex items-center justify-center hover:cursor-pointer0">
                {decoded?.name[0]}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="ml-4 text-xl font-bold">{blog.author}</div>
              <div className="mt-1 ml-4 text-gray-500">
                Random catch phrase about the author's ability to grab the
                user's attention
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

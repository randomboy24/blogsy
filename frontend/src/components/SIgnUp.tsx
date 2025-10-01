"use client";
import { signupSchema, userType } from "@/types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const [userCred, setUserCred] = useState<userType>({
    name: "",
    password: "",
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Create an Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join our blog community and start sharing your stories.
        </p>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              onChange={(e) => {
                setUserCred((prevUserCred) => {
                  return {
                    ...prevUserCred,
                    name: e.target.value,
                  };
                });
              }}
            />
          </div>

          {/* Email */}
          {/* <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div> */}

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              onChange={(e) => {
                setUserCred((prevUserCred) => {
                  return {
                    ...prevUserCred,
                    password: e.target.value,
                  };
                });
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition hover:cursor-pointer"
            onClick={() => {
              const result = signupSchema.safeParse(userCred);
              if (!result.success) {
                const fieldErrors = result.error;
                console.log(fieldErrors);
                return;
              } else {
                console.log(result.data);
              }
              fetch("http://localhost/api/signup", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(userCred),
                credentials: "include",
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log(data);
                  redirect("/");
                });
            }}
          >
            Sign Up
          </button>

          {/* Extra Links */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link href="/" className="text-indigo-600 hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

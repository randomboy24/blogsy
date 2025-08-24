"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { Container } from "./Container";
import { BlogsyLogo } from "./BlogsyLogo";

type userType = {
  name: string;
  password: string;
};

export default function SignIn() {
  const [userCred, setUserCred] = useState<userType>({
    name: "",
    password: "",
  });
  return (
    <Container className=" ">
      <div className="grid grid-cols-2 h-[90%]">
        {/* left side */}
        <div className="flex flex-col justify-center mt-14">
          <div>
            <BlogsyLogo height={100} /> {/* Slightly larger logo */}
          </div>
          <div className="font-serif text-neutral-500 text-3xl">
            A place to read, write, and deepen your understandinguserCred
          </div>
        </div>
        {/* right side */}
        <div className="flex flex-col justify-center">
          <div className="p-6 bg-white shadow-2xl rounded-lg max-w-sm mx-auto mt-20 space-y-6">
            <div>
              <input
                type="text"
                required
                placeholder="Username"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                onChange={(e) => {
                  setUserCred((prevUserCred: userType) => {
                    return {
                      ...prevUserCred,
                      name: e.target.value,
                    };
                  });
                }}
              />
            </div>
            <div>
              <input
                type="password"
                required
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                onChange={(e) => {
                  setUserCred((prevUserCred: userType) => {
                    return {
                      ...prevUserCred,
                      password: e.target.value,
                    };
                  });
                }}
              />
            </div>
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition cursor-pointer text-lg font-medium"
              onClick={() => {
                fetch("http://localhost/api/signin", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    ...userCred,
                  }),
                  credentials: "include",
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log(JSON.stringify(data));
                    redirect("/");
                  });
              }}
            >
              Log in
            </button>
            <div className="text-center">
              <Link href="/signup">
                <button className="bg-[#42b72a] text-white px-4 py-3 rounded-lg text-lg font-medium">
                  Create new account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

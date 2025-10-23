"use client";

import React from "react";
import { useGetAllBlogsQuery } from "../../redux/services/blog/blogApi";

export default function BlogContent() {
  const { data: allBlogs } = useGetAllBlogsQuery("limit=12");

  return (
    <div className="container-fluid mx-auto mt-[20px]">
      <div className="blog_b_border">
        <h1 className="lg:text-[40px] text-[30px] text-black font-[700] text-center">
          Blogs
        </h1>
        <div className="flex lg:justify-center md:justify-center justify-flex-center mx-5 my-2">
          <p className="lg:text-[20px] md:text-[22px] text-[16px] w-[100%] max-w-[850px] mx-auto text-center text-[#000000]">
            Welcome to our blog, where we share insights, tips, and the latest
            trends across a variety of topics. Whether you're looking for
            advice, updates, or expert opinions, you'll find valuable
            information here.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 mt-5">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-8">
          {allBlogs?.payload?.results.length > 0
            ? allBlogs.payload.results.map((item, index) => (
                <div
                  key={index}
                  className="group w-full max-lg:max-w-xl rounded-2xl"
                >
                  <div className="relative group">
                    <a href={`/blog/${item.url}`}>
                      <img
                        src={`/image/blogs/${item.image}`}
                        alt={item.title}
                        loading="lazy"
                        className="rounded-2xl w-full h-48 object-cover"
                      />
                      <div className="absolute rounded-3xl inset-0 bg-black bg-opacity-30 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-[36px] leading-[50px] font-semibold">
                          Read
                        </span>
                      </div>
                    </a>
                  </div>
                  <div className="py-5 px-1">
                    <a href={`/blog/${item.url}`}>
                      <h2
                        className="lg:text-[18px] md:text-[18px] text-[16px] text-[#1A1A1A] font-[600] leading-[27px] my-2"
                        style={{ minHeight: 40 }}
                      >
                        {item.title}
                      </h2>
                    </a>
                    <p
                      className="text-[#000000] leading-6 mb-5"
                      style={{ minHeight: 40 }}
                    >
                      {item.short_description
                        ?.split(" ")
                        .slice(0, 15)
                        .join(" ") +
                        (item.short_description?.split(" ").length > 15
                          ? "..."
                          : "")}
                    </p>
                  </div>
                </div>
              ))
            : [...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 w-full animate-pulse rounded-2xl shadow-md h-[300px] mb-[30px]"
                >
                  <div className="h-[200px] bg-gray-300 rounded-t-2xl"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

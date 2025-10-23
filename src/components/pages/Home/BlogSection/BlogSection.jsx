import React from "react";
import { useGetAllBlogsQuery } from "../../../redux/services/blog/blogApi";

const BlogSection = () => {
  const { data: allBlogs, isLoading } = useGetAllBlogsQuery("limit=3");

  return (
    <div className="max-w-[1140px] mx-auto  px-5 md:my-10 my-5">
      <section className="xl:pt-5 xl:pb-5 lg:pt-5 lg:pb-4 pt-0 pb-3">
        <div className="mx-auto max-w-7xl md:px-4 sm:px-6 lg:px-8">
          <h2 className="font-manrope md:text-4xl text-2xl font-bold text-gray-900 text-center lg:mb-10 md:mb-16 mb-6">
            Popular Blogs
          </h2>
          <div className="flex justify-center gap-y-4 lg:gap-y-0 flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8">
            {allBlogs?.payload?.results.length > 0 ? (
              allBlogs.payload.results.map((item, index) => (
                <div
                  key={index}
                  className="group w-full max-lg:max-w-xl lg:w-1/3 rounded-2xl"
                >
                  <div className="relative group">
                    <a href={`/blog/${item.url}`}>
                      <img
                        src={`/blogs/${item.image}`}
                        alt={item.title}
                        className="rounded-2xl w-full h-48 object-cover"
                        loading="lazy"
                      />
                      {/* Backdrop on hover */}
                      <div className="absolute rounded-3xl inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-[36px] leading-[50px] font-semibold">
                          Read
                        </span>
                      </div>
                    </a>
                  </div>
                  <div className="pt-5 px-1">
                    <div className="flex justify-between items-center">
                      {/* <span className="text-[#4177EB]">&nbsp;</span>
                      <span className="text-[#A3A3A3] font-[600] mb-5 block"></span> */}
                    </div>
                    <a href={`/blog/${item.url}`}>
                      <h3
                        className="lg:text-[18px] md:text-[18px] text-[16px] text-[#1A1A1A] font-[600] leading-[27px] my-2"
                        style={{ minHeight: 40 }}
                      >
                        {item.title}
                      </h3>
                    </a>
                    <p
                      className="text-[#000000] leading-6"
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
            ) : (
              <div className="grid w-full gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 w-full animate-pulse rounded-2xl shadow-md h-[300px]"
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
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogSection;

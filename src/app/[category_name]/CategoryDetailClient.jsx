"use client";

import { useState } from "react";
import { useGetSingleCategoryByCategoryNameQuery } from "../../redux/services/category/categoryApi.js";

const CategoryDetailClient = ({ categoryName }) => {
  const { data, isLoading, isFetching } =
    useGetSingleCategoryByCategoryNameQuery(categoryName);

  const subCategories = data?.payload?.subCategories || [];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = subCategories.map((subCategory) => ({
    ...subCategory,
    calculators: subCategory.calculators.filter((calc) =>
      calc.tech_calculator_title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <div className="container mx-auto mt-5">
      <div className="lg:w-[95%] w-full mx-auto py-1 rounded-lg ">
        {isLoading || isFetching ? (
          <div className="animate-pulse w-1/4">
            <div className="h-8 bg-gray-300 rounded-md ml-4"></div>
          </div>
        ) : (
          <h1 className="lg:text-[30px] md:text-[30px] px-5 text-[26px] font-[700] leading-[46.87px]">
            {data?.payload?.category?.category_name}
          </h1>
        )}
      </div>

      <div className="flex flex-col items-center py-1 mb-5">
        <div className="mt-2 lg:w-[95%] w-full bg-right bg-cover rounded-lg px-3">
          <div className=" w-full  order-1 lg:order-2  px-[5px]   rounded-lg md:mb-6 lg:mb-6 ">
            <p className="text-[17px] text-opacity-60  mt-2 leading-[29.83px] text-left font-[400] ">
              {data?.payload?.category?.des}
            </p>
          </div>

          <div className="w-full px-5 my-2 lg:w-[40%] md:w-[80%]">
            <input
              type="text"
              placeholder="Search calculators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
            />
          </div>

          <div className="flex flex-col lg:flex-row">
            <div
              className="lg:w-[100%] md:w-[100%] w-full order-2 lg:order-1 p-5 rounded-lg bg-center bg-no-repeat"
              style={{ backgroundImage: 'url("/new_page/finance_bg.svg")' }}
            >
              {isLoading || isFetching ? (
                <div className="animate-pulse space-y-4 grid grid-cols-12 gap-4">
                  <div className="h-8 w-1/2 bg-gray-300 rounded-md col-span-12"></div>
                  <div className="h-6 bg-gray-200 rounded-md lg:col-span-4 md:col-span-4 col-span-12"></div>
                  <div className="h-6 bg-gray-200 rounded-md lg:col-span-4 md:col-span-4 col-span-12"></div>
                  <div className="h-6 bg-gray-200 rounded-md lg:col-span-4 md:col-span-4 col-span-12"></div>
                  <div className="h-8 w-1/2 bg-gray-300 rounded-md col-span-12"></div>
                  <div className="h-6 bg-gray-200 rounded-md lg:col-span-4 md:col-span-4 col-span-12"></div>
                  <div className="h-6 bg-gray-200 rounded-md lg:col-span-4 md:col-span-4 col-span-12"></div>
                  <div className="h-6 bg-gray-200 rounded-md lg:col-span-4 md:col-span-4 col-span-12"></div>
                  <div className="h-8 w-1/2 bg-gray-300 rounded-md col-span-12"></div>
                  <div className="h-6 bg-gray-200 rounded-md lg:col-span-4 md:col-span-4 col-span-12"></div>
                  <div className="h-6 bg-gray-200 rounded-md lg:col-span-4 md:col-span-4 col-span-12"></div>
                  <div className="h-6 bg-gray-200 rounded-md lg:col-span-4 md:col-span-4 col-span-12"></div>
                  <div className="h-8 w-1/2 bg-gray-300 rounded-md col-span-12"></div>
                  <div className="h-6 bg-gray-200 rounded-md lg:col-span-4 md:col-span-4 col-span-12"></div>
                  <div className="h-6 bg-gray-200 rounded-md lg:col-span-4 md:col-span-4 col-span-12"></div>
                  <div className="h-6 bg-gray-200 rounded-md lg:col-span-4 md:col-span-4 col-span-12"></div>
                </div>
              ) : filteredData.length === 0 ? (
                <p>No calculators found</p>
              ) : (
                filteredData.map((subCategory, idx) => (
                  <div key={idx} className="col-span-12 mb-4">
                    <h2 className="text-[21px] font-bold my-3">
                      {subCategory.sub_category_name}
                    </h2>
                    <ul className="grid grid-cols-12 gap-2 list-disc pl-5">
                      {subCategory.calculators.map((calc, cidx) => (
                        <li
                          key={cidx}
                          className="lg:col-span-4 md:col-span-6 col-span-12 p-2 rounded-md"
                        >
                          <a
                            href={`/${calc.tech_calculator_link}`}
                            className="lg:text-[16px] md:text-[14px] text-[16px] font-serif font-medium hover:underline hover:text-black"
                          >
                            {calc.tech_calculator_title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailClient;

import React, { useState } from "react";
import { useGetAllCategoryCalculatorQuery } from "../../redux/services/category/categoryApi";

const SiteMap = () => {
  const {
    data: getAllCategoryCalculator,
    isLoading,
    isFetching,
  } = useGetAllCategoryCalculatorQuery();

  const data = getAllCategoryCalculator?.payload;

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Filter data based on search term
  const filteredData = data?.map((subCategory) => ({
    ...subCategory,
    calculators: subCategory.calculators.filter((calc) =>
      calc.tech_calculator_title.toLowerCase().includes(searchTerm)
    ),
  }));
  return (
    <div className="container-fluid mx-auto mt-[20px]">
      <div className="w-full max-w-6xl mx-auto py-1 rounded-lg text-center">
        <h1 className="text-2xl lg:text-3xl md:text-3xl px-5 font-semibold">
          <strong>All Calculators</strong>
        </h1>
      </div>
      <div className="flex flex-col items-center py-1 mb-5">
        <div className="mt-2 w-full max-w-6xl bg-right bg-cover bg-white rounded-lg px-[12px]">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full order-1 lg:order-2 px-[5px] rounded-lg md:mb-6 lg:mb-6">
              <p className="text-gray-600 text-center">891 Calculators</p>
            </div>
          </div>
          <div className="grid grid-cols-12 items-center py-1 mb-5">
            <div className="mt-2 col-span-12 md:col-span-4 lg w-full max-w-1xl bg-right bg-cover bg-white rounded-lg">
              <label htmlFor="myInput" className="py-5">
                Filter Searching
              </label>
              <input
                id="myInput"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="mt-2 input"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div
              className="lg:w-[100%] md:w-[100%] w-full order-2 lg:order-1 p-[20px] lg:p-[10px] md:p-[10px] rounded-lg bg-center bg-no-repeat filter"
              style={{ backgroundImage: "url('/new_page/finance_bg.svg')" }}
            >
              {isLoading || isFetching ? (
                <div className="animate-pulse space-y-4 grid grid-cols-12 gap-4">
                  {/* First div takes up the full row */}
                  <div className="h-8 w-1/2 bg-gray-300 rounded-md col-span-12"></div>

                  {/* Next three divs, each takes up 4 columns (col-span-4) */}
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-8 w-1/2 bg-gray-300 rounded-md col-span-12"></div>

                  {/* Next three divs, each takes up 4 columns (col-span-4) */}
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-8 w-1/2 bg-gray-300 rounded-md col-span-12"></div>

                  {/* Next three divs, each takes up 4 columns (col-span-4) */}
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md col-span-4"></div>
                </div>
              ) : filteredData.length === 0 ? (
                <p>No calculators found</p> // Show this if no calculators match the search
              ) : (
                <div
                  className="grid grid-cols-12 gap-4 Everyday-Life"
                  id="myTable"
                >
                  {filteredData?.map((subCategory, index) => (
                    <div key={index} className="col-span-12">
                      {/* Subcategory Title */}
                      <h2 className="col-span-12 text-[23px] font-bold my-3">
                        <div>{subCategory.category_name}</div>
                      </h2>

                      {/* Calculators List - Grid with 3 items per row */}
                      <ul className="grid grid-cols-12 gap-4 list-disc pl-5">
                        {subCategory.calculators.map((calc, calcIndex) => (
                          <li
                            key={calcIndex}
                            className="md:col-span-4 col-span-12 p-2 rounded-md"
                          >
                            <a
                              href={`${
                                calc.tech_calculator_title === "Love Calculator"
                                  ? "/love-calculator"
                                  : "/coming-soon"
                              }`}
                              className="text-[16px] font-medium hover:underline hover:text-black"
                            >
                              {calc.tech_calculator_title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMap;

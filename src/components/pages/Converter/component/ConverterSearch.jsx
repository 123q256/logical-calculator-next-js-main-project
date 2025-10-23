import React, { useState } from "react";
import Link from "next/link";
import { useGetSearchSubConverterQuery } from "../../../../redux/services/converter/converterApi";

const ConverterSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError } =
    useGetSearchSubConverterQuery(searchTerm);

  // Use the data directly from the query result

  return (
    <div className="bordered border-gray-200 rounded-lg mt-[60px]">
      <p className="py-2 px-3 font-s-18 bg-gray radius-t-10">
        <strong>
          <label htmlFor="unit_search">Search a Converter</label>
        </strong>
      </p>
      <div className="relative mb-4 mx-3">
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. cm to inches"
            id="unit_search"
            name="unit_search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none h-[40px] md:h-[45px] lg:h-[45px]"
          />
          <span className="absolute right-4 top-4">
            <svg
              width={16}
              height={15}
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.14864 0C3.43837 0 0.416016 3.02132 0.416016 6.73034C0.416016 10.4393 3.43837 13.4665 7.14864 13.4665C8.7334 13.4665 10.1909 12.9113 11.3428 11.9895L14.1472 14.7915C14.2888 14.9271 14.4778 15.002 14.6738 15C14.8698 14.998 15.0573 14.9193 15.196 14.7808C15.3347 14.6423 15.4137 14.4551 15.416 14.2591C15.4182 14.0632 15.3437 13.8741 15.2082 13.7324L12.4038 10.929C13.3267 9.77569 13.8827 8.3164 13.8827 6.73034C13.8827 3.02132 10.8589 0 7.14864 0ZM7.14864 1.49598C10.0502 1.49598 12.3848 3.82981 12.3848 6.73034C12.3848 9.63087 10.0502 11.9706 7.14864 11.9706C4.24712 11.9706 1.91248 9.63087 1.91248 6.73034C1.91248 3.82981 4.24712 1.49598 7.14864 1.49598Z"
                fill="#1A1A1A"
              />
            </svg>
          </span>
        </div>
      </div>

      <div
        id="search_unit"
        className="px-3 custom-scroll overflow-auto"
        style={{ maxHeight: 300 }}
      >
        {isLoading && <p className="text-gray-500">Loading...</p>}
        {isError && <p className="text-red-500">Failed to fetch data.</p>}
        {!isLoading &&
          !isError &&
          searchTerm &&
          data?.payload?.length === 0 && (
            <p className="text-gray-500">No converters found.</p>
          )}
        {!isLoading &&
          !isError &&
          data?.payload?.map((item, index) => (
            <p key={index} className="py-2 text-[15px] converter_border ">
              <a
                href={`/${item.tech_calculator_link}`}
                className="text-back text-decoration-none text-black hover:text-[#2845F5]"
              >
                {item.tech_calculator_title}
              </a>
            </p>
          ))}
      </div>
    </div>
  );
};

export default ConverterSearch;
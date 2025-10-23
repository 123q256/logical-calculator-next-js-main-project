import React from "react";
import { useGetAllConverterQuery } from "../../../../redux/services/converter/converterApi";
import Link from "next/link";

const ConverterList = () => {
  const { data, isLoading, isError } = useGetAllConverterQuery();
  const converters = data?.payload || [];

  return (
    <div className="bordered border-gray-200 rounded-lg pb-2 mt-3 mb-10">
      <p className="py-2 px-3 font-s-18 bg-gray radius-t-10">
        <strong>All Converters</strong>
      </p>
      <div
        className="related px-3 custom-scroll overflow-auto"
        style={{ height: 300 }}
      >
        {isLoading && (
          <ul>
            {[...Array(6)].map((_, index) => (
              <li key={index} className="py-2 flex gap-4 animate-pulse w-full">
                <div className="animate-pulse w-[100%] py-2">
                  <div className="h-4 bg-gray-300 animate-pulse rounded w-full"></div>
                  <div className="mt-2 h-4 bg-gray-300 animate-pulse rounded w-1/4"></div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {isError && (
          <p className="py-2 text-[15px] text-red-500">
            Error loading converters
          </p>
        )}

        {!isLoading && !isError && converters.length === 0 && (
          <p className="py-2 text-[15px] text-gray-500">
            No converters available
          </p>
        )}

        {converters.map((converter, index) => (
          <p key={index} className="py-2 text-[15px] converter_border">
            <a
              href={`/converter/${converter.tech_calculator_link}`}
              className="text-black hover:text-[#2845F5] no-underline hover:underline"
            >
              {converter.tech_calculator_title}
            </a>
          </p>
        ))}
      </div>
    </div>
  );
};

export default ConverterList;

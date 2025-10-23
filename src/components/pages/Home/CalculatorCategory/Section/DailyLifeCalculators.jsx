import React from "react";
import Link from "next/link";

const DailyLifeCalculators = () => {
  const DailyLifeCalculators = [
    { path: "https://calculator-logical.com/love-calculator", label: "Love Calculator" },
    { path: "https://calculator-logical.com/age-calculator", label: "Age Calculator" },
    { path: "https://calculator-logical.com/board-foot-calculator", label: "Board Foot Calculator" },
    { path: "https://calculator-logical.com/birthday-calculator", label: "Birthday Calculator" },
    { path: "https://calculator-logical.com/half-birthday-calculator", label: "Half Birthday Calculator" },
    { path: "https://calculator-logical.com/shoe-size-calculator", label: "Shoe Size Calculator" },
    { path: "https://calculator-logical.com/box-fill-calculator", label: "Box Fill Calculator" },
    { path: "https://calculator-logical.com/gpm-calculator", label: "GPM Calculator" },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-5 my-10">
      <h2 className="text-[25px] font-bold mb-5">Everyday Life Calculators</h2>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {DailyLifeCalculators.map((item, index) => (
          <a
            key={index}
            href={item.path}
            className="group flex items-center justify-between px-5 py-4 border border-gray-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-blue-50"
          >
            <span className="text-[16px] font-medium text-gray-800 group-hover:text-blue-700">
              {item.label}
            </span>
            <svg
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
              width={10}
              height={14}
              viewBox="0 0 10 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 13L8 7L2 1"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ))}

        <a
          href="https://calculator-logical.com/everyday-Life"
          className="group flex items-center justify-between px-5 py-4 bg-blue-600 text-white rounded-2xl shadow-md transition-all duration-300 hover:bg-blue-700"
        >
          <span className="text-[16px] font-semibold">
            See more about Everyday Life
          </span>
          <svg
            className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
            width={10}
            height={14}
            viewBox="0 0 10 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 13L8 7L2 1"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default DailyLifeCalculators;

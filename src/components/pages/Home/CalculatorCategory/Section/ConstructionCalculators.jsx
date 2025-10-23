import React from "react";
import Link from "next/link";

const ConstructionCalculators = () => {
  const constructionCalculators = [
    { path: "https://calculator-logical.com/gravel-calculator", label: "Gravel Calculator" },
    { path: "https://calculator-logical.com/tank-volume-calculator", label: "Tank Volume Calculator" },
    { path: "https://calculator-logical.com/pipe-volume-calculator", label: "Pipe Volume Calculator" },
    { path: "https://calculator-logical.com/cylinder-volume-calculator", label: "Cylinder Volume Calculator" },
    { path: "https://calculator-logical.com/fence-calculator", label: "Fence Calculator" },
    { path: "https://calculator-logical.com/topsoil-calculator", label: "Top Soil Calculator" },
    { path: "https://calculator-logical.com/rebar-calculator", label: "Rebar Calculator" },
    { path: "https://calculator-logical.com/sod-calculator", label: "Sod Calculator" },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-5 my-10">
      <h2 className="text-[25px] font-bold mb-5">Construction Calculators</h2>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {constructionCalculators.map((item, index) => (
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
          href="https://calculator-logical.com/construction"
          className="group flex items-center justify-between px-5 py-4 bg-blue-600 text-white rounded-2xl shadow-md transition-all duration-300 hover:bg-blue-700"
        >
          <span className="text-[16px] font-semibold">
            See more about Construction
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

export default ConstructionCalculators;

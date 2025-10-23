import React from "react";
import Link from "next/link";

const ChemistryCalculators = () => {
  const chemistryCalculators = [
    { path: "https://calculator-logical.com/stp-calculator", label: "STP Calculator" },
    { path: "https://calculator-logical.com/ph-calculator", label: "pH Calculator" },
    { path: "https://calculator-logical.com/titration-calculator", label: "Titration Calculator" },
    { path: "https://calculator-logical.com/molarity-calculator", label: "Molarity Calculator" },
    { path: "https://calculator-logical.com/ppm-calculator", label: "PPM Calculator" },
    { path: "https://calculator-logical.com/molality-calculator", label: "Molality Calculator" },
    { path: "https://calculator-logical.com/pka-to-ph-calculator", label: "pKa to pH Calculator" },
    { path: "https://calculator-logical.com/cfu-calculator", label: "CFU Calculator" },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-5 my-10">
      <h2 className="text-[25px] font-bold mb-5">Chemistry Calculators</h2>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {chemistryCalculators.map((item, index) => (
          <a
            key={index}
            href={item.path}                // Use href for external links
            rel="noopener noreferrer"       // Security best practice
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

        {/* CTA Button */}
        <a
          href="https://calculator-logical.com/chemistry"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between px-5 py-4 bg-blue-600 text-white rounded-2xl shadow-md transition-all duration-300 hover:bg-blue-700"
        >
          <span className="text-[16px] font-semibold">
            See more about Chemistry
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

export default ChemistryCalculators;

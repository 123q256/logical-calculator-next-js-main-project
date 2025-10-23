import React from "react";
import Link from "next/link";

const PopularCalculators = () => {
  const calculators = [
    {
      path: "https://calculator-logical.com/bmi-calculator",
      label: "BMI Calculator",
    },
    {
      path: "https://calculator-logical.com/weightloss-calculator",
      label: "Weight Loss Calculator",
    },
    {
      path: "https://calculator-logical.com/tdee-calculator",
      label: "TDEE Calculator",
    },
    {
      path: "https://calculator-logical.com/calorie-deficit-calculator",
      label: "Calorie Deficit Calculator",
    },
    {
      path: "https://calculator-logical.com/percentage-calculator",
      label: "Percentage Calculator",
    },
    {
      path: "https://calculator-logical.com/fraction-calculator",
      label: "Fraction Calculator",
    },
    {
      path: "https://calculator-logical.com/integral-calculator",
      label: "Integral Calculator",
    },
    {
      path: "https://calculator-logical.com/ovulation-calculator",
      label: "Ovulation Calculator",
    },
    {
      path: "https://calculator-logical.com/pregnancy-calculator",
      label: "Pregnancy Calculator",
    },
  ];

  return (
    <div className="pb-10 px-5">
      <div className="max-w-[960px] mx-auto">
        <h2 className="text-[26px] font-bold text-blue-800 mb-6 text-center">
          🔥 Popular Calculators
        </h2>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          {calculators.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="flex justify-between items-center bg-green-50 border border-blue-300 rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-green-100 hover:border-green-500 transition-all duration-200"
            >
              <span className="text-green-800 font-medium group-hover:text-green-900">
                {item.label}
              </span>
              <svg
                className="ml-2 text-green-700 group-hover:text-green-900 transition-all"
                width={12}
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
        </div>
      </div>
    </div>
  );
};

export default PopularCalculators;

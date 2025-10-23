"use client";
import Link from "next/link";

const RelatedLinks = ({ links }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-4 sticky top-3 mt-[155px] mb-5">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Related Calculators
      </h2>
      <ul className="space-y-2">
        {links.slice(0, 6).map((link, index) => (
          <li key={index}>
            <a
              href={link.url}
              className="flex justify-between items-center px-4 py-3 rounded-lg bg-gray-50 hover:bg-[#2845F5] hover:text-white text-gray-700 font-medium transition-all duration-300 ease-in-out group bordered "
            >
              <span className="text-sm md:text-base">{link.title}</span>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-white transform group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedLinks;

"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const Menu = ({ setShowTools, showTools, toggleTools }) => {
  const currentPath = usePathname();
  const [isCategory, setIsCategory] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleCategoryDropdown = () => {
    setIsCategory(!isCategory);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsCategory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { path: "/health", img: "/category-images/cat1.svg", label: "Health" },
    { path: "/math", img: "/category-images/cat2.svg", label: "Math" },
    {
      path: "/everyday-Life",
      img: "/category-images/cat3.svg",
      label: "Everyday Life",
    },
    { path: "/finance", img: "/category-images/cat4.svg", label: "Finance" },
    { path: "/physics", img: "/category-images/cat5.svg", label: "Physics" },
    {
      path: "/chemistry",
      img: "/category-images/cat6.svg",
      label: "Chemistry",
    },
    {
      path: "/statistics",
      img: "/category-images/cat7.svg",
      label: "Statistics",
    },
    {
      path: "/construction",
      img: "/category-images/cat8.svg",
      label: "Construction",
    },
    { path: "/pets", img: "/category-images/cat9.svg", label: "Pets" },
    { path: "/timedate", img: "/category-images/cat10.svg", label: "Timedate" },
    {
      path: "/unit-converter",
      img: "/category-images/cat11.svg",
      label: "Conversion Calculator",
    },
  ];

  return (
    <ul className="flex flex-col font-medium mt-4 bg-white rounded-lg shadow-md lg:shadow-none lg:flex-row lg:space-x-6 lg:items-center lg:bg-transparent lg:mt-0">
      {/* HOME */}
      <li>
        <a
          href="/"
          className={`group flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
            currentPath === "/"
              ? "text-[#2845F5] bg-[#eef1ff]"
              : "text-gray-800 hover:text-[#2845F5]"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="group-hover:fill-[#2845F5]"
          >
            <path
              d="M16.0658 5.31522L11.5775 1.60418C10.0655 0.35415 7.93438 0.35415 6.42248 1.60418L1.9341 5.31522C1.12545 5.98382 0.666626 6.99753 0.666626 8.05524V13.8424C0.666626 15.7217 2.11175 17.3333 3.99996 17.3333H5.66663C6.5871 17.3333 7.33329 16.5872 7.33329 15.6667V12.9565C7.33329 11.9002 8.12671 11.1322 8.99996 11.1322C9.87321 11.1322 10.6666 11.9002 10.6666 12.9565V15.6667C10.6666 16.5872 11.4128 17.3333 12.3333 17.3333H14C15.8882 17.3333 17.3333 15.7217 17.3333 13.8424V8.05524C17.3333 6.99754 16.8745 5.98382 16.0658 5.31522Z"
              fill="currentColor"
            />
          </svg>
          <span>Home</span>
        </a>
      </li>

      {/* TOOLS */}
      {/* <li className="hidden lg:block relative">
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation();
            toggleTools(e);
          }}
          className={`group flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer ${
            showTools
              ? "text-[#2845F5] bg-[#eef1ff]"
              : "text-gray-800 hover:text-[#2845F5]"
          }`}
        >
          <img
            src={showTools ? "/icons/bluetools.svg" : "/icons/tools.svg"}
            alt={showTools ? "Tools expanded" : "Tools collapsed"}
            className="w-5"
          />
          <span>Tools</span>
          <svg
            className="w-3 h-3 ml-1 group-hover:stroke-[#2845F5]"
            viewBox="0 0 10 6"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
      </li> */}

      {/* CATEGORIES */}
      <li className="relative">
        <button
          ref={buttonRef}
          onClick={handleCategoryDropdown}
          className={`group flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer ${
            categories.some((cat) => currentPath.startsWith(cat.path))
              ? "text-[#2845F5] bg-[#eef1ff]"
              : "text-gray-800 hover:text-[#2845F5]"
          }`}
        >
          <img
            src={
              categories.some((cat) => currentPath.startsWith(cat.path))
                ? "/icons/bluecategory.svg"
                : "/icons/category.svg"
            }
            alt="category"
            className="w-5"
          />
          <span>Categories</span>
          <svg
            className="w-3 h-3 ml-1 group-hover:stroke-[#2845F5]"
            viewBox="0 0 10 6"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isCategory && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 px-3"
          >
            {categories.map(({ path, img, label }) => (
              <a
                key={path}
                href={path}
                onClick={handleCategoryDropdown}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition hover:bg-[#eef1ff] ${
                  currentPath === path ? "bg-[#eef1ff]" : ""
                }`}
              >
                <img src={img} alt={label} width="20" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        )}
      </li>

      {/* BLOG */}
      <li>
        <a
          href="/blog"
          className={`group flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
            currentPath.startsWith("/blog")
              ? "text-[#2845F5] bg-[#eef1ff]"
              : "text-gray-800 hover:text-[#2845F5]"
          }`}
        >
          <img
            src={
              currentPath.startsWith("/blog")
                ? "/icons/blueblog.svg"
                : "/icons/blog.svg"
            }
            className="w-5"
            alt="blog"
          />
          Blogs
        </a>
      </li>

      {/* CONTACT */}
      <li>
        <a
          href="/contact"
          className={`group flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
            currentPath === "/contact"
              ? "text-[#2845F5] bg-[#eef1ff]"
              : "text-gray-800 hover:text-[#2845F5]"
          }`}
        >
          <img
            src={
              currentPath === "/contact"
                ? "/icons/bluecontact.svg"
                : "/icons/contact.svg"
            }
            className="w-5"
            alt="contact"
          />
          Contact Us
        </a>
      </li>

      {/* SIGN UP (Mobile Only) */}
      {/* <li className="lg:hidden block mt-2">
        <a
          href="/register"
          className="block text-center px-4 py-2 text-white bg-[#1A1A1A] hover:bg-[#2845F5] rounded-md"
        >
          Sign Up
        </a>
      </li> */}

      {/* SIGN IN (Mobile Only) */}
      {/* <li className="lg:hidden block mt-2">
        <a
          href="/login"
          className="block text-center px-4 py-2 border border-black text-black hover:text-white hover:bg-[#2845F5] hover:border-[#2845F5] rounded-md"
        >
          Sign In
        </a>
      </li> */}
    </ul>
  );
};

export default Menu;

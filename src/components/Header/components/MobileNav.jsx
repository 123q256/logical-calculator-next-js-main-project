"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const MobileNav = ({ onClose, isOpen, dropdownRef }) => {
  const currentPath = usePathname();

  const categories = [
    { name: "Health", path: "/health", img: "/category-images/cat1.svg" },
    { name: "Math", path: "/math", img: "/category-images/cat2.svg" },
    {
      name: "Everyday Life",
      path: "/everyday-Life",
      img: "/category-images/cat3.svg",
    },
    { name: "Finance", path: "/finance", img: "/category-images/cat4.svg" },
    { name: "Physics", path: "/physics", img: "/category-images/cat5.svg" },
    { name: "Chemistry", path: "/chemistry", img: "/category-images/cat6.svg" },
    {
      name: "Statistics",
      path: "/statistics",
      img: "/category-images/cat7.svg",
    },
    {
      name: "Construction",
      path: "/construction",
      img: "/category-images/cat8.svg",
    },
    { name: "Pets", path: "/pets", img: "/category-images/cat9.svg" },
    { name: "Timedate", path: "/timedate", img: "/category-images/cat10.svg" },
  ];

  const getLinkClassName = (path) => {
    const isHome = path === "/";
    const isActive = isHome
      ? currentPath === "/"
      : currentPath.startsWith(path);

    return `${
      isActive
        ? "text-[#2845F5] bg-[#eef1ff]"
        : "hover:bg-[#eef1ff] hover:text-[#2845F5]"
    } flex gap-x-2 items-center w-full rounded-lg px-3 py-2 transition-colors duration-300 group`;
  };

  return (
    <div
      style={{ zIndex: 99999 }}
      className={`fixed top-0 left-0 h-screen p-4 overflow-y-auto transition-transform duration-1000 bg-white w-80 z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      ref={dropdownRef}
      tabIndex={-1}
    >
      <a
        href="/"
        onClick={onClose}
        className="flex items-center space-x-3 rtl:space-x-reverse mr-auto pl-2"
      >
        <img
          src="/logo.png"
          className="h-8"
          alt="Header-Logo"
          title="Header-Logo"
          loading="lazy"
        />
        <div className="pl-1">
          <span className="self-center text-[19px] font-semibold whitespace-nowrap">
            Calculator
          </span>
          <p className="self-center text-[15px] font-semibold whitespace-nowrap pl-2">
            Online
          </p>
        </div>
      </a>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center "
      >
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
        <span className="sr-only">Close menu</span>
      </button>

      <div className="header_b_border mt-2" />
      <div className="py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {/* Home */}
          <li className="my-2">
            <a href="/" onClick={onClose} className={getLinkClassName("/")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7m-9 5v6m0-6v6m0-6h3m0 6h3m0-6v6m0-6v6m0-6l7-7M5 12v6m0-6v6m0-6l7-7"
                />
              </svg>
              <span className="ms-3">Home</span>
            </a>
          </li>

          {/* Blog */}
          <li className="my-2">
            <a
              href="/blog"
              onClick={onClose}
              className={getLinkClassName("/blog")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h14M17 16l4-4m0 0l-4-4m4 4H7"
                />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Blogs</span>
            </a>
          </li>

          {/* Contact */}
          <li className=" my-2">
            <a
              href="/contact"
              onClick={onClose}
              className={getLinkClassName("/contact")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h11M9 21V9m0 0H4a2 2 0 00-2 2v4a2 2 0 002 2h4m2-8h8a2 2 0 012 2v4a2 2 0 01-2 2H9"
                />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Contact Us</span>
            </a>
          </li>

          {/* Categories */}
          <li>
            <p className="flex items-center p-2 text-white rounded-lg bg-[#2845F5]  group">
              <span className="flex-1 ms-3 whitespace-nowrap">
                All Category
              </span>
            </p>
          </li>
          {categories.map(({ name, path, img }) => (
            <li key={path} className="my-2">
              <a
                href={path}
                onClick={onClose}
                className={getLinkClassName(path)}
              >
                <span className="flex items-center transition-colors duration-300 group-hover:text-[#2845F5]">
                  <Image src={img} alt="image" width={19} height={19} />
                </span>
                <span className="transition-colors duration-300 group-hover:text-[#2845F5] ms-3">
                  {name}
                </span>
              </a>
            </li>
          ))}

          {/* Sign In */}
          {/* <li>
            <a
              href="/login"
              onClick={onClose}
              className={getLinkClassName("/login")}
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
            </a>
          </li> */}

          {/* Sign Up */}
          {/* <li>
            <a
              href="/signup"
              onClick={onClose}
              className={getLinkClassName("/signup")}
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
            </a>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default MobileNav;

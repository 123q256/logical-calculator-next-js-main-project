"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // replaces window.location
import { searchallcalculators } from "../../../../public/search";

export default function SearchBar({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  // handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = Object.values(searchallcalculators).filter(
      (item) => item[0].toLowerCase().includes(value)
    );

    const suggestionList = filteredSuggestions
      .map((item) => ({
        name: item[0],
        link: item[1],
        categories: item[2],
      }))
      .sort((a, b) => {
        const aStartsWith = a.name.toLowerCase().startsWith(value);
        const bStartsWith = b.name.toLowerCase().startsWith(value);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return 0;
      });

    setSuggestions(suggestionList);
  };

  // highlight search matches
  const highlightMatch = (name) => {
    if (!searchTerm) return name;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return name.replace(
      regex,
      (match) => `<strong className="text-black">${match}</strong>`
    );
  };

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!suggestions.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        router.push(`/${suggestions[selectedIndex].link}`);
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [suggestions, selectedIndex, router, onClose]);

  return (
    <div
      id="crypto-modal"
      tabIndex={-1}
      aria-hidden={!isOpen}
      className={`${
        isOpen ? "flex" : "hidden"
      } fixed top-0 right-0 left-0 serachbarzindex justify-center w-full md:inset-0 h-[100vh] max-h-full bg-black/50`}
      onClick={onClose}
    >
      <div
        className="relative p-4 lg:w-[50%] md:w-[80%] w-full top-35"
        onClick={(e) => e.stopPropagation()}
        ref={searchRef}
      >
        <div className="text-end">
          <button
            style={{ backgroundColor: "white", borderRadius: 20, zIndex: 99 }}
            onClick={onClose}
            className="close-modal absolute top-1 right-1 text-gray-500 hover:text-black focus:outline-none cursor-pointer"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Search input */}
          <div className="relative shrink-0 w-full mb-0">
            <input
              id="search_cal"
              name="search_cal"
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-4 pr-10 py-3 transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-white search_cal input_border"
              placeholder="Search Calculators..."
              style={{ height: 55 }}
            />
            <img
              src="/logo/search.svg"
              className="absolute top-5 right-3 cursor-pointer searchsvg"
              alt="search"
              title="search"
            />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="relative">
              <ul
                id="suggestion"
                style={{ zIndex: 99 }}
                className="absolute autosearchcomplete-items space-y-1 max-h-80 overflow-y-auto text-start bg-white rounded-lg shadow-inner w-full"
              >
                {suggestions.map((item, index) => (
                  <a
                    href={`/${item.link}`}
                    key={index}
                    className={`flex justify-between items-center p-2 bordered rounded hover:shadow-sm hover:bg-gray-50 ${
                      selectedIndex === index ? "bg-gray-200" : ""
                    }`}
                  >
                    {/* Left side: Calculator name */}
                    <li
                      className="text-gray-800 px-2"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(item.name),
                      }}
                    />

                    {/* Right side: Category */}
                    {item.categories && (
                      <div className="flex items-center">
                        <span className="css-4nlqs">•</span>
                        <span className="text-xs text-gray-500 italic ml-1 px-1 font-bold whitespace-nowrap">
                          {item.categories}
                        </span>
                      </div>
                    )}
                  </a>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { searchallcalculators } from "../../../../../public/search";
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [placeholderText, setPlaceholderText] = useState("");
  const searchRef = useRef(null);

  const typedStrings = [
    "BMI Calculator",
    "Weight Loss Calculator",
    "Age Calculator",
    "TDEE Calculator",
    "Calorie Deficit Calculator",
    "Percentage Calculator",
    "Fraction Calculator",
    "Integral Calculator",
    "Limit Calculator",
  ];

  let currentStringIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;

  const typeEffect = () => {
    const currentString = typedStrings[currentStringIndex];
    if (isDeleting) {
      setPlaceholderText(currentString.substring(0, currentCharIndex - 1));
      currentCharIndex--;
      if (currentCharIndex === 0) {
        isDeleting = false;
        currentStringIndex = (currentStringIndex + 1) % typedStrings.length;
      }
    } else {
      setPlaceholderText(currentString.substring(0, currentCharIndex + 1));
      currentCharIndex++;
      if (currentCharIndex === currentString.length) {
        isDeleting = true;
      }
    }
    setTimeout(typeEffect, isDeleting ? 100 : 250);
  };

  useEffect(() => {
    typeEffect();
  }, []);

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

  const highlightMatch = (name) => {
    if (!searchTerm) return name;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return name.replace(
      regex,
      (match) => `<strong className="text-black">${match}</strong>`
    );
  };

  // Close suggestions if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

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
        const selectedLink = `/${suggestions[selectedIndex].link}`;
        window.location.href = selectedLink; // for navigation
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [suggestions, selectedIndex]);

  return (
    <div ref={searchRef} className="max-w-[670px] mx-auto mt-2">
      <div className="w-full mx-auto px-5 lg:py-2 md:py-2 py-1">
        <label htmlFor="search-bars" className="sr-only">
          Search Calculators
        </label>
        <div className="flex items-center relative rounded-md bg-white shadow-sm bordered transition-all duration-200">
          <input
            id="search-bars"
            name="search-bars"
            ref={inputRef}
            type="text"
            placeholder={placeholderText || "Search calculators..."}
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search calculators"
            className="w-full rounded-md pl-5 pr-10 py-3 bg-white text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0"
          />
          <span className="absolute right-4 text-gray-400">
            <svg
              width={16}
              height={15}
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.14864 0C3.43837 0 0.416016 3.02132 0.416016 6.73034C0.416016 10.4393 3.43837 13.4665 7.14864 13.4665C8.7334 13.4665 10.1909 12.9113 11.3428 11.9895L14.1472 14.7915C14.2888 14.9271 14.4778 15.002 14.6738 15C14.8698 14.998 15.0573 14.9193 15.196 14.7808C15.3347 14.6423 15.4137 14.4551 15.416 14.2591C15.4182 14.0632 15.3437 13.8741 15.2082 13.7324L12.4038 10.929C13.3267 9.77569 13.8827 8.3164 13.8827 6.73034C13.8827 3.02132 10.8589 0 7.14864 0ZM7.14864 1.49598C10.0502 1.49598 12.3848 3.82981 12.3848 6.73034C12.3848 9.63087 10.0502 11.9706 7.14864 11.9706C4.24712 11.9706 1.91248 9.63087 1.91248 6.73034C1.91248 3.82981 4.24712 1.49598 7.14864 1.49598Z"
                fill="#6B7280"
              />
            </svg>
          </span>
        </div>

        {suggestions.length > 0 && (
          <div className="relative">
            <ul
              id="suggestion"
              style={{ zIndex: 99 }}
              className="absolute autosearchcomplete-items bordered space-y-1 max-h-80 overflow-y-auto text-start bg-white rounded-lg shadow-inner mt-[5px] w-full"
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
  );
};

export default SearchBar;

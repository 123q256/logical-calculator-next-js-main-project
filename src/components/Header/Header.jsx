"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Menu from "./components/Menu";
import MobileNav from "./components/MobileNav";
import { useGetSingleCalculatorLanguageQuery } from "../../redux/services/calculator/calculatorApi";
import { countryMapping, svgs } from "../../data/CountryLanguage.jsx";
import SearchBar from "./components/SearchBar.jsx";

const Header = () => {
  const pathname = usePathname();
  const [isCategory, setIsCategory] = useState(false);
  useEffect(() => {
    setShowTools(false);
    setIsCategory(false);
  }, [pathname]);

  const [isMobileNav, setIsMobileNav] = useState(false);
  const dropdownRef = useRef(null);

  const handleMobileNavDropdown = () => {
    setIsMobileNav(!isMobileNav);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMobileNav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isLanguage, setIsLanguage] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const isLanguageRef = useRef(null);

  const handleLanguageDropdown = () => {
    setIsLanguage((prev) => !prev);
  };
  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setIsLanguage(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isLanguageRef.current &&
        !isLanguageRef.current.contains(event.target)
      ) {
        setIsLanguage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const url = pathname;
  const segments = url.split("/");
  const lastSlug = segments[segments.length - 1];
  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
  const { data: getSingleCalculatorLanguage } =
    useGetSingleCalculatorLanguageQuery(lastSlug);

  // console.log(getSingleCalculatorLanguage);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/")) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [pathname]);

  const [showTools, setShowTools] = useState(false);
  const toolsRef = useRef(null);
  const menuButtonRef = useRef(null);

  const toggleTools = (e) => {
    e?.stopPropagation();
    setShowTools(!showTools);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        toolsRef.current &&
        !toolsRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setShowTools(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const categories = [
    {
      href: "/Health",
      imageSrc: "/category-images/tool6.svg",
      altText: "Health",
      title: "Health",
      tools: [
        ["BMI Calculator", "bmi-calculator"],
        ["TDEE Calculator", "tdee-calculator"],
        ["Height Calculator", "height-calculator"],
        ["Weightloss Calculator", "weightloss-calculator"],
        ["BMR Calculator", "bmr-calculator"],
        ["Macro Calculator", "macro-calculator"],
        ["Body Shape Calculator", "body-shape-calculator"],
        ["Calorie Deficit Calculator", "calorie-deficit-calculator"],
        ["View All  Tools", "Health"],
      ],
    },
    {
      href: "/Math",
      imageSrc: "/category-images/tool1.svg",
      altText: "Math",
      title: "Math",
      tools: [
        ["Fraction Calculator", "fraction-calculator"],
        ["Percentage Calculator", "percentage-calculator"],
        ["Vertex Form Calculator", "vertex-form-calculator"],
        ["Synthetic Division Calculator", "synthetic-division-calculator"],
        ["Mixed Number Calculator", "mixed-number-calculator"],
        ["Factoring Calculator", "factoring-calculator"],
        ["Circumference Calculator", "circumference-calculator"],
        ["Parabola Calculator", "parabola-calculator"],
        ["View All  Tools", "Math"],
      ],
    },
    {
      href: "/Everyday-Life",
      imageSrc: "/category-images/tool8.svg",
      altText: "Everyday Life",
      title: "Everyday Life",
      tools: [
        ["Age Calculator", "age-calculator"],
        ["Birthday Calculator", "birthday-calculator"],
        ["Distance Calculator", "distance-calculator"],
        ["Age Difference Calculator", "age-difference-calculator"],
        ["Half Birthday Calculator", "half-birthday-calculator"],
        ["Anniversary Calculator", "anniversary-calculator"],
        ["Screen Size Calculator", "screen-size-calculator"],
        ["Love Calculator", "love-calculator"],
        ["View All  Tools", "Everyday-Life"],
      ],
    },
    {
      href: "/Finance",
      imageSrc: "/category-images/tool5.svg",
      altText: "Finance",
      title: "Finance",
      tools: [
        ["Roas Calculator", "roas-calculator"],
        ["Gratuity Calculator", "gratuity-calculator"],
        ["Salary Calculator", "salary-calculator"],
        ["Overtime Calculator", "overtime-calculator"],
        ["Tip Calculator", "tip-calculator"],
        ["Income Tax Calculator", "tax-calculator"],
        ["Stock Calculator", "stock-calculator"],
        ["CPM Calculator", "cpm-calculator"],
        ["View All  Tools", "Finance"],
      ],
    },
    {
      href: "/Physics",
      imageSrc: "/category-images/tool4.svg",
      altText: "Physics",
      title: "Physics",
      tools: [
        ["Velocity Calculator", "velocity-calculator"],
        ["Acceleration Calculator", "acceleration-calculator"],
        ["Kinematics Calculator", "kinematics-calculator"],
        ["Kinetic Energy Calculator", "kinetic-energy-calculator"],
        ["Momentum Calculator", "momentum-calculator"],
        ["Force Calculator", "force-calculator"],
        ["Work Calculator", "work-calculator"],
        ["Ohms Law Calculator", "ohms-law-calculator"],
        ["View All  Tools", "Physics"],
      ],
    },
    {
      href: "/Chemistry",
      imageSrc: "/category-images/tool2.svg",
      altText: "Chemistry",
      title: "Chemistry",
      tools: [
        ["Ideal Gas Law Calculator", "ideal-gas-law-calculator"],
        ["Percent Yield Calculator", "percent-yield-calculator"],
        ["Molar Mass Calculator", "molar-mass-calculator"],
        ["Charles Law Calculator", "charles-law-calculator"],
        ["Molarity Calculator", "molarity-calculator"],
        ["pH Calculator", "ph-calculator"],
        ["Mole Calculator", "mole-calculator"],
        ["Entropy Calculator", "entropy-calculator"],
        ["View All  Tools", "Chemistry"],
      ],
    },
    {
      href: "/Statistics",
      imageSrc: "/category-images/tool7.svg",
      altText: "Statistics",
      title: "Statistics",
      tools: [
        ["Standard Deviation Calculator", "standard-deviation-calculator"],
        ["Probability Calculator", "probability-calculator"],
        ["Percentile Calculator", "percentile-calculator"],
        ["Covariance Calculator", "covariance-calculator"],
        ["Geometric Mean Calculator", "geometric-mean-calculator"],
        ["Harmonic Mean Calculator", "harmonic-mean-calculator"],
        ["Variance Calculator", "variance-calculator"],
        ["Z-Score Calculator", "z-score-calculator"],
        ["View All  Tools", "Statistics"],
      ],
    },
    {
      href: "/Construction",
      imageSrc: "/category-images/cat8.svg",
      altText: "Construction",
      title: "Construction",
      tools: [
        ["Gravel Calculator", "gravel-calculator"],
        ["Mulch Calculator", "mulch-calculator"],
        ["Sand Calculator", "sand-calculator"],
        ["Concrete Calculator", "concrete-calculator"],
        ["Rebar Calculator", "rebar-calculator"],
        ["Carpet Calculator", "carpet-calculator"],
        ["Paver Calculator", "paver-calculator"],
        ["Fence Calculator", "fence-calculator"],
        ["View All  Tools", "Construction"],
      ],
    },
    {
      href: "/Timedate",
      imageSrc: "/category-images/cat10.svg",
      altText: "Timedate",
      title: "Timedate",
      tools: [
        ["Date Calculator", "date-calculator"],
        ["Time Calculator", "time-calculator"],
        ["Time Difference Calculator", "time-difference-calculator"],
        ["Date Duration Calculator", "date-duration-calculator"],
        ["Time Duration Calculator", "time-duration-calculator"],
        ["Hours Calculator", "hours-calculator"],
        ["Week Calculator", "week-calculator"],
        ["Business Days Calculator", "bussiness-days-calculator"],
        ["View All  Tools", "Timedate"],
      ],
    },
    {
      href: "/Pets",
      imageSrc: "/category-images/cat9.svg",
      altText: "Pets",
      title: "Pets",
      tools: [
        ["Puppy Age Calculator", "puppy-age-calculator"],
        ["Peason Age Calculator", "pearson-age-calculator"],
        ["Dog Age Calculator", "dog-age-calculator"],
        ["Cat Age Calculator", "cat-age-calculator"],
        ["Dog Pregnancy Calculator", "dog-pregancy-calculator"],
        ["Dog Crate Size Calculator", "dog-crate-size-calculator"],
        ["Cat Calorie Calculator", "cat-calorie-calculator"],
        ["Dog Food Calculator", "dog-food-calculator"],
        ["View All  Tools", "Pets"],
      ],
    },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const visible = 4;

  const showPrev = () => {
    setStartIndex(Math.max(startIndex - visible, 0));
  };
  const showNext = () => {
    setStartIndex(Math.min(startIndex + visible, categories.length - visible));
  };
  return (
    <>
      <nav className="bg-white">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
          <a
            href="/"
            className="flex items-center space-x-2 rtl:space-x-reverse mr-auto"
          >
            <img
              src="/logo.png"
              className="h-8"
              alt="Header-Logo"
              title="Header-Logo"
              loading="lazy"
            />
            <div className="lg:pl-1 md:pl-1">
              <span className="self-center lg:text-[19px] text-[14px] font-bold whitespace-nowrap">
                Calculator
              </span>
              <p className="self-center lg:text-[15px] text-[12px] font-bold whitespace-nowrap pl-2">
                Logical
              </p>
            </div>
          </a>
          <div className="flex gap-2 ">
            <div className="pr-btn">
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                }}
                className="open-modal premium-btn bg-[#1A1A1A] lg:hidden  text-[#fff] hover:bg-[#2845F5] hover:text-white duration-200 font-[600] text-[14px] rounded-[25px] px-4 py-3 cursor-pointer"
              >
                Search
              </button>
            </div>
            <button
              onClick={() => {
                handleMobileNavDropdown();
              }}
              className="text-white lg:hidden bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 cursor-pointer"
              type="button"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            {isMobileNav && (
              <MobileNav
                onClose={() => {
                  handleMobileNavDropdown();
                }}
                isOpen={isMobileNav}
                dropdownRef={dropdownRef}
              />
            )}
          </div>

          <div
            className="hidden w-full lg:block lg:w-auto justify-center relative"
            id="navbar-dropdown"
            ref={menuButtonRef}
          >
            <Menu
              showTools={showTools}
              setShowTools={setShowTools}
              toggleTools={toggleTools}
            />
          </div>

          {showTools && (
            <div
              className="w-full mx-auto absolute z-60 top-[90px] right-0 hidden lg:block"
              ref={toolsRef}
            >
              <div className="flex items-center justify-between bg-white w-[90%] mx-auto">
                <button
                  onClick={showPrev}
                  disabled={startIndex === 0}
                  className={`p-1 mr-2 bg-[#2845F5] rounded-full hidden lg:block ${
                    startIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="w-full overflow-hidden shadow">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${
                        startIndex * (100 / visible)
                      }%)`,
                    }}
                  >
                    {categories.map((cat, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg"
                        style={{ minWidth: `${100 / visible}%` }}
                      >
                        <div className="flex items-center mb-3">
                          <img
                            src={cat.imageSrc}
                            alt={cat.altText}
                            className="w-6 h-6 object-contain mr-2"
                          />
                          <p className="font-bold text-lg">{cat.title}</p>
                        </div>
                        <ul className="list-disc list-inside text-sm space-y-3 text-black">
                          {cat.tools?.map(([label, path], index) => (
                            <li key={path}>
                              <a
                                href={`/${path}`}
                                className={`hover:underline ${
                                  index === 8
                                    ? "text-[#2845F5] font-bold text-[14px]"
                                    : "text-[#000000]"
                                }`}
                              >
                                {label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={showNext}
                  disabled={startIndex + visible >= categories.length}
                  className={`p-1 ml-2 bg-[#2845F5] rounded-full hidden lg:block  ${
                    startIndex + visible >= categories.length
                      ? "opacity-40 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="lg:flex hidden gap-x-[14px] ml-auto ">
            <button
              id="scrollToTopBtn"
              onClick={() => {
                setIsSearchOpen(true);
              }}
              className="open-modal premium-btn11 bg-[#1A1A1A]  text-[#fff] hover:bg-[#2845F5] hover:text-white duration-200 font-[600] text-[14px] rounded-[25px] px-4 py-3 cursor-pointer"
            >
              Search
            </button>
            {/* <a
              href="/login"
              className="bg-transparent border border-black items-center font-[700] hover:border-[#2845F5] text-[#000] hover:bg-[#2845F5] hover:text-white duration-200 text-[14px] rounded-[25px] px-4 py-3"
            >
              Sign In
            </a> */}
          </div>
        </div>
      <div className="header_b_border" />
        {isSearchOpen && (
          <SearchBar
            onClose={() => setIsSearchOpen(false)}
            isOpen={isSearchOpen}
          />
        )}
      </nav>
    </>
  );
};

export default Header;

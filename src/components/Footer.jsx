import React from "react";
import Link from "next/link";

const Footer = () => {
  const categories = [
    { name: "Health", link: "/health" },
    { name: "Math", link: "/math" },
    { name: "Everyday-Life", link: "/everyday-Life" },
    { name: "Finance", link: "/finance" },
    { name: "Physics", link: "/physics" },
    { name: "Chemistry", link: "/chemistry" },
    { name: "Statistics", link: "/statistics" },
    { name: "Construction", link: "/construction" },
    { name: "Pets", link: "/pets" },
    { name: "Timedate", link: "/timedate" },
    { name: "Conversion Calculator", link: "/unit-converter" },
  ];

  return (
    <footer className="bg-[#1A1A1A] ">
      <div
        className="mx-auto max-w-screen-xl lg:p-4 md:p-4 p-[25px] pb-6 pt-10 lg:pb-8 lg:pt-10"
        style={{
          backgroundImage: `url("/images_app/footer-bg-img.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="md:flex md:justify-between w-full">
          {/* Left side with logo and description */}
          <div className="mb-6 md:mb-0 md:w-[40%] w-full">
            <a
              href="/"
              className="flex items-center space-x-4 rtl:space-x-reverse w-[40%]"
            >
              <img
                src="/logo/logo-dark.png"
                className="h-10"
                title="Footer-Logo"
                alt="Footer-Logo"
                loading="lazy"
              />
              <div>
                <span className="font-[500] text-[24px] leading-[36.46px] tracking-wide text-white">
                  Calculator
                </span>
                <p className="font-[500] text-[17px] tracking-wide text-white pl-2">
                  Logical
                </p>
              </div>
            </a>

            <div className="lg:w-[380px] my-7">
              <p className="text-[16px] text-opacity-90 leading-[30px] text-white">
                Experience effortless calculations for any need with our
                comprehensive Logical calculator resource. Whether you're
                solving simple equations or complex formulas, our platform is
                designed to make every calculation easy and accessible.
              </p>
            </div>

            <div className="flex gap-x-6 items-center mt-12">
              <div className="w-[30px] h-[30px] flex justify-center items-center">
                <img src="/logo/linkedin.svg" title="linkedin" alt="linkedin" />
              </div>
              <div className="w-[30px] h-[30px] flex justify-center items-center">
                <img src="/logo/pointer.svg" title="pointer" alt="pointer" />
              </div>
              <div className="w-[30px] h-[30px] flex justify-center items-center">
                <a
                  href="https://www.facebook.com/profile.php?id=61577205635903"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/logo/facebook.svg" title="facebook" alt="facebook" />
                </a>
              </div>
            </div>
          </div>

          {/* Right side with links */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 md:w-[60%] w-full">
            {/* Calculators */}
            <div>
              <p className="py-3 mb-3 text-[16px] font-[500] leading-[20.83px] text-[#F7BB0D]">
                Calculators
              </p>
              <ul className="text-[#C8C8C8] leading-[20.83px] text-[16px]">
                {categories.map((category, index) => (
                  <li key={index} className="mb-2">
                    <a className="hover:underline" href={category.link}>
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <p className="py-3 mb-3 text-[16px] font-[500] leading-[20.83px] text-[#F7BB0D]">
                Quick Links
              </p>
              <ul className="text-[#C8C8C8] leading-[20.83px] text-[16px]">
                <li className="mb-2">
                  <a className="hover:underline" href="/">
                    Home
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="hover:underline"
                    href="/content-disclaimer"
                  >
                    Content Disclaimer
                  </a>
                </li>
                <li className="mb-2">
                  <a className="hover:underline" href="/terms-of-service">
                    Terms and conditions
                  </a>
                </li>
                <li className="mb-2">
                  <a className="hover:underline" href="/privacy-policy">
                    Privacy policy
                  </a>
                </li>
                <li className="mb-2">
                  <a className="hover:underline" href="/editorial">
                    Editorial Policies
                  </a>
                </li>
              </ul>
            </div>

            {/* Keep in Touch */}
            <div>
              <p className="py-3 mb-3 text-[16px] font-[500] leading-[20.83px] text-[#F7BB0D]">
                Keep in Touch
              </p>
              <ul className="leading-[20.83px] text-[#C8C8C8] text-[16px]">
                <li className="mb-2">
                  <a className="hover:underline" href="/about">
                    About Us
                  </a>
                </li>
                <li className="mb-2">
                  <a className="hover:underline" href="/contact">
                    Contact Us
                  </a>
                </li>
                <li className="mb-2">
                  <a className="hover:underline" href="/feedback">
                    Feedback
                  </a>
                </li>
                <li className="mt-2 mb-[18px] hover:text-[#fff] duration-300">
                  <a className="hover:underline" href="/blog">
                    Blogs
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <hr className="my-6 w-full border-white lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-center">
          <span className="text-[16px] text-[#AEAEAE] sm:text-center">
            © 2025{" "}
            <a href="/" className="hover:underline">
              Calculator Logical
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

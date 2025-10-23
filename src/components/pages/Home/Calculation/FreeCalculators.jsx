import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { footerbgimg, unlock_img } from "../../../assets/images";

const FreeCalculators = () => {
  useEffect(() => {
    const handleClick = (e) => {
      e.preventDefault();
      const target = document.getElementById("targetDiv");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    const scrollLink = document.querySelector(".scroll-link");
    if (scrollLink) {
      scrollLink.addEventListener("click", handleClick);
    }
    return () => {
      if (scrollLink) {
        scrollLink.removeEventListener("click", handleClick);
      }
    };
  }, []);

  return (
    <div className="bg-[#1A1A1A]">
      <div
        className="max-w-[1140px] mx-auto px-5 my-10 py-14"
        style={{
          backgroundImage: `url(${footerbgimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex lg:flex-row flex-col">
          <div className="lg:w-[50%]">
            <h2 className="lg:text-[46px] md:text-[46px] text-[35px] md:leading-[59.89px] lg:leading-[47.89px] font-[600] tracking-wider text-white">
              All Calculators <br className="hidden lg:block md:block" />
              <span className="text-[#F7BB0D]">Free</span>
            </h2>
            <p className="text-[16px] text-white text-opacity-90 leading-[28.83px] text-justify lg:mt-8 md:mt-8 mt-6 mb-6">
              Explore a comprehensive range of free calculators designed to meet
              your daily needs. Whether it’s health, finance, or academic
              assistance, our tools deliver quick and accurate results, helping
              you make well-informed decisions effortlessly. Start solving
              today!
            </p>
            <div className="flex gap-x-6">
              <a
                href="javascript:void(0);"
                className="bg-transparent scroll-link border border-white hover:border-[#F7BB0D] text-white hover:bg-[#F7BB0D] hover:text-black duration-200 text-[16px] rounded-[44px] px-6 py-3.5"
              >
                All Category
              </a>
            </div>
          </div>
          <div className="lg:w-[50%] lg:flex hidden justify-end">
            <img src={unlock_img} alt="unlock_img" title="unlock_img" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeCalculators;

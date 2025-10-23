"use client";

import Image from "next/image";

export default function NotFound() {
  return (
    <div className="max-w-[90%] mx-auto lg:px-0 px-5 my-[50px]">
      <div className="max-w-[1660px]">
        {/* Left blue blur */}
        <div
          className="absolute z-10 top-[120px] left-[0px] sm:w-[60%] sm:left-[20px] sm:top-[200px] md:w-[70%] md:left-[0px] md:top-[500px] lg:w-[80%] lg:left-[100px]"
          style={{
            maxWidth: 351,
            height: 351,
            flexShrink: 0,
            borderRadius: 351,
            opacity: "0.4",
            background: "#2845f5",
            filter: "blur(79px)",
            zIndex: -1,
          }}
        ></div>

        {/* Right blue blur */}
        <div
          className="absolute z-10 top-[30px] right-[0px] sm:w-[60%] sm:right-[20px] sm:top-[120px] md:w-[70%] md:right-[0px] md:top-[400px] lg:w-[80%] lg:right-[100px]"
          style={{
            maxWidth: 351,
            height: 351,
            flexShrink: 0,
            borderRadius: 351,
            opacity: "0.4",
            background: "#2845f5",
            filter: "blur(79px)",
            zIndex: -1,
          }}
        ></div>
      </div>

      <div className="justify-center">
        {/* Error Image */}
        <div className="flex justify-center w-full text-center z-50 blog_detail_image">
          <img
            src="/images_app/404.svg"
            className="lg:w-[50%] md:w-[50%] w-[100%]"
            alt="404 Error Image"
          />
        </div>

        {/* Text */}
        <div className="w-full text-center z-50 blog_detail_image">
          <h1 className="lg:text-[36px] md:text-[36px] text-[30px] font-bold lg:pt-10 md:pt-10 pt-5">
            Oops! Page Not Found
          </h1>
          <p className="max-w-[753px] w-[100%] text-center mx-auto font-medium text-[16px] pt-5">
            We're sorry, but the page you're looking for doesn't exist.
          </p>
          <p className="max-w-[753px] w-[100%] text-center mx-auto font-medium text-[16px] pt-5">
            You can return to the homepage.
          </p>

          {/* Button */}
          <div className="lg:flex md:flex justify-center mt-10">
            <a href="/">
              <button className="bg-[#2845F5] w-[170px] h-[55px] shadow-2xl mb-8 text-[#fff] hover:bg-[#1A1A1A] hover:text-white duration-200 font-[600] text-[16px] rounded-[44px] px-5 py-3 cursor-pointer">
                Go to Homepage
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

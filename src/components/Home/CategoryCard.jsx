"use client";

import Link from "next/link";

const CategoryCard = ({ href, imageSrc, altText, title1, title2 }) => {
  return (
    <Link href={href} passHref>
      <div
        className="bg-[#2845F5] group text-center justify-center rounded-[20px] p-4 hover:shadow-2xl transition-transform cursor-pointer"
        style={{
          boxShadow: "0px 0px 20px 0px #00000026",
        }}
      >
        <div className="flex justify-center items-center rounded-full">
          <img src={imageSrc} alt={altText} width="50px" />
        </div>
        <p className="text-[16px] mt-3 tracking-wide text-white text-opacity-90 font-[600] leading-[33.85px]">
          {title1}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;

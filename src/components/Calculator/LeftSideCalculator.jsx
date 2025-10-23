import React from "react";

const LeftSideCalculator = ({ children, showRight }) => {
  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        showRight ? "w-full md:w-[70%] lg:w-[70%] mt-4" : "w-full mt-4"
      }`}
    >
      {children}
    </div>
  );
};

export default LeftSideCalculator;

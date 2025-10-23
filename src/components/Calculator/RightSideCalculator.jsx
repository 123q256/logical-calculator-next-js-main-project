import React from "react";

const RightSideCalculator = ({ children, showRight }) => {
  return (
    <div
       className={`transition-all lg:block md:block hidden duration-500 ease-in-out ${
            showRight ? "w-0 md:w-[25%] lg:w-[25%] ml-5" : "w-0 overflow-hidden"
          }`}
    >
      {children}
    </div>
  );
};

export default RightSideCalculator;

import React from "react";

const CalculatorWrap = ({ children }) => {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-wrap mx-4 justify-center">{children}</div>
    </div>
  );
};

export default CalculatorWrap;

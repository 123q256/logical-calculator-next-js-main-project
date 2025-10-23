import React from "react";

const CalculatorTitle = ({ name, description }) => {
  return (
    <div className="container-fluid mx-auto">
      <div className="max-w-screen-xl mx-auto rounded-lg">
        <h1 className="text-2xl lg:text-3xl md:text-3xl font-semibold">
          {name}
        </h1>
        <p className="text-[14px] mt-2 px-2" id="after_title_line">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CalculatorTitle;

import React from "react";

const FormWrap = ({ children }) => {
  return (
    <div className="set_resultbox lg:pb-0 pt-2 md:pb-0 pb-0 xl:px-2 px-2 bg-white xl:rounded-[25px] lg:rounded-[20px] rounded-[16px] w-full relative" 
    style={{ boxShadow: "0px 0px 20px 4px #0000001a" }}>
      
      {children}
    </div>
  );
};
// border-2 lg:pb-4 pt-5 md:pb-4 pb-3 xl:px-5 lg:px-4 px-2 border-[#1A1A1A] bg-white xl:rounded-[25px] lg:rounded-[20px] rounded-[16px] w-full relative
export default FormWrap;

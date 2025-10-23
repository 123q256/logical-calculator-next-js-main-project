import React from "react";

const ResetButton = ({
  type = "button",
  className = "",
  children,
  onClicked,
  isLoading = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`calculate bg-[#1A1A1A] shadow-2xl text-[#fff] hover:bg-[#2845F5] hover:text-white duration-200 font-[600] md:text-[16px] text-[14px]  rounded-[44px] px-5 py-3 cursor-pointer`}
      disabled={isLoading}
      onClick={onClicked}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-[#99EA48]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default ResetButton;

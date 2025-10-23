"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useMidpointCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
const BaseCalculator = () => {
  // data get
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean); // remove empty strings

  let url = "";

  if (parts.length === 1) {
    // sirf ek part
    url = parts[0]; // "age-calculator"
  } else {
    // do ya zyada parts
    url = parts[0] + "/" + parts[1]; // "de/age-calculator"
  }
  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();
  const handleFetchDetails = async () => {
    try {
      // Call the mutation with the `tech_calculator_link`
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };
  useEffect(() => {
    handleFetchDetails();
  }, [url]);
  // data get

  // RTK mutation hook   // data get
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMidpointCalculatorMutation();
  // data get

  const [formData, setFormData] = useState({
    tech_tool: "calculator",
    tech_bnr_third: "101",
    tech_select_base: "12",
    tech_to_number: "2",
    tech_bnr_frs: "54f",
    tech_bnr_slc: "add",
    tech_bnr_sec: "54f",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const options = [
    { value: "1", name: "1" },
    { value: "2", name: "2 (Binary)" },
    { value: "3", name: "3" },
    { value: "4", name: "4" },
    { value: "5", name: "5" },
    { value: "6", name: "6" },
    { value: "7", name: "7" },
    { value: "8", name: "8 (Octal)" },
    { value: "9", name: "9" },
    { value: "10", name: "10 (Decimal)" },
    { value: "11", name: "11" },
    { value: "12", name: "12" },
    { value: "13", name: "13" },
    { value: "14", name: "14" },
    { value: "15", name: "15" },
    { value: "16", name: "16 (Hexadecimal)" },
    { value: "17", name: "17" },
    { value: "18", name: "18" },
    { value: "19", name: "19" },
    { value: "20", name: "20" },
    { value: "21", name: "21" },
    { value: "22", name: "22" },
    { value: "23", name: "23" },
    { value: "24", name: "24" },
    { value: "25", name: "25" },
    { value: "26", name: "26" },
    { value: "27", name: "27" },
    { value: "28", name: "28" },
    { value: "29", name: "29" },
    { value: "30", name: "30" },
    { value: "31", name: "31" },
    { value: "32", name: "32" },
    { value: "33", name: "33" },
    { value: "34", name: "34" },
    { value: "35", name: "35" },
    { value: "36", name: "36" },
  ];

  // Get allowed characters for input validation based on number base
  const getAllowedCharsForBase = (base) => {
    const baseNum = parseInt(base, 10);
    const chars = [];

    // Add digits 0-9
    for (let i = 0; i < Math.min(baseNum, 10); i++) {
      chars.push(String.fromCharCode(48 + i)); // 48 is ASCII for '0'
    }

    // Add letters A-Z for bases > 10
    if (baseNum > 10) {
      for (let i = 10; i < baseNum; i++) {
        chars.push(String.fromCharCode(65 + (i - 10))); // 65 is ASCII for 'A'
        chars.push(String.fromCharCode(97 + (i - 10))); // 97 is ASCII for 'a'
      }
    }

    return chars;
  };

  // Validate input based on selected base
  const validateInput = (value, base) => {
    if (!value) return true;

    const allowedChars = getAllowedCharsForBase(base);
    const upperValue = value.toUpperCase();

    for (let char of upperValue) {
      if (
        !allowedChars.includes(char) &&
        !allowedChars.includes(char.toLowerCase())
      ) {
        return false;
      }
    }
    return true;
  };

  // Handle keypress events for input validation
  const handleKeyPress = (e, inputType) => {
    const base =
      inputType === "third"
        ? formData.tech_to_number
        : formData.tech_select_base;
    const allowedChars = getAllowedCharsForBase(base);
    const char = e.key.toUpperCase();

    // Allow backspace, delete, arrow keys, etc.
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Tab"
    ) {
      return;
    }

    // Check if the character is allowed for this base
    if (
      !allowedChars.includes(char) &&
      !allowedChars.includes(char.toLowerCase())
    ) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate input for number fields
    if (name === "tech_bnr_frs" || name === "tech_bnr_sec") {
      if (!validateInput(value, formData.tech_select_base)) {
        return; // Don't update if invalid
      }
    } else if (name === "tech_bnr_third") {
      if (!validateInput(value, formData.tech_to_number)) {
        return; // Don't update if invalid
      }
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_bnr_frs || !formData.tech_bnr_sec) {
      setFormError("Please fill in both numbers.");
      return;
    }

    // Validate inputs
    if (!validateInput(formData.tech_bnr_frs, formData.tech_select_base)) {
      setFormError(
        `Invalid characters for base ${formData.tech_select_base} in first number.`
      );
      return;
    }

    if (!validateInput(formData.tech_bnr_sec, formData.tech_select_base)) {
      setFormError(
        `Invalid characters for base ${formData.tech_select_base} in second number.`
      );
      return;
    }

    setFormError("");
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleReset = () => {
    setFormData({
      tech_tool: "calculator",
      tech_bnr_third: "101",
      tech_select_base: "12",
      tech_to_number: "2",
      tech_bnr_frs: "54f",
      tech_bnr_slc: "add",
      tech_bnr_sec: "54f",
    });
    setResult(null);
    setFormError("");
  };

  // Custom function to convert number from one base to another
  const convertBase = (num, fromBase, toBase) => {
    // First convert to decimal (base 10)
    const decimal = parseInt(num, fromBase);
    if (isNaN(decimal)) return "Error";

    // Then convert from decimal to target base
    if (toBase === 10) return decimal.toString();
    return decimal.toString(toBase).toUpperCase();
  };

  // Custom arithmetic functions for different bases
  const performOperation = (num1, num2, operation, base) => {
    try {
      // Convert both numbers to decimal for calculation
      const decimal1 = parseInt(num1, base);
      const decimal2 = parseInt(num2, base);

      if (isNaN(decimal1) || isNaN(decimal2)) {
        return "Error: Invalid input";
      }

      let result;

      switch (operation) {
        case "add":
          result = decimal1 + decimal2;
          break;
        case "sub":
          result = decimal1 - decimal2;
          break;
        case "mul":
          result = decimal1 * decimal2;
          break;
        case "divd":
          if (decimal2 === 0) {
            return "Cannot divide by zero";
          }
          result = Math.floor(decimal1 / decimal2); // Integer division
          break;
        case "mod":
          if (decimal2 === 0) {
            return "Cannot mod by zero";
          }
          result = decimal1 % decimal2;
          break;
        default:
          result = 0;
      }

      return result;
    } catch (error) {
      return "Error: Invalid input";
    }
  };

  // Calculate result
  useEffect(() => {
    try {
      const inputBase = parseInt(formData.tech_select_base, 10) || 10;
      const outputBase = parseInt(formData.tech_to_number, 10) || 10;
      const op = formData.tech_bnr_slc;

      if (!formData.tech_bnr_frs || !formData.tech_bnr_sec) {
        setResult(null);
        return;
      }

      // Perform calculation in decimal
      const calcResult = performOperation(
        formData.tech_bnr_frs,
        formData.tech_bnr_sec,
        op,
        inputBase
      );

      if (typeof calcResult === "string") {
        // Error message
        setResult(calcResult);
        return;
      }

      // Convert result to output base
      const finalResult =
        outputBase === 10
          ? calcResult.toString()
          : calcResult.toString(outputBase).toUpperCase();

      setResult(finalResult);
    } catch (error) {
      setResult("Error: Invalid input");
    }
  }, [
    formData.tech_select_base,
    formData.tech_to_number,
    formData.tech_bnr_slc,
    formData.tech_bnr_frs,
    formData.tech_bnr_sec,
  ]);

  const getOperationSymbol = (op) => {
    switch (op) {
      case "add":
        return "+";
      case "sub":
        return "-";
      case "mul":
        return "×";
      case "divd":
        return "÷";
      case "mod":
        return "mod";
      default:
        return "+";
    }
  };

  return (
    <>
      <Calculator
        isLoading={isLoading}
        data={data}
        links={[
          { name: "Home", path: "/" },
          {
            name: data?.payload?.tech_cal_cat,
            path: "/" + data?.payload?.tech_cal_cat,
          },
          {
            name: data?.payload?.tech_calculator_title,
            path: pathname, // This will use the current path dynamically
          },
        ]}
      >
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          <div className=" mx-auto">
            <form className="rounded-xl  p-8 mb-6" onSubmit={handleSubmit}>
              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label
                    htmlFor="tech_select_base"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Input Base (Numbers will be in this base):
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    name="tech_select_base"
                    id="tech_select_base"
                    value={formData.tech_select_base}
                    onChange={handleChange}
                  >
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-lg text-gray-500 mt-1">
                    Allowed chars:{" "}
                    {getAllowedCharsForBase(formData.tech_select_base).join(
                      ", "
                    )}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="tech_to_number"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Output Base (Result will be in this base):
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    name="tech_to_number"
                    id="tech_to_number"
                    value={formData.tech_to_number}
                    onChange={handleChange}
                  >
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-end mb-8">
                <div className="col-span-12 sm:col-span-5">
                  <label
                    htmlFor="tech_bnr_frs"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Number:
                  </label>
                  <input
                    type="text"
                    name="tech_bnr_frs"
                    id="tech_bnr_frs"
                    className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg"
                    placeholder="Enter first number"
                    value={formData.tech_bnr_frs}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyPress(e, "first")}
                  />
                </div>

                <div className="col-span-12 sm:col-span-2">
                  <label
                    htmlFor="tech_bnr_slc"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Operation:
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg"
                    name="tech_bnr_slc"
                    id="tech_bnr_slc"
                    value={formData.tech_bnr_slc}
                    onChange={handleChange}
                  >
                    <option value="add">+</option>
                    <option value="sub">-</option>
                    <option value="mul">×</option>
                    <option value="divd">÷</option>
                    <option value="mod">mod</option>
                  </select>
                </div>

                <div className="col-span-12 sm:col-span-5">
                  <label
                    htmlFor="tech_bnr_sec"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Second Number:
                  </label>
                  <input
                    type="text"
                    name="tech_bnr_sec"
                    id="tech_bnr_sec"
                    className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg"
                    placeholder="Enter second number"
                    value={formData.tech_bnr_sec}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyPress(e, "second")}
                  />
                </div>
              </div>
              <div className="text-center space-x-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  {isLoading ? "Calculating..." : "Calculate"}
                </Button>

                {result && (
                  <ResetButton
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Reset
                  </ResetButton>
                )}
              </div>
            </form>
          </div>
        </div>

        {isLoading && (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div className="animate-pulse">
              <div className=" w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        )}

        {result && !isLoading && (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div>
              <ResultActions lang={data?.payload?.tech_lang_keys} />
              <div className="bg-white rounded-xl text-[18px] p-8 my-5">
                <div className="text-center">
                  <div className=" from-blue-50 to-indigo-50 rounded-lg p-6 mb-4">
                    <div className="text-lg text-gray-600 mb-2">
                      {formData.tech_bnr_frs}{" "}
                      {getOperationSymbol(formData.tech_bnr_slc)}{" "}
                      {formData.tech_bnr_sec}
                      <span className="ml-2 text-lg">
                        (Base {formData.tech_select_base})
                      </span>
                    </div>

                    <div
                      className="text-3xl font-mono font-bold text-blue-600"
                      id="main_answer"
                    >
                      {result}
                    </div>

                    <div className="text-lg text-gray-600 mt-2">
                      Result in Base {formData.tech_to_number}
                    </div>
                  </div>

                  <div className="text-lg text-gray-500 space-y-1">
                    <p>
                      Input Base: {formData.tech_select_base} - Allowed
                      characters:{" "}
                      {getAllowedCharsForBase(formData.tech_select_base).join(
                        ", "
                      )}
                    </p>
                    <p>Output Base: {formData.tech_to_number}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Calculator>
    </>
  );
};

export default BaseCalculator;

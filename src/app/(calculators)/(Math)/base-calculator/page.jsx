"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useBaseCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BaseCalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  
  let url = "";
  if (parts.length === 1) {
    url = parts[0];
  } else {
    url = parts[0] + "/" + parts[1];
  }

  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();

  const [
    calculateBaseCalculator,
    { isLoading: calculationLoading, isError, error: calculateError },
  ] = useBaseCalculatorMutation();

  const handleFetchDetails = async () => {
    try {
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    select_base: "2",
    first_number: "101",
    operation: "+",
    second_number: "101",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const baseOptions = [
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

  const operationOptions = [
    { value: "+", name: "+" },
    { value: "-", name: "-" },
    { value: "×", name: "×" },
    { value: "÷", name: "÷" },
    { value: "mod", name: "mod" },
  ];

  // Get default value based on base
  const getDefaultValueForBase = (base) => {
    const baseNum = parseInt(base, 10);
    if (baseNum >= 2 && baseNum <= 7) {
      return "101";
    } else if (baseNum === 8 || baseNum === 9) {
      return "123";
    } else if (baseNum === 10) {
      return "23";
    } else {
      return "54f";
    }
  };

  const getAllowedCharsForBase = (base) => {
    const baseNum = parseInt(base, 10);
    const chars = [];

    for (let i = 0; i < Math.min(baseNum, 10); i++) {
      chars.push(String.fromCharCode(48 + i));
    }

    if (baseNum > 10) {
      for (let i = 10; i < baseNum; i++) {
        chars.push(String.fromCharCode(65 + (i - 10)));
        chars.push(String.fromCharCode(97 + (i - 10)));
      }
    }

    return chars;
  };

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

  const handleKeyPress = (e) => {
    const base = formData.select_base;
    let allowedKeys = [];

    // ASCII code mapping based on base
    if (base === "2") {
      allowedKeys = [48, 49, 8]; // 0, 1, backspace
    } else if (base === "3") {
      allowedKeys = [48, 49, 8, 50]; // 0-2
    } else if (base === "4") {
      allowedKeys = [48, 49, 8, 50, 51]; // 0-3
    } else if (base === "5") {
      allowedKeys = [48, 49, 8, 50, 51, 52]; // 0-4
    } else if (base === "6") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53]; // 0-5
    } else if (base === "7") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54]; // 0-6
    } else if (base === "8") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55]; // 0-7
    } else if (base === "9") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56]; // 0-8
    } else if (base === "10") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57]; // 0-9
    } else if (base === "11") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 97]; // 0-9, A
    } else if (base === "12") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 97, 98]; // 0-9, A-B
    } else if (base === "13") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 97, 98, 99]; // 0-9, A-C
    } else if (base === "14") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 97, 98, 99, 100]; // 0-9, A-D
    } else if (base === "15") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 97, 98, 99, 100, 101]; // 0-9, A-E
    } else if (base === "16") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 97, 98, 99, 100, 101, 102]; // 0-9, A-F
    } else if (base === "17") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 97, 98, 99, 100, 101, 102, 103];
    } else if (base === "18") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 97, 98, 99, 100, 101, 102, 103, 104];
    } else if (base === "19") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 97, 98, 99, 100, 101, 102, 103, 104, 105];
    } else if (base === "20") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106];
    } else if (base === "21") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107];
    } else if (base === "22") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108];
    } else if (base === "23") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109];
    } else if (base === "24") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110];
    } else if (base === "25") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111];
    } else if (base === "26") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112];
    } else if (base === "27") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113];
    } else if (base === "28") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    } else if (base === "29") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115];
    } else if (base === "30") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116];
    } else if (base === "31") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117];
    } else if (base === "32") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118];
    } else if (base === "33") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119];
    } else if (base === "34") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120];
    } else if (base === "35") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121];
    } else if (base === "36") {
      allowedKeys = [48, 49, 8, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122];
    }

    // Get the character code from the event
    const charCode = e.which || e.keyCode;

    // Check if the key is allowed
    if (!allowedKeys.includes(charCode)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If base is changed, update default values for inputs
    if (name === "select_base") {
      const defaultValue = getDefaultValueForBase(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        first_number: defaultValue,
        second_number: defaultValue,
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    
    setResult(null);
    setFormError("");
  };

 const handleSubmit = async () => {
  setFormError("");
  setIsCalculating(true);

  try {
    const response = await calculateBaseCalculator(formData).unwrap();

    // SUCCESS CASE
    if (response?.status === "success" && response?.payload?.status !== "error") {
      setResult(response.payload.payload);
      toast.success("Calculation completed successfully!");
      return;
    }

    // NESTED API ERROR CASE
    const apiError = response?.payload?.error || "Failed to calculate. Please try again.";
    setFormError(apiError);
    toast.error(apiError);

  } catch (err) {
    console.error("Calculation error:", err);

    // CATCH ERROR HANDLING
    const errorMessage =
      err?.data?.payload?.error ||
      err?.payload?.error ||
      err?.message ||
      "An error occurred during calculation.";

    setFormError(errorMessage);
    toast.error(errorMessage);

  } finally {
    setIsCalculating(false);
  }
};


  const handleReset = () => {
    setFormData({
      select_base: "2",
      first_number: "101",
      operation: "+",
      second_number: "101",
    });
    setResult(null);
    setFormError("");
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
            path: pathname,
          },
        ]}
      >
          <form className="row" onSubmit={handleSubmit}>


         <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
            {formError && (
              <p className="text-red-500 text-[16px] md:text-[18px] font-semibold w-full">
                {formError}
              </p>
            )}

            <div className="lg:w-[75%] md:w-[100%] w-full mx-auto overflow-auto">
              <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
                
                <div className="col-span-12 ">
                  <label htmlFor="select_base" className="text-sm font-medium ">
                    Select Base:
                  </label>
                  <div className="w-full py-2">
                    <select
                      name="select_base"
                      id="select_base"
                      value={formData.select_base}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {baseOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-12 mt-2">
                  <div className="grid grid-cols-12 gap-0 md:gap-4 lg:gap-4">
                    <div className="md:col-span-5 col-span-12">
                      <label htmlFor="first_number" className="text-sm font-medium ">
                        First Number:
                      </label>
                      <div className="py-2">
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                          type="text"
                          id="first_number"
                          name="first_number"
                          value={formData.first_number}
                          onChange={handleChange}
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 col-span-12">
                      <label htmlFor="operation" className="text-sm font-medium ">
                        Operation:
                      </label>
                      <div className="w-full py-2">
                        <select
                          name="operation"
                          id="operation"
                          value={formData.operation}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {operationOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="md:col-span-5 col-span-12">
                      <label htmlFor="second_number" className="text-sm font-medium ">
                        Second Number:
                      </label>
                      <div className="py-2">
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                          type="text"
                          id="second_number"
                          name="second_number"
                          value={formData.second_number}
                          onChange={handleChange}
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6 mt-10 text-center space-x-2">
              <Button type="submit" isLoading={isCalculating} onClick={handleSubmit}>
                {data?.payload?.tech_lang_keys?.calculate || "Calculate"}
              </Button>
              {result && (
                <ResetButton type="button" onClick={handleReset}>
                  {data?.payload?.tech_lang_keys?.locale === "en"
                    ? "RESET"
                    : data?.payload?.tech_lang_keys?.reset || "RESET"}
                </ResetButton>
              )}
            </div>
        </div>

        {isCalculating && (
          <div className="result_calculator rounded-lg shadow-md p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        )}

        {result && !isCalculating && (
          <div className="w-full mx-auto p-4 result_calculator rounded-lg  space-y-6">
            <div>
              <ResultActions lang={data?.payload?.tech_lang_keys} />
              <div className=" rounded-xl text-lg p-2">
                <div className="rounded-lg flex items-center justify-center">
                  <div className="w-full mt-3">
                    <div className="w-full">
                      <div className="text-center">
                        <p className="text-xl mb-2">
                          <strong>{data?.payload?.tech_lang_keys?.result || "Result"}</strong>
                        </p>
                        <p className="text-4xl bg-white px-6 py-4 rounded-lg inline-block my-3">
                          <strong className="">
                            {result?.result?.in_given_base}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          (Decimal: {result?.result?.in_decimal})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 mb-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Input Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Base:</strong> {result?.input?.base} ({result?.input?.base_name})
                    </p>
                    <p>
                      <strong>Expression:</strong> {result?.calculation?.expression}
                    </p>
                  </div>
                </div>

                {result?.step_by_step && (
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-800">
                      Step-by-Step Solution
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(result.step_by_step).map(([key, value], index) => (
                        <div key={key} className="flex items-start">
                          <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <p className="text-sm text-gray-700 flex-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
          </form>
        {result && (
              <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
            )}
      </Calculator>
    </>
  );
};

export default BaseCalculator;
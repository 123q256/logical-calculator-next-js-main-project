"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useWronskianCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WronskianCalculator = () => {
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

  const [formData, setFormData] = useState({
    tech_EnterEq: "(x^2+4), sin(2x), cos(x)",
    tech_with: "x",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWronskianCalculatorMutation();

  const [showKeyboard, setShowKeyboard] = useState(false);

  const toggleKeyboard = () => {
    setShowKeyboard((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleKeyClick = (value) => {
    setFormData((prev) => ({
      ...prev,
      tech_EnterEq: (prev.tech_EnterEq || "") + value,
    }));
    setResult(null);
    setFormError(null);
  };

  const clearInput = () => {
    setFormData((prev) => ({ ...prev, tech_EnterEq: "" }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_EnterEq || !formData.tech_with) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_EnterEq: formData.tech_EnterEq,
        tech_with: formData.tech_with,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_EnterEq: "(x^2+4), sin(2x), cos(x)",
      tech_with: "x",
    });
    setResult(null);
    setFormError(null);
  };
  // currency code
  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  });

  useEffect(() => {
    const fetchCurrency = async () => {
      const result = await getUserCurrency();
      if (result) {
        setCurrency(result);
      }
    };

    fetchCurrency();
  }, []);
  // currency code

  const exampleLoadHandler = () => {
    const examples = [
      "(x^2+4), sin(2x), cos(x)",
      "(x^2+5), sin(2x), cos(x)",
      "(x^2+5), cos(2x), sin(x)",
      "(x^2+5), tan(2x), sin(x)",
      "(x^2+5), tan(2x), sec(x)",
    ];

    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setFormData((prev) => ({
      ...prev,
      tech_EnterEq: randomExample,
    }));
    setResult(null);
    setFormError(null);
  };

  // rsult

  const input = result?.tech_enter?.split("##") || [];
  const fsArray = input.map((val, index) => `f_${index + 1}`);
  const fs = fsArray.join(",");

  // Derivative matrix building:
  let wronskianSteps = [];
  let derivative = "";
  for (let row = 0; row < input.length - 1; row++) {
    const rowItems = input
      .map((_, i) => {
        return `${fsArray[i]}(${formData?.tech_with})${
          derivative ? `^{${derivative}}` : ""
        }`;
      })
      .slice(0, input.length - 1);
    wronskianSteps.push(rowItems.join(" & "));
    derivative += "'";
  }

  let wronskianStepsWithInput = [];
  derivative = "";
  for (let row = 0; row < input.length - 1; row++) {
    const rowItems = input
      .map((item) => {
        return `(${item})${derivative ? `^{${derivative}}` : ""}`;
      })
      .slice(0, input.length - 1);
    wronskianStepsWithInput.push(rowItems.join(" & "));
    derivative += "'";
  }

  // Wronskian matrix from backend
  const formattedMatrix = result?.tech_matrix
    ?.replace(/\[/g, "|")
    .replace(/\]/g, "|");

  return (
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
      <form className="row" onSubmit={handleSubmit}>
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="lg:col-span-9 md:col-span-9 col-span-12">
                <div className="col-span-12 md:col-span-4 lg:col-span-4 md:flex md:justify-between">
                  <label for="tech_EnterEq" className="label mt-4">
                    {data?.payload?.tech_lang_keys["2"]}:
                  </label>
                  <button
                    type="button"
                    className="mt-2 flex border rounded-lg p-1  items-center"
                    id="exampleLoadBtn"
                    onClick={exampleLoadHandler}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-arrow-up-right size-5 me-1"
                    >
                      <path d="M7 7h10v10"></path>
                      <path d="M7 17 17 7"></path>
                    </svg>
                    Load Example
                  </button>
                </div>
                <div className="w-full py-2 relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_EnterEq"
                    id="tech_EnterEq"
                    className="input "
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_EnterEq}
                    onChange={handleChange}
                  />
                  <img
                    src="/images/keyboard.png"
                    className="keyboardImg absolute right-2 top-8 cursor-pointer transform -translate-y-1/2 w-9 h-9"
                    alt="keyboard"
                    loading="lazy"
                    decoding="async"
                    onClick={toggleKeyboard}
                  />
                </div>
              </div>
              <div className="lg:col-span-3 md:col-span-3 col-span-12 md:mt-3">
                <label htmlFor="tech_with" className="label">
                  W.R.T:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_with"
                    id="tech_with"
                    value={formData.tech_with}
                    onChange={handleChange}
                  >
                    <option value="a">a </option>
                    <option value="b">b </option>
                    <option value="c">c </option>
                    <option value="n">n </option>
                    <option value="x">x </option>
                    <option value="y">y </option>
                    <option value="z">z </option>
                  </select>
                </div>
              </div>
              {showKeyboard && (
                <div className="col-span-12 keyboard grid grid-cols-9 gap-1 mt-2">
                  <button
                    type="button"
                    className="bg-blue-700 cursor-pointer text-white rounded-sm h-9 px-2 uppercase shadow-md hover:bg-blue-600"
                    onClick={clearInput}
                  >
                    CLS
                  </button>
                  {["+", "-", "/", "*", "^", "sqrt(", "(", ")"].map(
                    (keyVal, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="keyBtn cursor-pointer bg-blue-700 text-white rounded-sm h-9 px-2 uppercase shadow-md hover:bg-blue-600"
                        onClick={() => handleKeyClick(keyVal)}
                      >
                        {keyVal === "sqrt(" ? "√" : keyVal}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys["calculate"]}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys["locale"] === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>
        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div className="animate-pulse">
              <div className=" w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[16px] overflow-auto">
                        <p className="mt-3 texpan-12px]">
                          <strong>{data?.payload?.tech_lang_keys["4"]}</strong>
                        </p>

                        <div className="mt-3">
                          <BlockMath math={result?.tech_res} />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["5"]}</strong>
                        </p>

                        <div className="mt-3">
                          {data?.payload?.tech_lang_keys["6"]}:{" "}
                          <InlineMath
                            math={fsArray
                              .map((f, i) => `${f} = ${input[i]}`)
                              .join(", ")}
                          />
                        </div>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["7"]}:
                        </p>
                        <div className="mt-3">
                          <BlockMath
                            math={`W(${fs})(${
                              formData?.tech_with
                            }) = \\begin{vmatrix} ${wronskianSteps.join(
                              " \\\\ "
                            )} \\end{vmatrix}`}
                          />
                        </div>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["8"]}:
                        </p>
                        <div className="mt-3">
                          <BlockMath
                            math={`W(${fs})(${
                              formData?.tech_with
                            }) = \\begin{vmatrix} ${wronskianStepsWithInput.join(
                              " \\\\ "
                            )} \\end{vmatrix}`}
                          />
                        </div>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["9"]} (
                          {data?.payload?.tech_lang_keys["10"]}{" "}
                          <a
                            href="https://calculator-logical.com/derivative-calculator"
                            className="text-blue-700"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {data?.payload?.tech_lang_keys[11]}
                          </a>
                          ):
                        </p>

                        <div className="mt-3">
                          <BlockMath
                            math={`W(${fs})(${formData?.tech_with}) = ${formattedMatrix}`}
                          />
                        </div>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["12"]}:
                        </p>
                        <div className="mt-3">
                          <BlockMath
                            math={`W(${fs})(${formData?.tech_with}) = ${formattedMatrix} = ${result?.tech_res}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </form>
      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default WronskianCalculator;

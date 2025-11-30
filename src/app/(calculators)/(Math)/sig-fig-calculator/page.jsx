"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
import {
  useGetSingleCalculatorDetailsMutation,
  useSigFigCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import "../../../../components/styles/CssSigFigCalculator.css";

const SignificantFiguresCalculator = () => {
  const pathname = usePathname();
  const url = pathname.replace(/^\/+|\/+$/g, "");

  const textareaRef = useRef(null);

  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();

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

  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const [formData, setFormData] = useState({
    x: "",
    submit: "calculate",
    number: "",
    y: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const [
    CatAgeCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = useSigFigCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  // Calculator button click handler
  const calculator = (value) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const currentValue = formData.x;

    if (value === "C") {
      setFormData((prev) => ({ ...prev, x: "" }));
    } else if (value === "bk") {
      const newValue =
        currentValue.slice(0, cursorPosition - 1) +
        currentValue.slice(cursorPosition);
      setFormData((prev) => ({ ...prev, x: newValue }));
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = cursorPosition - 1;
      }, 0);
    } else if (value === "pow") {
      const newValue =
        currentValue.slice(0, cursorPosition) +
        "**" +
        currentValue.slice(cursorPosition);
      setFormData((prev) => ({ ...prev, x: newValue }));
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + 2;
      }, 0);
    } else {
      const newValue =
        currentValue.slice(0, cursorPosition) +
        value +
        currentValue.slice(cursorPosition);
      setFormData((prev) => ({ ...prev, x: newValue }));
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1;
      }, 0);
    }
  };

  // Handle rounding button clicks (1-5)
  const handleRoundingClick = (num) => {
    setFormData((prev) => ({ ...prev, y: num.toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.x) {
      setFormError("Please fill in field");
      return;
    }

    // Calculate the result using eval
    let calculatedNumber = formData.x;
    try {
      let x = formData.x;
      x = x.replace(/log/g, "Math.log10");
      x = x.replace(/ln/g, "Math.log");
      x = x.replace(/\*\*/g, "*");
      x = x.replace(/10\^\(/g, "Math.pow(10, ");

      if (x.match(/\<|\>|\&|php|script|print|file|=|&|%/i)) {
        calculatedNumber = "Invalid";
      } else {
        calculatedNumber = eval(x).toString();
      }
    } catch (err) {
      calculatedNumber = "Error";
    }

    setFormError("");
    try {
      const response = await CatAgeCalculator({
        x: formData.x,
        submit: formData.submit,
        number: calculatedNumber,
        y: formData.y,
      }).unwrap();
      setResult(response?.payload);
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      x: "",
      submit: "calculate",
      number: "",
      y: "",
    });
    setResult(null);
    setFormError(null);
  };

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
          path: pathname,
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto">
            <div className="grid grid-cols-12 gap-2 md:gap-4">
              <div className="col-span-12">
                {/* Input Box */}
                <div className="mt-2 mx-auto w-full lg:w-[85%]">
                  <textarea
                    ref={textareaRef}
                    name="x"
                    value={formData.x}
                    onChange={handleChange}
                    id="showInput"
                    placeholder="53.40007 * 21.3"
                    className="input pt-2 pb-1 px-3 w-full rounded-md border border-gray-300"
                  ></textarea>
                </div>

                {/* Output Box */}
                <div className="mx-auto bg-white radius-10 mt-2 p-3 w-full lg:w-[85%] rounded-lg shadow">
                  <div
                    id="showOutput"
                    className="font-s-21 text-blue font-bold hidden"
                  >
                    0
                  </div>
                  <div id="ShowHistory"></div>

                  <div className="w-full">
                    <div className="flex flex-wrap">
                      {/* Buttons Grid */}
                      {[
                        ["+", "grey_color"],
                        [7, "bg-gray"],
                        [8, "bg-gray"],
                        [9, "bg-gray"],
                        ["pow"],

                        ["-", "grey_color"],
                        [4, "bg-gray"],
                        [5, "bg-gray"],
                        [6, "bg-gray"],
                        ["ln"],

                        ["*", "grey_color"],
                        [1, "bg-gray"],
                        [2, "bg-gray"],
                        [3, "bg-gray"],
                        ["e"],

                        ["/", "grey_color"],
                        [".", "bg-gray"],
                        [0, "bg-gray"],
                        ["("],
                        [")"],

                        ["bk", "grey_color", "img"],
                        ["log"],
                        ["C"],
                      ].map((btn, index) => (
                        <div key={index} className="width_20_per p-1">
                          {btn[0] === "bk" ? (
                            <span
                              onClick={() => calculator("bk")}
                              className="grey_color cursor-pointer inline-block w-full text-center py-2 rounded"
                            >
                              <img
                                src="/images/delete_btn.png"
                                alt="delete"
                                width="20"
                                height="20"
                              />
                            </span>
                          ) : (
                            <span
                              onClick={() => calculator(btn[0])}
                              className={`${
                                btn[1] || ""
                              } cursor-pointer inline-block w-full text-center py-2 rounded hover:opacity-80`}
                            >
                              {btn[0]}
                            </span>
                          )}
                        </div>
                      ))}

                      {/* Calculate Button */}
                      <div
                        className="width_20_per p-1"
                        style={{ width: "40%" }}
                      >
                        <button
                          className="blue_btn solve w-full py-2 bg-[#2845F5] text-white rounded-md hover:bg-blue-700"
                          type="submit"
                        >
                          Calculate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hidden Input */}
                <input
                  type="hidden"
                  name="number"
                  id="number"
                  value={formData.number}
                />

                {/* Rounding Options */}
                <div className="col-span-8 me-auto mt-3 px-2">
                  <label htmlFor="y" className="font-s-14 text-blue">
                    {data?.payload?.tech_lang_keys["round"]}
                  </label>
                  <span className="text-gray font-s-14">(option)</span>

                  <div className="md:flex items-center justify-between bg-gray-200 p-2 rounded-lg mt-1">
                    {/* Left Buttons */}
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          type="button"
                          key={n}
                          onClick={() => handleRoundingClick(n)}
                          className={`px-4 py-2 rounded-md font-semibold cursor-pointer transition-colors ${
                            formData.y === n.toString()
                              ? "bg-[#2845F5] text-white"
                              : "bg-[#2845F5] text-white hover:bg-blue-600"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>

                    {/* Right Input Box */}
                    <input
                      type="number"
                      step="1"
                      name="y"
                      id="y"
                      value={formData.y}
                      onChange={handleChange}
                      className="border rounded-md md:ml-3 px-3 py-2 w-24 bg-white md:mt-auto mt-3"
                      min="0"
                      max="26"
                      aria-label="input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={calculateDogLoading}>
              {data?.payload?.tech_lang_keys["calculate"] ?? "Calculate"}
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

        <div className="lg:w-[100%] w-full mx-auto ">
          <div className="col-span-12">
            {isLoading && (
              <div className="result_calculator rounded-lg p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            )}
            {result !== null && !isLoading && (
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6">
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                <div className="rounded-lg flex items-center justify-center">
                  <div className="w-full text-center">
                    <div className="grid grid-col-12 gap-2  rounded-lg p-3">
                      {/* FIXED: Check if this is calculation result or simple number */}
                      {result?.tech_dataArray?.summarize ? (
                        <>
                          {/* For Calculation Results - FIXED all paths */}
                          <div className="col-span-12  ">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b text-left">
                                    Answer
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <strong>
                                      {
                                        result?.tech_dataArray?.summarize?.[0]
                                          ?.finalResult
                                      }
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b text-left">
                                    No. of Significant Figures
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <strong>
                                      {
                                        result?.tech_dataArray?.summarize?.[0]
                                          ?.significantFigures
                                      }
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b text-left">
                                    The Significant Figures are
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <b>{formData?.x}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b text-left">
                                    Decimals
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <strong>
                                      {
                                        result?.tech_dataArray?.summarize?.[0]
                                          ?.Decimal
                                      }
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b text-left">
                                    Scientific Notation
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <strong>
                                      {
                                        result?.tech_dataArray
                                          ?.summarize?.[0]?.[
                                          "Scientific Notation"
                                        ]
                                      }
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b text-left">
                                    Exponential Notation
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <b>
                                      {
                                        result?.tech_dataArray
                                          ?.summarize?.[0]?.[
                                          "Exponential Notation"
                                        ]
                                      }
                                    </b>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Step by Step Solution - FIXED to handle object structure */}
                          {result?.tech_dataArray?.steps &&
                            result?.tech_dataArray?.steps.length > 0 && (
                              <div className="col-span-12 mt-4">
                                <p className="text-lg font-bold">
                                  <b>Step by Step Solution:</b>
                                </p>
                                <ol className="list-decimal pl-6 border-b pb-3 text-left">
                                  {result?.tech_dataArray?.steps.map(
                                    (stepObj, index) => {
                                      // Steps are objects with numbered keys like "0", "1", "2"...
                                      // Convert object to array
                                      const stepsArray = Object.values(stepObj);
                                      return stepsArray.map(
                                        (step, subIndex) => (
                                          <div
                                            key={`${index}-${subIndex}`}
                                            dangerouslySetInnerHTML={{
                                              __html: step,
                                            }}
                                          />
                                        )
                                      );
                                    }
                                  )}
                                </ol>
                              </div>
                            )}
                        </>
                      ) : (
                        <>
                          {/* For Simple Numeric Input */}
                          <div className=" col-span-12  mt-3">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b text-left">
                                    The Significant Figures are
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <b id="nbr">
                                      {result?.tech_nbr || formData?.number}
                                    </b>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b text-left">
                                    No. of Significant Figures
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <b id="count_after">{result?.tech_y}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b text-left">
                                    Decimals
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <b id="decimal_after">
                                      {result?.tech_decimal}
                                    </b>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b text-left">
                                    {data?.payload?.tech_lang_keys?.[
                                      "rounded"
                                    ] || "Rounded"}
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <b id="nbr_after">
                                      {result?.tech_rounded || result?.tech_nbr}
                                    </b>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b text-left">
                                    Exponential Notation
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <b id="e_after">{result?.tech_e_before}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b text-left">
                                    Scientific Notation
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <b
                                      id="s_after"
                                      dangerouslySetInnerHTML={{
                                        __html: result?.tech_s_after,
                                      }}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                      {/* Rules Section */}
                      <div className="col-span-12 text-base mt-6 text-left">
                        <p className="text-lg pt-1 mt-2 font-bold">
                          <strong>
                            {data?.payload?.tech_lang_keys?.["rule"] || "Rules"}
                          </strong>
                        </p>
                        <ul className="list-disc pl-6">
                          <li className="mt-3">
                            {data?.payload?.tech_lang_keys?.["r1"]}
                          </li>
                          <li className="mt-3">
                            {data?.payload?.tech_lang_keys?.["r2"]}
                          </li>
                          <li className="mt-3">
                            {data?.payload?.tech_lang_keys?.["r3"]}
                          </li>
                          <li className="my-3">
                            {data?.payload?.tech_lang_keys?.["r4"]}
                          </li>
                        </ul>
                      </div>

                      {/* Examples Table */}
                      <div className="col-span-12 mt-6">
                        <p className="mt-3">
                          <strong></strong>
                        </p>
                        <table className="w-full text-center">
                          <thead>
                            <tr>
                              <td className="py-2 border-b font-bold">
                                <strong>
                                  {data?.payload?.tech_lang_keys?.["example"] ||
                                    "Example"}
                                </strong>
                              </td>
                              <td className="py-2 border-b font-bold">
                                <strong>
                                  {data?.payload?.tech_lang_keys?.["n_sig"] ||
                                    "No. Sig Figs"}
                                </strong>
                              </td>
                              <td className="py-2 border-b font-bold">
                                <strong>
                                  {data?.payload?.tech_lang_keys?.["sig"] ||
                                    "Significant Figures"}
                                </strong>
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-2 border-b">
                                <strong>13</strong>
                              </td>
                              <td className="py-2 border-b">2</td>
                              <td className="py-2 border-b">1, 3</td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">
                                <strong>
                                  <span>513</span>
                                  <span className="text-red-500">000</span>
                                </strong>
                              </td>
                              <td className="py-2 border-b">3</td>
                              <td className="py-2 border-b">5, 1, 3</td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">
                                <strong>
                                  <span className="text-red-500">0</span>
                                  <span>302</span>
                                  <span className="text-red-500">00</span>
                                </strong>
                              </td>
                              <td className="py-2 border-b">3</td>
                              <td className="py-2 border-b">3, 0, 2</td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">
                                <strong>
                                  <span className="text-red-500">0.00</span>
                                  <span>32</span>
                                </strong>
                              </td>
                              <td className="py-2 border-b">2</td>
                              <td className="py-2 border-b">3, 2</td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">
                                <strong>3300.32</strong>
                              </td>
                              <td className="py-2 border-b">6</td>
                              <td className="py-2 border-b">
                                3, 3, 0, 0, 3, 2
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">
                                <strong>
                                  <span className="text-red-500">0.0</span>
                                  <span>560</span>
                                </strong>
                              </td>
                              <td className="py-2 border-b">3</td>
                              <td className="py-2 border-b">5, 6, 0</td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">
                                <strong>
                                  <span className="text-red-500">0</span>
                                  <span>.20130</span>
                                </strong>
                              </td>
                              <td className="py-2 border-b">5</td>
                              <td className="py-2 border-b">2, 0, 1, 3, 0</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Rounding Rules */}
                      <div className="col-span-12 text-base text-left mt-6">
                        <p className="mt-3 text-lg font-bold">
                          <strong>
                            {data?.payload?.tech_lang_keys?.["r_rule"] ||
                              "Rounding Rules"}
                          </strong>
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys?.["rr1"]}
                        </p>
                      </div>

                      {/* Rounding Examples Table */}
                      <div className="col-span-12 mt-6">
                        <p className="mt-3 text-lg font-bold">
                          <strong>
                            {data?.payload?.tech_lang_keys?.["rounding"] ||
                              "Rounding"}{" "}
                            205.3359
                          </strong>
                        </p>
                        <table className="w-full text-center">
                          <thead>
                            <tr>
                              <td className="py-2 border-b">
                                {data?.payload?.tech_lang_keys?.["round1"] ||
                                  "Sig Figs"}
                              </td>
                              <td className="py-2 border-b">
                                {data?.payload?.tech_lang_keys?.["round2"] ||
                                  "Rounded"}
                              </td>
                              <td className="py-2 border-b">
                                {data?.payload?.tech_lang_keys?.["round3"] ||
                                  "Full Value"}
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-2 border-b">1</td>
                              <td className="py-2 border-b">
                                <strong>
                                  <span>2</span>
                                  <span className="text-red-500">00</span>
                                </strong>
                              </td>
                              <td className="py-2 border-b">205.3</td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">2</td>
                              <td className="py-2 border-b">
                                <strong>
                                  <span>21</span>
                                  <span className="text-red-500">0</span>
                                </strong>
                              </td>
                              <td className="py-2 border-b">205.34</td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">3</td>
                              <td className="py-2 border-b">
                                <strong>205</strong>
                              </td>
                              <td className="py-2 border-b">205.336</td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">4</td>
                              <td className="py-2 border-b">
                                <strong>205.3</strong>
                              </td>
                              <td className="py-2 border-b">205.3359</td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">5</td>
                              <td className="py-2 border-b">
                                <strong>205.34</strong>
                              </td>
                              <td className="py-2 border-b">205.33590</td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">6</td>
                              <td className="py-2 border-b">
                                <strong>205.336</strong>
                              </td>
                              <td className="py-2 border-b">205.335900</td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">7</td>
                              <td className="py-2 border-b">
                                <strong>205.3359</strong>
                              </td>
                              <td className="py-2 border-b">205.3359000</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default SignificantFiguresCalculator;

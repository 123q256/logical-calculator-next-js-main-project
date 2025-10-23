"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import katex from "katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useInflectionPointCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const InflectionPointCalculator = () => {
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
    tech_eq: "x*e^(-3x)",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useInflectionPointCalculatorMutation();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  //       setResult(null);
  //   setFormError(null);
  // };

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
      tech_eq: (prev.tech_eq || "") + value,
    }));
    setResult(null);
    setFormError(null);
  };

  const clearInput = () => {
    setFormData((prev) => ({ ...prev, tech_eq: "" }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_eq) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_eq: formData.tech_eq,
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
      tech_eq: "x*e^(-3x)",
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
    const examples = ["x * e^(-2x)", "x^2 * e^(-x)", "x * ln(x) * e^(-2x)"];

    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setFormData((prev) => ({
      ...prev,
      tech_eq: randomExample,
    }));
    setResult(null);
    setFormError(null);
  };

  const [showSteps, setShowSteps] = useState(false);
  const [showSteps1, setShowSteps1] = useState(false);
  const [showSteps2, setShowSteps2] = useState(false);

  const toggleSteps = () => setShowSteps((prev) => !prev);
  const toggleSteps1 = () => setShowSteps1((prev) => !prev);
  const toggleSteps2 = () => setShowSteps2((prev) => !prev);

  const containerRef = useRef(null);
  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);

  useEffect(() => {
    if (showSteps && containerRef.current) {
      const scripts = containerRef.current.querySelectorAll(
        'script[type^="math/tex"]'
      );

      scripts.forEach((script) => {
        const isDisplayMode = script.type.includes("mode=display");
        const tex = script.textContent;
        const span = document.createElement("span");

        try {
          katex.render(tex, span, { displayMode: isDisplayMode });
          script.replaceWith(span);
        } catch (err) {
          console.error("KaTeX render error:", err);
        }
      });
    }
  }, [showSteps, result?.tech_step]);

  useEffect(() => {
    if (showSteps1 && containerRef1.current) {
      const scripts = containerRef1.current.querySelectorAll(
        'script[type^="math/tex"]'
      );

      scripts.forEach((script) => {
        const isDisplayMode = script.type.includes("mode=display");
        const tex = script.textContent;
        const span = document.createElement("span");

        try {
          katex.render(tex, span, { displayMode: isDisplayMode });
          script.replaceWith(span);
        } catch (err) {
          console.error("KaTeX render error:", err);
        }
      });
    }
  }, [showSteps1, result?.tech_step1]);

  useEffect(() => {
    if (showSteps2 && containerRef2.current) {
      const scripts = containerRef2.current.querySelectorAll(
        'script[type^="math/tex"]'
      );

      scripts.forEach((script) => {
        const isDisplayMode = script.type.includes("mode=display");
        const tex = script.textContent;
        const span = document.createElement("span");

        try {
          katex.render(tex, span, { displayMode: isDisplayMode });
          script.replaceWith(span);
        } catch (err) {
          console.error("KaTeX render error:", err);
        }
      });
    }
  }, [showSteps2, result?.tech_step2]);

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
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="">
                  <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                    <div className="flex items-center col-span-12 md:col-span-8 lg:col-span-8">
                      <label htmlFor="tech_eq" className="text-[12px] ">
                        {data?.payload?.tech_lang_keys["1"]}
                      </label>
                    </div>
                    <div className="col-span-12 md:col-span-4 lg:col-span-4 flex justify-end">
                      <button
                        type="button"
                        className="  flex border rounded-lg p-1  items-center"
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
                  </div>
                </div>
                <div className="w-full py-2 relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_eq"
                    id="tech_eq"
                    className="input "
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_eq}
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
                          className="keyBtn bg-blue-700 cursor-pointer text-white rounded-sm h-9 px-2 uppercase shadow-md hover:bg-blue-600"
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="row">
                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-3 text-[16px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["4"]}{" "}
                              {data?.payload?.tech_lang_keys["5"]}
                            </strong>
                          </p>
                          {result?.tech_ip_1 ? (
                            <div className="mt-3">
                              <InlineMath
                                math={`(${result?.tech_ip1}, ${result?.tech_ip11})`}
                              />
                            </div>
                          ) : result?.tech_no ? (
                            <div className="mt-3">
                              <InlineMath
                                math={`${data?.payload?.tech_lang_keys["6"]}\\space${data?.payload?.tech_lang_keys["4"]}\\space${data?.payload?.tech_lang_keys["5"]}`}
                              />
                            </div>
                          ) : (
                            <>
                              <div className="mt-3">
                                <InlineMath
                                  math={`(${result?.tech_ip1}, ${result?.tech_ip2})`}
                                />
                              </div>
                              <div className="mt-3">
                                <InlineMath
                                  math={`(${result?.tech_ip11}, ${result?.tech_ip22})`}
                                />
                              </div>
                            </>
                          )}

                          {result?.tech_no ? (
                            <>
                              <p className="mt-3 text-[16px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["10"]}
                                </strong>
                              </p>
                              <div className="mt-3">
                                <InlineMath math={`(-\\infty, \\infty)`} />
                              </div>
                              <div className="mt-3 text-[16px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]}
                                </strong>
                              </div>
                              <div className="mt-3">
                                <InlineMath math={`\\emptyset`} />
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="mt-3 text-[16px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["10"]}
                                </strong>
                              </p>
                              <div className="mt-3">
                                <InlineMath
                                  math={`(${result?.tech_ip1}, \\infty)`}
                                />
                              </div>
                              <div className="mt-3 text-[16px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]}
                                </strong>
                              </div>
                              <div className="mt-3">
                                <InlineMath
                                  math={`(-\\infty, ${result?.tech_ip1})`}
                                />
                              </div>
                            </>
                          )}
                          {typeof result?.tech_iptype !== "undefined" && (
                            <>
                              <p className="mt-3 text-[16px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["12"]}
                                </strong>
                              </p>
                              <p className="mt-3 text-[16px]">
                                {result.tech_iptype < 0 ? (
                                  <>
                                    {data?.payload?.tech_lang_keys["13"]}{" "}
                                    {data?.payload?.tech_lang_keys["14"]}{" "}
                                    {data?.payload?.tech_lang_keys["15"]}
                                  </>
                                ) : (
                                  <>
                                    {data?.payload?.tech_lang_keys["16"]}{" "}
                                    {data?.payload?.tech_lang_keys["14"]}{" "}
                                    {data?.payload?.tech_lang_keys["17"]}
                                  </>
                                )}
                              </p>
                            </>
                          )}

                          <p className="mt-3 text-[16px]">
                            <strong>
                              <InlineMath math="f'(x)" />{" "}
                              {data?.payload?.tech_lang_keys["7"]}
                            </strong>
                          </p>
                          <p className="mt-3">
                            <BlockMath math={result?.tech_diff} />
                          </p>

                          <div className="w-full mt-3">
                            <button
                              type="button"
                              className="px-6 cursor-pointer py-3 font-semibold bg-[#2845F5] text-white text-[14px] rounded-lg focus:outline-none focus:ring-2"
                              onClick={toggleSteps}
                            >
                              {data?.payload?.tech_lang_keys["8"]}
                            </button>
                          </div>

                          <div className="w-full res_step mt-3">
                            {result?.tech_step && (
                              <div
                                ref={containerRef}
                                className={`w-full res_step transition-all duration-500 overflow-hidden mt-3 katex-rendered-content ${
                                  showSteps
                                    ? "max-h-[999px] opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_step,
                                }}
                              ></div>
                            )}
                          </div>

                          <p className="mt-3 text-[16px]">
                            <strong>
                              <InlineMath math="f''(x)" />{" "}
                              {data?.payload?.tech_lang_keys["7"]}
                            </strong>
                          </p>
                          <p className="mt-3">
                            <BlockMath math={result?.tech_diff1} />
                          </p>
                          <div className="w-full mt-3">
                            <button
                              type="button"
                              className="px-6 cursor-pointer py-3 font-semibold bg-[#2845F5] text-white text-[14px] rounded-lg focus:outline-none focus:ring-2"
                              onClick={toggleSteps1}
                            >
                              {data?.payload?.tech_lang_keys["8"]}
                            </button>
                          </div>
                          {result?.tech_step1 && (
                            <>
                              <div
                                ref={containerRef1}
                                className={`w-full res_step transition-all duration-500 overflow-hidden mt-3 ${
                                  showSteps1
                                    ? "max-h-[999px] opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                                dangerouslySetInnerHTML={{
                                  __html: result.tech_step1,
                                }}
                              ></div>
                            </>
                          )}
                          <p className="mt-3 text-[16px]">
                            <strong>
                              <InlineMath math="f'''(x)" />{" "}
                              {data?.payload?.tech_lang_keys["7"]}
                            </strong>
                          </p>
                          <p className="mt-3">
                            <BlockMath math={result?.tech_diff2} />
                          </p>
                          <div className="w-full mt-3">
                            <button
                              type="button"
                              className="px-6 cursor-pointer py-3 font-semibold bg-[#2845F5] text-white text-[14px] rounded-lg focus:outline-none focus:ring-2"
                              onClick={toggleSteps2}
                            >
                              {data?.payload?.tech_lang_keys["8"]}
                            </button>
                          </div>

                          {result?.tech_step1 && (
                            <>
                              <div
                                ref={containerRef2}
                                className={`w-full res_step transition-all duration-500 overflow-hidden mt-3 ${
                                  showSteps2
                                    ? "max-h-[999px] opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                                dangerouslySetInnerHTML={{
                                  __html: result.tech_step2,
                                }}
                              ></div>
                            </>
                          )}

                          <p className="mt-3 text-[16px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["9"]}
                            </strong>
                          </p>

                          {result?.tech_root ? (
                            <p className="mt-3">
                              <BlockMath math={result?.tech_root} />
                            </p>
                          ) : (
                            <p className="mt-3">
                              <InlineMath
                                math={`${data?.payload?.tech_lang_keys["6"]} \\ ${data?.payload?.tech_lang_keys["9"]}`}
                              />
                            </p>
                          )}
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

export default InflectionPointCalculator;

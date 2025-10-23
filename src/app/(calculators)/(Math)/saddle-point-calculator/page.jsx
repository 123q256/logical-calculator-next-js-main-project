"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import katex from "katex";
import "katex/dist/katex.min.css";
import {
  useGetSingleCalculatorDetailsMutation,
  useSaddlePointCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SaddlePointCalculator = () => {
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
    tech_EnterEq: "x^3 - 3*x*y^2 + y^4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSaddlePointCalculatorMutation();

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

    if (!formData.tech_EnterEq) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_EnterEq: formData.tech_EnterEq,
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
      tech_EnterEq: "x^3 - 3*x*y^2 + y^4",
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
      "(x^2 + 1)^(1/2)",
      "(3x^2 - 2x + 5)^(1/2)",
      "(4x^2 + 9)^(1/2)",
      "(x^2 - 6x + 8)^(1/2)",
      "(2x^2 + x + 7)^(1/2)",
    ];

    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setFormData((prev) => ({
      ...prev,
      tech_EnterEq: randomExample,
    }));
    setResult(null);
    setFormError(null);
  };

  const containerRef = useRef(null);
  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);
  const containerRef3 = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const scripts = containerRef.current.querySelectorAll(
        'script[type^="math/tex"]'
      );

      scripts.forEach((script) => {
        const isDisplayMode = script.type.includes("mode=display");
        const tex = script.textContent || "";
        const span = document.createElement("span");

        try {
          katex.render(tex, span, { displayMode: isDisplayMode });
          script.replaceWith(span);
        } catch (err) {
          console.error("KaTeX render error:", err, tex);
        }
      });
    }
  }, [result?.tech_buffer]);

  useEffect(() => {
    if (containerRef1.current) {
      const scripts = containerRef1.current.querySelectorAll(
        'script[type^="math/tex"]'
      );

      scripts.forEach((script) => {
        const isDisplayMode = script.type.includes("mode=display");
        const tex = script.textContent || "";
        const span = document.createElement("span");

        try {
          katex.render(tex, span, { displayMode: isDisplayMode });
          script.replaceWith(span);
        } catch (err) {
          console.error("KaTeX render error:", err, tex);
        }
      });
    }
  }, [result?.tech_step1]);

  useEffect(() => {
    if (containerRef2.current) {
      const scripts = containerRef2.current.querySelectorAll(
        'script[type^="math/tex"]'
      );

      scripts.forEach((script) => {
        const isDisplayMode = script.type.includes("mode=display");
        const tex = script.textContent || "";
        const span = document.createElement("span");

        try {
          katex.render(tex, span, { displayMode: isDisplayMode });
          script.replaceWith(span);
        } catch (err) {
          console.error("KaTeX render error:", err, tex);
        }
      });
    }
  }, [result?.tech_step]);

  useEffect(() => {
    if (containerRef3.current) {
      const scripts = containerRef3.current.querySelectorAll(
        'script[type^="math/tex"]'
      );

      scripts.forEach((script) => {
        const isDisplayMode = script.type.includes("mode=display");
        const tex = script.textContent || "";
        const span = document.createElement("span");

        try {
          katex.render(tex, span, { displayMode: isDisplayMode });
          script.replaceWith(span);
        } catch (err) {
          console.error("KaTeX render error:", err, tex);
        }
      });
    }
  }, [result?.tech_step2]);

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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="col-span-12 md:col-span-4 lg:col-span-4 md:flex md:justify-between">
                  <label htmlFor="tech_EnterEq" className="label mt-4">
                    {data?.payload?.tech_lang_keys["1"]}:
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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                        <p className="mt-3  font-bold">
                          {data?.payload?.tech_lang_keys["3"]}
                        </p>

                        <p className="mt-3">
                          <InlineMath math={result?.tech_root} />
                        </p>

                        <p className="mt-3 font-bold">
                          {data?.payload?.tech_lang_keys["5"]}
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`\\frac{\\partial^{2}}{\\partial (x,y)^{2}} \\left(${result?.tech_enter}\\right) = 0`}
                          />
                        </p>

                        <p className="my-3">
                          1st {data?.payload?.tech_lang_keys["4"]}:{" "}
                          <InlineMath
                            math={`\\frac{\\partial}{\\partial x}\\left(${result?.tech_enter}\\right)`}
                          />
                        </p>
                        <div className="w-full res_step mt-3">
                          {result?.tech_buffer && (
                            <div
                              ref={containerRef}
                              className="katex-rendered-content"
                              dangerouslySetInnerHTML={{
                                __html: result?.tech_buffer,
                              }}
                            />
                          )}
                        </div>

                        <p className="my-3">
                          2nd {data?.payload?.tech_lang_keys["4"]}:{" "}
                          <InlineMath
                            math={`\\frac{\\partial}{\\partial x}\\left(${result?.tech_en1}\\right)`}
                          />
                        </p>
                        <div className="w-full res_step mt-3">
                          {result?.tech_step1 && (
                            <div
                              ref={containerRef1}
                              className="katex-rendered-content"
                              dangerouslySetInnerHTML={{
                                __html: result?.tech_step1,
                              }}
                            />
                          )}
                        </div>

                        <p className="my-3">
                          1st {data?.payload?.tech_lang_keys["4"]}:{" "}
                          <InlineMath
                            math={`\\frac{\\partial}{\\partial y}\\left(${result?.tech_enter}\\right)`}
                          />
                        </p>
                        <div className="w-full res_step mt-3">
                          {result?.tech_step && (
                            <div
                              ref={containerRef2}
                              className="katex-rendered-content"
                              dangerouslySetInnerHTML={{
                                __html: result?.tech_step,
                              }}
                            />
                          )}
                        </div>

                        <p className="my-3">
                          2nd {data?.payload?.tech_lang_keys["4"]}:{" "}
                          <InlineMath
                            math={`\\frac{\\partial}{\\partial y}\\left(${result?.tech_en2}\\right)`}
                          />
                        </p>
                        <div className="w-full res_step mt-3">
                          {result?.tech_step2 && (
                            <div
                              ref={containerRef3}
                              className="katex-rendered-content"
                              dangerouslySetInnerHTML={{
                                __html: result?.tech_step2,
                              }}
                            />
                          )}
                        </div>

                        <p className="mt-3 font-bold">
                          {data?.payload?.tech_lang_keys["6"]} f''(x,y) = 0
                        </p>

                        <p className="mt-3">
                          <InlineMath math={`${result?.tech_ans} = 0`} />
                        </p>

                        <p className="mt-3">
                          <InlineMath math={`${result?.tech_ans1} = 0`} />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["7"]}:{" "}
                          <InlineMath math={result?.tech_root} />
                        </p>
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

export default SaddlePointCalculator;

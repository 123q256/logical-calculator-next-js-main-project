"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import katex from "katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useIntegralCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const IntegralCalculator = ({ tech_buffer }) => {
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
    if (window.MathJax) {
      window.MathJax.typesetPromise(); // Re-render math after DOM update
    }
  }, [tech_buffer]);

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    EnterEq: "cos(x)^3*sin(x)",
    with: "b",
    form: "def",
    ub: "3",
    lb: "2",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useIntegralCalculatorMutation();

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
      EnterEq: (prev.EnterEq || "") + value,
    }));
    setResult(null);
    setFormError(null);
  };

  const clearInput = () => {
    setFormData((prev) => ({ ...prev, EnterEq: "" }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.form == "def") {
      if (
        !formData.form ||
        !formData.EnterEq ||
        !formData.with ||
        !formData.ub ||
        !formData.lb
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (!formData.form || !formData.EnterEq || !formData.with) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        EnterEq: formData.EnterEq,
        with: formData.with,
        form: formData.form,
        ub: formData.ub,
        lb: formData.lb,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      EnterEq: "cos(x)^3*sin(x)",
      with: "b",
      form: "def",
      ub: "3",
      lb: "2",
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
      EnterEq: randomExample,
    }));
    setResult(null);
    setFormError(null);
  };

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
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
  }, [result?.tech_buffer]);

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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="lg:col-span-9 md:col-span-9 col-span-12">
                <div className="col-span-12 md:col-span-4 lg:col-span-4 flex justify-between">
                  <label htmlFor="EnterEq" className="label mt-4">
                    {data?.payload?.tech_lang_keys["6"]}:
                  </label>
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
                    name="EnterEq"
                    id="EnterEq"
                    className="input "
                    aria-label="input"
                    placeholder="00"
                    value={formData.EnterEq}
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
                <label htmlFor="with" className="label">
                  W.R.T:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="with"
                    id="with"
                    value={formData.with}
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
                        className="keyBtn bg-blue-700 cursor-pointer text-white rounded-sm h-9 px-2 uppercase shadow-md hover:bg-blue-600"
                        onClick={() => handleKeyClick(keyVal)}
                      >
                        {keyVal === "sqrt(" ? "√" : keyVal}
                      </button>
                    )
                  )}
                </div>
              )}
              <div className="col-span-12 flex items-center px-2 mt-3">
                <p id="defInput">
                  <label className="pe-2" htmlFor="def">
                    <input
                      type="radio"
                      name="form"
                      value="def"
                      id="def"
                      className="mr-2 border"
                      onChange={handleChange}
                      checked={formData.form === "def"}
                    />
                    <span>Definite</span>
                  </label>
                </p>
                <p className="ml-4" id="indInput">
                  <label className="pe-2" htmlFor="ind">
                    <input
                      type="radio"
                      name="form"
                      value="ind"
                      id="ind"
                      className="mr-2 border"
                      onChange={handleChange}
                      checked={formData.form === "ind"}
                    />
                    <span>Indefinite</span>
                  </label>
                </p>
              </div>
              {formData.form === "def" && (
                <>
                  <div className="col-span-6">
                    <label htmlFor="ub" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="ub"
                        id="ub"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.ub}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="lb" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="lb"
                        id="lb"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.lb}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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
                    <div className="w-full  p-3 rounded-lg mt-3">
                      <div className="grid grid-cols-1 gap-4 overflow-auto">
                        <div className="text-base">
                          {result?.tech_defi && (
                            <>
                              <p className="mt-3 text-lg font-semibold">
                                {data?.payload?.tech_lang_keys["7"]}
                              </p>
                              <p className="mt-3 text-lg">
                                <InlineMath math={result.tech_defi} />
                              </p>
                            </>
                          )}

                          <p className="mt-3 text-lg font-semibold">
                            {data?.payload?.tech_lang_keys["8"]}
                          </p>
                          <p className="mt-3 text-lg">
                            <InlineMath
                              math={`${result?.tech_ans} + \\text{ constant}`}
                            />
                          </p>

                          <p className="mt-3 text-lg font-semibold">
                            {data?.payload?.tech_lang_keys["6"]}
                          </p>

                          {result?.tech_defi ? (
                            <p className="mt-3">
                              <InlineMath
                                math={`\\int_{${formData?.lb}^{${formData?.ub}}} ${result?.tech_enter}\\, d${formData?.with}`}
                              />
                            </p>
                          ) : (
                            <p className="mt-3">
                              <InlineMath
                                math={`\\int ${result?.tech_enter}\\, d${formData?.with}`}
                              />
                            </p>
                          )}

                          <p className="mt-3 text-lg font-semibold">
                            Solution:
                          </p>
                          <div className="w-full res_step mt-3">
                            {/* Render raw KaTeX HTML if tech_step contains <script type="math/tex"> */}
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

export default IntegralCalculator;

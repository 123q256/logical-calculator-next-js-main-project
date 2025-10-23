"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import katex from "katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useDoubleIntegralCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DoubleIntegralCalculator = () => {
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
    tech_EnterEq: "x^2 + 3xy^2 + xy",
    tech_with: "xy", // yx  xy
    tech_form: "def",
    tech_ubx: "2",
    tech_lbx: "3",
    tech_uby: "3",
    tech_lby: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDoubleIntegralCalculatorMutation();

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
        tech_with: formData.tech_with,
        tech_form: formData.tech_form,
        tech_ubx: formData.tech_ubx,
        tech_lbx: formData.tech_lbx,
        tech_uby: formData.tech_uby,
        tech_lby: formData.tech_lby,
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
      tech_EnterEq: "x^2 + 3xy^2 + xy",
      tech_with: "xy", // yx  xy
      tech_form: "def",
      tech_ubx: "2",
      tech_lbx: "3",
      tech_uby: "3",
      tech_lby: "4",
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
      "x^2 + 3xy^2 + xy",
      "x + y",
      "xy",
      "(x-y)^4",
      "(4x^2 + 4y^2 + 1)^1/2",
    ];

    const randomExample = examples[Math.floor(Math.random() * examples.length)];

    // Generate random integer between 0 and 9
    const getRandomInt = () => Math.floor(Math.random() * 10);

    setFormData((prev) => ({
      ...prev,
      tech_EnterEq: randomExample,
      tech_ubx: getRandomInt(),
      tech_lbx: getRandomInt(),
      tech_uby: getRandomInt(),
      tech_lby: getRandomInt(),
    }));

    setResult(null);
    setFormError(null);
  };
  // result

  const renderMath = (tex, displayMode = false) => {
    try {
      return {
        __html: katex.renderToString(tex, {
          throwOnError: false,
          displayMode,
        }),
      };
    } catch {
      return { __html: "Invalid Expression" };
    }
  };

  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);

  useEffect(() => {
    if (containerRef1.current) {
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
          console.error("KaTeX render error (step1):", err);
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
        const tex = script.textContent;
        const span = document.createElement("span");

        try {
          katex.render(tex, span, { displayMode: isDisplayMode });
          script.replaceWith(span);
        } catch (err) {
          console.error("KaTeX render error (step2):", err);
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

          <div className=" w-full mx-auto overflow-auto">
            <div className="grid grid-cols-1  gap-2 md:gap-4 lg:gap-4">
              <div
                className="flex items-center justify-center"
                id="inputsField"
              >
                <div>
                  <input
                    type="text"
                    step="any"
                    name="tech_ubx"
                    id="tech_ubx"
                    className="input my-2 integral_input"
                    aria-label="input"
                    placeholder="00"
                    autoComplete="off"
                    value={formData.tech_ubx}
                    onChange={handleChange}
                  />
                  <p className="text-blue integ_symb">∫</p>
                  <input
                    type="text"
                    step="any"
                    name="tech_lbx"
                    id="tech_lbx"
                    className="input my-2 integral_input"
                    aria-label="input"
                    autoComplete="off"
                    placeholder="00"
                    value={formData.tech_lbx}
                    onChange={handleChange}
                  />
                </div>
                <div className="mx-2">
                  <input
                    type="text"
                    step="any"
                    name="tech_uby"
                    id="tech_uby"
                    className="input my-2 integral_input"
                    aria-label="input"
                    autoComplete="off"
                    placeholder="00"
                    value={formData.tech_uby}
                    onChange={handleChange}
                  />
                  <p className="text-blue integ_symb">∫</p>
                  <input
                    type="text"
                    step="any"
                    name="tech_lby"
                    id="tech_lby"
                    className="input my-2 integral_input"
                    aria-label="input"
                    autoComplete="off"
                    placeholder="00"
                    value={formData.tech_lby}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-blue bracket_symbol">(</p>
                <div className="md:w-[40%] w-[100%]">
                  <div className="col-span-12 md:col-span-4 lg:col-span-4 flex justify-between">
                    <label htmlFor="tech_EnterEq" className="label mt-4">
                      {" "}
                      Function:
                    </label>
                    <button
                      type="button"
                      className="  flex border rounded-lg p-1  items-center text-[8px]"
                      id="exampleLoadBtn"
                      onClick={exampleLoadHandler}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8"
                        height="8"
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
                  <div className=" relative">
                    <input
                      type="text"
                      step="any"
                      name="tech_EnterEq"
                      id="tech_EnterEq"
                      className="input my-2"
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
                  {showKeyboard && (
                    <div className="col-span-12 keyboard grid grid-cols-9 gap-1 mt-2">
                      <button
                        type="button"
                        className="bg-blue-700 cursor-pointer text-white rounded-sm h-7 px-2 uppercase shadow-md hover:bg-blue-600"
                        onClick={clearInput}
                      >
                        CLS
                      </button>
                      {["+", "-", "/", "*", "^", "sqrt(", "(", ")"].map(
                        (keyVal, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="keyBtn cursor-pointer bg-blue-700 text-white rounded-sm h-7 px-2 uppercase shadow-md hover:bg-blue-600"
                            onClick={() => handleKeyClick(keyVal)}
                          >
                            {keyVal === "sqrt(" ? "√" : keyVal}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                <p className="text-blue bracket_symbol">)</p>
                <div>
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
                      <option value="xy">dxdy </option>
                      <option value="yx">dydx </option>
                    </select>
                  </div>
                </div>
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-3 text-[18px] font-bold">
                            {data?.payload?.tech_lang_keys["8"]}
                          </p>
                          <p
                            className="mt-3 text-[18px]"
                            dangerouslySetInnerHTML={renderMath(
                              `= ${result?.tech_final} + \\mathrm{constant}`
                            )}
                          />

                          {result?.tech_def === "def" && (
                            <>
                              <p className="mt-3 text-[18px] font-bold">
                                {data?.payload?.tech_lang_keys["9"]}
                              </p>
                              <p
                                className="mt-3 text-[18px]"
                                dangerouslySetInnerHTML={renderMath(
                                  `= ${result?.tech_finaln}`
                                )}
                              />
                            </>
                          )}

                          <p className="mt-3 font-bold">
                            {data?.payload?.tech_lang_keys["7"]}
                          </p>
                          <p
                            className="mt-3"
                            dangerouslySetInnerHTML={renderMath(
                              result?.tech_enter || ""
                            )}
                          />

                          <p className="mt-3 font-bold">
                            {data?.payload?.tech_lang_keys["10"]}
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["11"]}:
                          </p>

                          <p
                            className="mt-3 mb-3"
                            dangerouslySetInnerHTML={renderMath(
                              result?.tech_en1 || ""
                            )}
                          />

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

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["12"]}:
                          </p>

                          <p
                            className="mt-3 mb-3"
                            dangerouslySetInnerHTML={renderMath(
                              result?.tech_en2 || ""
                            )}
                          />

                          <div className="w-full res_step mt-3">
                            {result?.tech_step2 && (
                              <div
                                ref={containerRef2}
                                className="katex-rendered-content"
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_step2,
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

export default DoubleIntegralCalculator;

"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import katex from "katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTangentLineCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TangentLineCalculator = () => {
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
    tech_cal: "y", // y  x  xy  r
    tech_func: "3*x^2",
    tech_func1: "5*t^3",
    tech_point: "2",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTangentLineCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cal: formData.tech_cal,
        tech_func: formData.tech_func,
        tech_func1: formData.tech_func1,
        tech_point: formData.tech_point,
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
      tech_cal: "y", // y  x  xy  r
      tech_func: "3*x^2",
      tech_func1: "5*t^3",
      tech_point: "2",
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

  const containerRef = useRef(null);
  const containerRef1 = useRef(null);

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
  }, [result?.tech_steps]);

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
          console.error("KaTeX render error:", err);
        }
      });
    }
  }, [result?.tech_steps1]);

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
                <label htmlFor="tech_cal" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_cal"
                    id="tech_cal"
                    value={formData.tech_cal}
                    onChange={handleChange}
                  >
                    <option value="y">
                      {data?.payload?.tech_lang_keys["2"]} y=f(x){" "}
                    </option>
                    <option value="x">
                      {data?.payload?.tech_lang_keys["2"]} x=f(y)
                    </option>
                    <option value="xy">
                      {data?.payload?.tech_lang_keys["3"]} x=x(t), y=y(t)
                    </option>
                    <option value="r">
                      {data?.payload?.tech_lang_keys["4"]} r=r(t)
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6" id="f">
                <label htmlFor="tech_func" className="label">
                  {data?.payload?.tech_lang_keys["amount"]}:
                  <span className="text-blue" id="ch">
                    {formData?.tech_cal === "x" && "f(y):"}
                    {formData?.tech_cal === "r" && "r(t):"}
                    {formData?.tech_cal === "xy" && "x(t):"}
                    {!["x", "r", "xy"].includes(formData?.tech_cal) && "f(x):"}
                  </span>
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_func"
                    id="tech_func"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_func}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_cal == "xy" && (
                <>
                  <div className="col-span-6" id="f1">
                    <label htmlFor="tech_func1" className="label">
                      y(t):
                    </label>
                    <div className=" relative">
                      <input
                        type="text"
                        step="any"
                        name="tech_func1"
                        id="tech_func1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_func1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-6" id="p">
                <label htmlFor="tech_point" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                  <span className="text-blue" id="ch2">
                    {formData?.tech_cal === "x" && "(y₀)"}
                    {(formData?.tech_cal === "r" ||
                      formData?.tech_cal === "xy") &&
                      "(t)"}
                    {!["x", "r", "xy"].includes(formData?.tech_cal) && "(x₀)"}
                  </span>
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_point"
                    id="tech_point"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_point}
                    onChange={handleChange}
                  />
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  mt-3">
                      <div className="w-full">
                        <div className="w-full text-[16px] overflow-auto">
                          <div className="mt-3 text-[20px]">
                            <strong>
                              <BlockMath math={`y = ${result?.tech_ans}`} />
                            </strong>
                          </div>
                          <p className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["7"]}
                            </strong>
                          </p>
                          {formData?.tech_cal === "y" && (
                            <div className="mt-3">
                              <BlockMath
                                math={`f(x) = ${result?.tech_enter}`}
                              />
                            </div>
                          )}
                          {formData?.tech_cal === "x" && (
                            <div className="mt-3">
                              <BlockMath
                                math={`f(y) = ${result?.tech_enter}`}
                              />
                            </div>
                          )}
                          {formData?.tech_cal === "xy" && (
                            <>
                              <div className="mt-3">
                                <BlockMath
                                  math={`x(t) = ${result?.tech_enter}`}
                                />
                              </div>
                              <div className="mt-3">
                                <BlockMath
                                  math={`y(t) = ${result?.tech_enter1}`}
                                />
                              </div>
                            </>
                          )}
                          {formData?.tech_cal === "r" && (
                            <div className="mt-3">
                              <BlockMath
                                math={`r(t) = ${result?.tech_enter}`}
                              />
                            </div>
                          )}
                          <p className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["9"]}:
                            </strong>
                          </p>

                          {formData?.tech_cal === "y" ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["10"]} (
                                {result?.tech_point}){" "}
                                {data?.payload?.tech_lang_keys["11"]} f(x)
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(x) = ${result?.tech_enter}`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(${
                                    result?.tech_point
                                  }) = ${result?.tech_enter?.replace(
                                    /x/g,
                                    `(${result?.tech_point})`
                                  )}`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(${result?.tech_point}) = ${result?.tech_s1}`}
                                />
                              </div>

                              <p className="my-3">
                                {data?.payload?.tech_lang_keys["12"]} (for step
                                by step, check{" "}
                                <a
                                  href="https://calculator-logical.com/derivative-calculator"
                                  className="text-blue-500 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Derivative Calculator
                                </a>
                                )
                              </p>
                              <div className="w-full res_step mt-3">
                                {/* Render raw KaTeX HTML if tech_step contains <script type="math/tex"> */}
                                {result?.tech_steps && (
                                  <div
                                    ref={containerRef}
                                    className="katex-rendered-content"
                                    dangerouslySetInnerHTML={{
                                      __html: result?.tech_steps,
                                    }}
                                  />
                                )}
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["10"]} (
                                {result?.tech_point}){" "}
                                {data?.payload?.tech_lang_keys["11"]} f'(x) to
                                find slope
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(x) = ${result?.tech_diff}`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(${
                                    result?.tech_point
                                  }) = ${result?.tech_diff?.replace(
                                    /x/g,
                                    `(${result?.tech_point})`
                                  )}`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(${result?.tech_point}) = ${result?.tech_s2}`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["13"]}
                              </p>

                              <div className="mt-3">
                                <BlockMath math={`y - y₀ = m(x - x₀)`} />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`y - (${result?.tech_s1}) = ${result?.tech_s2}(x - (${result?.tech_point}))`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["14"]}
                              </p>

                              <div className="mt-3">
                                <BlockMath math={`y = ${result?.tech_ans}`} />
                              </div>
                            </>
                          ) : formData?.tech_cal === "x" ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["10"]} (
                                {result?.tech_point}){" "}
                                {data?.payload?.tech_lang_keys["11"]} f(y)
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(y) = ${result?.tech_enter}`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(${
                                    result?.tech_point
                                  }) = ${result?.tech_enter?.replace(
                                    /x/g,
                                    `(${result?.tech_point})`
                                  )}`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(${result?.tech_point}) = ${result?.tech_s1}`}
                                />
                              </div>

                              <p className="my-3">
                                {data?.payload?.tech_lang_keys["12"]} (for step
                                by step, check{" "}
                                <a
                                  href="https://technical-calculator.com/derivative-calculator"
                                  className="text-blue-500 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Derivative Calculator
                                </a>
                                )
                              </p>
                              <div className="w-full res_step mt-3">
                                {/* Render raw KaTeX HTML if tech_step contains <script type="math/tex"> */}
                                {result?.tech_steps && (
                                  <div
                                    ref={containerRef}
                                    className="katex-rendered-content"
                                    dangerouslySetInnerHTML={{
                                      __html: result?.tech_steps,
                                    }}
                                  />
                                )}
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["10"]} (
                                {result?.tech_point}){" "}
                                {data?.payload?.tech_lang_keys["11"]} f'(x) to
                                find slope
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(y) = ${result?.tech_diff}`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(${
                                    result?.tech_point
                                  }) = ${result?.tech_diff?.replace(
                                    /x/g,
                                    `(${result?.tech_point})`
                                  )}`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(${result?.tech_point}) = ${result?.tech_s2}`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["13"]}
                              </p>

                              <div className="mt-3">
                                <BlockMath math={`x - x₀ = m(y - y₀)`} />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`x - (${result?.tech_s1}) = ${result?.tech_s2}(y - (${result?.tech_point}))`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["14"]}
                              </p>

                              <div className="mt-3">
                                <BlockMath math={`y = ${result?.tech_ans}`} />
                              </div>
                            </>
                          ) : formData?.tech_cal === "xy" ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["10"]} (
                                {result?.tech_point}){" "}
                                {data?.payload?.tech_lang_keys["11"]} x(t)
                              </p>

                              <BlockMath
                                math={`x(t) = ${result?.tech_enter}`}
                              />

                              <BlockMath
                                math={`x(${
                                  result?.tech_point
                                }) = ${result?.tech_enter?.replace(
                                  /t/g,
                                  `(${result?.tech_point})`
                                )}`}
                              />

                              <BlockMath
                                math={`x(${result?.tech_point}) = ${result?.tech_s1}`}
                              />

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["10"]} (
                                {result?.tech_point}){" "}
                                {data?.payload?.tech_lang_keys["11"]} y(t)
                              </p>

                              <BlockMath
                                math={`y(t) = ${result?.tech_enter1}`}
                              />

                              <BlockMath
                                math={`y(${
                                  result?.tech_point
                                }) = ${result?.tech_enter1?.replace(
                                  /t/g,
                                  `(${result?.tech_point})`
                                )}`}
                              />

                              <BlockMath
                                math={`y(${result?.tech_point}) = ${result?.tech_s11}`}
                              />

                              <p className="my-3">
                                {data?.payload?.tech_lang_keys["12"]} w.r.t x
                                (for step by step, check{" "}
                                <a
                                  href="https://technical-calculator.com/derivative-calculator"
                                  className="text-blue-500 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Derivative Calculator
                                </a>
                                )
                              </p>
                              <div className="w-full res_step mt-3">
                                {/* Render raw KaTeX HTML if tech_step contains <script type="math/tex"> */}
                                {result?.tech_steps && (
                                  <div
                                    ref={containerRef}
                                    className="katex-rendered-content"
                                    dangerouslySetInnerHTML={{
                                      __html: result?.tech_steps,
                                    }}
                                  />
                                )}
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["12"]} w.r.t y
                                (for step by step, check{" "}
                                <a
                                  href="https://technical-calculator.com/derivative-calculator"
                                  className="text-blue-500 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Derivative Calculator
                                </a>
                                )
                              </p>
                              <div className="w-full res_step mt-3">
                                {/* Render raw KaTeX HTML if tech_step contains <script type="math/tex"> */}
                                {result?.tech_steps1 && (
                                  <div
                                    ref={containerRef1}
                                    className="katex-rendered-content"
                                    dangerouslySetInnerHTML={{
                                      __html: result?.tech_steps1,
                                    }}
                                  />
                                )}
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["15"]},
                              </p>

                              <BlockMath
                                math={`\\frac{dy}{dx} = \\frac{${result?.tech_diff1}}{${result?.tech_diff}}`}
                              />

                              <BlockMath
                                math={`\\frac{dy}{dx} = ${result?.tech_s3}`}
                              />

                              {result?.tech_s3?.includes("t") && (
                                <>
                                  <p className="mt-3">
                                    {data?.payload?.tech_lang_keys["10"]} (
                                    {result?.tech_point}) into derivative to
                                    find slope
                                  </p>
                                  <BlockMath
                                    math={`\\frac{dy}{dx} = ${result?.tech_s3}`}
                                  />
                                  <BlockMath
                                    math={`\\frac{dy}{dx} = ${result?.tech_s3?.replace(
                                      /t/g,
                                      `(${result?.tech_point})`
                                    )}`}
                                  />
                                  <div className="mt-3">
                                    <BlockMath
                                      math={`\\frac{dy}{dx} = ${result?.tech_s4}`}
                                    />
                                  </div>
                                </>
                              )}

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["13"]}
                              </p>
                              <BlockMath math={`y - y₀ = m(x - x₀)`} />

                              <BlockMath
                                math={`y - (${result?.tech_s11}) = ${
                                  Number(result?.tech_s4) ==
                                  parseInt(result?.tech_s4)
                                    ? result?.tech_s4
                                    : result?.tech_s3
                                }(x - (${result?.tech_s1}))`}
                              />

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["14"]}
                              </p>
                              <BlockMath math={`y = ${result?.tech_ans}`} />
                            </>
                          ) : formData?.tech_cal === "r" ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["10"]} (
                                {result?.tech_point}){" "}
                                {data?.payload?.tech_lang_keys["11"]} r(t)
                              </p>

                              <BlockMath
                                math={`r(t) = ${result?.tech_enter}`}
                              />

                              <BlockMath
                                math={`r(${
                                  result?.tech_point
                                }) = ${result?.tech_enter?.replace(
                                  /t/g,
                                  `(${result?.tech_point})`
                                )}`}
                              />

                              <BlockMath
                                math={`r(${result?.tech_point}) = ${result?.tech_s1}`}
                              />

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["12"]} (for step
                                by step, check{" "}
                                <a
                                  href="https://technical-calculator.com/derivative-calculator"
                                  className="text-blue-500 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Derivative Calculator
                                </a>
                                )
                              </p>
                              <div className="w-full res_step mt-3">
                                {/* Render raw KaTeX HTML if tech_step contains <script type="math/tex"> */}
                                {result?.tech_steps && (
                                  <div
                                    ref={containerRef}
                                    className="katex-rendered-content"
                                    dangerouslySetInnerHTML={{
                                      __html: result?.tech_steps,
                                    }}
                                  />
                                )}
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["15"]},
                              </p>

                              <BlockMath
                                math={`\\frac{dy}{dx} = ${result?.tech_s2}`}
                              />
                              <BlockMath
                                math={`\\frac{dy}{dx} = ${result?.tech_s3}`}
                              />

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["10"]} (
                                {result?.tech_point}) into derivative to find
                                slope
                              </p>

                              <BlockMath
                                math={`\\frac{dy}{dx} = ${result?.tech_s3}`}
                              />
                              <BlockMath
                                math={`\\frac{dy}{dx} = ${result?.tech_s3?.replace(
                                  /\bt\b/g,
                                  `(${result?.tech_point})`
                                )}`}
                              />
                              <BlockMath
                                math={`\\frac{dy}{dx} = ${result?.tech_s4}`}
                              />

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["13"]}
                              </p>
                              <BlockMath math={`y - y₀ = m(x - x₀)`} />
                              <BlockMath
                                math={`y - (${result?.tech_y0}) = ${result?.tech_s4}(x - (${result?.tech_x0}))`}
                              />

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["14"]}
                              </p>
                              <BlockMath math={`y = ${result?.tech_ans}`} />
                            </>
                          ) : null}
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

export default TangentLineCalculator;

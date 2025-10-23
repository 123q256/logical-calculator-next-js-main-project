"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import katex from "katex";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTangentPlaneCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TangentPlaneCalculator = () => {
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
    tech_type: "two", //two three
    tech_eq: "x^2 + y^2 + z^2 = 30", //x^3 - 3xy + y^3
    tech_x: 1,
    tech_y: -2,
    tech_z: 5,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTangentPlaneCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Agar tech_type change ho rahi hai
    if (name === "tech_type") {
      if (value === "two") {
        setFormData({
          tech_type: "two",
          tech_eq: "x^3 - 3xy + y^3",
          tech_x: 1,
          tech_y: 2,
          tech_z: 5,
        });
      } else if (value === "three") {
        setFormData({
          tech_type: "three",
          tech_eq: "x^2 + y^2 + z^2 = 30",
          tech_x: 1,
          tech_y: -2,
          tech_z: 5,
        });
      }
    } else {
      // Normal update for other fields
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    setResult(null);
    setFormError(null);
  };

  useEffect(() => {
    if (formData.tech_type === "two") {
      setFormData((prev) => ({
        ...prev,
        tech_eq: "x^3 - 3xy + y^3",
        tech_x: 1,
        tech_y: 2,
        tech_z: 5,
      }));
    } else if (formData.tech_type === "three") {
      setFormData((prev) => ({
        ...prev,
        tech_eq: "x^2 + y^2 + z^2 = 30",
        tech_x: 1,
        tech_y: -2,
        tech_z: 5,
      }));
    }
  }, [formData.tech_type]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_eq: formData.tech_eq,
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_z: formData.tech_z,
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
      tech_type: "two", //two three
      tech_eq: "x^2 + y^2 + z^2 = 30", //x^3 - 3xy + y^3
      tech_x: 1,
      tech_y: -2,
      tech_z: 5,
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

  // result

  const x = formData?.tech_x ?? "";
  const y = formData?.tech_y ?? "";
  const z = formData?.tech_z ?? "";

  const s1 = result?.tech_diffa
    ?.replace(/x/g, `(${x})`)
    .replace(/y/g, `(${y})`);
  const s2 = result?.tech_diffb
    ?.replace(/x/g, `(${x})`)
    .replace(/y/g, `(${y})`);
  const s3 = result?.tech_eq?.replace(/x/g, `(${x})`).replace(/y/g, `(${y})`);

  // Client-side only HTML decoding function
  const decodeHtml = (html) => {
    if (typeof document === "undefined") return html || "";
    const txt = document.createElement("textarea");
    txt.innerHTML = html || "";
    return txt.value;
  };

  const rawDiffa = result?.tech_diffa || "";
  const rawDiffb = result?.tech_diffb || "";
  const rawDiffc = result?.tech_diffc || "";
  const rawAns = result?.tech_ans || "";

  const diffa = decodeHtml(rawDiffa);
  const diffb = decodeHtml(rawDiffb);
  const diffc = decodeHtml(rawDiffc);
  const ans = decodeHtml(rawAns).replace(/frac/g, "dfrac");

  const a = result?.tech_a ?? "";
  const b = result?.tech_b ?? "";
  const c = result?.tech_c ?? "";
  const t = result?.tech_t ?? "";

  // Substitute values
  const ss1 = diffa
    .replace(/x/g, `(${x})`)
    .replace(/y/g, `(${y})`)
    .replace(/z/g, `(${z})`);
  const ss2 = diffb
    .replace(/x/g, `(${x})`)
    .replace(/y/g, `(${y})`)
    .replace(/z/g, `(${z})`);
  const ss3 = diffc
    .replace(/x/g, `(${x})`)
    .replace(/y/g, `(${y})`)
    .replace(/z/g, `(${z})`);

  // PHP ke preg_replace ke jagah JS ka replace use
  const s1_level = result?.tech_diffa
    ?.replace(/x/g, `(${formData?.tech_x})`)
    ?.replace(/y/g, `(${formData?.tech_y})`)
    ?.replace(/z/g, `(${formData?.tech_z})`);

  const s2_level = result?.tech_diffb
    ?.replace(/x/g, `(${formData?.tech_x})`)
    ?.replace(/y/g, `(${formData?.tech_y})`)
    ?.replace(/z/g, `(${formData?.tech_z})`);

  const s3_level = result?.tech_diffc
    ?.replace(/x/g, `(${formData?.tech_x})`)
    ?.replace(/y/g, `(${formData?.tech_y})`)
    ?.replace(/z/g, `(${formData?.tech_z})`);

  // Toggle buttons for showing steps
  const [visibleSteps, setVisibleSteps] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
  });

  const containerRefs = {
    step1: useRef(null),
    step2: useRef(null),
    step3: useRef(null),
    step4: useRef(null),
    step5: useRef(null),
  };

  const handleStepToggle = (step) => {
    setVisibleSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  // Render KaTeX when steps become visible
  useEffect(() => {
    Object.entries(visibleSteps).forEach(([step, isVisible]) => {
      if (isVisible && containerRefs[step].current) {
        setTimeout(() => {
          const el = containerRefs[step].current;
          const scripts = el.querySelectorAll('script[type^="math/tex"]');
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
        }, 10);
      }
    });
  }, [visibleSteps]);

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
          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2 w-full">
              <input
                type="hidden"
                name="tech_type"
                id="calculator_time"
                value={formData.tech_type}
              />
              <div className="flex flex-wrap items-center bg-green-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_type === "two" ? "tagsUnit" : ""
                    }`}
                    id="two"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "two" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["10"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_type === "three" ? "tagsUnit" : ""
                    }`}
                    id="three"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "three" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["11"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_eq" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_eq"
                    id="tech_eq"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_eq}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div
                className={
                  formData.tech_type === "three" ? "col-span-4" : "col-span-6"
                }
                id="xValue"
              >
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["2"]} x:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x"
                    id="tech_x"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div
                className={
                  formData.tech_type === "three" ? "col-span-4" : "col-span-6"
                }
                id="yValue"
              >
                <label htmlFor="tech_y" className="label">
                  {data?.payload?.tech_lang_keys["2"]} y:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_y"
                    id="tech_y"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_y}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_type == "three" && (
                <>
                  <div className="col-span-4 " id="zValue">
                    <label htmlFor="tech_z" className="label">
                      {data?.payload?.tech_lang_keys["2"]} z:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_z"
                        id="tech_z"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_z}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full text-[14px] md:text-[16px]">
                          {formData?.tech_type === "two" ? (
                            <>
                              <div className="mt-3 text-[18px]">
                                <BlockMath
                                  math={`z = ${result?.tech_t?.replace(
                                    /frac/g,
                                    "dfrac"
                                  )}`}
                                />

                                <p className="mt-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]}:
                                  </strong>
                                </p>
                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["6"]}:
                                </p>
                                <BlockMath
                                  math={`z = a(x - x_0) + b(y - y_0) + z_0`}
                                />

                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["7"]} w.r.t
                                  (x): f'(x)
                                </p>
                                <BlockMath math={result?.tech_diffa} />

                                <div className="w-full my-3">
                                  <button
                                    type="button"
                                    className="calculate cursor-pointer repeat px-6 py-3 font-semibold text-[#ffffff] bg-[#2845F5] text-[14px] rounded-lg focus:outline-none focus:ring-2"
                                    onClick={() => handleStepToggle("step1")}
                                  >
                                    {data?.payload?.tech_lang_keys["13"]}
                                  </button>

                                  {visibleSteps.step1 && (
                                    <div
                                      className="w-full res_step block"
                                      ref={containerRefs.step1}
                                      dangerouslySetInnerHTML={{
                                        __html: result?.tech_stepsx,
                                      }}
                                    />
                                  )}
                                </div>

                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["7"]} w.r.t
                                  (y): f'(y)
                                </p>
                                <BlockMath math={result?.tech_diffb} />

                                <div className="w-full my-3">
                                  <button
                                    type="button"
                                    className="calculate cursor-pointer repeat px-6 py-3 font-semibold text-[#ffffff] bg-[#2845F5] text-[14px] rounded-lg focus:outline-none focus:ring-2"
                                    onClick={() => handleStepToggle("step2")}
                                  >
                                    {data?.payload?.tech_lang_keys["13"]}
                                  </button>

                                  {visibleSteps.step2 && (
                                    <div
                                      className="w-full res_step block"
                                      ref={containerRefs.step2}
                                      dangerouslySetInnerHTML={{
                                        __html: result?.tech_stepsy,
                                      }}
                                    />
                                  )}
                                </div>

                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["8"]} (a):
                                </p>
                                <BlockMath
                                  math={`f_x = ${result?.tech_diffa}`}
                                />
                                <BlockMath math={`f_x(${x}, ${y}) = ${s1}`} />
                                <BlockMath
                                  math={`f_x(${x}, ${y}) = ${result?.tech_a}`}
                                />

                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["8"]} (b):
                                </p>
                                <BlockMath
                                  math={`f_y = ${result?.tech_diffb}`}
                                />
                                <BlockMath math={`f_y(${x}, ${y}) = ${s2}`} />
                                <BlockMath
                                  math={`f_y(${x}, ${y}) = ${result?.tech_b}`}
                                />

                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["8"]} (z₀):
                                </p>
                                <BlockMath
                                  math={`f(x, y) = ${result?.tech_eq}`}
                                />
                                <BlockMath math={`f(${x}, ${y}) = ${s3}`} />
                                <BlockMath
                                  math={`f(${x}, ${y}) = ${result?.tech_c}`}
                                />

                                <p className="mt-3">
                                  Finally, {data?.payload?.tech_lang_keys["8"]}{" "}
                                  (z):
                                </p>
                                <BlockMath
                                  math={`x_0 = ${x}, \\quad y_0 = ${y}, \\quad z_0 = ${result?.tech_c}`}
                                />
                                <BlockMath
                                  math={`z = a(x - x_0) + b(y - y_0) + z_0`}
                                />
                                <BlockMath
                                  math={`z = (${result?.tech_a})(x - (${x})) + (${result?.tech_b})(y - (${y})) + (${result?.tech_c})`}
                                />
                                <BlockMath
                                  math={`z = \\color{#1670a7}{${result?.tech_t}}`}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-[16px] md:text-[18px] mt-3 space-y-4">
                                <BlockMath math={`z = ${ans}`} />
                                <p>
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]}:
                                  </strong>
                                </p>
                                <p>{data?.payload?.tech_lang_keys["6"]}:</p>
                                <BlockMath
                                  math={`a(x - x_0) + b(y - y_0) + c(z - z_0) = 0`}
                                />

                                <p>
                                  {data?.payload?.tech_lang_keys["7"]} w.r.t
                                  (x): f'(x)
                                </p>
                                <BlockMath math={diffa} />

                                <div className="w-full my-3">
                                  <button
                                    type="button"
                                    className="calculate cursor-pointer repeat px-6 py-3 font-semibold text-[#ffffff] bg-[#2845F5] text-[14px] rounded-lg focus:outline-none focus:ring-2"
                                    onClick={() => handleStepToggle("step3")}
                                  >
                                    {data?.payload?.tech_lang_keys["13"]}
                                  </button>

                                  {visibleSteps.step3 && (
                                    <div
                                      className="w-full res_step block"
                                      ref={containerRefs.step3}
                                      dangerouslySetInnerHTML={{
                                        __html: result?.tech_stepsx,
                                      }}
                                    />
                                  )}
                                </div>

                                <p>
                                  {data?.payload?.tech_lang_keys["7"]} w.r.t
                                  (y): f'(y)
                                </p>
                                <BlockMath math={diffb} />

                                <div className="w-full my-3">
                                  <button
                                    type="button"
                                    className="calculate cursor-pointer repeat px-6 py-3 font-semibold text-[#ffffff] bg-[#2845F5] text-[14px] rounded-lg focus:outline-none focus:ring-2"
                                    onClick={() => handleStepToggle("step4")}
                                  >
                                    {data?.payload?.tech_lang_keys["13"]}
                                  </button>

                                  {visibleSteps.step4 && (
                                    <div
                                      className="w-full res_step block"
                                      ref={containerRefs.step4}
                                      dangerouslySetInnerHTML={{
                                        __html: result?.tech_stepsy,
                                      }}
                                    />
                                  )}
                                </div>

                                <p>
                                  {data?.payload?.tech_lang_keys["7"]} w.r.t
                                  (z): f'(z)
                                </p>
                                <BlockMath math={diffc} />

                                <div className="w-full my-3">
                                  <button
                                    type="button"
                                    className="calculate cursor-pointer repeat px-6 py-3 font-semibold text-[#ffffff] bg-[#2845F5] text-[14px] rounded-lg focus:outline-none focus:ring-2"
                                    onClick={() => handleStepToggle("step5")}
                                  >
                                    {data?.payload?.tech_lang_keys["13"]}
                                  </button>

                                  {visibleSteps.step5 && (
                                    <div
                                      className="w-full res_step block"
                                      ref={containerRefs.step5}
                                      dangerouslySetInnerHTML={{
                                        __html: result?.tech_stepsz,
                                      }}
                                    />
                                  )}
                                </div>

                                <p>{data?.payload?.tech_lang_keys["8"]} (a):</p>
                                <BlockMath math={`f_x = ${diffa}`} />
                                <BlockMath
                                  math={`f_x(${x}, ${y}, ${z}) = ${ss1}`}
                                />
                                <BlockMath
                                  math={`f_x(${x}, ${y}, ${z}) = ${a}`}
                                />

                                <p>{data?.payload?.tech_lang_keys["8"]} (b):</p>
                                <BlockMath math={`f_y = ${diffb}`} />
                                <BlockMath
                                  math={`f_y(${x}, ${y}, ${z}) = ${ss2}`}
                                />
                                <BlockMath
                                  math={`f_y(${x}, ${y}, ${z}) = ${b}`}
                                />

                                <p>{data?.payload?.tech_lang_keys["8"]} (c):</p>
                                <BlockMath math={`f_z = ${diffc}`} />
                                <BlockMath
                                  math={`f_z(${x}, ${y}, ${z}) = ${ss3}`}
                                />
                                <BlockMath
                                  math={`f_z(${x}, ${y}, ${z}) = ${c}`}
                                />

                                <p>
                                  {data?.payload?.tech_lang_keys["9"]},{" "}
                                  {data?.payload?.tech_lang_keys["8"]}{" "}
                                  {data?.payload?.tech_lang_keys["4"]}:
                                </p>
                                <BlockMath
                                  math={`x_0 = ${x}, \\quad y_0 = ${y}, \\quad z_0 = ${z}`}
                                />
                                <BlockMath
                                  math={`a(x - x_0) + b(y - y_0) + c(z - z_0) = 0`}
                                />
                                <BlockMath
                                  math={`(${a})(x - (${x})) + (${b})(y - (${y})) + (${c})(z - (${z})) = 0`}
                                />
                                <BlockMath math={`${t} = 0`} />

                                <p>{data?.payload?.tech_lang_keys["12"]}:</p>
                                <BlockMath
                                  math={`z = \\textcolor{orange}{${ans}}`}
                                />
                              </div>
                            </>
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

export default TangentPlaneCalculator;

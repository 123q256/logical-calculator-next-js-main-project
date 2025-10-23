"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useComplexNumberCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ComplexNumberCalculator = () => {
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
    tech_exp: "(2+5i)(5-3i)",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useComplexNumberCalculatorMutation();

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
      tech_exp: (prev.tech_exp || "") + value,
    }));
    setResult(null);
    setFormError(null);
  };

  const clearInput = () => {
    setFormData((prev) => ({ ...prev, tech_exp: "" }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_exp) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_exp: formData.tech_exp,
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
      tech_exp: "(2+5i)(5-3i)",
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
      "(2 + 5i)(5 - 3i)",
      "(3 + 2i)(1 - 4i)",
      "(4 - i)(2 + 3i)",
      "(6 + 7i)(6 - 7i)",
    ];

    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setFormData((prev) => ({
      ...prev,
      tech_exp: randomExample,
    }));
    setResult(null);
    setFormError(null);
  };

  // result

  const a = result?.tech_a;
  let b = result?.tech_b;
  const b1 = result?.tech_b1;
  const opr = b?.includes("-") ? "+" : "-";
  b = b?.replace("-", "");
  const conjugate = b1?.includes("-") ? b1?.replace("-", "+") : -1 * b1;

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
                <div className="col-span-12 md:col-span-4 lg:col-span-4 md:flex md:justify-between">
                  <label htmlFor="tech_exp" className="label mt-4">
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
                    name="tech_exp"
                    id="tech_exp"
                    className="input "
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_exp}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[16px] overflow-auto">
                        <p className="mt-3 text-[18px]">
                          <InlineMath math={result?.tech_expand1} />
                        </p>

                        <p className="mt-3 text-[18px] font-bold">
                          {data?.payload?.tech_lang_keys["4"]}
                        </p>
                        <p className="mt-3 text-[18px]">
                          <InlineMath
                            math={`${result?.tech_r}(\cos(${result?.tech_theta}) + i\sin(${result?.tech_theta}))`}
                          />
                        </p>

                        <p className="mt-3 text-[18px] font-bold">
                          {data?.payload?.tech_lang_keys["5"]}
                        </p>
                        <p className="mt-3 text-[18px]">
                          <InlineMath
                            math={`\\frac{1}{${
                              result?.tech_expand1
                            }} = \\frac{${a}}{${
                              result?.tech_simp
                            }} ${opr} \\frac{${b}}{${
                              result?.tech_simp
                            }}i \approx ${
                              a / result?.tech_simp
                            } ${opr} \\frac{${b}}{${result?.tech_simp}}i`}
                          />
                        </p>

                        <p className="mt-3 text-[18px] font-bold">
                          {data?.payload?.tech_lang_keys["6"]}
                        </p>
                        <p className="mt-3 text-[18px]">
                          <InlineMath math={`${a}${conjugate}i`} />
                        </p>

                        <p className="mt-3 text-[18px] font-bold">
                          {data?.payload?.tech_lang_keys["7"]}
                        </p>
                        <p className="mt-3 text-[18px]">
                          <InlineMath
                            math={`${result?.tech_r} \approx \sqrt{${result?.tech_simp}}`}
                          />
                        </p>

                        <p className="mt-3 font-bold">
                          {data?.payload?.tech_lang_keys["8"]}
                        </p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["9"]}
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`${result?.tech_enter} = ${result?.tech_expand}`}
                          />
                        </p>

                        <p className="mt-3">
                          ({data?.payload?.tech_lang_keys["10"]}{" "}
                          <a
                            href="https://calculator-logical.com/foil-calculator/"
                            className="text-red-900 underline"
                            target="_blank"
                          >
                            {data?.payload?.tech_lang_keys[11]}
                          </a>{" "}
                          {data?.payload?.tech_lang_keys["12"]})
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["13"]}{" "}
                          <InlineMath math={`i^2 = -1`} />{" "}
                          {data?.payload?.tech_lang_keys["14"]}:
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`${
                              result?.tech_enter
                            } = ${result?.tech_expand?.replace(
                              /i\^\{2\}/,
                              "(-1"
                            )}`}
                          />
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`${result?.tech_enter} = ${result?.tech_expand1}`}
                          />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["4"]}
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["15"]}{" "}
                          <InlineMath math="a + bi" />,{"\u00A0"}
                          {data?.payload?.tech_lang_keys["16"]}{" "}
                          <InlineMath math="r(\cos(\theta) + i\sin(\theta))" />,
                          {"\u00A0"}
                          {data?.payload?.tech_lang_keys["17"]}{" "}
                          <InlineMath math="r=\sqrt{a^2 + b^2}" />,{"\u00A0"}
                          {data?.payload?.tech_lang_keys["18"]}{" "}
                          <InlineMath math="\theta = \arctan\left(\frac{b}{a}\right)" />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["19"]}:
                        </p>

                        <p className="mt-3">
                          <InlineMath math={`a = ${a}`} />{" "}
                          {data?.payload?.tech_lang_keys["18"]}{" "}
                          <InlineMath math={`b = ${b1}`} />
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`r = \\sqrt{(${a})^2 + (${b1})^2} = ${result?.tech_r}`}
                          />
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`\\theta = \\arctan\\left(\\frac{${b1}}{${a}}\\right) = ${result?.tech_theta}`}
                          />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["20"]},
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`${result?.tech_expand1} = ${result?.tech_r}\\left(\\cos(${result?.tech_theta}) + i\\sin(${result?.tech_theta})\\right)`}
                          />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["5"]}
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["27"]}{" "}
                          {data?.payload?.tech_lang_keys["21"]}{" "}
                          {data?.payload?.tech_lang_keys["23"]}{" "}
                          <InlineMath math={`${result?.tech_expand1}`} />{" "}
                          {data?.payload?.tech_lang_keys["22"]}{" "}
                          <InlineMath
                            math={`\\frac{1}{${result?.tech_expand1}}`}
                          />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                          {data?.payload?.tech_lang_keys["23"]} (a + bi){" "}
                          {data?.payload?.tech_lang_keys["22"]} (a - bi),{" "}
                          {data?.payload?.tech_lang_keys["30"]}{" "}
                          <InlineMath math={`\\frac{1}{a + bi}`} />{" "}
                          {data?.payload?.tech_lang_keys["24"]}:
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`\\frac{1}{a + bi} = \\frac{1}{(a + bi)(a - bi)} (a - bi)`}
                          />
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`\\frac{1}{a + bi} = \\frac{a - bi}{a^2 + b^2}`}
                          />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["25"]}:
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`\\frac{1}{a + bi} = \\frac{a}{a^2 + b^2} - \\frac{bi}{a^2 + b^2}`}
                          />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["26"]},{" "}
                          <InlineMath math={`a = ${a}`} />{" "}
                          {data?.payload?.tech_lang_keys["18"]}{" "}
                          <InlineMath math={`b = ${b1}`} />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["20"]},
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["27"]}{" "}
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                          {data?.payload?.tech_lang_keys["23"]}{" "}
                          <InlineMath math={`a + bi`} />{" "}
                          {data?.payload?.tech_lang_keys["22"]}{" "}
                          <InlineMath math={`a - bi`} />,{" "}
                          {data?.payload?.tech_lang_keys["29"]},
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["27"]}{" "}
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                          {data?.payload?.tech_lang_keys["23"]}{" "}
                          <InlineMath math={`(${result?.tech_expand1})`} />{" "}
                          {data?.payload?.tech_lang_keys["22"]}{" "}
                          <InlineMath math={`(${a}${conjugate}i)`} />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["7"]}
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["27"]}{" "}
                          {data?.payload?.tech_lang_keys["28"]}{" "}
                          {data?.payload?.tech_lang_keys["23"]}{" "}
                          <InlineMath math={`a + bi`} />{" "}
                          {data?.payload?.tech_lang_keys["22"]}{" "}
                          <InlineMath math={`\sqrt{a^2 + b^2}`} />,{" "}
                          {data?.payload?.tech_lang_keys["29"]},
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["27"]}{" "}
                          {data?.payload?.tech_lang_keys["28"]}{" "}
                          {data?.payload?.tech_lang_keys["23"]}{" "}
                          <InlineMath math={`${result?.tech_expand1}`} />{" "}
                          {data?.payload?.tech_lang_keys["22"]}{" "}
                          <InlineMath
                            math={`${result?.tech_r} \approx \sqrt{${result?.tech_simp}}`}
                          />
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

export default ComplexNumberCalculator;

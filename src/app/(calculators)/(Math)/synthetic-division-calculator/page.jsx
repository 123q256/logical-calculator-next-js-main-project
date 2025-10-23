"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import katex from "katex";
import "katex/dist/katex.min.css";

function renderMath(mathString, displayMode = true) {
  try {
    return { __html: katex.renderToString(mathString, { displayMode }) };
  } catch (error) {
    return { __html: mathString };
  }
}

import {
  useGetSingleCalculatorDetailsMutation,
  useSyntheticDivisionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SyntheticDivisionCalculator = () => {
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
    tech_dividend: "7x^3 + 4x + 8",
    tech_divisor: "x + 2",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSyntheticDivisionCalculatorMutation();

  const equationRef = useRef(null);

  useEffect(() => {
    const { tech_dividend, tech_divisor } = formData;

    if (equationRef.current) {
      const equation = `\\frac{${tech_dividend || "?"}}{${
        tech_divisor || "?"
      }}`;

      try {
        katex.render(equation, equationRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (err) {
        console.error("KaTeX render error:", err);
        equationRef.current.innerText = "Invalid Equation";
      }
    }
  }, [formData.tech_dividend, formData.tech_divisor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_dividend || !formData.tech_divisor) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_dividend: formData.tech_dividend,
        tech_divisor: formData.tech_divisor,
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
      tech_dividend: "7x^3 + 4x + 8",
      tech_divisor: "x + 2",
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

  const coeffs1 = result?.tech_coeffs1 || [];

  const rawCoeffs = result?.tech_coeffs || [];
  const coeffs = rawCoeffs.map((c) => {
    const val = parseFloat(c);
    return !isNaN(val) ? val : 0; // fallback to 0 to avoid NaN
  });

  const divby = !isNaN(parseFloat(result?.tech_divby))
    ? parseFloat(result.tech_divby)
    : 0;

  let steps = [];
  let carries = [];
  let carry = [];
  let muls = [];

  carry[0] = coeffs[0];

  const outer_len = (coeffs.length - 2) * 2;
  let k = 0;

  for (let i = 0; i < outer_len; i++) {
    if (i > 1 && i % 2 === 0) k++;

    if (i % 2 === 0) {
      // Multiply
      const c = carry[k] * divby;
      carries[k] = c;
      steps.push({
        type: "multiply",
        equation: `${carry[k]} * (${divby}) = ${c}`,
        carry: [...carries],
        muls: [...muls],
      });
    } else {
      // Add
      const m = coeffs[k + 1] + carries[k];
      muls[k] = m;
      carry[k + 1] = m;
      steps.push({
        type: "add",
        equation: `${coeffs[k + 1]} + (${carries[k]}) = ${m}`,
        carry: [...carries],
        muls: [...muls],
      });
    }
  }

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_dividend" className="label">
                  {data?.payload?.tech_lang_keys["1"] ?? "Dividend"}:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="tech_dividend"
                    id="tech_dividend"
                    className="input my-2"
                    placeholder="2x + 1"
                    value={formData.tech_dividend}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Divisor Input */}
              <div className="col-span-12">
                <label htmlFor="tech_divisor" className="label">
                  {data?.payload?.tech_lang_keys["2"] ?? "Divisor"} (ax + b):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="tech_divisor"
                    id="tech_divisor"
                    className="input my-2"
                    placeholder="3x - 7"
                    value={formData.tech_divisor}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Equation Preview */}
              <div className="col-span-12">
                <label
                  htmlFor="equation_preview"
                  className="font-s-14 text-blue"
                >
                  Equation Preview
                </label>
                <p
                  className="col-12 mt-0 mt-lg-2 pt-2 flex justify-center bg-sky text-center mx-auto overflow-auto rounded-lg bordered"
                  id="equation_preview"
                  ref={equationRef}
                ></p>
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
                      <div className="w-full overflow-auto">
                        <div className={`col-12 text-[16px]`}>
                          <div className="bg-sky bordered rounded-lg px-3 py-2 mt-2 text-[16px] overflow-auto">
                            <p className="mt-2 flex ">
                              <strong>Quotient = </strong>
                              <span
                                className="customcode"
                                dangerouslySetInnerHTML={renderMath(
                                  result?.tech_quot
                                )}
                              />
                            </p>
                            <p className="mt-3 flex ">
                              <strong>Remainder = </strong>
                              <span
                                className="customcode"
                                dangerouslySetInnerHTML={renderMath(
                                  result?.tech_rmnd
                                )}
                              />
                            </p>
                          </div>

                          <p className="mt-2">
                            <strong>Step by Step Solution:</strong>
                          </p>

                          <div className="bg-sky bordered rounded-lg px-3 py-2 mt-2 overflow-auto synth_steps">
                            {/* Start of steps */}
                            <p
                              className="mt-3"
                              dangerouslySetInnerHTML={renderMath(
                                `\\dfrac{${result?.tech_eq}}{${result?.tech_eq1}}`
                              )}
                            />
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[6]}
                            </p>

                            <p
                              className="mt-3"
                              dangerouslySetInnerHTML={renderMath(
                                `(${coeffs1.slice(0, -1).join(", ")})`
                              )}
                            />
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[7]}
                            </p>

                            <p
                              className="mt-3"
                              dangerouslySetInnerHTML={renderMath(
                                `${result?.tech_eq1} = 0`
                              )}
                            />
                            {result?.tech_divby1.includes("frac") && (
                              <p
                                className="mt-3"
                                dangerouslySetInnerHTML={renderMath(
                                  `x = ${result?.tech_divby1.replace(
                                    "frac",
                                    "dfrac"
                                  )}`
                                )}
                              />
                            )}
                            <p
                              className="mt-3"
                              dangerouslySetInnerHTML={renderMath(
                                `x = ${result?.tech_divby}`
                              )}
                            />
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[8]}
                            </p>

                            {/* Initial synthetic division box */}
                            <p
                              className="mt-4"
                              dangerouslySetInnerHTML={renderMath(`
                                \\begin{array}{c|${"r".repeat(
                                  coeffs.length - 1
                                )}} & ${coeffs
                                .slice(1)
                                .map((_, i) => `x^{${coeffs.length - 2 - i}}`)
                                .join("&")} \\\\
                                ${result?.tech_divby} & ${coeffs
                                .slice(0, -1)
                                .join("&")} \\\\ \\hline & 
                              \\end{array}`)}
                            />

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[9]}
                            </p>

                            <p
                              className="mt-4"
                              dangerouslySetInnerHTML={renderMath(`
                                \\begin{array}{c|${"r".repeat(
                                  coeffs.length - 1
                                )}}${result?.tech_divby}& ${coeffs
                                .slice(0, -1)
                                .join("&")} \\\\ \\hline & ${
                                coeffs[0]
                              } \\end{array}
                              `)}
                            />

                            {/* Dynamic Steps */}
                            {steps.map((step, index) => (
                              <React.Fragment key={index}>
                                <p className="mt-3">
                                  {
                                    data?.payload?.tech_lang_keys[
                                      step.type === "multiply" ? 10 : 11
                                    ]
                                  }
                                </p>
                                <p
                                  className="mt-3"
                                  dangerouslySetInnerHTML={renderMath(
                                    step.equation
                                  )}
                                />
                                <p
                                  className="mt-4"
                                  dangerouslySetInnerHTML={renderMath(`
                                    \\begin{array}{c|${"r".repeat(
                                      coeffs.length - 1
                                    )}}${result?.tech_divby}& ${coeffs
                                    .slice(0, -1)
                                    .join("&")} \\\\
                                    & ${step.carry.join("&")} \\\\ \\hline & ${
                                    coeffs[0]
                                  } & ${step.muls.join("&")} \\end{array}
                                  `)}
                                />
                              </React.Fragment>
                            ))}

                            {/* Final Result */}
                            <p className="mt-4">
                              {data?.payload?.tech_lang_keys[12]}{" "}
                              {result?.tech_quot},{" "}
                              {data?.payload?.tech_lang_keys[13]}{" "}
                              {result?.tech_rmnd}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[14]}:
                            </p>

                            <p
                              className="mt-4"
                              dangerouslySetInnerHTML={renderMath(`
                                \\dfrac{${result?.tech_eq}}{${
                                result?.tech_eq1
                              }} = ${result?.tech_quot} ${
                                parseFloat(result?.tech_rmnd) < 0 ? "-" : "+"
                              } \\dfrac{${Math.abs(result?.tech_rmnd)}}{${
                                result?.tech_eq1
                              }} ${
                                result?.tech_rmnd === "0"
                                  ? "= " + result?.tech_quot
                                  : ""
                              }
                              `)}
                            />
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

export default SyntheticDivisionCalculator;

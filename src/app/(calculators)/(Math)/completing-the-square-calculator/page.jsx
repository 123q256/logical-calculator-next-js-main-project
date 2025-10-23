"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useCompletingTheSquareCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CompletingTheSquareCalculator = () => {
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
    tech_A: "2",
    tech_B: "-6",
    tech_C: "-13",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCompletingTheSquareCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_A || !formData.tech_B || !formData.tech_C) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_A: formData.tech_A,
        tech_B: formData.tech_B,
        tech_C: formData.tech_C,
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
      tech_A: "2",
      tech_B: "-6",
      tech_C: "-13",
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

  const a = formData?.tech_A;
  const b = result?.tech_B;
  const c = result?.tech_C;
  const x1 = result?.tech_x1;
  const x2 = result?.tech_x2;

  const A = formData?.tech_A;
  const B = result?.tech_B;
  const C = result?.tech_C;

  const B_sign = B < 0 ? "" : "+";
  const C_sign = C < 0 ? "" : "+";

  const B_div = Math.abs(B);
  const C_div = Math.abs(C);

  const B_squared = Math.pow(B, 2);
  const A2_squared = Math.pow(A * 2, 2);

  const B_val = Math.abs(B);
  const A2 = A * 2;
  const C_val = C < 0 ? -C : C;

  // Calculate right side
  let right_side = (A2_squared / A) * -C + Math.pow(B, 2);

  let i = "";
  if (right_side < 0) {
    right_side *= -1;
    i = "\\, i";
  }

  //  const A = formData?.tech_A;
  // const B = result?.tech_B;
  // const C = result?.tech_C;
  // const B_sign = B < 0 ? '-' : '+';
  // const B_val = Math.abs(B);
  // const C_val = Math.abs(C);
  const B_by_2 = B / 2;
  const B_half_sq = Math.pow(B_by_2, 2);

  // First right side case
  // let right_side = -C + B_half_sq;
  // let i = '';
  // if (right_side < 0) {
  //   right_side *= -1;
  //   i = '\\, i';
  // }

  const sqrtPart = `\\sqrt{${right_side}}${i}`;

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

          <div className="lg:w-[50%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="grid grid-cols-12 mt-3 gap-3 ">
                  <div className="col-span-4">
                    <label htmlFor="tech_A" className="label">
                      A
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_A"
                        id="tech_A"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_A}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <label htmlFor="tech_B" className="label">
                      B
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_B"
                        id="tech_B"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_B}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <label htmlFor="tech_C" className="label">
                      B
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_C"
                        id="tech_C"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_C}
                        onChange={handleChange}
                      />
                    </div>
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2 text-[18px]">
                            <strong>{result?.tech_roots}</strong>
                          </p>
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["sol"]}:
                            </strong>
                          </p>

                          <BlockMath
                            math={`\\text{Standard Form: } ${A}x^2 ${
                              B < 0 ? "" : "+"
                            }${B}x ${C < 0 ? "" : "+"}${C} = 0`}
                          />

                          <BlockMath
                            math={`a = ${A},\\ b = ${B},\\ c = ${C}`}
                          />

                          {A !== 1 && (
                            <>
                              <BlockMath
                                math={`a \\ne 1 \\quad ${data?.payload?.tech_lang_keys["divide"]}\\ ${A}`}
                              />
                              <BlockMath
                                math={`x^2 ${
                                  B < 0 ? "-" : "+"
                                } \\frac{${B_div}x}{${A}} = ${
                                  C < 0 ? "" : "-"
                                }\\frac{${C_div}}{${A}}`}
                              />
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["half"]} \( x \){" "}
                                {data?.payload?.tech_lang_keys["add_s"]}
                              </p>
                              <BlockMath
                                math={`x^2 ${
                                  B < 0 ? "-" : "+"
                                } \\frac{${B_div}x}{${A}} + \\frac{${B_squared}}{${A2_squared}} = ${
                                  C < 0 ? "" : "-"
                                }\\frac{${C_div}}{${A}} + \\frac{${B_squared}}{${A2_squared}}`}
                              />
                              <BlockMath
                                math={`\\left(x ${
                                  B < 0 ? "-" : "+"
                                } \\frac{${B_div}}{${A * 2}}\\right)^2 = ${
                                  C < 0 ? "" : "-"
                                }\\frac{${C_div}}{${A}} + \\frac{${B_squared}}{${A2_squared}}`}
                              />
                            </>
                          )}
                          {/* (x ± b/2a)^2 = right_side / A2_squared */}
                          <BlockMath
                            math={`\\left(x ${
                              B < 0 ? "-" : "+"
                            } \\frac{${B_val}}{${A2}}\\right)^2 = \\frac{${right_side}}{${A2_squared}}`}
                          />
                          {/* x ± sqrt(right_side / A2_squared) */}
                          {right_side !== 0 && (
                            <>
                              <BlockMath
                                math={`x ${
                                  B < 0 ? "-" : "+"
                                } \\frac{${B_val}}{${A2}} = \\pm \\sqrt{\\frac{${right_side}}{${A2_squared}}}${i}`}
                              />
                              <BlockMath
                                math={`x = ${
                                  B < 0 ? "+" : "-"
                                } \\frac{${B_val}}{${A2}} \\pm \\sqrt{\\frac{${right_side}}{${A2_squared}}}${i}`}
                              />
                              <BlockMath
                                math={`x_1 = ${
                                  B < 0 ? "+" : "-"
                                } \\frac{${B_val}}{${A2}} + \\sqrt{\\frac{${right_side}}{${A2_squared}}}${i} \\quad =\\ ${
                                  result?.tech_x1
                                }${i}`}
                              />
                              <BlockMath
                                math={`x_2 = ${
                                  B < 0 ? "+" : "-"
                                } \\frac{${B_val}}{${A2}} - \\sqrt{\\frac{${right_side}}{${A2_squared}}}${i} \\quad =\\ ${
                                  result?.tech_x2
                                }${i}`}
                              />
                            </>
                          )}
                          {/* Special case: root is zero */}
                          {right_side === 0 && (
                            <>
                              <BlockMath
                                math={`x ${
                                  B < 0 ? "-" : "+"
                                } \\frac{${B_val}}{${A2}} = \\pm \\sqrt{${right_side}}`}
                              />
                              <BlockMath
                                math={`x = ${
                                  B < 0 ? "+" : "-"
                                } \\frac{${B_val}}{${A2}} = ${result?.tech_x1}`}
                              />
                            </>
                          )}
                          {A === 1 && (
                            <>
                              <BlockMath
                                math={`x^2 ${B < 0 ? "-" : "+"} ${B_val}x = ${
                                  C < 0 ? "-" : ""
                                }${C_val}`}
                              />
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["half"]} x{" "}
                                {data?.payload?.tech_lang_keys["add_s"]}
                              </p>
                              {Number.isInteger(B_by_2) && (
                                <>
                                  <BlockMath
                                    math={`x^2 ${
                                      B < 0 ? "-" : "+"
                                    } ${B_val}x + ${B_half_sq} = ${
                                      C < 0 ? "-" : ""
                                    }${C_val} + ${B_half_sq}`}
                                  />
                                  <BlockMath
                                    math={`\\left(x ${
                                      B < 0 ? "-" : "+"
                                    } ${Math.abs(B_by_2)}\\right)^2 = ${
                                      C < 0 ? "-" : ""
                                    }${C_val} + ${B_half_sq}`}
                                  />
                                  <BlockMath
                                    math={`x ${B < 0 ? "-" : "+"} ${Math.abs(
                                      B_by_2
                                    )} = \\pm ${sqrtPart}`}
                                  />
                                  <BlockMath
                                    math={`x = ${B < 0 ? "+" : "-"} ${Math.abs(
                                      B_by_2
                                    )} \\pm ${sqrtPart}`}
                                  />
                                  <BlockMath
                                    math={`x_1 = ${
                                      B < 0 ? "+" : "-"
                                    } ${Math.abs(B_by_2)} + ${sqrtPart} = ${
                                      result?.tech_x1
                                    }${i}`}
                                  />
                                  <BlockMath
                                    math={`x_2 = ${
                                      B < 0 ? "+" : "-"
                                    } ${Math.abs(B_by_2)} - ${sqrtPart} = ${
                                      result?.tech_x2
                                    }${i}`}
                                  />
                                </>
                              )}

                              {/* Right side is zero case */}
                              {right_side === 0 && (
                                <>
                                  <BlockMath
                                    math={`x ${B < 0 ? "-" : "+"} ${Math.abs(
                                      B_by_2
                                    )} = \\pm \\sqrt{0}`}
                                  />
                                  <BlockMath
                                    math={`x = ${B < 0 ? "+" : "-"} ${Math.abs(
                                      B_by_2
                                    )}`}
                                  />
                                </>
                              )}
                            </>
                          )}

                          {/* For else case (A !== 1) */}
                          {A !== 1 && (
                            <>
                              <BlockMath
                                math={`x^2 ${
                                  B < 0 ? "-" : "+"
                                } ${B_val}x + \\frac{${Math.pow(B, 2)}}{4} = ${
                                  C < 0 ? "-" : ""
                                }${C_val} + \\frac{${Math.pow(B, 2)}}{4}`}
                              />
                              <BlockMath
                                math={`\\left(x ${
                                  B < 0 ? "-" : "+"
                                } \\frac{${B_val}}{2}\\right)^2 = ${
                                  C < 0 ? "-" : ""
                                }${C_val} + \\frac{${Math.pow(B, 2)}}{4}`}
                              />

                              {/* Compute new right_side */}
                              {(() => {
                                let new_right = C * -1 * 4 + Math.pow(B, 2);
                                let imaginary = "";
                                if (new_right < 0) {
                                  new_right *= -1;
                                  imaginary = "\\, i";
                                }

                                return (
                                  <>
                                    {new_right !== 0 ? (
                                      <>
                                        <BlockMath
                                          math={`x ${
                                            B < 0 ? "-" : "+"
                                          } \\frac{${B_val}}{2} = \\pm \\sqrt{\\frac{${new_right}}{4}}${imaginary}`}
                                        />
                                        <BlockMath
                                          math={`x = ${
                                            B < 0 ? "+" : "-"
                                          } \\frac{${B_val}}{2} \\pm \\sqrt{\\frac{${new_right}}{4}}${imaginary}`}
                                        />
                                        <BlockMath
                                          math={`x_1 = ${
                                            B < 0 ? "+" : "-"
                                          } \\frac{${B_val}}{2} + \\sqrt{\\frac{${new_right}}{4}}${imaginary} = ${
                                            result?.tech_x1
                                          }${imaginary}`}
                                        />
                                        <BlockMath
                                          math={`x_2 = ${
                                            B < 0 ? "+" : "-"
                                          } \\frac{${B_val}}{2} - \\sqrt{\\frac{${new_right}}{4}}${imaginary} = ${
                                            result?.tech_x2
                                          }${imaginary}`}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <BlockMath
                                          math={`x ${
                                            B < 0 ? "-" : "+"
                                          } \\frac{${B_val}}{2} = \\pm \\sqrt{${new_right}}`}
                                        />
                                        <BlockMath
                                          math={`x = ${
                                            B < 0 ? "+" : "-"
                                          } \\frac{${B_val}}{2}`}
                                        />
                                      </>
                                    )}
                                  </>
                                );
                              })()}
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

export default CompletingTheSquareCalculator;

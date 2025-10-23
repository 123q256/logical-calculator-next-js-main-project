"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useProductSumCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ProductSumCalculator = () => {
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
    tech_product: 24,
    tech_sum: 44,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useProductSumCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_product || !formData.tech_sum) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_product: formData.tech_product,
        tech_sum: formData.tech_sum,
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
      tech_product: 24,
      tech_sum: 44,
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

  // Calculations jo aapne PHP mein kiye the:
  const inner1 = 4 * result?.tech_a * result?.tech_C;
  const inner = Math.pow(result?.tech_B, 2) - inner1;
  const inner2 = Math.round(Math.sqrt(Math.abs(inner)) * 10000) / 10000;

  const signB =
    result?.tech_B < 0 ? `${result?.tech_B}` : `+ ${result?.tech_B}`;
  const signInner1 = inner1 < 0 ? `+ ${Math.abs(inner1)}` : `- ${inner1}`;
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

          <div className="lg:w-[40%] md:w-[40%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_product" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_product"
                    id="tech_product"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_product}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_sum" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_sum"
                    id="tech_sum"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_sum}
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
                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3 overflow-auto">
                      <div className="w-full text-[16px] overflow-auto">
                        <p className="mt-3 text-[18px]">
                          <strong>{result?.tech_roots}</strong>
                        </p>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["4"]}:</strong>
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[1]}(x.y) ={" "}
                          {formData?.tech_product}
                        </p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[2]}(x+y) ={" "}
                          {formData?.tech_sum}
                        </p>
                        <p className="mt-3">y = {formData?.tech_sum} - x</p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[5]} y in x.y ={" "}
                          {formData?.tech_product}
                        </p>

                        <div className="mt-3">
                          {data?.payload?.tech_lang_keys[6]}:{" "}
                          <BlockMath
                            math={` ${result?.tech_a}x^2 ${
                              result?.tech_B < 0
                                ? result?.tech_B
                                : `+ ${result?.tech_B}`
                            }x ${
                              result?.tech_C < 0
                                ? result.tech_C
                                : `+ ${result.tech_C}`
                            } = 0`}
                          />
                        </div>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[7]}
                        </p>

                        <p className="mt-3">
                          a = {result?.tech_a}, b = {result?.tech_B},{" "}
                          {data?.payload?.tech_lang_keys[8]} c ={" "}
                          {result?.tech_C}
                        </p>

                        <div className="mt-3">
                          <BlockMath
                            math={`x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`}
                          />
                        </div>

                        <div className="mt-3">
                          <BlockMath
                            math={`x = \\frac{${
                              result?.tech_B < 0
                                ? `-${result?.tech_B}`
                                : `- ${result?.tech_B}`
                            } \\pm \\sqrt{(${result?.tech_B})^2 - 4(${
                              result?.tech_a
                            })(${result?.tech_C})}}{2(${result?.tech_a})}`}
                          />
                        </div>

                        <div className="mt-3">
                          <BlockMath
                            math={`x = \\frac{${
                              result?.tech_B < 0
                                ? -result?.tech_B
                                : `- ${result?.tech_B}`
                            } \\pm \\sqrt{${Math.pow(result?.tech_B, 2)} ${
                              inner1 < 0
                                ? `+ ${Math.abs(inner1)}`
                                : `- ${inner1}`
                            }}}{${result?.tech_a * 2}}`}
                          />
                        </div>

                        <div className="mt-3">
                          <BlockMath
                            math={`x = \\frac{${
                              result?.tech_B < 0
                                ? -result?.tech_B
                                : `- ${result?.tech_B}`
                            } \\pm \\sqrt{${inner}}}{${result?.tech_a * 2}}`}
                          />
                        </div>

                        {inner > 0 && (
                          <>
                            <p className="mt-3">
                              b<sup className="font-s-14">2</sup> − 4ac &gt; 0{" "}
                              {data?.payload?.tech_lang_keys[9]}
                            </p>
                            <div className="mt-3">
                              <BlockMath
                                math={`x_1 = \\frac{${
                                  result?.tech_B < 0
                                    ? -result?.tech_B
                                    : `- ${result?.tech_B}`
                                } + \\sqrt{${inner}}}{${
                                  result?.tech_a * 2
                                }}, \\quad x_1 = ${(
                                  (-result?.tech_B + inner2) /
                                  (result?.tech_a * 2)
                                ).toFixed(4)}`}
                              />
                            </div>
                            <div className="mt-3">
                              <BlockMath
                                math={`x_2 = \\frac{${
                                  result?.tech_B < 0
                                    ? -result?.tech_B
                                    : `- ${result?.tech_B}`
                                } - \\sqrt{${inner}}}{${
                                  result?.tech_a * 2
                                }}, \\quad x_2 = ${(
                                  (-result?.tech_B - inner2) /
                                  (result?.tech_a * 2)
                                ).toFixed(4)}`}
                              />
                            </div>
                          </>
                        )}

                        {inner < 0 && (
                          <>
                            <p className="mt-3">
                              b<sup className="font-s-14">2</sup> − 4ac &lt; 0
                              so, there are two complex roots.
                            </p>
                            <div className="mt-3">
                              <BlockMath
                                math={`x_1 = \\frac{${
                                  result?.tech_B < 0
                                    ? -result?.tech_B
                                    : `- ${result?.tech_B}`
                                } + \\sqrt{${Math.abs(inner)}}i}{${
                                  result?.tech_a * 2
                                }}, \\quad x_1 = ${(
                                  -result?.tech_B /
                                  (result?.tech_a * 2)
                                ).toFixed(4)} + ${(
                                  Math.sqrt(Math.abs(inner)) /
                                  (result?.tech_a * 2)
                                ).toFixed(4)}i`}
                              />
                            </div>
                            <div className="mt-3">
                              <BlockMath
                                math={`x_2 = \\frac{${
                                  result?.tech_B < 0
                                    ? -result?.tech_B
                                    : `- ${result?.tech_B}`
                                } - \\sqrt{${Math.abs(inner)}}i}{${
                                  result?.tech_a * 2
                                }}, \\quad x_2 = ${(
                                  -result?.tech_B /
                                  (result?.tech_a * 2)
                                ).toFixed(4)} - ${(
                                  Math.sqrt(Math.abs(inner)) /
                                  (result?.tech_a * 2)
                                ).toFixed(4)}i`}
                              />
                            </div>
                          </>
                        )}

                        {inner === 0 && (
                          <>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["t_d"]} b
                              <sup className="font-s-14">2</sup> − 4ac = 0 so,
                              there is one real root.
                            </p>
                            <div className="mt-3">
                              <BlockMath
                                math={`x = \\frac{${
                                  result?.tech_B < 0
                                    ? -result?.tech_B
                                    : `- ${result?.tech_B}`
                                }}{${result?.tech_a * 2}}`}
                              />
                            </div>
                            <div className="mt-3">
                              <BlockMath math={`${result?.tech_roots}`} />
                            </div>
                          </>
                        )}
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

export default ProductSumCalculator;

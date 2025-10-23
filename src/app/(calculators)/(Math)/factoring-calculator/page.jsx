"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useFactoringCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FactoringCalculator = () => {
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
    tech_type: "factor", // factoring factor
    tech_eq: "x^2-6x+8",
    tech_num1: "12",
    tech_num2: "8",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFactoringCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

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
        tech_num1: formData.tech_num1,
        tech_num2: formData.tech_num2,
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
      tech_type: "factor", // factoring factor
      tech_eq: "x^2-6x+8",
      tech_num1: "12",
      tech_num2: "8",
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
  const ac = result?.tech_a * result?.tech_c;
  const divisors = result?.tech_divisors_ans || [];
  const step2Array = result?.tech_step2_array_first || [];
  const step2Second = result?.tech_step2_array_second || [];
  const step2Ans = result?.tech_step2_ans_array || [];
  const step3ArrayFirst = result?.tech_step3_array_first || [];
  const step3ArraySecond = result?.tech_step3_array_second || [];
  const step3Ans = result?.tech_step3_ans_array || [];

  const displayFactors = result?.tech_factors && (
    <BlockMath math={String.raw`${result.tech_factors}`} />
  );

  const num = Number(formData?.tech_num1);
  if (isNaN(num)) return null;

  // Get all factors (positive)
  const getFactors = (n) => {
    const abs = Math.abs(n);
    const factors = [];
    for (let i = 1; i <= abs; i++) {
      if (abs % i === 0) factors.push(i);
    }
    return factors;
  };

  // Get all factor pairs
  const getFactorPairs = (n) => {
    const abs = Math.abs(n);
    const positive = [];
    const negative = [];

    for (let i = 1; i <= abs; i++) {
      if (abs % i === 0) {
        positive.push([i, abs / i]);
        negative.push([-i, -(abs / i)]);
      }
    }

    const pairs = n < 0 ? negative : positive;
    const mid = Math.ceil(pairs.length / 2);
    return pairs.slice(0, mid);
  };

  // Prime factorization using provided detail (Laravel logic)
  const renderPrimeFactors = () => {
    const raw = result?.tech_Factors1;
    if (!raw) return null;

    const arr = raw.split(" × ");
    const countMap = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    const entries = Object.entries(countMap);
    return entries.map(([factor, count], idx) => (
      <span key={idx}>
        {factor}
        <sup className="text-[14px]">{count}</sup>
        {idx !== entries.length - 1 && " x "}
      </span>
    ));
  };

  const factors = getFactors(num);
  const pairs = getFactorPairs(num);

  const num1 = Number(formData?.tech_num1);
  const num2 = Number(formData?.tech_num2);

  if (isNaN(num2)) return null;

  const sArr1 = getFactors(num1);
  const sArr2 = getFactors(num2);

  const commonFactors = sArr1.filter((val) => sArr2.includes(val));

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
            <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="tech_type"
                id="calculator_time"
                value={formData.tech_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_type === "factoring" ? "tagsUnit" : ""
                    }`}
                    id="factoring"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "factoring" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["12"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_type === "factor" ? "tagsUnit" : ""
                    }`}
                    id="factor"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "factor" });
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
              {formData.tech_type == "factoring" && (
                <>
                  <div className="col-span-12  factoringInput">
                    <label htmlFor="tech_eq" className="label">
                      {data?.payload?.tech_lang_keys["13"]}:
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
                </>
              )}
              {formData.tech_type == "factor" && (
                <>
                  <div className="col-span-12 factorInput">
                    <label htmlFor="tech_num1" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_num1"
                        id="tech_num1"
                        max="10000000"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_num1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12  factorInput">
                    <label htmlFor="tech_num2" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_num2"
                        id="tech_num2"
                        max="10000000"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_num2}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {result?.tech_submit === "factoring" ? (
                          <>
                            {result?.tech_eq_degree == "2" &&
                            result?.tech_c != "0" ? (
                              <>
                                <div className="col-lg-6 mt-2 overflow-auto">
                                  <table className="w-100 text-[18px]">
                                    <tbody>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="40%"
                                        >
                                          <strong>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "16"
                                              ]
                                            }
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {displayFactors}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <div className="w-full text-[16px] overflow-auto">
                                  {!result?.tech_pair1 &&
                                    !result?.tech_pair2 && (
                                      <div className="mt-3">
                                        This trinomial cannot be factorized into
                                        linear binomials with integer
                                        coefficients.
                                      </div>
                                    )}

                                  <div className="mt-3">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["17"]}
                                    </strong>
                                  </div>

                                  {result?.tech_pair1 && result?.tech_pair2 && (
                                    <div className="mt-3">
                                      <BlockMath
                                        math={`${result.tech_eq_enter} = ${result.tech_factors}`}
                                      />
                                    </div>
                                  )}

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys[18]}:
                                  </div>
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys[19]} a ={" "}
                                    {result?.tech_a}, b = {result?.tech_b}, c ={" "}
                                    {result?.tech_c}
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys[20]}
                                  </div>
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys[21]}.
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys[22]} |ac| = |
                                    {result?.tech_a} *{" "}
                                    {result?.tech_c < 0
                                      ? `(${result.tech_c})`
                                      : result.tech_c}
                                    | = {ac}.{" "}
                                    {data?.payload?.tech_lang_keys[23]}{" "}
                                    {divisors.length}{" "}
                                    {data?.payload?.tech_lang_keys[24]} {ac}:{" "}
                                    {divisors.join(", ")}
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys[25]}
                                  </div>
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys[26]} {ac}
                                  </div>

                                  {step2Array.map((val, i) => (
                                    <div className="mt-3" key={i}>
                                      ±{val} * ±{step2Second[i]} = {step2Ans[i]}
                                    </div>
                                  ))}

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys[27]}
                                  </div>
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys[28]} *{" "}
                                    {step2Ans.length} = {step2Ans.length * 2}{" "}
                                    {data?.payload?.tech_lang_keys[29]} b ={" "}
                                    {result?.tech_b}
                                  </div>

                                  {step3ArrayFirst.map((val, i) => {
                                    const second = step3ArraySecond[i];
                                    const expr =
                                      result.tech_c < 0
                                        ? second < 0
                                          ? `${val} + ${-second} = ${
                                              step3Ans[i]
                                            }`
                                          : `${val} - ${second} = ${step3Ans[i]}`
                                        : val < 0
                                        ? `${val}${second} = ${step3Ans[i]}`
                                        : `${val} + ${second} = ${step3Ans[i]}`;
                                    return (
                                      <div className="mt-3" key={i}>
                                        {expr}
                                      </div>
                                    );
                                  })}

                                  {result?.tech_pair1 && result?.tech_pair2 ? (
                                    <>
                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys[30]}
                                      </div>
                                      <div className="mt-3">
                                        {result.tech_c < 0
                                          ? result.tech_pair2 < 0
                                            ? `${
                                                result.tech_pair1
                                              } + ${-result.tech_pair2} = ${
                                                result.tech_pair1 -
                                                result.tech_pair2
                                              }`
                                            : `${result.tech_pair1} - ${
                                                result.tech_pair2
                                              } = ${
                                                result.tech_pair1 -
                                                result.tech_pair2
                                              }`
                                          : result.tech_pair2 < 0
                                          ? `${result.tech_pair1}${
                                              result.tech_pair2
                                            } = ${
                                              result.tech_pair1 +
                                              result.tech_pair2
                                            }`
                                          : `${result.tech_pair1} + ${
                                              result.tech_pair2
                                            } = ${
                                              result.tech_pair1 +
                                              result.tech_pair2
                                            }`}
                                      </div>

                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys[31]}
                                      </div>
                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys[32]}
                                      </div>

                                      <div className="mt-3">
                                        <BlockMath
                                          math={
                                            result.tech_c < 0
                                              ? result.tech_pair2 < 0
                                                ? `${
                                                    result.tech_pair1 -
                                                    result.tech_pair2
                                                  }${result.variable_ans} = ${
                                                    result.tech_pair1
                                                  }${
                                                    result.variable_ans
                                                  } + ${-result.tech_pair2}${
                                                    result.variable_ans
                                                  }`
                                                : `${
                                                    result.tech_pair1 -
                                                    result.tech_pair2
                                                  }${result.variable_ans} = ${
                                                    result.tech_pair1
                                                  }${result.variable_ans} - ${
                                                    result.tech_pair2
                                                  }${result.variable_ans}`
                                              : result.tech_pair2 < 0
                                              ? `${
                                                  result.tech_pair1 +
                                                  result.tech_pair2
                                                }${result.variable_ans} = ${
                                                  result.tech_pair1
                                                }${result.variable_ans}${
                                                  result.tech_pair2
                                                }${result.variable_ans}`
                                              : `${
                                                  result.tech_pair1 +
                                                  result.tech_pair2
                                                }${result.variable_ans} = ${
                                                  result.tech_pair1
                                                }${result.variable_ans} + ${
                                                  result.tech_pair2
                                                }${result.variable_ans}`
                                          }
                                        />
                                      </div>

                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys[33]}
                                      </div>
                                      <div className="mt-3">
                                        <BlockMath
                                          math={result.tech_eq_enter}
                                        />
                                      </div>
                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys[34]}
                                      </div>
                                      <div className="mt-3">
                                        <BlockMath
                                          math={`${result.variable_ans}^2 + ${
                                            result.tech_pair2 < 0
                                              ? `${result.tech_pair1}${
                                                  result.variable_ans
                                                } + ${-result.tech_pair2}${
                                                  result.variable_ans
                                                }`
                                              : `${result.tech_pair1}${result.variable_ans} + ${result.tech_pair2}${result.variable_ans}`
                                          } + ${result.tech_c}`}
                                        />
                                      </div>
                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys[35]}
                                      </div>
                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys[36]}:
                                      </div>
                                      <div className="mt-3">
                                        <BlockMath math={result.tech_factors} />
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys[37]}{" "}
                                        {result?.tech_b}
                                      </div>
                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys[38]}
                                      </div>
                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys[39]}
                                      </div>
                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys[40]}
                                      </div>
                                      <div className="mt-3">
                                        <BlockMath
                                          math={`b^2 - 4ac = ${result?.tech_square}`}
                                        />
                                      </div>
                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys[41]}{" "}
                                        {result?.tech_square < 0
                                          ? data?.payload?.tech_lang_keys[42]
                                          : data?.payload?.tech_lang_keys[43]}
                                        , {data?.payload?.tech_lang_keys[44]}.
                                      </div>
                                    </>
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className="w-full text-center text-[20px]">
                                <p>{data?.payload?.tech_lang_keys[16]}</p>
                                <p className="my-3">
                                  <strong className="bg-white px-3 py-2 font-s-32 radius-10 text-blue">
                                    <BlockMath math={result?.tech_factors} />
                                  </strong>
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {!isNaN(Number(formData?.tech_num1)) && (
                              <>
                                <div className="w-full text-[16px]">
                                  <p className="mt-3 text-[18px] font-bold">
                                    {data?.payload?.tech_lang_keys["3"]}{" "}
                                    <span className="total_num1">
                                      {factors.length}
                                    </span>{" "}
                                    {data?.payload?.tech_lang_keys["4"]} {num}
                                  </p>

                                  <p className="mt-3 total_nums1">
                                    {num < 0 ? (
                                      <>
                                        {factors.join(", ")}
                                        <br />
                                        {factors
                                          .map((f, i) => `-${f}`)
                                          .join(", ")}
                                      </>
                                    ) : (
                                      factors.join(", ")
                                    )}
                                  </p>

                                  {num > 0 && (
                                    <>
                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys["5"]}{" "}
                                        {data?.payload?.tech_lang_keys["4"]}{" "}
                                        {num}
                                      </div>
                                      <div className="mt-3">
                                        {result?.tech_Factors1}
                                      </div>
                                      <div className="mt-3">
                                        {data?.payload?.tech_lang_keys["6"]}{" "}
                                        {data?.payload?.tech_lang_keys["4"]}{" "}
                                        {num}
                                      </div>
                                      <div className="mt-3">
                                        {renderPrimeFactors()}
                                      </div>
                                    </>
                                  )}

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["7"]} {num}:
                                  </div>

                                  <div className="mt-3">
                                    {pairs.map(([a, b], i) => (
                                      <span key={i}>
                                        ({a}, {b}){" "}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}

                            {!isNaN(Number(formData?.tech_num2)) && (
                              <>
                                <div className="w-full text-[16px]">
                                  {/* Total factors of num2 */}
                                  <p className="mt-3 text-[18px] font-bold">
                                    {data?.payload?.tech_lang_keys["3"]}{" "}
                                    <span className="total_num2">
                                      {getFactors(num2).length}
                                    </span>{" "}
                                    {data?.payload?.tech_lang_keys["4"]} {num2}
                                  </p>

                                  {/* Factors list */}
                                  <p className="mt-3 total_nums2">
                                    {num2 < 0
                                      ? `${getFactors(num2).join(
                                          ", "
                                        )}\n${getFactors(num2)
                                          .map((f) => `-${f}`)
                                          .join(", ")}`
                                      : getFactors(num2).join(", ")}
                                  </p>

                                  {/* Prime factorization */}
                                  {num2 > 0 && (
                                    <>
                                      <p className="mt-3">
                                        {data?.payload?.tech_lang_keys["5"]}{" "}
                                        {data?.payload?.tech_lang_keys["4"]}{" "}
                                        {num2}
                                      </p>
                                      <p className="mt-3">
                                        {result?.tech_Factors2}
                                      </p>
                                      <p className="mt-3">
                                        {data?.payload?.tech_lang_keys["6"]}{" "}
                                        {data?.payload?.tech_lang_keys["4"]}{" "}
                                        {num2}
                                      </p>
                                      <p className="mt-3">
                                        {renderPrimeFactors(
                                          result?.tech_Factors2
                                        )}
                                      </p>
                                    </>
                                  )}

                                  {/* Factor pairs */}
                                  <p className="mt-3">
                                    {data?.payload?.tech_lang_keys["7"]} {num2}:
                                  </p>
                                  <p className="mt-3">
                                    {getFactorPairs(num2).map(([a, b], i) => (
                                      <span key={i}>
                                        ({a}, {b}){" "}
                                      </span>
                                    ))}
                                  </p>

                                  {/* Common factors */}
                                  {!isNaN(num1) && num1 > 0 && num2 > 0 && (
                                    <>
                                      <p className="mt-3 font-bold">
                                        {data?.payload?.tech_lang_keys["3"]}{" "}
                                        <span className="comnFctr">
                                          {commonFactors.length}
                                        </span>{" "}
                                        {data?.payload?.tech_lang_keys["8"]}{" "}
                                        {num1}{" "}
                                        {data?.payload?.tech_lang_keys["9"]}{" "}
                                        {num2}:
                                      </p>
                                      <p className="mt-3 comnFctr1">
                                        {commonFactors.join(", ")}
                                      </p>
                                    </>
                                  )}

                                  {/* Factor Tree Tables */}
                                  <div className="grid grid-cols-12 gap-3">
                                    {num1 > 0 && !isNaN(num1) && (
                                      <div className="col-span-12 md:col-span-6">
                                        <p className="mt-3 text-center">
                                          {data?.payload?.tech_lang_keys["10"]}{" "}
                                          {num1}
                                        </p>
                                        <table
                                          className="w-[30%] mx-auto text-[16px]"
                                          dangerouslySetInnerHTML={{
                                            __html: result?.tech_tree1,
                                          }}
                                        />
                                      </div>
                                    )}
                                    {num2 > 0 && !isNaN(num2) && (
                                      <div className="col-span-12 md:col-span-6">
                                        <p className="mt-3 text-center">
                                          {data?.payload?.tech_lang_keys["10"]}{" "}
                                          {num2}
                                        </p>
                                        <table
                                          className="w-[30%] mx-auto text-[16px]"
                                          dangerouslySetInnerHTML={{
                                            __html: result?.tech_tree2,
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
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

export default FactoringCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useRationalExpressionCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RationalExpressionsCalculator = () => {
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
    tech_to: "2",
    tech_n1: "x^2-2x+1",
    tech_d1: "x^2-1",
    tech_to_cal: "two", //three  two
    tech_n11: "x^2-13",
    tech_d11: "x^3-26",
    tech_action: "plus",
    tech_n22: "x^3-3",
    tech_d22: "x-2",
    tech_n13: "x^2-13",
    tech_d13: "x^3-26",
    tech_action1: "plus",
    tech_n23: "x^3-3",
    tech_d23: "x-2",
    tech_action2: "plus",
    tech_n33: "2x^3+12-3x",
    tech_d33: "3x-5",
    tech_expr: "(x^2+3)/(2x+1)-(x+1)/(3x+2)",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRationalExpressionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_to: formData.tech_to,
        tech_n1: formData.tech_n1,
        tech_d1: formData.tech_d1,
        tech_to_cal: formData.tech_to_cal,
        tech_n11: formData.tech_n11,
        tech_d11: formData.tech_d11,
        tech_action: formData.tech_action,
        tech_n22: formData.tech_n22,
        tech_d22: formData.tech_d22,
        tech_n13: formData.tech_n13,
        tech_d13: formData.tech_d13,
        tech_action1: formData.tech_action1,
        tech_n23: formData.tech_n23,
        tech_d23: formData.tech_d23,
        tech_action2: formData.tech_action2,
        tech_n33: formData.tech_n33,
        tech_d33: formData.tech_d33,
        tech_expr: formData.tech_expr,
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
      tech_to: "2",
      tech_n1: "x^2-2x+1",
      tech_d1: "x^2-1",
      tech_to_cal: "two", //three  two
      tech_n11: "x^2-13",
      tech_d11: "x^3-26",
      tech_action: "plus",
      tech_n22: "x^3-3",
      tech_d22: "x-2",
      tech_n13: "x^2-13",
      tech_d13: "x^3-26",
      tech_action1: "plus",
      tech_n23: "x^3-3",
      tech_d23: "x-2",
      tech_action2: "plus",
      tech_n33: "2x^3+12-3x",
      tech_d33: "3x-5",
      tech_expr: "(x^2+3)/(2x+1)-(x+1)/(3x+2)",
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

  const isPlusMinus = (op) => op === "+" || op === "-";
  const isMultiplyDivide = (op) => op === "*" || op === "÷";

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

          <div className="lg:w-[70%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_to" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_to"
                    id="tech_to"
                    value={formData.tech_to}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_to == "1" && (
                <>
                  <div className="col-span-12 basic ">
                    <div className="col-span-12 mt-0 mt-lg-2">
                      <label htmlFor="tech_n1" className="label">
                        {data?.payload?.tech_lang_keys["5"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="text"
                          step="any"
                          name="tech_n1"
                          id="tech_n1"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_n1}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 mt-0 mt-lg-2">
                      <label htmlFor="tech_d1" className="label">
                        {data?.payload?.tech_lang_keys["6"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="text"
                          step="any"
                          name="tech_d1"
                          id="tech_d1"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_d1}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_to == "2" && (
                <>
                  <div className="col-span-12 advance ">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12 flex items-center justify-center">
                        <p id="twoInput">
                          <label className="pe-2" htmlFor="two">
                            <input
                              type="radio"
                              name="tech_to_cal"
                              value="two"
                              id="two"
                              className="mr-2 border"
                              onChange={handleChange}
                              checked={formData.tech_to_cal === "two"}
                            />
                            <span>{data?.payload?.tech_lang_keys["7"]}</span>
                          </label>
                        </p>
                        <p className="ms-4" id="threeInput">
                          <label className="pe-2" htmlFor="three">
                            <input
                              type="radio"
                              name="tech_to_cal"
                              value="three"
                              id="three"
                              className="mr-2 border"
                              onChange={handleChange}
                              checked={formData.tech_to_cal === "three"}
                            />
                            <span>{data?.payload?.tech_lang_keys["8"]}</span>
                          </label>
                        </p>
                      </div>
                      {formData.tech_to_cal == "two" && (
                        <>
                          <div className="col-span-12 far2 ">
                            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                              <div className="col-span-5">
                                <input
                                  type="text"
                                  step="any"
                                  name="tech_n11"
                                  id="tech_n11"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_n11}
                                  onChange={handleChange}
                                />
                                <hr />
                                <input
                                  type="text"
                                  step="any"
                                  name="tech_d11"
                                  id="tech_d11"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_d11}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="col-span-2 flex items-center">
                                <select
                                  className="input"
                                  aria-label="select"
                                  name="tech_action"
                                  id="tech_action"
                                  value={formData.tech_action}
                                  onChange={handleChange}
                                >
                                  <option value="plus">
                                    <b>+</b>{" "}
                                  </option>
                                  <option value="-">
                                    <b>-</b>{" "}
                                  </option>
                                  <option value="*">
                                    <b>×</b>{" "}
                                  </option>
                                  <option value="div">
                                    <b>÷</b>{" "}
                                  </option>
                                </select>
                              </div>
                              <div className="col-span-5">
                                <input
                                  type="text"
                                  step="any"
                                  name="tech_n22"
                                  id="tech_n22"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_n22}
                                  onChange={handleChange}
                                />
                                <hr />
                                <input
                                  type="text"
                                  step="any"
                                  name="tech_d22"
                                  id="tech_d22"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_d22}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_to_cal == "three" && (
                        <>
                          <div className="col-span-12 far3 ">
                            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                              <div className="col-span-3">
                                <input
                                  type="text"
                                  step="any"
                                  name="tech_n13"
                                  id="tech_n13"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_n13}
                                  onChange={handleChange}
                                />
                                <hr />
                                <input
                                  type="text"
                                  step="any"
                                  name="tech_d13"
                                  id="tech_d13"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_d13}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="col-span-1 flex items-center">
                                <select
                                  className="input"
                                  aria-label="select"
                                  name="tech_action1"
                                  id="tech_action1"
                                  value={formData.tech_action1}
                                  onChange={handleChange}
                                >
                                  <option value="plus">
                                    <b>+</b>{" "}
                                  </option>
                                  <option value="-">
                                    <b>-</b>{" "}
                                  </option>
                                  <option value="*">
                                    <b>×</b>{" "}
                                  </option>
                                  <option value="div">
                                    <b>÷</b>{" "}
                                  </option>
                                </select>
                              </div>
                              <div className="col-span-3">
                                <input
                                  type="text"
                                  step="any"
                                  name="tech_n23"
                                  id="tech_n23"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_n23}
                                  onChange={handleChange}
                                />
                                <hr />
                                <input
                                  type="text"
                                  step="any"
                                  name="tech_d23"
                                  id="tech_d23"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_d23}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="col-span-2 flex items-center">
                                <select
                                  className="input"
                                  aria-label="select"
                                  name="tech_action2"
                                  id="tech_action2"
                                  value={formData.tech_action2}
                                  onChange={handleChange}
                                >
                                  <option value="plus">
                                    <b>+</b>{" "}
                                  </option>
                                  <option value="-">
                                    <b>-</b>{" "}
                                  </option>
                                  <option value="*">
                                    <b>×</b>{" "}
                                  </option>
                                  <option value="div">
                                    <b>÷</b>{" "}
                                  </option>
                                </select>
                              </div>
                              <div className="col-span-3">
                                <input
                                  type="text"
                                  step="any"
                                  name="tech_n33"
                                  id="tech_n33"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_n33}
                                  onChange={handleChange}
                                />
                                <hr />
                                <input
                                  type="text"
                                  step="any"
                                  name="tech_d33"
                                  id="tech_d33"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_d33}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              {formData.tech_to == "3" && (
                <>
                  <div className="col-span-12 simple ">
                    <label htmlFor="tech_expr" className="label">
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="text"
                        step="any"
                        name="tech_expr"
                        id="tech_expr"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_expr}
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
                      <div className="row">
                        {formData?.tech_to == 1 ? (
                          <>
                            <div className="col-span-12 text-[16px] ">
                              {/* Render math with BlockMath for block formulas */}
                              <BlockMath math={result?.tech_ress} />

                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[11]}:
                                </strong>
                              </p>

                              {/* Inline math with InlineMath or BlockMath based on layout */}
                              <BlockMath math={`= ${result?.tech_enter}`} />
                              <BlockMath
                                math={`= \\dfrac{${result?.tech_up}}{${result?.tech_down}}`}
                              />
                              <BlockMath math={`= ${result?.tech_ress}`} />
                            </div>
                          </>
                        ) : formData?.tech_to == 2 ? (
                          <>
                            {formData?.tech_to_cal == "two" ? (
                              <>
                                {result?.tech_lcm &&
                                (result?.tech_action === "+" ||
                                  result?.tech_action === "-") ? (
                                  <div className="col-span-12 text-[16px] ">
                                    <BlockMath
                                      math={`= \\dfrac{${result?.tech_top}}{${result?.tech_lcm}}`}
                                    />
                                    <p className="mt-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[11]}:
                                      </strong>
                                    </p>
                                    <BlockMath
                                      math={`${result?.tech_up} ${result?.tech_action} ${result?.tech_down}`}
                                    />
                                    <BlockMath
                                      math={`= \\dfrac{\\left(${result?.tech_left}\\right) ${result?.tech_action} \\left(${result?.tech_right}\\right)}{${result?.tech_lcm}}`}
                                    />
                                    <BlockMath
                                      math={`= \\dfrac{${result?.tech_top}}{${result?.tech_lcm}}`}
                                    />
                                    <BlockMath
                                      math={`= \\dfrac{${result?.tech_top}}{${result?.tech_lcm}}`}
                                    />
                                  </div>
                                ) : result?.tech_lcm &&
                                  (result?.tech_action === "*" ||
                                    result?.tech_action === "÷") ? (
                                  <div className="col-span-12 text-center my-2">
                                    <p>
                                      <strong className="bg-white px-3 py-2 font-s-21 rounded-lg text-blue">
                                        <BlockMath
                                          math={`${result?.tech_up} ${result?.tech_action} ${result?.tech_down} = \\dfrac{${result?.tech_top}}{${result?.tech_lcm}}`}
                                        />
                                      </strong>
                                    </p>
                                  </div>
                                ) : (
                                  <div className="col-span-12 text-center my-2  ">
                                    <p>
                                      <strong className="bg-white px-3 py-2 font-s-21 rounded-lg text-blue">
                                        <BlockMath
                                          math={`${result?.tech_up} ${result?.tech_action} ${result?.tech_down} = ${result?.tech_ans}`}
                                        />
                                      </strong>
                                    </p>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="w-full overflow-auto text-[16px]">
                                  {result?.tech_lcm &&
                                  isPlusMinus(result?.tech_action) &&
                                  isPlusMinus(result?.tech_action1) ? (
                                    <div className="col-span-12 text-[16px]">
                                      <BlockMath
                                        math={`= \\dfrac{${result?.tech_top}}{${result?.tech_lcm}}`}
                                      />
                                      <p className="mt-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[11]}
                                        </strong>
                                        :
                                      </p>
                                      <BlockMath
                                        math={`${result?.tech_up} ${result?.tech_action} ${result?.tech_down} ${result?.tech_action1} ${result?.tech_thr}`}
                                      />
                                      <BlockMath
                                        math={`= \\dfrac{\\left(${result?.tech_left}\\right) ${result?.tech_action} \\left(${result?.tech_center}\\right) ${result?.tech_action1} \\left(${result?.tech_right}\\right)}{${result?.tech_lcm}}`}
                                      />
                                      <BlockMath
                                        math={`= \\dfrac{${result?.tech_top}}{${result?.tech_lcm}}`}
                                      />
                                    </div>
                                  ) : result?.tech_lcm &&
                                    isPlusMinus(result?.tech_action) &&
                                    isMultiplyDivide(result?.tech_action1) ? (
                                    <div className="col-span-12 text-[16px]">
                                      <BlockMath
                                        math={`= \\dfrac{${result?.tech_top}}{${result?.tech_lcm1}}`}
                                      />
                                      <p className="mt-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[11]}
                                        </strong>
                                        :
                                      </p>
                                      <BlockMath
                                        math={`= ${result?.tech_up} ${result?.tech_action} ${result?.tech_down} ${result?.tech_action1} ${result?.tech_thr}`}
                                      />
                                      <BlockMath
                                        math={`= ${result?.tech_up} ${result?.tech_action} \\dfrac{${result?.tech_up1}}{${result?.tech_down1}}`}
                                      />
                                      <BlockMath
                                        math={`= \\dfrac{\\left(${result?.tech_left}\\right) ${result?.tech_action} \\left(${result?.tech_right}\\right)}{${result?.tech_lcm1}}`}
                                      />
                                      <BlockMath
                                        math={`= \\dfrac{${result?.tech_top}}{${result?.tech_lcm1}}`}
                                      />
                                    </div>
                                  ) : result?.tech_lcm &&
                                    isMultiplyDivide(result?.tech_action) &&
                                    isPlusMinus(result?.tech_action1) ? (
                                    <div className="col-span-12 text-[16px]">
                                      <BlockMath
                                        math={`= \\dfrac{${result?.tech_top}}{${result?.tech_lcm}}`}
                                      />
                                      <p className="mt-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[11]}
                                        </strong>
                                        :
                                      </p>
                                      <BlockMath
                                        math={`= ${result?.tech_up} ${result?.tech_action} ${result?.tech_down} ${result?.tech_action1} ${result?.tech_thr}`}
                                      />
                                      <BlockMath
                                        math={`= \\dfrac{${result?.tech_up1}}{${result?.tech_down1}} ${result?.tech_action1} ${result?.tech_thr}`}
                                      />
                                      <BlockMath
                                        math={`= \\dfrac{\\left(${result?.tech_left}\\right) ${result?.tech_action1} \\left(${result?.tech_right}\\right)}{${result?.tech_lcm}}`}
                                      />
                                      <BlockMath
                                        math={`= \\dfrac{${result?.tech_top}}{${result?.tech_lcm}}`}
                                      />
                                    </div>
                                  ) : (
                                    <div className="col-span-12 text-center text-[16px]">
                                      <BlockMath
                                        math={`= ${result?.tech_up} ${result?.tech_action} ${result?.tech_down} ${result?.tech_action} ${result?.tech_thr}`}
                                      />
                                      <div className="my-3 bg-sky-100 overflow-auto">
                                        <strong className=" px-3 py-2 text-[16px] rounded-lg text-blue">
                                          <BlockMath
                                            math={`= ${result?.tech_ans}`}
                                          />
                                        </strong>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="col-span-12 text-center text-[16px]">
                              <p className="my-3 bg-sky-100 overflow-auto">
                                <strong className=" px-3 py-4 text-[16px] rounded-lg text-blue">
                                  <BlockMath
                                    math={`${result?.tech_enter} = ${result?.tech_ans}`}
                                  />
                                </strong>
                              </p>
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

export default RationalExpressionsCalculator;

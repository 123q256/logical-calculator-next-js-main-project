"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

import {
  useGetSingleCalculatorDetailsMutation,
  useParallelAndPerpendicularCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ParallelAndPerpendicularLineCalculator = () => {
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
    tech_form: "1",
    tech_a: 2,
    tech_b: -6,
    tech_c: -13,
    tech_p1: -13,
    tech_p2: 3,
    tech_method: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useParallelAndPerpendicularCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_form) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_form: formData.tech_form,
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_c: formData.tech_c,
        tech_p1: formData.tech_p1,
        tech_p2: formData.tech_p2,
        tech_method: formData.tech_method,
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
      tech_form: "1",
      tech_a: 2,
      tech_b: -6,
      tech_c: -13,
      tech_p1: -13,
      tech_p2: 3,
      tech_method: "1",
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

  // chart js

  let x = 0,
    y = 0,
    x1 = 0,
    y1 = 0,
    x_ = 0,
    y_ = 0,
    x_1 = 0,
    y_1 = 0;

  if (result?.tech_form === 1) {
    y = result?.tech_upr2 / result?.tech_btm2;
    x = 0;

    if (result?.tech_btm < 0) {
      result.tech_upr = -result.tech_upr;
      result.tech_btm = Math.abs(result.tech_btm);
    }

    x1 = x + result.tech_btm;
    y1 = y + result.tech_upr;

    y_ = result?.tech_upr1 / result?.tech_btm1;
    x_ = 0;

    if (result?.tech_method === "1") {
      x_1 = x_ + result?.tech_btm;
      y_1 = y_ + result?.tech_upr;
    } else {
      x_1 = x_ - result?.tech_btm_;
      y_1 = y_ + result?.tech_upr_;
    }
  } else {
    if (result?.tech_method === "1") {
      y = result?.tech_au;
      x = 0;
      x1 = x + 1;
      y1 = y + result?.tech_a;

      y_ = result?.tech_b;
      x_ = 0;
      x_1 = x_ + 1;
      y_1 = y_ + result?.tech_a;
    } else {
      y = result?.tech_upr === -1 ? result?.tech_au * -1 : result?.tech_au;
      x = 0;
      x1 = x + result?.tech_btm2;
      y1 = y + result?.tech_upr2;

      y_ = result?.tech_b;
      x_ = 0;
      x_1 = x_ - result?.tech_au;
      y_1 = y_ + result?.tech_upr;
    }
  }

  const datachart = {
    labels: [x, x1], // We'll use these for X axis ticks
    datasets: [
      {
        label: "Line 1",
        data: [
          { x, y },
          { x: x1, y: y1 },
        ],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        tension: 0,
      },
      {
        label: "Line 2",
        data: [
          { x: x_, y: y_ },
          { x: x_1, y: y_1 },
        ],
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.4)",
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "X Axis",
        },
      },
      y: {
        title: {
          display: true,
          text: "Y Axis",
        },
      },
    },
  };

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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_form" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_form"
                    id="tech_form"
                    value={formData.tech_form}
                    onChange={handleChange}
                  >
                    <option value="1">Standard Form </option>
                    <option value="2">Slope - Intercept Form </option>
                  </select>
                </div>
              </div>
              <p className="col-span-12 my-2  text-[14px] text-center">
                {formData.tech_form == "2" ? (
                  <>
                    <strong id="changeText"> y = Ax + B</strong>
                  </>
                ) : (
                  <>
                    <strong id="changeText"> Ax + By + C = 0 </strong>
                  </>
                )}
              </p>

              <div
                className={
                  formData.tech_form == "1" ? "col-span-4" : "col-span-6"
                }
                id="aValue"
              >
                <label htmlFor="tech_a" className="label">
                  {data?.payload?.tech_lang_keys["5"]} A
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_a"
                    id="tech_a"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_a}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div
                className={
                  formData.tech_form == "1" ? "col-span-4" : "col-span-6"
                }
                id="bValue"
              >
                <label htmlFor="tech_b" className="label">
                  {data?.payload?.tech_lang_keys["5"]} B
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_b"
                    id="tech_b"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_b}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_form == "1" && (
                <>
                  <div className="col-span-4 " id="cValue">
                    <label htmlFor="tech_c" className="label">
                      {data?.payload?.tech_lang_keys["5"]} C
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_c"
                        id="tech_c"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_c}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              <p className="col-span-12 my-2  text-[14px] ">
                <strong>Input Point</strong>
              </p>
              <div className="col-span-6">
                <label htmlFor="tech_p1" className="label">
                  {data?.payload?.tech_lang_keys["6"]} 1
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_p1"
                    id="tech_p1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_p1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_p2" className="label">
                  {data?.payload?.tech_lang_keys["6"]} 2
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_p2"
                    id="tech_p2"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_p2}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method"
                    id="tech_method"
                    value={formData.tech_method}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
                          {result?.tech_form == "1" ? (
                            <>
                              <p className="mt-2 text-[18px]">
                                <InlineMath
                                  math={`y = ${
                                    result?.tech_btm != 1
                                      ? "\\frac{" +
                                        result?.tech_upr +
                                        "}{" +
                                        result?.tech_btm +
                                        "}"
                                      : result?.tech_upr
                                  }x ${result?.tech_upr2 > 0 ? "+" : "-"} ${
                                    result?.tech_btm2 != 1
                                      ? "\\frac{" +
                                        Math.abs(result?.tech_upr2) +
                                        "}{" +
                                        result?.tech_btm2 +
                                        "}"
                                      : Math.abs(result?.tech_upr2)
                                  }`}
                                />
                              </p>
                              <div className="mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["8"]}:
                                </strong>
                              </div>
                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys["9"]}:
                              </div>

                              <div className="mt-3">
                                <InlineMath
                                  math={`${result?.tech_a}x ${
                                    result?.tech_b > 0
                                      ? "+" + result?.tech_b
                                      : result?.tech_b
                                  }y ${
                                    result?.tech_c > 0
                                      ? "+" + result?.tech_c
                                      : result?.tech_c
                                  } = 0`}
                                />
                              </div>

                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys["10"]}:
                              </div>
                              <div className="mt-3">
                                <InlineMath
                                  math={`(${result?.tech_p1}, ${result?.tech_p2})`}
                                />
                              </div>

                              {result?.tech_method == "1" ? (
                                <>
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["11"]}{" "}
                                    <InlineMath
                                      math={`y = ${
                                        result?.tech_btm != 1
                                          ? "\\frac{" +
                                            result?.tech_upr +
                                            "}{" +
                                            result?.tech_btm +
                                            "}"
                                          : result?.tech_upr
                                      }x ${result?.tech_upr1 < 0 ? "-" : "+"} ${
                                        result?.tech_btm1 != 1
                                          ? "\\frac{" +
                                            Math.abs(result?.tech_upr1) +
                                            "}{" +
                                            result?.tech_btm1 +
                                            "}"
                                          : Math.abs(result?.tech_upr1)
                                      }`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["12"]}{" "}
                                    <InlineMath
                                      math={`m = ${
                                        result?.tech_btm != 1
                                          ? "\\frac{" +
                                            result?.tech_upr +
                                            "}{" +
                                            result?.tech_btm +
                                            "}"
                                          : result?.tech_upr
                                      }`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["13"]}{" "}
                                    <InlineMath
                                      math={`y = ${
                                        result?.tech_btm != 1
                                          ? "\\frac{" +
                                            result?.tech_upr +
                                            "}{" +
                                            result?.tech_btm +
                                            "}"
                                          : result?.tech_upr
                                      }x + a`}
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["11"]}{" "}
                                    <InlineMath
                                      math={`y = ${
                                        result?.btm_ != 1
                                          ? "\\frac{" +
                                            result?.upr_ +
                                            "}{" +
                                            Math.abs(result?.btm_) +
                                            "}"
                                          : result?.upr_
                                      }x ${result?.tech_upr1 < 0 ? "-" : "+"} ${
                                        result?.tech_btm1 != 1
                                          ? "\\frac{" +
                                            Math.abs(result?.tech_upr1) +
                                            "}{" +
                                            result?.tech_btm1 +
                                            "}"
                                          : Math.abs(result?.tech_upr1)
                                      }`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["14"]}{" "}
                                    <InlineMath
                                      math={`m = ${
                                        result?.tech_btm != 1
                                          ? "\\frac{" +
                                            result?.tech_upr +
                                            "}{" +
                                            result?.tech_btm +
                                            "}"
                                          : result?.tech_upr
                                      }`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["16"]}{" "}
                                    <InlineMath
                                      math={`y = ${
                                        result?.tech_btm != 1
                                          ? "\\frac{" +
                                            result?.tech_upr +
                                            "}{" +
                                            result?.tech_btm +
                                            "}"
                                          : result?.tech_upr
                                      }x + a`}
                                    />
                                  </div>
                                </>
                              )}
                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys["15"]}{" "}
                                <InlineMath
                                  math={`${result?.tech_p2} = (${
                                    result?.tech_btm != 1
                                      ? "\\frac{" +
                                        result?.tech_upr +
                                        "}{" +
                                        result?.tech_btm +
                                        "}"
                                      : result?.tech_upr
                                  }).(${result?.tech_p1}) + a`}
                                />
                              </div>

                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys["18"]},{" "}
                                <InlineMath
                                  math={`a = ${
                                    result?.tech_btm2 != 1
                                      ? "\\frac{" +
                                        result?.tech_upr2 +
                                        "}{" +
                                        result?.tech_btm2 +
                                        "}"
                                      : result?.tech_upr2
                                  }`}
                                />
                              </div>

                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys["17"]}{" "}
                                <InlineMath
                                  math={`y = ${
                                    result?.tech_btm != 1
                                      ? "\\frac{" +
                                        result?.tech_upr +
                                        "}{" +
                                        result?.tech_btm +
                                        "}"
                                      : result?.tech_upr
                                  }x ${result?.tech_upr2 > 0 ? "+" : "-"} ${
                                    result?.tech_btm2 != 1
                                      ? "\\frac{" +
                                        Math.abs(result?.tech_upr2) +
                                        "}{" +
                                        result?.tech_btm2 +
                                        "}"
                                      : Math.abs(result?.tech_upr2)
                                  }`}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              {result?.tech_method == "2" ? (
                                <>
                                  <p className="mt-2 text-[18px]">
                                    <InlineMath
                                      math={`y = ${
                                        result?.tech_btm2 != 1
                                          ? "\\frac{" +
                                            result?.tech_upr2 +
                                            "}{" +
                                            result?.tech_btm2 +
                                            "}"
                                          : result?.tech_upr2
                                      } ${
                                        result?.tech_upr == -1 ? "-" : "+"
                                      } \\frac{x}{${result?.tech_au}}`}
                                    />
                                  </p>

                                  <div className="mt-3">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["8"]}:
                                    </strong>
                                  </div>
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["9"]}:
                                  </div>

                                  <div className="mt-3">
                                    <InlineMath
                                      math={`y = ${result?.tech_a}x ${
                                        result?.tech_b > 0
                                          ? "+" + result?.tech_b
                                          : result?.tech_b
                                      }`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["10"]}:
                                  </div>
                                  <div className="mt-3">
                                    <InlineMath
                                      math={`(${result?.tech_p1}, ${result?.tech_p2})`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["11"]}{" "}
                                    <InlineMath
                                      math={`y = ${result?.tech_a}x ${
                                        result?.tech_b > 0
                                          ? "+" + result?.tech_b
                                          : result?.tech_b
                                      }`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["14"]}{" "}
                                    <InlineMath
                                      math={`m = ${
                                        result?.tech_au != 1
                                          ? "\\frac{" +
                                            result?.tech_upr +
                                            "}{" +
                                            result?.tech_au +
                                            "}"
                                          : result?.tech_upr
                                      }`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["16"]}{" "}
                                    <InlineMath
                                      math={`y = ${
                                        result?.tech_au != 1
                                          ? "\\frac{" +
                                            result?.tech_upr +
                                            "}{" +
                                            result?.tech_au +
                                            "}"
                                          : result?.tech_upr
                                      }x + a`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["15"]}{" "}
                                    <InlineMath
                                      math={`${result?.tech_p2} = (${
                                        result?.tech_au != 1
                                          ? "\\frac{" +
                                            result?.tech_upr +
                                            "}{" +
                                            result?.tech_au +
                                            "}"
                                          : result?.tech_upr
                                      })(${result?.tech_p1}) + a`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["18"]},{" "}
                                    <InlineMath
                                      math={`a = ${
                                        result?.tech_btm2 != 1
                                          ? "\\frac{" +
                                            result?.tech_upr2 +
                                            "}{" +
                                            result?.tech_btm2 +
                                            "}"
                                          : result?.tech_upr2
                                      }`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["17"]}{" "}
                                    <InlineMath
                                      math={`y = ${
                                        result?.tech_btm2 != 1
                                          ? "\\frac{" +
                                            result?.tech_upr2 +
                                            "}{" +
                                            result?.tech_btm2 +
                                            "}"
                                          : result?.tech_upr2
                                      } ${
                                        result?.tech_upr == -1 ? "-" : "+"
                                      } \\frac{x}{${result?.tech_au}}`}
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p className="mt-2 text-[18px]">
                                    <InlineMath
                                      math={`y = ${result?.tech_a}x ${
                                        result?.tech_au > 0
                                          ? "+" + result?.tech_au
                                          : result?.tech_au
                                      }`}
                                    />
                                  </p>

                                  <div className="mt-3">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["8"]}:
                                    </strong>
                                  </div>
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </div>

                                  <div className="mt-3">
                                    <InlineMath
                                      math={`y = ${result?.tech_a}x ${
                                        result?.tech_b > 0
                                          ? "+" + result?.tech_b
                                          : result?.tech_b
                                      }`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["10"]}:
                                  </div>
                                  <div className="mt-3">
                                    <InlineMath
                                      math={`(${result?.tech_p1}, ${result?.tech_p2})`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["11"]}{" "}
                                    <InlineMath
                                      math={`y = ${result?.tech_a}x ${
                                        result?.tech_b > 0
                                          ? "+" + result?.tech_b
                                          : result?.tech_b
                                      }y`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["12"]}{" "}
                                    <InlineMath
                                      math={`m = ${result?.tech_a}`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["13"]}{" "}
                                    <InlineMath
                                      math={`y = ${result?.tech_a}x + a`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["15"]}{" "}
                                    <InlineMath
                                      math={`${result?.tech_p2} = (${result?.tech_a})(${result?.tech_p1}) + a`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["18"]},{" "}
                                    <InlineMath
                                      math={`a = ${result?.tech_au}`}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["17"]}{" "}
                                    <InlineMath
                                      math={`y = ${result?.tech_a}x ${
                                        result?.tech_au > 0
                                          ? "+" + result?.tech_au
                                          : result?.tech_au
                                      }`}
                                    />
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                        <div id="box1" className="col-lg-8 mt-4 mx-auto">
                          <Line data={datachart} options={options} />
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

export default ParallelAndPerpendicularLineCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

import {
  useGetSingleCalculatorDetailsMutation,
  useQuadraticFormulaCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const QuadraticFormulaCalculator = () => {
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
    tech_formula: "1",
    tech_method: 1,
    tech_a: "2",
    tech_b: "-6",
    tech_c: "-13",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useQuadraticFormulaCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_formula || !formData.tech_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_formula: formData.tech_formula,
        tech_method: formData.tech_method,
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_c: formData.tech_c,
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
      tech_formula: "1",
      tech_method: 1,
      tech_a: "2",
      tech_b: "-6",
      tech_c: "-13",
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

  // Calculate right_side similar to your PHP logic:
  let right_side = Math.pow(formData?.tech_a, 2) / formData?.tech_a;
  right_side = -1 * result?.tech_C * right_side + Math.pow(result?.tech_B, 2);

  let i = "";
  let absRightSide = right_side;
  if (right_side < 0) {
    absRightSide = -right_side;
    i = "\\, i"; // imaginary unit for KaTeX
  }

  const sign = result?.tech_B < 0 ? "-" : "+";

  // Calculations
  const a = formData?.tech_a;
  const b = result?.tech_B;
  const c = result?.tech_C;

  const inner = b * b - 4 * a * c;
  const inner2 = Math.sqrt(Math.abs(inner)).toFixed(4);
  const a2 = 2 * a;

  // Signs for display
  const signB = b < 0 ? "-" : " - ";
  const absB = Math.abs(b);

  // Helper functions with different names
  const absoluteValue = (num) => (num < 0 ? -num : num);
  const signSymbol = (num) => (num < 0 ? "-" : "+");

  // Use safe defaults
  const tech_B = result?.tech_B ?? 0;
  const tech_C = result?.tech_C ?? 0;

  const halfOfB = tech_B / 2;
  const halfBSquared = Math.pow(halfOfB, 2);
  const BSquared = Math.pow(tech_B, 2);

  const isHalfOfBInteger = Number.isInteger(halfOfB);

  let rightSideValue;
  let imaginaryUnit = "";

  if (isHalfOfBInteger) {
    rightSideValue = -1 * tech_C + halfBSquared;
  } else {
    rightSideValue = -1 * tech_C * 4 + BSquared;
  }

  if (rightSideValue < 0) {
    rightSideValue = -rightSideValue;
    imaginaryUnit = "\\, i";
  }

  const signOfB = signSymbol(tech_B);
  const absOfB = absoluteValue(tech_B);
  const signOfHalfB = signSymbol(halfOfB);
  const absOfHalfB = absoluteValue(halfOfB);

  // chart js

  // Generate data points
  let firstX = (-1 * b) / (2 * a) + 25;
  const points = [];

  for (let i = 0; i <= 50; i++) {
    const y = a * Math.pow(firstX, 2) + b * firstX + c;
    points.push({ x: firstX, y: y });
    firstX -= 1;
  }

  const datachart = {
    datasets: [
      {
        label: "Quadratic Equation",
        data: points,
        showLine: true,
        borderColor: "#13699E",
        backgroundColor: "#13699E",
        pointRadius: 0, // no points, just the line
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: "x-axis" },
      },
      y: {
        title: { display: true, text: "y-axis" },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,
      },
    },
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    datalabels: {
      display: false, // ✅ Disable value labels on bars
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_formula" className="label">
                  {data?.payload?.tech_lang_keys["e_f"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_formula"
                    id="tech_formula"
                    value={formData.tech_formula}
                    onChange={handleChange}
                  >
                    <option value="1">Ax² + Bx + C = 0</option>
                    <option value="2">A(x - H)² + K = 0</option>
                    <option value="3">A(x - x₁)(x - x₂) = 0</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="space-y-2">
                  <label htmlFor="tech_method" className="label">
                    {data?.payload?.tech_lang_keys["c_m"]}:
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
                      <option value="2">
                        {data?.payload?.tech_lang_keys["q_f"]}
                      </option>
                      <option value="1">
                        {data?.payload?.tech_lang_keys["c_s"]}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3  lg:grid-cols-3 md:grid-cols-3  mt-4 gap-4">
                <div className="space-y-2">
                  <label htmlFor="tech_a" className="label">
                    {data?.payload?.tech_lang_keys["Enter"]} A
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
                <div className="space-y-2">
                  {formData?.tech_formula == "2" ? (
                    <>
                      <label htmlFor="tech_b" className="label">
                        {data?.payload?.tech_lang_keys["Enter"]} H{" "}
                      </label>
                    </>
                  ) : formData?.tech_formula == "3" ? (
                    <>
                      <label htmlFor="tech_b" className="label">
                        {data?.payload?.tech_lang_keys["Enter"]} x₁{" "}
                      </label>
                    </>
                  ) : (
                    <>
                      <label htmlFor="tech_b" className="label">
                        {data?.payload?.tech_lang_keys["Enter"]} B{" "}
                      </label>
                    </>
                  )}

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
                <div className="space-y-2">
                  {formData?.tech_formula == "2" ? (
                    <>
                      <label htmlFor="tech_c" className="label">
                        {data?.payload?.tech_lang_keys["Enter"]} K{" "}
                      </label>
                    </>
                  ) : formData?.tech_formula == "3" ? (
                    <>
                      <label htmlFor="tech_c" className="label">
                        {data?.payload?.tech_lang_keys["Enter"]} x₂{" "}
                      </label>
                    </>
                  ) : (
                    <>
                      <label htmlFor="tech_c" className="label">
                        {data?.payload?.tech_lang_keys["Enter"]} C{" "}
                      </label>
                    </>
                  )}
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
                    <div className="w-full bg-light-blue result p-3 radius-10 mt-3">
                      <div className="row">
                        <div className="col-12 text-[16px] md:text-[20px] overflow-auto">
                          <p className="mt-2 text-[16px] md:text-[20px]">
                            <strong>{result?.tech_roots}</strong>
                          </p>
                          {formData?.tech_method === "2" && (
                            <p className="mt-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["t_d"]} ={" "}
                                {result?.tech_dis}
                              </strong>
                            </p>
                          )}

                          <p className="mt-2">
                            <strong>Solution:</strong>
                          </p>
                          <p className="mt-2">
                            Standard Form:{" "}
                            <InlineMath
                              math={`${formData?.tech_a}x^2 ${
                                result?.tech_B < 0
                                  ? result?.tech_B
                                  : `+ ${result?.tech_B}`
                              }x ${
                                result?.tech_C < 0
                                  ? result?.tech_C
                                  : `+ ${result?.tech_C}`
                              } = 0`}
                            />
                          </p>
                          <p className="mt-2">
                            Vertex Form:{" "}
                            <InlineMath math={`${result?.tech_vertex} = 0`} />
                          </p>
                          <p className="mt-2">
                            Factored Form:{" "}
                            <InlineMath math={`${result?.tech_fact} = 0`} />
                          </p>

                          {formData?.tech_method == "1" ? (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["ans_s_c"]}
                              </p>
                              <p className="mt-2">
                                a = {formData?.tech_a}, b = {result?.tech_B}, &
                                c = {result?.tech_C}
                              </p>

                              {formData?.tech_a != "1" ? (
                                <>
                                  <p>
                                    <InlineMath math={`a \\ne 1`} />{" "}
                                    {data?.payload?.tech_lang_keys["divide"]}{" "}
                                    {formData?.tech_a}
                                  </p>

                                  <>
                                    <p>
                                      <InlineMath
                                        math={`x^{2} ${sign} \\frac{${Math.abs(
                                          result.tech_B
                                        )} x}{${formData.tech_a}} = ${
                                          result.tech_C < 0 ? "-" : ""
                                        } \\frac{${Math.abs(result.tech_C)}}{${
                                          formData.tech_a
                                        }}`}
                                      />
                                    </p>

                                    <p>
                                      {data?.payload?.tech_lang_keys["half"]}{" "}
                                      <InlineMath math="x" />{" "}
                                      {data?.payload?.tech_lang_keys["add_s"]}
                                    </p>

                                    <p>
                                      <InlineMath
                                        math={`x^{2} ${sign} \\frac{${Math.abs(
                                          result.tech_B
                                        )} x}{${
                                          formData.tech_a
                                        }} + \\frac{${Math.pow(
                                          result.tech_B,
                                          2
                                        )}}{${Math.pow(
                                          formData.tech_a,
                                          2
                                        )}} = ${
                                          result.tech_C < 0 ? "-" : ""
                                        } \\frac{${Math.abs(result.tech_C)}}{${
                                          formData.tech_a
                                        }} + \\frac{${Math.pow(
                                          result.tech_B,
                                          2
                                        )}}{${Math.pow(formData.tech_a, 2)}}`}
                                      />
                                    </p>

                                    <p>
                                      <InlineMath
                                        math={`\\left(x ${sign} \\frac{${Math.abs(
                                          result.tech_B
                                        )}}{${formData.tech_a}}\\right)^2 = ${
                                          result.tech_C < 0 ? "-" : ""
                                        } \\frac{${Math.abs(result.tech_C)}}{${
                                          formData.tech_a
                                        }} + \\frac{${Math.pow(
                                          result.tech_B,
                                          2
                                        )}}{${Math.pow(formData.tech_a, 2)}}`}
                                      />
                                    </p>

                                    <p>
                                      <InlineMath
                                        math={`\\left(x ${sign} \\frac{${Math.abs(
                                          result.tech_B
                                        )}}{${formData.tech_a}}\\right)^2 = ${
                                          result.tech_C < 0 ? "-" : ""
                                        } \\frac{${right_side}}{${Math.pow(
                                          formData.tech_a,
                                          2
                                        )}}`}
                                      />
                                    </p>
                                  </>

                                  {right_side != 0 ? (
                                    <>
                                      <p>
                                        <InlineMath
                                          math={`x ${sign} \\frac{${Math.abs(
                                            result.tech_B
                                          )}}{${
                                            formData.tech_a
                                          }} = \\pm \\sqrt{ \\frac{${absRightSide}}{${Math.pow(
                                            formData.tech_a,
                                            2
                                          )}} }${right_side < 0 ? " i" : ""}`}
                                        />
                                      </p>

                                      <p>
                                        <InlineMath
                                          math={`x = ${sign} \\frac{${Math.abs(
                                            result.tech_B
                                          )}}{${
                                            formData.tech_a
                                          }} \\pm \\sqrt{ \\frac{${absRightSide}}{${Math.pow(
                                            formData.tech_a,
                                            2
                                          )}} }${right_side < 0 ? " i" : ""}`}
                                        />
                                      </p>

                                      <p>
                                        <InlineMath
                                          math={`x_1 = ${sign} \\frac{${Math.abs(
                                            result.tech_B
                                          )}}{${
                                            formData.tech_a
                                          }} + \\sqrt{ \\frac{${absRightSide}}{${Math.pow(
                                            formData.tech_a,
                                            2
                                          )}} }${
                                            right_side < 0 ? " i" : ""
                                          }, \\quad x_1 = ${result.tech_x1}${
                                            right_side < 0 ? " i" : ""
                                          }`}
                                        />
                                      </p>

                                      <p>
                                        <InlineMath
                                          math={`x_2 = ${sign} \\frac{${Math.abs(
                                            result.tech_B
                                          )}}{${
                                            formData.tech_a
                                          }} - \\sqrt{ \\frac{${absRightSide}}{${Math.pow(
                                            formData.tech_a,
                                            2
                                          )}} }${
                                            right_side < 0 ? " i" : ""
                                          }, \\quad x_2 = ${result.tech_x2}${
                                            right_side < 0 ? " i" : ""
                                          }`}
                                        />
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p>
                                        <InlineMath
                                          math={`x ${sign} \\frac{${Math.abs(
                                            result.tech_B
                                          )}}{${
                                            formData.tech_a
                                          }} = \\pm \\sqrt{0}`}
                                        />
                                      </p>

                                      <p>
                                        <InlineMath
                                          math={`x = ${sign} \\frac{${Math.abs(
                                            result.tech_B
                                          )}}{${formData.tech_a}}, \\quad x = ${
                                            result.tech_x1
                                          }`}
                                        />
                                      </p>
                                    </>
                                  )}
                                </>
                              ) : formData?.tech_a == "1" ? (
                                <>
                                  {/* Equation */}
                                  <p className="mt-2">
                                    <InlineMath
                                      math={`x^2 ${signOfB} ${absOfB} x = ${
                                        result.tech_C < 0 ? "-" : ""
                                      } ${absoluteValue(result.tech_C)}`}
                                    />
                                  </p>

                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["half"]}{" "}
                                    <InlineMath math="x" />{" "}
                                    {data?.payload?.tech_lang_keys["add_s"]}
                                  </p>

                                  {isHalfOfBInteger ? (
                                    <>
                                      <p className="mt-2">
                                        <InlineMath
                                          math={`x^2 ${signOfB} ${absOfB} x + ${halfBSquared} = ${
                                            result.tech_C < 0 ? "-" : ""
                                          } ${absoluteValue(
                                            result.tech_C
                                          )} + ${halfBSquared}`}
                                        />
                                      </p>

                                      <p className="mt-2">
                                        <InlineMath
                                          math={`\\left(x ${signOfHalfB} ${absOfHalfB}\\right)^2 = ${
                                            result.tech_C < 0 ? "-" : ""
                                          } ${absoluteValue(
                                            result.tech_C
                                          )} + ${halfBSquared}`}
                                        />
                                      </p>

                                      {rightSideValue !== 0 ? (
                                        <>
                                          <p className="mt-2">
                                            <InlineMath
                                              math={`x ${signOfHalfB} ${absOfHalfB} = \\pm \\sqrt{${rightSideValue} ${imaginaryUnit}}`}
                                            />
                                          </p>

                                          <p className="mt-2">
                                            <InlineMath
                                              math={`x = ${
                                                signOfHalfB === "+" ? "-" : "+"
                                              } ${absOfHalfB} \\pm \\sqrt{${rightSideValue} ${imaginaryUnit}}`}
                                            />
                                          </p>

                                          <p className="mt-2">
                                            <InlineMath
                                              math={`x_1 = ${
                                                signOfHalfB === "+" ? "-" : "+"
                                              } ${absOfHalfB} + \\sqrt{${rightSideValue} ${imaginaryUnit}} = ${
                                                result.tech_x1
                                              } ${imaginaryUnit}`}
                                            />
                                          </p>

                                          <p className="mt-2">
                                            <InlineMath
                                              math={`x_2 = ${
                                                signOfHalfB === "+" ? "-" : "+"
                                              } ${absOfHalfB} - \\sqrt{${rightSideValue} ${imaginaryUnit}} = ${
                                                result.tech_x2
                                              } ${imaginaryUnit}`}
                                            />
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          <p className="mt-2">
                                            <InlineMath
                                              math={`x ${signOfHalfB} ${absOfHalfB} = \\pm \\sqrt{0}`}
                                            />
                                          </p>

                                          <p className="mt-2">
                                            <InlineMath
                                              math={`x = ${
                                                signOfHalfB === "+" ? "+" : "-"
                                              } ${absOfHalfB}`}
                                            />
                                          </p>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <p className="mt-2">
                                        <InlineMath
                                          math={`x^2 ${signOfB} ${absOfB} x + \\frac{${BSquared}}{4} = ${
                                            result.tech_C < 0 ? "-" : ""
                                          } ${absoluteValue(
                                            result.tech_C
                                          )} + \\frac{${BSquared}}{4}`}
                                        />
                                      </p>

                                      <p className="mt-2">
                                        <InlineMath
                                          math={`\\left(x ${signOfHalfB} \\frac{${absOfB}}{2}\\right)^2 = ${
                                            result.tech_C < 0 ? "-" : ""
                                          } ${absoluteValue(
                                            result.tech_C
                                          )} + \\frac{${BSquared}}{4}`}
                                        />
                                      </p>

                                      {rightSideValue !== 0 ? (
                                        <>
                                          <p className="mt-2">
                                            <InlineMath
                                              math={`x ${signOfHalfB} \\frac{${absOfB}}{2} = \\pm \\sqrt{\\frac{${rightSideValue}}{4} ${imaginaryUnit}}`}
                                            />
                                          </p>

                                          <p className="mt-2">
                                            <InlineMath
                                              math={`x = ${
                                                signOfHalfB === "+" ? "-" : "+"
                                              } \\frac{${absOfB}}{2} \\pm \\sqrt{\\frac{${rightSideValue}}{4} ${imaginaryUnit}}`}
                                            />
                                          </p>

                                          <p className="mt-2">
                                            <InlineMath
                                              math={`x_1 = ${
                                                signOfHalfB === "+" ? "-" : "+"
                                              } \\frac{${absOfB}}{2} + \\sqrt{\\frac{${rightSideValue}}{4} ${imaginaryUnit}} = ${
                                                result.tech_x1
                                              } ${imaginaryUnit}`}
                                            />
                                          </p>

                                          <p className="mt-2">
                                            <InlineMath
                                              math={`x_2 = ${
                                                signOfHalfB === "+" ? "-" : "+"
                                              } \\frac{${absOfB}}{2} - \\sqrt{\\frac{${rightSideValue}}{4} ${imaginaryUnit}} = ${
                                                result.tech_x2
                                              } ${imaginaryUnit}`}
                                            />
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          <p className="mt-2">
                                            <InlineMath
                                              math={`x ${signOfHalfB} \\frac{${absOfB}}{2} = \\pm \\sqrt{0}`}
                                            />
                                          </p>

                                          <p className="mt-2">
                                            <InlineMath
                                              math={`x = ${
                                                signOfHalfB === "+" ? "+" : "-"
                                              } \\frac{${absOfB}}{2}`}
                                            />
                                          </p>
                                        </>
                                      )}
                                    </>
                                  )}
                                </>
                              ) : null}
                            </>
                          ) : (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["using_q"]}
                              </p>
                              <p className="mt-2">
                                a = {a}, b = {b}, and c = {c}
                              </p>
                              <BlockMath
                                math={`x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`}
                              />
                              <BlockMath
                                math={`x = \\frac{${signB}${absB} \\pm \\sqrt{${b}^2 - 4(${a})(${c})}}{2(${a})}`}
                              />
                              <BlockMath
                                math={`x = \\frac{${signB}${absB} \\pm \\sqrt{${inner}}}{${a2}}`}
                              />
                              {inner > 0 && (
                                <>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["t_d"]} b² -
                                    4ac &gt; 0 so, there are two real roots.
                                  </p>
                                  <BlockMath
                                    math={`x_1 = \\frac{${signB}${absB} + \\sqrt{${inner}}}{${a2}} = ${(
                                      (-b + Number(inner2)) /
                                      a2
                                    ).toFixed(4)}`}
                                  />
                                  <BlockMath
                                    math={`x_2 = \\frac{${signB}${absB} - \\sqrt{${inner}}}{${a2}} = ${(
                                      (-b - Number(inner2)) /
                                      a2
                                    ).toFixed(4)}`}
                                  />
                                </>
                              )}
                              {inner < 0 && (
                                <>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["t_d"]} b² -
                                    4ac &lt; 0 so, there are two complex roots.
                                  </p>
                                  <BlockMath
                                    math={`x_1 = \\frac{${signB}${absB} + \\sqrt{${-inner}} i}{${a2}} = ${(
                                      -b / a2
                                    ).toFixed(4)} + ${(
                                      Math.sqrt(-inner) / a2
                                    ).toFixed(4)} i`}
                                  />
                                  <BlockMath
                                    math={`x_2 = \\frac{${signB}${absB} - \\sqrt{${-inner}} i}{${a2}} = ${(
                                      -b / a2
                                    ).toFixed(4)} - ${(
                                      Math.sqrt(-inner) / a2
                                    ).toFixed(4)} i`}
                                  />
                                </>
                              )}

                              {inner == 0 && (
                                <>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["t_d"]} b² -
                                    4ac = 0 so, there is one real root.
                                  </p>
                                  <BlockMath
                                    math={`x = \\frac{${signB}${absB}}{${a2}} = ${(
                                      -b / a2
                                    ).toFixed(4)}`}
                                  />
                                  <p className="mt-2">
                                    Root: {result?.tech_roots}
                                  </p>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="overflow-auto mt-5">
                        <Scatter data={datachart} options={options} />
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

export default QuadraticFormulaCalculator;

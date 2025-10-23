"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

import {
  useGetSingleCalculatorDetailsMutation,
  useEquationOfALineCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EquationOfALineCalculator = () => {
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
    tech_type: "2", // 2  1 3  4
    tech_x1: 2,
    tech_y1: 21,
    tech_x2: 11,
    tech_y2: 5,
    tech_x3: 2,
    tech_y3: 7,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEquationOfALineCalculatorMutation();

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
        tech_x1: formData.tech_x1,
        tech_y1: formData.tech_y1,
        tech_x2: formData.tech_x2,
        tech_y2: formData.tech_y2,
        tech_x3: formData.tech_x3,
        tech_y3: formData.tech_y3,
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
      tech_type: "2", // 2  1 3  4
      tech_x1: 2,
      tech_y1: 21,
      tech_x2: 11,
      tech_y2: 5,
      tech_x3: 2,
      tech_y3: 7,
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

  const slope = result?.tech_slope || "0.0";
  const b = result?.tech_b || 0;

  // Handle ± b display
  const bDisplay = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
  const xIntercept =
    slope !== "0.0" && slope !== 0 ? (-b / slope).toFixed(2) : "undefined"; // avoid divide by 0

  const yDiff = formData?.tech_y2 - formData?.tech_y1;
  const xDiff = formData?.tech_x2 - formData?.tech_x1;

  const m = formData?.tech_x2 ?? 0;
  const x1 = formData?.tech_x1 ?? 0;
  const y1 = formData?.tech_y1 ?? 0;

  const x2 = formData?.tech_x2 ?? 0;
  const x3 = formData?.tech_x3 ?? 0;
  const y2 = formData?.tech_y2 ?? 0;
  const y3 = formData?.tech_y3 ?? 0;

  const fx = result?.tech_f_down ?? 0;
  const sy = result?.tech_s_down ?? 0;
  const tz = result?.tech_t_down ?? 0;

  // chart js

  let points = [];
  let boxId = "";

  if (formData?.tech_type === "1") {
    // Point 1 and x2, 0
    points = [
      { x: parseFloat(formData.tech_x1), y: parseFloat(formData.tech_y1) },
      { x: parseFloat(formData.tech_x2), y: 0 },
    ];
    boxId = "box2";
  } else if (formData?.tech_type === "2") {
    points = [
      { x: parseFloat(formData.tech_x1), y: parseFloat(formData.tech_y1) },
      { x: parseFloat(formData.tech_x2), y: parseFloat(formData.tech_y2) },
    ];
    boxId = "box1";
  } else if (formData?.tech_type === "3") {
    // Only one point given and second is assumed (1, 1)
    points = [
      { x: 0, y: parseFloat(formData.tech_x1) },
      { x: 1, y: 1 },
    ];
    boxId = "box3";
  }

  const datachart = {
    datasets: [
      {
        label: "Line",
        data: points,
        showLine: true,
        borderColor: "blue",
        backgroundColor: "blue",
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: -15,
        max: 15,
        grid: { color: "#ddd" },
      },
      y: {
        min: -15,
        max: 15,
        grid: { color: "#ddd" },
      },
    },
    plugins: {
      legend: { display: false },
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
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type"
                    id="tech_type"
                    value={formData.tech_type}
                    onChange={handleChange}
                  >
                    <option value="2">
                      {data?.payload?.tech_lang_keys["2"]} (m)
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]} (b) &{" "}
                      {data?.payload?.tech_lang_keys["5"]} (m)
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_type == "2" ||
                formData.tech_type == "4" ||
                formData.tech_type == "1" ||
                formData.tech_type == "3") && (
                <>
                  <div className="col-span-6">
                    {formData.tech_type == "3" ? (
                      <>
                        <label htmlFor="tech_x1" className="label">
                          {" "}
                          Intercept (c):
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_x1" className="label">
                          {" "}
                          X<sub className="text-blue font-s-12">1</sub>:
                        </label>
                      </>
                    )}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_x1"
                        id="tech_x1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_x1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_type == "2" ||
                formData.tech_type == "4" ||
                formData.tech_type == "1") && (
                <>
                  <div className="col-span-6  second">
                    <label htmlFor="tech_y1" className="label">
                      Y<sub className="text-blue font-s-12">1</sub>:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_y1"
                        id="tech_y1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_y1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_type == "2" ||
                formData.tech_type == "4" ||
                formData.tech_type == "1" ||
                formData.tech_type == "3") && (
                <>
                  <div className="col-span-6">
                    {formData.tech_type == "1" ? (
                      <>
                        <label htmlFor="tech_x2" className="label">
                          {" "}
                          Slope:
                        </label>
                      </>
                    ) : formData.tech_type == "3" ? (
                      <>
                        <label htmlFor="tech_x2" className="label">
                          {" "}
                          Slope (m):
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_x2" className="label">
                          {" "}
                          X<sub className="text-blue font-s-12">2</sub>:
                        </label>
                      </>
                    )}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_x2"
                        id="tech_x2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_x2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_type == "2" || formData.tech_type == "4") && (
                <>
                  <div className="col-span-6 fourth">
                    <label htmlFor="tech_y2" className="label">
                      Y<sub className="text-blue font-s-12">2</sub>
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_y2"
                        id="tech_y2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_y2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_type == "4" && (
                <>
                  <div className="col-span-6  five_a">
                    <label htmlFor="tech_x3" className="label">
                      X<sub className="text-blue font-s-12">3</sub>
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_x3"
                        id="tech_x3"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_x3}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6  five_b">
                    <label htmlFor="tech_y3" className="label">
                      Y<sub className="text-blue font-s-12">3</sub>
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_y3"
                        id="tech_y3"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_y3}
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
                      <div className="w-full overflowauto">
                        {(result?.tech_type == "2" ||
                          result?.tech_type == "1" ||
                          result?.tech_type == "3") && (
                          <>
                            <p className="mt-2 text-[18px] font-semibold">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]}
                              </strong>
                            </p>

                            <p className="mt-2">
                              <InlineMath math="y = mx + c" />
                            </p>

                            <p className="mt-2">
                              <InlineMath math={`y = ${slope}x ${bDisplay}`} />
                            </p>

                            <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b w-[60%]">
                                      {data?.payload?.tech_lang_keys["5"]} (m)
                                    </td>
                                    <td className="py-2 border-b">{slope}</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      Y - {data?.payload?.tech_lang_keys["4"]}{" "}
                                      (b)
                                    </td>
                                    <td className="py-2 border-b">{b}</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      X - {data?.payload?.tech_lang_keys["4"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {xIntercept}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {result?.tech_type == "2" && (
                          <>
                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["8"]}
                              </strong>
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 1:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["10"]} P = (
                              {formData?.tech_x1}, {formData?.tech_y1}) and Q =
                              ({formData?.tech_x2}, {formData?.tech_y2})
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["11"]} P=(x₁, y₁)
                              and Q=(x₂, y₂){" "}
                              {data?.payload?.tech_lang_keys["12"]}
                            </p>

                            <p className="mt-3">
                              <InlineMath math="m = \frac{y_2 - y_1}{x_2 - x_1}" />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["13"]} x₁ ={" "}
                              {formData?.tech_x1}, y₁ = {formData?.tech_y1}, x₂
                              = {formData?.tech_x2}, y₂ = {formData?.tech_y2}
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 2:
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["14"]}:
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`m = \\frac{(${formData?.tech_y2}) - (${formData?.tech_y1})}{(${formData?.tech_x2}) - (${formData?.tech_x1})} = \\frac{${yDiff}}{${xDiff}} = ${slope}`}
                              />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 3:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["15"]} b = y₁ −
                              m⋅x₁ (or y₂ − m⋅x₂,{" "}
                              {data?.payload?.tech_lang_keys["16"]})
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`b = ${formData?.tech_y1} - (${slope}) \\cdot (${formData?.tech_x1}) = ${b}`}
                              />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 4:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["17"]}
                            </p>
                            <p className="mt-3">
                              <InlineMath math={`y = ${slope}x ${bDisplay}`} />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["18"]}:
                            </p>
                            <p className="mt-3">
                              <InlineMath math={`y = ${slope}x ${bDisplay}`} />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["19"]}:
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`y - (${formData?.tech_y1}) = ${slope} \\cdot (x - (${formData?.tech_x1}))`}
                              />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["19"]}:
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`y - (${formData?.tech_y2}) = ${slope} \\cdot (x - (${formData?.tech_x2}))`}
                              />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["20"]}:
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`${slope}x - y ${bDisplay} = 0`}
                              />
                            </p>

                            <div
                              id="box1"
                              className="col-lg-10 mt-4 mx-auto"
                              style={{ height: "500px" }}
                            >
                              <Scatter data={datachart} options={options} />
                            </div>
                          </>
                        )}
                        {result?.tech_type == "1" && (
                          <>
                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["8"]}
                              </strong>
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 1:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["21"]} m = {m} and
                              the point P = ({x1}, {y1})
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 2:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["15"]} b = y₁ − m ⋅
                              x₁
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`b = ${y1} - (${m}) \\cdot (${x1}) = ${b}`}
                              />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 3:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["17"]} y = mx + b
                            </p>

                            <p className="mt-3">
                              <InlineMath math={`y = ${slope}x ${bDisplay}`} />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["18"]}:
                            </p>
                            <p className="mt-3">
                              <InlineMath math={`y = ${slope}x ${bDisplay}`} />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["19"]}:
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`y - (${y1}) = ${slope} \\cdot (x - (${x1}))`}
                              />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["20"]}:
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`${slope}x - y ${bDisplay} = 0`}
                              />
                            </p>

                            <div
                              id="box2"
                              className="col-lg-10 mt-4 mx-auto"
                              style={{ height: "500px" }}
                            >
                              <Scatter data={datachart} options={options} />
                            </div>
                          </>
                        )}
                        {result?.tech_type == "3" && (
                          <>
                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["8"]}
                              </strong>
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 1:
                            </p>
                            <p className="mt-3">
                              m = {slope}, b = {b}
                            </p>

                            <p className="mt-3">
                              <InlineMath math={`y = (${slope})x + (${b})`} />
                            </p>

                            <p className="mt-3">
                              <InlineMath math={`y = ${slope}x ${bDisplay}`} />
                            </p>

                            <div
                              id="box3"
                              className="col-lg-10 mt-4 mx-auto"
                              style={{ height: "500px" }}
                            >
                              <Scatter data={datachart} options={options} />
                            </div>
                          </>
                        )}
                        {result?.tech_type == "4" && (
                          <>
                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["22"]}
                              </strong>
                            </p>

                            <p className="mt-3">
                              <InlineMath
                                math={`\\frac{x - (${x1})}{${fx}} = \\frac{y - (${x2})}{${sy}} = \\frac{z - (${x3})}{${tz}}`}
                              />
                            </p>

                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["8"]}
                              </strong>
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 1:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["23"]}:
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`\\frac{x - x_a}{x_b - x_a} = \\frac{y - y_a}{y_b - y_a} = \\frac{z - z_a}{z_b - z_a}`}
                              />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 2:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["24"]}:
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`\\frac{x - (${x1})}{(${y1}) - (${x1})} = \\frac{y - (${x2})}{(${y2}) - (${x2})} = \\frac{z - (${x3})}{(${y3}) - (${x3})}`}
                              />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 3:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["25"]}:
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`\\frac{x - (${x1})}{${fx}} = \\frac{y - (${x2})}{${sy}} = \\frac{z - (${x3})}{${tz}}`}
                              />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["26"]}
                            </p>
                            <BlockMath
                              math={`
                                    \\begin{cases}
                                      x = ${fx}t + (${x1}) \\\\
                                      y = ${sy}t + (${x2}) \\\\
                                      z = ${tz}t + (${x3})
                                    \\end{cases}
                                  `}
                            />

                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["8"]}
                              </strong>
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 1:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["27"]}:
                            </p>
                            <BlockMath
                              math={`
                                    \\begin{cases}
                                      x = lt + x_1 \\\\
                                      y = mt + y_1 \\\\
                                      z = nt + z_1
                                    \\end{cases}
                                  `}
                            />

                            <p className="mt-3">where</p>
                            <p className="mt-3">
                              <InlineMath
                                math={`\\{ l; m; n \\} \\text{ — coordinates of a directing vector } \\ (\\overline{AB})`}
                              />
                            </p>
                            <p className="mt-3">
                              (x₁, y₁, z₁) - coordinates of a point on the line
                              (e.g. point A)
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 2:
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`\\overline{AB} = \\{ (${y1}) - (${x1}); (${y2}) - (${x2}); (${y3}) - (${x3}) \\} = \\{ ${fx}; ${sy}; ${tz} \\}`}
                              />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]} 3:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["28"]}:
                            </p>
                            <BlockMath
                              math={`
                                    \\begin{cases}
                                      x = ${fx}t + (${x1}) \\\\
                                      y = ${sy}t + (${x2}) \\\\
                                      z = ${tz}t + (${x3})
                                    \\end{cases}
                                  `}
                            />
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

export default EquationOfALineCalculator;

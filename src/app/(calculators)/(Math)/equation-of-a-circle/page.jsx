"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import {
  Chart,
  ScatterController,
  LineController,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

Chart.register(
  ScatterController,
  LineController,
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useEquationOfACircleMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EquationOfACircleCalculator = ({ tech_A, tech_B }) => {
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
    tech_from: "1", // 1 2 3 4 5
    tech_a: "5",
    tech_b: "3",
    tech_c: "1",
    tech_x1: "5",
    tech_y1: "4",
    tech_r: "3",
    tech_h1: "3",
    tech_k1: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEquationOfACircleMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_from) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_from: formData.tech_from,
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_c: formData.tech_c,
        tech_x1: formData.tech_x1,
        tech_y1: formData.tech_y1,
        tech_r: formData.tech_r,
        tech_h1: formData.tech_h1,
        tech_k1: formData.tech_k1,
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
      tech_from: "1", // 1 2 3 4 5
      tech_a: "5",
      tech_b: "3",
      tech_c: "1",
      tech_x1: "5",
      tech_y1: "4",
      tech_r: "3",
      tech_h1: "3",
      tech_k1: "4",
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

  const xSign = result?.tech_A < 0 ? "+" : "-";
  const ySign = result?.tech_B < 0 ? "+" : "-";
  const xValue = Math.abs(result?.tech_A);
  const yValue = Math.abs(result?.tech_B);

  let standardForm = "";
  if (result?.tech_A < 0 && result?.tech_B < 0) {
    standardForm = `(x ${xSign} ${xValue})^2 + (y ${ySign} ${yValue})^2 = (${result?.tech_radius})^2`;
  } else if (result?.tech_A >= 0 && result?.tech_B < 0) {
    standardForm = `(x - ${result?.tech_A})^2 + (y ${ySign} ${yValue})^2 = (${result?.tech_radius})^2`;
  } else if (result?.tech_A < 0 && result?.tech_B >= 0) {
    standardForm = `(x ${xSign} ${xValue})^2 + (y - ${result?.tech_B})^2 = (${result?.tech_radius})^2`;
  } else {
    standardForm = `(x - ${result?.tech_A})^2 + (y - ${result?.tech_B})^2 = (${result?.tech_radius})^2`;
  }

  const xD = Math.abs(result?.tech_D);
  const yE = Math.abs(result?.tech_E);
  const zF = Math.abs(result?.tech_F);

  const signD = result?.tech_D < 0 ? "-" : "+";
  const signE = result?.tech_E < 0 ? "-" : "+";
  const signF = result?.tech_F < 0 ? "-" : "+";

  let generalForm = "";
  if (result?.tech_D < 0 && result?.tech_E < 0) {
    generalForm = `x^2 + y^2 ${signD} ${xD}x ${signE} ${yE}y ${
      signF === "+" ? "+" : "-"
    } ${zF} = 0`;
  } else if (result?.tech_D >= 0 && result?.tech_E < 0) {
    generalForm = `x^2 + y^2 + ${xD}x ${signE} ${yE}y ${
      signF === "+" ? "+" : "-"
    } ${zF} = 0`;
  } else if (result?.tech_D < 0 && result?.tech_E >= 0) {
    generalForm = `x^2 + y^2 ${signD} ${xD}x + ${yE}y ${
      signF === "+" ? "+" : "-"
    } ${zF} = 0`;
  } else {
    generalForm = `x^2 + y^2 + ${xD}x + ${yE}y ${
      signF === "+" ? "+" : "-"
    } ${zF} = 0`;
  }

  // chart js

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Only create chart if we have valid data and the canvas reference exists
    if (!result || !chartRef.current) return;

    // Clean up any existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    try {
      // Generate points for the circle centered at (tech_A, tech_B) with radius 5
      const radius = 5;
      const circlePoints = [];
      for (let angle = 0; angle <= 360; angle += 5) {
        const rad = (angle * Math.PI) / 180;
        circlePoints.push({
          x: result.tech_A + radius * Math.cos(rad),
          y: result.tech_B + radius * Math.sin(rad),
        });
      }

      // Line from center (tech_A, tech_B) to origin (0,0)
      const linePoints = [
        { x: result.tech_A, y: result.tech_B },
        { x: 0, y: 0 },
      ];

      // Center point
      const centerPoint = [{ x: result.tech_A, y: result.tech_B }];

      chartInstance.current = new Chart(chartRef.current, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Center Point",
              data: centerPoint,
              backgroundColor: "red",
              pointRadius: 6,
              showLine: false,
            },
            {
              label: "Circle",
              data: circlePoints,
              borderColor: "green",
              borderWidth: 2,
              fill: false,
              showLine: true,
              pointRadius: 0,
            },
            {
              label: "Line to Origin",
              data: linePoints,
              borderColor: "blue",
              borderWidth: 2,
              fill: false,
              showLine: true,
              pointRadius: 0,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "linear",
              position: "bottom",
              min: -15,
              max: 15,
              ticks: {
                stepSize: 5,
              },
            },
            y: {
              type: "linear",
              min: -15,
              max: 15,
              ticks: {
                stepSize: 5,
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            title: {
              display: true,
              text: "Geometry Chart with Chart.js",
            },
          },
          elements: {
            point: {
              hoverRadius: 7,
            },
          },
        },
      });
    } catch (error) {
      console.error("Failed to create chart:", error);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [result]); // Only re-run when result changes

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
                <label htmlFor="tech_from" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_from"
                    id="tech_from"
                    value={formData.tech_from}
                    onChange={handleChange}
                  >
                    <option value="1">(x - A)² + (y - B)² = C </option>
                    <option value="2">
                      x = A + r cos(α), y = B + r sin(α){" "}
                    </option>
                    <option value="3">x² + y² + Dx + Ey + F = 0 </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_from == "1" ||
                formData.tech_from == "2" ||
                formData.tech_from == "3") && (
                <>
                  <div className="col-span-12 standardEquation">
                    <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                      <p className="col-span-12 text-center my-3 text-[18px]">
                        <strong id="changeText">
                          {formData?.tech_from === "2"
                            ? "Parametric Equation: x = A + r cos(α), y = B + r sin(α)"
                            : formData?.tech_from === "3"
                            ? "General Form: x² + y² + Dx + Ey + F = 0"
                            : "Standard Form: (x - A)² + (y - B)² = C"}
                        </strong>
                      </p>
                      <div className="col-span-4">
                        {formData?.tech_from === "3" ? (
                          <>
                            <label htmlFor="tech_a" className="label">
                              D{" "}
                            </label>
                          </>
                        ) : (
                          <>
                            <label htmlFor="tech_a" className="label">
                              A{" "}
                            </label>
                          </>
                        )}
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
                      <div className="col-span-4">
                        {formData?.tech_from === "3" ? (
                          <>
                            <label htmlFor="tech_b" className="label">
                              E{" "}
                            </label>
                          </>
                        ) : (
                          <>
                            <label htmlFor="tech_b" className="label">
                              B{" "}
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
                      <div className="col-span-4">
                        {formData?.tech_from === "2" ? (
                          <>
                            <label htmlFor="tech_c" className="label">
                              r{" "}
                            </label>
                          </>
                        ) : formData?.tech_from === "3" ? (
                          <>
                            <label htmlFor="tech_c" className="label">
                              F{" "}
                            </label>
                          </>
                        ) : (
                          <>
                            <label htmlFor="tech_c" className="label">
                              C{" "}
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
                </>
              )}
              {(formData.tech_from == "4" || formData.tech_from == "5") && (
                <>
                  <div className="col-span-12  circlePoints">
                    <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4">
                      <p className="col-span-12 text-center my-3 text-[18px]">
                        <strong>
                          {data?.payload?.tech_lang_keys["5"]} (x,y)
                        </strong>
                      </p>
                      <div
                        className={`${
                          formData?.tech_from === "5"
                            ? "col-span-6"
                            : "col-span-4"
                        } px-2 mt-0 mt-lg-2 xInput`}
                      >
                        <label htmlFor="tech_x1" className="label">
                          x
                        </label>
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
                      <div
                        className={`${
                          formData?.tech_from === "5"
                            ? "col-span-6"
                            : "col-span-4"
                        } px-2 mt-0 mt-lg-2 xInput`}
                      >
                        <label htmlFor="tech_y1" className="label">
                          y
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
                      {formData.tech_from != "5" && (
                        <>
                          <div className="col-span-4 radiusInput">
                            <label htmlFor="tech_r" className="label">
                              {data?.payload?.tech_lang_keys["6"]}:
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_r"
                                id="tech_r"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_r}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              {formData.tech_from == "5" && (
                <>
                  <div className="col-span-12  centerPoints">
                    <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4">
                      <p className="col-span-12 text-center my-3 text-[18px]">
                        <strong>
                          {data?.payload?.tech_lang_keys["7"]} (h,k)
                        </strong>
                      </p>
                      <div className="col-span-6">
                        <label htmlFor="tech_h1" className="label">
                          {" "}
                          h{" "}
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_h1"
                            id="tech_h1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_h1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_k1" className="label">
                          {" "}
                          k{" "}
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_k1"
                            id="tech_k1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_k1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
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
                        <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="45%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[8]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <BlockMath math={standardForm} />
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="45%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[9]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <BlockMath math={generalForm} />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="col-12">
                          <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="45%">
                                    {data?.payload?.tech_lang_keys["6"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>{result?.tech_radius}</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="45%">
                                    {data?.payload?.tech_lang_keys["10"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>{result?.tech_diameter}</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="45%">
                                    {data?.payload?.tech_lang_keys["11"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      [{result?.tech_d1} , {result?.tech_d2}]
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="45%">
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>{result?.tech_eccentricity}</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    className="py-2 border-b"
                                    rowSpan="2"
                                    width="45%"
                                  >
                                    {data?.payload?.tech_lang_keys["13"]}
                                  </td>
                                  <td className="py-2">
                                    <strong>
                                      x-coordianate {result?.tech_A}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      y-coordianate {result?.tech_B}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="45%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["14"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_area}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="45%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["15"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_circumference}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="45%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["16"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  [{result?.tech_r1} , {result?.tech_r2}]
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="45%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["17"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_eccentricity}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  className="py-2 border-b"
                                  rowSpan="2"
                                  width="45%"
                                >
                                  <strong>
                                    {data?.payload?.tech_lang_keys["18"]}
                                  </strong>
                                </td>
                                <td className="py-2">
                                  x = {result?.tech_A} + {result?.tech_radius}{" "}
                                  cos(α)
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  y = {result?.tech_B} + {result?.tech_radius}{" "}
                                  sin(α)
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div id="box1" className="col-lg-8 mt-4 mx-auto">
                          <div style={{ width: "100%", height: "400px" }}>
                            <canvas ref={chartRef} />
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

export default EquationOfACircleCalculator;

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
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useParabolaCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ParabolaCalculator = () => {
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
    tech_from: "1", // 1 2 3 7
    tech_a: "2",
    tech_b: "6",
    tech_c: "13",
    tech_h1: "3",
    tech_k1: "4",
    tech_x11: "2",
    tech_y11: "3",
    tech_x1: "0",
    tech_y1: "3",
    tech_x2: "1",
    tech_y2: "2",
    tech_x3: "2",
    tech_y3: "3",
    tech_axis: "x",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useParabolaCalculatorMutation();

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
        tech_h1: formData.tech_h1,
        tech_k1: formData.tech_k1,
        tech_x11: formData.tech_x11,
        tech_y11: formData.tech_y11,
        tech_x1: formData.tech_x1,
        tech_y1: formData.tech_y1,
        tech_x2: formData.tech_x2,
        tech_y2: formData.tech_y2,
        tech_x3: formData.tech_x3,
        tech_y3: formData.tech_y3,
        tech_axis: formData.tech_axis,
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
      tech_from: "1", // 1 2 3 7
      tech_a: "2",
      tech_b: "6",
      tech_c: "13",
      tech_h1: "3",
      tech_k1: "4",
      tech_x11: "2",
      tech_y11: "3",
      tech_x1: "0",
      tech_y1: "3",
      tech_x2: "1",
      tech_y2: "2",
      tech_x3: "2",
      tech_y3: "3",
      tech_axis: "x",
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
  const is_numeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

  const formatFraction = (num, den) =>
    `\\frac{${Math.abs(num)}}{${Math.abs(den)}}`;

  const isNum = (val) => !isNaN(parseFloat(val));
  const frac = (num, den) => `\\frac{${num}}{${den}}`;
  const val = (v, n, d) => (isNum(v) ? v : frac(n, d));

  const h = formData.tech_h1;
  const k = formData.tech_k1;
  const x11 = formData.tech_x11;
  const y11 = formData.tech_y11;
  const x1 = formData.tech_x1;
  const x2 = formData.tech_x2;
  const x3 = formData.tech_x3;
  const y1 = formData.tech_y1;
  const y2 = formData.tech_y2;
  const y3 = formData.tech_y3;

  const a1 = Math.pow(Number(formData.tech_x1 || 0), 2);
  const a2 = Math.pow(Number(formData.tech_x2 || 0), 2);
  const a3 = Math.pow(Number(formData.tech_x3 || 0), 2);

  // chart js
  const [chartData, setChartData] = useState({ datasets: [] });

  useEffect(() => {
    if (!result) return;

    const a = parseFloat(result?.tech_a);
    const b = parseFloat(result?.tech_b);
    const c = parseFloat(result?.tech_c);

    let firstX = -b / (2 * a) + 25;
    const points = [];

    for (let i = 0; i <= 50; i++) {
      const y = a * Math.pow(firstX, 2) + b * firstX + c;
      points.push({ x: firstX, y });
      firstX -= 1;
    }

    setChartData({
      datasets: [
        {
          label: "Parabola",
          data: points,
          backgroundColor: "#13699E",
          borderColor: "#13699E",
          showLine: true,
          pointRadius: 4,
          pointHoverRadius: 5,
          tension: 0.1,
        },
      ],
    });
  }, [result]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Parabola Chart" },
    },
    scales: {
      x: {
        title: { display: true, text: "x-axis" },
      },
      y: {
        title: { display: true, text: "y-axis" },
        min: -30,
        max: 30,
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
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["12"]}{" "}
                    </option>
                    <option value="7">
                      {data?.payload?.tech_lang_keys["13"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_from == "1" || formData.tech_from == "2") && (
                <>
                  <div className="col-span-12  standardEquation">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <p className="col-span-12 text-center text-[14px]">
                        {formData?.tech_from == "2" ? (
                          <>
                            <strong id="changeText">
                              {" "}
                              {data?.payload?.tech_lang_keys["3"]}: f(x) = a(x -
                              h)² + k
                            </strong>
                          </>
                        ) : (
                          <>
                            <strong id="changeText">
                              {" "}
                              Standard Form: y = ax² + bx + c
                            </strong>
                          </>
                        )}
                      </p>
                      <div className="col-span-4">
                        <label htmlFor="tech_a" className="label">
                          {" "}
                          a
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
                      <div className="col-span-4">
                        {formData?.tech_from == "2" ? (
                          <>
                            <label htmlFor="tech_b" className="label">
                              {" "}
                              h
                            </label>
                          </>
                        ) : (
                          <>
                            <label htmlFor="tech_b" className="label">
                              {" "}
                              b
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
                        {formData?.tech_from == "2" ? (
                          <>
                            <label htmlFor="tech_c" className="label">
                              {" "}
                              k
                            </label>
                          </>
                        ) : (
                          <>
                            <label htmlFor="tech_c" className="label">
                              {" "}
                              c
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
              {formData.tech_from == "3" && (
                <>
                  <div className="col-span-12  vertexPoints">
                    <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                      <p className="col-span-12 text-center my-3 text-[14px]">
                        <strong>
                          {data?.payload?.tech_lang_keys["5"]} P(h,k)
                        </strong>
                      </p>
                      <div className="col-span-6">
                        <label htmlFor="tech_h1" className="label">
                          h
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
                          k
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
                      <p className="col-span-12 text-center my-3 text-[14px]">
                        <strong>Point P₁(x₁,y₁)</strong>
                      </p>
                      <div className="col-span-6">
                        <label htmlFor="tech_x11" className="label">
                          x₁
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_x11"
                            id="tech_x11"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_x11}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_y11" className="label">
                          y₁
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_y11"
                            id="tech_y11"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_y11}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_from == "7" && (
                <>
                  <div className="col-span-12 threePoints">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <p className="col-span-12 text-center my-3 text-[14px]">
                        <strong>P₁(x₁,y₁)</strong>
                      </p>
                      <div className="col-span-6">
                        <label htmlFor="tech_x1" className="label">
                          x₁
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
                      <div className="col-span-6">
                        <label htmlFor="tech_y1" className="label">
                          y₁
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
                      <p className="col-span-12 text-center my-3 text-[14px]">
                        <strong>P₂(x₂,y₂)</strong>
                      </p>
                      <div className="col-span-6">
                        <label htmlFor="tech_x2" className="label">
                          x₂
                        </label>
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
                      <div className="col-span-6">
                        <label htmlFor="tech_y2" className="label">
                          y₂
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
                      <p className="col-span-12 text-center my-3 text-[14px]">
                        <strong>P₃(x₃,y₃)</strong>
                      </p>
                      <div className="col-span-6">
                        <label htmlFor="tech_x3" className="label">
                          x₃
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
                      <div className="col-span-6">
                        <label htmlFor="tech_y3" className="label">
                          y₃
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
                    </div>
                  </div>
                </>
              )}

              {(formData.tech_from == "3" || formData.tech_from == "7") && (
                <>
                  <div className="col-span-12  axisInput">
                    <label htmlFor="tech_axis" className="label">
                      {data?.payload?.tech_lang_keys["14"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_axis"
                        id="tech_axis"
                        value={formData.tech_axis}
                        onChange={handleChange}
                      >
                        <option value="x">
                          {data?.payload?.tech_lang_keys["15"]}{" "}
                        </option>
                        <option value="y">
                          {data?.payload?.tech_lang_keys["16"]}{" "}
                        </option>
                      </select>
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
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
                        {formData?.tech_axis == "y" ? (
                          <>
                            <div className="w-full md:w-[90%] lg:w-[80%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`y = ${result?.tech_a}x^2 ${
                                          result?.tech_b >= 0 ? "+" : ""
                                        }${result?.tech_b}x ${
                                          result?.tech_c >= 0 ? "+" : ""
                                        }${result?.tech_c}`}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[3]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`y = ${
                                          result?.tech_a !== "1"
                                            ? result?.tech_a
                                            : ""
                                        }(x ${
                                          result?.tech_hf_ > 0 ? "-" : "+"
                                        } ${
                                          is_numeric(result?.tech_hf)
                                            ? Math.abs(result?.tech_hf)
                                            : `\\frac{${Math.abs(
                                                result?.tech_h1
                                              )}}{${Math.abs(result?.tech_h2)}}`
                                        })^2 ${
                                          result?.tech_kf_ > 0 ? "+" : "-"
                                        } ${
                                          is_numeric(result?.tech_kf)
                                            ? Math.abs(result?.tech_kf)
                                            : `\\frac{${Math.abs(
                                                result?.tech_k1
                                              )}}{${Math.abs(result?.tech_k2)}}`
                                        }`}
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="w-full md:w-[90%] lg:w-[80%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys["5"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`(${
                                          is_numeric(result?.tech_kf)
                                            ? result?.tech_kf
                                            : `\\frac{${result?.tech_k1}}{${result?.tech_k2}}`
                                        }, ${
                                          is_numeric(result?.tech_hf)
                                            ? result?.tech_hf
                                            : `\\frac{${result?.tech_h1}}{${result?.tech_h2}}`
                                        })`}
                                      />
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`(${
                                          is_numeric(result?.tech_fuf)
                                            ? result?.tech_fuf
                                            : `\\frac{${result?.tech_fu1}}{${result?.tech_fu2}}`
                                        }, ${
                                          is_numeric(result?.tech_hf)
                                            ? result?.tech_hf
                                            : `\\frac{${result?.tech_h1}}{${result?.tech_h2}}`
                                        })`}
                                      />
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys["7"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath math="1" />
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys["8"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`x = ${
                                          is_numeric(result?.tech_dirf)
                                            ? result?.tech_dirf
                                            : `\\frac{${result?.tech_dir1}}{${result?.tech_dir2}}`
                                        }`}
                                      />
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`x = ${
                                          is_numeric(result?.tech_fuf)
                                            ? result?.tech_fuf
                                            : `\\frac{${result?.tech_fu1}}{${result?.tech_fu2}}`
                                        }`}
                                      />
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`y = ${
                                          is_numeric(result?.tech_hf)
                                            ? result?.tech_hf
                                            : `\\frac{${result?.tech_h1}}{${result?.tech_h2}}`
                                        }`}
                                      />
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      y-{data?.payload?.tech_lang_keys["11"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={
                                          result?.tech_x_inter1
                                            ? `(0, ${result?.tech_x_inter1}) , (0 , ${result?.tech_x_inter2})`
                                            : `\\text{No y-${data?.payload?.tech_lang_keys["11"]}}`
                                        }
                                      />
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      x-{data?.payload?.tech_lang_keys["11"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`(${result?.tech_y_inter}, 0)`}
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full md:w-[90%] lg:w-[80%] overflow-auto mt-2">
                              <table className="w-full text-[18px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`y = ${result?.tech_a}x^2 ${
                                          result?.tech_b >= 0 ? "+" : ""
                                        }${result?.tech_b}x ${
                                          result?.tech_c >= 0 ? "+" : ""
                                        }${result?.tech_c}`}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[3]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`y = ${
                                          result?.tech_a !== "1"
                                            ? result?.tech_a
                                            : ""
                                        }(x ${
                                          result?.tech_hf_ > 0 ? "-" : "+"
                                        } ${
                                          is_numeric(result?.tech_hf)
                                            ? Math.abs(result?.tech_hf)
                                            : formatFraction(
                                                result?.tech_h1,
                                                result?.tech_h2
                                              )
                                        })^2 ${
                                          result?.tech_kf_ > 0 ? "+" : "-"
                                        } ${
                                          is_numeric(result?.tech_kf)
                                            ? Math.abs(result?.tech_kf)
                                            : formatFraction(
                                                result?.tech_k1,
                                                result?.tech_k2
                                              )
                                        }`}
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="w-full md:w-[90%] lg:w-[80%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys["5"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`(${
                                          is_numeric(result?.tech_hf)
                                            ? result?.tech_hf
                                            : formatFraction(
                                                result?.tech_h1,
                                                result?.tech_h2
                                              )
                                        }, ${
                                          is_numeric(result?.tech_kf)
                                            ? result?.tech_kf
                                            : formatFraction(
                                                result?.tech_k1,
                                                result?.tech_k2
                                              )
                                        })`}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`(${
                                          is_numeric(result?.tech_hf)
                                            ? result?.tech_hf
                                            : formatFraction(
                                                result?.tech_h1,
                                                result?.tech_h2
                                              )
                                        }, ${
                                          is_numeric(result?.tech_fuf)
                                            ? result?.tech_fuf
                                            : formatFraction(
                                                result?.tech_fu1,
                                                result?.tech_fu2
                                              )
                                        })`}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys["7"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath math={`1`} />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys["8"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`y = ${
                                          is_numeric(result?.tech_dirf)
                                            ? result?.tech_dirf
                                            : formatFraction(
                                                result?.tech_dir1,
                                                result?.tech_dir2
                                              )
                                        }`}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`y = ${
                                          is_numeric(result?.tech_fuf)
                                            ? result?.tech_fuf
                                            : formatFraction(
                                                result?.tech_fu1,
                                                result?.tech_fu2
                                              )
                                        }`}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`x = ${
                                          is_numeric(result?.tech_hf)
                                            ? result?.tech_hf
                                            : formatFraction(
                                                result?.tech_h1,
                                                result?.tech_h2
                                              )
                                        }`}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      x-{data?.payload?.tech_lang_keys["11"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={
                                          result?.tech_x_inter1
                                            ? `(${result?.tech_x_inter1} , 0), (${result?.tech_x_inter2} , 0)`
                                            : `\\text{No x-${data?.payload?.tech_lang_keys["11"]}}`
                                        }
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      y-{data?.payload?.tech_lang_keys["11"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <BlockMath
                                        math={`(0 , ${result?.tech_y_inter})`}
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {(result?.tech_from == 3 || result?.tech_from == 7) && (
                          <>
                            <div className="w-full text-[16px]">
                              <p className="mt-2 font-bold">Solution</p>

                              {result?.tech_from == 3 &&
                                result?.tech_axis == "x" && (
                                  <>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["17"]}:{" "}
                                      <BlockMath
                                        math={`P=(${h},${k}), Q=(${val(
                                          result?.tech_hf,
                                          result?.tech_h1,
                                          result?.tech_h2
                                        )}, ${val(
                                          result?.tech_fuf,
                                          result?.tech_fu1,
                                          result?.tech_fu2
                                        )})`}
                                      />
                                    </p>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["18"]}{" "}
                                      <BlockMath math={`y = a(x-h)^2 + k`} />
                                    </p>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["19"]}{" "}
                                      <BlockMath
                                        math={`y = a(x-${h})^2 + ${k}`}
                                      />
                                    </p>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["20"]}{" "}
                                      <BlockMath
                                        math={`${y11} = a(${x11}-${h})^2 + ${k}`}
                                      />
                                    </p>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["21"]}{" "}
                                      <BlockMath
                                        math={`a = ${result?.tech_a}`}
                                      />
                                    </p>
                                  </>
                                )}

                              {result?.tech_from == 3 &&
                                result?.tech_axis == "y" && (
                                  <>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["17"]}:{" "}
                                      <BlockMath
                                        math={`P=(${h},${k}), Q=(${val(
                                          result?.tech_fuf,
                                          result?.tech_fu1,
                                          result?.tech_fu2
                                        )}, ${val(
                                          result?.tech_hf,
                                          result?.tech_h1,
                                          result?.tech_h2
                                        )})`}
                                      />
                                    </p>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["18"]}{" "}
                                      <BlockMath math={`x = a(y-k)^2 + h`} />
                                    </p>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["19"]}{" "}
                                      <BlockMath
                                        math={`x = a(y-${h})^2 + ${k}`}
                                      />
                                    </p>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["20"]}{" "}
                                      <BlockMath
                                        math={`${y11} = a(${x11}-${h})^2 + ${k}`}
                                      />
                                    </p>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["21"]}{" "}
                                      <BlockMath
                                        math={`a = ${result?.tech_a}`}
                                      />
                                    </p>
                                  </>
                                )}

                              {result?.tech_from == 7 &&
                                result?.tech_axis == "x" && (
                                  <>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["17"]}:{" "}
                                      <BlockMath
                                        math={`P_1=(${x1},${y1}), P_2=(${x2},${y2}), P_3=(${x3},${y3})`}
                                      />
                                    </p>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["22"]}{" "}
                                      <BlockMath math={`y = ax^2 + bx + c`} />
                                    </p>
                                    {[x1, x2, x3].map((x, i) => (
                                      <p className="mt-2" key={i}>
                                        {data?.payload?.tech_lang_keys["23"]}{" "}
                                        <BlockMath
                                          math={`${
                                            formData[`tech_y${i + 1}`]
                                          } = ${Math.pow(x, 2)}a + ${x}b + c`}
                                        />
                                      </p>
                                    ))}
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["24"]}
                                    </p>
                                    <BlockMath
                                      math={`\\begin{cases} 
                                  ${a1}a + ${x1}b + c = ${y1} \\\\
                                  ${a2}a + ${x2}b + c = ${y2} \\\\
                                  ${a3}a + ${x3}b + c = ${y3}
                                  \\end{cases}`}
                                    />

                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["25"]}{" "}
                                      <BlockMath
                                        math={`a = ${result?.tech_a}, b = ${result?.tech_b}, c = ${result?.tech_c}`}
                                      />
                                    </p>
                                  </>
                                )}

                              {result?.tech_from == 7 &&
                                result?.tech_axis == "y" && (
                                  <>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["17"]}:{" "}
                                      <BlockMath
                                        math={`P_1=(${x1},${y1}), P_2=(${x2},${y2}), P_3=(${x3},${y3})`}
                                      />
                                    </p>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["22"]}{" "}
                                      <BlockMath math={`x = ay^2 + by + c`} />
                                    </p>
                                    {[y1, y2, y3].map((y, i) => (
                                      <p className="mt-2" key={i}>
                                        {data?.payload?.tech_lang_keys["23"]}{" "}
                                        <BlockMath
                                          math={`${
                                            formData[`tech_x${i + 1}`]
                                          } = ${Math.pow(y, 2)}a + ${y}b + c`}
                                        />
                                      </p>
                                    ))}
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["24"]}
                                      <BlockMath
                                        math={`\begin{cases}${a1}a + ${y1}b + c = ${x1} \\ ${a2}a + ${y2}b + c = ${x2} \\ ${a3}a + ${y3}b + c = ${x3}\end{cases}`}
                                      />
                                    </p>
                                    <p className="mt-2">
                                      {data?.payload?.tech_lang_keys["25"]}{" "}
                                      <BlockMath
                                        math={`a = ${result?.tech_a}, b = ${result?.tech_b}, c = ${result?.tech_c}`}
                                      />
                                    </p>
                                  </>
                                )}
                            </div>
                          </>
                        )}
                        {formData?.tech_axis !== "y" && (
                          <>
                            <div
                              id="box1"
                              className="w-full md:w-[80%] lg:w-[80%] mt-4 mx-auto"
                            >
                              <Scatter data={chartData} options={options} />
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

export default ParabolaCalculator;

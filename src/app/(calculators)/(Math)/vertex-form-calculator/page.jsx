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
  useVertexFormCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VertexFormCalculator = () => {
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
    tech_type: "vertex", // standard  vertex
    tech_a1: 1,
    tech_b1: 3,
    tech_c1: 5,
    tech_a: 12,
    tech_b: 3,
    tech_c: 5,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVertexFormCalculatorMutation();

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
        tech_a1: formData.tech_a1,
        tech_b1: formData.tech_b1,
        tech_c1: formData.tech_c1,
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
      tech_type: "vertex", // standard  vertex
      tech_a1: 1,
      tech_b1: 3,
      tech_c1: 5,
      tech_a: 12,
      tech_b: 3,
      tech_c: 5,
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
  const a = parseFloat(result?.tech_A);
  const b = parseFloat(result?.tech_B);
  const c = parseFloat(result?.tech_C);
  const round1 = parseInt(result?.tech_round1);
  const round2 = parseInt(result?.tech_round2);
  const round3 = parseInt(result?.tech_round3);
  const firstXMatch = parseFloat(result?.tech_firstx);
  const yAxisMatch = parseFloat(result?.tech_yaxis);

  let firstx = -b / (2 * a);
  firstx += 25;

  const dataPoints = [];

  for (let i = 0; i <= 50; i++) {
    const yaxis = a * Math.pow(firstx, 2) + b * firstx + c;
    const fx = parseFloat(firstx.toFixed(2));
    const fy = parseFloat(yaxis.toFixed(2));

    let pointColor = "#13699E"; // default

    if (fx.toFixed(round1) == firstXMatch && fy.toFixed(round2) == yAxisMatch) {
      pointColor = "#a52714";
    } else if (fx === 0 && fy.toFixed(round3) == c) {
      pointColor = "#33a1e3";
    }

    dataPoints.push({
      x: fx,
      y: fy,
      backgroundColor: pointColor,
    });

    firstx -= 1;
  }

  const chartData = {
    datasets: [
      {
        label: "Quadratic Plot",
        data: dataPoints,
        pointRadius: 5,
        borderColor: "#13699E",
        borderWidth: 1,
        showLine: true,
        parsing: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Quadratic Equation Graph",
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "x-axis",
        },
      },
      y: {
        title: {
          display: true,
          text: "y-axis",
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
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className=" mx-auto mt-2  w-full">
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
                      formData.tech_type === "standard" ? "tagsUnit" : ""
                    }`}
                    id="standard"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "standard" });
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
                      formData.tech_type === "vertex" ? "tagsUnit" : ""
                    }`}
                    id="vertex"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "vertex" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["11"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3   gap-2 md:gap-4 lg:gap-4">
              {formData.tech_type == "standard" && (
                <>
                  <div id="simpleInput" className=" col-span-12">
                    <p className="text-center my-2text-[14px}">
                      {" "}
                      <strong>Standard Form :</strong> y = ax
                      <sup className="font-s-12">2</sup> + bx + c
                    </p>
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-4">
                        <label htmlFor="tech_a1" className="label">
                          Enter a:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_a1"
                            id="tech_a1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_a1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4">
                        <label htmlFor="tech_b1" className="label">
                          Enter b:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_b1"
                            id="tech_b1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_b1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4">
                        <label htmlFor="tech_c1" className="label">
                          Enter c:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_c1"
                            id="tech_c1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_c1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type == "vertex" && (
                <>
                  <div id="advancedInput" className=" col-span-12">
                    <p className="text-center my-2text-[14px}">
                      <strong>Vertex Form : </strong>f(x) = A (x - H)
                      <sup className="font-s-12">2</sup> + K
                    </p>
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-4">
                        <label htmlFor="tech_a" className="label">
                          Enter A:
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
                        <label htmlFor="tech_b" className="label">
                          Enter H:
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
                      <div className="col-span-4">
                        <label htmlFor="tech_c" className="label">
                          Enter K:
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              {result?.tech_submit === "standard" ? (
                                <tr>
                                  <td className="py-2 border-b" width="35%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <BlockMath
                                      math={`f(${result?.tech_variable_ans}) = ${result?.tech_vertex}`}
                                    />
                                  </td>
                                </tr>
                              ) : (
                                <tr>
                                  <td className="py-2 border-b" width="35%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["4"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <BlockMath
                                      math={`f(${
                                        result?.tech_variable_ans
                                      }) = ${result?.tech_A}${
                                        result?.tech_variable_ans
                                      }^2 ${
                                        result?.tech_B < 0
                                          ? result?.tech_B
                                          : "+ " + result?.tech_B
                                      }${result?.tech_variable_ans} ${
                                        result?.tech_C < 0
                                          ? result?.tech_C
                                          : "+ " + result?.tech_C
                                      }`}
                                    />
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <p className="mt-2 text-[16px]">
                          <strong>{data?.payload?.tech_lang_keys["7"]}</strong>
                        </p>
                        <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["8"]}
                                </td>
                                <td className="py-2 border-b">
                                  <BlockMath
                                    math={`P(${result?.tech_firstx}, ${
                                      Math.round(result?.tech_yaxis * 1000) /
                                      1000
                                    })`}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["9"]}
                                </td>
                                <td className="py-2 border-b">
                                  <BlockMath math={`P(0, ${result?.tech_C})`} />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["15"]}
                            </strong>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[16]}:
                          </p>
                          {/* Basic standard form */}
                          <div className="mt-2 ">
                            <BlockMath
                              math={`f(${result?.tech_variable_ans}) = ${
                                result?.tech_A
                              }${result?.tech_variable_ans}^2 ${
                                result?.tech_B < 0
                                  ? result?.tech_B
                                  : "+ " + result?.tech_B
                              }${result?.tech_variable_ans} ${
                                result?.tech_C < 0
                                  ? result?.tech_C
                                  : "+ " + result?.tech_C
                              }`}
                            />
                          </div>

                          <p className="mt-2">
                            ({data?.payload?.tech_lang_keys[17]})
                          </p>

                          {/* Dividing by A for normalization */}
                          <div className="col s12 ">
                            <BlockMath
                              math={`f(${result?.tech_variable_ans}) = ${
                                result?.tech_A
                              }\\left(${result?.tech_variable_ans}^2 ${
                                result?.tech_B / result?.tech_A < 0
                                  ? result?.tech_B / result?.tech_A
                                  : "+ " + result?.tech_B / result?.tech_A
                              }${result?.tech_variable_ans} ${
                                result?.tech_C / result?.tech_A < 0
                                  ? result?.tech_C / result?.tech_A
                                  : "+ " + result?.tech_C / result?.tech_A
                              }\\right)`}
                            />
                          </div>

                          <p className="mt-2">
                            ({data?.payload?.tech_lang_keys[18]})
                          </p>

                          {/* Completing the square step */}
                          <div className="col s12 ">
                            <BlockMath
                              math={`f(${result?.tech_variable_ans}) = ${
                                result?.tech_A
                              }\\left(${result?.tech_variable_ans}^2 ${
                                result?.tech_B / result?.tech_A < 0
                                  ? result?.tech_B / result?.tech_A
                                  : "+ " + result?.tech_B / result?.tech_A
                              }${result?.tech_variable_ans} + \\left(\\frac{${
                                result?.tech_B
                              }}{${
                                2 * result?.tech_A
                              }}\\right)^2 - \\left(\\frac{${result?.tech_B}}{${
                                2 * result?.tech_A
                              }}\\right)^2 + \\frac{${result?.tech_C}}{${
                                result?.tech_A
                              }}\\right)`}
                            />
                          </div>

                          <p className="mt-2">
                            ({data?.payload?.tech_lang_keys[19]})
                          </p>

                          {/* Square form expression */}
                          <div className="col s12 ">
                            <BlockMath
                              math={`f(${result?.tech_variable_ans}) = ${
                                result?.tech_A
                              }\\left(\\left(${
                                result?.tech_variable_ans
                              } + \\frac{${result?.tech_B}}{${
                                2 * result?.tech_A
                              }}\\right)^2 - \\left(\\frac{${result?.tech_B}}{${
                                2 * result?.tech_A
                              }}\\right)^2 + \\frac{${result?.tech_C}}{${
                                result?.tech_A
                              }}\\right)`}
                            />
                          </div>

                          <p className="mt-2">
                            ({data?.payload?.tech_lang_keys[20]})
                          </p>

                          {/* Converted y-intercept adjustment */}
                          <div className="col s12 " style={{ height: "50px" }}>
                            <BlockMath
                              math={`f(${result?.tech_variable_ans}) = ${
                                result?.tech_A
                              }\\left(\\left(${
                                result?.tech_variable_ans
                              } + \\frac{${result?.tech_B}}{${
                                2 * result?.tech_A
                              }}\\right)^2 + \\frac{${
                                result?.tech_yaxis *
                                (Math.pow(
                                  result?.tech_A * result?.tech_round1,
                                  2
                                ) /
                                  result?.tech_A)
                              }}{${Math.pow(
                                result?.tech_A * result?.tech_round1,
                                2
                              )}}\\right)`}
                            />
                          </div>

                          <p className="mt-2">
                            ({data?.payload?.tech_lang_keys[21]})
                          </p>

                          {/* Final cleaned up square form */}
                          <div className="col s12 " style={{ height: "53px" }}>
                            <BlockMath
                              math={`f(${result?.tech_variable_ans}) = ${
                                result?.tech_A
                              }\\left(${result?.tech_variable_ans} + \\frac{${
                                result?.tech_B
                              }}{${2 * result?.tech_A}}\\right)^2 + \\frac{${
                                result?.tech_yaxis *
                                (Math.pow(
                                  result?.tech_A * result?.tech_round1,
                                  2
                                ) /
                                  result?.tech_A)
                              }}{${
                                Math.pow(
                                  result?.tech_A * result?.tech_round1,
                                  2
                                ) / result?.tech_A
                              }}`}
                            />
                          </div>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[22]}:
                          </p>
                          <div
                            id="chart_div"
                            className="col-lg-10 mx-auto my-3"
                            style={{ height: "500px" }}
                          >
                            <Scatter data={chartData} options={chartOptions} />
                          </div>
                          <div className="flex justify-center item-center text-[18px]">
                            <p className="flex">
                              <img
                                src="/images/vertex.png"
                                alt="vertex"
                                className="px-2 object-contain"
                              />
                              Vertex
                            </p>
                            <p className="flex">
                              <img
                                src="/images/y-axis.png"
                                alt="Y-axis"
                                className="px-2 object-contain"
                              />
                              Y-Intercept
                            </p>
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

export default VertexFormCalculator;

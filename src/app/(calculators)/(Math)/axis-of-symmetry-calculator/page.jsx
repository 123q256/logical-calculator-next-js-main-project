"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import {
  Chart as ChartJS,
  ScatterController,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(
  ScatterController,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAxisOfSymmetryCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AxisOfSymmetryCalculator = () => {
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
    tech_eq: "2x^2+5x-1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAxisOfSymmetryCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_eq) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_eq: formData.tech_eq,
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
      tech_eq: "2x^2+5x-1",
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
  const inputEqDifferent = result?.tech_input_eq !== result?.tech_expand_eq;

  // chart js

  // Extract coefficients safely and parseFloat
  const a = parseFloat(result?.tech_coeff_a) || 1;
  const b = parseFloat(result?.tech_coeff_b) || 0;
  const c = parseFloat(result?.tech_coeff_c) || 0;

  // Calculate vertex x = -b/(2a)
  const vertexX = -b / (2 * a);

  // Generate parabola points: from vertexX+25 down to vertexX-25 (51 points)
  const dataPoints = useMemo(() => {
    const points = [];
    let currentX = vertexX + 25;
    for (let i = 0; i <= 50; i++) {
      const y = a * currentX * currentX + b * currentX + c;
      points.push({ x: currentX, y });
      currentX -= 1;
    }
    return points;
  }, [a, b, c, vertexX]);

  const datachart = {
    datasets: [
      {
        label: "Parabola",
        data: dataPoints,
        showLine: true,
        fill: false,
        borderColor: "#13699E",
        backgroundColor: "#13699E",
        pointRadius: 0,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },

      datalabels: {
        display: false, // ✅ Disable value labels on bars
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
          <div className="lg:w-[50%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_eq" className="label">
                  {data?.payload?.tech_lang_keys["1"]} f(x):
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
            <div className="animate-pulse">
              <div className="w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
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
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["3"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <InlineMath
                                    math={`(${result?.tech_asal_jawab}, 0)`}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="col-12 text-[16px] overflow-auto">
                          <p className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["4"]}
                            </strong>
                          </p>
                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys[10]}{" "}
                            <InlineMath
                              math={`f(x) = ${result?.tech_input_eq}`}
                            />
                            .
                          </div>

                          {inputEqDifferent && (
                            <>
                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys[11]}{" "}
                                <InlineMath
                                  math={`f(x) = ${result?.tech_input_eq}`}
                                />
                                .
                              </div>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[12]}
                              </p>
                              <div className="mt-3">
                                <InlineMath
                                  math={`${result?.tech_input_eq} = ${result?.tech_expand_eq}`}
                                />
                                .
                              </div>
                            </>
                          )}

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[13]}
                          </p>
                          <div className="mt-3">
                            <BlockMath math={`x = - \\frac{b}{2a}`} />
                          </div>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[14]}
                          </p>
                          <div className="mt-3">
                            <InlineMath math={`a = ${result?.tech_coeff_a}`} />
                          </div>
                          <div className="mt-3">
                            <InlineMath math={`b = ${result?.tech_coeff_b}`} />
                          </div>
                          <div className="mt-3">
                            <InlineMath math={`c = ${result?.tech_coeff_c}`} />
                          </div>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[15]}
                          </p>
                          <div className="mt-3">
                            <BlockMath
                              math={`x = - \\frac{b}{2a} = - \\frac{${result?.tech_coeff_b}}{2 \\times ${result?.tech_coeff_a}} = ${result?.tech_asal_jawab}`}
                            />
                          </div>
                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys["16"]}{" "}
                            <InlineMath
                              math={`(${result?.tech_asal_jawab}, 0)`}
                            />
                          </div>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["17"]}
                          </p>

                          <div
                            id="box1"
                            style={{ height: 350 }}
                            className="col-lg-8 mt-4 mx-auto"
                          >
                            <Scatter data={datachart} options={options} />
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

export default AxisOfSymmetryCalculator;

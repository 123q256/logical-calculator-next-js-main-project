"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  Tooltip,
  Title,
} from "chart.js";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import { Chart } from "react-chartjs-2";

// Register necessary components
ChartJS.register(
  BoxPlotController,
  BoxAndWiskers,
  LinearScale,
  CategoryScale,
  Tooltip,
  Title
);

import {
  useGetSingleCalculatorDetailsMutation,
  useFiveNumberSummaryCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FiveNumberSummaryCalculator = () => {
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
    tech_seprateby: ",", // space  ,
    tech_textarea: "3, 8, 10, 17, 24, 27",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFiveNumberSummaryCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      // Check if separator is changed
      if (name === "tech_seprateby" && prevData.tech_textarea) {
        const oldSeparator = prevData.tech_seprateby;
        const newSeparator = value;

        // Normalize input: split by old separator and join with new separator
        const regex = new RegExp(oldSeparator === "space" ? " " : ",", "g");
        const parts = prevData.tech_textarea.split(regex).filter(Boolean);
        updatedData.tech_textarea = parts.join(
          newSeparator === "space" ? " " : ","
        );
      }

      return updatedData;
    });

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_seprateby || !formData.tech_textarea) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_seprateby: formData.tech_seprateby,
        tech_textarea: formData.tech_textarea,
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
      tech_seprateby: ",", // space  ,
      tech_textarea: "3, 8, 10, 17, 24, 27",
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
  let count = 0;
  let originalData = [];
  let datax = [];
  let median = null;
  let q1 = null;
  let q3 = null;
  let q1Term = null;
  let medianTerm = null;
  let q3Term = null;
  let firstHalf = [];
  let secondHalf = [];

  if (result?.tech_numbers && result.tech_numbers.length > 0) {
    originalData = [...result.tech_numbers];
    datax = [...originalData].sort((a, b) => a - b);
    count = datax.length;

    q1Term = ((count + 1) * 1) / 4;
    medianTerm = ((count + 1) * 2) / 4;
    q3Term = ((count + 1) * 3) / 4;

    // Median
    median =
      count % 2 === 0
        ? (datax[count / 2 - 1] + datax[count / 2]) / 2
        : datax[Math.floor(count / 2)];

    // Q1
    firstHalf = datax.slice(0, Math.floor(count / 2));
    q1 =
      firstHalf.length % 2 === 0
        ? (firstHalf[firstHalf.length / 2 - 1] +
            firstHalf[firstHalf.length / 2]) /
          2
        : firstHalf[Math.floor(firstHalf.length / 2)];

    // Q3
    secondHalf = datax.slice(Math.ceil(count / 2));
    q3 =
      secondHalf.length % 2 === 0
        ? (secondHalf[secondHalf.length / 2 - 1] +
            secondHalf[secondHalf.length / 2]) /
          2
        : secondHalf[Math.floor(secondHalf.length / 2)];
  }
  const chartRef = useRef(null);

  // chart js

  const datachart = {
    labels: ["5 Number Summary"],
    datasets: [
      {
        label: "Box Plot",
        backgroundColor: "#42A5F5",
        borderColor: "#1E88E5",
        borderWidth: 1,
        outlierColor: "#999999",
        padding: 10,
        itemRadius: 0,
        data: [
          {
            min: result?.tech_min,
            q1: result?.tech_first,
            median: result?.tech_second,
            q3: result?.tech_third,
            max: result?.tech_max,
          },
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Box Plot - 5 Number Summary",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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
            <div className="grid grid-cols-1   mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_seprateby" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_seprateby"
                    id="tech_seprateby"
                    value={formData.tech_seprateby}
                    onChange={handleChange}
                  >
                    <option value="space">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value=",">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_textarea" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_textarea"
                    id="tech_textarea"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 12 32 12 33 4 21"
                    value={formData.tech_textarea || "e.g. 12 32 12 33 4 21"}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full  justify-center">
                        <div className="w-full md:w-[80%] lg:w-[80%] mx-auto mt-2 px-2 py-1 bordered rounded-lg justify-center">
                          <table className="w-full text-[18px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" colSpan="2">
                                  <b>{data?.payload?.tech_lang_keys["6"]}</b>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["7"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_min}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["8"]} Q1:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_first}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["8"]} Q2 (
                                  {data?.payload?.tech_lang_keys["9"]}):
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_second}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["8"]} Q3:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_third}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["10"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_max}</strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {count % 2 === 0 ? (
                          <div className="w-full  text-[16px] p-3 mt-3">
                            <p className="mt-2 text-center">
                              <strong>Step by step solution:</strong>
                            </p>
                            <p className="mt-2">
                              The data set is {originalData.join(", ")}
                            </p>
                            <p className="mt-2">
                              <strong>
                                Step 1: Arrange the data set in ascending order.
                              </strong>
                            </p>
                            <p className="mt-2">{datax.join(", ")}</p>
                            <p className="mt-2">
                              <strong>
                                Step 2: Calculate the total number of terms “n”
                              </strong>
                            </p>
                            <p className="mt-2">Total terms = n = {count}</p>
                            <p className="mt-2">
                              <strong>Step 3: Find the Median:</strong>
                            </p>
                            <p className="mt-2">
                              Sorted data set = {datax.join(", ")}
                            </p>
                            <p className="mt-2">
                              Median of sorted data set ={" "}
                              {count % 2 === 0 ? (
                                <span className="fractionUpDown">
                                  <span className="num">
                                    {datax[count / 2 - 1]} + {datax[count / 2]}
                                  </span>
                                  <span className="visually-hidden"> / </span>
                                  <span className="den">2</span>
                                </span>
                              ) : (
                                datax[Math.floor(count / 2)]
                              )}
                            </p>
                            <p className="mt-2">Median = {median}</p>

                            <p className="mt-2">
                              <strong>For Q1:</strong>
                            </p>
                            <p className="mt-2">
                              Q1 = central element of first half sorted data
                              set.
                            </p>
                            <p className="mt-2">
                              First half data set = {firstHalf.join(", ")}
                            </p>
                            <p className="mt-2">
                              <strong>Q1 = {q1}</strong>
                            </p>

                            <p className="mt-2">
                              <strong>For Q3:</strong>
                            </p>
                            <p className="mt-2">
                              Q3 = central element of second half sorted data
                              set.
                            </p>
                            <p className="mt-2">
                              Second half data set = {secondHalf.join(", ")}
                            </p>
                            <p className="mt-2">
                              <strong>Q3 = {q3}</strong>
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="w-full  text-[16px] bg-sky-100 border p-3 mt-3">
                              <p className="mt-2 text-center">
                                <strong>Step by step solution:</strong>
                              </p>

                              <p className="mt-2">
                                The data set is: {originalData.join(", ")}
                              </p>

                              <p className="mt-2">
                                <strong>
                                  Step 1: Arrange the data set in ascending
                                  order.
                                </strong>
                              </p>
                              <p className="mt-2">{datax.join(", ")}</p>

                              <p className="mt-2">
                                <strong>
                                  Step 2: Calculate the total number of terms
                                  “n”
                                </strong>
                              </p>
                              <p className="mt-2">Total terms = n = {count}.</p>

                              <p className="mt-2">
                                <strong>For Median:</strong>
                              </p>
                              <p className="mt-2">
                                <strong>The formula for Median is:</strong>
                              </p>
                              <InlineMath
                                math={`\\text{Median} = \\left\\{ \\frac{2 \\times (n + 1)}{4} \\right\\}^{\\text{th}} \\text{ term}`}
                              />
                              <br />
                              <InlineMath
                                math={`\\text{Median} = \\left\\{ \\frac{2 \\times (${count} + 1)}{4} \\right\\}^{\\text{th}} \\text{ term}`}
                              />
                              <p>Median = {medianTerm} term</p>
                              <p>
                                Median = {Math.round(result?.tech_second || 0)}
                              </p>

                              <p className="mt-2">
                                <strong>For Q1:</strong>
                              </p>
                              <p>
                                <strong>The formula for Q1 is:</strong>
                              </p>
                              <InlineMath
                                math={`\\text{Q1} = \\left\\{ \\frac{1 \\times (n + 1)}{4} \\right\\}^{\\text{th}} \\text{ term}`}
                              />
                              <br />
                              <InlineMath
                                math={`\\text{Q1} = \\left\\{ \\frac{1 \\times (${count} + 1)}{4} \\right\\}^{\\text{th}} \\text{ term}`}
                              />
                              <p>Q1 = {q1Term} term</p>
                              <p>Q1 = {Math.round(result?.tech_first || 0)}</p>

                              <p className="mt-2">
                                <strong>For Q3:</strong>
                              </p>
                              <p>
                                <strong>The formula for Q3 is:</strong>
                              </p>
                              <InlineMath
                                math={`\\text{Q3} = \\left\\{ \\frac{3 \\times (n + 1)}{4} \\right\\}^{\\text{th}} \\text{ term}`}
                              />
                              <br />
                              <InlineMath
                                math={`\\text{Q3} = \\left\\{ \\frac{3 \\times (${count} + 1)}{4} \\right\\}^{\\text{th}} \\text{ term}`}
                              />
                              <p>Q3 = {q3Term} term</p>
                              <p>Q3 = {Math.round(result?.tech_third || 0)}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Chart
                    ref={chartRef}
                    type="boxplot"
                    data={datachart}
                    options={options}
                  />
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

export default FiveNumberSummaryCalculator;

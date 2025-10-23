"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
} from "chart.js";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import { Chart, Bar } from "react-chartjs-2";

// Register only once, all needed components
ChartJS.register(
  BoxPlotController,
  BoxAndWiskers,
  LinearScale,
  CategoryScale,
  Tooltip,
  BarElement,
  Title,
  ChartDataLabels
);

import {
  useGetSingleCalculatorDetailsMutation,
  useMeanMedianModeRangeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MeanMedianModeRangeCalculator = () => {
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
    tech_x: "1, 2, 3, 4, 4, 5, 6,12,34,57,19,38,52,555,82,384",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMeanMedianModeRangeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
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
      tech_x: "1, 2, 3, 4, 4, 5, 6,12,34,57,19,38,52,555,82,384",
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

  // chart js one

  const numbers = result?.tech_numbers || [];

  const modex = result?.tech_mode || [];
  const formattedMode = modex.join(" , ");
  const range = Math.max(...numbers) - Math.min(...numbers);

  // Get first numeric mode
  const mode = modex.find((val) => typeof val === "number") ?? null;

  const labels = numbers.map((num) => `${num}`);
  labels.push("Mean", "Median");
  if (mode !== null) {
    labels.push("Mode");
  }

  const chartData = [...numbers, result?.tech_average, result?.tech_median];
  if (mode !== null) {
    chartData.push(mode);
  }

  const backgroundColor = [
    ...numbers.map(() => "blue"),
    "orange",
    "red",
    ...(mode !== null ? ["green"] : []),
  ];

  const datachart = {
    labels: labels,
    datasets: [
      {
        label: "Value",
        data: chartData,
        backgroundColor,
        borderColor: backgroundColor,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        color: "black",
        anchor: "end",
        align: "end",
        formatter: (value) => value,
      },
    },
  };
  // chart js one

  // chart js two
  const minValue = Math.min(...(result?.tech_numbers || []));
  const maxValue = Math.max(...(result?.tech_numbers || []));

  const datachart2 = {
    labels: ["5 Number Summary"],
    datasets: [
      {
        label: "Box And Whisker Plot",
        backgroundColor: "#42A5F5",
        borderColor: "#1E88E5",
        borderWidth: 1,
        outlierColor: "#999999",
        padding: 10,
        itemRadius: 0,
        data: [
          {
            min: minValue,
            q1: result?.tech_Q1,
            median: result?.tech_median,
            q3: result?.tech_Q3,
            max: maxValue,
          },
        ],
      },
    ],
  };

  const options2 = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "boxAndWhisker",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // chart js two

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-4">
              <div className="col-span-12 md:col-span-12 raw_mean">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["x"]}:
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="2, 4, 6, 18, 10"
                    value={formData.tech_x || "2, 4, 6, 18, 10"}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-3 gap-4">
                        <div className="space-y-2 p-2">
                          <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                            <span className="text-[18px]">
                              {data?.payload?.tech_lang_keys["ave"]}
                            </span>
                            <strong className="text-[#119154] text-[25px] ps-2">
                              {result?.tech_average}
                            </strong>
                          </div>
                        </div>

                        <div className="space-y-2 p-2">
                          <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                            <span className="text-[18px]">
                              {data?.payload?.tech_lang_keys["med"]}
                            </span>
                            <strong className="text-[#119154] text-[25px] ps-2">
                              {result?.tech_median}
                            </strong>
                          </div>
                        </div>

                        <div className="space-y-2 p-2">
                          <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                            <span className="text-[18px]">
                              {data?.payload?.tech_lang_keys["mode"]}
                            </span>
                            <strong className="text-[#119154] text-[25px] ps-2">
                              {formattedMode}
                            </strong>
                          </div>
                        </div>

                        <div className="space-y-2 p-2">
                          <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                            <span className="text-[18px]">
                              {data?.payload?.tech_lang_keys["range"]}
                            </span>
                            <strong className="text-[#119154] text-[25px] ps-2">
                              {range}
                            </strong>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1    gap-4">
                        <div className="w-full mt-2 px-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["geo"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Math.round(
                                      Math.pow(
                                        result?.tech_numbers.reduce(
                                          (a, b) => a * b,
                                          1
                                        ),
                                        1 / result?.tech_count
                                      ) * 10000
                                    ) / 10000}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["ao"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_numbers.join(" , ")}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["do"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {[...result?.tech_numbers]
                                      .sort((a, b) => b - a)
                                      .join(" , ")}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["even"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_numbers
                                      .filter((n) => n % 2 === 0)
                                      .join(" , ")}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["odd"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_numbers
                                      .filter((n) => n % 2 !== 0)
                                      .join(" , ")}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["sum"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_numbers.reduce(
                                      (a, b) => a + b,
                                      0
                                    )}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  Lower quartile (Q1):
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_Q1}</strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  Upper quartile (Q3):
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_Q3}</strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  Interquartile range (IQR):
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_IQR}</strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["max"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Math.max(...result?.tech_numbers)}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["min"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Math.min(...result?.tech_numbers)}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2">
                                  {data?.payload?.tech_lang_keys["count"]}:
                                </td>
                                <td className="py-2">
                                  <strong>{result?.tech_numbers.length}</strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="bordered rounded-lg text-[18px] p-2 bg-sky mt-2">
                          <p>
                            <i className="text-blue">Reporting in APA style</i>
                          </p>
                          <p>M = {result?.tech_average}</p>
                          <p>Mdn = {result?.tech_median}</p>
                          <p>
                            IQR = {result?.tech_Q1} - {result?.tech_Q3} , IQR ={" "}
                            {result?.tech_IQR}
                          </p>
                        </div>
                        <p className="w-full mt-3 text-[18px] text-blue">
                          {data?.payload?.tech_lang_keys["chart"]}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "40px",
                            flexWrap: "wrap",
                          }}
                        >
                          {/* Bar Chart */}
                          <div style={{ flex: "1 1 400px", minWidth: "300px" }}>
                            <h3>Bar Chart</h3>
                            <Bar
                              data={datachart}
                              options={options}
                              plugins={[ChartDataLabels]}
                            />
                          </div>

                          {/* Box Plot */}
                          <div style={{ flex: "1 1 400px", minWidth: "300px" }}>
                            <h3>Box Plot</h3>
                            <Chart
                              type="boxplot"
                              data={datachart2}
                              options={options2}
                            />
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

export default MeanMedianModeRangeCalculator;

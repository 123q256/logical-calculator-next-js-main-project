"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register the required components for Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
import {
  useGetSingleCalculatorDetailsMutation,
  useROASCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ROASCalculator = () => {
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
    tech_first: "90",
    tech_hidden_currency: "USD",
    tech_operations1: "1",
    tech_second: "90",
    tech_third: "90",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useROASCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_operations1 == 1) {
      if (!formData.tech_operations1 || !formData.tech_first) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_operations1 ||
        !formData.tech_second ||
        !formData.tech_third ||
        !formData.tech_first
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_first: formData.tech_first,
        tech_hidden_currency: formData.tech_hidden_currency,
        tech_operations1: formData.tech_operations1,
        tech_second: formData.tech_second,
        tech_third: formData.tech_third,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_first: "90",
      tech_hidden_currency: "USD",
      tech_operations1: "1",
      tech_second: "90",
      tech_third: "90",
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

  let graphData = [];

  if (formData.tech_operations1 == 1) {
    graphData = [
      { label: "Ad spend", y: result?.tech_first * 1, color: "#f87171" },
      {
        label: "Ad revenue target",
        y: result?.tech_first * 8,
        color: "#60a5fa",
      },
      { label: "Ad revenue", y: result?.tech_second * 1, color: "#34d399" },
    ];
  } else {
    graphData = [
      { label: "Ad spend", y: result?.tech_first * 1, color: "#fbbf24" },
      {
        label: "Ad revenue target",
        y: result?.tech_answer1 * 1,
        color: "#c084fc",
      },
    ];
  }

  const dataChart = {
    labels: graphData.map((_, index) => `Data ${index + 1}`), // Create labels for each data point
    datasets: [
      {
        label: "ROAS",
        data: graphData.map((point) => point.y), // Assuming graphData is an array of objects with 'y' value
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Set the color of the bars
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "ROAS",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <input
              type="hidden"
              step="any"
              name="tech_hidden_currency"
              id="tech_hidden_currency"
              className="input my-2"
              aria-label="input"
              value={currency.symbol}
              onChange={handleChange}
            />

            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_first" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_first"
                    id="tech_first"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_first}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_operations1" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2 relative">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_operations1"
                    id="tech_operations1"
                    value={formData.tech_operations1}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_operations1 == 1 && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_second" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_second"
                        id="tech_second"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_second}
                        onChange={handleChange}
                      />
                      <span className="text-blue input_unit">
                        {currency.symbol}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_third" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (
                      {data?.payload?.tech_lang_keys["11"]}):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_third"
                        id="tech_third"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_third}
                        onChange={handleChange}
                      />
                      <span className="text-blue input_unit">
                        {currency.symbol}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      {formData.tech_operations1 == 1 ? (
                        <>
                          <div className="w-full md:w-[60%] lg:w-[60%] mt-2 overflow-auto">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b w-[70%]">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Math.round(result?.tech_answer1).toFixed(
                                      2
                                    )}{" "}
                                    %
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b w-[70%]">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[8]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {currency.symbol} {result?.tech_answer2}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="w-full my-3">
                            <p id="line">{result?.tech_line}</p>
                          </div>

                          <div className="w-full my-3">
                            <div className="w-full md:w-[60%] lg:w-[60%] mx-auto">
                              <Bar data={dataChart} options={options} />
                            </div>
                          </div>
                        </>
                      ) : formData.tech_operations1 == 2 ? (
                        <>
                          <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                            <table className="w-full text-[18px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b w-[70%]">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {currency.symbol} {result?.tech_answer1}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b w-[70%]">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Math.round(result?.tech_answer2).toFixed(
                                      2
                                    )}{" "}
                                    %
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="w-full my-3">
                            <p id="line">{result?.tech_line}</p>
                          </div>

                          <div className="w-full my-3">
                            <div className="w-full md:w-[60%] lg:w-[60%] mx-auto">
                              <Bar data={dataChart} options={options} />
                            </div>
                          </div>
                        </>
                      ) : null}
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

export default ROASCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import {
  useGetSingleCalculatorDetailsMutation,
  useNPVCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const NpvCalculator = () => {
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
    tech_initial: Number(10000),
    tech_discount: Number(50),
    tech_year: [5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useNPVCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if it's an array field like "tech_year[3]"
    const match = name.match(/^(\w+)\[(\d+)\]$/);
    if (match) {
      const field = match[1]; // e.g., "tech_year"
      const index = parseInt(match[2]); // e.g., 3

      const updatedArray = [...formData[field]];
      updatedArray[index] = value;

      setFormData((prevData) => ({
        ...prevData,
        [field]: updatedArray,
      }));
    } else {
      // Normal field
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_initial ||
      !formData.tech_discount ||
      !formData.tech_year.length ||
      formData.tech_year.some(
        (val) => val === "" || val === null || val === undefined
      )
    ) {
      setFormError("Please fill in all fields.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_initial: formData.tech_initial,
        tech_discount: formData.tech_discount,
        tech_year: formData.tech_year,
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
      tech_initial: Number(10000),
      tech_discount: Number(50),
      tech_year: [5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000],
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

  const addYear = () => {
    setFormData((prev) => ({
      ...prev,
      tech_year: [...prev.tech_year, 0], // Add a new year with default value 0
    }));
  };

  const removeYear = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tech_year: prev.tech_year.filter((_, i) => i !== indexToRemove),
    }));
  };

  // chart js

  const labels = result?.tech_dataPoints?.map((item) => item.label) || [];
  const dataValues = result?.tech_dataPoints?.map((item) => item.y) || [];

  const datachart = {
    labels: labels,
    datasets: [
      {
        label: data?.payload?.tech_lang_keys[10], // e.g., "Yearly Value"
        data: dataValues,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: data?.payload?.tech_lang_keys[9], // e.g., "Chart Title"
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} ${currency.symbol}`;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: `${data?.payload?.tech_lang_keys[8]} (${currency.symbol})`, // e.g., "Amount (USD)"
        },
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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_initial" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_initial"
                    id="tech_initial"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_initial}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_discount" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_discount"
                    id="tech_discount"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_discount}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>
              <div className="col-span-12 ">
                <div className="grid grid-cols-12 mt-3  gap-4 add_year">
                  <div className="col-span-12 ">
                    <p className="col mx-3">
                      <strong>{data?.payload?.tech_lang_keys[3]}</strong>
                    </p>
                  </div>
                  {formData.tech_year.map((value, index) => (
                    <div className="col-span-6 relative" key={index}>
                      {/* Label and delete image in flex row */}
                      <div className="flex items-center justify-between mx-1 py-2">
                        <label htmlFor={`tech_year_${index}`} className="label">
                          {data?.payload?.tech_lang_keys["4"]} {index + 1}
                        </label>

                        {formData.tech_year.length > 1 && (
                          <img
                            src="/images/images_mix/belete_btn.png"
                            width="15"
                            height="20"
                            className="cursor-pointer ml-2"
                            alt="Delete"
                            onClick={() => removeYear(index)}
                          />
                        )}
                      </div>

                      {/* Input with unit */}
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          id={`tech_year_${index}`}
                          name={`tech_year[${index}]`}
                          className="input"
                          placeholder="413"
                          value={formData.tech_year[index]}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-12 text-end mt-3">
                <button
                  type="button"
                  onClick={addYear}
                  className="px-3 py-2 mx-1 addmore bg-[#2845F5] rounded-[10px] text-white font-semibold cursor-pointer"
                >
                  <span className="mr-1">+</span>
                  {data?.payload?.tech_lang_keys[5]}
                </button>
              </div>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%]  mt-2 overflow-auto">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[6]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {currency.symbol} {result?.tech_npv_ans}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[7]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {result?.tech_gross_return}%
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[8]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {currency.symbol} {result?.tech_net_cash_flow}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-12 text-center text-[20px] mt-4">
                        <div className="w-full max-w-4xl mx-auto">
                          <Bar data={datachart} options={options} />
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

export default NpvCalculator;

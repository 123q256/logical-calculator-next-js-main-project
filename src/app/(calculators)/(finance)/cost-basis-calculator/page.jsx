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
  useCostBasisCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CostBasisCalculator = () => {
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
    tech_stock: 80,
    tech_shares: [10, 20, 30, 15],
    tech_prices: [60, 70, 75, 15],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCostBasisCalculatorMutation();

  const handleChange = (e, index = null, type = null) => {
    const { name, value } = e.target;

    // Prefer React-provided index and type
    if (index !== null && type) {
      setFormData((prev) => {
        const updated = [...prev[`tech_${type}`]];
        updated[index] = value;
        return { ...prev, [`tech_${type}`]: updated };
      });
      return;
    }

    // Fallback: detect array format like "tech_year[0]" or "shares[1]"
    const match = name.match(/^(\w+)\[(\d+)\]$/);
    if (match) {
      const field = match[1]; // e.g., "tech_year"
      const idx = parseInt(match[2]); // e.g., 0

      const updatedArray = [...formData[field]];
      updatedArray[idx] = value;

      setFormData((prevData) => ({
        ...prevData,
        [field]: updatedArray,
      }));
    } else {
      // Handle normal field
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    // Reset result and error
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_stock ||
      !formData.tech_shares.length ||
      formData.tech_shares.some(
        (val) => val === "" || val === null || val === undefined
      ) ||
      !formData.tech_prices.length ||
      formData.tech_prices.some(
        (val) => val === "" || val === null || val === undefined
      )
    ) {
      setFormError("Please fill in all fields.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_stock: formData.tech_stock,
        tech_shares: formData.tech_shares,
        tech_prices: formData.tech_prices,
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
      tech_stock: 80,
      tech_shares: [10, 20, 30, 15],
      tech_prices: [60, 70, 75, 15],
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

  const addSharePrice = () => {
    setFormData((prev) => ({
      ...prev,
      tech_shares: [...prev.tech_shares, 0],
      tech_prices: [...prev.tech_prices, 0],
    }));
  };

  const removeSharePrice = (index) => {
    setFormData((prev) => {
      const newShares = [...prev.tech_shares];
      const newPrices = [...prev.tech_prices];
      newShares.splice(index, 1);
      newPrices.splice(index, 1);
      return {
        ...prev,
        tech_shares: newShares,
        tech_prices: newPrices,
      };
    });
  };

  // chart js
  const labels =
    result?.shares_values?.map(
      (_, i) => `${data?.payload?.tech_lang_keys[10]} ${i + 1}`
    ) || [];
  const dataValues = result?.prices_values || [];

  const datachart = {
    labels: labels,
    datasets: [
      {
        label: data?.payload?.tech_lang_keys[12], // e.g., "Prices"
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <div className="grid grid-cols-12 mt-3 gap-4">
                  <div className="col-span-12">
                    <label htmlFor="tech_stock" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_stock"
                        id="tech_stock"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_stock}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>

                  {formData.tech_shares.map((share, index) => (
                    <React.Fragment key={index}>
                      {/* Shares Input */}
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <div className="flex items-center justify-between mx-1 py-2">
                          <label htmlFor={`shares_${index}`} className="label">
                            {data?.payload?.tech_lang_keys[10]} {index + 1}{" "}
                            {data?.payload?.tech_lang_keys[11]}
                          </label>

                          {formData.tech_shares.length > 2 && (
                            <img
                              src="/images/images_mix/belete_btn.png"
                              width="15"
                              height="20"
                              className="cursor-pointer ml-2"
                              alt="Delete"
                              onClick={() => removeSharePrice(index)}
                            />
                          )}
                        </div>

                        <div className="w-full py-2 relative">
                          <input
                            type="number"
                            step="any"
                            name={`shares_${index}`}
                            id={`shares_${index}`}
                            className="input"
                            placeholder="50"
                            value={formData.tech_shares[index]}
                            onChange={(e) => handleChange(e, index, "shares")}
                          />
                        </div>
                      </div>

                      {/* Prices Input */}
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <div className="flex items-center justify-between mx-1 py-2">
                          <label htmlFor={`prices_${index}`} className="label">
                            {data?.payload?.tech_lang_keys[12]} {index + 1}{" "}
                            {data?.payload?.tech_lang_keys[11]}
                          </label>
                        </div>

                        <div className="w-full py-2 relative">
                          <input
                            type="number"
                            step="any"
                            name={`prices_${index}`}
                            id={`prices_${index}`}
                            className="input"
                            placeholder="50"
                            value={formData.tech_prices[index]}
                            onChange={(e) => handleChange(e, index, "prices")}
                          />
                          <span className="text-blue input_unit">
                            {currency.symbol}
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}

                  {/* Add Row Button */}
                  <div className="col-span-12 text-end mt-3">
                    <button
                      type="button"
                      className="px-3 py-2 mx-1 addmore bg-[#2845F5] text-white rounded-[30px] cursor-pointer"
                      onClick={addSharePrice}
                    >
                      <span>+</span> {data?.payload?.tech_lang_keys[7]}
                    </button>
                  </div>
                </div>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[8]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol}
                                {result?.tech_cost_basis}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {" "}
                                  {result?.tech_stock_profit <= 0
                                    ? "Stock Loss"
                                    : "Stock Profit"}{" "}
                                  {result?.tech_stock_profit <= 0 ? "-" : ""}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {currency.symbol}{" "}
                                {Math.abs(result?.tech_stock_profit)}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {result?.tech_percentage <= 0
                                    ? "Loss Percentage"
                                    : "Profit Percentage"}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol} {result?.tech_percentage}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[9]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol} {result?.total_shares}
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

export default CostBasisCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register the required components for Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

import {
  useGetSingleCalculatorDetailsMutation,
  useSalesTaxCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SalesTaxCalculator = () => {
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
    tech_vat: 30,
    tech_amount: 30,
    tech_method: "not", // add  not
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSalesTaxCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_vat || !formData.tech_amount || !formData.tech_method) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_vat: formData.tech_vat,
        tech_amount: formData.tech_amount,
        tech_method: formData.tech_method,
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
      tech_vat: 30,
      tech_amount: 37,
      tech_method: "not", // add  not
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

  const detail = {
    good: result?.tech_vatAmount,
    neutral: result?.tech_netBill,
  };

  const chartData = {
    labels: ["Sale Tax", "Net Price"],

    datasets: [
      {
        data: [detail.good, detail.neutral],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Chart",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[50%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 ">
                <label htmlFor="tech_amount" className="label">
                  {data?.payload?.tech_lang_keys["amount"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_amount"
                    id="tech_amount"
                    className="input mt-2"
                    aria-label="input"
                    value={formData.tech_amount}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_method" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method"
                    id="tech_method"
                    value={formData.tech_method}
                    onChange={handleChange}
                  >
                    <option value="add">
                      {data?.payload?.tech_lang_keys["add"]}
                    </option>
                    <option value="not">
                      {data?.payload?.tech_lang_keys["not"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2  col-span-2">
                <label htmlFor="tech_vat" className="label">
                  {data?.payload?.tech_lang_keys["sale_tax"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_vat"
                    id="tech_vat"
                    className="input"
                    aria-label="input"
                    value={formData.tech_vat}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
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
                    <div className="w-full bg-light-blue  rounded-lg mt-6">
                      <div className="lg:flex">
                        <div className="lg:w-1/2 w-full px-2 mt-4 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b w-7/10 font-bold">
                                  {data?.payload?.tech_lang_keys["your_sale"]}
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {currency.symbol} {result?.tech_vatAmount}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table className="w-full text-lg mt-4">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b w-7/10 font-bold">
                                  Sale Tax Detail
                                </td>
                                <td className="py-2 border-b w-7/10"></td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-7/10 font-bold">
                                  {data?.payload?.tech_lang_keys["net_price"]}
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {currency.symbol}{" "}
                                  {formData?.tech_method == "add"
                                    ? formData?.tech_amount
                                    : result?.tech_netBill}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-7/10 font-bold">
                                  {data?.payload?.tech_lang_keys["sale_tax"]}
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol} {result?.tech_vatAmount}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-7/10 font-bold">
                                  {data?.payload?.tech_lang_keys["sale_tax"]}{" "}
                                  (%)
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {currency.symbol} {formData?.tech_vat}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-7/10 font-bold">
                                  {data?.payload?.tech_lang_keys["gross_price"]}
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {currency.symbol}{" "}
                                  {formData?.tech_method == "add"
                                    ? formData?.tech_amount
                                    : result?.tech_netBill}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="lg:w-1/2 w-full mt-4 overflow-auto">
                          <div className="w-full flex justify-center items-cener">
                            <div>
                              <Pie data={chartData} options={options} />
                            </div>
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

export default SalesTaxCalculator;

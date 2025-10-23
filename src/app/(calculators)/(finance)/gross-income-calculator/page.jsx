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

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useGrossIncomeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GrossIncomeCalculator = () => {
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
    tech_type: "Salary",
    tech_pay_frequency: "Daily",
    tech_filer_status: "single",
    tech_pay_method: "Per-Period",
    tech_amount: "10000",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGrossIncomeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_type == "Salary") {
      if (
        !formData.tech_type ||
        !formData.tech_pay_frequency ||
        !formData.tech_filer_status ||
        !formData.tech_pay_method ||
        !formData.tech_amount
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_type ||
        !formData.tech_pay_frequency ||
        !formData.tech_filer_status ||
        !formData.tech_amount
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_pay_frequency: formData.tech_pay_frequency,
        tech_filer_status: formData.tech_filer_status,
        tech_pay_method: formData.tech_pay_method,
        tech_amount: formData.tech_amount,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_type: "Salary",
      tech_pay_frequency: "Daily",
      tech_filer_status: "single",
      tech_pay_method: "Per-Period",
      tech_amount: "10000",
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

  const getLangText = () => {
    const keys = data?.payload?.tech_lang_keys || [];
    switch (result?.tech_pay_frequency) {
      case "Daily":
        return keys[5];
      case "Weekly":
        return keys[6];
      case "Bi-Weekly":
        return keys[7];
      case "Semi-Monthly":
        return keys[8];
      case "Monthly":
        return keys[9];
      case "Quarterly":
        return keys[10];
      default:
        return "";
    }
  };

  const filerStatusMap = {
    single: 32,
    "married-jointly": 33,
    "married-separately": 34,
    head: 35,
  };

  const detail = {
    good: result?.tech_net_income_per,
    neutral: result?.tech_net_tax_per,
    bad: result?.tech_bad,
  };

  const chartData = {
    labels: ["Take Home", "Tax"],

    datasets: [
      {
        data: [detail.good, detail.neutral, detail.bad],
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

          <div className="lg:w-[60%] md:w-[85%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type"
                    id="tech_type"
                    value={formData.tech_type}
                    onChange={handleChange}
                  >
                    <option value="Salary">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="Bonus">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_pay_frequency" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_pay_frequency"
                    id="tech_pay_frequency"
                    value={formData.tech_pay_frequency}
                    onChange={handleChange}
                  >
                    <option value="Daily">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="Weekly">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="Bi-Weekly">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="Semi-Monthly">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="Monthly">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="Quarterly">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_filer_status" className="label">
                  {data?.payload?.tech_lang_keys["31"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_filer_status"
                    id="tech_filer_status"
                    value={formData.tech_filer_status}
                    onChange={handleChange}
                  >
                    <option value="single">
                      {data?.payload?.tech_lang_keys["32"]}
                    </option>
                    <option value="married-jointly">
                      {data?.payload?.tech_lang_keys["33"]}
                    </option>
                    <option value="married-separately">
                      {data?.payload?.tech_lang_keys["34"]}
                    </option>
                    <option value="head">
                      {data?.payload?.tech_lang_keys["35"]}
                    </option>
                  </select>
                </div>
              </div>

              {formData?.tech_type == "Salary" && (
                <div className="space-y-2 pay_method">
                  <label htmlFor="tech_pay_method" className="label">
                    {data?.payload?.tech_lang_keys["11"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_pay_method"
                      id="tech_pay_method"
                      value={formData.tech_pay_method}
                      onChange={handleChange}
                    >
                      <option value="Per-Period">
                        {data?.payload?.tech_lang_keys["12"]}
                      </option>
                      <option value="Per-Year">
                        {data?.payload?.tech_lang_keys["13"]}
                      </option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="tech_amount" className="label">
                  {data?.payload?.tech_lang_keys["14"]}:
                </label>
                <input
                  type="number"
                  step="any"
                  name="tech_amount"
                  id="tech_amount"
                  className="input my-2"
                  aria-label="input"
                  placeholder="50"
                  value={formData.tech_amount}
                  onChange={handleChange}
                />
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3 px-2 text-[16px] overflow-auto">
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="py-2 border-b">
                              <strong>
                                {data?.payload?.tech_lang_keys[21]}
                              </strong>
                              <sub>
                                {
                                  data?.payload?.tech_lang_keys[
                                    filerStatusMap[result?.tech_filer_status]
                                  ]
                                }
                              </sub>
                            </td>
                            <td className="py-2 border-b">
                              <strong>
                                {data?.payload?.tech_lang_keys[22]} (%)
                              </strong>
                            </td>
                            <td className="py-2 border-b">
                              <strong>{getLangText()}</strong>
                            </td>
                            <td className="py-2 border-b">
                              <strong>
                                {data?.payload?.tech_lang_keys[23]}
                              </strong>
                            </td>
                          </tr>

                          <tr>
                            <td className="py-2 border-b">
                              {formData?.tech_type === "Salary"
                                ? data?.payload?.tech_lang_keys[24]
                                : data?.payload?.tech_lang_keys[25]}
                            </td>
                            <td className="py-2 border-b"></td>
                            <td className="py-2 border-b">
                              <strong>
                                {currency.symbol} {result?.tech_per_frequency}
                              </strong>
                            </td>
                            <td className="py-2 border-b">
                              <strong>
                                {currency.symbol} {result?.tech_total_amount}
                              </strong>
                            </td>
                          </tr>

                          <tr>
                            <td className="py-2 border-b">
                              {data?.payload?.tech_lang_keys[26]}
                            </td>
                            <td className="py-2 border-b">
                              {result?.tech_tax_per}%
                            </td>
                            <td className="py-2 border-b">
                              <strong>
                                {currency.symbol}{" "}
                                {result?.tech_tax_amount_frequency}
                              </strong>
                            </td>
                            <td className="py-2 border-b">
                              <strong>
                                {currency.symbol}{" "}
                                {result?.tech_tax_amount_yearly}
                              </strong>
                            </td>
                          </tr>

                          <tr>
                            <td className="py-2 border-b">
                              {data?.payload?.tech_lang_keys[27]}
                            </td>
                            <td className="py-2 border-b">
                              {result?.tech_secrity_per}%
                            </td>
                            <td className="py-2 border-b">
                              <strong>
                                {currency.symbol}{" "}
                                {result?.tech_secrity_amount_frequency}
                              </strong>
                            </td>
                            <td className="py-2 border-b">
                              <strong>
                                {currency.symbol}{" "}
                                {result?.tech_secrity_amount_yearly}
                              </strong>
                            </td>
                          </tr>

                          <tr>
                            <td className="py-2 border-b">
                              {data?.payload?.tech_lang_keys[28]}
                            </td>
                            <td className="py-2 border-b">
                              {result?.tech_medicare_per}%
                            </td>
                            <td className="py-2 border-b">
                              <strong>
                                {currency.symbol}{" "}
                                {result?.tech_medicare_amount_frequency}
                              </strong>
                            </td>
                            <td className="py-2 border-b">
                              <strong>
                                {currency.symbol}{" "}
                                {result?.tech_medicare_amount_yearly}
                              </strong>
                            </td>
                          </tr>

                          <tr>
                            <td className="py-2 border-b">
                              {formData?.tech_type === "Salary"
                                ? data?.payload?.tech_lang_keys[29]
                                : data?.payload?.tech_lang_keys[30]}
                            </td>
                            <td className="py-2 border-b"></td>
                            <td className="py-2 border-b">
                              {currency.symbol}{" "}
                              <strong>
                                {result?.tech_net_frequency_amount}
                              </strong>
                            </td>
                            <td className="py-2 border-b">
                              {currency.symbol}{" "}
                              <strong>{result?.tech_yearly_net_income}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="mt-3">
                        <p className="my-2">
                          {getLangText()} {currency.symbol}{" "}
                          <strong>{result?.tech_net_frequency_amount}</strong>
                        </p>
                      </div>

                      <div className="w-full flex justify-center items-cener">
                        <div>
                          <Pie data={chartData} options={options} />
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

export default GrossIncomeCalculator;

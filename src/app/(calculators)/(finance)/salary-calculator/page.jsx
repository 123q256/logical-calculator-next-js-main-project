"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useSalaryCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SalaryCalculator = () => {
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
    tech_salary: "15",
    tech_per: "Hourly",
    tech_hours: "40",
    tech_days: "1",
    tech_holidays: "12",
    tech_vacation: "15",
    tech_are: "1",
    tech_tax: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSalaryCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_salary ||
      !formData.tech_per ||
      !formData.tech_hours ||
      !formData.tech_days ||
      !formData.tech_holidays ||
      !formData.tech_vacation ||
      !formData.tech_are
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_salary: formData.tech_salary,
        tech_per: formData.tech_per,
        tech_hours: formData.tech_hours,
        tech_days: formData.tech_days,
        tech_holidays: formData.tech_holidays,
        tech_vacation: formData.tech_vacation,
        tech_are: formData.tech_are,
        tech_tax: formData.tech_tax,
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
      tech_salary: "15",
      tech_per: "Hourly",
      tech_hours: "40",
      tech_days: "1",
      tech_holidays: "12",
      tech_vacation: "15",
      tech_are: "1",
      tech_tax: "",
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

          <div className="w-full lg:w-8/12 mx-auto overflow-hidden">
            <div className="flex flex-wrap justify-center">
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="px-2 lg:pe-4 mt-0 lg:mt-2">
                  <label htmlFor="tech_salary" className="label">
                    {data?.payload?.tech_lang_keys["salary_amount"]}:
                  </label>
                  <div className="relative  w-full">
                    <input
                      type="number"
                      step="any"
                      name="tech_salary"
                      id="tech_salary"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_salary}
                      onChange={handleChange}
                    />
                    <span className="text-blue input_unit">
                      {currency.symbol}
                    </span>
                  </div>
                </div>
                <div className="px-2 lg:ps-4 mt-0 lg:mt-2">
                  <label htmlFor="tech_per" className="label">
                    {data?.payload?.tech_lang_keys["per"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_per"
                      id="tech_per"
                      value={formData.tech_per}
                      onChange={handleChange}
                    >
                      <option value="Hourly">Hourly</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-Weekly">Bi-Weekly</option>
                      <option value="Semi-Monthly">Semi-Monthly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annual">Annual</option>
                    </select>
                  </div>
                </div>
                <div className="px-2 lg:pe-4 mt-0 lg:mt-2">
                  <label htmlFor="tech_hours" className="label">
                    {data?.payload?.tech_lang_keys["hours_per"]}:
                  </label>
                  <div className="relative  w-full">
                    <input
                      type="number"
                      step="any"
                      name="tech_hours"
                      id="tech_hours"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_hours}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="px-2 lg:ps-4 mt-0 lg:mt-2">
                  <label htmlFor="tech_days" className="label">
                    {data?.payload?.tech_lang_keys["days_per"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_days"
                      id="tech_days"
                      value={formData.tech_days}
                      onChange={handleChange}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                    </select>
                  </div>
                </div>
                <div className="px-2 lg:pe-4 mt-0 lg:mt-2">
                  <label htmlFor="tech_holidays" className="label">
                    {data?.payload?.tech_lang_keys["holidays_per"]}:
                  </label>
                  <div className="relative  w-full">
                    <input
                      type="number"
                      step="any"
                      name="tech_holidays"
                      id="tech_holidays"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_holidays}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="px-2 lg:ps-4 mt-0 lg:mt-2">
                  <label htmlFor="tech_vacation" className="label">
                    {data?.payload?.tech_lang_keys["vacation_days"]}:
                  </label>
                  <div className="relative  w-full">
                    <input
                      type="number"
                      step="any"
                      name="tech_vacation"
                      id="tech_vacation"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_vacation}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-10/12 mx-auto overflow-hidden">
                <p className="py-2 mx-2">Income Taxes (Optional)</p>
              </div>
              <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-2 mt-4">
                <div className="px-2 lg:pe-4 mt-0 lg:mt-2">
                  <label htmlFor="tech_are" className="label">
                    Salary Amount are:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_are"
                      id="tech_are"
                      value={formData.tech_are}
                      onChange={handleChange}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </div>
                </div>
                <div className="px-2 lg:ps-4 mt-0 lg:mt-2">
                  <label htmlFor="tech_tax" className="label">
                    Income Tax (%)
                  </label>
                  <div className="relative  w-full">
                    <input
                      type="number"
                      step="any"
                      name="tech_tax"
                      id="tech_tax"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_tax}
                      onChange={handleChange}
                    />
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg md:p-4 lg:p-4 flex items-center justify-center">
                    <div className="w-full col-12  lg:p-3 md:p-3 rounded-lg mt-3">
                      <div className="col font-s-14">
                        {formData.tech_are == 2 && formData.tech_tax && (
                          <div className="col">
                            <p className="col-span-12 mt-3 font-bold text-xl text-gray-900">
                              <strong>Before Tax</strong>
                            </p>
                            <div className="overflow-x-auto">
                              <table className="min-w-full  shadow-lg rounded-lg border border-gray-200">
                                <thead>
                                  <tr className="bg_black text_green">
                                    <th
                                      rowSpan="2"
                                      className="py-4 px-6 text-left font-semibold border-b border-gray-200"
                                    >
                                      <strong>Periodicity</strong>
                                    </th>
                                    <th
                                      colspan="2"
                                      className="py-4 px-6 text-left font-semibold border-b border-gray-200"
                                    >
                                      <strong>Holidays & Vacation Days</strong>
                                    </th>
                                  </tr>
                                  <tr className="bg_black text_green">
                                    <th className="py-3 px-6 text-left font-semibold border-b border-gray-200">
                                      <strong>
                                        {
                                          data?.payload?.tech_lang_keys[
                                            "unadjust"
                                          ]
                                        }
                                      </strong>
                                    </th>
                                    <th className="py-3 px-6 text-left font-semibold border-b border-gray-200">
                                      <strong>Adjusted</strong>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {data?.payload?.tech_lang_keys["hourly"]}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_Hourly / result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_a_Hourly / result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {data?.payload?.tech_lang_keys["daily"]}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_Daily / result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_a_Daily / result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {data?.payload?.tech_lang_keys["weekly"]}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_Week / result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_a_Week / result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "bi_weekly"
                                        ]
                                      }
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_Bi_week / result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_a_Bi_week /
                                          result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "sami_monthly"
                                        ]
                                      }
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_Sami_month /
                                          result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_a_Sami_month /
                                          result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {data?.payload?.tech_lang_keys["monthly"]}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_Monthly / result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_a_Monthly /
                                          result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {data?.payload?.tech_lang_keys["quat"]}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_Quarterly /
                                          result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_a_Quarterly /
                                          result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {data?.payload?.tech_lang_keys["annual"]}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_Yearly / result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      $
                                      {Number(
                                        result?.tech_a_Yearly / result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        <div className="col">
                          <p className="col-span-12 mt-3 font-bold text-xl text-gray-900">
                            <strong>
                              {formData.tech_tax &&
                                (formData.tech_are == 1
                                  ? "Before Tax"
                                  : "After Tax")}
                            </strong>
                          </p>
                          <div className="overflow-x-auto">
                            <table className="min-w-full  shadow-lg rounded-lg border border-gray-200">
                              <thead>
                                <tr className="bg_black text_green">
                                  <th
                                    rowSpan="2"
                                    className="py-4 px-6 text-left font-semibold border-b border-gray-200"
                                  >
                                    <strong>Periodicity</strong>
                                  </th>
                                  <th
                                    colspan="2"
                                    className="py-4 px-6 text-left font-semibold border-b border-gray-200"
                                  >
                                    <strong>Holidays & Vacation Days</strong>
                                  </th>
                                </tr>
                                <tr className="bg_black text_green">
                                  <th className="py-3 px-6 text-left font-semibold border-b border-gray-200">
                                    <strong>
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "unadjust"
                                        ]
                                      }
                                    </strong>
                                  </th>
                                  <th className="py-3 px-6 text-left font-semibold border-b border-gray-200">
                                    <strong>Adjusted</strong>
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                <tr className="hover:bg-gray-100">
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {data?.payload?.tech_lang_keys["hourly"]}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_Hourly).toFixed(2)}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_a_Hourly).toFixed(2)}
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {data?.payload?.tech_lang_keys["daily"]}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_Daily).toFixed(2)}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_a_Daily).toFixed(2)}
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {data?.payload?.tech_lang_keys["weekly"]}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_Week).toFixed(2)}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_a_Week).toFixed(2)}
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {data?.payload?.tech_lang_keys["bi_weekly"]}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_Bi_week).toFixed(2)}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_a_Bi_week).toFixed(2)}
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {
                                      data?.payload?.tech_lang_keys[
                                        "sami_monthly"
                                      ]
                                    }
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_Sami_month).toFixed(2)}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_a_Sami_month).toFixed(
                                      2
                                    )}
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {data?.payload?.tech_lang_keys["monthly"]}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_Monthly).toFixed(2)}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_a_Monthly).toFixed(2)}
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {data?.payload?.tech_lang_keys["quat"]}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_Quarterly).toFixed(2)}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_a_Quarterly).toFixed(
                                      2
                                    )}
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {data?.payload?.tech_lang_keys["annual"]}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_Yearly).toFixed(2)}
                                  </td>
                                  <td className="py-4 px-6 border-b text-gray-700">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_a_Yearly).toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {formData.tech_are == 1 && formData.tech_tax && (
                          <div className="col mt-3">
                            <p className="text-lg font-bold mb-4">
                              <strong>After Tax </strong>
                            </p>
                            <div className="overflow-x-auto">
                              <table className="min-w-full  shadow-lg rounded-lg border border-gray-200">
                                <thead className="bg_black text_green ">
                                  <tr>
                                    <th
                                      rowSpan="2"
                                      className="py-4 px-6 text-left font-semibold border-b border-gray-200"
                                    >
                                      Periodicity
                                    </th>
                                    <th
                                      colspan="2"
                                      className="py-4 px-6 text-left font-semibold border-b border-gray-200"
                                    >
                                      Holidays & Vacation Days
                                    </th>
                                  </tr>
                                  <tr className="bg_black text_green">
                                    <th className="py-3 px-6 text-left font-semibold border-b border-gray-200">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "unadjust"
                                        ]
                                      }
                                    </th>
                                    <th className="py-3 px-6 text-left font-semibold border-b border-gray-200">
                                      Adjusted
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className=" divide-y divide-gray-200">
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {data?.payload?.tech_lang_keys["hourly"]}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_Hourly -
                                          result?.tech_Hourly * result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_a_Hourly -
                                          result?.tech_a_Hourly *
                                            result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {data?.payload?.tech_lang_keys["daily"]}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_Daily -
                                          result?.tech_Daily * result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_a_Daily -
                                          result?.tech_a_Daily *
                                            result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {data?.payload?.tech_lang_keys["weekly"]}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_Week -
                                          result?.tech_Week * result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_a_Week -
                                          result?.tech_a_Week * result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "bi_weekly"
                                        ]
                                      }
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_Bi_week -
                                          result?.tech_Bi_week *
                                            result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_a_Bi_week -
                                          result?.tech_a_Bi_week *
                                            result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "sami_monthly"
                                        ]
                                      }
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_Sami_month -
                                          result?.tech_Sami_month *
                                            result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_a_Sami_month -
                                          result?.tech_a_Sami_month *
                                            result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {data?.payload?.tech_lang_keys["monthly"]}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_Monthly -
                                          result?.tech_Monthly *
                                            result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_a_Monthly -
                                          result?.tech_a_Monthly *
                                            result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {data?.payload?.tech_lang_keys["quat"]}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_Quarterly -
                                          result?.tech_Quarterly *
                                            result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_a_Quarterly -
                                          result?.tech_a_Quarterly *
                                            result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-gray-100">
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {data?.payload?.tech_lang_keys["annual"]}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_Yearly -
                                          result?.tech_Yearly * result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 border-b text-gray-700">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_a_Yearly -
                                          result?.tech_a_Yearly *
                                            result?.tech_tax
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
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

export default SalaryCalculator;

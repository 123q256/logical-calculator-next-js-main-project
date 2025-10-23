"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useMonthlyIncomeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MonthlyIncomeCalculator = () => {
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
    tech_pay: "1",
    tech_first: "50",
    tech_second: "40",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMonthlyIncomeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_pay == 1 || formData.tech_pay == 2) {
      if (!formData.tech_pay || !formData.tech_first || !formData.tech_second) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (!formData.tech_pay || !formData.tech_first) {
        setFormError("Please fill in field");
        return;
      }
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_pay: formData.tech_pay,
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
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
      tech_pay: "1",
      tech_first: "50",
      tech_second: "40",
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_pay" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_pay"
                    id="tech_pay"
                    value={formData.tech_pay}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="7">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 " id="f_input">
                <label htmlFor="tech_first" className="label">
                  <label htmlFor="tech_second" className="label">
                    {
                      formData.tech_pay == 1
                        ? data?.payload?.tech_lang_keys["9"]
                        : formData.tech_pay == 2
                        ? data?.payload?.tech_lang_keys["19"]
                        : formData.tech_pay == 3
                        ? data?.payload?.tech_lang_keys["21"]
                        : formData.tech_pay == 4
                        ? data?.payload?.tech_lang_keys["22"]
                        : formData.tech_pay == 5
                        ? data?.payload?.tech_lang_keys["23"]
                        : formData.tech_pay == 6
                        ? data?.payload?.tech_lang_keys["24"]
                        : data?.payload?.tech_lang_keys["25"] // fallback for tech_pay == 3
                    }
                  </label>
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_first"
                    id="tech_first"
                    className="input "
                    aria-label="input"
                    placeholder="50"
                    value={formData.tech_first}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>

              {(formData.tech_pay == 1 || formData.tech_pay == 2) && (
                <div className="space-y-2 relative" id="s_input">
                  <label htmlFor="tech_second" className="label">
                    {
                      formData.tech_pay == 1
                        ? data?.payload?.tech_lang_keys["10"]
                        : formData.tech_pay == 2
                        ? data?.payload?.tech_lang_keys["20"]
                        : data?.payload?.tech_lang_keys["30"] // fallback for tech_pay == 3
                    }
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_second"
                      id="tech_second"
                      className="input"
                      aria-label="input"
                      placeholder="50"
                      value={formData.tech_second}
                      onChange={handleChange}
                    />
                    <span className="text-blue input_unit">
                      {currency.symbol}
                    </span>
                  </div>
                </div>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center ">
                    <div className="w-full md:w-[80%] bg-light-blue rounded-lg mt-3">
                      <div className="w-full mt-2 overflow-auto">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b border-[#99EA48] w-1/2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[11]}
                                </strong>
                              </td>
                              <td className="py-2 border-b border-[#99EA48]">
                                {currency.symbol} {result?.tech_monthly_income}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b border-[#99EA48] w-1/2">
                                {data?.payload?.tech_lang_keys[12]}
                              </td>
                              <td className="py-2 border-b border-[#99EA48]">
                                <strong>
                                  {currency.symbol} {result?.tech_hourly_income}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b border-[#99EA48] w-1/2">
                                {data?.payload?.tech_lang_keys[13]}
                              </td>
                              <td className="py-2 border-b border-[#99EA48]">
                                <strong>
                                  {currency.symbol} {result?.tech_daily_income}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b border-[#99EA48] w-1/2">
                                {data?.payload?.tech_lang_keys[14]}
                              </td>
                              <td className="py-2 border-b border-[#99EA48]">
                                <strong>
                                  {currency.symbol} {result?.tech_weekly_income}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b border-[#99EA48] w-1/2">
                                {data?.payload?.tech_lang_keys[15]}
                              </td>
                              <td className="py-2 border-b border-[#99EA48]">
                                <strong>
                                  {currency.symbol}{" "}
                                  {result?.tech_bi_weekly_income}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b border-[#99EA48] w-1/2">
                                {data?.payload?.tech_lang_keys[16]}
                              </td>
                              <td className="py-2 border-b border-[#99EA48]">
                                <strong>
                                  {currency.symbol}{" "}
                                  {result?.tech_sami_monthly_income}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b border-[#99EA48] w-1/2">
                                {data?.payload?.tech_lang_keys[17]}
                              </td>
                              <td className="py-2 border-b border-[#99EA48]">
                                <strong>
                                  {currency.symbol}{" "}
                                  {result?.tech_quarterly_income}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b border-[#99EA48] w-1/2">
                                {data?.payload?.tech_lang_keys[18]}
                              </td>
                              <td className="py-2 border-b border-[#99EA48]">
                                <strong>
                                  {currency.symbol} {result?.tech_annual_income}
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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

export default MonthlyIncomeCalculator;

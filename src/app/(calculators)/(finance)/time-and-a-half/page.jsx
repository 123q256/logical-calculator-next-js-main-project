"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTimeAndHalfCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TimeAndAHalfCalculator = () => {
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
    tech_normal_pay: "15",
    tech_normal_time: "0",
    tech_over_time: "50",
    tech_multiplier: "1.5",
    tech_pay_period: "52",
    tech_currency: "$",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTimeAndHalfCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_normal_pay ||
      !formData.tech_normal_time ||
      !formData.tech_over_time ||
      !formData.tech_multiplier ||
      !formData.tech_pay_period ||
      !formData.tech_currency
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_normal_pay: formData.tech_normal_pay,
        tech_normal_time: formData.tech_normal_time,
        tech_over_time: formData.tech_over_time,
        tech_multiplier: formData.tech_multiplier,
        tech_pay_period: formData.tech_pay_period,
        tech_currency: formData.tech_currency,
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
      tech_normal_pay: "15",
      tech_normal_time: "0",
      tech_over_time: "50",
      tech_multiplier: "1.5",
      tech_pay_period: "52",
      tech_currency: "$",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[85%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2  md:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_normal_pay" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <input
                  type="number"
                  step="any"
                  name="tech_normal_pay"
                  id="tech_normal_pay"
                  className="input my-2"
                  aria-label="input"
                  placeholder="413"
                  value={formData.tech_normal_pay}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_normal_time" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <input
                  type="number"
                  step="any"
                  name="tech_normal_time"
                  id="tech_normal_time"
                  className="input my-2"
                  aria-label="input"
                  placeholder="0"
                  value={formData.tech_normal_time}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_over_time" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <input
                  type="number"
                  step="any"
                  name="tech_over_time"
                  id="tech_over_time"
                  className="input my-2"
                  aria-label="input"
                  placeholder="0"
                  value={formData.tech_over_time}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_multiplier" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_multiplier"
                    id="tech_multiplier"
                    value={formData.tech_multiplier}
                    onChange={handleChange}
                  >
                    <option value="1.5">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_pay_period" className="label">
                  Pay Period:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_pay_period"
                    id="tech_pay_period"
                    value={formData.tech_pay_period}
                    onChange={handleChange}
                  >
                    <option value="52">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="26">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="24">
                      {data?.payload?.tech_lang_keys["18"]}
                    </option>
                    <option value="12">
                      {data?.payload?.tech_lang_keys["19"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_currency" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_currency"
                    id="tech_currency"
                    value={formData.tech_currency}
                    onChange={handleChange}
                  >
                    <option value="$">$</option>
                    <option value="£">£</option>
                    <option value="€">€</option>
                    <option value="¥">¥</option>
                  </select>
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%] mt-2 overflow-auto">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {result?.tech_multiplier === 1.5 &&
                                    data?.payload?.tech_lang_keys[8]}
                                  {result?.tech_multiplier === 2 &&
                                    data?.payload?.tech_lang_keys[20]}
                                  {result?.tech_multiplier === 3 &&
                                    data?.payload?.tech_lang_keys[22]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_currency}
                                {parseFloat(result?.tech_half || 0).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                        <table className="w-full text-[18px]">
                          <tbody>
                            {result?.tech_over_time > 0 && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  {data?.payload?.tech_lang_keys[7]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_currency}{" "}
                                    {parseFloat(
                                      result?.tech_total || 0
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                            )}

                            {result?.tech_normal_time > 0 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    {data?.payload?.tech_lang_keys[9]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {result?.tech_currency}{" "}
                                      {parseFloat(
                                        result?.tech_standered_pay || 0
                                      ).toFixed(2)}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    {data?.payload?.tech_lang_keys[10]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {result?.tech_currency}{" "}
                                      {parseFloat(
                                        result?.tech_Regular_Pay_per_Year || 0
                                      ).toFixed(2)}
                                    </strong>
                                  </td>
                                </tr>
                              </>
                            )}

                            {result?.tech_multiplier > 0 && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  {data?.payload?.tech_lang_keys[11]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_currency}{" "}
                                    {parseFloat(
                                      result?.tech_Overtime_Pay_per_Year || 0
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                            )}

                            {result?.tech_normal_time > 0 && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  {data?.payload?.tech_lang_keys[12]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_currency}{" "}
                                    {parseFloat(
                                      result?.tech_Total_Pay_per_Year || 0
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                            )}
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

export default TimeAndAHalfCalculator;

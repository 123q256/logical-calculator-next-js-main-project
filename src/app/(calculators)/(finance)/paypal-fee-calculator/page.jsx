"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePayPalFeeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PayPalFeeCalculator = () => {
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
    tech_x: 500,
    tech_rate: "5", // 1 2 3 4 5 6 7 8 9 10
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePayPalFeeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x || !formData.tech_rate) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_rate: formData.tech_rate,
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
      tech_x: 500,
      tech_rate: "5", // 1 2 3 4 5 6 7 8 9 10
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

          <div className="lg:w-[50%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["x"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x"
                    id="tech_x"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_x}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_rate" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_rate"
                    id="tech_rate"
                    value={formData.tech_rate}
                    onChange={handleChange}
                  >
                    <optgroup label={data?.payload?.tech_lang_keys["dom"]}>
                      <option value="0">
                        2.9% + $.30 ({data?.payload?.tech_lang_keys["online"]})
                      </option>
                      <option value="1">
                        2.7% + $.30 ({data?.payload?.tech_lang_keys["store"]})
                      </option>
                      <option value="2">
                        2.2% + $.30 ({data?.payload?.tech_lang_keys["non"]})
                      </option>
                      <option value="3">
                        5% + $.05 ({data?.payload?.tech_lang_keys["micro"]})
                      </option>
                    </optgroup>

                    <optgroup label={data?.payload?.tech_lang_keys["inter"]}>
                      <option value="4">
                        4.4% + $.30 ({data?.payload?.tech_lang_keys["online"]})
                      </option>
                      <option value="5">
                        4.2% + $.30 ({data?.payload?.tech_lang_keys["store"]})
                      </option>
                      <option value="6">
                        3.7% + $.30 ({data?.payload?.tech_lang_keys["non"]})
                      </option>
                      <option value="7">
                        6.5% + $.05 ({data?.payload?.tech_lang_keys["micro"]})
                      </option>
                    </optgroup>

                    <optgroup label={data?.payload?.tech_lang_keys["mob"]}>
                      <option value="8">
                        2.7% ({data?.payload?.tech_lang_keys["swip"]})
                      </option>
                      <option value="9">
                        3.5% + $.15 ({data?.payload?.tech_lang_keys["key"]})
                      </option>
                    </optgroup>

                    <optgroup label={data?.payload?.tech_lang_keys["vir"]}>
                      <option value="10">3.1% + $.30</option>
                    </optgroup>
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

                  <div className="rounded-lg  flex items-center">
                    <div className="w-full md:w-[60%] bg-light-blue  rounded-lg mt-6">
                      <div className="w-full mt-4 overflow-auto">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 w-3/4">
                                <strong>
                                  {data?.payload?.tech_lang_keys["want"]}{" "}
                                  {formData?.tech_x} {currency.symbol}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-3/4">
                                <strong>
                                  {data?.payload?.tech_lang_keys["ask_for"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol} {result?.tech_send}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-3/4">
                                <strong>
                                  {data?.payload?.tech_lang_keys["s_fee"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol} {result?.tech_fee1}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full mt-4">
                        <table className="w-full text-lg">
                          <tbody>
                            <tr>
                              <td className="py-2 w-3/4">
                                <strong>
                                  {data?.payload?.tech_lang_keys["ask"]}{" "}
                                  {formData?.tech_x} {currency.symbol}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-3/4">
                                <strong>
                                  {data?.payload?.tech_lang_keys["get"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol} {result?.tech_receive}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-3/4">
                                <strong>
                                  {data?.payload?.tech_lang_keys["s_fee"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol} {result?.tech_fee}
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

export default PayPalFeeCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useProratedrentCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

// Helper function to format date
const formatDate = (dateStr, format = "full") => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const options =
    format === "month"
      ? { month: "long" }
      : { year: "numeric", month: "short", day: "2-digit" };

  return date.toLocaleDateString("en-US", options);
};

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ProratedRentCalculator = () => {
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
    tech_date: "2025-05-12",
    tech_rent: "1500",
    tech_bill_on: "3",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useProratedrentCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_date || !formData.tech_rent || !formData.tech_bill_on) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_date: formData.tech_date,
        tech_rent: formData.tech_rent,
        tech_bill_on: formData.tech_bill_on,
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
      tech_date: "2025-05-12",
      tech_rent: "1500",
      tech_bill_on: "3",
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
            <div className="grid grid-cols-12  lg:gap-4 md:gap-4 gap-1">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_date" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="date"
                    name="tech_date"
                    id="tech_date"
                    className="input my-2"
                    value={formData.tech_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_rent" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_rent"
                    id="tech_rent"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_rent}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_rent" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <select
                  className="input"
                  aria-label="select"
                  name="tech_bill_on"
                  id="tech_bill_on"
                  value={formData.tech_bill_on}
                  onChange={handleChange}
                >
                  {/* Dynamically render 1 to 31 */}
                  {Array.from({ length: 31 }, (_, i) => {
                    const val = i + 1;
                    return (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    );
                  })}
                </select>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full py-2">
                        <div className="w-full md:w-[60%] lg:w-[60%] text-[16px]">
                          {result?.tech_res === 1 && (
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td width="50%" className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_pror).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {formatDate(result?.tech_date)} -{" "}
                                    {formatDate(result?.tech_end_date)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="pb-2 pt-3">
                                    {formatDate(result?.tech_date, "month")}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["5"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_d}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["6"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_days_in_mon}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[7]} /{" "}
                                    {data?.payload?.tech_lang_keys[8]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_per_day).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[4]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_pror).toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          )}

                          {result?.tech_res === 2 && (
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td width="50%" className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol}{" "}
                                    {Number(
                                      result?.tech_pror + result?.tech_pror1
                                    ).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {formatDate(result?.tech_date)} -{" "}
                                    {formatDate(result?.tech_end_date)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="pb-2 pt-3">
                                    {formatDate(result?.tech_date, "month")}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["5"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_d}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["6"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_days_in_mon}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[7]} /{" "}
                                    {data?.payload?.tech_lang_keys[8]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_per_day).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[4]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_pror).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="pb-2 pt-3">
                                    {formatDate(result?.tech_end_date, "month")}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["5"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_d1}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["6"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_days_in_mon1}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[7]} /{" "}
                                    {data?.payload?.tech_lang_keys[8]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_per_day1).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[4]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_pror1).toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          )}
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

export default ProratedRentCalculator;

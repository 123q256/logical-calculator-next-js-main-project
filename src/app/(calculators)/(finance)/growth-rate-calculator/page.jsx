"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useGrowthRateCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GrowthRateCalculator = () => {
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
    tech_operation: "1", //  1 2
    tech_present_val: "2400",
    tech_past_val: "1200",
    tech_time_val: "2400",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGrowthRateCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_operation == 1) {
      if (
        !formData.tech_operation ||
        !formData.tech_present_val ||
        !formData.tech_past_val
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_operation ||
        !formData.tech_present_val ||
        !formData.tech_past_val ||
        !formData.tech_time_val
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operation: formData.tech_operation,
        tech_present_val: formData.tech_present_val,
        tech_past_val: formData.tech_past_val,
        tech_time_val: formData.tech_time_val,
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
      tech_operation: "1", //  1 2
      tech_present_val: "2400",
      tech_past_val: "1200",
      tech_time_val: "2400",
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 ">
                <label htmlFor="tech_operation" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_operation"
                    id="tech_operation"
                    value={formData.tech_operation}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 my-3">
                {formData.tech_operation == "1" && (
                  <p id="f_1">
                    <b>
                      {" "}
                      {data?.payload?.tech_lang_keys[1]} =
                      <span
                        className="fractionUpDown"
                        aria-label="fractionUpDown with sum over count"
                      >
                        <span className="num">Vpresent - Vpast </span>
                        <span className="visually-hidden"> / </span>
                        <span className="den">Vpast</span>
                      </span>
                    </b>
                  </p>
                )}
                {formData.tech_operation == "2" && (
                  <p className="" id="f_2">
                    <b>
                      {data?.payload?.tech_lang_keys[1]}
                      <sub>annual</sub> = (
                      <span
                        className="fractionUpDown"
                        aria-label="fractionUpDown with sum over count"
                      >
                        <span className="num">
                          V <sub> present </sub> - V <sub> past</sub>{" "}
                        </span>
                        <span className="visually-hidden"> / </span>
                        <span className="den">Vpast</span>
                      </span>
                      )
                      <span
                        className="fractionUpDown"
                        aria-label="fractionUpDown with sum over count"
                      >
                        <span className="num">1</span>
                        <span className="visually-hidden"> / </span>
                        <span className="den">t</span>
                      </span>
                      -1
                    </b>
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_present_val" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_present_val"
                    id="tech_present_val"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_present_val}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_past_val" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_past_val"
                    id="tech_past_val"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_past_val}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              {formData.tech_operation == "2" && (
                <div
                  className="col-span-12 md:col-span-6 lg:col-span-6 "
                  id="time_vals"
                >
                  <label htmlFor="tech_time_val" className="label">
                    {data?.payload?.tech_lang_keys["6"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_time_val"
                      id="tech_time_val"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_time_val}
                      onChange={handleChange}
                    />
                    <span className="input_unit">{currency.symbol}</span>
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      {result?.tech_operation == "1" && (
                        <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                          <table className="w-full font-s-18">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["7"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_growth_percent).toFixed(
                                    2
                                  )}{" "}
                                  %
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="mt-2"></div>
                        </div>
                      )}

                      {result?.tech_operation == "2" && (
                        <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                          <table className="w-full font-s-18">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["7"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_growth_percent).toFixed(
                                    2
                                  )}{" "}
                                  %
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="mt-2"></div>
                        </div>
                      )}
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

export default GrowthRateCalculator;

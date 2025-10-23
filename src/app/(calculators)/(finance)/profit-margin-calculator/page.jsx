"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useMarginCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MarginCalculator = () => {
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
    tech_method: "Gross",
    tech_x: Number(50),
    tech_y: Number(50),
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMarginCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_method || !formData.tech_x || !formData.tech_y) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method: formData.tech_method,
        tech_x: Number(formData.tech_x),
        tech_y: Number(formData.tech_y),
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
      tech_method: "Gross",
      tech_x: 50,
      tech_y: 50,
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["chose"]}:
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
                    <option value="Gross">
                      {data?.payload?.tech_lang_keys["g_m"]}
                    </option>
                    <option value="Net">
                      {data?.payload?.tech_lang_keys["n_p_m"]}
                    </option>
                    <option value="Operating">
                      {data?.payload?.tech_lang_keys["o_p_m"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 ">
                <label htmlFor="tech_x" className="label">
                  {formData.tech_method == "Gross"
                    ? data?.payload?.tech_lang_keys["cost"]
                    : formData.tech_method == "Net"
                    ? data?.payload?.tech_lang_keys["total_s"]
                    : data?.payload?.tech_lang_keys["o_i"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x"
                    id="tech_x"
                    className="input mt-2"
                    aria-label="input"
                    value={formData.tech_x}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="space-y-2 ">
                <label htmlFor="tech_y" className="label">
                  {formData.tech_method == "Gross"
                    ? data?.payload?.tech_lang_keys["rev"]
                    : formData.tech_method == "Net"
                    ? data?.payload?.tech_lang_keys["net_profit"]
                    : data?.payload?.tech_lang_keys["s_r"]}
                  {data?.payload?.tech_lang_keys["amount"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_y"
                    id="tech_y"
                    className="input "
                    aria-label="input"
                    value={formData.tech_y}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
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

                  <div className="rounded-lg  items-center ">
                    <div className="w-full md:w-[50%] bg-light-blue  rounded-lg mt-6">
                      <div className=" w-full mt-4 overflow-auto">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b w-7/10 font-bold">
                                {data?.payload?.tech_lang_keys["margin"]}
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_margin
                                  ? `${result.tech_margin}`
                                  : "0.0 %"}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-7/10 font-bold">
                                {data?.payload?.tech_lang_keys["profit"]}
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_profit
                                  ? `${result.tech_profit}`
                                  : "0.0 "}{" "}
                                {currency.symbol}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-7/10 font-bold">
                                {data?.payload?.tech_lang_keys["mark"]}
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_mark
                                  ? `${result.tech_mark}`
                                  : "0.0 %"}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-7/10 font-bold">
                                {data?.payload?.tech_lang_keys["o_margin"]}
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_operating
                                  ? `${result.tech_operating}`
                                  : "0.0 %"}
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

export default MarginCalculator;

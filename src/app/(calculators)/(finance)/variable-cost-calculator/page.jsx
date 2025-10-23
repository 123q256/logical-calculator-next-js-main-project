"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useVariableCostCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VariableCostCalculator = () => {
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
    tech_type: "average_cost", //  average_cost  variable_cost
    tech_cost: "1000",
    tech_output: "200",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVariableCostCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type || !formData.tech_cost || !formData.tech_output) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_cost: formData.tech_cost,
        tech_output: formData.tech_output,
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
      tech_type: "average_cost", //  average_cost  variable_cost
      tech_cost: "1000",
      tech_output: "200",
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

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <div className="w-full py-2 position-relative">
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
                      <option value="average_cost">
                        Average Variable Cost
                      </option>
                      <option value="variable_cost">Variable Costs</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_cost" className="label">
                  {formData.tech_type === "average_cost"
                    ? data?.payload?.tech_lang_keys["2"] + " (VC):"
                    : data?.payload?.tech_lang_keys["3"]}
                </label>

                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_cost"
                    id="tech_cost"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_cost}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_output" className="label">
                  {formData.tech_type === "average_cost"
                    ? data?.payload?.tech_lang_keys["4"] + " (VC):"
                    : data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_output"
                    id="tech_output"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_output}
                    onChange={handleChange}
                  />
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      {result?.tech_type == "average_cost" && (
                        <>
                          <div className="w-full md:w-[60%] lg:w-[60%]  mt-2">
                            <table className="w-full text-[18px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["6"]} (AVC)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {" "}
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_av_cost).toFixed(1)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-12 text-[16px]">
                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]}
                              </strong>
                            </p>
                            <p>
                              AvgCost<sub>variable</sub> =
                              <span
                                className="fractionUpDown"
                                aria-label="fractionUpDown with sum over count"
                              >
                                <span className="num">
                                  Cost <sub>variable</sub>
                                </span>
                                <span className="visually-hidden"> / </span>
                                <span className="den">
                                  Output <sub>total</sub>
                                </span>
                              </span>
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["8"]}
                            </p>
                            <p>
                              AvgCost<sub>variable</sub> =
                              <span
                                className="fractionUpDown"
                                aria-label="fractionUpDown with sum over count"
                              >
                                <span className="num">
                                  Cost <sub>variable</sub>
                                </span>
                                <span className="visually-hidden"> / </span>
                                <span className="den">
                                  Output <sub>total</sub>
                                </span>
                              </span>
                            </p>
                            <p>
                              AvgCost<sub>variable</sub> =
                              <span
                                className="fractionUpDown"
                                aria-label="fractionUpDown with sum over count"
                              >
                                <span className="num">
                                  {Number(result?.tech_cost).toFixed()}
                                </span>
                                <span className="visually-hidden"> / </span>
                                <span className="den">
                                  {Number(result?.tech_output).toFixed()}
                                </span>
                              </span>
                            </p>
                            <p className="mt-2">
                              AvgCost<sub>variable</sub>={" "}
                              <strong>
                                {currency.symbol}
                                {Number(result?.tech_av_cost).toFixed(4)}
                              </strong>
                            </p>
                          </div>
                        </>
                      )}
                      {result?.tech_type == "variable_cost" && (
                        <>
                          <div className="w-full md:w-[60%] lg:w-[60%]  mt-2">
                            <table className="w-full font-s-18">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["2"]} (AVC)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {" "}
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_v_cost).toFixed(1)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-12 font-s-16">
                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]}
                              </strong>
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["2"]} ={" "}
                              {data?.payload?.tech_lang_keys["3"]}-
                              {data?.payload?.tech_lang_keys["5"]}
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["8"]}
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["2"]} ={" "}
                              {data?.payload?.tech_lang_keys["3"]} -{" "}
                              {data?.payload?.tech_lang_keys["5"]}
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["2"]} ={" "}
                              {Number(result?.tech_cost).toFixed()} -{" "}
                              {Number(result?.tech_output).toFixed()}
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["2"]} ={" "}
                              <strong>
                                {Number(result?.tech_v_cost).toFixed(1)}{" "}
                                {currency.symbol}
                              </strong>
                            </p>
                          </div>
                        </>
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

export default VariableCostCalculator;

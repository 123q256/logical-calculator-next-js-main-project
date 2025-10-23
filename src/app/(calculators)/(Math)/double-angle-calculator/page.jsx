"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useDoubleAngleCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DoubleAngleCalculator = () => {
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
    tech_unit: "1",
    tech_angle: "45",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDoubleAngleCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_unit || !formData.tech_angle) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit: formData.tech_unit,
        tech_angle: formData.tech_angle,
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
      tech_unit: "1",
      tech_angle: "45",
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

  // result

  const degreeSymbol = "°";
  const angleLabel =
    result?.tech_unit === "1"
      ? `${result?.tech_angle}${degreeSymbol}`
      : result?.tech_unit === "2"
      ? `${result?.tech_angle} rad = ${result?.tech_deg}${degreeSymbol}`
      : `${result?.tech_angle} π = ${result?.tech_deg}${degreeSymbol}`;

  const sinValue = Math.round(Math.sin(result?.tech_red) * 100000) / 100000;
  const cosValue = Math.round(Math.cos(result?.tech_red) * 100000) / 100000;
  const tanValue = Math.round(Math.tan(result?.tech_red) * 100000) / 100000;

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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_unit"
                    id="tech_unit"
                    value={formData.tech_unit}
                    onChange={handleChange}
                  >
                    <option value="1">deg °</option>
                    <option value="2">rad</option>
                    <option value="3">3* π radD </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_angle" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_angle"
                    id="tech_angle"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_angle}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6 mt-10 text-center space-x-2">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b w-[60%]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["3"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_sin}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-[60%]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["4"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_cos}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-[60%]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_tan}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2 font-bold">Solution</p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["2"]} = {angleLabel}
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["3"]}
                          </p>
                          <p className="mt-2">sin(2θ) = 2·sin(θ)·cos(θ)</p>
                          <p className="mt-2">
                            sin(2 × {result?.tech_deg}
                            {degreeSymbol}) = 2·sin({result?.tech_deg}
                            {degreeSymbol})·cos({result?.tech_deg}
                            {degreeSymbol})
                          </p>
                          <p className="mt-2">
                            = 2 × {sinValue} × {cosValue}
                          </p>
                          <p className="mt-2">= {result?.tech_sin}</p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["4"]}
                          </p>
                          <p className="mt-2">cos(2θ) = 1 − 2·sin²(θ)</p>
                          <p className="mt-2">
                            cos(2 × {result?.tech_deg}
                            {degreeSymbol}) = 1 − 2·sin²({result?.tech_deg}
                            {degreeSymbol})
                          </p>
                          <p className="mt-2">= 1 − 2 × {sinValue}²</p>
                          <p className="mt-2">= {result?.tech_cos}</p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["5"]}
                          </p>
                          <p className="mt-2">
                            tan(2θ) ={" "}
                            <span className="inline-block">
                              <span className="block border-b text-center">
                                2·tan(θ)
                              </span>
                              <span className="block text-center">
                                1 − tan²(θ)
                              </span>
                            </span>
                          </p>

                          <p className="mt-2">
                            tan(2 × {result?.tech_deg}
                            {degreeSymbol}) ={" "}
                            <span className="inline-block">
                              <span className="block border-b text-center">
                                2·tan({result?.tech_deg}
                                {degreeSymbol})
                              </span>
                              <span className="block text-center">
                                1 − tan²({result?.tech_deg}
                                {degreeSymbol})
                              </span>
                            </span>
                          </p>

                          <p className="mt-2">
                            ={" "}
                            <span className="inline-block">
                              <span className="block border-b text-center">
                                2 × {tanValue}
                              </span>
                              <span className="block text-center">
                                1 − ({tanValue})²
                              </span>
                            </span>
                          </p>

                          <p className="mt-2">= {result?.tech_tan}</p>
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

export default DoubleAngleCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useGeometricMeanCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GeometricMeanCalculator = () => {
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
    tech_x: "20,23,23,12,1",
    tech_seprate: " ",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGeometricMeanCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_seprate: formData.tech_seprate,
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
      tech_x: "20,23,23,12,1",
      tech_seprate: " ",
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
  const product = (arr) => arr.reduce((acc, val) => acc * val, 1);
  const root = (value, count) => Math.pow(value, 1 / count);

  const isNegativeNote = result?.tech_textline;
  const numbers = result?.tech_numbers || [];
  const sorted = [...numbers].sort((a, b) => b - a);
  const evenNumbers = numbers.filter((val) => val % 2 === 0);
  const oddNumbers = numbers.filter((val) => val % 2 !== 0);

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  mt-3  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 20, 30, 15 e.g. 20 50 56 88"
                    value={
                      formData.tech_x || "e.g. 20, 30, 15  , e.g. 20 50 56 88"
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2 hidden">
                <label htmlFor="tech_seprate" className="label">
                  &nbsp;
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_seprate"
                    id="tech_seprate"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_seprate}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="text-center">
                          <p className="text-[18px] ">
                            <strong>
                              {data?.payload?.tech_lang_keys["9"]}
                            </strong>
                          </p>

                          <p className="text-[32px] bg-[#2845F5] px-3 py-2 rounded-lg inline-block my-3">
                            <strong className="text-white">
                              {result?.tech_geo !== undefined
                                ? result.tech_geo
                                : Math.pow(
                                    result?.tech_tnumbers?.reduce(
                                      (a, b) => a * b,
                                      1
                                    ),
                                    1 / result?.tech_count
                                  ).toFixed(4)}
                            </strong>
                          </p>

                          {result?.tech_textline && (
                            <p>
                              Note: The negative values are detected in the
                              input. All values will be treated as percentages
                              (e.g., -20 will be treated as -20%).
                            </p>
                          )}

                          <p className="w-full mt-2 text-[18px]">
                            <strong className="text-blue-800">
                              {data?.payload?.tech_lang_keys["sol"]}:
                            </strong>
                          </p>

                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["9"]} ={" "}
                            <sup>{result?.tech_count}</sup>√{result?.tech_sol}
                          </p>

                          {result?.tech_geo != undefined ? (
                            <>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys["9"]} ={" "}
                                <sup>{result?.tech_count}</sup>√
                                {result?.tech_sol1}
                              </p>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys["9"]} ={" "}
                                <sup>{result?.tech_count}</sup>√
                                {result?.tech_pro}
                              </p>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys["9"]} ={" "}
                                {Math.pow(
                                  result?.tech_pro,
                                  1 / result?.tech_count
                                ).toFixed(4)}
                              </p>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys["9"]} = (
                                {(
                                  (Math.pow(
                                    result?.tech_pro,
                                    1 / result?.tech_count
                                  ) -
                                    1) *
                                  100
                                ).toFixed(4)}
                                %)
                              </p>

                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys["9"]} ={" "}
                                {result?.tech_geo}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys["9"]} ={" "}
                                <sup>{result?.tech_count}</sup>√
                                {result?.tech_tnumbers?.reduce(
                                  (a, b) => a * b,
                                  1
                                )}
                              </p>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys["9"]} ={" "}
                                {Math.pow(
                                  result?.tech_tnumbers?.reduce(
                                    (a, b) => a * b,
                                    1
                                  ),
                                  1 / result?.tech_count
                                ).toFixed(4)}
                              </p>
                            </>
                          )}
                        </div>

                        <div className="w-full mt-2 overflow-auto">
                          <strong className="text-blue-800 text-[18px]">
                            {data?.payload?.tech_lang_keys["other_key"]}
                          </strong>
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["10"]}:
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_tnumbers?.join(", ")}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["11"]}:
                                </td>
                                <td className="py-2 border-b">
                                  {[...result?.tech_tnumbers]
                                    ?.sort((a, b) => b - a)
                                    .join(", ")}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["12"]}:
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_tnumbers
                                    ?.filter((num) => num % 2 === 0)
                                    .join(", ")}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["13"]}:
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_tnumbers
                                    ?.filter((num) => num % 2 !== 0)
                                    .join(", ")}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["14"]}:
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_tnumbers?.reduce(
                                    (a, b) => a + b,
                                    0
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["15"]}:
                                </td>
                                <td className="py-2 border-b">
                                  {Math.max(...result?.tech_tnumbers)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["16"]}:
                                </td>
                                <td className="py-2 border-b">
                                  {Math.min(...result?.tech_tnumbers)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["17"]}:
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_tnumbers?.length}
                                </td>
                              </tr>
                            </tbody>
                          </table>
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

export default GeometricMeanCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  usePercentErrorCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PercentErrorCalculator = () => {
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
    actualValue: "10000", // Actual Value (measured value)
    originalValue: "100", // Original Value (expected value)
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePercentErrorCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.actualValue || !formData.originalValue) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,

        actualValue: formData.actualValue,
        originalValue: formData.originalValue,
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
      actualValue: "10000", // Actual Value (measured value)
      originalValue: "100", // Original Value (expected value)
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
            <div className="grid grid-cols-12 mt-3   gap-2 ">
              <div className="col-span-12">
                <label htmlFor="actualValue" className="label">
                  {data?.payload?.tech_lang_keys["accept"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="actualValue"
                    id="actualValue"
                    min="1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.actualValue}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="originalValue" className="label">
                  {data?.payload?.tech_lang_keys["observe"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="originalValue"
                    id="originalValue"
                    min="1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.originalValue}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[60%] lg:w-[60%] mt-2 overflow-auto">
                          <table className="w-full  text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b w-3/5">
                                  <strong>
                                    {
                                      data?.payload?.tech_lang_keys[
                                        "percent_err"
                                      ]
                                    }
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.errorPercentage !== undefined
                                    ? Math.abs(result.errorPercentage)
                                    : "0.0"}
                                  %
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-3/5">
                                  <strong>
                                    {
                                      data?.payload?.tech_lang_keys[
                                        "non_absolute"
                                      ]
                                    }
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.errorPercentage !== undefined
                                    ? result.errorPercentage
                                    : "0.0"}
                                  %
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-3/5">
                                  <strong>
                                    {
                                      data?.payload?.tech_lang_keys[
                                        "absolute_err"
                                      ]
                                    }
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.errorPercentage !== undefined
                                    ? Math.abs(
                                        formData?.originalValue -
                                          formData?.actualValue
                                      )
                                    : "0.0"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full  text-[18px] md:text-[22px] overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["cal"]}
                            </strong>
                          </p>

                          <p className="mt-2">
                            <InlineMath math="PE = \frac{OV - AV}{AV} \times 100" />
                          </p>

                          <p className="mt-2">
                            <InlineMath
                              math={`PE = \\frac{${formData?.originalValue} - ${formData?.actualValue}}{${formData?.actualValue}} \\times 100`}
                            />
                          </p>

                          <p className="mt-2">
                            <InlineMath
                              math={`PE = \\frac{${
                                formData?.originalValue - formData?.actualValue
                              }}{${formData?.actualValue}} \\times 100`}
                            />
                          </p>

                          <p className="mt-2">
                            <InlineMath
                              math={`PE = ${(
                                ((formData?.originalValue -
                                  formData?.actualValue) /
                                  formData?.actualValue) *
                                100
                              ).toFixed(2)}\\%`}
                            />
                          </p>

                          <p className="mt-2">
                            <InlineMath
                              math={`PE = ${result?.errorPercentage}\\%`}
                            />
                          </p>
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

export default PercentErrorCalculator;

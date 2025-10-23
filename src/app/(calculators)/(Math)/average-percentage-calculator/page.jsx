"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useAveragePercentageCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AveragePercentageCalculator = () => {
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
    tech_same_sample: "yes", // yes  no
    tech_percentage: [1, 2],
    tech_sample: [1, 2],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAveragePercentageCalculatorMutation();

  // Update percentage or sample value for a specific index
  const handleInputChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
    setResult(null);
    setFormError(null);
  };

  // Update tech_same_sample dropdown
  const handleSameSampleChange = (e) => {
    setFormData((prev) => ({ ...prev, tech_same_sample: e.target.value }));
    setResult(null);
    setFormError(null);
  };

  // Add a new entry (only if less than some max, e.g., 10)
  const addEntry = () => {
    if (formData.tech_percentage.length >= 10) return; // Optional limit
    setFormData((prev) => ({
      ...prev,
      tech_percentage: [...prev.tech_percentage, ""],
      tech_sample: [...prev.tech_sample, ""],
    }));
  };

  // Delete an entry by index (minimum 1 entry)
  const deleteEntry = (index) => {
    if (formData.tech_percentage.length <= 1) return;
    setFormData((prev) => {
      const newPercentages = prev.tech_percentage.filter((_, i) => i !== index);
      const newSamples = prev.tech_sample.filter((_, i) => i !== index);
      return {
        ...prev,
        tech_percentage: newPercentages,
        tech_sample: newSamples,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_same_sample) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_same_sample: formData.tech_same_sample,
        tech_percentage: formData.tech_percentage,
        tech_sample: formData.tech_sample,
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
      tech_same_sample: "yes", // yes  no
      tech_percentage: [1, 2],
      tech_sample: [1, 2],
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

  const percentage = result?.tech_percentage || [];
  const percents_sum = result?.tech_percents_sum || 0;
  const sample = result?.tech_sample || [];
  const samples_sum = result?.tech_samples_sum || 0;
  const avgResult = result?.tech_result || 0;
  const techSameSample = formData?.tech_same_sample;

  let numerator, denominator, step1;

  if (techSameSample == "yes") {
    numerator = percentage.map((p) => `${p}\\%`).join(" + ");
    denominator = samples_sum;
  } else {
    numerator = result?.tech_percents_show || "";
    denominator = sample.join(" + ");
    step1 = result?.tech_percents_show1 || "";
  }

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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 inputs">
                <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-12">
                    <label htmlFor="tech_same_sample" className="label">
                      Are all sample sizes the same?:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_same_sample"
                        id="tech_same_sample"
                        value={formData.tech_same_sample}
                        onChange={handleSameSampleChange}
                      >
                        <option value="no">
                          {data?.payload?.tech_lang_keys["no"]}
                        </option>
                        <option value="yes">
                          {data?.payload?.tech_lang_keys["yes"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {formData.tech_percentage.map((_, index) => (
                  <div
                    className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4 entry mt-3"
                    key={index}
                  >
                    <div className="col-span-12 text-[14px] flex  justify-between">
                      <div className="">
                        <strong>
                          {data?.payload?.tech_lang_keys["entry"]} # {index + 1}
                        </strong>
                      </div>
                      {/* Delete Button */}
                      {formData.tech_percentage.length > 1 && (
                        <div className="flex items-center">
                          <img
                            src="/images/delete_btn.png"
                            alt="remove img"
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => deleteEntry(index)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Percentage Input */}
                    <div
                      className={`${
                        formData.tech_same_sample === "yes"
                          ? "col-span-12"
                          : "col-span-6"
                      } percentage`}
                    >
                      <label
                        htmlFor={`tech_percentage_${index}`}
                        className="label"
                      >
                        {data?.payload?.tech_lang_keys["percent"]}:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          name={`tech_percentage_${index}`}
                          id={`tech_percentage_${index}`}
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_percentage[index]}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "tech_percentage",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Sample Input */}
                    {formData.tech_same_sample === "no" && (
                      <div className="col-span-6 sample">
                        <label
                          htmlFor={`tech_sample_${index}`}
                          className="label"
                        >
                          {data?.payload?.tech_lang_keys["sample"]}:
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name={`tech_sample_${index}`}
                            id={`tech_sample_${index}`}
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_sample[index]}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "tech_sample",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Button */}
                <div className="mt-4 flex  justify-end">
                  <button
                    type="button"
                    onClick={addEntry}
                    className="bg-[#2845F5] hover:bg-blue-600 cursor-pointer text-white px-4 py-2 rounded"
                  >
                    Add More
                  </button>
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="60%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["avg_per"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {Math.round(avgResult)}%
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="w-full text-[16px] overflow-auto">
                        <p className="mt-3">
                          <strong>
                            {data?.payload?.tech_lang_keys["solution"]}:
                          </strong>
                        </p>

                        {/* First KaTeX expression */}
                        <BlockMath
                          math={`\\dfrac{${numerator}}{${denominator}}`}
                        />

                        {/* Step1 only when samples are not same */}
                        {techSameSample === "no" && (
                          <BlockMath
                            math={`= \\dfrac{${step1}}{${samples_sum}}`}
                          />
                        )}

                        <BlockMath
                          math={`= \\dfrac{${percents_sum}\\%}{${samples_sum}}`}
                        />
                        <BlockMath math={`= ${Math.round(avgResult)}\\%`} />
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

export default AveragePercentageCalculator;

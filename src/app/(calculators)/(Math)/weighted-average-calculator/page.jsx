"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useWeightedAverageCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WeightedAverageCalculator = () => {
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
    tech_weight: [5, 8, 15, 53, 53, 51, 25, 56, 53, 50],
    tech_value: [6, 9, 18, 80, 67, 54, 28, 57, 54, 43],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWeightedAverageCalculatorMutation();

  const handleChange = (e, index, field) => {
    const { value } = e.target;
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;

    setFormData((prevData) => ({
      ...prevData,
      [field]: updatedArray,
    }));

    setResult(null);
    setFormError(null);
  };

  const addRow = () => {
    setFormData((prevData) => ({
      tech_weight: [...prevData.tech_weight, ""],
      tech_value: [...prevData.tech_value, ""],
    }));
  };

  const deleteRow = (index) => {
    const updatedWeights = [...formData.tech_weight];
    const updatedValues = [...formData.tech_value];

    updatedWeights.splice(index, 1);
    updatedValues.splice(index, 1);

    setFormData({
      tech_weight: updatedWeights,
      tech_value: updatedValues,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_weight || !formData.tech_value) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_weight: formData.tech_weight,
        tech_value: formData.tech_value,
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
      tech_weight: [5, 8, 15, 53, 53, 51, 25, 56, 53, 50],
      tech_value: [6, 9, 18, 80, 67, 54, 28, 57, 54, 43],
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

  const v = result?.tech_v;
  const values = result?.tech_values || [];
  const weights = result?.tech_weights || [];

  let suming = 0;
  const weightedTerms = [];
  const weightTerms = [];
  const multipliedValues = [];

  for (let i = 0; i < v; i++) {
    weightedTerms.push(`(${weights[i]} \\times ${values[i]})`);
    weightTerms.push(weights[i]);
    multipliedValues.push(weights[i] * values[i]);
    suming += weights[i] * values[i];
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 flex items-center justify-center font-s-16 mb-2">
                <div>&nbsp;</div>
                <div className="px-2 w-full text-center">
                  <strong>{data?.payload?.tech_lang_keys["5"]}</strong>
                </div>
                <div className="px-2 w-full text-center">
                  <strong>{data?.payload?.tech_lang_keys["6"]}</strong>
                </div>
              </div>
              <div className="col-span-12">
                {formData.tech_weight.map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center mt-3"
                  >
                    <div className="label">
                      x<sub className="font-s-14">{i + 1}</sub>
                    </div>
                    <div className="px-2">
                      <input
                        type="number"
                        step="any"
                        name="tech_weight"
                        className="input my-2"
                        placeholder="00"
                        value={formData.tech_weight[i]}
                        onChange={(e) => handleChange(e, i, "tech_weight")}
                      />
                    </div>
                    <div className="px-2">
                      <input
                        type="number"
                        step="any"
                        name="tech_value"
                        className="input my-2"
                        placeholder="00"
                        value={formData.tech_value[i]}
                        onChange={(e) => handleChange(e, i, "tech_value")}
                      />
                    </div>
                    {formData.tech_weight.length > 1 && (
                      <img
                        src="/images/delete_btn.png"
                        alt="delete item"
                        className="h-4 w-4 cursor-pointer "
                        onClick={() => deleteRow(i)}
                      />
                    )}
                  </div>
                ))}

                <div className="col-span-12 text-end mt-3">
                  <button
                    type="button"
                    onClick={addRow}
                    className="px-3 py-2 mx-1 bg-[#2845F5] cursor-pointer text-white rounded-lg"
                  >
                    + Add Row
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["1"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(
                                    result?.tech_weighted_average
                                  ).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["2"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_weight_sum).toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px]  overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["3"]}
                            </strong>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["4"]}
                          </p>

                          {/* KaTeX equations */}
                          <div className="mt-2">
                            <BlockMath
                              math={
                                "\\bar{x} = \\frac{(x_1 \\times w_1) + (x_2 \\times w_2) + \\cdots + (x_n \\times w_n)}{w_1 + w_2 + \\cdots + w_n}"
                              }
                            />
                          </div>

                          <div className="mt-2">
                            <BlockMath
                              math={`\\bar{x} = \\frac{${weightedTerms.join(
                                " + "
                              )}}{${weightTerms.join(" + ")}}`}
                            />
                          </div>

                          <div className="mt-2">
                            <BlockMath
                              math={`\\bar{x} = \\frac{${multipliedValues.join(
                                " + "
                              )}}{${result?.tech_weight_sum}}`}
                            />
                          </div>

                          <div className="mt-2">
                            <BlockMath
                              math={`\\bar{x} = \\frac{${suming}}{${result?.tech_weight_sum}}`}
                            />
                          </div>

                          <div className="mt-2">
                            <BlockMath
                              math={`\\bar{x} = ${(
                                suming / result?.tech_weight_sum
                              ).toFixed(2)}`}
                            />
                          </div>
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

export default WeightedAverageCalculator;

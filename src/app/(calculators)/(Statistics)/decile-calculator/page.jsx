"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDecileCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DecileCalculator = () => {
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
    tech_x: "11, 12, 13, 14, 14, 15, 15, 17, 18, 19, 20, 9, 23",
    tech_decile: "9",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDecileCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x || !formData.tech_decile) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_decile: formData.tech_decile,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_x: "11, 12, 13, 14, 14, 15, 15, 17, 18, 19, 20, 9, 23",
      tech_decile: "9",
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
  const sortedData = result?.tech_ans_list || [];

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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  Enter Sample Data (Comma Separated):
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                    value={formData.tech_x || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_decile" className="label">
                  Decile (1, 2, ... or 9):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_decile"
                    id="tech_decile"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    min="1"
                    max="9"
                    value={formData.tech_decile}
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-center">
                        <p className="text-[18px] font-bold">Answer</p>
                        <p className="text-[25px] bg-[#2845F5] px-3 py-2 rounded-[10px] inline-block my-3">
                          <span className="text-white font-bold">
                            {result?.tech_main_ans}
                          </span>
                        </p>
                      </div>

                      <p className="w-full mt-3 text-[18px] font-bold text-blue">
                        Solution
                      </p>
                      <p className="w-full mt-2">
                        The sample data is as follows:
                      </p>

                      {/* Observation Table */}
                      <div className="w-full mt-2 overflow-auto">
                        <table className="w-full border-collapse">
                          <thead className="bg-[#2845F5] text-white">
                            <tr>
                              <td className="p-2 bordered text-center text-blue font-bold">
                                Observation
                              </td>
                              <td className="p-2 bordered text-center text-blue font-bold">
                                X
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedData.map((value, index) => (
                              <tr key={index} className="bg-white">
                                <td className="p-2 bordered text-center">
                                  {index + 1}
                                </td>
                                <td className="p-2 bordered text-center">
                                  {value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <p className="w-full mt-2">
                        We need to compute the sixth decile (D
                        <sub>{formData?.tech_decile}</sub>) based on the data
                        provided.
                      </p>

                      <p className="w-full mt-2">
                        You calculate the value of decile, we have to sort the
                        data in ascending order. For reference, follow the table
                        below:
                      </p>

                      {/* Sorted Data Table */}
                      <div className="w-full mt-2 overflow-auto">
                        <table className="w-full border-collapse">
                          <thead className="bg-[#2845F5] text-white">
                            <tr>
                              <td className="p-2 bordered text-center text-blue font-bold">
                                Position
                              </td>
                              <td className="p-2 bordered text-center text-blue font-bold">
                                X (Asc. Order)
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedData.map((value, index) => (
                              <tr key={index} className="bg-white">
                                <td className="p-2 bordered text-center">
                                  {index + 1}
                                </td>
                                <td className="p-2 bordered text-center">
                                  {value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="overflow-auto">
                        {/* Decile Formula */}
                        <p className="w-full mt-2">
                          Now we have to determine the rank of{" "}
                          {formData?.tech_decile} decile. It yields:
                        </p>
                        <div className="w-full mt-2 text-[18px] text-center">
                          <BlockMath
                            math={`\\text{Decile Position} = \\frac{(n + 1) \\cdot P}{100} = \\frac{(${result?.tech_total_values} + 1) \\cdot (${formData?.tech_decile}/10)}{100} = ${result?.tech_decile_pos}`}
                          />
                        </div>

                        {/* Interpolation or Direct Value */}
                        {Number.isFinite(result?.tech_decile_pos) &&
                        Math.floor(result?.tech_decile_pos) !==
                          result?.tech_decile_pos ? (
                          <>
                            <p className="w-full mt-2">
                              Since the position is not an integer,
                              interpolation is needed. The{" "}
                              {formData?.tech_decile}th decile is between
                              positions {result?.tech_floor_val} and{" "}
                              {result?.tech_ceil_val}.
                            </p>
                            <p className="w-full mt-2">
                              {result?.tech_list_floor_val} and{" "}
                              {result?.tech_list_ceil_val} are the values from
                              the sorted data.
                            </p>
                            <p className="w-full mt-2">
                              The difference {result?.tech_decile_pos} -{" "}
                              {result?.tech_floor_val} ={" "}
                              {result?.tech_floor_minus} gives us the proportion
                              of distance between values.
                            </p>
                            <p className="w-full mt-2 text-[18px] text-center">
                              <BlockMath
                                math={`D_{${formData?.tech_decile}} = ${result?.tech_list_floor_val} + ${result?.tech_floor_minus} \\cdot (${result?.tech_list_ceil_val} - ${result?.tech_list_floor_val}) = ${result?.tech_main_ans}`}
                              />
                            </p>
                            <p className="w-full mt-2">
                              Final Answer: D<sub>{formData?.tech_decile}</sub>{" "}
                              = {result?.tech_main_ans}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="w-full mt-2">
                              Since the position is an integer, the{" "}
                              {formData?.tech_decile}th decile corresponds to
                              value at position {result?.tech_decile_pos} in the
                              sorted data.
                            </p>
                            <p className="w-full mt-2">
                              Final Answer: D<sub>{formData?.tech_decile}</sub>{" "}
                              = {result?.tech_main_ans}
                            </p>
                          </>
                        )}
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

export default DecileCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useEigenvaluesCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EigenvalueCalculator = () => {
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
    tech_matrix: "5",
    tech_matrix_0_0: "1",
    tech_matrix_0_1: "1",
    tech_matrix_0_2: "1",
    tech_matrix_0_3: "1",
    tech_matrix_0_4: "1",
    tech_matrix_1_0: "2",
    tech_matrix_1_1: "9",
    tech_matrix_1_2: "3",
    tech_matrix_1_3: "2",
    tech_matrix_1_4: "5",
    tech_matrix_2_0: "1",
    tech_matrix_2_1: "1",
    tech_matrix_2_2: "2",
    tech_matrix_2_3: "2",
    tech_matrix_2_4: "1",
    tech_matrix_3_0: "0",
    tech_matrix_3_1: "2",
    tech_matrix_3_2: "6",
    tech_matrix_3_3: "7",
    tech_matrix_3_4: "4",
    tech_matrix_4_0: "1",
    tech_matrix_4_1: "1",
    tech_matrix_4_2: "1",
    tech_matrix_4_3: "8",
    tech_matrix_4_4: "2",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEigenvaluesCalculatorMutation();

  const matrixSize = Number(formData.tech_matrix);

  // Update form data dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  // Generate random values
  const generateRandomMatrix = () => {
    const updated = { tech_matrix: formData.tech_matrix };
    for (let i = 0; i < matrixSize; i++) {
      for (let j = 0; j < matrixSize; j++) {
        const key = `tech_matrix_${i}_${j}`;
        updated[key] = (Math.floor(Math.random() * 10) + 1).toString();
      }
    }
    setFormData(updated);
  };

  // Clear all input values
  const clearMatrix = () => {
    const cleared = { tech_matrix: formData.tech_matrix };
    for (let i = 0; i < matrixSize; i++) {
      for (let j = 0; j < matrixSize; j++) {
        const key = `tech_matrix_${i}_${j}`;
        cleared[key] = "";
      }
    }
    setFormData(cleared);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const matrixSize = Number(formData.tech_matrix); // e.g., 2, 3, 4, or 5

      // Build payload dynamically from inputs
      const matrixPayload = {
        tech_matrix: String(matrixSize),
      };

      for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
          const key = `tech_matrix_${i}_${j}`;
          matrixPayload[key] = Number(formData[key]) || 0; // Converts to number, defaults to 0
        }
      }

      const response = await calculateEbitCalculator(matrixPayload).unwrap();
      setResult(response);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err?.data?.error || "An error occurred");
      toast.error(err?.data?.error || "An error occurred");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_matrix: "5",
      tech_matrix_0_0: "1",
      tech_matrix_0_1: "1",
      tech_matrix_0_2: "1",
      tech_matrix_0_3: "1",
      tech_matrix_0_4: "1",
      tech_matrix_1_0: "2",
      tech_matrix_1_1: "9",
      tech_matrix_1_2: "3",
      tech_matrix_1_3: "2",
      tech_matrix_1_4: "5",
      tech_matrix_2_0: "1",
      tech_matrix_2_1: "1",
      tech_matrix_2_2: "2",
      tech_matrix_2_3: "2",
      tech_matrix_2_4: "1",
      tech_matrix_3_0: "0",
      tech_matrix_3_1: "2",
      tech_matrix_3_2: "6",
      tech_matrix_3_3: "7",
      tech_matrix_3_4: "4",
      tech_matrix_4_0: "1",
      tech_matrix_4_1: "1",
      tech_matrix_4_2: "1",
      tech_matrix_4_3: "8",
      tech_matrix_4_4: "2",
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

          <div className="lg:w-[80%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_matrix" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    name="tech_matrix"
                    id="tech_matrix"
                    value={formData.tech_matrix}
                    onChange={handleChange}
                  >
                    {[2, 3, 4, 5].map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-12 overflow-auto">
                <table className="md:w-full" width={420}>
                  <tbody>
                    {Array.from({ length: matrixSize }, (_, i) => (
                      <tr key={i}>
                        {Array.from({ length: matrixSize }, (_, j) => {
                          const key = `tech_matrix_${i}_${j}`;
                          return (
                            <td key={j}>
                              <div className="px-1 pt-2">
                                <input
                                  type="number"
                                  step="any"
                                  name={key}
                                  className="input my-2"
                                  placeholder="00"
                                  value={formData[key] || ""}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="col-span-12">
                <button
                  type="button"
                  onClick={generateRandomMatrix}
                  className="px-3 py-2 mt-1 mx-1 bg-[#2845F5] cursor-pointer text-white rounded-lg"
                >
                  {data?.payload?.tech_lang_keys["2"]}
                </button>
                <button
                  type="button"
                  onClick={clearMatrix}
                  className="px-3 py-2 mt-1 mx-1 bg-[#2845F5] cursor-pointer text-white rounded-lg"
                >
                  {data?.payload?.tech_lang_keys["3"]}
                </button>
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
                      <div className="row">
                        <div className="w-full text-[16px] overflow-auto">
                          <div className="mt-2 text-[20px]">
                            <BlockMath math={result?.tech_eigvals || ""} />
                          </div>

                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["5"]}:
                            </strong>
                          </p>
                          {formData?.tech_matrix == "2" ? (
                            <>
                              <p>
                                {data?.payload?.tech_lang_keys["6"]}&nbsp;
                                <InlineMath math={`\\lambda`} />
                                &nbsp;{data?.payload?.tech_lang_keys["7"]}
                              </p>

                              <BlockMath math={`${result?.tech_d || ""}`} />

                              <p>{data?.payload?.tech_lang_keys["8"]}</p>

                              <BlockMath
                                math={`${result?.tech_dtrmnt || ""}`}
                              />

                              <p>{data?.payload?.tech_lang_keys["9"]}</p>

                              <BlockMath math={`${result?.tech_dtrmnt} = 0`} />

                              <p>
                                {data?.payload?.tech_lang_keys["10"]} (
                                {data?.payload?.tech_lang_keys["4"]})
                              </p>

                              <BlockMath
                                math={`\\lambda_1 = ${(
                                  result?.tech_l1 || ""
                                ).replace(/frac/g, "dfrac")}`}
                              />
                              <BlockMath
                                math={`\\lambda_2 = ${(
                                  result?.tech_l2 || ""
                                ).replace(/frac/g, "dfrac")}`}
                              />
                              <BlockMath
                                math={`(\\lambda_1, \\lambda_2) = ${
                                  result?.tech_eigvals || ""
                                }`}
                              />
                            </>
                          ) : formData?.tech_matrix == "3" ? (
                            <>
                              <p>
                                {data?.payload?.tech_lang_keys["6"]}&nbsp;
                                <InlineMath math={`\\lambda`} />
                                &nbsp;{data?.payload?.tech_lang_keys["7"]}
                              </p>

                              <BlockMath math={result?.tech_d || ""} />

                              <p>{data?.payload?.tech_lang_keys["8"]}</p>

                              <BlockMath math={result?.tech_dtrmnt || ""} />

                              <p>{data?.payload?.tech_lang_keys["9"]}</p>

                              <BlockMath math={`${result?.tech_dtrmnt} = 0`} />

                              <p>
                                {data?.payload?.tech_lang_keys["10"]} (
                                {data?.payload?.tech_lang_keys["4"]})
                              </p>

                              <BlockMath
                                math={`\\lambda_1 = ${(
                                  result?.tech_l1 || ""
                                ).replace(/frac/g, "dfrac")}`}
                              />
                              <BlockMath
                                math={`\\lambda_2 = ${(
                                  result?.tech_l2 || ""
                                ).replace(/frac/g, "dfrac")}`}
                              />
                              <BlockMath
                                math={`\\lambda_3 = ${(
                                  result?.tech_l3 || ""
                                ).replace(/frac/g, "dfrac")}`}
                              />

                              <BlockMath
                                math={`(\\lambda_1, \\lambda_2, \\lambda_3) = ${
                                  result?.tech_eigvals || ""
                                }`}
                              />
                            </>
                          ) : formData?.tech_matrix == "4" ? (
                            <>
                              <p>
                                {data?.payload?.tech_lang_keys["6"]}&nbsp;
                                <InlineMath math={`\\lambda`} />
                                &nbsp;{data?.payload?.tech_lang_keys["7"]}
                              </p>

                              <BlockMath math={result?.tech_d || ""} />

                              <p>{data?.payload?.tech_lang_keys["8"]}</p>

                              <BlockMath math={result?.tech_dtrmnt || ""} />

                              <p>{data?.payload?.tech_lang_keys["9"]}</p>

                              <BlockMath math={`${result?.tech_dtrmnt} = 0`} />

                              <p>
                                {data?.payload?.tech_lang_keys["10"]} (
                                {data?.payload?.tech_lang_keys["4"]})
                              </p>

                              {result?.tech_l1 && (
                                <BlockMath
                                  math={`\\lambda_1 = ${(
                                    result.tech_l1 || ""
                                  ).replace(/frac/g, "dfrac")}`}
                                />
                              )}
                              {result?.tech_l2 && (
                                <BlockMath
                                  math={`\\lambda_2 = ${(
                                    result.tech_l2 || ""
                                  ).replace(/frac/g, "dfrac")}`}
                                />
                              )}
                              {result?.tech_l3 && (
                                <BlockMath
                                  math={`\\lambda_3 = ${(
                                    result.tech_l3 || ""
                                  ).replace(/frac/g, "dfrac")}`}
                                />
                              )}
                              {result?.tech_l4 && (
                                <BlockMath
                                  math={`\\lambda_4 = ${(
                                    result.tech_l4 || ""
                                  ).replace(/frac/g, "dfrac")}`}
                                />
                              )}

                              {result?.tech_eigvals && (
                                <BlockMath
                                  math={`(\\lambda_1, \\lambda_2${
                                    result.tech_l3 ? ", \\lambda_3" : ""
                                  }${result.tech_l4 ? ", \\lambda_4" : ""}) = ${
                                    result.tech_eigvals
                                  }`}
                                />
                              )}
                            </>
                          ) : formData?.tech_matrix == "5" ? (
                            <>
                              <p>
                                {data?.payload?.tech_lang_keys["6"]}&nbsp;
                                <InlineMath math={`\\lambda`} />
                                &nbsp;{data?.payload?.tech_lang_keys["7"]}
                              </p>

                              <BlockMath math={result?.tech_d || ""} />

                              <p>{data?.payload?.tech_lang_keys["8"]}</p>
                              <BlockMath math={result?.tech_dtrmnt || ""} />

                              <p>{data?.payload?.tech_lang_keys["9"]}</p>
                              <BlockMath math={`${result?.tech_dtrmnt} = 0`} />

                              <p>
                                {data?.payload?.tech_lang_keys["10"]} (
                                {data?.payload?.tech_lang_keys["4"]})
                              </p>

                              {result?.tech_l1 && (
                                <BlockMath
                                  math={`\\lambda_1 = ${(
                                    result.tech_l1 || ""
                                  ).replace(/frac/g, "dfrac")}`}
                                />
                              )}
                              {result?.tech_l2 && (
                                <BlockMath
                                  math={`\\lambda_2 = ${(
                                    result.tech_l2 || ""
                                  ).replace(/frac/g, "dfrac")}`}
                                />
                              )}
                              {result?.tech_l3 && (
                                <BlockMath
                                  math={`\\lambda_3 = ${(
                                    result.tech_l3 || ""
                                  ).replace(/frac/g, "dfrac")}`}
                                />
                              )}
                              {result?.tech_l4 && (
                                <BlockMath
                                  math={`\\lambda_4 = ${(
                                    result.tech_l4 || ""
                                  ).replace(/frac/g, "dfrac")}`}
                                />
                              )}
                              {result?.tech_l5 && (
                                <BlockMath
                                  math={`\\lambda_5 = ${(
                                    result.tech_l5 || ""
                                  ).replace(/frac/g, "dfrac")}`}
                                />
                              )}

                              {result?.tech_eigvals && (
                                <BlockMath
                                  math={`(\\lambda_1, \\lambda_2${
                                    result.tech_l3 ? ", \\lambda_3" : ""
                                  }${result.tech_l4 ? ", \\lambda_4" : ""}${
                                    result.tech_l5 ? ", \\lambda_5" : ""
                                  }) = ${result.tech_eigvals}`}
                                />
                              )}
                            </>
                          ) : null}
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

export default EigenvalueCalculator;

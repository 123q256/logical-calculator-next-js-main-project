"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useInverseMatrixCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const InverseMatrixCalculator = () => {
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
    tech_dtrmn_slct_method: "3",
    tech_dtrmn_0_0: "1",
    tech_dtrmn_0_1: "1",
    tech_dtrmn_0_2: "9",
    tech_dtrmn_1_0: "2",
    tech_dtrmn_1_1: "5",
    tech_dtrmn_1_2: "1",
    tech_dtrmn_2_0: "1",
    tech_dtrmn_2_1: "2",
    tech_dtrmn_2_2: "7",
    tech_dtrmn_opts_method: "exp_col", //exp_col  exp_row
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useInverseMatrixCalculatorMutation();

  const matrixSize = Number(formData.tech_dtrmn_slct_method);

  // Update form data dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  // Generate random values
  const generateRandomMatrix = () => {
    const updated = {
      tech_dtrmn_slct_method: formData.tech_dtrmn_slct_method,
    };
    for (let i = 0; i < matrixSize; i++) {
      for (let j = 0; j < matrixSize; j++) {
        const key = `tech_dtrmn_${i}_${j}`;
        updated[key] = (Math.floor(Math.random() * 10) + 1).toString();
      }
    }
    setFormData(updated);
  };

  // Clear all input values
  const clearMatrix = () => {
    const cleared = { tech_dtrmn_slct_method: formData.tech_dtrmn_slct_method };
    for (let i = 0; i < matrixSize; i++) {
      for (let j = 0; j < matrixSize; j++) {
        const key = `tech_dtrmn_${i}_${j}`;
        cleared[key] = "";
      }
    }
    setFormData(cleared);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    try {
      const matrixSize = Number(formData.tech_dtrmn_slct_method);
      const tech_submit = formData.tech_submit;

      const matrixPayload = {
        tech_dtrmn_slct_method: String(matrixSize),
        tech_dtrmn_opts_method: formData.tech_dtrmn_opts_method || "exp_col",
        tech_submit: formData.tech_submit,
      };

      for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
          const key = `tech_dtrmn_${i}_${j}`;
          matrixPayload[key] = Number(formData[key]) || 0;
        }
      }

      const response = await calculateEbitCalculator(matrixPayload).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err?.data?.payload?.error);
      toast.error(err?.data?.payload?.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_dtrmn_slct_method: "3",
      tech_dtrmn_0_0: "1",
      tech_dtrmn_0_1: "1",
      tech_dtrmn_0_2: "9",
      tech_dtrmn_1_0: "2",
      tech_dtrmn_1_1: "5",
      tech_dtrmn_1_2: "1",
      tech_dtrmn_2_0: "1",
      tech_dtrmn_2_1: "2",
      tech_dtrmn_2_2: "7",
      tech_dtrmn_opts_method: "exp_col", //exp_col  exp_row
      tech_submit: "calculate",
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

  const renderMatrix = (matrix) => {
    if (!matrix || !Array.isArray(matrix)) return "";
    return matrix
      .map((row) => {
        if (!Array.isArray(row)) return "";
        return row.join(" & ");
      })
      .join(" \\\\ ");
  };

  const renderMatrixDet = (matrix) => {
    if (!matrix || !Array.isArray(matrix)) return "";
    return matrix
      .map((row) => {
        if (!Array.isArray(row)) return "";
        return row.join(" & ");
      })
      .join(" \\\\ ");
  };

  const renderSteps = () => {
    if (!result?.tech_swap_line || !Array.isArray(result.tech_swap_line)) {
      return null;
    }

    if (!result?.tech_swap || !Array.isArray(result.tech_swap)) {
      return null;
    }

    return result.tech_swap_line.map((line, i) => {
      const swapRow = result.tech_swap[i];
      if (!swapRow || !Array.isArray(swapRow)) {
        return null;
      }

      const matrixStr = swapRow
        .map((row) => {
          if (!Array.isArray(row)) return "";
          return row
            .map((val) => {
              const parts = val.toString().split(".");
              return parts.length === 2 ? Number(val).toFixed(3) : val;
            })
            .join(" & ");
        })
        .join(" \\\\ ");

      const columnCount = formData?.tech_dtrmn_slct_method;

      return (
        <div key={i} className="mt-3">
          <p dangerouslySetInnerHTML={{ __html: line }} />
          <BlockMath
            math={`\\left[\\begin{array}{${"c".repeat(
              columnCount
            )}|${"c".repeat(columnCount)}}${matrixStr} \\end{array}\\right]`}
          />
        </div>
      );
    });
  };

  // Helper function to safely render the fraction matrix
  const renderFractionMatrix = (matrix, determinant) => {
    if (!matrix || !Array.isArray(matrix)) return "";
    return matrix
      .map((row) => {
        if (!Array.isArray(row)) return "";
        return row
          .map((val) => `\\dfrac{${val}}{${determinant}}`)
          .join(" & ");
      })
      .join(" \\\\ ");
  };

  return (
    <Calculator
      isLoading={isLoading}
      data={data}
      links={[
        { name: "Home", path: "/" },
        {
          name: data?.payload?.tech_cal_cat,
          path: "/category/" + data?.payload?.tech_cal_cat,
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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto">
            <div className="grid grid-cols-12 mt-3 gap-1 md:gap-4 lg:gap-4">
              {/* Matrix Size Selection */}
              <div className="col-span-12">
                <label htmlFor="tech_dtrmn_slct_method" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    name="tech_dtrmn_slct_method"
                    id="tech_dtrmn_slct_method"
                    value={formData.tech_dtrmn_slct_method}
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

              {/* Matrix Input Table */}
              <div className="col-span-12 overflow-auto">
                <table className="w-full">
                  <tbody>
                    {Array.from({ length: matrixSize }, (_, i) => (
                      <tr key={i}>
                        {Array.from({ length: matrixSize }, (_, j) => {
                          const key = `tech_dtrmn_${i}_${j}`;
                          return (
                            <td key={j}>
                              <div className="md:px-1 pt-2">
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

              {/* Action Buttons */}
              <div className="col-span-12">
                <button
                  type="button"
                  onClick={generateRandomMatrix}
                  className="px-1 md:px-3 py-1 md:py-2 mt-1 mx-1 bg-[#2845F5] text-white rounded-lg"
                >
                  {data?.payload?.tech_lang_keys["2"]}
                </button>
                <button
                  type="button"
                  onClick={clearMatrix}
                  className="px-1 md:px-3 py-1 md:py-2 mt-1 mx-1 bg-[#2845F5] text-white rounded-lg"
                >
                  {data?.payload?.tech_lang_keys["3"]}
                </button>
              </div>

              {/* Optional Method Selection */}
              <div className="col-span-12">
                <label htmlFor="tech_dtrmn_opts_method" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    name="tech_dtrmn_opts_method"
                    id="tech_dtrmn_opts_method"
                    value={formData.tech_dtrmn_opts_method}
                    onChange={handleChange}
                  >
                    <option value="exp_col">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="exp_row">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                  </select>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 ">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3 overflow-auto">
                      {result?.tech_det === 0 ? (
                        <p className="mt-2 text-[18px] font-bold">
                          {result?.tech_inverse}
                        </p>
                      ) : (
                        <BlockMath
                          math={`\\begin{bmatrix} ${renderMatrix(
                            result?.tech_inverse
                          )} \\end{bmatrix}`}
                        />
                      )}

                      <div className="mt-3">
                        {data?.payload?.tech_lang_keys[8]}
                      </div>

                      {formData?.tech_dtrmn_opts_method === "exp_col" ? (
                        <>
                          <BlockMath
                            math={`\\text{Calculate } \\begin{bmatrix} ${renderMatrix(
                              result?.tech_zain
                            )} \\end{bmatrix}^{-1} \\text{${
                              data?.payload?.tech_lang_keys[9]
                            } Gauss-Jordan Elimination ${
                              data?.payload?.tech_lang_keys[10]
                            }}`}
                          />
                          <div className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys[14]}:
                            </strong>
                          </div>
                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys[11]}{" "}
                            <a
                              href="/determinant-calculator"
                              className="text-blue-900"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Determinant Calculator
                            </a>
                          </div>
                          <BlockMath
                            math={`D = \\begin{vmatrix} ${renderMatrixDet(
                              result?.tech_zain
                            )} \\end{vmatrix} = ${result?.tech_det}`}
                          />
                          {result?.tech_det === 0 ? (
                            <div className="mt-3">
                              {data?.payload?.tech_lang_keys[12]}
                            </div>
                          ) : (
                            <>
                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys[13]}
                              </div>
                              {renderSteps()}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <BlockMath
                            math={`\\text{Calculate } \\begin{bmatrix} ${renderMatrix(
                              result?.tech_zain
                            )} \\end{bmatrix}^{-1} \\text{${
                              data?.payload?.tech_lang_keys[9]
                            } adjugate method.}`}
                          />
                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys[14]}:
                          </div>
                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys[11]}{" "}
                            <a
                              href="/determinant-calculator"
                              className="text-blue-900"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Determinant Calculator
                            </a>
                          </div>
                          <BlockMath
                            math={`D = \\begin{vmatrix} ${renderMatrixDet(
                              result?.tech_zain
                            )} \\end{vmatrix} = ${result?.tech_det}`}
                          />

                          {result?.tech_det === 0 ? (
                            <div className="mt-3">
                              {data?.payload?.tech_lang_keys[12]}
                            </div>
                          ) : (
                            <>
                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys[15]}:
                              </div>
                              {/* FIXED: Added safe check for tech_c_down */}
                              {result?.tech_c_down && Array.isArray(result.tech_c_down) && result.tech_c_down.map((val, index) => {
                                const allCofy = result?.tech_all_cofy?.[index];
                                const allCofyDet = result?.tech_allcofy_det?.[index];
                                const minusPow = result?.tech_minus_pow?.[index];
                                
                                return (
                                  <div className="mt-3" key={index}>
                                    <BlockMath
                                      math={`C_{${val}} = (-1)^{${
                                        minusPow || 0
                                      }} \\begin{vmatrix} ${renderMatrix(
                                        allCofy
                                      )} \\end{vmatrix} = ${
                                        allCofyDet || 0
                                      }`}
                                    />
                                    ({data?.payload?.tech_lang_keys[21]}{" "}
                                    <a
                                      href="/determinant-calculator"
                                      className="text-blue-900"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Determinant Calculator
                                    </a>
                                    )
                                  </div>
                                );
                              })}

                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys[16]}:
                              </div>
                              <BlockMath
                                math={`\\begin{bmatrix} ${renderMatrix(
                                  result?.tech_final_cofa
                                )} \\end{bmatrix}`}
                              />

                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys[17]}:
                              </div>
                              <BlockMath
                                math={`\\begin{bmatrix} ${renderMatrix(
                                  result?.tech_ans_tran
                                )} \\end{bmatrix}`}
                              />

                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys[18]}:
                              </div>
                              <BlockMath
                                math={`\\begin{bmatrix} ${renderMatrix(
                                  result?.tech_ans_tran
                                )} \\end{bmatrix}`}
                              />

                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys[19]}:
                              </div>
                              {/* FIXED: Using the helper function */}
                              <BlockMath
                                math={`\\begin{bmatrix} ${renderFractionMatrix(
                                  result?.tech_ans_tran,
                                  result?.tech_det
                                )} \\end{bmatrix}`}
                              />

                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys[20]}:
                              </div>
                              <BlockMath
                                math={`\\begin{bmatrix} ${renderMatrix(
                                  result?.tech_inverse
                                )} \\end{bmatrix}`}
                              />
                            </>
                          )}
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

export default InverseMatrixCalculator;
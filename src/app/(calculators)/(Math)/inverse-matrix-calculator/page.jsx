"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useInverseMatrixCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

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
    tech_dtrmn_slct_method: "5",
    tech_dtrmn_0_0: "2",
    tech_dtrmn_0_1: "0",
    tech_dtrmn_0_2: "1",
    tech_dtrmn_0_3: "1",
    tech_dtrmn_0_4: "2",
    tech_dtrmn_1_0: "9",
    tech_dtrmn_1_1: "4",
    tech_dtrmn_1_2: "1",
    tech_dtrmn_1_3: "1",
    tech_dtrmn_1_4: "5",
    tech_dtrmn_2_0: "1",
    tech_dtrmn_2_1: "1",
    tech_dtrmn_2_2: "2",
    tech_dtrmn_2_3: "7",
    tech_dtrmn_2_4: "2",
    tech_dtrmn_3_0: "1",
    tech_dtrmn_3_1: "2",
    tech_dtrmn_3_2: "6",
    tech_dtrmn_3_3: "1",
    tech_dtrmn_3_4: "1",
    tech_dtrmn_4_0: "8",
    tech_dtrmn_4_1: "3",
    tech_dtrmn_4_2: "1",
    tech_dtrmn_4_3: "1",
    tech_dtrmn_4_4: "2",
    tech_dtrmn_opts_method: "exp_row", // exp_col exp_row
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

      const matrixPayload = {
        tech_dtrmn_slct_method: String(matrixSize),
        tech_dtrmn_opts_method: formData.tech_dtrmn_opts_method || "exp_col",
      };

      for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
          const key = `tech_dtrmn_${i}_${j}`;
          matrixPayload[key] = Number(formData[key]) || 0;
        }
      }

      const response = await calculateEbitCalculator(matrixPayload).unwrap();
      setResult(response);
      toast.success("Successfully Calculated");
    } catch (err) {
      const errorMsg = err?.data?.error || "An error occurred";
      setFormError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_dtrmn_slct_method: "5",
      tech_dtrmn_0_0: "2",
      tech_dtrmn_0_1: "0",
      tech_dtrmn_0_2: "1",
      tech_dtrmn_0_3: "1",
      tech_dtrmn_0_4: "2",
      tech_dtrmn_1_0: "9",
      tech_dtrmn_1_1: "4",
      tech_dtrmn_1_2: "1",
      tech_dtrmn_1_3: "1",
      tech_dtrmn_1_4: "5",
      tech_dtrmn_2_0: "1",
      tech_dtrmn_2_1: "1",
      tech_dtrmn_2_2: "2",
      tech_dtrmn_2_3: "7",
      tech_dtrmn_2_4: "2",
      tech_dtrmn_3_0: "1",
      tech_dtrmn_3_1: "2",
      tech_dtrmn_3_2: "6",
      tech_dtrmn_3_3: "1",
      tech_dtrmn_3_4: "1",
      tech_dtrmn_4_0: "8",
      tech_dtrmn_4_1: "3",
      tech_dtrmn_4_2: "1",
      tech_dtrmn_4_3: "1",
      tech_dtrmn_4_4: "2",
      tech_dtrmn_opts_method: "exp_row", // exp_col exp_row
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
    return matrix.map((row) => row.join(" & ")).join(" \\\\ ");
  };

  const renderMatrixDet = (matrix) => {
    return matrix.map((row) => row.join(" & ")).join(" \\\\ ");
  };

  const renderSteps = () => {
    return result?.tech_swap_line?.map((line, i) => {
      const matrixStr = result?.tech_swap[i]
        .map((row) =>
          row
            .map((val) => {
              const parts = val.toString().split(".");
              return parts.length === 2 ? Number(val).toFixed(3) : val;
            })
            .join(" & ")
        )
        .join(" \\\\ ");

      const columnCount = formData?.tech_dtrmn_slct_method;

      return (
        <div key={i} className="mt-3">
          <p>{line}</p>
          <BlockMath
            math={`\\left[\\begin{array}{${"c".repeat(
              columnCount
            )}|${"c".repeat(columnCount)}}${matrixStr} \\end{array}\\right]`}
          />
        </div>
      );
    });
  };

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

          <div className="lg:w-[80%] md:w-[100%] w-full mx-auto">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
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
                <table className="md:w-full" width={400}>
                  <tbody>
                    {Array.from({ length: matrixSize }, (_, i) => (
                      <tr key={i}>
                        {Array.from({ length: matrixSize }, (_, j) => {
                          const key = `tech_dtrmn_${i}_${j}`;
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

              {/* Action Buttons */}
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

                      <p className="mt-3">{data?.payload?.tech_lang_keys[8]}</p>

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
                          <p className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys[14]}:
                            </strong>
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[11]}{" "}
                            <a
                              href="https://calculator-logical.com/determinant-calculator"
                              className="text-blue-900"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Determinant Calculator
                            </a>
                          </p>
                          <BlockMath
                            math={`D = \\begin{vmatrix} ${renderMatrixDet(
                              result?.tech_zain
                            )} \\end{vmatrix} = ${result?.tech_det}`}
                          />
                          {result?.tech_det === 0 ? (
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[12]}
                            </p>
                          ) : (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[13]}
                              </p>
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
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[14]}:
                          </p>
                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys[11]}{" "}
                            <a
                              href="https://calculator-logical.com/determinant-calculator"
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
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[12]}
                            </p>
                          ) : (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[15]}:
                              </p>
                              {result?.tech_c_down?.map((val, index) => (
                                <div className="mt-3" key={index}>
                                  <BlockMath
                                    math={`C_{${val}} = (-1)^{${
                                      result?.tech_minus_pow[index]
                                    }} \\begin{vmatrix} ${renderMatrix(
                                      result?.tech_all_cofy[index]
                                    )} \\end{vmatrix} = ${
                                      result?.tech_allcofy_det[index]
                                    }`}
                                  />
                                  ({data?.payload?.tech_lang_keys[21]}{" "}
                                  <a
                                    href="https://calculator-logical.com/determinant-calculator"
                                    className="text-blue-900"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Determinant Calculator
                                  </a>
                                  )
                                </div>
                              ))}

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[16]}:
                              </p>
                              <BlockMath
                                math={`\\begin{bmatrix} ${renderMatrix(
                                  result?.tech_final_cofa
                                )} \\end{bmatrix}`}
                              />

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[17]}:
                              </p>
                              <BlockMath
                                math={`\\begin{bmatrix} ${renderMatrix(
                                  result?.tech_ans_tran
                                )} \\end{bmatrix}`}
                              />

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[18]}:
                              </p>
                              <BlockMath
                                math={`\\begin{bmatrix} ${renderMatrix(
                                  result?.tech_ans_tran
                                )} \\end{bmatrix}`}
                              />

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[19]}:
                              </p>
                              <BlockMath
                                math={`\\begin{bmatrix} ${result?.tech_ans_tran
                                  .map((row) =>
                                    row
                                      .map(
                                        (val) =>
                                          `\\dfrac{${val}}{${result?.tech_det}}`
                                      )
                                      .join(" & ")
                                  )
                                  .join(" \\\\ ")} \\end{bmatrix}`}
                              />

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[20]}:
                              </p>
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

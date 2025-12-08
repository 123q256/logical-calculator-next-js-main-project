"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import {
  useGetSingleCalculatorDetailsMutation,
  useGaussSeidelCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

function formatNumber(num) {
  return Number(num).toFixed(1);
}

// Helper: Convert 2D array to LaTeX matrix string
function arrayToLatexMatrix(matrix) {
  if (!matrix || !matrix.length) return "";

  // Check if it's a 1D array
  if (!Array.isArray(matrix[0])) {
    return matrix.map((val) => formatNumber(val)).join(" \\\\ ");
  }

  // It's a 2D array
  return matrix
    .map((row) => {
      if (Array.isArray(row)) {
        return row.map((val) => formatNumber(val)).join(" & ");
      }
      return formatNumber(row);
    })
    .join(" \\\\ ");
}

// Helper: Convert 1D array or array of arrays to LaTeX column vector
function arrayToLatexVector(vector) {
  if (!vector || !vector.length) return "";

  // If it's array of arrays like [[7], [-5.44]]
  if (Array.isArray(vector[0])) {
    return vector
      .map((row) => {
        if (Array.isArray(row)) {
          return formatNumber(row[0]);
        }
        return formatNumber(row);
      })
      .join(" \\\\ ");
  }

  // If it's flat array
  return vector.map((val) => formatNumber(val)).join(" \\\\ ");
}

const GaussSeidelMethodCalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  let url = "";

  if (parts.length === 1) {
    url = parts[0];
  } else {
    url = parts[0] + "/" + parts[1];
  }

  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();

  const handleFetchDetails = async () => {
    try {
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    tech_number: "2",
    tech_matrix0_0: "1",
    tech_matrix0_1: "2",
    tech_matrix0_2: "2",
    tech_matrix1_0: "8",
    tech_matrix1_1: "9",
    tech_matrix1_2: "9",
    tech_matrix2_0: "6",
    tech_matrix2_1: "5",
    tech_matrix2_2: "10",
  });

  const [techValues, setTechValues] = useState(["7", "7", "7"]);
  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  });

  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGaussSeidelCalculatorMutation();

  useEffect(() => {
    const fetchCurrency = async () => {
      const result = await getUserCurrency();
      if (result) {
        setCurrency(result);
      }
    };
    fetchCurrency();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleTechValueChange = (index, value) => {
    const newValues = [...techValues];
    newValues[index] = value;
    setTechValues(newValues);
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_number) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const payload = {
        tech_number: formData.tech_number,
        tech_value: techValues,
        tech_matrix0_0: formData.tech_matrix0_0,
        tech_matrix0_1: formData.tech_matrix0_1,
        tech_matrix0_2: formData.tech_matrix0_2,
        tech_matrix1_0: formData.tech_matrix1_0,
        tech_matrix1_1: formData.tech_matrix1_1,
        tech_matrix1_2: formData.tech_matrix1_2,
      };

      if (formData.tech_number === "2") {
        payload.tech_matrix2_0 = formData.tech_matrix2_0;
        payload.tech_matrix2_1 = formData.tech_matrix2_1;
        payload.tech_matrix2_2 = formData.tech_matrix2_2;
      } else {
        delete payload.tech_matrix0_2;
        delete payload.tech_matrix1_2;
        payload.tech_value = techValues.slice(0, 2);
      }

      const response = await calculateEbitCalculator(payload).unwrap();
      setResult(response?.payload);
      toast.success("Successfully Calculated");
    } catch (err) {
      const errorMsg = err.data?.payload?.error || "Calculation failed";
      setFormError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleReset = () => {
    setFormData({
      tech_number: "2",
      tech_matrix0_0: "1",
      tech_matrix0_1: "2",
      tech_matrix0_2: "2",
      tech_matrix1_0: "8",
      tech_matrix1_1: "9",
      tech_matrix1_2: "9",
      tech_matrix2_0: "6",
      tech_matrix2_1: "5",
      tech_matrix2_2: "10",
    });
    setTechValues(["7", "7", "7"]);
    setResult(null);
    setFormError(null);
  };

  // Prepare LaTeX strings for results
  const getLatexStrings = () => {
    if (!result) return null;

    // Convert arrays to LaTeX strings
    const upperLatex = `\\begin{bmatrix} ${arrayToLatexMatrix(
      result?.tech_upper
    )} \\end{bmatrix}`;
    const lowerLatex = `\\begin{bmatrix} ${arrayToLatexMatrix(
      result?.tech_lower
    )} \\end{bmatrix}`;
    const inverseLatex = `\\begin{bmatrix} ${arrayToLatexMatrix(
      result?.tech_inverse
    )} \\end{bmatrix}`;
    const resultLatex = `\\begin{bmatrix} ${arrayToLatexMatrix(
      result?.tech_result
    )} \\end{bmatrix}`;

    // For tech_result2 which is array of arrays like [[7], [-5.44]]
    const result2Latex = `\\begin{bmatrix} ${arrayToLatexVector(
      result?.tech_result2
    )} \\end{bmatrix}`;

    // For tech_value which is flat array [7, 7, 7]
    const techValueLatex = `\\begin{bmatrix} ${arrayToLatexVector(
      result?.tech_value
    )} \\end{bmatrix}`;

    // For main result
    const mainResultLatex = `\\begin{bmatrix} ${arrayToLatexMatrix(
      result?.tech_main_result
    )} \\end{bmatrix}`;

    // Matrix multiplications
    const multInverseUpperLatex = `- ${inverseLatex} \\times ${upperLatex} = ${resultLatex}`;
    const multInverseValueLatex = `${inverseLatex} \\times ${techValueLatex} = ${result2Latex}`;

    // Iterative powers
    const iterativePowersLatex = (() => {
      if (!result?.tech_result || !result?.tech_result2) return "";

      let latexStr = `\\times^{(0)} = ${result2Latex} \\\\ `;
      latexStr += `\\times^{(1)} = ${resultLatex} \\times ${result2Latex} + ${result2Latex} \\\\ `;

      for (let i = 2; i <= 3; i++) {
        latexStr += `\\times^{(${i})} = ${resultLatex} \\times ${resultLatex} + ${result2Latex}`;
        if (i < 3) latexStr += " \\\\ ";
      }

      return latexStr;
    })();

    return {
      upperLatex,
      lowerLatex,
      inverseLatex,
      resultLatex,
      result2Latex,
      techValueLatex,
      mainResultLatex,
      multInverseUpperLatex,
      multInverseValueLatex,
      iterativePowersLatex,
    };
  };

  const latexStrings = getLatexStrings();

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
          path: pathname,
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

          <div className="lg:w-[80%] md:w-[90%] w-full mx-auto">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 mx-auto mt-0 mt-lg-2 px-2">
                <label htmlFor="tech_number" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_number"
                    id="tech_number"
                    value={formData.tech_number}
                    onChange={handleChange}
                  >
                    <option value="1">2x2 Matrix</option>
                    <option value="2">3x3 Matrix</option>
                  </select>
                </div>
              </div>

              {/* First Equation */}
              <div className="col-span-12 flex items-center mt-0 mt-lg-2">
                <div>
                  <div className="w-full py-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_matrix0_0"
                      id="tech_matrix0_0"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_matrix0_0}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <p className="px-2 text-[14px] text-blue">
                  x<sub className="text-[12px] text-blue">1</sub>{" "}
                  <span className="text-[18px] text-blue">+</span>
                </p>
                <div>
                  <div className="w-full py-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_matrix0_1"
                      id="tech_matrix0_1"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_matrix0_1}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {formData.tech_number === "2" && (
                  <>
                    <p className="px-2 text-[14px] text-blue">
                      x<sub className="text-[12px] text-blue">2</sub>{" "}
                      <span className="text-[18px] text-blue">+</span>
                    </p>
                    <div>
                      <div className="w-full py-2">
                        <input
                          type="number"
                          step="any"
                          name="tech_matrix0_2"
                          id="tech_matrix0_2"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_matrix0_2}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <p className="px-2 text-[14px] text-blue">
                      x<sub className="text-[12px] text-blue">3</sub>{" "}
                      <span className="text-[18px] text-blue">=</span>
                    </p>
                  </>
                )}

                {formData.tech_number === "1" && (
                  <p className="px-2 text-[14px] text-blue">
                    x<sub className="text-[12px] text-blue">2</sub>{" "}
                    <span className="text-[18px] text-blue">=</span>
                  </p>
                )}

                <div>
                  <div className="w-full py-2">
                    <input
                      type="number"
                      step="any"
                      className="input my-2"
                      placeholder="00"
                      value={techValues[0]}
                      onChange={(e) => handleTechValueChange(0, e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Second Equation */}
              <div className="col-span-12 flex items-center mt-0 mt-lg-2">
                <div>
                  <div className="w-full py-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_matrix1_0"
                      id="tech_matrix1_0"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_matrix1_0}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <p className="px-2 text-[14px] text-blue">
                  x<sub className="text-[12px] text-blue">1</sub>{" "}
                  <span className="text-[18px] text-blue">+</span>
                </p>
                <div>
                  <div className="w-full py-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_matrix1_1"
                      id="tech_matrix1_1"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_matrix1_1}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {formData.tech_number === "2" && (
                  <>
                    <p className="px-2 text-[14px] text-blue">
                      x<sub className="text-[12px] text-blue">2</sub>{" "}
                      <span className="text-[18px] text-blue">+</span>
                    </p>
                    <div>
                      <div className="w-full py-2">
                        <input
                          type="number"
                          step="any"
                          name="tech_matrix1_2"
                          id="tech_matrix1_2"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_matrix1_2}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <p className="px-2 text-[14px] text-blue">
                      x<sub className="text-[12px] text-blue">3</sub>{" "}
                      <span className="text-[18px] text-blue">=</span>
                    </p>
                  </>
                )}

                {formData.tech_number === "1" && (
                  <p className="px-2 text-[14px] text-blue">
                    x<sub className="text-[12px] text-blue">2</sub>{" "}
                    <span className="text-[18px] text-blue">=</span>
                  </p>
                )}

                <div>
                  <input
                    type="number"
                    step="any"
                    className="input my-2"
                    placeholder="00"
                    value={techValues[1]}
                    onChange={(e) => handleTechValueChange(1, e.target.value)}
                  />
                </div>
              </div>

              {/* Third Equation (only for 3x3) */}
              {formData.tech_number === "2" && (
                <div className="col-span-12 flex items-center mt-0 mt-lg-2">
                  <div>
                    <div className="w-full py-2">
                      <input
                        type="number"
                        step="any"
                        name="tech_matrix2_0"
                        id="tech_matrix2_0"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_matrix2_0}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <p className="px-2 text-[14px] text-blue">
                    x<sub className="text-[12px] text-blue">1</sub>{" "}
                    <span className="text-[18px] text-blue">+</span>
                  </p>
                  <div>
                    <div className="w-full py-2">
                      <input
                        type="number"
                        step="any"
                        name="tech_matrix2_1"
                        id="tech_matrix2_1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_matrix2_1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <p className="px-2 text-[14px] text-blue">
                    x<sub className="text-[12px] text-blue">2</sub>{" "}
                    <span className="text-[18px] text-blue">+</span>
                  </p>
                  <div>
                    <div className="w-full py-2">
                      <input
                        type="number"
                        step="any"
                        name="tech_matrix2_2"
                        id="tech_matrix2_2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_matrix2_2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <p className="px-2 text-[14px] text-blue">
                    x<sub className="text-[12px] text-blue">3</sub>{" "}
                    <span className="text-[18px] text-blue">=</span>
                  </p>
                  <div>
                    <div className="w-full py-2">
                      <input
                        type="number"
                        step="any"
                        className="input my-2"
                        placeholder="00"
                        value={techValues[2]}
                        onChange={(e) =>
                          handleTechValueChange(2, e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
            <div className="animate-pulse">
              <div className="w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result &&
          latexStrings && (
            <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
              <div>
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                <div className="rounded-lg flex items-center justify-center w-full mt-3 text-[16px]">
                  <div className="w-full">
                    {/* Title */}
                    <p className="mt-3 text-[18px] font-bold">
                      x = A<sup>-1</sup>b
                    </p>

                    {/* Main result matrix */}
                    <BlockMath math={latexStrings.mainResultLatex} />

                    {/* Table view of main result */}
                    <div className="col-lg-4 mt-3 overflow-auto">
                      <table className="w-full font-s-16">
                        <tbody>
                          {result?.tech_main_result?.map((row, i) => (
                            <tr key={i}>
                              <td className="py-2 border-b w-1/3">
                                <strong>
                                  x<sub>{i + 1}</sub>
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {formatNumber(
                                  Array.isArray(row) ? row[0] : row
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="w-full overflow-auto">
                      {/* Upper matrix */}
                      <p className="mt-3 text-[18px] font-bold">
                        {data?.payload?.tech_lang_keys[3]} L
                      </p>
                      <BlockMath math={latexStrings.upperLatex} />

                      {/* Lower matrix */}
                      <p className="mt-3 text-[18px] font-bold">
                        {data?.payload?.tech_lang_keys[4]} L
                      </p>
                      <BlockMath math={latexStrings.lowerLatex} />

                      {/* Inverse matrix */}
                      <p className="mt-3 text-[18px] font-bold">
                        {data?.payload?.tech_lang_keys[5]} L<sup>-1</sup>*
                      </p>
                      <BlockMath math={latexStrings.inverseLatex} />

                      {/* Multiplication -inverse * upper = result */}
                      <p className="mt-3 text-[18px] font-bold">
                        {data?.payload?.tech_lang_keys[6]} T
                      </p>
                      <BlockMath math={latexStrings.multInverseUpperLatex} />

                      {/* Multiplication inverse * vector = result2 */}
                      <p className="mt-3 text-[18px] font-bold">
                        {data?.payload?.tech_lang_keys[6]} C
                      </p>
                      <BlockMath math={latexStrings.multInverseValueLatex} />

                      {/* Iterative powers */}
                      <p className="mt-3 text-[18px] font-bold">
                        {data?.payload?.tech_lang_keys[7]}
                      </p>
                      <BlockMath math={latexStrings.iterativePowersLatex} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </form>
      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default GaussSeidelMethodCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

function formatNumber(num) {
  return Number(num).toFixed(1);
}

// Helper: Convert 2D array to LaTeX matrix string
function arrayToLatexMatrix(matrix) {
  if (!matrix || !matrix.length) return "";
  return matrix
    .map((row) => row.map((val) => formatNumber(val)).join(" & "))
    .join(" \\\\ ");
}

// Helper: Convert 1D array to LaTeX column vector string
function arrayToLatexVector(vector) {
  if (!vector || !vector.length) return "";
  return vector.map((val) => formatNumber(val)).join(" \\\\ ");
}

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useGaussSeidelCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GaussSeidelMethodCalculator = () => {
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
    tech_number: "1", // 1 2
    tech_value: ["7", "7", "7"],
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

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGaussSeidelCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      const response = await calculateEbitCalculator({
        tech_number: formData.tech_number,
        tech_value: formData.tech_value,
        tech_matrix0_0: formData.tech_matrix0_0,
        tech_matrix0_1: formData.tech_matrix0_1,
        tech_matrix0_2: formData.tech_matrix0_2,
        tech_matrix1_0: formData.tech_matrix1_0,
        tech_matrix1_1: formData.tech_matrix1_1,
        tech_matrix1_2: formData.tech_matrix1_2,
        tech_matrix2_0: formData.tech_matrix2_0,
        tech_matrix2_1: formData.tech_matrix2_1,
        tech_matrix2_2: formData.tech_matrix2_2,
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
      tech_number: "1", // 1 2
      tech_value: ["7", "7", "7"],
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

  const n = result?.tech_number; // matrix dimension

  // LaTeX strings for matrices/vectors
  const mainResultLatex = `\\begin{bmatrix} ${arrayToLatexMatrix(
    result?.tech_main_result
  )} \\end{bmatrix}`;
  const upperLatex = `\\begin{bmatrix} ${arrayToLatexMatrix(
    result?.tech_upper
  )} \\end{bmatrix}`;
  const lowerLatex = `\\begin{bmatrix} ${arrayToLatexMatrix(
    result?.tech_lower
  )} \\end{bmatrix}`;
  const inverseLatex = `\\begin{bmatrix} ${arrayToLatexMatrix(
    result?.tech_invrse
  )} \\end{bmatrix}`;
  const techValueLatex = `\\begin{bmatrix} ${arrayToLatexVector(
    result?.tech_value
  )} \\end{bmatrix}`;
  const result2Latex = `\\begin{bmatrix} ${arrayToLatexMatrix(
    result?.tech_result2
  )} \\end{bmatrix}`;
  const resultLatex = `\\begin{bmatrix} ${arrayToLatexMatrix(
    result?.tech_result
  )} \\end{bmatrix}`;

  // Example: Matrix multiplication latex for inverse * upper = result
  const multInverseUpperLatex = `
    - ${inverseLatex} \\times ${upperLatex} = ${resultLatex}
  `;

  // Multiplication inverse * vector = result2
  const multInverseValueLatex = `
    ${inverseLatex} \\times ${techValueLatex} = ${result2Latex}
  `;

  // The iterative powers part (simplified example)
  // In real scenario you would precompute all iterations or build a function to generate LaTeX
  const iterativePowersLatex = (() => {
    let latexStr = "";
    for (let i = 0; i <= 19; i++) {
      if (i === 0) {
        latexStr += `\\times^{(${i})} = ${result2Latex}`;
      } else {
        latexStr += `\\times^{(${i})} = ${resultLatex} \\times `;
        latexStr += i === 1 ? result2Latex : resultLatex;
        latexStr += ` + ${result2Latex} \\\\ `;
      }
    }
    return latexStr;
  })();

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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
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
                    <option value="1">2 </option>
                    <option value="2">3 </option>
                  </select>
                </div>
              </div>
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
                {formData.tech_number == "2" && (
                  <>
                    <p className="px-2 text-[14px] text-blue thirdInputs ">
                      x<sub className="text-[12px] text-blue">2</sub>{" "}
                      <span className="text-[18px] text-blue">+</span>
                    </p>
                  </>
                )}
                {formData.tech_number == "1" && (
                  <>
                    <p className="px-2 text-[14px] text-blue thirdInputEqual ">
                      x<sub className="text-[12px] text-blue">2</sub>{" "}
                      <span className="text-[18px] text-blue">=</span>
                    </p>
                  </>
                )}

                {formData.tech_number == "2" && (
                  <>
                    <div className="thirdInputs ">
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
                  </>
                )}

                {formData.tech_number == "2" && (
                  <>
                    <p className="px-2 text-[14px] text-blue thirdInputs ">
                      x<sub className="text-[12px] text-blue">3</sub>{" "}
                      <span className="text-[18px] text-blue">=</span>
                    </p>
                  </>
                )}
                <div>
                  <div className="w-full py-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_value"
                      data-index="1"
                      className="input my-2"
                      placeholder="00"
                      value={formData.tech_value[0]}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
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
                {formData.tech_number == "2" && (
                  <>
                    <p className="px-2 text-[14px] text-blue thirdInputs ">
                      x<sub className="text-[12px] text-blue">2</sub>{" "}
                      <span className="text-[18px] text-blue">+</span>
                    </p>
                  </>
                )}
                {formData.tech_number == "1" && (
                  <>
                    <p className="px-2 text-[14px] text-blue thirdInputEqual ">
                      x<sub className="text-[12px] text-blue">2</sub>{" "}
                      <span className="text-[18px] text-blue">=</span>
                    </p>
                  </>
                )}

                {formData.tech_number == "2" && (
                  <>
                    <div className="thirdInputs">
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
                  </>
                )}

                {formData.tech_number == "2" && (
                  <>
                    <p className="px-2 text-[14px] text-blue thirdInputs">
                      x<sub className="text-[12px] text-blue">3</sub>{" "}
                      <span className="text-[18px] text-blue">=</span>
                    </p>
                  </>
                )}
                <div>
                  <input
                    type="number"
                    step="any"
                    name="tech_value"
                    data-index="0"
                    className="input my-2"
                    placeholder="00"
                    value={formData.tech_value[1]}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_number == "2" && (
                <>
                  <div className="col-span-12 flex items-center mt-0 mt-lg-2 thirdInputs">
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
                          name="tech_value"
                          data-index="1"
                          className="input my-2"
                          placeholder="00"
                          value={formData.tech_value[2]}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </>
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

                  <div className="rounded-lg flex items-center justify-center w-full mt-3 text-[16px]">
                    <div className="w-full">
                      {/* Title */}
                      <p className="mt-3 text-[18px] font-bold">
                        x = A<sup>-1</sup>b
                      </p>

                      {/* Main result matrix */}
                      <BlockMath math={mainResultLatex} />

                      {/* Table view of main result */}
                      <div className="col-lg-4 mt-3 overflow-auto">
                        <table className="w-full text-[16px]">
                          <tbody>
                            {result?.tech_main_result?.map((row, i) => (
                              <tr key={i}>
                                <td className="py-2 border-b w-1/3">
                                  <strong>
                                    x<sub>{i + 1}</sub>
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {formatNumber(row[0])}
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
                        <BlockMath math={upperLatex} />

                        {/* Lower matrix */}
                        <p className="mt-3 text-[18px] font-bold">
                          {data?.payload?.tech_lang_keys[4]} L
                        </p>
                        <BlockMath math={lowerLatex} />

                        {/* Inverse matrix */}
                        <p className="mt-3 text-[18px] font-bold">
                          {data?.payload?.tech_lang_keys[5]} L<sup>-1</sup>*
                        </p>
                        <BlockMath math={inverseLatex} />

                        {/* Multiplication -inverse * upper = result */}
                        <p className="mt-3 text-[18px] font-bold">
                          {data?.payload?.tech_lang_keys[6]} T
                        </p>
                        <BlockMath math={multInverseUpperLatex} />

                        {/* Multiplication inverse * vector = result2 */}
                        <p className="mt-3 text-[18px] font-bold">
                          {data?.payload?.tech_lang_keys[6]} C
                        </p>
                        <BlockMath math={multInverseValueLatex} />

                        {/* Iterative powers (simplified) */}
                        <p className="mt-3 text-[18px] font-bold">
                          {data?.payload?.tech_lang_keys[7]}
                        </p>
                        <BlockMath math={iterativePowersLatex} />
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

export default GaussSeidelMethodCalculator;

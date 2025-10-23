"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const getVal = (a) => (isNaN(a) ? 0 : Number(parseFloat(a).toFixed(4)));
const check2nbr0 = (a, b) => a * a + b * b === 0;
const check3nbr0 = (a, b, c) => a * a + b * b + c * c === 0;
const check4nbr0 = (a, b, c, d) => a * a + b * b + c * c + d * d === 0;

import {
  useGetSingleCalculatorDetailsMutation,
  useLinearIndependenceCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LinearIndependenceCalculator = ({ matrix }) => {
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
    tech_row: 3,
    tech_colum: 3,
    tech_matrix_0_0: "1",
    tech_matrix_0_1: "1",
    tech_matrix_0_2: "0",
    tech_matrix_1_0: "2",
    tech_matrix_1_1: "5",
    tech_matrix_1_2: "-3",
    tech_matrix_2_0: "1",
    tech_matrix_2_1: "2",
    tech_matrix_2_2: "7",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLinearIndependenceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const row = parseInt(formData.tech_row);
    const col = parseInt(formData.tech_colum);

    if (!row || !col) {
      setFormError("Please select both row and column.");
      return;
    }

    if (col > row) {
      setFormError(
        "❌ For linear independence, the number of columns (vectors) must not exceed rows (dimensions)."
      );
      toast.error("Invalid matrix: columns > rows.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        ...formData,
      }).unwrap();
      setResult(response?.payload);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err?.data?.payload?.error || "Something went wrong.");
      toast.error(err?.data?.payload?.error || "Something went wrong.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_row: 3,
      tech_colum: 3,
      tech_matrix_0_0: "1",
      tech_matrix_0_1: "1",
      tech_matrix_0_2: "0",
      tech_matrix_1_0: "2",
      tech_matrix_1_1: "5",
      tech_matrix_1_2: "-3",
      tech_matrix_2_0: "1",
      tech_matrix_2_1: "2",
      tech_matrix_2_2: "7",
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

  // Generate input field name
  const getInputName = (i, j) => `tech_matrix_${i}_${j}`;

  // Generate matrix inputs
  const generateMatrixInputs = () => {
    const rows = parseInt(formData.tech_row);
    const cols = parseInt(formData.tech_colum);

    const table = [];
    for (let i = 0; i < rows; i++) {
      const rowInputs = [];
      for (let j = 0; j < cols; j++) {
        const name = getInputName(i, j);
        rowInputs.push(
          <td key={name}>
            <input
              type="number"
              step="any"
              name={name}
              value={formData[name] || ""}
              className="input"
              onChange={handleChange}
              required
            />
          </td>
        );
      }
      table.push(<tr key={i}>{rowInputs}</tr>);
    }
    return table;
  };

  const handleGenerateRandom = () => {
    const newFormData = { ...formData };

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const key = `tech_matrix_${i}_${j}`;
        newFormData[key] = Math.floor(Math.random() * 11).toString(); // 0–10 random
      }
    }

    setFormData(newFormData);
  };

  const handleClearInputs = () => {
    const newFormData = { ...formData };

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const key = `tech_matrix_${i}_${j}`;
        newFormData[key] = "";
      }
    }

    setFormData(newFormData);
  };

  // js code

  const [resultText, setResultText] = useState("");

  useEffect(() => {
    const rows = Number(formData?.tech_row);
    const columns = Number(formData?.tech_colum);

    // Fill matrix with default 0 if missing
    const input = Array.from({ length: 4 }, (_, i) =>
      Array.from({ length: 4 }, (_, j) => getVal(matrix?.[i]?.[j] ?? 0))
    );

    const matrixCopy = [];
    let rank = rows;
    let noZero = 0;
    let disAns = 1;

    for (let i = 0; i < rows; i++) {
      matrixCopy.push([]);
      for (let j = 0; j < columns; j++) {
        matrixCopy[i].push(input[i][j]);
        disAns *= input[i][j];
      }
    }

    for (let k = 0; k < Math.min(rows, columns); k++) {
      for (let i = k - noZero + 1; i < rows; i++) {
        if (matrixCopy[k - noZero][k] === 0) {
          const safe = matrixCopy[k - noZero];
          matrixCopy[k - noZero] = matrixCopy[i];
          matrixCopy[i] = safe;
        }
      }
      if (matrixCopy[k - noZero][k] === 0) {
        noZero++;
      } else {
        for (let i = columns - 1; i >= 0; i--) {
          matrixCopy[k - noZero][i] = Math.round(
            matrixCopy[k - noZero][i] / matrixCopy[k - noZero][k]
          );
        }
        for (let i = k - noZero + 1; i < rows; i++) {
          for (let j = columns - 1; j >= k; j--) {
            matrixCopy[i][j] = Math.round(
              matrixCopy[i][j] - matrixCopy[i][k] * matrixCopy[k - noZero][j]
            );
          }
        }
      }
    }

    for (let i = 0; i < rows; i++) {
      if (columns === 1 && matrixCopy[i][0] === 0) rank--;
      else if (columns === 2 && check2nbr0(matrixCopy[i][0], matrixCopy[i][1]))
        rank--;
      else if (
        columns === 3 &&
        check3nbr0(matrixCopy[i][0], matrixCopy[i][1], matrixCopy[i][2])
      )
        rank--;
      else if (
        columns === 4 &&
        check4nbr0(
          matrixCopy[i][0],
          matrixCopy[i][1],
          matrixCopy[i][2],
          matrixCopy[i][3]
        )
      )
        rank--;
    }

    if (!isNaN(disAns)) {
      setResultText(
        rank !== rows ? "Linearly Dependent." : "Linearly Independent."
      );
    }
  }, [formData?.tech_row, formData?.tech_colum, matrix]);

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
                <div className="grid grid-cols-12  gap-4">
                  {/* Row Selector */}
                  <div className="col-span-6">
                    <label className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <select
                      name="tech_row"
                      value={formData.tech_row}
                      onChange={handleChange}
                      className="input w-full"
                    >
                      {[...Array(3)].map((_, i) => (
                        <option key={i + 2} value={i + 2}>
                          {i + 2}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Column Selector */}
                  <div className="col-span-6">
                    <label className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <select
                      name="tech_colum"
                      value={formData.tech_colum}
                      onChange={handleChange}
                      className="input w-full"
                    >
                      {[...Array(4)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Matrix Inputs */}
              <div className="col-span-12 overflow-x-auto">
                <table className="matrix_table w-full border-spacing-2">
                  <tbody>{generateMatrixInputs()}</tbody>
                </table>
              </div>
            </div>
            <div className="col-span-12 ">
              <div className="col-span-12">
                <button
                  type="button"
                  id="dtrmn_gen_btn"
                  onClick={handleGenerateRandom}
                  className="px-3 py-2 mt-1 mx-1 addmore cursor-pointer bg-[#2845F5] text-white rounded-lg"
                >
                  {data?.payload?.tech_lang_keys["3"]}
                </button>

                <button
                  type="button"
                  id="dtrmn_clr_btn"
                  onClick={handleClearInputs}
                  className="px-3 py-2 mt-1 mx-1 addmore cursor-pointer bg-[#2845F5] text-white rounded-lg"
                >
                  {data?.payload?.tech_lang_keys["4"]}
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>
        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div className="animate-pulse">
              <div className="w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
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
                      <div className="mt-4">
                        <h2 className="text-xl font-bold">Result:</h2>
                        <p className="text-lg  font-bold" id="ans">
                          {resultText || "Not calculated yet."}
                        </p>
                      </div>

                      <div className="w-full text-[16px] overflow-auto">
                        {result?.tech_row == 2 && result?.tech_colum == 2 && (
                          <>
                            <p className="mt-3 text-[18px] font-bold">
                              {data?.payload?.tech_lang_keys["6"]}:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["7"]} A, B{" "}
                              {data?.payload?.tech_lang_keys["8"]}. i.e. |D| = 0
                            </p>
                            <BlockMath
                              math={`A = (${formData?.tech_matrix_0_0}, ${formData?.tech_matrix_0_1}), B = (${formData?.tech_matrix_1_0}, ${formData?.tech_matrix_1_1})`}
                            />
                            <BlockMath
                              math={`|D|=\\left|\\begin{array}{cc}${formData?.tech_matrix_0_0} & ${formData?.tech_matrix_0_1} \\\\ ${formData?.tech_matrix_1_0} & ${formData?.tech_matrix_1_1}\\end{array}\\right|`}
                            />
                            <BlockMath
                              math={`|D|= (${formData?.tech_matrix_0_0}) \\times (${formData?.tech_matrix_1_1}) - (${formData?.tech_matrix_1_0}) \\times (${formData?.tech_matrix_0_1})`}
                            />
                            <BlockMath
                              math={`|D|= ${
                                formData?.tech_matrix_0_0 *
                                formData?.tech_matrix_1_1
                              } - ${
                                formData?.tech_matrix_1_0 *
                                formData?.tech_matrix_0_1
                              }`}
                            />

                            <BlockMath
                              math={`|D|= ${
                                formData?.tech_matrix_0_0 *
                                  formData?.tech_matrix_1_1 -
                                formData?.tech_matrix_1_0 *
                                  formData?.tech_matrix_0_1
                              }`}
                            />

                            {formData?.tech_matrix_0_0 *
                              formData?.tech_matrix_1_1 -
                              formData?.tech_matrix_1_0 *
                                formData?.tech_matrix_0_1 !==
                            0 ? (
                              <>
                                <BlockMath math={`|D| \\ne 0`} />
                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["9"]}{" "}
                                  <InlineMath math="|D| ≠ 0" />,{" "}
                                  {data?.payload?.tech_lang_keys["10"]} A, B{" "}
                                  {data?.payload?.tech_lang_keys["11"]}.
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["9"]}{" "}
                                  <InlineMath math="|D| = 0" />,{" "}
                                  {data?.payload?.tech_lang_keys["10"]} A, B{" "}
                                  {data?.payload?.tech_lang_keys["12"]}.
                                </p>
                              </>
                            )}
                          </>
                        )}

                        {result?.tech_row == 3 && result?.tech_colum == 3 && (
                          <>
                            <p className="mt-3 text-[18px] font-bold">
                              {data?.payload?.tech_lang_keys["6"]}:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["7"]} A, B, C{" "}
                              {data?.payload?.tech_lang_keys["8"]}. i.e. |D| = 0
                            </p>

                            <BlockMath
                              math={`A = (${formData?.tech_matrix_0_0}, ${formData?.tech_matrix_0_1}, ${formData?.tech_matrix_0_2}), B = (${formData?.tech_matrix_1_0}, ${formData?.tech_matrix_1_1}, ${formData?.tech_matrix_1_2}), C = (${formData?.tech_matrix_2_0}, ${formData?.tech_matrix_2_1}, ${formData?.tech_matrix_2_2})`}
                            />

                            <BlockMath
                              math={`|D|=\\left|\\begin{array}{ccc}${formData?.tech_matrix_0_0} & ${formData?.tech_matrix_0_1} & ${formData?.tech_matrix_0_2} \\\\ ${formData?.tech_matrix_1_0} & ${formData?.tech_matrix_1_1} & ${formData?.tech_matrix_1_2} \\\\ ${formData?.tech_matrix_2_0} & ${formData?.tech_matrix_2_1} & ${formData?.tech_matrix_2_2}\\end{array}\\right|`}
                            />

                            <BlockMath
                              math={`|D|= ${formData?.tech_matrix_0_0} \\times \\left|\\begin{array}{cc}${formData?.tech_matrix_1_1} & ${formData?.tech_matrix_1_2} \\\\ ${formData?.tech_matrix_2_1} & ${formData?.tech_matrix_2_2}\\end{array}\\right| - ${formData?.tech_matrix_0_1} \\times \\left|\\begin{array}{cc}${formData?.tech_matrix_1_0} & ${formData?.tech_matrix_1_2} \\\\ ${formData?.tech_matrix_2_0} & ${formData?.tech_matrix_2_2}\\end{array}\\right| + ${formData?.tech_matrix_0_2} \\times \\left|\\begin{array}{cc}${formData?.tech_matrix_1_0} & ${formData?.tech_matrix_1_1} \\\\ ${formData?.tech_matrix_2_0} & ${formData?.tech_matrix_2_1}\\end{array}\\right|`}
                            />

                            {(() => {
                              const a =
                                formData?.tech_matrix_0_0 *
                                (formData?.tech_matrix_1_1 *
                                  formData?.tech_matrix_2_2 -
                                  formData?.tech_matrix_1_2 *
                                    formData?.tech_matrix_2_1);
                              const b =
                                formData?.tech_matrix_0_1 *
                                (formData?.tech_matrix_1_0 *
                                  formData?.tech_matrix_2_2 -
                                  formData?.tech_matrix_1_2 *
                                    formData?.tech_matrix_2_0);
                              const c =
                                formData?.tech_matrix_0_2 *
                                (formData?.tech_matrix_1_0 *
                                  formData?.tech_matrix_2_1 -
                                  formData?.tech_matrix_1_1 *
                                    formData?.tech_matrix_2_0);
                              const det = a - b + c;

                              return (
                                <>
                                  <BlockMath
                                    math={`|D| = ${formData?.tech_matrix_0_0} × (${formData?.tech_matrix_1_1}×${formData?.tech_matrix_2_2} - ${formData?.tech_matrix_1_2}×${formData?.tech_matrix_2_1}) - ${formData?.tech_matrix_0_1} × (${formData?.tech_matrix_1_0}×${formData?.tech_matrix_2_2} - ${formData?.tech_matrix_1_2}×${formData?.tech_matrix_2_0}) + ${formData?.tech_matrix_0_2} × (${formData?.tech_matrix_1_0}×${formData?.tech_matrix_2_1} - ${formData?.tech_matrix_1_1}×${formData?.tech_matrix_2_0})`}
                                  />
                                  <BlockMath
                                    math={`|D| = ${a} - ${b} + ${c} = ${det}`}
                                  />

                                  {det !== 0 ? (
                                    <>
                                      <BlockMath math={`|D| ≠ 0`} />
                                      <p className="mt-3">
                                        {data?.payload?.tech_lang_keys["9"]}{" "}
                                        <InlineMath math="|D| ≠ 0" />,{" "}
                                        {data?.payload?.tech_lang_keys["10"]} A,
                                        B, C{" "}
                                        {data?.payload?.tech_lang_keys["11"]}.
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="mt-3">
                                        {data?.payload?.tech_lang_keys["9"]}{" "}
                                        <InlineMath math="|D| = 0" />,{" "}
                                        {data?.payload?.tech_lang_keys["10"]} A,
                                        B, C{" "}
                                        {data?.payload?.tech_lang_keys["12"]}.
                                      </p>
                                    </>
                                  )}
                                </>
                              );
                            })()}
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

export default LinearIndependenceCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useGramSchmidtCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GramSchmidtCalculator = () => {
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
    tech_matrix2: "10",
    tech_matrix22: "10",
    tech_matrix31_1: "1",
    tech_matrix31_2: "5",
    tech_matrix31_3: "3",
    tech_matrix31_4: "12",
    tech_matrix31_5: "3",
    tech_matrix31_6: "3",
    tech_matrix31_7: "3",
    tech_matrix31_8: "45",
    tech_matrix31_9: "6",
    tech_matrix31_10: "6",
    tech_matrix32_1: "6",
    tech_matrix32_2: "6",
    tech_matrix32_3: "6",
    tech_matrix32_4: "6",
    tech_matrix32_5: "6",
    tech_matrix32_6: "6",
    tech_matrix32_7: "6",
    tech_matrix32_8: "6",
    tech_matrix32_9: "6",
    tech_matrix32_10: "6",
    tech_matrix33_1: "66",
    tech_matrix33_2: "3",
    tech_matrix33_3: "66",
    tech_matrix33_4: "7",
    tech_matrix33_5: "7",
    tech_matrix33_6: "6",
    tech_matrix33_7: "5",
    tech_matrix33_8: "4",
    tech_matrix33_9: "4",
    tech_matrix33_10: "3",
    tech_matrix34_1: "33",
    tech_matrix34_2: "3",
    tech_matrix34_3: "3",
    tech_matrix34_4: "3453",
    tech_matrix34_5: "45",
    tech_matrix34_6: "56",
    tech_matrix34_7: "456",
    tech_matrix34_8: "56",
    tech_matrix34_9: "4",
    tech_matrix34_10: "564",
    tech_matrix35_1: "4",
    tech_matrix35_2: "564",
    tech_matrix35_3: "654",
    tech_matrix35_4: "56",
    tech_matrix35_5: "46",
    tech_matrix35_6: "456",
    tech_matrix35_7: "456",
    tech_matrix35_8: "4",
    tech_matrix35_9: "564",
    tech_matrix35_10: "56",
    tech_matrix36_1: "456",
    tech_matrix36_2: "456",
    tech_matrix36_3: "4",
    tech_matrix36_4: "564",
    tech_matrix36_5: "56",
    tech_matrix36_6: "456",
    tech_matrix36_7: "46",
    tech_matrix36_8: "5",
    tech_matrix36_9: "564",
    tech_matrix36_10: "64",
    tech_matrix37_1: "6",
    tech_matrix37_2: "456",
    tech_matrix37_3: "456",
    tech_matrix37_4: "4",
    tech_matrix37_5: "564",
    tech_matrix37_6: "564",
    tech_matrix37_7: "6",
    tech_matrix37_8: "456",
    tech_matrix37_9: "456",
    tech_matrix37_10: "456",
    tech_matrix38_1: "4",
    tech_matrix38_2: "54",
    tech_matrix38_3: "564",
    tech_matrix38_4: "564",
    tech_matrix38_5: "564",
    tech_matrix38_6: "65",
    tech_matrix38_7: "456",
    tech_matrix38_8: "456",
    tech_matrix38_9: "456",
    tech_matrix38_10: "4",
    tech_matrix39_1: "564",
    tech_matrix39_2: "56",
    tech_matrix39_3: "46",
    tech_matrix39_4: "5",
    tech_matrix39_5: "4",
    tech_matrix39_6: "456",
    tech_matrix39_7: "456",
    tech_matrix39_8: "456",
    tech_matrix39_9: "4",
    tech_matrix39_10: "564",
    tech_matrix310_1: "56",
    tech_matrix310_2: "456",
    tech_matrix310_3: "5",
    tech_matrix310_4: "56",
    tech_matrix310_5: "456",
    tech_matrix310_6: "456",
    tech_matrix310_7: "456",
    tech_matrix310_8: "456",
    tech_matrix310_9: "4",
    tech_matrix310_10: "56",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGramSchmidtCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updated = { ...prevData, [name]: value };

      // Update matrix fields dynamically when rows/cols change
      if (name === "tech_matrix2" || name === "tech_matrix22") {
        const rows = parseInt(
          name === "tech_matrix2" ? value : updated.tech_matrix2 || "1"
        );
        const cols = parseInt(
          name === "tech_matrix22" ? value : updated.tech_matrix22 || "1"
        );

        for (let i = 1; i <= rows; i++) {
          for (let j = 1; j <= cols; j++) {
            const key = `tech_matrix3${i}_${j}`;
            if (!(key in updated)) {
              updated[key] = "0";
            }
          }
        }
      }

      return updated;
    });

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const matrix2 = Number(formData.tech_matrix2);
    const matrix22 = Number(formData.tech_matrix22);

    const matrixPayload = {
      tech_matrix2: matrix2,
      tech_matrix22: matrix22,
    };

    for (let i = 1; i <= matrix2; i++) {
      for (let j = 1; j <= matrix22; j++) {
        const key = `tech_matrix3${i}_${j}`;
        matrixPayload[key] = formData[key] || "0";
      }
    }

    try {
      const response = await calculateEbitCalculator(matrixPayload).unwrap();
      setResult(response); // Set the result from the response
      toast.success("Successfully Calculated");
    } catch (err) {
      const errorMessage = err?.data?.error || "An unexpected error occurred.";
      setFormError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_matrix2: "10",
      tech_matrix22: "10",
      tech_matrix31_1: "1",
      tech_matrix31_2: "5",
      tech_matrix31_3: "3",
      tech_matrix31_4: "12",
      tech_matrix31_5: "3",
      tech_matrix31_6: "3",
      tech_matrix31_7: "3",
      tech_matrix31_8: "45",
      tech_matrix31_9: "6",
      tech_matrix31_10: "6",
      tech_matrix32_1: "6",
      tech_matrix32_2: "6",
      tech_matrix32_3: "6",
      tech_matrix32_4: "6",
      tech_matrix32_5: "6",
      tech_matrix32_6: "6",
      tech_matrix32_7: "6",
      tech_matrix32_8: "6",
      tech_matrix32_9: "6",
      tech_matrix32_10: "6",
      tech_matrix33_1: "66",
      tech_matrix33_2: "3",
      tech_matrix33_3: "66",
      tech_matrix33_4: "7",
      tech_matrix33_5: "7",
      tech_matrix33_6: "6",
      tech_matrix33_7: "5",
      tech_matrix33_8: "4",
      tech_matrix33_9: "4",
      tech_matrix33_10: "3",
      tech_matrix34_1: "33",
      tech_matrix34_2: "3",
      tech_matrix34_3: "3",
      tech_matrix34_4: "3453",
      tech_matrix34_5: "45",
      tech_matrix34_6: "56",
      tech_matrix34_7: "456",
      tech_matrix34_8: "56",
      tech_matrix34_9: "4",
      tech_matrix34_10: "564",
      tech_matrix35_1: "4",
      tech_matrix35_2: "564",
      tech_matrix35_3: "654",
      tech_matrix35_4: "56",
      tech_matrix35_5: "46",
      tech_matrix35_6: "456",
      tech_matrix35_7: "456",
      tech_matrix35_8: "4",
      tech_matrix35_9: "564",
      tech_matrix35_10: "56",
      tech_matrix36_1: "456",
      tech_matrix36_2: "456",
      tech_matrix36_3: "4",
      tech_matrix36_4: "564",
      tech_matrix36_5: "56",
      tech_matrix36_6: "456",
      tech_matrix36_7: "46",
      tech_matrix36_8: "5",
      tech_matrix36_9: "564",
      tech_matrix36_10: "64",
      tech_matrix37_1: "6",
      tech_matrix37_2: "456",
      tech_matrix37_3: "456",
      tech_matrix37_4: "4",
      tech_matrix37_5: "564",
      tech_matrix37_6: "564",
      tech_matrix37_7: "6",
      tech_matrix37_8: "456",
      tech_matrix37_9: "456",
      tech_matrix37_10: "456",
      tech_matrix38_1: "4",
      tech_matrix38_2: "54",
      tech_matrix38_3: "564",
      tech_matrix38_4: "564",
      tech_matrix38_5: "564",
      tech_matrix38_6: "65",
      tech_matrix38_7: "456",
      tech_matrix38_8: "456",
      tech_matrix38_9: "456",
      tech_matrix38_10: "4",
      tech_matrix39_1: "564",
      tech_matrix39_2: "56",
      tech_matrix39_3: "46",
      tech_matrix39_4: "5",
      tech_matrix39_5: "4",
      tech_matrix39_6: "456",
      tech_matrix39_7: "456",
      tech_matrix39_8: "456",
      tech_matrix39_9: "4",
      tech_matrix39_10: "564",
      tech_matrix310_1: "56",
      tech_matrix310_2: "456",
      tech_matrix310_3: "5",
      tech_matrix310_4: "56",
      tech_matrix310_5: "456",
      tech_matrix310_6: "456",
      tech_matrix310_7: "456",
      tech_matrix310_8: "456",
      tech_matrix310_9: "4",
      tech_matrix310_10: "56",
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
    if (!Array.isArray(matrix)) return "";

    return matrix
      .map((row) => {
        if (Array.isArray(row)) {
          return row
            .map((val) => {
              const num = parseFloat(val);
              return isNaN(num) ? "0" : (Math.round(num * 10) / 10).toFixed(0);
            })
            .join(" & ");
        } else {
          const num = parseFloat(row);
          return isNaN(num) ? "0" : (Math.round(num * 10) / 10).toFixed(0);
        }
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

          <div className="lg:w-[100%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-3">
              <p className="col-span-12 text-[16px] font-bold">
                {data?.payload?.tech_lang_keys[1]}
              </p>

              <div className="md:col-span-3 col-span-5">
                <select
                  className="input"
                  name="tech_matrix2"
                  value={formData.tech_matrix2}
                  onChange={handleChange}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <p className="col-span-1 text-[16px] font-bold">X</p>

              <div className="md:col-span-3 col-span-5">
                <select
                  className="input"
                  name="tech_matrix22"
                  value={formData.tech_matrix22}
                  onChange={handleChange}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="col-span-12 text-[16px]">
              <strong>{data?.payload?.tech_lang_keys[3]}</strong>
            </p>
            <div className="col-span-12 overflow-auto">
              <table className=" mt-3 " width={900}>
                <tbody>
                  {Array.from({
                    length: parseInt(formData.tech_matrix2 || "1"),
                  }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({
                        length: parseInt(formData.tech_matrix22 || "1"),
                      }).map((_, colIndex) => {
                        const key = `tech_matrix3${rowIndex + 1}_${
                          colIndex + 1
                        }`;
                        return (
                          <td key={colIndex} className="px-2 py-1">
                            <input
                              type="number"
                              step="any"
                              className="input"
                              name={key}
                              value={formData[key] || ""}
                              onChange={handleChange}
                              placeholder="0"
                              required
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3 text-[16px] overflow-auto">
                      <p className="mt-2 text-[18px] font-bold">
                        {data?.payload?.tech_lang_keys[5]}
                      </p>

                      <BlockMath>
                        {`
                          \\begin{bmatrix}
                            ${renderMatrix(result?.tech_first_unit)}
                          \\end{bmatrix}
                          ${result?.tech_all_vecunit
                            ?.map(
                              (vec) => `
                              \\quad
                              \\begin{bmatrix}
                                ${renderMatrix(vec)}
                              \\end{bmatrix}`
                            )
                            .join("")}
                        `}
                      </BlockMath>

                      <p className="mt-4">{data?.payload?.tech_lang_keys[6]}</p>

                      <BlockMath>
                        {result?.tech_all_vec
                          ?.map((vec, i) => {
                            return `V_${
                              i + 1
                            } = \\begin{bmatrix} ${renderMatrix(
                              vec
                            )} \\end{bmatrix}`;
                          })
                          .join(",\\quad ")}
                      </BlockMath>

                      <p className="mt-4 text-[18px] font-bold">
                        Step by Step {data?.payload?.tech_lang_keys[8]}
                      </p>

                      <div className=" rounded-lg px-3 py-2 mt-2 ">
                        <BlockMath>
                          {`
                            \\text{${data?.payload?.tech_lang_keys[9]}},\\quad
                            \\vec{u_k} = \\vec{v_k} - \\sum_{j=1}^{k-1} \\text{proj}_{\\vec{u_j}}(\\vec{v_k})\\quad
                            \\text{${data?.payload?.tech_lang_keys[10]}}\\quad
                            \\text{proj}_{\\vec{u_j}}(\\vec{v_k}) = \\frac{\\vec{u_j} \\cdot \\vec{v_k}}{|\\vec{u_j}|^2} \\vec{u_j}\\quad
                            \\text{${data?.payload?.tech_lang_keys[11]}}.
                          `}
                        </BlockMath>

                        <BlockMath>
                          {`
                            \\text{${data?.payload?.tech_lang_keys[12]}}\\quad
                            \\vec{e_k} = \\frac{\\vec{u_k}}{|\\vec{u_k}|}
                          `}
                        </BlockMath>

                        {/* First step */}
                        <p className="mt-2 font-bold">
                          {data?.payload?.tech_lang_keys[13]} 1
                        </p>
                        <BlockMath>
                          {`
                            \\vec{u_1} = \\vec{v_1} = \\begin{bmatrix}
                              ${renderMatrix(result?.tech_all_vec?.[0])}
                            \\end{bmatrix}
                          `}
                        </BlockMath>

                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys[14]}{" "}
                          <a
                            href="https://calculator-logical.com/unit-vector-calculator/"
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Unit Vector Calculator
                          </a>
                        </p>

                        <BlockMath>
                          {`
                            \\vec{e_1} = \\frac{\\vec{u_1}}{|\\vec{u_1}|} = \\begin{bmatrix}
                              ${renderMatrix(result?.tech_first_unit)}
                            \\end{bmatrix}
                          `}
                        </BlockMath>

                        {/* Loop for remaining steps */}
                        {(result?.tech_pros_ans || []).map((proj, n) => (
                          <div key={n}>
                            <p className="mt-4 font-bold">
                              {data?.payload?.tech_lang_keys[13]} {n + 2}
                            </p>

                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys[15]}{" "}
                              <a
                                href="https://calculator-logical.com/vector-projection-calculator/"
                                className="text-blue-500 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Vector Projection Calculator
                              </a>
                            </p>

                            <BlockMath>
                              {`
                                \\text{proj}_{\\vec{u_1}}(\\vec{v_${n + 2}}) ${
                                n !== 0
                                  ? ` - \\text{proj}_{\\vec{u_2}}(\\vec{v_${
                                      n + 2
                                    }})`
                                  : ""
                              } = \\begin{bmatrix}
                                ${renderMatrix(proj)}
                              \\end{bmatrix}
                              `}
                            </BlockMath>

                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys[16]}
                            </p>

                            <BlockMath>
                              {`
                                \\vec{u_${n + 2}} = \\vec{v_${
                                n + 2
                              }} - \\text{proj}_{\\vec{u_1}}(\\vec{v_${
                                n + 2
                              }}) ${
                                n !== 0
                                  ? `- \\text{proj}_{\\vec{u_2}}(\\vec{v_${
                                      n + 2
                                    }})`
                                  : ""
                              } = \\begin{bmatrix}
                                ${renderMatrix(result?.tech_subtract?.[n])}
                              \\end{bmatrix}
                              `}
                            </BlockMath>

                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys[14]}
                            </p>

                            <BlockMath>
                              {`
                                \\vec{e_${n + 2}} = \\frac{\\vec{u_${
                                n + 2
                              }}}{|\\vec{u_${n + 2}}|} = \\begin{bmatrix}
                                  ${renderMatrix(result?.tech_all_vecunit?.[n])}
                                \\end{bmatrix}
                              `}
                            </BlockMath>
                          </div>
                        ))}
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

export default GramSchmidtCalculator;

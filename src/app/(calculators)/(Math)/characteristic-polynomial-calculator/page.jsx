"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useCharacteristicPolynomialCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CharacteristicPolynomialCalculator = () => {
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
    tech_matrix22: 2,
    tech_matrix31_1: 32,
    tech_matrix31_2: 52,
    tech_matrix32_1: 72,
    tech_matrix32_2: 92,
  });

  const [matrixSize, setMatrixSize] = useState(2);
  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCharacteristicPolynomialCalculatorMutation();

  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  });

  useEffect(() => {
    const fetchCurrency = async () => {
      const result = await getUserCurrency();
      if (result) setCurrency(result);
    };

    fetchCurrency();
  }, []);

  const handleMatrixSizeChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setMatrixSize(value);
      setFormData((prev) => ({
        ...prev,
        tech_matrix22: value,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_matrix22) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");

    try {
      const response = await calculateEbitCalculator(formData).unwrap();
      setResult(response?.payload);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  const handleReset = () => {
    const resetObj = {
      tech_matrix22: 2,
    };
    for (let i = 1; i <= 2; i++) {
      for (let j = 1; j <= 2; j++) {
        resetObj[`tech_matrix3${i}_${j}`] = i * 20 + j * 10; // sample default values
      }
    }
    setFormData(resetObj);
    setMatrixSize(2);
    setResult(null);
    setFormError(null);
  };

  const renderMatrix = (matrix) => {
    return matrix.map((row) => row.join(" & ")).join(" \\\\ ");
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <p className="col-span-12 text-[16px]">
                <strong>{data?.payload?.tech_lang_keys[1]}:</strong>
              </p>
              <div className="col-span-4">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={matrixSize}
                  onChange={handleMatrixSizeChange}
                  name="tech_matrix22"
                  className="input"
                  required
                />
              </div>
              <p className="col-span-12 text-[16px]">
                <strong>{data?.payload?.tech_lang_keys[2]}</strong>
              </p>
              <div className="col-span-12">
                <table className="w-full" id="matrix2">
                  <tbody>
                    {Array.from({ length: matrixSize }, (_, rowIndex) => (
                      <tr key={rowIndex}>
                        {Array.from({ length: matrixSize }, (_, colIndex) => {
                          const fieldName = `tech_matrix3${rowIndex + 1}_${
                            colIndex + 1
                          }`;
                          return (
                            <td key={colIndex}>
                              <div className="px-1 pt-2">
                                <input
                                  type="number"
                                  step="any"
                                  name={fieldName}
                                  value={formData[fieldName] || ""}
                                  onChange={handleChange}
                                  className="input"
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
                      <div className="w-full text-[16px]">
                        {/* Final Answer */}
                        <p className="mt-3 text-[18px] font-bold">
                          <InlineMath math={result?.tech_answer || ""} />
                        </p>

                        {/* Input Matrix Label */}
                        <p className="mt-3 font-bold">
                          {data?.payload?.tech_lang_keys[5]}:
                        </p>

                        {/* Input Matrix */}
                        <div className="mt-3">
                          <BlockMath
                            math={`\\begin{bmatrix} ${renderMatrix(
                              result?.tech_input_ma || []
                            )} \\end{bmatrix}`}
                          />
                        </div>

                        {/* Output Label */}
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[6]}
                        </p>

                        {/* Output Matrix */}
                        <div className="mt-3">
                          <BlockMath
                            math={`\\begin{bmatrix} ${renderMatrix(
                              result?.tech_matrix || []
                            )} \\end{bmatrix}`}
                          />
                        </div>

                        {/* Link */}
                        <div className="mt-3">
                          {data?.payload?.tech_lang_keys[7]}{" "}
                          <a
                            href="https://technical-calculator.com/determinant-calculator/"
                            className="text-blue-700"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Determinant Calculator
                          </a>
                        </div>

                        {/* Final Answer Again */}

                        <p className="mt-3 text-[18px] font-bold">
                          <InlineMath math={result?.tech_answer || ""} />
                        </p>
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

export default CharacteristicPolynomialCalculator;

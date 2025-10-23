"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useMatrixMultiplicationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MatrixMultiplicationCalculator = () => {
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
    tech_rows1: 2,
    tech_columns1: 2,
    tech_matrix2: 2,
    tech_matrix22: 2,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMatrixMultiplicationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Check all matrix values
    const matrixKeys = Object.keys(formData).filter(
      (key) => key.startsWith("tech_matrix") || key.startsWith("tech_matrix3")
    );

    for (const key of matrixKeys) {
      if (formData[key] === "") {
        setFormError("Please fill all matrix values.");
        return;
      }
    }

    // Step 2: Prepare full payload (including dimensions)
    const payload = {
      tech_rows1: Number(formData.tech_rows1),
      tech_columns1: Number(formData.tech_columns1),
      tech_matrix2: Number(formData.tech_matrix2),
      tech_matrix22: Number(formData.tech_matrix22),
      // Add matrix values dynamically
      ...matrixKeys.reduce((acc, key) => {
        acc[key] = Number(formData[key]);
        return acc;
      }, {}),
    };

    // Step 3: API call
    try {
      const response = await calculateEbitCalculator(payload).unwrap();
      setResult(response?.payload);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err?.data?.payload?.error || "Something went wrong");
      toast.error(err?.data?.payload?.error || "Calculation failed");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_rows1: 2,
      tech_columns1: 2,
      tech_matrix2: 2,
      tech_matrix22: 2,
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

  const generateMatrixInputs = (prefix, rowNum, cols) => {
    const inputs = [];
    for (let j = 1; j <= cols; j++) {
      const name = `${prefix}${rowNum}_${j}`; // ✅ Correct: tech_matrix1_1, tech_matrix3_2_1 etc.
      inputs.push(
        <td key={name}>
          <input
            type="number"
            name={name}
            className="input"
            value={formData[name] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [name]: e.target.value })
            }
            required
          />
        </td>
      );
    }
    return inputs;
  };

  const renderMatrixTable = (prefix, rowKey, colKey) => {
    const rows = parseInt(formData[rowKey]);
    const cols = parseInt(formData[colKey]);
    const table = [];

    for (let i = 1; i <= rows; i++) {
      table.push(
        <tr key={`${prefix}-row-${i}`}>
          {generateMatrixInputs(prefix, i, cols)}
        </tr>
      );
    }
    return table;
  };

  // result
  const rows1 = Number(formData.tech_rows1);
  const cols1 = Number(formData.tech_columns1);
  const matrix2 = Number(formData.tech_matrix2);
  const matrix22 = Number(formData.tech_matrix22);

  const getMatrixLatex = (prefix, rows, cols) => {
    let latex = `\\begin{bmatrix}`;
    for (let i = 1; i <= rows; i++) {
      const row = [];
      for (let j = 1; j <= cols; j++) {
        const key = `${prefix}${prefix === "tech_matrix3" ? "" : ""}${i}_${j}`;
        row.push(formData[key] || "0");
      }
      latex += row.join(" & ");
      if (i < rows) latex += " \\\\ ";
    }
    latex += `\\end{bmatrix}`;
    return latex;
  };

  const getStepMultiplicationLatex = () => {
    let latex = "\\begin{bmatrix}";
    for (let i = 1; i <= rows1; i++) {
      const row = [];
      for (let j = 1; j <= matrix22; j++) {
        const terms = [];
        for (let k = 1; k <= matrix2; k++) {
          const a = formData[`tech_matrix${i}_${k}`] || 0;
          const b = formData[`tech_matrix3${k}_${j}`] || 0;
          terms.push(`${a} \\times ${b}`);
        }
        row.push(`(${terms.join(" + ")})`);
      }
      latex += row.join(" & ");
      if (i < rows1) latex += " \\\\ ";
    }
    latex += "\\end{bmatrix}";
    return latex;
  };

  const getFinalResultLatex = () => {
    let latex = "\\begin{bmatrix}";
    for (let i = 1; i <= rows1; i++) {
      const row = [];
      for (let j = 1; j <= matrix22; j++) {
        let sum = 0;
        for (let k = 1; k <= matrix2; k++) {
          const a = parseFloat(formData[`tech_matrix${i}_${k}`]) || 0;
          const b = parseFloat(formData[`tech_matrix3${k}_${j}`]) || 0;
          sum += a * b;
        }
        row.push(sum);
      }
      latex += row.join(" & ");
      if (i < rows1) latex += " \\\\ ";
    }
    latex += "\\end{bmatrix}";
    return latex;
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

          <div className="lg:w-[100%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <p className="col-span-12">
                <strong>
                  {data?.payload?.tech_lang_keys["1"]}
                  {" A "}
                  {data?.payload?.tech_lang_keys["2"]}:
                </strong>
              </p>
              {/* Matrix A Row x Col */}

              <div className="col-span-2">
                <select
                  name="tech_rows1"
                  className="input"
                  value={formData.tech_rows1}
                  onChange={(e) =>
                    setFormData({ ...formData, tech_rows1: e.target.value })
                  }
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <p className="col-span-1 text-center">X</p>
              <div className="col-span-2">
                <select
                  name="tech_columns1"
                  className="input"
                  value={formData.tech_columns1}
                  onChange={(e) =>
                    setFormData({ ...formData, tech_columns1: e.target.value })
                  }
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <p className="col-span-12">
                <strong>
                  {data?.payload?.tech_lang_keys["1"]}
                  {" B "}
                  {data?.payload?.tech_lang_keys["2"]}:
                </strong>
              </p>
              {/* Matrix B Row x Col */}
              <div className="col-span-2">
                <select
                  name="tech_matrix2"
                  className="input"
                  value={formData.tech_matrix2}
                  onChange={(e) =>
                    setFormData({ ...formData, tech_matrix2: e.target.value })
                  }
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <p className="col-span-1 text-center">X</p>
              <div className="col-span-2">
                <select
                  name="tech_matrix22"
                  className="input"
                  value={formData.tech_matrix22}
                  onChange={(e) =>
                    setFormData({ ...formData, tech_matrix22: e.target.value })
                  }
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-4 col-span-12 font-bold">Matrix A</p>
              <div className="col-span-12">
                <table className="w-full ">
                  {renderMatrixTable(
                    "tech_matrix",
                    "tech_rows1",
                    "tech_columns1"
                  )}
                </table>
              </div>
              <p className="mt-4 col-span-12 font-bold">Matrix B</p>
              <div className="col-span-12">
                <table className="w-full ">
                  {renderMatrixTable(
                    "tech_matrix3",
                    "tech_matrix2",
                    "tech_matrix22"
                  )}
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

                  <div className="text-[16px] overflow-auto">
                    <p className="mt-2 text-[18px] font-bold">Matrix A:</p>
                    <BlockMath
                      math={getMatrixLatex("tech_matrix", rows1, cols1)}
                    />

                    <p className="mt-2 text-[18px] font-bold">Matrix B:</p>
                    <BlockMath
                      math={getMatrixLatex("tech_matrix3", matrix2, matrix22)}
                    />

                    <p className="mt-2 text-[18px] font-bold">
                      Multiplication Steps:
                    </p>
                    <BlockMath math={getStepMultiplicationLatex()} />

                    <p className="mt-2 text-[18px] font-bold">Final Result:</p>
                    <BlockMath math={getFinalResultLatex()} />
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

export default MatrixMultiplicationCalculator;

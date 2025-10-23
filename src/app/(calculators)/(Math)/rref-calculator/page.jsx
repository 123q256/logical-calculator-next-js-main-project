"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useRrefCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const NullSpaceCalculator = () => {
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
    tech_matrix2: "2",
    tech_matrix22: "2",
    tech_matrix31_1: "3",
    tech_matrix31_2: "5",
    tech_matrix32_1: "7",
    tech_matrix32_2: "9",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRrefCalculatorMutation();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  //       setResult(null);
  //   setFormError(null);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For matrix dimension inputs
    if (name === "tech_matrix2" || name === "tech_matrix22") {
      let val = Number(value);
      if (val > 10) val = 10;
      if (val < 1) val = 1;
      setFormData((prev) => ({ ...prev, [name]: val.toString() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isNum = (val) => !isNaN(parseFloat(val)) && isFinite(val);

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
      setResult(response);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err?.data?.error || "Something went wrong");
      toast.error(err?.data?.error || "Calculation failed");
    }
  };

  const matrix2 = Number(formData.tech_matrix2) || 2;
  const matrix22 = Number(formData.tech_matrix22) || 2;

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_matrix2: "2",
      tech_matrix22: "2",
      tech_matrix31_1: "3",
      tech_matrix31_2: "5",
      tech_matrix32_1: "7",
      tech_matrix32_2: "9",
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

  const gcd = (a, b) => {
    if (!b) return a;
    return gcd(b, a % b);
  };
  const convertFraction = (x) => {
    let sign = x < 0 ? "-" : "";
    x = Math.abs(x);

    // Round to 1 decimal place
    const rounded = parseFloat(x.toFixed(1));

    const whole = Math.floor(rounded);
    const frac = +(rounded - whole).toFixed(1); // ensures exactly 1 decimal

    const d = 10; // 1 decimal → denominator is 10
    const n = Math.round(frac * d);
    const g = gcd(n, d);

    const num = Math.round(n / g);
    const den = Math.round(d / g);

    if (num === 0) return `${sign}${whole}`;
    if (whole === 0) return `${sign}${num}/${den}`;
    return `${sign}${whole * den + num}/${den}`;
  };

  const matrix2x = parseInt(formData.tech_matrix2);
  const matrix22x = parseInt(formData.tech_matrix22);

  const renderMatrix = (matrix) => {
    if (!Array.isArray(matrix) || !Array.isArray(matrix[0])) return "";

    return matrix
      .map((row) =>
        row
          .map((val) => {
            const num = parseFloat(val);
            if (isNaN(num)) return "0";
            return convertFraction(+num.toFixed(1));
          })
          .join(" & ")
      )
      .join(" \\\\ ");
  };

  const renderInputMatrix = () => {
    const rows = [];
    for (let i = 1; i <= matrix2x; i++) {
      const row = [];
      for (let j = 1; j <= matrix22x; j++) {
        const key = `tech_matrix3${i}_${j}`;
        const value = parseFloat(formData[key] || "0");
        row.push(convertFraction(+value.toFixed(1))); // round to 1 decimal before convert
      }
      rows.push(row.join(" & "));
    }
    return rows.join(" \\\\ ");
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

          <div className="lg:w-[80%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <p className="col-span-12 text-[16px] text-blue px-1">
                <strong>{data?.payload?.tech_lang_keys[1]}:</strong>
              </p>
              <div className="col-span-3">
                <input
                  type="number"
                  step="any"
                  name="tech_matrix2"
                  id="tech_matrix2"
                  className="input my-2"
                  min="1"
                  max="10"
                  placeholder="00"
                  value={formData.tech_matrix2}
                  onChange={handleChange}
                  required
                />
              </div>

              <p className="col-span-1 mt-3 text-[16px] text-center px-1">
                <strong>X</strong>
              </p>

              <div className="col-span-3">
                <input
                  type="number"
                  step="any"
                  name="tech_matrix22"
                  id="tech_matrix22"
                  className="input my-2"
                  min="1"
                  max="10"
                  placeholder="00"
                  value={formData.tech_matrix22}
                  onChange={handleChange}
                  required
                />
              </div>
              <p className="col-span-12 text-[16px] text-blue px-1">
                <strong>{data?.payload?.tech_lang_keys[3]}</strong>
              </p>
              <div className="col-span-12 overflow-x-auto">
                <table className="md:w-full" width={300} id="matrix2">
                  <tbody>
                    {Array.from({ length: matrix2 }, (_, rowIdx) => (
                      <tr key={rowIdx}>
                        {Array.from({ length: matrix22 }, (_, colIdx) => {
                          const inputName = `tech_matrix3${rowIdx + 1}_${
                            colIdx + 1
                          }`;
                          return (
                            <td key={colIdx}>
                              <div className="px-1 pt-2">
                                <input
                                  type="number"
                                  step="any"
                                  name={inputName}
                                  id={inputName}
                                  className="input my-2"
                                  placeholder="00"
                                  value={formData[inputName] || ""}
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
                    <div className="w-full mt-3 text-[16px] overflow-auto">
                      <p className="mt-2 text-[18px] font-bold">
                        {data?.payload?.tech_lang_keys[4]}
                      </p>
                      <BlockMath
                        math={`\\begin{bmatrix} ${renderMatrix(
                          result?.tech_matrix || []
                        )} \\end{bmatrix}`}
                      />

                      <p className="mt-2 font-bold">
                        {data?.payload?.tech_lang_keys[5]}
                      </p>
                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys[6]}:
                      </p>
                      <BlockMath
                        math={`\\begin{bmatrix} ${renderInputMatrix()} \\end{bmatrix}`}
                      />

                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys[7]}:
                      </p>
                      {Array.isArray(result?.tech_swap) &&
                        result.tech_swap.map((mat, idx) => (
                          <div key={idx} className="mt-2">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: result.tech_swap_line[idx],
                              }}
                            />
                            <BlockMath
                              math={`\\begin{bmatrix} ${renderMatrix(
                                mat
                              )} \\end{bmatrix}`}
                            />
                          </div>
                        ))}
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

export default NullSpaceCalculator;

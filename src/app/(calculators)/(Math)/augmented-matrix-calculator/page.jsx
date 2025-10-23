"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAugmentedMatrixCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AugmentedMatrixCalculator = () => {
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
    tech_matrix2: "5",
    tech_matrix22: "5",
    tech_matrix31_1: "3",
    tech_matrix31_2: "5",
    tech_matrix31_3: "1",
    tech_matrix31_4: "2",
    tech_matrix31_5: "3",
    tech_matrix32_1: "7",
    tech_matrix32_2: "9",
    tech_matrix32_3: "1",
    tech_matrix32_4: "1",
    tech_matrix32_5: "4",
    tech_matrix33_1: "2",
    tech_matrix33_2: "4",
    tech_matrix33_3: "2",
    tech_matrix33_4: "3",
    tech_matrix33_5: "6",
    tech_matrix34_1: "5",
    tech_matrix34_2: "2",
    tech_matrix34_3: "3",
    tech_matrix34_4: "5",
    tech_matrix34_5: "6",
    tech_matrix35_1: "7",
    tech_matrix35_2: "2",
    tech_matrix35_3: "3",
    tech_matrix35_4: "5",
    tech_matrix35_5: "7",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAugmentedMatrixCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      setResult(response);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err?.data?.error || "Something went wrong");
      toast.error(err?.data?.error || "Error occurred");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_matrix2: "5",
      tech_matrix22: "5",
      tech_matrix31_1: "3",
      tech_matrix31_2: "5",
      tech_matrix31_3: "1",
      tech_matrix31_4: "2",
      tech_matrix31_5: "3",
      tech_matrix32_1: "7",
      tech_matrix32_2: "9",
      tech_matrix32_3: "1",
      tech_matrix32_4: "1",
      tech_matrix32_5: "4",
      tech_matrix33_1: "2",
      tech_matrix33_2: "4",
      tech_matrix33_3: "2",
      tech_matrix33_4: "3",
      tech_matrix33_5: "6",
      tech_matrix34_1: "5",
      tech_matrix34_2: "2",
      tech_matrix34_3: "3",
      tech_matrix34_4: "5",
      tech_matrix34_5: "6",
      tech_matrix35_1: "7",
      tech_matrix35_2: "2",
      tech_matrix35_3: "3",
      tech_matrix35_4: "5",
      tech_matrix35_5: "7",
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

  const convert = (x) => {
    const gcd = (a, b) => (!b ? a : gcd(b, a % b));
    const roundTo = (num, places) => {
      const factor = Math.pow(10, places);
      return Math.round(num * factor) / factor;
    };

    const x2 = roundTo(parseFloat(x), 10);
    const absx = Math.abs(x2);
    const y = Math.floor(absx);
    const frac = absx - y;

    if (frac === 0) {
      return [String(x2), 1]; // no denominator needed
    }

    const fracStr = frac.toString().split(".")[1] || "";
    const den = Math.pow(10, fracStr.length);
    const num = Math.round(frac * den);
    const g = gcd(num, den);

    const num2 = Math.round(num / g);
    const den2 = Math.round(den / g);
    const whole = y;

    const top = num2 + whole * den2;
    const sign = x2 < 0 ? "-" : "";

    return [sign + top, den2];
  };

  const matrix2 = Number(formData.tech_matrix2);
  const matrix22 = Number(formData.tech_matrix22);

  const renderMatrix = (matrix, matrix22) => {
    const rows = matrix
      .map((row) =>
        row
          .map((val) => {
            const number = parseFloat(val);
            if (!isNaN(number)) {
              if (number === 0) return "0";
              const [top, bottom] = convert(number);
              return bottom === 1 ? top : `\\frac{${top}}{${bottom}}`;
            }
            return val;
          })
          .join(" & ")
      )
      .join(" \\\\ ");

    return (
      <BlockMath>
        {`\\left[\\begin{array}{${"c".repeat(
          matrix22
        )}} ${rows} \\end{array}\\right]`}
      </BlockMath>
    );
  };

  const renderInitialMatrix = (formData, matrix2, matrix22) => {
    const rows = Array.from({ length: matrix2 }, (_, i) =>
      Array.from({ length: matrix22 }, (_, j) => {
        const key = `tech_matrix3${i + 1}_${j + 1}`;
        return formData[key] || "0";
      }).join(" & ")
    ).join(" \\\\ ");

    return <BlockMath>{`\\begin{bmatrix} ${rows} \\end{bmatrix}`}</BlockMath>;
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

          <div className="lg:w-[100%] md:w-[100%] w-full mx-auto">
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
            <p className="col-span-12 text-[16px] text-blue px-1 font-bold">
              {data?.payload?.tech_lang_keys[3]}
            </p>
            <div className="col-span-12 overflow-auto">
              <table id="matrix2" width={750}>
                <tbody>
                  {Array.from({ length: Number(formData.tech_matrix2) }).map(
                    (_, rowIndex) => (
                      <tr key={rowIndex}>
                        {Array.from({
                          length: Number(formData.tech_matrix22),
                        }).map((_, colIndex) => {
                          const name = `tech_matrix3${rowIndex + 1}_${
                            colIndex + 1
                          }`;
                          return (
                            <td key={colIndex}>
                              <div className="px-1 pt-2">
                                <input
                                  type="number"
                                  step="any"
                                  name={name}
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData[name] || ""}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    )
                  )}
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
                    <div className="w-full overflow-auto text-[16px]">
                      <p className="mt-2 text-[18px] font-bold">
                        <InlineMath
                          math={`\\text{${
                            data?.payload?.tech_lang_keys[5] || ""
                          }}`}
                        />
                      </p>

                      {result?.tech_pz &&
                        renderMatrix(result.tech_pz, matrix22)}

                      <p className="mt-2">
                        <strong>{data?.payload?.tech_lang_keys[6]}</strong>
                      </p>

                      {renderInitialMatrix(formData, matrix2, matrix22)}

                      <p className="mt-2">
                        <strong>{data?.payload?.tech_lang_keys[7]}</strong>
                      </p>

                      {result?.tech_swap_line?.map((lineText, index) => (
                        <div key={index} className="my-2">
                          <p dangerouslySetInnerHTML={{ __html: lineText }} />
                          {renderMatrix(result.tech_swap?.[index], matrix22)}
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

export default AugmentedMatrixCalculator;

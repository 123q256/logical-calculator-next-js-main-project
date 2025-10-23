"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useNullSpaceCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

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
    tech_row: 3,
    tech_colum: 5,
    tech_matrix_0_0: "1",
    tech_matrix_0_1: "9",
    tech_matrix_0_2: "8",
    tech_matrix_0_3: "1",
    tech_matrix_0_4: "2",
    tech_matrix_1_0: "1",
    tech_matrix_1_1: "2",
    tech_matrix_1_2: "0",
    tech_matrix_1_3: "1",
    tech_matrix_1_4: "6",
    tech_matrix_2_0: "7",
    tech_matrix_2_1: "1",
    tech_matrix_2_2: "1",
    tech_matrix_2_3: "2",
    tech_matrix_2_4: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useNullSpaceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const matrixPayload = {
      tech_row: formData.tech_row,
      tech_colum: formData.tech_colum,
    };

    for (let i = 0; i < formData.tech_row; i++) {
      for (let j = 0; j < formData.tech_colum; j++) {
        const key = `tech_matrix_${i}_${j}`;
        matrixPayload[key] = formData[key] || "0";
      }
    }

    try {
      const response = await calculateEbitCalculator(matrixPayload).unwrap();
      setResult(response?.payload);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data?.payload?.error || "Something went wrong");
      toast.error(err.data?.payload?.error || "Calculation failed");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_row: 3,
      tech_colum: 5,
      tech_matrix_0_0: "1",
      tech_matrix_0_1: "9",
      tech_matrix_0_2: "8",
      tech_matrix_0_3: "1",
      tech_matrix_0_4: "2",
      tech_matrix_1_0: "1",
      tech_matrix_1_1: "2",
      tech_matrix_1_2: "0",
      tech_matrix_1_3: "1",
      tech_matrix_1_4: "6",
      tech_matrix_2_0: "7",
      tech_matrix_2_1: "1",
      tech_matrix_2_2: "1",
      tech_matrix_2_3: "2",
      tech_matrix_2_4: "1",
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

  const row = parseInt(formData.tech_row);
  const col = parseInt(formData.tech_colum);

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
                <strong>{data?.payload?.tech_lang_keys[1]}:</strong>
              </p>
              <div className="col-span-2">
                <select
                  name="tech_row"
                  value={formData.tech_row}
                  onChange={handleChange}
                  className="input"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <p className="col-span-1 flex items-center font-bold">X</p>
              <div className="col-span-2">
                <select
                  name="tech_colum"
                  value={formData.tech_colum}
                  onChange={handleChange}
                  className="input"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-12 overflow-x-auto mt-4">
                <table className="matrix_table w-full">
                  <tbody>
                    {[...Array(row)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(col)].map((_, j) => {
                          const name = `tech_matrix_${i}_${j}`;
                          return (
                            <td key={j} className="p-1">
                              <input
                                type="number"
                                step="any"
                                name={name}
                                className="input"
                                value={formData[name] || ""}
                                onChange={handleChange}
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
            <div className="col-span-12 ">
              <div className="col-span-12">
                <button
                  type="button"
                  id="dtrmn_gen_btn"
                  onClick={handleGenerateRandom}
                  className="px-3 py-2 mt-1 mx-1 addmore cursor-pointer bg-[#2845F5] md:text-[16px] text-[14px] text-white rounded-lg"
                >
                  {data?.payload?.tech_lang_keys["2"]}
                </button>

                <button
                  type="button"
                  id="dtrmn_clr_btn"
                  onClick={handleClearInputs}
                  className="px-3 py-2 mt-1 mx-1 addmore cursor-pointer bg-[#2845F5] md:text-[16px] text-[14px] text-white rounded-lg"
                >
                  {data?.payload?.tech_lang_keys["3"]}
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
                      <div className="w-full">
                        <div className="w-full text-[16px] overflow-auto">
                          {/* Entered Matrix */}
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["4"]}:
                          </p>
                          <BlockMath math={`${result?.tech_enter}`} />

                          {/* RREF Matrix */}
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["5"]}:
                          </p>
                          <BlockMath math={`${result?.tech_rref}`} />

                          {/* Augmented system */}
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["6"]}:
                          </p>
                          <BlockMath
                            math={`${result?.tech_rref}\\left[\\begin{matrix}${[
                              ...Array(Number(result?.tech_colum)).keys(),
                            ]
                              .map((i) => `x_${i + 1}`)
                              .join(
                                "\\\\"
                              )}\\end{matrix}\\right] = \\left[\\begin{matrix}${[
                              ...Array(Number(result?.tech_row)).keys(),
                            ]
                              .map(() => "0")
                              .join("\\\\")}\\end{matrix}\\right]`}
                          />

                          {/* Null Space */}
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["7"]}:
                          </p>
                          {Number(result?.tech_total) === 0 ? (
                            <BlockMath
                              math={`\\left[\\begin{matrix}${[
                                ...Array(Number(result?.tech_row)).keys(),
                              ]
                                .map(() => "0")
                                .join("\\\\")}\\end{matrix}\\right]`}
                            />
                          ) : (
                            <BlockMath math={result?.tech_null} />
                          )}

                          {/* Total Nullity */}
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["8"]}:{" "}
                            {result?.tech_total}
                          </p>
                        </div>
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

export default NullSpaceCalculator;

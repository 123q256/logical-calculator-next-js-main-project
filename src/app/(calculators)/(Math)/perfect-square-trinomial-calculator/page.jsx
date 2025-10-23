"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  usePerfectSquareTrinomialCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PerfectSquareTrinomialCalculator = () => {
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
    tech_A: 7,
    tech_B: -10,
    tech_C: 13,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePerfectSquareTrinomialCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_A || !formData.tech_B || !formData.tech_C) {
      setFormError("Please fill in input.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_A: formData.tech_A,
        tech_B: formData.tech_B,
        tech_C: formData.tech_C,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_A: 7,
      tech_B: -10,
      tech_C: 13,
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

  const a = parseFloat(formData?.tech_A);
  const b = parseFloat(formData?.tech_B);
  const c = parseFloat(formData?.tech_C);
  const delta = parseFloat(result?.tech_sd);
  const isZero = delta === 0;

  const first = Math.sqrt(a);
  const second = Math.sqrt(c);
  const firstIsInt = Number.isInteger(first);
  const secondIsInt = Number.isInteger(second);

  const getFactorForm = () => {
    const sign = b < 0 ? " - " : " + ";
    const absB = Math.abs(b);
    const absSecond = Math.abs(second);

    if (firstIsInt && secondIsInt) {
      return (
        <BlockMath
          math={`${a}x^2 ${sign}${absB}x ${sign}${Math.abs(
            c
          )} = (${first}x${sign}${absSecond})^2`}
        />
      );
    } else if (!firstIsInt && !secondIsInt) {
      return (
        <BlockMath
          math={`${a}x^2 ${sign}${absB}x ${sign}${Math.abs(
            c
          )} = (\\sqrt{${a}}x${sign}\\sqrt{${Math.abs(c)}})^2`}
        />
      );
    } else if (firstIsInt && !secondIsInt) {
      return (
        <BlockMath
          math={`${a}x^2 ${sign}${absB}x ${sign}${Math.abs(
            c
          )} = (${first}x${sign}\\sqrt{${Math.abs(c)}})^2`}
        />
      );
    } else {
      return (
        <BlockMath
          math={`${a}x^2 ${sign}${absB}x ${sign}${Math.abs(
            c
          )} = (\\sqrt{${a}}x${sign}${absSecond})^2`}
        />
      );
    }
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
            <div className="grid grid-cols-12 mt-3  gap-2 md:gap-4 lg:gap-4">
              <p className="col-span-12 text-center my-3 text-[20px]">
                <strong>
                  <InlineMath math="Ax^2 + Bx + C" />
                </strong>
              </p>
              <div className="col-span-4">
                <label htmlFor="tech_A" className="label">
                  A
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_A"
                    id="tech_A"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_A}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-4">
                <label htmlFor="tech_B" className="label">
                  B
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_B"
                    id="tech_B"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_B}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-4">
                <label htmlFor="tech_C" className="label">
                  C
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_C"
                    id="tech_C"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_C}
                    onChange={handleChange}
                  />
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
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%] mt-2 text-[16px] overflow-auto">
                        <table className="w-full">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="60%">
                                <strong>Δ =</strong>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_sd}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full overflow-auto">
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys[2]} Δ{" "}
                          {isZero ? "= 0," : "≠ 0,"}{" "}
                          {data?.payload?.tech_lang_keys[3]}
                          {isZero
                            ? ` ${data?.payload?.tech_lang_keys[6]}!`
                            : `${data?.payload?.tech_lang_keys[4]}${data?.payload?.tech_lang_keys[5]}.`}
                        </p>

                        <div className="w-full text-[18px] mt-2">
                          <p>
                            {data?.payload?.tech_lang_keys[7]} : {a}x²{" "}
                            {b < 0 ? "- " : "+ "}
                            {Math.abs(b)}x {c < 0 ? "- " : "+ "}
                            {Math.abs(c)} = 0
                          </p>
                          <p>{data?.payload?.tech_lang_keys[8]} Δ = b² - 4ac</p>
                          <p>
                            <InlineMath math={`a=${a},\\ b=${b},\\ c=${c}`} />
                          </p>
                          <p>{data?.payload?.tech_lang_keys["put"]}</p>
                          <BlockMath
                            math={`\\Delta = (${b})^2 - 4 \\times ${a} \\times ${c}`}
                          />
                          <BlockMath
                            math={`\\Delta = ${b * b} - ${4 * a * c}`}
                          />
                          <BlockMath math={`\\Delta = ${delta}`} />

                          {isZero && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[9]} p²x² + 2pqx +
                                q² = (px + q)²,{" "}
                                {data?.payload?.tech_lang_keys[10]}
                              </p>
                              {getFactorForm()}
                            </>
                          )}
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

export default PerfectSquareTrinomialCalculator;

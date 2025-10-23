"use client";
import React, { useEffect, useState, useMemo } from "react";

import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useAmplitudeAndPeriodCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AmplitudeAndPeriodCalculator = () => {
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
    tech_trigonometric_unit: "1",
    tech_first_number: 2,
    tech_second_number: 3,
    tech_third_number: 4,
    tech_fourth_number: 5,
    tech_x_not: 1,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAmplitudeAndPeriodCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_trigonometric_unit) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_trigonometric_unit: formData.tech_trigonometric_unit,
        tech_first_number: formData.tech_first_number,
        tech_second_number: formData.tech_second_number,
        tech_third_number: formData.tech_third_number,
        tech_fourth_number: formData.tech_fourth_number,
        tech_x_not: formData.tech_x_not,
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
      tech_trigonometric_unit: "1",
      tech_first_number: 2,
      tech_second_number: 3,
      tech_third_number: 4,
      tech_fourth_number: 5,
      tech_x_not: 1,
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

  function changeCoefficient(number) {
    if (number === -1) return "-";
    if (number !== 1) return number;
    return "";
  }

  function changeFunction(sinOrCos, A, B, C, D) {
    let result = changeCoefficient(A);
    result += sinOrCos === 1 ? "\\sin" : "\\cos";
    result += "(";
    result += changeCoefficient(B) + "x";
    result += C < 0 ? " + " + Math.abs(C) : " - " + C;
    result += ")";
    result += D < 0 ? " - " + Math.abs(D) : " + " + D;
    return result;
  }

  const answerLatex = useMemo(() => {
    if (!result) return "";
    return changeFunction(
      Number(result.operation),
      Number(result.first_number),
      Number(result.fifth_number),
      Number(result.sixth_number),
      Number(result.fourth_number)
    );
  }, [result]);

  const finalValue = useMemo(() => {
    if (!formData?.tech_x_not || !result) return null;

    const x = Number(formData.tech_x_not);
    const A = Number(result.first_number);
    const B = Number(result.fifth_number);
    const C = Number(result.sixth_number);
    const D = Number(result.fourth_number);

    const angle = B * x;
    const cosC = Math.cos(C);
    const sinC = Math.sin(C);
    const cosBx = Math.cos(angle);
    const sinBx = Math.sin(angle);

    let firstSection = 0;
    if (result.operation === "1") {
      firstSection =
        C > 0 ? sinBx * cosC - cosBx * sinC : sinBx * cosC + cosBx * sinC;
    } else {
      firstSection =
        C > 0 ? cosBx * cosC - sinBx * sinC : cosBx * cosC + sinBx * sinC;
    }

    return A * firstSection + D;
  }, [formData, result]);

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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_trigonometric_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_trigonometric_unit"
                    id="tech_trigonometric_unit"
                    value={formData.tech_trigonometric_unit}
                    onChange={handleChange}
                  >
                    <option value="1">sine </option>
                    <option value="2">cosine </option>
                  </select>
                </div>
              </div>

              {formData.tech_trigonometric_unit === "2" ? (
                <p className="col-span-12 text-center my-3">
                  <InlineMath math={"f(x) = A \\cdot \\cos(Bx - C) + D"} />
                </p>
              ) : (
                <p className="col-span-12 text-center my-3">
                  <InlineMath math={"f(x) = A \\cdot \\sin(Bx - C) + D"} />
                </p>
              )}
              <div className="col-span-6">
                <label htmlFor="tech_first_number" className="label">
                  A
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_first_number"
                    id="tech_first_number"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_first_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_second_number" className="label">
                  B
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_second_number"
                    id="tech_second_number"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_second_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_third_number" className="label">
                  C
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_third_number"
                    id="tech_third_number"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_third_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_fourth_number" className="label">
                  D
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_fourth_number"
                    id="tech_fourth_number"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_fourth_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_x_not" className="label">
                  x₀
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x_not"
                    id="tech_x_not"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x_not}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {data?.payload?.tech_lang_keys["2"]}
                  </span>
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
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
                        <div className="w-full overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              {formData?.tech_x_not && (
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>f(x₀)</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {finalValue?.toFixed(6)}
                                  </td>
                                </tr>
                              )}
                              <tr>
                                <td className="py-2 border-b" width="40%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys?.[3]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <InlineMath math={`f(x) = ${answerLatex}`} />
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys?.[4]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.first_number).toFixed(4)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys?.[5]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.second_number).toFixed(6)} π
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys?.[6]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.third_number).toFixed(6)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys?.[7]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.fourth_number).toFixed(4)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
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

export default AmplitudeAndPeriodCalculator;

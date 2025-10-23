"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAverageRateOfChangeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AverageRateOfChangeCalculator = () => {
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
    tech_x: "x^2+3",
    tech_x1: "3",
    tech_x2: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAverageRateOfChangeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x || !formData.tech_x1) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_x1: formData.tech_x1,
        tech_x2: formData.tech_x2,
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
      tech_x: "x^2+3",
      tech_x1: "3",
      tech_x2: "4",
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

  const equation = result?.tech_eq;
  const x1 = formData?.tech_x1;
  const x2 = formData?.tech_x2;
  const fx1 = result?.tech_fx1;
  const fx2 = result?.tech_fx2;

  // Replace 'x' with (value) in the function expression for substitution
  const fOfX1 = equation?.replace(/x/g, `(${x1})`);
  const fOfX2 = equation?.replace(/x/g, `(${x2})`);

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

          <div className="lg:w-[50%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["1"]}{" "}
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_x"
                    id="tech_x"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_x1" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (x₁):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x1"
                    id="tech_x1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_x2" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (x₂):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x2"
                    min="1"
                    id="tech_x2"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x2}
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
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <InlineMath math={String(result?.tech_ans)} />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px] overflow-auto">
                          <div className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["6"]}:
                            </strong>
                          </div>

                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys["3"]}:
                          </div>

                          <div className="mt-3">
                            <InlineMath math={`f(x) = ${equation}`} />{" "}
                            {data?.payload?.tech_lang_keys["4"]} ={" "}
                            <InlineMath math={`[${x1}, ${x2}]`} />
                          </div>

                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys["7"]}
                          </div>

                          <div className="mt-3">
                            <InlineMath math={`\\frac{f(b) - f(a)}{b - a}`} />
                          </div>

                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys["8"]}
                          </div>

                          <div className="mt-3">
                            <InlineMath
                              math={`a = ${x2},\\ b = ${x1},\\ f(x) = ${equation}`}
                            />
                          </div>

                          <div className="mt-3">
                            Step 1: Evaluate the Function for a and b
                          </div>

                          <div className="mt-3">
                            <InlineMath
                              math={`f(a) = f(${x1}) = (${fOfX1}) = ${fx1}`}
                            />
                          </div>

                          <div className="mt-3">
                            <InlineMath
                              math={`f(b) = f(${x2}) = (${fOfX2}) = ${fx2}`}
                            />
                          </div>

                          <p className="mt-3">
                            Step 2: Use the Average Rate of Change Formula
                          </p>

                          <div className="mt-3">
                            <InlineMath
                              math={`\\frac{f(b) - f(a)}{b - a} = \\frac{(${fx2}) - (${fx1})}{${x2} - ${x1}}`}
                            />
                          </div>

                          <div className="mt-3">
                            <InlineMath
                              math={`\\frac{f(b) - f(a)}{b - a} = \\frac{${
                                fx2 - fx1
                              }}{${x2 - x1}}`}
                            />
                          </div>

                          <div className="mt-3">
                            <InlineMath
                              math={`\\frac{f(b) - f(a)}{b - a} = ${result?.tech_ans}`}
                            />
                          </div>

                          <div className="mt-3">
                            The average rate of change is = {result?.tech_ans}
                          </div>
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

export default AverageRateOfChangeCalculator;

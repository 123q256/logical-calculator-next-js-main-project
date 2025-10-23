"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useLimitCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LimitCalculator = () => {
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
    tech_EnterEq: "(6x + 4)/(3x - 1)",
    tech_with: "x",
    tech_how: "1",
    tech_dir: "+",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLimitCalculatorMutation();

  const [showKeyboard, setShowKeyboard] = useState(false);

  const toggleKeyboard = () => {
    setShowKeyboard((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleKeyClick = (value) => {
    setFormData((prev) => ({
      ...prev,
      tech_EnterEq: (prev.tech_EnterEq || "") + value,
    }));
    setResult(null);
    setFormError(null);
  };

  const clearInput = () => {
    setFormData((prev) => ({ ...prev, tech_EnterEq: "" }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_EnterEq) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_EnterEq: formData.tech_EnterEq,
        tech_with: formData.tech_with,
        tech_how: formData.tech_how,
        tech_dir: formData.tech_dir,
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
      tech_EnterEq: "(6x + 4)/(3x - 1)",
      tech_with: "x",
      tech_how: "1",
      tech_dir: "+",
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="lg:col-span-9 md:col-span-9 col-span-12">
                <label htmlFor="tech_EnterEq" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="w-full py-2 relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_EnterEq"
                    id="tech_EnterEq"
                    className="input "
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_EnterEq}
                    onChange={handleChange}
                  />
                  <img
                    src="/images/keyboard.png"
                    className="keyboardImg absolute right-2 top-8 cursor-pointer transform -translate-y-1/2 w-9 h-9"
                    alt="keyboard"
                    loading="lazy"
                    decoding="async"
                    onClick={toggleKeyboard}
                  />
                </div>
              </div>
              <div className="lg:col-span-3 md:col-span-3 col-span-12">
                <label htmlFor="tech_with" className="label">
                  W.R.T:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_with"
                    id="tech_with"
                    value={formData.tech_with}
                    onChange={handleChange}
                  >
                    <option value="a">a</option>
                    <option value="b">b</option>
                    <option value="c">c</option>
                    <option value="n">n</option>
                    <option value="x">x</option>
                    <option value="y">y</option>
                    <option value="z">z</option>
                  </select>
                </div>
              </div>
              {showKeyboard && (
                <div className="col-span-12 keyboard grid grid-cols-9 gap-1 mt-2">
                  <button
                    type="button"
                    className="bg-blue-700 cursor-pointer text-white rounded-sm h-9 px-2 uppercase shadow-md hover:bg-blue-600"
                    onClick={clearInput}
                  >
                    CLS
                  </button>
                  {["+", "-", "/", "*", "^", "sqrt(", "(", ")"].map(
                    (keyVal, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="keyBtn bg-blue-700 cursor-pointer text-white rounded-sm h-9 px-2 uppercase shadow-md hover:bg-blue-600"
                        onClick={() => handleKeyClick(keyVal)}
                      >
                        {keyVal === "sqrt(" ? "√" : keyVal}
                      </button>
                    )
                  )}
                </div>
              )}

              <div className="lg:col-span-9 md:col-span-9 col-span-12">
                <label htmlFor="tech_how" className="label">
                  {data?.payload?.tech_lang_keys["3"]} (inf = ∞ , pi = π):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_how"
                    id="tech_how"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_how}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="lg:col-span-3 md:col-span-3 col-span-12">
                <label htmlFor="tech_dir" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_dir"
                    id="tech_dir"
                    value={formData.tech_want}
                    onChange={handleChange}
                  >
                    <option value="+">+</option>
                    <option value="-">-</option>
                  </select>
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

                  <div className="rounded-lg p-4 flex items-center justify-center">
                    <div className="w-full rounded-lg mt-3">
                      <div className="flex flex-wrap">
                        <div className="w-full text-base overflow-auto">
                          {/* Main limit expression */}
                          <p className="mt-3 text-lg">
                            <BlockMath
                              math={`\\lim_{ ${formData?.tech_with} \\to ${result?.tech_inf}^{${result?.tech_dir}} } (${result?.tech_enter}) = ${result?.tech_ans}`}
                            />
                          </p>

                          {/* Language key 8 */}
                          <p className="mt-3 font-bold">
                            {data?.payload?.tech_lang_keys[8]}
                          </p>

                          {/* Limit again */}
                          <p className="mt-3">
                            <BlockMath
                              math={`\\lim_{ ${formData?.tech_with} \\to ${result?.tech_inf}^{${result?.tech_dir}} } (${result?.tech_enter})`}
                            />
                          </p>

                          {/* Language key 9 */}
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[9]}:
                          </p>

                          {/* Put value */}
                          <p className="mt-3">
                            <BlockMath math={`= ${result?.tech_put}`} />
                          </p>

                          {/* Conditional fraction */}
                          {result?.tech_upr !== undefined &&
                            result?.tech_btm !== undefined && (
                              <p className="mt-3">
                                <BlockMath
                                  math={
                                    result.tech_upr < 0 &&
                                    result.tech_btm < 0 &&
                                    result.tech_upr !== 0 &&
                                    result.tech_btm !== 0
                                      ? `= \\dfrac{${Math.abs(
                                          result.tech_upr
                                        )}}{${Math.abs(result.tech_btm)}}`
                                      : result.tech_btm < 0 &&
                                        result.tech_upr !== 0 &&
                                        result.tech_btm !== 0
                                      ? `= \\dfrac{-${Math.abs(
                                          result.tech_upr
                                        )}}{${Math.abs(result.tech_btm)}}`
                                      : `= \\dfrac{${result.tech_upr}}{${result.tech_btm}}`
                                  }
                                />
                              </p>
                            )}

                          {/* Final answer */}
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[7]}{" "}
                            <BlockMath math={`= ${result?.tech_ans}`} />
                          </p>

                          {/* With value */}
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[10]}{" "}
                            {formData?.tech_with} = {result?.tech_inf}
                          </p>

                          {/* Series result */}
                          <p className="mt-3">
                            <BlockMath math={result?.tech_ser} />
                            <br />
                            <span className="text-base">
                              {data?.payload?.tech_lang_keys[11]}
                            </span>
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

export default LimitCalculator;

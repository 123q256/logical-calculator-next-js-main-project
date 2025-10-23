"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useFourierSeriesCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FourierSeriesCalculator = () => {
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
    tech_EnterEq: "1-x^2",
    tech_lb: "-pi",
    tech_ub: "π",
    tech_with: "pi",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFourierSeriesCalculatorMutation();

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
        tech_lb: formData.tech_lb,
        tech_ub: formData.tech_ub,
        tech_with: formData.tech_with,
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
      tech_EnterEq: "1-x^2",
      tech_lb: "-pi",
      tech_ub: "π",
      tech_with: "pi",
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

  const exampleLoadHandler = () => {
    const examples = [
      "(x^2 + 1)^(1/2)",
      "(3x^2 - 2x + 5)^(1/2)",
      "(4x^2 + 9)^(1/2)",
      "(x^2 - 6x + 8)^(1/2)",
      "(2x^2 + x + 7)^(1/2)",
    ];

    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setFormData((prev) => ({
      ...prev,
      tech_EnterEq: randomExample,
    }));
    setResult(null);
    setFormError(null);
  };

  // result
  const x = formData?.tech_with;

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

          <div className="lg:w-[65%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="lg:col-span-9 md:col-span-9 col-span-12">
                <div className="col-span-12 md:col-span-4 lg:col-span-4 md:flex md:justify-between">
                  <label htmlFor="tech_EnterEq" className="label mt-4">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <button
                    type="button"
                    className="mt-2 flex border rounded-lg p-1  items-center"
                    id="exampleLoadBtn"
                    onClick={exampleLoadHandler}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-up-right size-5 me-1"
                    >
                      <path d="M7 7h10v10"></path>
                      <path d="M7 17 17 7"></path>
                    </svg>
                    Load Example
                  </button>
                </div>
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
              <div className="lg:col-span-3 md:col-span-3 col-span-12 md:mt-5">
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
                    <option value="a">a </option>
                    <option value="b">b </option>
                    <option value="c">c </option>
                    <option value="n">n </option>
                    <option value="x">x </option>
                    <option value="y">y </option>
                    <option value="z">z </option>
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
                        className="keyBtn cursor-pointer bg-blue-700 text-white rounded-sm h-9 px-2 uppercase shadow-md hover:bg-blue-600"
                        onClick={() => handleKeyClick(keyVal)}
                      >
                        {keyVal === "sqrt(" ? "√" : keyVal}
                      </button>
                    )
                  )}
                </div>
              )}
              <div className="col-span-6">
                <label htmlFor="tech_lb" className="label">
                  {data?.payload?.tech_lang_keys["2"]} If you want −∞, enter
                  -inf:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_lb"
                    id="tech_lb"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_lb}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_ub" className="label">
                  {data?.payload?.tech_lang_keys["3"]} If you want −∞, enter
                  -inf:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_ub"
                    id="tech_ub"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_ub}
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
                      <div className="w-full text-[16px] overflow-auto">
                        <p className="mt-3 text-[18px]">
                          <strong>{data?.payload?.tech_lang_keys["5"]}</strong>
                        </p>

                        <p className="mt-3">
                          <InlineMath math={result?.tech_res} />
                        </p>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["7"]}</strong>
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["8"]}{" "}
                          <InlineMath math={result?.tech_enter} /> on the
                          interval{" "}
                          <InlineMath
                            math={`\\left[${result?.tech_t1}, ${result?.tech_t2}\\right]`}
                          />
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`\\mathrm{Fourier\\ series\\ of\\ function}\\ f\\left(${x}\\right)\\ \\mathrm{on\\ interval}\\ -L\\le ${x}\\le L\\ \\mathrm{is\\ defined\\ as:}`}
                          />
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`f\\left(${x}\\right) = A_0 + \\sum_{n=1}^{\\infty} A_n \\cdot \\cos\\left(\\frac{n\\pi ${x}}{L}\\right) + \\sum_{n=1}^{\\infty} B_n \\cdot \\sin\\left(\\frac{n\\pi ${x}}{L}\\right)`}
                          />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["9"]}:
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`A_0 = \\frac{1}{2L} \\cdot \\int_{-L}^L f\\left(${x}\\right) d${x}`}
                          />
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`A_n = \\frac{1}{L} \\cdot \\int_{-L}^L f\\left(${x}\\right) \\cos\\left(\\frac{n\\pi ${x}}{L}\\right) d${x},\\quad n > 0`}
                          />
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`B_n = \\frac{1}{L} \\cdot \\int_{-L}^L f\\left(${x}\\right) \\sin\\left(\\frac{n\\pi ${x}}{L}\\right) d${x},\\quad n > 0`}
                          />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["10"]}{" "}
                          <InlineMath math={`A_0, A_n \\text{ and } B_n`} />
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`A_0 = \\frac{1}{2 \\times ${result?.tech_t}} \\cdot \\int_{${result?.tech_t1}}^{${result?.tech_t2}} \\left(${result?.tech_enter}\\right) d${x} = ${result?.tech_a0}`}
                          />
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`A_n = \\frac{1}{${result?.tech_t2}} \\cdot \\int_{${result?.tech_t1}}^{${result?.tech_t2}} \\left(${result?.tech_enter}\\right) \\cos\\left(\\frac{n\\pi ${x}}{${result?.tech_t2}}\\right) d${x} = ${result?.tech_an}`}
                          />
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`B_n = \\frac{1}{${result?.tech_t2}} \\cdot \\int_{${result?.tech_t1}}^{${result?.tech_t2}} \\left(${result?.tech_enter}\\right) \\sin\\left(\\frac{n\\pi ${x}}{${result?.tech_t2}}\\right) d${x} = ${result?.tech_bn}`}
                          />
                        </p>
                        <p className="mt-3">
                          Put <InlineMath math={`A_0, A_n \\text{ and } B_n`} />{" "}
                          values in Fourier Series Formula:
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`f\\left(${x}\\right) = ${result?.tech_a0} + \\sum_{n=1}^{\\infty} ${result?.tech_an} \\cdot \\cos\\left(\\frac{n\\pi ${x}}{L}\\right) + \\sum_{n=1}^{\\infty} ${result?.tech_bn} \\cdot \\sin\\left(\\frac{n\\pi ${x}}{L}\\right)`}
                          />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["11"]}:
                        </p>

                        <p className="mt-3">
                          <InlineMath math={result?.tech_res} />
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

export default FourierSeriesCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useTaylorSeriesCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TaylorSeriesCalculator = () => {
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
    tech_EnterEq: "(x^2+4)^(1/2)",
    tech_point: "1",
    tech_find: "5",
    tech_n: "4",
    tech_with: "x",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTaylorSeriesCalculatorMutation();

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
        tech_point: formData.tech_point,
        tech_find: formData.tech_find,
        tech_n: formData.tech_n,
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
      tech_EnterEq: "(x^2+4)^(1/2)",
      tech_point: "1",
      tech_find: "5",
      tech_n: "4",
      tech_with: "x",
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

  const percentage = result?.tech_percentage;
  const percents_sum = result?.tech_percents_sum;
  const sample = result?.tech_sample;
  const samples_sum = result?.tech_samples_sum;
  const avgResult = result?.tech_result;
  const techSameSample = formData?.tech_same_sample;

  const derivSteps = result?.tech_res?.split("@HA@") || [];
  const seriesTerms = [];
  let seriesStr = "";
  let per = result?.tech_enter;
  let der = "'";

  if (formData?.tech_point === 0) {
    seriesStr = `\\frac{${result?.tech_eexe}}{0!}${formData?.tech_with}^{0}`;
  } else {
    seriesStr = `\\frac{${result?.tech_eexe}}{0!}(${formData?.tech_with} - (${formData?.tech_point}))^{0}`;
  }

  derivSteps.forEach((val, i) => {
    const [derivative, evaluated] = val.split("@@@");
    if (formData?.tech_point === 0) {
      seriesStr += ` + \\frac{${evaluated}}{${i + 1}!}${formData?.tech_with}^{${
        i + 1
      }}`;
    } else {
      seriesStr += ` + \\frac{${evaluated}}{${i + 1}!}(${
        formData?.tech_with
      } - (${formData?.tech_point}))^{${i + 1}}`;
    }

    seriesTerms.push(
      <React.Fragment key={i}>
        <p className="mt-3 text-[18px]">
          {`${i + 1}. ${data?.payload?.tech_lang_keys["16"]} ${i + 1} ${
            data?.payload?.tech_lang_keys["17"]
          }:`}
        </p>
        <BlockMath
          math={`f^{(${i + 1})}(${formData?.tech_with}) = \\left(f^{(${i})}(${
            formData?.tech_with
          })\\right)^{'} = \\left(${per}\\right)^{'} = ${derivative}`}
        />

        <p className="mt-3">
          {`${data?.payload?.tech_lang_keys["18"]} ${i + 1} ${
            data?.payload?.tech_lang_keys["19"]
          }:`}
        </p>
        <BlockMath
          math={`\\left(f(${formData?.tech_point})\\right)^{${der}} = ${evaluated}`}
        />
      </React.Fragment>
    );

    per = derivative;
    der += "'";
  });

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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="md:col-span-9 col-span-12">
                <div className="col-span-12 md:col-span-4 lg:col-span-4 flex justify-between">
                  <label for="tech_EnterEq" className="label mt-4">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <button
                    type="button"
                    className="  flex border rounded-lg p-1  items-center"
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
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
              <div className="md:col-span-3 col-span-12 md:mt-3">
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
                <label htmlFor="tech_point" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_point"
                    id="tech_point"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_point}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_n" className="label">
                  {data?.payload?.tech_lang_keys["4"]} n:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_n"
                    id="tech_n"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_n}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_find" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_find"
                    id="tech_find"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_find}
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8  result_calculator rounded-lg space-y-6 result">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator  rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[16px]">
                        <div className="bg-gray bordered rounded-lg px-3 py-2 mt-2 text-[18px] overflow-auto">
                          <BlockMath
                            math={` ${result?.tech_enter} \approx P(${formData?.tech_point}) = ${result?.tech_series} `}
                          />
                        </div>

                        {result?.tech_efun && (
                          <div className="bg-gray bordered rounded-lg px-3 py-2 mt-2 overflow-auto">
                            <BlockMath
                              math={`f(${formData?.tech_find}) = ${result?.tech_efun} \approx ${result?.tech_efv}`}
                            />
                            <BlockMath
                              math={`P(${formData?.tech_find}) = ${result?.tech_eser} \approx ${result?.tech_fsv}`}
                            />
                            <BlockMath
                              math={`E = ${result?.tech_efun} - (${
                                result?.tech_eser
                              }) \approx ${Math.abs(result?.tech_err)}`}
                            />
                          </div>
                        )}

                        <p className="mt-3 font-bold">Step by Step Solution:</p>
                        <div className="bg-gray bordered rounded-lg px-3 py-2 mt-2 overflow-auto">
                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys["8"]}{" "}
                            <InlineMath math={result?.tech_enter} />{" "}
                            {data?.payload?.tech_lang_keys["9"]}{" "}
                            <InlineMath math={`a = ${formData?.tech_point}`} />{" "}
                            {data?.payload?.tech_lang_keys["10"]}{" "}
                            <InlineMath math={`n = ${formData?.tech_n}`} />
                          </div>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["12"]}
                          </p>
                          <BlockMath
                            math={`f(${formData?.tech_with}) = \\sum\\limits_{k=0}^{\\infty} \\frac{f^{(k)}(a)}{k!}(${formData?.tech_with} - a)^k`}
                          />

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["13"]}
                          </p>
                          <BlockMath
                            math={`P(${formData?.tech_with}) = \\sum\\limits_{k=0}^{${formData?.tech_n}} \\frac{f^{(k)}(a)}{k!}(${formData?.tech_with} - a)^k`}
                          />

                          <BlockMath
                            math={`f^{(0)}(${formData?.tech_with}) = f(${formData?.tech_with}) = ${result?.tech_enter}`}
                          />

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["15"]}:
                          </p>
                          <BlockMath
                            math={`f(${formData?.tech_point}) = ${result?.tech_eexe}`}
                          />

                          {/* Series Terms Block (Assuming seriesTerms is JSX) */}
                          {seriesTerms}

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["20"]}:
                          </p>
                          <BlockMath math={seriesStr} />

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["21"]}:
                          </p>
                          <BlockMath
                            math={`f(${formData?.tech_with}) \\approx P(${formData?.tech_with}) = ${result?.tech_series}`}
                          />

                          {formData?.tech_find &&
                            !isNaN(Number(formData?.tech_find)) && (
                              <>
                                <div className="mt-3">
                                  {data?.payload?.tech_lang_keys["22"]}:{" "}
                                  <BlockMath
                                    math={`f(${formData?.tech_find}) = ${result?.tech_efun}`}
                                  />
                                </div>
                                <div className="mt-3">
                                  {data?.payload?.tech_lang_keys["23"]}:{" "}
                                  <BlockMath
                                    math={`P(${formData?.tech_find}) = ${result?.tech_eser}`}
                                  />
                                </div>
                                <div className="mt-3">
                                  {data?.payload?.tech_lang_keys["24"]}:{" "}
                                  <BlockMath
                                    math={`E = |f(${formData?.tech_find}) - P(${formData?.tech_find})| = ${result?.tech_efun} - (${result?.tech_eser})`}
                                  />
                                </div>
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

export default TaylorSeriesCalculator;

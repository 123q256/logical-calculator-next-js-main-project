"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useInequalityCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const InequalityCalculator = () => {
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
    tech_select: "1", //  1 2
    tech_equ1: "x^2-2x+1 > 34",
    tech_con: "1", // 1 2
    tech_equ2: "x^2-2x+1 > 34",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useInequalityCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_select) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_select: formData.tech_select,
        tech_equ1: formData.tech_equ1,
        tech_con: formData.tech_con,
        tech_equ2: formData.tech_equ2,
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
      tech_select: "1", //  1 2
      tech_equ1: "x^2-2x+1 > 34",
      tech_con: "1", // 1 2
      tech_equ2: "x^2-2x+1 > 34",
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

  // Default empty arrays/strings to avoid crashes
  const techSolutionInequality = result?.tech_solution_inequality || "";
  const techLatexSolutionEqSec = result?.tech_latex_solution_eq_sec || "";
  const techSteps = result?.tech_steps || [];
  const techStepsSec = result?.tech_steps_sec || [];

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

          <div className="lg:w-[60%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 flex justify-center items-center">
                <p className="flex justify-center items-center">
                  <label className="pe-2 cursor-pointer" htmlFor="2">
                    <input
                      type="radio"
                      name="tech_select"
                      value="2"
                      id="2"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_select === "2"}
                    />
                    <span>{data?.payload?.tech_lang_keys["3"]}</span>
                  </label>
                </p>
                <p className="flex justify-center items-center">
                  <label className="pe-2 cursor-pointer" htmlFor="1">
                    <input
                      type="radio"
                      name="tech_select"
                      value="1"
                      id="1"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_select === "1"}
                    />
                    <span>{data?.payload?.tech_lang_keys["2"]}</span>
                  </label>
                </p>
              </div>
              <div
                className={`${
                  formData.tech_select == "1"
                    ? "md:col-span-5 col-span-12"
                    : "col-span-12"
                } mt-0 oneSide`}
              >
                <label htmlFor="tech_equ1" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_equ1"
                    id="tech_equ1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_equ1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_select === "1" && (
                <>
                  <div className="md:col-span-3 col-span-12">
                    <label htmlFor="tech_con" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_con"
                        id="tech_con"
                        value={formData.tech_con}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-4 col-span-12 mt-0 twoSide">
                    <label htmlFor="tech_equ2" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="text"
                        step="any"
                        name="tech_equ2"
                        id="tech_equ2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_equ2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
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
                      <div className="w-full overflow-auto">
                        <div className="w-full">
                          {formData?.tech_select === "2" ? (
                            <div className="mt-2 text-[17px] md:text-[16px] text-[#1670a7]">
                              <BlockMath math={techSolutionInequality} />
                            </div>
                          ) : (
                            <div className="mt-2 text-[18px]">
                              <InlineMath
                                math={`(${techSolutionInequality}) ${
                                  formData?.tech_con === "1" ? "∩" : "U"
                                } (${techLatexSolutionEqSec})`}
                              />
                            </div>
                          )}
                        </div>

                        <div className="w-full text-[16px]">
                          {/* Steps for first equation */}
                          {techSteps.length > 0 && (
                            <>
                              <div className="mt-3">
                                <strong>
                                  Steps to solve{" "}
                                  <InlineMath math={formData?.tech_equ1} />
                                </strong>
                              </div>
                              {techSteps.map((item, index) => {
                                const parts = item.split(/\\\((.*?)\\\)/g); // Split at \( ... \)
                                return (
                                  <p
                                    key={`step1-${index}`}
                                    className="mt-2 flex flex-wrap gap-1"
                                  >
                                    {parts.map((part, i) =>
                                      i % 2 === 1 ? (
                                        <InlineMath key={i}>{part}</InlineMath>
                                      ) : (
                                        <span key={i}>{part}</span>
                                      )
                                    )}
                                  </p>
                                );
                              })}
                            </>
                          )}

                          {/* Steps for second equation */}
                          {techStepsSec.length > 0 && (
                            <>
                              <p className="mt-3">
                                <strong>
                                  Steps to solve{" "}
                                  <InlineMath math={formData?.tech_equ2} />
                                </strong>
                              </p>
                              {techStepsSec.map((item, index) => {
                                const parts = item.split(/\\\((.*?)\\\)/g);
                                return (
                                  <p
                                    key={`step2-${index}`}
                                    className="mt-2 flex flex-wrap gap-1"
                                  >
                                    {parts.map((part, i) =>
                                      i % 2 === 1 ? (
                                        <InlineMath key={i}>{part}</InlineMath>
                                      ) : (
                                        <span key={i}>{part}</span>
                                      )
                                    )}
                                  </p>
                                );
                              })}
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

export default InequalityCalculator;

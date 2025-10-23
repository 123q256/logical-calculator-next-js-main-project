"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import katex from "katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useAbsoluteValueCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AbsoluteValueCalculator = () => {
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
    tech_eq: "|3x+1|",
    tech_n: "-5",
    tech_n1: "4",
    tech_var: "x",
    tech_type: "m1", //  m1  m2
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAbsoluteValueCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_eq) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_eq: formData.tech_eq,
        tech_n: formData.tech_n,
        tech_n1: formData.tech_n1,
        tech_var: formData.tech_var,
        tech_type: formData.tech_type,
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
      tech_eq: "|3x+1|",
      tech_n: "-5",
      tech_n1: "4",
      tech_var: "x",
      tech_type: "m1", //  m1  m2
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

  // resul

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const mathElements = containerRef.current.querySelectorAll(".math");
      mathElements.forEach((el) => {
        const tex = el.textContent;
        const span = document.createElement("span");
        try {
          katex.render(tex, span, { displayMode: false, throwOnError: false });
          el.replaceWith(span);
        } catch (err) {
          console.error("KaTeX render error:", err);
        }
      });
    }
  }, [formData, result]);

  const isM1 = formData?.tech_type === "m1";

  // Non-M1 data
  const res1 = result?.tech_res1 || "";
  const eq = result?.tech_eq || "";
  const n1 = result?.tech_n1 || "";
  const check1 = result?.tech_check1;
  const check11 = result?.tech_check11;
  const check2 = result?.tech_check2;
  const check22 = result?.tech_check22;

  // Replace "frac" with "dfrac" for proper rendering
  const pretty = (str) => str?.replace(/frac/g, "dfrac");

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
            <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="tech_type"
                id="calculator_time"
                value={formData.tech_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_type === "m1" ? "tagsUnit" : ""
                    }`}
                    id="m1"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "m1" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["1"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_type === "m2" ? "tagsUnit" : ""
                    }`}
                    id="m2"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "m2" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4 mt-5">
              {formData.tech_type == "m1" && (
                <>
                  <div className="col-span-12">
                    <div className="flex items-center justify-center">
                      <p>
                        <strong>| x | =</strong>
                      </p>
                      <div className="ps-2">
                        <div className="w-full py-2">
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
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type == "m2" && (
                <>
                  <div className="col-span-12 row">
                    <div className="flex items-center justify-center">
                      <div className="w-full py-2">
                        <input
                          type="text"
                          step="any"
                          name="tech_eq"
                          id="tech_eq"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_eq}
                          onChange={handleChange}
                        />
                      </div>
                      <p className="px-2">
                        <strong>=</strong>
                      </p>
                      <div className="w-full py-2">
                        <input
                          type="text"
                          step="any"
                          name="tech_n1"
                          id="tech_n1"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_n1}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-12">
                      <label htmlFor="tech_var" className="label">
                        {data?.payload?.tech_lang_keys["3"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_var"
                          id="tech_var"
                          value={formData.tech_var}
                          onChange={handleChange}
                        >
                          <option value="x">x</option>
                          <option value="y">y</option>
                          <option value="z">z</option>
                          <option value="u">u</option>
                          <option value="v">v</option>
                          <option value="w">w</option>
                        </select>
                      </div>
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
                    <div className="w-full mt-3" ref={containerRef}>
                      <div className="w-full">
                        {isM1 ? (
                          <div className="col-12 text-center my-2">
                            <p>
                              <strong className="bg-sky px-3 py-2 text-[32px] rounded-lg text-blue-500 math">
                                {`\\left|${formData?.tech_n}\\right| = ${result?.tech_res}`}
                              </strong>
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="mt-2 font-s-18 math">
                              {`${eq} = ${n1} \\quad : \\quad ${pretty(
                                result?.tech_res
                              )}, ${pretty(res1)}`}
                            </p>
                            <div className="col-12 text-center my-2">
                              <p>
                                <strong className="bg-sky p-4 font-s-21 rounded-lg text-blue-500 math">
                                  {`${eq} = ${n1} \\quad : \\quad ${pretty(
                                    result?.tech_res
                                  )}, ${pretty(res1)}`}
                                </strong>
                              </p>
                            </div>

                            {check1 == check11 && check2 != check22 ? (
                              <>
                                <p className="mt-2 math">
                                  {`${variableName} = ${pretty(
                                    result?.tech_res
                                  )} \\quad \\text{(${lang?.["5"]})}`}
                                </p>
                                <p className="mt-2 math">
                                  {`${variableName} = ${pretty(
                                    res1
                                  )} \\quad \\text{(${lang?.["6"]})}`}
                                </p>
                              </>
                            ) : check11 != check11 && check2 == check22 ? (
                              <>
                                <p className="mt-2 math">
                                  {`${variableName} = ${pretty(
                                    res1
                                  )} \\quad \\text{(${lang?.["5"]})}`}
                                </p>
                                <p className="mt-2 math">
                                  {`${variableName} = ${pretty(
                                    result?.tech_res
                                  )} \\quad \\text{(${lang?.["6"]})}`}
                                </p>
                              </>
                            ) : null}
                          </>
                        )}
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

export default AbsoluteValueCalculator;

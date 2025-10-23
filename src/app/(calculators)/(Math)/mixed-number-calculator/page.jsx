"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useMixedNumberCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MixedNumberCalculator = () => {
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
    tech_s1: "-3",
    tech_n1: "2",
    tech_d1: "5",
    tech_s2: "5",
    tech_n2: "2",
    tech_d2: "7",
    tech_action: "+", //  + - × ÷
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMixedNumberCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_s1 || !formData.tech_n1) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_s1: formData.tech_s1,
        tech_n1: formData.tech_n1,
        tech_d1: formData.tech_d1,
        tech_s2: formData.tech_s2,
        tech_n2: formData.tech_n2,
        tech_d2: formData.tech_d2,
        tech_action: formData.tech_action,
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
      tech_s1: "-3",
      tech_n1: "2",
      tech_d1: "5",
      tech_s2: "5",
      tech_n2: "2",
      tech_d2: "7",
      tech_action: "+", //  + - × ÷
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

  const {
    tech_s1 = "",
    tech_s2 = "",
    tech_n1,
    tech_d1,
    tech_n2,
    tech_d2,
    tech_action,
  } = formData;

  const {
    tech_N1 = "",
    tech_D1 = "",
    tech_N2 = "",
    tech_D2 = "",
    tech_totalN = "",
    tech_totalD = "",
    tech_g = "",
    tech_upr = "",
    tech_btm = "",
    tech_cube_root = "",
  } = result || {};

  const isMixed = tech_upr > tech_btm && tech_btm !== "1";
  const shi = isMixed ? Math.floor(tech_upr / tech_btm) : null;
  const bta = isMixed ? tech_upr % tech_btm : null;

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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 text-center">
                <div className="flex velocitytab border-b-dark border-b relative overflow-auto">
                  <p className="cursor-pointer veloTabs px-2">
                    <strong>
                      <a
                        href="/fraction-calculator"
                        className="cursor-pointer veloTabs  text-decoration-none "
                      >
                        {data?.payload?.tech_lang_keys["43"] ??
                          "Fraction Calculator"}
                      </a>
                    </strong>
                  </p>
                  <p className="cursor-pointer veloTabs v_active px-2">
                    <strong>
                      {data?.payload?.tech_lang_keys["44"] ?? "Mixed Number"}
                    </strong>
                  </p>
                  <p className="cursor-pointer veloTabs px-2">
                    <strong>
                      <a
                        href="/fraction-simplifier-calculator"
                        className="cursor-pointer veloTabs  text-decoration-none "
                      >
                        {data?.payload?.tech_lang_keys["45"] ??
                          "Fraction Simplifier"}
                      </a>
                    </strong>
                  </p>
                </div>
              </div>

              <div className="col-span-12 mx-auto">
                <div className="grid grid-cols-12 mt-3  gap-2 md:gap-4 lg:gap-4 ro ">
                  <div className="md:col-span-5 col-span-12">
                    <div className="flex items-center">
                      <div className="pe-2">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_s1"
                            id="tech_s1"
                            className="input my-2"
                            aria-label="input"
                            value={formData.tech_s1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="ps-lg-2">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_n1"
                            id="tech_n1"
                            className="input my-2"
                            aria-label="input"
                            value={formData.tech_n1}
                            onChange={handleChange}
                          />
                        </div>
                        <hr />
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_d1"
                            id="tech_d1"
                            className="input my-2"
                            aria-label="input"
                            value={formData.tech_d1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 col-span-12">
                    <label htmlFor="tech_action" className="label">
                      &nbsp;
                    </label>
                    <div className="md:mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_action"
                        id="tech_action"
                        value={formData.tech_action}
                        onChange={handleChange}
                      >
                        <option value="+">+</option>
                        <option value="-">- </option>
                        <option value="×">× </option>
                        <option value="÷">÷ </option>
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-5 col-span-12">
                    <div className="flex items-center">
                      <div className="pe-2">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_s2"
                            id="tech_s2"
                            className="input my-2"
                            aria-label="input"
                            value={formData.tech_s2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="ps-lg-2">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_n2"
                            id="tech_n2"
                            className="input my-2"
                            aria-label="input"
                            value={formData.tech_n2}
                            onChange={handleChange}
                          />
                        </div>
                        <hr />
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_d2"
                            id="tech_d2"
                            className="input my-2"
                            aria-label="input"
                            value={formData.tech_d2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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
                      <div className="w-full text-[20px]">
                        {/* Equation */}
                        <p className="mt-3 text-[20px] font-bold">
                          <InlineMath
                            math={`${tech_s1}\\frac{${tech_n1}}{${tech_d1}} ${tech_action} ${tech_s2}\\frac{${tech_n2}}{${tech_d2}} = \\frac{${tech_upr}}{${tech_btm}}`}
                          />
                        </p>

                        {/* Example Label */}
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["ex"]}:
                        </p>

                        {/* Input Expression */}
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["input"]}:{" "}
                          <InlineMath
                            math={`${tech_s1}\\frac{${tech_n1}}{${tech_d1}} ${tech_action} ${tech_s2}\\frac{${tech_n2}}{${tech_d2}}`}
                          />
                        </p>

                        {/* Step #1: Convert to improper fractions if needed */}
                        {(Number(tech_s1) || Number(tech_s2)) && (
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["step"]} #1:{" "}
                            <InlineMath
                              math={`\\frac{${tech_N1}}{${tech_D1}} ${tech_action} \\frac{${tech_N2}}{${tech_D2}}`}
                            />
                          </p>
                        )}

                        {/* Step #2: Multiply, Divide, or Add/Subtract */}
                        {tech_action === "×" ? (
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["step"]} #2 ={" "}
                            <InlineMath
                              math={`\\frac{${tech_N1}\\times${tech_N2}}{${tech_D1}\\times${tech_D2}}`}
                            />
                          </p>
                        ) : tech_action === "÷" ? (
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["step"]} #2 ={" "}
                            <InlineMath
                              math={`\\frac{(${tech_N1}\\times${tech_D2})}{(${tech_N2}\\times${tech_D1})}`}
                            />
                          </p>
                        ) : (
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["step"]} #2 ={" "}
                            <InlineMath
                              math={`\\frac{(${tech_N1}\\times${tech_D2}) ${tech_action} (${tech_N2}\\times${tech_D1})}{${tech_D1}\\times${tech_D2}}`}
                            />
                          </p>
                        )}

                        {/* Step #3: Resulting fraction */}
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["step"]} #3 ={" "}
                          <InlineMath
                            math={`\\frac{${tech_totalN}}{${tech_totalD}}`}
                          />
                        </p>

                        {/* Step #4: Simplification */}
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["step"]} #4 ={" "}
                          <InlineMath
                            math={`\\frac{(${tech_totalN}\\div${tech_g})}{(${tech_totalD}\\div${tech_g})}`}
                          />
                        </p>

                        {/* Final Answer */}
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["an"]} ={" "}
                          {tech_btm === "1" ? (
                            <InlineMath math={`${tech_upr}`} />
                          ) : (
                            <InlineMath
                              math={`\\frac{${tech_upr}}{${tech_btm}}`}
                            />
                          )}
                        </p>

                        {/* Mixed number form */}
                        {isMixed && (
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["or"]} = {shi}{" "}
                            <InlineMath math={`\\frac{${bta}}{${tech_btm}}`} />
                          </p>
                        )}

                        {/* Decimal form */}
                        {tech_btm !== "1" && (
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["dec"]}:{" "}
                            {Number(tech_upr / tech_btm).toFixed(4)}
                          </p>
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

export default MixedNumberCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useJacobianCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const JacobianCalculator = () => {
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
    tech_type: "two", // two  three
    tech_xu_var: "u",
    tech_xu: "u^2-v^3",
    tech_yv_var: "v",
    tech_yv: "u^2+v^3",
    tech_zw_var: "w",
    tech_zw: "u^2+v^3+w",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useJacobianCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_xu_var: formData.tech_xu_var,
        tech_xu: formData.tech_xu,
        tech_yv_var: formData.tech_yv_var,
        tech_yv: formData.tech_yv,
        tech_zw_var: formData.tech_zw_var,
        tech_zw: formData.tech_zw,
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
      tech_type: "two", // two  three
      tech_xu_var: "u",
      tech_xu: "u^2-v^3",
      tech_yv_var: "v",
      tech_yv: "u^2+v^3",
      tech_zw_var: "w",
      tech_zw: "u^2+v^3+w",
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

  // Determine varr and varr1 based on var and result.tech_var1
  let v1 = "";
  let v2 = "";
  if (result?.tech_var === "u") {
    v1 = "x";
  } else if (result?.tech_var === "x") {
    v1 = "u";
  }
  if (result?.tech_var1 === "v") {
    v2 = "y";
  } else if (result?.tech_var1 === "y") {
    v2 = "v";
  }

  // For 3-variable case
  let v3 = "";
  if (result?.tech_var2 === "w") {
    v3 = "z";
  } else if (result?.tech_var2 === "z") {
    v3 = "w";
  }

  const isTwoVars = result?.tech_check === "two";

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
                      formData.tech_type === "two" ? "tagsUnit" : ""
                    }`}
                    id="two"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "two" });
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
                      formData.tech_type === "three" ? "tagsUnit" : ""
                    }`}
                    id="three"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "three" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4 mt-4">
                  <div className="md:col-span-3 col-span-4">
                    <div className="w-full py-2">
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_xu_var"
                          id="tech_xu_var"
                          value={formData.tech_xu_var}
                          onChange={handleChange}
                        >
                          <option value="u">x </option>
                          <option value="x">u </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-[18px] my-auto text-center">
                    <p className="py-2">
                      <strong>=</strong>
                    </p>
                  </div>
                  <div className="md:col-span-8 col-span-7">
                    <div className="w-full py-2">
                      <input
                        type="text"
                        step="any"
                        name="tech_xu"
                        id="tech_xu"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_xu}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4 ">
                  <div className="md:col-span-3 col-span-4">
                    <div className="w-full py-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_yv_var"
                        id="tech_yv_var"
                        value={formData.tech_yv_var}
                        onChange={handleChange}
                      >
                        <option value="v">y </option>
                        <option value="y">v </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-1 text-[18px] my-auto text-center">
                    <p className="py-2">
                      <strong>=</strong>
                    </p>
                  </div>
                  <div className="md:col-span-8 col-span-7">
                    <div className="w-full py-2">
                      <input
                        type="text"
                        step="any"
                        name="tech_yv"
                        id="tech_yv"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_yv}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {formData.tech_type == "three" && (
                <>
                  <div className="col-span-12 " id="zwInput">
                    <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4 ">
                      <div className="md:col-span-3 col-span-4">
                        <div className="w-full py-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_zw_var"
                            id="tech_zw_var"
                            value={formData.tech_zw_var}
                            onChange={handleChange}
                          >
                            <option value="w">z </option>
                            <option value="z">W </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-1 text-[18px] my-auto text-center">
                        <p className="py-2">
                          <strong>=</strong>
                        </p>
                      </div>
                      <div className="md:col-span-8 col-span-7">
                        <div className="w-full py-2">
                          <input
                            type="text"
                            step="any"
                            name="tech_zw"
                            id="tech_zw"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_zw}
                            onChange={handleChange}
                          />
                        </div>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[16px] overflow-auto">
                        {isTwoVars ? (
                          <>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["4"]}
                              </strong>
                            </p>
                            <div className="mt-3">
                              <InlineMath math={result?.tech_jacob || ""} />
                            </div>

                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["5"]}
                              </strong>
                            </p>
                            <div className="mt-3">
                              <InlineMath math={result?.tech_dtrmnt || ""} />
                            </div>

                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["6"]}
                              </strong>
                            </p>

                            <div className="mt-3">
                              <InlineMath
                                math={`J(${v1}, ${v2})(${result?.tech_var}, ${result?.tech_var1}) = 
                                    \\begin{bmatrix}
                                      \\frac{\\partial ${v1}}{\\partial ${result?.tech_var}} & \\frac{\\partial ${v1}}{\\partial ${result?.tech_var1}} \\\\
                                      \\frac{\\partial ${v2}}{\\partial ${result?.tech_var}} & \\frac{\\partial ${v2}}{\\partial ${result?.tech_var1}}
                                    \\end{bmatrix}`}
                              />
                            </div>

                            <div className="mt-3">
                              <InlineMath
                                math={`J(${v1}, ${v2})(${result?.tech_var}, ${result?.tech_var1}) = 
                                    \\begin{bmatrix}
                                      \\frac{\\partial}{\\partial ${result?.tech_var}} (${result?.tech_enter}) & \\frac{\\partial}{\\partial ${result?.tech_var1}} (${result?.tech_enter}) \\\\
                                      \\frac{\\partial}{\\partial ${result?.tech_var}} (${result?.tech_enter1}) & \\frac{\\partial}{\\partial ${result?.tech_var1}} (${result?.tech_enter1})
                                    \\end{bmatrix}`}
                              />
                            </div>

                            <div className="mt-3">
                              <InlineMath
                                math={`J(${v1}, ${v2})(${result?.tech_var}, ${result?.tech_var1}) = ${result?.tech_jacob}`}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["4"]}
                              </strong>
                            </p>
                            <div className="mt-3">
                              <InlineMath math={result?.tech_jacob || ""} />
                            </div>

                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["5"]}
                              </strong>
                            </p>
                            <div className="mt-3">
                              <InlineMath math={result?.tech_dtrmnt || ""} />
                            </div>

                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["6"]}
                              </strong>
                            </p>

                            <p className="mt-3 ">
                              <InlineMath
                                math={`J(${v1}, ${v2}, ${v3})(${result?.tech_var}, ${result?.tech_var1}, ${result?.tech_var2}) = 
                                    \\begin{bmatrix}
                                      \\frac{\\partial ${v1}}{\\partial ${result?.tech_var}} & \\frac{\\partial ${v1}}{\\partial ${result?.tech_var1}} & \\frac{\\partial ${v1}}{\\partial ${result?.tech_var2}} \\\\
                                      \\frac{\\partial ${v2}}{\\partial ${result?.tech_var}} & \\frac{\\partial ${v2}}{\\partial ${result?.tech_var1}} & \\frac{\\partial ${v2}}{\\partial ${result?.tech_var2}} \\\\
                                      \\frac{\\partial ${v3}}{\\partial ${result?.tech_var}} & \\frac{\\partial ${v3}}{\\partial ${result?.tech_var1}} & \\frac{\\partial ${v3}}{\\partial ${result?.tech_var2}}
                                    \\end{bmatrix}`}
                              />
                            </p>

                            <div className="mt-3 ">
                              <InlineMath
                                math={`J(${v1}, ${v2}, ${v3})(${result?.tech_var}, ${result?.tech_var1}, ${result?.tech_var2}) = 
                                    \\begin{bmatrix}
                                      \\frac{\\partial}{\\partial ${result?.tech_var}} (${result?.tech_enter}) & \\frac{\\partial}{\\partial ${result?.tech_var1}} (${result?.tech_enter}) & \\frac{\\partial}{\\partial ${result?.tech_var2}} (${result?.tech_enter}) \\\\
                                      \\frac{\\partial}{\\partial ${result?.tech_var}} (${result?.tech_enter1}) & \\frac{\\partial}{\\partial ${result?.tech_var1}} (${result?.tech_enter1}) & \\frac{\\partial}{\\partial ${result?.tech_var2}} (${result?.tech_enter1}) \\\\
                                      \\frac{\\partial}{\\partial ${result?.tech_var}} (${result?.tech_enter2}) & \\frac{\\partial}{\\partial ${result?.tech_var1}} (${result?.tech_enter2}) & \\frac{\\partial}{\\partial ${result?.tech_var2}} (${result?.tech_enter2})
                                    \\end{bmatrix}`}
                              />
                            </div>

                            <div className="mt-3">
                              <InlineMath
                                math={`J(${v1}, ${v2})(${result?.tech_var}, ${result?.tech_var1}) = ${result?.tech_jacob}`}
                              />
                            </div>
                          </>
                        )}

                        <p className="mt-3">
                          ({data?.payload?.tech_lang_keys["7"]}{" "}
                          <a
                            href="https://calculator-logical.com/derivative-calculator"
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-800"
                          >
                            {data?.payload?.tech_lang_keys[8]}
                          </a>{" "}
                          {data?.payload?.tech_lang_keys["9"]})
                        </p>

                        <div className="mt-3">
                          <InlineMath
                            math={`J(${v1}, ${v2})(${result?.tech_var}, ${result?.tech_var1}) = ${result?.tech_dtrmnt}`}
                          />
                        </div>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["10"]},
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["4"]}{" "}
                          {data?.payload?.tech_lang_keys["11"]}{" "}
                          <InlineMath math={result?.tech_jacob} />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                          {data?.payload?.tech_lang_keys["11"]}{" "}
                          <InlineMath math={result?.tech_dtrmnt} />
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

export default JacobianCalculator;

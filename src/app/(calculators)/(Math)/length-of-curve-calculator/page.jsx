"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useLengthOfCurveCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LengthOfCurveCalculator = () => {
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
    tech_cal: "y", // y x  xy  r xyz
    tech_func: "6x^3+7x^2-7x+10",
    tech_func1: "10y^3+3x^2-7y-7",
    tech_func2: "6t^3+7t^2-7t+10",
    tech_upper: "2",
    tech_lower: "0",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLengthOfCurveCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cal: formData.tech_cal,
        tech_func: formData.tech_func,
        tech_func1: formData.tech_func1,
        tech_func2: formData.tech_func2,
        tech_upper: formData.tech_upper,
        tech_lower: formData.tech_lower,
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
      tech_cal: "y", // y x  xy  r xyz
      tech_func: "6x^3+7x^2-7x+10",
      tech_func1: "10y^3+3x^2-7y-7",
      tech_func2: "6t^3+7t^2-7t+10",
      tech_upper: "2",
      tech_lower: "0",
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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_cal" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_cal"
                    id="tech_cal"
                    value={formData.tech_cal}
                    onChange={handleChange}
                  >
                    <option value="y">
                      {data?.payload?.tech_lang_keys["2"]} : y=f(x)
                    </option>
                    <option value="x">
                      {data?.payload?.tech_lang_keys["2"]} : x=f(y)
                    </option>
                    <option value="xy">
                      {data?.payload?.tech_lang_keys["3"]} : x=x(t), y=y(t)
                    </option>
                    <option value="r">
                      {data?.payload?.tech_lang_keys["4"]} : r=r(t)
                    </option>
                    <option value="xyz">
                      {data?.payload?.tech_lang_keys["5"]} : x=x(t), y=y(t),
                      z=z(t)
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12" id="f">
                <label htmlFor="tech_func" className="label">
                  {data?.payload?.tech_lang_keys[6]}{" "}
                  <span className="text-blue-700 underline" id="ch">
                    {formData?.tech_cal === "x"
                      ? "f(y):"
                      : formData?.tech_cal === "r"
                      ? "r(t):"
                      : formData?.tech_cal === "xyz" ||
                        formData?.tech_cal === "xy"
                      ? "x(t):"
                      : "f(x):"}
                  </span>
                </label>

                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_func"
                    id="tech_func"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_func}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {(formData.tech_cal == "xy" || formData.tech_cal == "xyz") && (
                <>
                  <div className="col-span-12" id="f1">
                    <label htmlFor="tech_func1" className="label">
                      y(t):
                    </label>
                    <div className=" relative">
                      <input
                        type="text"
                        step="any"
                        name="tech_func1"
                        id="tech_func1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_func1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_cal == "xyz" && (
                <>
                  <div className="col-span-12 " id="f2">
                    <label htmlFor="tech_func2" className="label">
                      z(t):
                    </label>
                    <div className=" relative">
                      <input
                        type="text"
                        step="any"
                        name="tech_func2"
                        id="tech_func2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_func2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-6">
                <label htmlFor="tech_upper" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_upper"
                    id="tech_upper"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_upper}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_lower" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_lower"
                    id="tech_lower"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_lower}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full text-[16px] overflow-auto overflow-auto">
                          {formData?.tech_cal === "y" ? (
                            <p className="mt-3 font-s-18">
                              <InlineMath
                                math={`L = \\int_{${result?.tech_lower}}^{${result?.tech_upper}} \\sqrt{\\left(${result?.tech_diff}\\right)^2 + 1}dx`}
                              />
                            </p>
                          ) : formData?.tech_cal === "x" ? (
                            <p className="mt-3 font-s-18">
                              <InlineMath
                                math={`L = \\int_{${result?.tech_lower}}^{${result?.tech_upper}} \\sqrt{\\left(${result?.tech_diff}\\right)^2 + 1}dy`}
                              />
                            </p>
                          ) : formData?.tech_cal === "xy" ? (
                            <p className="mt-3 font-s-18">
                              <InlineMath
                                math={`L = \\int_{${result?.tech_lower}}^{${result?.tech_upper}} \\sqrt{\\left(${result?.tech_diff}\\right)^2 + \\left(${result?.tech_diff1}\\right)^2}dt`}
                              />
                            </p>
                          ) : formData?.tech_cal === "r" ? (
                            <p className="mt-3 font-s-18">
                              <InlineMath
                                math={`L = \\int_{${result?.tech_lower}}^{${result?.tech_upper}} \\sqrt{\\left(${result?.tech_enter}\\right)^2 + \\left(${result?.tech_diff}\\right)^2}dt`}
                              />
                            </p>
                          ) : formData?.tech_cal === "xyz" ? (
                            <p className="mt-3 font-s-18">
                              <InlineMath
                                math={`L = \\int_{${result?.tech_lower}}^{${result?.tech_upper}} \\sqrt{\\left(${result?.tech_diff}\\right)^2 + \\left(${result?.tech_diff1}\\right)^2 + \\left(${result?.tech_diff2}\\right)^2}dt`}
                              />
                            </p>
                          ) : null}
                          <p className="mt-3">
                            {" "}
                            <strong>
                              {data?.payload?.tech_lang_keys[10]}:
                            </strong>
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[9]}
                          </p>
                          {formData?.tech_cal === "y" ? (
                            <div className="mt-3">
                              <InlineMath
                                math={`f(x) = ${result?.tech_enter} \\text{ on } [${result?.tech_lower}, ${result?.tech_upper}]`}
                              />
                            </div>
                          ) : formData?.tech_cal === "x" ? (
                            <div className="mt-3">
                              <InlineMath
                                math={`f(y) = ${result?.tech_enter} \\text{ on } [${result?.tech_lower}, ${result?.tech_upper}]`}
                              />
                            </div>
                          ) : formData?.tech_cal === "xy" ? (
                            <>
                              <div className="mt-3">
                                <InlineMath
                                  math={`x(t) = ${result?.tech_enter} \\text{ on } [${result?.tech_lower}, ${result?.tech_upper}]`}
                                />
                              </div>
                              <div className="mt-3">
                                <InlineMath
                                  math={`y(t) = ${result?.tech_enter1} \\text{ on } [${result?.tech_lower}, ${result?.tech_upper}]`}
                                />
                              </div>
                            </>
                          ) : formData?.tech_cal === "r" ? (
                            <div className="mt-3">
                              <InlineMath
                                math={`r(t) = ${result?.tech_enter} \\text{ on } [${result?.tech_lower}, ${result?.tech_upper}]`}
                              />
                            </div>
                          ) : formData?.tech_cal === "xyz" ? (
                            <>
                              <div className="mt-3">
                                <InlineMath
                                  math={`x(t) = ${result?.tech_enter} \\text{ on } [${result?.tech_lower}, ${result?.tech_upper}]`}
                                />
                              </div>
                              <div className="mt-3">
                                <InlineMath
                                  math={`y(t) = ${result?.tech_enter1} \\text{ on } [${result?.tech_lower}, ${result?.tech_upper}]`}
                                />
                              </div>
                              <div className="mt-3">
                                <InlineMath
                                  math={`z(t) = ${result?.tech_enter2} \\text{ on } [${result?.tech_lower}, ${result?.tech_upper}]`}
                                />
                              </div>
                            </>
                          ) : null}
                          {formData?.tech_cal == "y" ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[11]}:
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`L = \\int_a^b \\sqrt{\\left(f'\\left(x\\right)\\right)^2 + 1}dx`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[12]}: (
                                {data?.payload?.tech_lang_keys[13]}{" "}
                                <a
                                  href="https://calculator-logical.com/derivative-calculator"
                                  className="text-blue-700 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Derivative Calculator
                                </a>
                                )
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(x) = (${result?.tech_enter}) = ${result?.tech_diff}`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[14]}:
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`L = \\int_{${result?.tech_lower}}^{${result?.tech_upper}} \\sqrt{\\left(${result?.tech_diff}\\right)^2 + 1}dx`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[15]} (
                                {data?.payload?.tech_lang_keys[13]}{" "}
                                <a
                                  href="https://calculator-logical.com/integral-calculator"
                                  className="text-blue-700 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Integral Calculator
                                </a>
                                )
                              </p>
                            </>
                          ) : formData?.tech_cal == "x" ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[11]}:
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`L = \\int_a^b \\sqrt{\\left(f'\\left(x\\right)\\right)^2 + 1}dy`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[12]} (
                                {data?.payload?.tech_lang_keys[13]}{" "}
                                <a
                                  href="https://calculator-logical.com/derivative-calculator"
                                  className="text-blue-700 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Derivative Calculator
                                </a>
                                )
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`f(x) = (${result?.tech_enter}) = ${result?.tech_diff}`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[14]}:
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`L = \\int_{${result?.tech_lower}}^{${result?.tech_upper}} \\sqrt{\\left(${result?.tech_diff}\\right)^2 + 1}dy`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[15]} (
                                {data?.payload?.tech_lang_keys[13]}{" "}
                                <a
                                  href="https://calculator-logical.com/integral-calculator"
                                  className="text-blue-700 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Integral Calculator
                                </a>
                                )
                              </p>
                            </>
                          ) : formData?.tech_cal == "xy" ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[11]}:
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`L = \\int_a^b \\sqrt{\\left(x'\\left(t\\right)\\right)^2 + \\left(y'\\left(t\\right)\\right)^2}dt`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[12]} (
                                {data?.payload?.tech_lang_keys[13]}{" "}
                                <a
                                  href="https://calculator-logical.com/derivative-calculator"
                                  className="text-blue-700 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Derivative Calculator
                                </a>
                                )
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`x(t) = (${result?.tech_enter}) = ${result?.tech_diff}`}
                                />
                              </div>
                              <div className="mt-3">
                                <BlockMath
                                  math={`y(t) = (${result?.tech_enter1}) = ${result?.tech_diff1}`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[14]}:
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`L = \\int_{${result?.tech_lower}}^{${result?.tech_upper}} \\sqrt{\\left(${result?.tech_diff}\\right)^2 + \\left(${result?.tech_diff1}\\right)^2}dt`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[15]} (
                                {data?.payload?.tech_lang_keys[13]}{" "}
                                <a
                                  href="https://calculator-logical.com/integral-calculator"
                                  className="text-blue-700 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Integral Calculator
                                </a>
                                )
                              </p>
                            </>
                          ) : formData?.tech_cal == "r" ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[11]}:
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`L = \\int_a^b \\sqrt{\\left(r\\left(t\\right)\\right)^2 + \\left(r'\\left(t\\right)\\right)^2}dt`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[12]} (
                                {data?.payload?.tech_lang_keys[13]}{" "}
                                <a
                                  href="https://calculator-logical.com/derivative-calculator"
                                  className="text-blue-700 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Derivative Calculator
                                </a>
                                )
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`r(t) = (${result?.tech_enter}) = ${result?.tech_diff}`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[14]}:
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`L = \\int_{${result?.tech_lower}}^{${result?.tech_upper}} \\sqrt{\\left(${result?.tech_enter}\\right)^2 + \\left(${result?.tech_diff}\\right)^2}dt`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[15]} (
                                {data?.payload?.tech_lang_keys[13]}{" "}
                                <a
                                  href="https://calculator-logical.com/integral-calculator"
                                  className="text-blue-700 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Integral Calculator
                                </a>
                                )
                              </p>
                            </>
                          ) : formData?.tech_cal == "xyz" ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[11]}:
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`L = \\int_a^b \\sqrt{\\left(x'(t)\\right)^2 + \\left(y'(t)\\right)^2 + \\left(z'(t)\\right)^2}dt`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[12]} (
                                {data?.payload?.tech_lang_keys[13]}{" "}
                                <a
                                  href="https://calculator-logical.com/derivative-calculator"
                                  className="text-blue-700 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Derivative Calculator
                                </a>
                                )
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`x(t) = (${result?.tech_enter}) = ${result?.tech_diff}`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`y(t) = (${result?.tech_enter1}) = ${result?.tech_diff1}`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`z(t) = (${result?.tech_enter2}) = ${result?.tech_diff2}`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[14]}:
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`L = \\int_{${result?.tech_lower}}^{${result?.tech_upper}} \\sqrt{\\left(${result?.tech_diff}\\right)^2 + \\left(${result?.tech_diff1}\\right)^2 + \\left(${result?.tech_diff2}\\right)^2}dt`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[15]} (
                                {data?.payload?.tech_lang_keys[13]}{" "}
                                <a
                                  href="https://calculator-logical.com/integral-calculator"
                                  className="text-blue-700 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Integral Calculator
                                </a>
                                )
                              </p>
                            </>
                          ) : null}
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

export default LengthOfCurveCalculator;

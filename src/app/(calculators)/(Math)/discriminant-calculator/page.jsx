"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useDiscriminantCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DiscriminantCalculator = () => {
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
    tech_to_calculate: "2d", // 2d 3d 4d
    tech_value4: 4,
    tech_value3: -6,
    tech_value2: 7,
    tech_value1: -10,
    tech_value: 13,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDiscriminantCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_to_calculate) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_to_calculate: formData.tech_to_calculate,
        tech_value4: formData.tech_value4,
        tech_value3: formData.tech_value3,
        tech_value2: formData.tech_value2,
        tech_value1: formData.tech_value1,
        tech_value: formData.tech_value,
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
      tech_to_calculate: "2d", // 2d 3d 4d
      tech_value4: 4,
      tech_value3: -6,
      tech_value2: 7,
      tech_value1: -10,
      tech_value: 13,
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1   gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_to_calculate" className="label">
                  {data?.payload?.tech_lang_keys["pol"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_to_calculate"
                    id="tech_to_calculate"
                    value={formData.tech_to_calculate}
                    onChange={handleChange}
                  >
                    <option value="2d">
                      {data?.payload?.tech_lang_keys["sec"]}
                    </option>
                    <option value="3d">
                      {data?.payload?.tech_lang_keys["thir"]}{" "}
                    </option>
                    <option value="4d">
                      {data?.payload?.tech_lang_keys["for"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <p className="w-full  mt-3 text-center">
              {formData?.tech_to_calculate == "3d" ? (
                <>
                  <strong id="textChanged">
                    {" "}
                    Enter a,b,c,d in ax³ + bx² + cx + d = 0{" "}
                  </strong>
                </>
              ) : formData?.tech_to_calculate == "4d" ? (
                <>
                  <strong id="textChanged">
                    {" "}
                    Enter a,b,c,d,e in ax⁴ + bx³ + cx² + dx + e = 0{" "}
                  </strong>
                </>
              ) : (
                <>
                  <strong id="textChanged">
                    {" "}
                    Enter a,b,c in ax² + bx + c = 0{" "}
                  </strong>
                </>
              )}
            </p>
            <div className="grid grid-cols-2  lg:grid-cols-2 md:grid-cols-2  gap-4">
              {formData.tech_to_calculate == "4d" && (
                <>
                  <div className="space-y-2 vc4 ">
                    <label htmlFor="tech_value4" className="label">
                      a
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_value4"
                        id="tech_value4"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_value4}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_to_calculate == "3d" ||
                formData.tech_to_calculate == "4d") && (
                <>
                  <div className="space-y-2 vc3 ">
                    {formData?.tech_to_calculate == "3d" ? (
                      <>
                        <label htmlFor="tech_value3" className="label">
                          {" "}
                          a{" "}
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_value3" className="label">
                          {" "}
                          b{" "}
                        </label>
                      </>
                    )}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_value3"
                        id="tech_value3"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_value3}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                {formData?.tech_to_calculate == "3d" ? (
                  <>
                    <label htmlFor="tech_value2" className="label">
                      {" "}
                      b{" "}
                    </label>
                  </>
                ) : formData?.tech_to_calculate == "4d" ? (
                  <>
                    <label htmlFor="tech_value2" className="label">
                      {" "}
                      c{" "}
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_value2" className="label">
                      {" "}
                      a{" "}
                    </label>
                  </>
                )}
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_value2"
                    id="tech_value2"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_value2}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {formData?.tech_to_calculate == "3d" ? (
                  <>
                    <label htmlFor="tech_value1" className="label">
                      {" "}
                      c{" "}
                    </label>
                  </>
                ) : formData?.tech_to_calculate == "4d" ? (
                  <>
                    <label htmlFor="tech_value1" className="label">
                      {" "}
                      d{" "}
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_value1" className="label">
                      {" "}
                      b{" "}
                    </label>
                  </>
                )}

                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_value1"
                    id="tech_value1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_value1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {formData?.tech_to_calculate == "3d" ? (
                  <>
                    <label htmlFor="tech_value" className="label">
                      {" "}
                      d{" "}
                    </label>
                  </>
                ) : formData?.tech_to_calculate == "4d" ? (
                  <>
                    <label htmlFor="tech_value" className="label">
                      {" "}
                      e{" "}
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_value" className="label">
                      {" "}
                      c{" "}
                    </label>
                  </>
                )}

                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_value"
                    id="tech_value"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_value}
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
                    <div className="w-full bg-light-blue p-3 rounded-lg mt-3">
                      <div className=" lg:flex-row overflow-auto">
                        <div className="w-full lg:w-1/2 mt-2 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["dis"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_sd).toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-2 text-base">
                          {data?.payload?.tech_lang_keys["nature"]}:{" "}
                          <span className="text-blue-600">
                            {result?.tech_nrs}
                          </span>
                        </p>
                        <p className="mt-3 text-base">
                          <strong>
                            {data?.payload?.tech_lang_keys["sol"]}:
                          </strong>
                        </p>
                        {formData?.tech_to_calculate == "2d" ? (
                          <>
                            <div className="w-full text-base mt-2 overflow-auto">
                              {/* Equation */}
                              <p className="mt-2">
                                <InlineMath
                                  math={`\\text{Equation: } ${
                                    formData?.tech_value2
                                  }x^2 ${
                                    formData?.tech_value1 < 0 ? "-" : "+"
                                  } ${Math.abs(formData?.tech_value1)}x ${
                                    formData?.tech_value < 0 ? "-" : "+"
                                  } ${Math.abs(formData?.tech_value)} = 0`}
                                />
                              </p>

                              {/* Discriminant Formula */}
                              <p className="mt-2">
                                <InlineMath
                                  math={`${data?.payload?.tech_lang_keys["g_f"]} : b^2 - 4ac = 0`}
                                />
                              </p>

                              {/* Coefficients */}
                              <p className="mt-2">
                                <InlineMath
                                  math={`a = ${formData?.tech_value2},\\ b = ${formData?.tech_value1},\\ c = ${formData?.tech_value}`}
                                />
                              </p>

                              {/* Put values */}
                              <p className="mt-2">
                                <InlineMath
                                  math={data?.payload?.tech_lang_keys["put"]}
                                />
                              </p>

                              {/* Substituted expression */}
                              <BlockMath
                                math={`D = (${formData?.tech_value1})^2 - 4(${formData?.tech_value2})(${formData?.tech_value})`}
                              />

                              {/* Evaluated expression */}
                              <BlockMath
                                math={`D = ${Math.pow(
                                  formData?.tech_value1,
                                  2
                                )} - ${
                                  4 *
                                  formData?.tech_value2 *
                                  formData?.tech_value
                                }`}
                              />

                              {/* Final result */}
                              <BlockMath math={`D = ${result?.tech_sd}`} />
                            </div>
                          </>
                        ) : formData?.tech_to_calculate == "3d" ? (
                          <>
                            <div className="w-full text-base mt-2 overflow-auto">
                              {/* Equation */}
                              <p className="mt-2">
                                <InlineMath
                                  math={`\\text{Equation: } ${
                                    formData?.tech_value3
                                  }x^3 ${
                                    formData?.tech_value2 < 0 ? "-" : "+"
                                  } ${Math.abs(formData?.tech_value2)}x^2 ${
                                    formData?.tech_value1 < 0 ? "-" : "+"
                                  } ${Math.abs(formData?.tech_value1)}x ${
                                    formData?.tech_value < 0 ? "-" : "+"
                                  } ${Math.abs(formData?.tech_value)} = 0`}
                                />
                              </p>

                              {/* Discriminant Formula */}
                              <p className="mt-2">
                                <InlineMath
                                  math={`${data?.payload?.tech_lang_keys["g_f"]} : b^2c^2 - 4ac^3 - 4b^3d - 27a^2d^2 + 18abcd`}
                                />
                              </p>

                              {/* Coefficient values */}
                              <p className="mt-2">
                                <InlineMath
                                  math={`a = ${formData?.tech_value3},\\ b = ${formData?.tech_value2},\\ c = ${formData?.tech_value1},\\ d = ${formData?.tech_value}`}
                                />
                              </p>

                              {/* Substitution */}
                              <p className="mt-2">
                                <InlineMath
                                  math={data?.payload?.tech_lang_keys["put"]}
                                />
                              </p>

                              {/* Formula with values */}
                              <BlockMath
                                math={`D = (${formData?.tech_value2})^2(${formData?.tech_value1})^2 - 4(${formData?.tech_value3})(${formData?.tech_value1})^3 - 4(${formData?.tech_value2})^3(${formData?.tech_value}) - 27(${formData?.tech_value3})^2(${formData?.tech_value})^2 + 18(${formData?.tech_value3})(${formData?.tech_value2})(${formData?.tech_value1})(${formData?.tech_value})`}
                              />

                              {/* Mid Calculation */}
                              <BlockMath
                                math={`D = ${Math.pow(
                                  formData?.tech_value2,
                                  2
                                )} \\times ${Math.pow(
                                  formData?.tech_value1,
                                  2
                                )} - 4 \\times ${
                                  formData?.tech_value3
                                } \\times ${Math.pow(
                                  formData?.tech_value1,
                                  3
                                )} - 4 \\times ${Math.pow(
                                  formData?.tech_value2,
                                  3
                                )} \\times ${
                                  formData?.tech_value
                                } - 27 \\times ${Math.pow(
                                  formData?.tech_value3,
                                  2
                                )} \\times ${Math.pow(
                                  formData?.tech_value,
                                  2
                                )} + 18 \\times ${
                                  formData?.tech_value3
                                } \\times ${formData?.tech_value2} \\times ${
                                  formData?.tech_value1
                                } \\times ${formData?.tech_value}`}
                              />

                              {/* Final Answer */}
                              <BlockMath
                                math={`D = ${
                                  Math.pow(formData?.tech_value2, 2) *
                                  Math.pow(formData?.tech_value1, 2)
                                } - ${
                                  4 *
                                  formData?.tech_value3 *
                                  Math.pow(formData?.tech_value1, 3)
                                } - ${
                                  4 *
                                  Math.pow(formData?.tech_value2, 3) *
                                  formData?.tech_value
                                } - ${
                                  27 *
                                  Math.pow(formData?.tech_value3, 2) *
                                  Math.pow(formData?.tech_value, 2)
                                } + ${
                                  18 *
                                  formData?.tech_value3 *
                                  formData?.tech_value2 *
                                  formData?.tech_value1 *
                                  formData?.tech_value
                                }`}
                              />

                              <p className="mt-2">
                                <InlineMath math={`D = ${result?.tech_sd}`} />
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="mt-2">
                              <InlineMath
                                math={`\\text{Equation: } ${
                                  formData?.tech_value4
                                }x^4 ${
                                  formData?.tech_value3 < 0 ? "-" : "+"
                                } ${Math.abs(formData?.tech_value3)}x^3 ${
                                  formData?.tech_value2 < 0 ? "-" : "+"
                                } ${Math.abs(formData?.tech_value2)}x^2 ${
                                  formData?.tech_value1 < 0 ? "-" : "+"
                                } ${Math.abs(formData?.tech_value1)}x ${
                                  formData?.tech_value < 0 ? "-" : "+"
                                } ${Math.abs(formData?.tech_value)} = 0`}
                              />
                            </p>

                            <p className="mt-2">
                              <InlineMath
                                math={data?.payload?.tech_lang_keys["g_f"]}
                              />
                              :
                            </p>
                            <div className="w-full text-base mt-2 overflow-auto ">
                              <BlockMath
                                math={`256a^3e^3 - 192a^2bde^2 - 128a^2c^2e^2 + 144a^2cd^2e - 27a^2d^4 + 144ab^2ce^2 - 6ab^2d^2e - 80abc^2de + 18abcd^3 + 16ac^4e - 4ac^3d^2 - 27b^4e^2 + 18b^3cde - 4b^3d^3 - 4b^2c^3e + b^2c^2d^2`}
                              />

                              <p className="mt-2">
                                <InlineMath
                                  math={`a=${formData?.tech_value4},\\ b=${formData?.tech_value3},\\ c=${formData?.tech_value2},\\ d=${formData?.tech_value1},\\ e=${formData?.tech_value}`}
                                />
                              </p>

                              <p className="mt-2">
                                <InlineMath
                                  math={data?.payload?.tech_lang_keys["put"]}
                                />
                              </p>
                              <div className="break-words whitespace-normal text-sm leading-snug">
                                <BlockMath
                                  math={`D = 256(${formData?.tech_value4})^3(${formData?.tech_value})^3 - 192(${formData?.tech_value4})^2(${formData?.tech_value3})(${formData?.tech_value1})(${formData?.tech_value})^2 - 128(${formData?.tech_value4})^2(${formData?.tech_value2})^2(${formData?.tech_value})^2 + 144(${formData?.tech_value4})^2(${formData?.tech_value2})(${formData?.tech_value1})^2(${formData?.tech_value}) - 27(${formData?.tech_value4})^2(${formData?.tech_value1})^4 + 144(${formData?.tech_value4})(${formData?.tech_value3})^2(${formData?.tech_value2})(${formData?.tech_value})^2 - 6(${formData?.tech_value4})(${formData?.tech_value3})^2(${formData?.tech_value1})^2(${formData?.tech_value}) - 80(${formData?.tech_value4})(${formData?.tech_value3})(${formData?.tech_value2})^2(${formData?.tech_value1})(${formData?.tech_value}) + 18(${formData?.tech_value4})(${formData?.tech_value3})(${formData?.tech_value2})(${formData?.tech_value1})^3 + 16(${formData?.tech_value4})(${formData?.tech_value2})^4(${formData?.tech_value}) - 4(${formData?.tech_value4})(${formData?.tech_value2})^3(${formData?.tech_value1})^2 - 27(${formData?.tech_value3})^4(${formData?.tech_value})^2 + 18(${formData?.tech_value3})^3(${formData?.tech_value2})(${formData?.tech_value1})(${formData?.tech_value}) - 4(${formData?.tech_value3})^3(${formData?.tech_value1})^3 - 4(${formData?.tech_value3})^2(${formData?.tech_value2})^3(${formData?.tech_value}) + (${formData?.tech_value3})^2(${formData?.tech_value2})^2(${formData?.tech_value1})^2`}
                                />
                              </div>

                              <p className="mt-2">
                                <InlineMath math={`D = ${result?.tech_sd}`} />
                              </p>
                            </div>
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

export default DiscriminantCalculator;

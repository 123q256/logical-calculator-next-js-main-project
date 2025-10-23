"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useRatioToFractionCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RatioToFractionCalculator = () => {
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
    tech_convert: "1", //  1 2
    tech_select_unit: "1", // 1 2
    tech_first_number: "12",
    tech_second_number: "22",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRatioToFractionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_convert) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_convert: formData.tech_convert,
        tech_select_unit: formData.tech_select_unit,
        tech_first_number: formData.tech_first_number,
        tech_second_number: formData.tech_second_number,
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
      tech_convert: "1", //  1 2
      tech_select_unit: "1", // 1 2
      tech_first_number: "12",
      tech_second_number: "22",
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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_convert" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_convert"
                    id="tech_convert"
                    value={formData.tech_convert}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                {formData.tech_convert == "1" ? (
                  <>
                    <label htmlFor="tech_select_unit" className="label">
                      {" "}
                      Select Type of Fraction:
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_select_unit" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                  </>
                )}

                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_select_unit"
                    id="tech_select_unit"
                    value={formData.tech_select_unit}
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
              <div className="col-span-12 flex tems-center px-2">
                <div>
                  {formData.tech_select_unit == "2" ? (
                    <>
                      <label htmlFor="tech_first_number" className="label">
                        {" "}
                        Part:
                      </label>
                    </>
                  ) : (
                    <>
                      <label htmlFor="tech_first_number" className="label">
                        {" "}
                        A :
                      </label>
                    </>
                  )}
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_first_number"
                      id="tech_first_number"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_first_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="dot px-2 flex items-center pt-4">
                  <p>&nbsp;</p>
                  <div className="mb-2">
                    {formData.tech_convert == "1" ? (
                      <>
                        <strong id="dotText">:</strong>
                      </>
                    ) : (
                      <>
                        <strong id="dotText">/</strong>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  {formData.tech_select_unit == "2" ? (
                    <>
                      <label htmlFor="tech_second_number" className="label">
                        {" "}
                        Whole:
                      </label>
                    </>
                  ) : (
                    <>
                      <label htmlFor="tech_second_number" className="label">
                        {" "}
                        B :
                      </label>
                    </>
                  )}
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_second_number"
                      id="tech_second_number"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_second_number}
                      onChange={handleChange}
                    />
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
                    <div className="w-full overflow-auto">
                      <div className="w-full text-[16px] overflow-auto">
                        {result.tech_method == "1" && (
                          <>
                            <BlockMath
                              math={`\\frac{${result.tech_upr1}}{${result.tech_btm1}} \\quad \\text{and} \\quad \\frac{${result.tech_upr2}}{${result.tech_btm2}}`}
                            />

                            <p className="mt-3 font-bold">
                              {data?.payload?.tech_lang_keys["8"]}:
                            </p>
                            <BlockMath
                              math={`\\text{${data?.payload?.tech_lang_keys["26"]}} = ${result.tech_first_number} \\text{ ${data?.payload?.tech_lang_keys["27"]} ${data?.payload?.tech_lang_keys["28"]} } = ${result.tech_second_number}`}
                            />
                            <div className="mt-3">
                              <BlockMath
                                math={`\\text{ ${data?.payload?.tech_lang_keys["9"]} }:`}
                              />
                            </div>
                            <div className="mt-3">
                              <BlockMath
                                math={`\\text{ ${data?.payload?.tech_lang_keys["10"]} }`}
                              />
                            </div>
                            <BlockMath
                              math={`${data?.payload?.tech_lang_keys["16"]} = ${result.tech_first_number} + ${result.tech_second_number} = ${result.tech_addition}`}
                            />
                            <BlockMath
                              math={`\\text{ ${data?.payload?.tech_lang_keys["11"]} }:`}
                            />
                            <BlockMath
                              math={`\\text{ ${data?.payload?.tech_lang_keys["12"]} }`}
                            />
                            <BlockMath
                              math={`\\frac{${result.tech_first_number}}{${result.tech_addition}} \\quad \\text{and} \\quad \\frac{${result.tech_second_number}}{${result.tech_addition}}`}
                            />

                            <BlockMath
                              math={`\\text{ ${data?.payload?.tech_lang_keys["15"]} }:`}
                            />
                            {result.tech_upr1 == result.tech_first_number &&
                            result.tech_upr2 == result.tech_second_number ? (
                              <BlockMath
                                math={`\\text{ ${data?.payload?.tech_lang_keys["13"]} }`}
                              />
                            ) : (
                              <>
                                <BlockMath
                                  math={`\\text{ ${data?.payload?.tech_lang_keys["14"]} }`}
                                />
                                <BlockMath
                                  math={`\\frac{${result.tech_first_number}}{${result.tech_addition}} = \\frac{${result.tech_upr1}}{${result.tech_btm1}}`}
                                />
                                <BlockMath
                                  math={`\\frac{${result.tech_second_number}}{${result.tech_addition}} = \\frac{${result.tech_upr2}}{${result.tech_btm2}}`}
                                />
                              </>
                            )}
                          </>
                        )}

                        {result.tech_method == "2" && (
                          <>
                            <p className="mt-3 text-[21px]">
                              <BlockMath
                                math={
                                  result.tech_upr2 / result.tech_btm2 == 1
                                    ? `${divide}`
                                    : `\\frac{${result.tech_upr2}}{${result.tech_btm2}}`
                                }
                              />
                            </p>
                            <p className="mt-3 font-bold">
                              {data?.payload?.tech_lang_keys["8"]}:
                            </p>
                            <BlockMath
                              math={`\\text{ ${data?.payload?.tech_lang_keys["9"]} }:`}
                            />
                            <BlockMath
                              math={`\\text{ ${data?.payload?.tech_lang_keys["22"]} }`}
                            />
                            <BlockMath
                              math={`${result.tech_first_number}:${result.tech_second_number} = \\frac{${result.tech_first_number}}{${result.tech_second_number}}`}
                            />
                            <BlockMath
                              math={`\\text{ ${data?.payload?.tech_lang_keys["11"]} }`}
                            />
                            {result.tech_upr2 == result.tech_first_number &&
                            result.tech_btm2 == result.tech_second_number ? (
                              <BlockMath
                                math={`\\text{ ${data?.payload?.tech_lang_keys["18"]} }`}
                              />
                            ) : (
                              <>
                                <BlockMath
                                  math={`\\text{ ${data?.payload?.tech_lang_keys["23"]} }`}
                                />
                                <BlockMath
                                  math={`\\frac{${result.tech_first_number}}{${result.tech_second_number}} = \\frac{${result.tech_upr2}}{${result.tech_btm2}}`}
                                />
                              </>
                            )}
                          </>
                        )}

                        {result.tech_method == "3" && (
                          <>
                            <p className="mt-3 text-[21px]">
                              <BlockMath
                                math={`${result.tech_upr1}:${result.tech_upr2}`}
                              />
                            </p>
                            <p className="mt-3 font-bold">
                              {data?.payload?.tech_lang_keys["8"]}:
                            </p>
                            <BlockMath
                              math={`\\text{ ${data?.payload?.tech_lang_keys["9"]} }`}
                            />
                            {result.tech_upr1 == result.tech_first_number &&
                            result.tech_upr2 == result.tech_second_number ? (
                              <BlockMath
                                math={`\\text{ ${data?.payload?.tech_lang_keys["18"]} }`}
                              />
                            ) : (
                              <>
                                <BlockMath
                                  math={`\\text{ ${data?.payload?.tech_lang_keys["19"]} }`}
                                />
                                <BlockMath
                                  math={`\\frac{${result.tech_first_number}}{${result.tech_second_number}} = \\frac{${result.tech_upr1}}{${result.tech_upr2}}`}
                                />
                              </>
                            )}
                            <BlockMath
                              math={`\\text{ ${data?.payload?.tech_lang_keys["11"]} }:`}
                            />
                            <BlockMath
                              math={`\\text{ ${data?.payload?.tech_lang_keys["20"]} }`}
                            />
                            <BlockMath
                              math={`\\frac{${result.tech_upr1}}{${result.tech_upr2}} \\text{ = } ${result.tech_upr1}:${result.tech_upr2}`}
                            />
                          </>
                        )}

                        {result.tech_method == "4" && (
                          <p className="my-3 text-center">
                            <strong className="bg-white px-3 py-2 text-[32px] rounded-lg text-blue">
                              <BlockMath
                                math={`\\color{#1670a7}${result.tech_upr1}:\\color{#1670a7}${result.tech_btm1}`}
                              />
                            </strong>
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

export default RatioToFractionCalculator;

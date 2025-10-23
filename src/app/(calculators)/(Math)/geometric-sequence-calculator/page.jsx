"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import katex from "katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useGeometricSequenceCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GeometricSequenceCalculator = () => {
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
    tech_find: "gs", //  gs a1  r   n
    tech_cw: "nth", // s_n  nth
    tech_a1: 2,
    tech_r: 2,
    tech_n: 10,
    tech_an: 4,
    tech_sn: 4,
    tech_n1: 3,
    tech_a_n: 16,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGeometricSequenceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_find) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_find: formData.tech_find,
        tech_cw: formData.tech_cw,
        tech_a1: formData.tech_a1,
        tech_r: formData.tech_r,
        tech_n: formData.tech_n,
        tech_an: formData.tech_an,
        tech_sn: formData.tech_sn,
        tech_n1: formData.tech_n1,
        tech_a_n: formData.tech_a_n,
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
      tech_find: "gs", //  gs a1  r   n
      tech_cw: "nth", // s_n  nth
      tech_a1: 2,
      tech_r: 2,
      tech_n: 10,
      tech_an: 4,
      tech_sn: 4,
      tech_n1: 3,
      tech_a_n: 16,
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
  const renderMath = (tex, displayMode = false) => {
    try {
      return {
        __html: katex.renderToString(tex, {
          throwOnError: false,
          displayMode,
        }),
      };
    } catch (err) {
      return { __html: "Invalid Expression" };
    }
  };

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
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 flex justify-center">
                <p className="my-1 text-center">
                  <img
                    src="/images/geom_seq.svg"
                    width="150px"
                    className="px-3"
                    alt="geometric"
                  />
                </p>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_find" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_find"
                    id="tech_find"
                    value={formData.tech_find}
                    onChange={handleChange}
                  >
                    <option value="gs">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="a1">
                      {data?.payload?.tech_lang_keys["3"]} (a₁){" "}
                    </option>
                    <option value="r">
                      {data?.payload?.tech_lang_keys["4"]} (r)
                    </option>
                    <option value="n">
                      {data?.payload?.tech_lang_keys["5"]} (n){" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_find == "n" && (
                <>
                  <div
                    className="col-span-12 mb-1 items-center justify-evenly"
                    id="cwInput"
                  >
                    <p className="label">
                      <strong>Calculate by:</strong>
                    </p>
                    <label className="pe-2" htmlFor="nth">
                      <input
                        type="radio"
                        name="tech_cw"
                        value="nth"
                        id="nth"
                        className="mr-2 border"
                        onChange={handleChange}
                        checked={formData.tech_cw == "nth"}
                      />
                      <span>{data?.payload?.tech_lang_keys["10"]}</span>
                    </label>
                    <label className="pe-2" htmlFor="s_n">
                      <input
                        type="radio"
                        name="tech_cw"
                        value="s_n"
                        id="s_n"
                        className="mr-2 border"
                        onChange={handleChange}
                        checked={formData.tech_cw == "s_n"}
                      />
                      <span>{data?.payload?.tech_lang_keys["7"]}</span>
                    </label>
                  </div>
                </>
              )}
              {(formData.tech_find == "gs" ||
                formData.tech_find == "r" ||
                formData.tech_find == "n") && (
                <>
                  <div className="col-span-12 First Term" id="a1Input">
                    <label htmlFor="tech_a1" className="label">
                      {data?.payload?.tech_lang_keys["3"]} (a₁)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_a1"
                        id="tech_a1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_a1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_find == "gs" ||
                formData.tech_find == "a1" ||
                formData.tech_find == "n") && (
                <>
                  <div className="col-span-12 Common Ratio" id="rInput">
                    <label htmlFor="tech_r" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (r)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_r"
                        id="tech_r"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_r}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_find == "gs" && (
                <>
                  <div className="col-span-12 Number of Terms" id="nInput">
                    <label htmlFor="tech_n" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (n)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        min="1"
                        max="20"
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
                </>
              )}
              {formData.tech_find == "n" && formData.tech_cw == "nth" && (
                <>
                  <div className="col-span-12 Enter n-th term" id="anInput">
                    <label htmlFor="tech_an" className="label">
                      {data?.payload?.tech_lang_keys["6"]} a(n)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_an"
                        id="tech_an"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_an}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_find == "n" && formData.tech_cw == "s_n" && (
                <>
                  <div
                    className="col-span-12 Sum of first n-terms"
                    id="snInput"
                  >
                    <label htmlFor="tech_sn" className="label">
                      {data?.payload?.tech_lang_keys["7"]} S(n)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_sn"
                        id="tech_sn"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_sn}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_find == "a1" || formData.tech_find == "r") && (
                <>
                  <div
                    className="col-span-12 mb-1 flex items-center justify-evenly"
                    id="a_nInput"
                  >
                    <p className="label">a</p>
                    <div className="flex items-center px-2">
                      (&nbsp;{" "}
                      <input
                        type="number"
                        step="any"
                        name="tech_n1"
                        id="tech_n1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_n1}
                        onChange={handleChange}
                      />
                      &nbsp;)
                    </div>
                    <p className="text-[18px] pe-2">=</p>
                    <div>
                      <input
                        type="number"
                        step="any"
                        name="tech_a_n"
                        id="tech_a_n"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_a_n}
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
                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            {formData?.tech_find == "gs" ? (
                              <tbody>
                                <tr>
                                  <td colSpan={2}>
                                    <div className="row-12 bg-sky bordered rounded-lg p-3 overflow-auto">
                                      <div className="w-full text-center text-[16px]">
                                        <p>
                                          n-th term (a
                                          <sub className="font-s-14">
                                            {formData?.tech_n}
                                          </sub>
                                          )
                                        </p>
                                        <p className="my-2">
                                          <strong className="px-3 font-s-20 radius-10 text-blue">
                                            {Number(
                                              result?.tech_an_val
                                            ).toFixed(2)}
                                          </strong>
                                        </p>
                                      </div>

                                      <div className="w-full text-center text-[16px]">
                                        <p>
                                          Geometric Sum (S
                                          <sub className="font-s-14">
                                            {formData?.tech_n}
                                          </sub>
                                          )
                                        </p>
                                        <p className="my-2">
                                          <strong className="px-3 font-s-20 radius-10 text-blue">
                                            {Number(
                                              result?.tech_sn_val
                                            ).toFixed(2)}
                                          </strong>
                                        </p>
                                      </div>

                                      <div className="w-full text-center text-[16px]">
                                        <p>
                                          {data?.payload?.tech_lang_keys[11]}
                                        </p>
                                        <p className="my-2">
                                          <strong
                                            className="px-3 font-s-20 radius-10 text-blue"
                                            dangerouslySetInnerHTML={{
                                              __html: katex.renderToString(
                                                result?.tech_seq || "",
                                                {
                                                  throwOnError: false,
                                                  displayMode: false,
                                                }
                                              ),
                                            }}
                                          />
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            ) : formData?.tech_find == "a1" ? (
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b w-[60%]">
                                    <strong>
                                      a<sub className="font-s-14">1</sub>
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_a1_val).toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            ) : formData?.tech_find == "r" ? (
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b w-[60%]">
                                    <strong>r</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_r_val).toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            ) : (
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b w-[60%]">
                                    <strong>n</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_n_val).toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            )}
                          </table>
                        </div>
                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["8"]}:
                            </strong>
                          </p>
                          {formData?.tech_find == "gs" ? (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["9"]}
                                </strong>
                              </p>

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `a_1 = ${formData?.tech_a1},\\ r = ${formData?.tech_r},\\ n = ${formData?.tech_n}`
                                )}
                              />

                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["10"]}
                                </strong>
                              </p>

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `a_n = a_1 \\cdot r^{n-1}`
                                )}
                              />

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `a_{${formData?.tech_n}} = (${formData?.tech_a1}) \\cdot (${formData?.tech_r})^{${formData?.tech_n}-1}`
                                )}
                              />

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `a_{${formData?.tech_n}} = (${
                                    formData?.tech_a1
                                  }) \\cdot (${formData?.tech_r})^{${
                                    formData?.tech_n - 1
                                  }}`
                                )}
                              />

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `a_{${formData?.tech_n}} = (${
                                    formData?.tech_a1
                                  }) \\cdot ${Math.pow(
                                    formData?.tech_r,
                                    formData?.tech_n - 1
                                  )}`
                                )}
                              />

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `a_{${formData?.tech_n}} = ${result?.tech_an_val}`
                                )}
                              />

                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["7"]}
                                </strong>
                              </p>

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `S_n = \\dfrac{a_1(1 - r^n)}{1 - r}`
                                )}
                              />

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `S_{${formData?.tech_n}} = \\dfrac{${formData?.tech_a1}(1 - ${formData?.tech_r}^{${formData?.tech_n}})}{1 - ${formData?.tech_r}}`
                                )}
                              />

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `S_{${formData?.tech_n}} = \\dfrac{${
                                    formData?.tech_a1
                                  }(1 - ${Math.pow(
                                    formData?.tech_r,
                                    formData?.tech_n
                                  )})}{1 - ${formData?.tech_r}}`
                                )}
                              />

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `S_{${formData?.tech_n}} = \\dfrac{${
                                    formData?.tech_a1
                                  }(${
                                    1 -
                                    Math.pow(formData?.tech_r, formData?.tech_n)
                                  })}{${1 - formData?.tech_r}}`
                                )}
                              />

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `S_{${formData?.tech_n}} = \\dfrac{${
                                    formData?.tech_a1 *
                                    (1 -
                                      Math.pow(
                                        formData?.tech_r,
                                        formData?.tech_n
                                      ))
                                  }}{${1 - formData?.tech_r}}`
                                )}
                              />

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `S_{${formData?.tech_n}} = ${result?.tech_sn_val}`
                                )}
                              />

                              <div
                                id="container"
                                className="col-lg-8 mx-auto my-3"
                              ></div>
                            </>
                          ) : formData?.tech_find == "a1" ? (
                            <>
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `a₁ = \\dfrac{a_n}{r^{n-1}}`
                                )}
                              />
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `a₁ = \\dfrac{${formData?.tech_a_n}}{(${formData?.tech_r})^{${formData?.tech_n1}-1}}`
                                )}
                              />
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `a₁ = \\dfrac{${formData?.tech_a_n}}{(${
                                    formData?.tech_r
                                  })^{${formData?.tech_n1 - 1}}}`
                                )}
                              />
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `a₁ = \\dfrac{${
                                    formData?.tech_a_n
                                  }}{${Math.pow(
                                    formData?.tech_r,
                                    formData?.tech_n1 - 1
                                  )}}`
                                )}
                              />
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `a₁ = ${result?.tech_a1_val}`
                                )}
                              />
                            </>
                          ) : formData?.tech_find == "r" ? (
                            <>
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `r = \\sqrt[\\large{n-1}]{\\dfrac{a_n}{a_1}}`
                                )}
                              />
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `r = \\sqrt[\\large{${formData?.tech_n1}-1}]{\\dfrac{${formData?.tech_a_n}}{${formData?.tech_a1}}}`
                                )}
                              />
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `r = \\sqrt[\\large{${
                                    formData?.tech_n1 - 1
                                  }}]{\\dfrac{${formData?.tech_a_n}}{${
                                    formData?.tech_a1
                                  }}}`
                                )}
                              />

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={renderMath(
                                  `r = ${result?.tech_r_val}`
                                )}
                              />
                            </>
                          ) : (
                            <>
                              {formData?.tech_cw == "nth" ? (
                                <>
                                  <p
                                    className="mt-2"
                                    dangerouslySetInnerHTML={renderMath(
                                      `n = \\dfrac{\\log \\left(\\dfrac{a_n}{a_1} \\right)}{\\log(r)}+1`
                                    )}
                                  />
                                  <p
                                    className="mt-2"
                                    dangerouslySetInnerHTML={renderMath(
                                      `n = \\dfrac{\\log \\left(\\dfrac{${formData?.tech_an}}{${formData?.tech_a1}} \\right)}{\\log(${formData?.tech_r})}+1`
                                    )}
                                  />
                                  <p
                                    className="mt-2"
                                    dangerouslySetInnerHTML={renderMath(
                                      `n = \\dfrac{\\log(${
                                        formData?.tech_an / formData?.tech_a1
                                      })}{\\log(${formData?.tech_r})}+1`
                                    )}
                                  />
                                  <p
                                    className="mt-2"
                                    dangerouslySetInnerHTML={renderMath(
                                      `n = ${
                                        Math.log(
                                          formData?.tech_an / formData?.tech_a1
                                        ) / Math.log(formData?.tech_r)
                                      }+1`
                                    )}
                                  />
                                  <p
                                    className="mt-2"
                                    dangerouslySetInnerHTML={renderMath(
                                      `n = ${result?.tech_n_val}`
                                    )}
                                  />
                                </>
                              ) : (
                                <>
                                  <p
                                    className="mt-2"
                                    dangerouslySetInnerHTML={renderMath(
                                      `n = \\dfrac{\\log \\left(\\left(\\left(\\dfrac{S_n}{a_1} \\right)(1-r)-1\\right)(-1)\\right)}{\\log(r)}`
                                    )}
                                  />
                                  <p
                                    className="mt-2"
                                    dangerouslySetInnerHTML={renderMath(
                                      `n = \\dfrac{\\log \\left(\\left(\\left(\\dfrac{${formData?.tech_sn}}{${formData?.tech_a1}} \\right)(1-${formData?.tech_r})-1\\right)(-1)\\right)}{\\log(${formData?.tech_r})}`
                                    )}
                                  />
                                  <p
                                    className="mt-2"
                                    dangerouslySetInnerHTML={renderMath(
                                      `n = \\dfrac{\\log(((${
                                        formData?.tech_sn / formData?.tech_a1
                                      })*(${
                                        1 - formData?.tech_r
                                      })-1)*(-1))}{\\log(${formData?.tech_r})}`
                                    )}
                                  />
                                  <p
                                    className="mt-2"
                                    dangerouslySetInnerHTML={renderMath(
                                      `n = ${result?.tech_n_val}`
                                    )}
                                  />
                                </>
                              )}
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

export default GeometricSequenceCalculator;

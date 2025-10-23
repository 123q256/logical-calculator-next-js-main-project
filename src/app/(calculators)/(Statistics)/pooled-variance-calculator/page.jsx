"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePooledVarianceCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PooledVarianceCalculator = () => {
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
    tech_type: "unequal", // equal  unequal
    tech_ronding: "4",
    tech_option: "raw", //  sum  raw
    tech_s1: "2",
    tech_s2: "5",
    tech_n1: "2",
    tech_n2: "4",
    tech_g1: "1, 2, 3, 4, 5",
    tech_g2: "2, 2, 3, 2, 2",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePooledVarianceCalculatorMutation();

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
        tech_ronding: formData.tech_ronding,
        tech_option: formData.tech_option,
        tech_s1: formData.tech_s1,
        tech_s2: formData.tech_s2,
        tech_n1: formData.tech_n1,
        tech_n2: formData.tech_n2,
        tech_g1: formData.tech_g1,
        tech_g2: formData.tech_g2,
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
      tech_type: "unequal", // equal  unequal
      tech_ronding: "4",
      tech_option: "raw", //  sum  raw
      tech_s1: "2",
      tech_s2: "5",
      tech_n1: "2",
      tech_n2: "4",
      tech_g1: "1, 2, 3, 4, 5",
      tech_g2: "2, 2, 3, 2, 2",
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

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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
            <div className="grid grid-cols-12   mt-3 gap-2 md:gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type"
                    id="tech_type"
                    value={formData.tech_type}
                    onChange={handleChange}
                  >
                    <option value="equal">Equal variances</option>
                    <option value="unequal">Unequal variances</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_ronding" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_ronding"
                    id="tech_ronding"
                    value={formData.tech_ronding}
                    onChange={handleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12  text-center flex items-center">
                <div className="d-flex align-items-center">
                  <label className="pe-2" htmlFor="sum">
                    <input
                      type="radio"
                      name="tech_option"
                      value="sum"
                      id="sum"
                      className="mr-2 border"
                      onChange={handleChange}
                      checked={formData.tech_option === "sum"}
                    />
                    <span>{data?.payload?.tech_lang_keys["3"]}</span>
                  </label>

                  <label className="pe-2" htmlFor="raw">
                    <input
                      type="radio"
                      name="tech_option"
                      value="raw"
                      id="raw"
                      className="mr-2 border"
                      onChange={handleChange}
                      checked={formData.tech_option === "raw"}
                    />
                    <span>{data?.payload?.tech_lang_keys["4"]}</span>
                  </label>
                </div>
              </div>
              {formData.tech_option == "sum" && (
                <>
                  <div className="col-span-12 sum ">
                    <div className="grid grid-cols-12    gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_s1" className="label">
                          {data?.payload?.tech_lang_keys["5"]} (S
                          <sub className="text-blue">1</sub>):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_s1"
                            id="tech_s1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_s1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_s2" className="label">
                          {data?.payload?.tech_lang_keys["5"]} (S₂):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_s2"
                            id="tech_s2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_s2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_n1" className="label">
                          {data?.payload?.tech_lang_keys["6"]} (n
                          <sub className="text-blue">1</sub>):
                        </label>
                        <div className=" relative">
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
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_n2" className="label">
                          {data?.payload?.tech_lang_keys["5"]} (n₂):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_n2"
                            id="tech_n2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_n2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_option == "raw" && (
                <>
                  <div className="col-span-12 raw">
                    <div className="grid grid-cols-12     gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_g1" className="label">
                          {data?.payload?.tech_lang_keys["7"]} (,):
                        </label>
                        <div className="w-full py-2">
                          <textarea
                            name="tech_g1"
                            id="tech_g1"
                            className="input textareaInput"
                            aria-label="textarea input"
                            placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                            value={formData.tech_g1 || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_g2" className="label">
                          {data?.payload?.tech_lang_keys["8"]} (,):
                        </label>
                        <div className="w-full py-2">
                          <textarea
                            name="tech_g2"
                            id="tech_g2"
                            className="input textareaInput"
                            aria-label="textarea input"
                            placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                            value={formData.tech_g2 || ""}
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
                        {result?.tech_type && (
                          <>
                            {result?.tech_type == "equal" ? (
                              <>
                                <div className="text-center">
                                  <p className="text-[18px]">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]}
                                    </strong>
                                  </p>
                                </div>
                                {formData?.tech_option == "sum" && (
                                  <>
                                    <div className="text-center">
                                      <p className="text-[21px] bg-[#2845F5] px-3 py-2 rounded-lg inline-block my-3">
                                        <strong className="text-white">
                                          {result?.tech_sp2}
                                        </strong>
                                      </p>

                                      <p className="w-full mt-2 text-[18px] text-blue">
                                        {data?.payload?.tech_lang_keys["10"]}
                                      </p>

                                      <div className="lg:w-8/12 mt-2 overflow-auto mx-auto">
                                        <table className="w-full">
                                          <tbody>
                                            <tr>
                                              <td className="py-2 border-b">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "11"
                                                  ]
                                                }
                                              </td>
                                              <td className="py-2 border-b">
                                                <strong className="text-blue">
                                                  {result?.tech_sp}
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="py-2 border-b">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "12"
                                                  ]
                                                }
                                              </td>
                                              <td className="py-2 border-b">
                                                <strong className="text-blue">
                                                  {result?.tech_sqrsp2}
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="py-2 border-b">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "13"
                                                  ]
                                                }{" "}
                                                (df)
                                              </td>
                                              <td className="py-2 border-b">
                                                <strong className="text-blue">
                                                  {result?.tech_n1 +
                                                    result?.tech_n2 -
                                                    2}
                                                </strong>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      <div className="overflow-auto">
                                        <p className="w-full mt-3 text-[18px] text-left font-bold">
                                          {data?.payload?.tech_lang_keys["14"]}
                                        </p>
                                        <BlockMath
                                          math={`S_p^2 = \\dfrac{(n -1)S_1^2 + (n_2 - 1)S_2^2}{n_1 + n_2 - 2}`}
                                        />
                                        <BlockMath
                                          math={`S_p^2 = \\dfrac{(${result?.tech_n1} -1)(${result?.tech_s1})^2 + (${result?.tech_n2} - 1)(${result?.tech_s2})^2}{${result?.tech_n1} + ${result?.tech_n2} - 2}`}
                                        />
                                        <BlockMath
                                          math={`S_p^2 = \\dfrac{(${result?.tech_n1_1})(${result?.tech_ps1}) + (${result?.tech_n2_1})(${result?.tech_ps2})}{${result?.tech_devi}}`}
                                        />
                                        <BlockMath
                                          math={`S_p^2 = \\dfrac{${result?.tech_n1s1} + ${result?.tech_n2s2}}{${result?.tech_devi}}`}
                                        />
                                        <BlockMath
                                          math={`S_p^2 = \\dfrac{${result?.tech_res}}{${result?.tech_devi}}`}
                                        />
                                        <BlockMath
                                          math={`S_p^2 = ${result?.tech_sp2}`}
                                        />
                                        <p className="w-full mt-3 text-[18px] text-left font-bold">
                                          {data?.payload?.tech_lang_keys["15"]}
                                        </p>
                                        <BlockMath
                                          math={`S_p^2 = ${result?.tech_sp2}`}
                                        />

                                        <p className="w-full mt-3 text-left font-bold">
                                          {data?.payload?.tech_lang_keys["16"]}
                                        </p>
                                        <BlockMath
                                          math={`\\sqrt{(S_p)^2} = \\sqrt{${result?.tech_sp2}}`}
                                        />
                                        <BlockMath
                                          math={`S_p = ${result?.tech_sqrsp2}`}
                                        />

                                        <p className="w-full mt-3 text-[18px] text-left font-bold">
                                          {data?.payload?.tech_lang_keys["12"]}
                                        </p>
                                        <BlockMath
                                          math={`SE = S_{\\bar x_1 - \\bar x_2} = S_p \\sqrt{\\dfrac{1}{n_1} + \\dfrac{1}{n_2}}`}
                                        />
                                        <BlockMath
                                          math={`SE = ${result?.tech_sqrsp2} \\sqrt{\\dfrac{1}{${result?.tech_n1}} + \\dfrac{1}{${result?.tech_n2}}}`}
                                        />
                                        <BlockMath
                                          math={`SE = ${
                                            result?.tech_sqrsp2
                                          } \\sqrt{${1 / result?.tech_n1} + ${
                                            1 / result?.tech_n2
                                          }}`}
                                        />
                                        <BlockMath
                                          math={`SE = ${result?.tech_sqrsp2} \\sqrt{${result?.tech_devn1} + ${result?.tech_devn2}}`}
                                        />
                                        <BlockMath
                                          math={`SE = ${result?.tech_sqrsp2} \\sqrt{${result?.tech_devres}}`}
                                        />
                                        <BlockMath
                                          math={`SE = ${result?.tech_sqrsp2} * ${result?.tech_sqrdevres}`}
                                        />
                                        <BlockMath
                                          math={`SE = ${result?.tech_sp}`}
                                        />

                                        <p className="w-full mt-3 text-[18px] text-left font-bold">
                                          {data?.payload?.tech_lang_keys["13"]}
                                        </p>
                                        <BlockMath
                                          math={`df = n_1 + n_2 - 2`}
                                        />
                                        <BlockMath
                                          math={`df = ${result?.tech_n1} + ${result?.tech_n2} - 2`}
                                        />
                                        <BlockMath
                                          math={`df = ${
                                            result?.tech_n1 + result?.tech_n2
                                          } - 2`}
                                        />
                                        <BlockMath
                                          math={`df = ${
                                            result?.tech_n1 +
                                            result?.tech_n2 -
                                            2
                                          }`}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                                {formData?.tech_option == "raw" && (
                                  <>
                                    <div className="text-center">
                                      <p className="text-[21px] bg-[#2845F5] px-3 py-2 rounded-lg d-inline-block my-3">
                                        <strong className="text-white">
                                          {result?.tech_pvres}
                                        </strong>
                                      </p>
                                    </div>

                                    <p className="w-full mt-2 text-[18px] text-blue">
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </p>

                                    <div className="col-lg-8 mt-2 overflow-auto">
                                      <table className="w-full">
                                        <tbody>
                                          <tr>
                                            <td className="py-2 border-b">
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "17"
                                                ]
                                              }{" "}
                                              (Sp)
                                            </td>
                                            <td className="py-2 border-b">
                                              <strong className="text-blue">
                                                {result?.tech_sqrpvres.toFixed(
                                                  4
                                                )}
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className="py-2 border-b">
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "12"
                                                ]
                                              }
                                            </td>
                                            <td className="py-2 border-b">
                                              <strong className="text-blue">
                                                {result?.tech_seres.toFixed(4)}
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className="py-2 border-b">
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "13"
                                                ]
                                              }{" "}
                                              (df)
                                            </td>
                                            <td className="py-2 border-b">
                                              <strong className="text-blue">
                                                {result?.tech_i +
                                                  result?.tech_i1 -
                                                  2}
                                              </strong>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>

                                    <p className="w-full mt-3 text-[18px]  text-left font-bold">
                                      {data?.payload?.tech_lang_keys["18"]}:
                                    </p>
                                    <p className="w-full mt-3 text-left font-bold">
                                      {data?.payload?.tech_lang_keys["19"]} ={" "}
                                      {result?.tech_countn}
                                    </p>
                                    <p className="w-full mt-3 text-left font-bold">
                                      {data?.payload?.tech_lang_keys["20"]} ={" "}
                                      {result?.tech_sum}
                                    </p>
                                    <p className="w-full mt-3 text-left font-bold">
                                      {data?.payload?.tech_lang_keys["21"]} ={" "}
                                      {(
                                        result?.tech_sum / result?.tech_countn
                                      ).toFixed(4)}
                                    </p>

                                    <div
                                      className="w-full mt-2 overflow-auto"
                                      dangerouslySetInnerHTML={{
                                        __html: result?.tech_table,
                                      }}
                                    />

                                    <BlockMath math={`\\text{Variance}`} />
                                    <BlockMath
                                      math={`S^2 = \\frac{SS}{n - 1}`}
                                    />
                                    <BlockMath
                                      math={`= \\frac{\\Sigma(x_i - \\bar x)^2}{n - 1}`}
                                    />
                                    <BlockMath
                                      math={`= \\frac{${result?.tech_ar_sum}}{${result?.tech_i} - 1}`}
                                    />
                                    <BlockMath
                                      math={`= \\frac{${result?.tech_ar_sum}}{${
                                        result?.tech_i - 1
                                      }}`}
                                    />
                                    <BlockMath math={`= ${result?.tech_v}`} />

                                    <BlockMath
                                      math={`\\text{Standard Deviation}`}
                                    />
                                    <BlockMath math={`S = \\sqrt{S^2}`} />
                                    <BlockMath
                                      math={`= \\sqrt{${result?.tech_v}}`}
                                    />
                                    <BlockMath
                                      math={`= ${result?.tech_vsqrt.toFixed(
                                        4
                                      )}`}
                                    />

                                    <p className="w-full mt-3 text-[18px] text-left font-bold">
                                      {data?.payload?.tech_lang_keys["22"]}:
                                    </p>
                                    <p className="w-full mt-3 text-left font-bold">
                                      {data?.payload?.tech_lang_keys["19"]} ={" "}
                                      {result?.tech_countn1}
                                    </p>
                                    <p className="w-full mt-3 text-left font-bold">
                                      {data?.payload?.tech_lang_keys["20"]} ={" "}
                                      {result?.tech_sum1}
                                    </p>
                                    <p className="w-full mt-3 text-left font-bold">
                                      {data?.payload?.tech_lang_keys["21"]} ={" "}
                                      {(
                                        result?.tech_sum1 / result?.tech_countn1
                                      ).toFixed(4)}
                                    </p>

                                    <div
                                      className="w-full mt-2 overflow-auto"
                                      dangerouslySetInnerHTML={{
                                        __html: result?.tech_table1,
                                      }}
                                    />

                                    <BlockMath math={`\\text{Variance}`} />
                                    <BlockMath
                                      math={`S^2 = \\frac{SS}{n - 1}`}
                                    />
                                    <BlockMath
                                      math={`= \\frac{\\Sigma(x_i - \\bar x)^2}{n - 1}`}
                                    />
                                    <BlockMath
                                      math={`= \\frac{${result?.tech_ar_sum1}}{${result?.tech_i1} - 1}`}
                                    />
                                    <BlockMath
                                      math={`= \\frac{${
                                        result?.tech_ar_sum1
                                      }}{${result?.tech_i1 - 1}}`}
                                    />
                                    <BlockMath math={`= ${result?.tech_v1}`} />

                                    <BlockMath
                                      math={`\\text{Standard Deviation}`}
                                    />
                                    <BlockMath math={`S = \\sqrt{S^2}`} />
                                    <BlockMath
                                      math={`= \\sqrt{${result?.tech_v1}}`}
                                    />
                                    <BlockMath
                                      math={`= ${result?.tech_vsqrt1}`}
                                    />

                                    <BlockMath math={`\\text{Now we have}`} />
                                    <BlockMath
                                      math={`S_1 = ${result?.tech_vsqrt} \\quad ; \\quad n_1 = ${result?.tech_i}`}
                                    />
                                    <BlockMath
                                      math={`S_2 = ${result?.tech_vsqrt1} \\quad ; \\quad n_2 = ${result?.tech_i1}`}
                                    />

                                    <BlockMath
                                      math={`\\text{Pooled Variance}`}
                                    />
                                    <BlockMath
                                      math={`S_p^2 = \\frac{(n_1 - 1)S_1^2 + (n_2 - 1)S_2^2}{n_1 + n_2 - 2}`}
                                    />
                                    <BlockMath
                                      math={`= \\frac{(${
                                        result?.tech_i
                                      } - 1)(${result?.tech_vsqrt.toFixed(
                                        4
                                      )})^2 + (${
                                        result?.tech_i1
                                      } - 1)(${result?.tech_vsqrt1.toFixed(
                                        4
                                      )})^2}{${
                                        result?.tech_i + result?.tech_i1 - 2
                                      }}`}
                                    />
                                    <BlockMath
                                      math={`= \\frac{(${result?.tech_vrres})(${
                                        result?.tech_s12
                                      }) + (${result?.tech_vrres1})(${
                                        result?.tech_s22
                                      })}{${
                                        result?.tech_i + result?.tech_i1 - 2
                                      }}`}
                                    />
                                    <BlockMath
                                      math={`= \\frac{${
                                        result?.tech_ress12
                                      } + ${result?.tech_ress22}}{${
                                        result?.tech_i + result?.tech_i1 - 2
                                      }}`}
                                    />
                                    <BlockMath
                                      math={`= \\frac{${result?.tech_pv}}{${
                                        result?.tech_i + result?.tech_i1 - 2
                                      }}`}
                                    />
                                    <BlockMath
                                      math={`= ${result?.tech_pvres}`}
                                    />

                                    <BlockMath
                                      math={`\\text{Pooled Standard Deviation}`}
                                    />
                                    <BlockMath math={`S_p = \\sqrt{S_p^2}`} />
                                    <BlockMath
                                      math={`= \\sqrt{${result?.tech_pvres}}`}
                                    />
                                    <BlockMath
                                      math={`= ${result?.tech_sqrpvres}`}
                                    />

                                    <BlockMath
                                      math={`\\text{Standard Error}`}
                                    />
                                    <BlockMath
                                      math={`SE = S_{\\bar x_1 - \\bar x_2} = S_p \\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}`}
                                    />
                                    <BlockMath
                                      math={`= ${result?.tech_sqrpvres} \\sqrt{\\frac{1}{${result?.tech_i}} + \\frac{1}{${result?.tech_i1}}}`}
                                    />
                                    <BlockMath
                                      math={`= ${result?.tech_sqrpvres} \\sqrt{${result?.tech_devn1} + ${result?.tech_devn12}}`}
                                    />
                                    <BlockMath
                                      math={`= ${result?.tech_sqrpvres} \\sqrt{${result?.tech_resdev}}`}
                                    />
                                    <BlockMath
                                      math={`= ${result?.tech_sqrpvres} * ${result?.tech_sqrresdev}`}
                                    />
                                    <BlockMath
                                      math={`= ${result?.tech_seres}`}
                                    />

                                    <BlockMath
                                      math={`\\text{Degree of Freedom}`}
                                    />
                                    <BlockMath math={`df = n_1 + n_2 - 2`} />
                                    <BlockMath
                                      math={`= ${result?.tech_i} + ${result?.tech_i1} - 2`}
                                    />
                                    <BlockMath
                                      math={`= ${
                                        result?.tech_i + result?.tech_i1
                                      } - 2`}
                                    />
                                    <BlockMath
                                      math={`= ${
                                        result?.tech_i + result?.tech_i1 - 2
                                      }`}
                                    />
                                  </>
                                )}
                              </>
                            ) : result?.tech_type == "unequal" ? (
                              <>
                                {formData?.tech_option == "sum" && (
                                  <>
                                    <div className="text-center">
                                      <p className="text-[18px] bg-[#2845F5] px-3 py-2 rounded-lg inline-block my-3">
                                        <strong className="text-white">
                                          {data?.payload?.tech_lang_keys["23"]}
                                        </strong>
                                      </p>

                                      <p className="w-full mt-2 text-[18px] text-blue">
                                        {data?.payload?.tech_lang_keys["10"]}
                                      </p>

                                      <div className="lg:col-span-8 mt-2 overflow-auto">
                                        <table className="w-full">
                                          <tbody>
                                            <tr>
                                              <td className="py-2 border-b">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "12"
                                                  ]
                                                }
                                              </td>
                                              <td className="py-2 border-b">
                                                <strong className="text-blue">
                                                  {result?.tech_seround}
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="py-2 border-b">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "24"
                                                  ]
                                                }
                                              </td>
                                              <td className="py-2 border-b">
                                                <strong className="text-blue">
                                                  {result?.tech_devs1sm}
                                                </strong>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      {/* SE Calculation */}
                                      <div className="overflow-auto">
                                        <p className="w-full mt-3 text-[18px] text-left font-bold">
                                          {data?.payload?.tech_lang_keys["12"]}
                                        </p>
                                        <BlockMath
                                          math={`SE = S_{\\bar x_1 - \\bar x_2} = \\sqrt{\\dfrac{S_1^2}{n_1} + \\dfrac{S_2^2}{n_2}}`}
                                        />
                                        <BlockMath
                                          math={`= ${result?.tech_sqrsp2} \\sqrt{\\dfrac{(${result?.tech_s1})^2}{${result?.tech_n1}} + \\dfrac{(${result?.tech_s2})^2}{${result?.tech_n2}}}`}
                                        />
                                        <BlockMath
                                          math={`= ${result?.tech_sqrsp2} \\sqrt{\\dfrac{${result?.tech_ps1}}{${result?.tech_n1}} + \\dfrac{${result?.tech_ps2}}{${result?.tech_n2}}}`}
                                        />
                                        <BlockMath
                                          math={`= ${result?.tech_sqrsp2} \\sqrt{${result?.tech_devs1n1} + ${result?.tech_devs2n2}}`}
                                        />
                                        <BlockMath
                                          math={`= ${result?.tech_sqrsp2} \\sqrt{${result?.tech_se}}`}
                                        />
                                        <BlockMath
                                          math={`= ${result?.tech_seround}`}
                                        />

                                        {/* DF Calculation */}
                                        <p className="w-full mt-3 text-[18px] text-left">
                                          {data?.payload?.tech_lang_keys["24"]}
                                        </p>
                                        <BlockMath
                                          math={`df = \\dfrac{(\\dfrac{S_1^2}{n_1} + \\dfrac{S_2^2}{n_2})^2}{\\dfrac{S_1^4}{n_1^2(n_1 - 1)} + \\dfrac{S_2^4}{n_2^2(n_2 - 1)}}`}
                                        />
                                        <BlockMath
                                          math={`= \\dfrac{(\\dfrac{${result?.tech_s1}^2}{${result?.tech_n1}} + \\dfrac{${result?.tech_s2}^2}{${result?.tech_n2}})^2}{\\dfrac{${result?.tech_s1}^4}{${result?.tech_n1}^2(${result?.tech_n1}-1)} + \\dfrac{${result?.tech_s2}^4}{${result?.tech_n2}^2(${result?.tech_n2}-1)}}`}
                                        />
                                        <BlockMath
                                          math={`= \\dfrac{(\\dfrac{${result?.tech_ps1}}{${result?.tech_n1}} + \\dfrac{${result?.tech_ps2}}{${result?.tech_n2}})^2}{\\dfrac{${result?.tech_ps14}}{${result?.tech_pn1}(${result?.tech_devn1})} + \\dfrac{${result?.tech_ps24}}{${result?.tech_pn2}(${result?.tech_devn2})}}`}
                                        />
                                        <BlockMath
                                          math={`= \\dfrac{(\\dfrac{${
                                            result?.tech_ps1
                                          }}{${result?.tech_n1}} + \\dfrac{${
                                            result?.tech_ps2
                                          }}{${result?.tech_n2}})^2}{\\dfrac{${
                                            result?.tech_ps14
                                          }}{${
                                            result?.tech_pn1 *
                                            result?.tech_devn1
                                          }} + \\dfrac{${result?.tech_ps24}}{${
                                            result?.tech_pn2 *
                                            result?.tech_devn2
                                          }}}`}
                                        />
                                        <BlockMath
                                          math={`= \\dfrac{(${
                                            result?.tech_devs1n1
                                          } + ${result?.tech_devs2n2})^2}{${
                                            result?.tech_devpspn
                                          } + ${Number(
                                            result?.tech_psmpn
                                          ).toFixed(4)}}`}
                                        />
                                        <BlockMath
                                          math={`= \\dfrac{(${
                                            result?.tech_devs1s2
                                          })^2}{${Number(
                                            result?.tech_devpsmp
                                          ).toFixed(4)}}`}
                                        />
                                        <BlockMath
                                          math={`= \\dfrac{${Number(
                                            result?.tech_powdevs1s2
                                          ).toFixed(4)}}{${Number(
                                            result?.tech_devpsmp
                                          ).toFixed(4)}}`}
                                        />
                                        <BlockMath
                                          math={`= ${result?.tech_devs1sm}`}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                                {formData?.tech_option == "raw" && (
                                  <>
                                    <div>
                                      <div className="text-center">
                                        <p className="text-[18px] bg-[#2845F5] px-3 py-2 rounded-lg d-inline-block my-3">
                                          <strong className="text-white">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "23"
                                              ]
                                            }
                                          </strong>
                                        </p>
                                      </div>

                                      <p className="w-full mt-2 text-[18px] text-blue">
                                        {data?.payload?.tech_lang_keys["10"]}
                                      </p>

                                      <div className="col-lg-8 mt-2 overflow-auto">
                                        <table className="w-full">
                                          <tbody>
                                            <tr>
                                              <td className="py-2 border-b">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "12"
                                                  ]
                                                }
                                              </td>
                                              <td className="py-2 border-b">
                                                <strong className="text-blue">
                                                  {result?.tech_sqrresdev}
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="py-2 border-b">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "24"
                                                  ]
                                                }
                                              </td>
                                              <td className="py-2 border-b">
                                                <strong className="text-blue">
                                                  {result?.tech_dftres}
                                                </strong>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      <div className="overflow-auto">
                                        <p className="w-full mt-3  text-left font-bold">
                                          {data?.payload?.tech_lang_keys["18"]}:
                                        </p>
                                        <p className="w-full mt-3 text-left font-bold">
                                          {data?.payload?.tech_lang_keys["19"]}{" "}
                                          = {result?.tech_countn}
                                        </p>
                                        <p className="w-full mt-3 text-left font-bold">
                                          {data?.payload?.tech_lang_keys["20"]}{" "}
                                          = {result?.tech_sum}
                                        </p>
                                        <p className="w-full mt-3 text-left font-bold">
                                          {data?.payload?.tech_lang_keys["21"]}{" "}
                                          ={" "}
                                          {result?.tech_sum /
                                            result?.tech_countn}
                                        </p>

                                        <div
                                          className="w-full mt-2 overflow-auto"
                                          dangerouslySetInnerHTML={{
                                            __html: result?.tech_table,
                                          }}
                                        />

                                        {/* Variance */}
                                        <BlockMath math={`\\text{Variance}`} />
                                        <BlockMath
                                          math={`S^2 = \\dfrac{SS}{n - 1}`}
                                        />
                                        <BlockMath
                                          math={`= \\dfrac{\\Sigma(x_i - \\bar x)^2}{n -1}`}
                                        />
                                        <BlockMath
                                          math={`= \\dfrac{${result?.tech_ar_sum}}{${result?.tech_i} - 1}`}
                                        />
                                        <BlockMath
                                          math={`= \\dfrac{${
                                            result?.tech_ar_sum
                                          }}{${result?.tech_i - 1}}`}
                                        />
                                        <BlockMath
                                          math={`= ${result?.tech_v}`}
                                        />

                                        {/* Standard Deviation */}
                                        <BlockMath
                                          math={`\\text{Standard Deviation}`}
                                        />
                                        <BlockMath math={`S = \\sqrt{S^2}`} />
                                        <BlockMath
                                          math={`= \\sqrt{${result?.tech_v}}`}
                                        />
                                        <BlockMath
                                          math={`= ${result?.tech_vsqrt}`}
                                        />

                                        {/* Repeat for second group */}
                                        <p className="w-full mt-3 text-[18px] text-left font-bold">
                                          {data?.payload?.tech_lang_keys["22"]}:
                                        </p>
                                        <p className="w-full mt-3 text-left font-bold">
                                          {data?.payload?.tech_lang_keys["19"]}{" "}
                                          = {result?.tech_countn1}
                                        </p>
                                        <p className="w-full mt-3 text-left font-bold">
                                          {data?.payload?.tech_lang_keys["20"]}{" "}
                                          = {result?.tech_sum1}
                                        </p>
                                        <p className="w-full mt-3 text-left font-bold">
                                          {data?.payload?.tech_lang_keys["21"]}{" "}
                                          ={" "}
                                          {result?.tech_sum1 /
                                            result?.tech_countn1}
                                        </p>

                                        <div
                                          className="w-full mt-2 overflow-auto"
                                          dangerouslySetInnerHTML={{
                                            __html: result?.tech_table1,
                                          }}
                                        />

                                        {/* Variance 2 */}
                                        <BlockMath math={`\\text{Variance}`} />
                                        <BlockMath
                                          math={`S^2 = \\dfrac{${
                                            result?.tech_ar_sum1
                                          }}{${result?.tech_i1 - 1}}`}
                                        />
                                        <BlockMath
                                          math={`= ${result?.tech_v1}`}
                                        />

                                        {/* Standard Deviation 2 */}
                                        <BlockMath
                                          math={`\\text{Standard Deviation}`}
                                        />
                                        <BlockMath
                                          math={`S = \\sqrt{${result?.tech_v1}}`}
                                        />
                                        <BlockMath
                                          math={`= ${result?.tech_vsqrt1}`}
                                        />

                                        {/* Standard Error */}
                                        <BlockMath
                                          math={`\\text{Now we have}`}
                                        />
                                        <BlockMath
                                          math={`S_1 = ${result?.tech_vsqrt} \\quad ; \\quad n_1 = ${result?.tech_i}`}
                                        />
                                        <BlockMath
                                          math={`S_2 = ${result?.tech_vsqrt1} \\quad ; \\quad n_2 = ${result?.tech_i1}`}
                                        />

                                        <BlockMath
                                          math={`\\text{Standard Error}`}
                                        />
                                        <BlockMath
                                          math={`SE = \\sqrt{\\dfrac{${result?.tech_s12}}{${result?.tech_i}} + \\dfrac{${result?.tech_s22}}{${result?.tech_i1}}}`}
                                        />
                                        <BlockMath
                                          math={`= \\sqrt{${result?.tech_vsqi?.toFixed(
                                            4
                                          )} + ${result?.tech_vsqi1?.toFixed(
                                            4
                                          )}}`}
                                        />
                                        <BlockMath
                                          math={`= \\sqrt{${result?.tech_resdev?.toFixed(
                                            4
                                          )}}`}
                                        />
                                        <BlockMath
                                          math={`= ${result?.tech_sqrresdev}`}
                                        />

                                        {/* Degrees of Freedom */}
                                        <BlockMath
                                          math={`\\text{DF (t-distribution)}`}
                                        />
                                        <BlockMath
                                          math={`df = \\dfrac{(${result?.tech_vsqi?.toFixed(
                                            4
                                          )} + ${result?.tech_vsqi1?.toFixed(
                                            4
                                          )})^2}{${result?.tech_devn1?.toFixed(
                                            4
                                          )} + ${result?.tech_devn12?.toFixed(
                                            4
                                          )}}`}
                                        />
                                        <BlockMath
                                          math={`= \\dfrac{${result?.tech_powdft?.toFixed(
                                            4
                                          )}}{${result?.tech_dft1?.toFixed(
                                            4
                                          )}}`}
                                        />
                                        <BlockMath
                                          math={`= ${result?.tech_dftres}`}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
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

export default PooledVarianceCalculator;

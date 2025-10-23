"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import katex from "katex";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useNormalDistributionCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const NormalDistributionCalculator = () => {
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
    tech_operations: "3", //   3 4
    tech_find_compare: "1",
    tech_f_first: "0.4",
    tech_f_second: "3",
    tech_f_third: "5",
    tech_mean: "4",
    tech_deviation: "45",
    tech_a: "0.1",
    tech_b: "0.1",
    tech_c: "0.1",
    tech_d: "0.1",
    tech_e1: "0.3",
    tech_e2: "0.5",
    tech_f: "0.1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useNormalDistributionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_operations == 3) {
      if (
        !formData.tech_operations ||
        !formData.tech_find_compare ||
        !formData.tech_f_first ||
        !formData.tech_f_second ||
        !formData.tech_f_third
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_operations ||
        !formData.tech_deviation ||
        !formData.tech_mean
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_find_compare: formData.tech_find_compare,
        tech_f_first: formData.tech_f_first,
        tech_f_second: formData.tech_f_second,
        tech_f_third: formData.tech_f_third,
        tech_mean: formData.tech_mean,
        tech_deviation: formData.tech_deviation,
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_c: formData.tech_c,
        tech_d: formData.tech_d,
        tech_e1: formData.tech_e1,
        tech_e2: formData.tech_e2,
        tech_f: formData.tech_f,
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
      tech_operations: "3", //   3 4
      tech_find_compare: "1",
      tech_f_first: "0.4",
      tech_f_second: "3",
      tech_f_third: "5",
      tech_mean: "4",
      tech_deviation: "45",
      tech_a: "0.1",
      tech_b: "0.1",
      tech_c: "0.1",
      tech_d: "0.1",
      tech_e1: "0.3",
      tech_e2: "0.5",
      tech_f: "0.1",
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
  const renderMath = (latex) => {
    return { __html: katex.renderToString(latex, { throwOnError: false }) };
  };

  const final = 0;
  const answer1 = 0;
  const final11 = 0;

  if (result) {
    // Calculate values:
    const answer1 = result.tech_blow - formData.tech_mean;

    const final = answer1 / formData.tech_deviation;

    const answer11 = result.tech_above2 - formData.tech_mean;
    const final11 = (answer11 / formData.tech_deviation).toFixed(2);
  }

  const e1 = Number(formData?.tech_e1);
  const e2 = Number(formData?.tech_e2);
  const mean = Number(formData?.tech_mean);
  const deviation = Number(formData?.tech_deviation);

  const finalE1 = ((e1 - mean) / deviation).toFixed(4);
  const finalE2 = ((e2 - mean) / deviation).toFixed(4);
  const mainAns = (result?.tech_ltpv_e2 - result?.tech_ltpv_e1).toFixed(4);

  const meanxx = formData?.tech_mean;
  const deviationxx = formData?.tech_deviation;
  const llf = result?.tech_llf;
  const ulf = result?.tech_ulf;
  const final_f1 = ((llf - meanxx) / deviationxx).toFixed(2);
  const final_f2 = ((ulf - meanxx) / deviationxx).toFixed(2);

  // Calculate your values first (handle null or undefined safely)
  const tech_llf = result?.tech_llf ?? 0;
  const tech_ulf = result?.tech_ulf ?? 0;
  const meanxd = formData?.tech_mean ?? 1; // avoid divide by zero
  const deviationccc = formData?.tech_deviation ?? 1;
  const f = formData?.tech_f ?? "";

  // Prepare the KaTeX math expression string
  const math = `P\\left( \\frac{${tech_llf} - ${meanxd}}{${deviationccc}} \\leq Z \\leq \\frac{${tech_ulf} - ${meanxd}}{${deviationccc}} \\right) = ${f}`;

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

          <div className="lg:w-[70%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2">
              <div className="col-span-12   md:col-span-6 lg:col-span-6  mb-2">
                <label htmlFor="tech_operations" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_operations"
                    id="tech_operations"
                    value={formData.tech_operations}
                    onChange={handleChange}
                  >
                    <option value="3">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_operations == "3" && (
                <>
                  <div className="col-span-12" id="main_div">
                    <div className="grid grid-cols-12 gap-1  md:gap-3">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_find_compare" className="label">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_find_compare"
                            id="tech_find_compare"
                            value={formData.tech_find_compare}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["5"]} (x)
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["6"]} P(X &lt; x)
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        {formData.tech_find_compare == "1" && (
                          <>
                            <label htmlFor="tech_f_first" className="label">
                              {data?.payload?.tech_lang_keys["7"]} P(X &lt; x)
                            </label>
                          </>
                        )}
                        {formData.tech_find_compare == "2" && (
                          <>
                            <label htmlFor="tech_f_first" className="label">
                              Normal random variable (x):
                            </label>
                          </>
                        )}

                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_f_first"
                            id="tech_f_first"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_f_first}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_f_second" className="label">
                          {data?.payload?.tech_lang_keys["8"]}
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_f_second"
                            id="tech_f_second"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_f_second}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_f_third" className="label">
                          {data?.payload?.tech_lang_keys["9"]}
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_f_third"
                            id="tech_f_third"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_f_third}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_operations == "4" && (
                <>
                  <div id="main_div2" className="col-span-12 ">
                    <div className="grid grid-cols-12 gap-1 md:gap-3 overflow-auto">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_mean" className="label">
                          {data?.payload?.tech_lang_keys["8"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_mean"
                            id="tech_mean"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_mean}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_deviation" className="label">
                          {data?.payload?.tech_lang_keys["9"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_deviation"
                            id="tech_deviation"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_deviation}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <p className="col-span-12 text-[18px] px-2">
                        <strong className="text-blue">
                          {data?.payload?.tech_lang_keys[10]}
                        </strong>
                      </p>

                      <div className="col-span-12 flex items-center overflow-auto">
                        <label htmlFor="a">
                          <InlineMath math="P(X \leq" />
                        </label>

                        <input
                          type="number"
                          step="any"
                          name="tech_a"
                          id="tech_a"
                          className="input my-2 mx-1"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_a}
                          onChange={handleChange}
                          style={{ width: "90px" }}
                        />

                        <InlineMath math=")=?" />
                      </div>
                      <div className="col-span-12 flex items-center mt-3">
                        <label htmlFor="b">
                          <InlineMath math="P(X \geq" />
                        </label>

                        <input
                          type="number"
                          step="any"
                          name="tech_b"
                          id="tech_b"
                          className="input my-2 mx-1"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_b}
                          onChange={handleChange}
                          style={{ width: "90px" }}
                        />

                        <InlineMath math=")=?" />
                      </div>
                      <div className="col-span-12 flex items-center mt-3">
                        <label htmlFor="c">
                          <InlineMath math="P(X \leq ?)=" />
                        </label>

                        <input
                          type="number"
                          step="any"
                          name="tech_c"
                          id="tech_c"
                          className="input my-2 mx-1"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_c}
                          onChange={handleChange}
                          style={{ width: "90px" }}
                        />
                      </div>
                      <div className="col-span-12 flex items-center mt-3">
                        <label htmlFor="d">
                          <InlineMath math="P(X \geq ?) =" />
                        </label>

                        <input
                          type="number"
                          step="any"
                          name="tech_d"
                          id="tech_d"
                          className="input my-2 mx-1"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_d}
                          onChange={handleChange}
                          style={{ width: "90px" }}
                        />
                      </div>
                      <div className="col-span-12 flex items-center mt-3 gap-1">
                        <label htmlFor="e1">
                          <InlineMath math="P(" />
                        </label>

                        <input
                          type="number"
                          step="any"
                          name="tech_e1"
                          id="tech_e1"
                          className="input my-2 mx-1"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_e1}
                          onChange={handleChange}
                          style={{ width: "90px" }}
                        />

                        <label htmlFor="e2">
                          <InlineMath math="\leq X \leq" />
                        </label>

                        <input
                          type="number"
                          step="any"
                          name="tech_e2"
                          id="tech_e2"
                          className="input my-2 mx-1"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_e2}
                          onChange={handleChange}
                          style={{ width: "90px" }}
                        />

                        <InlineMath math=") = ?" />
                      </div>
                      <div className="col-span-12 flex items-center mt-3 gap-8">
                        <BlockMath math={"P( -a \\leq X \\leq b ) ="} />

                        <input
                          type="number"
                          step="any"
                          name="tech_f"
                          id="tech_f"
                          className="input my-2 mx-1"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_f}
                          onChange={handleChange}
                          style={{ width: "90px" }}
                        />
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

                  <div className="rounded-lg ">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {result?.tech_option1 ? (
                          <>
                            <p className="text-[18px] text-center">
                              <strong className="text-blue">
                                {data?.payload?.tech_lang_keys["12"]}
                              </strong>
                            </p>

                            <div className="lg:text-[20px] md:text-[20px] text-[16px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3 overflow-auto">
                              <strong>
                                <BlockMath
                                  math={`P(X \\leq ${result?.tech_blow_first}) = ${formData?.tech_f_first}`}
                                />
                              </strong>
                            </div>

                            <p className="col-span-12 w-full mt-3 text-[18px]">
                              <strong className="text-blue">
                                {data?.payload?.tech_lang_keys[13]}:
                              </strong>
                            </p>

                            <p className="col-span-12 w-full mt-2 text-[18px]">
                              <b>{data?.payload?.tech_lang_keys[14]} 1:</b>
                            </p>

                            <p className="col-span-12 w-full mt-2 text-center overflow-auto">
                              {data?.payload?.tech_lang_keys[15]}{" "}
                              <strong>
                                <InlineMath
                                  math={`(X \\leq ${formData?.tech_f_first})`}
                                />
                              </strong>{" "}
                              {data?.payload?.tech_lang_keys[16]}
                            </p>

                            <div className="col-span-12 w-full text-center">
                              <div className="flex justify-center">
                                <img
                                  src={`/images/z_score/${result?.tech_z_url}.png`}
                                  alt="Z-Score Graph"
                                  className="img_set"
                                  width="57%"
                                  height="100%"
                                />
                              </div>
                            </div>

                            <p className="col-span-12 w-full mt-2 text-[18px]">
                              <b>{data?.payload?.tech_lang_keys[14]} 2:</b>
                            </p>

                            <p className="col-span-12 w-full mt-2 overflow-auto">
                              {data?.payload?.tech_lang_keys[17]}{" "}
                              <b>
                                <InlineMath
                                  math={`\\mu = ${formData?.tech_f_second}`}
                                />
                              </b>{" "}
                              {data?.payload?.tech_lang_keys[18]}{" "}
                              <b>
                                <InlineMath
                                  math={`\\sigma = ${formData?.tech_f_third}`}
                                />
                              </b>{" "}
                              {data?.payload?.tech_lang_keys[19]}:
                            </p>

                            <p className="col-span-12 w-full mt-2 text-center overflow-auto">
                              <BlockMath
                                math={`P(X \\leq ?) = P(X - \\mu \\leq ${
                                  formData?.tech_f_first -
                                  formData?.tech_f_second
                                }) = P\\left(\\frac{X - \\mu}{\\sigma} \\leq \\frac{${
                                  formData?.tech_f_first
                                } - ${formData?.tech_f_second}}{${
                                  formData?.tech_f_third
                                }}\\right)`}
                              />
                            </p>

                            <p className="col-span-12 w-full mt-2 overflow-auto">
                              {data?.payload?.tech_lang_keys[17]}{" "}
                              <b>
                                <InlineMath
                                  math={`\\frac{x - \\mu}{\\sigma} = Z = \\frac{${
                                    formData?.tech_f_first
                                  } - ${formData?.tech_f_second}}{${
                                    formData?.tech_f_third
                                  }} = ${
                                    (formData?.tech_f_first -
                                      formData?.tech_f_second) /
                                    formData?.tech_f_third
                                  }`}
                                />
                              </b>{" "}
                              {data?.payload?.tech_lang_keys[19]}:
                            </p>

                            <p className="col-span-12 w-full mt-2 text-center overflow-auto">
                              <BlockMath
                                math={`P(X \\leq ?) = P(Z \\leq ${
                                  (formData?.tech_f_first -
                                    formData?.tech_f_second) /
                                  formData?.tech_f_third
                                })`}
                              />
                            </p>

                            <p className="col-span-12 w-full mt-2 text-[18px]">
                              <b>{data?.payload?.tech_lang_keys[14]} 3:</b>
                            </p>

                            <p className="col-span-12 w-full mt-2 overflow-auto">
                              {data?.payload?.tech_lang_keys[20]}{" "}
                              <b>{data?.payload?.tech_lang_keys[21]}</b>{" "}
                              {data?.payload?.tech_lang_keys[22]}:
                            </p>

                            <p className="col-span-12 w-full mt-2 text-center overflow-auto">
                              <BlockMath
                                math={`P(Z \\leq ${result?.tech_blow_first}) = ${formData?.tech_f_first}`}
                              />
                            </p>
                          </>
                        ) : result?.tech_option2 ? (
                          <>
                            <div>
                              <p className="text-[18px]">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["12"]}
                                </strong>
                              </p>

                              <p className="lg:text-[20px] md:text-[20px] text-[16px] bg-[#2845F5] text-white px-3 overflow-auto py-2 rounded-lg d-inline-block my-3">
                                <strong>
                                  <BlockMath
                                    math={`P(X \\leq ${formData?.tech_f_first}) = ${result?.tech_ltpv_first}`}
                                  />
                                </strong>
                              </p>

                              <p className="col-span-12 w-full mt-3 text-[18px]">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys[13]}:
                                </strong>
                              </p>

                              <p className="col-span-12 w-full mt-2 text-[18px]">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys[14]} 1:
                                </strong>
                              </p>

                              <p className="col-span-12 w-full mt-2 text-center overflow-auto">
                                {data?.payload?.tech_lang_keys[15]}{" "}
                                <strong>
                                  <BlockMath
                                    math={`(X \\leq ${formData?.tech_f_first})`}
                                  />
                                </strong>{" "}
                                {data?.payload?.tech_lang_keys[16]}.
                              </p>

                              <div className="col-span-12 w-full text-center">
                                <div className="flex justify-center">
                                  <img
                                    src={`/images/z_score/${result?.tech_z_url}.png`}
                                    alt="Z-Score Graph"
                                    className="img_set"
                                    width="57%"
                                    height="100%"
                                  />
                                </div>
                              </div>

                              <p className="col-span-12 w-full mt-2 text-[18px]">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys[14]} 2:
                                </strong>
                              </p>

                              <p className="col-span-12 w-full mt-2 overflow-auto">
                                {data?.payload?.tech_lang_keys[17]}{" "}
                                <strong>
                                  <BlockMath
                                    math={`\\mu = ${formData?.tech_f_second}`}
                                  />
                                </strong>{" "}
                                {data?.payload?.tech_lang_keys[18]}{" "}
                                <strong>
                                  <BlockMath
                                    math={`\\sigma = ${formData?.tech_f_third}`}
                                  />
                                </strong>{" "}
                                {data?.payload?.tech_lang_keys[19]}:
                              </p>

                              <p className="col-span-12 w-full mt-2 text-center overflow-auto">
                                <BlockMath
                                  math={`P(X \\leq ${formData?.tech_f_first}) = P(X - \\mu \\leq ${formData?.tech_f_first} - ${formData?.tech_f_second}) = P\\left( \\frac{X - \\mu}{\\sigma} \\leq \\frac{${formData?.tech_f_first} - ${formData?.tech_f_second}}{${formData?.tech_f_third}} \\right)`}
                                />
                              </p>

                              <p className="col-span-12 w-full mt-2 overflow-auto">
                                {data?.payload?.tech_lang_keys[17]}{" "}
                                <strong>
                                  <BlockMath
                                    math={`Z = \\frac{x - \\mu}{\\sigma} = \\frac{${formData?.tech_f_first} - ${formData?.tech_f_second}}{${formData?.tech_f_third}} = ${result?.tech_ltpv_first}`}
                                  />
                                </strong>{" "}
                                {data?.payload?.tech_lang_keys[19]}:
                              </p>

                              <p className="col-span-12 w-full mt-2 text-center overflow-auto">
                                <BlockMath
                                  math={`P(X \\leq ${formData?.tech_f_first}) = P(Z \\leq ${result?.tech_rz_first})`}
                                />
                              </p>

                              <p className="col-span-12 w-full mt-2 text-[18px]">
                                <b>{data?.payload?.tech_lang_keys[19]} 3:</b>
                              </p>

                              <p className="col-span-12 w-full mt-2 overflow-auto">
                                {data?.payload?.tech_lang_keys[20]}{" "}
                                <b>{data?.payload?.tech_lang_keys[21]}</b>{" "}
                                {data?.payload?.tech_lang_keys[22]}:
                              </p>

                              <p className="col-span-12 w-full mt-2 text-center overflow-auto">
                                <BlockMath
                                  math={`P(Z \\leq ${result?.tech_rz_first}) = ${result?.tech_ltpv_first}`}
                                />
                              </p>
                            </div>
                          </>
                        ) : null}
                        {result?.tech_a && (
                          <div>
                            <p className="text-[18px]">
                              <strong className="text-blue">
                                {data?.payload?.tech_lang_keys[12]}
                              </strong>
                            </p>
                            <p className="lg:text-[20px] md:text-[20px] text-[16px] bg-[#2845F5] text-white px-3 overflow-auto py-2 rounded-lg d-inline-block my-3">
                              <strong
                                dangerouslySetInnerHTML={renderMath(
                                  `P(X \\leq ${formData?.tech_a}) = ${result?.tech_ltpv}`
                                )}
                              />
                            </p>

                            <p className="col-12 mt-3 text-[18px]">
                              <strong className="text-blue">
                                {data?.payload?.tech_lang_keys[13]}:
                              </strong>
                            </p>

                            {/* Example of other math expressions */}
                            <p className="col-12 mt-2 overflow-auto">
                              {data?.payload?.tech_lang_keys[15]}{" "}
                              <strong
                                dangerouslySetInnerHTML={renderMath(
                                  `(X \\leq ${formData?.tech_a})`
                                )}
                              />
                              {data?.payload?.tech_lang_keys[16]}.
                            </p>

                            <div>
                              <div className="flex justify-center">
                                <img
                                  src={`/images/z_score/${result?.tech_z_url}.png`}
                                  alt="Z-Score Graph"
                                  className="img_set"
                                  width="57%"
                                  height="100%"
                                />
                              </div>
                            </div>

                            <p className="col-12 mt-2 text-[18px]">
                              <strong className="text-blue">
                                {data?.payload?.tech_lang_keys[14]} 2:
                              </strong>
                            </p>

                            <p className="col-12 mt-2 overflow-auto">
                              {data?.payload?.tech_lang_keys[17]}{" "}
                              <strong
                                dangerouslySetInnerHTML={renderMath(
                                  `\\mu = ${formData?.tech_mean}`
                                )}
                              />{" "}
                              {data?.payload?.tech_lang_keys[18]}{" "}
                              <strong
                                dangerouslySetInnerHTML={renderMath(
                                  `\\sigma = ${formData?.tech_deviation}`
                                )}
                              />{" "}
                              {data?.payload?.tech_lang_keys[19]}:
                            </p>

                            <p className="col-12 mt-2 overflow-auto">
                              <strong
                                dangerouslySetInnerHTML={renderMath(
                                  `P(X \\leq ${formData?.tech_a}) = P\\left(\\frac{X - \\mu}{\\sigma} \\leq \\frac{${formData?.tech_a} - ${formData?.tech_mean}}{${formData?.tech_deviation}}\\right)`
                                )}
                              />
                            </p>

                            <p className="col-12 mt-2 overflow-auto">
                              {data?.payload?.tech_lang_keys[17]}{" "}
                              <strong
                                dangerouslySetInnerHTML={renderMath(
                                  `Z = \\frac{x - \\mu}{\\sigma} = ${formData?.tech_a} - ${formData?.tech_mean} / ${formData?.tech_deviation} = ${result?.tech_ltpv}`
                                )}
                              />{" "}
                              {data?.payload?.tech_lang_keys[19]}:
                            </p>

                            <p className="col-12 mt-2 overflow-auto">
                              <strong
                                dangerouslySetInnerHTML={renderMath(
                                  `P(X \\leq ${formData?.tech_a}) = P(Z \\leq ${result?.tech_rz})`
                                )}
                              />
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              <b>{data?.payload?.tech_lang_keys[14]} 3:</b>
                            </p>

                            <p className="col-12 mt-2 overflow-auto">
                              {data?.payload?.tech_lang_keys[20]}{" "}
                              <strong>
                                {data?.payload?.tech_lang_keys[21]}
                              </strong>{" "}
                              {data?.payload?.tech_lang_keys[22]}:
                            </p>

                            <p className="col-12 mt-2 overflow-auto">
                              <strong
                                dangerouslySetInnerHTML={renderMath(
                                  `P(Z \\leq ${result?.tech_rz}) = ${result?.tech_ltpv}`
                                )}
                              />
                            </p>
                          </div>
                        )}
                        {result?.tech_b && (
                          <>
                            <div>
                              <p className="text-[18px]">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys[12]}
                                </strong>
                              </p>

                              <p className="lg:text-[20px] md:text-[20px] text-[16px] bg-[#2845F5] text-white px-3 overflow-auto py-2 rounded-lg d-inline-block my-3">
                                <strong>
                                  {/* KaTeX expression */}
                                  <BlockMath
                                    math={`P\\left(X \\geq ${formData?.tech_b}\\right) = ${result?.tech_rtpv2}`}
                                  />
                                </strong>
                              </p>

                              <p className="col-12 mt-3 text-[18px]">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys[13]}:
                                </strong>
                              </p>

                              <p className="col-12 mt-2 text-[18px]">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys[14]} 1:
                                </strong>
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                {data?.payload?.tech_lang_keys[15]}{" "}
                                <b>
                                  <BlockMath
                                    math={`\\left( X \\geq ${formData?.tech_b} \\right)`}
                                  />
                                </b>{" "}
                                {data?.payload?.tech_lang_keys[16]}.
                              </p>

                              <div className="text-blue">
                                <div className="flex justify-center">
                                  <img
                                    src={`/images/z_score/${result?.tech_z_url}.png`}
                                    alt="Z-Score Graph"
                                    className="img_set"
                                    width="57%"
                                    height="100%"
                                  />
                                </div>
                              </div>

                              <p className="col-12 mt-2 text-[18px]">
                                <b>{data?.payload?.tech_lang_keys[14]} 2:</b>
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                {data?.payload?.tech_lang_keys[17]}{" "}
                                <b>
                                  <BlockMath
                                    math={`\\mu = ${formData?.tech_mean}`}
                                  />
                                </b>{" "}
                                {data?.payload?.tech_lang_keys[18]}{" "}
                                <b>
                                  <BlockMath
                                    math={`\\sigma = ${formData?.tech_deviation}`}
                                  />
                                </b>{" "}
                                {data?.payload?.tech_lang_keys[19]}:
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                <BlockMath
                                  math={`P\\left( X \\geq ${formData?.tech_b} \\right) = P\\left( X - \\mu \\geq ${formData?.tech_b} - ${formData?.tech_mean} \\right) = P\\left( \\frac{X - \\mu}{\\sigma} \\geq \\frac{${formData?.tech_b} - ${formData?.tech_mean}}{${formData?.tech_deviation}} \\right)`}
                                />
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                {data?.payload?.tech_lang_keys[17]}{" "}
                                <b>
                                  <BlockMath
                                    math={`\\frac{X - \\mu}{\\sigma} = Z = ${formData?.tech_b} - ${formData?.tech_mean} / ${formData?.tech_deviation} = ${result?.tech_rtpv2}`}
                                  />
                                </b>{" "}
                                {data?.payload?.tech_lang_keys[19]}:
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                <BlockMath
                                  math={`P\\left( X \\geq ${formData?.tech_b} \\right) = P\\left( Z \\geq ${result?.tech_rz2} \\right)`}
                                />
                              </p>

                              <p className="col-12 mt-2 text-[18px]">
                                <b>{data?.payload?.tech_lang_keys[14]} 3:</b>
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                {data?.payload?.tech_lang_keys[20]}{" "}
                                <b>{data?.payload?.tech_lang_keys[21]}</b>{" "}
                                {data?.payload?.tech_lang_keys[22]}:
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                <BlockMath
                                  math={`P\\left( Z \\geq ${result?.tech_rz2} \\right) = ${result?.tech_rtpv2}`}
                                />
                              </p>
                            </div>
                          </>
                        )}
                        {result?.tech_c && (
                          <>
                            <div>
                              <div>
                                <p className="text-[18px]">
                                  <strong className="text-blue">
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </strong>
                                </p>
                                <p className="lg:text-[20px] md:text-[20px] text-[16px] bg-[#2845F5] text-white px-3 overflow-auto py-2 rounded-lg d-inline-block my-3">
                                  <strong>
                                    <BlockMath
                                      math={`P(X \\leq ${result.tech_blow}) = ${formData.tech_c}`}
                                    />
                                  </strong>
                                </p>
                              </div>

                              <p className="col-12 mt-3 text-[18px]">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys[13]}:
                                </strong>
                              </p>

                              <p className="col-12 mt-2 text-[18px]">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys[14]} 1:
                                </strong>
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                {data?.payload?.tech_lang_keys[15]}{" "}
                                <b>
                                  <InlineMath
                                    math={`(X \\leq ${formData.tech_c})`}
                                  />
                                </b>{" "}
                                {data?.payload?.tech_lang_keys[16]}.
                              </p>

                              <div>
                                <div className="flex justify-center">
                                  <img
                                    src={`/images/z_score/${result?.tech_z_url}.png`}
                                    alt="Z-Score Graph"
                                    className="img_set"
                                    width="57%"
                                    height="100%"
                                  />
                                </div>
                              </div>

                              <p className="col-12 mt-2 text-[18px]">
                                <b>{data?.payload?.tech_lang_keys[14]} 2:</b>
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                {data?.payload?.tech_lang_keys[17]}{" "}
                                <b>
                                  <InlineMath
                                    math={`\\mu = ${formData.tech_mean}`}
                                  />
                                </b>{" "}
                                {data?.payload?.tech_lang_keys[18]}{" "}
                                <b>
                                  <InlineMath
                                    math={`\\sigma = ${formData.tech_deviation}`}
                                  />
                                </b>{" "}
                                {data?.payload?.tech_lang_keys[19]}:
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                <BlockMath
                                  math={`P(X \\leq ? ) = P(X - \\mu \\leq ? - ${formData.tech_mean}) = P\\left(\\frac{X - \\mu}{\\sigma} \\leq \\frac{? - ${formData.tech_mean}}{${formData.tech_deviation}}\\right)`}
                                />
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                {data?.payload?.tech_lang_keys[17]}{" "}
                                <b>
                                  <InlineMath
                                    math={`\\frac{x - \\mu}{\\sigma} = Z${data?.payload?.tech_lang_keys[18]}`}
                                  />{" "}
                                  = {final.toFixed(4)}
                                </b>{" "}
                                {data?.payload?.tech_lang_keys[19]}:
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                <BlockMath
                                  math={`P(X \\leq ? ) = P(Z \\leq ${final.toFixed(
                                    4
                                  )})`}
                                />
                              </p>

                              <p className="col-12 mt-2 text-[18px]">
                                <b>{data?.payload?.tech_lang_keys[14]} 3:</b>
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                {data?.payload?.tech_lang_keys[20]}{" "}
                                <b>{data?.payload?.tech_lang_keys[21]}</b>{" "}
                                {data?.payload?.tech_lang_keys[22]}:
                              </p>

                              <p className="col-12 mt-2 overflow-auto">
                                <BlockMath
                                  math={`P(Z \\leq ${final.toFixed(4)}) = ${
                                    formData.tech_c
                                  }`}
                                />
                              </p>
                            </div>
                          </>
                        )}
                        {result?.tech_d && (
                          <>
                            <div className="text-[18px] overflow-auto">
                              <p>
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["12"]}
                                </strong>
                              </p>

                              <div className="lg:text-[20px] md:text-[20px] text-[16px] bg-[#2845F5] text-white px-3 py-2 rounded-lg d-inline-block my-3 overflow-auto">
                                <BlockMath
                                  math={`P(X \\ge ${result.tech_above2}) = ${formData.tech_d}`}
                                />
                              </div>

                              <p>
                                <b>{data?.payload?.tech_lang_keys[13]}:</b>
                              </p>

                              <p className="mt-2">
                                <b>{data?.payload?.tech_lang_keys[14]} 1:</b>
                              </p>

                              <p className="mt-2 ">
                                {data?.payload?.tech_lang_keys[15]}
                                <BlockMath
                                  math={`(X \\ge ${formData.tech_d})`}
                                />
                                {data?.payload?.tech_lang_keys[16]}
                              </p>

                              <div>
                                <div className="flex justify-center">
                                  <img
                                    src={`/images/z_score/${result?.tech_z_url}.png`}
                                    alt="Z-Score Graph"
                                    className="img_set"
                                    width="57%"
                                    height="100%"
                                  />
                                </div>
                              </div>

                              <p className="mt-2">
                                <b>{data?.payload?.tech_lang_keys[14]} 2:</b>
                              </p>

                              <p>
                                {data?.payload?.tech_lang_keys[17]}
                                <BlockMath
                                  math={`\\mu = ${formData.tech_mean}`}
                                />
                                {data?.payload?.tech_lang_keys[18]}
                                <BlockMath
                                  math={`\\sigma = ${formData.tech_deviation}`}
                                />
                                {data?.payload?.tech_lang_keys[19]}:
                              </p>

                              <BlockMath
                                math={`P(X \\ge ? ) = P\\left(\\frac{X - \\mu}{\\sigma} \\ge \\frac{? - ${formData.tech_mean}}{${formData.tech_deviation}}\\right)`}
                              />

                              <p>
                                {data?.payload?.tech_lang_keys[17]}
                                <BlockMath
                                  math={`\\frac{x - \\mu}{\\sigma} = Z = \\frac{${result.tech_above2} - ${formData.tech_mean}}{${formData.tech_deviation}} = ${final11}`}
                                />
                                {data?.payload?.tech_lang_keys[19]}:
                              </p>

                              <BlockMath
                                math={`P(X \\ge ?) = P(Z \\ge ${result.tech_above2})`}
                              />

                              <p className="mt-2">
                                <b>{data?.payload?.tech_lang_keys[14]} 3:</b>
                              </p>

                              <p>
                                {data?.payload?.tech_lang_keys[20]}
                                <b>{data?.payload?.tech_lang_keys[21]}</b>
                                {data?.payload?.tech_lang_keys[22]}:
                              </p>

                              <BlockMath
                                math={`P(Z \\ge ${result.tech_above2}) = ${formData.tech_d}`}
                              />
                            </div>
                          </>
                        )}

                        {result?.tech_e1 && result?.tech_e2 && (
                          <div>
                            <p className="text-[18px]">
                              <strong className="text-blue">
                                {data?.payload?.tech_lang_keys["12"]}
                              </strong>
                            </p>

                            <p className="lg:text-[20px] md:text-[20px] text-[16px] bg-[#2845F5] text-white px-3 overflow-auto py-2 rounded-lg d-inline-block my-3">
                              <strong>
                                P({e1} ≤ X ≥ {e2}) = {mainAns}
                              </strong>
                            </p>

                            <p className="col-12 mt-3 text-[18px]">
                              <b>{data?.payload?.tech_lang_keys[13]}:</b>
                            </p>

                            {/* Explanation 1 */}
                            <p className="col-12 mt-2 text-[18px]">
                              <b>{data?.payload?.tech_lang_keys[14]} 1:</b>
                            </p>
                            <p className="col-12 mt-2 overflow-auto">
                              {data?.payload?.tech_lang_keys[15]}{" "}
                              <b>
                                P({e1} ≤ X ≥ {e2})
                              </b>{" "}
                              {data?.payload?.tech_lang_keys[16]}.
                            </p>

                            {/* Image */}
                            <div>
                              <div className="flex justify-center">
                                <img
                                  src={`/images/z_score/${result?.tech_z_url}.png`}
                                  alt="Z-Score Graph"
                                  className="img_set"
                                  width="57%"
                                  height="100%"
                                />
                              </div>
                            </div>

                            {/* Explanation 2 */}
                            <p className="col-12 mt-2 text-[18px]">
                              <b>{data?.payload?.tech_lang_keys[14]} 2:</b>
                            </p>
                            <p className="col-12 mt-2 overflow-auto">
                              {data?.payload?.tech_lang_keys[17]}
                              <b>μ = {mean}</b>
                              {data?.payload?.tech_lang_keys[18]}
                              <b>σ = {deviation}</b>
                              {data?.payload?.tech_lang_keys[19]}:
                            </p>

                            <p className="col-12 mt-2 overflow-auto">
                              P({e1} ≤ X ≥ {e2}) = P({e1} - {mean} ≤ X - μ ≥{" "}
                              {e2} - {mean}) = P({finalE1} ≤ Z ≥ {finalE2})
                            </p>

                            <p className="col-12 mt-2 overflow-auto">
                              {data?.payload?.tech_lang_keys[17]}
                              <b>Z = (x - μ) / σ</b> → {e1} - {mean} /{" "}
                              {deviation} = {finalE1} and {e2} - {mean} /{" "}
                              {deviation} = {finalE2}
                            </p>

                            <p className="col-12 mt-2 overflow-auto">
                              P({e1} ≤ X ≥ {e2}) = P({finalE1} ≤ Z ≥ {finalE2})
                            </p>

                            {/* Explanation 3 */}
                            <p className="col-12 mt-2 text-[18px]">
                              <b>{data?.payload?.tech_lang_keys[14]} 3:</b>
                            </p>
                            <p className="col-12 mt-2 overflow-auto">
                              {data?.payload?.tech_lang_keys[20]}
                              <b>{data?.payload?.tech_lang_keys[21]}</b>
                              {data?.payload?.tech_lang_keys[22]}:
                            </p>
                          </div>
                        )}

                        {result?.tech_f &&
                          (() => {
                            const ansF1 = result.tech_llf - formData.tech_mean;
                            const finalF1 = ansF1 / formData.tech_deviation;

                            const ansF2 = result.tech_ulf - formData.tech_mean;
                            const finalF2 = ansF2 / formData.tech_deviation;

                            const mainAnsF = result.tech_ulf - result.tech_llf;

                            return (
                              <div>
                                <p className="text-[18px] font-bold text-blue-600">
                                  {data?.payload?.tech_lang_keys["12"]}
                                </p>

                                <p className="lg:text-[20px] md:text-[20px] text-[16px] bg-[#2845F5] text-white px-3 overflow-auto py-2 rounded-lg d-inline-block my-3">
                                  <strong>
                                    P({result.tech_llf} ≤ X ≥ {result.tech_ulf})
                                    = {formData.tech_f}
                                  </strong>
                                </p>

                                <p className="col-12 mt-3 text-[18px] font-bold">
                                  {data?.payload?.tech_lang_keys[13]}:
                                </p>

                                <p className="col-12 mt-2 text-[18px] font-bold">
                                  {data?.payload?.tech_lang_keys[14]} 1:
                                </p>

                                <p className="col-12 mt-2 overflow-auto">
                                  {data?.payload?.tech_lang_keys[15]}{" "}
                                  <b>
                                    P({result.tech_llf} ≤ X ≥ {result.tech_ulf})
                                  </b>{" "}
                                  {data?.payload?.tech_lang_keys[16]}.
                                </p>

                                <div className="text-center">
                                  <div className="flex justify-center">
                                    <img
                                      src={`/images/z_score/${result?.tech_z_url}.png`}
                                      alt="Z-Score Graph"
                                      className="img_set"
                                      width="57%"
                                      height="100%"
                                    />
                                  </div>
                                </div>

                                <p className="col-12 mt-2 text-[18px] font-bold">
                                  {data?.payload?.tech_lang_keys[14]} 2:
                                </p>

                                <p className="col-12 mt-2 overflow-auto text-[18px]">
                                  {data?.payload?.tech_lang_keys[17]}{" "}
                                  <b>μ = {formData.tech_mean}</b>{" "}
                                  {data?.payload?.tech_lang_keys[18]}{" "}
                                  <b>σ = {formData.tech_deviation}</b>{" "}
                                  {data?.payload?.tech_lang_keys[19]}:
                                </p>

                                <p className="col-12 mt-2 overflow-auto">
                                  P({result.tech_llf} ≤ X ≥ {result.tech_ulf}) =
                                  P({result.tech_llf} - {formData.tech_mean} ≤ X
                                  - μ ≥ {result.tech_ulf} - {formData.tech_mean}
                                  ) = P({ansF1} / {formData.tech_deviation} ≤ Z
                                  ≥ {ansF2} / {formData.tech_deviation})
                                </p>

                                <p className="col-12 mt-2 overflow-auto text-[18px]">
                                  {data?.payload?.tech_lang_keys[17]}{" "}
                                  <b>Z = x - μ / σ</b>,
                                  {`${result.tech_llf} - ${formData.tech_mean} / ${formData.tech_deviation} = ${finalF1}`}{" "}
                                  and
                                  {`${result.tech_ulf} - ${formData.tech_mean} / ${formData.tech_deviation} = ${finalF2}`}
                                  {data?.payload?.tech_lang_keys[19]}:
                                </p>

                                <p className="col-12 mt-2 overflow-auto">
                                  P({result.tech_llf} ≤ X ≥ {result.tech_ulf}) =
                                  P({finalF1} ≤ Z ≥ {finalF2})
                                </p>

                                <p className="col-12 mt-2 text-[18px] font-bold">
                                  {data?.payload?.tech_lang_keys[14]} 3:
                                </p>

                                <p className="col-12 mt-2 overflow-auto text-[18px]">
                                  {data?.payload?.tech_lang_keys[20]}{" "}
                                  <b>{data?.payload?.tech_lang_keys[21]}</b>{" "}
                                  {data?.payload?.tech_lang_keys[22]}:
                                </p>

                                <div
                                  style={{
                                    overflowX: "auto",
                                    textAlign: "center",
                                    marginTop: "10px",
                                  }}
                                >
                                  <BlockMath math={math} />
                                </div>
                              </div>
                            );
                          })()}
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

export default NormalDistributionCalculator;

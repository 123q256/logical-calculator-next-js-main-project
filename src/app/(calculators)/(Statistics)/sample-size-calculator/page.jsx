"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useSampleSizeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SampleSizeCalculator = () => {
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
    tech_population: "sample", // sample  margin
    tech_given_unit: "standard", //  population  standard
    tech_confidence_unit: "98%",
    tech_margin: "5",
    tech_standard: "2",
    tech_proportion: "50",
    tech_n_finite: "10",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSampleSizeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_population) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_population: formData.tech_population,
        tech_given_unit: formData.tech_given_unit,
        tech_confidence_unit: formData.tech_confidence_unit,
        tech_margin: formData.tech_margin,
        tech_standard: formData.tech_standard,
        tech_proportion: formData.tech_proportion,
        tech_n_finite: formData.tech_n_finite,
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
      tech_population: "sample", // sample  margin
      tech_given_unit: "standard", //  population  standard
      tech_confidence_unit: "98%",
      tech_margin: "5",
      tech_standard: "2",
      tech_proportion: "50",
      tech_n_finite: "10",
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className=" mx-auto mt-2 w-full">
              <input
                type="hidden"
                name="tech_population"
                id="calculator_time"
                value={formData.tech_population}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_population === "sample" ? "tagsUnit" : ""
                    }`}
                    id="sample"
                    onClick={() => {
                      setFormData({ ...formData, tech_population: "sample" });
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
                      formData.tech_population === "margin" ? "tagsUnit" : ""
                    }`}
                    id="margin"
                    onClick={() => {
                      setFormData({ ...formData, tech_population: "margin" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-5  gap-2">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_given_unit" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_given_unit"
                    id="tech_given_unit"
                    value={formData.tech_given_unit}
                    onChange={handleChange}
                  >
                    <option value="standard">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="population">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_confidence_unit" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_confidence_unit"
                    id="tech_confidence_unit"
                    value={formData.tech_confidence_unit}
                    onChange={handleChange}
                  >
                    <option value="70%">70%</option>
                    <option value="75%">75%</option>
                    <option value="80%">80%</option>
                    <option value="85%">85%</option>
                    <option value="90%">90%</option>
                    <option value="95%">95%</option>
                    <option value="98%">98%</option>
                    <option value="99%">99%</option>
                    <option value="99.9%">99.9%</option>
                    <option value="99.99%">99.99%</option>
                    <option value="99.999%">99.999%</option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12" id="moe">
                <label htmlFor="tech_margin" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_margin"
                    id="tech_margin"
                    className="input my-2"
                    min="1"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_margin}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_given_unit == "standard" && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="stander"
                  >
                    <label htmlFor="tech_standard" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_standard"
                        id="tech_standard"
                        className="input my-2"
                        min="1"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_standard}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_given_unit == "population" && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="proportion"
                  >
                    <label htmlFor="tech_proportion" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_proportion"
                        id="tech_proportion"
                        className="input my-2"
                        min="1"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_proportion}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_population == "margin" && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="finite"
                  >
                    <label htmlFor="tech_n_finite" className="label">
                      N:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_n_finite"
                        id="tech_n_finite"
                        className="input my-2"
                        min="1"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_n_finite}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3 text-[16px] md:text-[20px]">
                      <div className="w-full">
                        <div className="text-center">
                          <p className="text-[20px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["8"]}
                            </strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong className="text-blue">
                                {result?.tech_answer}
                              </strong>
                            </p>
                          </div>
                        </div>

                        {formData?.tech_population == "sample" ? (
                          <>
                            {formData?.tech_given_unit == "standard" ? (
                              <>
                                <div className="overflow-auto">
                                  <p className="w-full mt-2 text-[18px] text-blue">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </strong>
                                  </p>
                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["10"]}.
                                  </p>
                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`${data?.payload?.tech_lang_keys["8"]} = \\left(\\frac{${data?.payload?.tech_lang_keys["6"]}\\times ${data?.payload?.tech_lang_keys["4"]}}{${data?.payload?.tech_lang_keys["7"]}}\\right)^2`}
                                    />
                                  </p>
                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`${
                                        data?.payload?.tech_lang_keys["8"]
                                      } = \\left(\\frac{${Number(
                                        result?.tech_confidence_unit
                                      ).toFixed(2)}\\times ${Number(
                                        result?.tech_standard
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_margin
                                      ).toFixed(2)}}\\right)^2`}
                                    />
                                  </p>
                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`${
                                        data?.payload?.tech_lang_keys["8"]
                                      } = \\left(\\frac{${Number(
                                        result?.tech_multiply
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_margin
                                      ).toFixed(2)}}\\right)^2`}
                                    />
                                  </p>
                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`${
                                        data?.payload?.tech_lang_keys["8"]
                                      } = (${Number(
                                        result?.tech_divide
                                      ).toFixed(2)})^2`}
                                    />
                                  </p>
                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                                    {Number(result?.tech_sub_answer).toFixed(2)}
                                  </p>
                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                                    {Number(result?.tech_answer).toFixed(2)}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="overflow-auto">
                                  <p className="w-full mt-2 text-[18px] text-blue">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </strong>
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["10"]}.
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`
                                        ${data?.payload?.tech_lang_keys["8"]} = 
                                        \\frac{(${data?.payload?.tech_lang_keys["6"]})^2 \\times ${data?.payload?.tech_lang_keys["5"]}(1 - ${data?.payload?.tech_lang_keys["5"]})}{(${data?.payload?.tech_lang_keys["7"]})^2}
                                      `}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`
                                        ${data?.payload?.tech_lang_keys["8"]} = 
                                        \\frac{(${Number(
                                          result?.tech_confidence_unit
                                        ).toFixed(2)})^2 \\times ${Number(
                                        result?.tech_proportion
                                      ).toFixed(2)}(1 - ${Number(
                                        result?.tech_proportion
                                      ).toFixed(2)})}{(${Number(
                                        result?.tech_margin
                                      ).toFixed(2)})^2}
                                      `}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`
                                        ${data?.payload?.tech_lang_keys["8"]} = 
                                        \\frac{(${Number(
                                          result?.tech_confidence_unit
                                        ).toFixed(2)})^2 \\times ${Number(
                                        result?.tech_proportion
                                      ).toFixed(2)}(${Number(
                                        result?.tech_minus
                                      ).toFixed(2)})}{${Number(
                                        result?.tech_marg
                                      ).toFixed(2)}}
                                      `}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`
                                        ${data?.payload?.tech_lang_keys["8"]} = 
                                        \\frac{${Number(
                                          result?.tech_con_unit
                                        ).toFixed(2)} \\times ${Number(
                                        result?.tech_proportion
                                      ).toFixed(2)} \\times ${Number(
                                        result?.tech_minus
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_marg
                                      ).toFixed(2)}}
                                      `}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`
                                        ${data?.payload?.tech_lang_keys["8"]} = 
                                        \\frac{${Number(
                                          result?.tech_propro
                                        ).toFixed(2)}}{${Number(
                                        result?.tech_marg
                                      ).toFixed(2)}}
                                      `}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                                    {Number(result?.tech_propro_answer).toFixed(
                                      2
                                    )}
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                                    {Number(result?.tech_answer).toFixed(2)}
                                  </p>
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {formData?.tech_given_unit == "standard" ? (
                              <>
                                <div className="overflow-auto">
                                  <p className="w-full mt-2 text-[18px] text-blue">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </strong>
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["11"]}.
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`\\frac{n \\times N}{n + N - 1}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`\\frac{n \\times ${Number(
                                        result?.tech_n_finite
                                      ).toFixed(2)}}{n + ${Number(
                                        result?.tech_n_finite
                                      ).toFixed(2)} - 1}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["13"]} n=?
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    n ={" "}
                                    <InlineMath
                                      math={`\\left( \\frac{${data?.payload?.tech_lang_keys["6"]} \\times ${data?.payload?.tech_lang_keys["4"]} \\text{ Margin of Error} }{} \\right)^2`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    n ={" "}
                                    <InlineMath
                                      math={`\\left( \\frac{${Number(
                                        result?.tech_confidence_unit
                                      ).toFixed(2)} \\times ${Number(
                                        result?.tech_standard
                                      ).toFixed(2)} ${Number(
                                        result?.tech_margin
                                      ).toFixed(2)} }{} \\right)^2`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    n ={" "}
                                    <InlineMath
                                      math={`\\left( \\frac{${Number(
                                        result?.tech_multiply
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_margin
                                      ).toFixed(2)}} \\right)^2`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    n ={" "}
                                    <InlineMath
                                      math={`(${Number(
                                        result?.tech_divide
                                      ).toFixed(2)})^2`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    n ={" "}
                                    {Number(result?.tech_sub_answer).toFixed(2)}
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`\\frac{n \\times N}{n + N - 1}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`\\frac{${Number(
                                        result?.tech_sub_answer
                                      ).toFixed(2)} \\times ${Number(
                                        result?.tech_n_finite
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_sub_answer
                                      ).toFixed(2)} + ${Number(
                                        result?.tech_n_finite
                                      ).toFixed(2)} - 1}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    <InlineMath
                                      math={`\\frac{${Number(
                                        result?.tech_a_answer
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_b_answer
                                      ).toFixed(2)}}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                                    {Number(result?.tech_answer).toFixed(2)}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="overflow-auto">
                                  <p className="w-full mt-2 text-[18px] text-blue">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </strong>
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["11"]}.
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                                    <InlineMath
                                      math={`\\frac{n \\times N}{n + N - 1}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                                    <InlineMath
                                      math={`\\frac{n \\times ${Number(
                                        result?.tech_n_finite
                                      ).toFixed(2)}}{n + ${Number(
                                        result?.tech_n_finite
                                      ).toFixed(2)} - 1}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["13"]} n=?
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    n ={" "}
                                    <InlineMath
                                      math={`\\frac{(\\text{${data?.payload?.tech_lang_keys["6"]}})^2 \\times ${data?.payload?.tech_lang_keys["5"]}(1 - ${data?.payload?.tech_lang_keys["5"]})}{(\\text{${data?.payload?.tech_lang_keys["7"]}})^2}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    n ={" "}
                                    <InlineMath
                                      math={`\\frac{(${Number(
                                        result?.tech_confidence_unit
                                      ).toFixed(2)})^2 \\times ${Number(
                                        result?.tech_proportion
                                      ).toFixed(2)} (1 - ${Number(
                                        result?.tech_proportion
                                      ).toFixed(2)})}{(${Number(
                                        result?.tech_margin
                                      ).toFixed(2)})^2}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    n ={" "}
                                    <InlineMath
                                      math={`\\frac{(${Number(
                                        result?.tech_confidence_unit
                                      ).toFixed(2)})^2 \\times ${Number(
                                        result?.tech_proportion
                                      ).toFixed(2)} (${Number(
                                        result?.tech_minus
                                      ).toFixed(2)})}{${Number(
                                        result?.tech_marg
                                      ).toFixed(2)}}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    n ={" "}
                                    <InlineMath
                                      math={`\\frac{${Number(
                                        result?.tech_con_unit
                                      ).toFixed(2)} \\times ${Number(
                                        result?.tech_proportion
                                      ).toFixed(2)} \\times ${Number(
                                        result?.tech_minus
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_marg
                                      ).toFixed(2)}}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    n ={" "}
                                    <InlineMath
                                      math={`\\frac{${Number(
                                        result?.tech_propro
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_marg
                                      ).toFixed(2)}}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    n={" "}
                                    {Number(result?.tech_sub_answer).toFixed(2)}
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                                    <InlineMath
                                      math={`\\frac{n \\times N}{n + N - 1}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                                    <InlineMath
                                      math={`\\frac{${Number(
                                        result?.tech_sub_answer
                                      ).toFixed(2)} \\times ${Number(
                                        result?.tech_n_finite
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_sub_answer
                                      ).toFixed(2)} + ${Number(
                                        result?.tech_n_finite
                                      ).toFixed(2)} - 1}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                                    <InlineMath
                                      math={`\\frac{${Number(
                                        result?.tech_a_answer
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_b_answer
                                      ).toFixed(2)}}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[16px] md:text-[20px]">
                                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                                    {Number(result?.tech_answer).toFixed(2)}
                                  </p>
                                </div>
                              </>
                            )}
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

export default SampleSizeCalculator;

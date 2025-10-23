"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useHalfLifeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HalfLifeCalculator = () => {
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
    tech_calculator_name: "calculator1", // calculator2  calculator1
    tech_find: "t",
    tech_nt: "10",
    tech_n0: "100",
    tech_t: "50",
    tech_t1_2: "15",
    tech_find_by: "lamda",
    tech_t_1_2: "15",
    tech_T: "50",
    tech_lamda: "10",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHalfLifeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculator_name) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_calculator_name: formData.tech_calculator_name,
        tech_find: formData.tech_find,
        tech_nt: formData.tech_nt,
        tech_n0: formData.tech_n0,
        tech_t: formData.tech_t,
        tech_t1_2: formData.tech_t1_2,
        tech_find_by: formData.tech_find_by,
        tech_t_1_2: formData.tech_t_1_2,
        tech_T: formData.tech_T,
        tech_lamda: formData.tech_lamda,
      }).unwrap();
      setResult(response?.payload); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_calculator_name: "calculator1", // calculator2  calculator1
      tech_find: "t",
      tech_nt: "10",
      tech_n0: "100",
      tech_t: "50",
      tech_t1_2: "15",
      tech_find_by: "lamda",
      tech_t_1_2: "15",
      tech_T: "50",
      tech_lamda: "10",
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
  {
    /* <span className="text-blue input_unit">{currency.symbol}</span> */
  }
  // currency code

  const nt = formData?.tech_nt;
  const n0 = formData?.tech_n0;
  const t = formData?.tech_t;
  const t1_2 = formData?.tech_t1_2;
  const ans = result?.tech_ans;
  const s1 = result?.tech_s1 || "";
  const s2 = result?.tech_s2 || "";
  const s3 = result?.tech_s3 || "";
  const s4 = result?.tech_s4 || "";

  let head = "";
  switch (formData?.tech_find) {
    case "nt":
      head = "Quantity Remains \\( (N_t) \\)";
      break;
    case "n0":
      head = "Initial Quantity \\( (N_0) \\)";
      break;
    case "t":
      head = "Time \\( (t) \\)";
      break;
    case "t1_2":
      head = "Half Life \\( (t_{\\frac{1}{2}}) \\)";
      break;
    default:
      break;
  }

  const log2 = Math.log(2).toFixed(4);

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
            <div className="w-full mx-auto my-2 ">
              <input
                type="hidden"
                name="tech_calculator_name"
                id="calculator_time"
                value={formData.tech_calculator_name}
              />
              <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4 flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1 ">
                {/* Date Cal Tab */}
                <div className="space-y-2  px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_calculator_name === "calculator1"
                        ? "tagsUnit"
                        : ""
                    }`}
                    id="calculator1"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        tech_calculator_name: "calculator1",
                      });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["calculator"] ??
                      "Calculator"}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="space-y-2  px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_calculator_name === "calculator2"
                        ? "tagsUnit"
                        : ""
                    }`}
                    id="calculator2"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        tech_calculator_name: "calculator2",
                      });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["converter"] ?? "Converter"}
                  </div>
                </div>
              </div>
            </div>
            {formData.tech_calculator_name == "calculator1" && (
              <>
                <div className="grid grid-cols-12 gap-1  md:gap-4 mt-5">
                  <div className="col-span-12 md:col-span-6 px-2">
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
                        <option value="nt">
                          {data?.payload?.tech_lang_keys["2"]} (Nₜ)
                        </option>
                        <option value="n0">
                          {data?.payload?.tech_lang_keys["3"]} (N₀)
                        </option>
                        <option value="t">
                          {data?.payload?.tech_lang_keys["4"]} (t)
                        </option>
                        <option value="t1_2">
                          {data?.payload?.tech_lang_keys["5"]} (t₁/₂)
                        </option>
                      </select>
                    </div>
                  </div>

                  {(formData.tech_find == "n0" ||
                    formData.tech_find == "t" ||
                    formData.tech_find == "t1_2") && (
                    <>
                      <div className="col-span-12 md:col-span-6 px-2 nt">
                        <label htmlFor="tech_nt" className="label">
                          {data?.payload?.tech_lang_keys["2"]} (N
                          <sub className="text-blue">t</sub>):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_nt"
                            id="tech_nt"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_nt}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {(formData.tech_find == "nt" ||
                    formData.tech_find == "t" ||
                    formData.tech_find == "t1_2") && (
                    <>
                      <div className="col-span-12 md:col-span-6 px-2 n0">
                        <label htmlFor="tech_n0" className="label">
                          {data?.payload?.tech_lang_keys["3"]} (N
                          <sub className="text-blue">0</sub>):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_n0"
                            id="tech_n0"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_n0}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {(formData.tech_find == "nt" ||
                    formData.tech_find == "n0" ||
                    formData.tech_find == "t1_2") && (
                    <>
                      <div className="col-span-12 md:col-span-6 px-2 t">
                        <label htmlFor="tech_t" className="label">
                          {data?.payload?.tech_lang_keys["4"]} (t):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_t"
                            id="tech_t"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_t}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {(formData.tech_find == "nt" ||
                    formData.tech_find == "n0" ||
                    formData.tech_find == "t") && (
                    <>
                      <div className="col-span-12 md:col-span-6 px-2 t1_2 ">
                        <label htmlFor="tech_t1_2" className="label">
                          {data?.payload?.tech_lang_keys["5"]} (t
                          <sub className="text-blue">1/2</sub>):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_t1_2"
                            id="tech_t1_2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_t1_2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {formData.tech_calculator_name == "calculator2" && (
              <>
                <div className="grid grid-cols-12 gap-1  md:gap-4 mt-4 ">
                  <h2 className="text-blue-800 trxt-[18px] px-2 mb-3 col-span-12">
                    {data?.payload?.tech_lang_keys["6"]}
                  </h2>
                  <div className="col-span-12 md:col-span-6 px-2">
                    <label htmlFor="tech_find_by" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_find_by"
                        id="tech_find_by"
                        value={formData.tech_find_by}
                        onChange={handleChange}
                      >
                        <option value="t_1_2">
                          {data?.payload?.tech_lang_keys["5"]} (t₁/₂)
                        </option>
                        <option value="T">
                          {data?.payload?.tech_lang_keys["8"]} (τ)
                        </option>
                        <option value="lamda">
                          {data?.payload?.tech_lang_keys["9"]} (λ)
                        </option>
                      </select>
                    </div>
                  </div>

                  {formData.tech_find_by == "t_1_2" && (
                    <>
                      <div className="col-span-12 md:col-span-6 px-2">
                        <label htmlFor="tech_t_1_2" className="label">
                          {data?.payload?.tech_lang_keys["5"]} (t
                          <sub className="text-blue">1/2</sub>):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_t_1_2"
                            id="tech_t_1_2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_t_1_2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_find_by == "T" && (
                    <>
                      <div className="col-span-12 md:col-span-6 px-2">
                        <label htmlFor="tech_T" className="label">
                          {data?.payload?.tech_lang_keys["8"]} (τ):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_T"
                            id="tech_T"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_T}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_find_by == "lamda" && (
                    <>
                      <div className="col-span-12 md:col-span-6 px-2 ">
                        <label htmlFor="tech_lamda" className="label">
                          {data?.payload?.tech_lang_keys["9"]} (λ):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_lamda"
                            id="tech_lamda"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_lamda}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full radius-10 p-3 mt-3">
                      <div className="w-full mt-2">
                        {formData.tech_calculator_name == "calculator1" && (
                          <>
                            {formData?.tech_find == "nt" ? (
                              <p>
                                <strong>
                                  Quantity Remains <InlineMath math="N_t" />
                                </strong>
                              </p>
                            ) : formData?.tech_find == "n0" ? (
                              <p>
                                <strong>
                                  Initial Quantity <InlineMath math="N_0" />
                                </strong>
                              </p>
                            ) : formData?.tech_find == "t" ? (
                              <p>
                                <strong>
                                  Time <InlineMath math="t" />
                                </strong>
                              </p>
                            ) : formData?.tech_find == "t1_2" ? (
                              <p>
                                <strong>
                                  Half Life{" "}
                                  <InlineMath math="t_{\frac{1}{2}}" />
                                </strong>
                              </p>
                            ) : null}
                            <p>
                              <strong className="text-[#119154] text-[28px]">
                                {Number(ans).toFixed(2)}
                              </strong>
                            </p>
                            <div className="col-12 mt-2 text-[14px] md:text-[18px]">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys[10]}:
                                </strong>
                              </p>
                              <p className="my-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[11]}:
                                </strong>
                              </p>

                              {formData?.tech_find === "nt" && (
                                <>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`N_t = N_0 \\left(\\frac{1}{2} \\right)^\\frac{t}{t_{\\frac{1}{2}}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[12]}:
                                    </strong>
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`N_0 = ${n0}, t = ${t}, t_{\\frac{1}{2}} = ${t1_2}, N_t = ?`}
                                    />
                                  </p>
                                  <p className="mt-3 mb-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[13]}:
                                    </strong>
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`N_t = ${n0} * \\left(\\frac{1}{2} \\right)^\\frac{${t}}{${t1_2}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`N_t = ${n0} * (0.5)^{${s1}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath math={`N_t = ${n0} * ${s2}`} />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath math={`N_t = ${ans}`} />
                                  </p>
                                </>
                              )}

                              {formData?.tech_find === "n0" && (
                                <>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`N_0 = \\frac{N_t}{\\left(\\frac{1}{2}\\right)^\\frac{t}{t_{\\frac{1}{2}}}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[12]}:
                                    </strong>
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`N_t = ${nt}, t = ${t}, t_{\\frac{1}{2}} = ${t1_2}, N_0 = ?`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`N_0 = \\frac{${nt}}{\\left(\\frac{1}{2}\\right)^\\frac{${t}}{${t1_2}}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`N_0 = \\frac{${nt}}{(0.5)^{${s1}}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`N_0 = \\frac{${nt}}{${s2}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath math={`N_0 = ${ans}`} />
                                  </p>
                                </>
                              )}

                              {formData?.tech_find === "t" && (
                                <>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`t = \\frac{t_{\\frac{1}{2}} \\cdot \\ln\\left(\\frac{N_t}{N_0}\\right)}{-\\ln(2)}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[12]}:
                                    </strong>
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`N_t = ${nt}, N_0 = ${n0}, t_{\\frac{1}{2}} = ${t1_2}, t = ?`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`t = \\frac{${t1_2} * \\ln(${s1})}{-${s4}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`t = \\frac{${t1_2} * (${s2})}{${s4}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`t = \\frac{${s3}}{${s4}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath math={`t = ${ans}`} />
                                  </p>
                                </>
                              )}

                              {formData?.tech_find === "t1_2" && (
                                <>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`t_{\\frac{1}{2}} = \\frac{t * (-\\ln(2))}{\\ln\\left(\\frac{N_t}{N_0}\\right)}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[12]}:
                                    </strong>
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`N_t = ${nt}, N_0 = ${n0}, t = ${t}, t_{\\frac{1}{2}} = ?`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`t_{\\frac{1}{2}} = \\frac{${t} * ${s3}}{${s2}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`t_{\\frac{1}{2}} = \\frac{${s4}}{${s2}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`t_{\\frac{1}{2}} = ${ans}`}
                                    />
                                  </p>
                                </>
                              )}
                            </div>
                          </>
                        )}

                        {formData.tech_calculator_name == "calculator2" && (
                          <>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys[5]}{" "}
                                <InlineMath math="t_{\frac{1}{2}}" />
                              </strong>
                            </p>
                            <p className="text-[28px]">
                              <strong
                                className={
                                  formData?.tech_find_by === "t_1_2"
                                    ? ""
                                    : "text-[#119154]"
                                }
                              >
                                {Number(result?.tech_t_1_2).toFixed(4)}
                              </strong>
                            </p>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys[8]} (τ)
                              </strong>
                            </p>
                            <p className="text-[28px]">
                              <strong
                                className={
                                  formData?.tech_find_by === "T"
                                    ? ""
                                    : "text-[#119154]"
                                }
                              >
                                {Number(result?.tech_T).toFixed(4)}
                              </strong>
                            </p>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys[9]} (λ)
                              </strong>
                            </p>
                            <p className="text-[28px] text-[#119154]">
                              <strong
                                className={
                                  formData?.tech_find_by === "lamda"
                                    ? ""
                                    : "text-[#119154]"
                                }
                              >
                                {Number(result?.tech_lamda).toFixed(4)}
                              </strong>
                            </p>
                            <div className="col-12 mt-3 text-[16px] md:text-[18px]">
                              <p className="font-s-20">
                                <strong>
                                  {data?.payload?.tech_lang_keys[10]}:
                                </strong>
                              </p>

                              {formData?.tech_find_by === "t_1_2" && (
                                <>
                                  <p className="my-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[8]} (τ):
                                    </strong>
                                  </p>
                                  <p className="my-2">
                                    <InlineMath math="τ = \dfrac{t_{\frac{1}{2}}}{\ln(2)}" />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`τ = \\dfrac{${result?.tech_t_1_2}}{${log2}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`τ = ${result?.tech_T}`}
                                    />
                                  </p>

                                  <p className="mt-3 mb-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} (λ):
                                    </strong>
                                  </p>
                                  <p className="my-2">
                                    <InlineMath math="λ = \dfrac{\ln(2)}{t_{\frac{1}{2}}}" />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`λ = \\dfrac{${log2}}{${result?.tech_t_1_2}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`λ = ${result?.tech_lamda}`}
                                    />
                                  </p>
                                </>
                              )}

                              {formData?.tech_find_by === "T" && (
                                <>
                                  <p className="my-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]}{" "}
                                      <InlineMath math="t_{\frac{1}{2}}" />:
                                    </strong>
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`t_{\\frac{1}{2}} = ${result?.tech_T} * ${log2}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`t_{\\frac{1}{2}} = ${result?.tech_t_1_2}`}
                                    />
                                  </p>

                                  <p className="mt-3 mb-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} (λ):
                                    </strong>
                                  </p>
                                  <p className="my-2">
                                    <InlineMath math="λ = \dfrac{\ln(2)}{t_{\frac{1}{2}}}" />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`λ = \\dfrac{${log2}}{${result?.tech_t_1_2}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`λ = ${result?.tech_lamda}`}
                                    />
                                  </p>
                                </>
                              )}

                              {formData?.tech_find_by === "lamda" && (
                                <>
                                  <p className="my-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]}{" "}
                                      <InlineMath math="t_{\frac{1}{2}}" />:
                                    </strong>
                                  </p>
                                  <p className="my-2">
                                    <InlineMath math="t_{\frac{1}{2}} = \dfrac{\ln(2)}{λ}" />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`t_{\\frac{1}{2}} = \\dfrac{${log2}}{${result?.tech_lamda}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`t_{\\frac{1}{2}} = ${result?.tech_t_1_2}`}
                                    />
                                  </p>

                                  <p className="mt-3 mb-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[8]} (τ):
                                    </strong>
                                  </p>
                                  <p className="my-2">
                                    <InlineMath math="τ = \dfrac{t_{\frac{1}{2}}}{\ln(2)}" />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`τ = \\dfrac{${result?.tech_t_1_2}}{${log2}}`}
                                    />
                                  </p>
                                  <p className="my-2">
                                    <InlineMath
                                      math={`τ = ${result?.tech_T}`}
                                    />
                                  </p>
                                </>
                              )}
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

export default HalfLifeCalculator;

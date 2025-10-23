"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useEffectSizeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EffectSizeCalculator = () => {
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
    tech_effect_type: "cohen2e", //dr   cohen2e
    tech_ronding: "4",
    tech_c_x1: "3",
    tech_c_s: "5",
    tech_c_pm: "10",
    tech_x1: "2",
    tech_x2: "8",
    tech_n1: "10",
    tech_n2: "20",
    tech_s1: "5",
    tech_s2: "3",
    tech_p1: "0.5",
    tech_p2: "0.6",
    tech_ph_x2: "2",
    tech_ph_n1: "10",
    tech_cr_x2: "2",
    tech_cr_n1: "10",
    tech_row: "3",
    tech_col: "4",
    tech_ssr: "5",
    tech_sst: "10",
    tech_ssg: "5",
    tech_et_sst: "8",
    tech_f2r: "5",
    tech_r2f: "5",
    tech_t_value: "5",
    tech_df: "8",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEffectSizeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_effect_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_effect_type: formData.tech_effect_type,
        tech_ronding: formData.tech_ronding,
        tech_c_x1: formData.tech_c_x1,
        tech_c_s: formData.tech_c_s,
        tech_c_pm: formData.tech_c_pm,
        tech_x1: formData.tech_x1,
        tech_x2: formData.tech_x2,
        tech_n1: formData.tech_n1,
        tech_n2: formData.tech_n2,
        tech_s1: formData.tech_s1,
        tech_s2: formData.tech_s2,
        tech_p1: formData.tech_p1,
        tech_p2: formData.tech_p2,
        tech_ph_x2: formData.tech_ph_x2,
        tech_ph_n1: formData.tech_ph_n1,
        tech_cr_x2: formData.tech_cr_x2,
        tech_cr_n1: formData.tech_cr_n1,
        tech_row: formData.tech_row,
        tech_col: formData.tech_col,
        tech_ssr: formData.tech_ssr,
        tech_sst: formData.tech_sst,
        tech_ssg: formData.tech_ssg,
        tech_et_sst: formData.tech_et_sst,
        tech_f2r: formData.tech_f2r,
        tech_t_value: formData.tech_t_value,
        tech_df: formData.tech_df,
        tech_r2f: formData.tech_r2f,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_effect_type: "cohen2e", //dr   cohen2e
      tech_ronding: "4",
      tech_c_x1: "3",
      tech_c_s: "5",
      tech_c_pm: "10",
      tech_x1: "2",
      tech_x2: "8",
      tech_n1: "10",
      tech_n2: "20",
      tech_s1: "5",
      tech_s2: "3",
      tech_p1: "0.5",
      tech_p2: "0.6",
      tech_ph_x2: "2",
      tech_ph_n1: "10",
      tech_cr_x2: "2",
      tech_cr_n1: "10",
      tech_row: "3",
      tech_col: "4",
      tech_ssr: "5",
      tech_sst: "10",
      tech_ssg: "5",
      tech_et_sst: "8",
      tech_r2f: "5",
      tech_f2r: "5",
      tech_t_value: "5",
      tech_df: "8",
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
  // const showNote = result.tech_p1 < 0 || result.tech_p2 < 0;
  const isPhi = result?.tech_effect_type === "phi";
  const isCramer = result?.tech_effect_type === "cramer";

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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12 ">
                <label htmlFor="tech_effect_type" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_effect_type"
                    id="tech_effect_type"
                    value={formData.tech_effect_type}
                    onChange={handleChange}
                  >
                    <option value="cohen2e">
                      Cohen's d - two-sample equal sd
                    </option>
                    <option value="cohen2u">
                      Cohen's d - two-sample unequal sd{" "}
                    </option>
                    <option value="cohen"> Cohen's d - one-sample</option>
                    <option value="h"> Cohen's h</option>
                    <option value="phi"> Phi (φ)</option>
                    <option value="cramer"> Cramér's V (φ꜀)</option>
                    <option value="r2"> R², and f²</option>
                    <option value="eta2"> η², and f²</option>
                    <option value="r2f"> R² to f²</option>
                    <option value="f2r"> f² to R²</option>
                    <option value="dr">d & r</option>
                  </select>
                </div>
              </div>

              <div className="lg:col-span-6 md:col-span-6 col-span-12 ">
                <label htmlFor="tech_ronding" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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

              {(formData.tech_effect_type == "cohen" ||
                formData.tech_effect_type == "cohen") && (
                <>
                  <div className="col-span-12 cohen">
                    <div className="grid grid-cols-12 mt-3 gap-4">
                      <div className="lg:col-span-6 md:col-span-6 col-span-12  wh">
                        <label htmlFor="tech_c_x1" className="label">
                          {data?.payload?.tech_lang_keys["3"]}{" "}
                          <InlineMath math="(\bar{x}):" />
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_c_x1"
                            id="tech_c_x1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_c_x1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-6 md:col-span-6 col-span-12  ww">
                        <label htmlFor="tech_c_s" className="label">
                          {data?.payload?.tech_lang_keys["4"]} σ{" "}
                          <InlineMath math="(S):" />
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_c_s"
                            id="tech_c_s"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_c_s}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-6 md:col-span-6 col-span-12  wh">
                        <label htmlFor="tech_c_pm" className="label">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                          <InlineMath math="(\mu_0):" />
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_c_pm"
                            id="tech_c_pm"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_c_pm}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_effect_type == "cohen2u" ||
                formData.tech_effect_type == "cohen2e") && (
                <>
                  <div className="cohen2e col-span-12 ">
                    <div className="grid grid-cols-12 mt-3 gap-4">
                      <div className="col-span-6 wh">
                        <label htmlFor="tech_x1" className="label">
                          {data?.payload?.tech_lang_keys["3"]}{" "}
                          <InlineMath math="(\bar{x}_1):" />
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_x1"
                            id="tech_x1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_x1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-span-6 ww">
                        <label htmlFor="tech_x2" className="label">
                          {data?.payload?.tech_lang_keys["3"]}{" "}
                          <InlineMath math="(\bar{x}_2):" />
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_x2"
                            id="tech_x2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_x2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-span-6 wh">
                        <label htmlFor="tech_n1" className="label">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                          <InlineMath math="(n_1):" />
                        </label>
                        <div className="relative">
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

                      <div className="col-span-6 ww">
                        <label htmlFor="tech_n2" className="label">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                          <InlineMath math="(n_2):" />
                        </label>
                        <div className="relative">
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

                      {/* For S1 and S2 */}
                      <div className="col-span-6 wh">
                        <label htmlFor="tech_s1" className="label">
                          {data?.payload?.tech_lang_keys["4"]} σ{" "}
                          <InlineMath math="(S_1):" />
                        </label>
                        <div className="relative">
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

                      <div className="col-span-6 ww">
                        <label htmlFor="tech_s2" className="label">
                          {data?.payload?.tech_lang_keys["4"]} σ{" "}
                          <InlineMath math="(S_2):" />
                        </label>
                        <div className="relative">
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
                    </div>
                  </div>
                </>
              )}
              {formData.tech_effect_type == "h" && (
                <>
                  <div className="h col-span-12 ">
                    <div className="grid grid-cols-12 mt-3 gap-4">
                      <div className="lg:col-span-6 md:col-span-6 col-span-12  wh">
                        <label htmlFor="tech_p1" className="label">
                          {/* Use InlineMath component for math rendering */}
                          <InlineMath math={"P_1 (Proportion_1):"} />
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_p1"
                            id="tech_p1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_p1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-6 md:col-span-6 col-span-12  ww">
                        <label htmlFor="tech_p2" className="label">
                          <InlineMath math={"P_2 (Proportion_2):"} />
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_p2"
                            id="tech_p2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_p2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_effect_type == "phi" && (
                <>
                  <div className="phi col-span-12 ">
                    <div className="grid grid-cols-12 mt-3 gap-4">
                      <div className="col-span-6 wh">
                        <label htmlFor="tech_ph_x2" className="label">
                          <InlineMath math={"\\chi^2"} />
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_ph_x2"
                            id="tech_ph_x2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ph_x2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6 ww">
                        <label htmlFor="tech_ph_n1" className="label">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                          <InlineMath math={"n_1"} />
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_ph_n1"
                            id="tech_ph_n1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ph_n1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_effect_type == "cramer" && (
                <>
                  <div className="cramer col-span-12 ">
                    <div className="grid grid-cols-12 mt-3 gap-4">
                      <div className="col-span-6 wh">
                        <label htmlFor="tech_cr_x2" className="label">
                          <InlineMath math={"\\chi^2"} />:
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_cr_x2"
                            id="tech_cr_x2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_cr_x2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-span-6 ww">
                        <label htmlFor="tech_cr_n1" className="label">
                          {data?.payload?.tech_lang_keys["6"]} (
                          <InlineMath math={"n_1"} />
                          ):
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_cr_n1"
                            id="tech_cr_n1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_cr_n1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-span-6 wh">
                        <label htmlFor="tech_row" className="label">
                          {data?.payload?.tech_lang_keys["7"]}:
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_row"
                            id="tech_row"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_row}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-span-6 ww">
                        <label htmlFor="tech_col" className="label">
                          {data?.payload?.tech_lang_keys["8"]}:
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_col"
                            id="tech_col"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_col}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_effect_type == "r2" && (
                <>
                  <div className="r2 col-span-12  ">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-6 wh">
                        <label htmlFor="tech_ssr" className="label">
                          {data?.payload?.tech_lang_keys["9"]} :
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_ssr"
                            id="tech_ssr"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ssr}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6 wh">
                        <label htmlFor="tech_sst" className="label">
                          {data?.payload?.tech_lang_keys["10"]} :
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_sst"
                            id="tech_sst"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_sst}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_effect_type == "eta2" && (
                <>
                  <div className="eta2 col-span-12  ">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-6 wh">
                        <label htmlFor="tech_ssg" className="label">
                          {data?.payload?.tech_lang_keys["11"]} :
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_ssg"
                            id="tech_ssg"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ssg}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6 ww">
                        <label htmlFor="tech_et_sst" className="label">
                          {data?.payload?.tech_lang_keys["10"]} :
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_et_sst"
                            id="tech_et_sst"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_et_sst}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_effect_type == "f2r" && (
                <>
                  <div className="f2r col-span-12  ">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-6 ww">
                        <label htmlFor="tech_f2r" className="label">
                          <InlineMath math="f^2:" />
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_f2r"
                            id="tech_f2r"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_f2r}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_effect_type == "dr" && (
                <>
                  <div className="dr col-span-12  ">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-6 wh">
                        <label htmlFor="tech_t_value" className="label">
                          {data?.payload?.tech_lang_keys["12"]} :
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_t_value"
                            id="tech_t_value"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_t_value}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6 ww">
                        <label htmlFor="tech_df" className="label">
                          {data?.payload?.tech_lang_keys["13"]} :
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_df"
                            id="tech_df"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_df}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_effect_type == "r2f" && (
                <>
                  <div className="dr col-span-12  ">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-6 wh">
                        <label htmlFor="tech_r2f" className="label">
                          <InlineMath math="R^2:" />
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_r2f"
                            id="tech_r2f"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_r2f}
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
                        {result?.tech_effect_type && (
                          <>
                            <div className="text-center">
                              <p className="text-[18px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys[14]}
                                </strong>
                              </p>
                            </div>
                            {result?.tech_effect_type == "cohen2e" ? (
                              <>
                                <div className="text-center ">
                                  <p className="text-[25px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-3">
                                    <strong className="text-blue">
                                      {result?.tech_cohen2e}
                                    </strong>
                                  </p>
                                </div>
                                <div className="w-full p-3 md:p-9">
                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[15]}
                                    </strong>
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`\\bar{x}_1 = ${result?.tech_x1} \\; ; \\; \\bar{x}_2 = ${result?.tech_x2}`}
                                    />
                                  </p>
                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`n_1 = ${result?.tech_n1} \\; ; \\; n_2 = ${result?.tech_n2}`}
                                    />
                                  </p>
                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`S_1 = ${result?.tech_s1} \\; ; \\; S_2 = ${result?.tech_s2}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[16]}
                                    </strong>
                                  </p>

                                  <BlockMath
                                    math={`S^2 = \\dfrac{(n_1 - 1)S_1^2 +  (n_2 - 1)S_2^2}{n_1 + n_2 - 2}`}
                                  />
                                  <BlockMath
                                    math={`S^2 = \\dfrac{(${result?.tech_n1} - 1)(${result?.tech_s1})^2 + (${result?.tech_n2} - 1)(${result?.tech_s2})^2}{${result?.tech_n1} + ${result?.tech_n2} - 2}`}
                                  />
                                  <BlockMath
                                    math={`S^2 = \\dfrac{(${
                                      result?.tech_n1 - 1
                                    })(${result?.tech_s1pow}) + (${
                                      result?.tech_n2 - 1
                                    })(${result?.tech_s2pow})}{${
                                      result?.tech_n1 + result?.tech_n2
                                    } - 2}`}
                                  />
                                  <BlockMath
                                    math={`S^2 = \\dfrac{${result?.tech_res}}{${
                                      result?.tech_n1 + result?.tech_n2 - 2
                                    }}`}
                                  />
                                  <BlockMath
                                    math={`S^2 = ${result?.tech_sqr}`}
                                  />
                                  <BlockMath
                                    math={`S = \\sqrt{${result?.tech_sqr}}`}
                                  />
                                  <BlockMath
                                    math={`S = ${result?.tech_sqrt}`}
                                  />

                                  {result?.tech_sqr < 0 && (
                                    <p className="w-full mt-3">
                                      <InlineMath
                                        math={`\\therefore ${data?.payload?.tech_lang_keys[19]}`}
                                      />
                                    </p>
                                  )}

                                  <p className="w-full mt-3">
                                    {data?.payload?.tech_lang_keys[17]}:-
                                  </p>
                                  <BlockMath
                                    math={`d = \\dfrac{|\\bar{x}_1 - \\bar{x}_2|}{S}`}
                                  />
                                  <BlockMath
                                    math={`d = \\dfrac{|${result?.tech_x1} - ${result?.tech_x2}|}{${result?.tech_sqrt}}`}
                                  />
                                  <p className="w-full mt-3">
                                    {data?.payload?.tech_lang_keys[18]} +{" "}
                                    {result?.tech_x1x2}.
                                  </p>
                                  <BlockMath
                                    math={`d = \\dfrac{${result?.tech_x1x2}}{${result?.tech_sqrt}}`}
                                  />
                                  <BlockMath
                                    math={`d = ${result?.tech_cohen2e}`}
                                  />
                                </div>
                              </>
                            ) : result?.tech_effect_type == "cohen2u" ? (
                              <>
                                <div className="text-center">
                                  <p className="text-[25px] bg-[#2845F5] text-white px-3 py-2 rounded-[10px] inline-block my-3">
                                    <strong className="text-white">
                                      {result?.tech_cohen2u}
                                    </strong>
                                  </p>
                                </div>
                                <div className="w-full p-3 md:p-9">
                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-[#2845F5]">
                                      {data?.payload?.tech_lang_keys[15]}
                                    </strong>
                                  </p>

                                  <BlockMath
                                    math={`\\bar{x}_1 = ${result?.tech_x1} \\; ; \\; \\bar{x}_2 = ${result?.tech_x2}`}
                                  />
                                  <BlockMath
                                    math={`n_1 = ${result?.tech_n1} \\; ; \\; n_2 = ${result?.tech_n2}`}
                                  />
                                  <BlockMath
                                    math={`S_1 = ${result?.tech_s1} \\; ; \\; S_2 = ${result?.tech_s2}`}
                                  />

                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-[#2845F5]">
                                      {data?.payload?.tech_lang_keys[16]}
                                    </strong>
                                  </p>

                                  <BlockMath
                                    math={`S^2 = \\dfrac{S_1^2 + S_2^2}{2}`}
                                  />
                                  <BlockMath
                                    math={`S^2 = \\dfrac{(${result?.tech_s1})^2 + (${result?.tech_s2})^2}{2}`}
                                  />
                                  <BlockMath
                                    math={`S^2 = \\dfrac{${result?.tech_s1pow} + ${result?.tech_s2pow}}{2}`}
                                  />
                                  <BlockMath
                                    math={`S^2 = \\dfrac{${result?.tech_res}}{2}`}
                                  />
                                  <BlockMath
                                    math={`S^2 = ${result?.tech_sqr}`}
                                  />
                                  <BlockMath
                                    math={`S^2 = \\sqrt{${result?.tech_sqr}}`}
                                  />
                                  <BlockMath
                                    math={`S = ${result?.tech_sqrt}`}
                                  />
                                  {result?.tech_sqr < 0 && (
                                    <p className="mt-3 text-red-600">
                                      ∴ {data?.payload?.tech_lang_keys[19]}
                                    </p>
                                  )}

                                  <p className="w-full mt-3">
                                    {data?.payload?.tech_lang_keys[17]}:
                                  </p>

                                  <BlockMath
                                    math={`d = \\dfrac{|\\bar{x}_1 - \\bar{x}_2|}{S}`}
                                  />
                                  <BlockMath
                                    math={`d = \\dfrac{|${result?.tech_x1} - ${result?.tech_x2}|}{${result?.tech_sqrt}}`}
                                  />
                                  <p className="w-full mt-3">
                                    {data?.payload?.tech_lang_keys[18]} +{" "}
                                    {result?.tech_x1x2}.
                                  </p>
                                  <BlockMath
                                    math={`d = \\dfrac{${result?.tech_x1x2}}{${result?.tech_sqrt}}`}
                                  />
                                  <BlockMath
                                    math={`d = ${result?.tech_cohen2u}`}
                                  />
                                </div>
                              </>
                            ) : result?.tech_effect_type == "cohen" ? (
                              <>
                                <div className="text-center">
                                  <p className="text-[25px] bg-[#2845F5] px-3 py-2 rounded-[10px] inline-block my-3">
                                    <strong className="text-white">
                                      {result.tech_cohen}
                                    </strong>
                                  </p>
                                </div>

                                <div className="w-full p-3 md:p-9">
                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[15]}
                                    </strong>
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`\\text{${data?.payload?.tech_lang_keys[3]}} \\enspace \\bar{x} = ${result.tech_c_x1}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`\\text{${data?.payload?.tech_lang_keys[4]}} \\enspace \\sigma = ${result.tech_c_s}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`\\text{${data?.payload?.tech_lang_keys[5]}} \\enspace \\mu_0 = ${result.tech_c_pm}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[16]}
                                    </strong>
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`d = \\dfrac{|\\bar{x} - \\mu_0|}{S}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`d = \\dfrac{|${result.tech_c_x1} - ${result.tech_c_pm}|}{${result.tech_c_s}}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3">
                                    {data?.payload?.tech_lang_keys[18]} +{" "}
                                    {result.tech_c}.
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`d = \\dfrac{${result.tech_c}}{${result.tech_c_s}}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`d = ${result.tech_cohen}`}
                                    />
                                  </p>
                                </div>
                              </>
                            ) : result?.tech_effect_type == "h" ? (
                              <>
                                <div className="text-center">
                                  <p className="text-[25px] bg-[#2845F5] px-3 py-2 rounded-[10px] inline-block my-3">
                                    <strong className="text-white">
                                      {result.tech_h}
                                    </strong>
                                  </p>
                                </div>
                                <div className="w-full p-3 md:p-9">
                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[15]}
                                    </strong>
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`P_1\\ (Proportion_1) = ${result.tech_p1}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`P_2\\ (Proportion_2) = ${result.tech_p2}`}
                                    />
                                  </p>

                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[16]}
                                    </strong>
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`h = 2(\\arcsin(\\sqrt{p_1}) - \\arcsin(\\sqrt{p_2}))`}
                                    />
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`h = 2(\\arcsin(\\sqrt{${result.tech_p1}}) - \\arcsin(\\sqrt{${result.tech_p2}}))`}
                                    />
                                  </p>

                                  {result.tech_p1 < 0 ||
                                    (result.tech_p2 < 0 && (
                                      <p className="w-full mt-3">
                                        (∴ {data?.payload?.tech_lang_keys[19]})
                                      </p>
                                    ))}

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`h = 2(\\arcsin(${result.tech_p1sqr}) - \\arcsin(${result.tech_p2sqr}))`}
                                    />
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`h = 2(${result.tech_arcp1} - ${result.tech_arcp2})`}
                                    />
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath
                                      math={`h = 2(${
                                        result.tech_arcp1 - result.tech_arcp2
                                      })`}
                                    />
                                  </p>

                                  <p className="w-full mt-3">
                                    <InlineMath math={`h = ${result.tech_h}`} />
                                  </p>
                                </div>
                              </>
                            ) : result?.tech_effect_type == "phi" ||
                              result?.tech_effect_type == "cramer" ? (
                              <>
                                {isPhi && (
                                  <>
                                    <div className="text-center">
                                      <p className="text-[25px] bg-[#2845F5] px-3 py-2 rounded-[10px] inline-block my-3">
                                        <strong className="text-white">
                                          {result?.tech_phi}
                                        </strong>
                                      </p>
                                    </div>
                                    <div className="w-full p-3 md:p-9">
                                      <p className="w-full mt-3 text-[18px]">
                                        <strong className="text-blue">
                                          {data?.payload?.tech_lang_keys[15]}
                                        </strong>
                                      </p>
                                      <BlockMath
                                        math={`X^2 = ${result?.tech_ph_x2}`}
                                      />
                                      <BlockMath
                                        math={`\\text{${data?.payload?.tech_lang_keys[6]}}\\ (n_1) = ${result?.tech_ph_n1}`}
                                      />
                                      <p className="w-full mt-3 text-[18px]">
                                        <strong className="text-blue">
                                          {data?.payload?.tech_lang_keys[16]}
                                        </strong>
                                      </p>
                                      <BlockMath
                                        math={`\\phi = \\sqrt{\\dfrac{X^2}{n}}`}
                                      />
                                      <BlockMath
                                        math={`\\phi = \\sqrt{\\dfrac{${result?.tech_ph_x2}}{${result?.tech_ph_n1}}}`}
                                      />
                                      <BlockMath
                                        math={`\\phi = \\sqrt{${result?.tech_res}}`}
                                      />
                                      {result?.tech_res < 0 && (
                                        <p className="w-full mt-3">
                                          (∴ {data?.payload?.tech_lang_keys[19]}
                                          )
                                        </p>
                                      )}
                                      <BlockMath
                                        math={`\\phi = ${result?.tech_phi}`}
                                      />
                                    </div>
                                  </>
                                )}

                                {isCramer && (
                                  <>
                                    <div className="text-center">
                                      <p className="text-[25px] bg-[#2845F5] px-3 py-2 rounded-[10px] inline-block my-3">
                                        <strong className="text-white">
                                          {result?.tech_cramer}
                                        </strong>
                                      </p>
                                    </div>
                                    <div className="w-full p-3 md:p-9">
                                      <p className="w-full mt-3 text-[18px]">
                                        <strong className="text-blue">
                                          {data?.payload?.tech_lang_keys[15]}
                                        </strong>
                                      </p>
                                      <BlockMath
                                        math={`X^2 = ${result?.tech_cr_x2} \\quad ; \\quad n_1 = ${result?.tech_cr_n1}`}
                                      />
                                      <BlockMath
                                        math={`\\text{Number of Rows} = ${result?.tech_row}`}
                                      />
                                      <BlockMath
                                        math={`\\text{Number of Columns} = ${result?.tech_col}`}
                                      />
                                      <p className="w-full mt-3 text-[18px]">
                                        <strong className="text-blue">
                                          {data?.payload?.tech_lang_keys[16]}
                                        </strong>
                                      </p>
                                      <BlockMath
                                        math={`V = \\sqrt{\\dfrac{X^2}{n_1 \\cdot \\min(R - 1, C - 1)}}`}
                                      />
                                      <BlockMath
                                        math={`V = \\sqrt{\\dfrac{${
                                          result?.tech_cr_x2
                                        }}{${result?.tech_cr_n1} \\cdot \\min(${
                                          result?.tech_row - 1
                                        }, ${result?.tech_col - 1})}}`}
                                      />
                                      <BlockMath
                                        math={`V = \\sqrt{\\dfrac{${result?.tech_cr_x2}}{${result?.tech_cr_n1} \\cdot \\min(${result?.tech_r}, ${result?.tech_c})}}`}
                                      />
                                      <BlockMath
                                        math={`V = \\sqrt{\\dfrac{${result?.tech_cr_x2}}{${result?.tech_cr_n1} \\cdot ${result?.tech_min}}}`}
                                      />
                                      <BlockMath
                                        math={`V = \\sqrt{\\dfrac{${result?.tech_cr_x2}}{${result?.tech_res}}}`}
                                      />
                                      <BlockMath
                                        math={`V = \\sqrt{${result?.tech_v}}`}
                                      />
                                      {result?.tech_v < 0 && (
                                        <p className="w-full mt-3">
                                          (∴ {data?.payload?.tech_lang_keys[19]}
                                          )
                                        </p>
                                      )}
                                      <BlockMath
                                        math={`V = ${result?.tech_cramer}`}
                                      />
                                    </div>
                                  </>
                                )}
                              </>
                            ) : result?.tech_effect_type == "r2" ? (
                              <>
                                <div className="text-center">
                                  <p className="text-[25px] bg-[#2845F5] px-3 py-2 rounded-[10px] inline-block my-3">
                                    <strong className="text-white">
                                      {result?.tech_r2}
                                    </strong>
                                  </p>
                                </div>
                                <div className="w-full p-3 md:p-9">
                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[15]}
                                    </strong>
                                  </p>

                                  <BlockMath
                                    math={`\\text{SSR} = ${result?.tech_ssr} \\quad ; \\quad \\text{SST} = ${result?.tech_sst}`}
                                  />

                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[16]}
                                    </strong>
                                  </p>

                                  <BlockMath math={`R^2 = \\dfrac{SSR}{SST}`} />

                                  <BlockMath
                                    math={`R^2 = \\dfrac{${result?.tech_ssr}}{${result?.tech_sst}}`}
                                  />

                                  <BlockMath math={`R^2 = ${result?.tech_r}`} />

                                  <p className="w-full mt-3">Also we have:-</p>

                                  <BlockMath
                                    math={`f^2 = \\dfrac{R^2}{1 - R^2}`}
                                  />

                                  <BlockMath
                                    math={`f^2 = \\dfrac{${result?.tech_r}}{1 - ${result?.tech_r}}`}
                                  />

                                  <BlockMath
                                    math={`f^2 = ${result?.tech_r2}`}
                                  />
                                </div>
                              </>
                            ) : result?.tech_effect_type == "eta2" ? (
                              <>
                                <div className="text-center">
                                  <p className="text-[25px] bg-[#2845F5] px-3 py-2 rounded-[10px] inline-block my-3">
                                    <strong className="text-white">
                                      {result?.tech_eta2}
                                    </strong>
                                  </p>
                                </div>

                                <div className="w-full p-3 md:p-9">
                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[15]}
                                    </strong>
                                  </p>

                                  <BlockMath
                                    math={`\\text{SSG} = ${result?.tech_ssg} \\quad ; \\quad \\text{SST} = ${result?.tech_et_sst}`}
                                  />

                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[16]}
                                    </strong>
                                  </p>

                                  <BlockMath
                                    math={`\\eta^2 = \\dfrac{SSG}{SST}`}
                                  />

                                  <BlockMath
                                    math={`\\eta^2 = \\dfrac{${result?.tech_ssg}}{${result?.tech_et_sst}}`}
                                  />

                                  <BlockMath
                                    math={`\\eta^2 = ${result?.tech_et}`}
                                  />

                                  <p className="w-full mt-3">Also we have:-</p>

                                  <BlockMath
                                    math={`f^2 = \\dfrac{n^2}{1 - n^2}`}
                                  />

                                  <BlockMath
                                    math={`f^2 = \\dfrac{${result?.tech_et}}{1 - ${result?.tech_et}}`}
                                  />

                                  <BlockMath
                                    math={`f^2 = ${result?.tech_eta2}`}
                                  />
                                </div>
                              </>
                            ) : result?.tech_effect_type == "r2f" ? (
                              <>
                                <div className="text-center">
                                  <p className="text-[25px] bg-[#2845F5] px-3 py-2 rounded-[10px] inline-block my-3">
                                    <strong className="text-white">
                                      {result?.tech_rf}
                                    </strong>
                                  </p>
                                </div>
                                <div className="w-full  p-3 md:p-9">
                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[15]}
                                    </strong>
                                  </p>

                                  <BlockMath
                                    math={`R^2 = ${result?.tech_r2f}`}
                                  />

                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[16]}
                                    </strong>
                                  </p>

                                  <BlockMath
                                    math={`f^2 = \\dfrac{R^2}{1 - R^2}`}
                                  />

                                  <BlockMath
                                    math={`f^2 = \\dfrac{${result?.tech_r2f}}{1 - ${result?.tech_r2f}}`}
                                  />

                                  {/* Yeh jo agla fraction hai, uska original formula thoda unclear hai (denominator mein tech_res?), agar woh sahi hai toh ye hai: */}
                                  <BlockMath
                                    math={`f^2 = \\dfrac{${result?.tech_r2f}}{${result?.tech_res}}`}
                                  />

                                  <BlockMath
                                    math={`f^2 = ${result?.tech_rf}`}
                                  />
                                </div>
                              </>
                            ) : result?.tech_effect_type == "f2r" ? (
                              <>
                                <div className="text-center">
                                  <p className="text-[25px] bg-[#2845F5] px-3 py-2 rounded-[10px] inline-block my-3">
                                    <strong className="text-white">
                                      {result?.tech_fr}
                                    </strong>
                                  </p>
                                </div>

                                <div className="w-full p-3 md:p-9">
                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[15]}
                                    </strong>
                                  </p>

                                  <BlockMath
                                    math={`f^2 = ${result?.tech_f2r}`}
                                  />

                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[16]}
                                    </strong>
                                  </p>

                                  <BlockMath
                                    math={`R^2 = \\dfrac{f^2}{1 + f^2}`}
                                  />

                                  <BlockMath
                                    math={`R^2 = \\dfrac{${result?.tech_f2r}}{1 + ${result?.tech_f2r}}`}
                                  />

                                  {/* Yeh wala fraction jisme denominator result?.tech_res hai, agar aapko yeh sahi lagta hai to use karen */}
                                  <BlockMath
                                    math={`R^2 = \\dfrac{${result?.tech_f2r}}{${result?.tech_res}}`}
                                  />

                                  <BlockMath
                                    math={`R^2 = ${result?.tech_fr}`}
                                  />
                                </div>
                              </>
                            ) : result?.tech_effect_type == "dr" ? (
                              <>
                                <div className="text-center">
                                  <p className="text-[25px] bg-[#2845F5] px-3 py-2 rounded-[10px] inline-block my-3">
                                    <strong className="text-white">
                                      {result?.tech_dr}
                                    </strong>
                                  </p>
                                </div>

                                <div className="w-full p-3 md:p-9">
                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[15]}
                                    </strong>
                                  </p>

                                  <p className="w-full mt-3">
                                    {`t Value = ${result?.tech_t_value} \u00A0; \u00A0 df = ${result?.tech_df}`}
                                  </p>

                                  <p className="w-full mt-3 text-[18px]">
                                    <strong className="text-blue">
                                      {data?.payload?.tech_lang_keys[16]}
                                    </strong>
                                  </p>

                                  <BlockMath
                                    math={`\\text{Cohen's d} = \\dfrac{2t}{\\sqrt{df}}`}
                                  />

                                  <BlockMath
                                    math={`\\text{Cohen's d} = \\dfrac{2 \\times ${result?.tech_t_value}}{\\sqrt{${result?.tech_df}}}`}
                                  />

                                  <BlockMath
                                    math={`\\text{Cohen's d} = \\dfrac{${result?.tech_res}}{${result?.tech_dfsqr}}`}
                                  />

                                  <BlockMath
                                    math={`\\text{Cohen's d} = ${result?.tech_dr}`}
                                  />

                                  <p className="w-full mt-3">
                                    {data?.payload?.tech_lang_keys[17]}:-
                                  </p>

                                  <BlockMath
                                    math={`r_{Y\\lambda} = \\sqrt{\\dfrac{t^2}{t^2 + df}}`}
                                  />

                                  <BlockMath
                                    math={`r_{Y\\lambda} = \\sqrt{\\dfrac{(${result?.tech_t_value})^2}{(${result?.tech_t_value})^2 + ${result?.tech_df}}}`}
                                  />

                                  <BlockMath
                                    math={`r_{Y\\lambda} = \\sqrt{\\dfrac{${result?.tech_t}}{${result?.tech_t} + ${result?.tech_df}}}`}
                                  />

                                  <BlockMath
                                    math={`r_{Y\\lambda} = \\sqrt{\\dfrac{${result?.tech_t}}{${result?.tech_res2}}}`}
                                  />

                                  <BlockMath
                                    math={`r_{Y\\lambda} = \\sqrt{${result?.tech_ry}}`}
                                  />

                                  <BlockMath
                                    math={`r_{Y\\lambda} = ${result?.tech_r}`}
                                  />
                                </div>
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

export default EffectSizeCalculator;

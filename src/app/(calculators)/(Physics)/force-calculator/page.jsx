"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useForceCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ForceCalculator = () => {
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
    tech_unit_type: "m1", // m1  m2
    tech_cal: "f",
    tech_f: "10",
    tech_f_unit: "dyn",
    tech_m: "4",
    tech_m_unit: "ug",
    tech_a: "4",
    tech_a_unit: "in_s2",
    tech_sigfig: "auto",
    tech_question: "yes",
    tech_a_f: "15",
    tech_g_f: "15",
    tech_f_v: "13,9,8,15,7",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useForceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_unit_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_cal: formData.tech_cal,
        tech_f: formData.tech_f,
        tech_f_unit: formData.tech_f_unit,
        tech_m: formData.tech_m,
        tech_m_unit: formData.tech_m_unit,
        tech_a: formData.tech_a,
        tech_a_unit: formData.tech_a_unit,
        tech_sigfig: formData.tech_sigfig,
        tech_question: formData.tech_question,
        tech_a_f: formData.tech_a_f,
        tech_g_f: formData.tech_g_f,
        tech_f_v: formData.tech_f_v,
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
      tech_unit_type: "m1", // m1  m2
      tech_cal: "f",
      tech_f: "10",
      tech_f_unit: "dyn",
      tech_m: "4",
      tech_m_unit: "ug",
      tech_a: "4",
      tech_a_unit: "in_s2",
      tech_sigfig: "auto",
      tech_question: "yes",
      tech_a_f: "15",
      tech_g_f: "15",
      tech_f_v: "13,9,8,15,7",
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

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_f_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_a_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

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
            <div className="col-12  mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="tech_unit_type"
                id="calculator_time"
                value={formData.tech_unit_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_unit_type === "m1" ? "tagsUnit" : ""
                    }`}
                    id="m1"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "m1" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    Force Calculator
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit_type === "m2" ? "tagsUnit" : ""
                    }`}
                    id="m2"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "m2" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    Net Force Calculator
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-3  gap-4">
              {formData.tech_unit_type == "m1" && (
                <>
                  <div className="col-span-12">
                    <div
                      className="grid grid-cols-12 inp_wrap gap-4 mt-4"
                      id="inp_wrap"
                    >
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
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
                            <option value="f">
                              {data?.payload?.tech_lang_keys["2"]} (F)
                            </option>
                            <option value="m">
                              {data?.payload?.tech_lang_keys["3"]} (m)
                            </option>
                            <option value="a">
                              {data?.payload?.tech_lang_keys["4"]} (a)
                            </option>
                          </select>
                        </div>
                      </div>
                      {(formData.tech_cal == "m" ||
                        formData.tech_cal == "a") && (
                        <>
                          <div
                            className="col-span-12 md:col-span-6 lg:col-span-6 "
                            id="f"
                          >
                            <label htmlFor="tech_f" className="label">
                              {data?.payload?.tech_lang_keys["2"]} (F)
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_f"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_f}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown}
                              >
                                {formData.tech_f_unit} ▾
                              </label>
                              {dropdownVisible && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "dyn", value: "dyn" },
                                    { label: "kgf", value: "kgf" },
                                    { label: "n", value: "n" },
                                    { label: "mn", value: "mn" },
                                    { label: "gn", value: "gn" },
                                    { label: "tn", value: "tn" },
                                    { label: "kip", value: "kip" },
                                    { label: "ibf", value: "ibf" },
                                    { label: "ozf", value: "ozf" },
                                    { label: "pdl", value: "pdl" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() => setUnitHandler(unit.value)}
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      {(formData.tech_cal == "f" ||
                        formData.tech_cal == "a") && (
                        <>
                          <div
                            className="col-span-12 md:col-span-6 lg:col-span-6"
                            id="m"
                          >
                            <label htmlFor="tech_m" className="label">
                              {data?.payload?.tech_lang_keys["3"]} (m)
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_m"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_m}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown1}
                              >
                                {formData.tech_m_unit} ▾
                              </label>
                              {dropdownVisible1 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "ug", value: "ug" },
                                    { label: "mg", value: "mg" },
                                    { label: "g", value: "g" },
                                    { label: "dag", value: "dag" },
                                    { label: "kg", value: "kg" },
                                    { label: "t", value: "t" },
                                    { label: "gr", value: "gr" },
                                    { label: "dr", value: "dr" },
                                    { label: "oz", value: "oz" },
                                    { label: "lb", value: "lb" },
                                    { label: "stone", value: "stone" },
                                    { label: "US ton", value: "us_ton" },
                                    { label: "Long ton", value: "long_ton" },
                                    { label: "Earths", value: "earths" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler1(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      {(formData.tech_cal == "f" ||
                        formData.tech_cal == "m") && (
                        <>
                          <div
                            className="col-span-12 md:col-span-6 lg:col-span-6"
                            id="a"
                          >
                            <label htmlFor="tech_a" className="label">
                              {data?.payload?.tech_lang_keys["4"]} (a)
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_a"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_a}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown2}
                              >
                                {formData.tech_a_unit} ▾
                              </label>
                              {dropdownVisible2 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "in/s²", value: "in_s2" },
                                    { label: "ft/s", value: "ft_s2" },
                                    { label: "cm/s²", value: "cm_s2" },
                                    { label: "m/s²", value: "m_s2" },
                                    { label: "mi/s²", value: "mi_s2" },
                                    { label: "mi/(h.s)", value: "mi_hs" },
                                    { label: "km/s²", value: "km_s2" },
                                    { label: "km/(h.s)", value: "km_hs" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler2(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_sigfig" className="label">
                          {data?.payload?.tech_lang_keys["5"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_sigfig"
                            id="tech_sigfig"
                            value={formData.tech_sigfig}
                            onChange={handleChange}
                          >
                            <option value="auto">Auto</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_unit_type == "m2" && (
                <>
                  <div className="col-span-12">
                    <div
                      className="grid grid-cols-12  inp_wrap gap-4"
                      id="inp_wraps"
                    >
                      <div className="col-span-12">
                        <label htmlFor="tech_question" className="label">
                          {data?.payload?.tech_lang_keys["1"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_question"
                            id="tech_question"
                            value={formData.tech_question}
                            onChange={handleChange}
                          >
                            <option value="yes">
                              {data?.payload?.tech_lang_keys["8"]}
                            </option>
                            <option value="no">
                              {data?.payload?.tech_lang_keys["9"]}
                            </option>
                          </select>
                        </div>
                      </div>
                      {formData.tech_question == "yes" && (
                        <>
                          <div className="col-span-6" id="a_f">
                            <label htmlFor="tech_a_f" className="label">
                              {data?.payload?.tech_lang_keys["10"]} (a)
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_a_f"
                                id="tech_a_f"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_a_f}
                                onChange={handleChange}
                              />
                              <span className="input_unit">N</span>
                            </div>
                          </div>
                          <div className="col-span-6 " id="g_f">
                            <label htmlFor="tech_g_f" className="label">
                              {data?.payload?.tech_lang_keys["11"]} (g)
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_g_f"
                                id="tech_g_f"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_g_f}
                                onChange={handleChange}
                              />
                              <span className="input_unit">N</span>
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_question == "no" && (
                        <>
                          <div className="col-span-12" id="f_v">
                            <label htmlFor="tech_f_v" className="label">
                              {data?.payload?.tech_lang_keys["12"]} (,):
                            </label>
                            <div className="w-full py-2">
                              <textarea
                                name="tech_f_v"
                                id="tech_f_v"
                                className="input textareaInput"
                                aria-label="textarea input"
                                placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                                value={formData.tech_f_v || ""}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="col-12 font-s-20">
                        {formData?.tech_unit_type === "m1" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="40%">
                                      <strong>
                                        {formData?.tech_cal === "f"
                                          ? "Force (F)"
                                          : formData?.tech_cal === "m"
                                          ? "Mass (m)"
                                          : "Acceleration (a)"}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_ans}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-2 overflow-auto">
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[13]}:
                              </p>
                              {formData?.tech_cal === "f" && (
                                <>
                                  <BlockMath math={`F = m \\times a`} />
                                  <BlockMath
                                    math={`F = ${result?.tech_m} \\, kg \\times ${result?.tech_a} \\, m/s^2`}
                                  />
                                  <BlockMath
                                    math={`F = ${(
                                      result?.tech_m * result?.tech_a
                                    ).toExponential(7)} \\, N`}
                                  />
                                </>
                              )}
                              {formData?.tech_cal === "m" && (
                                <>
                                  <BlockMath math={`m = \\frac{F}{a}`} />
                                  <BlockMath
                                    math={`m = \\frac{${result?.tech_f} \\, N}{${result?.tech_a} \\, m/s^2}`}
                                  />
                                  <BlockMath
                                    math={`m = ${(
                                      result?.tech_f / result?.tech_a
                                    ).toFixed(10)} \\, kg`}
                                  />
                                </>
                              )}
                              {formData?.tech_cal === "a" && (
                                <>
                                  <BlockMath math={`a = \\frac{F}{m}`} />
                                  <BlockMath
                                    math={`a = \\frac{${result?.tech_f} \\, N}{${result?.tech_m} \\, kg}`}
                                  />
                                  <BlockMath
                                    math={`a = ${(
                                      result?.tech_f / result?.tech_m
                                    ).toFixed(3)} \\, m/s^2`}
                                  />
                                </>
                              )}
                            </div>
                          </>
                        )}

                        {formData?.tech_unit_type === "m2" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="40%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[14]} (n)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_nf} N
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-2 overflow-auto">
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[13]}:
                              </p>
                              {formData?.tech_question === "yes" ? (
                                <>
                                  <BlockMath math={`n = a + g`} />
                                  <BlockMath
                                    math={`n = ${formData?.tech_a_f} + ${formData?.tech_g_f}`}
                                  />
                                  <BlockMath math={`n = ${result?.tech_nf}`} />
                                </>
                              ) : (
                                <>
                                  <BlockMath math={`n = \\Sigma(x)`} />
                                  <BlockMath math={`n = ${result?.tech_ex}`} />
                                  <BlockMath math={`n = ${result?.tech_nf}`} />
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

export default ForceCalculator;

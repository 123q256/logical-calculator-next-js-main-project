"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePertCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PertCalculator = () => {
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
    tech_optimistic: "5",
    tech_optimistic_one: "9",
    tech_optimistic_sec: "7",
    tech_optimistic_unit: "wks/days",
    tech_pessimistic: "9",
    tech_pessimistic_one: "8",
    tech_pessimistic_sec: "6",
    tech_pessimistic_unit: "days",
    tech_most: "7",
    tech_most_one: "9",
    tech_most_sec: "7",
    tech_most_unit: "wks/days",
    tech_desired: "7",
    tech_desired_one: "9",
    tech_desired_sec: "7",
    tech_desired_unit: "yrs",
    tech_output_unit: "yrs/mos",
    tech_deviation_unit: "days/hrs",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePertCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_optimistic || !formData.tech_optimistic_one) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_optimistic: formData.tech_optimistic,
        tech_optimistic_one: formData.tech_optimistic_one,
        tech_optimistic_sec: formData.tech_optimistic_sec,
        tech_optimistic_unit: formData.tech_optimistic_unit,
        tech_pessimistic: formData.tech_pessimistic,
        tech_pessimistic_one: formData.tech_pessimistic_one,
        tech_pessimistic_sec: formData.tech_pessimistic_sec,
        tech_pessimistic_unit: formData.tech_pessimistic_unit,
        tech_most: formData.tech_most,
        tech_most_one: formData.tech_most_one,
        tech_most_sec: formData.tech_most_sec,
        tech_most_unit: formData.tech_most_unit,
        tech_desired: formData.tech_desired,
        tech_desired_one: formData.tech_desired_one,
        tech_desired_sec: formData.tech_desired_sec,
        tech_desired_unit: formData.tech_desired_unit,
        tech_output_unit: formData.tech_output_unit,
        tech_deviation_unit: formData.tech_deviation_unit,
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
      tech_optimistic: "5",
      tech_optimistic_one: "9",
      tech_optimistic_sec: "7",
      tech_optimistic_unit: "wks/days",
      tech_pessimistic: "9",
      tech_pessimistic_one: "8",
      tech_pessimistic_sec: "6",
      tech_pessimistic_unit: "days",
      tech_most: "7",
      tech_most_one: "9",
      tech_most_sec: "7",
      tech_most_unit: "wks/days",
      tech_desired: "7",
      tech_desired_one: "9",
      tech_desired_sec: "7",
      tech_desired_unit: "yrs",
      tech_output_unit: "yrs/mos",
      tech_deviation_unit: "days/hrs",
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

  const keys = data?.payload?.tech_lang_keys;

  const getNumber = (value, fixed = 2) => {
    const num = Number(value);
    return isNaN(num) ? "-" : num.toFixed(fixed);
  };

  const parseUnitValue = (unit, resultVal, formVal) => {
    const specialUnits = ["yrs/mos", "wks/days", "days/hrs"];
    return specialUnits.includes(unit) ? Number(resultVal) : formVal;
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

          <div className="lg:w-[80%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12   mt-3 gap-1 md:gap-3">
              <div className="col-span-12  md:col-span-6 lg:col-span-6">
                <div className="grid grid-cols-12   mt-3 gap-1 md:gap-3">
                  {(formData.tech_optimistic_unit == "hrs" ||
                    formData.tech_optimistic_unit == "days" ||
                    formData.tech_optimistic_unit == "wks" ||
                    formData.tech_optimistic_unit == "mos" ||
                    formData.tech_optimistic_unit == "yrs") && (
                    <>
                      <div className="col-span-8  " id="optimistic">
                        <label htmlFor="tech_optimistic" className="label">
                          {data?.payload?.tech_lang_keys["1"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_optimistic"
                            id="tech_optimistic"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_optimistic}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {(formData.tech_optimistic_unit == "yrs/mos" ||
                    formData.tech_optimistic_unit == "wks/days" ||
                    formData.tech_optimistic_unit == "days/hrs") && (
                    <>
                      <div className="col-span-8 " id="dubble_input">
                        <div className="grid grid-cols-12   mt-1">
                          <div className="col-span-6 px-2">
                            <label
                              htmlFor="tech_optimistic_one"
                              className="label"
                            >
                              {data?.payload?.tech_lang_keys["1"]}:
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_optimistic_one"
                                id="tech_optimistic_one"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_optimistic_one}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-6 px-2">
                            <label
                              htmlFor="tech_optimistic_sec"
                              className="label"
                            >
                              &nbsp;
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_optimistic_sec"
                                id="tech_optimistic_sec"
                                className="input mt-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_optimistic_sec}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="col-span-4 ">
                    <label htmlFor="tech_optimistic_unit" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-3">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_optimistic_unit"
                        id="tech_optimistic_unit"
                        value={formData.tech_optimistic_unit}
                        onChange={handleChange}
                      >
                        <option value="hrs">hrs</option>
                        <option value="days">days</option>
                        <option value="wks">wks</option>
                        <option value="mos">mos</option>
                        <option value="yrs">yrs</option>
                        <option value="yrs/mos">yrs/mos</option>
                        <option value="wks/days">wks/days</option>
                        <option value="days/hrs">days/hrs</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12  md:col-span-6 lg:col-span-6">
                <div className="grid grid-cols-12   mt-3 gap-1 md:gap-3">
                  {(formData.tech_pessimistic_unit == "hrs" ||
                    formData.tech_pessimistic_unit == "days" ||
                    formData.tech_pessimistic_unit == "wks" ||
                    formData.tech_pessimistic_unit == "mos" ||
                    formData.tech_pessimistic_unit == "yrs") && (
                    <>
                      <div className="col-span-8 " id="pessimistic">
                        <label htmlFor="tech_pessimistic" className="label">
                          {data?.payload?.tech_lang_keys["2"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_pessimistic"
                            id="tech_pessimistic"
                            className="input mt-3"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_pessimistic}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {(formData.tech_pessimistic_unit == "yrs/mos" ||
                    formData.tech_pessimistic_unit == "wks/days" ||
                    formData.tech_pessimistic_unit == "days/hrs") && (
                    <>
                      <div className="col-span-8 " id="dubb_input">
                        <div className="grid grid-cols-12   mt-1">
                          <div className="col-span-6 px-2">
                            <label
                              htmlFor="tech_pessimistic_one"
                              className="label"
                            >
                              {data?.payload?.tech_lang_keys["2"]}:
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_pessimistic_one"
                                id="tech_pessimistic_one"
                                className="input my-3"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_pessimistic_one}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-6 px-2">
                            <label
                              htmlFor="tech_pessimistic_sec"
                              className="label"
                            >
                              &nbsp;
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_pessimistic_sec"
                                id="tech_pessimistic_sec"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_pessimistic_sec}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="col-span-4 ">
                    <label htmlFor="tech_pessimistic_unit" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_pessimistic_unit"
                        id="tech_pessimistic_unit"
                        value={formData.tech_pessimistic_unit}
                        onChange={handleChange}
                      >
                        <option value="hrs">hrs</option>
                        <option value="days">days</option>
                        <option value="wks">wks</option>
                        <option value="mos">mos</option>
                        <option value="yrs">yrs</option>
                        <option value="yrs/mos">yrs/mos</option>
                        <option value="wks/days">wks/days</option>
                        <option value="days/hrs">days/hrs</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12  md:col-span-6 lg:col-span-6">
                <div className="grid grid-cols-12   mt-3 gap-1 md:gap-3">
                  {(formData.tech_most_unit == "hrs" ||
                    formData.tech_most_unit == "days" ||
                    formData.tech_most_unit == "wks" ||
                    formData.tech_most_unit == "mos" ||
                    formData.tech_most_unit == "yrs") && (
                    <>
                      <div className="col-span-8 " id="most">
                        <label htmlFor="tech_most" className="label">
                          {data?.payload?.tech_lang_keys["3"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_most"
                            id="tech_most"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_most}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {(formData.tech_most_unit == "yrs/mos" ||
                    formData.tech_most_unit == "wks/days" ||
                    formData.tech_most_unit == "days/hrs") && (
                    <>
                      <div className="col-span-8 " id="dub_input">
                        <div className="grid grid-cols-12   mt-1">
                          <label
                            htmlFor="tech_most_one"
                            className="label col-span-12"
                          >
                            {data?.payload?.tech_lang_keys["3"]}:
                          </label>
                          <div className="col-span-6 px-2">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_most_one"
                                id="tech_most_one"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_most_one}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-6 px-2">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_most_sec"
                                id="tech_most_sec"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_most_sec}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="col-span-4 ">
                    <label htmlFor="tech_most_unit" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_most_unit"
                        id="tech_most_unit"
                        value={formData.tech_most_unit}
                        onChange={handleChange}
                      >
                        <option value="hrs">hrs</option>
                        <option value="days">days</option>
                        <option value="wks">wks</option>
                        <option value="mos">mos</option>
                        <option value="yrs">yrs</option>
                        <option value="yrs/mos">yrs/mos</option>
                        <option value="wks/days">wks/days</option>
                        <option value="days/hrs">days/hrs</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12  md:col-span-6 lg:col-span-6">
                <div className="grid grid-cols-12   mt-3 gap-1 md:gap-3">
                  {(formData.tech_desired_unit == "hrs" ||
                    formData.tech_desired_unit == "days" ||
                    formData.tech_desired_unit == "wks" ||
                    formData.tech_desired_unit == "mos" ||
                    formData.tech_desired_unit == "yrs") && (
                    <>
                      <div className="col-span-8 " id="desired">
                        <label htmlFor="tech_desired" className="label">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_desired"
                            id="tech_desired"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_desired}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {(formData.tech_desired_unit == "yrs/mos" ||
                    formData.tech_desired_unit == "wks/days" ||
                    formData.tech_desired_unit == "days/hrs") && (
                    <>
                      <div className="col-span-8 " id="desired_input">
                        <div className="grid grid-cols-12   mt-1">
                          <label
                            htmlFor="tech_desired_one"
                            className="label col-span-12"
                          >
                            {data?.payload?.tech_lang_keys["4"]}:
                          </label>
                          <div className="col-span-6 px-2">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_desired_one"
                                id="tech_desired_one"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_desired_one}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-6 px-2">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_desired_sec"
                                id="tech_desired_sec"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_desired_sec}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="col-span-4 ">
                    <label htmlFor="tech_desired_unit" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_desired_unit"
                        id="tech_desired_unit"
                        value={formData.tech_desired_unit}
                        onChange={handleChange}
                      >
                        <option value="hrs">hrs</option>
                        <option value="days">days</option>
                        <option value="wks">wks</option>
                        <option value="mos">mos</option>
                        <option value="yrs">yrs</option>
                        <option value="yrs/mos">yrs/mos</option>
                        <option value="wks/days">wks/days</option>
                        <option value="days/hrs">days/hrs</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 px-2">
                <label htmlFor="tech_output_unit" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_output_unit"
                    id="tech_output_unit"
                    value={formData.tech_output_unit}
                    onChange={handleChange}
                  >
                    <option value="hrs">hrs</option>
                    <option value="days">days</option>
                    <option value="wks">wks</option>
                    <option value="mos">mos</option>
                    <option value="yrs">yrs</option>
                    <option value="yrs/mos">yrs/mos</option>
                    <option value="wks/days">wks/days</option>
                    <option value="days/hrs">days/hrs</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 px-2">
                <label htmlFor="tech_deviation_unit" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_deviation_unit"
                    id="tech_deviation_unit"
                    value={formData.tech_deviation_unit}
                    onChange={handleChange}
                  >
                    <option value="hrs">hrs</option>
                    <option value="days">days</option>
                    <option value="wks">wks</option>
                    <option value="mos">mos</option>
                    <option value="yrs">yrs</option>
                    <option value="yrs/mos">yrs/mos</option>
                    <option value="wks/days">wks/days</option>
                    <option value="days/hrs">days/hrs</option>
                  </select>
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[12px] md:text-[16px] lg:text-[16px]">
                        <div className="w-full md:w-[90%] lg:w-[70%] mt-2 px-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["7"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {getNumber(result?.tech_main_answer)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["8"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {getNumber(result?.tech_sub_answer)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["9"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {getNumber(result?.tech_ans)}%
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full overflow-auto">
                          <p className="w-full mt-2 text-[20px]">
                            <strong className="text-blue">
                              {data?.payload?.tech_lang_keys["10"]}
                            </strong>
                          </p>
                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["11"]}.
                          </div>

                          <div className="w-full mt-3">
                            <BlockMath
                              math={`${data?.payload?.tech_lang_keys["7"]} = \\dfrac{\\text{${data?.payload?.tech_lang_keys["1"]}} + (4 × \\text{${data?.payload?.tech_lang_keys["3"]}}) + \\text{${data?.payload?.tech_lang_keys["2"]}}}{6}`}
                            />
                          </div>

                          <div className="w-full mt-3">
                            <BlockMath
                              math={`${
                                data?.payload?.tech_lang_keys["7"]
                              } = \\dfrac{${parseUnitValue(
                                formData?.tech_optimistic_unit,
                                result?.tech_optimistic,
                                formData?.tech_optimistic
                              )} + (4 × ${parseUnitValue(
                                formData?.tech_most_unit,
                                result?.tech_most,
                                formData?.tech_most
                              )}) + ${parseUnitValue(
                                formData?.tech_pessimistic_unit,
                                result?.tech_pessimistic,
                                formData?.tech_pessimistic
                              )}}{6}`}
                            />
                          </div>

                          <div className="w-full mt-3">
                            <BlockMath
                              math={`${
                                data?.payload?.tech_lang_keys["7"]
                              } = \\dfrac{${Number(result?.tech_add)}}{6}`}
                            />
                          </div>

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["7"]} ={" "}
                            {getNumber(result?.tech_main_answer)}
                          </div>
                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["12"]}.
                          </div>

                          <div className="w-full mt-3">
                            <BlockMath
                              math={`${data?.payload?.tech_lang_keys["8"]} = \\dfrac{\\text{${data?.payload?.tech_lang_keys["2"]}} - \\text{${data?.payload?.tech_lang_keys["1"]}}}{6}`}
                            />
                          </div>

                          <div className="w-full mt-3">
                            <BlockMath
                              math={`${
                                data?.payload?.tech_lang_keys["8"]
                              } = \\dfrac{${parseUnitValue(
                                formData?.tech_pessimistic_unit,
                                result?.tech_pessimistic,
                                formData?.tech_pessimistic
                              )} - ${parseUnitValue(
                                formData?.tech_optimistic_unit,
                                result?.tech_optimistic,
                                formData?.tech_optimistic
                              )}}{6}`}
                            />
                          </div>

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["8"]} ={" "}
                            {getNumber(result?.tech_sub_answer)}
                          </div>
                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["13"]}.
                          </div>

                          <div className="w-full mt-3 overflow-auto">
                            <BlockMath
                              math={`${data?.payload?.tech_lang_keys["9"]} = \\dfrac{\\text{${data?.payload?.tech_lang_keys["4"]}} - \\text{${data?.payload?.tech_lang_keys["7"]}}}{\\text{${data?.payload?.tech_lang_keys["8"]}}}`}
                            />
                          </div>

                          <div className="w-full mt-3">
                            <BlockMath
                              math={`${
                                data?.payload?.tech_lang_keys["9"]
                              } = \\dfrac{${parseUnitValue(
                                formData?.tech_desired_unit,
                                result?.tech_desired,
                                formData?.tech_desired
                              )} - ${getNumber(
                                result?.tech_main_answer
                              )}}{${getNumber(result?.tech_sub_answer)}}`}
                            />
                          </div>

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["9"]} ={" "}
                            {getNumber(result?.tech_ans)}
                            <span className="black-text font_size18">%</span>
                          </div>
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

export default PertCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import { Parser } from "expr-eval";
const parser = new Parser();
import "katex/dist/katex.min.css";
import $ from "jquery";
if (typeof window !== "undefined") {
  window.$ = window.jQuery = $;
}
import FractionPainter from "../../../../components/FractionPainter";
import FourAddMulDiv from "../../FractionInclude/FourAddMulDiv";
import FourAddMulSub from "../../FractionInclude/FourAddMulSub";
import FourAddSubMul from "../../FractionInclude/FourAddSubMul";
import FourMulAddDiv from "../../FractionInclude/FourMulAddDiv";
import FourMulDivAdd from "../../FractionInclude/FourMulDivAdd";
import FourMulSubAdd from "../../FractionInclude/FourMulSubAdd";

import FourMulDivMul from "../../FractionInclude/FourMulDivMul";
import FourAddSubAdd from "../../FractionInclude/FourAddSubAdd";
import Power from "../../FractionInclude/Power";
import ThreeAddSub from "../../FractionInclude/ThreeAddSub";
import ThreeDivSub from "../../FractionInclude/ThreeDivSub";
import ThreeMulAdd from "../../FractionInclude/ThreeMulAdd";
import ThreeMulDiv from "../../FractionInclude/ThreeMulDiv";
import TwoAddSub from "../../FractionInclude/TwoAddSub";
import TwoMul from "../../FractionInclude/TwoMul";

import "../../../../components/styles/CssFractionCalculator.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useFractionCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FractionCalculator = () => {
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
    tech_calculate_type: "fraction_type", // fraction_type  mixed_type
    tech_stype: "one_frac", // simple_frac one_frac three_frac four_frac
    tech_fraction_types: "one_frac", // simple_frac  one_frac  three_frac  four_frac
    tech_ne1: "1",
    tech_neo2: "5",
    tech_du1: "6",
    tech_N1: "3",
    tech_action: "+",
    tech_N2: "5",
    tech_action1: "+",
    tech_N3: "7",
    tech_action2: "+",
    tech_N4: "9",
    tech_D1: "13",
    tech_D2: "15",
    tech_D3: "17",
    tech_D4: "19",
    tech_s1: "-3",
    tech_nu1: "2",
    tech_de1: "5",
    tech_actions: "+",
    tech_s2: "5",
    tech_nu2: "2",
    tech_de2: "7",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFractionCalculatorMutation();

  // Validate input to prevent zero values
  const validateInput = (e) => {
    if (e.target.value === "0") {
      e.target.value = "1";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_stype) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculate_type: formData.tech_calculate_type,
        tech_stype: formData.tech_stype,
        tech_fraction_types: formData.tech_fraction_types,
        tech_ne1: formData.tech_ne1,
        tech_neo2: formData.tech_neo2,
        tech_du1: formData.tech_du1,
        tech_N1: formData.tech_N1,
        tech_action: formData.tech_action,
        tech_N2: formData.tech_N2,
        tech_action1: formData.tech_action1,
        tech_N3: formData.tech_N3,
        tech_action2: formData.tech_action2,
        tech_N4: formData.tech_N4,
        tech_D1: formData.tech_D1,
        tech_D2: formData.tech_D2,
        tech_D3: formData.tech_D3,
        tech_D4: formData.tech_D4,
        tech_s1: formData.tech_s1,
        tech_nu1: formData.tech_nu1,
        tech_de1: formData.tech_de1,
        tech_actions: formData.tech_actions,
        tech_s2: formData.tech_s2,
        tech_nu2: formData.tech_nu2,
        tech_de2: formData.tech_de2,
      });

      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");

      // console.log(result?.data?.tech_btm);
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_calculate_type: "fraction_type", // fraction_type  mixed_type
      tech_stype: "one_frac", // simple_frac one_frac three_frac four_frac
      tech_fraction_types: "one_frac", // simple_frac  one_frac  three_frac  four_frac
      tech_ne1: "1",
      tech_neo2: "5",
      tech_du1: "6",
      tech_N1: "3",
      tech_action: "+",
      tech_N2: "5",
      tech_action1: "+",
      tech_N3: "7",
      tech_action2: "+",
      tech_N4: "9",
      tech_D1: "13",
      tech_D2: "15",
      tech_D3: "17",
      tech_D4: "19",
      tech_s1: "-3",
      tech_nu1: "2",
      tech_de1: "5",
      tech_actions: "+",
      tech_s2: "5",
      tech_nu2: "2",
      tech_de2: "7",
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

  // result data

  const gcd = (a, b) => {
    if (!b) return a;
    return gcd(b, a % b);
  };

  let N1 = parseInt(formData?.tech_N1) || 0;
  let N2 = parseInt(formData?.tech_N2) || 0;
  let N3 = parseInt(formData?.tech_N3) || 0;
  let N4 = parseInt(formData?.tech_N4) || 0;

  let D1 = parseInt(formData?.tech_D1) || 1;
  let D2 = parseInt(formData?.tech_D2) || 1;
  let D3 = parseInt(formData?.tech_D3) || 1;
  let D4 = parseInt(formData?.tech_D4) || 1;

  let action = formData?.tech_action;
  let action1 = formData?.tech_action1;
  let action2 = formData?.tech_action2;

  // Handle negative numerators
  if (N2 < 0) {
    N2 = Math.abs(N2);
    action = action === "+" ? "-" : "+";
  }
  if (N3 < 0) {
    N3 = Math.abs(N3);
    action1 = action1 === "+" ? "-" : "+";
  }
  if (N4 < 0) {
    N4 = Math.abs(N4);
    action2 = action2 === "+" ? "-" : "+";
  }

  // LCD multipliers
  const lcd = result?.data?.tech_lcd || 1;
  const mul1 = lcd / D1;
  const mul2 = lcd / D2;
  const mul3 = lcd / D3;
  const mul4 = lcd / D4;

  // Updated numerators
  const F1 = N1 * mul1;
  const F2 = N2 * mul2;
  const F3 = N3 * mul3;
  const F4 = N4 * mul4;

  // Replace math symbols for JavaScript evaluation
  const op1 = action?.replace("×", "*")?.replace("÷", "/") || "+";
  const op2 = action1?.replace("×", "*")?.replace("÷", "/") || "+";
  const op3 = action2?.replace("×", "*")?.replace("÷", "/") || "+";

  // Calculate total numerator
  let plus = 0;
  try {
    const expression = `${F1} ${op1} ${F2} ${op2} ${F3} ${op3} ${F4}`;
    plus = parser.evaluate(expression);
  } catch (error) {
    console.error("Invalid expression:", error.message);
    plus = 0;
  }

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
            <div className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </div>
          )}

          <div className="lg-w-[80%] md:w-[90%] w-full mx-auto">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 text-center">
                <div className="flex velocitytab border-b-dark border-b relative">
                  <div className="cursor-pointer veloTabs px-2 v_active">
                    <strong>
                      {data?.payload?.tech_lang_keys["43"] ??
                        "Fraction Calculator"}
                    </strong>
                  </div>
                  <div className="cursor-pointer veloTabs px-2">
                    <strong>
                      <a
                        href="/mixed-number-calculator"
                        className="cursor-pointer veloTabs text-decoration-none"
                      >
                        {data?.payload?.tech_lang_keys["44"] ?? "Mixed Number"}
                      </a>
                    </strong>
                  </div>
                  <div className="cursor-pointer veloTabs px-2">
                    <strong>
                      <a
                        href="/fraction-simplifier-calculator"
                        className="cursor-pointer veloTabs text-decoration-none"
                      >
                        {data?.payload?.tech_lang_keys["45"] ??
                          "Fraction Simplifier"}
                      </a>
                    </strong>
                  </div>
                </div>
              </div>
              <input
                type="hidden"
                name="tech_calculate_type"
                value={formData.tech_calculate_type}
                onChange={handleChange}
              />

              <div className="col-span-12">
                <div className="my-2 flex justify-center items-center gap-3">
                  <label className="pe-2 cursor-pointer" htmlFor="one_frac">
                    <input
                      type="radio"
                      name="tech_stype"
                      value="one_frac"
                      id="one_frac"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_stype == "one_frac"}
                    />
                    <span>1 Fraction</span>
                  </label>
                  <label className="pe-2 cursor-pointer" htmlFor="simple_frac">
                    <input
                      type="radio"
                      name="tech_stype"
                      value="simple_frac"
                      id="simple_frac"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_stype == "simple_frac"}
                    />
                    <span>2 {data?.payload?.tech_lang_keys[47]}</span>
                  </label>
                  <label className="pe-2 cursor-pointer" htmlFor="three_frac">
                    <input
                      type="radio"
                      name="tech_stype"
                      value="three_frac"
                      id="three_frac"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_stype == "three_frac"}
                    />
                    <span>3 {data?.payload?.tech_lang_keys[47]}</span>
                  </label>
                  <label className="pe-2 cursor-pointer" htmlFor="four_frac">
                    <input
                      type="radio"
                      name="tech_stype"
                      value="four_frac"
                      id="four_frac"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_stype == "four_frac"}
                    />
                    <span>4 {data?.payload?.tech_lang_keys[47]}</span>
                  </label>
                </div>
              </div>

              {formData.tech_stype == "one_frac" && (
                <>
                  <div className="col-span-12">
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-12 flex items-center justify-center">
                        <div className="pe-2">
                          <input
                            type="number"
                            step="any"
                            name="tech_ne1"
                            id="tech_ne1"
                            className="input"
                            aria-label="input"
                            placeholder="optional"
                            value={formData.tech_ne1}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="ps-2">
                          <input
                            type="number"
                            step="any"
                            name="tech_neo2"
                            id="tech_neo2"
                            className="input"
                            aria-label="input"
                            value={formData.tech_neo2}
                            onChange={handleChange}
                          />
                          <hr className="bdr-top my-2" />
                          <input
                            type="number"
                            step="any"
                            name="tech_du1"
                            id="tech_du1"
                            onInput={validateInput}
                            pattern="^(?!0$).+"
                            className="input"
                            aria-label="input"
                            value={formData.tech_du1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-12">
                <div className="overflow-x-auto">
                  <table className="mx-auto min-w-[500px]">
                    <tbody>
                      <tr>
                        {(formData.tech_stype == "three_frac" ||
                          formData.tech_stype == "four_frac") && (
                          <>
                            <td>
                              <input
                                type="number"
                                step="any"
                                name="tech_N1"
                                id="tech_N1"
                                onInput={validateInput}
                                pattern="^(?!0$).+"
                                className="input"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_N1}
                                onChange={handleChange}
                              />
                            </td>
                            <td rowSpan="2" className="w-[80px]">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_action"
                                id="tech_action"
                                value={formData.tech_action}
                                onChange={handleChange}
                              >
                                <option value="+">+ </option>
                                <option value="-">- </option>
                                <option value="×">× </option>
                                <option value="÷">÷ </option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                step="any"
                                name="tech_N2"
                                id="tech_N2"
                                className="input"
                                aria-label="input"
                                placeholder="00"
                                onInput={validateInput}
                                pattern="^(?!0$).+"
                                required
                                value={formData.tech_N2}
                                onChange={handleChange}
                              />
                            </td>
                            <td rowSpan="2" className="w-[80px]">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_action1"
                                id="tech_action1"
                                value={formData.tech_action1}
                                onChange={handleChange}
                              >
                                <option value="+">+ </option>
                                <option value="-">- </option>
                                <option value="×">× </option>
                                <option value="÷">÷ </option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                step="any"
                                name="tech_N3"
                                id="tech_N3"
                                className="input"
                                aria-label="input"
                                placeholder="00"
                                onInput={validateInput}
                                pattern="^(?!0$).+"
                                required
                                value={formData.tech_N3}
                                onChange={handleChange}
                              />
                            </td>
                          </>
                        )}
                        {(formData.tech_stype == "four_frac" ||
                          formData.tech_stype == "four_frac") && (
                          <>
                            <td rowSpan="2" className="w-[80px]">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_action2"
                                id="tech_action2"
                                value={formData.tech_action2}
                                onChange={handleChange}
                              >
                                <option value="+">+ </option>
                                <option value="-">- </option>
                                <option value="×">× </option>
                                <option value="÷">÷ </option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                step="any"
                                name="tech_N4"
                                id="tech_N4"
                                className="input"
                                aria-label="input"
                                placeholder="00"
                                onInput={validateInput}
                                pattern="^(?!0$).+"
                                required
                                value={formData.tech_N4}
                                onChange={handleChange}
                              />
                            </td>
                          </>
                        )}
                      </tr>
                      <tr>
                        {(formData.tech_stype == "three_frac" ||
                          formData.tech_stype == "four_frac") && (
                          <>
                            <td className="bdr-top">
                              <input
                                type="number"
                                step="any"
                                name="tech_D1"
                                id="tech_D1"
                                className="input"
                                aria-label="input"
                                placeholder="00"
                                onInput={validateInput}
                                pattern="^(?!0$).+"
                                required
                                value={formData.tech_D1}
                                onChange={handleChange}
                              />
                            </td>
                            <td className="bdr-top">
                              <input
                                type="number"
                                step="any"
                                name="tech_D2"
                                id="tech_D2"
                                className="input"
                                aria-label="input"
                                placeholder="00"
                                onInput={validateInput}
                                pattern="^(?!0$).+"
                                required
                                value={formData.tech_D2}
                                onChange={handleChange}
                              />
                            </td>
                            <td className="bdr-top">
                              <input
                                type="number"
                                step="any"
                                name="tech_D3"
                                id="tech_D3"
                                className="input"
                                aria-label="input"
                                placeholder="00"
                                onInput={validateInput}
                                pattern="^(?!0$).+"
                                required
                                value={formData.tech_D3}
                                onChange={handleChange}
                              />
                            </td>
                          </>
                        )}
                        {(formData.tech_stype == "four_frac" ||
                          formData.tech_stype == "four_frac") && (
                          <>
                            <td className="bdr-top">
                              <input
                                type="number"
                                step="any"
                                name="tech_D4"
                                id="tech_D4"
                                className="input"
                                aria-label="input"
                                placeholder="00"
                                onInput={validateInput}
                                pattern="^(?!0$).+"
                                required
                                value={formData.tech_D4}
                                onChange={handleChange}
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2 Fractions */}
              {formData.tech_stype == "simple_frac" && (
                <>
                  <div className="col-span-12">
                    <div className="grid grid-cols-12 gap-3 mx-auto">
                      <div className="col-span-1"></div>
                      <div className="col-span-4">
                        <div className="flex items-center">
                          <div className="ps-lg-2">
                            <input
                              type="number"
                              step="any"
                              name="tech_N1"
                              id="tech_N1"
                              className="input"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_N1}
                              onChange={handleChange}
                            />
                            <hr className="bdr-top my-2" />
                            <input
                              type="number"
                              step="any"
                              name="tech_D1"
                              id="tech_D1"
                              onInput={validateInput}
                              pattern="^(?!0$).+"
                              className="input"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_D1}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label
                          htmlFor="actions"
                          className="font-s-14 text-blue"
                        >
                          &nbsp;
                        </label>
                        <div className="w-full py-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_action"
                            id="tech_action"
                            value={formData.tech_action}
                            onChange={handleChange}
                          >
                            <option value="+">+ </option>
                            <option value="-">- </option>
                            <option value="×">× </option>
                            <option value="÷">÷ </option>
                            <option value="of">of </option>
                            <option value="^">^ </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-4">
                        <div className="flex items-center">
                          <div className="ps-lg-2">
                            <input
                              type="number"
                              step="any"
                              name="tech_N2"
                              id="tech_N2"
                              className="input"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_N2}
                              onChange={handleChange}
                            />
                            <hr className="bdr-top my-2" />
                            <input
                              type="number"
                              step="any"
                              name="tech_D2"
                              id="tech_D2"
                              onInput={validateInput}
                              pattern="^(?!0$).+"
                              className="input"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_D2}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1"></div>
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
              <div className="w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
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
                      <div className="w-full">
                        <div className="w-full mt-2">
                          {formData?.tech_calculate_type == "fraction_type" ? (
                            <>
                              <div className="grid grid-cols-12 gap-3">
                                {formData?.tech_stype == "simple_frac" ? (
                                  <>
                                    <div className="col-span-12 bg-sky-100 border radius-10 text-[20px] px-3 py-2 mt-2">
                                      <BlockMath
                                        math={(function () {
                                          const N1 = parseInt(
                                            formData?.tech_N1 || 0
                                          );
                                          const D1 = parseInt(
                                            formData?.tech_D1 || 1
                                          );
                                          const N2 = parseInt(
                                            formData?.tech_N2 || 0
                                          );
                                          const D2 = parseInt(
                                            formData?.tech_D2 || 1
                                          );
                                          const action =
                                            formData?.tech_action || "";
                                          const upr =
                                            result?.data?.tech_upr || 0;
                                          const btm =
                                            result?.data?.tech_btm || 1;

                                          const left =
                                            action === "^"
                                              ? `\\left(\\dfrac{${N1}}{${D1}}\\right) ${action} \\dfrac{${N2}}{${D2}} = `
                                              : `\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}} = `;

                                          const right =
                                            btm != 1 && upr != 0
                                              ? `\\dfrac{${upr}}{${btm}}`
                                              : `${upr}`;

                                          return left + right;
                                        })()}
                                      />
                                    </div>
                                    <div className="col-span-12 mt-2">
                                      <div className="mt-4">
                                        <div className="text-[20px] mt-2 font-bold">
                                          {data?.payload?.tech_lang_keys["ex"]}:
                                        </div>
                                        {/* Special 'of' case */}
                                        {formData?.tech_action == "of" && (
                                          <div className="mt-2">
                                            "{data?.payload?.tech_lang_keys[41]}
                                            " {data?.payload?.tech_lang_keys[3]}
                                          </div>
                                        )}
                                        <div className="text-center mt-2">
                                          <BlockMath
                                            math={(function () {
                                              const N1 = parseInt(
                                                formData?.tech_N1 || 0
                                              );
                                              const D1 = parseInt(
                                                formData?.tech_D1 || 1
                                              );
                                              let N2 = parseInt(
                                                formData?.tech_N2 || 0
                                              );
                                              const D2 = parseInt(
                                                formData?.tech_D2 || 1
                                              );
                                              let action =
                                                formData?.tech_action || "";

                                              if (
                                                N2 < 0 &&
                                                (action === "+" ||
                                                  action === "-")
                                              ) {
                                                action =
                                                  action === "+" ? "-" : "+";
                                                N2 = Math.abs(N2);
                                              }

                                              return action === "^"
                                                ? `\\left(\\dfrac{${N1}}{${D1}}\\right) ${action} \\dfrac{${N2}}{${D2}} = ?`
                                                : `\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}} = ?`;
                                            })()}
                                          />
                                        </div>

                                        {parseInt(formData?.tech_N2 || 0) < 0 &&
                                          (formData?.tech_action == "+" ||
                                            formData?.tech_action == "-") && (
                                            <div className="mt-2">
                                              {data?.payload?.tech_lang_keys[5]}
                                              :{" "}
                                              <span className="ms-1">
                                                {
                                                  data?.payload
                                                    ?.tech_lang_keys[6]
                                                }
                                              </span>
                                            </div>
                                          )}

                                        <div className="mt-4 text-center font-semibold">
                                          {["+", "-"].includes(
                                            formData?.tech_action
                                          ) && (
                                            <>
                                              {/* FractionInclude/two-add-sub.php */}
                                              <TwoAddSub
                                                lang={
                                                  data?.payload?.tech_lang_keys
                                                }
                                                formData={formData}
                                                result={result}
                                              />
                                            </>
                                          )}

                                          {["×", "÷", "of"].includes(
                                            formData?.tech_action
                                          ) && (
                                            <>
                                              {/* FractionInclude/two-mul.php */}
                                              <TwoMul
                                                lang={
                                                  data?.payload?.tech_lang_keys
                                                }
                                                formData={formData}
                                                result={result}
                                              />
                                            </>
                                          )}

                                          {formData?.tech_action == "^" && (
                                            <>
                                              {/* FractionInclude/frac.power.php */}
                                              <Power
                                                lang={
                                                  data?.payload?.tech_lang_keys
                                                }
                                                formData={formData}
                                                result={result}
                                              />
                                            </>
                                          )}
                                        </div>
                                      </div>

                                      <div className="text-[20px] mt-2 font-bold">
                                        {data?.payload?.tech_lang_keys["dec"]}:
                                      </div>
                                      <div className="mt-2 text-center">
                                        ={" "}
                                        {(
                                          result?.data?.tech_upr /
                                          result?.data?.tech_btm
                                        ).toFixed(10)}
                                      </div>
                                      <div className="text-[20px] mt-2 font-bold">
                                        {data?.payload?.tech_lang_keys[7]}:
                                      </div>
                                      <div className="col-12 overflow-auto mt-3">
                                        <table
                                          className="col-12"
                                          cellSpacing="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td>
                                                <FractionPainter
                                                  numerator={formData?.tech_N1}
                                                  denominator={
                                                    formData?.tech_D1
                                                  }
                                                  width={110}
                                                  height={110}
                                                />
                                              </td>
                                              <td className="font-s-32 px-3">
                                                <strong>
                                                  {formData?.tech_action}
                                                </strong>
                                              </td>
                                              <td>
                                                <FractionPainter
                                                  numerator={formData?.tech_N2}
                                                  denominator={
                                                    formData?.tech_D2
                                                  }
                                                  width={110}
                                                  height={110}
                                                />
                                              </td>
                                              <td className="font-s-32 px-3">
                                                <strong>=</strong>
                                              </td>
                                              <td>
                                                <FractionPainter
                                                  numerator={
                                                    result?.data?.tech_upr
                                                  }
                                                  denominator={
                                                    result?.data?.tech_btm
                                                  }
                                                  width={110}
                                                  height={110}
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </>
                                ) : formData?.tech_stype == "three_frac" ? (
                                  <>
                                    <div className="col-span-12 bg-sky-100 border rounded-[10px] text-[20px] px-3 py-2 mt-2">
                                      <BlockMath
                                        math={`\\dfrac{${formData?.tech_N1}}{${
                                          formData?.tech_D1
                                        }} ${formData?.tech_action} \\dfrac{${
                                          formData?.tech_N2
                                        }}{${
                                          formData?.tech_D2
                                        }} ${action1} \\dfrac{${
                                          formData?.tech_N3
                                        }}{${formData?.tech_D3}} = ${
                                          result?.data?.tech_btm != 1 &&
                                          result?.data?.tech_upr != 0
                                            ? `\\dfrac{${result?.data?.tech_upr}}{${result?.data?.tech_btm}}`
                                            : `${result?.data?.tech_upr}`
                                        }`}
                                      />
                                    </div>
                                    <div className="col-span-12 mt-2">
                                      <div className="text-[20px]">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["ex"]}:
                                        </strong>
                                      </div>
                                      {(formData?.tech_action == "+" ||
                                        formData?.tech_action == "-") &&
                                      (formData?.tech_action1 == "+" ||
                                        formData?.tech_action1 == "-") ? (
                                        <>
                                          {/* FractionInclude/three-add-sub.php */}
                                          <ThreeAddSub
                                            lang={data?.payload?.tech_lang_keys}
                                            formData={formData}
                                            result={result}
                                          />
                                        </>
                                      ) : (formData?.tech_action == "÷" ||
                                          formData?.tech_action == "×") &&
                                        (formData?.tech_action1 == "÷" ||
                                          formData?.tech_action1 == "×") ? (
                                        <>
                                          {/* FractionInclude/three-mul-div.php */}
                                          <ThreeMulDiv
                                            lang={data?.payload?.tech_lang_keys}
                                            formData={formData}
                                            result={result}
                                          />
                                        </>
                                      ) : (formData?.tech_action == "÷" ||
                                          formData?.tech_action == "×") &&
                                        (formData?.tech_action1 == "+" ||
                                          formData?.tech_action1 == "-") ? (
                                        <>
                                          {/* FractionInclude/three-mul-add.php */}
                                          <ThreeMulAdd
                                            lang={data?.payload?.tech_lang_keys}
                                            formData={formData}
                                            result={result}
                                          />
                                        </>
                                      ) : (formData?.tech_action1 == "÷" ||
                                          formData?.tech_action1 == "×") &&
                                        (formData?.tech_action == "+" ||
                                          formData?.tech_action == "-") ? (
                                        <>
                                          {/* FractionInclude/three-div-sub.php */}
                                          <ThreeDivSub
                                            lang={data?.payload?.tech_lang_keys}
                                            formData={formData}
                                            result={result}
                                          />
                                        </>
                                      ) : null}

                                      <div className="text-[20px] mt-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["dec"]}
                                          :
                                        </strong>
                                      </div>
                                      <div className="font-s-18 text-center mt-2">
                                        ={" "}
                                        {result?.data?.tech_upr /
                                          result?.data?.tech_btm}
                                      </div>
                                      <div className="text-[20px] mt-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[7]}:
                                        </strong>
                                      </div>
                                      <div className="col-12 overflow-auto mt-3">
                                        <table
                                          className="col-12"
                                          cellSpacing="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td>
                                                <FractionPainter
                                                  numerator={formData?.tech_N1}
                                                  denominator={
                                                    formData?.tech_D1
                                                  }
                                                  width={110}
                                                  height={110}
                                                />
                                              </td>
                                              <td className="font-s-32 px-3">
                                                <strong>
                                                  {formData?.tech_action}
                                                </strong>
                                              </td>
                                              <td>
                                                <FractionPainter
                                                  numerator={formData?.tech_N2}
                                                  denominator={
                                                    formData?.tech_D2
                                                  }
                                                  width={110}
                                                  height={110}
                                                />
                                              </td>
                                              <td className="font-s-32 px-3">
                                                <strong>=</strong>
                                              </td>
                                              <td>
                                                <FractionPainter
                                                  numerator={
                                                    result?.data?.tech_upr
                                                  }
                                                  denominator={
                                                    result?.data?.tech_btm
                                                  }
                                                  width={110}
                                                  height={110}
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </>
                                ) : formData?.tech_stype == "four_frac" ? (
                                  <>
                                    <div className="col-span-12 bg-sky-100 border rounded-lg text-[20px] px-3 py-2 mt-2">
                                      <BlockMath
                                        math={`\\dfrac{${formData?.tech_N1}}{${
                                          formData?.tech_D1
                                        }} ${formData?.tech_action} \\dfrac{${
                                          formData?.tech_N2
                                        }}{${formData?.tech_D2}} ${
                                          formData?.tech_action1
                                        } \\dfrac{${formData?.tech_N3}}{${
                                          formData?.tech_D3
                                        }} ${formData?.tech_action2} \\dfrac{${
                                          formData?.tech_N4
                                        }}{${formData?.tech_D4}} = ${
                                          result?.data?.tech_btm !== 1 &&
                                          result?.data?.tech_upr !== 0
                                            ? `\\dfrac{${result?.data?.tech_upr}}{${result?.data?.tech_btm}}`
                                            : `${result?.data?.tech_upr}`
                                        }`}
                                      />
                                    </div>
                                    {(formData?.tech_action == "+" ||
                                      formData?.tech_action == "-") &&
                                    (formData?.tech_action1 == "+" ||
                                      formData?.tech_action1 == "-") &&
                                    (formData?.tech_action2 == "+" ||
                                      formData?.tech_action2 == "-") ? (
                                      <>
                                        {/* Frac/four-add-sub-add.php */}
                                        <FourAddSubAdd
                                          lang={data?.payload?.tech_lang_keys}
                                          formData={formData}
                                          result={result}
                                        />
                                      </>
                                    ) : (formData?.tech_action == "÷" ||
                                        formData?.tech_action == "×") &&
                                      (formData?.tech_action1 == "÷" ||
                                        formData?.tech_action1 == "×") &&
                                      (formData?.tech_action2 == "÷" ||
                                        formData?.tech_action2 == "×") ? (
                                      <>
                                        {/* Frac/four-mul-div-mul.php */}
                                        <FourMulDivMul
                                          lang={data?.payload?.tech_lang_keys}
                                          formData={formData}
                                          result={result}
                                        />
                                      </>
                                    ) : (formData?.tech_action == "÷" ||
                                        formData?.tech_action == "×") &&
                                      (formData?.tech_action1 == "+" ||
                                        formData?.tech_action1 == "-") &&
                                      (formData?.tech_action2 == "+" ||
                                        formData?.tech_action2 == "-") ? (
                                      <>
                                        {/* Frac/four-mul-sub-add.php */}
                                        <FourMulSubAdd
                                          lang={data?.payload?.tech_lang_keys}
                                          formData={formData}
                                          result={result}
                                        />
                                      </>
                                    ) : (formData?.tech_action == "+" ||
                                        formData?.tech_action == "-") &&
                                      (formData?.tech_action1 == "÷" ||
                                        formData?.tech_action1 == "×") &&
                                      (formData?.tech_action2 == "+" ||
                                        formData?.tech_action2 == "-") ? (
                                      <>
                                        {/* Frac/four-add-mul-sub.php */}
                                        <FourAddMulSub
                                          lang={data?.payload?.tech_lang_keys}
                                          formData={formData}
                                          result={result}
                                        />
                                      </>
                                    ) : (formData?.tech_action == "+" ||
                                        formData?.tech_action == "-") &&
                                      (formData?.tech_action1 == "+" ||
                                        formData?.tech_action1 == "-") &&
                                      (formData?.tech_action2 == "÷" ||
                                        formData?.tech_action2 == "×") ? (
                                      <>
                                        {/* Frac/four-add-sub-mul.php */}
                                        <FourAddSubMul
                                          lang={data?.payload?.tech_lang_keys}
                                          formData={formData}
                                          result={result}
                                        />
                                      </>
                                    ) : (formData?.tech_action == "÷" ||
                                        formData?.tech_action == "×") &&
                                      (formData?.tech_action1 == "÷" ||
                                        formData?.tech_action1 == "×") &&
                                      (formData?.tech_action2 == "+" ||
                                        formData?.tech_action2 == "-") ? (
                                      <>
                                        {/* Frac/four-mul-div-add.php */}
                                        <FourMulDivAdd
                                          lang={data?.payload?.tech_lang_keys}
                                          formData={formData}
                                          result={result}
                                        />
                                      </>
                                    ) : (formData?.tech_action == "÷" ||
                                        formData?.tech_action == "×") &&
                                      (formData?.tech_action1 == "+" ||
                                        formData?.tech_action1 == "-") &&
                                      (formData?.tech_action2 == "÷" ||
                                        formData?.tech_action2 == "×") ? (
                                      <>
                                        {/* Frac/four-mul-add-div.php */}
                                        <FourMulAddDiv
                                          lang={data?.payload?.tech_lang_keys}
                                          formData={formData}
                                          result={result}
                                        />
                                      </>
                                    ) : (formData?.tech_action == "+" ||
                                        formData?.tech_action == "-") &&
                                      (formData?.tech_action1 == "÷" ||
                                        formData?.tech_action1 == "×") &&
                                      (formData?.tech_action2 == "÷" ||
                                        formData?.tech_action2 == "×") ? (
                                      <>
                                        {/* Frac/four-add-mul-div.php */}
                                        <FourAddMulDiv
                                          lang={data?.payload?.tech_lang_keys}
                                          formData={formData}
                                          result={result}
                                        />
                                      </>
                                    ) : null}
                                  </>
                                ) : (
                                  <>
                                    <div className="col-span-12 text-[16px]">
                                      <div className="mt-2 text-[18px]">
                                        <BlockMath
                                          math={`${
                                            formData?.tech_ne1 || ""
                                          } \\dfrac{${formData?.tech_neo2}}{${
                                            formData?.tech_du1
                                          }} = \\dfrac{${
                                            result?.data?.tech_pr
                                          }}{${result?.data?.tech_btm}}`}
                                        />
                                      </div>

                                      <div className="mt-2 font-bold">
                                        {data?.payload?.tech_lang_keys["ex"]}:
                                      </div>

                                      <div className="mt-2">
                                        {data?.payload?.tech_lang_keys["input"]}
                                        :
                                        <InlineMath
                                          math={`${
                                            formData?.tech_ne1 || ""
                                          } \\dfrac{${formData?.tech_neo2}}{${
                                            formData?.tech_du1
                                          }}`}
                                        />
                                      </div>

                                      <div className="mt-2">
                                        {data?.payload?.tech_lang_keys["step"]}{" "}
                                        #1:
                                        <BlockMath
                                          math={`= \\dfrac{${result?.data?.tech_totalN}}{${result?.data?.tech_totalD}}`}
                                        />
                                      </div>

                                      <div className="mt-2">
                                        {data?.payload?.tech_lang_keys["step"]}{" "}
                                        #2:
                                        <BlockMath
                                          math={`= \\dfrac{${result?.data?.tech_totalN} \\div ${result?.data?.tech_g}}{${result?.data?.tech_totalD} \\div ${result?.data?.tech_g}}`}
                                        />
                                      </div>

                                      {result?.data?.tech_btm == "1" ? (
                                        <div className="mt-2">
                                          {data?.payload?.tech_lang_keys["an"]}{" "}
                                          = {result?.data?.tech_pr}
                                        </div>
                                      ) : (
                                        <div className="mt-2">
                                          {data?.payload?.tech_lang_keys["an"]}
                                          <BlockMath
                                            math={`= \\dfrac{${result?.data?.tech_pr}}{${result?.data?.tech_btm}}`}
                                          />
                                        </div>
                                      )}

                                      {parseInt(result?.data?.tech_pr) >
                                        parseInt(result?.data?.tech_btm) &&
                                        result?.data?.tech_btm != "1" &&
                                        (() => {
                                          const shi = Math.floor(
                                            result?.data?.tech_pr /
                                              result?.data?.tech_btm
                                          );
                                          const bta =
                                            result?.data?.tech_pr %
                                            result?.data?.tech_btm;
                                          return (
                                            <div className="mt-2">
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "or"
                                                ]
                                              }
                                              <BlockMath
                                                math={`= ${shi} \\dfrac{${bta}}{${result?.data?.tech_btm}}`}
                                              />
                                            </div>
                                          );
                                        })()}

                                      {result?.data?.tech_btm != "1" && (
                                        <div className="mt-2">
                                          {data?.payload?.tech_lang_keys["dec"]}{" "}
                                          ={" "}
                                          {parseFloat(
                                            result?.data?.tech_pr /
                                              result?.data?.tech_btm
                                          ).toFixed(1)}
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="col-12 text-[16px]">
                                <div className="mt-3 text-[21px] font-bold">
                                  <InlineMath
                                    math={`
                                ${formData?.tech_s1 || ""} \\frac{${
                                      formData?.tech_nu1
                                    }}{${formData?.tech_de1}} 
                                ${formData?.tech_actions} 
                                ${formData?.tech_s2 || ""} \\frac{${
                                      formData?.tech_nu2
                                    }}{${formData?.tech_de2}} 
                                = \\frac{${result?.tech_upr}}{${
                                      result?.tech_btm
                                    }}
                              `}
                                  />
                                </div>

                                <div className="mt-3">
                                  {data?.payload?.tech_lang_keys["ex"]}:
                                </div>
                                <div className="mt-3">
                                  {data?.payload?.tech_lang_keys["input"]}:
                                  <InlineMath
                                    math={`
                                ${formData?.tech_s1 || ""} \\frac{${
                                      formData?.tech_nu1
                                    }}{${formData?.tech_de1}} 
                                ${formData?.tech_actions} 
                                ${formData?.tech_s2 || ""} \\frac{${
                                      formData?.tech_nu2
                                    }}{${formData?.tech_de2}}
                              `}
                                  />
                                </div>

                                {(isFinite(formData?.tech_s1) ||
                                  isFinite(formData?.tech_s2)) && (
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["step"]} #1 :
                                    <InlineMath
                                      math={`
                                  \\frac{${result?.tech_N1}}{${result?.tech_D1}} 
                                  ${formData?.tech_actions} 
                                  \\frac{${result?.tech_N2}}{${result?.tech_D2}}
                                `}
                                    />
                                  </div>
                                )}

                                {formData?.tech_actions == "×" ? (
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["step"]} #2 =
                                    <InlineMath
                                      math={`
                                  \\frac{${result?.tech_N1} \\times ${result?.tech_N2}}{${result?.tech_D1} \\times ${result?.tech_D2}}
                                `}
                                    />
                                  </div>
                                ) : formData?.tech_actions == "÷" ? (
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["step"]} #2 =
                                    <InlineMath
                                      math={`
                                  \\frac{${result?.tech_N1} \\times ${result?.tech_D2}}{${result?.tech_N2} \\times ${result?.tech_D1}}
                                `}
                                    />
                                  </div>
                                ) : (
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["step"]} #2 =
                                    <InlineMath
                                      math={`
                                  \\frac{${result?.tech_N1} \\times ${result?.tech_D2} ${formData?.tech_actions} ${result?.tech_N2} \\times ${result?.tech_D1}}{${result?.tech_D1} \\times ${result?.tech_D2}}
                                `}
                                    />
                                  </div>
                                )}

                                <div className="mt-3">
                                  {data?.payload?.tech_lang_keys["step"]} #3 =
                                  <InlineMath
                                    math={`\\frac{${result?.tech_totalN}}{${result?.tech_totalD}}`}
                                  />
                                </div>

                                <div className="mt-3">
                                  {data?.payload?.tech_lang_keys["step"]} #4 =
                                  <InlineMath
                                    math={`\\frac{${result?.tech_totalN} \\div ${result?.tech_g}}{${result?.tech_totalD} \\div ${result?.tech_g}}`}
                                  />
                                </div>

                                {result?.tech_btm == "1" ? (
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["an"]} =
                                    <InlineMath math={`${result?.tech_upr}`} />
                                  </div>
                                ) : (
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["an"]} =
                                    <InlineMath
                                      math={`\\frac{${result?.tech_upr}}{${result?.tech_btm}}`}
                                    />
                                  </div>
                                )}

                                {result?.tech_upr > result?.tech_btm &&
                                  result?.tech_btm != "1" && (
                                    <div className="mt-3">
                                      {data?.payload?.tech_lang_keys["or"]} =
                                      {Math.floor(
                                        result?.tech_upr / result?.tech_btm
                                      )}
                                      <InlineMath
                                        math={`\\frac{${
                                          result?.tech_upr % result?.tech_btm
                                        }}{${result?.tech_btm}}`}
                                      />
                                    </div>
                                  )}

                                {result?.tech_btm != "1" && (
                                  <div className="mt-3">
                                    {data?.payload?.tech_lang_keys["dec"]}:{" "}
                                    {Number(
                                      result?.tech_upr / result?.tech_btm
                                    ).toFixed(4)}
                                  </div>
                                )}
                              </div>
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

export default FractionCalculator;

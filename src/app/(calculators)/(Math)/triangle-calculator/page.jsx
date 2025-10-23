"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTriangleCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TriangleCalculator = () => {
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
    tech_a: "5",
    tech_b: "13",
    tech_c: "",
    tech_A: "",
    tech_B: "",
    tech_C: "45",
    tech_unit: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTriangleCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_unit) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_c: formData.tech_c,
        tech_A: formData.tech_A,
        tech_B: formData.tech_B,
        tech_C: formData.tech_C,
        tech_unit: formData.tech_unit,
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
      tech_a: "5",
      tech_b: "13",
      tech_c: "",
      tech_A: "",
      tech_B: "",
      tech_C: "45",
      tech_unit: "1",
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

  const round = (val, decimals = 5) => parseFloat(val).toFixed(decimals);

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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <p className="col-span-12 text-center my-3">
                Input 3 values containing at least one side to the following six
                (6) fields.
              </p>
              <div className="col-span-12 md:col-span-6">
                <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-6">
                    <label htmlFor="tech_a" className="label">
                      {" "}
                      a:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_a"
                        id="tech_a"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_a}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_b" className="label">
                      {" "}
                      b:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_b"
                        id="tech_b"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_b}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_c" className="label">
                      {" "}
                      c:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_c"
                        id="tech_c"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_c}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_A" className="label">
                      {" "}
                      c:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_A"
                        id="tech_A"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_A}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_B" className="label">
                      {" "}
                      B:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_B"
                        id="tech_B"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_B}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_C" className="label">
                      {" "}
                      C:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_C"
                        id="tech_C"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_C}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="tech_unit" className="label">
                      Angle in:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_unit"
                        id="tech_unit"
                        value={formData.tech_unit}
                        onChange={handleChange}
                      >
                        <option value="1">deg ° </option>
                        <option value="2">rad</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="w-full text-center mt-2 flex justify-center">
                  <img
                    src="/images/new_tri.png"
                    height="200"
                    width="200px"
                    alt="triangle image"
                    loading="lazy"
                    decoding="async"
                  />
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["6"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_area}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["8"]} P
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_peri}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["7"]} s
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_semi}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["9"]} h
                                    <sub className="font-s-14">a</sub>
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_ha}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["9"]} h
                                    <sub className="font-s-14">b</sub>
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_hb}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["9"]} h
                                    <sub className="font-s-14">c</sub>
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_hc}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["10"]} m
                                    <sub className="font-s-14">a</sub>
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_ma}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["10"]} m
                                    <sub className="font-s-14">b</sub>
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_mb}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["10"]} m
                                    <sub className="font-s-14">c</sub>
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_mc}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["11"]} r
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_inr}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["12"]} R
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_circ}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["3"]}:
                            </strong>
                          </p>
                          {result?.tech_comb == 1 ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["14"]}
                              </p>
                              {/* Angle A */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = \\cos^{-1}\\left(\\frac{b^2 + c^2 - a^2}{2bc}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = \\cos^{-1}\\left(\\frac{${result?.tech_b}^2 + ${result?.tech_c}^2 - ${result?.tech_a}^2}{2 \\times ${result?.tech_b} \\times ${result?.tech_c}}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = ${round(
                                    result?.tech_Ar
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Ad
                                  )}^\\circ = ${result?.tech_At?.deg}^\\circ ${
                                    result?.tech_At?.min
                                  }' ${result?.tech_At?.sec}''`}
                                />
                              </p>

                              {/* Angle B */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = \\cos^{-1}\\left(\\frac{a^2 + c^2 - b^2}{2ac}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = \\cos^{-1}\\left(\\frac{${result?.tech_a}^2 + ${result?.tech_c}^2 - ${result?.tech_b}^2}{2 \\times ${result?.tech_a} \\times ${result?.tech_c}}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = ${round(
                                    result?.tech_Br
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Bd
                                  )}^\\circ = ${result?.tech_Bt?.deg}^\\circ ${
                                    result?.tech_Bt?.min
                                  }' ${result?.tech_Bt?.sec}''`}
                                />
                              </p>

                              {/* Angle C */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle C = \\cos^{-1}\\left(\\frac{a^2 + b^2 - c^2}{2ab}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle C = \\cos^{-1}\\left(\\frac{${result?.tech_a}^2 + ${result?.tech_b}^2 - ${result?.tech_c}^2}{2 \\times ${result?.tech_a} \\times ${result?.tech_b}}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle C = ${round(
                                    result?.tech_Cr
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Cd
                                  )}^\\circ = ${result?.tech_Ct?.deg}^\\circ ${
                                    result?.tech_Ct?.min
                                  }' ${result?.tech_Ct?.sec}''`}
                                />
                              </p>
                            </>
                          ) : result?.tech_comb == 2 ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["13"]}.
                              </p>
                              {/* Angle B via sine rule */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = \\sin^{-1}\\left(\\frac{b \\cdot \\sin(A)}{a}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = \\sin^{-1}\\left(\\frac{${
                                    result?.tech_b
                                  } \\cdot \\sin(${round(result?.tech_Ar)})}{${
                                    result?.tech_a
                                  }}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = ${round(
                                    result?.tech_Br
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Bd
                                  )}^\\circ = ${result?.tech_Bt?.deg}^\\circ ${
                                    result?.tech_Bt?.min
                                  }' ${result?.tech_Bt?.sec}''`}
                                />
                              </p>

                              {/* Angle C from angle sum */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle C = 180^\\circ - A - B`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle C = ${round(
                                    result?.tech_Cr
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Cd
                                  )}^\\circ = ${result?.tech_Ct?.deg}^\\circ ${
                                    result?.tech_Ct?.min
                                  }' ${result?.tech_Ct?.sec}''`}
                                />
                              </p>

                              {/* Side c using sine rule */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{a \\cdot \\sin(C)}{\\sin(A)}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{${
                                    result?.tech_a
                                  } \\cdot \\sin(${round(
                                    result?.tech_Cr
                                  )})}{\\sin(${round(result?.tech_Ar)})}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath math={`c = ${result?.tech_c}`} />
                              </p>
                            </>
                          ) : result?.tech_comb == 3 ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["15"]}.
                              </p>

                              {/* Angle A calculation */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = \\sin^{-1}\\left(\\frac{a \\cdot \\sin(B)}{b}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = \\sin^{-1}\\left(\\frac{${
                                    result?.tech_a
                                  } \\cdot \\sin(${round(result?.tech_Br)})}{${
                                    result?.tech_b
                                  }}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = ${round(
                                    result?.tech_Ar
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Ad
                                  )}^\\circ = ${result?.tech_At?.deg}^\\circ ${
                                    result?.tech_At?.min
                                  }' ${result?.tech_At?.sec}''`}
                                />
                              </p>

                              {/* Angle C by subtraction */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle C = 180^\\circ - A - B`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle C = ${round(
                                    result?.tech_Cr
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Cd
                                  )}^\\circ = ${result?.tech_Ct?.deg}^\\circ ${
                                    result?.tech_Ct?.min
                                  }' ${result?.tech_Ct?.sec}''`}
                                />
                              </p>

                              {/* Side c using sine rule */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{b \\cdot \\sin(C)}{\\sin(B)}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{${
                                    result?.tech_b
                                  } \\cdot \\sin(${round(
                                    result?.tech_Cr
                                  )})}{\\sin(${round(result?.tech_Br)})}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath math={`c = ${result?.tech_c}`} />
                              </p>
                            </>
                          ) : result?.tech_comb == 4 ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["16"]}.
                              </p>
                              {/* Side c calculation */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\sqrt{b^2 + a^2 - 2ba \\cdot \\cos(C)}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\sqrt{${result?.tech_b}^2 + ${
                                    result?.tech_a
                                  }^2 - 2 \\cdot ${result?.tech_b} \\cdot ${
                                    result?.tech_a
                                  } \\cdot \\cos(${round(result?.tech_Cr)})}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath math={`c = ${result?.tech_c}`} />
                              </p>

                              {/* Angle A using cosine rule */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = \\cos^{-1}\\left(\\frac{c^2 + b^2 - a^2}{2cb}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = \\cos^{-1}\\left(\\frac{${result?.tech_c}^2 + ${result?.tech_b}^2 - ${result?.tech_a}^2}{2 \\cdot ${result?.tech_c} \\cdot ${result?.tech_b}}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = ${round(
                                    result?.tech_Ar
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Ad
                                  )}^\\circ = ${result?.tech_At?.deg}^\\circ ${
                                    result?.tech_At?.min
                                  }' ${result?.tech_At?.sec}''`}
                                />
                              </p>

                              {/* Angle B using cosine rule */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = \\cos^{-1}\\left(\\frac{c^2 + a^2 - b^2}{2ca}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = \\cos^{-1}\\left(\\frac{${result?.tech_c}^2 + ${result?.tech_a}^2 - ${result?.tech_b}^2}{2 \\cdot ${result?.tech_c} \\cdot ${result?.tech_a}}\\right)`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = ${round(
                                    result?.tech_Br
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Bd
                                  )}^\\circ = ${result?.tech_Bt?.deg}^\\circ ${
                                    result?.tech_Bt?.min
                                  }' ${result?.tech_Bt?.sec}''`}
                                />
                              </p>
                            </>
                          ) : result?.tech_comb == 5 ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["17"]}.
                              </p>
                              {/* Angle C */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle C = 180^\\circ - A - B`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle C = ${round(
                                    result?.tech_Cr
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Cd
                                  )}^\\circ = ${result?.tech_Ct?.deg}^\\circ ${
                                    result?.tech_Ct?.min
                                  }' ${result?.tech_Ct?.sec}''`}
                                />
                              </p>

                              {/* Side b using sine rule */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`b = \\frac{a \\cdot \\sin(B)}{\\sin(A)}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`b = \\frac{${
                                    result?.tech_a
                                  } \\cdot \\sin(${round(
                                    result?.tech_Br
                                  )})}{\\sin(${round(result?.tech_Ar)})}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath math={`b = ${result?.tech_b}`} />
                              </p>

                              {/* Side c using sine rule */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{a \\cdot \\sin(C)}{\\sin(A)}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{${
                                    result?.tech_a
                                  } \\cdot \\sin(${round(
                                    result?.tech_Cr
                                  )})}{\\sin(${round(result?.tech_Ar)})}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath math={`c = ${result?.tech_c}`} />
                              </p>
                            </>
                          ) : result?.tech_comb == 6 ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["17"]}.
                              </p>

                              {/* Angle C */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle C = 180^\\circ - A - B`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle C = ${round(
                                    result?.tech_Cr
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Cd
                                  )}^\\circ = ${result?.tech_Ct?.deg}^\\circ ${
                                    result?.tech_Ct?.min
                                  }' ${result?.tech_Ct?.sec}''`}
                                />
                              </p>

                              {/* Side a using sine rule */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`a = \\frac{b \\cdot \\sin(A)}{\\sin(B)}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`a = \\frac{${
                                    result?.tech_b
                                  } \\cdot \\sin(${round(
                                    result?.tech_Ar
                                  )})}{\\sin(${round(result?.tech_Br)})}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath math={`a = ${result?.tech_a}`} />
                              </p>

                              {/* Side c using sine rule */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{b \\cdot \\sin(C)}{\\sin(B)}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{${
                                    result?.tech_b
                                  } \\cdot \\sin(${round(
                                    result?.tech_Cr
                                  )})}{\\sin(${round(result?.tech_Br)})}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath math={`c = ${result?.tech_c}`} />
                              </p>
                            </>
                          ) : result?.tech_comb == 7 ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["17"]}.
                              </p>

                              {/* Angle C */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle C = 180^\\circ - A - B`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle C = ${round(
                                    result?.tech_Cr
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Cd
                                  )}^\\circ = ${result?.tech_Ct?.deg}^\\circ ${
                                    result?.tech_Ct?.min
                                  }' ${result?.tech_Ct?.sec}''`}
                                />
                              </p>

                              {/* Side a using sine rule */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`a = \\frac{c \\cdot \\sin(A)}{\\sin(C)}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`a = \\frac{${
                                    result?.tech_c
                                  } \\cdot \\sin(${round(
                                    result?.tech_Ar
                                  )})}{\\sin(${round(result?.tech_Cr)})}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath math={`a = ${result?.tech_a}`} />
                              </p>

                              {/* Side c again using sine rule */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{c \\cdot \\sin(B)}{\\sin(C)}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{${
                                    result?.tech_c
                                  } \\cdot \\sin(${round(
                                    result?.tech_Br
                                  )})}{\\sin(${round(result?.tech_Cr)})}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath math={`c = ${result?.tech_c}`} />
                              </p>
                            </>
                          ) : result?.tech_comb == 8 ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["17"]}.
                              </p>

                              {/* Angle B Calculation */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = 180^\\circ - A - C`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = ${round(
                                    result?.tech_Br
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Bd
                                  )}^\\circ = ${result?.tech_Bt?.deg}^\\circ ${
                                    result?.tech_Bt?.min
                                  }' ${result?.tech_Bt?.sec}''`}
                                />
                              </p>

                              {/* Side b using Law of Sines */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`b = \\frac{a \\cdot \\sin(B)}{\\sin(A)}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`b = \\frac{${
                                    result?.tech_a
                                  } \\cdot \\sin(${round(
                                    result?.tech_Br
                                  )})}{\\sin(${round(result?.tech_Ar)})}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath math={`b = ${result?.tech_b}`} />
                              </p>

                              {/* Side c using Law of Sines */}
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{a \\cdot \\sin(C)}{\\sin(A)}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{${
                                    result?.tech_a
                                  } \\cdot \\sin(${round(
                                    result?.tech_Cr
                                  )})}{\\sin(${round(result?.tech_Ar)})}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath math={`c = ${result?.tech_c}`} />
                              </p>
                            </>
                          ) : result?.tech_comb == 9 ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["17"]}.
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = 180^\\circ - A - C`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = ${round(
                                    result?.tech_Br,
                                    5
                                  )}\\ \\text{rad} = ${round(
                                    result?.tech_Bd,
                                    5
                                  )}^\\circ = ${result?.tech_Bt?.deg}^\\circ ${
                                    result?.tech_Bt?.min
                                  }' ${result?.tech_Bt?.sec}''`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`a = \\frac{b \\times \\sin(A)}{\\sin(B)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`a = \\frac{${
                                    result?.tech_b
                                  } \\times \\sin(${round(
                                    result?.tech_Ar,
                                    5
                                  )})}{\\sin(${round(result?.tech_Br, 5)})}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath math={`a = ${result?.tech_a}`} />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{b \\times \\sin(C)}{\\sin(B)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{${
                                    result?.tech_b
                                  } \\times \\sin(${round(
                                    result?.tech_Cr,
                                    5
                                  )})}{\\sin(${round(result?.tech_Br, 5)})}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath math={`c = ${result?.tech_c}`} />
                              </p>
                            </>
                          ) : result?.tech_comb == 10 ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["17"]}.
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = 180^\\circ - A - C`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle B = ${round(
                                    result?.tech_Br,
                                    5
                                  )} \\text{ rad } = ${round(
                                    result?.tech_Bd,
                                    5
                                  )}^\\circ = ${result?.tech_Bt?.deg}^\\circ ${
                                    result?.tech_Bt?.min
                                  }' ${result?.tech_Bt?.sec}''`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`a = \\frac{c \\times \\sin(A)}{\\sin(C)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`a = \\frac{${
                                    result?.tech_c
                                  } \\times \\sin(${round(
                                    result?.tech_Ar,
                                    5
                                  )})}{\\sin(${round(result?.tech_Cr, 5)})}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath math={`a = ${result?.tech_a}`} />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`b = \\frac{c \\times \\sin(B)}{\\sin(C)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`b = \\frac{${
                                    result?.tech_c
                                  } \\times \\sin(${round(
                                    result?.tech_Br,
                                    5
                                  )})}{\\sin(${round(result?.tech_Cr, 5)})}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath math={`b = ${result?.tech_b}`} />
                              </p>
                            </>
                          ) : result?.tech_comb == 11 ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["17"]}.
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = 180^\\circ - B - C`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = ${round(
                                    result?.tech_Ar,
                                    5
                                  )} \\text{ rad } = ${round(
                                    result?.tech_Ad,
                                    5
                                  )}^\\circ = ${result?.tech_At?.deg}^\\circ ${
                                    result?.tech_At?.min
                                  }' ${result?.tech_At?.sec}''`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`b = \\frac{a \\times \\sin(B)}{\\sin(A)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`b = \\frac{${
                                    result?.tech_a
                                  } \\times \\sin(${round(
                                    result?.tech_Br,
                                    5
                                  )})}{\\sin(${round(result?.tech_Ar, 5)})}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath math={`b = ${result?.tech_b}`} />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{a \\times \\sin(C)}{\\sin(A)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{${
                                    result?.tech_a
                                  } \\times \\sin(${round(
                                    result?.tech_Cr,
                                    5
                                  )})}{\\sin(${round(result?.tech_Ar, 5)})}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath math={`c = ${result?.tech_c}`} />
                              </p>
                            </>
                          ) : result?.tech_comb == 12 ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["17"]}.
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = 180^\\circ - B - C`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = ${round(
                                    result?.tech_Ar,
                                    5
                                  )} \\text{ rad } = ${round(
                                    result?.tech_Ad,
                                    5
                                  )}^\\circ = ${result?.tech_At?.deg}^\\circ ${
                                    result?.tech_At?.min
                                  }' ${result?.tech_At?.sec}''`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`a = \\frac{b \\times \\sin(A)}{\\sin(B)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`a = \\frac{${
                                    result?.tech_b
                                  } \\times \\sin(${round(
                                    result?.tech_Ar,
                                    5
                                  )})}{\\sin(${round(result?.tech_Br, 5)})}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath math={`a = ${result?.tech_a}`} />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{b \\times \\sin(C)}{\\sin(B)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{${
                                    result?.tech_b
                                  } \\times \\sin(${round(
                                    result?.tech_Cr,
                                    5
                                  )})}{\\sin(${round(result?.tech_Br, 5)})}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath math={`c = ${result?.tech_c}`} />
                              </p>
                            </>
                          ) : result?.tech_comb == 13 ? (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["17"]}.
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = 180^\\circ - B - C`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\angle A = ${round(
                                    result?.tech_Ar,
                                    5
                                  )} \\text{ rad } = ${round(
                                    result?.tech_Ad,
                                    5
                                  )}^\\circ = ${
                                    result?.tech_At?.deg ?? ""
                                  }^\\circ ${result?.tech_At?.min ?? ""}' ${
                                    result?.tech_At?.sec ?? ""
                                  }''`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`a = \\frac{c \\times \\sin(A)}{\\sin(C)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`a = \\frac{${
                                    result?.tech_c
                                  } \\times \\sin(${round(
                                    result?.tech_Ar,
                                    5
                                  )})}{\\sin(${round(result?.tech_Cr, 5)})}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath math={`a = ${result?.tech_a}`} />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`b = \\frac{c \\times \\sin(B)}{\\sin(C)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`b = \\frac{${
                                    result?.tech_c
                                  } \\times \\sin(${round(
                                    result?.tech_Br,
                                    5
                                  )})}{\\sin(${round(result?.tech_Cr, 5)})}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath math={`b = ${result?.tech_b}`} />
                              </p>
                            </>
                          ) : null}
                          <p className="mt-3">
                            <InlineMath
                              math={`${data?.payload?.tech_lang_keys["6"]} = \\frac{ab \\cdot \\sin(C)}{2}`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`${
                                data?.payload?.tech_lang_keys["6"]
                              } = \\frac{${result?.tech_a} \\times ${
                                result?.tech_b
                              } \\cdot \\sin(${round(
                                result?.tech_Cr,
                                5
                              )})}{2} = ${result?.tech_area}`}
                            />
                          </p>

                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["8"]}} p = a + b + c`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["8"]}} p = ${result?.tech_a} + ${result?.tech_b} + ${result?.tech_c} = ${result?.tech_peri}`}
                            />
                          </p>

                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["7"]}} s = \\frac{a + b + c}{2}`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["7"]}} s = \\frac{${result?.tech_a} + ${result?.tech_b} + ${result?.tech_c}}{2} = ${result?.tech_semi}`}
                            />
                          </p>

                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["9"]}} h_a = \\frac{2 \\times \\text{Area}}{a}`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["9"]}} h_a = \\frac{2 \\times ${result?.tech_area}}{${result?.tech_a}} = ${result?.tech_ha}`}
                            />
                          </p>

                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["9"]}} h_b = \\frac{2 \\times \\text{Area}}{b}`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["9"]}} h_b = \\frac{2 \\times ${result?.tech_area}}{${result?.tech_b}} = ${result?.tech_hb}`}
                            />
                          </p>

                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["9"]}} h_c = \\frac{2 \\times \\text{Area}}{c}`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["9"]}} h_c = \\frac{2 \\times ${result?.tech_area}}{${result?.tech_c}} = ${result?.tech_hc}`}
                            />
                          </p>

                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["10"]}} m_a = \\sqrt{\\left(\\frac{a}{2}\\right)^2 + c^2 - ac \\cdot \\cos(B)}`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${
                                data?.payload?.tech_lang_keys["10"]
                              }} m_a = \\sqrt{\\left(\\frac{${
                                result?.tech_a
                              }}{2}\\right)^2 + ${result?.tech_c}^2 - ${
                                result?.tech_a
                              } \\times ${result?.tech_c} \\cdot \\cos(${round(
                                result?.tech_Br,
                                5
                              )})} = ${result?.tech_ma}`}
                            />
                          </p>

                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["10"]}} m_b = \\sqrt{\\left(\\frac{b}{2}\\right)^2 + a^2 - ab \\cdot \\cos(C)}`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${
                                data?.payload?.tech_lang_keys["10"]
                              }} m_b = \\sqrt{\\left(\\frac{${
                                result?.tech_b
                              }}{2}\\right)^2 + ${result?.tech_a}^2 - ${
                                result?.tech_a
                              } \\times ${result?.tech_b} \\cdot \\cos(${round(
                                result?.tech_Cr,
                                5
                              )})} = ${result?.tech_mb}`}
                            />
                          </p>

                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["10"]}} m_c = \\sqrt{\\left(\\frac{c}{2}\\right)^2 + b^2 - bc \\cdot \\cos(A)}`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${
                                data?.payload?.tech_lang_keys["10"]
                              }} m_c = \\sqrt{\\left(\\frac{${
                                result?.tech_c
                              }}{2}\\right)^2 + ${result?.tech_b}^2 - ${
                                result?.tech_b
                              } \\times ${result?.tech_c} \\cdot \\cos(${round(
                                result?.tech_Ar,
                                5
                              )})} = ${result?.tech_mc}`}
                            />
                          </p>

                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["11"]}} r = \\frac{\\text{area}}{s} = \\frac{${result?.tech_area}}{${result?.tech_semi}} = ${result?.tech_inr}`}
                            />
                          </p>

                          <p className="mt-3">
                            <InlineMath
                              math={`\\text{${
                                data?.payload?.tech_lang_keys["12"]
                              }} R = \\frac{a}{2 \\times \\sin(A)} = \\frac{${
                                result?.tech_a
                              }}{2 \\times \\sin(${round(
                                result?.tech_Ar,
                                5
                              )})} = ${result?.tech_circ}`}
                            />
                          </p>

                          {result?.tech_comb == 2 && result?.tech_comb2 && (
                            <>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["2"]} 2
                              </p>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["5"]} a ={" "}
                                {result?.tech_a}
                              </p>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["5"]} b ={" "}
                                {result?.tech_b}
                              </p>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["5"]} c ={" "}
                                {round(result?.tech_c1, 5)}
                              </p>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["4"]} ∠A ={" "}
                                {round(result?.tech_Ar, 5)} rad ={" "}
                                {round(result?.tech_Ad, 5)}° ={" "}
                                {`${result?.tech_At["deg"]}°${result?.tech_At["min"]}'${result?.tech_At["sec"]}"`}
                              </p>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["4"]} ∠B ={" "}
                                {round(result?.tech_Br1, 5)} rad ={" "}
                                {round(result?.tech_Bd1, 5)}° ={" "}
                                {`${result?.tech_Bt1["deg"]}°${result?.tech_Bt1["min"]}'${result?.tech_Bt1["sec"]}"`}
                              </p>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["4"]} ∠C ={" "}
                                {round(result?.tech_Cr1, 5)} rad ={" "}
                                {round(result?.tech_Cd1, 5)}° ={" "}
                                {`${result?.tech_Ct1["deg"]}°${result?.tech_Ct1["min"]}'${result?.tech_Ct1["sec"]}"`}
                              </p>

                              <div className="col-12 mt-3 overflow-auto">
                                <table className="col-6 mx-auto text-[16px]">
                                  <tbody>
                                    <tr>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys["6"]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_area1}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys["8"]} p
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_peri1}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys["7"]} s
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_semi1}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys["9"]} h
                                        <sub className="font-s-14">a</sub>
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_ha1}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys["9"]} h
                                        <sub className="font-s-14">b</sub>
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_hb1}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys["9"]} h
                                        <sub className="font-s-14">c</sub>
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_hc1}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys["10"]} m
                                        <sub className="font-s-14">a</sub>
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_ma1}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys["10"]} m
                                        <sub className="font-s-14">b</sub>
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_mb1}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys["10"]} m
                                        <sub className="font-s-14">c</sub>
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_mc1}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys["11"]} r
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_inr1}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys["12"]} R
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_circ1}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["13"]}.
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`∠B = 180° - \\sin^{-1}\\left(\\frac{b \\times \\sin(A)}{a}\\right)`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`∠B = 180° - \\sin^{-1}\\left(\\frac{${
                                    result?.tech_b
                                  } \\times \\sin(${round(
                                    result?.tech_Ar,
                                    5
                                  )})}{${result?.tech_a}}\\right)`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`∠B = ${round(
                                    result?.tech_Br1,
                                    5
                                  )} \\text{ rad } = ${round(
                                    result?.tech_Bd1,
                                    5
                                  )}° = ${result?.tech_Bt1["deg"]}°${
                                    result?.tech_Bt1["min"]
                                  }'${result?.tech_Bt1["sec"]}"`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath math={`∠C = 180° - A - B`} />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`∠C = ${round(
                                    result?.tech_Cr1,
                                    5
                                  )} \\text{ rad } = ${round(
                                    result?.tech_Cd1,
                                    5
                                  )}° = ${result?.tech_Ct1["deg"]}°${
                                    result?.tech_Ct1["min"]
                                  }'${result?.tech_Ct1["sec"]}"`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{a \\times \\sin(C)}{\\sin(A)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`c = \\frac{${
                                    result?.tech_a
                                  } \\times \\sin(${round(
                                    result?.tech_Cr1,
                                    5
                                  )})}{\\sin(${round(result?.tech_Ar, 5)})}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`c = ${round(result?.tech_c1, 5)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`${data?.payload?.tech_lang_keys["6"]} = \\frac{a b \\times \\sin(C)}{2}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`${
                                    data?.payload?.tech_lang_keys["6"]
                                  } = \\frac{${result?.tech_a} \\times ${
                                    result?.tech_b
                                  } \\times \\sin(${round(
                                    result?.tech_Cr1,
                                    5
                                  )})}{2} = ${result?.tech_area1}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${data?.payload?.tech_lang_keys["8"]} p} = a + b + c`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${
                                    data?.payload?.tech_lang_keys["8"]
                                  } p} = ${result?.tech_a} + ${
                                    result?.tech_b
                                  } + ${round(result?.tech_c1, 5)} = ${
                                    result?.tech_peri1
                                  }`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${data?.payload?.tech_lang_keys["7"]} s} = \\frac{a + b + c}{2}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${
                                    data?.payload?.tech_lang_keys["7"]
                                  } s} = \\frac{${result?.tech_a} + ${
                                    result?.tech_b
                                  } + ${round(result?.tech_c1, 5)}}{2} = ${
                                    result?.tech_semi1
                                  }`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${data?.payload?.tech_lang_keys["9"]}} h_a = \\frac{2 \\times \\text{Area}_a}{a}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${data?.payload?.tech_lang_keys["9"]}} h_a = \\frac{2 \\times ${result?.tech_area1}}{${result?.tech_a}} = ${result?.tech_ha1}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${data?.payload?.tech_lang_keys["9"]}} h_b = \\frac{2 \\times \\text{Area}_b}{b}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${data?.payload?.tech_lang_keys["9"]}} h_b = \\frac{2 \\times ${result?.tech_area1}}{${result?.tech_b}} = ${result?.tech_hb1}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${data?.payload?.tech_lang_keys["9"]}} h_c = \\frac{2 \\times \\text{Area}_c}{c}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${
                                    data?.payload?.tech_lang_keys["9"]
                                  }} h_c = \\frac{2 \\times ${
                                    result?.tech_area1
                                  }}{${round(result?.tech_c1, 5)}} = ${
                                    result?.tech_hc1
                                  }`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${data?.payload?.tech_lang_keys["10"]}} m_a = \\sqrt{\\left(\\frac{a}{2}\\right)^2 + c^2 - a c \\cos(B)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${
                                    data?.payload?.tech_lang_keys["10"]
                                  }} m_a = \\sqrt{\\left(\\frac{${
                                    result?.tech_a
                                  }}{2}\\right)^2 + ${round(
                                    result?.tech_c1,
                                    5
                                  )}^2 - ${result?.tech_a} \\times ${round(
                                    result?.tech_c1,
                                    5
                                  )} \\cos(${round(result?.tech_Br1, 5)})} = ${
                                    result?.tech_ma1
                                  }`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${data?.payload?.tech_lang_keys["10"]}} m_b = \\sqrt{\\left(\\frac{b}{2}\\right)^2 + a^2 - a b \\cos(C)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${
                                    data?.payload?.tech_lang_keys["10"]
                                  }} m_b = \\sqrt{\\left(\\frac{${
                                    result?.tech_b
                                  }}{2}\\right)^2 + ${result?.tech_a}^2 - ${
                                    result?.tech_a
                                  } \\times ${result?.tech_b} \\cos(${round(
                                    result?.tech_Cr1,
                                    5
                                  )})} = ${result?.tech_mb1}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${data?.payload?.tech_lang_keys["10"]}} m_c = \\sqrt{\\left(\\frac{c}{2}\\right)^2 + b^2 - b c \\cos(A)}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${
                                    data?.payload?.tech_lang_keys["10"]
                                  }} m_c = \\sqrt{\\left(\\frac{${round(
                                    result?.tech_c1,
                                    5
                                  )}}{2}\\right)^2 + ${result?.tech_b}^2 - ${
                                    result?.tech_b
                                  } \\times ${round(
                                    result?.tech_c1,
                                    5
                                  )} \\cos(${round(result?.tech_Ar, 5)})} = ${
                                    result?.tech_mc1
                                  }`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${data?.payload?.tech_lang_keys["11"]}} r = \\frac{area}{s} = \\frac{${result?.tech_area1}}{${result?.tech_semi1}} = ${result?.tech_inr1}`}
                                />
                              </p>

                              <p className="mt-3">
                                <InlineMath
                                  math={`\\text{${
                                    data?.payload?.tech_lang_keys["12"]
                                  }} R = \\frac{a}{2 \\sin(A)} = \\frac{${
                                    result?.tech_a
                                  }}{2 \\times \\sin(${round(
                                    result?.tech_Ar,
                                    5
                                  )})} = ${result?.tech_circ1}`}
                                />
                              </p>
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

export default TriangleCalculator;

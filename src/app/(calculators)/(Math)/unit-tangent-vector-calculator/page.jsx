"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useUnitTangentVectorCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const UnitTangentVectorCalculator = () => {
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
    tech_x: "sin(t)",
    tech_y: "cos(t)",
    tech_z: "tan(t)",
    tech_t: 5,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useUnitTangentVectorCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x || !formData.tech_y) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_z: formData.tech_z,
        tech_t: formData.tech_t,
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
      tech_x: "sin(t)",
      tech_y: "cos(t)",
      tech_z: "tan(t)",
      tech_t: 5,
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

  const renderFraction = (numerator) =>
    `\\frac{${numerator}}{\\sqrt{${result?.tech_eq_solve}}}`;

  const renderPregReplaced = (expr) => expr?.replace(/\(t/g, `(${result?.t}`);

  const displayVecT = (label) => (
    <p className="mt-3 font-s-20">
      <strong>
        <InlineMath
          math={`\\vec T (${label}) = (${Number(result?.tech_ans).toFixed(
            5
          )}, ${Number(result?.tech_ans1).toFixed(5)}, ${Number(
            result?.tech_ans2
          ).toFixed(5)})`}
        />
      </strong>
    </p>
  );

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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 mt-0 mt-lg-2 text-[14px]">
                <p>
                  <strong> {data?.payload?.tech_lang_keys["1"]}</strong>
                </p>
              </div>
              <div className="col-span-12 mt-2 flex items-center">
                <p className="text-[18px]">
                  <strong>r(t) = (</strong>
                </p>
                <div className="mx-2">
                  <input
                    type="text"
                    step="any"
                    name="tech_x"
                    id="tech_x"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-[18px]">
                  <strong>,</strong>
                </p>
                <div className="mx-2">
                  <input
                    type="text"
                    step="any"
                    name="tech_y"
                    id="tech_y"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_y}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-[18px]">
                  <strong>,</strong>
                </p>
                <div className="mx-2">
                  <input
                    type="text"
                    step="any"
                    name="tech_z"
                    id="tech_z"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_z}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-[18px]">
                  <strong>)</strong>
                </p>
              </div>
              <div className="col-span-12 mt-3 flex items-center">
                <p className="text-[18px]">
                  <strong>at t =</strong>
                </p>
                <div className="mx-2">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[16px] overflow-auto">
                        {result?.check == "method1" ? (
                          <>
                            {result?.t ? (
                              <p className="mt-3 font-s-20">
                                <strong>
                                  <InlineMath
                                    math={`\\vec T (${result?.t}) = (${Number(
                                      result?.tech_res
                                    ).toFixed(5)}, ${Number(
                                      result?.tech_res1
                                    ).toFixed(5)}, ${Number(
                                      result?.tech_res2
                                    ).toFixed(5)})`}
                                  />
                                </strong>
                              </p>
                            ) : (
                              <p className="mt-3 font-s-20">
                                <InlineMath
                                  math={`\\vec T (t) = \\left( ${renderFraction(
                                    result?.tech_deriv
                                  )}, ${renderFraction(
                                    result?.tech_deriv1
                                  )}, ${renderFraction(
                                    result?.tech_deriv2
                                  )} \\right)`}
                                />
                              </p>
                            )}

                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["4"]}:
                              </strong>
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["5"]} r(t)
                            </p>

                            <p className="mt-3">
                              <InlineMath
                                math={`rx = ${result?.tech_enter},\\ \\frac{d}{dt}(rx) = ${result?.tech_deriv}`}
                              />
                            </p>
                            <div className="w-full my-3">
                              <button
                                type="button"
                                className="calculate repeat"
                              >
                                {data?.payload?.tech_lang_keys["6"]}
                              </button>
                            </div>
                            <div
                              className="w-full res_step hidden"
                              id="step_cal"
                            >
                              {result?.tech_steps}
                            </div>

                            <p className="mt-3">
                              <InlineMath
                                math={`ry = ${result?.tech_enter1},\\ \\frac{d}{dt}(ry) = ${result?.tech_deriv1}`}
                              />
                            </p>
                            <div className="w-full my-3">
                              <button
                                type="button"
                                className="calculate repeat1"
                              >
                                {data?.payload?.tech_lang_keys["6"]}
                              </button>
                            </div>
                            <div
                              className="w-full res_step hidden"
                              id="step_cal1"
                            >
                              {result?.tech_steps1}
                            </div>

                            <p className="mt-3">
                              <InlineMath
                                math={`rz = ${result?.tech_enter2},\\ \\frac{d}{dt}(rz) = ${result?.tech_deriv2}`}
                              />
                            </p>
                            <div className="w-full my-3">
                              <button
                                type="button"
                                className="calculate repeat2"
                              >
                                {data?.payload?.tech_lang_keys["6"]}
                              </button>
                            </div>
                            <div
                              className="w-full res_step hidden"
                              id="step_cal2"
                            >
                              {result?.tech_steps2}
                            </div>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["7"]}
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`\\vec r'(t) = (${result?.tech_deriv}, ${result?.tech_deriv1}, ${result?.tech_deriv2})`}
                              />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["8"]}
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`||\\vec r'(t)|| = \\sqrt{(${result?.tech_deriv})^2 + (${result?.tech_deriv1})^2 + (${result?.tech_deriv2})^2}`}
                              />
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`||\\vec r'(t)|| = \\sqrt{${result?.tech_eq_solve}}`}
                              />
                            </p>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]}
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`\\vec T (t) = \\frac{\\vec r(t)}{||\\vec r(t)||}`}
                              />
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`\\vec T (t) = \\frac{(${result?.tech_deriv}, ${result?.tech_deriv1}, ${result?.tech_deriv2})}{\\sqrt{${result?.tech_eq_solve}}}`}
                              />
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`\\vec T (t) = \\left( ${renderFraction(
                                  result?.tech_deriv
                                )}, ${renderFraction(
                                  result?.tech_deriv1
                                )}, ${renderFraction(
                                  result?.tech_deriv2
                                )} \\right)`}
                              />
                            </p>

                            {result?.t && (
                              <>
                                <p className="mt-3">
                                  <InlineMath
                                    math={`\\vec T (${
                                      result?.t
                                    }) = \\left( \\frac{${renderPregReplaced(
                                      result?.tech_deriv
                                    )}}{\\sqrt{${renderPregReplaced(
                                      result?.tech_eq_solve
                                    )}}}, \\frac{${renderPregReplaced(
                                      result?.tech_deriv1
                                    )}}{\\sqrt{${renderPregReplaced(
                                      result?.tech_eq_solve
                                    )}}}, \\frac{${renderPregReplaced(
                                      result?.tech_deriv2
                                    )}}{\\sqrt{${renderPregReplaced(
                                      result?.tech_eq_solve
                                    )}}} \\right)`}
                                  />
                                </p>
                                <p className="mt-3">
                                  <InlineMath
                                    math={`\\vec T (${result?.t}) = (${result?.tech_res}, ${result?.tech_res1}, ${result?.tech_res2})`}
                                  />
                                </p>
                              </>
                            )}
                          </>
                        ) : result?.check == "method2" ? (
                          <>
                            {result?.t
                              ? displayVecT(result.tech_t)
                              : displayVecT("t")}

                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["4"]}:
                              </strong>
                            </p>
                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["5"]} r(t)
                              </strong>
                            </p>

                            <p className="mt-3">
                              <InlineMath
                                math={`rx = ${result?.tech_enter},\\ \\frac{d}{dt}(rx) = ${result?.tech_deriv}`}
                              />
                            </p>
                            <div className="w-full my-3">
                              <button
                                type="button"
                                className="calculate repeat"
                              >
                                {data?.payload?.tech_lang_keys["6"]}
                              </button>
                            </div>
                            <div
                              className="w-full res_step hidden"
                              id="step_cal"
                            >
                              {result?.tech_steps}
                            </div>

                            <p className="mt-3">
                              <InlineMath
                                math={`ry = ${result?.tech_enter1},\\ \\frac{d}{dt}(ry) = ${result?.tech_deriv1}`}
                              />
                            </p>
                            <div className="w-full my-3">
                              <button
                                type="button"
                                className="calculate repeat1"
                              >
                                {data?.payload?.tech_lang_keys["6"]}
                              </button>
                            </div>
                            <div
                              className="w-full res_step hidden"
                              id="step_cal1"
                            >
                              {result?.tech_steps1}
                            </div>

                            <p className="mt-3">
                              <InlineMath
                                math={`rz = ${result?.tech_enter2},\\ \\frac{d}{dt}(rz) = ${result?.tech_deriv2}`}
                              />
                            </p>
                            <div className="w-full my-3">
                              <button
                                type="button"
                                className="calculate repeat2"
                              >
                                {data?.payload?.tech_lang_keys["6"]}
                              </button>
                            </div>
                            <div
                              className="w-full res_step hidden"
                              id="step_cal2"
                            >
                              {result?.tech_steps2}
                            </div>

                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]}
                              </strong>
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`\\vec r'(t) = (${result?.tech_deriv}, ${result?.tech_deriv1}, ${result?.tech_deriv2})`}
                              />
                            </p>

                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["8"]}
                              </strong>
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`||\\vec r'(t)|| = \\sqrt{(${result?.tech_deriv})^2 + (${result?.tech_deriv1})^2 + (${result?.tech_deriv2})^2}`}
                              />
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`||\\vec r'(t)|| = \\sqrt{${result?.tech_eq_len} + ${result?.tech_eq1_len} + ${result?.tech_eq2_len}}`}
                              />
                            </p>

                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["9"]}
                              </strong>
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`\\vec T (t) = \\frac{\\vec r(t)}{||\\vec r(t)||}`}
                              />
                            </p>
                            <p className="mt-3">
                              <InlineMath
                                math={`\\vec T (t) = \\frac{(${result?.tech_deriv}, ${result?.tech_deriv1}, ${result?.tech_deriv2})}{\\sqrt{${result?.tech_eq_len} + ${result?.tech_eq1_len} + ${result?.tech_eq2_len}}}`}
                              />
                            </p>

                            {result?.t ? (
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\vec T (${result?.t}) = (${result?.tech_ans}, ${result?.tech_ans1}, ${result?.tech_ans2})`}
                                />
                              </p>
                            ) : (
                              <p className="mt-3">
                                <InlineMath
                                  math={`\\vec T (t) = (${result?.tech_ans}, ${result?.tech_ans1}, ${result?.tech_ans2})`}
                                />
                              </p>
                            )}
                          </>
                        ) : null}
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

export default UnitTangentVectorCalculator;

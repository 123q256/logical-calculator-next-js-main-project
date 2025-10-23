"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useSseCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SseCalculator = () => {
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
    tech_x: "6, 7, 7, 8, 12, 14, 15, 16, 16, 19",
    tech_y: "14, 15, 15, 17, 18, 18, 16, 14, 11, 8",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSseCalculatorMutation();

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
      tech_x: "6, 7, 7, 8, 12, 14, 15, 16, 16, 19",
      tech_y: "14, 15, 15, 17, 18, 18, 16, 14, 11, 8",
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

  const techX = result?.tech_x || [];
  const techY = result?.tech_y || [];

  const sum = {
    x: result?.tech_x_sum,
    y: result?.tech_y_sum,
    xi2: result?.tech_xi_sum,
    yi2: result?.tech_yi_sum,
    xy: result?.tech_xy_sum,
  };

  function sigFig(value, digits) {
    if (value === "" || value === null || value === undefined || isNaN(value)) {
      return "";
    }

    value = parseFloat(value);

    let decimalPlaces;

    if (value === 0) {
      decimalPlaces = digits - 1;
    } else if (value < 0) {
      decimalPlaces = digits - Math.floor(Math.log10(Math.abs(value))) - 1;
    } else {
      decimalPlaces = digits - Math.floor(Math.log10(value)) - 1;
    }

    const rounded = Number(value.toFixed(decimalPlaces));
    return rounded;
  }

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
            <div className="grid grid-cols-12 mt-3 ga-1 ">
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["sample1"]}
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                    value={formData.tech_x || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_y" className="label">
                  {data?.payload?.tech_lang_keys["sample2"]}
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_y"
                    id="tech_y"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                    value={formData.tech_y || ""}
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
                {data?.payload?.tech_lang_keys["locale"] === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>
        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="text-center">
                          <div className="p-4">
                            {/* SS_E Section */}
                            <div className="text-center mb-4">
                              <p className="text-[25px] font-bold">
                                <InlineMath math="SS_{E}" />
                              </p>
                              <p className="text-[30px] bg-[#2845F5] px-3 py-2 rounded-lg inline-block font-bold text-white">
                                {result?.tech_ss_e}
                              </p>
                            </div>

                            {/* Solution Header */}
                            <p className="text-[25px] font-bold text-blue-700">
                              {data?.payload?.tech_lang_keys["solution"]}:
                            </p>

                            {/* Statement 1 */}
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["statement1"]}
                            </p>

                            {/* First Table (X & Y) */}
                            <div className="mt-2 overflow-auto">
                              <table className="min-w-full border border-gray-400 text-center">
                                <thead className="bg-gray-200">
                                  <tr>
                                    <th className="p-2 border">Obs.</th>
                                    <th className="p-2 border">X</th>
                                    <th className="p-2 border">Y</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {techX.map((xi, index) => (
                                    <tr key={index} className="bg-white">
                                      <td className="p-2 bordered">
                                        {index + 1}
                                      </td>
                                      <td className="p-2 bordered">{xi}</td>
                                      <td className="p-2 bordered">
                                        {techY[index]}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Statement 2 */}
                            <p className="mt-4">
                              {data?.payload?.tech_lang_keys["statement2"]}
                            </p>

                            {/* Second Table (Detailed Calculations) */}
                            <div className="mt-2 overflow-auto">
                              <table className="min-w-full border border-gray-400 text-center">
                                <thead className="bg-gray-200">
                                  <tr>
                                    <th className="p-2 bordered">Obs.</th>
                                    <th className="p-2 bordered">X</th>
                                    <th className="p-2 bordered">Y</th>
                                    <th className="p-2 bordered">Xᵢ²</th>
                                    <th className="p-2 bordered">Yᵢ²</th>
                                    <th className="p-2 bordered">Xᵢ · Yᵢ</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {techX.map((xi, index) => {
                                    const yi = techY[index];
                                    return (
                                      <tr key={index} className="bg-white">
                                        <td className="p-2 bordered">
                                          {index + 1}
                                        </td>
                                        <td className="p-2 bordered">{xi}</td>
                                        <td className="p-2 bordered">{yi}</td>
                                        <td className="p-2 bordered">
                                          {xi ** 2}
                                        </td>
                                        <td className="p-2 bordered">
                                          {yi ** 2}
                                        </td>
                                        <td className="p-2 bordered">
                                          {xi * yi}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                  {/* Totals */}
                                  <tr className="bg-gray-200 font-bold">
                                    <td className="p-2 bordered">Sum =</td>
                                    <td className="p-2 bordered">{sum.x}</td>
                                    <td className="p-2 bordered">{sum.y}</td>
                                    <td className="p-2 bordered">{sum.xi2}</td>
                                    <td className="p-2 bordered">{sum.yi2}</td>
                                    <td className="p-2 bordered">{sum.xy}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="row overflow-auto p-2 mt-2 px-3">
                              <p className="w-full mt-3 text-center">
                                <strong>Step by Step Solution</strong>
                              </p>
                              <p className="w-full mt-3">
                                {data?.payload?.tech_lang_keys["statement3"]}
                              </p>

                              <BlockMath
                                math={`SS_{XX} = \\sum^n_{i=1}X_i^2 - \\dfrac{1}{n} \\left(\\sum^n_{i=1}X_i \\right)^2`}
                              />
                              <BlockMath
                                math={`= ${result?.tech_xi_sum} - \\dfrac{1}{${result?.tech_n}} (${result?.tech_x_sum})^2`}
                              />
                              <BlockMath
                                math={`= ${sigFig(result?.tech_ss_xx, 5)}`}
                              />

                              <BlockMath
                                math={`SS_{YY} = \\sum^n_{i=1}Y_i^2 - \\dfrac{1}{n} \\left(\\sum^n_{i=1}Y_i \\right)^2`}
                              />
                              <BlockMath
                                math={`= ${result?.tech_yi_sum} - \\dfrac{1}{${result?.tech_n}} (${result?.tech_y_sum})^2`}
                              />
                              <BlockMath
                                math={`= ${sigFig(result?.tech_ss_yy, 5)}`}
                              />

                              <BlockMath
                                math={`SS_{XY} = \\sum^n_{i=1}X_iY_i - \\dfrac{1}{n} \\left(\\sum^n_{i=1}X_i \\right) \\left(\\sum^n_{i=1}Y_i \\right)`}
                              />
                              <BlockMath
                                math={`= ${result?.tech_xy_sum} - \\dfrac{1}{${result?.tech_n}} (${result?.tech_x_sum}) (${result?.tech_y_sum})`}
                              />
                              <BlockMath
                                math={`= ${sigFig(result?.tech_ss_xy, 5)}`}
                              />

                              <p className="w-full mt-3">
                                {data?.payload?.tech_lang_keys["statement4"]}
                              </p>

                              <BlockMath
                                math={`\\hat{\\beta}_1 = \\dfrac{SS_{XY}}{SS_{XX}}`}
                              />
                              <BlockMath
                                math={`= \\dfrac{${sigFig(
                                  result?.tech_ss_xy,
                                  5
                                )}}{${sigFig(result?.tech_ss_xx, 5)}}`}
                              />
                              <BlockMath
                                math={`= ${sigFig(result?.tech_beta_1, 5)}`}
                              />

                              <BlockMath
                                math={`\\hat{\\beta}_0 = \\bar{Y} - \\hat{\\beta}_1 \\times \\bar{X}`}
                              />
                              <BlockMath
                                math={`= ${sigFig(
                                  result?.tech_y_sum / result?.tech_n,
                                  5
                                )} - ${sigFig(
                                  result?.tech_beta_1,
                                  5
                                )} \\times ${sigFig(
                                  result?.tech_x_sum / result?.tech_n,
                                  5
                                )}`}
                              />
                              <BlockMath
                                math={`= ${sigFig(result?.tech_beta_0, 5)}`}
                              />

                              <p className="w-full mt-3">
                                {data?.payload?.tech_lang_keys["statement5"]}
                              </p>

                              <BlockMath
                                math={`\\hat{Y} = ${sigFig(
                                  result?.tech_beta_0,
                                  5
                                )} + ${sigFig(result?.tech_beta_1, 5)}X`}
                              />

                              <p className="w-full mt-3">
                                {data?.payload?.tech_lang_keys["statement6"]}
                              </p>

                              <BlockMath
                                math={`SS_{Total} = SS_{YY} = ${sigFig(
                                  result?.tech_ss_yy,
                                  5
                                )}`}
                              />

                              <p className="w-full mt-3">
                                {data?.payload?.tech_lang_keys["statement7"]}
                              </p>

                              <BlockMath math={`SS_{R} = \\hat{B}_1 SS_{XY}`} />
                              <BlockMath
                                math={`= ${sigFig(
                                  result?.tech_beta_1,
                                  5
                                )} \\times ${sigFig(result?.tech_ss_xy, 5)}`}
                              />
                              <BlockMath
                                math={`= ${sigFig(result?.tech_ss_r, 5)}`}
                              />

                              <p className="w-full mt-3">
                                {data?.payload?.tech_lang_keys["statement8"]}
                              </p>
                              <p className="w-full">
                                {data?.payload?.tech_lang_keys["statement8.1"]}
                              </p>

                              <BlockMath
                                math={`SS_{E} = SS_{Total} - SS_{R}`}
                              />
                              <BlockMath
                                math={`= ${sigFig(
                                  result?.tech_ss_yy,
                                  5
                                )} - ${sigFig(result?.tech_ss_r, 5)}`}
                              />
                              <BlockMath
                                math={`= ${sigFig(result?.tech_ss_e, 5)}`}
                              />

                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys["statement9"]}
                              </p>
                              <BlockMath
                                math={`SS_{E} = ${sigFig(
                                  result?.tech_ss_e,
                                  5
                                )}`}
                              />
                            </div>
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

export default SseCalculator;

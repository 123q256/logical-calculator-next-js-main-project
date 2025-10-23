"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useQuadraticRegressionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const QuadraticRegressionCalculator = () => {
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
    tech_x: "10, 12, 11, 15, 11, 14",
    tech_y: "13, 17, 12, 22, 14, 11",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useQuadraticRegressionCalculatorMutation();

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
      tech_x: "10, 12, 11, 15, 11, 14",
      tech_y: "13, 17, 12, 22, 14, 11",
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
  // Helper function to sum arrays safely
  const sumArray = (arr) => arr?.reduce((a, b) => a + b, 0) || 0;

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
            <div className="grid grid-cols-12 mt-3  gap-1">
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["1"]} X{" "}
                  {data?.payload?.tech_lang_keys["2"]} (
                  {data?.payload?.tech_lang_keys["3"]})
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 10, 12, 11, 15, 11, 14"
                    value={formData.tech_x || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_y" className="label">
                  {data?.payload?.tech_lang_keys["1"]} Y{" "}
                  {data?.payload?.tech_lang_keys["2"]} (
                  {data?.payload?.tech_lang_keys["3"]})
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_y"
                    id="tech_y"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 10, 12, 11, 15, 11, 14"
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  mt-3">
                      <div className="w-full">
                        <div className="text-center">
                          <p className="text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["4"]}
                            </strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong className="text-blue">
                                y = {Number(result?.tech_a).toFixed(5)}x
                                <sup className="text-blue">2</sup>{" "}
                                {result?.tech_b < 0 ? "-" : "+"}{" "}
                                {Number(Math.abs(result?.tech_b)).toFixed(5)}x{" "}
                                {result?.tech_c < 0 ? "-" : "+"}{" "}
                                {Number(Math.abs(result?.tech_c)).toFixed(5)}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div className="w-full md:w-[80%] lg:w-[60%] mt-2 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b text-blue">
                                  {data?.payload?.tech_lang_keys[5]} (n):
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_xvalues?.length}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b text-blue">
                                  {data?.payload?.tech_lang_keys[6]} x:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Number(result?.tech_meanx).toFixed(5)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b text-blue">
                                  {data?.payload?.tech_lang_keys[6]} y:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Number(result?.tech_meany).toFixed(5)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b text-blue">a:</td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Number(result?.tech_a).toFixed(5)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b text-blue">b:</td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Number(result?.tech_b).toFixed(5)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b text-blue">c:</td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Number(result?.tech_c).toFixed(5)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b text-blue">
                                  {data?.payload?.tech_lang_keys[7]} (r):
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Number(result?.tech_r2).toFixed(5)}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="w-full mt-3 font-s-20">
                          <strong className="text-blue">
                            {data?.payload?.tech_lang_keys[8]}:
                          </strong>
                        </p>
                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys[9]}:
                        </p>
                        <p className="w-full mt-2">
                          X {data?.payload?.tech_lang_keys[10]}:{" "}
                          {result?.tech_xvalues?.map((val, i) => (
                            <span key={i}>
                              {i > 0 && ", "}
                              {val}
                            </span>
                          ))}
                        </p>
                        <p className="w-full mt-2">
                          Y {data?.payload?.tech_lang_keys[10]}:{" "}
                          {result?.tech_yvalues?.map((val, i) => (
                            <span key={i}>
                              {i > 0 && ", "}
                              {val}
                            </span>
                          ))}
                        </p>

                        <div className="w-full mt-2 overflow-auto">
                          <table
                            className="w-full font-s-14"
                            style={{ borderCollapse: "collapse" }}
                          >
                            <thead>
                              <tr className="bg-[#2845F5] text-white">
                                <td className="py-2 ps-1 border text-center">
                                  <InlineMath math="(x_i - \bar{x})^2" />
                                </td>
                                <td className="py-2 ps-1 border text-center">
                                  <InlineMath math="(x_i - \bar{x})(y_i - \bar{y})" />
                                </td>
                                <td className="py-2 ps-1 border text-center">
                                  <InlineMath math="(x_i - \bar{x})(x_i^2 - \bar{x^2})" />
                                </td>
                                <td className="py-2 ps-1 border text-center">
                                  <InlineMath math="(x_i^2 - \bar{x^2})^2" />
                                </td>
                                <td className="py-2 ps-1 border text-center">
                                  <InlineMath math="(x_i^2 - \bar{x^2})(y_i - \bar{y})" />
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              {result?.tech_Sxx?.map((_, i) => (
                                <tr key={i} className="bg-white">
                                  <td className="py-2 ps-1 border">
                                    {Number(result.tech_Sxx[i]).toFixed(3)}
                                  </td>
                                  <td className="py-2 ps-1 border">
                                    {Number(result.tech_Sxy[i]).toFixed(3)}
                                  </td>
                                  <td className="py-2 ps-1 border">
                                    {Number(result.tech_Sxx2[i]).toFixed(3)}
                                  </td>
                                  <td className="py-2 ps-1 border">
                                    {Number(result.tech_Sx2x2[i]).toFixed(3)}
                                  </td>
                                  <td className="py-2 ps-1 border">
                                    {Number(result.tech_Sx2y[i]).toFixed(3)}
                                  </td>
                                </tr>
                              ))}
                              <tr className="bg-gray-100">
                                <td className="py-2 ps-1 border text-center font-bold">
                                  <InlineMath
                                    math={`\\sum_{i=1}^n = ${sumArray(
                                      result?.tech_Sxx
                                    ).toFixed(2)}`}
                                  />
                                </td>
                                <td className="py-2 ps-1 border text-center font-bold">
                                  <InlineMath
                                    math={`\\sum_{i=1}^n = ${sumArray(
                                      result?.tech_Sxy
                                    ).toFixed(2)}`}
                                  />
                                </td>
                                <td className="py-2 ps-1 border text-center font-bold">
                                  <InlineMath
                                    math={`\\sum_{i=1}^n = ${sumArray(
                                      result?.tech_Sxx2
                                    ).toFixed(2)}`}
                                  />
                                </td>
                                <td className="py-2 ps-1 border text-center font-bold">
                                  <InlineMath
                                    math={`\\sum_{i=1}^n = ${sumArray(
                                      result?.tech_Sx2x2
                                    ).toFixed(2)}`}
                                  />
                                </td>
                                <td className="py-2 ps-1 border text-center font-bold">
                                  <InlineMath
                                    math={`\\sum_{i=1}^n = ${sumArray(
                                      result?.tech_Sx2y
                                    ).toFixed(2)}`}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <p className="w-full mt-2">
                            <InlineMath
                              math={`b := \\dfrac{S_{xy} S_{x^2 x^2} - S_{x^2 y} S_{xx^2}}{S_{xx} S_{x^2 x^2} - (S_{xx^2})^2}`}
                            />
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath
                              math={`c := \\dfrac{S_{x^2 y} S_{xx} - S_{xy} S_{xx^2}}{S_{xx} S_{x^2 x^2} - (S_{xx^2})^2}`}
                            />
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath
                              math={`a := \\bar{y} - b \\bar{x} - c \\bar{x^2}`}
                            />
                          </p>

                          <p className="w-full mt-2">
                            <InlineMath
                              math={`b := ${Number(result?.tech_b).toFixed(5)}`}
                            />
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath
                              math={`c := ${Number(result?.tech_c).toFixed(5)}`}
                            />
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath
                              math={`a := ${Number(result?.tech_a).toFixed(5)}`}
                            />
                          </p>
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

export default QuadraticRegressionCalculator;

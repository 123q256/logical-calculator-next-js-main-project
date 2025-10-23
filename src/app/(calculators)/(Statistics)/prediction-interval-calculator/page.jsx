"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  usePredictionIntervalCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PredictionIntervalCalculator = () => {
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
    tech_x: "3, 5, 2, 4, 4, 1, 5, 4, 6, 2, 2, 3, 1, 2, 3",
    tech_y: "80, 94, 81, 87, 86, 67, 90, 91, 95, 77, 74, 81, 66, 75, 79",
    tech_confidence: "0.95",
    tech_prediction: "3",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePredictionIntervalCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_x ||
      !formData.tech_y ||
      !formData.tech_confidence ||
      !formData.tech_prediction
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_confidence: formData.tech_confidence,
        tech_prediction: formData.tech_prediction,
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
      tech_x: "3, 5, 2, 4, 4, 1, 5, 4, 6, 2, 2, 3, 1, 2, 3",
      tech_y: "80, 94, 81, 87, 86, 67, 90, 91, 95, 77, 74, 81, 66, 75, 79",
      tech_confidence: "0.95",
      tech_prediction: "3",
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
            <div className="grid grid-cols-12 mt-3  gap-1">
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (
                  {data?.payload?.tech_lang_keys["2"]}):
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
                  {data?.payload?.tech_lang_keys["3"]} (
                  {data?.payload?.tech_lang_keys["2"]}):
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
              <div className="col-span-12">
                <label htmlFor="tech_confidence" className="label">
                  {data?.payload?.tech_lang_keys["4"]} (Ex: 0.95):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_confidence"
                    id="tech_confidence"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_confidence}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_prediction" className="label">
                  {data?.payload?.tech_lang_keys["5"]} X
                  <sub className="text-blue">0</sub> (Ex: 3):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_prediction"
                    id="tech_prediction"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_prediction}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  mt-3">
                      <div className="w-full">
                        <div className="text-center">
                          <p className="text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["6"]}
                            </strong>
                          </p>
                          <p className="text-[22px] bg-[#2845F5] px-3 py-2 rounded-[10px] inline-block my-3">
                            <strong className="text-white">
                              ({Number(result?.tech_piPov).toFixed(4)},{" "}
                              {Number(result?.tech_piNeg).toFixed(4)})
                            </strong>
                          </p>
                        </div>

                        <p className="w-full mt-3 text-[18px] text-blue">
                          {data?.payload?.tech_lang_keys["34"]}
                        </p>
                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys["7"]}:
                        </p>

                        <div className="w-full mt-2 overflow-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-[#2845F5] text-white">
                                <th className="p-2 text-center bordered text-blue">
                                  Obs.
                                </th>
                                <th className="p-2 text-center bordered text-blue">
                                  X
                                </th>
                                <th className="p-2 text-center bordered text-blue">
                                  Y
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from({
                                length: result?.tech_array_num || 0,
                              }).map((_, i) => (
                                <tr className="bg-white" key={i}>
                                  <td className="p-2 text-center bordered">
                                    {i + 1}
                                  </td>
                                  <td className="p-2 text-center bordered">
                                    {result?.tech_array_x[i]}
                                  </td>
                                  <td className="p-2 text-center bordered">
                                    {result?.tech_array_y[i]}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <p className="w-full mt-3 text-blue text-[18px]">
                          {data?.payload?.tech_lang_keys["8"]}
                        </p>
                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys["9"]}:
                        </p>

                        <div className="w-full mt-2 overflow-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-[#2845F5] text-white">
                                <th className="p-2 bordered text-blue text-center">
                                  Obs.
                                </th>
                                <th className="p-2 bordered text-blue text-center">
                                  X
                                </th>
                                <th className="p-2 bordered text-blue text-center">
                                  Y
                                </th>
                                <th className="p-2 bordered text-blue text-center">
                                  X<sup className="text-blue">2</sup>
                                  <sub className="text-blue">i</sub>
                                </th>
                                <th className="p-2 bordered text-blue text-center">
                                  Y<sup className="text-blue">2</sup>
                                  <sub className="text-blue">i</sub>
                                </th>
                                <th className="p-2 bordered text-blue text-center">
                                  X<sub className="text-blue">i</sub> . Y
                                  <sub className="text-blue">i</sub>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from({
                                length: result?.tech_array_num || 0,
                              }).map((_, i) => (
                                <tr className="bg-white" key={i}>
                                  <td className="p-2 bordered text-center">
                                    {i + 1}
                                  </td>
                                  <td className="p-2 bordered text-center">
                                    {result?.tech_array_x[i]}
                                  </td>
                                  <td className="p-2 bordered text-center">
                                    {result?.tech_array_y[i]}
                                  </td>
                                  <td className="p-2 bordered text-center">
                                    {result?.tech_x_sqr[i]}
                                  </td>
                                  <td className="p-2 bordered text-center">
                                    {result?.tech_y_sqr[i]}
                                  </td>
                                  <td className="p-2 bordered text-center">
                                    {result?.tech_x_mul_y[i]}
                                  </td>
                                </tr>
                              ))}

                              <tr>
                                <td className="text-blue p-2 bordered text-center">
                                  Sum =
                                </td>
                                <td className="text-blue p-2 bordered text-center">
                                  {result?.tech_x_sum}
                                </td>
                                <td className="text-blue p-2 bordered text-center">
                                  {result?.tech_y_sum}
                                </td>
                                <td className="text-blue p-2 bordered text-center">
                                  {result?.tech_x_sqr_sum}
                                </td>
                                <td className="text-blue p-2 bordered text-center">
                                  {result?.tech_y_sqr_sum}
                                </td>
                                <td className="text-blue p-2 bordered text-center">
                                  {result?.tech_xy_sum}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full overflow-auto p-3 mt-3">
                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["10"]}:
                          </div>
                          <BlockMath
                            math={`SS_{XX} = \\sum^n_{i=1}X_i^2 - \\dfrac{1}{n} \\left(\\sum^n_{i=1}X_i \\right)^2`}
                          />
                          <BlockMath
                            math={`= ${result?.tech_x_sqr_sum} - \\dfrac{1}{${result?.tech_array_num}} (${result?.tech_x_sum})^2`}
                          />
                          <BlockMath math={`= ${result?.tech_ssxx}`} />

                          <BlockMath
                            math={`SS_{YY} = \\sum^n_{i=1}Y_i^2 - \\dfrac{1}{n} \\left(\\sum^n_{i=1}Y_i \\right)^2`}
                          />
                          <BlockMath
                            math={`= ${result?.tech_y_sqr_sumd} - \\dfrac{1}{${result?.tech_array_num}} (${result?.tech_y_sum})^2`}
                          />
                          <BlockMath math={`= ${result?.tech_ssyy}`} />

                          <BlockMath
                            math={`SS_{XY} = \\sum^n_{i=1}{X_iY_i} - \\dfrac{1}{n} \\left(\\sum^n_{i=1}X_i \\right) \\left(\\sum^n_{i=1}Y_i \\right)`}
                          />
                          <BlockMath
                            math={`= ${result?.tech_xy_sum} - \\dfrac{1}{${result?.tech_array_num}} (${result?.tech_x_sum}) (${result?.tech_y_sum})`}
                          />
                          <BlockMath math={`= ${result?.tech_ssxy}`} />

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["11"]}:
                          </div>
                          <BlockMath
                            math={`\\hat{\\beta_1} = \\dfrac{SS_{XY}}{SS_{XX}}`}
                          />
                          <BlockMath
                            math={`= \\dfrac{${result?.tech_ssxy}}{${result?.tech_ssxx}}`}
                          />
                          <BlockMath math={`= ${result?.tech_b1}`} />

                          <BlockMath
                            math={`\\hat{\\beta_0} = \\bar{Y} - \\hat{\\beta_1} \\times \\bar{X}`}
                          />
                          <BlockMath
                            math={`= ${result?.tech_mean_y} - ${result?.tech_b1} \\times ${result?.tech_mean_x}`}
                          />
                          <BlockMath math={`= ${result?.tech_b0}`} />

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["12"]}:
                          </div>
                          <BlockMath
                            math={`\\hat{Y} = \\hat{\\beta_0} + \\hat{\\beta_1} \\times X`}
                          />

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["13"]} X=
                            {result?.tech_prediction},{" "}
                            {data?.payload?.tech_lang_keys["14"]} X=
                            {result?.tech_prediction}{" "}
                            {data?.payload?.tech_lang_keys["15"]}:
                          </div>
                          <BlockMath
                            math={`\\hat{Y} = ${result?.tech_b0} + ${result?.tech_b1} \\times ${result?.tech_prediction}`}
                          />
                          <BlockMath math={`= ${result?.tech_Y}`} />

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["16"]}{" "}
                            {result?.tech_confidence_per}{" "}
                            {data?.payload?.tech_lang_keys["17"]}:
                          </div>
                          <div className="w-full mt-3">
                            Y = {result?.tech_Y}{" "}
                            {data?.payload?.tech_lang_keys["18"]}{" "}
                            {result?.tech_confidence_per}{" "}
                            {data?.payload?.tech_lang_keys["19"]}{" "}
                            {data?.payload?.tech_lang_keys["20"]}
                          </div>

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["21"]}:
                          </div>
                          <BlockMath
                            math={`SS_{Total} = SS_{YY} = ${result?.tech_ssyy}`}
                          />

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["22"]}:
                          </div>
                          <BlockMath
                            math={`SS_{Regression} = \\hat{\\beta_1} \\times SS_{XY}`}
                          />
                          <BlockMath
                            math={`= ${result?.tech_b1} \\times ${result?.tech_ssxy}`}
                          />
                          <BlockMath math={`= ${result?.tech_ssRegression}`} />

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["23"]}:{" "}
                            <BlockMath
                              math={`SS_{Total} = SS_{Regression} + SS_{Error}`}
                            />
                          </div>
                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["24"]}:{" "}
                            <BlockMath
                              math={`SS_{Error} = SS_{Total} - SS_{Regression}`}
                            />
                          </div>
                          <BlockMath
                            math={`= ${result?.tech_ssyy} - ${result?.tech_ssRegression}`}
                          />
                          <BlockMath math={`= ${result?.tech_ssError}`} />

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["25"]}:
                          </div>
                          <BlockMath
                            math={`MSE = \\dfrac{SS_{Error}}{n - 2}`}
                          />
                          <BlockMath
                            math={`= \\dfrac{${result?.tech_ssError}}{${result?.tech_array_num} - 2}`}
                          />
                          <BlockMath math={`= ${result?.tech_mse}`} />

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["26"]}:
                          </div>
                          <BlockMath math={`\\hat{\\sigma} = \\sqrt{MSE}`} />
                          <BlockMath math={`= \\sqrt{${result?.tech_mse}}`} />
                          <BlockMath math={`= ${result?.tech_errorEst}`} />

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["27"]}{" "}
                            {result?.tech_confidence_per}{" "}
                            {data?.payload?.tech_lang_keys["28"]}{" "}
                            {result?.tech_Y},{" "}
                            {data?.payload?.tech_lang_keys["29"]}{" "}
                            {result?.tech_level}.
                            {data?.payload?.tech_lang_keys["30"]} df = n − 2 ={" "}
                            {result?.tech_array_num} - 2 ={" "}
                            {result?.tech_array_num - 2}{" "}
                            {data?.payload?.tech_lang_keys["31"]} α ={" "}
                            {result?.tech_level}{" "}
                            {data?.payload?.tech_lang_keys["32"]} t = 2.16.
                          </div>
                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["33"]}
                          </div>
                          <BlockMath
                            math={`E = t_{\\sigma/2;n-2} \\times \\sqrt{ \\sigma^2 \\left(1 + \\dfrac{1}{n} + \\dfrac{\\left( X_0 - \\bar{X} \\right)^2} {SS_{XX}} \\right)}`}
                          />
                          <BlockMath
                            math={`= 2.16 \\times \\sqrt{${result?.tech_mse} \\left(1 + \\dfrac{1}{${result?.tech_array_num}} + \\dfrac{\\left( ${result?.tech_prediction} - ${result?.tech_mean_x} \\right)^2} {${result?.tech_ssxx}} \\right)}`}
                          />
                          <BlockMath math={`= ${result?.tech_E}`} />

                          <div className="w-full mt-3">
                            {data?.payload?.tech_lang_keys["34"]}{" "}
                            {result?.tech_confidence_per}{" "}
                            {data?.payload?.tech_lang_keys["35"]} Y ={" "}
                            {result?.tech_Y}
                          </div>
                          <BlockMath
                            math={`PI = \\left(\\hat{Y} + E ,  \\hat{Y} - E \\right)`}
                          />
                          <BlockMath
                            math={`PI = \\left(${result?.tech_Y} + ${result?.tech_E} ,  ${result?.tech_Y} - ${result?.tech_E} \\right)`}
                          />
                          <BlockMath
                            math={`PI = \\left(${result?.tech_piPov} , ${result?.tech_piNeg} \\right)`}
                          />
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

export default PredictionIntervalCalculator;

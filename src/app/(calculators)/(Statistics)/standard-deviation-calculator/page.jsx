"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useStandardDeviationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const StandardDeviationCalculator = () => {
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
    tech_stdv_txt: "12, 23, 45, 33, 65, 54, 54",
    tech_stdv_rad: "population", // population  sample
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useStandardDeviationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_stdv_txt || !formData.tech_stdv_rad) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_stdv_txt: formData.tech_stdv_txt,
        tech_stdv_rad: formData.tech_stdv_rad,
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
      tech_stdv_txt: "12, 23, 45, 33, 65, 54, 54",
      tech_stdv_rad: "population", // population  sample
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

  // result?

  const isPopulation = result?.tech_stdv_rad == "population";
  const sdSym = isPopulation ? "σ" : "s";
  const mSym = isPopulation ? "μ" : "x̄";

  // Calculate value
  const stdValue = isPopulation
    ? Math.sqrt(result?.tech_ar_sum / result?.tech_t_n)
    : Math.sqrt(result?.tech_ar_sum / (result?.tech_t_n - 1));

  // Helper to calculate margin of error value and percent
  const calcMargin = (multiplier) => {
    if (!result) return { value: "N/A", percent: "N/A" };
    const marginVal = Number(result.tech_mor * multiplier).toFixed(2);
    const percentVal = Number(
      multiplier * (Math.sqrt(result.tech_put) / Math.sqrt(result.tech_i)) * 100
    ).toFixed(2);
    return { value: marginVal, percent: percentVal };
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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_stdv_txt" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_stdv_txt"
                    id="tech_stdv_txt"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 12, 23, 45, 33, 65, 54, 54"
                    value={
                      formData.tech_stdv_txt ||
                      "e.g. 12, 23, 45, 33, 65, 54, 54"
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 text-center flex items-center justify-between">
                <div className="d-flex align-items-center">
                  <label className="pe-2" htmlFor="sample">
                    <input
                      type="radio"
                      name="tech_stdv_rad"
                      value="sample"
                      id="sample"
                      className="mr-2 border"
                      onChange={handleChange}
                      checked={formData.tech_stdv_rad === "sample"}
                    />
                    <span>{data?.payload?.tech_lang_keys["2"]}</span>
                  </label>
                  <label className="pe-2" htmlFor="population">
                    <input
                      type="radio"
                      name="tech_stdv_rad"
                      value="population"
                      id="population"
                      className="mr-2 border"
                      onChange={handleChange}
                      checked={formData.tech_stdv_rad === "population"}
                    />
                    <span>{data?.payload?.tech_lang_keys["3"]}</span>
                  </label>
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
                      <div className="text-center">
                        <p className="text-[20px]">
                          <strong>
                            {data?.payload?.tech_lang_keys[4]} {sdSym}
                          </strong>
                        </p>
                        <div className="flex justify-center">
                          <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                            <strong className="text-white">
                              {stdValue.toFixed(4)}
                            </strong>
                          </p>
                        </div>
                      </div>

                      <div className="w-full md:w-[70%] lg:w-[50%] mt-2 overflow-auto">
                        <table className="w-full">
                          <tbody>
                            <tr>
                              <td className="text-black py-2 border-b">
                                <p>{data?.payload?.tech_lang_keys["5"]} (n)</p>
                              </td>
                              <td className="p-2 border-b">
                                <b>{result?.tech_t_n}</b>
                              </td>
                            </tr>
                            <tr>
                              <td className="text-black py-2 border-b">
                                <p>{data?.payload?.tech_lang_keys["6"]} (Σx)</p>
                              </td>
                              <td className="p-2 border-b">
                                <b>{result?.tech_sum}</b>
                              </td>
                            </tr>
                            <tr>
                              <td className="text-black py-2 border-b">
                                <p>
                                  {data?.payload?.tech_lang_keys["7"]} ({mSym})
                                </p>
                              </td>
                              <td className="p-2 border-b">
                                <b>{result?.tech_m}</b>
                              </td>
                            </tr>
                            <tr>
                              <td className="text-black py-2 border-b">
                                <p>
                                  {data?.payload?.tech_lang_keys["8"]} ({sdSym}
                                  ²)
                                </p>
                              </td>
                              <td className="p-2 border-b">
                                <b>{result?.tech_v_2}</b>
                              </td>
                            </tr>
                            <tr>
                              <td className="text-black py-2 border-b">
                                <p>{data?.payload?.tech_lang_keys["9"]}</p>
                              </td>
                              <td className="p-2 border-b">
                                <b>{result?.tech_c}</b>
                              </td>
                            </tr>
                            <tr>
                              <td className="text-black py-2 border-b">
                                <p>
                                  {data?.payload?.tech_lang_keys["10"]} (SE)
                                </p>
                              </td>
                              <td className="p-2 border-b">
                                <b>{result?.tech_s_e}</b>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <p className="w-full mt-2 font-s-20">
                        {data?.payload?.tech_lang_keys["11"]} :
                      </p>
                      <div className="col-12">
                        {isPopulation ? (
                          <BlockMath
                            math={` ${sdSym} = \\sqrt{\\frac{\\sum_{i=1}^n (x_i - \\mu)^2}{n}}`}
                          />
                        ) : (
                          <BlockMath
                            math={` ${sdSym} = \\sqrt{\\frac{\\sum_{i=1}^n (x_i - \\bar{X})^2}{n - 1}}`}
                          />
                        )}
                      </div>

                      <div
                        className="w-full mt-2 overflow-auto"
                        dangerouslySetInnerHTML={{ __html: result?.tech_table }}
                      />

                      <p className="w-full mt-2">
                        {isPopulation ? (
                          <>
                            <BlockMath
                              math={`${sdSym} = \\sqrt{\\frac{SS}{n}}`}
                            />
                            <BlockMath
                              math={`${sdSym} = \\sqrt{\\frac{${result.tech_ar_sum}}{${result.tech_t_n}}}`}
                            />
                            <BlockMath
                              math={`${sdSym} = \\sqrt{${(
                                result.tech_ar_sum / result.tech_t_n
                              ).toFixed(4)}}`}
                            />
                            <BlockMath
                              math={`${sdSym} = ${stdValue.toFixed(4)}`}
                            />
                          </>
                        ) : (
                          <>
                            <BlockMath
                              math={`${sdSym} = \\sqrt{\\frac{SS}{n - 1}}`}
                            />
                            <BlockMath
                              math={`${sdSym} = \\sqrt{\\frac{${
                                result.tech_ar_sum
                              }}{${result.tech_t_n - 1}}}`}
                            />
                            <BlockMath
                              math={`${sdSym} = \\sqrt{${(
                                result.tech_ar_sum /
                                (result.tech_t_n - 1)
                              ).toFixed(4)}}`}
                            />
                            <BlockMath
                              math={`${sdSym} = ${stdValue.toFixed(4)}`}
                            />
                          </>
                        )}
                      </p>

                      {/* Margin of Error Section */}
                      <p className="w-full font-s-20 mt-2">
                        <strong>Margin of Error (Confidence Interval)</strong>
                      </p>
                      <p className="w-full mt-2">
                        Normal distribution gives you an estimation about
                        sampling mean. Consider the equation as under to compute
                        standard error of mean (SEM):
                      </p>
                      <p className="w-full text-[22px] p-2">
                        <InlineMath
                          math={`\\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{N}} = ${stdValue.toFixed(
                            4
                          )}`}
                        />
                      </p>
                      <p className="w-full mt-2">
                        Considering SEM, various confidence levels gives you
                        different error margin estimations. As per the study
                        field, 95% confidence level (significance level = 5%) is
                        what we consider a standard for representing data.
                      </p>

                      <div className="w-full md:w-[70%] lg:w-[70%] mt-2 overflow-auto">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="py-2 border-b text-left">
                                Confidence Level
                              </th>
                              <th className="py-2 border-b text-left">
                                Margin of Error
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-2 border-b">
                                68.3%, σ<sub>x̄</sub>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_m} ±{" "}
                                {Number(result?.tech_mor).toFixed(2)} (±
                                {Number(
                                  (Math.sqrt(result?.tech_put) /
                                    Math.sqrt(result?.tech_i)) *
                                    100
                                ).toFixed(2)}
                                %)
                              </td>
                            </tr>
                            {[1.645, 1.96, 2.576, 3.891, 4.417, 4.892].map(
                              (multiplier) => {
                                const { value, percent } =
                                  calcMargin(multiplier);
                                return (
                                  <tr key={multiplier}>
                                    <td className="py-2 border-b">
                                      {multiplier === 1.645 && "90%"}
                                      {multiplier === 1.96 && "95%"}
                                      {multiplier === 2.576 && "99%"}
                                      {multiplier === 3.891 && "99.99%"}
                                      {multiplier === 4.417 && "99.999%"}
                                      {multiplier === 4.892 && "99.9999%"},
                                      {multiplier}σ<sub>x̄</sub>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_m} ± {value} (±{percent}%)
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>

                      <p className="w-full mt-3 font-s-20">
                        {data?.payload?.tech_lang_keys["12"]}
                      </p>

                      <div className="col-lg-6 mt-2 overflow-auto">
                        <table className="w-100 text-center">
                          <thead>
                            <tr>
                              <th className="py-2 border-b">
                                {data?.payload?.tech_lang_keys["13"]}
                              </th>
                              <th className="py-2 border-b">
                                {data?.payload?.tech_lang_keys["14"]}
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            dangerouslySetInnerHTML={{
                              __html: result?.tech_tablef,
                            }}
                          />
                        </table>
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

export default StandardDeviationCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  usePercentileRankCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PercentileRankCalculator = () => {
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
    tech_x: "12, 23, 45, 33, 65, 54, 54",
    tech_find: 13,
    tech_method: 1, // 1 2
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePercentileRankCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x || !formData.tech_find || !formData.tech_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_find: formData.tech_find,
        tech_method: formData.tech_method,
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
      tech_x: "12, 23, 45, 33, 65, 54, 54",
      tech_find: 13,
      tech_method: 1, // 1 2
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

  const method = formData?.tech_method;
  const findValue = formData?.tech_find;
  const values = result?.tech_values || [];
  const count = result?.tech_count || 0;
  const same = result?.tech_same || 0;
  const pr = result?.tech_pr || 0;
  const total = values.length;

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
            <div className="grid grid-cols-12   gap-4">
              <div className="col-span-12 relative">
                <label htmlFor="tech_x" className="label">
                  Data set (values separated by commas, maximum 50 values):
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 12, 23, 45, 33, 65, 54, 54"
                    value={formData.tech_x || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12  gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_find" className="label">
                  Find percentile rank of:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_find"
                    id="tech_find"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_find}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_method" className="label">
                  Method:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method"
                    id="tech_method"
                    value={formData.tech_method}
                    onChange={handleChange}
                  >
                    <option value="1">Method 1</option>
                    <option value="2">Method 2</option>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-center">
                        <p className="text-[20px]">
                          <strong>Percentile Rank of {findValue} is</strong>
                        </p>
                        <p className="text-[32px] my-3">
                          <strong className="bg-[#2845F5] text-white rounded-lg px-3 py-2">
                            {Math.round(pr)}%
                          </strong>
                        </p>
                      </div>

                      <p className="mt-3 text-[20px]">Solution:</p>
                      <p className="mt-2">
                        As you are looking for the numbers that are equal or
                        less than the value <strong>{findValue}</strong> and
                        represents percentile of the data set, so we have:
                      </p>
                      <p className="mt-2">
                        The first ever step to follow is to arrange the numbers
                        in ascending order which is as follows:
                      </p>
                      <p className="mt-2 font-bold">{values.join(", ")}</p>

                      <p className="mt-2">
                        As you see that <strong>{count}</strong> values are less
                        than the number <strong>{findValue}</strong>, so we
                        calculate the percentile rank of {findValue} by
                        following the formula as under:
                      </p>

                      <p className="mt-3 text-center">
                        {method === 1 ? (
                          <InlineMath math="Percentile\ Rank = \left(\frac{L}{N}\right)\times100" />
                        ) : (
                          <InlineMath math="Percentile\ Rank = \left(\frac{L - 0.5 \times S}{N}\right)\times100" />
                        )}
                      </p>

                      <p className="mt-2">Where:</p>
                      <p className="mt-2">
                        L = values less than or equal to{" "}
                        <strong>{findValue}</strong>
                      </p>
                      <p className="mt-2">
                        N = total number of values in the data set
                      </p>

                      {method === 1 ? (
                        <>
                          <p className="mt-2">So the percentile rank is:</p>
                          <p className="mt-3 text-center">
                            <InlineMath
                              math={`\\text{Percentile Rank = }\\left(\\frac{${count}}{${total}}\\right)(100)`}
                            />
                          </p>
                          <p className="mt-3 text-center">
                            <InlineMath
                              math={`\\text{Percentile Rank = }${(
                                count / total
                              ).toFixed(2)}\\times100`}
                            />
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mt-2">
                            S = data values equal to data value of interest{" "}
                            <strong>{findValue}</strong>
                          </p>
                          <p className="mt-2">So the percentile rank is:</p>
                          <p className="mt-3 text-center">
                            <InlineMath
                              math={`\\text{Percentile Rank = }\\left(\\frac{${count}-0.6 \\times ${same}}{${total}}\\right)(100)`}
                            />
                          </p>
                          <p className="mt-3 text-center">
                            <InlineMath
                              math={`\\text{Percentile Rank = }\\left(\\frac{${(
                                count -
                                0.6 * same
                              ).toFixed(2)}}{${total}}\\right)(100)`}
                            />
                          </p>
                          <p className="mt-3 text-center">
                            <InlineMath
                              math={`\\text{Percentile Rank = }${(
                                (count - 0.6 * same) /
                                total
                              ).toFixed(4)}\\times100`}
                            />
                          </p>
                        </>
                      )}

                      <p className="mt-2">
                        You must remember that percentile is always a whole
                        number. That is why, multiply the fraction by 100 and
                        round it off to the nearest whole number, which is:
                      </p>
                      <p className="mt-2">
                        <InlineMath
                          math={`\\text{Percentile Rank = }${Math.round(
                            pr
                          )}\\%`}
                        />
                      </p>
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

export default PercentileRankCalculator;

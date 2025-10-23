"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useMadCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MeanAbsoluteDeviationCalculator = () => {
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
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    tech_x: "5, 5, 5, 6, 7, 7, 7, 9, 9, 10",
    tech_method: 1,
    tech_m: 10,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMadCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_method: formData.tech_method,
        tech_m: formData.tech_m,
      }).unwrap();
      setResult(response?.payload);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  const handleReset = () => {
    setFormData({
      tech_x: "5, 5, 5, 6, 7, 7, 7, 9, 9, 10",
      tech_method: 1,
      tech_m: 10,
    });
    setResult(null);
    setFormError(null);
  };

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

  // result
  let methodText = "";
  if (result?.tech_method == 0) {
    methodText = data?.payload?.tech_lang_keys?.[7];
  } else if (result?.tech_method == 1) {
    methodText = data?.payload?.tech_lang_keys?.[8];
  } else {
    methodText = data?.payload?.tech_lang_keys?.[9];
  }

  const mad = result?.tech_mad;
  const mean = result?.tech_mean;
  const m = result?.tech_m;
  const x = result?.tech_x || "";
  const diff = result?.tech_diff || [];
  const diff_sum = result?.tech_sum1 || 0;
  const median = result?.tech_median;
  const diff1 = result?.tech_diff1 || [];

  const datax = x
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
  const n = datax.length;

  // Sort a copy of data for display
  const sortedData = [...datax].sort((a, b) => Number(a) - Number(b));
  const sortedDiff1 = [...diff1].sort((a, b) => Number(a) - Number(b));
  const center = n / 2;

  const diff_sum1 = result?.tech_sum ?? 0;

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
          path: pathname,
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
            <div className="grid grid-cols-1   gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12 px-2">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (m):
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
                    <option value="0">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 px-2 flex items-center justify-center">
                <label htmlFor="method" className="label">
                  &nbsp;
                </label>
                <img
                  src="/images/mad_formula.webp"
                  width="165"
                  height="50"
                  loading="lazy"
                  alt="MAD Formula"
                />
              </div>
              {formData.tech_method == "2" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 px-2 point ">
                    <label htmlFor="tech_m" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (m):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_m"
                        id="tech_m"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_m}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-12 px-2">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["6"]} (,):
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 12, 23, 45, 33, 65, 54, 54"
                    value={formData.tech_x}
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
                        <div className="text-center">
                          <p className="text-[20px]">
                            <strong>{methodText}</strong>
                          </p>
                          <p className="text-[25px] bg-[#2845F5] px-3 py-2 rounded-lg inline-block my-3">
                            <strong className="text-white">
                              {result?.tech_mad}
                            </strong>
                          </p>
                          <p className="text-left font-bold text-[18px]">
                            {data?.payload?.tech_lang_keys["10"]}
                          </p>
                        </div>

                        {result?.tech_mean ? (
                          <>
                            {/* Line 1 - Mean */}
                            <div>
                              <div className="w-full mt-2 text-[18px]">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 1:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["12"]}:</b>
                              </div>
                              <div className="w-full mt-1">
                                (
                                {datax.map((val, index) => (
                                  <span key={index}>
                                    {val}
                                    {index + 1 !== n ? " + " : ""}
                                  </span>
                                ))}
                                ) / {n} = {mean}
                              </div>
                            </div>

                            {/* Line 2 - Difference */}
                            <div>
                              <div className="w-full mt-3 text-[18px]">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 2:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["13"]}:</b>
                              </div>
                              <div className="w-full mt-1">
                                {datax.map((val, index) => (
                                  <div key={index}>
                                    {data?.payload?.tech_lang_keys["14"]} {val}{" "}
                                    and {mean} is {diff[index]}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Line 3 - Sum of differences */}
                            <div>
                              <div className="w-full mt-3 text-[16px]">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 3:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["15"]}:</b>
                              </div>
                              <div className="w-full mt-1">
                                {diff.map((val, index) => (
                                  <span key={index}>
                                    {val}
                                    {index + 1 !== n ? " + " : ""}
                                  </span>
                                ))}{" "}
                                = {diff_sum}
                              </div>
                            </div>

                            {/* Line 4 - MAD */}
                            <div>
                              <div className="w-full mt-3 text-[16px]">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 4:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["16"]}:</b>
                              </div>
                              <div className="w-full mt-1">
                                {diff_sum} / {n} = {(diff_sum / n).toFixed(1)}
                                <br />
                                {data?.payload?.tech_lang_keys["17"]}{" "}
                                <b>{data?.payload?.tech_lang_keys["9"]}</b> ={" "}
                                {mad}
                              </div>
                            </div>
                          </>
                        ) : result?.tech_median ? (
                          <>
                            {/* Section 1 */}
                            <div>
                              <div className="w-full mt-2 text-[16px]">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 1:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["18"]}:</b>
                              </div>

                              {/* Section 1.1 */}
                              <div className="w-full mt-2 text-[16px] ms-3">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 1:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["19"]}:</b>
                              </div>

                              <div className="w-full mt-1 ms-3">
                                <span>
                                  <b>{data?.payload?.tech_lang_keys["20"]}:</b>{" "}
                                  {datax.map((val, i) => (
                                    <span key={"data-" + i}>
                                      {val}
                                      {i + 1 !== n ? ", " : ""}
                                    </span>
                                  ))}
                                </span>
                                <br />
                                <span>
                                  <b>{data?.payload?.tech_lang_keys["21"]}:</b>
                                  &nbsp;&nbsp;
                                  {sortedData.map((val, i) => (
                                    <span key={"sortedData-" + i}>
                                      {val}
                                      {i + 1 !== n ? ", " : ""}
                                    </span>
                                  ))}
                                </span>
                              </div>
                            </div>
                            {/* Section 2 */}
                            <div>
                              <div className="w-full mt-2 text-[16px] ms-3">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 2:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["22"]}:</b>
                              </div>
                              <div className="w-full mt-1 ms-3">
                                <span>
                                  {data?.payload?.tech_lang_keys["23"]} 2
                                  <br />
                                  <span>
                                    {n} / 2 = {center} =&nbsp;{" "}
                                    {Math.round(center)}
                                  </span>
                                </span>
                              </div>
                            </div>

                            {/* Section 3 */}
                            <div>
                              <div className="w-full mt-2 text-[16px] ms-3">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 3:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["24"]}:</b>
                              </div>
                              <div
                                className="w-full mt-1 ms-3"
                                dangerouslySetInnerHTML={{
                                  __html: `${data?.payload?.tech_lang_keys["17"]} <b>${data?.payload?.tech_lang_keys["3"]}</b> = ${median}`,
                                }}
                              />
                            </div>

                            {/* Section 4 */}
                            <div>
                              <div className="w-full mt-3 text-[16px]">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 2:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["13"]}:</b>
                              </div>
                              <div className="w-full mt-1">
                                {datax.map((val, i) => (
                                  <div key={"diff-" + i}>
                                    {data?.payload?.tech_lang_keys["14"]} {val}{" "}
                                    and {median} is {diff[i]}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Section 5 */}
                            <div>
                              <div className="w-full mt-3 text-[16px]">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 3:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["25"]}:</b>
                              </div>
                            </div>

                            {/* Section 5.1 */}
                            <div>
                              <div className="w-full mt-2 text-[16px] ms-3">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 1:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["19"]}:</b>
                              </div>

                              <div className="w-full mt-1 ms-3">
                                <span>
                                  <b>{data?.payload?.tech_lang_keys["20"]}:</b>{" "}
                                  {diff.map((val, i) => (
                                    <span key={"diffvals-" + i}>
                                      {val}
                                      {i + 1 !== n ? ", " : ""}
                                    </span>
                                  ))}
                                </span>
                                <br />
                                <span>
                                  <b>{data?.payload?.tech_lang_keys["21"]}:</b>
                                  &nbsp;&nbsp;
                                  {sortedDiff1.map((val, i) => (
                                    <span key={"sortedDiff1-" + i}>
                                      {val}
                                      {i + 1 !== n ? ", " : ""}
                                    </span>
                                  ))}
                                </span>
                              </div>
                            </div>

                            {/* Section 5.2 */}
                            <div>
                              <div className="w-full mt-2 text-[16px] ms-3">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 2:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["22"]}:</b>
                              </div>
                              <div className="w-full mt-1 ms-3">
                                <span>
                                  {data?.payload?.tech_lang_keys["23"]} 2
                                  <br />
                                  <span>
                                    {n} / 2 = {center} =&nbsp;{" "}
                                    {Math.round(center)}
                                  </span>
                                </span>
                              </div>
                            </div>

                            {/* Section 6 */}
                            <div>
                              <div className="w-full mt-3 text-[16px]">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 4:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["24"]}:</b>
                              </div>
                              <div className="w-full mt-1">
                                So, the <b>MAD</b> = {mad}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <div className="w-full mt-3 text-[16px]">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 1:{" "}
                                </span>
                                <b>
                                  {data?.payload?.tech_lang_keys["26"]} (m):
                                </b>
                              </div>
                              <div className="w-full mt-1">
                                {datax.map((val, i) => (
                                  <div key={"diff-line-" + i}>
                                    {data?.payload?.tech_lang_keys["14"]} {val}{" "}
                                    and {m} is {diff[i]}
                                  </div>
                                ))}
                              </div>

                              <div className="w-full mt-3 text-[16px]">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 2:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["15"]}:</b>
                              </div>
                              <div className="w-full mt-1">
                                {diff.map((val, i) => (
                                  <span key={"diff-sum-" + i}>
                                    {val}
                                    {i + 1 !== n ? "+" : ""}
                                  </span>
                                ))}
                                {" = " + diff_sum1}
                              </div>

                              <div className="w-full mt-3 text-[16px]">
                                <span className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]} 3:{" "}
                                </span>
                                <b>{data?.payload?.tech_lang_keys["16"]}:</b>
                              </div>
                              <div className="w-full mt-1">
                                {diff_sum1} / {n} ={" "}
                                {Math.round((diff_sum1 / n) * 10) / 10}
                                <br />
                                {data?.payload?.tech_lang_keys["17"]}{" "}
                                <b>{data?.payload?.tech_lang_keys["9"]}</b> ={" "}
                                {mad}
                              </div>
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

export default MeanAbsoluteDeviationCalculator;

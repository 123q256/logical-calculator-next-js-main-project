"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useNntCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const NntCalculator = () => {
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
    tech_outcome: "per", // yrs  per
    tech_first: "7",
    tech_second: "15",
    tech_third: "10",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useNntCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_outcome ||
      !formData.tech_first ||
      !formData.tech_second ||
      !formData.tech_third
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_outcome: formData.tech_outcome,
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
        tech_third: formData.tech_third,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_outcome: "per", // yrs  per
      tech_first: "7",
      tech_second: "15",
      tech_third: "10",
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
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_outcome" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_outcome"
                    id="tech_outcome"
                    value={formData.tech_outcome}
                    onChange={handleChange}
                  >
                    <option value="per">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="yrs">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_outcome == "yrs" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  ">
                    <label htmlFor="tech_first" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_first"
                        id="tech_first"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_first}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_second" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_second"
                    id="tech_second"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_second}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_third" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_third"
                    id="tech_third"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_third}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full p-3 mt-3">
                      <div className="w-full">
                        <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4 mb-5">
                          <div className="col-span-12 md:col-span-12 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg px-3 py-2">
                              <span>
                                {data?.payload?.tech_lang_keys[6]} (ARR) ={" "}
                              </span>
                              <strong className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                {Number(result?.tech_arr).toFixed(2)}
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-12 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg px-3 py-2">
                              <span>
                                {data?.payload?.tech_lang_keys[7]} (NNT) ={" "}
                              </span>
                              <strong className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                {Number(result?.tech_nnt).toFixed(2)}
                              </strong>
                            </div>
                          </div>
                        </div>

                        <p>
                          {data?.payload?.tech_lang_keys[8]}{" "}
                          <strong>
                            {Number(Math.abs(result?.tech_nnt)).toFixed(2)}
                          </strong>{" "}
                          {data?.payload?.tech_lang_keys[9]}
                        </p>

                        <p className="mb-1">
                          <strong className="text-blue font-s-18">
                            {data?.payload?.tech_lang_keys[10]}:
                          </strong>
                        </p>

                        {formData?.tech_outcome === "per" ? (
                          <>
                            <p>
                              ARR = ({data?.payload?.tech_lang_keys[11]}{" "}
                              {data?.payload?.tech_lang_keys[12]}{" "}
                              {data?.payload?.tech_lang_keys[13]}) - (
                              {data?.payload?.tech_lang_keys[16]}{" "}
                              {data?.payload?.tech_lang_keys[12]}{" "}
                              {data?.payload?.tech_lang_keys[13]})
                            </p>
                            <p>
                              ARR = {formData?.tech_second / 100} -{" "}
                              {formData?.tech_third / 100} = {result?.tech_arr}
                            </p>
                            <p className="mt-1">
                              <span>NNT = </span>
                              <span className="fraction">
                                <span className="num">1</span>
                                <span className="visually-hidden"></span>
                                <span className="den">ARR</span>
                              </span>
                              <span> = </span>
                              <span className="fraction">
                                <span className="num">1</span>
                                <span className="visually-hidden"></span>
                                <span className="den">{result?.tech_arr}</span>
                              </span>
                              <span> = {result?.tech_nnt}</span>
                            </p>
                          </>
                        ) : (
                          <>
                            {/* <p className="mt-1">
                                <MathJax>
                                  {`\\( R_0 = 1 - e^{\\frac{-${data?.payload?.tech_lang_keys[11]}\\;${data?.payload?.tech_lang_keys[14]}}{${data?.payload?.tech_lang_keys[15]}}} \\)`}
                                </MathJax>
                              </p>
                              <p className="mt-1">
                                <MathJax>
                                  {`\\( R_1 = 1 - e^{\\frac{-${data?.payload?.tech_lang_keys[16]}\\;${data?.payload?.tech_lang_keys[14]}}{${data?.payload?.tech_lang_keys[15]}}} \\)`}
                                </MathJax>
                              </p>
                              <p className="mt-1">
                                <MathJax>
                                  {`\\( ARR = R_0 - R_1 = ${result?.tech_arr} \\)`}
                                </MathJax>
                              </p>
                              <p className="mt-1">
                                <MathJax>
                                  {`\\( NNT = \\frac{1}{ARR} = \\frac{1}{${result?.tech_arr}} = ${result?.tech_nnt} \\)`}
                                </MathJax>
                              </p> */}
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

export default NntCalculator;

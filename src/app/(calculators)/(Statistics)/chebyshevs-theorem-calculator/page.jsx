"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useChebyshevsTheoremCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ChebyshevsTheoremCalculator = () => {
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
    tech_operations: Number(3), // 3 4 5 6
    tech_first: 3,
    tech_second: 3,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useChebyshevsTheoremCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: Number(formData.tech_operations),
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
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
      tech_operations: Number(3), // 3 4 5 6
      tech_first: 3,
      tech_second: 3,
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
            <div className="grid grid-cols-1    gap-1">
              <div className="col-span-12 px-2">
                <label htmlFor="tech_operations" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_operations"
                    id="tech_operations"
                    value={formData.tech_operations}
                    onChange={handleChange}
                  >
                    <option value="3">
                      {data?.payload?.tech_lang_keys["2"]} 1
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["2"]} 2
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "4" ||
                formData.tech_operations == "5") && (
                <>
                  <div className="col-span-12 px-2" id="f_div">
                    {formData.tech_operations == "5" ? (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["3"]} (p):
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["5"]} (k):
                        </label>
                      </>
                    )}

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
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "4" ||
                formData.tech_operations == "6") && (
                <>
                  <div className="col-span-12 px-2" id="s_div">
                    {formData.tech_operations == "5" ? (
                      <>
                        <label htmlFor="tech_second" className="label">
                          {data?.payload?.tech_lang_keys["3"]} (p):
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_second" className="label">
                          {data?.payload?.tech_lang_keys["4"]} :
                        </label>
                      </>
                    )}

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
                      {result?.tech_operations == 3 ||
                      result?.tech_operations == 4 ? (
                        <>
                          <div className="text-center">
                            <p className="text-[20px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]}
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  {result?.tech_final_sans}%
                                </strong>
                              </p>
                            </div>
                          </div>
                          <p className="w-full mt-3 text-[18px] text-center">
                            {data?.payload?.tech_lang_keys[9]}{" "}
                            <strong>{result?.tech_pehla}</strong>,{" "}
                            {data?.payload?.tech_lang_keys[10]} E(X){" "}
                            {data?.payload?.tech_lang_keys[11]}{" "}
                            <strong>{result?.tech_final_fans}</strong>.
                          </p>
                        </>
                      ) : result?.tech_operations == 5 ? (
                        <>
                          <div className="text-center">
                            <p className="text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]}
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  <InlineMath
                                    math={`P(|X - μ| < kσ) ≥ ${result?.tech_final_sans}`}
                                  />
                                </strong>
                              </p>
                            </div>
                          </div>
                          <p className="w-full mt-3 text-[20px]">
                            <b className="text-blue">
                              {data?.payload?.tech_lang_keys[12]}
                            </b>
                          </p>
                          <p className="w-full mt-2 text-[18px]">
                            {data?.payload?.tech_lang_keys[13]} x{" "}
                            {data?.payload?.tech_lang_keys[14]}{" "}
                            <strong>{formData?.tech_first}</strong>{" "}
                            {data?.payload?.tech_lang_keys[15]}?
                          </p>
                          <p className="w-full mt-3 text-[20px]">
                            <b className="text-blue">
                              {data?.payload?.tech_lang_keys[8]}:
                            </b>
                          </p>
                          <p className="w-full mt-2 text-[18px]">
                            {data?.payload?.tech_lang_keys[16]}:
                          </p>
                          <p className="w-full mt-2 text-center">
                            <InlineMath math="P(|X - μ| < kσ) ≥ 1 - \frac{1}{k^2}" />
                          </p>
                          <p className="w-full mt-2 text-[18px]">
                            {data?.payload?.tech_lang_keys[17]}{" "}
                            <strong>{formData?.tech_first}</strong>{" "}
                            {data?.payload?.tech_lang_keys[18]}:
                          </p>
                          <p className="w-full mt-2 text-center">
                            <InlineMath
                              math={`P(|X - μ| < ${formData?.tech_first}σ) ≥ 1 - \\frac{1}{${formData?.tech_first}^2}`}
                            />
                          </p>
                          <p className="w-full mt-2 text-center">
                            <InlineMath
                              math={`P(|X - μ| < ${formData?.tech_first}σ) ≥ 1 - \\frac{1}{${result?.tech_pehla}}`}
                            />
                          </p>
                          <p className="w-full mt-2 text-center">
                            <InlineMath
                              math={`P(|X - μ| < kσ) ≥ 1 - ${result?.tech_final_fans}`}
                            />
                          </p>
                          <p className="w-full mt-2 text-center">
                            <InlineMath
                              math={`P(|X - μ| < kσ) ≥ ${result?.tech_final_sans}`}
                            />
                          </p>
                        </>
                      ) : result?.tech_operations == 6 ? (
                        <>
                          <div className="text-center">
                            <p className="text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]}
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  <InlineMath
                                    math={`k = ${result?.tech_final_sans}`}
                                  />
                                </strong>
                              </p>
                            </div>
                          </div>
                          <p className="w-full mt-2 text-[20px]">
                            <b className="text-blue">
                              {data?.payload?.tech_lang_keys[12]}
                            </b>
                          </p>
                          <p className="w-full mt-2 text-[18px]">
                            {data?.payload?.tech_lang_keys[19]} k{" "}
                            {data?.payload?.tech_lang_keys[20]} x{" "}
                            {data?.payload?.tech_lang_keys[21]} k{" "}
                            {data?.payload?.tech_lang_keys[22]}:
                          </p>
                          <p className="w-full mt-2 text-center">
                            <InlineMath math="k = \sqrt{\frac{1}{1 - P(x - μ < kσ)}}" />
                          </p>
                          <p className="w-full mt-2 text-[20px]">
                            <b className="text-blue">
                              {data?.payload?.tech_lang_keys[8]}:
                            </b>
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys[23]}} \\ P(x - μ < kσ) = ${formData?.tech_first}, \\text{${data?.payload?.tech_lang_keys[24]}}:`}
                            />
                          </p>
                          <p className="w-full mt-2 text-center">
                            <InlineMath
                              math={`k = \\sqrt{\\frac{1}{1 - ${formData?.tech_first}}}`}
                            />
                          </p>
                          <p className="w-full mt-2 text-center">
                            <InlineMath
                              math={`k = \\sqrt{\\frac{1}{${result?.tech_pehla}}}`}
                            />
                          </p>
                          <p className="w-full mt-2 text-center">
                            <InlineMath
                              math={`k = \\sqrt{${result?.tech_final_fans}}`}
                            />
                          </p>
                          <p className="w-full mt-2 text-center">
                            <InlineMath
                              math={`k = ${result?.tech_final_sans}`}
                            />
                          </p>
                        </>
                      ) : null}
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

export default ChebyshevsTheoremCalculator;

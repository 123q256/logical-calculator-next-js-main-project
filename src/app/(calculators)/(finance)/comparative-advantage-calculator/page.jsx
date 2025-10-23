"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useComparativeAdvantageCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ComparativeAdvantageCalculator = () => {
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
    tech_first: 35,
    tech_second: 15,
    tech_third: 45,
    tech_four: 25,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useComparativeAdvantageCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_first ||
      !formData.tech_second ||
      !formData.tech_third ||
      !formData.tech_four
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
        tech_third: formData.tech_third,
        tech_four: formData.tech_four,
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
      tech_first: 35,
      tech_second: 15,
      tech_third: 45,
      tech_four: 25,
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[70%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <p>
                  <strong>{data?.payload?.tech_lang_keys[3]}</strong>
                </p>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_first" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_first"
                    id="tech_first"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_first}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_second" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_second"
                    id="tech_second"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_second}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12">
                <p className="py-2">
                  <strong>{data?.payload?.tech_lang_keys[4]}</strong>
                </p>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_third" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_third"
                    id="tech_third"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_third}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_four" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_four"
                    id="tech_four"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_four}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[80%] lg:w-[80%] mt-2 overflow-auto">
                        <p className="mt-3 text-[20px]">
                          <strong>{data?.payload?.tech_lang_keys[3]}</strong>
                        </p>
                        <table className="w-full lg:text-[18px] text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["5"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_X_A}{" "}
                                {data?.payload?.tech_lang_keys[10]}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["6"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_X_B}{" "}
                                {data?.payload?.tech_lang_keys[9]}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div>
                          <p className="mt-2">
                            <strong>{data?.payload?.tech_lang_keys[4]}</strong>
                          </p>
                          <table className="w-full text-[18px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_Y_A}{" "}
                                  {data?.payload?.tech_lang_keys[10]}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["6"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_Y_B}{" "}
                                  {data?.payload?.tech_lang_keys[9]}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="col-12 font-s-16">
                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys[8]}</strong>
                        </p>
                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys[3]}</strong>
                        </p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[7]} ={" "}
                          {data?.payload?.tech_lang_keys[1]} /{" "}
                          {data?.payload?.tech_lang_keys[2]}
                        </p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[7]} ={" "}
                          {formData?.tech_first} / {formData?.tech_second}
                        </p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[7]} ={" "}
                          {result?.tech_X_B}
                        </p>
                        <p className="mt-3">
                          {" "}
                          {data?.payload?.tech_lang_keys[11]},
                        </p>
                        <p className="mt-3">
                          {" "}
                          {data?.payload?.tech_lang_keys[6]}{" "}
                          <strong>{result?.tech_X_B}</strong> (
                          {data?.payload?.tech_lang_keys[9]}){" "}
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[7]} ={" "}
                          {data?.payload?.tech_lang_keys[2]} /{" "}
                          {data?.payload?.tech_lang_keys[1]}
                        </p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[7]} ={" "}
                          {formData?.tech_second} / {formData?.tech_first}
                        </p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[7]}= {result?.tech_X_A}
                        </p>
                        <p className="mt-3">
                          {" "}
                          {data?.payload?.tech_lang_keys[12]},
                        </p>
                        <p className="mt-3">
                          {" "}
                          {data?.payload?.tech_lang_keys[5]}{" "}
                          <strong>{result?.tech_X_A}</strong> (
                          {data?.payload?.tech_lang_keys[10]})
                        </p>
                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys[4]}</strong>
                        </p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[7]} ={" "}
                          {data?.payload?.tech_lang_keys[1]} /{" "}
                          {data?.payload?.tech_lang_keys[2]}
                        </p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[7]} ={" "}
                          {formData?.tech_third} / {formData?.tech_four}
                        </p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[7]} ={" "}
                          {result?.tech_Y_B}
                        </p>
                        <p className="mt-3">
                          {" "}
                          {data?.payload?.tech_lang_keys[11]},
                        </p>
                        <p className="mt-3">
                          {" "}
                          {data?.payload?.tech_lang_keys[6]}{" "}
                          <strong>{result?.tech_Y_B}</strong> (
                          {data?.payload?.tech_lang_keys[9]})
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[7]} ={" "}
                          {data?.payload?.tech_lang_keys[2]} /{" "}
                          {data?.payload?.tech_lang_keys[1]}
                        </p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[7]}={" "}
                          {formData?.tech_four} / {formData?.tech_third}
                        </p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys[7]} ={" "}
                          {result?.tech_Y_A}
                        </p>
                        <p className="mt-3">
                          {" "}
                          {data?.payload?.tech_lang_keys[12]},
                        </p>
                        <p className="mt-3">
                          {" "}
                          {data?.payload?.tech_lang_keys[5]}{" "}
                          <strong>{result?.tech_Y_A}</strong> (
                          {data?.payload?.tech_lang_keys[10]})
                        </p>
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

export default ComparativeAdvantageCalculator;

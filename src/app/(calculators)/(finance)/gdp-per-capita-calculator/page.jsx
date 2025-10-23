"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useGDPPerCapitaCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GdpPerCapitaCalculator = () => {
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
    tech_real: 5,
    tech_real_unit: "million", //thousand  million  billion
    tech_population: 4,
    tech_population_unit: "thousand", //thousand  million  billion
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGDPPerCapitaCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_real ||
      !formData.tech_real_unit ||
      !formData.tech_population ||
      !formData.tech_population_unit
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_real: formData.tech_real,
        tech_real_unit: formData.tech_real_unit,
        tech_population: formData.tech_population,
        tech_population_unit: formData.tech_population_unit,
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
      tech_real: 5,
      tech_real_unit: "million", //thousand  million  billion
      tech_population: 4,
      tech_population_unit: "thousand", //thousand  million  billion
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_real" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_real"
                    id="tech_real"
                    className="input my-2"
                    aria-label="input"
                    placeholder="413"
                    value={formData.tech_real}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_real_unit" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_real_unit"
                    id="tech_real_unit"
                    value={formData.tech_real_unit}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys["6"]}>
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["7"]}>
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["8"]}>
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_population" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_population"
                    id="tech_population"
                    className="input my-2"
                    aria-label="input"
                    placeholder="413"
                    value={formData.tech_population}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_population_unit" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_population_unit"
                    id="tech_population_unit"
                    value={formData.tech_population_unit}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys["6"]}>
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["7"]}>
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["8"]}>
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                  </select>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%]  mt-2">
                        <table className="w-full text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[3]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_answer).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-12 text-[16px]">
                        <p className="mt-2">
                          <strong>{data?.payload?.tech_lang_keys["4"]}</strong>
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["5"]}.
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["3"]} =
                          <span
                            className="fractionUpDown"
                            aria-label="fractionUpDown with sum over count"
                          >
                            <span className="num">
                              {data?.payload?.tech_lang_keys["1"]}
                            </span>
                            <span className="visually-hidden"> / </span>
                            <span className="den">
                              {data?.payload?.tech_lang_keys["2"]}
                            </span>
                          </span>
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["3"]} =
                          <span
                            className="fractionUpDown"
                            aria-label="fractionUpDown with sum over count"
                          >
                            <span className="num">
                              {formData?.tech_real} ({formData?.tech_real_unit}{" "}
                              )
                            </span>
                            <span className="visually-hidden"> / </span>
                            <span className="den">
                              {formData?.tech_population} (
                              {formData?.tech_population_unit})
                            </span>
                          </span>
                        </p>
                        <p className="mt-2">
                          {" "}
                          {data?.payload?.tech_lang_keys["3"]} ={" "}
                          {Number(result?.tech_answer).toFixed(2)}
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

export default GdpPerCapitaCalculator;

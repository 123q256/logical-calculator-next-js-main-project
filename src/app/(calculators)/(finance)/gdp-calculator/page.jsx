"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useGDPCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GdpCalculator = () => {
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
    tech_consumption: "102",
    tech_consumption_unit: "billion",
    tech_investment: "8",
    tech_investment_unit: "billion",
    tech_purchases: "6",
    tech_purchases_unit: "trillion", // trillion  million   billion
    tech_exports: "4",
    tech_exports_unit: "trillion",
    tech_imports: "2",
    tech_imports_unit: "billion",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGDPCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_consumption ||
      !formData.tech_consumption_unit ||
      !formData.tech_investment ||
      !formData.tech_investment_unit ||
      !formData.tech_purchases ||
      !formData.tech_purchases_unit ||
      !formData.tech_exports ||
      !formData.tech_exports_unit ||
      !formData.tech_imports ||
      !formData.tech_imports_unit
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_consumption: formData.tech_consumption,
        tech_consumption_unit: formData.tech_consumption_unit,
        tech_investment: formData.tech_investment,
        tech_investment_unit: formData.tech_investment_unit,
        tech_purchases: formData.tech_purchases,
        tech_purchases_unit: formData.tech_purchases_unit,
        tech_exports: formData.tech_exports,
        tech_exports_unit: formData.tech_exports_unit,
        tech_imports: formData.tech_imports,
        tech_imports_unit: formData.tech_imports_unit,
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
      tech_consumption: "102",
      tech_consumption_unit: "billion",
      tech_investment: "8",
      tech_investment_unit: "billion",
      tech_purchases: "6",
      tech_purchases_unit: "trillion", // trillion  million   billion
      tech_exports: "4",
      tech_exports_unit: "trillion",
      tech_imports: "2",
      tech_imports_unit: "billion",
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
                <label htmlFor="tech_consumption" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_consumption"
                    id="tech_consumption"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_consumption}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_consumption_unit" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_consumption_unit"
                    id="tech_consumption_unit"
                    value={formData.tech_consumption_unit}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys["6"]}>
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["7"]}>
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["8"]}>
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_investment" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_investment"
                    id="tech_investment"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_investment}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_investment_unit" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_investment_unit"
                    id="tech_investment_unit"
                    value={formData.tech_investment_unit}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys["6"]}>
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["7"]}>
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["8"]}>
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_purchases" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_purchases"
                    id="tech_purchases"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_purchases}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_purchases_unit" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_purchases_unit"
                    id="tech_purchases_unit"
                    value={formData.tech_purchases_unit}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys["6"]}>
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["7"]}>
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["8"]}>
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_exports" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_exports"
                    id="tech_exports"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_exports}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_exports_unit" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_exports_unit"
                    id="tech_exports_unit"
                    value={formData.tech_exports_unit}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys["6"]}>
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["7"]}>
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["8"]}>
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_imports" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_imports"
                    id="tech_imports"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_imports}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_imports_unit" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_imports_unit"
                    id="tech_imports_unit"
                    value={formData.tech_imports_unit}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys["6"]}>
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["7"]}>
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["8"]}>
                      {data?.payload?.tech_lang_keys["8"]}
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
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
                      <div className="w-full md:w-[60%] lg:w-[60%]  mt-2">
                        <table className="w-full text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="50%">
                                <strong>GDP </strong>
                              </td>
                              <td className="py-2 border-b">
                                {Number(result?.tech_gdp).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="50%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["9"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_net_export, 2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-[16px] mt-2">
                        <p className="mt-2">
                          <strong>{data?.payload?.tech_lang_keys["10"]}</strong>
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["11"]}.
                        </p>
                        <p className="mt-2">
                          GDP = {data?.payload?.tech_lang_keys["1"]} +{" "}
                          {data?.payload?.tech_lang_keys["2"]} +{" "}
                          {data?.payload?.tech_lang_keys["3"]} +
                          {data?.payload?.tech_lang_keys["9"]}
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["12"]}.
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["9"]} ={" "}
                          {data?.payload?.tech_lang_keys["4"]}-{" "}
                          {data?.payload?.tech_lang_keys["5"]}
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["9"]} ={" "}
                          {formData?.tech_exports}-{formData?.tech_imports}
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["9"]} ={" "}
                          {Number(result?.tech_net_export).toFixed(2)}
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["13"]}:
                        </p>
                        <p className="mt-2">
                          GDP = {formData?.tech_consumption} +
                          {formData?.tech_investment} +
                          {formData?.tech_purchases} +{" "}
                          {Number(result?.tech_net_export).toFixed(2)}
                        </p>
                        <p className="mt-2">
                          GDP = {Number(result?.tech_gdp).toFixed(2)}
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

export default GdpCalculator;

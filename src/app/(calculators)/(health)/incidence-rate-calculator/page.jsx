"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useIncidenceRateCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ActivationEnergyCalculator = () => {
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

  console.log(data);

  const [formData, setFormData] = useState({
    tech_cases: "10",
    tech_risk: "100",
    tech_different_unit: "Yes",
    tech_population: "1000",
    tech_per: "100000",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useIncidenceRateCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_cases ||
      !formData.tech_risk ||
      !formData.tech_different_unit ||
      !formData.tech_population ||
      !formData.tech_per
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cases: formData.tech_cases,
        tech_risk: formData.tech_risk,
        tech_different_unit: formData.tech_different_unit,
        tech_population: formData.tech_population,
        tech_per: formData.tech_per,
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
      tech_cases: "10",
      tech_risk: "100",
      tech_different_unit: "Yes",
      tech_population: "1000",
      tech_per: "100000",
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_cases" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <input
                  type="number"
                  step="any"
                  name="tech_cases"
                  id="tech_cases"
                  className="input my-2"
                  aria-label="input"
                  placeholder="00"
                  min="0"
                  value={formData.tech_cases}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_risk" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <input
                  type="number"
                  step="any"
                  name="tech_risk"
                  id="tech_risk"
                  className="input my-2"
                  aria-label="input"
                  placeholder="00"
                  min="0"
                  value={formData.tech_risk}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_different_unit" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_different_unit"
                    id="tech_different_unit"
                    value={formData.tech_different_unit}
                    onChange={handleChange}
                  >
                    <option value="Yes">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="No">
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 population">
                <label htmlFor="tech_population" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <input
                  type="number"
                  step="any"
                  name="tech_population"
                  id="tech_population"
                  className="input my-2"
                  aria-label="input"
                  placeholder="00"
                  min="0"
                  value={formData.tech_population}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 per hidden">
                <label htmlFor="tech_per" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_per"
                    id="tech_per"
                    value={formData.tech_per}
                    onChange={handleChange}
                  >
                    <option value="1000">1000</option>
                    <option value="10000">10000 </option>
                    <option value="100000">100000 </option>
                    <option value="1000000">1000000 </option>
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
              <div className="w-full bg-white result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <p>
                          <strong>{data?.payload?.tech_lang_keys[8]}:</strong>
                        </p>
                        <p>
                          <strong className="text-[#119154] text-[32px]">
                            {Number(result?.tech_answer).toFixed(0)}
                          </strong>
                        </p>
                        <p>
                          <strong className="text-[20px]">
                            {data?.payload?.tech_lang_keys[9]}:
                          </strong>
                        </p>

                        {formData?.tech_different_unit === "Yes" ? (
                          <>
                            <p>{data?.payload?.tech_lang_keys[10]}.</p>
                            <p>
                              {data?.payload?.tech_lang_keys[8]} ={" "}
                              {data?.payload?.tech_lang_keys[1]} /{" "}
                              {data?.payload?.tech_lang_keys[2]} *{" "}
                              {data?.payload?.tech_lang_keys[4]}
                            </p>
                            <p>
                              {data?.payload?.tech_lang_keys[8]} ={" "}
                              {formData?.tech_cases} / {formData?.tech_risk} *{" "}
                              {formData?.tech_population}
                            </p>
                            <p>
                              {data?.payload?.tech_lang_keys[8]} ={" "}
                              {Number(result?.tech_answer).toFixed(0)}
                            </p>
                          </>
                        ) : formData?.tech_different_unit === "No" ? (
                          <>
                            <p>{data?.payload?.tech_lang_keys[10]}</p>
                            <p>
                              {data?.payload?.tech_lang_keys[8]} ={" "}
                              {data?.payload?.tech_lang_keys[2]} /{" "}
                              {data?.payload?.tech_lang_keys[4]} *{" "}
                              {data?.payload?.tech_lang_keys[5]}
                            </p>
                            <p>
                              {data?.payload?.tech_lang_keys[8]} ={" "}
                              {formData?.tech_cases} / {formData?.tech_risk} *{" "}
                              {formData?.tech_population}
                            </p>
                            <p>
                              {data?.payload?.tech_lang_keys[8]} ={" "}
                              {Number(result?.tech_answer).toFixed(0)}
                            </p>
                          </>
                        ) : null}
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

export default ActivationEnergyCalculator;

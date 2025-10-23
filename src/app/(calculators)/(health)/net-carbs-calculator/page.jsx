"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useNetCarbsCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const NetCarbsCalculator = () => {
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
    tech_serving: "per 100 g",
    tech_location: "no",
    tech_carbohydrates: "5",
    tech_fiber: "5",
    tech_alcohol: "30",
    tech_contains: "yes",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useNetCarbsCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_serving ||
      !formData.tech_location ||
      !formData.tech_carbohydrates ||
      !formData.tech_fiber ||
      !formData.tech_alcohol ||
      !formData.tech_contains
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_serving: formData.tech_serving,
        tech_location: formData.tech_location,
        tech_carbohydrates: formData.tech_carbohydrates,
        tech_fiber: formData.tech_fiber,
        tech_alcohol: formData.tech_alcohol,
        tech_contains: formData.tech_contains,
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
      tech_serving: "per 100 g",
      tech_location: "no",
      tech_carbohydrates: "5",
      tech_fiber: "5",
      tech_alcohol: "30",
      tech_contains: "yes",
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

  const serving = formData?.tech_serving === "per serving" ? "serving" : "100g";

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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_serving" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_serving"
                    id="tech_serving"
                    value={formData.tech_serving}
                    onChange={handleChange}
                  >
                    <option value="per 100 g">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="per serving">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_location" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_location"
                    id="tech_location"
                    value={formData.tech_location}
                    onChange={handleChange}
                  >
                    <option value="yes">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="no">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_carbohydrates" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_carbohydrates"
                    id="tech_carbohydrates"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_carbohydrates}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_fiber" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_fiber"
                    id="tech_fiber"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_fiber}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_alcohol" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_alcohol"
                    id="tech_alcohol"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_alcohol}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <strong className="text-[#2845F5] text-[18px]">
                  {data?.payload?.tech_lang_keys["10"]}
                </strong>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_contains" className="label">
                  {data?.payload?.tech_lang_keys["11"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_contains"
                    id="tech_contains"
                    value={formData.tech_contains}
                    onChange={handleChange}
                  >
                    <option value="yes">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="no">
                      {data?.payload?.tech_lang_keys["6"]}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                          <div className="col-span-12 md:col-span-12 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg px-3 py-2 lg:text-[16px] md:text-[16px] text-[14px]">
                              <strong>
                                {formData?.tech_serving === "per serving" ? (
                                  <>
                                    Servings consumed ={" "}
                                    <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                      1
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    Weight of your product ={" "}
                                    <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                      100
                                    </span>
                                  </>
                                )}
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-12 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg px-3 py-2 lg:text-[16px] md:text-[16px] text-[14px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]} =
                              </strong>
                              <strong className="text-[#119154] px-1 lg:text-[28px] md:text-[28px] text-[24px]">
                                {result?.tech_Net_carbs}
                              </strong>
                              <span>g</span>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-12 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg px-3 py-2 lg:text-[16px] md:text-[16px] text-[14px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} =
                              </strong>
                              <strong className="text-[#119154] px-1 lg:text-[28px] md:text-[28px] text-[24px]">
                                {result?.tech_Net_carbs * 4}
                              </strong>
                              <span>kcal</span>
                            </div>
                          </div>
                        </div>
                        {/* <!-- ----------------------------------- inputs --------------------------------- --> */}

                        <p className="font-s-18 mt-2">
                          <strong>{data?.payload?.tech_lang_keys["15"]}</strong>
                        </p>
                        <p className="mt-1">
                          {data?.payload?.tech_lang_keys["7"]} :{" "}
                          {result?.tech_carbohydrates} g per {serving}
                        </p>
                        <p className="mt-1">
                          {data?.payload?.tech_lang_keys["8"]} :{" "}
                          {result?.tech_fiber} g per {serving}
                        </p>
                        <p className="mt-1">
                          {data?.payload?.tech_lang_keys["9"]} :{" "}
                          {result?.tech_alcohol} g per {serving}
                        </p>

                        {/* <!-- -------------------------- Solution ----------------------- --> */}
                        <p className="font-s-18 mt-3">
                          <strong>{data?.payload?.tech_lang_keys["16"]}</strong>
                        </p>
                        <p className="mt-1">
                          {data?.payload?.tech_lang_keys["17"]}
                        </p>
                        <p className="mt-1">
                          {data?.payload?.tech_lang_keys["18"]} =
                          <span>Total carbohydrate - Fiber -</span>
                          <span className="fraction">
                            <span className="num">(Sugar alcohol)</span>
                            <span className="visually-hidden"></span>
                            <span className="den">2</span>
                          </span>
                        </p>
                        <p className="mt-1">
                          {data?.payload?.tech_lang_keys["18"]} =
                          <span>
                            {result?.input_carbohydrates} -{" "}
                            {result?.input_fiber} -
                          </span>
                          <span className="fraction">
                            <span className="num">
                              ({result?.input_alcohol})
                            </span>
                            <span className="visually-hidden"></span>
                            <span className="den">2</span>
                          </span>
                        </p>
                        <p className="mt-1">
                          {data?.payload?.tech_lang_keys["18"]} ={" "}
                          {result?.tech_Net_carbs} g
                        </p>
                        <p className="mt-1">
                          {data?.payload?.tech_lang_keys["19"]} ={" "}
                          {result?.tech_Net_carbs * 4} kcal
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

export default NetCarbsCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useSleepCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SleepCalculator = () => {
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
    tech_h: "09:26:56",
    tech_stype: "bedtime",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSleepCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_h || !formData.tech_stype) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_h: formData.tech_h,
        tech_stype: formData.tech_stype,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_h: "09:26:56",
      tech_stype: "bedtime",
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

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 ">
                <label className="pe-2" htmlFor="bedtime">
                  <input
                    type="radio"
                    name="tech_stype"
                    value="bedtime"
                    id="bedtime"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_stype === "bedtime"}
                  />
                  <span>{data?.payload?.tech_lang_keys["1"]}</span>
                </label>
                <label htmlFor="wkup">
                  <input
                    type="radio"
                    name="tech_stype"
                    className="mr-2 border"
                    value="wkup"
                    id="wkup"
                    onChange={handleChange}
                    checked={formData.tech_stype === "wkup"}
                  />
                  <span>{data?.payload?.tech_lang_keys["2"]}</span>
                </label>
              </div>
              <div className="col-span-12">
                <label
                  htmlFor="tech_h"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  {" "}
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none"></div>
                  <input
                    type="time"
                    id="time"
                    max="23"
                    min="0"
                    value={formData.tech_h}
                    onChange={handleChange}
                    className="input "
                  />
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {result?.tech_stype == "bedtime" ? (
                          <>
                            <p className="text-center text-[20px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[1]}
                              </strong>
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["5"]}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["6"]}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["5"]}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["7"]}
                            </p>
                            <p className="text-center text-[20px] mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[2]}
                              </strong>
                            </p>
                          </>
                        )}
                        <div className="grid grid-cols-12 gap-5 my-3">
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex bg-sky bordered rounded-lg px-3 py-2 justify-between">
                              <p>
                                <strong className="text-[#119154]">
                                  {result?.tech_time}
                                </strong>
                              </p>
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys[4]}
                                </strong>
                              </p>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex bg-sky bordered rounded-lg px-3 py-2 justify-between">
                              <p>
                                <strong className="text-[#119154]">
                                  {result?.tech_time2}
                                </strong>
                              </p>
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys[4]}
                                </strong>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-12 gap-5">
                          <div className="col-span-12 md:col-span-3 lg:col-span-3 text-center">
                            <p className="bg-sky bordered px-3 py-2 rounded-lg">
                              <strong className="text-[#119154]">
                                {result?.tech_time3}
                              </strong>
                            </p>
                          </div>
                          <div className="col-span-12 md:col-span-3 lg:col-span-3 text-center">
                            <p className="bg-sky bordered px-3 py-2 rounded-lg">
                              <strong className="text-[#119154]">
                                {result?.tech_time4}
                              </strong>
                            </p>
                          </div>
                          <div className="col-span-12 md:col-span-3 lg:col-span-3 text-center">
                            <p className="bg-sky bordered px-3 py-2 rounded-lg">
                              <strong className="text-[#119154]">
                                {result?.tech_time5}
                              </strong>
                            </p>
                          </div>
                          <div className="col-span-12 md:col-span-3 lg:col-span-3 text-center">
                            <p className="bg-sky bordered px-3 py-2 rounded-lg">
                              <strong className="text-[#119154]">
                                {result?.tech_time6}
                              </strong>
                            </p>
                          </div>
                        </div>

                        {result?.tech_stype == "bedtime" ? (
                          <>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["8"]}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["8"]}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]}
                            </p>
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

export default SleepCalculator;

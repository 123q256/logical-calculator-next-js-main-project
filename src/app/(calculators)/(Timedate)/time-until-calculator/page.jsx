"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTimeuntilCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DeadlineCalculator = () => {
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

  // console.log(data);

  const [formData, setFormData] = useState({
    tech_current: "",
    tech_next: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateLovePercentage,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useTimeuntilCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_current || !formData.tech_next) {
      setFormError("Please fill in both .");
      return;
    }
    setFormError("");
    try {
      const response = await calculateLovePercentage({
        tech_current: formData.tech_current,
        tech_next: formData.tech_next,
      }).unwrap();

      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError(err?.data?.error);
      toast.error(err?.data?.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_current: "",
      tech_next: "",
    });
    setResult(null);
    setFormError(null);
  };

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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 ">
                <label htmlFor="tech_current" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <input
                  type="datetime-local"
                  step="any"
                  name="tech_current"
                  id="tech_current"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_current}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 ">
                <label htmlFor="tech_next" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <input
                  type="datetime-local"
                  step="any"
                  name="tech_next"
                  id="tech_next"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_next}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={calculateDeadlineLoading}>
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
        {calculateDeadlineLoading ? (
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
                    <div className="w-full p-3 rounded-lg mt-3 overflow-auto">
                      <div className="loader-container">
                        <div id="loading" className="loader"></div>
                        <div className="loader-text"></div>
                      </div>
                      <div className="loader-container hidden">
                        <div id="loading" className="loader"></div>
                        <div className="loader-text"></div>
                      </div>
                      <div className="flex flex-wrap">
                        <div className="lg:w-2/12 w-6/12">
                          <p className="border-b border-dark pt-2 pb-1">
                            <strong id="years" className="text-xl mr-1">
                              {result?.tech_years}
                            </strong>
                            Years
                          </p>
                          <p className="border-b border-dark pt-2 pb-1">
                            <strong id="months" className="text-xl mr-1">
                              {result?.tech_months}
                            </strong>
                            Months
                          </p>
                          <p className="border-b border-dark pt-2 pb-1">
                            <strong id="days" className="text-xl mr-1">
                              {result?.tech_days}
                            </strong>
                            Days
                          </p>
                          <p className="border-b border-dark pt-2 pb-1">
                            <strong id="hours" className="text-xl mr-1">
                              {result?.tech_hours}
                            </strong>
                            Hours
                          </p>
                          <p className="border-b border-dark pt-2 pb-1">
                            <strong id="minutes" className="text-xl mr-1">
                              {result?.tech_minutes}
                            </strong>
                            Minutes
                          </p>
                          <p className="border-b border-dark pt-2 pb-1">
                            <strong id="seconds" className="text-xl mr-1">
                              {result?.tech_seconds}
                            </strong>
                            Seconds
                          </p>
                        </div>
                      </div>
                      <p className="pt-3">
                        <strong>Until The Final Date! ⏱️🗓️</strong>
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

export default DeadlineCalculator;

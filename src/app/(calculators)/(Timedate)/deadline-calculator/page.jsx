"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDeadlineCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

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
    tech_date: "",
    tech_period: "Years",
    tech_Number: "40",
    tech_before_after: "After",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateLovePercentage,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useDeadlineCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_date ||
      !formData.tech_period ||
      !formData.tech_Number ||
      !formData.tech_before_after
    ) {
      setFormError("Please fill in both names.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateLovePercentage({
        tech_date: formData.tech_date,
        tech_period: formData.tech_period,
        tech_Number: formData.tech_Number,
        tech_before_after: formData.tech_before_after,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError("Error calculating");
      toast.error("Error calculating");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_date: "",
      tech_period: "Years",
      tech_Number: "40",
      tech_before_after: "After",
    });
    setResult(null);
    setFormError(null);
  };

  // Set current date on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    setFormData((prev) => ({ ...prev, tech_date: today }));
  }, []);

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_date" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <input
                  type="date"
                  step="any"
                  name="tech_date"
                  id="tech_date"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_date}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="tech_period" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="">
                  <select
                    className="input mt-2"
                    aria-label="select"
                    name="tech_period"
                    id="tech_period"
                    value={formData.tech_period}
                    onChange={handleChange}
                  >
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Years">Years</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_Number" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <input
                  type="number"
                  step="any"
                  name="tech_Number"
                  id="tech_Number"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_Number}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="tech_before_after" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="">
                  <select
                    className="input mt-2"
                    aria-label="select"
                    name="tech_before_after"
                    id="tech_before_after"
                    value={formData.tech_before_after}
                    onChange={handleChange}
                  >
                    <option value="After">After</option>
                    <option value="Years">Years</option>
                  </select>
                </div>
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
                    <div className="w-full bg-light-blue rounded-lg p-4 mt-6">
                      <div className="text-center">
                        <p className="text-lg font-bold">
                          {data?.payload?.tech_lang_keys["5"]}
                        </p>
                        <p className="lg:text-[25px] md:text-[25px] text-[20px] bg-[#2845F5] text-white px-4 py-2 rounded-lg inline-block my-4">
                          <strong>{result?.tech_answer}</strong>
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

export default DeadlineCalculator;

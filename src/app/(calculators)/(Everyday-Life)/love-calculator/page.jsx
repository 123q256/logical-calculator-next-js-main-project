"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useLoveCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LoveCalculator = () => {
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
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    you: "James",
    lover: "Katherine",
    gender: "Male",
    gender_: "Female", // Set the default value here instead of using selected on option
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const [
    calculateLovePercentage,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLoveCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.you || !formData.lover) {
      setFormError("Please fill in both names.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateLovePercentage({
        yourName: formData.you,
        partnerName: formData.lover,
      }).unwrap();
      setResult(response?.payload?.loveScore);
      toast.success(
        `${formData.you} & ${formData.lover}, your love score is ${response?.payload?.loveScore}%! 💖`
      );
    } catch (err) {
      setFormError("Error calculating love percentage.");
      toast.error("Error calculating love percentage.");
    }
  };

  const handleReset = () => {
    setFormData({
      you: "",
      lover: "",
      gender: "Male",
      gender_: "Female", // Reset to default value
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
          path: pathname,
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

          <div className="lg:w-[60%] md:w-[80%] mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="you" className="label">
                  {data?.payload?.tech_lang_keys["your_name"]}:
                </label>
                <input
                  type="text"
                  name="you"
                  id="you"
                  className="input my-2"
                  aria-label="input"
                  placeholder={data?.payload?.tech_lang_keys["your_name"]}
                  value={formData.you}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gender" className="label">
                  {data?.payload?.tech_lang_keys["gender"]}:
                </label>
                <select
                  name="gender"
                  id="gender"
                  className="input my-2"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">
                    {data?.payload?.tech_lang_keys["male"]}
                  </option>
                  <option value="Female">
                    {data?.payload?.tech_lang_keys["female"]}
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="lover" className="label">
                  {data?.payload?.tech_lang_keys["lover"]}:
                </label>
                <input
                  type="text"
                  name="lover"
                  id="lover"
                  className="input my-2"
                  aria-label="input"
                  placeholder={data?.payload?.tech_lang_keys["lover"]}
                  value={formData.lover}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gender_" className="label">
                  {data?.payload?.tech_lang_keys["gender"]}:
                </label>
                <select
                  name="gender_"
                  id="gender_"
                  className="input my-2"
                  value={formData.gender_}
                  onChange={handleChange}
                >
                  <option value="Male">
                    {data?.payload?.tech_lang_keys["male"]}
                  </option>
                  <option value="Female">
                    {data?.payload?.tech_lang_keys["female"]}
                  </option>
                </select>
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
                  <div className="rounded-lg flex items-center justify-center ">
                    <div className="w-full bg-light-blue rounded-[10px] mt-3 overflow-auto">
                      <div className="flex flex-col items-center mt-2">
                        <p className="text-[20px] text-center">
                          {formData.you} & {formData.lover}
                        </p>
                        <p className="my-3">
                          <strong className="lg:text-[32px] md:text-[32px] text-white bg-[#2845F5] px-3 py-2 rounded-[10px]">
                            {data?.payload?.tech_lang_keys["have"]} {result}%{" "}
                            {data?.payload?.tech_lang_keys["lv"]}
                          </strong>
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

export default LoveCalculator;

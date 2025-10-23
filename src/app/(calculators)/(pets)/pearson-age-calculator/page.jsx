"use client";

import React, { useEffect, useState } from "react";
import { FormWrap } from "../../../../components/Calculator";
import { usePathname } from "next/navigation";
import {
  usePearsonAgeCalculationMutation,
  useGetSingleCalculatorDetailsMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PearsonAgeCalculator = () => {
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
    tech_date1: "",
    tech_date: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    PearsonAgeCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = usePearsonAgeCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_date || !formData.tech_date1) {
      setFormError("Please fill in field");
      return;
    }
    setFormError("");
    try {
      const response = await PearsonAgeCalculator({
        tech_date1: formData.tech_date1,
        tech_date: formData.tech_date,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_date1: "",
      tech_date: "",
    });
    setResult(null);
    setFormError(null);
  };
  const AgeResult = ({ result, data, des }) => {
    const lang = data?.payload?.tech_lang_keys;
  };

  const birthMonth = formData.dateOfBirth; // example: March

  const getMonthDescription = (month) => {
    const key = `m${parseInt(month)}`; // convert string to int to avoid leading zeros
    const des = data?.payload?.tech_lang_keys[key] || "";
    return des.split("@");
  };

  const des = getMonthDescription(birthMonth);

  // Set current date on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    setFormData((prev) => ({ ...prev, tech_date1: today }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto">
            <p className="w-full">{data?.payload?.tech_lang_keys["13"]}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_date1" className="label">
                  {data?.payload?.tech_lang_keys["dob"]}:
                </label>
                <input
                  type="date"
                  name="tech_date1"
                  id="tech_date1"
                  className="input"
                  aria-label="input"
                  value={formData.tech_date1}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tech_date" className="label">
                  {data?.payload?.tech_lang_keys["today_date"]}:
                </label>
                <input
                  type="date"
                  name="tech_date"
                  id="tech_date"
                  className="input"
                  aria-label="input"
                  value={formData.tech_date}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={calculateDogLoading}>
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
        {calculateDogLoading ? (
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full rounded-lg mt-5">
                      <div className="grid gap-4">
                        <div className="text-lg">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[14px]">
                            <tbody>
                              <tr>
                                <td className="border-b py-2 font-bold">
                                  {data?.payload?.tech_lang_keys["your_age"]}:
                                </td>
                                <td className="border-b py-2 w-1/2">
                                  <b>{result?.tech_Age_years}</b>{" "}
                                  <span className="text-base">
                                    {data?.payload?.tech_lang_keys["years"]}
                                  </span>{" "}
                                  <b>{result?.tech_Age_months}</b>{" "}
                                  <span className="text-base">
                                    {data?.payload?.tech_lang_keys["months"]}
                                  </span>{" "}
                                  <b>{result?.tech_Age_days}</b>{" "}
                                  <span className="text-base">
                                    {data?.payload?.tech_lang_keys["days"]}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2 font-bold">
                                  {data?.payload?.tech_lang_keys["next"]}:
                                </td>
                                <td className="border-b py-2">
                                  <b>{result?.tech_N_r_months}</b>{" "}
                                  <span className="text-base">
                                    {data?.payload?.tech_lang_keys["months"]}
                                  </span>{" "}
                                  <b>{result?.tech_N_r_days}</b>{" "}
                                  <span className="text-base">
                                    {data?.payload?.tech_lang_keys["days"]}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {des[0] && (
                          <p className="text-lg font-bold mt-3 mb-1">
                            {des[0]}
                          </p>
                        )}

                        {des.slice(1).map((text, index) => (
                          <div
                            key={index}
                            className="text-lg flex gap-2 mt-2 items-center"
                          >
                            <img
                              src="/images/Star.png"
                              width="20"
                              height="20"
                              alt="star"
                              className="object-contain"
                            />
                            <span>{text}</span>
                          </div>
                        ))}

                        <div className="text-lg mt-4">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[14px]">
                            <tbody>
                              <tr>
                                <td className="pt-3 pb-1 font-bold">
                                  {data?.payload?.tech_lang_keys["lived"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  <img
                                    src="/images/all_calculators/year.png"
                                    width="40"
                                    height="40"
                                    alt="year"
                                  />
                                  {data?.payload?.tech_lang_keys["years"]}:
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_Years}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  <img
                                    src="/images/all_calculators/days.png"
                                    width="40"
                                    height="40"
                                    alt="days"
                                  />
                                  {data?.payload?.tech_lang_keys["days"]}:
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_Days}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  <img
                                    src="/images/all_calculators/hours.png"
                                    width="40"
                                    height="40"
                                    alt="hours"
                                  />
                                  {data?.payload?.tech_lang_keys["hours"]}:
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_Hours}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  <img
                                    src="/images/all_calculators/min.png"
                                    width="40"
                                    height="40"
                                    alt="min"
                                  />
                                  {data?.payload?.tech_lang_keys["minute"]}:
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_Min}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  <img
                                    src="/images/all_calculators/sec.png"
                                    width="40"
                                    height="40"
                                    alt="sec"
                                  />
                                  {data?.payload?.tech_lang_keys["seconds"]}:
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_Sec}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
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

export default PearsonAgeCalculator;

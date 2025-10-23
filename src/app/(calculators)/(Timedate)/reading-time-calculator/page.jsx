"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useReadingtimeCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ReadingTimeCalculator = () => {
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
    tech_reading_speed: "0.25",
    tech_read_pages: "0.50",
    tech_book_leng: "1",
    tech_total_unit: "min",
    tech_daily_reading: "8",
    tech_time_unit: "min",
    tech_reading_unit: "min",
    tech_period_unit: "min",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateLovePercentage,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useReadingtimeCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_reading_speed ||
      !formData.tech_read_pages ||
      !formData.tech_book_leng ||
      !formData.tech_total_unit ||
      !formData.tech_daily_reading ||
      !formData.tech_time_unit ||
      !formData.tech_reading_unit ||
      !formData.tech_period_unit
    ) {
      setFormError("Please fill in Field.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateLovePercentage({
        tech_reading_speed: formData.tech_reading_speed,
        tech_read_pages: formData.tech_read_pages,
        tech_book_leng: formData.tech_book_leng,
        tech_total_unit: formData.tech_total_unit,
        tech_daily_reading: formData.tech_daily_reading,
        tech_time_unit: formData.tech_time_unit,
        tech_reading_unit: formData.tech_reading_unit,
        tech_period_unit: formData.tech_period_unit,
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
      tech_reading_speed: "0.25",
      tech_read_pages: "0.50",
      tech_book_leng: "1",
      tech_total_unit: "min",
      tech_daily_reading: "8",
      tech_time_unit: "min",
      tech_reading_unit: "min",
      tech_period_unit: "min",
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

          <div className="lg:w-[80%] md:w-[97%] w-full mx-auto ">
            <p className=" w-full">{data?.payload?.tech_lang_keys["1"]}</p>
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 relative mt-2">
                <label htmlFor="tech_reading_speed" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_reading_speed"
                    id="tech_reading_speed"
                    value={formData.tech_reading_speed}
                    onChange={handleChange}
                  >
                    <option value="0.25">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="0.50">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["13"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="read_pages" className="text-blue text-sm">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="flex flex-wrap">
                  <div className="lg:w-2/3 p relative pr-1">
                    <div className="col-span-12 mx-auto relative">
                      <label
                        htmlFor="tech_read_pages"
                        className="label"
                      ></label>
                      <input
                        type="number"
                        step="any"
                        name="tech_read_pages"
                        id="tech_read_pages"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_read_pages}
                        onChange={handleChange}
                      />
                      <span className="absolute right-[-10] top-7 transform -translate-y-1/2 text-blue px-2">
                        pgs
                      </span>
                    </div>
                  </div>
                  <div className="lg:w-1/3 mt-2">
                    <label htmlFor="tech_book_unit" className="label"></label>
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_book_unit"
                      id="tech_book_unit"
                      value={formData.tech_book_unit}
                      onChange={handleChange}
                    >
                      <option value="min">
                        {data?.payload?.tech_lang_keys["14"]}
                      </option>
                      <option value="hr">
                        {data?.payload?.tech_lang_keys["15"]}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_book_leng" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <input
                  type="number"
                  step="any"
                  name="tech_book_leng"
                  id="tech_book_leng"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_book_leng}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_total_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="">
                  <select
                    className="input mt-2"
                    aria-label="select"
                    name="tech_total_unit"
                    id="tech_total_unit"
                    value={formData.tech_total_unit}
                    onChange={handleChange}
                  >
                    <option value="min">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="hr">
                      {data?.payload?.tech_lang_keys["15"]}{" "}
                    </option>
                    <option value="min/hr">
                      {data?.payload?.tech_lang_keys["23"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <p className="mt-4 w-full">{data?.payload?.tech_lang_keys["7"]}</p>

            <div className="grid grid-cols-1 mt-4  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap">
                  <div className="lg:w-2/3 relative pr-1">
                    <label htmlFor="tech_daily_reading" className="label">
                      {data?.payload?.tech_lang_keys["8"]}:
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="tech_daily_reading"
                      id="tech_daily_reading"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_daily_reading}
                      onChange={handleChange}
                    />
                    <span className="absolute right-2 top-13 transform -translate-y-1/2 text-blue px-2">
                      pgs
                    </span>
                  </div>
                  <div className="lg:w-1/3 mt-2">
                    <label htmlFor="tech_time_unit" className="label">
                      .
                    </label>
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_time_unit"
                      id="tech_time_unit"
                      value={formData.tech_time_unit}
                      onChange={handleChange}
                    >
                      <option value="min">
                        {data?.payload?.tech_lang_keys["14"]}
                      </option>
                      <option value="hr">
                        {data?.payload?.tech_lang_keys["15"]} (%)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="tech_reading_unit" className="label">
                  {data?.payload?.tech_lang_keys["9"]} (
                  {data?.payload?.tech_lang_keys["6"]}):
                </label>
                <select
                  className="input mt-2"
                  aria-label="select"
                  name="tech_reading_unit"
                  id="tech_reading_unit"
                  value={formData.tech_reading_unit}
                  onChange={handleChange}
                >
                  <option value="min">
                    {data?.payload?.tech_lang_keys["14"]}
                  </option>
                  <option value="hr">
                    {data?.payload?.tech_lang_keys["15"]}{" "}
                  </option>
                  <option value="day">
                    {data?.payload?.tech_lang_keys["16"]}{" "}
                  </option>
                  <option value="week">
                    {data?.payload?.tech_lang_keys["17"]}{" "}
                  </option>
                  <option value="month">
                    {data?.payload?.tech_lang_keys["18"]}{" "}
                  </option>
                  <option value="year">
                    {data?.payload?.tech_lang_keys["19"]}{" "}
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="tech_period_unit" className="label">
                  {data?.payload?.tech_lang_keys["10"]} (
                  {data?.payload?.tech_lang_keys["6"]}):
                </label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_period_unit"
                    id="tech_period_unit"
                    value={formData.tech_period_unit}
                    onChange={handleChange}
                  >
                    <option value="min">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="hr">
                      {data?.payload?.tech_lang_keys["15"]}{" "}
                    </option>
                    <option value="day">
                      {data?.payload?.tech_lang_keys["16"]}{" "}
                    </option>
                    <option value="week">
                      {data?.payload?.tech_lang_keys["17"]}{" "}
                    </option>
                    <option value="month">
                      {data?.payload?.tech_lang_keys["18"]}{" "}
                    </option>
                    <option value="year">
                      {data?.payload?.tech_lang_keys["19"]}{" "}
                    </option>
                    <option value="minutes/hour">
                      {data?.payload?.tech_lang_keys["23"]}{" "}
                    </option>
                    <option value="year/month/day">
                      {data?.payload?.tech_lang_keys["24"]}{" "}
                    </option>
                    <option value="week/day">
                      {data?.payload?.tech_lang_keys["25"]}{" "}
                    </option>
                    <option value="day/hour/minutes">
                      {data?.payload?.tech_lang_keys["26"]}{" "}
                    </option>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  rounded-lg mt-3">
                      <div className="my-2">
                        <div className="lg:w-2/3 font-sans text-lg">
                          <table className="w-full table-auto lg:text-[16px] md:text-[16px] text-[14px]">
                            <tbody>
                              <tr>
                                <td className="w-3/5 border-b py-2 font-semibold">
                                  {data?.payload?.tech_lang_keys["20"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_answer}
                                </td>
                              </tr>

                              {result?.tech_total_daily_reading !==
                                undefined && (
                                <>
                                  <tr>
                                    <td className="border-b py-2 font-semibold">
                                      {data?.payload?.tech_lang_keys["21"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_total_daily_reading}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 font-semibold">
                                      {data?.payload?.tech_lang_keys["22"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_period_spent}
                                    </td>
                                  </tr>
                                </>
                              )}
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

export default ReadingTimeCalculator;

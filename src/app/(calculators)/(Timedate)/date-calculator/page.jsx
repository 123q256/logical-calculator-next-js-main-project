"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDateCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DateCalculator = () => {
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
    lang: "en",
    tech_add_date: "2025-04-17",
    tech_method: "add", // add  sub
    tech_years: "3",
    tech_months: "4",
    tech_add_hrs_f: "1",
    tech_add_min_f: "2",
    tech_add_sec_f: "4",
    tech_weeks: "3",
    tech_days: "5",
    tech_add_hrs_s: "3",
    tech_add_min_s: "4",
    tech_add_sec_s: "2",
    tech_repeat: "2",
    tech_checkbox: "",
    tech_inctime: "time_in",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateDataCalculator,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useDateCalculationMutation();

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_add_date || !formData.tech_method) {
      setFormError("Please fill in field.");
      return;
    }
    setFormError("");

    try {
      const response = await calculateDataCalculator({
        lang: formData.lang,
        tech_add_date: formData.tech_add_date,
        tech_method: formData.tech_method,
        tech_years: formData.tech_years,
        tech_months: formData.tech_months,
        tech_add_hrs_f: formData.tech_add_hrs_f,
        tech_add_min_f: formData.tech_add_min_f,
        tech_add_sec_f: formData.tech_add_sec_f,
        tech_weeks: formData.tech_weeks,
        tech_days: formData.tech_days,
        tech_add_hrs_s: formData.tech_add_hrs_s,
        tech_add_min_s: formData.tech_add_min_s,
        tech_add_sec_s: formData.tech_add_sec_s,
        tech_repeat: formData.tech_repeat,
        tech_checkbox: formData.tech_checkbox,
        tech_inctime: formData.tech_inctime,
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
      lang: "en",
      tech_add_date: "2025-04-17",
      tech_method: "add", // add  sub
      tech_years: "3",
      tech_months: "4",
      tech_add_hrs_f: "1",
      tech_add_min_f: "2",
      tech_add_sec_f: "4",
      tech_weeks: "3",
      tech_days: "5",
      tech_add_hrs_s: "3",
      tech_add_min_s: "4",
      tech_add_sec_s: "2",
      tech_repeat: "33",
      tech_checkbox: "",
      tech_inctime: "time_in",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-2  lg:grid-cols-2 md:grid-cols-2 text-center  gap-4">
              <a
                href="https://calculator-logical.com/date-duration-calculator"
                className=" cursor-pointer py-2  "
              >
                <strong>{data?.payload?.tech_lang_keys["41"]}</strong>
              </a>
              <a
                href="https://calculator-logical.com/date-calculator"
                className=" cursor-pointer py-2 text-[#2845F5] border-b-2 border-[#2845F5]"
              >
                <strong>{data?.payload?.tech_lang_keys["42"]}</strong>
              </a>
            </div>

            <div className="flex flex-wrap">
              <div className="w-full lg:w-1/2 px-2 mt-3 lg:pr-4">
                <label htmlFor="tech_add_date" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <input
                  type="date"
                  step="any"
                  name="tech_add_date"
                  id="tech_add_date"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_add_date}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full lg:w-1/2 px-2 mt-3 lg:pl-4">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys[45]} /{" "}
                  {data?.payload?.tech_lang_keys["46"]}:
                </label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method"
                    id="tech_method"
                    value={formData.tech_method}
                    onChange={handleChange}
                  >
                    <option value="add">Add (+)</option>
                    <option value="sub">Subtract (-)</option>
                  </select>
                </div>
              </div>
              <div className="w-full lg:w-1/2 lg:pr-4">
                <div className="flex flex-wrap">
                  <div className="w-1/2 px-2 lg:pr-1">
                    <label htmlFor="tech_years" className="label">
                      {data?.payload?.tech_lang_keys["47"]}:
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="tech_years"
                      id="tech_years"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_years}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/2 px-2 lg:pl-1">
                    <label htmlFor="tech_months" className="label">
                      {data?.payload?.tech_lang_keys["48"]}:
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="tech_months"
                      id="tech_months"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_months}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {formData && formData.tech_inctime === "time_out" && (
                  <div className="flex flex-wrap inc_time ">
                    <div className="w-full flex px-2">
                      <div className="w-1/3 py-2 mx-1">
                        <input
                          type="number"
                          step="any"
                          name="tech_add_hrs_f"
                          id="tech_add_hrs_f"
                          className="input w-full border rounded-md p-2"
                          aria-label="input"
                          placeholder="HH"
                          value={formData.tech_add_hrs_f}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="w-1/3 py-2 mx-1">
                        <input
                          type="number"
                          step="any"
                          name="tech_add_min_f"
                          id="tech_add_min_f"
                          className="input w-full border rounded-md p-2"
                          aria-label="input"
                          placeholder="MM"
                          value={formData.tech_add_min_f}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="w-1/3 py-2 mx-1">
                        <input
                          type="number"
                          step="any"
                          name="tech_add_sec_f"
                          id="tech_add_sec_f"
                          className="input w-full border rounded-md p-2"
                          aria-label="input"
                          placeholder="SS"
                          value={formData.tech_add_sec_f}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full lg:w-1/2 lg:pl-4">
                <div className="flex flex-wrap">
                  <div className="w-1/2 px-2 lg:pl-0">
                    <label htmlFor="tech_weeks" className="label">
                      {data?.payload?.tech_lang_keys["49"]}:
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="tech_weeks"
                      id="tech_weeks"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_weeks}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/2 px-2">
                    <label htmlFor="tech_days" className="label">
                      {data?.payload?.tech_lang_keys["50"]}:
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="tech_days"
                      id="tech_days"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_days}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {formData && formData.tech_inctime === "time_out" && (
                  <div className="flex flex-wrap inc_time ">
                    <div className="w-full flex px-2">
                      <div className="w-1/3 py-2 mx-1">
                        <input
                          type="number"
                          step="any"
                          name="tech_add_hrs_s"
                          id="tech_add_hrs_s"
                          className="input w-full border rounded-md p-2"
                          aria-label="input"
                          placeholder="HH"
                          value={formData.tech_add_hrs_s}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="w-1/3 py-2 mx-1">
                        <input
                          type="number"
                          step="any"
                          name="tech_add_min_s"
                          id="tech_add_min_s"
                          className="input w-full border rounded-md p-2"
                          aria-label="input"
                          placeholder="MM"
                          value={formData.tech_add_min_s}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="w-1/3 py-2 mx-1">
                        <input
                          type="number"
                          step="any"
                          name="tech_add_sec_s"
                          id="tech_add_sec_s"
                          className="input w-full border rounded-md p-2"
                          aria-label="input"
                          placeholder="SS"
                          value={formData.tech_add_sec_s}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {formData.tech_checkbox && (
                <div className="w-full px-2 lg:pr-4 checkinput">
                  <label htmlFor="tech_repeat" className="label">
                    {data?.payload?.tech_lang_keys["52"]}:
                  </label>
                  <div className="w-full lg:w-1/2 px-2 mt-3 lg:pr-4">
                    <input
                      type="number"
                      step="any"
                      name="tech_repeat"
                      id="tech_repeat"
                      className="input w-full border rounded-md p-2"
                      aria-label="input"
                      value={formData.tech_repeat}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between px-2">
              <div className="w-1/2 flex">
                <input
                  type="checkbox"
                  name="tech_checkbox"
                  id="tech_checkbox"
                  className="input  border rounded-md p-2"
                  aria-label="input"
                  checked={formData.tech_checkbox === true}
                  onChange={handleChange}
                />
                <label htmlFor="tech_checkbox" className="label">
                  {data?.payload?.tech_lang_keys["51"]}:
                </label>
              </div>

              <div className="w-1/2 text-right">
                {formData?.tech_inctime != "time_in" ? (
                  <p
                    className={`label cursor-pointer underline  ${
                      formData.tech_inctime === "time_in" ? "tagsUnit" : ""
                    }`}
                    id="time_in"
                    onClick={() =>
                      setFormData({ ...formData, tech_inctime: "time_in" })
                    }
                  >
                    {data?.payload?.tech_lang_keys[63]}
                  </p>
                ) : (
                  <p
                    className={`label cursor-pointer underline  ${
                      formData.tech_inctime === "time_out" ? "tagsUnit" : ""
                    }`}
                    id="time_out"
                    onClick={() =>
                      setFormData({ ...formData, tech_inctime: "time_out" })
                    }
                  >
                    {data?.payload?.tech_lang_keys[62]}
                  </p>
                )}
                <input
                  type="hidden"
                  name="tech_inctime"
                  id="tech_inctime"
                  className="input w-full border rounded-md p-2"
                  aria-label="input"
                  value={formData.tech_inctime}
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  lg:p-3 md:p-3 rounded-lg mt-3">
                      <div className="flex flex-wrap">
                        <div className="w-full text-base">
                          <table className="w-full ">
                            <tbody>
                              <tr className=" border-b  hover:bg-gray-300 transition-colors duration-200">
                                <td className="py-4 px-6 font-medium text-gray-700">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[61]}{" "}
                                    {result?.tech_repeat > 1 ? "1" : ""} :
                                  </strong>
                                </td>
                                <td className="py-4 px-6 font-medium text-gray-700">
                                  {result?.tech_ans[0]}
                                </td>
                              </tr>

                              {/* Repeat Remaining Answers if tech_repeat > 1 */}
                              {result?.tech_repeat > 1 &&
                                result?.tech_ans
                                  .slice(1)
                                  .map((value, index) => (
                                    <tr
                                      key={index}
                                      className=" border-b  hover:bg-gray-300 transition-colors duration-200"
                                    >
                                      <td className="py-4 px-6 font-medium text-gray-700">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[61]}{" "}
                                          {index + 2} :
                                        </strong>
                                      </td>
                                      <td className="py-4 px-6 font-medium text-gray-700">
                                        {value}
                                      </td>
                                    </tr>
                                  ))}
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

export default DateCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTimeCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TimeCalculator = () => {
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
    tech_lang: "en",
    tech_sim_adv: "time_first",
    tech_t_days: "5",
    tech_t_hours: "6", // First time calculator
    tech_t_min: "5",
    tech_t_sec: "6",
    tech_t_method: "minus",
    tech_te_days: "5",
    tech_te_hours: "5",
    tech_te_min: "6",
    tech_te_sec: "6",
    // tab second
    tech_td_date: "2025-04-14",
    tech_td_method: "plus",
    tech_td_am_pm: "am", // Fixed duplicate variable name "tech_am_pm"
    tech_td_days: "10",
    tech_td_hours: "5", // Second time calculator
    tech_td_min: "35",
    tech_td_sec: "10",
    // tab three
    tech_input: "2d 3h 15m 30s + 5h 20s - 1200s + 12h",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const [
    calculateTimeCalculator,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useTimeCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_sim_adv === "time_first") {
      if (
        !formData.tech_sim_adv ||
        !formData.tech_t_days ||
        !formData.tech_t_hours ||
        !formData.tech_t_min ||
        !formData.tech_t_sec ||
        !formData.tech_t_method ||
        !formData.tech_te_days ||
        !formData.tech_te_hours ||
        !formData.tech_te_min ||
        !formData.tech_te_sec
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_sim_adv === "time_second") {
      if (
        !formData.tech_sim_adv ||
        !formData.tech_td_date ||
        !formData.tech_td_hours ||
        !formData.tech_td_min ||
        !formData.tech_td_sec ||
        !formData.tech_td_am_pm ||
        !formData.tech_td_method ||
        !formData.tech_td_days ||
        !formData.tech_td_hours ||
        !formData.tech_td_min ||
        !formData.tech_td_sec
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (!formData.tech_sim_adv || !formData.tech_input) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateTimeCalculator({
        tech_lang: formData.tech_lang,
        tech_sim_adv: formData.tech_sim_adv,
        tech_t_days: formData.tech_t_days,
        tech_t_hours: formData.tech_t_hours,
        tech_t_min: formData.tech_t_min,
        tech_t_sec: formData.tech_t_sec,
        tech_t_method: formData.tech_t_method,
        tech_te_days: formData.tech_te_days,
        tech_te_hours: formData.tech_te_hours,
        tech_te_min: formData.tech_te_min,
        tech_te_sec: formData.tech_te_sec,
        tech_td_date: formData.tech_td_date,
        tech_td_am_pm: formData.tech_td_am_pm,
        tech_td_method: formData.tech_td_method,
        tech_td_days: formData.tech_td_days,
        tech_td_hours: formData.tech_td_hours,
        tech_td_min: formData.tech_td_min,
        tech_td_sec: formData.tech_td_sec,
        tech_input: formData.tech_input,
      }).unwrap();
      setResult(response);
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError("Error calculating");
      toast.error("Error calculating");
    }
  };

  const handleReset = () => {
    setFormData({
      tech_lang: "en",
      tech_sim_adv: "time_first",
      tech_t_days: "5",
      tech_t_hours: "6",
      tech_t_min: "5",
      tech_t_sec: "6",
      tech_t_method: "plus",
      tech_te_days: "5",
      tech_te_hours: "5",
      tech_te_min: "6",
      tech_te_sec: "6",
      tech_td_date: "",
      tech_td_method: "plus",
      tech_td_am_pm: "am",
      tech_td_days: "10",
      tech_td_hours: "5",
      tech_td_min: "35",
      tech_td_sec: "10",
      tech_input: "2d 3h 15m 30s + 5h 20s - 1200s + 12h",
    });
    setResult(null);
    setFormError(null);
  };

  useEffect(() => {
    if (formData.tech_sim_adv) {
      setResult(null);
    }
  }, [formData.tech_sim_adv]);

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <input type="hidden" name="tech_lang" value={formData.tech_lang} />
          <div className="container mx-auto">
            <input
              type="hidden"
              name="tech_sim_adv"
              id="tech_sim_adv"
              value={formData.tech_sim_adv}
            />
            <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
              <div className="lg:w-1/3 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 text-[16px] py-2 cursor-pointer rounded-md transition-colors duration-300  hover_tags hover:text-white ${
                    formData.tech_sim_adv === "time_first" ? "tagsUnit" : ""
                  }`}
                  id="time_first"
                  onClick={() =>
                    setFormData({ ...formData, tech_sim_adv: "time_first" })
                  }
                >
                  Time Calculator
                </div>
              </div>
              <div className="lg:w-1/3 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 text-[14px] cursor-pointer rounded-md transition-colors duration-300  hover_tags hover:text-white ${
                    formData.tech_sim_adv === "time_second" ? "tagsUnit" : ""
                  }`}
                  id="time_second"
                  onClick={() =>
                    setFormData({ ...formData, tech_sim_adv: "time_second" })
                  }
                >
                  {data?.payload?.tech_lang_keys["7"]}
                </div>
              </div>
              <div className="lg:w-1/3 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 text-[16px] cursor-pointer rounded-md transition-colors duration-300  hover_tags hover:text-white ${
                    formData.tech_sim_adv === "time_third" ? "tagsUnit" : ""
                  }`}
                  id="time_third"
                  onClick={() =>
                    setFormData({ ...formData, tech_sim_adv: "time_third" })
                  }
                >
                  {data?.payload?.tech_lang_keys["20"]}
                </div>
              </div>
            </div>
          </div>

          {formData?.tech_sim_adv === "time_first" ? (
            <div className="time_due ">
              <p className="text-lg mt-4 ">
                {" "}
                {data?.payload?.tech_lang_keys["after_title_1"]}{" "}
              </p>
              <div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 px-2 py-2">
                    <label htmlFor="tech_t_days" className="label">
                      {data?.payload?.tech_lang_keys["days"]}:
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="tech_t_days"
                      id="tech_t_days"
                      className="input my-2"
                      aria-label="input"
                      placeholder="days"
                      value={formData.tech_t_days}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex-1 px-2 py-2">
                    <label htmlFor="tech_t_hours" className="label">
                      {data?.payload?.tech_lang_keys["hours"]}:
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="tech_t_hours"
                      id="tech_t_hours"
                      className="input my-2"
                      aria-label="input"
                      placeholder="hrs"
                      value={formData.tech_t_hours}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex-1 px-2 py-2">
                    <label htmlFor="tech_t_min" className="label">
                      {data?.payload?.tech_lang_keys["min"]}:
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="tech_t_min"
                      id="tech_t_min"
                      className="input my-2"
                      aria-label="input"
                      placeholder="min"
                      value={formData.tech_t_min}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex-1 px-2 py-2">
                    <label htmlFor="tech_t_sec" className="label">
                      {data?.payload?.tech_lang_keys["sec"]}:
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="tech_t_sec"
                      id="tech_t_sec"
                      className="input my-2"
                      aria-label="input"
                      placeholder="sec"
                      value={formData.tech_t_sec}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="my-2 flex justify-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="tech_t_method"
                    value="plus"
                    id="plus"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_t_method === "plus"}
                  />
                  <label htmlFor="plus" className="text-sm">
                    +Add
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="tech_t_method"
                    value="minus"
                    id="minus"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_t_method === "minus"}
                  />
                  <label htmlFor="minus" className="text-sm">
                    -Subtract
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex-1 px-2 py-2">
                  <label htmlFor="tech_te_days" className="label">
                    {data?.payload?.tech_lang_keys["days"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_te_days"
                    id="tech_te_days"
                    className="input my-2"
                    aria-label="input"
                    placeholder="date"
                    value={formData.tech_te_days}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1 px-2 py-2">
                  <label htmlFor="tech_te_hours" className="label">
                    {data?.payload?.tech_lang_keys["hours"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_te_hours"
                    id="tech_te_hours"
                    className="input my-2"
                    aria-label="input"
                    placeholder="hrs"
                    value={formData.tech_te_hours}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1 px-2 py-2">
                  <label htmlFor="tech_te_min" className="label">
                    {data?.payload?.tech_lang_keys["min"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_te_min"
                    id="tech_te_min"
                    className="input my-2"
                    aria-label="input"
                    placeholder="min"
                    value={formData.tech_te_min}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1 px-2 py-2">
                  <label htmlFor="tech_te_sec" className="label">
                    {data?.payload?.tech_lang_keys["sec"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_te_sec"
                    id="tech_te_sec"
                    className="input my-2"
                    aria-label="input"
                    placeholder="min"
                    value={formData.tech_te_sec}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          ) : formData?.tech_sim_adv === "time_second" ? (
            <div className="time_due_sec ">
              <p className="text-lg mt-4  ">
                {" "}
                {data?.payload?.tech_lang_keys["8"]}{" "}
              </p>
              <div className=" mt-5 flex flex-wrap gap-4 ">
                <div className=" w-full lg:w-auto">
                  <label htmlFor="tech_td_date" className="label">
                    {data?.payload?.tech_lang_keys["days"]}:
                  </label>
                  <input
                    type="date"
                    step="any"
                    name="tech_td_date"
                    id="tech_td_date"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_td_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="tech_td_hours" className="label">
                    {data?.payload?.tech_lang_keys["hours"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_td_hours"
                    id="tech_td_hours"
                    className="input my-2"
                    aria-label="input"
                    placeholder="hrs"
                    value={formData.tech_td_hours}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="tech_td_min" className="label">
                    {data?.payload?.tech_lang_keys["min"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_td_min"
                    id="tech_td_min"
                    className="input my-2"
                    aria-label="input"
                    placeholder="min"
                    value={formData.tech_td_min}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="tech_td_sec" className="label">
                    {data?.payload?.tech_lang_keys["sec"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_td_sec"
                    id="tech_td_sec"
                    className="input my-2"
                    aria-label="input"
                    placeholder="sec"
                    value={formData.tech_td_sec}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex-1 ">
                  <label htmlFor="tech_td_am_pm" className="label">
                    12/24
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_td_am_pm"
                      id="tech_td_am_pm"
                      value={formData.tech_td_am_pm}
                      onChange={handleChange}
                    >
                      <option value="am">AM</option>
                      <option value="pm">PM</option>
                      <option value="24">24-hr</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="my-6 flex justify-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="tech_td_method"
                    value="plus"
                    id="plus"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_td_method === "plus"}
                  />
                  <label htmlFor="plus" className="text-sm">
                    +Add
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="tech_td_method"
                    value="minus"
                    id="minus"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_td_method === "minus"}
                  />
                  <label htmlFor="minus" className="text-sm">
                    -Subtract
                  </label>
                </div>
              </div>
              <div className=" flex flex-wrap gap-4 ">
                <div className="flex-1">
                  <label htmlFor="tech_td_days" className="label">
                    {data?.payload?.tech_lang_keys["days"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_td_days"
                    id="tech_td_days"
                    className="input my-2"
                    aria-label="input"
                    placeholder="days"
                    value={formData.tech_td_days}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="tech_td_hours" className="label">
                    {data?.payload?.tech_lang_keys["hours"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_td_hours"
                    id="tech_td_hours"
                    className="input my-2"
                    aria-label="input"
                    placeholder="hrs"
                    value={formData.tech_td_hours}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="tech_td_min" className="label">
                    {data?.payload?.tech_lang_keys["min"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_td_min"
                    id="tech_td_min"
                    className="input my-2"
                    aria-label="input"
                    placeholder="hrs"
                    value={formData.tech_td_min}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="tech_td_sec" className="label">
                    {data?.payload?.tech_lang_keys["sec"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_td_sec"
                    id="tech_td_sec"
                    className="input my-2"
                    aria-label="input"
                    placeholder="sec"
                    value={formData.tech_td_sec}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="paragraph ">
              <p className="text-lg mt-4 ">
                {" "}
                {data?.payload?.tech_lang_keys["14"]}{" "}
              </p>
              <div className="col-12 mt-0 mt-lg-2 my-4 ">
                <div className="w-full py-2">
                  <textarea
                    name="tech_input"
                    id="tech_input"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                    aria-label="input"
                    value={formData.tech_input}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

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
              <div className="w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : result ? (
          <>
            <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
              <div>
                <ResultActions lang={data?.payload?.tech_lang_keys} />
                <div className="rounded-lg flex items-center justify-center">
                  <div className="w-full col-12 rounded-lg mt-3">
                    <div className="my-2">
                      {formData?.tech_sim_adv === "time_first" ? (
                        <div className="lg:w-3/3 text-lg">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex justify-between items-center border-b border-gray-300 py-2">
                              <span className="font-medium text-gray-600">
                                {data?.payload?.tech_lang_keys["10"]}
                              </span>
                              <span className="text-gray-900">
                                {Number(result?.tech_totalDays).toFixed(3)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-300 py-2">
                              <span className="font-medium text-gray-600">
                                {data?.payload?.tech_lang_keys["11"]}
                              </span>
                              <span className="text-gray-900">
                                {Number(result?.tech_totalHours).toFixed(3)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-300 py-2">
                              <span className="font-medium text-gray-600">
                                {data?.payload?.tech_lang_keys["12"]}
                              </span>
                              <span className="text-gray-900">
                                {Number(result?.tech_totalMin).toFixed(3)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-300 py-2">
                              <span className="font-medium text-gray-600">
                                {data?.payload?.tech_lang_keys["13"]}
                              </span>
                              <span className="text-gray-900">
                                {Number(result?.tech_totalSec).toFixed(3)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : formData?.tech_sim_adv === "time_second" ? (
                        <div className="text-center">
                          <div className="px-6 py-4 rounded-lg inline-block my-4 bg-sky bordered">
                            <p className="text-2xl font-bold text-blue-600">
                              {result?.tech_resTime}
                            </p>
                            <p className="text-lg text-gray-700">
                              {result?.tech_finalDate} {result?.tech_resDay}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="lg:w-full text-lg">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg">
                            <div className="flex justify-between items-center border-b border-gray-300 py-2">
                              <span className="font-medium text-gray-600">
                                {data?.payload?.tech_lang_keys["10"]}
                              </span>
                              <span className="text-gray-900">
                                {Number(result?.tech_daysResult).toFixed(3)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-300 py-2">
                              <span className="font-medium text-gray-600">
                                {data?.payload?.tech_lang_keys["11"]}
                              </span>
                              <span className="text-gray-900">
                                {Number(result?.tech_hoursResult).toFixed(3)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-300 py-2">
                              <span className="font-medium text-gray-600">
                                {data?.payload?.tech_lang_keys["12"]}
                              </span>
                              <span className="text-gray-900">
                                {Number(result?.tech_mintsResult).toFixed(3)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-300 py-2">
                              <span className="font-medium text-gray-600">
                                {data?.payload?.tech_lang_keys["13"]}
                              </span>
                              <span className="text-gray-900">
                                {Number(result?.tech_secondsResult).toFixed(3)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </form>
      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default TimeCalculator;

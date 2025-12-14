"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useHoursfromnowCalculationMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HoursFromNowCalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  let url = "";

  if (parts.length === 1) {
    url = parts[0];
  } else {
    url = parts[0] + "/" + parts[1];
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

  // Initial form state
  const [formData, setFormData] = useState({
    tech_time: "stat",
    tech_hours: "08",
    tech_minuts: "01",
    tech_sec: "00",
    tech_hrs: "2",
    tech_min: "45",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [timeFormat, setTimeFormat] = useState("12hr"); // Default 12hr format
  const intervalRef = useRef(null);

  // Update current time function
  const updateCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    let displayTime = "";
    if (timeFormat === "12hr") {
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      displayTime = `${hours
        .toString()
        .padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
    } else {
      displayTime = `${hours
        .toString()
        .padStart(2, "0")}:${minutes}:${seconds}`;
    }

    setCurrentTime(displayTime);

    if (formData.tech_time === "stat") {
      setFormData((prev) => ({
        ...prev,
        tech_hours: now.getHours().toString().padStart(2, "0"),
        tech_minuts: minutes,
        tech_sec: seconds,
      }));
    }
  };

  useEffect(() => {
    updateCurrentTime();
    intervalRef.current = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeFormat, formData.tech_time]);

  // RTK mutation hook
  const [calculateHourseFromNow, { isLoading: calculateDeadlineLoading }] =
    useHoursfromnowCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const response = await calculateHourseFromNow({
        tech_time: formData.tech_time,
        tech_hours: formData.tech_hours,
        tech_minuts: formData.tech_minuts,
        tech_sec: formData.tech_sec,
        tech_hrs: formData.tech_hrs,
        tech_min: formData.tech_min,
        tech_submit: formData.tech_submit,
      }).unwrap();

      setResult(response?.payload);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data?.payload?.error || "An error occurred");
      toast.error(err.data?.payload?.error || "An error occurred");
    }
  };

  const handleReset = () => {
    setFormData({
      tech_time: "stat",
      tech_hours: "08",
      tech_minuts: "01",
      tech_sec: "00",
      tech_hrs: "2",
      tech_min: "45",
      tech_submit: "calculate",
    });
    setResult(null);
    setFormError(null);
  };

  const handleNowClick = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      tech_hours: hours,
      tech_minuts: minutes,
      tech_sec: seconds,
      tech_time: "dyna",
    }));
  };

  // Format time function
  const formatTime = (timeString, format) => {
    if (!timeString) return "";

    // Check if timeString is already in HH:MM:SS format
    if (typeof timeString === "string" && timeString.includes(":")) {
      const [hours, minutes, seconds] = timeString.split(":");

      if (format === "12hr") {
        const hourNum = parseInt(hours, 10);
        const ampm = hourNum >= 12 ? "PM" : "AM";
        const displayHour = hourNum % 12 || 12;
        return `${displayHour
          .toString()
          .padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
      } else {
        return `${hours}:${minutes}:${seconds}`;
      }
    }

    // If it's a date string
    const date = new Date(timeString);
    if (isNaN(date)) return timeString;

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    if (format === "12hr") {
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours
        .toString()
        .padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
    } else {
      return `${hours.toString().padStart(2, "0")}:${minutes}:${seconds}`;
    }
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

          {/* Current Time Display */}
          <div className="text-center mb-6">
            <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="text-2xl font-bold text-blue-600">{currentTime}</p>
            </div>
          </div>

          {/* Time Format Selection for Input */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            <span className="text-sm font-medium">Time Format:</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="timeFormat"
                value="24hr"
                className="mr-2"
                checked={timeFormat === "24hr"}
                onChange={(e) => setTimeFormat(e.target.value)}
              />
              <span className="text-sm">24 Hours</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="timeFormat"
                value="12hr"
                className="mr-2"
                checked={timeFormat === "12hr"}
                onChange={(e) => setTimeFormat(e.target.value)}
              />
              <span className="text-sm">12 Hours am/pm</span>
            </label>
          </div>

          <div className="lg:w-[50%] md:w-[50%] w-full mx-auto">
            {/* Mode Selection */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              <div className="space-y-2 relative">
                <label className="inline-flex items-center cursor-pointer pe-2">
                  <input
                    type="radio"
                    name="tech_time"
                    value="stat"
                    id="stat"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_time === "stat"}
                  />
                  <span>
                    {data?.payload?.tech_lang_keys?.["1"] || "Use current time"}
                  </span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="tech_time"
                    className="mr-2 border"
                    value="dyna"
                    id="dyna"
                    onChange={handleChange}
                    checked={formData.tech_time === "dyna"}
                  />
                  <span>
                    {data?.payload?.tech_lang_keys?.["2"] ||
                      "Enter specific time"}
                  </span>
                </label>
              </div>
            </div>

            {/* Time Input */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-center gap-4">
                {/* Hours */}
                <div className="w-full">
                  <label
                    htmlFor="tech_hours"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={timeFormat === "24hr" ? "23" : "12"}
                    name="tech_hours"
                    id="tech_hours"
                    className={`input w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      formData.tech_time === "stat"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={formData.tech_time === "stat"}
                    value={formData.tech_hours}
                    onChange={handleChange}
                  />
                </div>

                <span className="text-2xl font-bold mt-5">:</span>

                {/* Minutes */}
                <div className="w-full">
                  <label
                    htmlFor="tech_minuts"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Minutes
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    name="tech_minuts"
                    id="tech_minuts"
                    className={`input w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      formData.tech_time === "stat"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={formData.tech_time === "stat"}
                    value={formData.tech_minuts}
                    onChange={handleChange}
                  />
                </div>

                <span className="text-2xl font-bold mt-5">:</span>

                {/* Seconds */}
                <div className="w-full">
                  <label
                    htmlFor="tech_sec"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Seconds
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    name="tech_sec"
                    id="tech_sec"
                    className={`input w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      formData.tech_time === "stat"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={formData.tech_time === "stat"}
                    value={formData.tech_sec}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Now Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleNowClick}
                  className="px-4 py-2 bg-gray-200 cursor-pointer hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Set to Current Time
                </button>
              </div>
            </div>

            {/* Add Time Inputs */}
            <div className="grid grid-cols-1 gap-4 mt-6">
              <div className="flex items-center justify-center gap-4">
                {/* Hours to Add */}
                <div className="w-full">
                  <label
                    htmlFor="tech_hrs"
                    className="block text-sm font-medium text-blue-600 mb-1"
                  >
                    {data?.payload?.tech_lang_keys?.["3"] || "Hours to Add"}
                  </label>
                  <input
                    type="number"
                    name="tech_hrs"
                    id="tech_hrs"
                    className="input w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.tech_hrs}
                    onChange={handleChange}
                  />
                </div>

                <span className="text-2xl font-bold mt-5">:</span>

                {/* Minutes to Add */}
                <div className="w-full">
                  <label
                    htmlFor="tech_min"
                    className="block text-sm font-medium text-blue-600 mb-1"
                  >
                    {data?.payload?.tech_lang_keys?.["4"] || "Minutes to Add"}
                  </label>
                  <input
                    type="number"
                    name="tech_min"
                    id="tech_min"
                    className="input w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.tech_min}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={calculateDeadlineLoading}>
              {data?.payload?.tech_lang_keys?.["calculate"] || "Calculate"}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys?.["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>

        {/* Loading State */}
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
          /* Result Display */
          result && (
            <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6">
              <div>
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                <div className="rounded-lg flex items-center justify-center">
                  <div className="w-full bg-blue-50 p-3 rounded-lg mt-3">
                    <div className="flex flex-col items-center justify-center">
                      {/* Result Time Format Selection */}
                      <div className="mb-4">
                        <span className="pr-4 text-sm">
                          Output Time Format:
                        </span>
                        <label className="inline-flex items-center cursor-pointer mr-4">
                          <input
                            type="radio"
                            name="resultTimeFormat"
                            value="12hr"
                            id="result12hr"
                            className="mr-2 cursor-pointer border"
                            checked={timeFormat === "12hr"}
                            onChange={(e) => setTimeFormat(e.target.value)}
                          />
                          <label
                            htmlFor="result12hr"
                            className="text-sm cursor-pointer"
                          >
                            12 Hours am/pm
                          </label>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="resultTimeFormat"
                            value="24hr"
                            id="result24hr"
                            className="mr-2 cursor-pointer border"
                            checked={timeFormat === "24hr"}
                            onChange={(e) => setTimeFormat(e.target.value)}
                          />
                          <label
                            htmlFor="result24hr"
                            className="text-sm cursor-pointer"
                          >
                            24 Hours
                          </label>
                        </label>
                      </div>

                      {/* Result Display */}
                      <div className="bg-[#2845F5] text-[#fff] px-6 py-4 rounded-lg text-center w-full max-w-md">
                        <p className="text-3xl font-bold mb-2">
                          {formatTime(
                            result?.tech_full_date || result?.tech_time,
                            timeFormat
                          )}
                        </p>
                        <p className="text-sm text-gray-300">
                          {formData.tech_time === "stat"
                            ? "Current time"
                            : "Entered time"}{" "}
                          + {formData.tech_hrs} hours {formData.tech_min}{" "}
                          minutes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </form>

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default HoursFromNowCalculator;

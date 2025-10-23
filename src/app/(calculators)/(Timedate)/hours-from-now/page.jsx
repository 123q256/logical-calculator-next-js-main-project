"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useHoursfromnowCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HoursFromNowCalculator = (selectedDate) => {
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
    tech_time: "stat",
    tech_hours: "",
    tech_minuts: "",
    tech_sec: "",
    tech_hrs: "",
    tech_min: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const intervalRef = useRef(null);

  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      tech_hours: hours,
      tech_minuts: minutes,
      tech_sec: seconds,
    }));
  };

  useEffect(() => {
    if (formData.tech_time === "stat") {
      updateTime(); // Immediately set current time
      intervalRef.current = setInterval(updateTime, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current); // cleanup
  }, [formData.tech_time]);

  // useEffect(() => {
  //   const now = new Date(); // 👈 yeh line add karo
  //   const hours = now.getHours().toString().padStart(2, "0");
  //   const minutes = now.getMinutes().toString().padStart(2, "0");
  //   const currentTime = `${hours}:${minutes}`;

  //   setFormData((prev) => ({
  //     ...prev,
  //     tech_time: currentTime,
  //   }));
  // }, []);

  // RTK mutation hook
  const [
    calculateHourseFromNow,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useHoursfromnowCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_time ||
      !formData.tech_hours ||
      !formData.tech_minuts ||
      !formData.tech_sec
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateHourseFromNow({
        tech_time: formData.tech_time,
        tech_hours: formData.tech_hours,
        tech_minuts: formData.tech_minuts,
        tech_sec: formData.tech_sec,
        tech_hrs: formData.tech_hrs,
        tech_min: formData.tech_min,
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
      tech_time: "stat",
      tech_hours: "",
      tech_minuts: "",
      tech_sec: "",
      tech_hrs: "",
      tech_min: "",
    });
    setResult(null);
    setFormError(null);
  };
  const years = Array.from({ length: 101 }, (_, i) => 1950 + i);

  // const handleNowClick = () => {
  //   const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  //   setFormData((prev) => ({
  //     ...prev,
  //     tech_time: today,
  //   }));
  // };

  const handleNowClick = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;

    setFormData((prev) => ({
      ...prev,
      tech_time: currentTime,
    }));
  };

  const [timeFormat, setTimeFormat] = useState("twhr"); // "twhr" = 12hr, "tfhr" = 24hr
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    if (result?.tech_hoursadding) {
      setFormattedTime(formatTime(result.tech_hoursadding, timeFormat));
    }
  }, [result, timeFormat]);
  const formatTime = (isoString, format) => {
    if (!isoString || typeof isoString !== "string") return "Invalid Time";

    const date = new Date(isoString);
    if (isNaN(date)) return "Invalid Time";

    let hours = date.getUTCHours(); // UTC hours
    let minutes = date.getUTCMinutes(); // UTC minutes
    let seconds = date.getUTCSeconds(); // UTC seconds

    if (format === "twhr") {
      const suffix = hours >= 12 ? "PM" : "AM";
      const hr = ((hours + 11) % 12) + 1;
      return `${hr}:${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")} ${suffix}`;
    } else {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
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

          <div className="lg:w-[50%] md:w-[50%] w-full mx-auto ">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2 relative mb-5">
                <label className="pe-2" htmlFor="stat">
                  <input
                    type="radio"
                    name="tech_time"
                    value="stat"
                    id="stat"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_time === "stat"}
                  />
                  <span>{data?.payload?.tech_lang_keys["1"]}</span>
                </label>
                <label htmlFor="dyna">
                  <input
                    type="radio"
                    name="tech_time"
                    className="mr-2 border"
                    value="dyna"
                    id="dyna"
                    onChange={handleChange}
                    checked={formData.tech_time === "dyna"}
                  />
                  <span>{data?.payload?.tech_lang_keys["2"]}</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex gap-5 mt-3 items-center">
                <div className="w-full inputshow">
                  <div className="w-full pt-1 pb-2">
                    <input
                      type="text"
                      step="any"
                      name="tech_hours"
                      id="tech_hours"
                      className={`input w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#38A169] ${
                        formData.tech_time === "stat"
                          ? "bg-[#f8f6f6] cursor-not-allowed"
                          : ""
                      }`}
                      aria-label="input"
                      disabled={formData.tech_time === "stat"}
                      value={formData.tech_hours}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <p className="mb-1">:</p>
                <div className="w-full inputshow">
                  <div className="w-full pt-1 pb-2">
                    <input
                      type="text"
                      step="any"
                      name="tech_minuts"
                      id="tech_minuts"
                      className={`input w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#38A169] ${
                        formData.tech_time === "stat"
                          ? "bg-[#f8f6f6] cursor-not-allowed"
                          : ""
                      }`}
                      aria-label="input"
                      disabled={formData.tech_time === "stat"}
                      value={formData.tech_minuts}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <p className="mb-1">:</p>
                <div className="w-full inputshow">
                  <div className="w-full pt-1 pb-2">
                    <input
                      type="text"
                      step="any"
                      name="tech_sec"
                      id="tech_sec"
                      className={`input w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#38A169] ${
                        formData.tech_time === "stat"
                          ? "bg-[#f8f6f6] cursor-not-allowed"
                          : ""
                      }`}
                      aria-label="input"
                      disabled={formData.tech_time === "stat"}
                      value={formData.tech_sec}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex gap-5 mt-2 items-center">
                <div className=" w-full inputshow">
                  <label htmlFor="tech_hrs" className="text-sm text-[#38A169]">
                    {data?.payload?.tech_lang_keys["3"]}
                  </label>
                  <div className="w-full pt-1 pb-2">
                    <input
                      type="text"
                      step="any"
                      name="tech_hrs"
                      id="tech_hrs"
                      className="input w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#38A169]"
                      aria-label="input"
                      value={formData.tech_hrs}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <p className="mt-2">:</p>
                <div className=" w-full inputshow">
                  <label htmlFor="tech_min" className="text-sm text-[#38A169]">
                    {data?.payload?.tech_lang_keys["4"]}
                  </label>
                  <div className="w-full pt-1 pb-2">
                    <input
                      type="text"
                      step="any"
                      name="tech_min"
                      id="tech_min"
                      className="input w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#38A169]"
                      aria-label="input"
                      value={formData.tech_min}
                      onChange={handleChange}
                    />
                  </div>
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
                    <div className="w-full bg-light-blue result p-3 rounded-lg mt-3 overflow-auto">
                      <div className="flex flex-wrap justify-center">
                        <div className="w-full text-center">
                          <span className="pr-4 text-sm block md:inline-block">
                            Output Time Format:
                          </span>
                          <input
                            type="radio"
                            name="time_st"
                            id="twhr"
                            className="cursor-pointer ml-3 border  mx-2"
                            value="twhr"
                            checked={timeFormat === "twhr"}
                            onChange={(e) => setTimeFormat(e.target.value)}
                          />
                          <label
                            htmlFor="twhr"
                            className="text-sm cursor-pointer text-[#38A169] pr-4 md:pr-6"
                          >
                            12 Hours am/pm
                          </label>
                          <input
                            type="radio"
                            className="cursor-pointer  border mx-2"
                            name="time_st"
                            id="tfhr"
                            value="tfhr"
                            checked={timeFormat === "tfhr"}
                            onChange={(e) => setTimeFormat(e.target.value)}
                          />
                          <label
                            htmlFor="tfhr"
                            className="text-sm cursor-pointer text-[#38A169]"
                          >
                            24 Hours
                          </label>
                          <div>
                            <p className="text-xl bg-[#2845F5] text-white px-4 py-2 rounded-lg inline-block my-3">
                              <strong id="currentTime">
                                {formatTime(
                                  result?.tech_hoursadding,
                                  timeFormat
                                )}
                              </strong>
                            </p>
                          </div>
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

export default HoursFromNowCalculator;

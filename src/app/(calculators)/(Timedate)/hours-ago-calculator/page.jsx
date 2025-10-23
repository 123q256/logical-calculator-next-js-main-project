"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useHoursagoCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TimeAgoCalculator = (selectedDate) => {
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

  // RTK mutation hook
  const [
    calculateHourseFromNow,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useHoursagoCalculationMutation();

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

  const today = new Date();

  useEffect(() => {
    const table = document
      .getElementById("weeksContainer")
      ?.querySelector("tbody");

    if (!table || table.children.length > 0) return;

    const htmlContent = Array.from({ length: 50 }, (_, i) => {
      const index = i + 1;
      const subtractedTimeDate = subtractTime(today, index, index);
      const formattedDate = formatDateString(subtractedTimeDate);
      const formattedDateS = formatDate(subtractedTimeDate);
      const formattedTime = formatTimeString(subtractedTimeDate);
      return `
        <tr>
          <td><time datetime="PT${index}H">${index} Hours ago</time></td>
          <td><time datetime="${formattedDateS}">${formattedDate}</time></td>
          <td><time datetime="${formattedDateS}">${formattedTime}</time></td>
        </tr>`;
    }).join("");

    setTimeout(() => {
      table.innerHTML = htmlContent;
    }, 500);
  }, [data?.payload?.tech_content]);

  // Helper functions
  function formatDateString(date) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatTimeString(date) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  function subtractTime(date, hours, minutes) {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - hours);
    newDate.setMinutes(newDate.getMinutes() - minutes);
    return newDate;
  }

  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

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
              <div className="flex gap-2  items-center">
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
              <div className="flex gap-2  items-center">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full p-3 rounded-lg mt-3 overflow-auto">
                      <div className="lg:w-5/12 mx-auto p-1">
                        <div className="bordered rounded-lg bg-sky p-2 text-center">
                          <p>🕑 Time</p>
                          <p className="text-2xl">
                            <strong className="text-blue">
                              {result?.tech_time}
                            </strong>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center text-center">
                        <div className="lg:w-1/2 w-full p-1">
                          <div className="bordered rounded-lg bg-sky p-2">
                            <p className="pb-2">📅 Date</p>
                            <p className="text-lg">
                              <strong>{result?.tech_t_date}</strong>
                            </p>
                          </div>
                        </div>
                        <div className="lg:w-1/2 w-full p-1">
                          <div className="bordered rounded-lg bg-sky p-2">
                            <p className="pb-2">🌞 Day</p>
                            <p className="text-lg">
                              <strong>{result?.tech_days}</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-center p-2">
                        What is <strong>{formData?.tech_hours || 0}</strong>{" "}
                        hours,
                        <strong>{formData?.tech_minuts || 0}</strong> minute,
                        <strong>{formData?.tech_sec || 0}</strong> second ago?
                        The answer is <strong>{result?.tech_time}</strong> on{" "}
                        <strong>{result?.tech_t_date}</strong> which is{" "}
                        <strong>{result?.tech_days}</strong> days from the time
                        of calculation using this Time Ago Calculator.
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

export default TimeAgoCalculator;

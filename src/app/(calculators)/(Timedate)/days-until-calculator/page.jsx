"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDaysuntilCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

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

  const [formData, setFormData] = useState({
    tech_current: "2025-02-01",
    tech_next: "2025-05-26",
    tech_startEvent: "empty",
    tech_inc_all: "on",
    tech_inc_day: "",
    tech_weekDay: [],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateLovePercentage,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useDaysuntilCalculationMutation();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    // If it's a checkbox, set 'checked' value, otherwise set 'value'
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? "on" : "") : value,
    }));

    if (name === "tech_startEvent") {
      handleEventDateCalculation(value); // Calculate event start and end date
    }
  };

  // Calculate event end date based on selected event
  const handleEventDateCalculation = (selectedEvent) => {
    const currentYear = new Date().getFullYear();
    let eventDate;

    switch (selectedEvent) {
      case "Thanksgiving (Canada)":
        eventDate = new Date(currentYear, 9, 15); // October 14, 2025
        break;
      case "Halloween":
        eventDate = new Date(currentYear, 10, 1); // October 31, 2025
        break;
      case "Thanksgiving (US)":
        eventDate = new Date(currentYear, 10, 29); // November 28, 2025
        break;
      case "Christmas":
        eventDate = new Date(currentYear, 11, 26); // December 25, 2025
        break;
      case "New Year's Eve":
        eventDate = new Date(currentYear + 1, 0, 2); // January 1, 2025
        break;
      case "Easter (Easter Sunday)":
        eventDate = new Date(currentYear + 1, 3, 21); // April 20, 2025
        break;
      default:
        eventDate = new Date(currentYear + 1, 0, 1); // Default to January 1 of the next year
        break;
    }

    // Calculate the end date, which is 1 day after the selected event date
    const endEventDate = new Date(eventDate);
    endEventDate.setDate(eventDate.getDate() + 1); // Set to 1 day after the event

    // Format the start and end dates as YYYY-MM-DD
    const formattedStartDate = eventDate.toISOString().split("T")[0];
    const formattedEndDate = endEventDate.toISOString().split("T")[0];

    // Update formData with start and end event dates
    setFormData((prevData) => ({
      ...prevData,
      tech_next: formattedStartDate,
      tech_endEvent: formattedEndDate,
    }));

    setResult(null); // Reset result after form change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_current || !formData.tech_next) {
      setFormError("Please fill in Field.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateLovePercentage({
        tech_current: formData.tech_current,
        tech_next: formData.tech_next,
        tech_startEvent: formData.tech_startEvent,
        tech_inc_all: formData.tech_inc_all,
        tech_inc_day: formData.tech_inc_day,
        tech_weekDay: formData.tech_weekDay,
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
      tech_current: "2025-02-01",
      tech_next: "2025-05-26",
      tech_startEvent: "empty",
      tech_inc_all: "",
      tech_inc_day: "on",
      tech_weekDay: [],
    });
    setResult(null);
    setFormError(null);
  };

  // Set current date on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    setFormData((prev) => ({ ...prev, tech_current: today }));
  }, []);

  const handleWeekDayChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        tech_weekDay: [...prevFormData.tech_weekDay, value], // ✅ Add new value
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        tech_weekDay: prevFormData.tech_weekDay.filter((day) => day !== value), // ✅ Remove unchecked value
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Convert the string to Date object
    const date = new Date(dateString);

    // Adjust to Pakistan Standard Time (UTC+5)
    const pstOffset = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
    const pakistanDate = new Date(date.getTime() + pstOffset); // Add the offset to convert to PST

    const options = {
      weekday: "long", // Full name of the weekday (e.g., Saturday)
      day: "2-digit", // Two-digit day (e.g., 26)
      month: "long", // Full month name (e.g., April)
      year: "numeric", // Four-digit year (e.g., 2025)
    };

    return pakistanDate.toLocaleDateString("en-GB", options); // Format the date in Pakistani time
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_current" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <input
                  type="date"
                  name="tech_current"
                  id="tech_current"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_current}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_next" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <input
                  type="date"
                  name="tech_next"
                  id="tech_next"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_next}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_startEvent" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_startEvent"
                    id="tech_startEvent"
                    value={formData.tech_startEvent}
                    onChange={handleChange}
                  >
                    <option value="empty">---</option>
                    <option value="Thanksgiving (Canada)">
                      Thanksgiving (Canada)
                    </option>
                    <option value="Halloween">Halloween </option>
                    <option value="Thanksgiving (US)">
                      Thanksgiving (US){" "}
                    </option>
                    <option value="Christmas">Christmas </option>
                    <option value="New Year's Eve">New Year's Eve </option>
                    <option value="Easter (Easter Sunday)">
                      Easter (Easter Sunday){" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 mt-3">
              <div className="toggle-label ">
                <span>Include all days?</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="tech_inc_all"
                    id="chkPassport"
                    checked={formData.tech_inc_all === "on"}
                    onChange={handleChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-label ">
                <span>Include end day?</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="tech_inc_day"
                    checked={formData.tech_inc_day === "on"}
                    onChange={handleChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            {formData?.tech_inc_all == "" && (
              <div id="dvPassport" className="px-2 mt-2">
                <label htmlFor="currency" className="heading">
                  Days to include:
                </label>
                <span className="radio-switch ">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, index) => (
                      <div key={index} className="inline-block mr-1">
                        <input
                          type="checkbox"
                          id={`check-${index}`}
                          name="weekDay"
                          value={day}
                          checked={formData.tech_weekDay.includes(day)}
                          onChange={handleWeekDayChange}
                        />
                        <label htmlFor={`check-${index}`} className="px-1">
                          {day.charAt(0)}
                        </label>
                      </div>
                    )
                  )}
                </span>
                <span className="clearElement"></span>
              </div>
            )}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lgspace-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  {/* <div className="grid grid-cols-12 border rounded-[10px] overflow-hidden mt-3">
                      <div className="col-span-4 border-b border-gray-300 bg-sky-100 py-3 px-2 rounded-tl-[10px]">
                        From:
                      </div>
                      <div className="col-span-8 border-b border-gray-300 py-3 px-2">
                        {formatDate(formData?.tech_current)}
                      </div>
                      <div className="col-span-4 bg-sky-100 py-3 px-2 rounded-bl-[10px]">
                        To:
                      </div>
                      <div className="col-span-8 py-3 px-2">
                      {formatDate(formData?.tech_next)}
                        {formData?.tech_next && (
                          <strong className="ml-2">(inc. end day)</strong>
                        )}
                      </div>
                    </div> */}

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full radius-10 mt-3 overflow-auto">
                      <div className="loader-container">
                        <div id="loading"></div>
                        <div className="loader-text"></div>
                      </div>
                      <div className="loader-container d-none">
                        <div id="loading"></div>
                        <div className="loader-text"></div>
                      </div>
                      <div className="w-full">
                        {formData?.tech_inc_all == "on" && (
                          <>
                            {result?.tech_totaldays ? (
                              <p className="border-b pt-2 pb-1">
                                <strong
                                  id="months"
                                  className="text text-[20px] me-1"
                                >
                                  {result?.tech_totaldays} Total Days
                                </strong>
                              </p>
                            ) : (
                              <p className="text-[20px] text-gray-500">
                                0 Total Days
                              </p>
                            )}

                            {result?.tech_months ? (
                              <p className="border-b pt-2 pb-1">
                                <strong
                                  id="months"
                                  className="text text-[20px] me-1"
                                >
                                  {result?.tech_months} Months
                                </strong>
                              </p>
                            ) : (
                              <p className="text-[20px] text-gray-500">
                                0 Months
                              </p>
                            )}
                          </>
                        )}

                        <div className="border-b pt-2 pb-1 flex">
                          {formData?.tech_inc_all == "on" && (
                            <>
                              {result?.tech_weeks ? (
                                <p className=" pt-2 pb-1">
                                  <strong
                                    id="weeks"
                                    className="text text-[20px] me-1"
                                  >
                                    {result?.tech_weeks} Weeks
                                  </strong>
                                </p>
                              ) : (
                                <p className="text-[20px] text-gray-500">
                                  0 Weeks
                                </p>
                              )}
                            </>
                          )}
                        </div>

                        <div className="border-b pt-2 pb-1 flex">
                          {result?.tech_days ? (
                            <p className=" pt-2 pb-1">
                              <strong
                                id="weeks"
                                className="text text-[20px] me-1"
                              >
                                {result?.tech_days} Days
                              </strong>
                            </p>
                          ) : (
                            <p className="text-[20px] text-gray-500">0 Days</p>
                          )}
                        </div>
                        <div className="border-b pt-2 pb-1 flex">
                          {result?.tech_hours ? (
                            <p className="border-b pt-2">
                              <strong
                                id="hours"
                                className="text text-[20px] me-1"
                              >
                                {result?.tech_hours} Hours
                              </strong>
                            </p>
                          ) : (
                            <p className="text-[20px] text-gray-500">0 hours</p>
                          )}
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

export default DeadlineCalculator;

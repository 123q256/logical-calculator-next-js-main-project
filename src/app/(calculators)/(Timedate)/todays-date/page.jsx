"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTodaysdateCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WhatIsTodaysDate = () => {
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

  const [isClient, setIsClient] = useState(false);
  const [now, setNow] = useState(null);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [currentDate, setCurrentDate] = useState(null);
  const [info, setInfo] = useState({});

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

  // RTK mutation hook
  const [
    calculateLovePercentage,
    {
      isLoading: calculateWhattodayLoading,
      isError,
      error: calculateLoveError,
    },
  ] = useTodaysdateCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      const response = await calculateLovePercentage({}).unwrap();
      setResult(response);
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError("Error calculating");
      toast.error("Error calculating");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({});
    setResult(null);
    setFormError(null);
  };

  useEffect(() => {
    setIsClient(true);
    setNow(dayjs());
    setCurrentDate(dayjs());

    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isClient) {
      const today = new Date();
      const remainingDays = getRemainingDaysInYear(today);
      const weekNumber = getWeekNumber(today);
      const { startOfWeek, endOfWeek } = getWeekStartEnd(today);
      const monthNumber = getMonthNumber(today);

      setInfo({
        today,
        remainingDays,
        weekNumber,
        startOfWeek,
        endOfWeek,
        monthNumber,
      });
    }
  }, [isClient]);

  // Helper functions
  function getRemainingDaysInYear(date) {
    const endOfYear = new Date(date.getFullYear(), 11, 31);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.ceil((endOfYear - date) / oneDay);
  }

  function getWeekNumber(date) {
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const pastDays = (date - firstJan) / (1000 * 60 * 60 * 24);
    return Math.ceil((pastDays + firstJan.getDay() + 1) / 7);
  }

  function getWeekStartEnd(date) {
    const day = date.getDay(); // 0 = Sunday
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - day);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek };
  }

  function getMonthNumber(date) {
    return date.getMonth() + 1; // January = 1
  }

  function formatDateString(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  // Calendar logic (only when client-side)
  let startOfMonth = null;
  let endOfMonth = null;
  let startDay = 0;
  let daysInMonth = 0;
  let prevMonthDays = 0;
  let prevMonthStart = 0;
  let daysArray = [];
  let weeks = [];

  if (isClient && currentDate) {
    startOfMonth = currentDate.startOf("month");
    endOfMonth = currentDate.endOf("month");
    startDay = startOfMonth.day();
    daysInMonth = currentDate.daysInMonth();
    prevMonthDays = startOfMonth.subtract(1, "month").daysInMonth();
    prevMonthStart = prevMonthDays - startDay + 1;

    // Fill in previous month days
    for (let i = prevMonthStart; i <= prevMonthDays; i++) {
      daysArray.push({ day: i, currentMonth: false });
    }

    // Fill in current month days
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({ day: i, currentMonth: true });
    }

    // Fill in next month days to complete full weeks
    const totalCells = Math.ceil(daysArray.length / 7) * 7;
    const nextMonthDays = totalCells - daysArray.length;

    for (let i = 1; i <= nextMonthDays; i++) {
      daysArray.push({ day: i, currentMonth: false });
    }

    for (let i = 0; i < daysArray.length; i += 7) {
      weeks.push(daysArray.slice(i, i + 7));
    }
  }

  const goToPrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const goToNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const isLeapYear =
    isClient && now
      ? now.isLeapYear?.() ||
        (now.year() % 4 === 0 && now.year() % 100 !== 0) ||
        now.year() % 400 === 0
      : false;

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
      <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
        {formError && (
          <p className="text-red-500 text-lg font-semibold w-full">
            {formError}
          </p>
        )}

        <div className="lg:w-[80%] md:w-[80%] w-full mx-auto text-center">
          <div className="w-full flex justify-center">
            <div className="w-20">
              <div className="article-thumbnail article-thumbnail-spaceless">
                <img
                  src="/images/r_days.png"
                  alt="icon for a calendar with one day highlighted red"
                  width="80"
                  height="auto"
                  loading="eager"
                />
              </div>
            </div>
          </div>
          <h2 className="mt-3 text-sm date_today">
            {data?.payload?.tech_lang_keys["1"]}
          </h2>

          {!isClient ? (
            <>
              <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mx-auto mt-2"></div>
              <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2 mx-auto mt-2"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4 mx-auto mt-2"></div>
            </>
          ) : (
            <>
              <p className="text-xl mt-2 mb-1 mt-[20px]">
                <span className="text-sm my-5 date_today1">
                  {now.format("dddd, MMMM D, YYYY")}
                </span>
              </p>
              <h2 id="time" className="text-lg font-medium text-blue-600">
                {now.format("HH:mm:ss")}
              </h2>
              <div id="gmt" className="mt-2 text-sm text-gray-500">
                GMT {now.format("Z")}
              </div>
            </>
          )}

          <div className="w-full mt-3">
            <div className="lg:w-[80%] md:w-[80%] w-full mx-auto">
              {isClient && currentDate ? (
                <>
                  <div className="calendar bg-[#ffffff] rounded-lg overflow-hidden">
                    <div className="grid grid-cols-7 text-center font-medium text-sm bg-gray-200">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div key={day} className="py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="days p-2 text-sm">
                      <div className="w-full max-w-md mx-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-3">
                          <button
                            onClick={goToPrevMonth}
                            className="text-xl px-2"
                          >
                            ◀
                          </button>
                          <h2 className="text-lg font-semibold text-blue-600">
                            {currentDate.format("MMMM YYYY")}
                          </h2>
                          <button
                            onClick={goToNextMonth}
                            className="text-xl px-2"
                          >
                            ▶
                          </button>
                        </div>
                        {/* Weekdays */}
                        <div className="grid grid-cols-7 text-center font-semibold text-gray-600">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                            (day) => (
                              <div key={day} className="py-1">
                                {day}
                              </div>
                            )
                          )}
                        </div>
                        {/* Dates */}
                        <div className="grid grid-cols-7 text-center mt-1">
                          {weeks.map((week, wIdx) => (
                            <React.Fragment key={wIdx}>
                              {week.map((dayObj, dIdx) => (
                                <div
                                  key={dIdx}
                                  className={`py-2 border border-gray-100 ${
                                    dayObj.currentMonth
                                      ? "text-black"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {dayObj.day}
                                </div>
                              ))}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="display-selected mt-3 text-blue-600 font-medium">
                    <p className="selected">{now.format("dddd, MMMM D")}</p>
                  </div>
                </>
              ) : (
                <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
              )}
            </div>
          </div>
        </div>

        {isClient && now && (
          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto mt-5">
            <p className="text-base mt-3 text-left">
              {data?.payload?.tech_lang_keys["2"]}, {now.format("MMMM Do")},{" "}
              {data?.payload?.tech_lang_keys["3"]}{" "}
              <strong className="text-blue-500">
                {now.dayOfYear?.() ||
                  now.diff(dayjs(now.format("YYYY-01-01")), "day") + 1}
              </strong>{" "}
              {data?.payload?.tech_lang_keys["4"]}{" "}
              {isLeapYear ? "366 is a leap year" : "365 is not a leap year"}{" "}
              {data?.payload?.tech_lang_keys["5"]} {now.year()}.
            </p>
            <div
              id="date-info"
              className="text-base elementrySteps mt-4 text-left"
            >
              <p className="mt-1">
                There are{" "}
                <strong className="text-blue">{info.remainingDays}</strong> days
                remaining in this year{" "}
                <strong className="text-blue">
                  {info.today?.getFullYear()}
                </strong>
                .
              </p>
              <p className="mt-1">
                The current week number: {info.weekNumber} (of 52)
              </p>
              <p className="mt-1">
                The current week:{" "}
                <strong className="text-blue">
                  {info.startOfWeek && formatDateString(info.startOfWeek)} –{" "}
                  {info.endOfWeek && formatDateString(info.endOfWeek)}
                </strong>
              </p>
              <p className="mt-1">
                The year{" "}
                <strong className="text-blue">
                  {info.today?.getFullYear()}
                </strong>{" "}
                has 52 weeks.
              </p>
              <p className="mt-1">
                Today's month number is:
                <strong className="text-blue"> {info.monthNumber} </strong>
              </p>
            </div>
          </div>
        )}
      </div>

      {calculateWhattodayLoading ? (
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
          <div className="animate-pulse">
            <div className="w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
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
              </div>
            </div>
          </>
        )
      )}

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default WhatIsTodaysDate;

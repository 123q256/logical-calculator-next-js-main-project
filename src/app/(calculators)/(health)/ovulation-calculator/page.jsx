"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useOvulationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const OvulationCalculator = () => {
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

  // Set default date to today
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    tech_date: getTodayDate(),
    tech_days: "28",
    tech_Luteal: "14",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const calendarRef = useRef(null);

  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useOvulationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_date || !formData.tech_days) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_date: formData.tech_date,
        tech_days: formData.tech_days,
        tech_Luteal: formData.tech_Luteal,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  const handleReset = () => {
    setFormData({
      tech_date: getTodayDate(),
      tech_days: "28",
      tech_Luteal: "14",
    });
    setResult(null);
    setFormError(null);
  };

  // Calendar Component
  const Calendar = ({ events = [], eventsInfo = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getDaysInMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const prevMonth = (e) => {
      e.preventDefault(); // Form submit rokne ke liye
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
    };

    const nextMonth = (e) => {
      e.preventDefault(); // Form submit rokne ke liye
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
    };

    const getEventInfo = (dateStr) => {
      const index = events.indexOf(dateStr);
      return index !== -1 ? eventsInfo[index] : null;
    };

    const handleDayClick = (day, isCurrentMonth) => {
      if (!isCurrentMonth) return;

      const dateStr = formatDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      );
      const eventInfo = getEventInfo(dateStr);

      if (eventInfo) {
        setSelectedEvent({
          date: dateStr,
          info: eventInfo,
        });
      }
    };

    const closeEvent = () => {
      setSelectedEvent(null);
    };

    // Generate calendar days
    const renderCalendarDays = () => {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDay = getFirstDayOfMonth(currentDate);
      const today = new Date();
      const todayStr = formatDate(today);

      const daysArray = [];

      // Previous month days
      const prevMonthDays = getDaysInMonth(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
      for (let i = firstDay - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        daysArray.push(
          <td key={`prev-${day}`} className="text-gray-400 p-1">
            <div className="text-center">{day}</div>
          </td>
        );
      }

      // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDate(
          new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        );
        const eventInfo = getEventInfo(dateStr);
        const isToday = dateStr === todayStr;
        const isEvent = eventInfo !== null;

        daysArray.push(
          <td key={`current-${day}`} className="p-1 border">
            <div
              className={`text-center cursor-pointer rounded-lg p-2 ${
                isToday
                  ? "bg-blue-500 text-white"
                  : isEvent
                  ? "bg-green-100 border border-green-300"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleDayClick(day, true)}
              title={eventInfo || ""}
            >
              {day}
              {isEvent && (
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
              )}
            </div>
          </td>
        );
      }

      // Next month days
      const totalCells = 42; // 6 weeks * 7 days
      const nextMonthDays = totalCells - daysArray.length;
      for (let day = 1; day <= nextMonthDays; day++) {
        daysArray.push(
          <td key={`next-${day}`} className="text-gray-400 p-1">
            <div className="text-center">{day}</div>
          </td>
        );
      }

      // Split into weeks
      const weeks = [];
      for (let i = 0; i < daysArray.length; i += 7) {
        weeks.push(<tr key={`week-${i}`}>{daysArray.slice(i, i + 7)}</tr>);
      }

      return weeks;
    };

    return (
      <div className="calendar bg-white rounded-lg shadow-sm p-4 overflow-auto">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            type="button" // Yeh line add karo
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <img
              src="/images/tarrow-left.png"
              alt="Previous"
              className="w-6 h-6"
            />
          </button>

          <h3 className="text-lg font-semibold">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>

          <button
            type="button" // Yeh line add karo
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <img
              src="/images/tarrow-right.png"
              alt="Next"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Days Header */}
        <table className="w-full border-collapse text-[10px] md:text-[14px] ">
          <thead>
            <tr className="bg-blue-50">
              {days.map((day) => (
                <th
                  key={day}
                  className="p-2 text-sm font-medium text-blue-700 border"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderCalendarDays()}</tbody>
        </table>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Event Details</h3>
                <button
                  onClick={closeEvent}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Date:</strong> {selectedEvent.date}
              </p>
              <p className="text-sm">
                <strong>Event:</strong> {selectedEvent.info}
              </p>
              <button
                onClick={closeEvent}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span>Fertile/Ovulation</span>
          </div>
        </div>
      </div>
    );
  };

  // Currency code
  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  });

  useEffect(() => {
    const fetchCurrency = async () => {
      const result = await getUserCurrency();
      if (result) {
        setCurrency(result);
      }
    };
    fetchCurrency();
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
          <div className="lg:w-[50%] md:w-[50%] w-full mx-auto">
            <div className="grid grid-cols-12 mt-3 gap-1 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_date" className="label">
                  {data?.payload?.tech_lang_keys["first_date"] ||
                    "First Date of Last Menstrual Period"}
                  :
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="tech_date"
                    id="tech_date"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-span-12">
                <label htmlFor="tech_days" className="label">
                  {data?.payload?.tech_lang_keys["number_days"] ||
                    "Average Cycle Length (days)"}
                  :
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="tech_days"
                    id="tech_days"
                    className="input my-2"
                    aria-label="input"
                    placeholder="28"
                    min="20"
                    max="40"
                    value={formData.tech_days}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-span-12">
                <label htmlFor="tech_Luteal" className="label">
                  {data?.payload?.tech_lang_keys["l_p"] ||
                    "Luteal Phase Length (days)"}
                  :
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="tech_Luteal"
                    id="tech_Luteal"
                    className="input my-2"
                    aria-label="input"
                    placeholder="14"
                    min="10"
                    max="20"
                    value={formData.tech_Luteal}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys["calculate"] || "Calculate"}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg p-1 flex items-center justify-center">
                    <div className="w-full  rounded-lg mt-3">
                      <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
                        {/* Ovulation Day Card */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <div className="bg-[#6fab4d12] text-center rounded-lg px-3 py-2">
                            <div className="w-full mx-auto">
                              <p>
                                <strong>Your Ovulation Day is</strong>
                              </p>
                              <p className="text-2xl mt-3">
                                <strong className="text-green-500">
                                  {result?.tech_Ovu_date}
                                </strong>
                              </p>
                              <div className="bg-white text-sm rounded-lg p-3 mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["last_date"] ||
                                    "Last Period"}
                                  <span className="text-gray-500 ml-2">
                                    {formData?.tech_date}
                                  </span>
                                </strong>
                              </div>
                              <div className="bg-white text-sm rounded-lg p-3 mt-3 mb-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["c_l"] ||
                                    "Cycle Length"}
                                  <span className="text-gray-500 ml-2">
                                    {formData?.tech_days}{" "}
                                    {data?.payload?.tech_lang_keys["days"] ||
                                      "days"}
                                  </span>
                                </strong>
                              </div>
                            </div>
                          </div>
                          {/* 6 Cycle Table */}
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-2">
                            <div className="bg-[#6fab4d12] rounded-lg p-2 pt-3">
                              <p className="text-center">
                                <strong className="text-blue-500">
                                  {data?.payload?.tech_lang_keys["6cycle"] ||
                                    "6 Cycle Overview"}
                                </strong>
                              </p>
                              <div className="w-full   p-3 overflow-auto cycle6_table result_table">
                                <table className="w-full mt-2" cellSpacing="0">
                                  <tbody>
                                    <tr>
                                      <td className="bordered border-gray-400 text-xs p-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[
                                            "p_s"
                                          ] || "Period Start"}
                                        </strong>
                                      </td>
                                      <td className="bordered border-gray-400 text-xs p-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[
                                            "o_w"
                                          ] || "Ovulation Window"}
                                        </strong>
                                      </td>
                                      <td className="bordered border-gray-400 text-xs p-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[
                                            "d_d"
                                          ] || "Due Date"}
                                        </strong>
                                      </td>
                                    </tr>
                                  </tbody>
                                  <tbody
                                    className="space-y-7"
                                    dangerouslySetInnerHTML={{
                                      __html: result.tech_table,
                                    }}
                                  />
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ovulation Calendar */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <div className="bg-[#6fab4d12] text-center bordered rounded-lg p-2">
                            <p>
                              <strong className="text-blue-500">
                                Ovulation Calendar
                              </strong>
                            </p>
                            <Calendar
                              events={[
                                result?.tech_event3,
                                result?.tech_event4,
                                result?.tech_event5,
                                result?.tech_event6,
                                result?.tech_event7,
                                result?.tech_event8,
                                result?.tech_event9,
                                result?.tech_event10,
                                result?.tech_event11,
                                result?.tech_event12,
                                result?.tech_event13,
                                result?.tech_event14,
                                result?.tech_event15,
                                result?.tech_event16,
                                result?.tech_event17,
                                result?.tech_event18,
                                result?.tech_event19,
                                result?.tech_event20,
                                result?.tech_event21,
                                result?.tech_event22,
                                result?.tech_event23,
                                result?.tech_event24,
                                result?.tech_event25,
                                result?.tech_event26,
                                result?.tech_event27,
                                result?.tech_event28,
                                result?.tech_event29,
                                result?.tech_event30,
                                result?.tech_event31,
                                result?.tech_event32,
                              ].filter(Boolean)}
                              eventsInfo={[
                                "Fertile Period",
                                "Fertile Period",
                                "Ovulation Date",
                                "Fertile Period",
                                "Fertile Period",
                                "Fertile Period",
                                "Fertile Period",
                                "Ovulation Date",
                                "Fertile Period",
                                "Fertile Period",
                                "Fertile Period",
                                "Fertile Period",
                                "Ovulation Date",
                                "Fertile Period",
                                "Fertile Period",
                                "Fertile Period",
                                "Fertile Period",
                                "Ovulation Date",
                                "Fertile Period",
                                "Fertile Period",
                                "Fertile Period",
                                "Fertile Period",
                                "Ovulation Date",
                                "Fertile Period",
                                "Fertile Period",
                                "Fertile Period",
                                "Fertile Period",
                                "Ovulation Date",
                                "Fertile Period",
                                "Fertile Period",
                              ]}
                            />
                          </div>
                        </div>

                        {/* Fertile Period & Next Period */}
                        <div className="col-span-12">
                          <div className="bg-[#6fab4d12] text-center rounded-lg p-2">
                            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-white bordered text-sm rounded-lg p-2">
                                  <img
                                    src="/images/fertile.png"
                                    alt="Fertile Period"
                                    className=" h-10  mt-3 object-cover mx-auto"
                                  />
                                  <p className="text-blue-500 mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[
                                        "fertile"
                                      ] || "Fertile Period"}
                                    </strong>
                                  </p>
                                  <p>
                                    {result?.tech_First_day} to{" "}
                                    {result?.tech_Last_day}
                                  </p>
                                </div>
                              </div>

                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-white bordered text-sm rounded-lg p-2">
                                  <img
                                    src="/images/next_period.png"
                                    alt="Next Period"
                                    className=" h-15 mx-auto"
                                  />
                                  <p className="text-blue-500">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[
                                        "next_period"
                                      ] || "Next Period"}
                                    </strong>
                                  </p>
                                  <p>{result?.tech_Next_period}</p>
                                </div>
                              </div>

                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-white bordered text-sm rounded-lg p-2">
                                  <img
                                    src="/images/window.png"
                                    alt="Intercourse Window for Pregnancy"
                                    className=" h-13 mx-auto"
                                  />
                                  <p className="text-blue-500 mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[
                                        "inter_w"
                                      ] || "Intercourse Window"}
                                    </strong>
                                  </p>
                                  <p>
                                    {result?.tech_First_day} to{" "}
                                    {result?.tech_Last_day}
                                  </p>
                                </div>
                              </div>

                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-white bordered text-sm rounded-lg p-2">
                                  <img
                                    src="/images/safe.png"
                                    alt="Safe Period"
                                    className=" h-10 mx-auto"
                                  />
                                  <p className="text-blue-500">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["save"] ||
                                        "Safe Period"}
                                    </strong>
                                  </p>
                                  <p>{result?.tech_save}</p>
                                  <p>{result?.tech_saven}</p>
                                </div>
                              </div>

                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-white bordered text-sm rounded-lg p-2">
                                  <img
                                    src="/images/expected_date.png"
                                    alt="Due Date"
                                    className=" h-13 mx-auto"
                                  />
                                  <p className="text-blue-500">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[
                                        "due_date"
                                      ] || "Due Date"}
                                    </strong>
                                  </p>
                                  <p>{result?.tech_Due_date}</p>
                                </div>
                              </div>

                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-white bordered text-sm rounded-lg p-2">
                                  <img
                                    src="/images/test.png"
                                    alt="Pregnancy Test"
                                    className=" h-10 mx-auto"
                                  />
                                  <p className="text-blue-500 mt-4">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["p_t"] ||
                                        "Pregnancy Test"}
                                    </strong>
                                  </p>
                                  <p>{result?.tech_test}</p>
                                </div>
                              </div>
                            </div>
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

export default OvulationCalculator;

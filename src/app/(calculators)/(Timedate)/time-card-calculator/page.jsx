"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
import {
  useGetSingleCalculatorDetailsMutation,
  useMidpointCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

const TimeCardCalculator = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [calculatePay, setCalculatePay] = useState(false);
  const [saveValues, setSaveValues] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(15);

  // data get

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
  // data get

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook   // data get
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMidpointCalculatorMutation();
  // data get

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [weeklyData, setWeeklyData] = useState([
    {
      day: "Monday",
      clockInHour: "01",
      clockInMinute: "10",
      clockInPeriod: "AM",
      breakHour: "2",
      breakMinute: "00",
      clockOutHour: "12",
      clockOutMinute: "50",
      clockOutPeriod: "PM",
      workHours: "9h 40m",
    },
    {
      day: "Tuesday",
      clockInHour: "00",
      clockInMinute: "00",
      clockInPeriod: "AM",
      breakHour: "00",
      breakMinute: "00",
      clockOutHour: "00",
      clockOutMinute: "00",
      clockOutPeriod: "PM",
      workHours: "0.00",
    },
    {
      day: "Wednesday",
      clockInHour: "00",
      clockInMinute: "00",
      clockInPeriod: "AM",
      breakHour: "00",
      breakMinute: "00",
      clockOutHour: "00",
      clockOutMinute: "00",
      clockOutPeriod: "PM",
      workHours: "0.00",
    },
    {
      day: "Thursday",
      clockInHour: "00",
      clockInMinute: "00",
      clockInPeriod: "AM",
      breakHour: "00",
      breakMinute: "00",
      clockOutHour: "00",
      clockOutMinute: "00",
      clockOutPeriod: "PM",
      workHours: "0.00",
    },
    {
      day: "Friday",
      clockInHour: "00",
      clockInMinute: "00",
      clockInPeriod: "AM",
      breakHour: "00",
      breakMinute: "00",
      clockOutHour: "00",
      clockOutMinute: "00",
      clockOutPeriod: "PM",
      workHours: "0.00",
    },
    {
      day: "Saturday",
      clockInHour: "00",
      clockInMinute: "00",
      clockInPeriod: "AM",
      breakHour: "00",
      breakMinute: "00",
      clockOutHour: "00",
      clockOutMinute: "00",
      clockOutPeriod: "PM",
      workHours: "0.00",
    },
    {
      day: "Sunday",
      clockInHour: "00",
      clockInMinute: "00",
      clockInPeriod: "AM",
      breakHour: "00",
      breakMinute: "00",
      clockOutHour: "00",
      clockOutMinute: "00",
      clockOutPeriod: "PM",
      workHours: "0.00",
    },
  ]);

  const [weeks, setWeeks] = useState([weeklyData]);
  const [totalHours, setTotalHours] = useState("9h 40m");
  const [totalPay, setTotalPay] = useState(0);

  // Calculate work hours for a single day
  const calculateWorkHours = (
    clockInHour,
    clockInMinute,
    clockInPeriod,
    clockOutHour,
    clockOutMinute,
    clockOutPeriod,
    breakHour,
    breakMinute
  ) => {
    if (
      !clockInHour ||
      !clockInMinute ||
      !clockOutHour ||
      !clockOutMinute ||
      clockInHour === "00" ||
      clockOutHour === "00"
    ) {
      return "0.00";
    }

    // Convert to 24-hour format
    let inHour = parseInt(clockInHour);
    let outHour = parseInt(clockOutHour);

    if (clockInPeriod === "PM" && inHour !== 12) inHour += 12;
    if (clockInPeriod === "AM" && inHour === 12) inHour = 0;
    if (clockOutPeriod === "PM" && outHour !== 12) outHour += 12;
    if (clockOutPeriod === "AM" && outHour === 12) outHour = 0;

    const inMinutes = inHour * 60 + parseInt(clockInMinute);
    let outMinutes = outHour * 60 + parseInt(clockOutMinute);

    // Handle overnight shifts
    if (outMinutes < inMinutes) {
      outMinutes += 24 * 60;
    }

    const workMinutes =
      outMinutes -
      inMinutes -
      (parseInt(breakHour) * 60 + parseInt(breakMinute));

    if (workMinutes <= 0) return "0.00";

    const hours = Math.floor(workMinutes / 60);
    const minutes = workMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  // Update a specific day's data
  const updateDayData = (weekIndex, dayIndex, field, value) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex][dayIndex][field] = value;

    // Recalculate work hours for this day
    const dayData = newWeeks[weekIndex][dayIndex];
    newWeeks[weekIndex][dayIndex].workHours = calculateWorkHours(
      dayData.clockInHour,
      dayData.clockInMinute,
      dayData.clockInPeriod,
      dayData.clockOutHour,
      dayData.clockOutMinute,
      dayData.clockOutPeriod,
      dayData.breakHour,
      dayData.breakMinute
    );

    setWeeks(newWeeks);
    calculateTotals();
  };

  // Calculate total hours across all weeks
  const calculateTotals = () => {
    let totalMinutes = 0;
    let totalPayAmount = 0;

    weeks.forEach((week) => {
      week.forEach((day) => {
        if (day.workHours !== "0.00" && day.workHours.includes("h")) {
          const parts = day.workHours.split("h ");
          const hours = parseInt(parts[0]) || 0;
          const minutes = parseInt(parts[1]) || 0;
          totalMinutes += hours * 60 + minutes;
        }
      });
    });

    const totalHoursNum = Math.floor(totalMinutes / 60);
    const totalMins = totalMinutes % 60;
    const totalHoursStr = `${totalHoursNum}h ${totalMins}m`;

    setTotalHours(totalHoursStr);

    if (calculatePay) {
      totalPayAmount = (totalMinutes / 60) * hourlyRate;
      setTotalPay(totalPayAmount.toFixed(2));
    }
  };

  // Add a new week
  const addWeek = () => {
    const newWeek = daysOfWeek.map((day) => ({
      day,
      clockInHour: "00",
      clockInMinute: "00",
      clockInPeriod: "AM",
      breakHour: "00",
      breakMinute: "00",
      clockOutHour: "00",
      clockOutMinute: "00",
      clockOutPeriod: "PM",
      workHours: "0.00",
    }));
    setWeeks([...weeks, newWeek]);
  };

  // Remove a week
  const removeWeek = (weekIndex) => {
    if (weeks.length > 1) {
      const newWeeks = weeks.filter((_, index) => index !== weekIndex);
      setWeeks(newWeeks);
      setTimeout(calculateTotals, 100);
    }
  };

  // Fill first row data to all rows in current week
  const fillFirstRowData = (weekIndex) => {
    const firstDay = weeks[weekIndex][0];
    const newWeeks = [...weeks];

    newWeeks[weekIndex] = newWeeks[weekIndex].map((day, index) => {
      if (index === 0) return day; // Keep first row as is

      return {
        ...day,
        clockInHour: firstDay.clockInHour,
        clockInMinute: firstDay.clockInMinute,
        clockInPeriod: firstDay.clockInPeriod,
        breakHour: firstDay.breakHour,
        breakMinute: firstDay.breakMinute,
        clockOutHour: firstDay.clockOutHour,
        clockOutMinute: firstDay.clockOutMinute,
        clockOutPeriod: firstDay.clockOutPeriod,
        workHours: calculateWorkHours(
          firstDay.clockInHour,
          firstDay.clockInMinute,
          firstDay.clockInPeriod,
          firstDay.clockOutHour,
          firstDay.clockOutMinute,
          firstDay.clockOutPeriod,
          firstDay.breakHour,
          firstDay.breakMinute
        ),
      };
    });

    setWeeks(newWeeks);
    setTimeout(calculateTotals, 100);
  };

  // Clear all fields
  const clearAllFields = () => {
    const clearedWeeks = weeks.map((week) =>
      week.map((day) => ({
        ...day,
        clockInHour: "00",
        clockInMinute: "00",
        clockInPeriod: "AM",
        breakHour: "00",
        breakMinute: "00",
        clockOutHour: "00",
        clockOutMinute: "00",
        clockOutPeriod: "PM",
        workHours: "0.00",
      }))
    );
    setWeeks(clearedWeeks);
    setTotalHours("0h 0m");
    setTotalPay(0);
  };

  // Remove a day (mark it with red X)
  const removeDay = (weekIndex, dayIndex) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex][dayIndex] = {
      ...newWeeks[weekIndex][dayIndex],
      clockInHour: "00",
      clockInMinute: "00",
      clockInPeriod: "AM",
      breakHour: "00",
      breakMinute: "00",
      clockOutHour: "00",
      clockOutMinute: "00",
      clockOutPeriod: "PM",
      workHours: "0.00",
    };
    setWeeks(newWeeks);
    calculateTotals();
  };

  // Export functions
  const exportToPDF = () => {
    window.print();
  };

  const exportToCSV = () => {
    let csvContent =
      "Employee Name,Date,Day,Clock In,Break Time,Clock Out,Work Hours\n";

    weeks.forEach((week, weekIndex) => {
      week.forEach((day) => {
        const clockIn = `${day.clockInHour}:${day.clockInMinute} ${day.clockInPeriod}`;
        const breakTime = `${day.breakHour}:${day.breakMinute}`;
        const clockOut = `${day.clockOutHour}:${day.clockOutMinute} ${day.clockOutPeriod}`;

        csvContent += `${employeeName},${currentDate},${day.day},${clockIn},${breakTime},${clockOut},${day.workHours}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "timecard.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    calculateTotals();
  }, [weeks, calculatePay, hourlyRate]);

  return (
    <>
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 bg-white rounded-lg space-y-6 mb-3">
          <div className="p bg-white rounded-lg  overflow-hidden">
            {/* Employee Info */}
            <div className="  border-b">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name:
                  </label>
                  <input
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="Jhon"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date:
                  </label>
                  <input
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            {/* Time Card Tables */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className=" border-b">
                {/* Week Header with Remove Button */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Week {weekIndex + 1}
                  </h3>
                  {weeks.length > 1 && (
                    <button
                      onClick={() => removeWeek(weekIndex)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Remove this week"
                    >
                      <span>❌</span>
                      <span className="text-sm">Remove Week</span>
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-500 text-white">
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Day
                        </th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">
                          Clock In
                        </th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">
                          Break Time
                        </th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">
                          Clock Out
                        </th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">
                          Work Hours
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {week.map((day, dayIndex) => (
                        <tr
                          key={dayIndex}
                          className={
                            dayIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="border border-gray-300 p-3 font-medium">
                            {day.day}
                          </td>

                          {/* Clock In */}
                          <td className="border border-gray-300 p-3">
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                min="00"
                                max="12"
                                value={day.clockInHour}
                                onChange={(e) =>
                                  updateDayData(
                                    weekIndex,
                                    dayIndex,
                                    "clockInHour",
                                    e.target.value.padStart(2, "0")
                                  )
                                }
                                className="w-12 p-1 border border-gray-300 rounded text-center"
                              />
                              <span>:</span>
                              <input
                                type="number"
                                min="00"
                                max="59"
                                value={day.clockInMinute}
                                onChange={(e) =>
                                  updateDayData(
                                    weekIndex,
                                    dayIndex,
                                    "clockInMinute",
                                    e.target.value.padStart(2, "0")
                                  )
                                }
                                className="w-12 p-1 border border-gray-300 rounded text-center"
                              />
                              <select
                                value={day.clockInPeriod}
                                onChange={(e) =>
                                  updateDayData(
                                    weekIndex,
                                    dayIndex,
                                    "clockInPeriod",
                                    e.target.value
                                  )
                                }
                                className="p-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </td>

                          {/* Break Time */}
                          <td className="border border-gray-300 p-3">
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                min="0"
                                max="23"
                                value={day.breakHour}
                                onChange={(e) =>
                                  updateDayData(
                                    weekIndex,
                                    dayIndex,
                                    "breakHour",
                                    e.target.value
                                  )
                                }
                                className="w-12 p-1 border border-gray-300 rounded text-center"
                              />
                              <span>:</span>
                              <input
                                type="number"
                                min="00"
                                max="59"
                                value={day.breakMinute}
                                onChange={(e) =>
                                  updateDayData(
                                    weekIndex,
                                    dayIndex,
                                    "breakMinute",
                                    e.target.value.padStart(2, "0")
                                  )
                                }
                                className="w-12 p-1 border border-gray-300 rounded text-center"
                              />
                            </div>
                          </td>

                          {/* Clock Out */}
                          <td className="border border-gray-300 p-3">
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                min="00"
                                max="12"
                                value={day.clockOutHour}
                                onChange={(e) =>
                                  updateDayData(
                                    weekIndex,
                                    dayIndex,
                                    "clockOutHour",
                                    e.target.value.padStart(2, "0")
                                  )
                                }
                                className="w-12 p-1 border border-gray-300 rounded text-center"
                              />
                              <span>:</span>
                              <input
                                type="number"
                                min="00"
                                max="59"
                                value={day.clockOutMinute}
                                onChange={(e) =>
                                  updateDayData(
                                    weekIndex,
                                    dayIndex,
                                    "clockOutMinute",
                                    e.target.value.padStart(2, "0")
                                  )
                                }
                                className="w-12 p-1 border border-gray-300 rounded text-center"
                              />
                              <select
                                value={day.clockOutPeriod}
                                onChange={(e) =>
                                  updateDayData(
                                    weekIndex,
                                    dayIndex,
                                    "clockOutPeriod",
                                    e.target.value
                                  )
                                }
                                className="p-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                              <button
                                onClick={() => removeDay(weekIndex, dayIndex)}
                                className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                ❌
                              </button>
                            </div>
                          </td>

                          {/* Work Hours */}
                          <td className="border border-gray-300 p-3 text-center font-medium">
                            {day.workHours}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Week Actions */}
                <div className="mt-4 flex flex-wrap gap-4">
                  <button
                    onClick={addWeek}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Add Week
                  </button>

                  {weeks.length > 1 && (
                    <button
                      onClick={() => removeWeek(weekIndex)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Remove This Week
                    </button>
                  )}

                  <button
                    onClick={() => fillFirstRowData(weekIndex)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors cursor-pointer"
                  >
                    Add first row data in each row
                  </button>

                  <button
                    onClick={clearAllFields}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors cursor-pointer"
                  >
                    Clear all fields
                  </button>

                  <div className="ml-auto flex items-center gap-4">
                    <span className="font-bold text-lg">
                      Total Hours: {totalHours}
                    </span>
                    {calculatePay && (
                      <span className="font-bold text-lg text-green-600">
                        Total Pay: ${totalPay}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Options & Export */}
            <div className=" bg-gray-50 border-t">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={calculatePay}
                      onChange={(e) => setCalculatePay(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span>Calculate pay</span>
                  </label>

                  {calculatePay && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Hourly Rate: $</label>
                      <input
                        type="number"
                        step="0.01"
                        value={hourlyRate}
                        onChange={(e) =>
                          setHourlyRate(parseFloat(e.target.value) || 0)
                        }
                        className="w-20 p-1 border border-gray-300 rounded"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={saveValues}
                      onChange={(e) => setSaveValues(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span>Save values in the browser</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={exportToPDF}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Print
                  </button>

                  <button
                    onClick={exportToPDF}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Export (PDF)
                  </button>

                  <button
                    onClick={exportToCSV}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    Export (CSV)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      </Calculator>
    </>
  );
};

export default TimeCardCalculator;

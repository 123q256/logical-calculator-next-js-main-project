"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAgeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AgeCalculator = () => {
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

  // ✅ Define it before using
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleStartDateChange = (date) => {
    setStartDate1(date);
    setFormData((prev) => ({
      ...prev,
      tech_day: date.getDate().toString(),
      tech_month: (date.getMonth() + 1).toString(),
      tech_year: date.getFullYear().toString(),
    }));
  };

  const handleEndDateChange = (date) => {
    setStartDate2(date);
    setFormData((prev) => ({
      ...prev,
      tech_day_sec: date.getDate().toString(),
      tech_month_sec: (date.getMonth() + 1).toString(),
      tech_year_sec: date.getFullYear().toString(),
    }));
  };

  const [formData, setFormData] = useState({
    tech_day: "1",
    tech_month: "1",
    tech_year: "1999",
    tech_day_sec: "1",
    tech_month_sec: "5",
    tech_year_sec: "2025",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAgeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_day ||
      !formData.tech_month ||
      !formData.tech_year ||
      !formData.tech_day_sec ||
      !formData.tech_month_sec ||
      !formData.tech_year_sec
    ) {
      setFormError("Please fill in input.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_day: formData.tech_day,
        tech_month: formData.tech_month,
        tech_year: formData.tech_year,
        tech_day_sec: formData.tech_day_sec,
        tech_month_sec: formData.tech_month_sec,
        tech_year_sec: formData.tech_year_sec,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_day: "1",
      tech_month: "1",
      tech_year: "1999",
      tech_day_sec: "1",
      tech_month_sec: "5",
      tech_year_sec: "2025",
    });
    setResult(null);
    setFormError(null);
  };
  // currency code
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
  // currency code
  const [dropdown, setDropdown] = useState({
    day: false,
    month: false,
    year: false,
    daySec: false,
    monthSec: false,
    yearSec: false,
  });

  const days = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const years = Array.from({ length: 100 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );
  const futureYears = Array.from({ length: 50 }, (_, i) =>
    (new Date().getFullYear() + i).toString()
  );

  const [startDate1, setStartDate1] = useState(null);
  const [startDate2, setStartDate2] = useState(null);

  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdown({
          day: false,
          month: false,
          year: false,
          daySec: false,
          monthSec: false,
          yearSec: false,
        });
        setIsOpen1(false);
        setIsOpen2(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (field) => {
    setDropdown((prev) => ({
      ...Object.fromEntries(Object.keys(prev).map((k) => [k, false])),
      [field]: !prev[field],
    }));
  };

  const handleSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setDropdown((prev) => ({ ...prev, [field]: false }));
  };

  const handleCalendar1 = (date) => {
    setStartDate1(date);
    setIsOpen1(false);

    const d = new Date(date);
    setFormData((prev) => ({
      ...prev,
      tech_day: d.getDate().toString().padStart(2, "0"),
      tech_month: (d.getMonth() + 1).toString().padStart(2, "0"),
      tech_year: d.getFullYear().toString(),
    }));
  };

  const handleCalendar2 = (date) => {
    setStartDate2(date);
    setIsOpen2(false);
    const d = new Date(date);
    setFormData((prev) => ({
      ...prev,
      tech_day_sec: d.getDate().toString().padStart(2, "0"),
      tech_month_sec: (d.getMonth() + 1).toString().padStart(2, "0"),
      tech_year_sec: d.getFullYear().toString(),
    }));
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

          <div
            className="w-full lg:w-[60%] md:w-[80%] mx-auto"
            ref={wrapperRef}
          >
            <div className="flex flex-wrap">
              {/* First Date */}
              <label className="label w-full font-semibold mt-4">
                Date of Birth:
              </label>
              <div className="grid grid-cols-12 gap-2 w-full mt-2">
                {/* Day */}
                <div className="lg:col-span-3 md:col-span-3 col-span-6 relative">
                  <input
                    type="text"
                    value={formData.tech_day}
                    onClick={() => toggleDropdown("tech_day")}
                    readOnly
                    placeholder="DD"
                    className="input border w-full px-2 py-2 rounded cursor-pointer"
                  />
                  {dropdown.tech_day && (
                    <ul className="absolute bg-white w-full shadow max-h-48 overflow-y-auto z-10">
                      {days.map((d, idx) => (
                        <li
                          key={idx}
                          className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleSelect("tech_day", d)}
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Month */}
                <div className="lg:col-span-3 md:col-span-3 col-span-6 relative">
                  <input
                    type="text"
                    value={formData.tech_month}
                    onClick={() => toggleDropdown("tech_month")}
                    readOnly
                    placeholder="MM"
                    className="input border w-full px-2 py-2 rounded cursor-pointer"
                  />
                  {dropdown.tech_month && (
                    <ul className="absolute bg-white w-full shadow max-h-48 overflow-y-auto z-10">
                      {months.map((m, idx) => (
                        <li
                          key={idx}
                          className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleSelect("tech_month", m)}
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Year */}
                <div className="lg:col-span-3 md:col-span-3 col-span-6 relative">
                  <input
                    type="text"
                    value={formData.tech_year}
                    onClick={() => toggleDropdown("tech_year")}
                    readOnly
                    placeholder="YYYY"
                    className="input border w-full px-2 py-2 rounded cursor-pointer"
                  />
                  {dropdown.tech_year && (
                    <ul className="absolute bg-white w-full shadow max-h-48 overflow-y-auto z-10">
                      {years.map((y, idx) => (
                        <li
                          key={idx}
                          className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleSelect("tech_year", y)}
                        >
                          {y}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Calendar Image 1 */}
                <div className="lg:col-span-3 md:col-span-3 col-span-6 flex items-center">
                  <img
                    src="/images/age_calendar.png"
                    alt="calendar"
                    className="cursor-pointer w-10 h-9"
                    onClick={() => setIsOpen1(!isOpen1)}
                  />
                  {isOpen1 && (
                    <div className="absolute z-20 mt-10">
                      <DatePicker
                        selected={startDate1}
                        onChange={handleCalendar1}
                        inline
                        maxDate={new Date()}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Second Date */}
              <label className="label w-full font-semibold mt-6">
                Find Age on:
              </label>
              <div className="grid grid-cols-12 gap-2 w-full mt-2">
                {/* Day */}
                <div className="lg:col-span-3 md:col-span-3 col-span-6 relative">
                  <input
                    type="text"
                    value={formData.tech_day_sec}
                    onClick={() => toggleDropdown("tech_day_sec")}
                    readOnly
                    placeholder="DD"
                    className="input border w-full px-2 py-2 rounded cursor-pointer"
                  />
                  {dropdown.tech_day_sec && (
                    <ul className="absolute bg-white w-full shadow max-h-48 overflow-y-auto z-10">
                      {days.map((d, idx) => (
                        <li
                          key={idx}
                          className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleSelect("tech_day_sec", d)}
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Month */}
                <div className="lg:col-span-3 md:col-span-3 col-span-6 relative">
                  <input
                    type="text"
                    value={formData.tech_month_sec}
                    onClick={() => toggleDropdown("tech_month_sec")}
                    readOnly
                    placeholder="MM"
                    className="input border w-full px-2 py-2 rounded cursor-pointer"
                  />
                  {dropdown.tech_month_sec && (
                    <ul className="absolute bg-white w-full shadow max-h-48 overflow-y-auto z-10">
                      {months.map((m, idx) => (
                        <li
                          key={idx}
                          className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleSelect("tech_month_sec", m)}
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Year */}
                <div className="lg:col-span-3 md:col-span-3 col-span-6 relative">
                  <input
                    type="text"
                    value={formData.tech_year_sec}
                    onClick={() => toggleDropdown("tech_year_sec")}
                    readOnly
                    placeholder="YYYY"
                    className="input border w-full px-2 py-2 rounded cursor-pointer"
                  />
                  {dropdown.tech_year_sec && (
                    <ul className="absolute bg-white w-full shadow max-h-48 overflow-y-auto z-10">
                      {futureYears.map((y, idx) => (
                        <li
                          key={idx}
                          className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleSelect("tech_year_sec", y)}
                        >
                          {y}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Calendar Image 2 */}
                <div className="lg:col-span-3 md:col-span-3 col-span-6 flex items-center">
                  <img
                    src="/images/age_calendar.png"
                    alt="calendar"
                    className="cursor-pointer w-10 h-9"
                    onClick={() => setIsOpen2(!isOpen2)}
                  />
                  {isOpen2 && (
                    <div className="absolute z-20 mt-10">
                      <DatePicker
                        selected={startDate2}
                        onChange={handleCalendar2}
                        inline
                        minDate={new Date()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
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
        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
            <div className="animate-pulse">
              <div className=" w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4 "></div>
              <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3 "></div>
              <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3 "></div>
              <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] "></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="grid grid-cols-12 mt-3 gap-4">
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg p-4 text-center">
                              <p className="borderab py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[60]} :
                                </strong>
                              </p>
                              <p className="py-2 lg:text-[20px] md:text-[20px] text-[18px]">
                                <b className="text-[#119154]">
                                  {result?.tech_age_years[0]}
                                </b>{" "}
                                {data?.payload?.tech_lang_keys["years"]}{" "}
                                <b className="text-[#119154]">
                                  {result?.tech_age_months[0]}
                                </b>{" "}
                                {data?.payload?.tech_lang_keys["months"]}{" "}
                                <b className="text-[#119154]">
                                  {result?.tech_age_days[0]}
                                </b>{" "}
                                {data?.payload?.tech_lang_keys["days"]}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg p-4 text-center">
                              <p className="borderab py-2 ">
                                <strong>
                                  {data?.payload?.tech_lang_keys[108]} :
                                </strong>
                              </p>
                              <p className="py-2 text-[20px] font-bold text-[#119154]">
                                {formData?.tech_day_sec}-
                                {formData?.tech_month_sec}-
                                {formData?.tech_year_sec}
                                {/* {formatDate(result?.tech_dates_array[0])} */}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="w-full md:w-[80%] lg:w-[80%]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="pt-3 pb-1">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["lived"]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-">
                                  {data?.payload?.tech_lang_keys["90"]} :
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_Total_years[0]}</strong>{" "}
                                  {data?.payload?.tech_lang_keys["years"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-">
                                  {data?.payload?.tech_lang_keys["91"]} :
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {result?.tech_Total_months[0]}
                                  </strong>{" "}
                                  {data?.payload?.tech_lang_keys["months"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-">
                                  {data?.payload?.tech_lang_keys["92"]} :
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_Total_weeks[0]}</strong>{" "}
                                  {data?.payload?.tech_lang_keys["weeks"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-">
                                  {data?.payload?.tech_lang_keys["93"]} :
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_Total_days[0]}</strong>{" "}
                                  {data?.payload?.tech_lang_keys["days"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-">
                                  {data?.payload?.tech_lang_keys["94"]} :
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_Total_hours[0]}</strong>{" "}
                                  {data?.payload?.tech_lang_keys["hours"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-">
                                  {data?.payload?.tech_lang_keys["95"]} :
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {result?.tech_Total_minuts[0]}
                                  </strong>{" "}
                                  {data?.payload?.tech_lang_keys["minute"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["96"]} :
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {result?.tech_Total_seconds[0]}
                                  </strong>{" "}
                                  {data?.payload?.tech_lang_keys["seconds"]}
                                </td>
                              </tr>

                              <tr>
                                <td colSpan={2} className="pt-3 pb-1">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["22"]}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  {data?.payload?.tech_lang_keys[23]} :
                                </td>
                                <td className="border-b">
                                  {result?.tech_breath[0]}{" "}
                                  {data?.payload?.tech_lang_keys[24]}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  {data?.payload?.tech_lang_keys[25]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_heartBeats[0]}{" "}
                                  {data?.payload?.tech_lang_keys[26]}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  {data?.payload?.tech_lang_keys[29]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_laughed[0]}{" "}
                                  {data?.payload?.tech_lang_keys[26]}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  {data?.payload?.tech_lang_keys[30]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_sleeping[0]}{" "}
                                  {data?.payload?.tech_lang_keys["years"]}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  {data?.payload?.tech_lang_keys[64]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_hair_length_m[0]} m
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  {data?.payload?.tech_lang_keys[65]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_nail_length_m[0]} m
                                </td>
                              </tr>
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

export default AgeCalculator;

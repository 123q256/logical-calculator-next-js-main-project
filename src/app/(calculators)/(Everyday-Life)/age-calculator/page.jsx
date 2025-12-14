"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useAgeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AgeCalculator = () => {
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

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
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
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

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

  const [dropdown, setDropdown] = useState({
    tech_day: false,
    tech_month: false,
    tech_year: false,
    tech_day_sec: false,
    tech_month_sec: false,
    tech_year_sec: false,
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
          tech_day: false,
          tech_month: false,
          tech_year: false,
          tech_day_sec: false,
          tech_month_sec: false,
          tech_year_sec: false,
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

  // Helper function to safely get array values
  const getValue = (arr) => {
    return arr && Array.isArray(arr) && arr.length > 0 ? arr[0] : "0";
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
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
              <label className="label w-full font-semibold mt-4">
                Date of Birth:
              </label>
              <div className="grid grid-cols-12 gap-2 w-full mt-2">
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

              <label className="label w-full font-semibold mt-6">
                Find Age on:
              </label>
              <div className="grid grid-cols-12 gap-2 w-full mt-2">
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

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys?.["calculate"] || "Calculate"}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys?.["locale"] === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys?.["reset"] || "RESET"}
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
          result &&
          result && (
            <>
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
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
                                  {data?.payload?.tech_lang_keys?.[60] ||
                                    "Your Age"}{" "}
                                  :
                                </strong>
                              </p>
                              <p className="py-2 lg:text-[20px] md:text-[20px] text-[18px]">
                                <b className="text-[#119154]">
                                  {getValue(result?.tech_age_years)}
                                </b>{" "}
                                {data?.payload?.tech_lang_keys?.["years"] ||
                                  "Years"}{" "}
                                <b className="text-[#119154]">
                                  {getValue(result?.tech_age_months)}
                                </b>{" "}
                                {data?.payload?.tech_lang_keys?.["months"] ||
                                  "Months"}{" "}
                                <b className="text-[#119154]">
                                  {getValue(result?.tech_age_days)}
                                </b>{" "}
                                {data?.payload?.tech_lang_keys?.["days"] ||
                                  "Days"}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg p-4 text-center">
                              <p className="borderab py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys?.[108] ||
                                    "Your Birth Date"}{" "}
                                  :
                                </strong>
                              </p>
                              <p className="py-2 text-[20px] font-bold text-[#119154]">
                                {formData?.tech_day_sec}-
                                {formData?.tech_month_sec}-
                                {formData?.tech_year_sec}
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
                                    {data?.payload?.tech_lang_keys?.["lived"] ||
                                      "You Have Lived"}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys?.["90"] ||
                                    "Total Years"}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {getValue(result?.tech_Total_years)}
                                  </strong>{" "}
                                  {data?.payload?.tech_lang_keys?.["years"] ||
                                    "Years"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys?.["91"] ||
                                    "Total Months"}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {getValue(result?.tech_Total_months)}
                                  </strong>{" "}
                                  {data?.payload?.tech_lang_keys?.["months"] ||
                                    "Months"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys?.["92"] ||
                                    "Total Weeks"}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {getValue(result?.tech_Total_weeks)}
                                  </strong>{" "}
                                  {data?.payload?.tech_lang_keys?.["weeks"] ||
                                    "Weeks"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys?.["93"] ||
                                    "Total Days"}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {getValue(result?.tech_Total_days)}
                                  </strong>{" "}
                                  {data?.payload?.tech_lang_keys?.["days"] ||
                                    "Days"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys?.["94"] ||
                                    "Total Hours"}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {getValue(result?.tech_Total_hours)}
                                  </strong>{" "}
                                  {data?.payload?.tech_lang_keys?.["hours"] ||
                                    "Hours"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys?.["95"] ||
                                    "Total Minutes"}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {getValue(result?.tech_Total_minuts)}
                                  </strong>{" "}
                                  {data?.payload?.tech_lang_keys?.["minute"] ||
                                    "Minutes"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys?.["96"] ||
                                    "Total Seconds"}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {getValue(result?.tech_Total_seconds)}
                                  </strong>{" "}
                                  {data?.payload?.tech_lang_keys?.["seconds"] ||
                                    "Seconds"}
                                </td>
                              </tr>

                              <tr>
                                <td colSpan={2} className="pt-3 pb-1">
                                  <strong>
                                    {data?.payload?.tech_lang_keys?.["22"] ||
                                      "Interesting Statistics"}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  {data?.payload?.tech_lang_keys?.[23] ||
                                    "Breaths Taken"}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  {getValue(result?.tech_breath)}{" "}
                                  {data?.payload?.tech_lang_keys?.[24] ||
                                    "times"}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  {data?.payload?.tech_lang_keys?.[25] ||
                                    "Heart Beats"}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  {getValue(result?.tech_heartBeats)}{" "}
                                  {data?.payload?.tech_lang_keys?.[26] ||
                                    "times"}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  {data?.payload?.tech_lang_keys?.[29] ||
                                    "Times Laughed"}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  {getValue(result?.tech_laughed)}{" "}
                                  {data?.payload?.tech_lang_keys?.[26] ||
                                    "times"}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  {data?.payload?.tech_lang_keys?.[30] ||
                                    "Time Spent Sleeping"}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  {getValue(result?.tech_sleeping)}{" "}
                                  {data?.payload?.tech_lang_keys?.["years"] ||
                                    "Years"}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  {data?.payload?.tech_lang_keys?.[64] ||
                                    "Hair Growth"}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  {getValue(result?.tech_hair_length_m)} m
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 flex items-center gap-3">
                                  {data?.payload?.tech_lang_keys?.[65] ||
                                    "Nail Growth"}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  {getValue(result?.tech_nail_length_m)} m
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

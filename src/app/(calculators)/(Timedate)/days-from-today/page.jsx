"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";
import { useDaysfromtodayCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DaysFromTodayCalculator = () => {
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
    tech_number: 45,
    tech_current: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateDaysFromToday,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useDaysfromtodayCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_number || !formData.tech_current) {
      setFormError("Please fill in Field.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateDaysFromToday({
        tech_number: Number(formData.tech_number),
        tech_current: formData.tech_current,
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
      tech_number: "45",
      tech_current: "",
    });
    setResult(null);
    setFormError(null);
  };
  const handleNowClick = () => {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    setFormData((prev) => ({
      ...prev,
      tech_current: today,
    }));
  };

  const days = ["7", "14", "21", "28", "45", "60", "90"];

  // table add dates and table start

  const today = new Date();

  // Date utility functions (React/JS friendly)

  function formatDates(date) {
    const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-US", options);
  }

  function formatDateString(date) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  }

  // Date utility functions
  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function getDayName(date, locale = "en-US") {
    return date.toLocaleDateString(locale, { weekday: "long" });
  }
  useEffect(() => {
    // Check if data exists first
    if (!data?.payload?.tech_content) return;

    const DaysContainer = document
      .getElementById("DaysContainer")
      ?.querySelector("tbody");

    if (!DaysContainer || DaysContainer.children.length > 0) return;
    const htmlContent = Array.from({ length: 60 }, (_, i) => {
      const index = i + 1;
      const addedDaysDate = addDays(today, index);
      const formattedDateS = formatDates(addedDaysDate);
      const formattedDate = formatDateString(addedDaysDate);
      const dateName = getDayName(addedDaysDate);

      return `
              <tr className="font-bold hover:bg-gray-600" style="font-weight: 700;">
                <td className="bg-gray">${index} Days</td>
                <td>${dateName}</td> 
                <td>${formattedDate}</td> 
                <td>${formattedDateS}</td> 
              </tr>`;
    }).join("");

    DaysContainer.innerHTML = htmlContent;
  }, [data?.payload?.tech_content]);

  // First create all the Date objects to avoid duplicate calculations
  const dates = {
    add7days: addDays(today, 7),
    add14days: addDays(today, 14),
    add21days: addDays(today, 21),
    add28days: addDays(today, 28),
    add30days: addDays(today, 30),
    add45days: addDays(today, 45),
    add60days: addDays(today, 60),
    add90days: addDays(today, 90),
  };

  // Then format them
  const formattedDates = Object.fromEntries(
    Object.entries(dates).map(([key, date]) => [
      key,
      {
        dateString: formatDateString(date),
        dayName: getDayName(date),
      },
    ])
  );

  useEffect(() => {
    Object.entries(formattedDates).forEach(([id, { dateString, dayName }]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = `${dateString} (${dayName})`;
      }
    });
  }, [formattedDates]);

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-1 mt-5 lg:grid-cols-2 md:grid-cols-2 gap-4">
              <div className="px-2 lg:px-0">
                <div className="w-full mx-auto">
                  <label htmlFor="next" className="text-sm">
                    {data?.payload?.tech_lang_keys["1"]}
                  </label>
                  <div className="grid grid-cols-7 text-center border rounded-md mt-2 bg-white days_box">
                    {days.map((day, index) => (
                      <p
                        key={index}
                        className={`col cursor-pointer border-r py-2 hover:bg-[#2845F5] hover:text-white ${
                          formData.tech_number === day
                            ? "days_class_active"
                            : ""
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, tech_number: day })
                        }
                      >
                        {day}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-2 lg:px-0">
                <div className="space-y-2 inputshow">
                  <label htmlFor="tech_number" className="text-sm">
                    &nbsp;
                  </label>
                  <input
                    type="number"
                    name="tech_number"
                    id="tech_number"
                    className="input"
                    value={formData.tech_number}
                    onChange={handleChange}
                    aria-label="input"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-1  mt-5 lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="date-now space-y-2 relative">
                <div className="flex justify-between">
                  <label htmlFor="tech_e_date" className="label">
                    {data?.payload?.tech_lang_keys["2"]}:
                  </label>
                  <span
                    className="text-[14px] text-end text-blue underline cursor-pointer"
                    onClick={handleNowClick}
                  >
                    {data?.payload?.tech_lang_keys?.now ?? "Now"}
                  </span>
                </div>
                <div className="w-full py-2">
                  <input
                    type="date"
                    name="tech_current"
                    id="tech_current"
                    value={formData.tech_current || ""} // 👈 bind value
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tech_current: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#38A169]"
                    aria-label="input"
                  />
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue p-3 rounded-lg mt-3 overflow-auto">
                      <div className="flex flex-col">
                        <div className="w-full">
                          <div className="text-center">
                            <p className="text-xl  px-3 py-2 rounded-lg inline-block my-3">
                              <strong className="text-blue">
                                {result?.tech_date_name}
                                <img
                                  src="/images/all_calculators/r_days.png"
                                  alt="Calendar"
                                  className="inline mb-1 w-7 h-7 mx-3"
                                />
                                {result?.tech_t_date}
                              </strong>
                            </p>
                          </div>
                          <div className="lg:w-7/12 w-full mx-auto mt-2">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="border-b border-dark py-2 w-1/3">
                                    <img
                                      src="/images/all_calculators/days_usa.svg"
                                      className="w-1/4"
                                      alt="USA Flag"
                                    />
                                  </td>
                                  <td className="border-b border-dark py-2 text-right">
                                    {result?.tech_t_date}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b border-dark py-2">
                                    <img
                                      src="/images/all_calculators/days_uk.svg"
                                      className="w-1/4"
                                      alt="UK Flag"
                                    />
                                  </td>
                                  <td className="border-b border-dark py-2 text-right">
                                    {result?.tech_uk_date}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b border-dark py-2">
                                    <img
                                      src="/images/all_calculators/days_usa.svg"
                                      className="w-1/4"
                                      alt="USA Flag"
                                    />
                                  </td>
                                  <td className="border-b border-dark py-2 text-right">
                                    {result?.tech_usa_num}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b border-dark py-2">
                                    <img
                                      src="/images/all_calculators/days_uk.svg"
                                      className="w-1/4"
                                      alt="UK Flag"
                                    />
                                  </td>
                                  <td className="border-b border-dark py-2 text-right">
                                    {result?.tech_number}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2">
                                    <span className="border rounded-md p-1 mb-1 text-sm">
                                      ISO
                                    </span>
                                  </td>
                                  <td className="py-2 text-right">
                                    {result?.tech_iso}
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

export default DaysFromTodayCalculator;

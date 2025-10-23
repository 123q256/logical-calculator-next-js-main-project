"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDaysagoCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DaysAgoCalculator = () => {
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
    tech_number: "24",
    tech_current: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateWeeksAgoCalculator,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useDaysagoCalculationMutation();

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
      const response = await calculateWeeksAgoCalculator({
        tech_number: Number(formData.tech_number),
        tech_current: formData.tech_current,
      }).unwrap();
      setResult(response); // Assuming the response has'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError("Error calculating");
      toast.error("Error calculating");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_number: "",
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
  function substractDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  function getDayName(date, locale = "en-US") {
    return date.toLocaleDateString(locale, { weekday: "long" });
  }
  useEffect(() => {
    // Check if data exists first
    if (!data?.payload?.tech_content) return;

    const DaysContainer = document
      .getElementById("weeksContainer")
      ?.querySelector("tbody");

    if (!DaysContainer || DaysContainer.children.length > 0) return;
    const htmlContent = Array.from({ length: 60 }, (_, i) => {
      const index = i + 1;
      const addedDaysDate = substractDays(today, index);
      const formattedDateS = formatDates(addedDaysDate);
      const formattedDate = formatDateString(addedDaysDate);
      const dateName = getDayName(addedDaysDate);

      return `
                <tr className="font-bold hover:bg-gray-600" style="font-weight: 700;">
                  <td className="bg-gray">${index} days ago</td>
                  <td>${dateName} ${formattedDate}</td> 
                </tr>`;
    }).join("");

    DaysContainer.innerHTML = htmlContent;
  }, [data?.payload?.tech_content]);

  // First create all the Date objects to avoid duplicate calculations
  const dates = {
    therty: substractDays(today, 30),
    fortyfive: substractDays(today, 45),
    Sixty: substractDays(today, 60),
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[40%] md:w-[40%] w-full mx-auto ">
            <div className="grid grid-cols-1  gap-4">
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
          <div className="lg:w-[40%] md:w-[40%] w-full mx-auto ">
            <div className="grid grid-cols-1    gap-4">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="col-12 bg-light-blue result radius-10 mt-4 overflow-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                        <div className="col-lg-6 p-1">
                          <div className="bordered radius-5 bg-sky lg:p-4 md:p-4 p-3">
                            <p>📅 Date</p>
                            <p className="font-s-18">
                              <strong>{result?.tech_t_date}</strong>
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-6 p-1">
                          <div className="bordered radius-5 bg-sky lg:p-4 md:p-4 p-3">
                            <p>🌞 Day</p>
                            <p className="font-s-18">
                              <strong>{result?.tech_date_name}</strong>
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-6 p-1">
                          <div className="bordered radius-5 bg-sky lg:p-4 md:p-4 p-3">
                            <p>📅 Weeks</p>
                            <p className="font-s-18">
                              <strong>
                                {result?.tech_currentWeekOfYear} /{" "}
                                {result?.tech_weeksInYear}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-6 p-1">
                          <div className="bordered radius-5 bg-sky lg:p-4 md:p-4 p-3">
                            <p>📅 Year</p>
                            <p className="font-s-18">
                              <strong>
                                {result?.tech_currentDayOfYear} /{" "}
                                {result?.tech_daysInYear}
                              </strong>
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-center p-2">
                        What is <strong>{formData?.tech_number}</strong> days
                        ago? The answer is{" "}
                        <strong>{result?.tech_date_name}</strong>,{" "}
                        <strong>{result?.tech_t_date}</strong>. It is the week{" "}
                        <strong>{result?.tech_currentWeekOfYear}</strong> of the
                        total {result?.tech_weeksInYear} weeks of the year. It
                        also marks the day{" "}
                        <strong>{result?.tech_currentDayOfYear}</strong> out of{" "}
                        <strong>{result?.tech_daysInYear}</strong> days of the
                        year.
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

export default DaysAgoCalculator;

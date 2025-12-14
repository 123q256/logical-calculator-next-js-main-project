"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useDayssincedateCalculationMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
const DaysSinceDateCalculator = (selectedDate) => {
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
    tech_day: "22",
    tech_month: "1",
    tech_year: "2024",
    tech_day1: "20",
    tech_month1: "5",
    tech_year1: "2025",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateDaysSince,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useDayssincedateCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateDaysSince({
        tech_day: formData.tech_day,
        tech_month: formData.tech_month,
        tech_year: formData.tech_year,
        tech_day1: formData.tech_day1,
        tech_month1: formData.tech_month1,
        tech_year1: formData.tech_year1,
        tech_submit: formData.tech_submit,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_day: "1",
      tech_month: "1",
      tech_year: "1950",
      tech_day1: "4",
      tech_month1: "7",
      tech_year1: "2025",
      tech_submit: "calculate",
    });
    setResult(null);
    setFormError(null);
  };

  // Create an array of years from 1950 to 2050
  const years = Array.from({ length: 101 }, (_, i) => 1950 + i);

  // result code
  const formatDays = (days) => {
    if (days > 0) {
      return `${days} Day${days === 1 ? "" : "s"}`;
    }
    return "";
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
          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-3 my-5  gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_month" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_month"
                    id="tech_month"
                    value={formData.tech_month}
                    onChange={handleChange}
                  >
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_day" className="label"></label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_day"
                    id="tech_day"
                    value={formData.tech_day}
                    onChange={handleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_year" className="label"></label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_year"
                    id="tech_year"
                    value={formData.tech_year} // ✅ selected option controlled by state
                    onChange={handleChange}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 my-5  gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_month1" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_month1"
                    id="tech_month1"
                    value={formData.tech_month1}
                    onChange={handleChange}
                  >
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_day1" className="label"></label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_day1"
                    id="tech_day1"
                    value={formData.tech_day1}
                    onChange={handleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_year1" className="label"></label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_year1"
                    id="tech_year1"
                    value={formData.tech_year1} // ✅ Controlled by state
                    onChange={handleChange}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue result p-3 radius-10 mt-3 overflow-auto">
                      <p className="mb-2 text-center">
                        Days Since the Start Date
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1 md:gap-4">
                        {/* Total Days */}
                        <div className="space-y-2">
                          <div className="bordered rounded-lg flex justify-between bg-sky p-3">
                            <p>📅 Total Days</p>
                            <p className="text-xl font-semibold text-blue">
                              <strong>
                                {result?.totaldays > 0
                                  ? formatDays(result?.totaldays)
                                  : "0 Days"}
                              </strong>
                            </p>
                            {result?.totaldays === 0 && (
                              <p className="text-lg font-semibold text-blue">
                                <strong>0 Days</strong>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Business Days */}
                        <div className="space-y-2">
                          <div className="bordered rounded-lg flex justify-between bg-sky p-3">
                            <p>📅 Business Days</p>
                            <p className="text-xl font-semibold text-blue">
                              <strong>
                                {result?.workingDays > 0
                                  ? formatDays(result?.workingDays)
                                  : "0 Days"}
                              </strong>
                            </p>
                            {result?.workingDays === 0 && (
                              <p className="text-lg font-semibold text-blue">
                                <strong>0 Days</strong>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Weekend Days */}
                        <div className="space-y-2">
                          <div className="bordered rounded-lg flex justify-between bg-sky p-3">
                            <p>📅 Weekend Days</p>
                            <p className="text-xl font-semibold text-blue">
                              <strong>
                                {result?.holidays > 0
                                  ? formatDays(result?.holidays)
                                  : "0 Days"}
                              </strong>
                            </p>
                            {result?.holidays === 0 && (
                              <p className="text-lg font-semibold text-blue">
                                <strong>0 Days</strong>
                              </p>
                            )}
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

export default DaysSinceDateCalculator;

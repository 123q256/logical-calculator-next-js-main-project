"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useWeeksLeftInTheYearCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HowManyWeeksLeftIn2025 = (selectedDate) => {
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
    tech_day: "4",
    tech_month: "7",
    tech_year: "2025",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateweekLeftyear,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useWeeksLeftInTheYearCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_day || !formData.tech_month || !formData.tech_year) {
      setFormError("Please fill in Field.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateweekLeftyear({
        tech_day: formData.tech_day,
        tech_month: formData.tech_month,
        tech_year: formData.tech_year,
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
      tech_day: "1",
      tech_month: "1",
      tech_year: "1950",
    });
    setResult(null);
    setFormError(null);
  };

  // Create an array of years from 1950 to 2050
  const years = Array.from({ length: 101 }, (_, i) => 1950 + i);

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
                <label htmlFor="tech_day" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
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
                <label htmlFor="tech_year" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_year"
                    id="tech_year"
                    value={formData.tech_year} // Controlled by this value
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
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
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
                    <div className="col-12  result radius-10 mt-4 overflow-auto">
                      <div className="text-center mb-3">
                        <p className="mb-2">
                          {data?.payload?.tech_lang_keys["4"]}{" "}
                          <span className="currentYear">
                            {new Date().getFullYear()}
                          </span>
                        </p>
                        <p className="bordered  d-inline p-2 px-4 bg-sky text-[20px]">
                          <strong className="text-blue">
                            {result?.tech_weeksRemaining}{" "}
                            {result?.tech_weeksRemaining === 1
                              ? "Week"
                              : "Weeks"}{" "}
                            {result?.tech_remainingDaysAfterWeeks === 0
                              ? ""
                              : result?.tech_remainingDaysAfterWeeks === 1
                              ? `${result?.tech_remainingDaysAfterWeeks} Day`
                              : `${result?.tech_remainingDaysAfterWeeks} Days`}
                          </strong>
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2   gap-2">
                        <div className="col-lg-6 p-1">
                          <div className="bordered bg-sky lg:p-4 md:p-4 p-3">
                            <p>📅 Months</p>
                            <p className="font-s-18">
                              <strong>
                                {result?.tech_monthsRemaining}
                                <>
                                  {" "}
                                  &nbsp;
                                  {result?.tech_monthsRemaining === 1
                                    ? "Month"
                                    : "Months"}{" "}
                                  {result?.tech_remainingDaysAfterMonths === 0
                                    ? ""
                                    : result?.tech_remainingDaysAfterMonths ===
                                      1
                                    ? `${result?.tech_remainingDaysAfterMonths} Day`
                                    : `${result?.tech_remainingDaysAfterMonths} Days`}
                                </>
                              </strong>
                            </p>
                          </div>
                        </div>

                        <div className="col-lg-6 p-1">
                          <div className="bordered bg-sky lg:p-4 md:p-4 p-3 ">
                            <p>📅 Weeks</p>
                            <p className="font-s-18">
                              <strong>
                                {result?.tech_weeksRemaining}
                                <>
                                  {" "}
                                  &nbsp;
                                  {result?.tech_weeksRemaining === 1
                                    ? "Week"
                                    : "Weeks"}{" "}
                                  {result?.tech_remainingDaysAfterWeeks === 0
                                    ? ""
                                    : result?.tech_remainingDaysAfterWeeks === 1
                                    ? `${result?.tech_remainingDaysAfterWeeks} Day`
                                    : `${result?.tech_remainingDaysAfterWeeks} Days`}
                                </>
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-6 p-1">
                          <div className="bordered bg-sky lg:p-4 md:p-4 p-3 ">
                            <p>🌞 Days</p>
                            <p className="font-s-18">
                              <strong>
                                {result?.tech_daysRemaining} &nbsp;
                                {result?.tech_daysRemaining === 1
                                  ? "Day"
                                  : "Days"}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-6 p-1">
                          <div className="bordered bg-sky lg:p-4 md:p-4 p-3 ">
                            <p>🕑 Hours</p>
                            <p className="font-s-18">
                              <strong>
                                {result?.tech_hoursRemaining} hours
                              </strong>
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-center p-2">
                        How many weeks form <strong>{result?.tech_now}</strong>{" "}
                        left in this year ? The answer is{" "}
                        <strong>{result?.tech_weeksRemaining} </strong>
                        {result?.tech_weeksRemaining === 1
                          ? "Week"
                          : "Weeks are"}{" "}
                        if left in End of the year.
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

export default HowManyWeeksLeftIn2025;

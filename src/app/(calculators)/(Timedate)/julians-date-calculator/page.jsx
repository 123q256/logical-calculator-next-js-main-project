"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useJuliansdateCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const JuliansDateCalendar = (selectedDate) => {
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
    tech_timecheck: "stat",
    tech_day: "26",
    tech_month: "7",
    tech_year: "2000",
    tech_time: "",
    tech_julian: "34.4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateLovePercentage,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useJuliansdateCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_timecheck == "stat") {
      if (
        !formData.tech_timecheck ||
        !formData.tech_day ||
        !formData.tech_month ||
        !formData.tech_year ||
        !formData.tech_time
      ) {
        setFormError("Please fill in field.");
        return;
      }
    } else {
      if (!formData.tech_timecheck || !formData.tech_julian) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateLovePercentage({
        tech_timecheck: formData.tech_timecheck,
        tech_day: formData.tech_day,
        tech_month: formData.tech_month,
        tech_year: formData.tech_year,
        tech_time: formData.tech_time,
        tech_julian: formData.tech_julian,
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
      tech_timecheck: "stat",
      tech_day: "26",
      tech_month: "7",
      tech_year: "2000",
      tech_time: "",
      tech_julian: "34.4",
    });
    setResult(null);
    setFormError(null);
  };
  const years = Array.from({ length: 101 }, (_, i) => 1950 + i);

  const handleNowClick = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;

    setFormData((prev) => ({
      ...prev,
      tech_time: currentTime,
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="pe-2" htmlFor="stat">
                  <input
                    type="radio"
                    name="tech_timecheck"
                    value="stat"
                    id="stat"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_timecheck === "stat"}
                  />
                  <span>{data?.payload?.tech_lang_keys["1"]}</span>
                </label>
              </div>
              <div className="my-2">
                <label htmlFor="dyna">
                  <input
                    type="radio"
                    name="tech_timecheck"
                    className="mr-2 border"
                    value="dyna"
                    id="dyna"
                    onChange={handleChange}
                    checked={formData.tech_timecheck === "dyna"}
                  />
                  <span>{data?.payload?.tech_lang_keys["2"]}</span>
                </label>
              </div>
            </div>

            {formData.tech_timecheck === "stat" ? (
              <div className="grid grid-cols-1   mt-3 gap-4 timeclock">
                <div className="flex justify-center">
                  <div className="grid grid-cols-3  lg:w-[70%] md:w-[70%] w-full  gap-4  ">
                    <div className="space-y-2 relative">
                      <label htmlFor="tech_month" className="label">
                        {data?.payload?.tech_lang_keys["3"]}:
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
                        {data?.payload?.tech_lang_keys["3"]}:
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
                        {data?.payload?.tech_lang_keys["5"]}:
                      </label>
                      <div className="">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_year"
                          id="tech_year"
                          value={formData.tech_year}
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
                <div className="flex justify-center">
                  <div className="grid grid-cols-1 gap-4 lg:w-[70%] md:w-[70%]">
                    <div className="space-y-2 relative date-now">
                      <div className="flex justify-between">
                        <label htmlFor="tech_e_date" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
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
                          type="time"
                          name="tech_time"
                          id="tech_time"
                          value={formData.tech_time}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tech_time: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#38A169]"
                          aria-label="input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1   gap-4 dateclock">
                <div className="col-span-12 mx-auto relative">
                  <label htmlFor="tech_julian" className="label">
                    {data?.payload?.tech_lang_keys["7"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_julian"
                    id="tech_julian"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_julian}
                    onChange={handleChange}
                  />
                </div>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 bg-white rounded-lg result_calculator space-y-6 result">
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
                    <div className="w-full bg-light-blue result p-3 radius-10 mt-3 overflow-auto">
                      <div className="w-full md:w-[50%] lg:w-[50%] mx-auto p-1 mb-2">
                        <div className="bordered radius-5 bg-sky lg:p-4 md:p-4 p-3 text-center">
                          {formData.tech_timecheck === "stat" ? (
                            <>
                              <p className="pb-1">📅 Julian Date</p>
                              <p className="text-[22px]">
                                <strong className="text-blue">
                                  {result?.tech_julianDate}
                                </strong>
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="pb-1">📅 Calendar Date</p>
                              <p className="text-[18px]">
                                <strong className="text-blue">
                                  {result?.tech_jul_date}
                                </strong>
                              </p>
                            </>
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

export default JuliansDateCalendar;

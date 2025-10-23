"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTimedurationCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TimeDurationCalculator = () => {
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
    tech_calculator_time: "date_cal",

    tech_start_date: "",
    tech_d_start_h: "8",
    tech_d_start_m: "30",
    tech_d_start_s: "00",
    tech_d_start_ampm: "am",

    tech_end_date: "",
    tech_d_end_h: "5",
    tech_d_end_m: "30",
    tech_d_end_s: "0",
    tech_d_end_ampm: "pm",

    tech_t_start_h: "8",
    tech_t_start_m: "30",
    tech_t_start_s: "0",
    tech_t_start_ampm: "am",

    tech_t_end_h: "5",
    tech_t_end_m: "30",
    tech_t_end_s: "0",
    tech_t_end_ampm: "pm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateLovePercentage,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useTimedurationCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_calculator_time == "date_cal") {
      if (
        !formData.tech_calculator_time ||
        !formData.tech_t_start_h ||
        !formData.tech_t_start_m ||
        !formData.tech_t_start_s ||
        !formData.tech_t_start_ampm ||
        !formData.tech_t_end_h ||
        !formData.tech_t_end_m ||
        !formData.tech_t_end_s ||
        !formData.tech_t_end_ampm
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_calculator_time ||
        !formData.tech_start_date ||
        !formData.tech_d_start_h ||
        !formData.tech_d_start_m ||
        !formData.tech_d_start_s ||
        !formData.tech_d_start_ampm ||
        !formData.tech_end_date ||
        !formData.tech_d_end_h ||
        !formData.tech_d_end_m ||
        !formData.tech_d_end_s ||
        !formData.tech_d_end_ampm
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateLovePercentage({
        tech_calculator_time: formData.tech_calculator_time,
        tech_start_date: formData.tech_start_date,
        tech_d_start_h: formData.tech_d_start_h,
        tech_d_start_m: formData.tech_d_start_m,
        tech_d_start_s: formData.tech_d_start_s,
        tech_d_start_ampm: formData.tech_d_start_ampm,
        tech_end_date: formData.tech_end_date,
        tech_d_end_h: formData.tech_d_end_h,
        tech_d_end_m: formData.tech_d_end_m,
        tech_d_end_s: formData.tech_d_end_s,
        tech_d_end_ampm: formData.tech_d_end_ampm,
        tech_t_start_h: formData.tech_t_start_h,
        tech_t_start_m: formData.tech_t_start_m,
        tech_t_start_s: formData.tech_t_start_s,
        tech_t_start_ampm: formData.tech_t_start_ampm,
        tech_t_end_h: formData.tech_t_end_h,
        tech_t_end_m: formData.tech_t_end_m,
        tech_t_end_s: formData.tech_t_end_s,
        tech_t_end_ampm: formData.tech_t_end_ampm,
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
      tech_calculator_time: "date_cal",

      tech_start_date: "",
      tech_d_start_h: "8",
      tech_d_start_m: "30",
      tech_d_start_s: "00",
      tech_d_start_ampm: "am",

      tech_end_date: "",
      tech_d_end_h: "5",
      tech_d_end_m: "30",
      tech_d_end_s: "0",
      tech_d_end_ampm: "am",

      tech_t_start_h: "8",
      tech_t_start_m: "30",
      tech_t_start_s: "0",
      tech_t_start_ampm: "am",

      tech_t_end_h: "5",
      tech_t_end_m: "30",
      tech_t_end_s: "0",
      tech_t_end_ampm: "am",
    });
    setResult(null);
    setFormError(null);
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

          <div className="col-12 col-lg-9 mx-auto mt-2 lg:w-[50%] w-full">
            <input
              type="hidden"
              name="tech_calculator_time"
              id="calculator_time"
              value={formData.tech_calculator_time}
            />

            <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
              {/* Date Cal Tab */}
              <div className="lg:w-1/2 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                    formData.tech_calculator_time === "date_cal"
                      ? "tagsUnit"
                      : ""
                  }`}
                  id="date_cal"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      tech_calculator_time: "date_cal",
                    })
                  }
                >
                  {data?.payload?.tech_lang_keys["1"]}
                </div>
              </div>

              {/* Time Cal Tab */}
              <div className="lg:w-1/2 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_calculator_time === "time_cal"
                      ? "tagsUnit"
                      : ""
                  }`}
                  id="time_cal"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      tech_calculator_time: "time_cal",
                    })
                  }
                >
                  {data?.payload?.tech_lang_keys["2"]}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto overflow-x-auto">
            <p className="font-s-14 mt-4 text-blue">
              {data?.payload?.tech_lang_keys["3"]}
            </p>
            {formData?.tech_calculator_time === "time_cal" ? (
              <div className="grid lg:grid-cols-5 md:grid-cols-5 grid-cols-3  gap-4 time_betw">
                <div className="space-y-2">
                  <label htmlFor="tech_start_date" className="label">
                    Date:
                  </label>
                  <input
                    type="date"
                    step="any"
                    name="tech_start_date"
                    id="tech_start_date"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tech_d_start_h" className="label">
                    Hrs:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_d_start_h"
                    id="tech_d_start_h"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Hrs"
                    value={formData.tech_d_start_h}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tech_d_start_m" className="label">
                    Min:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_d_start_m"
                    id="tech_d_start_m"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Min"
                    value={formData.tech_d_start_m}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tech_d_start_s" className="label">
                    Sec:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_d_start_s"
                    id="tech_d_start_s"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Sec"
                    value={formData.tech_d_start_s}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="">
                    <label htmlFor="tech_d_start_ampm" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        style={{ width: "100px" }}
                        className="input"
                        aria-label="select"
                        name="tech_d_start_ampm"
                        id="tech_d_start_ampm"
                        value={formData.tech_d_start_ampm}
                        onChange={handleChange}
                      >
                        <option value="am">AM</option>
                        <option value="pm">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4  gap-4 time_due ">
                <div className="space-y-2">
                  <label htmlFor="tech_t_start_h" className="label">
                    Hrs:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_t_start_h"
                    id="tech_t_start_h"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Hrs"
                    value={formData.tech_t_start_h}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tech_t_start_m" className="label">
                    Min:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_t_start_m"
                    id="tech_t_start_m"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Min"
                    value={formData.tech_t_start_m}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tech_t_start_s" className="label">
                    Sec:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_t_start_s"
                    id="tech_t_start_s"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Sec"
                    value={formData.tech_t_start_s}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="py-2">
                    <label htmlFor="tech_t_start_ampm" className="label">
                      &nbsp;
                    </label>
                    <div className="">
                      <select
                        style={{ width: "100px" }}
                        className="input"
                        aria-label="select"
                        name="tech_t_start_ampm"
                        id="tech_t_start_ampm"
                        value={formData.tech_t_start_ampm}
                        onChange={handleChange}
                      >
                        <option value="am">AM</option>
                        <option value="pm">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="font-s-14 text-blue mt-2">
              {data?.payload?.tech_lang_keys["6"]}
            </p>

            {formData?.tech_calculator_time === "time_cal" ? (
              <div className="grid grid lg:grid-cols-5 md:grid-cols-5 grid-cols-3 gap-4 time_betw ">
                <div className="space-y-2">
                  <label htmlFor="tech_end_date" className="label">
                    Date:
                  </label>
                  <input
                    type="date"
                    step="any"
                    name="tech_end_date"
                    id="tech_end_date"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_end_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tech_d_end_h" className="label">
                    Hrs:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_d_end_h"
                    id="tech_d_end_h"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Hrs"
                    value={formData.tech_d_end_h}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tech_d_end_m" className="label">
                    Min:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_d_end_m"
                    id="tech_d_end_m"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Min"
                    value={formData.tech_d_end_m}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tech_d_end_s" className="label">
                    Sec:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_d_end_s"
                    id="tech_d_end_s"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Sec"
                    value={formData.tech_d_end_s}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="py-2">
                    <label htmlFor="tech_d_end_ampm" className="label">
                      &nbsp;
                    </label>
                    <div className="">
                      <select
                        style={{ width: "100px" }}
                        className="input"
                        aria-label="select"
                        name="tech_d_end_ampm"
                        id="tech_d_end_ampm"
                        value={formData.tech_d_end_ampm}
                        onChange={handleChange}
                      >
                        <option value="am">AM</option>
                        <option value="pm">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4 time_due ">
                <div className="space-y-2">
                  <label htmlFor="tech_t_end_h" className="label">
                    Hrs:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_t_end_h"
                    id="tech_t_end_h"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Hrs"
                    value={formData.tech_t_end_h}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tech_t_end_m" className="label">
                    Min:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_t_end_m"
                    id="tech_t_end_m"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Min"
                    value={formData.tech_t_end_m}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tech_t_end_s" className="label">
                    Sec:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_t_end_s"
                    id="tech_t_end_s"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Sec"
                    value={formData.tech_t_end_s}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="py-2">
                    <label htmlFor="tech_t_end_ampm" className="label">
                      &nbsp;
                    </label>
                    <div className="">
                      <select
                        style={{ width: "100px" }}
                        className="input"
                        aria-label="select"
                        name="tech_t_end_ampm"
                        id="tech_t_end_ampm"
                        value={formData.tech_t_end_ampm}
                        onChange={handleChange}
                      >
                        <option value="am">AM</option>
                        <option value="pm">PM</option>
                      </select>
                    </div>
                  </div>
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

                  <div className="rounded-lg  flex items-center ">
                    <div className="w-full p-3 rounded-lg mt-3">
                      <div className="my-2">
                        <div className="w-full md:w-[50%] lg:w-[50%] text-xl">
                          <table className="w-full lg:text-[16px] md:text-[16px] text-[14px]">
                            <tbody>
                              {formData?.tech_calculator_time ===
                                "time_cal" && (
                                <tr>
                                  <td className="border-b py-2 font-semibold">
                                    <strong>{result?.tech_days_ans}</strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[7]}
                                  </td>
                                </tr>
                              )}

                              <tr>
                                <td className="w-3/5 border-b py-2 font-semibold">
                                  <strong>{result?.tech_hours}</strong>
                                </td>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["hours"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2 font-semibold">
                                  <strong>{result?.tech_minutes}</strong>
                                </td>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["minute"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2 font-semibold">
                                  <strong>{result?.tech_seconds}</strong>
                                </td>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["second"]}
                                </td>
                              </tr>

                              {formData?.tech_calculator_time ===
                                "time_cal" && (
                                <tr>
                                  <td className="border-b py-2 font-semibold">
                                    {data?.payload?.tech_lang_keys[8]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_total_days}
                                  </td>
                                </tr>
                              )}

                              <tr>
                                <td className="border-b py-2 font-semibold">
                                  {data?.payload?.tech_lang_keys[9]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_total_hours}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2 font-semibold">
                                  {data?.payload?.tech_lang_keys[10]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_total_minutes}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2 font-semibold">
                                  {data?.payload?.tech_lang_keys[11]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_total_seconds}
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

export default TimeDurationCalculator;

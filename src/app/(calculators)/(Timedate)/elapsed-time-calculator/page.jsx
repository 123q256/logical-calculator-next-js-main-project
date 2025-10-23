"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useElapsedtimeCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ElapsedTimeCalculator = () => {
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
    tech_main_units: "elapsed",
    tech_clock_format: "12",
    tech_elapsed_start: "5",
    tech_elapsed_start_one: "9",
    tech_elapsed_start_sec: "5",
    tech_elapsed_start_three: "9",
    tech_elapsed_start_unit: "hrs/mins/sec",
    tech_elapsed_end: "7",
    tech_elapsed_end_one: "9",
    tech_elapsed_end_sec: "30",
    tech_elapsed_end_three: "50",
    tech_elapsed_end_unit: "hrs/mins/sec",
    tech_clock_hour: "9",
    tech_clock_minute: "12",
    tech_clock_second: "7",
    tech_clock_start_unit: "AM",
    tech_clock_hur: "11",
    tech_clock_mints: "12",
    tech_clock_secs: "7",
    tech_clock_end_unit: "AM",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateElapsed,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useElapsedtimeCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_main_units || !formData.tech_clock_format) {
      setFormError("Please fill in field.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateElapsed({
        tech_main_units: formData.tech_main_units,
        tech_clock_format: formData.tech_clock_format,
        tech_elapsed_start: formData.tech_elapsed_start,
        tech_elapsed_start_one: formData.tech_elapsed_start_one,
        tech_elapsed_start_sec: formData.tech_elapsed_start_sec,
        tech_elapsed_start_three: formData.tech_elapsed_start_three,
        elapsed_start_unit: formData.elapsed_start_unit,
        tech_elapsed_end: formData.tech_elapsed_end,
        tech_elapsed_end_one: formData.tech_elapsed_end_one,
        tech_elapsed_end_sec: formData.tech_elapsed_end_sec,
        tech_elapsed_end_three: formData.tech_elapsed_end_three,
        tech_elapsed_end_unit: formData.tech_elapsed_end_unit,
        tech_clock_hour: formData.tech_clock_hour,
        tech_clock_minute: formData.tech_clock_minute,
        tech_clock_second: formData.tech_clock_second,
        tech_clock_start_unit: formData.tech_clock_start_unit,
        tech_clock_hur: formData.tech_clock_hur,
        tech_clock_mints: formData.tech_clock_mints,
        tech_clock_secs: formData.tech_clock_secs,
        tech_clock_end_unit: formData.tech_clock_end_unit,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      console.log(err);
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_main_units: "elapsed",
      tech_clock_format: "12",
      tech_elapsed_start: "5",
      tech_elapsed_start_one: "9",
      tech_elapsed_start_sec: "5",
      tech_elapsed_start_three: "9",
      elapsed_start_unit: "sec",
      tech_elapsed_end_one: "9",
      tech_elapsed_end_sec: "30",
      tech_elapsed_end_three: "50",
      tech_elapsed_end_unit: "12",
      tech_clock_hour: "9",
      tech_clock_minute: "12",
      tech_clock_second: "7",
      tech_clock_start_unit: "AM",
      tech_clock_hur: "7",
      tech_clock_mints: "12",
      tech_clock_secs: "7",
      tech_clock_end_unit: "12",
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
              name="tech_main_units"
              id="tech_main_units"
              value={formData.tech_main_units}
            />
            <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
              {/* Date Cal Tab */}
              <div className="lg:w-1/2 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                    formData.tech_main_units === "elapsed" ? "tagsUnit" : ""
                  }`}
                  id="elapsed"
                  onClick={() =>
                    setFormData({ ...formData, tech_main_units: "elapsed" })
                  }
                >
                  {data?.payload?.tech_lang_keys["1"]}
                </div>
              </div>
              {/* Time Cal Tab */}
              <div className="lg:w-1/2 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_main_units === "clock" ? "tagsUnit" : ""
                  }`}
                  id="clock"
                  onClick={() =>
                    setFormData({ ...formData, tech_main_units: "clock" })
                  }
                >
                  {data?.payload?.tech_lang_keys["2"]}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            {formData?.tech_main_units != "elapsed" && (
              <div className="grid grid-cols-1  gap-4">
                <div className="d-flex align-items-center px-2 mt-3 clock-time">
                  <p className="text-blue font-s-14 pe-2">
                    {data?.payload?.tech_lang_keys["5"]}:
                  </p>

                  <label className="pe-2" htmlFor="first">
                    <input
                      type="radio"
                      name="tech_clock_format"
                      value="12"
                      id="first"
                      className="font-s-14 text-blue ps-lg-1 pe-2 mr-2 border"
                      onChange={handleChange}
                      checked={formData.tech_clock_format === "12"}
                    />
                    <span>12 Hours</span>
                  </label>

                  <label htmlFor="second">
                    <input
                      type="radio"
                      name="tech_clock_format"
                      className="font-s-14 ps-lg-1 text-blue mr-2 border"
                      value="24"
                      id="second"
                      onChange={handleChange}
                      checked={formData.tech_clock_format === "24"}
                    />
                    <span>24 Hours</span>
                  </label>
                </div>
              </div>
            )}

            {formData?.tech_main_units == "elapsed" && (
              <div className="grid grid-cols-1 gap-4 elapsed">
                <p className="my-4 px-1 label">
                  {data?.payload?.tech_lang_keys["3"]}
                </p>
              </div>
            )}

            {formData?.tech_main_units == "elapsed" && (
              <>
                <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 lg:gap-4 md:gap-4 gap-2 elapsed ">
                  <div className="space-y-2 hidden elapsed_start">
                    <label htmlFor="tech_elapsed_start" className="label">
                      hrs:
                    </label>
                    <div>
                      <input
                        type="number"
                        step="any"
                        name="tech_elapsed_start"
                        id="tech_elapsed_start"
                        className="input "
                        aria-label="input"
                        value={formData.tech_elapsed_start}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 elapsed_start_one">
                    <label htmlFor="tech_elapsed_start_one" className="label">
                      hrs:
                    </label>
                    <div>
                      <input
                        type="number"
                        step="any"
                        name="tech_elapsed_start_one"
                        id="tech_elapsed_start_one"
                        className="input "
                        aria-label="input"
                        value={formData.tech_elapsed_start_one}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 elapsed_start_sec">
                    <label htmlFor="tech_elapsed_start_sec" className="label">
                      mins:
                    </label>
                    <div>
                      <input
                        type="number"
                        step="any"
                        name="tech_elapsed_start_sec"
                        id="tech_elapsed_start_sec"
                        className="input "
                        aria-label="input"
                        value={formData.tech_elapsed_start_sec}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 elapsed_start_three">
                    <label htmlFor="tech_elapsed_start_three" className="label">
                      sec:
                    </label>
                    <div>
                      <input
                        type="number"
                        step="any"
                        name="tech_elapsed_start_three"
                        id="tech_elapsed_start_three"
                        className="input "
                        aria-label="input"
                        value={formData.tech_elapsed_start_three}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 elapsed_start_unit">
                    <label
                      htmlFor="elapsed_start_unit"
                      className="font-s-14 text-blue"
                    >
                      &nbsp;
                    </label>
                    <div>
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_elapsed_start_unit"
                        id="tech_elapsed_start_unit"
                        value={formData.tech_elapsed_start_unit}
                        onChange={handleChange}
                      >
                        <option value="sec">sec</option>
                        <option value="mins">mins</option>
                        <option value="hrs">hrs</option>
                        <option value="mins/sec">mins/sec</option>
                        <option value="hrs/mins">hrs/mins</option>
                        <option value="hrs/mins/sec">hrs/mins/sec</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1  gap-4 elapsed ">
                  <p className="my-4 px-1 label">
                    {data?.payload?.tech_lang_keys["4"]}
                  </p>
                </div>
                <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2  lg:gap-4 md:gap-4 gap-2 elapsed ">
                  <div className="space-y-2 hidden elapsed_end">
                    <label htmlFor="tech_elapsed_end" className="label">
                      hrs:
                    </label>
                    <div>
                      <input
                        type="number"
                        step="any"
                        name="tech_elapsed_end"
                        id="tech_elapsed_end"
                        className="input "
                        aria-label="input"
                        value={formData.tech_elapsed_end}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 elapsed_end_one">
                    <label htmlFor="tech_elapsed_end_one" className="label">
                      hrs:
                    </label>
                    <div>
                      <input
                        type="number"
                        step="any"
                        name="tech_elapsed_end_one"
                        id="tech_elapsed_end_one"
                        className="input "
                        aria-label="input"
                        value={formData.tech_elapsed_end_one}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 elapsed_end_sec">
                    <label htmlFor="elapsed_end_sec" className="label">
                      mins:
                    </label>
                    <div>
                      <input
                        type="number"
                        step="any"
                        name="tech_elapsed_end_sec"
                        id="tech_elapsed_end_sec"
                        className="input "
                        aria-label="input"
                        value={formData.tech_elapsed_end_sec}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 elapsed_end_three">
                    <label htmlFor="elapsed_end_three" className="label">
                      sec:
                    </label>
                    <div>
                      <input
                        type="number"
                        step="any"
                        name="tech_elapsed_end_three"
                        id="tech_elapsed_end_three"
                        className="input "
                        aria-label="input"
                        value={formData.tech_elapsed_end_three}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 elapsed_end_unit">
                    <label
                      htmlFor="elapsed_end_unit"
                      className="font-s-14 text-blue"
                    >
                      &nbsp;
                    </label>
                    <div>
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_elapsed_end_unit"
                        id="tech_elapsed_end_unit"
                        value={formData.tech_elapsed_end_unit}
                        onChange={handleChange}
                      >
                        <option value="sec">sec</option>
                        <option value="mins">mins</option>
                        <option value="hrs">hrs</option>
                        <option value="mins/sec">mins/sec</option>
                        <option value="hrs/mins">hrs/mins</option>
                        <option value="hrs/mins/sec">hrs/mins/sec</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {formData?.tech_main_units != "elapsed" && (
              <>
                <div className="grid grid-cols-1  gap-4 clock">
                  <p className="my-4 px-1 label">
                    {data?.payload?.tech_lang_keys["6"]}
                  </p>
                </div>
                <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2  lg:gap-4 md:gap-4 gap-2  clock">
                  <div className="space-y-2 clock_hour">
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_clock_hour"
                        id="tech_clock_hour"
                        className="input "
                        aria-label="input"
                        value={formData.tech_clock_hour}
                        onChange={handleChange}
                      />
                      <span className="input_unit text-blue">hrs</span>
                    </div>
                  </div>
                  <div className="space-y-2 clock_minute">
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_clock_minute"
                        id="tech_clock_minute"
                        className="input "
                        aria-label="input"
                        value={formData.tech_clock_minute}
                        onChange={handleChange}
                      />
                      <span className="input_unit text-blue">min</span>
                    </div>
                  </div>
                  <div className="space-y-2 clock_second">
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_clock_second"
                        id="tech_clock_second"
                        className="input "
                        aria-label="input"
                        value={formData.tech_clock_second}
                        onChange={handleChange}
                      />
                      <span className="input_unit text-blue">sec</span>
                    </div>
                  </div>
                  {formData?.tech_clock_format == "12" && (
                    <div className="space-y-2 clock_start_unit ">
                      <div>
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_clock_start_unit"
                          id="tech_clock_start_unit"
                          value={formData.tech_clock_start_unit}
                          onChange={handleChange}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1  gap-4 clock">
                  <p className="my-4 px-1 label">
                    {data?.payload?.tech_lang_keys["7"]}
                  </p>
                </div>
                <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2  lg:gap-4 md:gap-4 gap-2 clock">
                  <div className="space-y-2 clock_hur">
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_clock_hur"
                        id="tech_clock_hur"
                        className="input "
                        aria-label="input"
                        value={formData.tech_clock_hur}
                        onChange={handleChange}
                      />
                      <span className="input_unit text-blue">hrs</span>
                    </div>
                  </div>
                  <div className="space-y-2 clock_mints">
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_clock_mints"
                        id="tech_clock_mints"
                        className="input "
                        aria-label="input"
                        value={formData.tech_clock_mints}
                        onChange={handleChange}
                      />
                      <span className="input_unit text-blue">min</span>
                    </div>
                  </div>
                  <div className="space-y-2 clock_secs">
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_clock_secs"
                        id="tech_clock_secs"
                        className="input "
                        aria-label="input"
                        value={formData.tech_clock_secs}
                        onChange={handleChange}
                      />
                      <span className="input_unit text-blue">sec</span>
                    </div>
                  </div>
                  {formData?.tech_clock_format == "12" && (
                    <div className="space-y-2 clock_end_unit ">
                      <div>
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_clock_end_unit"
                          id="tech_clock_end_unit"
                          value={formData.tech_clock_end_unit}
                          onChange={handleChange}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full p-2 rounded-lg mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="text-lg lg:text-[20px]">
                          <p className="mb-4 font-bold">
                            {result?.tech_hours} Hours {result?.tech_minutes}{" "}
                            Minutes {result?.tech_seconds} Seconds
                          </p>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="w-3/5 border-b py-2 font-bold">
                                  {data?.payload?.tech_lang_keys[9]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_answer}{" "}
                                  {data?.payload?.tech_lang_keys[11]}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3" colspan="2">
                                  {data?.payload?.tech_lang_keys[1]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">MM:SS</td>
                                <td className="border-b py-2">
                                  {(() => {
                                    const totalSeconds =
                                      result?.tech_answer || 0;
                                    const minutes = Math.floor(
                                      totalSeconds / 60
                                    );
                                    const seconds = totalSeconds % 60;
                                    return `${String(minutes).padStart(
                                      2,
                                      "0"
                                    )}:${String(seconds).padStart(2, "0")}`;
                                  })()}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">HH:MM</td>
                                <td className="border-b py-2">
                                  {(() => {
                                    const totalSeconds =
                                      result?.tech_answer || 0;
                                    const hours = Math.floor(
                                      totalSeconds / 3600
                                    );
                                    const remainingSeconds =
                                      totalSeconds % 3600;
                                    const minutes = Math.floor(
                                      remainingSeconds / 60
                                    );
                                    return `${String(hours).padStart(
                                      2,
                                      "0"
                                    )}:${String(minutes).padStart(2, "0")}`;
                                  })()}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">HH:MM:SS</td>
                                <td className="border-b py-2">
                                  {(() => {
                                    const totalSeconds =
                                      result?.tech_answer || 0;
                                    const hours = Math.floor(
                                      totalSeconds / 3600
                                    );
                                    const remainingSeconds =
                                      totalSeconds % 3600;
                                    const minutes = Math.floor(
                                      remainingSeconds / 60
                                    );
                                    const seconds = remainingSeconds % 60;
                                    return `${String(hours).padStart(
                                      2,
                                      "0"
                                    )}:${String(minutes).padStart(
                                      2,
                                      "0"
                                    )}:${String(seconds).padStart(2, "0")}`;
                                  })()}
                                </td>
                              </tr>

                              <tr>
                                <td className="py-3 font-bold" colSpan={2}>
                                  {data?.payload?.tech_lang_keys[10]}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[12]} :
                                </td>
                                <td className="border-b py-2 ">
                                  {Number(
                                    (result?.tech_answer / 60).toFixed(4)
                                  )}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[8]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    (result?.tech_answer / 3600).toFixed(4)
                                  )}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[13]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    (result?.tech_answer / 86400).toFixed(4)
                                  )}
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

export default ElapsedTimeCalculator;

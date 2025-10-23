"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useACFTCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ACFTCalculator = () => {
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
    tech_unit_type: "1",
    tech_test_units: "1",
    tech_deadlift: "80",
    tech_standing_power_throw: "3.2",
    tech_hand_release: "13",
    tech_sprint_min: "2",
    tech_sprint_sec: "51",
    tech_plank_min: "4",
    tech_plank_sec: "13",
    tech_mile_min: "13",
    tech_mile_sec: "30",
    tech_leg_tuck: "0",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useACFTCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_unit_type ||
      !formData.tech_test_units ||
      !formData.tech_deadlift ||
      !formData.tech_standing_power_throw ||
      !formData.tech_hand_release ||
      !formData.tech_sprint_min ||
      !formData.tech_sprint_sec ||
      !formData.tech_mile_min ||
      !formData.tech_mile_sec
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_test_units: formData.tech_test_units,
        tech_deadlift: formData.tech_deadlift,
        tech_standing_power_throw: formData.tech_standing_power_throw,
        tech_hand_release: formData.tech_hand_release,
        tech_sprint_min: formData.tech_sprint_min,
        tech_sprint_sec: formData.tech_sprint_sec,
        tech_plank_min: formData.tech_plank_min,
        tech_plank_sec: formData.tech_plank_sec,
        tech_mile_min: formData.tech_mile_min,
        tech_mile_sec: formData.tech_mile_sec,
        tech_leg_tuck: formData.tech_leg_tuck,
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
      tech_unit_type: "1",
      tech_test_units: "1",
      tech_deadlift: "80",
      tech_standing_power_throw: "3.2",
      tech_hand_release: "13",
      tech_sprint_min: "2",
      tech_sprint_sec: "51",
      tech_plank_min: "13",
      tech_plank_sec: "30",
      tech_mile_min: "4",
      tech_mile_sec: "13",
      tech_leg_tuck: "0",
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

          <div className="lg:w-[80%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_unit_type" className="label">
                  {data?.payload?.tech_lang_keys["19"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_unit_type"
                    id="tech_unit_type"
                    value={formData.tech_unit_type}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["20"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["21"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["22"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_test_units" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_test_units"
                    id="tech_test_units"
                    value={formData.tech_test_units}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_deadlift" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_deadlift"
                    id="tech_deadlift"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_deadlift}
                    onChange={handleChange}
                  />
                  <span className="input_unit">lbs</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_standing_power_throw" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_standing_power_throw"
                    id="tech_standing_power_throw"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_standing_power_throw}
                    onChange={handleChange}
                  />
                  <span className="input_unit">m</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_hand_release" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_hand_release"
                    id="tech_hand_release"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_hand_release}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {data?.payload?.tech_lang_keys["23"]}
                  </span>
                </div>
              </div>
              <div className="col-span-6 md:col-span-4 lg:col-span-4 px-2">
                <label htmlFor="tech_sprint_min" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_sprint_min"
                    id="tech_sprint_min"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_sprint_min}
                    onChange={handleChange}
                  />
                  <span className="input_unit">min</span>
                </div>
              </div>
              <div className="col-span-6 md:col-span-2 lg:col-span-2 pe-2">
                <label htmlFor="tech_sprint_sec" className="label">
                  &nbsp;
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_sprint_sec"
                    id="tech_sprint_sec"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_sprint_sec}
                    onChange={handleChange}
                  />
                  <span className="input_unit">sec</span>
                </div>
              </div>
              {formData.tech_test_units == "2" && (
                <>
                  <div className="col-span-6 md:col-span-4 lg:col-span-4 px-2 plank ">
                    <label htmlFor="tech_plank_min" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_plank_min"
                        id="tech_plank_min"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_plank_min}
                        onChange={handleChange}
                      />
                      <span className="input_unit">min</span>
                    </div>
                  </div>

                  <div className="col-span-6 md:col-span-2 lg:col-span-2 pe-2 plank ">
                    <label htmlFor="tech_plank_sec" className="label">
                      &nbsp;
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_plank_sec"
                        id="tech_plank_sec"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_plank_sec}
                        onChange={handleChange}
                      />
                      <span className="input_unit">sec</span>
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-6 md:col-span-4 lg:col-span-4 px-2">
                <label htmlFor="tech_mile_min" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_mile_min"
                    id="tech_mile_min"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_mile_min}
                    onChange={handleChange}
                  />
                  <span className="input_unit">min</span>
                </div>
              </div>
              <div className="col-span-6 md:col-span-2 lg:col-span-2 pe-2">
                <label htmlFor="tech_mile_sec" className="label">
                  &nbsp;
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_mile_sec"
                    id="tech_mile_sec"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_mile_sec}
                    onChange={handleChange}
                  />
                  <span className="input_unit">sec</span>
                </div>
              </div>
              {formData.tech_test_units == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 leg_tuck">
                    <label htmlFor="tech_leg_tuck" className="label">
                      {data?.payload?.tech_lang_keys["8"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_leg_tuck"
                        id="tech_leg_tuck"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_leg_tuck}
                        onChange={handleChange}
                      />
                      <span className="input_unit">reps</span>
                    </div>
                  </div>
                </>
              )}
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
                    <div className="w-full mt-3">
                      <div className="w-full overflow-auto mt-2">
                        <table className="w-full" cellSpacing="0">
                          <thead>
                            <tr className="bg-[#2845F5] text-white">
                              <td className="radius-l-10 ps-4 pe-3 py-2">
                                {data?.payload?.tech_lang_keys["9"]}
                              </td>
                              <td className="px-3">
                                {data?.payload?.tech_lang_keys["24"]}
                              </td>
                              <td className="px-3">
                                {data?.payload?.tech_lang_keys["11"]}
                              </td>
                              <td className="radius-r-10 px-3">
                                {data?.payload?.tech_lang_keys["res"]}
                              </td>
                            </tr>
                          </thead>

                          <tbody>
                            {result?.tech_dead_lift_score !== "" && (
                              <tr>
                                <td className="border-b px-3 py-3">
                                  {data?.payload?.tech_lang_keys["25"]}
                                </td>
                                <td className="border-b px-3">
                                  {formData?.tech_deadlift} lb
                                </td>
                                <td className="border-b px-3">
                                  {result?.tech_dead_lift_score}
                                </td>
                                <td className="border-b px-3">
                                  <p
                                    className={`${
                                      result.tech_dead_lift_score >=
                                      result.tech_min_score
                                        ? "bg-blue-800"
                                        : "bg-red-800"
                                    } text-white text-center p-1 rounded`}
                                  >
                                    {result.tech_dead_lift_score >=
                                    result.tech_min_score
                                      ? "Passed"
                                      : "Fail"}
                                  </p>
                                </td>
                              </tr>
                            )}

                            {result?.tech_hand_release_answer !== "" && (
                              <tr>
                                <td className="border-b px-3 py-3">
                                  {data?.payload?.tech_lang_keys["26"]}
                                </td>
                                <td className="border-b px-3">
                                  {formData?.tech_hand_release}
                                </td>
                                <td className="border-b px-3">
                                  {result?.tech_hand_release_answer ?? 0}
                                </td>
                                <td className="border-b px-3">
                                  <p
                                    className={`${
                                      result.tech_hand_release_answer >=
                                      result.tech_min_score
                                        ? "bg-blue-800"
                                        : "bg-red-800"
                                    } text-white text-center p-1 rounded`}
                                  >
                                    {result.tech_hand_release_answer >=
                                    result.tech_min_score
                                      ? "Passed"
                                      : "Fail"}
                                  </p>
                                </td>
                              </tr>
                            )}

                            {result?.tech_spring_drag_score_answer !== "" && (
                              <tr>
                                <td className="border-b px-3 py-3">
                                  {data?.payload?.tech_lang_keys["13"]}
                                </td>
                                <td className="border-b px-3">
                                  {formData?.tech_sprint_min}:
                                  {formData?.tech_sprint_sec}
                                </td>
                                <td className="border-b px-3">
                                  {result?.tech_spring_drag_score_answer ?? 0}
                                </td>
                                <td className="border-b px-3">
                                  <p
                                    className={`${
                                      result.tech_spring_drag_score_answer >=
                                      result.tech_min_score
                                        ? "bg-blue-800"
                                        : "bg-red-800"
                                    } text-white text-center p-1 rounded`}
                                  >
                                    {result.tech_spring_drag_score_answer >=
                                    result.tech_min_score
                                      ? "Passed"
                                      : "Fail"}
                                  </p>
                                </td>
                              </tr>
                            )}

                            {result?.tech_leg_tuck_answer !== "" && (
                              <tr>
                                <td className="border-b px-3 py-3">
                                  {data?.payload?.tech_lang_keys["8"]}
                                </td>
                                <td className="border-b px-3">
                                  {formData?.tech_leg_tuck}
                                </td>
                                <td className="border-b px-3">
                                  {result?.tech_leg_tuck_answer ?? 0}
                                </td>
                                <td className="border-b px-3">
                                  <p
                                    className={`${
                                      result.tech_leg_tuck_answer >=
                                      result.tech_min_score
                                        ? "bg-blue-800"
                                        : "bg-red-800"
                                    } text-white text-center p-1 rounded`}
                                  >
                                    {result.tech_leg_tuck_answer >=
                                    result.tech_min_score
                                      ? "Passed"
                                      : "Fail"}
                                  </p>
                                </td>
                              </tr>
                            )}

                            {result?.tech_plank_answer !== "" && (
                              <tr>
                                <td className="border-b px-3 py-3">
                                  {data?.payload?.tech_lang_keys["6"]}
                                </td>
                                <td className="border-b px-3">
                                  {formData?.tech_plank_min}:
                                  {formData?.tech_plank_sec}
                                </td>
                                <td className="border-b px-3">
                                  {result?.tech_plank_answer ?? 0}
                                </td>
                                <td className="border-b px-3">
                                  <p
                                    className={`${
                                      result.tech_plank_answer >=
                                      result.tech_min_score
                                        ? "bg-blue-800"
                                        : "bg-red-800"
                                    } text-white text-center p-1 rounded`}
                                  >
                                    {result.tech_plank_answer >=
                                    result.tech_min_score
                                      ? "Passed"
                                      : "Fail"}
                                  </p>
                                </td>
                              </tr>
                            )}

                            {result?.tech_two_miles_run_values !== "" && (
                              <tr>
                                <td className="border-b px-3 py-3">
                                  {data?.payload?.tech_lang_keys["7"]}
                                </td>
                                <td className="border-b px-3">
                                  {formData?.tech_mile_min}:
                                  {formData?.tech_mile_sec}
                                </td>
                                <td className="border-b px-3">
                                  {result?.tech_two_miles_run_values}
                                </td>
                                <td className="border-b px-3">
                                  <p
                                    className={`${
                                      result.tech_two_miles_run_values >=
                                      result.tech_min_score
                                        ? "bg-blue-800"
                                        : "bg-red-800"
                                    } text-white text-center p-1 rounded`}
                                  >
                                    {result.tech_two_miles_run_values >=
                                    result.tech_min_score
                                      ? "Passed"
                                      : "Fail"}
                                  </p>
                                </td>
                              </tr>
                            )}

                            {result?.tech_power_throw_score_answer !== "" && (
                              <tr>
                                <td className="border-b px-3 py-3">
                                  {data?.payload?.tech_lang_keys["14"]}
                                </td>
                                <td className="border-b px-3">
                                  {formData?.tech_standing_power_throw}
                                </td>
                                <td className="border-b px-3">
                                  {result?.tech_power_throw_score_answer ?? 0}
                                </td>
                                <td className="border-b px-3">
                                  <p
                                    className={`${
                                      result.tech_power_throw_score_answer >=
                                      result.tech_min_score
                                        ? "bg-blue-800"
                                        : "bg-red-800"
                                    } text-white text-center p-1 rounded`}
                                  >
                                    {result.tech_power_throw_score_answer >=
                                    result.tech_min_score
                                      ? "Passed"
                                      : "Fail"}
                                  </p>
                                </td>
                              </tr>
                            )}

                            {/* Final Row */}
                            <tr>
                              <td className="px-3 py-3" colSpan="2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}
                                </strong>
                              </td>
                              <td className="px-3">
                                <strong>
                                  {Number(result?.tech_dead_lift_score || 0) +
                                    Number(
                                      result?.tech_power_throw_score_answer || 0
                                    ) +
                                    Number(
                                      result?.tech_two_miles_run_values || 0
                                    ) +
                                    Number(result?.tech_plank_answer || 0) +
                                    Number(result?.tech_leg_tuck_answer || 0) +
                                    Number(
                                      result?.tech_spring_drag_score_answer || 0
                                    ) +
                                    Number(
                                      result?.tech_hand_release_answer || 0
                                    )}
                                </strong>
                              </td>
                              <td className="px-3">
                                <p
                                  className={`${
                                    result?.tech_dead_lift_score <
                                      result?.tech_min_score ||
                                    result?.tech_power_throw_score_answer <
                                      result?.tech_min_score ||
                                    result?.tech_two_miles_run_values <
                                      result?.tech_min_score ||
                                    (result?.tech_plank_answer !== undefined &&
                                      result?.tech_plank_answer <
                                        result?.tech_min_score) ||
                                    result?.tech_leg_tuck_answer <
                                      result?.tech_min_score ||
                                    result?.tech_spring_drag_score_answer <
                                      result?.tech_min_score ||
                                    result?.tech_hand_release_answer <
                                      result?.tech_min_score
                                      ? "bg-red-800"
                                      : "bg-dark-blue"
                                  } text-white text-center p-1 rounded`}
                                >
                                  {result?.tech_dead_lift_score <
                                    result?.tech_min_score ||
                                  result?.tech_power_throw_score_answer <
                                    result?.tech_min_score ||
                                  result?.tech_two_miles_run_values <
                                    result?.tech_min_score ||
                                  (result?.tech_plank_answer !== undefined &&
                                    result?.tech_plank_answer <
                                      result?.tech_min_score) ||
                                  result?.tech_leg_tuck_answer <
                                    result?.tech_min_score ||
                                  result?.tech_spring_drag_score_answer <
                                    result?.tech_min_score ||
                                  result?.tech_hand_release_answer <
                                    result?.tech_min_score
                                    ? "Fail"
                                    : "Passed"}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <p className="w-full text-[20px] mt-3">
                        <strong>{data?.payload?.tech_lang_keys["16"]}</strong>
                      </p>
                      <div className="w-full overflow-auto mt-1">
                        <table className="w-full" cellSpacing="0">
                          <thead>
                            <tr className="bg-[#2845F5] text-white">
                              <td className="radius-l-10 ps-4 pe-3 py-2">
                                {data?.payload?.tech_lang_keys["9"]}
                              </td>
                              <td className="px-3">
                                {data?.payload?.tech_lang_keys["17"]}
                              </td>
                              <td className="radius-r-10 px-3">
                                {data?.payload?.tech_lang_keys["18"]}
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {result?.tech_dead_lift_score !== "" && (
                              <tr>
                                <td className="border-b px-3 py-3">
                                  {data?.payload?.tech_lang_keys["25"]}
                                </td>
                                <td className="border-b px-3">
                                  {formData?.tech_deadlift} lb
                                </td>
                                <td className="border-b px-3">
                                  {result?.tech_mdl_value} lb
                                </td>
                              </tr>
                            )}
                            {result?.tech_hand_release_answer !== "" && (
                              <tr>
                                <td className="border-b px-3 py-3">
                                  {data?.payload?.tech_lang_keys["26"]}
                                </td>
                                <td className="border-b px-3">
                                  {formData?.tech_hand_release} (Reps)
                                </td>
                                <td className="border-b px-3">
                                  {result?.tech_hrp_value} (Reps)
                                </td>
                              </tr>
                            )}
                            {result?.tech_spring_drag_score_answer !== "" && (
                              <tr>
                                <td className="border-b px-3 py-3">
                                  {data?.payload?.tech_lang_keys["13"]}
                                </td>
                                <td className="border-b px-3">
                                  {formData?.tech_sprint_min}:
                                  {formData?.tech_sprint_sec} (MM:SS)
                                </td>
                                <td className="border-b px-3">
                                  {result?.tech_sdc_value} (MM:SS)
                                </td>
                              </tr>
                            )}
                            {result?.tech_leg_tuck_answer &&
                              result?.tech_leg_tuck_answer !== "" && (
                                <tr>
                                  <td className="border-b px-3 py-3">
                                    {data?.payload?.tech_lang_keys["8"]}
                                  </td>
                                  <td className="border-b px-3">
                                    {formData?.tech_leg_tuck} (Reps)
                                  </td>
                                  <td className="border-b px-3">
                                    {result?.tech_ltk_value} (Reps)
                                  </td>
                                </tr>
                              )}
                            {result?.tech_plank_answer &&
                              result?.tech_plank_answer !== "" && (
                                <tr>
                                  <td className="border-b px-3 py-3">
                                    {data?.payload?.tech_lang_keys["6"]}
                                  </td>
                                  <td className="border-b px-3">
                                    {formData?.tech_plank_min}:
                                    {formData?.tech_plank_sec}
                                  </td>
                                  <td className="border-b px-3">
                                    {result?.tech_plk_value}
                                  </td>
                                </tr>
                              )}
                            {result?.tech_two_miles_run_values !== "" && (
                              <tr>
                                <td className="border-b px-3 py-3">
                                  {data?.payload?.tech_lang_keys["7"]}
                                </td>
                                <td className="border-b px-3">
                                  {formData?.tech_mile_min}:
                                  {formData?.tech_mile_sec} (MM:SS)
                                </td>
                                <td className="border-b px-3">
                                  {result?.tech_two_miles_run_values} (MM:SS)
                                </td>
                              </tr>
                            )}
                            {result?.tech_power_throw_score_answer !== "" && (
                              <tr>
                                <td className="px-3 py-3">
                                  {data?.payload?.tech_lang_keys["14"]}
                                </td>
                                <td className="px-3">
                                  {formData?.tech_standing_power_throw} m
                                </td>
                                <td className="px-3">
                                  {result?.tech_spt_value} m
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
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

export default ACFTCalculator;

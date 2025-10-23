"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useVaDisabilityCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VADisabilityCalculator = () => {
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

  console.log(data);

  const [formData, setFormData] = useState({
    tech_right_arm: 20,
    tech_left_arm: 40,
    tech_right_leg: 80,
    tech_left_leg: 80,
    tech_right_foot: 70,
    tech_left_foot: 80,
    tech_back: 60,
    tech_ssd: 70,
    tech_ptsd: 80,
    tech_tinnitus: 90,
    tech_migraines: 80,
    tech_sleep_apnea: 50,
    tech_bilateral_upper: 70,
    tech_bilateral_lower: 70,
    tech_others: 50,
    tech_status: "single",
    tech_under_age: 11,
    tech_over_age: 10,
    tech_parent: 1,
    tech_attendance: "No",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVaDisabilityCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_right_arm ||
      !formData.tech_left_arm ||
      !formData.tech_right_leg ||
      !formData.tech_left_leg ||
      !formData.tech_right_foot ||
      !formData.tech_left_foot ||
      !formData.tech_back ||
      !formData.tech_ssd ||
      !formData.tech_ptsd ||
      !formData.tech_tinnitus ||
      !formData.tech_migraines ||
      !formData.tech_sleep_apnea ||
      !formData.tech_bilateral_upper ||
      !formData.tech_bilateral_lower ||
      !formData.tech_others ||
      !formData.tech_status ||
      !formData.tech_under_age ||
      !formData.tech_over_age ||
      !formData.tech_parent ||
      !formData.tech_attendance
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_right_arm: formData.tech_right_arm,
        tech_left_arm: formData.tech_left_arm,
        tech_right_leg: formData.tech_right_leg,
        tech_left_leg: formData.tech_left_leg,
        tech_right_foot: formData.tech_right_foot,
        tech_left_foot: formData.tech_left_foot,
        tech_back: formData.tech_back,
        tech_ssd: formData.tech_ssd,
        tech_ptsd: formData.tech_ptsd,
        tech_tinnitus: formData.tech_tinnitus,
        tech_migraines: formData.tech_migraines,
        tech_sleep_apnea: formData.tech_sleep_apnea,
        tech_bilateral_upper: formData.tech_bilateral_upper,
        tech_bilateral_lower: formData.tech_bilateral_lower,
        tech_others: formData.tech_others,
        tech_status: formData.tech_status,
        tech_under_age: formData.tech_under_age,
        tech_over_age: formData.tech_over_age,
        tech_parent: formData.tech_parent,
        tech_attendance: formData.tech_attendance,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_right_arm: 20,
      tech_left_arm: 40,
      tech_right_leg: 80,
      tech_left_leg: 80,
      tech_right_foot: 70,
      tech_left_foot: 80,
      tech_back: 60,
      tech_ssd: 70,
      tech_ptsd: 80,
      tech_tinnitus: 90,
      tech_migraines: 80,
      tech_sleep_apnea: 50,
      tech_bilateral_upper: 70,
      tech_bilateral_lower: 70,
      tech_others: 50,
      tech_status: "Married",
      tech_under_age: 11,
      tech_over_age: 10,
      tech_parent: 1,
      tech_attendance: "No",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                {data?.payload?.tech_lang_keys["1"]}
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_right_arm" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_right_arm"
                    id="tech_right_arm"
                    value={formData.tech_right_arm}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_left_arm" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_left_arm"
                    id="tech_left_arm"
                    value={formData.tech_left_arm}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_right_leg" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_right_leg"
                    id="tech_right_leg"
                    value={formData.tech_right_leg}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_left_leg" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_left_leg"
                    id="tech_left_leg"
                    value={formData.tech_left_leg}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_right_foot" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_right_foot"
                    id="tech_right_foot"
                    value={formData.tech_right_foot}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_left_foot" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_left_foot"
                    id="tech_left_foot"
                    value={formData.tech_left_foot}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_back" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_back"
                    id="tech_back"
                    value={formData.tech_back}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_ssd" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_ssd"
                    id="tech_ssd"
                    value={formData.tech_ssd}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_ptsd" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_ptsd"
                    id="tech_ptsd"
                    value={formData.tech_ptsd}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_tinnitus" className="label">
                  {data?.payload?.tech_lang_keys["11"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_tinnitus"
                    id="tech_tinnitus"
                    value={formData.tech_tinnitus}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_migraines" className="label">
                  {data?.payload?.tech_lang_keys["12"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_migraines"
                    id="tech_migraines"
                    value={formData.tech_migraines}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_sleep_apnea" className="label">
                  {data?.payload?.tech_lang_keys["13"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_sleep_apnea"
                    id="tech_sleep_apnea"
                    value={formData.tech_sleep_apnea}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_bilateral_upper" className="label">
                  {data?.payload?.tech_lang_keys["14"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_bilateral_upper"
                    id="tech_bilateral_upper"
                    value={formData.tech_bilateral_upper}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_bilateral_lower" className="label">
                  {data?.payload?.tech_lang_keys["15"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_bilateral_lower"
                    id="tech_bilateral_lower"
                    value={formData.tech_bilateral_lower}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_others" className="label">
                  {data?.payload?.tech_lang_keys["16"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_others"
                    id="tech_others"
                    value={formData.tech_others}
                    onChange={handleChange}
                  >
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                {data?.payload?.tech_lang_keys[17]}
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_status" className="label">
                  {data?.payload?.tech_lang_keys["18"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_status"
                    id="tech_status"
                    value={formData.tech_status}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys[19]}>
                      {data?.payload?.tech_lang_keys[19]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys[20]}>
                      {data?.payload?.tech_lang_keys[20]}
                    </option>
                  </select>
                </div>
              </div>

              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_under_age" className="label">
                  {data?.payload?.tech_lang_keys[21]} 18:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_under_age"
                    id="tech_under_age"
                    value={formData.tech_under_age}
                    onChange={handleChange}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="0">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_over_age" className="label">
                  {data?.payload?.tech_lang_keys[22]} 18:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_over_age"
                    id="tech_over_age"
                    value={formData.tech_over_age}
                    onChange={handleChange}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="0">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_parent" className="label">
                  {data?.payload?.tech_lang_keys["23"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_parent"
                    id="tech_parent"
                    value={formData.tech_parent}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys[24]}
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
              </div>
              {formData?.tech_status == data?.payload?.tech_lang_keys[20] && (
                <div className="lg:col-span-6 md:col-span-6 col-span-12  married">
                  <label htmlFor="tech_attendance" className="label">
                    {data?.payload?.tech_lang_keys[29]}{" "}
                    {data?.payload?.tech_lang_keys[30]}?
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_attendance"
                      id="tech_attendance"
                      value={formData.tech_attendance}
                      onChange={handleChange}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>
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
                      <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="50%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[25]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_total_combined).toFixed(1)}
                                %
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="50%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[26]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_total_cumulative).toFixed(
                                  1
                                )}
                                %
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="50%">
                                <strong>
                                  💵 {data?.payload?.tech_lang_keys[27]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {currency.symbol}{" "}
                                {Number(result?.tech_rate).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys[28]}
                              </td>
                            </tr>
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

export default VADisabilityCalculator;

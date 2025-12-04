"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePointBuyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const Dandd5ePointBuyCalculator = () => {
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

  // Initial form state
  const [formData, setFormData] = useState({
    tech_choice: "1", // 1=Customized, 2=Simple
    tech_racial_choice: "1.1.1.1.1.1", // Human by default
    tech_points_budget: "27",
    tech_smallest_score: "8",
    tech_largest_score: "15",
    tech_s1: "-9",
    tech_s2: "-6",
    tech_s3: "-4",
    tech_s4: "-2",
    tech_s5: "-1",
    tech_s6: "0",
    tech_s7: "1",
    tech_s8: "2",
    tech_s9: "3",
    tech_s10: "4",
    tech_s11: "5",
    tech_s12: "7",
    tech_s13: "9",
    tech_s14: "12",
    tech_s15: "15",
    tech_s16: "19",
    tech_strength: "8",
    tech_dexerity: "8",
    tech_intelligence: "8",
    tech_wisdom: "8",
    tech_charisma: "8",
    tech_constitution: "8",
    tech_strength1: "6",
    tech_dexerity1: "6",
    tech_intelligence1: "6",
    tech_wisdom1: "6",
    tech_charisma1: "6",
    tech_constitution1: "6",
    tech_submit: "calculate",
  });

  const [showCustomize, setShowCustomize] = useState(false);
  const [showOtherRacialInputs, setShowOtherRacialInputs] = useState(false);
  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const [calculateEbitCalculator, { isLoading: roundToTheNearestLoading }] =
    usePointBuyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);

    // Toggle customize section based on choice
    if (name === "tech_choice") {
      setShowCustomize(value === "2");
    }

    // Toggle other racial inputs when "Other" is selected
    if (name === "tech_racial_choice") {
      setShowOtherRacialInputs(value === "39");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const response = await calculateEbitCalculator(formData).unwrap();
      setResult(response?.payload);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data?.payload?.error || "An error occurred");
      toast.error(err.data?.payload?.error || "An error occurred");
    }
  };

  const handleReset = () => {
    setFormData({
      tech_choice: "1",
      tech_racial_choice: "1.1.1.1.1.1",
      tech_points_budget: "27",
      tech_smallest_score: "8",
      tech_largest_score: "15",
      tech_s1: "-9",
      tech_s2: "-6",
      tech_s3: "-4",
      tech_s4: "-2",
      tech_s5: "-1",
      tech_s6: "0",
      tech_s7: "1",
      tech_s8: "2",
      tech_s9: "3",
      tech_s10: "4",
      tech_s11: "5",
      tech_s12: "7",
      tech_s13: "9",
      tech_s14: "12",
      tech_s15: "15",
      tech_s16: "19",
      tech_strength: "8",
      tech_dexerity: "8",
      tech_intelligence: "8",
      tech_wisdom: "8",
      tech_charisma: "8",
      tech_constitution: "8",
      tech_strength1: "6",
      tech_dexerity1: "6",
      tech_intelligence1: "6",
      tech_wisdom1: "6",
      tech_charisma1: "6",
      tech_constitution1: "6",
      tech_submit: "calculate",
    });
    setShowCustomize(false);
    setShowOtherRacialInputs(false);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              {/* Calculate With Dropdown */}
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_choice" className="label">
                  {data?.payload?.tech_lang_keys?.["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_choice"
                    id="tech_choice"
                    value={formData.tech_choice}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys?.["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys?.["3"]}
                    </option>
                  </select>
                </div>
              </div>

              {/* Racial Choice Dropdown */}
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_racial_choice" className="label">
                  {data?.payload?.tech_lang_keys?.["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_racial_choice"
                    id="tech_racial_choice"
                    value={formData.tech_racial_choice}
                    onChange={handleChange}
                  >
                    {[
                      data?.payload?.tech_lang_keys?.[5],
                      `${data?.payload?.tech_lang_keys?.[6]} (${data?.payload?.tech_lang_keys?.[7]})`,
                      `Elf (${data?.payload?.tech_lang_keys?.[8]})`,
                      `${data?.payload?.tech_lang_keys?.[9]} (${data?.payload?.tech_lang_keys?.[10]})`,
                      `${data?.payload?.tech_lang_keys?.[11]}-Elf`,
                      `${data?.payload?.tech_lang_keys?.[11]}-Orc`,
                      `${data?.payload?.tech_lang_keys?.[12]} (${data?.payload?.tech_lang_keys?.[13]})`,
                      data?.payload?.tech_lang_keys?.[14],
                      data?.payload?.tech_lang_keys?.[15],
                      data?.payload?.tech_lang_keys?.[16],
                      data?.payload?.tech_lang_keys?.[17],
                      data?.payload?.tech_lang_keys?.[18],
                      data?.payload?.tech_lang_keys?.[19],
                      data?.payload?.tech_lang_keys?.[20],
                      data?.payload?.tech_lang_keys?.[21],
                      data?.payload?.tech_lang_keys?.[22],
                      data?.payload?.tech_lang_keys?.[23],
                      data?.payload?.tech_lang_keys?.[24],
                      data?.payload?.tech_lang_keys?.[25],
                      data?.payload?.tech_lang_keys?.[26],
                      data?.payload?.tech_lang_keys?.[12],
                      data?.payload?.tech_lang_keys?.[27],
                      data?.payload?.tech_lang_keys?.[28],
                      data?.payload?.tech_lang_keys?.[29],
                      data?.payload?.tech_lang_keys?.[30],
                      data?.payload?.tech_lang_keys?.[31],
                      data?.payload?.tech_lang_keys?.[32],
                      data?.payload?.tech_lang_keys?.[33],
                      data?.payload?.tech_lang_keys?.[34],
                      data?.payload?.tech_lang_keys?.[35],
                      data?.payload?.tech_lang_keys?.[36],
                      data?.payload?.tech_lang_keys?.[37],
                      data?.payload?.tech_lang_keys?.[38],
                      data?.payload?.tech_lang_keys?.[39],
                      data?.payload?.tech_lang_keys?.[40], // "Other"
                    ].map((label, index) => {
                      const values = [
                        "2.0.0.0.0.1",
                        "0.0.2.0.1.0",
                        "0.2.0.1.0.0",
                        "0.0.1.0.2.0",
                        "0.0.0.0.0.2",
                        "2.0.1.0.0.0",
                        "0.2.0.0.0.1",
                        "1.1.1.1.1.1",
                        "0.0.0.1.0.2",
                        "0.2.0.0.0.1",
                        "0.0.0.0.0.2",
                        "2.1.0.0.0.0",
                        "2.0.0.0.1.0",
                        "1.0.0.0.2.0",
                        "0.0.2.0.0.0",
                        "0.0.0.1.0.0",
                        "0.0.0.2.0.0",
                        "0.2.1.0.0.0",
                        "2.0.1.0.0.0",
                        "0.2.1.0.0.0",
                        "0.2.0.0.0.0",
                        "0.0.2.1.0.0",
                        "0.0.0.0.2.1",
                        "0.2.0.0.1.0",
                        "0.2.0.0.0.0",
                        "1.0.2.0.0.0",
                        "0.0.2.0.1.0",
                        "2.1.0.0.0.0",
                        "0.0.2.0.1.0",
                        "2.0.1.0.0.0",
                        "0.1.0.0.0.2",
                        "0.2.0.0.0.1",
                        "2.0.0.0.1.0",
                        "1.0.1.0.0.1",
                        "39", // Other value
                      ];
                      return (
                        <option key={index} value={values[index]}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Customize Section (shown only when tech_choice is "1") */}
              {showCustomize && (
                <div className="col-span-12 mt-4">
                  <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                    <div className="col-span-4 md:col-span-4 lg:col-span-4">
                      <label htmlFor="tech_points_budget" className="label">
                        {data?.payload?.tech_lang_keys?.["41"]}:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_points_budget"
                          id="tech_points_budget"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_points_budget}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-span-4 md:col-span-4 lg:col-span-4">
                      <label htmlFor="tech_smallest_score" className="label">
                        {data?.payload?.tech_lang_keys?.["42"]}:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_smallest_score"
                          id="tech_smallest_score"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_smallest_score}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-span-4 md:col-span-4 lg:col-span-4">
                      <label htmlFor="tech_largest_score" className="label">
                        {data?.payload?.tech_lang_keys?.["43"]}:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_largest_score"
                          id="tech_largest_score"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_largest_score}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Point costs for scores 3-18 */}
                    {Array.from({ length: 16 }, (_, i) => i + 3).map(
                      (score, index) => {
                        // 1 سے start کریں array index
                        const inputIndex = index + 1;
                        return (
                          <div
                            key={score}
                            className="col-span-4 md:col-span-3 lg:col-span-3"
                          >
                            <label
                              htmlFor={`tech_s${inputIndex}`}
                              className="label"
                            >
                              {score}:
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                step="any"
                                name={`tech_s${inputIndex}`}
                                id={`tech_s${inputIndex}`}
                                className="input my-2"
                                placeholder="00"
                                value={formData[`tech_s${inputIndex}`]}
                                onChange={handleChange}
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                {data?.payload?.tech_lang_keys?.["44"] ||
                                  "Points"}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* Main Ability Scores Inputs */}
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_strength" className="label">
                  {data?.payload?.tech_lang_keys?.[46]}:
                </label>
                <div className="w-full py-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_strength"
                    id="tech_strength"
                    className="input"
                    aria-label="input"
                    value={formData.tech_strength}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_dexerity" className="label">
                  {data?.payload?.tech_lang_keys?.[47]}:
                </label>
                <div className="w-full py-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_dexerity"
                    id="tech_dexerity"
                    className="input"
                    aria-label="input"
                    value={formData.tech_dexerity}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_intelligence" className="label">
                  {data?.payload?.tech_lang_keys?.[48]}:
                </label>
                <div className="w-full py-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_intelligence"
                    id="tech_intelligence"
                    className="input"
                    aria-label="input"
                    value={formData.tech_intelligence}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_wisdom" className="label">
                  {data?.payload?.tech_lang_keys?.[49]}:
                </label>
                <div className="w-full py-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_wisdom"
                    id="tech_wisdom"
                    className="input"
                    aria-label="input"
                    value={formData.tech_wisdom}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_charisma" className="label">
                  {data?.payload?.tech_lang_keys?.[50]}:
                </label>
                <div className="w-full py-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_charisma"
                    id="tech_charisma"
                    className="input"
                    aria-label="input"
                    value={formData.tech_charisma}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_constitution" className="label">
                  {data?.payload?.tech_lang_keys?.[51]}:
                </label>
                <div className="w-full py-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_constitution"
                    id="tech_constitution"
                    className="input"
                    aria-label="input"
                    value={formData.tech_constitution}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Other Racial Inputs (shown only when "Other" is selected) */}
              {showOtherRacialInputs && (
                <div className="col-span-12 mt-6 p-4 border border-gray-300 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    {data?.payload?.tech_lang_keys?.["52"] ||
                      "Enter your own racial values"}
                  </h3>
                  <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                    <div className="col-span-6 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_strength1" className="label">
                        {data?.payload?.tech_lang_keys?.[46]}:
                      </label>
                      <div className="w-full py-2">
                        <input
                          type="number"
                          step="any"
                          name="tech_strength1"
                          id="tech_strength1"
                          className="input"
                          aria-label="input"
                          value={formData.tech_strength1}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-span-6 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_dexerity1" className="label">
                        {data?.payload?.tech_lang_keys?.[47]}:
                      </label>
                      <div className="w-full py-2">
                        <input
                          type="number"
                          step="any"
                          name="tech_dexerity1"
                          id="tech_dexerity1"
                          className="input"
                          aria-label="input"
                          value={formData.tech_dexerity1}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-span-6 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_intelligence1" className="label">
                        {data?.payload?.tech_lang_keys?.[48]}:
                      </label>
                      <div className="w-full py-2">
                        <input
                          type="number"
                          step="any"
                          name="tech_intelligence1"
                          id="tech_intelligence1"
                          className="input"
                          aria-label="input"
                          value={formData.tech_intelligence1}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-span-6 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_wisdom1" className="label">
                        {data?.payload?.tech_lang_keys?.[49]}:
                      </label>
                      <div className="w-full py-2">
                        <input
                          type="number"
                          step="any"
                          name="tech_wisdom1"
                          id="tech_wisdom1"
                          className="input"
                          aria-label="input"
                          value={formData.tech_wisdom1}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-span-6 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_charisma1" className="label">
                        {data?.payload?.tech_lang_keys?.[50]}:
                      </label>
                      <div className="w-full py-2">
                        <input
                          type="number"
                          step="any"
                          name="tech_charisma1"
                          id="tech_charisma1"
                          className="input"
                          aria-label="input"
                          value={formData.tech_charisma1}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-span-6 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_constitution1" className="label">
                        {data?.payload?.tech_lang_keys?.[51]}:
                      </label>
                      <div className="w-full py-2">
                        <input
                          type="number"
                          step="any"
                          name="tech_constitution1"
                          id="tech_constitution1"
                          className="input"
                          aria-label="input"
                          value={formData.tech_constitution1}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys?.["calculate"] || "Calculate"}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys?.["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>

        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
            <div className="animate-pulse">
              <div className="w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
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

                  {/* Result Table Display */}
                  <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead>
                        <tr className="bg-[#2845F5] text-[#fff]">
                          <th className="py-3 px-4 border-b text-left font-semibold">
                            Ability
                          </th>
                          <th className="py-3 px-4 border-b text-left font-semibold">
                            Base Score
                          </th>
                          <th className="py-3 px-4 border-b text-left font-semibold">
                            Racial Bonus
                          </th>
                          <th className="py-3 px-4 border-b text-left font-semibold">
                            Final Score
                          </th>
                          <th className="py-3 px-4 border-b text-left font-semibold">
                            Point Cost
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3 px-4 border-b font-medium">
                            Strength
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {formData.tech_strength}
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {result.tech_strength_racial_bonus ||
                              (formData.tech_racial_choice === "39"
                                ? formData.tech_strength1
                                : "0")}
                          </td>
                          <td className="py-3 px-4 border-b text-center font-semibold">
                            {Number(formData.tech_strength) +
                              Number(
                                result.tech_strength_racial_bonus ||
                                  (formData.tech_racial_choice === "39"
                                    ? formData.tech_strength1
                                    : 0)
                              )}
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {result.tech_strength_value || "0"}
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="py-3 px-4 border-b font-medium">
                            Dexterity
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {formData.tech_dexerity}
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {result.tech_dexerity_racial_bonus ||
                              (formData.tech_racial_choice === "39"
                                ? formData.tech_dexerity1
                                : "0")}
                          </td>
                          <td className="py-3 px-4 border-b text-center font-semibold">
                            {Number(formData.tech_dexerity) +
                              Number(
                                result.tech_dexerity_racial_bonus ||
                                  (formData.tech_racial_choice === "39"
                                    ? formData.tech_dexerity1
                                    : 0)
                              )}
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {result.tech_dexerity_value || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b font-medium">
                            Constitution
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {formData.tech_constitution}
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {result.tech_constitution_racial_bonus ||
                              (formData.tech_racial_choice === "39"
                                ? formData.tech_constitution1
                                : "0")}
                          </td>
                          <td className="py-3 px-4 border-b text-center font-semibold">
                            {Number(formData.tech_constitution) +
                              Number(
                                result.tech_constitution_racial_bonus ||
                                  (formData.tech_racial_choice === "39"
                                    ? formData.tech_constitution1
                                    : 0)
                              )}
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {result.tech_constitution_value || "0"}
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="py-3 px-4 border-b font-medium">
                            Intelligence
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {formData.tech_intelligence}
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {result.tech_intelligence_racial_bonus ||
                              (formData.tech_racial_choice === "39"
                                ? formData.tech_intelligence1
                                : "0")}
                          </td>
                          <td className="py-3 px-4 border-b text-center font-semibold">
                            {Number(formData.tech_intelligence) +
                              Number(
                                result.tech_intelligence_racial_bonus ||
                                  (formData.tech_racial_choice === "39"
                                    ? formData.tech_intelligence1
                                    : 0)
                              )}
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {result.tech_intelligence_value || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b font-medium">
                            Wisdom
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {formData.tech_wisdom}
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {result.tech_wisdom_racial_bonus ||
                              (formData.tech_racial_choice === "39"
                                ? formData.tech_wisdom1
                                : "0")}
                          </td>
                          <td className="py-3 px-4 border-b text-center font-semibold">
                            {Number(formData.tech_wisdom) +
                              Number(
                                result.tech_wisdom_racial_bonus ||
                                  (formData.tech_racial_choice === "39"
                                    ? formData.tech_wisdom1
                                    : 0)
                              )}
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {result.tech_wisdom_value || "0"}
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="py-3 px-4 border-b font-medium">
                            Charisma
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {formData.tech_charisma}
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {result.tech_charisma_racial_bonus ||
                              (formData.tech_racial_choice === "39"
                                ? formData.tech_charisma1
                                : "0")}
                          </td>
                          <td className="py-3 px-4 border-b text-center font-semibold">
                            {Number(formData.tech_charisma) +
                              Number(
                                result.tech_charisma_racial_bonus ||
                                  (formData.tech_racial_choice === "39"
                                    ? formData.tech_charisma1
                                    : 0)
                              )}
                          </td>
                          <td className="py-3 px-4 border-b text-center">
                            {result.tech_charisma_value || "0"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

export default Dandd5ePointBuyCalculator;

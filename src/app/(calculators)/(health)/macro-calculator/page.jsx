"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

import {
  useGetSingleCalculatorDetailsMutation,
  useMacroCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MacroCalculator = () => {
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
    tech_age: 25,
    tech_gender: "Male",
    tech_height_ft: 5,
    tech_unit_ft_in: "ft/in",
    tech_height_in: 9,
    tech_unit_h: "cm",
    tech_height_cm: 9,
    tech_unit_h_cm: "ft/in",
    tech_weight: 158,
    tech_unit: "cm",
    tech_meal: 4,
    tech_goal: "Fat Loss",
    tech_activity: "Moderately Active",
    tech_formula: "first",
    tech_percent: null,
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMacroCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_age: formData.tech_age,
        tech_gender: formData.tech_gender,
        tech_height_ft: formData.tech_height_ft,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_height_in: formData.tech_height_in,
        tech_unit_h: formData.tech_unit_h,
        tech_height_cm: formData.tech_height_cm,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_weight: formData.tech_weight,
        tech_unit: formData.tech_unit,
        tech_meal: formData.tech_meal,
        tech_goal: formData.tech_goal,
        tech_activity: formData.tech_activity,
        tech_formula: formData.tech_formula,
        tech_percent: formData.tech_percent,
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
      tech_age: 25,
      tech_gender: "Male",
      tech_height_ft: 5,
      tech_unit_ft_in: "ft/in",
      tech_height_in: 9,
      tech_unit_h: "cm",
      tech_height_cm: 9,
      tech_unit_h_cm: "ft/in",
      tech_weight: 158,
      tech_unit: "cm",
      tech_meal: 4,
      tech_goal: "Fat Loss",
      tech_activity: "Moderately Active",
      tech_formula: "first",
      tech_percent: null,
      tech_submit: "calculate",
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

  //dropdown states 1
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const setUnitHandler = (unit) => {
    setFormData((prev) => ({
      ...prev,

      tech_unit_h: "ft/in",
      tech_unit_ft_in: unit,
    }));
    setDropdownVisible(false);
  };
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 2
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: "cm",
      tech_unit_ft_in: unit, // hidden input update hoga
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 3
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  // chart js

  const [activeTab, setActiveTab] = useState("bal");
  const [ownValues, setOwnValues] = useState({
    protein: 20,
    fat: 30,
    carbs: 50,
  });

  const tabPresets = {
    bal: { protein: 20, fat: 30, carbs: 50 },
    low_fat: { protein: 25, fat: 20, carbs: 55 },
    low_carb: { protein: 30, fat: 35, carbs: 35 },
    high_pro: { protein: 35, fat: 25, carbs: 40 },
    own: ownValues,
  };

  const currentValues = tabPresets[activeTab];

  const handleSliderChange = (key, value) => {
    const newValue = parseInt(value);
    const otherKeys = ["protein", "fat", "carbs"].filter((k) => k !== key);

    const remaining = 100 - newValue;
    const val1 = ownValues[otherKeys[0]];
    const val2 = ownValues[otherKeys[1]];
    const total = val1 + val2 || 1; // prevent division by zero

    const newVal1 = Math.round((val1 / total) * remaining);
    const newVal2 = remaining - newVal1;

    const updatedValues = {
      ...ownValues,
      [key]: newValue,
      [otherKeys[0]]: newVal1,
      [otherKeys[1]]: newVal2,
    };

    setOwnValues(updatedValues);
  };

  const datachart = {
    labels: ["Protein", "Fat", "Carbs"],
    datasets: [
      {
        data: [currentValues.protein, currentValues.fat, currentValues.carbs],
        backgroundColor: ["#F97316", "#10B981", "#6366F1"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  const displayData = [
    {
      label: "PROTEIN",
      image: "protein1.png",
      value: `${currentValues.protein}%`,
      range: `${currentValues.protein - 5}–${currentValues.protein + 5}%`,
    },
    {
      label: "FAT",
      image: "Fats.png",
      value: `${currentValues.fat}%`,
      range: `${currentValues.fat - 5}–${currentValues.fat + 5}%`,
    },
    {
      label: "CARBS",
      image: "Carbs1.png",
      value: `${currentValues.carbs}%`,
      range: `${currentValues.carbs - 5}–${currentValues.carbs + 5}%`,
    },
    {
      label: "suger",
      image: "Sugar.png",
      value: result?.tech_Sugar || 0,
    },
    {
      label: "s_f",
      image: "stand_fat.png",
      value: result?.tech_stand_fat || 0,
    },
  ];

  // chart js

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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["age_year"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_age"
                    id="tech_age"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_age}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["gender"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_gender"
                    id="tech_gender"
                    value={formData.tech_gender}
                    onChange={handleChange}
                  >
                    <option value="Male">
                      {data?.payload?.tech_lang_keys["male"]}{" "}
                    </option>
                    <option value="Female">
                      {data?.payload?.tech_lang_keys["female"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              <input
                type="hidden"
                step="any"
                name="tech_unit_ft_in"
                id="tech_unit_ft_in"
                className="input my-2"
                aria-label="input"
                value={formData.tech_unit_ft_in}
                onChange={handleChange}
              />

              {formData.tech_unit_ft_in == "ft/in" && (
                <>
                  <div className="col-span-6 ft_in mr-2 ">
                    <label htmlFor="tech_height_ft" className="label">
                      {data?.payload?.tech_lang_keys["height"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_height_ft"
                        id="tech_height_ft"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_height_ft}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-span-6 ft_in mr-2 mt-1">
                    <label htmlFor="tech_height_in" className="label">
                      &nbsp;
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height_in"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_height_in}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_unit_h} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            { label: "centimeters (cm)", value: "cm" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {formData.tech_unit_ft_in == "cm" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 w-full  h_cm">
                    <label htmlFor="tech_height_cm" className="label">
                      {data?.payload?.tech_lang_keys["height"]} (cm):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height_cm"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_height_cm}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_unit_h_cm} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            { label: "centimeters (cm)", value: "cm" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler1(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-12 md:col-span-6 lg:col-span-6  h_cm">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["weight"]}:
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_weight"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_weight}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "kilograms (kg)", value: "cm" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler2(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_meal" className="label">
                  {data?.payload?.tech_lang_keys["meal"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_meal"
                    id="tech_meal"
                    value={formData.tech_meal}
                    onChange={handleChange}
                  >
                    <option value="all">
                      {data?.payload?.tech_lang_keys["all"]}{" "}
                    </option>
                    <option value="3">3 </option>
                    <option value="4">4 </option>
                    <option value="5">5 </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_goal" className="label">
                  {data?.payload?.tech_lang_keys["Your_goal"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_goal"
                    id="tech_goal"
                    value={formData.tech_goal}
                    onChange={handleChange}
                  >
                    <option value="Maintain">
                      {data?.payload?.tech_lang_keys["main"]}{" "}
                    </option>
                    <option value="Fat Loss">
                      {data?.payload?.tech_lang_keys["loss_20"]}{" "}
                    </option>
                    <option value="Loss 10%">
                      {data?.payload?.tech_lang_keys["loss_10"]}{" "}
                    </option>
                    <option value="Muscle Gain">
                      {data?.payload?.tech_lang_keys["gain"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_activity" className="label">
                  {data?.payload?.tech_lang_keys["activity"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_activity"
                    id="tech_activity"
                    value={formData.tech_activity}
                    onChange={handleChange}
                  >
                    <option value="Sedentary">
                      {data?.payload?.tech_lang_keys["a1"]}{" "}
                    </option>
                    <option value="Lightly Active">
                      {data?.payload?.tech_lang_keys["a2"]}{" "}
                    </option>
                    <option value="Moderately Active">
                      {data?.payload?.tech_lang_keys["a3"]}{" "}
                    </option>
                    <option value="Very Active">
                      {data?.payload?.tech_lang_keys["a4"]}{" "}
                    </option>
                    <option value="Extremely Active">
                      {data?.payload?.tech_lang_keys["a5"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_formula" className="label">
                  {data?.payload?.tech_lang_keys["formula"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_formula"
                    id="tech_formula"
                    value={formData.tech_formula}
                    onChange={handleChange}
                  >
                    <option value="2nd">
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                    <option value="first">
                      {data?.payload?.tech_lang_keys["10"]}{" "}
                    </option>
                    <option value="3rd">
                      {data?.payload?.tech_lang_keys["11"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_formula == "3rd" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 percent ">
                    <label htmlFor="tech_percent" className="label">
                      {data?.payload?.tech_lang_keys["b_f"]}{" "}
                      <a
                        title="Body Fat Percentage Calculator"
                        href="/body-fat-percentage-calculator"
                        className="text-blue font-s-12"
                        target="_blank"
                        rel="noopener"
                      >
                        {" "}
                        {data?.payload?.tech_lang_keys["click"]}
                      </a>
                      :
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_percent"
                        id="tech_percent"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_percent}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
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
                    <div className="w-full bg-light-blue result p-3 rounded-lg mt-3">
                      <div className="w-full">
                        <div className="w-full">
                          {/* Tabs */}
                          <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1 tabs">
                            {[
                              { key: "bal", label: "bal" },
                              { key: "low_fat", label: "low_fat" },
                              { key: "low_carb", label: "low_carb" },
                              { key: "high_pro", label: "high_pro" },
                              { key: "own", label: "own" },
                            ].map((tab) => (
                              <div
                                key={tab.key}
                                className="lg:w-1/5 w-full px-2 py-1"
                                onClick={() => setActiveTab(tab.key)}
                              >
                                <div
                                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white ${
                                    activeTab === tab.key ? "bg-blue-200" : ""
                                  }`}
                                >
                                  {data?.payload?.tech_lang_keys[tab.label]}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* 🔹 Own Slider (if own tab selected) */}
                          {activeTab === "own" && (
                            <div className="w-full">
                              <div className="grid grid-cols-12 gap-2 mt-3">
                                {["protein", "fat", "carbs"].map((key) => (
                                  <div
                                    key={key}
                                    className="col-span-12 md:col-span-4 lg:col-span-4"
                                  >
                                    <fieldset className="rounded-[10px]">
                                      <legend className="text-blue-700 px-1">
                                        {
                                          data?.payload?.tech_lang_keys[
                                            key.toUpperCase()
                                          ]
                                        }
                                      </legend>
                                      <input
                                        type="range"
                                        min={
                                          key === "protein"
                                            ? 10
                                            : key === "fat"
                                            ? 20
                                            : 45
                                        }
                                        max={
                                          key === "protein"
                                            ? 35
                                            : key === "fat"
                                            ? 35
                                            : 65
                                        }
                                        value={ownValues[key]}
                                        onChange={(e) =>
                                          handleSliderChange(
                                            key,
                                            e.target.value
                                          )
                                        }
                                        className="w-full"
                                      />
                                    </fieldset>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Result UI */}
                          <p className="w-full mt-3 mb-1">
                            {data?.payload?.tech_lang_keys["before_res"]}
                          </p>
                          <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                            <div className="col-span-12 md:col-span-9 lg:col-span-9">
                              <div className="flex flex-wrap items-center justify-between relative bg-sky bordered rounded px-3 pb-2 mt-3">
                                <div className="flex items-center px-3 mt-2">
                                  <img
                                    src="/images/calories1.png"
                                    alt="Calories"
                                    width="60"
                                    height="60"
                                  />
                                  <strong className="text-blue text-lg ms-2">
                                    {data?.payload?.tech_lang_keys["CALORIES"]}
                                  </strong>
                                </div>
                                <div className="px-3 mt-2">
                                  <div className="text-[32px] text-[#908310] font-bold">
                                    {result?.tech_calories || 0}
                                  </div>
                                  <div>
                                    {formData?.tech_meal === "all"
                                      ? data?.payload?.tech_lang_keys[
                                          "C_per_day"
                                        ]
                                      : data?.payload?.tech_lang_keys["cpm"]}
                                  </div>
                                </div>
                                <div className="overflow-auto px-3 mt-2">
                                  <table className="w-full text-sm">
                                    <tbody>
                                      <tr>
                                        <td className="border-b py-2 text-[#166fa5]">
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "PROTEIN"
                                            ]
                                          }
                                        </td>
                                        <td className="border-b ps-5">
                                          {currentValues.protein}%
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2 text-[#299fce]">
                                          {data?.payload?.tech_lang_keys["FAT"]}
                                        </td>
                                        <td className="border-b ps-5">
                                          {currentValues.fat}%
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="py-2 text-[#64d3ff]">
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "CARBS"
                                            ]
                                          }
                                        </td>
                                        <td className="ps-5">
                                          {currentValues.carbs}%
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-12 md:col-span-3 lg:col-span-3">
                              <div className="bg-white bordered rounded-full overflow-hidden">
                                <Doughnut data={datachart} options={options} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["after_res"]}
                        </p>
                        <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                          {displayData.map((item) => (
                            <div
                              key={item.label}
                              className="col-span-12 md:col-span-6 lg:col-span-6"
                            >
                              <div className="flex items-center justify-between bg-sky bordered rounded-lg p-3">
                                <div className="flex items-center">
                                  <img
                                    src={`/images/${item.image}`}
                                    alt={item.label}
                                    width="60"
                                    height="60"
                                  />
                                  <div className="ms-2 font-bold text-blue text-lg">
                                    {data?.payload?.tech_lang_keys[item.label]}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-blue text-xl font-bold">
                                    {item.value}
                                  </div>
                                  <div className="text-xs">
                                    {formData?.tech_meal === "all"
                                      ? data?.payload?.tech_lang_keys[
                                          "grams_per_day"
                                        ]
                                      : data?.payload?.tech_lang_keys["gpm"]}
                                  </div>
                                  {item.range && (
                                    <div className="text-xs text-gray">
                                      {data?.payload?.tech_lang_keys["range"]}{" "}
                                      {item.range}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
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

export default MacroCalculator;

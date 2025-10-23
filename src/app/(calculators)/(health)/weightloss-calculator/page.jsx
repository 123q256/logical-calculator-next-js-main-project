"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useWeightLossCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WeightLossCalculator = () => {
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
    tech_gender: "Male", // lbs  kg
    tech_age: "25",
    tech_height_ft: "5",
    tech_height_in: "8",
    tech_height_cm: "175.26",
    tech_hightUnit: "ft/in",
    tech_weight: "158",
    tech_lose_w: "130",
    tech_lose_unit: "lbs",
    tech_activity: "0.2",
    tech_unit: "lbs",
    tech_select_type: "target_date",
    tech_by_target: "",
    tech_by_calories: "5",
    tech_by_pace: "relaxed",

    tech_unit_ft_in: "ft/in",
    tech_unit_h: "ft/in",
    tech_unit_h_cm: "ft/in",
    tech_choose: "by_date",
    tech_start: "2025-04-28",
    tech_target: "2025-07-27",
    tech_enter_calories: "11",
    time_duration: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWeightLossCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_gender || !formData.tech_age) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_gender: formData.tech_gender,
        tech_age: formData.tech_age,
        tech_height_ft: formData.tech_height_ft,
        tech_height_in: formData.tech_height_in,
        tech_height_cm: formData.tech_height_cm,
        tech_hightUnit: formData.tech_hightUnit,
        tech_weight: formData.tech_weight,
        tech_lose_w: formData.tech_lose_w,
        tech_lose_unit: formData.tech_lose_unit,
        tech_activity: formData.tech_activity,
        tech_unit: formData.tech_unit,
        tech_select_type: formData.tech_select_type,
        tech_by_target: formData.tech_by_target,
        tech_by_calories: formData.tech_by_calories,
        tech_by_pace: formData.tech_by_pace,

        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_unit_h: formData.tech_unit_h,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_choose: formData.tech_choose,
        tech_start: formData.tech_start,
        tech_target: formData.tech_target,
        tech_enter_calories: formData.tech_enter_calories,
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
      tech_gender: "Male", // lbs  kg
      tech_age: "25",
      tech_height_ft: "5",
      tech_height_in: "8",
      tech_height_cm: "175.26",
      tech_hightUnit: "ft/in",
      tech_weight: "158",
      tech_lose_w: "130",
      tech_lose_unit: "lbs",
      tech_activity: "0.2",
      tech_unit: "lbs",
      tech_select_type: "target_date",
      tech_by_target: "",
      tech_by_calories: "5",
      tech_by_pace: "relaxed",

      tech_unit_ft_in: "ft/in",
      tech_unit_h: "ft/in",
      tech_unit_h_cm: "ft/in",
      tech_choose: "by_date",
      tech_start: "2025-04-28",
      tech_target: "2025-07-27",
      tech_enter_calories: "11",
      time_duration: "4",
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

  // result

  const submitUnit = result?.tech_submit === "lbs" ? "lbs" : "kg";

  const calories = result?.tech_Calories || 0;

  const getCalorieReduction = (type) => {
    if (submit === "lbs") {
      return type === "mild" ? 250 : type === "normal" ? 500 : 1000;
    } else {
      const perKg = 7700;
      if (type === "mild") return Math.round((perKg * 0.25) / 7);
      if (type === "normal") return Math.round((perKg * 0.5) / 7);
      return Math.round(perKg / 7);
    }
  };

  const formatNumber = (num) => num.toLocaleString();

  // chart js

  // Initialize currentWeight safely
  let currentWeight = Number(result?.tech_currentWeight);
  if (isNaN(currentWeight)) currentWeight = 0;

  // Pounds to lose daily
  let poundsDaily = Number(result?.tech_PoundsDaily);
  if (isNaN(poundsDaily)) poundsDaily = 0;

  // Number of days
  let days = Number(result?.tech_days);
  if (isNaN(days) || days <= 0) days = 0;

  // Generate date labels
  const today = new Date();
  const labels = Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i + 1);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  });

  // Generate weight data points
  const dataPoints = Array.from({ length: days }, () => {
    const w = Number(currentWeight.toFixed(2));
    currentWeight -= poundsDaily;
    return w;
  });

  //   // Generate date labels (e.g., "15 May", "16 May", ...)
  //   const today = new Date();
  //   const labels = Array.from({ length: result?.tech_days }, (_, i) => {
  //     const date = new Date(today);
  //     date.setDate(date.getDate() + i + 1);
  //     return date.toLocaleDateString('en-GB', {
  //       day: '2-digit',
  //       month: 'short',
  //     });
  //   });

  //   // Generate weight data points
  // const dataPoints = Array.from({ length: Number(result?.tech_days) || 0 }, () => {
  //   const w = Number(result?.tech_currentWeight.toFixed(2));
  //   currentWeight -= result?.tech_PoundsDaily;
  //   return w;
  // });

  // Chart data
  const datachart = {
    labels,
    datasets: [
      {
        label: `Weight (${result?.tech_submit})`,
        data: dataPoints,
        fill: false,
        borderColor: "#1E90FF",
        tension: 0.4,
        pointBackgroundColor: "#1E90FF",
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: `Weight (${result?.tech_submit})`,
        },
        ticks: {
          callback: function (value) {
            return value + result?.tech_submit;
          },
        },
      },
    },
    elements: {
      line: {
        borderColor: "rgba(0, 123, 255, 0.6)",
        borderWidth: 2,
      },
      point: {
        radius: 3,
        backgroundColor: "rgba(0, 123, 255, 0.8)",
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.parsed.y} ${result?.tech_submit}`;
          },
        },
      },
      datalabels: {
        display: false, // ✅ THIS hides text on points
      },
    },
  };

  // Convert PHP date logic to JS date logic:
  // Add detail.days to current date and format as 'dd-MMM-yyyy'
  const getNewDate = () => {
    if (!result?.tech_days) return "";
    const date = new Date();
    date.setDate(date.getDate() + Number(result.tech_dtech_ays));
    // Format date like '15-May-2025'
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options).replace(/ /g, "-") + ".";
  };

  // Helper function to get the "you_are" description key from tech_lang_keys based on you_are value
  const getYouAreText = () => {
    switch (result?.tech_you_are) {
      case "Underweight":
        return data?.payload?.tech_lang_keys[127];
      case "Normal Weight":
        return data?.payload?.tech_lang_keys[128];
      case "Overweight":
        return data?.payload?.tech_lang_keys[129];
      case "Obesity":
        return data?.payload?.tech_lang_keys[130];
      case "Severe Obesity":
        return data?.payload?.tech_lang_keys[131];
      default:
        return "";
    }
  };

  // Render IBW unit based on unit_type
  const renderIBWUnit = () => {
    return formData?.tech_unit_type === "lbs" ? "lbs" : "kg";
  };

  const isFromDayOrPace =
    result?.tech_from === "from_day" || result?.tech_from === "from_pace";

  // Define all possible duration arrays
  const calorieArrays = [
    {
      key: "pandran",
      dataKey: "tech_diff_array_pandran",
      finalKey: "tech_final_array_pandran",
    },
    {
      key: "adha",
      dataKey: "tech_diff_array_adha",
      finalKey: "tech_final_array_adha",
    },
    {
      key: "pona",
      dataKey: "tech_diff_array_pona",
      finalKey: "tech_final_array_pona",
    },
    { key: "hour", dataKey: "tech_diff_array", finalKey: "tech_final_array" },
    {
      key: "sawa",
      dataKey: "tech_diff_array_sawa",
      finalKey: "tech_final_array_sawa",
    },
    {
      key: "dher",
      dataKey: "tech_diff_array_dher",
      finalKey: "tech_final_array_dher",
    },
    {
      key: "pone",
      dataKey: "tech_diff_array_pone",
      finalKey: "tech_final_array_pone",
    },
    {
      key: "do",
      dataKey: "tech_diff_array_do",
      finalKey: "tech_final_array_do",
    },
  ];

  // Initial selected value (default = hour = "4")
  const [selectedValue, setSelectedValue] = useState("4");

  // Map keys to selected dropdown values
  const getDurationValueByKey = (key) => {
    const keyMap = {
      pandran: "1",
      adha: "2",
      pona: "3",
      hour: "4",
      sawa: "5",
      dher: "6",
      pone: "7",
      do: "8",
    };
    return keyMap[key];
  };

  // Convert backend string into values
  const parseValue = (value) => {
    const [cal_ans, name_ans, img_ans] = value.split("@@");
    return { cal_ans, name_ans, img_ans };
  };

  // Handle dropdown change
  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
  };

  //dropdown states 1
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const setUnitHandler = (unit) => {
    setFormData((prev) => ({
      ...prev,

      tech_unit_h: "ft/in",
      tech_hightUnit: unit,
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
      tech_hightUnit: unit, // hidden input update hoga
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_lose_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  // At the top of your component (outside JSX):
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  return (
    <Calculator
      isLoading={isLoading}
      data={data}
      links={[
        { name: "Home", path: "/" },
        {
          name: data?.payload?.tech_cal_cat,
          path: "/category/Health",
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

          <div className="lg:w-[90%] md:w-[99%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12 px-2 pb-2">
                <span className="pe-3 font-s-14 text-blue">
                  {data?.payload?.tech_lang_keys["83"]}:
                </span>
                <label className="pe-2" htmlFor="Male">
                  <input
                    type="radio"
                    name="tech_gender"
                    value="Male"
                    id="Male"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_gender === "Male"}
                  />
                  <span>{data?.payload?.tech_lang_keys["44"]}</span>
                </label>
                <label className="pe-2" htmlFor="Female">
                  <input
                    type="radio"
                    name="tech_gender"
                    value="Female"
                    id="Female"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_gender === "Female"}
                  />
                  <span>{data?.payload?.tech_lang_keys["45"]}</span>
                </label>
              </div>
              <div className="col-span-12 md:col-span-6 px-2">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["46"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_age"
                    id="tech_age"
                    required
                    min="18"
                    max="150"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_age}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <input
                type="hidden"
                name="tech_hightUnit"
                id="tech_hightUnit"
                className="input my-2"
                value={formData.tech_hightUnit}
                onChange={handleChange}
              />
              {formData.tech_hightUnit == "ft/in" && (
                <>
                  <div className="col-span-6 md:col-span-2 ft_in">
                    <label htmlFor="tech_height_ft" className="label">
                      {data?.payload?.tech_lang_keys["height"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_height_ft"
                        id="tech_height_ft"
                        min="4"
                        max="7"
                        className="input my-2"
                        aria-label="input"
                        placeholder="ft"
                        value={formData.tech_height_ft}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-4 px-2 ft_in">
                    <label htmlFor="tech_height_in" className="label">
                      {" "}
                      &nbsp;
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height_in"
                        step="any"
                        className="mt-2 input"
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
                            { label: "feet/inches (ft/in)", value: "ft/in" },
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
              {formData.tech_hightUnit == "cm" && (
                <>
                  <div className="col-span-12 md:col-span-6 px-2 h_cm {{ in_array($countryName,$metricCountries) ? 'hidden' : '' }}">
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
                            { label: "feet/inches (ft/in)", value: "ft/in" },
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
              <div className="md:col-span-6 col-span-12 px-2">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["weight"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_weight"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_weight}
                    placeholder="00"
                    min={formData.unit === "kg" ? 18 : 40}
                    max={formData.unit === "kg" ? 275 : 600}
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
                        { label: "kilograms (kg)", value: "kg" },
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
              <div className="md:col-span-6 col-span-12 px-2">
                <label htmlFor="tech_lose_w" className="label">
                  {data?.payload?.tech_lang_keys["49"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_lose_w"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_lose_w}
                    placeholder="00"
                    min={formData.unit === "kg" ? 18 : 40}
                    max={formData.unit === "kg" ? 275 : 600}
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_lose_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "kilograms (kg)", value: "kg" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler3(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-6 col-span-12 px-2">
                <label
                  htmlFor="tech_select_type"
                  className="label hidden md:block"
                >
                  {data?.payload?.tech_lang_keys["89"]}:{" "}
                </label>
                <label htmlFor="tech_select_type" className="label md:hidden">
                  Please select one{" "}
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_select_type"
                    id="tech_select_type"
                    value={formData.tech_select_type}
                    onChange={handleChange}
                  >
                    <option value="target_date">
                      {data?.payload?.tech_lang_keys["90"]}{" "}
                    </option>
                    <option value="custom_cal">
                      {data?.payload?.tech_lang_keys["92"]}{" "}
                    </option>
                    <option value="pace">
                      {data?.payload?.tech_lang_keys["94"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_select_type == "target_date" && (
                <>
                  <div
                    className="md:col-span-6 col-span-12 relative"
                    id="by_target_show"
                  >
                    <label htmlFor="tech_by_target" className="label">
                      {data?.payload?.tech_lang_keys["90"]}:
                      {/* <div className="relative group inline-block">
                                <img
                                  className="cursor-pointer mx-2"
                                  src="/images/calorie_deficit/info.png"
                                  alt="info"
                                  width="15"
                                />
                                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 z-10 w-48 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  {data?.payload?.tech_lang_keys[91]}
                                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 bg-gray-900 rotate-45"></div>
                                </div>
                              </div> */}
                    </label>

                    <div className="relative">
                      {/* <input
                              type="date"
                              name="tech_by_target"
                              id="tech_by_target"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_by_target}
                              onChange={handleChange}
                              required={formData?.tech_select_type === "pace"}
                            /> */}
                      <input
                        type="date"
                        name="tech_by_target"
                        id="tech_by_target"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_by_target || getTomorrowDate()}
                        onChange={handleChange}
                        required={formData?.tech_select_type === "pace"}
                        min={getTomorrowDate()} // Optional: prevent past date selection
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_select_type == "custom_cal" && (
                <>
                  <div
                    className="md:col-span-6 col-span-12 relative"
                    id="by_calories_show"
                  >
                    <label htmlFor="tech_by_calories" className="label">
                      {data?.payload?.tech_lang_keys["92"]}:
                      <div className="relative group inline-block">
                        <img
                          className="cursor-pointer mx-2"
                          src="/images/calorie_deficit/info.png"
                          alt="info"
                          width="15"
                        />
                        {/* Tooltip */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 z-10 w-48 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {data?.payload?.tech_lang_keys[93]}
                          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      </div>
                    </label>

                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min="1"
                        name="tech_by_calories"
                        id="tech_by_calories"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_by_calories}
                        onChange={handleChange}
                        required={formData?.tech_select_type === "custom_cal"}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_select_type == "pace" && (
                <>
                  <div
                    className="md:col-span-6 col-span-12 relative"
                    id="by_pace_show"
                  >
                    <label htmlFor="tech_activity" className="label">
                      {data?.payload?.tech_lang_keys["94"]}:
                      <div className="relative group inline-block">
                        <img
                          className="cursor-pointer mx-2"
                          src="/images/calorie_deficit/info.png"
                          alt="info"
                          width="15"
                        />
                        {/* Tooltip */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 z-10 w-48 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {data?.payload?.tech_lang_keys[95]}
                          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      </div>
                    </label>

                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_by_pace"
                        id="tech_by_pace"
                        value={formData.tech_by_pace}
                        onChange={handleChange}
                        required={formData?.tech_select_type === "pace"}
                      >
                        <option value="relaxed">
                          {data?.payload?.tech_lang_keys["76"]} : 0.25 kg (0.5
                          lb) / {data?.payload?.tech_lang_keys["96"]}
                        </option>
                        <option value="normal">
                          {data?.payload?.tech_lang_keys["78"]} : 0.5 kg (1.1
                          lb) / {data?.payload?.tech_lang_keys["96"]}
                        </option>
                        <option value="strict">
                          {data?.payload?.tech_lang_keys["79"]} : 1 kg (2.2 lb)
                          / {data?.payload?.tech_lang_keys["96"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              <div className="md:col-span-8 col-span-12 px-2">
                <label htmlFor="tech_activity" className="label">
                  {data?.payload?.tech_lang_keys["daily_activity"]}:
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
                    <option value="0.2">
                      {data?.payload?.tech_lang_keys["175"] ??
                        "No sport/exercise"}{" "}
                    </option>
                    <option value="0.375">
                      {data?.payload?.tech_lang_keys["176"] ??
                        "Light activity (sport 1-3 times per week)"}{" "}
                    </option>
                    <option value="0.55">
                      {data?.payload?.tech_lang_keys["177"] ??
                        "Moderate activity (sport 3-5 times per week)"}{" "}
                    </option>
                    <option value="0.725">
                      {data?.payload?.tech_lang_keys["178"] ??
                        "High activity (everyday exercise)"}{" "}
                    </option>
                    <option value="0.9">
                      {data?.payload?.tech_lang_keys["179"] ??
                        "Extreme activity (professional athlete)"}{" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            {data?.payload?.tech_lang_keys["190"] && (
              <div className="col-span-12 px-2 mt-3 font-s-12 hidden md:block">
                <p>
                  <strong>{data?.payload?.tech_lang_keys["189"]}:</strong>{" "}
                  {data?.payload?.tech_lang_keys["190"]}
                </p>
              </div>
            )}
            {data?.payload?.tech_lang_keys["191"] && (
              <div className="col-span-12 px-2 mt-3 font-s-12 md:hidden">
                <p>
                  <strong>{data?.payload?.tech_lang_keys["189"]}:</strong>{" "}
                  {data?.payload?.tech_lang_keys["191"]}
                </p>
              </div>
            )}
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
            <div className="col-span-12 custom-alert mt-3 " id="alertmsg">
              <p>
                <strong>Disclaimer</strong>: This weight loss date calculator
                provides estimated calories. Results may vary by individual
                factors. Consult a healthcare professional before making dietary
                or fitness changes.
              </p>
            </div>
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

                  {formData?.tech_select_type == "custom_cal" ? (
                    <div className="grid grid-cols-1 gap-4 m-3 p-3">
                      <div className="bg-sky bordered rounded-lg px-4 py-3">
                        <p>
                          <strong className="text-blue border-b border-blue-500 text-lg">
                            {data?.payload?.tech_lang_keys[102]}
                          </strong>
                        </p>
                        <p className="text-sm mt-2">
                          {data?.payload?.tech_lang_keys[137]}{" "}
                          <strong>
                            {new Date(
                              Date.now() + result?.tech_days * 86400000
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </strong>
                        </p>
                        <p className="text-center text-lg my-2">
                          <strong className="text-orange-500 md:text-[40px] text-[25px]">
                            {result?.tech_CaloriesDaily}
                          </strong>{" "}
                          <strong className="text-blue-600">
                            {data?.payload?.tech_lang_keys[103]}
                          </strong>
                        </p>
                        <p className="text-sm mt-2">
                          {data?.payload?.tech_lang_keys[143]}{" "}
                          <strong>{result?.tech_CaloriesDaily}</strong>{" "}
                          {data?.payload?.tech_lang_keys[144]}{" "}
                          <strong>{result?.tech_CaloriesDaily * 7}</strong>{" "}
                          {data?.payload?.tech_lang_keys[145]}.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                      <div className="bordered bg-sky rounded-lg p-4 flex flex-col justify-between">
                        <div>
                          <p>
                            <strong className="text-blue border-b border-blue-500 text-lg">
                              {data?.payload?.tech_lang_keys[102]}
                            </strong>
                          </p>
                          <p className="text-sm mt-2">
                            {data?.payload?.tech_lang_keys[137]}{" "}
                            <strong>
                              {new Date(
                                Date.now() + result?.tech_days * 86400000
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </strong>
                          </p>
                          <div className="text-center mt-2">
                            <p className="text-orange-500 text-[32px] font-semibold">
                              {result?.tech_CaloriesDaily?.toLocaleString()}
                            </p>
                            <p className="text-blue-600 text-sm font-medium">
                              {data?.payload?.tech_lang_keys[103]}
                            </p>
                          </div>
                          <p className="text-sm mt-2 hidden md:block">
                            {data?.payload?.tech_lang_keys[138]} (
                            <strong>
                              {result?.tech_Calories -
                                result?.tech_CaloriesDaily}
                            </strong>
                            ) {data?.payload?.tech_lang_keys[139]} (
                            <strong>{result?.tech_Calories}</strong>).
                          </p>
                        </div>
                      </div>

                      <div className="bordered bg-sky rounded-lg p-4 flex flex-col justify-between">
                        <div>
                          <p>
                            <strong className="text-blue border-b border-blue-500 text-lg">
                              {data?.payload?.tech_lang_keys[104]}
                            </strong>
                          </p>
                          <p className="text-sm mt-2">
                            {data?.payload?.tech_lang_keys[140]}
                          </p>
                          <div className="text-center mt-2">
                            <p className="text-orange-500 text-[32px] font-semibold">
                              {(
                                result?.tech_Calories -
                                result?.tech_CaloriesDaily
                              )?.toLocaleString()}
                            </p>
                            <p className="text-blue-600 text-sm font-medium">
                              {data?.payload?.tech_lang_keys[103]}
                            </p>
                            <p className="text-sm mt-2 hidden md:block">
                              {data?.payload?.tech_lang_keys[141]} (
                              <strong>{result?.tech_CaloriesDaily}</strong>){" "}
                              {data?.payload?.tech_lang_keys[142]} (
                              <strong>{result?.tech_Calories}</strong>).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {result?.tech_CaloriesDaily <= 1000 && (
                    <p className="text-sm mt-4 text-red-500 font-medium">
                      {data?.payload?.tech_lang_keys["169"]}
                    </p>
                  )}

                  <p className="mt-3 ps-0 lg:ps-2">
                    <strong className="text-blue border-b border-blue-500 text-lg">
                      {data?.payload?.tech_lang_keys[119]}
                    </strong>
                  </p>

                  <div className="col-12 bg-light-blue result md:p-3 mt-3">
                    <div className="w-full ">
                      <div className="bg-sky bordered rounded-lg px-3 py-2  overflow-auto mt-3">
                        <table className="w-full" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td className="border-bottom py-2">
                                Maintain weight
                              </td>
                              <td className="border-bottom py-2 text-end">
                                <strong className="font-s-18">
                                  {Number(result?.tech_Calories)}
                                </strong>
                                <span className="font-s-14">Calories/Day</span>
                              </td>
                            </tr>

                            <tr>
                              <td className="border-bottom py-2">
                                Mild Weight Loss
                                {result?.tech_submit === "lbs"
                                  ? "( 0.5 lb/week )"
                                  : "( 0.25 kg/week )"}
                              </td>
                              <td className="border-bottom py-2 text-end">
                                {(() => {
                                  const calorieReduction =
                                    result?.tech_submit === "lbs"
                                      ? 250
                                      : Math.round((7700 * 0.25) / 7);
                                  return (
                                    <>
                                      <strong className="font-s-18">
                                        {Number(
                                          result?.tech_Calories -
                                            calorieReduction
                                        )}
                                      </strong>
                                      <span className="font-s-14">
                                        Calories/Day
                                      </span>
                                    </>
                                  );
                                })()}
                              </td>
                            </tr>

                            <tr>
                              <td className="border-bottom py-2">
                                Weight Loss
                                {result?.tech_submit === "lbs"
                                  ? "( 1 lb/week )"
                                  : "( 0.5 kg/week )"}
                              </td>
                              <td className="border-bottom py-2 text-end">
                                {(() => {
                                  const calorieReduction =
                                    result?.tech_submit === "lbs"
                                      ? 500
                                      : Math.round((7700 * 0.5) / 7);
                                  return (
                                    <>
                                      <strong className="font-s-18">
                                        {Number(
                                          result?.tech_Calories -
                                            calorieReduction
                                        )}
                                      </strong>
                                      <span className="font-s-14">
                                        Calories/Day
                                      </span>
                                    </>
                                  );
                                })()}
                              </td>
                            </tr>

                            <tr>
                              <td className="py-2">
                                Extreme Weight Loss
                                {result?.tech_submit === "lbs"
                                  ? "( 2 lb/week )"
                                  : "( 1 kg/week )"}
                              </td>
                              <td className="py-2 text-end">
                                {(() => {
                                  const calorieReduction =
                                    result?.tech_submit === "lbs"
                                      ? 1000
                                      : Math.round(7700 / 7);
                                  return (
                                    <>
                                      <strong className="font-s-18">
                                        {Number(
                                          result?.tech_Calories -
                                            calorieReduction
                                        )}
                                      </strong>
                                      <span className="font-s-14">
                                        Calories/Day
                                      </span>
                                    </>
                                  );
                                })()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-3">
                        <p className="text-[18px] mb-3 ps-lg-3">
                          <strong className="text-blue border-b border-blue-500">
                            {data?.payload?.tech_lang_keys[132]}
                          </strong>
                        </p>
                        <div className="bg-[#ffffff] rounded-[10px] pb-2">
                          <div
                            style={{
                              width: "100%",
                              height: "370px",
                              marginTop: "15px",
                            }}
                          >
                            <Line data={datachart} options={options} />
                          </div>
                        </div>
                      </div>

                      <div className="col-12 mt-3">
                        <p className="ps-lg-3">
                          <strong className="text-blue border-b-blue font-s-18">
                            {data?.payload?.tech_lang_keys[146]}!
                          </strong>
                        </p>

                        <div className="bg-sky bordered rounded-lg p-3 mt-2">
                          <div className="row align-items-center">
                            <p className="col-md-6">
                              <strong className="text-blue">
                                {data?.payload?.tech_lang_keys[147]}
                              </strong>
                            </p>

                            <div className="col-md-6">
                              <div className="col-md-9 ms-auto">
                                <select
                                  name="time_duration"
                                  id="time_duration"
                                  className="input"
                                  value={selectedValue}
                                  onChange={handleSelectChange}
                                >
                                  <option value="1">
                                    15 {data?.payload?.tech_lang_keys[148]}
                                  </option>
                                  <option value="2">
                                    30 {data?.payload?.tech_lang_keys[148]}
                                  </option>
                                  <option value="3">
                                    45 {data?.payload?.tech_lang_keys[148]}
                                  </option>
                                  <option value="4">
                                    1 {data?.payload?.tech_lang_keys[149]}
                                  </option>
                                  <option value="5">
                                    1 {data?.payload?.tech_lang_keys[149]} 15{" "}
                                    {data?.payload?.tech_lang_keys[148]}
                                  </option>
                                  <option value="6">
                                    1 {data?.payload?.tech_lang_keys[149]} 30{" "}
                                    {data?.payload?.tech_lang_keys[148]}
                                  </option>
                                  <option value="7">
                                    1 {data?.payload?.tech_lang_keys[149]} 45{" "}
                                    {data?.payload?.tech_lang_keys[148]}
                                  </option>
                                  <option value="8">
                                    2 {data?.payload?.tech_lang_keys[149]}
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Render only one calorie block based on selected value */}
                          {calorieArrays.map(({ key, dataKey, finalKey }) => {
                            const diffArray = result?.[dataKey];
                            const finalArray = result?.[finalKey];
                            const visible =
                              selectedValue === getDurationValueByKey(key);

                            return visible ? (
                              <div
                                key={key}
                                className={`col-12 calories_${key} my-3`}
                              >
                                {diffArray?.length > 0 ? (
                                  <div
                                    className="col-12 overflow-auto"
                                    style={{ height: "300px" }}
                                  >
                                    <table className="col-12" cellSpacing="0">
                                      <tbody>
                                        {finalArray.map((value, index) => {
                                          const { cal_ans, name_ans } =
                                            parseValue(value);

                                          // Step 1: Remove parentheses content first
                                          let cleanName = name_ans
                                            ?.replace(/\(.*?\)/g, "")
                                            .trim();

                                          // Step 2: Then split before comma
                                          let firstPart = cleanName
                                            ?.split(",")[0]
                                            ?.trim();

                                          // Step 3: Clean special characters except space
                                          const cleanedPhrase =
                                            firstPart?.replace(/[^\w\s]/g, "");

                                          // Step 4: Remove spaces for image filename
                                          const imageName =
                                            cleanedPhrase?.replace(/\s+/g, "");

                                          return (
                                            <tr key={index}>
                                              <td className="col-span-10 border-b border-e py-3 pe-3 flex items-center">
                                                <img
                                                  src={`/images/res_icons/${imageName}.svg`}
                                                  alt={`${firstPart} icon`}
                                                  width="25"
                                                  height="25"
                                                  loading="lazy"
                                                  decoding="async"
                                                  className="me-2"
                                                  onError={(e) =>
                                                    (e.target.style.display =
                                                      "none")
                                                  }
                                                />
                                                {name_ans}
                                              </td>
                                              <td className="col-2 border-bottom py-3 px-3 pe-lg-0">
                                                <strong>{cal_ans}</strong> kcal
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <p>{data?.payload?.tech_lang_keys[150]}</p>
                                )}
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border border-gray-200 rounded-xl shadow-sm overflow-auto bg-white">
                    <table className="min-w-full text-sm text-gray-800">
                      <tbody className="divide-y divide-gray-200">
                        {/* BMR */}
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">BMR</td>
                          <td className="py-3 px-4 text-right">
                            <strong>{result?.tech_BMR}</strong>{" "}
                            <sub>{data?.payload?.tech_lang_keys[103]}</sub>
                          </td>
                        </tr>

                        {/* BMI */}
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">BMI</td>
                          <td className="py-3 px-4 text-right">
                            <strong>{result?.tech_BMI}</strong> <sub>kg/m²</sub>
                          </td>
                        </tr>

                        {/* IBW */}
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">IBW</td>
                          <td className="py-3 px-4 text-right">
                            <strong>{result?.tech_ibw}</strong>{" "}
                            <sub>
                              {formData?.tech_unit_type === "lbs"
                                ? "lbs"
                                : "kg"}
                            </sub>
                          </td>
                        </tr>

                        {/* You Are */}
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">
                            {data?.payload?.tech_lang_keys[125]}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <strong className="text-blue-600">
                              {result?.tech_you_are === "Underweight"
                                ? data?.payload?.tech_lang_keys[127]
                                : result?.tech_you_are === "Normal Weight"
                                ? data?.payload?.tech_lang_keys[128]
                                : result?.tech_you_are === "Overweight"
                                ? data?.payload?.tech_lang_keys[129]
                                : result?.tech_you_are === "Obesity"
                                ? data?.payload?.tech_lang_keys[130]
                                : result?.tech_you_are === "Severe Obesity"
                                ? data?.payload?.tech_lang_keys[131]
                                : ""}
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6">
                    <p className="mb-1 ps-0 lg:ps-3">
                      <strong className="text-blue-600 border-b-2 border-blue-400 text-lg">
                        Activity Level
                      </strong>
                    </p>
                    <p className="mb-4 ps-0 lg:ps-3 text-gray-700 text-sm leading-relaxed">
                      Besides cutting calories, amp up your activity! See a list
                      of estimated weight loss for different activity levels,
                      based on a daily intake of{" "}
                      <strong>{result?.tech_Calories}</strong> calories.
                    </p>

                    <div className="overflow-auto bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                      <table className="min-w-full text-left text-sm text-gray-700">
                        <thead className="bg-blue-100 text-blue-800 font-semibold">
                          <tr>
                            <th className="py-3 px-4">Activity Level</th>
                            <th className="py-3 px-4">Weight Lost / Week</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-100">
                          {[
                            ["No sport/exercise", result?.tech_activity_first],
                            [
                              "Light activity (1–3x/week)",
                              result?.tech_activity_second,
                            ],
                            [
                              "Moderate activity (3–5x/week)",
                              result?.tech_activity_third,
                            ],
                            [
                              "High activity (daily exercise)",
                              result?.tech_activity_four,
                            ],
                            [
                              "Extreme activity (athlete)",
                              result?.tech_activity_five,
                            ],
                          ].map(([label, value], index) => (
                            <tr
                              key={index}
                              className="hover:bg-blue-100 transition-colors duration-200"
                            >
                              <td className="py-3 px-4">{label}</td>
                              <td className="py-3 px-4 font-medium text-blue-700">
                                {value} {submitUnit}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

export default WeightLossCalculator;

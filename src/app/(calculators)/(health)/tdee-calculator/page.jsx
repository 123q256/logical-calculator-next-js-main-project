"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTDEECalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TDEECalculator = () => {
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
    tech_gender: "male", // lbs  kg
    tech_age: "25",
    tech_weight: "75",
    tech_unit: "kg",
    tech_activity: "Lightly Active",
    tech_percent: "",
    tech_hightUnit: "cm",

    tech_height_cm: "175.26",
    tech_unit_h_cm: "cm",

    tech_height_ft: "5",
    tech_height_in: "9",
    tech_unit_h: "cm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTDEECalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_gender) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_gender: formData.tech_gender,
        tech_age: formData.tech_age,
        tech_weight: formData.tech_weight,
        tech_unit: formData.tech_unit,
        tech_activity: formData.tech_activity,
        tech_percent: formData.tech_percent,
        tech_hightUnit: formData.tech_hightUnit,
        tech_height_cm: formData.tech_height_cm,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_height_ft: formData.tech_height_ft,
        tech_height_in: formData.tech_height_in,
        tech_unit_h: formData.tech_unit_h,
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
      tech_gender: "male", // lbs  kg
      tech_age: "25",
      tech_weight: "75",
      tech_unit: "kg",
      tech_activity: "Lightly Active",
      tech_percent: "",
      tech_hightUnit: "cm",

      tech_height_cm: "175.26",
      tech_unit_h_cm: "cm",

      tech_height_ft: "5",
      tech_height_in: "9",
      tech_unit_h: "cm",
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

  //dropdown states 3
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  // country
  const metricCountries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Pakistan",
  ];
  useEffect(() => {
    const countryName = formData.countryName || ""; // Set this from your user data
    const hightUnit =
      formData.tech_hightUnit ||
      (metricCountries.includes(countryName) ? "ft/in" : "cm");
    setFormData((prev) => ({
      ...prev,
      tech_hightUnit: hightUnit,
    }));
  }, [formData.countryName]); // Run again if country changes

  // country

  const bmiCategory = result?.tech_you_are;
  const getBMICategoryStyle = (category) => {
    switch (category) {
      case "Underweight":
        return "text-teal-600";
      case "Normal Weight":
        return "text-green-700";
      case "Overweight":
        return "text-yellow-600";
      case "Obesity":
        return "text-red-600";
      case "Severe Obesity":
        return "text-red-700";
      default:
        return "";
    }
  };

  // chart js one

  const [showPercentError, setShowPercentError] = useState(false);
  const [formula, setFormula] = useState("mifflin");
  const [bmr, setBmr] = useState(result?.tech_BMR || 0);
  const [tdee, setTdee] = useState(result?.tech_tdee || 0);
  const [weeklyCalories, setWeeklyCalories] = useState(
    (result?.tech_tdee || 0) * 7
  );
  const [formulaLabel, setFormulaLabel] = useState(
    data?.payload?.tech_lang_keys?.["66"] || ""
  );

  // Extract data (prefer formData, fallback to result)
  const age = Number(formData?.tech_age ?? result?.tech_age ?? 0);
  const gender = formData?.tech_gender ?? result?.tech_gender ?? "male";
  const activity =
    formData?.tech_activity ?? result?.tech_activity ?? "Sedentary";
  const percent = Number(formData?.tech_percent ?? result?.tech_percent ?? 0);
  const height_cm = Number(
    formData?.tech_height_cm ?? result?.tech_height_cm ?? 0
  );
  const weight = Number(formData?.tech_weight ?? result?.tech_weight ?? 0);

  const mildLossCalories = Math.round(tdee - tdee * 0.1);
  const lossCalories = Math.round(tdee - tdee * 0.2);
  const extremeLossCalories = Math.round(tdee - tdee * 0.39);

  const mildGainCalories = Math.round(tdee + tdee * 0.1);
  const gainCalories = Math.round(tdee + tdee * 0.2);
  const extremeGainCalories = Math.round(tdee + tdee * 0.39);

  // Chart data state
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Chart options
  const chartOptions = {
    responsive: true,
    cutout: "50%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 14 },
          color: "#000", // ✅ Set legend label color to black
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed}%`,
        },
      },
    },
  };

  // Update BMR, TDEE, weeklyCalories, formulaLabel on formula or percent or inputs change
  useEffect(() => {
    const newBmr = calculateBMR();
    const newTdee = calculateTDEE(newBmr);

    setBmr(newBmr);
    setTdee(newTdee);
    setWeeklyCalories(newTdee * 7);
    setFormulaLabel(getFormulaLabel(formula));
  }, [formula, percent, age, gender, activity, weight, height_cm]);

  // Update chart data when BMR or TDEE changes
  useEffect(() => {
    if (bmr > 0 && tdee > 0) {
      const TEF = tdee * 0.1; // Thermic Effect of Food
      const physicalActivity = tdee - (TEF + bmr);
      const total = bmr + TEF + physicalActivity;

      setChartData({
        labels: [
          `BMR (${
            data?.payload?.tech_lang_keys?.["bmr"] || "Basal Metabolic Rate"
          })`,
          `${
            data?.payload?.tech_lang_keys?.["81"] || "Physical Activity"
          } (EAT + NEAT)`,
          `TEF (${
            data?.payload?.tech_lang_keys?.["82"] || "Thermic Effect of Food"
          })`,
        ],
        datasets: [
          {
            data: [
              ((bmr / total) * 100).toFixed(1),
              ((physicalActivity / total) * 100).toFixed(1),
              ((TEF / total) * 100).toFixed(1),
            ],
            backgroundColor: ["#278ECD", "#1670A7", "#4CBAFD"],
            borderWidth: 1,
          },
        ],
      });
    } else {
      // Clear chart if data not valid
      setChartData({ labels: [], datasets: [] });
    }
  }, [bmr, tdee, data]);

  // Update DOM

  // Calculate BMR
  const calculateBMR = () => {
    if (formula === "katch") {
      if (percent > 0) {
        setShowPercentError(false);
        return 370 + 21.6 * (1 - percent / 100) * weight;
      } else {
        setShowPercentError(true);
        return 0;
      }
    }
    setShowPercentError(false);
    if (gender === "female") {
      return formula === "revised"
        ? 9.247 * weight + 3.098 * height_cm - 4.33 * age + 447.593
        : 10 * weight + 6.25 * height_cm - 5 * age - 161;
    } else {
      return formula === "revised"
        ? 13.397 * weight + 4.799 * height_cm - 5.677 * age + 88.362
        : 10 * weight + 6.25 * height_cm - 5 * age + 5;
    }
  };

  // Calculate TDEE based on activity multiplier
  const calculateTDEE = (bmrVal) => {
    let multiplier = 1.2;
    if (activity === "Lightly Active") multiplier = 1.375;
    else if (activity === "Moderately Active") multiplier = 1.55;
    else if (activity === "Very Active") multiplier = 1.725;
    else if (activity === "Extremely Active") multiplier = 1.9;
    return Math.round(bmrVal * multiplier);
  };

  // Get label for formula
  const getFormulaLabel = (key) => {
    if (key === "katch")
      return data?.payload?.tech_lang_keys?.["68"] || "Katch-McArdle";
    if (key === "revised")
      return data?.payload?.tech_lang_keys?.["67"] || "Revised Harris-Benedict";
    return data?.payload?.tech_lang_keys?.["66"] || "Mifflin-St Jeor";
  };

  // chart js  three ka data

  const [activeTab, setActiveTab] = useState("maintenance");
  const calories = result?.tech_calories || 0;
  // Helper to format grams
  const grams = (num) => `${Math.round(num)} g`;

  const c = calories;
  const cutCal = c - 500;
  const bulkCal = c + 500;

  // Macro calculations for all tabs
  const macros = {
    maintenance: {
      mod_pro: grams((30 * c) / 100 / 4),
      mod_fat: grams((35 * c) / 100 / 9),
      mod_carb: grams((35 * c) / 100 / 4),
      low_pro: grams((40 * c) / 100 / 4),
      low_fat: grams((40 * c) / 100 / 9),
      low_carb: grams((20 * c) / 100 / 4),
      high_pro: grams((30 * c) / 100 / 4),
      high_fat: grams((20 * c) / 100 / 9),
      high_carb: grams((50 * c) / 100 / 4),
    },
    cutting: {
      mod_pro: grams((30 * cutCal) / 100 / 4),
      mod_fat: grams((35 * cutCal) / 100 / 9),
      mod_carb: grams((35 * cutCal) / 100 / 4),
      low_pro: grams((40 * cutCal) / 100 / 4),
      low_fat: grams((40 * cutCal) / 100 / 9),
      low_carb: grams((20 * cutCal) / 100 / 4),
      high_pro: grams((30 * cutCal) / 100 / 4),
      high_fat: grams((20 * cutCal) / 100 / 9),
      high_carb: grams((50 * cutCal) / 100 / 4),
    },
    bulking: {
      mod_pro: grams((30 * bulkCal) / 100 / 4),
      mod_fat: grams((35 * bulkCal) / 100 / 9),
      mod_carb: grams((35 * bulkCal) / 100 / 4),
      low_pro: grams((40 * bulkCal) / 100 / 4),
      low_fat: grams((40 * bulkCal) / 100 / 9),
      low_carb: grams((20 * bulkCal) / 100 / 4),
      high_pro: grams((30 * bulkCal) / 100 / 4),
      high_fat: grams((20 * bulkCal) / 100 / 9),
      high_carb: grams((50 * bulkCal) / 100 / 4),
    },
  };
  // Chart data for each tab
  const calcGram = (percent, cal, calPerGram) =>
    cal > 0 ? Math.round((percent * cal) / 100 / calPerGram) : 0;

  const chartData2 = {
    maintenance: {
      labels: [
        data?.payload?.tech_lang_keys["pro"],
        data?.payload?.tech_lang_keys["fat"],
        data?.payload?.tech_lang_keys["carb"],
      ],
      datasets: [
        {
          data: [
            calcGram(30, calories, 4),
            calcGram(35, calories, 9),
            calcGram(35, calories, 4),
          ],
          backgroundColor: ["#3B82F6", "#8B5CF6", "#F43F5E"],
        },
      ],
    },

    cutting: {
      labels: [
        data?.payload?.tech_lang_keys["pro"],
        data?.payload?.tech_lang_keys["fat"],
        data?.payload?.tech_lang_keys["carb"],
      ],
      datasets: [
        {
          data: [
            calcGram(40, calories - 500, 4),
            calcGram(40, calories - 500, 9),
            calcGram(20, calories - 500, 4),
          ],
          backgroundColor: ["#3B82F6", "#8B5CF6", "#F43F5E"],
        },
      ],
    },
    bulking: {
      labels: [
        data?.payload?.tech_lang_keys["pro"],
        data?.payload?.tech_lang_keys["fat"],
        data?.payload?.tech_lang_keys["carb"],
      ],
      datasets: [
        {
          data: [
            calcGram(30, calories + 500, 4),
            calcGram(20, calories + 500, 9),
            calcGram(50, calories + 500, 4),
          ],
          backgroundColor: ["#3B82F6", "#8B5CF6", "#F43F5E"],
        },
      ],
    },
  };
  // Chart options (same for all)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 14 },
          color: "#000", // Legend text color white
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed} g`;
          },
        },
        titleColor: "white", // Tooltip title color white
        bodyColor: "white", // Tooltip body text color white
        backgroundColor: "rgba(0,0,0,0.7)", // Optional: tooltip bg color for contrast
      },
      datalabels: {
        display: true,
        color: "white", // Text color white
        font: {
          weight: "bold",
          size: 8,
        },
      },
    },
    cutout: "70%",
  };

  // Render macros based on activeTab
  const m = macros[activeTab];
  const [customPro, setCustomPro] = useState(25);
  const [customFat, setCustomFat] = useState(28);
  const [customCarb, setCustomCarb] = useState(47);
  const calcGrams = (percent, cal, perGram) =>
    cal > 0 ? Math.round((percent * cal) / 100 / perGram) : 0;
  const updateMacro = (name, value) => {
    value = Number(value);
    let remaining = 100 - value;

    if (name === "protein") {
      const totalOld = customFat + customCarb;
      const newFat = Math.round((customFat / totalOld) * remaining);
      const newCarb = remaining - newFat;
      setCustomPro(value);
      setCustomFat(newFat);
      setCustomCarb(newCarb);
    } else if (name === "fat") {
      const totalOld = customPro + customCarb;
      const newPro = Math.round((customPro / totalOld) * remaining);
      const newCarb = remaining - newPro;
      setCustomFat(value);
      setCustomPro(newPro);
      setCustomCarb(newCarb);
    } else if (name === "carb") {
      const totalOld = customPro + customFat;
      const newPro = Math.round((customPro / totalOld) * remaining);
      const newFat = remaining - newPro;
      setCustomCarb(value);
      setCustomPro(newPro);
      setCustomFat(newFat);
    }
  };
  const customData = {
    labels: ["Protein", "Fat", "Carbs"],
    datasets: [
      {
        data: [
          calcGrams(customPro, calories, 4),
          calcGrams(customFat, calories, 9),
          calcGrams(customCarb, calories, 4),
        ],
        backgroundColor: ["#3B82F6", "#8B5CF6", "#F43F5E"],
        borderColor: "#fff", // segment borders ka color
        borderWidth: 1, // border thickness badhayein (default 1)
      },
    ],
  };
  const tabs = [
    {
      key: "maintenance",
      label: data?.payload?.tech_lang_keys["m1"],
      caloriesValue: result?.tech_calories || 0,
      datasBefore: data?.payload?.tech_lang_keys["m1_des"] || "",
      datasAfter: data?.payload?.tech_lang_keys["m1_des1"] || "",
    },
    {
      key: "cutting",
      label: data?.payload?.tech_lang_keys["m2"],
      caloriesValue: calories - 500,
      datasBefore: data?.payload?.tech_lang_keys["m2_des"] || "",
      datasAfter: data?.payload?.tech_lang_keys["m2_des1"] || "",
    },
    {
      key: "bulking",
      label: data?.payload?.tech_lang_keys["m3"],
      caloriesValue: calories + 500,
      datasBefore: data?.payload?.tech_lang_keys["m3_des"] || "",
      datasAfter: data?.payload?.tech_lang_keys["m3_des1"] || "",
    },
    {
      key: "custom",
      label: data?.payload?.tech_lang_keys[53],
      caloriesValue: calories,
      datasBefore: data?.payload?.tech_lang_keys["custom_des"] || "",
      datasAfter: data?.payload?.tech_lang_keys["custom_des1"] || "",
    },
  ];

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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label className="pe-2" htmlFor="male">
                  <input
                    type="radio"
                    name="tech_gender"
                    value="male"
                    id="male"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_gender === "male"}
                  />
                  <span>{data?.payload?.tech_lang_keys["1"]}</span>
                </label>
                <label className="pe-2" htmlFor="female">
                  <input
                    type="radio"
                    name="tech_gender"
                    value="female"
                    id="female"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_gender === "female"}
                  />
                  <span>{data?.payload?.tech_lang_keys["female"]}</span>
                </label>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["age_year"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    min="18"
                    max="130"
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
                    min={formData.tech_unit == "kg" ? 18 : 40}
                    max={formData.tech_unit == "kg" ? 275 : 600}
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
                        {
                          label: data?.payload?.tech_lang_keys["60"] + " (lbs)",
                          value: "lbs",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["61"] + " (kg)",
                          value: "cm",
                        },
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
                  <div className="md:col-span-6 col-span-12 ft_in mr-2 ">
                    <label htmlFor="tech_height_ft" className="label">
                      {data?.payload?.tech_lang_keys["height"]}:111
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        min="4"
                        max="7"
                        name="tech_height_ft"
                        id="tech_height_ft"
                        className="input my-2"
                        aria-label="input"
                        placeholder="ft"
                        value={formData.tech_height_ft}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-6 col-span-12  ft_in mr-2 mt-1">
                    <label htmlFor="tech_height_in" className="label">
                      &nbsp;
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height_in"
                        step="any"
                        max="11"
                        min="0"
                        className="mt-1 input"
                        value={formData.tech_height_in}
                        placeholder="in"
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
              {formData.tech_hightUnit == "cm" && (
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
                        min="90"
                        max="245"
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
                            {
                              label:
                                data?.payload?.tech_lang_keys["62"] +
                                " (ft/in)",
                              value: "ft/in",
                            },
                            {
                              label:
                                data?.payload?.tech_lang_keys["63"] + "(cm)",
                              value: "cm",
                            },
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
                      {data?.payload?.tech_lang_keys["64"]}{" "}
                    </option>
                    <option value="Lightly Active">
                      {data?.payload?.tech_lang_keys["Lightly"]}{" "}
                    </option>
                    <option value="Moderately Active">
                      {data?.payload?.tech_lang_keys["Moderately"]}{" "}
                    </option>
                    <option value="Very Active">
                      {data?.payload?.tech_lang_keys["Very"]}{" "}
                    </option>
                    <option value="Extremely Active">
                      {data?.payload?.tech_lang_keys["Extremely"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
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
                {showPercentError && (
                  <p className="text-sm text-end  px-1 text-red-500">
                    {data?.payload?.tech_lang_keys["69"]}
                  </p>
                )}
              </div>
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
            <div className="col-span-12 px-2 mt-3 text-[14px]">
              <p>
                <strong>Disclaimer:</strong> The TDEE calculator gives estimates
                using the Mifflin-St Jeor equation. These results are for
                informational purposes only. Consult a healthcare professional
                before making dietary or fitness changes.
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
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4 md:col-span-5 lg:col-span-8 "></div>
                  <div className="col-span-8 md:col-span-7 lg:col-span-4 input_form">
                    <select
                      name="formula_types"
                      className="resultInput px-2 w-full border rounded"
                      id="formula_types"
                      value={formula}
                      onChange={(e) => setFormula(e.target.value)}
                    >
                      <option value="mifflin">
                        {data?.payload?.tech_lang_keys["66"]}
                      </option>
                      <option value="revised">
                        {data?.payload?.tech_lang_keys["67"]}
                      </option>
                      <option value="katch">
                        {data?.payload?.tech_lang_keys["68"]}
                      </option>
                    </select>
                  </div>
                </div>

                {showPercentError && (
                  <p className="text-sm text-end  px-1 text-red-500">
                    {data?.payload?.tech_lang_keys["69"]}
                  </p>
                )}

                <div className="rounded-lg  flex items-center justify-center">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="w-full bg-white col-span-12 rounded-lg ">
                      <div className="bg-white rounded-lg px-4 shadow-lg">
                        <p className="text-center text-xl font-bold mt-3 text-blue-600">
                          <strong>
                            {data?.payload?.tech_lang_keys["70"]} (TDEE)
                          </strong>
                        </p>

                        <div className="lg:flex md:flex justify-between">
                          <div className="lg:w-1/2 lg:pr-4 md:pr-4 mt-3 my-auto">
                            <div className="bg-gray-100 rounded-lg text-center p-6 shadow-md">
                              <p>
                                <b className="text-green-600 text-5xl">
                                  {tdee.toLocaleString()}
                                </b>
                              </p>
                              <p className="text-sm pb-2 border-b border-gray-300 text-gray-600 mt-2">
                                {data?.payload?.tech_lang_keys["71"]}
                              </p>
                              <p className="text-sm mt-2 text-left">
                                Based on the <b>{formulaLabel}</b>, you have a
                                total daily energy expenditure of{" "}
                                <b>{tdee.toLocaleString()}</b> calories, which
                                is <b>{weeklyCalories.toLocaleString()}</b>{" "}
                                calories per week.
                              </p>
                            </div>
                          </div>

                          <div className="lg:w-1/2 pl-4 mt-3 text-sm border-l border-gray-300">
                            <div className="flex items-center justify-between p-2 border-b border-gray-300">
                              <p className="flex items-center gap-2">
                                <img
                                  src="/images/tdee_cal.svg"
                                  alt="calorie image for tdee"
                                  className="w-6 h-6"
                                />
                                <b>{data?.payload?.tech_lang_keys["75"]}</b>
                              </p>
                              <p>
                                <b>{data?.payload?.tech_lang_keys["76"]}</b>
                              </p>
                            </div>

                            {[
                              { label: "64", value: 1.2 },
                              { label: "Lightly", value: 1.375 },
                              { label: "Moderately", value: 1.55 },
                              { label: "Very", value: 1.725 },
                              { label: "Extremely", value: 1.9 },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className={`flex items-center justify-between p-2 border-b border-gray-300 ${
                                  activity ===
                                  data?.payload?.tech_lang_keys[label]
                                    ? "bg-blue-100"
                                    : ""
                                }`}
                              >
                                <p>{data?.payload?.tech_lang_keys[label]}</p>
                                <p>{Math.round(bmr * value)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-center text-lg mt-3">
                        <strong className="text-blue-600">
                          {data?.payload?.tech_lang_keys["77"]}
                        </strong>
                      </p>

                      <div className="w-full">
                        <div
                          className="w-full flex justify-center"
                          style={{ height: "300px" }}
                        >
                          <Doughnut
                            data={chartData}
                            options={chartOptions}
                            key={JSON.stringify(chartData)}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-lg col-span-12  ">
                      <strong id="bmiDetails">
                        {data?.payload?.tech_lang_keys[49]}: {result?.tech_BMI}{" "}
                        (
                        <b
                          className={getBMICategoryStyle(bmiCategory)}
                          title={
                            bmiCategory === "Underweight"
                              ? "18.5 " + data?.payload?.tech_lang_keys["18"]
                              : bmiCategory === "Normal Weight"
                              ? "18.5 - 24.99"
                              : bmiCategory === "Overweight"
                              ? "25 - 29.99"
                              : bmiCategory === "Obesity"
                              ? "30 - 34.99"
                              : bmiCategory === "Severe Obesity"
                              ? "35+"
                              : ""
                          }
                        >
                          {
                            data?.payload?.tech_lang_keys[
                              bmiCategory === "Underweight"
                                ? "9"
                                : bmiCategory === "Normal Weight"
                                ? "10"
                                : bmiCategory === "Overweight"
                                ? "11"
                                : bmiCategory === "Obesity"
                                ? "12"
                                : bmiCategory === "Severe Obesity"
                                ? "13"
                                : ""
                            ]
                          }
                        </b>
                        ), {data?.payload?.tech_lang_keys[50]}: 18.5 to 24.9
                      </strong>
                    </p>
                    <div className="flex flex-col col-span-12 lg:flex-row gap-6">
                      {/* <!-- Left Section (Weight Loss) --> */}
                      <div className="w-full lg:w-1/2 mt-3">
                        <div className="flex items-center justify-center p-2 bg-red-600 rounded-t-lg gap-2">
                          <img
                            src="/images/tdee_apple.svg"
                            alt="apple image for tdee"
                            className="w-5 h-5"
                            decoding="async"
                            loading="lazy"
                          />
                          <p className="text-white">
                            {data?.payload?.tech_lang_keys["78"]}
                          </p>
                        </div>
                        <div className="w-full text-sm px-2 border border-blue-600 rounded-b-lg">
                          <div className="flex items-center justify-between py-2 px-3 border-b border-gray-400">
                            {result?.tech_submit === "lbs" ? (
                              <div>
                                <p>{data?.payload?.tech_lang_keys["20"]}</p>
                                <p className="text-xs text-gray-500">
                                  (0.5 lb {data?.payload?.tech_lang_keys["79"]})
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p>{data?.payload?.tech_lang_keys["20"]}</p>
                                <p className="text-xs text-gray-500">
                                  (0.25 kg {data?.payload?.tech_lang_keys["79"]}
                                  )
                                </p>
                              </div>
                            )}
                            <p className="text-red-400">
                              <span id="mild_loss_calories">
                                {mildLossCalories.toLocaleString()}
                              </span>{" "}
                              (90%)
                            </p>
                          </div>
                          <div className="flex items-center justify-between py-2 px-3 border-b border-gray-400">
                            {result?.tech_submit === "lbs" ? (
                              <div>
                                <p>{data?.payload?.tech_lang_keys["22"]}</p>
                                <p className="text-xs text-gray-500">
                                  (1 lb {data?.payload?.tech_lang_keys["79"]})
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p>{data?.payload?.tech_lang_keys["22"]}</p>
                                <p className="text-xs text-gray-500">
                                  (0.5 kg {data?.payload?.tech_lang_keys["79"]})
                                </p>
                              </div>
                            )}
                            <p className="text-red-400">
                              <span id="loss_calories">
                                {lossCalories.toLocaleString()}
                              </span>{" "}
                              (80%)
                            </p>
                          </div>
                          <div className="flex items-center justify-between py-2 px-3">
                            {result?.tech_submit === "lbs" ? (
                              <div>
                                <p>{data?.payload?.tech_lang_keys["23"]}</p>
                                <p className="text-xs text-gray-500">
                                  (2 lb {data?.payload?.tech_lang_keys["79"]})
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p>{data?.payload?.tech_lang_keys["23"]}</p>
                                <p className="text-xs text-gray-500">
                                  (1 kg {data?.payload?.tech_lang_keys["79"]})
                                </p>
                              </div>
                            )}
                            <p className="text-red-400">
                              <span id="ex_loss_calories">
                                {extremeLossCalories.toLocaleString()}
                              </span>{" "}
                              (61%)
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* <!-- Right Section (Weight Gain) --> */}
                      <div className="w-full lg:w-1/2 mt-3">
                        <div className="flex items-center justify-center p-2 bg-green-600 rounded-t-lg gap-2">
                          <img
                            src="/images/tdee_arm.svg"
                            alt="arm image for tdee"
                            className="w-5 h-5"
                            decoding="async"
                            loading="lazy"
                          />
                          <p className="text-white">
                            {data?.payload?.tech_lang_keys["80"]}
                          </p>
                        </div>
                        <div className="w-full text-sm px-2 border border-blue-600 rounded-b-lg">
                          {/* Mild Gain */}
                          <div className="flex items-center justify-between py-2 px-3 border-b border-gray-400">
                            {result?.tech_submit === "lbs" ? (
                              <div>
                                <p>{data?.payload?.tech_lang_keys["25"]}</p>
                                <p className="text-xs text-gray-500">
                                  (0.5 lb {data?.payload?.tech_lang_keys["79"]})
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p>{data?.payload?.tech_lang_keys["25"]}</p>
                                <p className="text-xs text-gray-500">
                                  (0.25 kg {data?.payload?.tech_lang_keys["79"]}
                                  )
                                </p>
                              </div>
                            )}
                            <p className="text-blue-600">
                              <span id="mild_gain_calories">
                                {mildGainCalories.toLocaleString()}
                              </span>{" "}
                              (110%)
                            </p>
                          </div>
                          {/* Normal Gain */}
                          <div className="flex items-center justify-between py-2 px-3 border-b border-gray-400">
                            {result?.tech_submit === "lbs" ? (
                              <div>
                                <p>{data?.payload?.tech_lang_keys["26"]}</p>
                                <p className="text-xs text-gray-500">
                                  (1 lb {data?.payload?.tech_lang_keys["79"]})
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p>{data?.payload?.tech_lang_keys["26"]}</p>
                                <p className="text-xs text-gray-500">
                                  (0.5 kg {data?.payload?.tech_lang_keys["79"]})
                                </p>
                              </div>
                            )}
                            <p className="text-blue-600">
                              <span id="gain_calories">
                                {gainCalories.toLocaleString()}
                              </span>{" "}
                              (120%)
                            </p>
                          </div>
                          {/* Extreme Gain */}
                          <div className="flex items-center justify-between py-2 px-3">
                            {result?.tech_submit === "lbs" ? (
                              <div>
                                <p>{data?.payload?.tech_lang_keys["27"]}</p>
                                <p className="text-xs text-gray-500">
                                  (2 lb {data?.payload?.tech_lang_keys["79"]})
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p>{data?.payload?.tech_lang_keys["27"]}</p>
                                <p className="text-xs text-gray-500">
                                  (1 kg {data?.payload?.tech_lang_keys["79"]})
                                </p>
                              </div>
                            )}
                            <p className="text-blue-600">
                              <span id="ex_gain_calories">
                                {extremeGainCalories.toLocaleString()}
                              </span>{" "}
                              (139%)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-lg">
                  <b>{data?.payload?.tech_lang_keys[52]}</b>
                </p>
                <div className="lg:w-7/12 mt-2 flex items-center p-2 text-sm rounded-lg flex-wrap bg-white shadow-inner gap-4">
                  {[
                    {
                      key: "maintenance",
                      label: data?.payload?.tech_lang_keys["m1"],
                      datas: data?.payload?.tech_lang_keys["m1_des"],
                    },
                    {
                      key: "cutting",
                      label: data?.payload?.tech_lang_keys["m2"],
                      datas: data?.payload?.tech_lang_keys["m2_des"],
                    },
                    {
                      key: "bulking",
                      label: data?.payload?.tech_lang_keys["m3"],
                      datas: data?.payload?.tech_lang_keys["m3_des"],
                    },
                    {
                      key: "custom",
                      label: data?.payload?.tech_lang_keys[53],
                      datas: "custom",
                    },
                  ].map((tab) => (
                    <p
                      key={tab.key}
                      className={`py-1 px-2 rounded-md cursor-pointer macronutrients ${
                        activeTab === tab.key ? "activeMacro bg-blue-100" : ""
                      }`}
                      data-value={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label || "Label Missing"}
                    </p>
                  ))}
                </div>
                {activeTab === "custom" && (
                  <div className="col-12 font-s-14" id="customDetails">
                    <div className="flex flex-col lg:flex-row gap-4 my-2">
                      {/* Protein */}
                      <div className="lg:w-1/3 w-full">
                        <p className="flex justify-between">
                          <strong>
                            {data?.payload?.tech_lang_keys["pro"]}
                          </strong>
                          <strong className="change_pro">{customPro}%</strong>
                        </p>
                        <input
                          type="range"
                          min="10"
                          max="35"
                          value={customPro}
                          onChange={(e) =>
                            updateMacro("protein", e.target.value)
                          }
                          className="w-full own_pro"
                        />
                      </div>

                      {/* Fat */}
                      <div className="lg:w-1/3 w-full lg:px-3 mt-1 lg:mt-0">
                        <p className="flex justify-between">
                          <strong>
                            {data?.payload?.tech_lang_keys["fat"]}
                          </strong>
                          <strong className="change_fat">{customFat}%</strong>
                        </p>
                        <input
                          type="range"
                          min="20"
                          max="35"
                          value={customFat}
                          onChange={(e) => updateMacro("fat", e.target.value)}
                          className="w-full own_fat"
                        />
                      </div>

                      {/* Carbs */}
                      <div className="lg:w-1/3 w-full mt-1 lg:mt-0">
                        <p className="flex justify-between">
                          <strong>
                            {data?.payload?.tech_lang_keys["carb"]}
                          </strong>
                          <strong className="change_carb">{customCarb}%</strong>
                        </p>
                        <input
                          type="range"
                          min="25"
                          max="65"
                          value={customCarb}
                          onChange={(e) => updateMacro("carb", e.target.value)}
                          className="w-full own_carb"
                        />
                      </div>
                    </div>

                    {/* Macros Gram Display */}
                    <div className="lg:w-1/2 mx-auto flex justify-between flex-wrap mt-4">
                      <div>
                        <div className="flex items-center gap-1">
                          <img
                            src="/images/chart_pro.png"
                            alt="protein"
                            width="15px"
                            height="15px"
                          />
                          <p className="text-[#E94442]">
                            {data?.payload?.tech_lang_keys["pro"]}
                          </p>
                        </div>
                        <div className="first custom_pro text-[#E94442]">
                          {calcGram(customPro, calories, 4)} g
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1">
                          <img
                            src="/images/chart_fat.png"
                            alt="fat"
                            width="15px"
                            height="15px"
                          />
                          <p className="text-[#E7A827]">
                            {data?.payload?.tech_lang_keys["fat"]}
                          </p>
                        </div>
                        <div className="first custom_fat text-[#E7A827]">
                          {calcGram(customFat, calories, 9)} g
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1">
                          <img
                            src="/images/chart_carb.png"
                            alt="carb"
                            width="15px"
                            height="15px"
                          />
                          <p className="text-[#38a169]">
                            {data?.payload?.tech_lang_keys["carb"]}
                          </p>
                        </div>
                        <div className="first custom_carb text-[#38a169]">
                          {calcGram(customCarb, calories, 4)} g
                        </div>
                      </div>
                    </div>

                    {/* Chart */}
                    <div
                      className="w-[300px] mx-auto mt-5"
                      id="custom_moderate"
                    >
                      <Doughnut data={customData} options={options} />
                    </div>
                  </div>
                )}
                {activeTab !== "custom" && (
                  <div className="w-full text-sm" id="nonCustomDetails">
                    <p className="text-sm mt-3" id="macroLine">
                      {tabs.map(
                        (tab) =>
                          tab.key === activeTab && (
                            <span key={tab.key}>
                              {tab.datasBefore}{" "}
                              <strong className="dailyCalories">
                                {tab.caloriesValue}
                              </strong>{" "}
                              {tab.datasAfter}
                            </span>
                          )
                      )}
                    </p>

                    {/* Macro details */}
                    <div className="flex flex-wrap">
                      {/* Moderate Section */}
                      <div className="md:w-1/3 w-full mt-2 pr-3 md:border-r md:border-gray-300">
                        <p className="mb-2">
                          <strong>
                            {data?.payload?.tech_lang_keys["moderate"]}{" "}
                            (30/35/35)
                          </strong>
                        </p>
                        <div className="flex justify-between">
                          <div>
                            <div className="flex items-center gap-1">
                              <img
                                src="/images/chart_pro.png"
                                alt="protein"
                                className="w-4 h-4 object-contain"
                              />
                              <p className="text-red-600">
                                {data?.payload?.tech_lang_keys["pro"]}
                              </p>
                            </div>
                            <div className="mt-1 text-red-600">{m.mod_pro}</div>

                            <div className="mt-2">
                              <div className="flex items-center gap-1">
                                <img
                                  src="/images/chart_fat.png"
                                  alt="fat"
                                  className="w-4 h-4 object-contain"
                                />
                                <p className="text-yellow-500">
                                  {data?.payload?.tech_lang_keys["fat"]}
                                </p>
                              </div>
                              <div className="mt-1 text-yellow-500">
                                {m.mod_fat}
                              </div>
                            </div>

                            <div className="mt-2">
                              <div className="flex items-center gap-1">
                                <img
                                  src="/images/chart_carb.png"
                                  alt="carb"
                                  className="w-4 h-4 object-contain"
                                />
                                <p className="text-green-400">
                                  {data?.payload?.tech_lang_keys["carb"]}
                                </p>
                              </div>
                              <div className="mt-1 text-green-400">
                                {m.mod_carb}
                              </div>
                            </div>
                          </div>

                          <div
                            className="mt-2"
                            style={{ height: "200px", width: "150px" }}
                          >
                            <Doughnut
                              data={chartData2[activeTab]}
                              options={options}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Lower Section */}
                      <div className="md:w-1/3 w-full mt-2 px-3 md:border-r md:border-gray-300">
                        <p className="mb-2">
                          <strong>
                            {data?.payload?.tech_lang_keys["lower"]} (40/40/20)
                          </strong>
                        </p>
                        <div className="flex justify-between">
                          <div>
                            <div className="flex items-center gap-1">
                              <img
                                src="/images/chart_pro.png"
                                alt="protein"
                                className="w-4 h-4 object-contain"
                              />
                              <p className="text-red-600">
                                {data?.payload?.tech_lang_keys["pro"]}
                              </p>
                            </div>
                            <div className="mt-1 text-red-600">{m.low_pro}</div>

                            <div className="mt-2">
                              <div className="flex items-center gap-1">
                                <img
                                  src="/images/chart_fat.png"
                                  alt="fat"
                                  className="w-4 h-4 object-contain"
                                />
                                <p className="text-yellow-500">
                                  {data?.payload?.tech_lang_keys["fat"]}
                                </p>
                              </div>
                              <div className="mt-1 text-yellow-500">
                                {m.low_fat}
                              </div>
                            </div>

                            <div className="mt-2">
                              <div className="flex items-center gap-1">
                                <img
                                  src="/images/chart_carb.png"
                                  alt="carb"
                                  className="w-4 h-4 object-contain"
                                />
                                <p className="text-green-400">
                                  {data?.payload?.tech_lang_keys["carb"]}
                                </p>
                              </div>
                              <div className="mt-1 text-green-400">
                                {m.low_carb}
                              </div>
                            </div>
                          </div>

                          <div
                            className="mt-2"
                            style={{ height: "200px", width: "150px" }}
                          >
                            <Doughnut
                              data={chartData2[activeTab]}
                              options={options}
                            />
                          </div>
                        </div>
                      </div>

                      {/* High Section */}
                      <div className="md:w-1/3 w-full mt-2 pl-3">
                        <p className="mb-2">
                          <strong>
                            {data?.payload?.tech_lang_keys["high"]} (30/20/50)
                          </strong>
                        </p>
                        <div className="flex justify-between">
                          <div>
                            <div className="flex items-center gap-1">
                              <img
                                src="/images/chart_pro.png"
                                alt="protein"
                                className="w-4 h-4 object-contain"
                              />
                              <p className="text-red-600">
                                {data?.payload?.tech_lang_keys["pro"]}
                              </p>
                            </div>
                            <div className="mt-1 text-red-600">
                              {m.high_pro}
                            </div>

                            <div className="mt-2">
                              <div className="flex items-center gap-1">
                                <img
                                  src="/images/chart_fat.png"
                                  alt="fat"
                                  className="w-4 h-4 object-contain"
                                />
                                <p className="text-yellow-500">
                                  {data?.payload?.tech_lang_keys["fat"]}
                                </p>
                              </div>
                              <div className="mt-1 text-yellow-500">
                                {m.high_fat}
                              </div>
                            </div>

                            <div className="mt-2">
                              <div className="flex items-center gap-1">
                                <img
                                  src="/images/chart_carb.png"
                                  alt="carb"
                                  className="w-4 h-4 object-contain"
                                />
                                <p className="text-green-400">
                                  {data?.payload?.tech_lang_keys["carb"]}
                                </p>
                              </div>
                              <div className="mt-1 text-green-400">
                                {m.high_carb}
                              </div>
                            </div>
                          </div>

                          <div
                            className="mt-2"
                            style={{ height: "200px", width: "150px" }}
                          >
                            <Doughnut
                              data={chartData2[activeTab]}
                              options={options}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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

export default TDEECalculator;

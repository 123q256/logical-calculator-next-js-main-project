"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Chart,
  Legend,
  Title,
  BarElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  BarElement
);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCalorieDeficitCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CalorieDeficitCalculator = ({ onDetailClick, onHideDetail }) => {
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
    tech_unit_type: "lbs", // lbs  kg
    tech_gender: "Male",
    tech_age: "23",
    tech_ft_in: "69",
    tech_height_cm: "175",
    tech_weight: "205",
    tech_target: "185",
    tech_activity: "1.55",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCalorieDeficitCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_unit_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_gender: formData.tech_gender,
        tech_age: formData.tech_age,
        tech_ft_in: formData.tech_ft_in,
        tech_height_cm: formData.tech_height_cm,
        tech_weight: formData.tech_weight,
        tech_target: formData.tech_target,
        tech_activity: formData.tech_activity,
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
      tech_unit_type: "lbs", // lbs  kg
      tech_gender: "Male",
      tech_age: "23",
      tech_ft_in: "69",
      tech_height_cm: "175",
      tech_weight: "205",
      tech_target: "185",
      tech_activity: "1.55",
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
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isMacroLoading, setIsMacroLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const handleDetailClick = (inCal, yrs, date) => {
    setIsMacroLoading(true);
    setSelectedDetail(null);
    setShowDetail(true);

    setTimeout(() => {
      const calories = parseFloat(inCal);

      const calculateMacros = (pro, fat, carbs) => ({
        protein: Math.round((calories * pro) / 4),
        fats: Math.round((calories * fat) / 9),
        carbs: Math.round((calories * carbs) / 4),
      });

      setSelectedDetail({
        calories,
        time: yrs,
        targetDate: date,
        macros: {
          balanced: calculateMacros(0.2, 0.3, 0.5),
          lowFat: calculateMacros(0.25, 0.2, 0.55),
          lowCarb: calculateMacros(0.25, 0.3, 0.45),
          highProtein: calculateMacros(0.35, 0.2, 0.45),
        },
      });

      setIsMacroLoading(false);
    }, 2000);
  };

  const handleHideDetail = () => {
    setIsMacroLoading(false);
    setShowDetail(false);
    setSelectedDetail(null);
  };

  const formatNumber = (num) => {
    if (!num) return 0;
    return num.toLocaleString(); // adds commas, e.g. 1,200
  };

  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const rows = (result?.tech_intake_cal_array || []).map((val, index) => {
    const [in_cal, yrs, date, less_cal] = val.split("@@");
    const isLast = index + 1 === result?.tech_intake_cal_array.length;
    const borderClass = isLast ? "" : "border-b";
    return (
      <tr
        key={index}
        className="click_me cursor-pointer"
        onClick={() => onDetailClick(in_cal, yrs, date)}
      >
        <td className="hidden">{index + 1}</td>
        <td className={`text-[14px] ${borderClass} p-2`} width="15%">
          {in_cal}
        </td>
        <td className={`text-[14px] ${borderClass} p-2`}>{less_cal}</td>
        <td className={`text-[14px] ${borderClass} p-2`}>{yrs}</td>
        <td className={`text-[14px] ${borderClass} p-2`}>{date}</td>
        <td
          className={`${borderClass} text-green-500 p-2 flex`}
          title={data?.payload?.tech_lang_keys[77]}
        >
          <span className="mx-1">{data?.payload?.tech_lang_keys[87]}</span>
          <img
            src="/images/blue-arrow.png"
            alt="Arrow"
            width="13px"
            className="ms-lg-2 object-contain mx-2"
          />
        </td>
      </tr>
    );
  });

  // chart js

  const days = result?.tech_days || 30;
  const unit = result?.tech_submit || "";

  // Prepare labels (dates)
  const labels = [];
  for (let i = 1; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    labels.push(
      date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      })
    );
  }

  // Prepare weight data, decreasing by daily pounds
  let weight = parseFloat(result?.tech_weight) || 0;
  const dailyDecrease = parseFloat(result?.tech_pounds_daily) || 0;
  const dataPoints = [];
  for (let i = 1; i <= days; i++) {
    dataPoints.push(parseFloat(weight.toFixed(2)));
    weight -= dailyDecrease;
  }

  const datachart = {
    labels,
    datasets: [
      {
        label: `Weight (${unit})`,
        data: dataPoints,
        fill: false,
        borderColor: "#3b82f6", // blue color
        backgroundColor: "#3b82f6",
        tension: 0.3, // smooth curve
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#444",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      datalabels: {
        display: false, // ✅ Disable value labels on bars
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.parsed.y} ${unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
          color: "#444",
          font: {
            size: 18,
            weight: "bold",
          },
        },
        ticks: {
          color: "#444",
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Weight",
          color: "#444",
          font: {
            size: 18,
            weight: "bold",
          },
        },
        ticks: {
          color: "#444",
          callback: function (value) {
            return Math.abs(value) + ` ${unit}`;
          },
        },
      },
    },
  };

  // chart js 2
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const tdee = result?.tech_tdee || 0;
    const isLbs = formData?.tech_unit_type === "lbs";

    const mild = isLbs ? tdee - 250 : tdee - Math.round((7700 * 0.25) / 7);
    const loss = isLbs ? tdee - 500 : tdee - Math.round((7700 * 0.5) / 7);
    const extreme = isLbs ? tdee - 1000 : tdee - Math.round(7700 / 7);

    const data = {
      labels: ["Extreme Weight Loss", "Mild Weight Loss", "Weight Loss"],
      datasets: [
        {
          label: "Calories",
          data: [extreme, mild, loss],
          backgroundColor: ["#0EA5E9", "#F43F5E", "#10B981"],
          borderRadius: 5,
          barThickness: 50,
        },
      ],
    };

    const options = {
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: `Weight (${formData?.tech_unit_type})`,
            color: "#333",
            font: { size: 16, weight: "bold" },
          },
          beginAtZero: true,
          ticks: {
            color: "#444",
            stepSize: 100,
          },
        },
        x: {
          ticks: {
            color: "#444",
            font: { size: 14, weight: "bold" },
          },
        },
      },
      plugins: {
        legend: { display: false },
      },
    };

    // Destroy previous chart instance if exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data,
      options,
    });
  }, [result, formData]);

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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="  mt-2 lg:w-[50%] ">
              <input
                type="hidden"
                name="tech_unit_type"
                id="calculator_time"
                value={formData.tech_unit_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_unit_type === "lbs" ? "tagsUnit" : ""
                    }`}
                    id="lbs"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "lbs" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["49"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit_type === "kg" ? "tagsUnit" : ""
                    }`}
                    id="kg"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "kg" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["48"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="px-lg-0 px-2 py-3">
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
                    <span>{data?.payload?.tech_lang_keys["gender"]}</span>
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
                    <span>{data?.payload?.tech_lang_keys["female"]}</span>
                  </label>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["your_age"]}:
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
              {formData.tech_unit_type == "lbs" && (
                <>
                  <div className="col-span-6 height_ft_in">
                    <label htmlFor="tech_ft_in" className="label">
                      {data?.payload?.tech_lang_keys["height"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_ft_in"
                        id="tech_ft_in"
                        value={formData.tech_ft_in}
                        onChange={handleChange}
                      >
                        <option value="55">4ft 7in</option>
                        <option value="56">4ft 8in</option>
                        <option value="57">4ft 9in</option>
                        <option value="58">4ft 10in</option>
                        <option value="59">4ft 11in</option>
                        <option value="60">5ft 0in</option>
                        <option value="61">5ft 1in</option>
                        <option value="62">5ft 2in</option>
                        <option value="63">5ft 3in</option>
                        <option value="64">5ft 4in</option>
                        <option value="65">5ft 5in</option>
                        <option value="66">5ft 6in</option>
                        <option value="67">5ft 7in</option>
                        <option value="68">5ft 8in</option>
                        <option value="69">5ft 9in</option>
                        <option value="70">5ft 10in</option>
                        <option value="71">5ft 11in</option>
                        <option value="72">6ft 0in</option>
                        <option value="73">6ft 1in</option>
                        <option value="74">6ft 2in</option>
                        <option value="75">6ft 3in</option>
                        <option value="76">6ft 4in</option>
                        <option value="77">6ft 5in</option>
                        <option value="78">6ft 6in</option>
                        <option value="79">6ft 7in</option>
                        <option value="80">6ft 8in</option>
                        <option value="81">6ft 9in</option>
                        <option value="82">6ft 10in</option>
                        <option value="83">6ft 11in</option>
                        <option value="84">7ft 0in</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_unit_type == "kg" && (
                <>
                  <div className="col-span-6 height_cm ">
                    <label htmlFor="tech_height_cm" className="label">
                      {data?.payload?.tech_lang_keys["height"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_height_cm"
                        id="tech_height_cm"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_height_cm}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-6">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["weight"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_weight"
                    id="tech_weight"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_weight}
                    onChange={handleChange}
                  />

                  {formData.tech_unit_type == "lbs" && (
                    <>
                      <span className="text-blue input_unit" id="lbs_or_kg1">
                        lbs
                      </span>
                    </>
                  )}
                  {formData.tech_unit_type == "kg" && (
                    <>
                      <span className="text-blue input_unit" id="lbs_or_kg1">
                        kg
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_target" className="label">
                  {data?.payload?.tech_lang_keys["50"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_target"
                    id="tech_target"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_target}
                    onChange={handleChange}
                  />
                  {formData.tech_unit_type == "lbs" && (
                    <>
                      <span className="text-blue input_unit" id="lbs_or_kg1">
                        lbs
                      </span>
                    </>
                  )}
                  {formData.tech_unit_type == "kg" && (
                    <>
                      <span className="text-blue input_unit" id="lbs_or_kg1">
                        kg
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="col-span-12">
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
                    <option value="1.2">
                      {data?.payload?.tech_lang_keys["No_sport"]}{" "}
                    </option>
                    <option value="1.375">
                      {data?.payload?.tech_lang_keys["Light_activity"]}{" "}
                    </option>
                    <option value="1.55">
                      {data?.payload?.tech_lang_keys["Moderate_activity"]}{" "}
                    </option>
                    <option value="1.725">
                      {data?.payload?.tech_lang_keys["High_activity"]}{" "}
                    </option>
                    <option value="1.9">
                      {data?.payload?.tech_lang_keys["Extreme_activity"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button
              type="formData?.tech_unit_type"
              isLoading={roundToTheNearestLoading}
            >
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  md:w-[95%] lg:w-[95%] mt-3 flex justify-center">
                    <div className="w-full ">
                      <div className="w-full ">
                        <div className="grid grid-cols-12 gap-4 bg-white text-center shadow-md rounded-lg px-2 md:mx-[10px] py-4">
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="text-center line-height border-end-cus px-3">
                              <strong>
                                {data?.payload?.tech_lang_keys[84]}
                              </strong>
                              <p className="text-[14px] px-4 py-2">
                                You should take the following calories on a
                                daily basis
                              </p>
                              <strong className="text-orange text-[25px]">
                                {result?.tech_tdee}
                              </strong>
                              <p className="text-[12px]">Kcal/day</p>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="text-center line-height px-3">
                              <strong>
                                {data?.payload?.tech_lang_keys[86]}
                              </strong>
                              <p className="text-[14px] px-4 my-2">
                                You should take the following calories on a
                                daily basis
                              </p>
                              <strong className="text-orange text-[25px]">
                                {result?.tech_calorie_def_cal}
                              </strong>
                              <p className="text-[12px]">Kcal/day</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-12 gap-x-2 mt-3">
                          {/* Mild Weight Loss */}
                          <div className="col-span-12 md:col-span-4 lg:col-span-4 ">
                            <div className="shadow-md bg-white mt-2 p-2 rounded-lg flex justify-between items-center">
                              <div>
                                <span className="text-[12px]">
                                  Mild Weight Loss
                                </span>
                                <p className="text-[12px] text-gray-500">
                                  {formData?.tech_unit_type === "lbs"
                                    ? "( 0.5 lb/week )"
                                    : "( 0.25 kg/week )"}
                                </p>
                              </div>
                              <div className="text-blue-500">
                                <strong className="text-[14px]">
                                  {formatNumber(
                                    result?.tech_tdee -
                                      (formData?.tech_unit_type === "lbs"
                                        ? 250
                                        : Math.round((7700 * 0.25) / 7))
                                  )}{" "}
                                  <span className="calo text-dark">
                                    Calories/Day
                                  </span>
                                </strong>
                              </div>
                            </div>
                          </div>

                          {/* Weight Loss */}
                          <div className="col-span-12 md:col-span-4 lg:col-span-4 ">
                            <div className="shadow-md bg-white mt-2 p-2 rounded-lg flex justify-between items-center mx-md-2">
                              <div>
                                <span className="text-[12px]">Weight Loss</span>
                                <p className="text-[12px] text-gray-500">
                                  {formData?.tech_unit_type === "lbs"
                                    ? "( 1 lb/week )"
                                    : "( 0.5 kg/week )"}
                                </p>
                              </div>
                              <div className="text-blue-500">
                                <strong className="text-[14px]">
                                  {formatNumber(
                                    result?.tech_tdee -
                                      (formData?.tech_unit_type === "lbs"
                                        ? 500
                                        : Math.round((7700 * 0.5) / 7))
                                  )}{" "}
                                  <span className="calo text-dark">
                                    Calories/Day
                                  </span>
                                </strong>
                              </div>
                            </div>
                          </div>

                          {/* Extreme Weight Loss */}
                          <div className="col-span-12 md:col-span-4 lg:col-span-4 ">
                            <div className="shadow-md bg-white mt-2 p-2 rounded-lg flex justify-between items-center">
                              <div>
                                <span className="text-[12px]">
                                  Extreme Weight Loss
                                </span>
                                <p className="text-[12px] text-gray-500">
                                  {formData?.tech_unit_type === "lbs"
                                    ? "( 2 lb/week )"
                                    : "( 1 kg/week )"}
                                </p>
                              </div>
                              <div className="text-blue-500">
                                <strong className="text-[12px]">
                                  {formatNumber(
                                    result?.tech_tdee -
                                      (formData?.tech_unit_type === "lbs"
                                        ? 1000
                                        : Math.round(7700 / 7))
                                  )}{" "}
                                  <span className="calo text-dark">
                                    Calories/Day
                                  </span>
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Summary Table (Hide when details shown) */}
                        {!showDetail && (
                          <div className="w-full hide_table px-3">
                            <p className="text-[18px] px-3 mt-4 mb-3 text-center">
                              <strong>
                                {data?.payload?.tech_lang_keys[56]} (
                                {new Date().toLocaleDateString("en-US", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                                )
                              </strong>
                            </p>

                            <div
                              className="w-full overflow-auto bg-sky bordered rounded-lg custom-scroll"
                              style={{ maxHeight: 286 }}
                            >
                              <table
                                className="w-full px-3 text-center"
                                cellSpacing="0"
                              >
                                <thead>
                                  <tr>
                                    <th className="hidden"></th>
                                    <th className="text-[12px] border-b-dark p-2">
                                      {data?.payload?.tech_lang_keys[57]}
                                    </th>
                                    <th className="text-[12px] border-b-dark p-2">
                                      {data?.payload?.tech_lang_keys[58]}
                                    </th>
                                    <th className="text-[12px] border-b-dark p-2">
                                      {data?.payload?.tech_lang_keys[59]}
                                    </th>
                                    <th className="text-[12px] border-b-dark p-2">
                                      {data?.payload?.tech_lang_keys[60]}
                                    </th>
                                    <th className="text-[12px] border-b-dark p-2">
                                      {data?.payload?.tech_lang_keys[87]}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(result?.tech_intake_cal_array || []).map(
                                    (val, idx) => {
                                      const [in_cal, yrs, date, less_cal] =
                                        val.split("@@");
                                      const borderClass =
                                        idx + 1 ===
                                        result?.tech_intake_cal_array.length
                                          ? ""
                                          : "border-b";

                                      return (
                                        <tr
                                          key={idx}
                                          className="click_me cursor-pointer"
                                          onClick={() =>
                                            handleDetailClick(in_cal, yrs, date)
                                          }
                                        >
                                          <td className="hidden">{idx + 1}</td>
                                          <td
                                            className={`text-[14px] ${borderClass} p-2`}
                                            style={{ width: "15%" }}
                                          >
                                            {in_cal}
                                          </td>
                                          <td
                                            className={`text-[14px] ${borderClass} p-2`}
                                          >
                                            {less_cal}
                                          </td>
                                          <td
                                            className={`text-[14px] ${borderClass} p-2`}
                                          >
                                            {yrs}
                                          </td>
                                          <td
                                            className={`text-[14px] ${borderClass} p-2`}
                                          >
                                            {date}
                                          </td>
                                          <td
                                            className={`${borderClass} text-green-500 p-2 flex`}
                                            title={
                                              data?.payload?.tech_lang_keys[77]
                                            }
                                          >
                                            <span className="mx-1">
                                              {
                                                data?.payload
                                                  ?.tech_lang_keys[87]
                                              }
                                            </span>
                                            <img
                                              src="/images/blue-arrow.png"
                                              alt="Arrow"
                                              width="13"
                                              className="ms-lg-2 object-contain mx-2"
                                            />
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Detail Table (Show when details are shown) */}
                        {showDetail && (
                          <div className="w-full loading_data px-3 mt-4">
                            <p className="text-[18px] px-3 mt-2 mb-1">
                              <strong className="text-blue">
                                {data?.payload?.tech_lang_keys[62]}
                              </strong>
                            </p>
                            <div className="w-full bg-[#F6FAFC] overflow-auto px-3 relative">
                              {isMacroLoading ? (
                                <div className="text-center py-12 text-lg font-semibold text-gray-700">
                                  Loading...
                                </div>
                              ) : (
                                <div className="load_content">
                                  <div className="w-full">
                                    <p className="text-center my-2">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys[63]}{" "}
                                        <span className="cal_update text-blue">
                                          {selectedDetail?.calories}
                                        </span>{" "}
                                        {data?.payload?.tech_lang_keys[64]}{" "}
                                        <span
                                          id="time_update"
                                          className="text-blue"
                                        >
                                          {selectedDetail?.time}
                                        </span>
                                        .
                                      </strong>
                                    </p>

                                    <div className="grid grid-cols-12 gap-3 text-[14px]">
                                      {/* Left Col: Weight, TDEE, BMI labels */}
                                      <div className="col-span-4 overflow-auto">
                                        <table
                                          className="w-full"
                                          cellSpacing="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td className="p-2">&nbsp;</td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys["weight"]
                                                  }
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys[64]
                                                  }
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>TDEE</strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>RMR</strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="p-2">
                                                <strong>BMI</strong>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>

                                      {/* Middle Col: Current values */}
                                      <div className="col-span-4 overflow-auto">
                                        <table
                                          className="w-full"
                                          cellSpacing="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {new Date().toLocaleDateString()}
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {result?.tech_weight}
                                                </strong>{" "}
                                                <span>
                                                  {
                                                    result?.tech_formData
                                                      ?.tech_unit_type
                                                  }
                                                </span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {result?.tech_LBM}
                                                </strong>{" "}
                                                <span>
                                                  {
                                                    result?.tech_formData
                                                      ?.tech_unit_type
                                                  }
                                                </span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {result?.tech_tdee}
                                                </strong>{" "}
                                                <span>kcal</span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {result?.tech_RMR}
                                                </strong>{" "}
                                                <span>kcal</span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="p-2">
                                                <strong>
                                                  {result?.tech_BMI}
                                                </strong>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>

                                      {/* Right Col: Target values */}
                                      <div className="col-span-4 overflow-auto">
                                        <table
                                          className="w-full"
                                          cellSpacing="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong
                                                  className="text-blue"
                                                  id="target_date"
                                                >
                                                  {selectedDetail?.targetDate ||
                                                    ""}
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {result?.tech_target}
                                                </strong>{" "}
                                                <span>
                                                  {
                                                    result?.tech_formData
                                                      ?.tech_unit_type
                                                  }
                                                </span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {result?.tech_LBM_target}
                                                </strong>{" "}
                                                <span>
                                                  {
                                                    result?.tech_formData
                                                      ?.tech_unit_type
                                                  }
                                                </span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {result?.tech_tdee_target}
                                                </strong>{" "}
                                                <span>kcal</span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {result?.tech_RMR_target}
                                                </strong>{" "}
                                                <span>kcal</span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="p-2">
                                                <strong>
                                                  {result?.tech_BMI_target}
                                                </strong>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* Summary Calories */}
                                    <div className="col s12 padding_0 margin_top_15 text-center my-2">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys[65]}{" "}
                                        <span className="cal_update text-blue">
                                          {selectedDetail?.calories}
                                        </span>{" "}
                                        kcal
                                      </strong>
                                    </div>

                                    {/* Macronutrient Tables */}
                                    <div className="grid grid-cols-12 gap-3 text-[14px]">
                                      {/* Labels */}
                                      <div className="col-span-3 overflow-auto">
                                        <table
                                          className="w-full"
                                          cellSpacing="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong className="text-blue">
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys[66]
                                                  }
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys[67]
                                                  }
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys[68]
                                                  }
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys[69]
                                                  }
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="p-2">
                                                <strong>
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys[70]
                                                  }
                                                </strong>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>

                                      {/* Protein */}
                                      <div className="col-span-3 overflow-auto">
                                        <table
                                          className="w-full"
                                          cellSpacing="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong className="text-blue">
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys[71]
                                                  }
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>Balanced</strong> (g):{" "}
                                                {
                                                  selectedDetail?.macros
                                                    ?.balanced?.protein
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>Low Fat</strong> (g):{" "}
                                                {
                                                  selectedDetail?.macros?.lowFat
                                                    ?.protein
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>Low Carbs</strong> (g):{" "}
                                                {
                                                  selectedDetail?.macros
                                                    ?.lowCarb?.protein
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="p-2">
                                                <strong>High Protein</strong>{" "}
                                                (g):{" "}
                                                {
                                                  selectedDetail?.macros
                                                    ?.highProtein?.protein
                                                }
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>

                                      {/* Carbs */}
                                      <div className="col-span-3 overflow-auto">
                                        <table
                                          className="w-full"
                                          cellSpacing="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong className="text-blue">
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys[72]
                                                  }
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>Balanced</strong> (g):{" "}
                                                {
                                                  selectedDetail?.macros
                                                    ?.balanced?.carbs
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>Low Fat</strong> (g):{" "}
                                                {
                                                  selectedDetail?.macros?.lowFat
                                                    ?.carbs
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>Low Carbs</strong> (g):{" "}
                                                {
                                                  selectedDetail?.macros
                                                    ?.lowCarb?.carbs
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="p-2">
                                                <strong>High Protein</strong>{" "}
                                                (g):{" "}
                                                {
                                                  selectedDetail?.macros
                                                    ?.highProtein?.carbs
                                                }
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>

                                      {/* Fats */}
                                      <div className="col-span-3 overflow-auto">
                                        <table
                                          className="w-full"
                                          cellSpacing="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong className="text-blue">
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys[73]
                                                  }
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>Balanced</strong> (g):{" "}
                                                {
                                                  selectedDetail?.macros
                                                    ?.balanced?.fats
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>Low Fat</strong> (g):{" "}
                                                {
                                                  selectedDetail?.macros?.lowFat
                                                    ?.fats
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b p-2">
                                                <strong>Low Carbs</strong> (g):{" "}
                                                {
                                                  selectedDetail?.macros
                                                    ?.lowCarb?.fats
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="p-2">
                                                <strong>High Protein</strong>{" "}
                                                (g):{" "}
                                                {
                                                  selectedDetail?.macros
                                                    ?.highProtein?.fats
                                                }
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* Hide Button */}
                                    <div className="w-full text-center">
                                      <button
                                        type="button"
                                        className="bg-[#99EA48] rounded-lg border-0 px-4 py-2 my-3 cursor-pointer"
                                        onClick={handleHideDetail}
                                      >
                                        {data?.payload?.tech_lang_keys[74]}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="w-full mt-4 px-3">
                          <p className="text-[18px] px-3 my-4 text-center">
                            <strong>
                              {data?.payload?.tech_lang_keys[75]} (
                              {new Date().toLocaleDateString("en-GB", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                              )
                            </strong>
                          </p>
                          <div className="w-full  mx-auto mt-5">
                            <canvas ref={canvasRef}></canvas>
                          </div>
                          <div id="chartContainer">
                            <Line data={datachart} options={options} />
                          </div>
                        </div>
                        <div className="w-full mt-4 px-3">
                          <div className="grid grid-cols-12 border-blue-500 pb-3 rounded-lg">
                            <p className="col-span-12 text-[18px] px-3 mb-2 text-center  bg-[#2845F5] py-2">
                              <strong className="text-white">
                                {data?.payload?.tech_lang_keys[88]}
                              </strong>
                            </p>

                            {/* Left Table */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-6 md:border-r px-2 overflow-auto">
                              <table className="w-full px-3" cellSpacing="0">
                                <tbody>
                                  <tr>
                                    <td className="border-b p-2">
                                      TDEE&nbsp;
                                      <span
                                        className="bg-white radius-circle px-2 cursor-pointer"
                                        title={
                                          data?.payload?.tech_lang_keys[32]
                                        }
                                      >
                                        ?
                                      </span>
                                    </td>
                                    <td className="border-b p-2 text-end">
                                      <strong>{result?.tech_tdee}</strong>{" "}
                                      <span className="text-[14px]">
                                        Kcal/day
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b p-2">
                                      BMR&nbsp;
                                      <span
                                        className="bg-white radius-circle px-2 cursor-pointer"
                                        title={
                                          data?.payload?.tech_lang_keys[54]
                                        }
                                      >
                                        ?
                                      </span>
                                    </td>
                                    <td className="border-b p-2 text-end">
                                      <strong>{result?.tech_BMR}</strong>{" "}
                                      <span className="text-[14px]">
                                        Kcal/day
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-md-b p-2">
                                      RMR&nbsp;
                                      <span
                                        className="bg-white radius-circle px-2 cursor-pointer"
                                        title={
                                          data?.payload?.tech_lang_keys[53]
                                        }
                                      >
                                        ?
                                      </span>
                                    </td>
                                    <td className="border-md-b p-2 text-end">
                                      <strong>{result?.tech_RMR}</strong>{" "}
                                      <span className="text-[14px]">
                                        Kcal/day
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Right Table */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-6 overflow-auto px-2">
                              <table className="w-full px-3" cellSpacing="0">
                                <tbody>
                                  <tr>
                                    <td className="border-b p-2">
                                      BMI&nbsp;
                                      <span
                                        className="bg-white radius-circle px-2 cursor-pointer"
                                        title={
                                          data?.payload?.tech_lang_keys[89]
                                        }
                                      >
                                        ?
                                      </span>
                                    </td>
                                    <td className="border-b p-2 text-end">
                                      <strong>{result?.tech_BMI}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b p-2">
                                      PAL&nbsp;
                                      <span
                                        className="bg-white radius-circle px-2 cursor-pointer"
                                        title={
                                          data?.payload?.tech_lang_keys[52]
                                        }
                                      >
                                        ?
                                      </span>
                                    </td>
                                    <td className="border-b p-2 text-end">
                                      <strong>{result?.tech_activity}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="p-2">
                                      IBW&nbsp;
                                      <span
                                        className="bg-white radius-circle px-2 cursor-pointer"
                                        title={
                                          data?.payload?.tech_lang_keys[55]
                                        }
                                      >
                                        ?
                                      </span>
                                    </td>
                                    <td className="p-2 text-end">
                                      <strong>{result?.tech_ibw}</strong>{" "}
                                      <span>
                                        {result?.tech_formData?.tech_unit_type}
                                      </span>
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

export default CalorieDeficitCalculator;

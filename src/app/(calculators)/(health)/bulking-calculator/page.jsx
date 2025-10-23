"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController, // Add this import
  ArcElement, // Also need ArcElement for doughnut charts
} from "chart.js";

Chart.register(
  LineElement,
  LineController,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController, // Register DoughnutController
  ArcElement // Register ArcElement
);

import {
  useGetSingleCalculatorDetailsMutation,
  useBulkingCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BulkingCalculator = () => {
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
    tech_unit_type: "imperial", // imperial  metric
    tech_gender: "Female",
    tech_age: 25,
    tech_height_ft: 60,
    tech_height_cm: 175.26,
    tech_weight: 170,
    tech_weight1: 10,
    tech_activity: "ext",
    tech_surplus: "0.15",
    tech_stype: "Incal",
    tech_kal_day: 12,
    tech_per_cal: null,
    tech_start: "2025-05-06",
    tech_target: "2025-08-04",
    tech_percent: 3,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBulkingCalculatorMutation();

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
        tech_height_ft: formData.tech_height_ft,
        tech_height_cm: formData.tech_height_cm,
        tech_weight: formData.tech_weight,
        tech_weight1: formData.tech_weight1,
        tech_activity: formData.tech_activity,
        tech_surplus: formData.tech_surplus,
        tech_stype: formData.tech_stype,
        tech_kal_day: formData.tech_kal_day,
        tech_per_cal: formData.tech_per_cal,
        tech_start: formData.tech_start,
        tech_target: formData.tech_target,
        tech_percent: formData.tech_percent,
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
      tech_unit_type: "imperial", // imperial  metric
      tech_gender: "Female",
      tech_age: 25,
      tech_height_ft: 60,
      tech_height_cm: 175.26,
      tech_weight: 170,
      tech_weight1: 10,
      tech_activity: "ext",
      tech_surplus: "0.15",
      tech_stype: "Incal",
      tech_kal_day: 12,
      tech_per_cal: null,
      tech_start: "2025-05-06",
      tech_target: "2025-08-04",
      tech_percent: 3,
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

  // chart js 1
  // Line chart refs
  const lineChartRef = useRef(null);
  const lineChartInstance = useRef(null);

  // Doughnut chart refs
  const doughnutChartRef = useRef(null);
  const doughnutChartInstance = useRef(null);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!lineChartRef.current) return;

    const ctx = lineChartRef.current.getContext("2d");
    if (lineChartInstance.current) lineChartInstance.current.destroy();

    const days = parseInt(result?.tech_days || 0);
    const startingWeight = parseFloat(formData?.tech_weight || 0);
    const poundsDaily = parseFloat(result?.tech_PoundsDaily || 0);
    const isGain = result?.tech_want === "2";

    const labels = [];
    const dataPoints = [];

    let weight = startingWeight;
    for (let i = 1; i <= days; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      labels.push(
        futureDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })
      );
      dataPoints.push(parseFloat(weight.toFixed(2)));
      weight += isGain ? poundsDaily : -poundsDaily;
    }

    lineChartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Weight",
            data: dataPoints,
            borderColor: "#623a6c",
            backgroundColor: "rgb(0 36 255 / 68%)",
            tension: 0.4,
            pointRadius: 3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { mode: "index", intersect: false },
          datalabels: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: data?.payload?.tech_lang_keys?.["1"] || "Day",
            },
          },
          y: {
            title: {
              display: true,
              text: data?.payload?.tech_lang_keys?.["weight"] || "Weight",
            },
            ticks: {
              callback: function (value) {
                return Math.abs(value);
              },
            },
          },
        },
      },
    });

    return () => {
      if (lineChartInstance.current) lineChartInstance.current.destroy();
    };
  }, [result, formData?.tech_weight]);

  // chart js 1

  // chart js 2

  //  const chartRef1 = useRef(null);
  // const chartInstance = useRef(null);

  const [macroType, setMacroType] = useState("1");
  const [macros, setMacros] = useState({
    fat: result?.tech_fat || 0,
    protein: result?.tech_po || 0,
    carbs: result?.tech_cb || 0,
  });

  const calculateMacros = (type) => {
    const cal = Number(result?.tech_CaloriesDaily) || 0;
    let fat = 0,
      protein = 0,
      carbs = 0;

    switch (type) {
      case "1":
        fat = Math.round((cal / 9) * 0.2);
        protein = Math.round((cal / 4) * 0.3);
        carbs = Math.round((cal / 4) * 0.5);
        break;
      case "2":
        fat = Math.round((cal / 9) * 0.2);
        protein = Math.round((cal / 4) * 0.4);
        carbs = Math.round((cal / 4) * 0.4);
        break;
      case "3":
        fat = Math.round(((cal / 9) * 0.3 * 100) / 100);
        protein = Math.round(((cal / 4) * 0.3 * 100) / 100);
        carbs = Math.round(((cal / 4) * 0.4 * 100) / 100);
        break;
      case "4":
        fat = Math.round(((cal / 9) * 0.35 * 100) / 100);
        protein = Math.round(((cal / 4) * 0.45 * 100) / 100);
        carbs = Math.round(((cal / 4) * 0.2 * 100) / 100);
        break;
      case "5":
        fat = Math.round(((cal / 9) * 0.7 * 100) / 100);
        protein = Math.round(((cal / 4) * 0.25 * 100) / 100);
        carbs = Math.round(((cal / 4) * 0.05 * 100) / 100);
        break;
      default:
        fat = result?.tech_fat || 0;
        protein = result?.tech_po || 0;
        carbs = result?.tech_cb || 0;
    }

    setMacros({ fat, protein, carbs });
  };

  useEffect(() => {
    calculateMacros(macroType);
  }, [macroType, result]);

  useEffect(() => {
    if (!doughnutChartRef.current) return;

    const ctx = doughnutChartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "doughnut", // yahan 'bar' se 'doughnut' kar diya
      data: {
        labels: ["CARBS", "PROTEIN", "FATS"],
        datasets: [
          {
            labels: "Grams",
            data: [macros.carbs, macros.protein, macros.fat],
            backgroundColor: ["#6366F1", "#3B82F6", "#06B6D4"],
            hoverOffset: 30, // optional, hover effect ko thoda bada karta hai
          },
        ],
      },

      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" }, // legend ko niche rakhna
          tooltip: { enabled: true },
          datalabels: {
            display: false, // ✅ Disable value labels on bars
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [macros]);

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-l3 space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[90%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-12 md:col-span-6 lg:col-span-6"></div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <div className=" mx-auto mt-2  w-full">
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
                              formData.tech_unit_type === "imperial"
                                ? "tagsUnit"
                                : ""
                            }`}
                            id="imperial"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                tech_unit_type: "imperial",
                              });
                              setResult(null);
                              setFormError(null);
                            }}
                          >
                            {data?.payload?.tech_lang_keys["imperial"]}
                          </div>
                        </div>
                        {/* Time Cal Tab */}
                        <div className="lg:w-1/2 w-full px-2 py-1">
                          <div
                            className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                              formData.tech_unit_type === "metric"
                                ? "tagsUnit"
                                : ""
                            }`}
                            id="metric"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                tech_unit_type: "metric",
                              });
                              setResult(null);
                              setFormError(null);
                            }}
                          >
                            {data?.payload?.tech_lang_keys["metric"]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-6">
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
              {formData.tech_unit_type == "imperial" && (
                <>
                  <div className="col-span-6 ft_in">
                    <label htmlFor="tech_height_ft" className="label">
                      {data?.payload?.tech_lang_keys["height"]} :
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_height_ft"
                        id="tech_height_ft"
                        value={formData.tech_height_ft}
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
              {formData.tech_unit_type == "metric" && (
                <>
                  <div className="col-span-6 change_h_u ">
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
                      <span className=" input_unit">cm</span>
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
                  {formData.tech_unit_type == "imperial" && (
                    <>
                      <span className=" input_unit">lbs</span>
                    </>
                  )}
                  {formData.tech_unit_type == "metric" && (
                    <>
                      <span className=" input_unit">kg</span>
                    </>
                  )}
                </div>
              </div>
              <div className="md:col-span-6 col-span-12">
                <label htmlFor="tech_weight1" className="label">
                  {data?.payload?.tech_lang_keys["i_want"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_weight1"
                    id="tech_weight1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_weight1}
                    onChange={handleChange}
                  />
                  {formData.tech_unit_type == "imperial" && (
                    <>
                      <span className=" input_unit">lbs</span>
                    </>
                  )}
                  {formData.tech_unit_type == "metric" && (
                    <>
                      <span className=" input_unit">kg</span>
                    </>
                  )}
                </div>
              </div>
              <div className="md:col-span-6 col-span-12">
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
                    <option value="sedentary">
                      {data?.payload?.tech_lang_keys["No_sport"]}{" "}
                    </option>
                    <option value="Lightly_Active">
                      {data?.payload?.tech_lang_keys["Light_activity"]}{" "}
                    </option>
                    <option value="Moderately_Active">
                      {data?.payload?.tech_lang_keys["Moderate_activity"]}{" "}
                    </option>
                    <option value="Very_Active">
                      {data?.payload?.tech_lang_keys["High_activity"]}{" "}
                    </option>
                    <option value="ext">
                      {data?.payload?.tech_lang_keys["Extreme_activity"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_surplus" className="label">
                      {data?.payload?.tech_lang_keys["48"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_surplus"
                        id="tech_surplus"
                        value={formData.tech_surplus}
                        onChange={handleChange}
                      >
                        <option value="0.10">
                          {data?.payload?.tech_lang_keys["49"]}{" "}
                        </option>
                        <option value="0.15">
                          {data?.payload?.tech_lang_keys["50"]}{" "}
                        </option>
                        <option value="0.20">
                          {data?.payload?.tech_lang_keys["51"]}{" "}
                        </option>
                        <option value="custom">
                          {data?.payload?.tech_lang_keys["52"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {formData.tech_surplus == "custom" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 surplus ">
                    <div className="col-12 ps-2 mt-2">
                      <p className="font-s-14 pe-2 pe-lg-3 mb-1">
                        <strong>{data?.payload?.tech_lang_keys["53"]}: </strong>
                      </p>
                      <label className="pe-2" htmlFor="Incal">
                        <input
                          type="radio"
                          name="tech_stype"
                          value="Incal"
                          id="Incal"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={formData.tech_stype === "Incal"}
                        />
                        <span>{data?.payload?.tech_lang_keys["54"]}</span>
                      </label>
                      <label className="pe-2" htmlFor="per_cal">
                        <input
                          type="radio"
                          name="tech_stype"
                          value="per_cal"
                          id="per_cal"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={formData.tech_stype === "per_cal"}
                        />
                        <span>{data?.payload?.tech_lang_keys["55"]}</span>
                      </label>
                    </div>
                    {formData.tech_stype == "Incal" && (
                      <>
                        <div className="w-full py-2 relative kal_day">
                          <label htmlFor="tech_kal_day" className="label">
                            {data?.payload?.tech_lang_keys["i_want"]}:
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_kal_day"
                              id="tech_kal_day"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_kal_day}
                              onChange={handleChange}
                            />
                            <span className=" input_unit">kcal/day</span>
                          </div>
                        </div>
                      </>
                    )}
                    {formData.tech_stype == "per_cal" && (
                      <>
                        <div className="w-full py-2 relative " id="pre_cal">
                          <label htmlFor="tech_per_cal" className="label">
                            {" "}
                            {data?.payload?.tech_lang_keys["i_want"]}:{" "}
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_per_cal"
                              id="tech_per_cal"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_per_cal}
                              onChange={handleChange}
                            />
                            <span className=" input_unit">%</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
              <div className="col-span-12 my-2">
                <strong className="text-[#2845F5]">
                  {data?.payload?.tech_lang_keys["to_achieve"]}?
                </strong>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <div className="grid grid-cols-12  gap-2">
                  <div className="col-span-6">
                    <div className=" relative">
                      <input
                        type="date"
                        step="any"
                        name="tech_start"
                        id="tech_start"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_start}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className=" relative">
                      <input
                        type="date"
                        step="any"
                        name="tech_target"
                        id="tech_target"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_target}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 body_percent">
                <label htmlFor="tech_percent" className="label">
                  {data?.payload?.tech_lang_keys["body_fat"]}{" "}
                  <a
                    title="Body Fat Percentage Calculator"
                    href="/body-fat-percentage-calculator"
                    className="underline"
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
                  <span className=" input_unit">%</span>
                </div>
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
                    <div className="w-full md:p-3 mt-3">
                      <div className="w-full">
                        <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                          {/* Calories Daily */}
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex items-center justify-between bg-sky bordered rounded-lg px-3 py-2">
                              <div>
                                <strong className="md:text-[20px] text-[16px] text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["39"]}
                                </strong>
                              </div>
                              <div className="border-s-dark ps-2">
                                <div>
                                  <strong className="text-[#119154] text-[20px]">
                                    {result?.tech_CaloriesDaily}
                                  </strong>
                                </div>
                                <div>
                                  {data?.payload?.tech_lang_keys["c/d"]}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Calories Less */}
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex items-center justify-between bg-sky bordered rounded-lg px-3 py-2">
                              <div>
                                <strong className="md:text-[20px] text-[16px] text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </strong>
                              </div>
                              <div className="border-s-dark ps-2">
                                <div>
                                  <strong className="text-[#119154] text-[20px]">
                                    {result?.tech_CaloriesLess}
                                  </strong>
                                </div>
                                <div>
                                  {data?.payload?.tech_lang_keys["c/d"]}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* BMR */}
                          <div className="col-span-12">
                            <div className="flex items-center justify-between bg-sky bordered rounded-lg px-3 py-2">
                              <div className="border-end pe-2 pe-lg-3">
                                <div className="mb-1">
                                  <strong className="md:text-[20px] text-[16px] text-[#2845F5]">
                                    {data?.payload?.tech_lang_keys["22"]}
                                  </strong>
                                </div>
                                <div>{data?.payload?.tech_lang_keys["56"]}</div>
                              </div>
                              <div className="ps-2 ps-lg-3">
                                <div>
                                  <strong className="text-[#119154] text-[20px]">
                                    {result?.tech_BMR}
                                  </strong>
                                </div>
                                <div>
                                  {data?.payload?.tech_lang_keys["c/d"]}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* TDEE */}
                          <div className="col-span-12">
                            <div className="flex items-center justify-between bg-sky bordered rounded-lg px-3 py-2">
                              <div className="border-end pe-2 pe-lg-3">
                                <div className="mb-1">
                                  <strong className="md:text-[20px] text-[16px] text-[#2845F5]">
                                    TDEE
                                  </strong>
                                </div>
                                <div>{data?.payload?.tech_lang_keys["57"]}</div>
                              </div>
                              <div className="ps-2 ps-lg-3">
                                <div>
                                  <strong className="text-[#119154] text-[20px]">
                                    {result?.tech_Calories}
                                  </strong>
                                </div>
                                <div>
                                  {data?.payload?.tech_lang_keys["c/d"]}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Days */}
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex items-center justify-between bg-sky bordered rounded-lg px-3 py-2">
                              <div>
                                <strong className="md:text-[20px] text-[16px] text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["40"]}
                                </strong>
                              </div>
                              <div className="border-s-dark ps-2 ps-lg-3">
                                <div>
                                  <strong className="text-[#119154] text-[20px]">
                                    {result?.tech_days}
                                  </strong>
                                </div>
                                <div>{data?.payload?.tech_lang_keys["1"]}</div>
                              </div>
                            </div>
                          </div>

                          {/* Target Date */}
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div
                              className="flex items-center justify-between bg-sky bordered rounded-lg px-3 py-3"
                              style={{ minHeight: "64px" }}
                            >
                              <div>
                                <strong className="md:text-[20px] text-[16px] text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["Target_Date"]}
                                </strong>
                              </div>
                              <div className="border-s-dark ps-2">
                                <div>
                                  <strong className="text-[#119154] text-[20px]">
                                    {(() => {
                                      const days = parseInt(
                                        result?.tech_days || 0,
                                        10
                                      );
                                      const futureDate = new Date();
                                      futureDate.setDate(
                                        futureDate.getDate() + days
                                      );
                                      return futureDate.toLocaleDateString(
                                        "en-GB",
                                        {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        }
                                      ); // e.g., 29-Jun-2025
                                    })()}
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="mt-2">
                          <strong className="md:text-[20px] text-[16px] text-[#2845F5]">
                            {data?.payload?.tech_lang_keys[58]}
                          </strong>
                        </p>
                        <p className="">{data?.payload?.tech_lang_keys[59]}</p>
                        <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4 my-4">
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <strong className="text-[#2845F5]">
                              {data?.payload?.tech_lang_keys[60]}
                            </strong>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="w-full ms-auto">
                              <select
                                name="macro"
                                id="macro"
                                value={macroType}
                                onChange={(e) => setMacroType(e.target.value)}
                                className="input"
                              >
                                <option value="1">
                                  {data?.payload?.tech_lang_keys[61]}
                                </option>
                                <option value="2">
                                  {data?.payload?.tech_lang_keys[62]}
                                </option>
                                <option value="3">
                                  {data?.payload?.tech_lang_keys[63]}
                                </option>
                                <option value="4">
                                  {data?.payload?.tech_lang_keys[64]}
                                </option>
                                <option value="5">
                                  {data?.payload?.tech_lang_keys[65]}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="w-full mx-auto">
                          <div className="flex  items-center justify-between bg-sky bordered rounded-lg p-3 overflow-auto">
                            <div className="px-3">
                              <div className="mb-1">
                                <strong className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys[44]}
                                </strong>
                              </div>
                              <div>
                                <strong className="cbval font-s-25">
                                  {macros.carbs}
                                </strong>
                                <span>{data?.payload?.tech_lang_keys[45]}</span>
                              </div>
                            </div>
                            <div className="border-md-end py-2">&nbsp;</div>
                            <div className="px-3">
                              <div className="mb-1">
                                <strong className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys[46]}
                                </strong>
                              </div>
                              <div>
                                <strong className="poval font-s-25">
                                  {macros.protein}
                                </strong>
                                <span>{data?.payload?.tech_lang_keys[45]}</span>
                              </div>
                            </div>
                            <div className="border-md-end py-2">&nbsp;</div>
                            <div className="px-3">
                              <div className="mb-1">
                                <strong className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys[47]}
                                </strong>
                              </div>
                              <div>
                                <strong className="fatval font-s-25">
                                  {macros.fat}
                                </strong>
                                <span>{data?.payload?.tech_lang_keys[45]}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {result?.tech_HighRiskCalories == "1" && (
                          <>
                            <p className="text-[18px] col s12 padding_10">
                              <strong className="red-text">
                                {data?.payload?.tech_lang_keys["3"]}!
                              </strong>
                              {data?.payload?.tech_lang_keys["4"]}{" "}
                              {result?.tech_CaloriesLess}{" "}
                              {data?.payload?.tech_lang_keys["c/d"]} ,{" "}
                              {data?.payload?.tech_lang_keys["5"]}
                              {result?.tech_CaloriesDaily}{" "}
                              {data?.payload?.tech_lang_keys["6"]}!
                            </p>
                          </>
                        )}
                        <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4 my-4">
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <p className="ps-3">
                              <strong className="text-[#2845F5] text-[20px]">
                                {data?.payload?.tech_lang_keys["10"]}
                              </strong>
                            </p>
                            <div id="container1" className="mt-3">
                              <canvas
                                ref={lineChartRef}
                                className="mt-3"
                                style={{ width: "100%", height: "300px" }}
                              />
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6 lg:col-span-6 border-l">
                            <p className="ps-3">
                              <strong className="text-[#2845F5] text-[20px]">
                                MACRO
                              </strong>
                            </p>
                            <div id="container2">
                              <div className="col-span-12 md:col-span-6">
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "250px",
                                  }}
                                >
                                  <canvas
                                    ref={doughnutChartRef}
                                    width={250}
                                    height={250}
                                    style={{ width: "250px", height: "250px" }}
                                  />
                                </div>
                              </div>
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

export default BulkingCalculator;

"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement, // Add this import
} from "chart.js";

Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement
);

import {
  useGetSingleCalculatorDetailsMutation,
  useMaintenanceCalorieCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MaintenanceCalorieCalculator = () => {
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
    tech_unit_type: "kg", //  kg  lbs
    tech_gender: "Male",
    tech_age: 23,
    tech_ft_in: 69,
    tech_height_cm: 175.26,
    tech_weight: 92.97,
    tech_activity: "Sedentary",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMaintenanceCalorieCalculatorMutation();

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
        tech_activity: formData.tech_activity,
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
      tech_unit_type: "kg", //  kg  lbs
      tech_gender: "Male",
      tech_age: 23,
      tech_ft_in: 69,
      tech_height_cm: 175.26,
      tech_weight: 92.97,
      tech_activity: "Sedentary",
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

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [macroType, setMacroType] = useState("1");
  const [macros, setMacros] = useState({
    fat: result?.tech_fat || 0,
    protein: result?.tech_po || 0,
    carbs: result?.tech_cb || 0,
  });

  const calculateMacros = (type) => {
    const cal = Number(result?.tech_Calories) || 0;
    let fat = 0,
      protein = 0,
      carbs = 0;

    switch (type) {
      case "1":
        fat = Math.round((cal * 0.2) / 9);
        protein = Math.round((cal * 0.3) / 4);
        carbs = Math.round((cal * 0.5) / 4);
        break;
      case "2":
        fat = Math.round((cal * 0.2) / 9);
        protein = Math.round((cal * 0.4) / 4);
        carbs = Math.round((cal * 0.4) / 4);
        break;
      case "3":
        fat = Math.round((cal * 0.3) / 9);
        protein = Math.round((cal * 0.3) / 4);
        carbs = Math.round((cal * 0.4) / 4);
        break;
      case "4":
        fat = Math.round((cal * 0.35) / 9);
        protein = Math.round((cal * 0.45) / 4);
        carbs = Math.round((cal * 0.2) / 4);
        break;
      case "5":
        fat = Math.round((cal * 0.7) / 9);
        protein = Math.round((cal * 0.25) / 4);
        carbs = Math.round((cal * 0.05) / 4);
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
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

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

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6 flex items-end justify-center">
                <input
                  type="hidden"
                  name="tech_unit_type"
                  id="calculator_time"
                  value={formData.tech_unit_type}
                />
                <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
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
                      {data?.payload?.tech_lang_keys["4"]}
                    </div>
                  </div>
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
                      {data?.payload?.tech_lang_keys["5"]}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="Female">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["34"]}:
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
                      {data?.payload?.tech_lang_keys["6"]} (ft/in):
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
                      {data?.payload?.tech_lang_keys["6"]} (cm):
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
                        min="1"
                        value={formData.tech_height_cm}
                        onChange={handleChange}
                      />
                      <span className="input_unit">cm</span>
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-6">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["7"]}{" "}
                  <span className="text-blue text">(lbs)</span>
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
                    min="1"
                    value={formData.tech_weight}
                    onChange={handleChange}
                  />
                  {formData.tech_unit_type == "lbs" && (
                    <>
                      <span className="input_unit">lbs</span>
                    </>
                  )}
                  {formData.tech_unit_type == "kg" && (
                    <>
                      <span className="input_unit">kg</span>
                    </>
                  )}
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_activity" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
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
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                    <option value="Lightly Active">
                      {data?.payload?.tech_lang_keys["10"]}{" "}
                    </option>
                    <option value="Moderately Active">
                      {data?.payload?.tech_lang_keys["11"]}{" "}
                    </option>
                    <option value="Very Active">
                      {data?.payload?.tech_lang_keys["12"]}{" "}
                    </option>
                    <option value="Extremely Active">
                      {data?.payload?.tech_lang_keys["13"]}{" "}
                    </option>
                  </select>
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
                    <div className="w-fill mt-3">
                      <div className="col-12 text-[14px] md:text-[18px]">
                        <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4 my-4">
                          <div className="col-span-12">
                            <div className="flex items-center justify-between bg-sky bordered rounded-lg px-3 py-2">
                              <div className="mb-3 mb-md-0">
                                <p>
                                  <strong className="text-[20px] text-[#2845F5]">
                                    {data?.payload?.tech_lang_keys["33"]}
                                  </strong>
                                </p>
                                <p>{data?.payload?.tech_lang_keys[14]}.</p>
                              </div>
                              <div className="border-s-dark ps-2">
                                <div>
                                  <strong className="text-[#119154] md:text-[25px]">
                                    {result?.tech_Calories}
                                  </strong>
                                </div>
                                <div>
                                  Kcal/{data?.payload?.tech_lang_keys["15"]}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-12">
                            <div className="flex items-center justify-between bg-sky bordered rounded-lg px-3 py-2">
                              <div className="mb-3 mb-md-0">
                                <p>
                                  <strong className="text-[20px] text-[#2845F5]">
                                    BMR
                                  </strong>
                                </p>
                                <p>{data?.payload?.tech_lang_keys[16]}.</p>
                              </div>
                              <div className="border-s-dark ps-2">
                                <div>
                                  <strong className="text-[#119154] md:text-[25px]">
                                    {result?.tech_BMR}
                                  </strong>
                                </div>
                                <div>
                                  Kcal/{data?.payload?.tech_lang_keys["15"]}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-12">
                            <div className="flex items-center justify-between bg-sky bordered rounded-lg px-3 py-2">
                              <div className="mb-3 mb-md-0">
                                <p>
                                  <strong className="text-[20px] text-[#2845F5]">
                                    RMR
                                  </strong>
                                </p>
                                <p>{data?.payload?.tech_lang_keys[17]}.</p>
                              </div>
                              <div className="border-s-dark ps-2">
                                <div>
                                  <strong className="text-[#119154] md:text-[25px]">
                                    {result?.tech_rmr}
                                  </strong>
                                </div>
                                <div>
                                  Kcal/{data?.payload?.tech_lang_keys["15"]}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-12">
                            <div className="flex items-center justify-between bg-sky bordered rounded-lg px-3 py-2">
                              <div className="mb-3 mb-md-0">
                                <p>
                                  <strong className="text-[20px] text-[#2845F5]">
                                    BMI
                                  </strong>
                                </p>
                                <p>{data?.payload?.tech_lang_keys[18]}.</p>
                              </div>
                              <div className="border-s-dark ps-2">
                                <div>
                                  <strong className="text-[#119154] md:text-[25px]">
                                    {result?.tech_BMI}
                                  </strong>
                                </div>
                                <div>
                                  Kg/m<sup>2</sup>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-12">
                            <div className="flex items-center justify-between bg-sky bordered rounded-lg px-3 py-2">
                              <div className="mb-3 mb-md-0">
                                <p>
                                  <strong className="text-[20px] text-[#2845F5]">
                                    IBW
                                  </strong>
                                </p>
                                <p>{data?.payload?.tech_lang_keys[19]}.</p>
                              </div>
                              <div className="border-s-dark ps-2">
                                <div>
                                  <strong className="text-[#119154] md:text-[25px]">
                                    {result?.tech_ibw}
                                  </strong>
                                </div>
                                <div>{result?.tech_submit}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2">
                          <strong className="text-[20px] text-[#2845F5]">
                            {data?.payload?.tech_lang_keys[20]}
                          </strong>
                        </p>
                        <p>
                          {data?.payload?.tech_lang_keys[21]}{" "}
                          <strong>{result?.tech_Calories}</strong> Kcal/
                          {data?.payload?.tech_lang_keys[15]}
                        </p>
                        <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4 my-4">
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <strong className="text-[#2845F5]">
                              {data?.payload?.tech_lang_keys[22]}
                            </strong>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex justify-between items-center mb-4">
                              <select
                                id="macro"
                                className="input"
                                value={macroType}
                                onChange={(e) => setMacroType(e.target.value)}
                              >
                                <option value="1">
                                  {data?.payload?.tech_lang_keys[23]} -
                                  50C/30P/20F
                                </option>
                                <option value="2">
                                  {data?.payload?.tech_lang_keys[24]} -
                                  40C/40P/20F
                                </option>
                                <option value="3">
                                  {data?.payload?.tech_lang_keys[25]} -
                                  40C/30P/30F
                                </option>
                                <option value="4">
                                  {data?.payload?.tech_lang_keys[26]} -
                                  20C/45P/35F
                                </option>
                                <option value="5">
                                  {data?.payload?.tech_lang_keys[27]} -
                                  5C/25P/70F
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 bordered rounded-xl p-4 bg-[#F6FAFC]">
                          {/* Left side values */}
                          <div className="col-span-12 md:col-span-5">
                            <div className="px-3 border-b-1 py-3">
                              <strong className="text-[#2845F5]">
                                {data?.payload?.tech_lang_keys[29]}
                              </strong>
                              <div>
                                <strong className="cbval text-[25px]">
                                  {macros.carbs}
                                </strong>{" "}
                                {data?.payload?.tech_lang_keys[28]}
                              </div>
                            </div>
                            <div className="px-3 border-b-1 py-3">
                              <strong className="text-[#2845F5]">
                                {data?.payload?.tech_lang_keys[30]}
                              </strong>
                              <div>
                                <strong className="poval text-[25px]">
                                  {macros.protein}
                                </strong>{" "}
                                {data?.payload?.tech_lang_keys[28]}
                              </div>
                            </div>
                            <div className="px-3 pt-3">
                              <strong className="text-[#2845F5]">
                                {data?.payload?.tech_lang_keys[31]}
                              </strong>
                              <div>
                                <strong className="fatval text-[25px]">
                                  {macros.fat}
                                </strong>{" "}
                                {data?.payload?.tech_lang_keys[28]}
                              </div>
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="col-span-1 border-r-1 hidden md:block" />

                          {/* Right side chart */}
                          <div className="col-span-12 md:col-span-6">
                            <label
                              htmlFor="macro"
                              className="text-[#2845F5] font-bold"
                            >
                              Macro Ratio
                            </label>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "250px", // optional, container height
                              }}
                            >
                              <canvas
                                ref={chartRef}
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

export default MaintenanceCalorieCalculator;

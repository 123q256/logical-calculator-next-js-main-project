"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import {
  useGetSingleCalculatorDetailsMutation,
  useHarrisBenedictCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HarrisBenedictEquationCalculator = () => {
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
    tech_age: 45,
    tech_gender: "female", // male  female
    tech_height_ft: 5,
    tech_unit_ft_in: "cm",
    tech_height_in: 12,
    tech_unit_h: "cm",
    tech_height_cm: "175.26",
    tech_unit_h_cm: "ft/in",
    tech_weight: "175.26",
    tech_unit: "lbs",
    tech_activity: 1.9,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHarrisBenedictCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_age || !formData.tech_gender) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_age: formData.tech_age,
        tech_height_ft: formData.tech_height_ft,
        tech_gender: formData.tech_gender,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_height_in: formData.tech_height_in,
        tech_unit_h: formData.tech_unit_h,
        tech_height_cm: formData.tech_height_cm,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_weight: formData.tech_weight,
        tech_unit: formData.tech_unit,
        tech_activity: formData.tech_activity,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_age: 45,
      tech_gender: "female", // male  female
      tech_height_ft: 5,
      tech_unit_ft_in: "cm",
      tech_height_in: 12,
      tech_unit_h: "cm",
      tech_height_cm: "175.26",
      tech_unit_h_cm: "ft/in",
      tech_weight: "175.26",
      tech_unit: "lbs",
      tech_activity: 1.9,
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

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h: unit,
      tech_unit_ft_in: unit,
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 2
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: unit,
      tech_unit_ft_in: unit,
    }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  // chart js

  const chartdata = {
    labels: ["Carbohydrates", "Protein", "Fat"],
    datasets: [
      {
        label: "Macronutrients",
        data: [
          result?.tech_carb_per || 0,
          result?.tech_pro_per || 0,
          result?.tech_fats_per || 0,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_age"
                    id="tech_age"
                    className=" input mt-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_age}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
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
                    <option value="male">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="female">
                      {data?.payload?.tech_lang_keys["4"]}
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
                  <div className="col-span-6 md:col-span-3 lg:col-span-3 ft_in">
                    <label htmlFor="tech_height_ft" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
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
                  <div className="col-span-6 md:col-span-3 lg:col-span-3 ft_in">
                    <label htmlFor="tech_height_in" className="label">
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
                        className="absolute cursor-pointer text-sm underline right-4 top-5"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_unit_h} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inch (in)", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
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
              {(formData.tech_unit_ft_in == "m" ||
                formData.tech_unit_ft_in == "cm" ||
                formData.tech_unit_ft_in == "in" ||
                formData.tech_unit_ft_in == "ft") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  h_cm">
                    <label htmlFor="tech_height_cm" className="label">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                      {formData.tech_unit_ft_in == "m" ? (
                        <span className="text-blue height_unit">(m)</span>
                      ) : formData.tech_unit_ft_in == "cm" ? (
                        <span className="text-blue height_unit">(cm)</span>
                      ) : formData.tech_unit_ft_in == "in" ? (
                        <span className="text-blue height_unit">(in)</span>
                      ) : formData.tech_unit_ft_in == "ft" ? (
                        <span className="text-blue height_unit">(ft)</span>
                      ) : null}
                    </label>
                    <div className="relative w-full mt-1 ">
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
                        className="absolute cursor-pointer text-sm underline right-4 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_unit_h_cm} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inch (in)", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
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
                </>
              )}

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
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
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "stone", value: "stone" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_activity" className="label">
                  PAL (optional):
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
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="1.375">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="1.55">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="1.725">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="1.9">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <span>{data?.payload?.tech_lang_keys[7]}:</span>
                <span>
                  <a
                    className="text-[#2845F5] px-1 text-[14px] text-decoration-none"
                    href="/calculator/bmr-calculator"
                    target="_blank"
                    rel="noopener"
                  >
                    BMR Calculator
                  </a>
                </span>
                ,
                <span>
                  <a
                    className="text-[#2845F5] text-[14px] text-decoration-none"
                    href="/calculator/macro-calculator"
                    target="_blank"
                    rel="noopener"
                  >
                    Macro Calculator
                  </a>
                </span>
                ,
                <span>
                  <a
                    className="text-[#2845F5] text-[14px] text-decoration-none"
                    href="/calculator/weightloss-calculator"
                    target="_blank"
                    rel="noopener"
                  >
                    Weight loss Calculator
                  </a>
                </span>
              </div>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                          <div className="col-span-12">
                            <div className="flex items-center bg-sky bordered rounded-lg  p-3">
                              <strong>
                                BMR ={" "}
                                <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                  {result?.tech_bmr_ans}
                                </span>{" "}
                                kcal/day
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12">
                            <div className="flex items-center bg-sky bordered rounded-lg  p-3">
                              <strong>
                                {data?.payload?.tech_lang_keys[8]} ={" "}
                                <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                  {result?.tech_tee}
                                </span>{" "}
                                kcal/day
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex items-center bg-sky bordered rounded-lg  p-3">
                              <strong>
                                {data?.payload?.tech_lang_keys[9]} ={" "}
                                <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                  {result?.tech_carb_gram_ans}
                                </span>{" "}
                                Grams per day
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex items-center bg-sky bordered rounded-lg  p-3">
                              <strong>
                                {data?.payload?.tech_lang_keys[10]} ={" "}
                                <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                  {result?.tech_pro_gram_ans}
                                </span>{" "}
                                Grams per day
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex items-center bg-sky bordered rounded-lg  p-3">
                              <strong>
                                {data?.payload?.tech_lang_keys[11]} ={" "}
                                <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                  {result?.tech_fats_gram_ans}
                                </span>{" "}
                                Grams per day
                              </strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12 mt-5">
                          <p className="font-s-20 mb-2">
                            <strong className="text-blue">
                              Grams Per Day Percentage Chart
                            </strong>
                          </p>
                          <div className="w-[200px] md:w-[300px] ">
                            <Pie data={chartdata} options={options} />
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

export default HarrisBenedictEquationCalculator;

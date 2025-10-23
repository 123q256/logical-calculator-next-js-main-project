"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Tooltip, Legend, ArcElement);

import {
  useGetSingleCalculatorDetailsMutation,
  useROICalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ROICalculator = ({ invest, returns }) => {
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
    tech_invest: 10,
    tech_return: 20,
    tech_find: "2",
    tech_date: "1",
    tech_s_date: "2025-04-26",
    tech_e_date: "2025-05-03",
    tech_compare: "1",
    tech_invest_compare: 5000,
    tech_return_compare: 3000,
    tech_find_compare: "1",
    tech_date_compare: "1",
    tech_s_date_compare: "2025-04-26",
    tech_e_date_compare: "2025-05-03",
    tech_length_unit_compare: "days",
    tech_length_compare: 30,
    tech_annualized_compare: 3000,
    tech_length_unit: "days",
    tech_length: 30,
    tech_annualized: 20,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useROICalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_invest) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_invest: formData.tech_invest,
        tech_return: formData.tech_return,
        tech_find: formData.tech_find,
        tech_date: formData.tech_date,
        tech_s_date: formData.tech_s_date,
        tech_e_date: formData.tech_e_date,
        tech_compare: formData.tech_compare,
        tech_invest_compare: formData.tech_invest_compare,
        tech_return_compare: formData.tech_return_compare,
        tech_find_compare: formData.tech_find_compare,
        tech_date_compare: formData.tech_date_compare,
        tech_s_date_compare: formData.tech_s_date_compare,
        tech_e_date_compare: formData.tech_e_date_compare,
        tech_length_unit_compare: formData.tech_length_unit_compare,
        tech_length_compare: formData.tech_length_compare,
        tech_annualized_compare: formData.tech_annualized_compare,
        tech_length_unit: formData.tech_length_unit,
        tech_length: formData.tech_length,
        tech_annualized: formData.tech_annualized,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'

      console.log(result?.tech_date);

      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_invest: 10,
      tech_return: 20,
      tech_find: "2",
      tech_date: "1",
      tech_s_date: "2025-04-26",
      tech_e_date: "2025-05-03",
      tech_compare: "1",
      tech_invest_compare: 5000,
      tech_return_compare: 3000,
      tech_find_compare: "1",
      tech_date_compare: "1",
      tech_s_date_compare: "2025-04-26",
      tech_e_date_compare: "2025-05-03",
      tech_length_unit_compare: "days",
      tech_length_compare: 30,
      tech_annualized_compare: 3000,
      tech_length_unit: "days",
      tech_length: 30,
      tech_annualized: 20,
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
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_length_unit_compare: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  // chart js
  // Declare chart data and options outside so they are in scope
  let chartdata = {};
  let options = {};
  let chartdata1 = {};
  let options1 = {};

  let labels = [];
  let values = [];
  let colors = [];

  let labels1 = [];
  let values1 = [];
  let colors1 = [];

  if (formData?.tech_compare === "1") {
    if (formData?.tech_invest <= formData?.tech_return) {
      const invest_per = (formData?.tech_invest / formData?.tech_return) * 100;
      const profit = 100 - invest_per;

      labels = ["Investment", "Profit"];
      values = [invest_per, profit];
      colors = ["#36A2EB", "#4BC0C0"];
    } else {
      const return_per = (formData?.tech_return / formData?.tech_invest) * 100;
      const loss = 100 - return_per;

      labels = ["Remaining", "Loss"];
      values = [return_per, loss];
      colors = ["#FFCE56", "#FF6384"];
    }

    chartdata = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          hoverOffset: 10,
        },
      ],
    };

    options = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.parsed.toFixed(2)}%`;
            },
          },
        },
      },
    };
  } else {
    // Chart 1
    if (formData?.tech_invest <= formData?.tech_return) {
      const invest_per = (formData?.tech_invest / formData?.tech_return) * 100;
      const profit = 100 - invest_per;

      labels = ["Investment", "Profit"];
      values = [invest_per, profit];
      colors = ["#36A2EB", "#4BC0C0"];
    } else {
      const return_per = (formData?.tech_return / formData?.tech_invest) * 100;
      const loss = 100 - return_per;

      labels = ["Remaining", "Loss"];
      values = [return_per, loss];
      colors = ["#FFCE56", "#FF6384"];
    }

    chartdata = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          hoverOffset: 10,
        },
      ],
    };

    options = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.parsed.toFixed(2)}%`;
            },
          },
        },
      },
    };

    // Chart 2 (compare chart)
    if (formData?.tech_invest_compare <= formData?.tech_return_compare) {
      const invest_pers =
        (formData?.tech_invest_compare / formData?.tech_return_compare) * 100;
      const profits = 100 - invest_pers;

      labels1 = ["Investment", "Profit"];
      values1 = [invest_pers, profits];
      colors1 = ["#36A2EB", "#4BC0C0"];
    } else {
      const return_per =
        (formData?.tech_return_compare / formData?.tech_invest_compare) * 100;
      const loss = 100 - return_per;

      labels1 = ["Remaining", "Loss"];
      values1 = [return_per, loss];
      colors1 = ["#FFCE56", "#FF6384"];
    }

    chartdata1 = {
      labels: labels1,
      datasets: [
        {
          data: values1,
          backgroundColor: colors1,
          hoverOffset: 10,
        },
      ],
    };

    options1 = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.parsed.toFixed(2)}%`;
            },
          },
        },
      },
    };
  }

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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12" id="main_div">
                <div className="grid grid-cols-12 mt-3  gap-4">
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="basic_1"
                  >
                    <label htmlFor="tech_invest" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_invest"
                        id="tech_invest"
                        className="input my-2"
                        aria-label="input"
                        min="1"
                        value={formData.tech_invest}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="basic_2"
                  >
                    <label htmlFor="tech_return" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_return"
                        id="tech_return"
                        className="input my-2"
                        aria-label="input"
                        min="1"
                        value={formData.tech_return}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="optional"
                  >
                    <label htmlFor="tech_find" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_find"
                        id="tech_find"
                        value={formData.tech_find}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["7"]} ROI
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["8"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>

                  {formData.tech_find == 1 ? (
                    <>
                      <div
                        className="col-span-12 md:col-span-6 lg:col-span-6 se_date"
                        id="select_date"
                      >
                        <label htmlFor="tech_date" className="label">
                          {data?.payload?.tech_lang_keys["9"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_date"
                            id="tech_date"
                            value={formData.tech_date}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["10"]}{" "}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["11"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                      {formData.tech_date == 1 ? (
                        <>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 se_date date_start">
                            <label htmlFor="tech_s_date" className="label">
                              {data?.payload?.tech_lang_keys["12"]} :
                            </label>
                            <div className=" relative">
                              <input
                                type="date"
                                step="any"
                                name="tech_s_date"
                                id="tech_s_date"
                                className="input my-2"
                                aria-label="input"
                                placeholder="mm/dd/yyyy"
                                value={formData.tech_s_date}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 se_date date_start">
                            <label htmlFor="tech_e_date" className="label">
                              {data?.payload?.tech_lang_keys["13"]} :
                            </label>
                            <div className=" relative">
                              <input
                                type="date"
                                step="any"
                                name="tech_e_date"
                                id="tech_e_date"
                                className="input my-2"
                                aria-label="input"
                                placeholder="mm/dd/yyyy"
                                value={formData.tech_e_date}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6   length_units">
                            <label htmlFor="tech_length" className="label">
                              {data?.payload?.tech_lang_keys["14"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_length"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_length}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-3"
                                onClick={toggleDropdown}
                              >
                                {formData.tech_length_unit} ▾
                              </label>
                              {dropdownVisible && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    {
                                      label: data?.payload?.tech_lang_keys[15],
                                      value: data?.payload?.tech_lang_keys[15],
                                    },
                                    {
                                      label: data?.payload?.tech_lang_keys[16],
                                      value: data?.payload?.tech_lang_keys[16],
                                    },
                                    {
                                      label: data?.payload?.tech_lang_keys[17],
                                      value: data?.payload?.tech_lang_keys[17],
                                    },
                                    {
                                      label: data?.payload?.tech_lang_keys[18],
                                      value: data?.payload?.tech_lang_keys[18],
                                    },
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
                    </>
                  ) : (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6  annualized">
                        <label htmlFor="tech_annualized" className="label">
                          {data?.payload?.tech_lang_keys["7"]} ROI:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_annualized"
                            id="tech_annualized"
                            className="input my-2"
                            aria-label="input"
                            min="0"
                            max="10000000"
                            value={formData.tech_annualized}
                            onChange={handleChange}
                          />
                          <span className="input_unit">{currency.symbol}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="row" id="option">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <div className="col-span-12 ">
                      <label htmlFor="tech_compare" className="label">
                        {data?.payload?.tech_lang_keys["19"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_compare"
                          id="tech_compare"
                          value={formData.tech_compare}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["20"]}{" "}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["21"]}{" "}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {formData.tech_compare == "2" && (
                <>
                  <div className="col-span-12 ">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div
                        className="col-span-12 md:col-span-6 lg:col-span-6 "
                        id="basic_1_compare"
                      >
                        <label htmlFor="tech_invest_compare" className="label">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_invest_compare"
                            id="tech_invest_compare"
                            className="input my-2"
                            aria-label="input"
                            min="1"
                            value={formData.tech_invest_compare}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div
                        className="col-span-12 md:col-span-6 lg:col-span-6 "
                        id="basic_2_compare"
                      >
                        <label htmlFor="tech_return_compare" className="label">
                          {data?.payload?.tech_lang_keys["5"]} :
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_return_compare"
                            id="tech_return_compare"
                            className="input my-2"
                            aria-label="input"
                            min="1"
                            value={formData.tech_return_compare}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div
                        className="col-span-12 md:col-span-6 lg:col-span-6 "
                        id="optional"
                      >
                        <label htmlFor="tech_find_compare" className="label">
                          {data?.payload?.tech_lang_keys["6"]} :
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_find_compare"
                            id="tech_find_compare"
                            value={formData.tech_find_compare}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["7"]} ROI
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["8"]}
                            </option>
                          </select>
                        </div>
                      </div>
                      {formData.tech_find_compare == "1" ? (
                        <>
                          <div
                            className="col-span-12 md:col-span-6 lg:col-span-6   date_compare"
                            id="select_date_compare"
                          >
                            <label
                              htmlFor="tech_date_compare"
                              className="label"
                            >
                              {data?.payload?.tech_lang_keys["9"]} :
                            </label>
                            <div className="mt-2">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_date_compare"
                                id="tech_date_compare"
                                value={formData.tech_date_compare}
                                onChange={handleChange}
                              >
                                <option value="1">
                                  {data?.payload?.tech_lang_keys["10"]}{" "}
                                </option>
                                <option value="2">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </option>
                              </select>
                            </div>
                          </div>

                          {formData.tech_date_compare == 1 ? (
                            <>
                              <div className="col-span-12 md:col-span-6 lg:col-span-6  s_date_compare">
                                <label
                                  htmlFor="tech_s_date_compare"
                                  className="label"
                                >
                                  {data?.payload?.tech_lang_keys["12"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="date"
                                    step="any"
                                    name="tech_s_date_compare"
                                    id="tech_s_date_compare"
                                    className="input my-2"
                                    aria-label="input"
                                    min="1"
                                    value={formData.tech_s_date_compare}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-6 lg:col-span-6  s_date_compare">
                                <label
                                  htmlFor="tech_e_date_compare"
                                  className="label"
                                >
                                  {data?.payload?.tech_lang_keys["13"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="date"
                                    step="any"
                                    name="tech_e_date_compare"
                                    id="tech_e_date_compare"
                                    className="input my-2"
                                    aria-label="input"
                                    min="1"
                                    value={formData.tech_e_date_compare}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="col-span-12 md:col-span-6 lg:col-span-6  e_date_compare">
                              <label
                                htmlFor="tech_length_compare"
                                className="label"
                              >
                                {data?.payload?.tech_lang_keys["14"]}
                              </label>
                              <div className="relative w-full ">
                                <input
                                  type="number"
                                  name="tech_length_compare"
                                  step="any"
                                  className="mt-1 input"
                                  value={formData.tech_length_compare}
                                  placeholder="00"
                                  onChange={handleChange}
                                />
                                <label
                                  className="absolute cursor-pointer text-sm underline right-6 top-3"
                                  onClick={toggleDropdown1}
                                >
                                  {formData.tech_length_unit_compare} ▾
                                </label>
                                {dropdownVisible1 && (
                                  <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                    {[
                                      {
                                        label:
                                          data?.payload?.tech_lang_keys[15],
                                        value:
                                          data?.payload?.tech_lang_keys[15],
                                      },
                                      {
                                        label:
                                          data?.payload?.tech_lang_keys[16],
                                        value:
                                          data?.payload?.tech_lang_keys[16],
                                      },
                                      {
                                        label:
                                          data?.payload?.tech_lang_keys[17],
                                        value:
                                          data?.payload?.tech_lang_keys[17],
                                      },
                                      {
                                        label:
                                          data?.payload?.tech_lang_keys[18],
                                        value:
                                          data?.payload?.tech_lang_keys[18],
                                      },
                                    ].map((unit, index) => (
                                      <p
                                        key={index}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                          setUnitHandler1(unit.value)
                                        }
                                      >
                                        {unit.label}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div
                            className="col-span-12 md:col-span-6 lg:col-span-6   annualized_compare"
                            id="basic_3_compare"
                          >
                            <label
                              htmlFor="tech_annualized_compare"
                              className="label"
                            >
                              {data?.payload?.tech_lang_keys["7"]} ROI:
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_annualized_compare"
                                id="tech_annualized_compare"
                                className="input my-2"
                                aria-label="input"
                                min="0"
                                max="10000000"
                                value={formData.tech_annualized_compare}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full">
                      {/* First Section */}
                      <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                        {result?.tech_find == "1" &&
                          result?.tech_date == "1" && (
                            <table className="w-full font-s-18">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[22]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_from}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[23]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_to}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          )}

                        <table className="w-full font-s-18">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>ROI</strong>
                              </td>
                              <td className="py-2 border-b">
                                {Number(result?.tech_roi).toFixed(2)}%
                              </td>
                            </tr>

                            {formData?.tech_annualized_answer != "" && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[7]} ROI
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_annualized_answer}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Second Section */}
                      <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                        <table className="w-full text-[18px]">
                          <tbody>
                            {result?.tech_loss && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[24]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol} {result?.tech_loss}
                                </td>
                              </tr>
                            )}

                            {result?.tech_gain && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[25]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol} {result?.tech_gain}
                                </td>
                              </tr>
                            )}

                            {result?.tech_time && (
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[26]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Math.round(result?.tech_time * 100) / 100}{" "}
                                  years
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        <div className="mt-5 w-full md:w-[60%]">
                          <Pie data={chartdata} options={options} />
                        </div>
                      </div>

                      {/* Compare Section */}
                      {result?.tech_compare == "2" && (
                        <>
                          <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                            {result?.tech_find_compare == "1" &&
                              result?.tech_date_compare == "1" && (
                                <>
                                  <table className="w-full font-s-18">
                                    <tbody>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="70%"
                                        >
                                          <strong>
                                            {data?.payload?.tech_lang_keys[22]}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_from}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="70%"
                                        >
                                          <strong>
                                            {data?.payload?.tech_lang_keys[23]}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_to}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <table className="w-full font-s-18">
                                    <tbody>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="70%"
                                        >
                                          <strong>
                                            {data?.payload?.tech_lang_keys[22]}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_from2}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="70%"
                                        >
                                          <strong>
                                            {data?.payload?.tech_lang_keys[23]}{" "}
                                            ROI
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_to2}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </>
                              )}

                            {result?.tech_annualized_answer2 != "" && (
                              <table className="w-full font-s-18">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[7]} ROI
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_annualized_answer2} %
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            )}
                          </div>

                          <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                            <table className="w-full font-s-18">
                              <tbody>
                                {result?.tech_loss2 && (
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[24]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {currency.symbol} {result?.tech_loss2}
                                    </td>
                                  </tr>
                                )}

                                {result?.tech_gain2 && (
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[25]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {currency.symbol} {result?.tech_gain2}
                                    </td>
                                  </tr>
                                )}

                                {result?.tech_time2 && (
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[26]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {currency.symbol}{" "}
                                      {Math.round(result?.tech_time2 * 100) /
                                        100}{" "}
                                      years
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>

                            <div className="mt-5 w-full md:w-[60%]">
                              <Pie data={chartdata1} options={options1} />
                            </div>
                          </div>
                        </>
                      )}
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

export default ROICalculator;

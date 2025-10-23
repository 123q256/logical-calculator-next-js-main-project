"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register required elements
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCagrCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CagrCalculator = () => {
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
    tech_unit_type: "one",
    tech_starting_first: "100",
    tech_ending_first: "1000",
    tech_years_first: "3",
    tech_months_first: "0",
    tech_days_first: "0",
    tech_starting_sec: "100",
    tech_ending_sec: "1000",
    tech_start_date: "2025-04-27",
    tech_ending_date: "2025-05-04",
    tech_starting_third: "100",
    tech_cagr: "10",
    tech_years_third: "3",
    tech_months_third: "0",
    tech_days_third: "0",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCagrCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_unit_type == "one") {
      if (
        !formData.tech_unit_type ||
        !formData.tech_starting_first ||
        !formData.tech_ending_first ||
        !formData.tech_years_first ||
        !formData.tech_months_first ||
        !formData.tech_days_first
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_unit_type == "two") {
      if (
        !formData.tech_unit_type ||
        !formData.tech_starting_sec ||
        !formData.tech_ending_sec ||
        !formData.tech_start_date ||
        !formData.tech_ending_date
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_unit_type ||
        !formData.tech_starting_third ||
        !formData.tech_cagr ||
        !formData.tech_years_third ||
        !formData.tech_months_third ||
        !formData.tech_days_third
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_starting_first: formData.tech_starting_first,
        tech_ending_first: formData.tech_ending_first,
        tech_years_first: formData.tech_years_first,
        tech_months_first: formData.tech_months_first,
        tech_days_first: formData.tech_days_first,
        tech_starting_sec: formData.tech_starting_sec,
        tech_ending_sec: formData.tech_ending_sec,
        tech_start_date: formData.tech_start_date,
        tech_ending_date: formData.tech_ending_date,
        tech_starting_third: formData.tech_starting_third,
        tech_cagr: formData.tech_cagr,
        tech_years_third: formData.tech_years_third,
        tech_months_third: formData.tech_months_third,
        tech_days_third: formData.tech_days_third,
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
      tech_unit_type: "one",
      tech_starting_first: "100",
      tech_ending_first: "1000",
      tech_years_first: "3",
      tech_months_first: "0",
      tech_days_first: "0",
      tech_starting_sec: "100",
      tech_ending_sec: "1000",
      tech_start_date: "2025-04-27",
      tech_ending_date: "2025-05-04",
      tech_starting_third: "100",
      tech_cagr: "10",
      tech_years_third: "3",
      tech_months_third: "0",
      tech_days_third: "0",
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
  const labels = [];
  const dataPoints = [];
  const chartPoints = [];
  let tableRows = [];
  let chartDatalast = {};
  let chartOptions = {};

  const unitType = formData?.tech_unit_type;
  const cagr = parseFloat(result?.tech_cagr_percentage || 0) / 100;
  const totalYears = parseInt(result?.tech_table_year || 0);
  const tech_total_days = parseInt(result?.tech_total_days || 0);

  if (unitType == "one") {
    let currentValue = parseFloat(formData?.tech_starting_first || 0);

    for (let year = 0; year <= totalYears; year++) {
      const growth = year === 0 ? "-" : (currentValue * cagr).toFixed(2);

      labels.push(`Year ${year}`);
      dataPoints.push(currentValue.toFixed(2));

      tableRows.push(
        <tr key={year}>
          <td className="py-2 border-b">{year}</td>
          <td className="py-2 border-b">
            {currency.symbol}
            {growth}
          </td>
          <td className="py-2 border-b">
            {currency.symbol}
            {currentValue.toFixed(2)}
          </td>
        </tr>
      );

      currentValue += currentValue * cagr;
    }

    chartDatalast = {
      labels,
      datasets: [
        {
          label: "Growth Over Years",
          data: dataPoints,
          borderColor: "#4f46e5",
          backgroundColor: "rgba(99, 102, 241, 0.3)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  } else if (unitType == "two") {
    let currentValue = parseFloat(formData?.tech_starting_sec || 0);

    for (let year = 0; year <= totalYears; year++) {
      const growth = year === 0 ? "-" : (currentValue * cagr).toFixed(2);

      chartPoints.push({
        label: `Year ${year}`,
        y: parseFloat(currentValue.toFixed(2)),
      });

      tableRows.push(
        <tr key={year}>
          <td className="py-2 border-b">{year}</td>
          <td className="py-2 border-b">
            {currency.symbol}
            {growth}
          </td>
          <td className="py-2 border-b">
            {currency.symbol}
            {currentValue.toFixed(2)}
          </td>
        </tr>
      );

      currentValue += currentValue * cagr;
    }

    chartDatalast = {
      labels: chartPoints.map((p) => p.label),
      datasets: [
        {
          label: "Growth Over Years",
          data: chartPoints.map((p) => p.y),
          borderColor: "#4f46e5",
          backgroundColor: "rgba(99, 102, 241, 0.3)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  } else if (unitType == "three") {
    // 👇 Your 3rd condition logic here (add as per your need)
    let currentValue = parseFloat(formData?.tech_starting_third || 0);

    for (let year = 0; year <= tech_total_days; year++) {
      const growth = year === 0 ? "-" : (currentValue * cagr).toFixed(2);

      labels.push(`Year ${year}`);
      dataPoints.push(currentValue.toFixed(2));

      tableRows.push(
        <tr key={year}>
          <td className="py-2 border-b">{year}</td>
          <td className="py-2 border-b">
            {currency.symbol}
            {growth}
          </td>
          <td className="py-2 border-b">
            {currency.symbol}
            {currentValue.toFixed(2)}
          </td>
        </tr>
      );

      currentValue += currentValue * cagr;
    }

    chartDatalast = {
      labels,
      datasets: [
        {
          label: "Growth Over Years",
          data: dataPoints,
          borderColor: "#4f46e5",
          backgroundColor: "rgba(99, 102, 241, 0.3)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }

  //  Common chart options (for all 3)
  chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${currency.symbol}${ctx.raw}`,
        },
      },
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: {
          callback: (val) => `${currency.symbol}${val}`,
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="col-12  mx-auto mt-2 w-full">
              <input
                type="hidden"
                name="tech_unit_type"
                id="calculator_time"
                value={formData.tech_unit_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_unit_type === "one" ? "tagsUnit" : ""
                    }`}
                    id="one"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "one" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["1"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit_type === "two" ? "tagsUnit" : ""
                    }`}
                    id="two"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "two" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </div>
                </div>
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit_type === "three" ? "tagsUnit" : ""
                    }`}
                    id="three"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "three" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["3"]}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-3  gap-4">
              {formData?.tech_unit_type == "one" && (
                <div className="col-span-12" id="first">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_starting_first" className="label">
                        {data?.payload?.tech_lang_keys["4"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_starting_first"
                          id="tech_starting_first"
                          className="input my-2"
                          aria-label="input"
                          placeholder="100"
                          value={formData.tech_starting_first}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_ending_first" className="label">
                        {data?.payload?.tech_lang_keys["5"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_ending_first"
                          id="tech_ending_first"
                          className="input my-2"
                          aria-label="input"
                          placeholder="100"
                          value={formData.tech_ending_first}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_years_first" className="label">
                        {data?.payload?.tech_lang_keys["6"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_years_first"
                          id="tech_years_first"
                          className="input my-2"
                          aria-label="input"
                          placeholder="100"
                          value={formData.tech_years_first}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_months_first" className="label">
                        {data?.payload?.tech_lang_keys["7"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_months_first"
                          id="tech_months_first"
                          className="input my-2"
                          aria-label="input"
                          placeholder="0"
                          value={formData.tech_months_first}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_days_first" className="label">
                        {data?.payload?.tech_lang_keys["8"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_days_first"
                          id="tech_days_first"
                          className="input my-2"
                          aria-label="input"
                          placeholder="0"
                          value={formData.tech_days_first}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {formData?.tech_unit_type == "two" && (
                <div className="col-span-12 " id="sec">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_starting_sec" className="label">
                        {data?.payload?.tech_lang_keys["4"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_starting_sec"
                          id="tech_starting_sec"
                          className="input my-2"
                          aria-label="input"
                          placeholder="0"
                          value={formData.tech_starting_sec}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_ending_sec" className="label">
                        {data?.payload?.tech_lang_keys["5"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_ending_sec"
                          id="tech_ending_sec"
                          className="input my-2"
                          aria-label="input"
                          placeholder="0"
                          value={formData.tech_ending_sec}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_start_date" className="label">
                        {data?.payload?.tech_lang_keys["9"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="date"
                          step="any"
                          name="tech_start_date"
                          id="tech_start_date"
                          className="input my-2"
                          aria-label="input"
                          placeholder="0"
                          value={formData.tech_start_date}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_ending_date" className="label">
                        {data?.payload?.tech_lang_keys["9"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="date"
                          step="any"
                          name="tech_ending_date"
                          id="tech_ending_date"
                          className="input my-2"
                          aria-label="input"
                          placeholder="0"
                          value={formData.tech_ending_date}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {formData?.tech_unit_type == "three" && (
                <div className="col-span-12 " id="third">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_starting_third" className="label">
                        {data?.payload?.tech_lang_keys["4"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_starting_third"
                          id="tech_starting_third"
                          className="input my-2"
                          aria-label="input"
                          placeholder="100"
                          value={formData.tech_starting_third}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_cagr" className="label">
                        CAGR %
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_cagr"
                          id="tech_cagr"
                          className="input my-2"
                          aria-label="input"
                          placeholder="100"
                          value={formData.tech_cagr}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_years_third" className="label">
                        {data?.payload?.tech_lang_keys["6"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_years_third"
                          id="tech_years_third"
                          className="input my-2"
                          aria-label="input"
                          placeholder="100"
                          value={formData.tech_years_third}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_months_third" className="label">
                        {data?.payload?.tech_lang_keys["7"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_months_third"
                          id="tech_months_third"
                          className="input my-2"
                          aria-label="input"
                          placeholder="100"
                          value={formData.tech_months_third}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_days_third" className="label">
                        {data?.payload?.tech_lang_keys["8"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_days_third"
                          id="tech_days_third"
                          className="input my-2"
                          aria-label="input"
                          placeholder="100"
                          value={formData.tech_days_third}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full mt-2 overflow-auto">
                        <table className=" w-full lg:text-[18px] text-[16px]">
                          {formData.tech_unit_type == "one" ? (
                            <>
                              <tr>
                                <td className="py-2 border-b" width="30%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[12]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {Number(result?.tech_cagr_percentage).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="30%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[13]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {currency.symbol}{" "}
                                  {formData?.tech_starting_first} to
                                  {currency.symbol}{" "}
                                  {formData?.tech_ending_first} in{" "}
                                  {result?.tech_year},{result?.tech_months},{" "}
                                  {result?.tech_days}{" "}
                                </td>
                              </tr>
                            </>
                          ) : formData.tech_unit_type == "two" ? (
                            <>
                              <tr>
                                <td className="py-2 border-b" width="30%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[12]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {Number(result?.tech_cagr_percentage).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="30%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[13]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {currency.symbol}{" "}
                                  {formData?.tech_starting_sec} to
                                  {currency.symbol} {formData?.tech_ending_sec}{" "}
                                  in{" "}
                                  {Number(result?.tech_total_days).toFixed(2)}
                                </td>
                              </tr>
                            </>
                          ) : (
                            <>
                              <tr>
                                <td className="py-2 border-b" width="30%">
                                  <strong>Future Value</strong>
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {Number(result?.tech_cagr_percentage).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="30%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[18]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {currency.symbol}{" "}
                                  {formData?.tech_starting_third}
                                  {data?.payload?.tech_lang_keys[19]}{" "}
                                  {formData?.tech_cagr}
                                  in {result?.tech_yearx}, {result?.tech_monthz}
                                  , {result?.tech_dayz}
                                </td>
                              </tr>
                            </>
                          )}
                        </table>
                      </div>

                      {formData.tech_unit_type == "one" ? (
                        <>
                          <div className="w-full md:w-[60%] lg:w-[60%]  mt-3">
                            <p className="">
                              {data?.payload?.tech_lang_keys["14"]}
                            </p>
                            <table className="w-full">
                              <thead>
                                <tr id="first_roow">
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["7"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["8"]}
                                    </strong>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_yearx).toFixed(2)}
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_monthz).toFixed(2)}
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_dayz).toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="w-full md:w-[60%] lg:w-[60%]  mt-3">
                            <table className="w-full">
                              <thead>
                                <tr id="first_row">
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["20"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["15"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["16"]}
                                    </strong>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>{tableRows}</tbody>
                            </table>
                          </div>
                          <div className="col my-3">
                            <div className="w-full md:w-[80%] mx-auto mt-5">
                              <Line
                                data={chartDatalast}
                                options={chartOptions}
                              />
                            </div>
                          </div>
                        </>
                      ) : formData.tech_unit_type == "two" ? (
                        <>
                          <div className="w-full md:w-[60%] lg:w-[60%]  mt-3">
                            <p className="">
                              {data?.payload?.tech_lang_keys["14"]}
                            </p>
                            <table className="w-full">
                              <thead>
                                <tr id="first_roow">
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["7"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["8"]}
                                    </strong>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_yearx).toFixed(2)}
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_monthz).toFixed(2)}
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_dayz).toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="w-full md:w-[60%] lg:w-[60%]  mt-3">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gray-100 text-left">
                                  <th className="py-2 px-3 border">Year</th>
                                  <th className="py-2 px-3 border">Growth</th>
                                  <th className="py-2 px-3 border">Value</th>
                                </tr>
                              </thead>
                              <tbody>{tableRows}</tbody>
                            </table>
                          </div>
                          <div className="col my-3 ">
                            <div className="mb-6">
                              <div className="w-full max-w-3xl mx-auto my-8">
                                <Line
                                  data={chartDatalast}
                                  options={chartOptions}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : formData.tech_unit_type == "three" ? (
                        <>
                          <div className="w-full md:w-[60%] lg:w-[60%]  mt-3">
                            <p className="">
                              {data?.payload?.tech_lang_keys["14"]}
                            </p>
                            <table className="w-full">
                              <thead>
                                <tr id="first_roow">
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["7"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["8"]}
                                    </strong>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_yearx).toFixed(2)}
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_monthz).toFixed(2)}
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_dayz).toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="w-full md:w-[60%] lg:w-[60%]  mt-3">
                            <table className="w-full">
                              <thead>
                                <tr id="first_row">
                                  <td className="py-2 border-b">
                                    <strong>Year</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>Growth</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>Value</strong>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>{tableRows}</tbody>
                            </table>
                          </div>
                          <div className="col my-3">
                            <div className="mb-6">
                              <div className="w-full max-w-3xl mx-auto my-8">
                                <Line
                                  data={chartDatalast}
                                  options={chartOptions}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}
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

export default CagrCalculator;

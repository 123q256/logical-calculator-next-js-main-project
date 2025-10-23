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

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

import { useGetSingleCalculatorDetailsMutation } from "../.././../../redux/services/calculator/calculatorApi";

import { useMACRSDepreciationCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MacrsDepreciationCalculator = () => {
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
    tech_mycurrancy: "$",
    tech_basic: "700000",
    tech_percent: "90",
    tech_sal: "19",
    tech_method: "200",
    tech_ads_: "2.5",
    tech_period: "3",
    tech_conver: "3",
    tech_date: "2025-04-30",
    tech_round: "yes",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMACRSDepreciationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_basic ||
      !formData.tech_percent ||
      !formData.tech_sal ||
      !formData.tech_method ||
      !formData.tech_ads_ ||
      !formData.tech_period ||
      !formData.tech_conver ||
      !formData.tech_date ||
      !formData.tech_round
    ) {
      setFormError("Please fill in field.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_basic: formData.tech_basic,
        tech_percent: formData.tech_percent,
        tech_sal: formData.tech_sal,
        tech_method: formData.tech_method,
        tech_ads_: formData.tech_ads_,
        tech_period: formData.tech_period,
        tech_conver: formData.tech_conver,
        tech_date: formData.tech_date,
        tech_round: formData.tech_round,
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
      tech_basic: "700000",
      tech_percent: "90",
      tech_sal: "19",
      tech_method: "200",
      tech_ads_: "2.5",
      tech_period: "3",
      tech_conver: "3",
      tech_date: "2025-08-22",
      tech_round: "yes",
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

  // chart

  const detail = {
    total_years: result?.total_years?.split(",").filter(Boolean).map(Number),
    total_ev: result?.total_ev?.split(",").filter(Boolean).map(Number),
  };

  const lang = {
    rv: data?.payload?.tech_lang_keys["rv"],
    year: data?.payload?.tech_lang_keys["year"],
    b_v: data?.payload?.tech_lang_keys["b_v"],
  };

  const currencys = currency.symbol;

  const chartData = {
    labels: detail.total_years,
    datasets: [
      {
        label: lang.b_v,
        data: detail.total_ev,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `${lang.rv} (${currencys})`,
      },
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: lang.year,
        },
      },
      y: {
        title: {
          display: true,
          text: `${lang.rv} (${currencys})`,
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
            <input
              type="hidden"
              value="{currency.symbol }"
              name="mycurrancy"
              id="mycurrancy"
            />
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_basic" className="label">
                  {data?.payload?.tech_lang_keys["a"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_basic"
                    id="tech_basic"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_basic}
                    onChange={handleChange}
                  />
                  <span className=" input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 percent">
                <label htmlFor="tech_percent" className="label">
                  {data?.payload?.tech_lang_keys["b"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_percent"
                    id="tech_percent"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_percent}
                    onChange={handleChange}
                  />
                  <span className=" input_unit">%</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 salvage hidden">
                <label htmlFor="tech_sal" className="label">
                  {data?.payload?.tech_lang_keys["sal"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_sal"
                    id="tech_sal"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_sal}
                    onChange={handleChange}
                  />
                  <span className=" input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["c"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method"
                    id="tech_method"
                    value={formData.tech_method}
                    onChange={handleChange}
                  >
                    <option value="200">
                      {" "}
                      200% {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="175">
                      {" "}
                      175% {data?.payload?.tech_lang_keys["1"]}{" "}
                    </option>
                    <option value="150">
                      150% {data?.payload?.tech_lang_keys["1"]}{" "}
                    </option>
                    <option value="125">
                      {" "}
                      125% {data?.payload?.tech_lang_keys["1"]}{" "}
                    </option>
                    <option value="sl">
                      {" "}
                      GDS {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="asl">
                      {" "}
                      ADS {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_method == "asl" ? (
                <div className="col-span-12 md:col-span-6 lg:col-span-6 adsp">
                  <label htmlFor="tech_ads_" className="label">
                    {data?.payload?.tech_lang_keys["d"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_ads_"
                      id="tech_ads_"
                      value={formData.tech_ads_}
                      onChange={handleChange}
                    >
                      <option value="2.5">
                        {" "}
                        ADS 2.5 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="3">
                        {" "}
                        ADS 3 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="3.5">
                        {" "}
                        ADS 3.5 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="4">
                        {" "}
                        ADS 4 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="5">
                        {" "}
                        ADS 5 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="6">
                        {" "}
                        ADS 6 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="6.5">
                        {" "}
                        ADS 6.5 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="7">
                        {" "}
                        ADS 7 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="7.5">
                        {" "}
                        ADS 7.5 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="8">
                        {" "}
                        ADS 8 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="8.5">
                        {" "}
                        ADS 8.5 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="9">
                        {" "}
                        ADS 9 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="9.5">
                        {" "}
                        ADS 9.5 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="10">
                        {" "}
                        ADS 10 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="10.5">
                        {" "}
                        ADS 10.5 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="11">
                        {" "}
                        ADS 11 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="11.5">
                        {" "}
                        ADS 11.5 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="12">
                        {" "}
                        ADS 12 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="12.5">
                        {" "}
                        ADS 12.5 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="13">
                        {" "}
                        ADS 13 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="13.5">
                        {" "}
                        ADS 13.5 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="14">
                        {" "}
                        ADS 14 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="15">
                        {" "}
                        ADS 15 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="16">
                        {" "}
                        ADS 16 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="16.5">
                        {" "}
                        ADS 16.5 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="17">
                        {" "}
                        ADS 17 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="18">
                        {" "}
                        ADS 18 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="19">
                        {" "}
                        ADS 19 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="20">
                        {" "}
                        ADS 20 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="22">
                        {" "}
                        ADS 22 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="24">
                        {" "}
                        ADS 24 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="25">
                        {" "}
                        ADS 25 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="26.5">
                        {" "}
                        ADS 26.5 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="28">
                        {" "}
                        ADS 28 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="30">
                        {" "}
                        ADS 30 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="35">
                        {" "}
                        ADS 35 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="39">
                        {" "}
                        ADS 39 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="40">
                        {" "}
                        ADS 40 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="45">
                        {" "}
                        ADS 45 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="50">
                        {" "}
                        ADS 50 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="col-span-12 md:col-span-6 lg:col-span-6  gdsp">
                  <label htmlFor="tech_method" className="label">
                    {data?.payload?.tech_lang_keys["d"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_method"
                      id="tech_method"
                      value={formData.tech_method}
                      onChange={handleChange}
                    >
                      <option value="3">
                        {" "}
                        3 {data?.payload?.tech_lang_keys["year"]}
                      </option>
                      <option value="5">
                        {" "}
                        5 {data?.payload?.tech_lang_keys["year"]}{" "}
                      </option>
                      <option value="7">
                        7 {data?.payload?.tech_lang_keys["year"]}{" "}
                      </option>
                      <option value="10">
                        {" "}
                        10 {data?.payload?.tech_lang_keys["year"]}{" "}
                      </option>
                      <option value="15">
                        {" "}
                        15 {data?.payload?.tech_lang_keys["year"]}{" "}
                      </option>
                      <option value="20">
                        {" "}
                        20 {data?.payload?.tech_lang_keys["year"]}{" "}
                      </option>
                      <option value="25">
                        {" "}
                        25 {data?.payload?.tech_lang_keys["year"]}{" "}
                      </option>
                      <option value="27.5">
                        {" "}
                        27.5 {data?.payload?.tech_lang_keys["year"]}{" "}
                      </option>
                      <option value="39">
                        {" "}
                        39 {data?.payload?.tech_lang_keys["year"]}{" "}
                      </option>
                    </select>
                  </div>
                </div>
              )}

              <div className="col-span-12 md:col-span-6 lg:col-span-6 percent">
                <label htmlFor="tech_conver" className="label">
                  {data?.payload?.tech_lang_keys["e"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_conver"
                    id="tech_conver"
                    value={formData.tech_conver}
                    onChange={handleChange}
                  >
                    <option value="3">
                      {" "}
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="2">
                      {" "}
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_date" className="label">
                  {data?.payload?.tech_lang_keys["f"]}:
                </label>
                <div className=" relative">
                  <input
                    type="date"
                    step="any"
                    name="tech_date"
                    id="tech_date"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_round" className="label">
                  {data?.payload?.tech_lang_keys["round"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_round"
                    id="tech_round"
                    value={formData.tech_round}
                    onChange={handleChange}
                  >
                    <option value="yes">
                      {" "}
                      {data?.payload?.tech_lang_keys["yes"]}
                    </option>
                    <option value="no">
                      {" "}
                      {data?.payload?.tech_lang_keys["no"]}{" "}
                    </option>
                  </select>
                </div>
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full mt-2 overflow-auto">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["bas"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {currency.symbol} {result?.original}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["f"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {formData?.tech_date}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["d"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {formData?.tech_method == "asl"
                                  ? formData?.tech_ads_
                                  : formData?.tech_period}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["c"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {formData?.tech_method === "200" ? (
                                  <span>
                                    200% {data?.payload?.tech_lang_keys["1"]}
                                  </span>
                                ) : formData?.tech_method === "175" ? (
                                  <span>
                                    175% {data?.payload?.tech_lang_keys["1"]}
                                  </span>
                                ) : formData?.tech_method === "150" ? (
                                  <span>
                                    150% {data?.payload?.tech_lang_keys["1"]}
                                  </span>
                                ) : formData?.tech_method === "125" ? (
                                  <span>
                                    125% {data?.payload?.tech_lang_keys["1"]}
                                  </span>
                                ) : formData?.tech_method === "sl" ? (
                                  <span>
                                    GDS {data?.payload?.tech_lang_keys["3"]}
                                  </span>
                                ) : (
                                  <span>
                                    ADS {data?.payload?.tech_lang_keys["3"]}
                                  </span>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["c"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                <span>
                                  {formData?.tech_conver === "1"
                                    ? data?.payload?.tech_lang_keys["5"]
                                    : formData?.tech_conver === "2"
                                    ? data?.payload?.tech_lang_keys["6"]
                                    : data?.payload?.tech_lang_keys["4"]}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-center text-[15px]">
                        <div className="w-full my-4 overflow-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="grey lighten-3 color_blue">
                                <th className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["year"]}
                                </th>
                                <th className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["a_b"]}
                                </th>
                                <th className="py-2 border-b">%</th>
                                <th className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["dep"]}
                                </th>
                                <th className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["cam"]}
                                </th>
                                <th className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["b_v"]}
                                </th>
                                <th className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["method"]}
                                </th>
                              </tr>
                            </thead>
                            {result?.output ? (
                              <tbody
                                dangerouslySetInnerHTML={{
                                  __html: result?.output,
                                }}
                              />
                            ) : (
                              <tbody>
                                <tr>
                                  <td className="border-b">2019</td>
                                  <td className="border-b">
                                    0{currency.symbol}
                                  </td>
                                  <td className="border-b">0%</td>
                                  <td className="border-b">
                                    0{currency.symbol}
                                  </td>
                                  <td className="border-b">
                                    0{currency.symbol}
                                  </td>
                                  <td className="border-b">
                                    0{currency.symbol}
                                  </td>
                                  <td className="border-b">
                                    0{currency.symbol}
                                  </td>
                                </tr>
                              </tbody>
                            )}
                          </table>
                        </div>
                        <div className="w-full">
                          <Line data={chartData} options={chartOptions} />
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

export default MacrsDepreciationCalculator;

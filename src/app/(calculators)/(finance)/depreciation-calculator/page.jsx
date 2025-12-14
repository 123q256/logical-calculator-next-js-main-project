"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

import {
  useGetSingleCalculatorDetailsMutation,
  useDepreciationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
const DepreciationCalculator = () => {
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
    hiddent_currency: "$",
    method: "sum", // Declining   sum   Reducing   unit_of_pro  Straight
    asset: "15000",
    salvage: "2500",
    year: "5",
    u_of_p: "1200",
    round: "yes",
    conver: "3",
    date: "2025-04-27",
    Factor: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDepreciationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.method == "Straight" || formData.method == "Reducing") {
      if (
        !formData.method ||
        !formData.asset ||
        !formData.salvage ||
        !formData.year ||
        !formData.round ||
        !formData.conver ||
        !formData.date
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.method == "Declining") {
      if (
        !formData.method ||
        !formData.asset ||
        !formData.salvage ||
        !formData.year ||
        !formData.round ||
        !formData.conver ||
        !formData.date ||
        !formData.Factor
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.method ||
        !formData.asset ||
        !formData.salvage ||
        !formData.year ||
        !formData.u_of_p
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        hiddent_currency: formData.hiddent_currency,
        method: formData.method,
        asset: formData.asset,
        salvage: formData.salvage,
        year: formData.year,
        u_of_p: formData.u_of_p,
        round: formData.round,
        conver: formData.conver,
        date: formData.date,
        Factor: formData.Factor,
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
      hiddent_currency: "$",
      method: "sum", // Declining   sum   Reducing   unit_of_pro  Straight
      asset: "15000",
      salvage: "2500",
      year: "5",
      u_of_p: "1200",
      round: "yes",
      conver: "3",
      date: "2025-04-27",
      Factor: "4",
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

  // chart js

  // Parse your data correctly
  const years = result?.total_years || []; // should be an array like ['2021', '2022', ...]
  const bookValues = result?.book_des || []; // array of book values
  const depreciation = result?.des || []; // array of depreciation values

  const datachart = {
    labels: years,
    datasets: [
      {
        label: "Book Value",
        backgroundColor: "#4a90e2",
        data: bookValues,
      },
      {
        label: data?.payload?.tech_lang_keys?.d_a || "Depreciation Amount",
        backgroundColor: "#e94e77",
        data: depreciation,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Year" } },
      y: { beginAtZero: true },
    },
  };

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[80%] md:w-[90%] w-full mx-auto ">
            <div className="col-12  mx-auto mt-2 w-full lg:w-[80%] md:w-[80%]">
              <input
                type="hidden"
                name="hiddent_currency"
                id="hiddent_currency"
                className="input my-2"
                aria-label="input"
                value={currency.symbol}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className="bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300  hover_tags hover:text-white  imperial tagsUnit"
                    id="imperial"
                  >
                    <a
                      href="/depreciation-calculator"
                      className="text-decoration-none col-4 py-2  cursor-pointer radius-5 test11"
                    >
                      {" "}
                      {data?.payload?.tech_lang_keys["simple"]}
                    </a>
                  </div>
                </div>
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className="bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300   hover_tags hover:text-white metric"
                    id="metric"
                  >
                    <a
                      href="/car-depreciation-calculator"
                      className="text-decoration-none col-4 py-2  cursor-pointer radius-5 test12"
                    >
                      {" "}
                      {data?.payload?.tech_lang_keys["Auto"]}
                    </a>
                  </div>
                </div>
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className="bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300  hover_tags hover:text-white metric"
                    id="metric"
                  >
                    <a
                      href="/property-depreciation-calculator"
                      className="text-decoration-none col-4 py-2 cursor-pointer radius-5 test13"
                    >
                      {" "}
                      {data?.payload?.tech_lang_keys["Property"]}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-1 md:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="method" className="label">
                  {data?.payload?.tech_lang_keys["dep_m"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="method"
                    id="method"
                    value={formData.method}
                    onChange={handleChange}
                  >
                    <option value="Straight">
                      {data?.payload?.tech_lang_keys["s_l"]}
                    </option>
                    <option value="Declining">
                      {data?.payload?.tech_lang_keys["d_b"]}{" "}
                    </option>
                    <option value="Reducing">
                      {data?.payload?.tech_lang_keys["red"]}{" "}
                    </option>
                    <option value="unit_of_pro">
                      {data?.payload?.tech_lang_keys["u_of_p"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="asset" className="label">
                  {data?.payload?.tech_lang_keys["a_s"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="asset"
                    id="asset"
                    className="input my-2"
                    aria-label="input"
                    value={formData.asset}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="salvage" className="label">
                  {data?.payload?.tech_lang_keys["s_v"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="salvage"
                    id="salvage"
                    className="input my-2"
                    aria-label="input"
                    value={formData.salvage}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="year" className="label">
                  {data?.payload?.tech_lang_keys["d_y"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="year"
                    id="year"
                    className="input my-2"
                    aria-label="input"
                    value={formData.year}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              {formData.method == "unit_of_pro" && (
                <div className="col-span-12 md:col-span-6 lg:col-span-6 unit_of_selet">
                  <label htmlFor="u_of_p" className="label">
                    {data?.payload?.tech_lang_keys["u_of_p"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="u_of_p"
                      id="u_of_p"
                      className="input my-2"
                      aria-label="input"
                      value={formData.u_of_p}
                      onChange={handleChange}
                    />
                    <span className="input_unit">{currency.symbol}</span>
                  </div>
                </div>
              )}
              <div className="col-span-12 ">
                {formData.method != "unit_of_pro" && (
                  <>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="round" className="label">
                        {data?.payload?.tech_lang_keys["r_d"]}:
                      </label>

                      <input
                        type="hidden"
                        name="round"
                        id="calculator_time"
                        value={formData.round}
                      />
                      <div className="py-2 relative text-center flex justify-content-between">
                        {/* Date Cal Tab */}
                        <div className="lg:w-1/2 w-full px-2 py-1">
                          <div
                            className={`col-5 py-2  cursor-pointer radius-5 yes_no bg-white border ${
                              formData.round == "yes" ? "tagsUnit" : ""
                            }`}
                            id="yes"
                            onClick={() => {
                              setFormData({ ...formData, round: "yes" });
                              setResult(null);
                              setFormError(null);
                            }}
                          >
                            {data?.payload?.tech_lang_keys["Yes"]}
                          </div>
                        </div>
                        {/* Time Cal Tab */}
                        <div className="lg:w-1/2 w-full px-2 py-1">
                          <div
                            className={`col-5 py-2   cursor-pointer radius-5 pro_free_yes_no bg-white border  ${
                              formData.round == "no" ? "tagsUnit" : ""
                            }`}
                            id="no"
                            onClick={() => {
                              setFormData({ ...formData, round: "no" });
                              setResult(null);
                              setFormError(null);
                            }}
                          >
                            {data?.payload?.tech_lang_keys["No"]}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="conver" className="label">
                        {data?.payload?.tech_lang_keys["con"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="conver"
                          id="conver"
                          value={formData.conver}
                          onChange={handleChange}
                        >
                          <option value="3">
                            {data?.payload?.tech_lang_keys["m_m"]}
                          </option>
                          <option value="4">
                            {data?.payload?.tech_lang_keys["f_m"]}{" "}
                          </option>
                          <option value="1">
                            {data?.payload?.tech_lang_keys["m_q"]}{" "}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["h_y"]}{" "}
                          </option>
                          <option value="0">
                            {data?.payload?.tech_lang_keys["f_y"]}{" "}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="date" className="label">
                        {data?.payload?.tech_lang_keys["start_d"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="date"
                          step="any"
                          name="date"
                          id="date"
                          className="input my-2"
                          aria-label="input"
                          value={formData.date}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {formData.method == "Declining" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6  Factor">
                          <label htmlFor="Factor" className="label">
                            {data?.payload?.tech_lang_keys["start_d"]}:
                          </label>
                          <div className=" relative">
                            <input
                              type="text"
                              step="any"
                              name="Factor"
                              id="Factor"
                              className="input my-2"
                              aria-label="input"
                              value={formData.Factor}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      {formData?.tech_method === "unit_of_pro" ? (
                        <div className="w-full md:w-[80%] lg:w-[60%] result_table">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["3"]} :
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol}
                                  {result?.Depreciable_Base}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["1"]} :
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol}
                                  {result?.Depreciation_Per_Unit}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["2"]} :
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol}
                                  {result?.Depreciation_for_Period}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <>
                          <div className="w-full mt-2 overflow-auto result_table">
                            <table className="w-full text-[14px] text-center">
                              <thead>
                                <tr id="first_roow">
                                  <td className="py-2 border-b" width="10%">
                                    <b>
                                      {data?.payload?.tech_lang_keys["Year"]}
                                    </b>
                                  </td>
                                  <td className="py-2 border-b">
                                    <b>
                                      {data?.payload?.tech_lang_keys["bb_v"]}
                                    </b>
                                  </td>
                                  <td className="py-2 border-b">
                                    <b>
                                      {data?.payload?.tech_lang_keys["depp"]}
                                    </b>
                                  </td>
                                  <td className="py-2 border-b">
                                    <b>
                                      {data?.payload?.tech_lang_keys["d_a"]}
                                    </b>
                                  </td>
                                  <td className="py-2 border-b">
                                    <b>
                                      {data?.payload?.tech_lang_keys["a_d_a"]}
                                    </b>
                                  </td>
                                  <td className="py-2 border-b">
                                    <b>
                                      {data?.payload?.tech_lang_keys["eb_v"]}
                                    </b>
                                  </td>
                                </tr>
                              </thead>
                              <tbody
                                dangerouslySetInnerHTML={{
                                  __html: result?.table,
                                }}
                              />
                            </table>
                          </div>
                          <div className="w-full mt-4">
                            <div style={{ width: "100%" }}>
                              <Bar data={datachart} options={options} />
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

export default DepreciationCalculator;

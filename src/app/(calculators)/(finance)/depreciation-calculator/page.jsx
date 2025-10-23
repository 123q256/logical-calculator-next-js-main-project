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

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDepreciationCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

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
    tech_hiddent_currency: "$",
    tech_method: "sum", // Declining   sum   Reducing   unit_of_pro  Straight
    tech_asset: "15000",
    tech_salvage: "2500",
    tech_year: "5",
    tech_u_of_p: "1200",
    tech_round: "yes",
    tech_conver: "3",
    tech_date: "2025-04-27",
    tech_Factor: "4",
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

    if (
      formData.tech_method == "Straight" ||
      formData.tech_method == "Reducing"
    ) {
      if (
        !formData.tech_method ||
        !formData.tech_asset ||
        !formData.tech_salvage ||
        !formData.tech_year ||
        !formData.tech_round ||
        !formData.tech_conver ||
        !formData.tech_date
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_method == "Declining") {
      if (
        !formData.tech_method ||
        !formData.tech_asset ||
        !formData.tech_salvage ||
        !formData.tech_year ||
        !formData.tech_round ||
        !formData.tech_conver ||
        !formData.tech_date ||
        !formData.tech_Factor
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_method ||
        !formData.tech_asset ||
        !formData.tech_salvage ||
        !formData.tech_year ||
        !formData.tech_u_of_p
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_hiddent_currency: formData.tech_hiddent_currency,
        tech_method: formData.tech_method,
        tech_asset: formData.tech_asset,
        tech_salvage: formData.tech_salvage,
        tech_year: formData.tech_year,
        tech_u_of_p: formData.tech_u_of_p,
        tech_round: formData.tech_round,
        tech_conver: formData.tech_conver,
        tech_date: formData.tech_date,
        tech_Factor: formData.tech_Factor,
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
      tech_hiddent_currency: "$",
      tech_method: "sum", // Declining   sum   Reducing   unit_of_pro  Straight
      tech_asset: "15000",
      tech_salvage: "2500",
      tech_year: "5",
      tech_u_of_p: "1200",
      tech_round: "yes",
      tech_conver: "3",
      tech_date: "2025-04-27",
      tech_Factor: "4",
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
  const years = result?.tech_total_years || []; // should be an array like ['2021', '2022', ...]
  const bookValues = result?.tech_book_des || []; // array of book values
  const depreciation = result?.tech_des || []; // array of depreciation values

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="col-12  mx-auto mt-2 w-full lg:w-[80%] md:w-[80%]">
            <input
              type="hidden"
              name="tech_hiddent_currency"
              id="tech_hiddent_currency"
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
                    href="/calculator/depreciation-calculator"
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
                    href="/calculator/car-depreciation-calculator"
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
                    href="/calculator/property-depreciation-calculator"
                    className="text-decoration-none col-4 py-2 cursor-pointer radius-5 test13"
                  >
                    {" "}
                    {data?.payload?.tech_lang_keys["Property"]}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["dep_m"]}:
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
                <label htmlFor="tech_asset" className="label">
                  {data?.payload?.tech_lang_keys["a_s"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_asset"
                    id="tech_asset"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_asset}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_salvage" className="label">
                  {data?.payload?.tech_lang_keys["s_v"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_salvage"
                    id="tech_salvage"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_salvage}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_year" className="label">
                  {data?.payload?.tech_lang_keys["d_y"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_year"
                    id="tech_year"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_year}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              {formData.tech_method == "unit_of_pro" && (
                <div className="col-span-12 md:col-span-6 lg:col-span-6 unit_of_selet">
                  <label htmlFor="tech_u_of_p" className="label">
                    {data?.payload?.tech_lang_keys["u_of_p"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_u_of_p"
                      id="tech_u_of_p"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_u_of_p}
                      onChange={handleChange}
                    />
                    <span className="input_unit">{currency.symbol}</span>
                  </div>
                </div>
              )}

              <div className="col-span-12 ">
                {formData.tech_method != "unit_of_pro" && (
                  <>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_round" className="label">
                        {data?.payload?.tech_lang_keys["r_d"]}:
                      </label>

                      <input
                        type="hidden"
                        name="tech_round"
                        id="calculator_time"
                        value={formData.tech_round}
                      />
                      <div className="py-2 relative text-center flex justify-content-between">
                        {/* Date Cal Tab */}
                        <div className="lg:w-1/2 w-full px-2 py-1">
                          <div
                            className={`col-5 py-2  cursor-pointer radius-5 yes_no bg-white border ${
                              formData.tech_round == "yes" ? "tagsUnit" : ""
                            }`}
                            id="yes"
                            onClick={() => {
                              setFormData({ ...formData, tech_round: "yes" });
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
                              formData.tech_round == "no" ? "tagsUnit" : ""
                            }`}
                            id="no"
                            onClick={() => {
                              setFormData({ ...formData, tech_round: "no" });
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
                      <label htmlFor="tech_conver" className="label">
                        {data?.payload?.tech_lang_keys["con"]}:
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
                      <label htmlFor="tech_date" className="label">
                        {data?.payload?.tech_lang_keys["start_d"]}:
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

                    {formData.tech_method == "Declining" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6  Factor">
                          <label htmlFor="tech_Factor" className="label">
                            {data?.payload?.tech_lang_keys["start_d"]}:
                          </label>
                          <div className=" relative">
                            <input
                              type="text"
                              step="any"
                              name="tech_Factor"
                              id="tech_Factor"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_Factor}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      {formData?.tech_method === "unit_of_pro" ? (
                        <div className="w-full md:w-[60%] lg:w-[60%]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["3"]} :
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol}
                                  {result?.tech_Depreciable_Base}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["1"]} :
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol}
                                  {result?.tech_Depreciation_Per_Unit}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["2"]} :
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol}
                                  {result?.tech_Depreciation_for_Period}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <>
                          <div className="w-full mt-2 overflow-auto">
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
                                  __html: result?.tech_table,
                                }}
                              />
                            </table>
                          </div>
                          <div className="w-full mt-4">
                            <div style={{ width: "100%", height: "450px" }}>
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

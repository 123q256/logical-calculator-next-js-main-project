"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

import {
  useGetSingleCalculatorDetailsMutation,
  useWeddingBudgetCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WeddingBudgetCalculator = () => {
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
    tech_spend: 5000000,
    tech_guest: 500,
    tech_dress: 90000,
    tech_jewelery: 350000,
    tech_accessories: 100000,
    tech_ring: 75000,
    tech_makeup: 275000,
    tech_clickvalue1: 0,
    tech_stationery: 0,
    tech_photography: 0,
    tech_florist: 0,
    tech_planner: 0,
    tech_clickvalue2: 0,
    tech_venue: 0,
    tech_dinner: 0,
    tech_catering: 0,
    tech_cake: 0,
    tech_DJs: 0,
    tech_liquors: 0,
    tech_clickvalue3: 0,
    tech_ceremony: 0,
    tech_officiant: 0,
    tech_clickvalue4: 0,
    tech_hotel: 0,
    tech_transportation: 0,
    tech_clickvalue5: 0,
    tech_other: 0,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWeddingBudgetCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_spend || !formData.tech_guest) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_spend: formData.tech_spend,
        tech_guest: formData.tech_guest,
        tech_dress: formData.tech_dress,
        tech_jewelery: formData.tech_jewelery,
        tech_accessories: formData.tech_accessories,
        tech_ring: formData.tech_ring,
        tech_makeup: formData.tech_makeup,
        tech_clickvalue1: formData.tech_clickvalue1,
        tech_stationery: formData.tech_stationery,
        tech_photography: formData.tech_photography,
        tech_florist: formData.tech_florist,
        tech_planner: formData.tech_planner,
        tech_clickvalue2: formData.tech_clickvalue2,
        tech_venue: formData.tech_venue,
        tech_dinner: formData.tech_dinner,
        tech_catering: formData.tech_catering,
        tech_cake: formData.tech_cake,
        tech_DJs: formData.tech_DJs,
        tech_liquors: formData.tech_liquors,
        tech_clickvalue3: formData.tech_clickvalue3,
        tech_ceremony: formData.tech_ceremony,
        tech_officiant: formData.tech_officiant,
        tech_clickvalue4: formData.tech_clickvalue4,
        tech_hotel: formData.tech_hotel,
        tech_transportation: formData.tech_transportation,
        tech_clickvalue5: formData.tech_clickvalue5,
        tech_other: formData.tech_other,
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
      tech_spend: 5000000,
      tech_guest: 500,
      tech_dress: 90000,
      tech_jewelery: 350000,
      tech_accessories: 100000,
      tech_ring: 75000,
      tech_makeup: 275000,
      tech_clickvalue1: 0,
      tech_stationery: 0,
      tech_photography: 0,
      tech_florist: 0,
      tech_planner: 0,
      tech_clickvalue2: 0,
      tech_venue: 0,
      tech_dinner: 0,
      tech_catering: 0,
      tech_cake: 0,
      tech_DJs: 0,
      tech_liquors: 0,
      tech_clickvalue3: 0,
      tech_ceremony: 0,
      tech_officiant: 0,
      tech_clickvalue4: 0,
      tech_hotel: 0,
      tech_transportation: 0,
      tech_clickvalue5: 0,
      tech_other: 0,
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

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const dataPoints = [];

    if (result?.tech_bride_groom !== 0) {
      dataPoints.push({
        label: data?.payload?.tech_lang_keys["3"],
        y: result?.tech_bride_groom,
      });
    }
    if (result?.tech_sub_contractors !== 0) {
      dataPoints.push({
        label: data?.payload?.tech_lang_keys["9"],
        y: result?.tech_sub_contractors,
      });
    }
    if (result?.tech_food_drinks !== 0) {
      dataPoints.push({
        label: data?.payload?.tech_lang_keys["14"],
        y: result?.tech_food_drinks,
      });
    }
    if (result?.tech_ceremony_total !== 0) {
      dataPoints.push({
        label: data?.payload?.tech_lang_keys["21"],
        y: result?.tech_ceremony_total,
      });
    }
    if (result?.tech_trans_accomo !== 0) {
      dataPoints.push({
        label: data?.payload?.tech_lang_keys["24"],
        y: result?.tech_trans_accomo,
      });
    }
    if (result?.tech_other !== 0) {
      dataPoints.push({
        label: data?.payload?.tech_lang_keys["34"],
        y: result?.tech_other,
      });
    }

    const colors = [
      "#2d4d76",
      "#4575b4",
      "#74add1",
      "#abd9e9",
      "#e0f3f8",
      "#ffffbf",
    ];

    setChartData({
      labels: dataPoints.map((point) => point.label),
      datasets: [
        {
          label: "Budget Distribution",
          data: dataPoints.map((point) => point.y),
          backgroundColor: colors,
          borderWidth: 1,
        },
      ],
    });
  }, [result, data]);

  const [openSection, setOpenSection] = useState("");

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? "" : id);
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

          <div className="lg:w-[70%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_spend" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_spend"
                    id="tech_spend"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_spend}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_guest" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_guest"
                    id="tech_guest"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_guest}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 ">
                {" "}
                {data?.payload?.tech_lang_keys["3"]}:
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_dress" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_dress"
                    id="tech_dress"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_dress}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_jewelery" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_jewelery"
                    id="tech_jewelery"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_jewelery}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_accessories" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_accessories"
                    id="tech_accessories"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_accessories}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_ring" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_ring"
                    id="tech_ring"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_ring}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_makeup" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_makeup"
                    id="tech_makeup"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_makeup}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12">
                <div className="grid grid-cols-12 gap-4 mt-3">
                  {/* Section 1 */}
                  <div className="col-span-12">
                    <div className="px-2 my-1">
                      <div
                        className="py-3 px-3 border cursor-pointer"
                        onClick={() => toggleSection("click1")}
                      >
                        <strong className="mx-3">
                          {data?.payload?.tech_lang_keys["9"]}
                        </strong>
                      </div>
                      {openSection === "click1" && (
                        <div className="grid grid-cols-12 mt-3 gap-4">
                          {[
                            { id: "tech_stationery", labelKey: "10" },
                            { id: "tech_photography", labelKey: "11" },
                            { id: "tech_florist", labelKey: "12" },
                            { id: "tech_planner", labelKey: "13" },
                          ].map((item) => (
                            <div
                              key={item.id}
                              className="lg:col-span-6 md:col-span-6 col-span-12"
                            >
                              <label htmlFor={item.id} className="label">
                                {data?.payload?.tech_lang_keys[item.labelKey]}:
                              </label>
                              <div className="w-full py-2 relative">
                                <input
                                  type="number"
                                  step="any"
                                  name={item.id}
                                  id={item.id}
                                  className="input"
                                  placeholder="275000"
                                  min="0"
                                  value={formData[item.id]}
                                  onChange={handleChange}
                                />
                                <span className="text-blue input_unit">
                                  {currency.symbol}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div className="col-span-12">
                    <div className="px-2 my-1">
                      <div
                        className="py-3 px-3 border cursor-pointer"
                        onClick={() => toggleSection("click2")}
                      >
                        <strong className="mx-3">
                          {data?.payload?.tech_lang_keys["14"]}
                        </strong>
                      </div>
                      {openSection === "click2" && (
                        <div className="grid grid-cols-12 mt-3 gap-4">
                          {[
                            { id: "tech_venue", labelKey: "15" },
                            { id: "tech_dinner", labelKey: "16" },
                            { id: "tech_catering", labelKey: "17" },
                            { id: "tech_cake", labelKey: "18" },
                            { id: "tech_DJs", labelKey: "19" },
                            { id: "tech_liquors", labelKey: "20" },
                          ].map((item) => (
                            <div
                              key={item.id}
                              className="lg:col-span-6 md:col-span-6 col-span-12"
                            >
                              <label htmlFor={item.id} className="label">
                                {data?.payload?.tech_lang_keys[item.labelKey]}:
                              </label>
                              <div className="w-full py-2 relative">
                                <input
                                  type="number"
                                  step="any"
                                  name={item.id}
                                  id={item.id}
                                  className="input"
                                  placeholder="275000"
                                  min="0"
                                  value={formData[item.id]}
                                  onChange={handleChange}
                                />
                                <span className="text-blue input_unit">
                                  {currency.symbol}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="col-span-12">
                    <div className="px-2 my-1">
                      <div
                        className="py-3 px-3 border cursor-pointer"
                        onClick={() => toggleSection("click3")}
                      >
                        <strong className="mx-3">
                          {data?.payload?.tech_lang_keys["21"]}
                        </strong>
                      </div>
                      {openSection === "click3" && (
                        <div className="grid grid-cols-12 mt-3 gap-4">
                          <div className="col-span-6">
                            <label htmlFor="tech_ceremony" className="label">
                              {data?.payload?.tech_lang_keys["22"]}:
                            </label>
                            <div className="w-full py-2 relative">
                              <input
                                type="number"
                                name="tech_ceremony"
                                id="tech_ceremony"
                                className="input"
                                placeholder="275000"
                                min="0"
                                value={formData.tech_ceremony}
                                onChange={handleChange}
                              />
                              <span className="text-blue input_unit">
                                {currency.symbol}
                              </span>
                            </div>
                          </div>
                          <div className="col-span-6">
                            <label htmlFor="tech_officiant" className="label">
                              {data?.payload?.tech_lang_keys["23"]}:
                            </label>
                            <div className="w-full py-2 relative">
                              <input
                                type="number"
                                name="tech_officiant"
                                id="tech_officiant"
                                className="input"
                                placeholder="275000"
                                min="0"
                                value={formData.tech_officiant}
                                onChange={handleChange}
                              />
                              <span className="text-blue input_unit">
                                {currency.symbol}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div className="col-span-12">
                    <div className="px-2 my-1">
                      <div
                        className="py-3 px-3 border cursor-pointer"
                        onClick={() => toggleSection("click4")}
                      >
                        <strong className="mx-3">
                          {data?.payload?.tech_lang_keys["24"]}
                        </strong>
                      </div>
                      {openSection === "click4" && (
                        <div className="grid grid-cols-12 mt-3 gap-4">
                          <div className="col-span-6">
                            <label htmlFor="tech_hotel" className="label">
                              {data?.payload?.tech_lang_keys["25"]}:
                            </label>
                            <div className="w-full py-2 relative">
                              <input
                                type="number"
                                name="tech_hotel"
                                id="tech_hotel"
                                className="input"
                                placeholder="0"
                                min="0"
                                value={formData.tech_hotel}
                                onChange={handleChange}
                              />
                              <span className="text-blue input_unit">
                                {currency.symbol}
                              </span>
                            </div>
                          </div>
                          <div className="col-span-6">
                            <label
                              htmlFor="tech_transportation"
                              className="label"
                            >
                              {data?.payload?.tech_lang_keys["26"]}:
                            </label>
                            <div className="w-full py-2 relative">
                              <input
                                type="number"
                                name="tech_transportation"
                                id="tech_transportation"
                                className="input"
                                placeholder="275000"
                                min="0"
                                value={formData.tech_transportation}
                                onChange={handleChange}
                              />
                              <span className="text-blue input_unit">
                                {currency.symbol}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 5 */}
                  <div className="col-span-12">
                    <div className="px-2 my-1">
                      <div
                        className="py-3 px-3 border cursor-pointer"
                        onClick={() => toggleSection("click5")}
                      >
                        <strong className="mx-3">
                          {data?.payload?.tech_lang_keys["27"]}
                        </strong>
                      </div>
                      {openSection === "click5" && (
                        <div className="grid grid-cols-12 mt-3 gap-4">
                          <div className="lg:col-span-6 md:col-span-6 col-span-12">
                            <label htmlFor="tech_other" className="label">
                              {data?.payload?.tech_lang_keys["28"]}:
                            </label>
                            <div className="w-full py-2 relative">
                              <input
                                type="number"
                                name="tech_other"
                                id="tech_other"
                                className="input"
                                placeholder="275000"
                                min="0"
                                value={formData.tech_other}
                                onChange={handleChange}
                              />
                              <span className="text-blue input_unit">
                                {currency.symbol}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
                      <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                        <table className="w-full lg:text-[18px] text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["29"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol}{" "}
                                {Number(result?.tech_average_cost).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["30"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol}{" "}
                                {Number(result?.tech_budget_balance).toFixed()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-[16px]">
                        {/* Budget Message */}
                        <div className="my-3">
                          {result?.tech_budget_balance == "0" ? (
                            <span style={{ color: "green" }}>
                              {data?.payload?.tech_lang_keys["31"]}
                            </span>
                          ) : result?.tech_budget_balance > 0 ? (
                            <span style={{ color: "green" }}>
                              {data?.payload?.tech_lang_keys["32"]}
                            </span>
                          ) : result?.tech_budget_balance < 0 ? (
                            <span style={{ color: "red" }}>
                              {data?.payload?.tech_lang_keys["33"]}
                            </span>
                          ) : null}
                        </div>

                        {/* Pie Chart */}
                        {result?.tech_average_cost !== "0" && chartData && (
                          <div className="mt-3 w-full max-w-[300px] mx-auto">
                            <Pie
                              data={chartData}
                              options={{
                                responsive: true,
                                plugins: {
                                  legend: {
                                    position: "bottom",
                                  },
                                  tooltip: {
                                    callbacks: {
                                      label: function (context) {
                                        return `${context.label}: ${currency.symbol}${context.parsed}`;
                                      },
                                    },
                                  },
                                },
                              }}
                            />
                          </div>
                        )}
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

export default WeddingBudgetCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register necessary chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

import {
  useGetSingleCalculatorDetailsMutation,
  useStockCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const StockCalculator = () => {
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

  const [formData, setFormData] = useState({
    tech_first: 15,
    tech_second: 50,
    tech_third: 5,
    tech_t_unit: "%",
    tech_four: 500,
    tech_five: 5,
    tech_f_unit: "%",
    tech_cgt: 6,
    tech_mycurrency: currency.symbol,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useStockCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_first ||
      !formData.tech_second ||
      !formData.tech_third ||
      !formData.tech_t_unit ||
      !formData.tech_four ||
      !formData.tech_five ||
      !formData.tech_f_unit ||
      !formData.tech_cgt
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
        tech_third: formData.tech_third,
        tech_t_unit: formData.tech_t_unit,
        tech_four: formData.tech_four,
        tech_five: formData.tech_five,
        tech_f_unit: formData.tech_f_unit,
        tech_cgt: formData.tech_cgt,
        tech_mycurrency: formData.tech_mycurrency,
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
      tech_first: 15332,
      tech_second: 50033,
      tech_third: 54,
      tech_t_unit: "%",
      tech_four: 5004,
      tech_five: 52,
      tech_f_unit: "%",
      tech_cgt: 64,
      tech_mycurrency: currency.symbol,
    });
    setResult(null);
    setFormError(null);
  };

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_f_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  // chart js

  const chartdata = {
    labels: ["Net Sell Price", "Net Buy Price"], // Y-axis categories
    datasets: [
      {
        label: "Price",
        data: [result?.tech_netsa_ans, result?.tech_netby_ans], // Make sure order matches labels
        backgroundColor: ["#ff6d00", "#38a169"], // orange and green
        borderRadius: 5,
        barThickness: 30,
      },
    ],
  };

  const options = {
    indexAxis: "y", // Make it horizontal
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Stock Calculator",
        font: {
          size: 20,
          weight: "bold",
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#333",
        },
        grid: {
          color: "#ccc",
        },
      },
      y: {
        ticks: {
          color: "#333",
        },
        grid: {
          color: "#ccc",
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
            <input
              type="hidden"
              step="any"
              name="tech_mycurrency"
              id="tech_mycurrency"
              className="input my-2"
              aria-label="input"
              value={currency.symbol}
            />

            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_first" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_first"
                    id="tech_first"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_first}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2 ">
                <label htmlFor="tech_second" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_second"
                    id="tech_second"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_second}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="tech_third" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_third"
                    step="any"
                    className="mt-2 input"
                    value={formData.tech_third}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_t_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "%", value: "%" },
                        { label: currency.symbol, value: currency.symbol },
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

              <div className="space-y-2 relative">
                <label htmlFor="tech_four" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_four"
                    id="tech_four"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_four}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="tech_five" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_five"
                    step="any"
                    className="mt-2 input"
                    value={formData.tech_five}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_f_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "%", value: "%" },
                        { label: currency.symbol, value: currency.symbol },
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

              <div className="space-y-2">
                <label htmlFor="tech_cgt" className="label">
                  {data?.payload?.tech_lang_keys["11"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_cgt"
                    id="tech_cgt"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_cgt}
                    onChange={handleChange}
                  />
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
                    <div className="w-full bg-light-blue  rounded-lg mt-6">
                      <div className="w-full mt-4 overflow-auto">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b w-4/5">
                                <strong>
                                  {data?.payload?.tech_lang_keys[3]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol} {result?.tech_b_c}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-4/5">
                                <strong>
                                  {data?.payload?.tech_lang_keys[6]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol} {result?.tech_netby_ans}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-4/5">
                                <strong>
                                  {data?.payload?.tech_lang_keys[5]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol} {result?.tech_s_c}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-4/5">
                                <strong>
                                  {data?.payload?.tech_lang_keys[7]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol}{" "}
                                {Number(result?.tech_netsa_ans).toFixed()}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-4/5">
                                <strong>
                                  {data?.payload?.tech_lang_keys[8]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol}{" "}
                                {Number(result?.tech_profit).toFixed()}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-4/5">
                                <strong>
                                  {data?.payload?.tech_lang_keys[9]} (ROI){" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {Number(result?.tech_roi_ans).toFixed(4)} %
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-4/5">
                                <strong>
                                  {data?.payload?.tech_lang_keys[10]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol}{" "}
                                {Number(result?.tech_break_ans).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-center text-xl mt-6">
                        <div className="my-4">
                          <Bar data={chartdata} options={options} />
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

export default StockCalculator;

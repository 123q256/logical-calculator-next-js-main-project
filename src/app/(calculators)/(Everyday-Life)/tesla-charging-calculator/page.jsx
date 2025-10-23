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

// Register chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

import {
  useGetSingleCalculatorDetailsMutation,
  useTeslaChargingCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TeslaChargingCostCalculator = () => {
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
    tech_main_unit: "Full Capacity Charging Cost", // Full Capacity Charging Cost     Custom Distance Charging Cost
    tech_battery: "3",
    tech_electricity: "4",
    tech_type: "14",
    tech_price: "4",
    tech_distance: "4",
    tech_units: "mi",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTeslaChargingCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_main_unit == data?.payload?.tech_lang_keys["23"]) {
      if (
        !formData.tech_main_unit ||
        !formData.tech_battery ||
        !formData.tech_electricity
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_main_unit ||
        !formData.tech_type ||
        !formData.tech_price ||
        !formData.tech_distance ||
        !formData.tech_units
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_main_unit: formData.tech_main_unit,
        tech_battery: formData.tech_battery,
        tech_electricity: formData.tech_electricity,
        tech_type: formData.tech_type,
        tech_price: formData.tech_price,
        tech_distance: formData.tech_distance,
        tech_units: formData.tech_units,
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
      tech_main_unit: "Full Capacity Charging Cost", // Full Capacity Charging Cost     Custom Distance Charging Cost
      tech_battery: "3",
      tech_electricity: "4",
      tech_type: "14",
      tech_price: "4",
      tech_distance: "4",
      tech_units: "mi",
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
    setFormData((prev) => ({ ...prev, tech_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // CHART

  const [interval, setInterval] = useState(5);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const generateLabels = (step) => {
    const labels = [];
    for (let i = 0; i <= 100; i += step) {
      labels.push(`${i}`);
    }
    return labels;
  };

  const generateDataset = (step, cost) => {
    const dataset = [];
    for (let i = 0; i <= 100; i += step) {
      dataset.push(cost * (i / 100));
    }
    return dataset;
  };

  useEffect(() => {
    const labels = generateLabels(interval);
    const values = generateDataset(interval, result?.tech_cost || 0);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: "Charging Cost",
          data: values,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.4,
        },
      ],
    });
  }, [interval, result]);

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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_main_unit" className="label">
                  {data?.payload?.tech_lang_keys["20"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_main_unit"
                    id="tech_main_unit"
                    value={formData.tech_main_unit}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys["23"]}>
                      {data?.payload?.tech_lang_keys["23"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["24"]}>
                      {data?.payload?.tech_lang_keys["24"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_main_unit ==
                data?.payload?.tech_lang_keys["23"] && (
                <>
                  <div className="col-span-12 cost">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-6">
                        <label htmlFor="tech_battery" className="label">
                          {data?.payload?.tech_lang_keys["21"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_battery"
                            id="tech_battery"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_battery}
                            onChange={handleChange}
                          />
                          <span className="input_unit">kWh</span>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_electricity" className="label">
                          {data?.payload?.tech_lang_keys["22"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_electricity"
                            id="tech_electricity"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_electricity}
                            onChange={handleChange}
                          />
                          <span className="input_unit">per kWh</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_main_unit ==
                data?.payload?.tech_lang_keys["24"] && (
                <>
                  <div className="col-span-12 c_cost">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-6">
                        <label htmlFor="tech_type" className="label">
                          {data?.payload?.tech_lang_keys["1"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_type"
                            id="tech_type"
                            value={formData.tech_type}
                            onChange={handleChange}
                          >
                            <option value="1">
                              Tesla Model S (2013 - 60D)
                            </option>
                            <option value="2">
                              Tesla Model S (2016 - 60D)
                            </option>
                            <option value="3">
                              Tesla Model S (2017 - 100D){" "}
                            </option>
                            <option value="4">Tesla Model 3 (2019) </option>
                            <option value="5">Tesla Model 3 (2021) </option>
                            <option value="6">
                              Tesla Model X (2016 - 90D){" "}
                            </option>
                            <option value="7">
                              {" "}
                              Tesla Model X (2016 - P100D)
                            </option>
                            <option value="8">Tesla Model Y (2021) </option>
                            <option value="9"> Chevrolet Bolt (2016)</option>
                            <option value="10">
                              {" "}
                              Audi Q4 e-tron 50 quattro
                            </option>
                            <option value="11"> Nissan Leaf</option>
                            <option value="12"> Hyundai IONIQ Electric</option>
                            <option value="13">Citroen e-C4 </option>
                            <option value="14"> Kia EV6</option>
                            <option value="15"> Kia Soul EV</option>
                            <option value="16"> BMW i3</option>
                            <option value="17"> BMW i4</option>
                            <option value="18">Fiat 500e </option>
                            <option value="19"> Hyundai Kona Electric</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_price" className="label">
                          {data?.payload?.tech_lang_keys["2"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_price"
                            id="tech_price"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_price}
                            onChange={handleChange}
                          />
                          <span className="input_unit">{currency.symbol}</span>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_distance" className="label">
                          {data?.payload?.tech_lang_keys["3"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_distance"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_distance}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4  "
                            onClick={toggleDropdown}
                          >
                            {formData.tech_units} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "km", value: "km" },
                                { label: "mi", value: "mi" },
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["4"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol} {result?.tech_cost}
                                </td>
                              </tr>
                              {formData?.tech_main_unit ==
                                data?.payload?.tech_lang_keys["24"] && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["6"]}{" "}
                                      {data?.payload?.tech_lang_keys["4"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_ec).toFixed(2)}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        {formData?.tech_main_unit ==
                          data?.payload?.tech_lang_keys["24"] && (
                          <div className="w-full md:w-[60%] lg:w-[60%]  overflow-auto">
                            <p className="text-[20px] mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]}
                              </strong>
                            </p>
                            <table className="w-full font-s-18 mt-2">
                              <thead>
                                <tr id="first_roow">
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["8"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_name}
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["9"]}{" "}
                                    {data?.payload?.tech_lang_keys["10"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_capacity}{" "}
                                    {data?.payload?.tech_lang_keys["11"]}{" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["9"]}{" "}
                                    {data?.payload?.tech_lang_keys["12"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_capacity * 1000}{" "}
                                    {data?.payload?.tech_lang_keys["13"]}{" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["14"]}{" "}
                                    {data?.payload?.tech_lang_keys["15"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {Number(result?.tech_efficiency).toFixed(2)}{" "}
                                    {data?.payload?.tech_lang_keys["16"]}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["14"]}{" "}
                                    {data?.payload?.tech_lang_keys["17"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {Number(
                                      result?.tech_efficiency * 1.61
                                    ).toFixed(2)}{" "}
                                    {data?.payload?.tech_lang_keys["18"]}{" "}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                        <div className="w-full bg-white p-4 rounded-lg mt-4">
                          <div className="col-4 my-3">
                            <p className="font-semibold">
                              {data?.payload?.tech_lang_keys["19"]}:
                            </p>
                            <select
                              className="input mt-3 border p-2 rounded"
                              value={interval}
                              onChange={(e) =>
                                setInterval(parseInt(e.target.value))
                              }
                            >
                              <option value={5}>5 %</option>
                              <option value={10}>10 %</option>
                              <option value={20}>20 %</option>
                              <option value={50}>50 %</option>
                            </select>
                          </div>

                          <div className="mt-6">
                            <Line
                              data={chartData}
                              options={{
                                responsive: true,
                                plugins: {
                                  title: {
                                    display: true,
                                    text: "Charging cost vs Battery level",
                                  },
                                  legend: {
                                    display: false,
                                  },
                                },
                                scales: {
                                  y: {
                                    title: {
                                      display: true,
                                      text: "Cost",
                                    },
                                    beginAtZero: true,
                                  },
                                  x: {
                                    title: {
                                      display: true,
                                      text: "Battery Level (%)",
                                    },
                                  },
                                },
                              }}
                            />
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

export default TeslaChargingCostCalculator;

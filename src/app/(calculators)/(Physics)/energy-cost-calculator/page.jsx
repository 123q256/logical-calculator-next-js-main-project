"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useEnergyCostCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EnergyCostCalculator = () => {
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
    tech_appliance: 1000,
    tech_power: 1000,
    tech_power_units: "kilowatts (kW)",
    tech_hours_per_day: 8,
    tech_cost: 15,
    tech_cost_units: "/rupee",
    tech_currancy: "$",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEnergyCostCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      // If appliance is selected, auto-set tech_power
      if (name === "tech_appliance") {
        updatedData.tech_power = value; // because value of select is the power
      }

      return updatedData;
    });

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_appliance) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_appliance: formData.tech_appliance,
        tech_power: formData.tech_power,
        tech_power_units: formData.tech_power_units,
        tech_hours_per_day: formData.tech_hours_per_day,
        tech_cost: formData.tech_cost,
        tech_cost_units: formData.tech_cost_units,
        tech_currancy: formData.tech_currancy,
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
      tech_appliance: 1000,
      tech_power: 1000,
      tech_power_units: "kilowatts (kW)",
      tech_hours_per_day: 8,
      tech_cost: 15,
      tech_cost_units: "/rupee",
      tech_currancy: "$",
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
    setFormData((prev) => ({ ...prev, tech_power_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cost_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <input
              type="hidden"
              step="any"
              name="tech_currancy"
              value={currency.symbol}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="">
                <label htmlFor="tech_appliance" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_appliance"
                    id="tech_appliance"
                    value={formData.tech_appliance}
                    onChange={handleChange}
                  >
                    <option value="600">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="3000">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="2400">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="1600">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="2000">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="70">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="2000">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="800">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="100">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="50">
                      {data?.payload?.tech_lang_keys["18"]}
                    </option>
                    <option value="200">
                      {data?.payload?.tech_lang_keys["19"]}
                    </option>
                    <option value="200">
                      {data?.payload?.tech_lang_keys["20"]}
                    </option>
                    <option value="70">
                      {data?.payload?.tech_lang_keys["21"]}
                    </option>
                    <option value="1000">
                      {data?.payload?.tech_lang_keys["22"]}
                    </option>
                    <option value="1600">
                      {data?.payload?.tech_lang_keys["23"]}
                    </option>
                    <option value="2000">
                      {data?.payload?.tech_lang_keys["24"]}
                    </option>
                    <option value="4000">
                      {data?.payload?.tech_lang_keys["25"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="">
                <label htmlFor="tech_power" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_power"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_power}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_power_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "watts (W)", value: "watts (W)" },
                        { label: "kilowatts (kW)", value: "kilowatts (kW)" },
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
              <div className=" relative">
                <label htmlFor="tech_hours_per_day" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_hours_per_day"
                    id="tech_hours_per_day"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_hours_per_day}
                    onChange={handleChange}
                  />
                  <span className="input_unit">h/day</span>
                </div>
              </div>
              <div className="">
                <label htmlFor="tech_cost" className="label">
                  {data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_cost"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_cost}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_cost_units} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: currency.symbol + "/cent",
                          value: currency.symbol + "/cent",
                        },
                        {
                          label: currency.symbol + "/pence",
                          value: currency.symbol + "/pence",
                        },
                        {
                          label: currency.symbol + "/rupee",
                          value: currency.symbol + "/rupee",
                        },
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
                    <div className="w-full bg-light-blue  rounded-lg mt-3">
                      <div className="flex">
                        <div className="w-full lg:w-1/2 overflow-auto">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[6]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {" "}
                                    {currency.symbol}{" "}
                                    {result?.tech_energy_cost_per_day}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[7]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {" "}
                                    {currency.symbol}{" "}
                                    {result?.tech_energy_cost_per_month}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[8]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {" "}
                                    {currency.symbol}{" "}
                                    {result?.tech_energy_cost_per_year}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
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

export default EnergyCostCalculator;

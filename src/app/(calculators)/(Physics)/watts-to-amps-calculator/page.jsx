"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useWattsToAmpsCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WattsToAmpsCalculator = () => {
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
    tech_unit_type: "lbs",
    tech_current_type: "DC",
    tech_power: "8",
    tech_power_unit: "W",
    tech_voltage_type: "ltn",
    tech_voltage: "120",
    tech_voltage_unit: "kV",
    tech_power_factor: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWattsToAmpsCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_unit_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_current_type: formData.tech_current_type,
        tech_power: formData.tech_power,
        tech_power_unit: formData.tech_power_unit,
        tech_voltage_type: formData.tech_voltage_type,
        tech_voltage: formData.tech_voltage,
        tech_voltage_unit: formData.tech_voltage_unit,
        tech_power_factor: formData.tech_power_factor,
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
      tech_unit_type: "lbs",
      tech_current_type: "DC",
      tech_power: "8",
      tech_power_unit: "W",
      tech_voltage_type: "ltn",
      tech_voltage: "120",
      tech_voltage_unit: "kV",
      tech_power_factor: "1",
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
    setFormData((prev) => ({ ...prev, tech_power_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_voltage_unit: unit }));
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="mx-auto mt-2 w-full">
              <div className="col-lg-3 font-s-14 hidden lg:block">
                {data?.payload?.tech_lang_keys["to_calc"] || "To Calculate"}:
              </div>
              <input
                type="hidden"
                name="unit_type"
                id="unit_type"
                value="lbs"
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className="bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white imperial"
                    id="imperial"
                  >
                    <a
                      href="/amps-to-watts-calculator"
                      className="cursor-pointer veloTabs no-underline"
                    >
                      <strong>
                        {data?.payload?.tech_lang_keys["1"] || "Watts to Amps"}
                      </strong>
                    </a>
                  </div>
                </div>

                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className="bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white metric tagsUnit"
                    id="metric"
                  >
                    <strong>{data?.payload?.tech_lang_keys["2"]}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12  mt-3  gap-2">
              <div className="col-span-6">
                <label htmlFor="tech_current_type" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_current_type"
                    id="tech_current_type"
                    value={formData.tech_current_type}
                    onChange={handleChange}
                  >
                    <option value="DC">
                      {data?.payload?.tech_lang_keys["4"]} (DC)
                    </option>
                    <option value="AC">
                      {data?.payload?.tech_lang_keys["5"]} (AC) -{" "}
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                    <option value="ACT">
                      {data?.payload?.tech_lang_keys["7"]} (AC) -{" "}
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                  </select>
                </div>
              </div>

              <div className="col-span-6">
                <label htmlFor="tech_power" className="label">
                  {data?.payload?.tech_lang_keys["9"]}{" "}
                  {data?.payload?.tech_lang_keys["10"]}
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
                    {formData.tech_power_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "mW", value: "mW" },
                        { label: "W", value: "W" },
                        { label: "kW", value: "kW" },
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

              {formData.tech_current_type == "ACT" && (
                <>
                  <div className="col-span-6 ">
                    <label htmlFor="tech_voltage_type" className="label">
                      {data?.payload?.tech_lang_keys["11"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_voltage_type"
                        id="tech_voltage_type"
                        value={formData.tech_voltage_type}
                        onChange={handleChange}
                      >
                        <option value="ltl">
                          {data?.payload?.tech_lang_keys["12"]}{" "}
                        </option>
                        <option value="ltn">
                          {data?.payload?.tech_lang_keys["13"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-6">
                <label htmlFor="tech_voltage" className="label">
                  {data?.payload?.tech_lang_keys["14"]}{" "}
                  {data?.payload?.tech_lang_keys["15"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_voltage"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_voltage}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_voltage_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "mV", value: "mV" },
                        { label: "V", value: "V" },
                        { label: "kV", value: "kV" },
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
              {(formData.tech_current_type == "AC" ||
                formData.tech_current_type == "ACT") && (
                <>
                  <div className="col-span-6 ">
                    <label htmlFor="tech_power_factor" className="label">
                      {data?.payload?.tech_lang_keys["16"]} (≤1):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        max="1"
                        step="any"
                        name="tech_power_factor"
                        id="tech_power_factor"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_power_factor}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
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
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["17"]} (amps)
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_amps_ans).toFixed(2)} A
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["17"]} (
                                  {data?.payload?.tech_lang_keys["18"]})
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_amps_ans * 1000
                                    ).toFixed(2)}{" "}
                                    mA
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

export default WattsToAmpsCalculator;

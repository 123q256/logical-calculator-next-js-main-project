"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useElectricityCostCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ElectricityCostCalculator = () => {
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
    tech_unit_type: "simple", // simple  advance
    tech_first: 13,
    tech_units1: "mW",
    tech_second: 9,
    tech_third: 3,
    tech_units3: "days",
    tech_uc_appliance: 4000,
    tech_f_first: 4000,
    tech_f_second: 9,
    tech_f_third: 15,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useElectricityCostCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "tech_uc_appliance") {
        if (value === "other") {
          // If "other" selected, clear tech_f_first
          updatedData.tech_f_first = "";
        } else {
          // Otherwise, set tech_f_first to selected value
          updatedData.tech_f_first = value;
        }
      }

      return updatedData;
    });

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
        tech_first: formData.tech_first,
        tech_units1: formData.tech_units1,
        tech_second: formData.tech_second,
        tech_third: formData.tech_third,
        tech_units3: formData.tech_units3,
        tech_uc_appliance: formData.tech_uc_appliance,
        tech_f_first: formData.tech_f_first,
        tech_f_second: formData.tech_f_second,
        tech_f_third: formData.tech_f_third,
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
      tech_unit_type: "simple", // simple  advance
      tech_first: 13,
      tech_units1: "mW",
      tech_second: 9,
      tech_third: 3,
      tech_units3: "days",
      tech_uc_appliance: 4000,
      tech_f_first: 4000,
      tech_f_second: 9,
      tech_f_third: 15,
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
    setFormData((prev) => ({ ...prev, tech_units1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units3: unit }));
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
            <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="tech_unit_type"
                id="calculator_time"
                value={formData.tech_unit_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_unit_type === "simple" ? "tagsUnit" : ""
                    }`}
                    id="simple"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "simple" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["35"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit_type === "advance" ? "tagsUnit" : ""
                    }`}
                    id="advance"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "advance" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["36"]}
                  </div>
                </div>
              </div>
            </div>
            {formData.tech_unit_type == "simple" && (
              <>
                <div className="grid grid-cols-12 mt-3  gap-4" id="converter">
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_first" className="label">
                      {data?.payload?.tech_lang_keys["28"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_first"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_first}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_units1} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mW", value: "mW" },
                            { label: "W", value: "W" },
                            { label: "kW", value: "kW" },
                            { label: "MW", value: "MW" },
                            { label: "GW", value: "GW" },
                            { label: "BTU/h", value: "BTU/h" },
                            { label: "hp(l)", value: "hp(l)" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_second" className="label">
                      {data?.payload?.tech_lang_keys["29"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_second"
                        id="tech_second"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_second}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}/kWh</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_third" className="label">
                      {data?.payload?.tech_lang_keys["30"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_third"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_third}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_units3} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "days", value: "days" },
                            { label: "wks", value: "wks" },
                            { label: "mons", value: "mons" },
                            { label: "yrs", value: "yrs" },
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
              </>
            )}
            {formData.tech_unit_type == "advance" && (
              <>
                <div className="grid grid-cols-12 mt-3  gap-4 " id="calculator">
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_uc_appliance" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_uc_appliance"
                        id="tech_uc_appliance"
                        value={formData.tech_uc_appliance}
                        onChange={handleChange}
                      >
                        <option value="2000">
                          {" "}
                          {data?.payload?.tech_lang_keys["2"]} (2,000W)
                        </option>
                        <option value="9600">
                          {" "}
                          {data?.payload?.tech_lang_keys["3"]} (9,600W)
                        </option>
                        <option value="1500">
                          {" "}
                          {data?.payload?.tech_lang_keys["4"]} (1,500W)
                        </option>
                        <option value="1500">
                          {data?.payload?.tech_lang_keys["5"]} (1,500W)
                        </option>
                        <option value="5000">
                          {data?.payload?.tech_lang_keys["6"]} (5,000W)
                        </option>
                        <option value="150">
                          {data?.payload?.tech_lang_keys["7"]} (150W)
                        </option>
                        <option value="100">
                          {data?.payload?.tech_lang_keys["8"]} (100W)
                        </option>
                        <option value="2000">
                          {data?.payload?.tech_lang_keys["9"]} (2,000W)
                        </option>
                        <option value="1000">
                          {data?.payload?.tech_lang_keys["10"]} (1,000W)
                        </option>
                        <option value="1200">
                          {data?.payload?.tech_lang_keys["11"]} (1,200W)
                        </option>
                        <option value="500">
                          {data?.payload?.tech_lang_keys["12"]} (500W)
                        </option>
                        <option value="4000">
                          {data?.payload?.tech_lang_keys["13"]} (4,000W)
                        </option>
                        <option value="200">
                          {data?.payload?.tech_lang_keys["14"]} (200W)
                        </option>
                        <option value="50">
                          {data?.payload?.tech_lang_keys["15"]} (50W)
                        </option>
                        <option value="20">
                          {data?.payload?.tech_lang_keys["16"]} (20W)
                        </option>
                        <option value="90">
                          {data?.payload?.tech_lang_keys["17"]} (90W)
                        </option>
                        <option value="260">
                          {data?.payload?.tech_lang_keys["18"]} (260W)
                        </option>
                        <option value="7">
                          {data?.payload?.tech_lang_keys["19"]} (7W)
                        </option>
                        <option value="16">
                          {data?.payload?.tech_lang_keys["20"]} (16W)
                        </option>
                        <option value="60">
                          {data?.payload?.tech_lang_keys["21"]} (60W)
                        </option>
                        <option value="25">
                          {data?.payload?.tech_lang_keys["22"]} (25W)
                        </option>
                        <option value="10">
                          {data?.payload?.tech_lang_keys["23"]} (10W)
                        </option>
                        <option value="other">
                          {data?.payload?.tech_lang_keys[24]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_f_first" className="label">
                      {data?.payload?.tech_lang_keys["25"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_f_first"
                        id="tech_f_first"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_f_first}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_f_second" className="label">
                      {data?.payload?.tech_lang_keys["26"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_f_second"
                        id="tech_f_second"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_f_second}
                        onChange={handleChange}
                      />
                      <span className="input_unit"></span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_f_third" className="label">
                      {data?.payload?.tech_lang_keys["27"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_f_third"
                        id="tech_f_third"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_f_third}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="grid  mt-2 overflow-auto">
                        <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="30%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[32]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_answer).toFixed(2)} (kWh
                                per month)
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="30%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[33]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_cost).toFixed(2)} (
                                {currency.symbol} per month)
                              </td>
                            </tr>
                          </tbody>
                        </table>
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

export default ElectricityCostCalculator;

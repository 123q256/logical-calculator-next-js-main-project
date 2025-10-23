"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDcWireSizeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DcWireSizeCalculator = () => {
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
    tech_unit_type: "wire_size", // wire_size wire_diameter   wire_gauge
    tech_type: "single_phase",
    tech_s_voltage: "5.771",
    tech_sv_units: "mV",
    tech_voltage_drop: "3",
    tech_c_units: "copper",
    tech_current: "1200",
    tech_current_unit: "A",
    tech_wire_length: "1200",
    tech_wl_units: "cm",
    tech_w_temp: "1200",
    tech_wire_gauge: "2000-kcmil",
    tech_wt_units: "°C",
    tech_wire_diameter: "5.771",
    tech_wd_units: "in",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDcWireSizeCalculatorMutation();

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
        tech_type: formData.tech_type,
        tech_s_voltage: formData.tech_s_voltage,
        tech_sv_units: formData.tech_sv_units,
        tech_voltage_drop: formData.tech_voltage_drop,
        tech_c_units: formData.tech_c_units,
        tech_current: formData.tech_current,
        tech_current_unit: formData.tech_current_unit,
        tech_wire_length: formData.tech_wire_length,
        tech_wl_units: formData.tech_wl_units,
        tech_w_temp: formData.tech_w_temp,
        tech_wire_gauge: formData.tech_wire_gauge,
        tech_wire_diameter: formData.tech_wire_diameter,
        tech_wd_units: formData.tech_wd_units,
        tech_wt_units: formData.tech_wt_units,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_unit_type: "wire_size", // wire_size wire_diameter   wire_gauge
      tech_type: "single_phase",
      tech_s_voltage: "5.771",
      tech_sv_units: "mV",
      tech_voltage_drop: "3",
      tech_c_units: "copper",
      tech_current: "1200",
      tech_current_unit: "A",
      tech_wire_length: "1200",
      tech_wl_units: "cm",
      tech_w_temp: "1200",
      tech_wire_gauge: "2000-kcmil",
      tech_wt_units: "°C",
      tech_wire_diameter: "5.771",
      tech_wd_units: "in",
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
    setFormData((prev) => ({ ...prev, tech_wd_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sv_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_current_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wl_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wt_units: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
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

          <div className="lg:w-[90%] md:w-[100%] w-full mx-auto ">
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
                    formData.tech_unit_type === "wire_size" ? "tagsUnit" : ""
                  }`}
                  id="wire_size"
                  onClick={() => {
                    setFormData({ ...formData, tech_unit_type: "wire_size" });
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
                    formData.tech_unit_type === "wire_diameter"
                      ? "tagsUnit"
                      : ""
                  }`}
                  id="wire_diameter"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      tech_unit_type: "wire_diameter",
                    });
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
                    formData.tech_unit_type === "wire_gauge" ? "tagsUnit" : ""
                  }`}
                  id="wire_gauge"
                  onClick={() => {
                    setFormData({ ...formData, tech_unit_type: "wire_gauge" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["3"]}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-4 gap-4">
              {formData.tech_unit_type == "wire_size" && (
                <>
                  <div className="col-span-12 wire_size" id="wire_sizes">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="lg:col-span-6 md:col-span-6 col-span-12">
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
                            <option value="single_phase">
                              {data?.payload?.tech_lang_keys["36"]}
                            </option>
                            <option value="three_phase">
                              {data?.payload?.tech_lang_keys["37"]}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="lg:col-span-6 md:col-span-6 col-span-12">
                        <label htmlFor="tech_s_voltage" className="label">
                          {data?.payload?.tech_lang_keys["5"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_s_voltage"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_s_voltage}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_sv_units} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "mV", value: "mV" },
                                { label: "V", value: "V" },
                                { label: "kV", value: "kV" },
                                { label: "MV", value: "MV" },
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
                      <div className="col-span-6">
                        <label htmlFor="tech_voltage_drop" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_voltage_drop"
                            id="tech_voltage_drop"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_voltage_drop}
                            onChange={handleChange}
                          />
                          <span className="input_unit">%</span>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_c_units" className="label">
                          {data?.payload?.tech_lang_keys["7"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_c_units"
                            id="tech_c_units"
                            value={formData.tech_c_units}
                            onChange={handleChange}
                          >
                            <option value="copper">
                              {data?.payload?.tech_lang_keys["38"]}
                            </option>
                            <option value="aluminum">
                              {data?.payload?.tech_lang_keys["39"]}
                            </option>
                            <option value="gold">
                              {data?.payload?.tech_lang_keys["40"]}
                            </option>
                            <option value="silver">
                              {data?.payload?.tech_lang_keys["41"]}
                            </option>
                            <option value="nickel">
                              {data?.payload?.tech_lang_keys["42"]}
                            </option>
                            <option value="steel">
                              {data?.payload?.tech_lang_keys["43"]}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_current" className="label">
                          {data?.payload?.tech_lang_keys["8"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_current"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_current}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_current_unit} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "A", value: "A" },
                                { label: "mA", value: "mA" },
                                { label: "µA", value: "µA" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler2(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_wire_length" className="label">
                          {data?.payload?.tech_lang_keys["9"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_wire_length"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_wire_length}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_wl_units} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "km", value: "km" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                                { label: "mi", value: "mi" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler3(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_w_temp" className="label">
                          {data?.payload?.tech_lang_keys["10"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_w_temp"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_w_temp}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown4}
                          >
                            {formData.tech_wt_units} ▾
                          </label>
                          {dropdownVisible4 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "°C", value: "°C" },
                                { label: "°F", value: "°F" },
                                { label: "K", value: "K" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler4(unit.value)}
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

              {formData.tech_unit_type == "wire_diameter" && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12 wire_diameter "
                    id="wire_diameters"
                  >
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 ">
                        <label htmlFor="tech_wire_gauge" className="label">
                          {data?.payload?.tech_lang_keys["11"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_wire_gauge"
                            id="tech_wire_gauge"
                            value={formData.tech_wire_gauge}
                            onChange={handleChange}
                          >
                            <option value="2000-kcmil">2000 kcmil</option>
                            <option value="1750-kcmil">1750 kcmil</option>
                            <option value="1500-kcmil">1500 kcmil</option>
                            <option value="1250-kcmil">1250 kcmil</option>
                            <option value="1000-kcmil">1000 kcmil</option>
                            <option value="900-kcmil">900 kcmil</option>
                            <option value="800-kcmil">800 kcmil</option>
                            <option value="750-kcmil">750 kcmil</option>
                            <option value="700-kcmil">700 kcmil</option>
                            <option value="600-kcmil">600 kcmil</option>
                            <option value="500-kcmil">500 kcmil</option>
                            <option value="400-kcmil">400 kcmil</option>
                            <option value="350-kcmil">350 kcmil</option>
                            <option value="300-kcmil">300 kcmil</option>
                            <option value="250-kcmil">250 kcmil</option>
                            <option value="0000 (4/0)">0000 (4/0) AWG</option>
                            <option value="000 (3/0)">000 (3/0) AWG</option>
                            <option value="00 (2/0)">00 (2/0) AWG</option>
                            <option value="0 (1/0)">0 (1/0) AWG</option>
                            <option value="1">1 AWG</option>
                            <option value="2">2 AWG</option>
                            <option value="3">3 AWG</option>
                            <option value="4">4 AWG</option>
                            <option value="5">5 AWG</option>
                            <option value="6">6 AWG</option>
                            <option value="7">7 AWG</option>
                            <option value="8">8 AWG</option>
                            <option value="9">9 AWG</option>
                            <option value="10">10 AWG</option>
                            <option value="11">11 AWG</option>
                            <option value="12">12 AWG</option>
                            <option value="13">13 AWG</option>
                            <option value="14">14 AWG</option>
                            <option value="15">15 AWG</option>
                            <option value="16">16 AWG</option>
                            <option value="17">17 AWG</option>
                            <option value="18">18 AWG</option>
                            <option value="19">19 AWG</option>
                            <option value="20">20 AWG</option>
                            <option value="21">21 AWG</option>
                            <option value="22">22 AWG</option>
                            <option value="23">23 AWG</option>
                            <option value="24">24 AWG</option>
                            <option value="25">25 AWG</option>
                            <option value="26">26 AWG</option>
                            <option value="27">27 AWG</option>
                            <option value="28">28 AWG</option>
                            <option value="29">29 AWG</option>
                            <option value="30">30 AWG</option>
                            <option value="31">31 AWG</option>
                            <option value="32">32 AWG</option>
                            <option value="33">33 AWG</option>
                            <option value="34">34 AWG</option>
                            <option value="35">35 AWG</option>
                            <option value="36">36 AWG</option>
                            <option value="37">37 AWG</option>
                            <option value="38">38 AWG</option>
                            <option value="39">39 AWG</option>
                            <option value="40">40 AWG</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_unit_type == "wire_gauge" && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12 wire_gauge "
                    id="wire_gauges"
                  >
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12">
                        <label htmlFor="tech_wire_diameter" className="label">
                          {data?.payload?.tech_lang_keys["12"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_wire_diameter"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_wire_diameter}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_wd_units} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "in", value: "in" },
                                { label: "mm", value: "mm" },
                                { label: "cm", value: "cm" },
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
                      <div className="row">
                        {result?.tech_type === "single_phase" && (
                          <>
                            <div className="col-lg-6 mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["13"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {result?.tech_s_data[1]}{" "}
                                        {data?.payload?.tech_lang_keys[14]}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["15"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {Number(
                                          result?.tech_single_phase
                                        ).toFixed(2)}{" "}
                                        mm<sup className="text-blue">2</sup>
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="col-12 my-3 text-[18px]">
                              {data?.payload?.tech_lang_keys[16]}
                            </p>

                            <div className="col-12 overflow-auto">
                              <table
                                className="w-full"
                                style={{ borderCollapse: "collapse" }}
                              >
                                <thead>
                                  <tr className="bg-[#2845F5] text-white">
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys[17]}
                                      </strong>
                                    </td>
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["18"]}
                                      </strong>
                                    </td>
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </strong>
                                    </td>
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["20"]}
                                      </strong>
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="">
                                    <td className="text-center p-2 border">
                                      {Number(
                                        result?.tech_single_phase
                                      ).toFixed(2) * 0.000001}{" "}
                                      m²
                                    </td>
                                    <td className="text-center p-2 border">
                                      {Number(
                                        Number(
                                          result?.tech_single_phase
                                        ).toFixed(2) * 0.00155
                                      ).toFixed(2)}{" "}
                                      in²
                                    </td>
                                    <td className="text-center p-2 border">
                                      {Number(
                                        Number(
                                          result?.tech_single_phase
                                        ).toFixed(2) * 1973.6
                                      ).toFixed(2)}{" "}
                                      cmil
                                    </td>
                                    <td className="text-center p-2 border">
                                      {Number(
                                        Number(
                                          result?.tech_single_phase
                                        ).toFixed(2) * 1.9736
                                      ).toFixed(2)}{" "}
                                      kcmil
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="overflow-auto">
                              <p className="w-full mt-3 text-[18px]">
                                {data?.payload?.tech_lang_keys[21]}
                              </p>
                              <BlockMath math="A(m^2)= \dfrac{I(A) \times ρ(Ω·m) \times L(m)}{V_V}" />
                              <p className="w-full mt-2">Where:</p>
                              <p className="w-full mt-2">
                                A = {data?.payload?.tech_lang_keys[22]}
                              </p>
                              <p className="w-full mt-2">
                                ρ = {data?.payload?.tech_lang_keys[23]} (Ω·m)
                              </p>
                              <p className="w-full mt-2">
                                L = {data?.payload?.tech_lang_keys[24]}
                              </p>
                              <p className="w-full mt-2">
                                I = {data?.payload?.tech_lang_keys[25]}
                              </p>
                              <p className="w-full mt-2">
                                v = {data?.payload?.tech_lang_keys[26]}
                              </p>
                              <p className="w-full mt-2">V = Source voltage</p>

                              <p className="w-full my-3 text-[18px]">
                                {data?.payload?.tech_lang_keys["27"]}
                              </p>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys[28]} (ρ) ={" "}
                                {result?.tech_c_units} ({result?.tech_metalunit}
                                ) Ω⋅m
                              </p>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys[29]} (L) ={" "}
                                {result?.tech_wire_length} m
                              </p>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys[30]} (I) ={" "}
                                {result?.tech_current} A
                              </p>
                              <p className="w-full mt-2">
                                Source voltage (V) = {result?.tech_s_voltage} V
                              </p>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys[31]} (v) ={" "}
                                {result?.tech_voltage_drop} %
                              </p>

                              <p className="w-full my-3 text-[18px]">
                                {data?.payload?.tech_lang_keys[32]}
                              </p>

                              <BlockMath math="A(m^2)= \dfrac{I(A) \times ρ(Ω·m) \times L(m)}{V_V}" />
                              <BlockMath
                                math={`= \\dfrac{${
                                  result?.tech_current
                                } \\times ${Number(
                                  result?.tech_metalunit
                                ).toFixed(
                                  2
                                )} \\times 10^{-8} \\times (2 \\times ${
                                  result?.tech_wire_length
                                })}{${
                                  result?.tech_voltage_drop / 100
                                } \\times ${result?.tech_s_voltage}}`}
                              />
                              <BlockMath
                                math={`= \\dfrac{${result?.tech_res}}{${result?.tech_v}}`}
                              />
                              <BlockMath
                                math={`= ${result?.tech_am} mm \\times 1000000`}
                              />
                              <BlockMath
                                math={`= ${Number(
                                  result?.tech_single_phase
                                ).toFixed(2)} mm^2`}
                              />

                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys[33]}{" "}
                                <strong>{result?.tech_s_data[1]} AWG</strong>{" "}
                                {data?.payload?.tech_lang_keys[34]}{" "}
                                <strong>
                                  {Number(result?.tech_single_phase).toFixed(2)}{" "}
                                  mm²
                                </strong>{" "}
                                {data?.payload?.tech_lang_keys[35]}.
                              </p>
                            </div>
                          </>
                        )}
                        {result?.tech_submit == "three_phase" && (
                          <>
                            <div className="col-lg-6 mt-2 overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["13"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {result?.tech_t_data[1]} AWG
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["15"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {Number(
                                          result?.tech_three_phase
                                        ).toFixed(2)}{" "}
                                        mm<sup className="text-blue">2</sup>
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="w-full my-3 text-[18px]">
                              {data?.payload?.tech_lang_keys["16"]}
                            </p>

                            <div className="w-full overflow-auto">
                              <table
                                className="w-full"
                                style={{ borderCollapse: "collapse" }}
                              >
                                <thead>
                                  <tr className="bg-[#2845F5] text-white">
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["17"]}
                                      </strong>
                                    </td>
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["18"]}
                                      </strong>
                                    </td>
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </strong>
                                    </td>
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["20"]}
                                      </strong>
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="bg-sky">
                                    <td className="p-2 border text-center">
                                      {Number(result?.tech_three_phase).toFixed(
                                        2
                                      ) * 0.000001}{" "}
                                      m²
                                    </td>
                                    <td className="p-2 border text-center">
                                      {Number(
                                        result?.tech_three_phase * 0.00155
                                      ).toFixed(2)}{" "}
                                      in²
                                    </td>
                                    <td className="p-2 border text-center">
                                      {Number(
                                        result?.tech_three_phase * 1973.6
                                      ).toFixed(2)}{" "}
                                      cmil
                                    </td>
                                    <td className="p-2 border text-center">
                                      {Number(
                                        result?.tech_three_phase * 1.9736
                                      ).toFixed(2)}{" "}
                                      kcmil
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="overflow-auto">
                              <p className="w-full my-3 text-[18px]">
                                {data?.payload?.tech_lang_keys["21"]}
                              </p>

                              <BlockMath
                                math={`A(m^2) = \\frac{\\sqrt{3} \\times \\rho(\\Omega \\cdot m) \\times L(m) \\times I(A)}{V_V}`}
                              />

                              <p className="w-full mt-2">Where:</p>
                              <p className="w-full mt-2">
                                A = {data?.payload?.tech_lang_keys["22"]}
                              </p>
                              <p className="w-full mt-2">
                                ρ = {data?.payload?.tech_lang_keys["23"]} (Ω·m)
                              </p>
                              <p className="w-full mt-2">
                                L = {data?.payload?.tech_lang_keys["24"]}
                              </p>
                              <p className="w-full mt-2">
                                I = {data?.payload?.tech_lang_keys["25"]}
                              </p>
                              <p className="w-full mt-2">
                                v = {data?.payload?.tech_lang_keys["26"]}
                              </p>
                              <p className="w-full mt-2">V = Source voltage</p>

                              <p className="w-full my-3 text-[18px]">
                                {data?.payload?.tech_lang_keys["27"]}
                              </p>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys["28"]} (ρ) ={" "}
                                {result?.tech_c_units} ({result?.tech_metalunit}
                                ) Ω⋅m
                              </p>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys["29"]}(L) ={" "}
                                {result?.tech_wire_length} m
                              </p>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys["30"]} (I) ={" "}
                                {result?.tech_current} A
                              </p>
                              <p className="w-full mt-2">
                                Source voltage (V) = {result?.tech_s_voltage} V
                              </p>
                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys["31"]} (v) ={" "}
                                {result?.tech_voltage_drop} %
                              </p>

                              <p className="w-full my-3 text-[18px]">
                                {data?.payload?.tech_lang_keys["32"]}
                              </p>

                              <BlockMath
                                math={`A(m^2) = \\frac{\\sqrt{3} \\times \\rho(\\Omega \\cdot m) \\times L(m) \\times I(A)}{V_V}`}
                              />
                              <BlockMath
                                math={`= \\frac{${Number(
                                  result?.tech_sqrt
                                ).toFixed(2)} \\times ${
                                  result?.tech_metalunit
                                } \\times 10^{-8} \\times ${
                                  result?.tech_wire_length
                                } \\times ${result?.tech_current}}{(${
                                  result?.tech_voltage_drop
                                }/100) \\times ${result?.tech_s_voltage}}`}
                              />
                              <BlockMath
                                math={`= \\frac{${result?.tech_res}}{${result?.tech_v}}`}
                              />
                              <BlockMath
                                math={`= ${result?.tech_am} \\times 1{,}000{,}000`}
                              />
                              <BlockMath
                                math={`= ${result?.tech_three_phase}`}
                              />

                              <p className="w-full mt-2">
                                {data?.payload?.tech_lang_keys["33"]}{" "}
                                <strong>{result?.tech_t_data[1]} AWG</strong>{" "}
                                {data?.payload?.tech_lang_keys["34"]}{" "}
                                <strong>{result?.tech_three_phase} mm²</strong>{" "}
                                {data?.payload?.tech_lang_keys["35"]}.
                              </p>
                            </div>
                          </>
                        )}
                        {result?.tech_submit == "wire_diameter" && (
                          <>
                            <p className="w-full my-3 text-[18px]">
                              {data?.payload?.tech_lang_keys[12]}
                            </p>

                            <div className="w-full overflow-auto">
                              <table
                                className="w-full text-[16px]"
                                style={{ borderCollapse: "collapse" }}
                              >
                                <thead>
                                  <tr className="bg-[#2845F5] text-white">
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["44"]}
                                      </strong>
                                    </td>
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["45"]}
                                      </strong>
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="bg-sky">
                                    <td className="p-2 border text-center">
                                      {Number(result?.tech_inches).toFixed(2)}{" "}
                                      in
                                    </td>
                                    <td className="p-2 border text-center">
                                      {Number(result?.tech_mm).toFixed(2)} mm
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="w-full my-3 text-[18px]">
                              {data?.payload?.tech_lang_keys[15]}
                            </p>

                            <div className="w-full overflow-auto">
                              <table
                                className="w-full text-[16px]"
                                style={{ borderCollapse: "collapse" }}
                              >
                                <thead>
                                  <tr className="bg-[#2845F5] text-white">
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        kcmil
                                      </strong>
                                    </td>
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["46"]}
                                      </strong>
                                    </td>
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["47"]}
                                      </strong>
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="bg-sky">
                                    <td className="p-2 border text-center">
                                      {Number(result?.tech_kcmil).toFixed(2)}{" "}
                                      kcmil
                                    </td>
                                    <td className="p-2 border text-center">
                                      {Number(result?.tech_sqinches).toFixed(2)}{" "}
                                      in<sup className="text-blue">2</sup>
                                    </td>
                                    <td className="p-2 border text-center">
                                      {Number(result?.tech_mm2).toFixed(2)} mm
                                      <sup className="text-blue">2</sup>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {result?.tech_submit == "wire_gauge" && (
                          <>
                            <p className="w-full my-3 text-[18px]">
                              {data?.payload?.tech_lang_keys[13]}
                            </p>

                            <div className="w-full overflow-auto">
                              <table
                                className="w-full text-[16px]"
                                style={{ borderCollapse: "collapse" }}
                              >
                                <thead>
                                  <tr className="bg-[#2845F5] text-white">
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">AWG</strong>
                                    </td>
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["48"]}
                                      </strong>
                                    </td>
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["49"]}
                                      </strong>
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="bg-sky">
                                    <td className="p-2 border text-center">
                                      {result?.tech_d_data[1]} AWG
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_d_data[0]} in
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_d_data[2]?.mm} mm
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="w-full my-3 text-[18px]">
                              {data?.payload?.tech_lang_keys[15]}
                            </p>

                            <div className="w-full overflow-auto">
                              <table
                                className="w-full text-[16px]"
                                style={{ borderCollapse: "collapse" }}
                              >
                                <thead>
                                  <tr className="bg-[#2845F5] text-white">
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        kcmil
                                      </strong>
                                    </td>
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["46"]}
                                      </strong>
                                    </td>
                                    <td className="p-2 border text-center">
                                      <strong className="text-blue">
                                        {data?.payload?.tech_lang_keys["47"]}
                                      </strong>
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="bg-sky">
                                    <td className="p-2 border text-center">
                                      {result?.tech_d_data[2]?.kcmil} kcmil
                                    </td>
                                    <td className="p-2 border text-center">
                                      {Number(result?.tech_square_in).toFixed(
                                        2
                                      )}{" "}
                                      in<sup>2</sup>
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_d_data[2]?.["mm²"]} mm
                                      <sup>2</sup>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
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

export default DcWireSizeCalculator;

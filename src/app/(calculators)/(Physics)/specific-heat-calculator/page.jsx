"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useSpecificHeatCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SpecificHeatCalculator = () => {
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
    tech_find: "energy", // energy  specific_heat  mass  itemp    ftemp
    tech_by: "change",
    tech_q: "20",
    tech_q_unit: "J",
    tech_it: "20",
    tech_it_unit: "°C",
    tech_ft: "20",
    tech_ft_unit: "°C",
    tech_dt: "20",
    tech_dt_unit: "°C",
    tech_m: "20",
    tech_m_unit: "µg",
    tech_c: "20",
    tech_c_unit: "J/(kg·K)",
    tech_sub: "select",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSpecificHeatCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_find) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_find: formData.tech_find,
        tech_by: formData.tech_by,
        tech_q: formData.tech_q,
        tech_q_unit: formData.tech_q_unit,
        tech_it: formData.tech_it,
        tech_it_unit: formData.tech_it_unit,
        tech_ft: formData.tech_ft,
        tech_ft_unit: formData.tech_ft_unit,
        tech_dt: formData.tech_dt,
        tech_dt_unit: formData.tech_dt_unit,
        tech_m: formData.tech_m,
        tech_m_unit: formData.tech_m_unit,
        tech_c: formData.tech_c,
        tech_c_unit: formData.tech_c_unit,
        tech_sub: formData.tech_sub,
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
      tech_find: "energy", // energy  specific_heat  mass  itemp    ftemp
      tech_by: "change",
      tech_q: "20",
      tech_q_unit: "J",
      tech_it: "20",
      tech_it_unit: "°C",
      tech_ft: "20",
      tech_ft_unit: "°C",
      tech_dt: "20",
      tech_dt_unit: "°C",
      tech_m: "20",
      tech_m_unit: "µg",
      tech_c: "20",
      tech_c_unit: "J/(kg·K)",
      tech_sub: "select",
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
    setFormData((prev) => ({ ...prev, tech_q_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_it_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ft_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dt_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_c_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  // result

  const isInitialFinal = result?.tech_check === "m_i_f";
  const deltaT = result?.tech_ft1 - result?.tech_it1;

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
          <div className="lg:w-[70%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 px-2">
                <label htmlFor="tech_find" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_find"
                    id="tech_find"
                    value={formData.tech_find}
                    onChange={handleChange}
                  >
                    <option value="energy">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="specific_heat">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="mass">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="itemp">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                      {data?.payload?.tech_lang_keys["23"]}{" "}
                    </option>
                    <option value="ftemp">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                      {data?.payload?.tech_lang_keys["23"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {(formData.tech_find == "energy" ||
                formData.tech_find == "specific_heat" ||
                formData.tech_find == "mass") && (
                <>
                  <div id="by" className="col-span-12">
                    <div className="grid grid-cols-12   gap-4">
                      <strong className="col-span-12  px-2">
                        {data?.payload?.tech_lang_keys[7]}:
                      </strong>
                      <div className="col-span-12 px-2 mb-1  md:flex items-center">
                        <label className="pe-2" htmlFor="change">
                          <input
                            type="radio"
                            name="tech_by"
                            value="change"
                            id="change"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_by === "change"}
                          />
                          <span>
                            {data?.payload?.tech_lang_keys["8"]}{" "}
                            {data?.payload?.tech_lang_keys["10"]}{" "}
                            {data?.payload?.tech_lang_keys["19"]} (ΔT)
                          </span>
                        </label>
                        <label className="pe-2" htmlFor="i_f_t">
                          <input
                            type="radio"
                            name="tech_by"
                            value="i_f_t"
                            id="i_f_t"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_by === "i_f_t"}
                          />
                          <span>
                            {data?.payload?.tech_lang_keys["9"]}{" "}
                            {data?.payload?.tech_lang_keys["19"]}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {(formData.tech_find === "specific_heat" ||
                formData.tech_find === "mass" ||
                formData.tech_find === "itemp" ||
                formData.tech_find === "ftemp") && (
                <>
                  <div className="col-span-6 px-2" id="q">
                    <label htmlFor="tech_q" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (Q):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_q"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_q}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_q_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "J", value: "J" },
                            { label: "kJ", value: "kJ" },
                            { label: "mJ", value: "mJ" },
                            { label: "Wh", value: "Wh" },
                            { label: "kWh", value: "kWh" },
                            { label: "ft-lbs", value: "ft-lbs" },
                            { label: "kcal", value: "kcal" },
                            { label: "eV", value: "eV" },
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
                </>
              )}

              {((formData.tech_find == "energy" &&
                formData.tech_by == "i_f_t") ||
                (formData.tech_find == "specific_heat" &&
                  formData.tech_by == "i_f_t") ||
                (formData.tech_find == "mass" && formData.tech_by == "i_f_t") ||
                formData.tech_find == "ftemp") && (
                <>
                  <div className="col-span-6 px-2" id="it">
                    <label htmlFor="tech_it" className="label">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                      {data?.payload?.tech_lang_keys["19"]}:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_it"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_it}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_it_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "°C", value: "°C" },
                            { label: "°F", value: "°F" },
                            { label: "K", value: "K" },
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
                </>
              )}
              {((formData.tech_find == "energy" &&
                formData.tech_by == "i_f_t") ||
                (formData.tech_find == "specific_heat" &&
                  formData.tech_by == "i_f_t") ||
                (formData.tech_find == "mass" && formData.tech_by == "i_f_t") ||
                formData.tech_find == "itemp") && (
                <>
                  <div className="col-span-6 px-2" id="ft">
                    <label htmlFor="tech_ft" className="label">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                      {data?.payload?.tech_lang_keys["19"]}:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_ft"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_ft}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_ft_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "°C", value: "°C" },
                            { label: "°F", value: "°F" },
                            { label: "K", value: "K" },
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
                </>
              )}

              {(formData.tech_find === "energy" ||
                formData.tech_find === "specific_heat" ||
                formData.tech_find === "mass") &&
                formData.tech_by === "change" && ( // Add your second condition here
                  <>
                    <div className="col-span-6 px-2" id="dt">
                      <label htmlFor="tech_dt" className="label">
                        {data?.payload?.tech_lang_keys["8"]}{" "}
                        {data?.payload?.tech_lang_keys["10"]}{" "}
                        {data?.payload?.tech_lang_keys["19"]} (ΔT):
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_dt"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_dt}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown3}
                        >
                          {formData.tech_dt_unit} ▾
                        </label>
                        {dropdownVisible3 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "°C", value: "°C" },
                              { label: "°F", value: "°F" },
                              { label: "K", value: "K" },
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
                  </>
                )}

              {(formData.tech_find == "energy" ||
                formData.tech_find == "specific_heat" ||
                formData.tech_find == "itemp" ||
                formData.tech_find == "ftemp") && (
                <>
                  <div className="col-span-6 px-2" id="m">
                    <label htmlFor="tech_m" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (m):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_m"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_m}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_m_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "µg", value: "µg" },
                            { label: "mg", value: "mg" },
                            { label: "g", value: "g" },
                            { label: "kg", value: "kg" },
                            { label: "t", value: "t" },
                            { label: "oz", value: "oz" },
                            { label: "lb", value: "lb" },
                            { label: "stone", value: "stone" },
                            { label: "US ton", value: "US ton" },
                            { label: "Long ton", value: "Long ton" },
                            { label: "Earths", value: "Earths" },
                            { label: "me", value: "me" },
                            { label: "u", value: "u" },
                            { label: "oz t", value: "oz t" },
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
                </>
              )}
              {(formData.tech_find == "energy" ||
                formData.tech_find == "mass" ||
                formData.tech_find == "itemp" ||
                formData.tech_find == "ftemp") && (
                <>
                  <div className="col-span-6 px-2" id="c">
                    <label htmlFor="tech_c" className="label">
                      {data?.payload?.tech_lang_keys["11"]}{" "}
                      {data?.payload?.tech_lang_keys["22"]} (c):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_c"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_c}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_c_unit} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "J/(kg·K)", value: "J/(kg·K)" },
                            { label: "J/(g·K)", value: "J/(g·K)" },
                            { label: "cal/(kg·K)", value: "cal/(kg·K)" },
                            { label: "cal/(g·K)", value: "cal/(g·K)" },
                            { label: "kcal/(kg·K)", value: "kcal/(kg·K)" },
                            { label: "J/(kg·°C)", value: "J/(kg·°C)" },
                            { label: "J/(g·°C)", value: "J/(g·°C)" },
                            { label: "cal/(kg·°C)", value: "cal/(kg·°C)" },
                            { label: "cal/(g·°C)", value: "cal/(g·°C)" },
                            { label: "kcal/(kg·°C)", value: "kcal/(kg·°C)" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler5(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-6 px-2" id="sub">
                <label htmlFor="tech_subs" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_subs"
                    id="tech_subs"
                    value={formData.tech_subs}
                    onChange={handleChange}
                  >
                    <option value="select">Custom</option>
                    <option value="1460@Acetals (solid)">
                      Acetals (solid)
                    </option>
                    <option value="1012@Air (gas, room cond.)">
                      Air (gas, room cond.)
                    </option>
                    <option value="1003.5@Air (sea level, dry, 0°C">
                      Air (sea level, dry, 0°C)
                    </option>
                    <option value="897@Aluminum (solid)">
                      Aluminum (solid)
                    </option>
                    <option value="4700@Ammonia (liquid)">
                      Ammonia (liquid)
                    </option>
                    <option value="3500@Animal tissue (mixed)">
                      Animal tissue (mixed)
                    </option>
                    <option value="207@Antimony (solid)">
                      Antimony (solid)
                    </option>
                    <option value="520.3@Argon (gas)">Argon (gas)</option>
                    <option value="328@Arsenic (solid)">Arsenic (solid)</option>
                    <option value="920@Asphalt (solid)">Asphalt (solid)</option>
                    <option value="1820@Beryllium (solid)">
                      Beryllium (solid)
                    </option>
                    <option value="123@Bismuth (solid)">Bismuth (solid)</option>
                    <option value="840@Brick (solid)">Brick (solid)</option>
                    <option value="231@Cadmium (solid)">Cadmium (solid)</option>
                    <option value="839@Carbon Dioxide (gas)">
                      Carbon Dioxide (gas)
                    </option>
                    <option value="449@Chromium (solid)">
                      Chromium (solid)
                    </option>
                    <option value="880@Concrete (solid)">
                      Concrete (solid)
                    </option>
                    <option value="385@Copper (solid)">Copper (solid)</option>
                    <option value="509.1@Diamond (solid)">
                      Diamond (solid)
                    </option>
                    <option value="2440@Ethanol (liquid)">
                      Ethanol (liquid)
                    </option>
                    <option value="2220@Gasoline (octane, liquid)">
                      Gasoline (octane, liquid)
                    </option>
                    <option value="840@Glass (solid)">Glass (solid)</option>
                    <option value="670@Glass, crown (solid)">
                      Glass, crown (solid)
                    </option>
                    <option value="503@Glass, flint (solid)">
                      Glass, flint (solid)
                    </option>
                    <option value="753@Glass, pyrex (solid)">
                      Glass, pyrex (solid)
                    </option>
                    <option value="129@Gold (solid)">Gold (solid)</option>
                    <option value="790@Granite (solid)">Granite (solid)</option>
                    <option value="710@Graphite (solid)">
                      Graphite (solid)
                    </option>
                    <option value="1090@Gypsum (solid)">Gypsum (solid)</option>
                    <option value="5193.2@Helium (gas)">Helium (gas)</option>
                    <option value="14300@Hydrogen (gas)">Hydrogen (gas)</option>
                    <option value="1015@Hydrogen sulfide (gas)">
                      Hydrogen sulfide (gas)
                    </option>
                    <option value="412@Iron (solid)">Iron (solid)</option>
                    <option value="129@Lead (solid)">Lead (solid)</option>
                    <option value="3580@Lithium (solid)">
                      Lithium (solid)
                    </option>
                    <option value="4379@Lithium at 181°C (liquid)">
                      Lithium at 181°C (liquid)
                    </option>
                    <option value="1020@Magnesium (solid)">
                      Magnesium (solid)
                    </option>
                    <option value="880@Marble, mica (solid)">
                      Marble, mica (solid)
                    </option>
                    <option value="139.5@Mercury (liquid)">
                      Mercury (liquid)
                    </option>
                    <option value="2191@Methane at 2°C (gas)">
                      Methane at 2°C (gas)
                    </option>
                    <option value="2140@Methanol (liquid)">
                      Methanol (liquid)
                    </option>
                    <option value="1560@Molten salt (liquid)">
                      Molten salt (liquid)
                    </option>
                    <option value="1030.1@Neon (gas)">Neon (gas)</option>
                    <option value="1040@Nitrogen (gas)">Nitrogen (gas)</option>
                    <option value="918@Oxygen (gas)">Oxygen (gas)</option>
                    <option value="2500@Paraffin wax (solid)">
                      Paraffin wax (solid)
                    </option>
                    <option value="2302.7@Polyethylene (solid)">
                      Polyethylene (solid)
                    </option>
                    <option value="835@Sand (solid)">Sand (solid)</option>
                    <option value="703@Silica (fused) (solid)">
                      Silica (fused) (solid)
                    </option>
                    <option value="233@Silver[31] (solid)">
                      Silver[31] (solid)
                    </option>
                    <option value="1230@Sodium (solid)">Sodium (solid)</option>
                    <option value="800@Soil (solid)">Soil (solid)</option>
                    <option value="466@Steel (solid)">Steel (solid)</option>
                    <option value="227@Tin (solid)">Tin (solid)</option>
                    <option value="523@Titanium (solid)">
                      Titanium (solid)
                    </option>
                    <option value="134@Tungsten (solid)">
                      Tungsten (solid)
                    </option>
                    <option value="116@Uranium (solid)">Uranium (solid)</option>
                    <option value="2050@Water at -10 °C (ice) (solid)">
                      Water at -10 °C (ice) (solid)
                    </option>
                    <option value="4181.3@Water at 25 °C (liquid)">
                      Water at 25 °C (liquid)
                    </option>
                    <option value="2080@Water at 100 °C (gas)">
                      Water at 100 °C (gas)
                    </option>
                    <option value="1700@Wood (1200 to 2900) (solid)">
                      Wood (1200 to 2900) (solid)
                    </option>
                    <option value="387@Zinc (solid)">Zinc (solid)</option>
                  </select>
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
                    <div className="w-full mt-3">
                      <div className="w-full overflow-auto">
                        <div className="col s12 padding_20 padding_10_mbl form-bg overflow-auto">
                          {result?.tech_q ? (
                            <>
                              <div className="text-center">
                                <p className="text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[2]}
                                  </strong>
                                </p>
                                <p className="text-[21px] bg-sky-100 px-3 py-2 rounded d-inline-block my-3">
                                  <strong className="text-blue">
                                    {result?.tech_q} J
                                  </strong>
                                </p>
                              </div>
                            </>
                          ) : result?.tech_c1 ? (
                            <>
                              <div className="col-lg-8 mt-2 overflow-auto">
                                <table className="w-full text-[18px]">
                                  <tbody>
                                    <tr>
                                      <td className="text-blue py-2 border-b">
                                        {data?.payload?.tech_lang_keys["11"]}{" "}
                                        {data?.payload?.tech_lang_keys["13"]}
                                      </td>
                                      <td className="py-2 border-b">
                                        <strong>{result?.tech_c1}</strong>{" "}
                                        J/(kg·K)
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <p className="margin_top_20 padding_b_10 center">
                                <strong>Result in other units:</strong>
                              </p>
                              <div className="col-lg-8 mt-2 overflow-auto">
                                <table className="w-full text-[18px]">
                                  <tbody>
                                    <tr>
                                      <td className="text-blue py-2 border-b">
                                        {data?.payload?.tech_lang_keys["11"]}{" "}
                                        {data?.payload?.tech_lang_keys["13"]}
                                      </td>
                                      <td className="py-2 border-b">
                                        <strong>
                                          {result?.tech_c1 * 0.001}
                                        </strong>{" "}
                                        J/(g·K)
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-blue py-2 border-b">
                                        {data?.payload?.tech_lang_keys["11"]}{" "}
                                        {data?.payload?.tech_lang_keys["13"]}
                                      </td>
                                      <td className="py-2 border-b">
                                        <strong>
                                          {result?.tech_c1 * 0.2388915}
                                        </strong>{" "}
                                        cal/(kg·K)
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-blue py-2 border-b">
                                        {data?.payload?.tech_lang_keys["11"]}{" "}
                                        {data?.payload?.tech_lang_keys["13"]}
                                      </td>
                                      <td className="py-2 border-b">
                                        <strong>
                                          {result?.tech_c1 * 0.0002388915}
                                        </strong>{" "}
                                        kcal/(kg·K)
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-blue py-2 border-b">
                                        {data?.payload?.tech_lang_keys["11"]}{" "}
                                        {data?.payload?.tech_lang_keys["13"]}
                                      </td>
                                      <td className="py-2 border-b">
                                        <strong>
                                          {result?.tech_c1 * 0.001}
                                        </strong>{" "}
                                        J/(g·°C)
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </>
                          ) : result?.tech_m ? (
                            <>
                              <div className="text-center">
                                <p className="text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[4]}
                                  </strong>
                                </p>
                                <p className="text-[21px] bg-sky-100 px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    {result?.tech_m} kg
                                  </strong>
                                </p>
                              </div>
                            </>
                          ) : result?.tech_it ? (
                            <>
                              <div className="text-center">
                                <p className="text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[5]}
                                  </strong>
                                </p>
                                <p className="text-[21px] bg-sky-100 px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    {result?.tech_it} K
                                  </strong>
                                </p>
                              </div>
                            </>
                          ) : result?.tech_ft ? (
                            <>
                              <div className="text-center">
                                <p className="text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[6]}
                                  </strong>
                                </p>
                                <p className="text-[21px] bg-sky-100 px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    {result?.tech_ft} K
                                  </strong>
                                </p>
                              </div>
                            </>
                          ) : result?.tech_sub ? (
                            <>
                              <p className="col-12 mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["14"]}{" "}
                                  {result?.tech_sub1}{" "}
                                  {data?.payload?.tech_lang_keys["15"]}{" "}
                                  {result?.tech_sub}
                                </strong>
                              </p>
                            </>
                          ) : null}
                        </div>
                        <p className="col-12 mt-3 text-[18px]">
                          <strong className="text-blue">
                            {data?.payload?.tech_lang_keys["16"]}
                          </strong>
                        </p>
                        {result?.tech_q ? (
                          <>
                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["2"]}{" "}
                                {data?.payload?.tech_lang_keys["17"]}
                              </strong>
                            </p>

                            <BlockMath math="Q = m c \Delta T" />

                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["18"]}
                              </strong>
                            </p>

                            <BlockMath
                              math={`m = ${data?.payload?.tech_lang_keys["4"]}`}
                            />
                            <BlockMath
                              math={`c = ${data?.payload?.tech_lang_keys["11"]} ${data?.payload?.tech_lang_keys["13"]}`}
                            />

                            {result?.tech_check === "q_i_f" ? (
                              <>
                                <BlockMath
                                  math={`T_i = ${data?.payload?.tech_lang_keys["5"]} ${data?.payload?.tech_lang_keys["19"]}`}
                                />
                                <BlockMath
                                  math={`T_f = ${data?.payload?.tech_lang_keys["6"]} ${data?.payload?.tech_lang_keys["19"]}`}
                                />
                                <BlockMath
                                  math={`Q = ${result?.tech_q1},\\ c = ${result?.tech_c1},\\ T_i = ${result?.tech_it1},\\ T_f = ${result?.tech_ft1}`}
                                />
                              </>
                            ) : (
                              <>
                                <BlockMath
                                  math={`\\Delta T = ${data?.payload?.tech_lang_keys["8"]} ${data?.payload?.tech_lang_keys["20"]} ${data?.payload?.tech_lang_keys["19"]}`}
                                />
                                <BlockMath
                                  math={`Q = ${result?.tech_q1},\\ c = ${result?.tech_c1},\\ \\Delta T = ${result?.tech_dt1}`}
                                />
                              </>
                            )}

                            {result?.tech_check === "q_i_f" && (
                              <>
                                <p className="col-12 mt-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["1"]}{" "}
                                    {data?.payload?.tech_lang_keys["8"]}{" "}
                                    {data?.payload?.tech_lang_keys["20"]}{" "}
                                    {data?.payload?.tech_lang_keys["23"]}
                                  </strong>
                                </p>
                                <BlockMath math="\\Delta T = T_f - T_i" />
                                <BlockMath
                                  math={`\\Delta T = ${result?.tech_ft1} - ${result?.tech_it1}`}
                                />
                                <BlockMath
                                  math={`\\Delta T = ${
                                    result?.tech_ft1 - result?.tech_it1
                                  }`}
                                />
                              </>
                            )}

                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["21"]}
                              </strong>
                            </p>

                            <BlockMath math="Q = m c \Delta T" />
                            <BlockMath
                              math={`Q = (${result?.tech_m1})(${result?.tech_c1})(${result?.tech_dt1})`}
                            />
                            <BlockMath
                              math={`Q = (${result?.tech_s})(${result?.tech_dt1})`}
                            />
                            <BlockMath math={`Q = ${result?.tech_q}`} />
                          </>
                        ) : result?.tech_c1 ? (
                          <>
                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["3"]}{" "}
                                {data?.payload?.tech_lang_keys["17"]}
                              </strong>
                            </p>
                            <div className="col-12 mt-3">
                              <BlockMath math={`c = \\dfrac{Q}{m \\Delta T}`} />
                            </div>

                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["18"]}
                              </strong>
                            </p>
                            <div className="col-12 mt-3">
                              <BlockMath
                                math={`Q = \\text{${data?.payload?.tech_lang_keys["2"]}}`}
                              />
                            </div>
                            <div className="col-12 mt-3">
                              <BlockMath
                                math={`m = \\text{${data?.payload?.tech_lang_keys["4"]}}`}
                              />
                            </div>

                            {result?.tech_check === "c_i_f" ? (
                              <>
                                <div className="col-12 mt-3">
                                  <BlockMath
                                    math={`T_i = \\text{${data?.payload?.tech_lang_keys["5"]} ${data?.payload?.tech_lang_keys["19"]}}`}
                                  />
                                </div>
                                <div className="col-12 mt-3">
                                  <BlockMath
                                    math={`T_f = \\text{${data?.payload?.tech_lang_keys["6"]} ${data?.payload?.tech_lang_keys["19"]}}`}
                                  />
                                </div>
                                <div className="col-12 mt-3">
                                  <BlockMath
                                    math={`Q = ${result?.tech_q1},\\ m = ${result?.tech_m1},\\ T_i = ${result?.tech_it1},\\ T_f = ${result?.tech_ft1}`}
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="col-12 mt-3">
                                  <BlockMath
                                    math={`\\Delta T = \\text{${data?.payload?.tech_lang_keys["8"]} ${data?.payload?.tech_lang_keys["20"]} ${data?.payload?.tech_lang_keys["19"]}}`}
                                  />
                                </div>
                                <div className="col-12 mt-3">
                                  <BlockMath
                                    math={`Q = ${result?.tech_q1},\\ m = ${result?.tech_m1},\\ \\Delta T = ${result?.tech_dt1}`}
                                  />
                                </div>
                              </>
                            )}

                            {result?.tech_check === "c_i_f" && (
                              <>
                                <p className="col-12 mt-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["1"]}{" "}
                                    {data?.payload?.tech_lang_keys["8"]}{" "}
                                    {data?.payload?.tech_lang_keys["20"]}{" "}
                                    {data?.payload?.tech_lang_keys["23"]}
                                  </strong>
                                </p>
                                <div className="col-12 mt-3">
                                  <BlockMath math={`\\Delta T = T_f - T_i`} />
                                </div>
                                <div className="col-12 mt-3">
                                  <BlockMath
                                    math={`\\Delta T = ${result?.tech_ft1} - ${result?.tech_it1}`}
                                  />
                                </div>
                                <div className="col-12 mt-3">
                                  <BlockMath
                                    math={`\\Delta T = ${
                                      result?.tech_ft1 - result?.tech_it1
                                    }`}
                                  />
                                </div>
                              </>
                            )}

                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["21"]}
                              </strong>
                            </p>
                            <div className="col-12 mt-3">
                              <BlockMath math={`c = \\dfrac{Q}{m \\Delta T}`} />
                            </div>
                            <div className="col-12 mt-3">
                              <BlockMath
                                math={`c = \\dfrac{${result?.tech_q1}}{(${result?.tech_m1})(${result?.tech_dt1})}`}
                              />
                            </div>
                            <div className="col-12 mt-3">
                              <BlockMath
                                math={`c = \\dfrac{${result?.tech_q1}}{${result?.tech_s}}`}
                              />
                            </div>
                            <div className="col-12 mt-3">
                              <BlockMath math={`c = ${result?.tech_c1}`} />
                            </div>
                          </>
                        ) : result?.tech_m ? (
                          <>
                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["4"]}{" "}
                                {data?.payload?.tech_lang_keys["17"]}
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath math="m = \dfrac{Q}{c \Delta T}" />
                            </p>

                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["18"]}
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`Q = ${data?.payload?.tech_lang_keys["2"]}`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`c = ${data?.payload?.tech_lang_keys["11"]} ${data?.payload?.tech_lang_keys["13"]}`}
                              />
                            </p>

                            {isInitialFinal ? (
                              <>
                                <p className="col-12 mt-3">
                                  <BlockMath
                                    math={`T_i = ${data?.payload?.tech_lang_keys["5"]} ${data?.payload?.tech_lang_keys["19"]}`}
                                  />
                                </p>
                                <p className="col-12 mt-3">
                                  <BlockMath
                                    math={`T_f = ${data?.payload?.tech_lang_keys["6"]} ${data?.payload?.tech_lang_keys["19"]}`}
                                  />
                                </p>
                                <p className="col-12 mt-3">
                                  <BlockMath
                                    math={`Q = ${result?.tech_q1},\\ c = ${result?.tech_c1},\\ T_i = ${result?.tech_it1},\\ T_f = ${result?.tech_ft1}`}
                                  />
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="col-12 mt-3">
                                  <BlockMath
                                    math={`\\Delta T = ${data?.payload?.tech_lang_keys["8"]} ${data?.payload?.tech_lang_keys["20"]} ${data?.payload?.tech_lang_keys["19"]}`}
                                  />
                                </p>
                                <p className="col-12 mt-3">
                                  <BlockMath
                                    math={`Q = ${result?.tech_q1},\\ c = ${result?.tech_c1},\\ \\Delta T = ${result?.tech_dt1}`}
                                  />
                                </p>
                              </>
                            )}

                            {isInitialFinal && (
                              <>
                                <p className="col-12 mt-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["1"]}{" "}
                                    {data?.payload?.tech_lang_keys["8"]}{" "}
                                    {data?.payload?.tech_lang_keys["20"]}{" "}
                                    {data?.payload?.tech_lang_keys["23"]}
                                  </strong>
                                </p>
                                <p className="col-12 mt-3">
                                  <BlockMath math="\\Delta T = T_f - T_i" />
                                </p>
                                <p className="col-12 mt-3">
                                  <BlockMath
                                    math={`\\Delta T = ${result?.tech_ft1} - ${result?.tech_it1}`}
                                  />
                                </p>
                                <p className="col-12 mt-3">
                                  <BlockMath math={`\\Delta T = ${deltaT}`} />
                                </p>
                              </>
                            )}

                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["21"]}
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath math="m = \dfrac{Q}{c \Delta T}" />
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`m = \\dfrac{${result?.tech_q1}}{(${result?.tech_c1})(${result?.tech_dt1})}`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`m = \\dfrac{${result?.tech_q1}}{${result?.tech_s}}`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath math={`m = ${result?.tech_m}`} />
                            </p>
                          </>
                        ) : result?.tech_it ? (
                          <>
                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["5"]}{" "}
                                {data?.payload?.tech_lang_keys["23"]}{" "}
                                {data?.payload?.tech_lang_keys["17"]}
                              </strong>
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath math="T_i = \dfrac{Q}{m c} - T_f" />
                            </p>

                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["18"]}
                              </strong>
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`Q = ${data?.payload?.tech_lang_keys["2"]}`}
                              />
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`m = ${data?.payload?.tech_lang_keys["4"]}`}
                              />
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`c = ${data?.payload?.tech_lang_keys["11"]} ${data?.payload?.tech_lang_keys["13"]}`}
                              />
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`T_f = ${data?.payload?.tech_lang_keys["6"]} ${data?.payload?.tech_lang_keys["19"]}`}
                              />
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`Q = ${result?.tech_q1},\\ m = ${result?.tech_m1},\\ c = ${result?.tech_c1},\\ T_f = ${result?.tech_ft1}`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["21"]}
                              </strong>
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath math="T_i = \dfrac{Q}{m c} - T_f" />
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`T_i = \\dfrac{${result?.tech_q1}}{(${result?.tech_m1})(${result?.tech_c1})} - ${result?.tech_ft1}`}
                              />
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`T_i = \\dfrac{${result?.tech_q1}}{${result?.tech_s}} - ${result?.tech_ft1}`}
                              />
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`T_i = ${result?.tech_s1} - ${result?.tech_ft1}`}
                              />
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath math={`T_i = ${result?.tech_it}`} />
                            </p>
                          </>
                        ) : result?.tech_ft ? (
                          <>
                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["6"]}{" "}
                                {data?.payload?.tech_lang_keys["19"]}{" "}
                                {data?.payload?.tech_lang_keys["17"]}
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath math="T_f = \dfrac{Q}{m c} + T_i" />
                            </p>

                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["18"]}
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`Q = ${data?.payload?.tech_lang_keys["2"]}`}
                              />
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`m = ${data?.payload?.tech_lang_keys["4"]}`}
                              />
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`c = ${data?.payload?.tech_lang_keys["11"]} ${data?.payload?.tech_lang_keys["13"]}`}
                              />
                            </p>
                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`T_i = ${data?.payload?.tech_lang_keys["5"]} ${data?.payload?.tech_lang_keys["19"]}`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`Q = ${result?.tech_q1},\\ m = ${result?.tech_m1},\\ c = ${result?.tech_c1},\\ T_i = ${result?.tech_it1}`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["21"]}
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath math="T_f = \dfrac{Q}{m c} + T_i" />
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`T_f = \\dfrac{${result?.tech_q1}}{(${result?.tech_m1}) (${result?.tech_c1})} + ${result?.tech_it1}`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`T_f = \\dfrac{${result?.tech_q1}}{${result?.tech_s}} + ${result?.tech_it1}`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath
                                math={`T_f = ${result?.tech_s1} + ${result?.tech_it1}`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <BlockMath math={`T_f = ${result?.tech_ft}`} />
                            </p>
                          </>
                        ) : null}
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

export default SpecificHeatCalculator;

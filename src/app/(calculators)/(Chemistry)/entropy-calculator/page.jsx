"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useEntropyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EntropyCalculator = () => {
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
    tech_point_unit: "gibbs free energy ΔG = ΔH - T*ΔS",
    tech_products: 80,
    tech_products_unit: "j/mol*K",
    tech_reactants: "8",
    tech_reactants_unit: "j/mol*K",
    tech_enthalpy: 80,
    tech_enthalpy_unit: "kcal",
    tech_temperature: 80,
    tech_temperature_unit: "K",
    tech_entropy: 80,
    tech_entropy_unit: "kcal/K",
    tech_base_unit: "pressure",
    tech_moles: 80,
    tech_initial: "12",
    tech_initial_unit: "mm³",
    tech_pre_one_unit: "mmHg",
    tech_final: 12,
    tech_final_unit: "mm³",
    tech_pre_two_unit: "MPa",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEntropyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_point_unit) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_point_unit: formData.tech_point_unit,
        tech_products: formData.tech_products,
        tech_products_unit: formData.tech_products_unit,
        tech_reactants: formData.tech_reactants,
        tech_reactants_unit: formData.tech_reactants_unit,
        tech_enthalpy: formData.tech_enthalpy,
        tech_enthalpy_unit: formData.tech_enthalpy_unit,
        tech_temperature: formData.tech_temperature,
        tech_temperature_unit: formData.tech_temperature_unit,
        tech_entropy: formData.tech_entropy,
        tech_entropy_unit: formData.tech_entropy_unit,
        tech_base_unit: formData.tech_base_unit,
        tech_moles: formData.tech_moles,
        tech_initial: formData.tech_initial,
        tech_initial_unit: formData.tech_initial_unit,
        tech_pre_one_unit: formData.tech_pre_one_unit,
        tech_final: formData.tech_final,
        tech_final_unit: formData.tech_final_unit,
        tech_pre_two_unit: formData.tech_pre_two_unit,
      }).unwrap();
      setResult(response?.payload); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_point_unit: "gibbs free energy ΔG = ΔH - T*ΔS",
      tech_products: 80,
      tech_products_unit: "j/mol*K",
      tech_reactants: "8",
      tech_reactants_unit: "j/mol*K",
      tech_enthalpy: 80,
      tech_enthalpy_unit: "kcal",
      tech_temperature: 80,
      tech_temperature_unit: "K",
      tech_entropy: 80,
      tech_entropy_unit: "kcal/K",
      tech_base_unit: "pressure",
      tech_moles: 80,
      tech_initial: "12",
      tech_initial_unit: "mm³",
      tech_pre_one_unit: "mmHg",
      tech_final: 12,
      tech_final_unit: "mm³",
      tech_pre_two_unit: "MPa",
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
  {
    /* <span className="text-blue input_unit">{currency.symbol}</span> */
  }
  // currency code

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_products_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_reactants_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_enthalpy_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_temperature_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_entropy_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_initial_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pre_one_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };
  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_final_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };
  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pre_two_unit: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };

  // result

  const entropy = Number(result?.entropy_reaction);
  const gibbs = Number(result?.tech_gibbs);

  const UnitBox = ({ label, value }) => (
    <div className="border-r-4 mt-3">
      <p className="font-bold">{label}</p>
      <p>{Number(value).toExponential(3)}</p>
    </div>
  );

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
            <div className="grid grid-cols-1    gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_point_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_point_unit"
                    id="tech_point_unit"
                    value={formData.tech_point_unit}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys["11"]}>
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["12"]}>
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["13"]}>
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            {formData.tech_point_unit ==
              data?.payload?.tech_lang_keys["11"] && (
              <>
                <div className="w-full mt-4" id="first">
                  <div className="grid grid-cols-1 mt-4  lg:grid-cols-2 md:grid-cols-2  gap-4">
                    <div className="space-y-2">
                      <label htmlFor="tech_products" className="label">
                        {data?.payload?.tech_lang_keys["2"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_products"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_products}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown}
                        >
                          {formData.tech_products_unit} ▾
                        </label>
                        {dropdownVisible && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "j/mol*K", value: "j/mol*K" },
                              { label: "kj/mol*K", value: "kj/mol*K" },
                              { label: "mj/mol*K", value: "mj/mol*K" },
                              { label: "wh/mol*K", value: "wh/mol*K" },
                              { label: "kwh/mol*K", value: "kwh/mol*K" },
                              { label: "ft-lb/mol*K", value: "ft-lb/mol*K" },
                              { label: "cal/mol*K", value: "cal/mol*K" },
                              { label: "kcal/mol*K", value: "kcal/mol*K" },
                              { label: "ev/mol*K", value: "ev/mol*K" },
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
                    <div className="space-y-2">
                      <label htmlFor="tech_reactants" className="label">
                        {data?.payload?.tech_lang_keys["3"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_reactants"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_reactants}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_reactants_unit} ▾
                        </label>
                        {dropdownVisible1 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "j/mol*K", value: "j/mol*K" },
                              { label: "kj/mol*K", value: "kj/mol*K" },
                              { label: "mj/mol*K", value: "mj/mol*K" },
                              { label: "wh/mol*K", value: "wh/mol*K" },
                              { label: "kwh/mol*K", value: "kwh/mol*K" },
                              { label: "ft-lb/mol*K", value: "ft-lb/mol*K" },
                              { label: "cal/mol*K", value: "cal/mol*K" },
                              { label: "kcal/mol*K", value: "kcal/mol*K" },
                              { label: "ev/mol*K", value: "ev/mol*K" },
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
              </>
            )}
            {formData.tech_point_unit ==
              data?.payload?.tech_lang_keys["12"] && (
              <>
                <div className="w-full  mt-3" id="second">
                  <div className="grid grid-cols-1 mt-4  lg:grid-cols-2 md:grid-cols-2  gap-4">
                    <div className="space-y-2">
                      <label htmlFor="tech_enthalpy" className="label">
                        {data?.payload?.tech_lang_keys["4"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_enthalpy"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_enthalpy}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown2}
                        >
                          {formData.tech_enthalpy_unit} ▾
                        </label>
                        {dropdownVisible2 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "j", value: "j" },
                              { label: "kj", value: "kj" },
                              { label: "mj", value: "mj" },
                              { label: "wh", value: "wh" },
                              { label: "kwh", value: "kwh" },
                              { label: "ft-lb", value: "ft-lb" },
                              { label: "cal", value: "cal" },
                              { label: "kcal", value: "kcal" },
                              { label: "ev", value: "ev" },
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
                    <div className="space-y-2">
                      <label htmlFor="tech_temperature" className="label">
                        {data?.payload?.tech_lang_keys["5"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_temperature"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_temperature}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown3}
                        >
                          {formData.tech_temperature_unit} ▾
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
                    <div className="space-y-2">
                      <label htmlFor="tech_entropy" className="label">
                        {data?.payload?.tech_lang_keys["6"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_entropy"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_entropy}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown4}
                        >
                          {formData.tech_entropy_unit} ▾
                        </label>
                        {dropdownVisible4 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "j/K", value: "j/K" },
                              { label: "kj/K", value: "kj/K" },
                              { label: "mj/K", value: "mj/K" },
                              { label: "wh/K", value: "wh/K" },
                              { label: "kwh/K", value: "kwh/K" },
                              { label: "ft-lb/K", value: "ft-lb/K" },
                              { label: "cal/K", value: "cal/K" },
                              { label: "kcal/K", value: "kcal/K" },
                              { label: "ev/K", value: "ev/K" },
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
            {formData.tech_point_unit ==
              data?.payload?.tech_lang_keys["13"] && (
              <>
                <div className="col-12 " id="three">
                  <div className="grid grid-cols-1 mt-4  lg:grid-cols-2 md:grid-cols-2  gap-4">
                    <div className="space-y-2 relative">
                      <label htmlFor="tech_base_unit" className="label">
                        {data?.payload?.tech_lang_keys["1"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_base_unit"
                          id="tech_base_unit"
                          value={formData.tech_base_unit}
                          onChange={handleChange}
                        >
                          <option value={data?.payload?.tech_lang_keys["23"]}>
                            {data?.payload?.tech_lang_keys["23"]}
                          </option>
                          <option value={data?.payload?.tech_lang_keys["24"]}>
                            {data?.payload?.tech_lang_keys["24"]}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2 ">
                      <label htmlFor="tech_moles" className="label">
                        {data?.payload?.tech_lang_keys["8"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_moles"
                          id="tech_moles"
                          className="input "
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_moles}
                          onChange={handleChange}
                        />
                        <span className="input_unit">mol</span>
                      </div>
                    </div>

                    {formData.tech_base_unit ==
                      data?.payload?.tech_lang_keys["23"] && (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="tech_initial" className="label">
                            {data?.payload?.tech_lang_keys["9"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_initial"
                              step="any"
                              className=" input"
                              value={formData.tech_initial}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-3"
                              onClick={toggleDropdown5}
                            >
                              {formData.tech_initial_unit} ▾
                            </label>
                            {dropdownVisible5 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  {
                                    label: "cubic millimeters (mm³)",
                                    value: "mm³",
                                  },
                                  {
                                    label: "cubic centimeters (cm³)",
                                    value: "cm³",
                                  },
                                  {
                                    label: "cubic decimeters (dm³)",
                                    value: "dm³",
                                  },
                                  { label: "cubic meters (m³)", value: "m³" },
                                  { label: "cubic inches (in³)", value: "in³" },
                                  { label: "cubic feet (ft³)", value: "ft³" },
                                  { label: "milliliters (ml)", value: "ml" },
                                  { label: "centiliters (cl)", value: "cl" },
                                  { label: "liters (l)", value: "l" },
                                  {
                                    label: "US gallons (US gal)",
                                    value: "US gal",
                                  },
                                  {
                                    label: "UK gallons (UK gal)",
                                    value: "UK gal",
                                  },
                                  {
                                    label: "US fluid ounces (US fl oz)",
                                    value: "US fl oz",
                                  },
                                  {
                                    label: "UK fluid ounces (UK fl oz)",
                                    value: "UK fl oz",
                                  },
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
                        <div className="space-y-2">
                          <label htmlFor="tech_final" className="label">
                            {data?.payload?.tech_lang_keys["10"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_final"
                              step="any"
                              className=" input"
                              value={formData.tech_final}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-3"
                              onClick={toggleDropdown7}
                            >
                              {formData.tech_final_unit} ▾
                            </label>
                            {dropdownVisible7 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  {
                                    label: "cubic millimeters (mm³)",
                                    value: "mm³",
                                  },
                                  {
                                    label: "cubic centimeters (cm³)",
                                    value: "cm³",
                                  },
                                  {
                                    label: "cubic decimeters (dm³)",
                                    value: "dm³",
                                  },
                                  { label: "cubic meters (m³)", value: "m³" },
                                  { label: "cubic inches (in³)", value: "in³" },
                                  { label: "cubic feet (ft³)", value: "ft³" },
                                  { label: "milliliters (ml)", value: "ml" },
                                  { label: "centiliters (cl)", value: "cl" },
                                  { label: "liters (l)", value: "l" },
                                  {
                                    label: "US gallons (US gal)",
                                    value: "US gal",
                                  },
                                  {
                                    label: "UK gallons (UK gal)",
                                    value: "UK gal",
                                  },
                                  {
                                    label: "US fluid ounces (US fl oz)",
                                    value: "US fl oz",
                                  },
                                  {
                                    label: "UK fluid ounces (UK fl oz)",
                                    value: "UK fl oz",
                                  },
                                ].map((unit, index) => (
                                  <p
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setUnitHandler7(unit.value)}
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

                    {formData.tech_base_unit ==
                      data?.payload?.tech_lang_keys["24"] && (
                      <>
                        <div className="space-y-2 ">
                          <label htmlFor="tech_initial" className="label">
                            Initial Pressure
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_initial"
                              step="any"
                              className=" input"
                              value={formData.tech_initial}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown6}
                            >
                              {formData.tech_pre_one_unit} ▾
                            </label>
                            {dropdownVisible6 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "Pa", value: "Pa" },
                                  { label: "Bar", value: "Bar" },
                                  { label: "psi", value: "psi" },
                                  { label: "at", value: "at" },
                                  { label: "atm", value: "atm" },
                                  { label: "Torr", value: "Torr" },
                                  { label: "hPa", value: "hPa" },
                                  { label: "kPa", value: "kPa" },
                                  { label: "MPa", value: "MPa" },
                                  { label: "GPa", value: "GPa" },
                                  { label: "inHg", value: "inHg" },
                                  { label: "mmHg", value: "mmHg" },
                                ].map((unit, index) => (
                                  <p
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setUnitHandler6(unit.value)}
                                  >
                                    {unit.label}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="tech_final" className="label">
                            Final Pressure
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_final"
                              step="any"
                              className=" input"
                              value={formData.tech_final}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown8}
                            >
                              {formData.tech_pre_two_unit} ▾
                            </label>
                            {dropdownVisible8 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "Pa", value: "Pa" },
                                  { label: "Bar", value: "Bar" },
                                  { label: "psi", value: "psi" },
                                  { label: "at", value: "at" },
                                  { label: "atm", value: "atm" },
                                  { label: "Torr", value: "Torr" },
                                  { label: "hPa", value: "hPa" },
                                  { label: "kPa", value: "kPa" },
                                  { label: "MPa", value: "MPa" },
                                  { label: "GPa", value: "GPa" },
                                  { label: "inHg", value: "inHg" },
                                  { label: "mmHg", value: "mmHg" },
                                ].map((unit, index) => (
                                  <p
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setUnitHandler8(unit.value)}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      {formData?.tech_point_unit ===
                      "entropy change for a reaction" ? (
                        <>
                          <div>
                            <div className="flex flex-col md:flex-row items-center bg-sky bordered rounded-lg px-3 py-2">
                              <strong className="pe-md-3">
                                {data?.payload?.tech_lang_keys["14"]} =
                              </strong>
                              <strong className="text-[#119154] text-[28px]">
                                {entropy}{" "}
                                <span className="text-[16px]">j/mol*K</span>
                              </strong>
                            </div>

                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]}
                              </strong>
                            </p>

                            {/* First Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>kj/mol*K</strong>
                                </p>
                                <p>{(entropy / 1000).toExponential(3)}</p>
                              </div>
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>mj/mol*K</strong>
                                </p>
                                <p>{(entropy / 1e6).toExponential(3)}</p>
                              </div>
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>wh/mol*K</strong>
                                </p>
                                <p>{(entropy / 3600).toExponential(3)}</p>
                              </div>
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>kwh/mol*K</strong>
                                </p>
                                <p>{(entropy / 3.6e6).toFixed(8)}</p>
                              </div>
                            </div>

                            {/* Second Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>ft-lb/mol*K</strong>
                                </p>
                                <p>
                                  {(entropy * 0.737562149).toExponential(3)}
                                </p>
                              </div>
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>cal/mol*K</strong>
                                </p>
                                <p>{(entropy / 4.184).toExponential(3)}</p>
                              </div>
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>kcal/mol*K</strong>
                                </p>
                                <p>{(entropy * 0.000239006).toFixed(9)}</p>
                              </div>
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>ev/mol*K</strong>
                                </p>
                                <p>
                                  {(
                                    entropy *
                                    6.242 *
                                    Math.pow(10, 18)
                                  ).toExponential(3)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : formData?.tech_point_unit ===
                        "gibbs free energy ΔG = ΔH - T*ΔS" ? (
                        <>
                          <div>
                            <div className="bg-sky bordered rounded-lg px-3 py-2">
                              <div className="flex flex-col md:flex-row items-center">
                                <strong className="pe-md-3">
                                  {data?.payload?.tech_lang_keys["16"]} =
                                </strong>
                                <strong className="text-[#119154] text-[28px]">
                                  {gibbs} <span className="text-[16px]">j</span>
                                </strong>
                              </div>

                              <div className="w-full text-center md:text-left mt-2">
                                {gibbs < 0 ? (
                                  <p>{data?.payload?.tech_lang_keys["18"]}.</p>
                                ) : gibbs > 0 ? (
                                  <p>{data?.payload?.tech_lang_keys["19"]}.</p>
                                ) : (
                                  <p>{data?.payload?.tech_lang_keys["20"]}.</p>
                                )}
                              </div>
                            </div>

                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]}
                              </strong>
                            </p>

                            {/* First Conversion Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>kj</strong>
                                </p>
                                <p>{(gibbs / 1000).toExponential(3)}</p>
                              </div>
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>mj</strong>
                                </p>
                                <p>{(gibbs / 1e6).toExponential(3)}</p>
                              </div>
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>wh</strong>
                                </p>
                                <p>{(gibbs / 3600).toExponential(3)}</p>
                              </div>
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>kwh</strong>
                                </p>
                                <p>{(gibbs / 3.6e6).toExponential(3)}</p>
                              </div>
                            </div>

                            {/* Second Conversion Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>ft-lb</strong>
                                </p>
                                <p>{(gibbs * 0.737562149).toExponential(3)}</p>
                              </div>
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>cal</strong>
                                </p>
                                <p>{(gibbs / 4.184).toExponential(3)}</p>
                              </div>
                              <div className="border-r-4 mt-3">
                                <p>
                                  <strong>kcal</strong>
                                </p>
                                <p>{(gibbs * 0.000239006).toExponential(3)}</p>
                              </div>
                              <div className="border-r-4 mt-3 break-words">
                                <p>
                                  <strong>ev</strong>
                                </p>
                                <p>
                                  {(
                                    gibbs *
                                    6.242 *
                                    Math.pow(10, 18)
                                  ).toExponential(3)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : formData?.tech_point_unit ===
                        "isothermal entropy change of an ideal gas" ? (
                        <>
                          {formData?.tech_base_unit === "volume" ? (
                            <>
                              <div className="flex flex-col md:flex-row items-center bg-sky bordered rounded-lg px-3 py-2">
                                <strong className="md:pe-3">
                                  {data?.payload?.tech_lang_keys["21"]} =
                                </strong>
                                <strong className="text-[#119154] text-[28px]">
                                  {Number(result?.tech_answer).toExponential(3)}{" "}
                                  <span className="text-[16px]">j</span>
                                </strong>
                              </div>

                              <p className="mt-3 font-bold">
                                {data?.payload?.tech_lang_keys["15"]}
                              </p>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <UnitBox
                                  label="kj"
                                  value={result?.tech_answer / 1000}
                                />
                                <UnitBox
                                  label="mj"
                                  value={result?.tech_answer / 1e6}
                                />
                                <UnitBox
                                  label="wh"
                                  value={result?.tech_answer / 3600}
                                />
                                <UnitBox
                                  label="kwh"
                                  value={result?.tech_answer / 3.6e6}
                                />
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <UnitBox
                                  label="ft-lb"
                                  value={result?.tech_answer * 0.737562149}
                                />
                                <UnitBox
                                  label="cal"
                                  value={result?.tech_answer / 4.184}
                                />
                                <UnitBox
                                  label="kcal"
                                  value={result?.tech_answer * 0.000239006}
                                />
                                <UnitBox
                                  label="ev"
                                  value={
                                    result?.tech_answer *
                                    6.242 *
                                    Math.pow(10, 18)
                                  }
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex flex-col md:flex-row items-center bg-sky bordered rounded-lg px-3 py-2">
                                <strong className="md:pe-3">
                                  {data?.payload?.tech_lang_keys["21"]} =
                                </strong>
                                <strong className="text-[#119154] text-[28px]">
                                  {Number(result?.tech_answers).toExponential(
                                    3
                                  )}{" "}
                                  <span className="text-[16px]">j</span>
                                </strong>
                              </div>

                              <p className="mt-3 font-bold">
                                {data?.payload?.tech_lang_keys["15"]}
                              </p>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <UnitBox
                                  label="kj"
                                  value={result?.tech_answers / 1000}
                                />
                                <UnitBox
                                  label="mj"
                                  value={result?.tech_answers / 1e6}
                                />
                                <UnitBox
                                  label="wh"
                                  value={result?.tech_answers / 3600}
                                />
                                <UnitBox
                                  label="kwh"
                                  value={result?.tech_answers / 3.6e6}
                                />
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <UnitBox
                                  label="ft-lb"
                                  value={result?.tech_answers * 0.737562149}
                                />
                                <UnitBox
                                  label="cal"
                                  value={result?.tech_answers / 4.184}
                                />
                                <UnitBox
                                  label="kcal"
                                  value={result?.tech_answers * 0.000239006}
                                />
                                <UnitBox
                                  label="ev"
                                  value={
                                    result?.tech_answers *
                                    6.242 *
                                    Math.pow(10, 18)
                                  }
                                />
                              </div>
                            </>
                          )}
                        </>
                      ) : null}
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

export default EntropyCalculator;

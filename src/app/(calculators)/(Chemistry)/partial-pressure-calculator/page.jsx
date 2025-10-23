"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePartialPressureCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PartialPressureCalculator = () => {
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
    tech_formula: "1",
    tech_to_cal1: "1",
    tech_total: "8",
    tech_total_unit: "Pa",
    tech_mole: "1",
    tech_partial: "8",
    tech_part_unit: "Pa",
    tech_to_cal2: "1",
    tech_amole: "3",
    tech_temp: "2",
    tech_temp_unit: "°C",
    tech_volume: "4",
    tech_vol_unit: "mm³",
    tech_partial1: "8",
    tech_part_unit1: "Pa",
    tech_to_cal3: "1",
    tech_gas: "1",
    tech_cons: "",
    tech_conc: "4",
    tech_conc_unit: "Pa",
    tech_partial2: "5",
    tech_part_unit2: "Pa",
    tech_to_cal4: "2",
    tech_gas1: "4",
    tech_cons1: "3",
    tech_cons1_unit2: "Pa",
    tech_mole1: "5",
    tech_partial3: "3",
    tech_part_unit3: "Pa",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePartialPressureCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_formula) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_formula: formData.tech_formula,
        tech_to_cal1: formData.tech_to_cal1,
        tech_total: formData.tech_total,
        tech_total_unit: formData.tech_total_unit,
        tech_mole: formData.tech_mole,
        tech_partial: formData.tech_partial,
        tech_part_unit: formData.tech_part_unit,
        tech_to_cal2: formData.tech_to_cal2,
        tech_amole: formData.tech_amole,
        tech_temp: formData.tech_temp,
        tech_temp_unit: formData.tech_temp_unit,
        tech_volume: formData.tech_volume,
        tech_vol_unit: formData.tech_vol_unit,
        tech_partial1: formData.tech_partial1,
        tech_part_unit1: formData.tech_part_unit1,
        tech_to_cal3: formData.tech_to_cal3,
        tech_gas: formData.tech_gas,
        tech_cons: formData.tech_cons,
        tech_conc: formData.tech_conc,
        tech_conc_unit: formData.tech_conc_unit,
        tech_partial2: formData.tech_partial2,
        tech_part_unit2: formData.tech_part_unit2,
        tech_to_cal4: formData.tech_to_cal4,
        tech_gas1: formData.tech_gas1,
        tech_cons1: formData.tech_cons1,
        tech_cons1_unit2: formData.tech_cons1_unit2,
        tech_mole1: formData.tech_mole1,
        tech_partial3: formData.tech_partial3,
        tech_part_unit3: formData.tech_part_unit3,
      }).unwrap();
      setResult(response); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_formula: "1",
      tech_to_cal1: "1",
      tech_total: "8",
      tech_total_unit: "Pa",
      tech_mole: "1",
      tech_partial: "8",
      tech_part_unit: "Pa",
      tech_to_cal2: "1",
      tech_amole: "3",
      tech_temp: "2",
      tech_temp_unit: "°C",
      tech_volume: "4",
      tech_vol_unit: "mm³",
      tech_partial1: "8",
      tech_part_unit1: "Pa",
      tech_to_cal3: "1",
      tech_gas: "1",
      tech_cons: "",
      tech_conc: "4",
      tech_conc_unit: "Pa",
      tech_partial2: "5",
      tech_part_unit2: "Pa",
      tech_to_cal4: "2",
      tech_gas1: "4",
      tech_cons1: "3",
      tech_cons1_unit2: "Pa",
      tech_mole1: "5",
      tech_partial3: "3",
      tech_part_unit3: "Pa",
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
    setFormData((prev) => ({ ...prev, tech_total_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_part_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_temp_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_vol_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_part_unit1: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_conc_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_part_unit2: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };
  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cons1_unit2: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };
  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_part_unit3: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-1   gap-4">
              <div className=" relative">
                <label htmlFor="tech_formula" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_formula"
                    id="tech_formula"
                    value={formData.tech_formula}
                    onChange={handleChange}
                  >
                    <option value="1">Dalton's law</option>
                    <option value="2">Ideal gas law</option>
                    <option value="3">Henry's law - method 1</option>
                    <option value="4">Henry's law - method 2</option>
                  </select>
                </div>
              </div>
            </div>
            {formData.tech_formula == "1" && (
              <>
                <div className="formula1 ">
                  <div className="grid grid-cols-1  mt-4 lg:grid-cols-2 md:grid-cols-2  gap-4 ">
                    <div className="">
                      <label htmlFor="tech_to_cal1" className="label">
                        {data?.payload?.tech_lang_keys["2"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_to_cal1"
                          id="tech_to_cal1"
                          value={formData.tech_to_cal1}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["3"]}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["4"]}
                          </option>
                          <option value="3">
                            {data?.payload?.tech_lang_keys["5"]}
                          </option>
                        </select>
                      </div>
                    </div>
                    {(formData.tech_to_cal1 == "1" ||
                      formData.tech_to_cal1 == "2") && (
                      <>
                        <div className=" total">
                          <label htmlFor="tech_total" className="label">
                            {data?.payload?.tech_lang_keys["5"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_total"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_total}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown}
                            >
                              {formData.tech_total_unit} ▾
                            </label>
                            {dropdownVisible && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "Pa", value: "Pa" },
                                  { label: "Bar", value: "Bar" },
                                  { label: "Torr", value: "Torr" },
                                  { label: "psi", value: "psi" },
                                  { label: "atm", value: "atm" },
                                  { label: "hPa", value: "hPa" },
                                  { label: "MPa", value: "MPa" },
                                  { label: "kPa", value: "kPa" },
                                  { label: "GPa", value: "GPa" },
                                  { label: "mmHg", value: "mmHg" },
                                  { label: "in Hg", value: "in Hg" },
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
                    {(formData.tech_to_cal1 == "1" ||
                      formData.tech_to_cal1 == "3") && (
                      <>
                        <div className=" mole">
                          <label htmlFor="tech_mole" className="label">
                            {data?.payload?.tech_lang_keys["4"]}:
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_mole"
                              id="tech_mole"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              min="0"
                              max="1"
                              value={formData.tech_mole}
                              onChange={handleChange}
                            />
                            <span className="input_unit">mol</span>
                          </div>
                        </div>
                      </>
                    )}
                    {(formData.tech_to_cal1 == "2" ||
                      formData.tech_to_cal1 == "3") && (
                      <>
                        <div className=" partial">
                          <label htmlFor="tech_partial" className="label">
                            {data?.payload?.tech_lang_keys["3"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_partial"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_partial}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown1}
                            >
                              {formData.tech_part_unit} ▾
                            </label>
                            {dropdownVisible1 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "Pa", value: "Pa" },
                                  { label: "Bar", value: "Bar" },
                                  { label: "Torr", value: "Torr" },
                                  { label: "psi", value: "psi" },
                                  { label: "atm", value: "atm" },
                                  { label: "hPa", value: "hPa" },
                                  { label: "MPa", value: "MPa" },
                                  { label: "kPa", value: "kPa" },
                                  { label: "GPa", value: "GPa" },
                                  { label: "mmHg", value: "mmHg" },
                                  { label: "in Hg", value: "in Hg" },
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
                  </div>
                </div>
              </>
            )}
            {formData.tech_formula == "2" && (
              <>
                <div className="formula2 ">
                  <div className="grid grid-cols-1  mt-4 lg:grid-cols-2 md:grid-cols-2  gap-4  ">
                    <div className="">
                      <label htmlFor="tech_to_cal2" className="label">
                        {data?.payload?.tech_lang_keys["2"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_to_cal2"
                          id="tech_to_cal2"
                          value={formData.tech_to_cal2}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["3"]}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["8"]}
                          </option>
                          <option value="3">
                            {data?.payload?.tech_lang_keys["7"]}
                          </option>
                          <option value="4">
                            {data?.payload?.tech_lang_keys["12"]}
                          </option>
                        </select>
                      </div>
                    </div>
                    {(formData.tech_to_cal2 === "1" ||
                      formData.tech_to_cal2 === "2" ||
                      formData.tech_to_cal2 === "3") && (
                      <>
                        <div className=" amole ">
                          <label htmlFor="tech_amole" className="label">
                            {data?.payload?.tech_lang_keys["6"]}:
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_amole"
                              id="tech_amole"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_amole}
                              onChange={handleChange}
                            />
                            <span className="input_unit">mol</span>
                          </div>
                        </div>
                      </>
                    )}
                    {(formData.tech_to_cal2 === "1" ||
                      formData.tech_to_cal2 === "2" ||
                      formData.tech_to_cal2 === "4") && (
                      <>
                        <div className=" temp">
                          <label htmlFor="tech_temp" className="label">
                            {data?.payload?.tech_lang_keys["7"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_temp"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_temp}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown2}
                            >
                              {formData.tech_temp_unit} ▾
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
                    {(formData.tech_to_cal2 === "1" ||
                      formData.tech_to_cal2 === "3" ||
                      formData.tech_to_cal2 === "4") && (
                      <>
                        <div className=" volume">
                          <label htmlFor="tech_volume" className="label">
                            {data?.payload?.tech_lang_keys["8"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_volume"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_volume}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown3}
                            >
                              {formData.tech_vol_unit} ▾
                            </label>
                            {dropdownVisible3 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "mm³", value: "mm³" },
                                  { label: "cm³", value: "cm³" },
                                  { label: "dm³", value: "dm³" },
                                  { label: "m³", value: "m³" },
                                  { label: "in³", value: "in³" },
                                  { label: "ft³", value: "ft³" },
                                  { label: "yd³", value: "yd³" },
                                  { label: "litre", value: "litre" },
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
                    {(formData.tech_to_cal2 === "2" ||
                      formData.tech_to_cal2 === "3" ||
                      formData.tech_to_cal2 === "4") && (
                      <>
                        <div className=" partial1">
                          <label htmlFor="tech_partial1" className="label">
                            {data?.payload?.tech_lang_keys["3"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_partial1"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_partial1}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown4}
                            >
                              {formData.tech_part_unit1} ▾
                            </label>
                            {dropdownVisible4 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "Pa", value: "Pa" },
                                  { label: "Bar", value: "Bar" },
                                  { label: "Torr", value: "Torr" },
                                  { label: "psi", value: "psi" },
                                  { label: "atm", value: "atm" },
                                  { label: "hPa", value: "hPa" },
                                  { label: "MPa", value: "MPa" },
                                  { label: "kPa", value: "kPa" },
                                  { label: "GPa", value: "GPa" },
                                  { label: "mmHg", value: "mmHg" },
                                  { label: "in Hg", value: "in Hg" },
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
                  </div>
                </div>
              </>
            )}
            {formData.tech_formula == "3" && (
              <>
                <div className="henry1 ">
                  <div className="grid grid-cols-1  mt-4 lg:grid-cols-2 md:grid-cols-2  gap-4  ">
                    <div className="">
                      <label htmlFor="tech_to_cal3" className="label">
                        {data?.payload?.tech_lang_keys["2"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_to_cal3"
                          id="tech_to_cal3"
                          value={formData.tech_to_cal3}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["3"]}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["9"]}{" "}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="">
                      <label htmlFor="tech_gas" className="label">
                        {data?.payload?.tech_lang_keys["10"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_gas"
                          id="tech_gas"
                          value={formData.tech_gas}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["13"]}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["14"]}{" "}
                          </option>
                          <option value="3">
                            {data?.payload?.tech_lang_keys["15"]}{" "}
                          </option>
                          <option value="4">
                            {data?.payload?.tech_lang_keys["16"]}{" "}
                          </option>
                          <option value="5">
                            {data?.payload?.tech_lang_keys["17"]}{" "}
                          </option>
                          <option value="6">
                            {data?.payload?.tech_lang_keys["18"]}{" "}
                          </option>
                          <option value="7">
                            {data?.payload?.tech_lang_keys["19"]}{" "}
                          </option>
                          <option value="8">
                            {data?.payload?.tech_lang_keys["20"]}{" "}
                          </option>
                          <option value="9">
                            {data?.payload?.tech_lang_keys["21"]}{" "}
                          </option>
                        </select>
                      </div>
                    </div>
                    {formData.tech_gas == "9" && (
                      <>
                        <div className="col-span-2 md:col-span-1 const">
                          <label htmlFor="tech_cons" className="label">
                            {data?.payload?.tech_lang_keys["22"]}:
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_cons"
                              id="tech_cons"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_cons}
                              onChange={handleChange}
                            />
                            <span className="input_unit">litre*atm/mol</span>
                          </div>
                        </div>
                      </>
                    )}

                    {formData.tech_to_cal3 == "1" && (
                      <>
                        <div className=" conc">
                          <label htmlFor="tech_conc" className="label">
                            {data?.payload?.tech_lang_keys["9"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_conc"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_conc}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown5}
                            >
                              {formData.tech_conc_unit} ▾
                            </label>
                            {dropdownVisible5 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "M", value: "M" },
                                  { label: "mM", value: "mM" },
                                  { label: "μM", value: "μM" },
                                  { label: "nM", value: "nM" },
                                  { label: "pM", value: "pM" },
                                  { label: "fM", value: "fM" },
                                  { label: "aM", value: "aM" },
                                  { label: "zM", value: "zM" },
                                  { label: "yM", value: "yM" },
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
                    {formData.tech_to_cal3 == "2" && (
                      <>
                        <div className=" partial2">
                          <label htmlFor="tech_partial2" className="label">
                            {data?.payload?.tech_lang_keys["3"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_partial2"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_partial2}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown6}
                            >
                              {formData.tech_part_unit2} ▾
                            </label>
                            {dropdownVisible6 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "Pa", value: "Pa" },
                                  { label: "Bar", value: "Bar" },
                                  { label: "Torr", value: "Torr" },
                                  { label: "psi", value: "psi" },
                                  { label: "atm", value: "atm" },
                                  { label: "hPa", value: "hPa" },
                                  { label: "MPa", value: "MPa" },
                                  { label: "kPa", value: "kPa" },
                                  { label: "GPa", value: "GPa" },
                                  { label: "mmHg", value: "mmHg" },
                                  { label: "in Hg", value: "in Hg" },
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
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
            {formData.tech_formula == "4" && (
              <>
                <div className="henry2 ">
                  <div className="grid grid-cols-1  mt-4 lg:grid-cols-2 md:grid-cols-2  gap-4 ">
                    <div className="">
                      <label htmlFor="tech_to_cal4" className="label">
                        {data?.payload?.tech_lang_keys["2"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_to_cal4"
                          id="tech_to_cal4"
                          value={formData.tech_to_cal4}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["3"]}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["4"]}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="">
                      <label htmlFor="tech_gas1" className="label">
                        {data?.payload?.tech_lang_keys["10"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_gas1"
                          id="tech_gas1"
                          value={formData.tech_gas1}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["13"]}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["14"]}
                          </option>
                          <option value="3">
                            {data?.payload?.tech_lang_keys["15"]}
                          </option>
                          <option value="4">
                            {data?.payload?.tech_lang_keys["16"]}
                          </option>
                          <option value="5">
                            {data?.payload?.tech_lang_keys["17"]}
                          </option>
                          <option value="6">
                            {data?.payload?.tech_lang_keys["18"]}
                          </option>
                          <option value="7">
                            {data?.payload?.tech_lang_keys["19"]}
                          </option>
                          <option value="8">
                            {data?.payload?.tech_lang_keys["20"]}
                          </option>
                          <option value="9">
                            {data?.payload?.tech_lang_keys["21"]}
                          </option>
                        </select>
                      </div>
                    </div>

                    {formData.tech_gas1 == "9" && (
                      <>
                        <div className="col-span-2 md:col-span-1 cons1">
                          <label htmlFor="tech_cons1" className="label">
                            {data?.payload?.tech_lang_keys["22"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_cons1"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_cons1}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown7}
                            >
                              {formData.tech_cons1_unit2} ▾
                            </label>
                            {dropdownVisible7 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "Pa", value: "Pa" },
                                  { label: "Bar", value: "Bar" },
                                  { label: "Torr", value: "Torr" },
                                  { label: "psi", value: "psi" },
                                  { label: "atm", value: "atm" },
                                  { label: "hPa", value: "hPa" },
                                  { label: "MPa", value: "MPa" },
                                  { label: "kPa", value: "kPa" },
                                  { label: "GPa", value: "GPa" },
                                  { label: "mmHg", value: "mmHg" },
                                  { label: "in Hg", value: "in Hg" },
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

                    {formData.tech_to_cal4 == "1" && (
                      <>
                        <div className=" mole1">
                          <label htmlFor="tech_mole1" className="label">
                            {data?.payload?.tech_lang_keys["4"]}:
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_mole1"
                              id="tech_mole1"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              min="0"
                              max="1"
                              value={formData.tech_mole1}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {formData.tech_to_cal4 == "2" && (
                      <>
                        <div className=" partial3">
                          <label htmlFor="tech_partial3" className="label">
                            {data?.payload?.tech_lang_keys["3"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_partial3"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_partial3}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown8}
                            >
                              {formData.tech_part_unit3} ▾
                            </label>
                            {dropdownVisible8 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "Pa", value: "Pa" },
                                  { label: "Bar", value: "Bar" },
                                  { label: "Torr", value: "Torr" },
                                  { label: "psi", value: "psi" },
                                  { label: "atm", value: "atm" },
                                  { label: "hPa", value: "hPa" },
                                  { label: "MPa", value: "MPa" },
                                  { label: "kPa", value: "kPa" },
                                  { label: "GPa", value: "GPa" },
                                  { label: "mmHg", value: "mmHg" },
                                  { label: "in Hg", value: "in Hg" },
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
                    <div className="w-full bordered  p-3 rounded-lg mt-3 bg-sky">
                      <div className="w-full text-center ">
                        {result?.tech_mode == 1 && (
                          <>
                            <p className="text-[16px] md:text-[22px]">
                              {data?.payload?.tech_lang_keys[3]}
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[20px] md:text-[32px]">
                                {result?.tech_ans}
                                <span className="text-[#119154] text-[22px]">
                                  {" "}
                                  {result?.tech_unit}
                                </span>
                              </strong>
                            </p>
                          </>
                        )}

                        {result?.tech_mode == 2 && (
                          <>
                            <p className="text-[16px] md:text-[22px]">
                              {data?.payload?.tech_lang_keys[4]}
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[20px] md:text-[32px]">
                                {result?.tech_ans}
                              </strong>
                            </p>
                            {result?.tech_ans > 1 && (
                              <p className="text-red">
                                {data?.payload?.tech_lang_keys[11]} 1
                              </p>
                            )}
                          </>
                        )}

                        {result?.tech_mode == 3 && (
                          <>
                            <p className="text-[16px] md:text-[22px]">
                              {data?.payload?.tech_lang_keys[5]}
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[20px] md:text-[32px]">
                                {result?.tech_ans}
                                <span className="text-[#119154] text-[22px]">
                                  {" "}
                                  {result?.tech_unit}
                                </span>
                              </strong>
                            </p>
                          </>
                        )}

                        {result?.tech_mode == 4 && (
                          <>
                            <p className="text-[16px] md:text-[22px]">
                              {data?.payload?.tech_lang_keys[3]}
                            </p>
                            <p>
                              <strong className="text-green-800 text-[20px] md:text-[32px]">
                                {result?.tech_ans}
                                <span className="text-green-800 text-[22px]">
                                  {" "}
                                  Pa
                                </span>
                              </strong>
                            </p>
                          </>
                        )}

                        {result?.tech_mode == 5 && (
                          <>
                            <p className="text-[16px] md:text-[22px]">
                              {data?.payload?.tech_lang_keys[8]}
                            </p>
                            <p>
                              <strong className="text-green-800 text-[20px] md:text-[32px]">
                                {result?.tech_ans}
                                <span className="text-green-800 text-[22px]">
                                  {" "}
                                  m³
                                </span>
                              </strong>
                            </p>
                          </>
                        )}

                        {result?.tech_mode == 6 && (
                          <>
                            <p className="text-[16px] md:text-[22px]">
                              {data?.payload?.tech_lang_keys[7]}
                            </p>
                            <p>
                              <strong className="text-green-800 text-[20px] md:text-[32px]">
                                {result?.tech_ans}
                                <span className="text-green-800 text-[22px]">
                                  {" "}
                                  K
                                </span>
                              </strong>
                            </p>
                          </>
                        )}

                        {result?.tech_mode == 7 && (
                          <>
                            <p className="text-[16px] md:text-[22px]">
                              {data?.payload?.tech_lang_keys[12]}
                            </p>
                            <p>
                              <strong className="text-green-800 text-[20px] md:text-[32px]">
                                {result?.tech_ans}
                                <span className="text-green-800 text-[22px]">
                                  {" "}
                                  mol
                                </span>
                              </strong>
                            </p>
                          </>
                        )}

                        {result?.tech_mode == 8 && (
                          <>
                            <p className="text-[16px] md:text-[22px]">
                              {data?.payload?.tech_lang_keys[9]}
                            </p>
                            <p>
                              <strong className="text-green-800 text-[20px] md:text-[32px]">
                                {result?.tech_ans}
                                <span className="text-green-800 text-[22px]">
                                  {" "}
                                  M
                                </span>
                              </strong>
                            </p>
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

export default PartialPressureCalculator;

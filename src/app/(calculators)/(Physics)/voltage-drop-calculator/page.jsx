"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useVoltageDropCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VoltageDropCalculator = () => {
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
    tech_calculate_unit: "1", //  1 2 3
    tech_find_unit: "1",
    tech_wire_material_unit: "cu",
    tech_wire_material_unit_two: "0",
    tech_resistivity: "1.72e-8",
    tech_max_voltage_drop: "1",
    tech_wire_size_unit: "600",
    tech_cable_length: "300",
    tech_cable_length_unit: "ft",
    tech_wire_length: "300",
    tech_wire_length_unit: "cm",
    tech_gauge: "50",
    tech_wire_diameter_size: "8",
    tech_wire_diameter_size_unit: "AWG",
    tech_load_current: "1.2",
    tech_load_current_unit: "am",
    tech_conductors: "1",
    tech_voltage: "220",
    tech_voltage_unit: "volts",
    tech_material_of_conduit: "pvc",
    tech_power_voltage: "0.1",
    tech_wire_resistance: "1.29",
    tech_wire_resistance_unit: "km",
    tech_phase_unit: "1",
    tech_insulation: "0",
    tech_raceway: "0",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVoltageDropCalculatorMutation();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  //       setResult(null);
  //   setFormError(null);
  // };
  const [manualResistivity, setManualResistivity] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      if (name === "tech_wire_material_unit") {
        let resistivity = "";

        if (value === "cu") {
          resistivity = "1.72e-8";
        } else if (value === "al") {
          resistivity = "2.82e-8";
        } else if (value === "cs") {
          resistivity = "1.43e-7";
        } else if (value === "es") {
          resistivity = "4.6e-7";
        } else if (value === "go") {
          resistivity = "2.44e-8";
        } else if (value === "ni") {
          resistivity = "1.1e-6";
        } else if (value === "nic") {
          resistivity = "6.99e-8";
        } else if (value === "si") {
          resistivity = "1.59e-8";
        }

        // Set resistivity only on material change
        updatedData.tech_resistivity = resistivity;
      }

      return updatedData;
    });

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculate_unit) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculate_unit: formData.tech_calculate_unit,
        tech_find_unit: formData.tech_find_unit,
        tech_wire_material_unit: formData.tech_wire_material_unit,
        tech_wire_material_unit_two: formData.tech_wire_material_unit_two,
        tech_resistivity: formData.tech_resistivity,
        tech_max_voltage_drop: formData.tech_max_voltage_drop,
        tech_wire_size_unit: formData.tech_wire_size_unit,
        tech_cable_length: formData.tech_cable_length,
        tech_cable_length_unit: formData.tech_cable_length_unit,
        tech_wire_length: formData.tech_wire_length,
        tech_wire_length_unit: formData.tech_wire_length_unit,
        tech_gauge: formData.tech_gauge,
        tech_wire_diameter_size: formData.tech_wire_diameter_size,
        tech_wire_diameter_size_unit: formData.tech_wire_diameter_size_unit,
        tech_load_current: formData.tech_load_current,
        tech_load_current_unit: formData.tech_load_current_unit,
        tech_conductors: formData.tech_conductors,
        tech_voltage: formData.tech_voltage,
        tech_voltage_unit: formData.tech_voltage_unit,
        tech_material_of_conduit: formData.tech_material_of_conduit,
        tech_power_voltage: formData.tech_power_voltage,
        tech_wire_resistance: formData.tech_wire_resistance,
        tech_wire_resistance_unit: formData.tech_wire_resistance_unit,
        tech_phase_unit: formData.tech_phase_unit,
        tech_insulation: formData.tech_insulation,
        tech_raceway: formData.tech_raceway,
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
      tech_calculate_unit: "2", //  1 2 3
      tech_find_unit: "1",
      tech_wire_material_unit: "cu",
      tech_wire_material_unit_two: "0",
      tech_resistivity: "1.72e-8",
      tech_max_voltage_drop: "1",
      tech_wire_size_unit: "600",
      tech_cable_length: "300",
      tech_cable_length_unit: "ft",
      tech_wire_length: "300",
      tech_wire_length_unit: "cm",
      tech_gauge: "50",
      tech_wire_diameter_size: "8",
      tech_wire_diameter_size_unit: "AWG",
      tech_load_current: "1.2",
      tech_load_current_unit: "am",
      tech_conductors: "1",
      tech_voltage: "220",
      tech_voltage_unit: "volts",
      tech_material_of_conduit: "pvc",
      tech_power_voltage: "0.1",
      tech_wire_resistance: "1.29",
      tech_wire_resistance_unit: "km",
      tech_phase_unit: "1",
      tech_insulation: "0",
      tech_raceway: "0",
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
    setFormData((prev) => ({ ...prev, tech_cable_length_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wire_length_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wire_diameter_size_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_load_current_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_voltage_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wire_resistance_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_calculate_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calculate_unit"
                    id="tech_calculate_unit"
                    value={formData.tech_calculate_unit}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_calculate_unit == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 find ">
                    <label htmlFor="tech_find_unit" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_find_unit"
                        id="tech_find_unit"
                        value={formData.tech_find_unit}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["6"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["7"]}{" "}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["8"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculate_unit == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 wire_material">
                    <label htmlFor="tech_wire_material_unit" className="label">
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_wire_material_unit"
                        id="tech_wire_material_unit"
                        value={formData.tech_wire_material_unit}
                        onChange={handleChange}
                      >
                        <option value="cu">
                          {" "}
                          {data?.payload?.tech_lang_keys["10"]}{" "}
                        </option>
                        <option value="al">
                          {" "}
                          {data?.payload?.tech_lang_keys["11"]}
                        </option>
                        <option value="cs">
                          {" "}
                          {data?.payload?.tech_lang_keys["12"]}
                        </option>
                        <option value="es">
                          {" "}
                          {data?.payload?.tech_lang_keys["13"]}
                        </option>
                        <option value="go">
                          {" "}
                          {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="ni">
                          {" "}
                          {data?.payload?.tech_lang_keys["15"]}
                        </option>
                        <option value="nic">
                          {" "}
                          {data?.payload?.tech_lang_keys["16"]}
                        </option>
                        <option value="si">
                          {" "}
                          {data?.payload?.tech_lang_keys["17"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculate_unit == "1" ||
                formData.tech_calculate_unit == "2") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 wire_material_two ">
                    <label
                      htmlFor="tech_wire_material_unit_two"
                      className="label"
                    >
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_wire_material_unit_two"
                        id="tech_wire_material_unit_two"
                        value={formData.tech_wire_material_unit_two}
                        onChange={handleChange}
                      >
                        <option value="0">
                          {" "}
                          {data?.payload?.tech_lang_keys["10"]}{" "}
                        </option>
                        <option value="1">
                          {" "}
                          {data?.payload?.tech_lang_keys["11"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculate_unit == "1" ||
                formData.tech_calculate_unit == "2") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 wire_resistivity ">
                    <label htmlFor="tech_resistivity" className="label">
                      {data?.payload?.tech_lang_keys["18"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_resistivity"
                        id="tech_resistivity"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_resistivity}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculate_unit == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 max_voltage_drop ">
                    <label htmlFor="tech_max_voltage_drop" className="label">
                      {data?.payload?.tech_lang_keys["19"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_max_voltage_drop"
                        id="tech_max_voltage_drop"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_max_voltage_drop}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculate_unit == "1" ||
                formData.tech_calculate_unit == "1") && (
                <>
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6 wire_size ">
               <label htmlFor="tech_wire_size_unit" className="label">
                      {data?.payload?.tech_lang_keys["20"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_wire_size_unit"
                        id="tech_wire_size_unit"
                        value={formData.tech_wire_size_unit}
                        onChange={handleChange}
                      >
                      <option value="600" >600 kcmil</option>
                        <option value="500" >500 kcmil</option>
                        <option value="400" >400 kcmil</option>
                        <option value="350" >350 kcmil</option>
                        <option value="300" >300 kcmil</option>
                        <option value="250" >250 kcmil</option>
                        <option value="4/0" >4/0 AWG (212 kcmil)</option>
                        <option value="3/0" >3/0 AWG (168 kcmil)</option>
                        <option value="2/0" >2/0 AWG (133 kcmil)</option>
                        <option value="1/0" >1/0 AWG (106 kcmil)</option>
                        <option value="1" >1 AWG (83.7 kcmil)</option>
                        <option value="2" >2 AWG (66.4 kcmil)</option>
                        <option value="3" >3 AWG (52.6 kcmil)</option>
                        <option value="4" >4 AWG (41.7 kcmil)</option>
                        <option value="5" >5 AWG (33.1 kcmil)</option>
                        <option value="6" >6 AWG (26.3 kcmil)</option>
                        <option value="7" >7 AWG (20.8 kcmil)</option>
                        <option value="8" >8 AWG (16.5 kcmil)</option>
                        <option value="9" >9 AWG (13.1 kcmil)</option>
                        <option value="10" >10 AWG (10.4 kcmil)</option>
                        <option value="11" >11 AWG (8.23 kcmil)</option>
                        <option value="12" >12 AWG (6.53 kcmil)</option>
                        <option value="13" >13 AWG (5.18 kcmil)</option>
                        <option value="14" >14 AWG (4.11 kcmil)</option>
                        <option value="15" >15 AWG (3.26 kcmil)</option>
                        <option value="16" >16 AWG (2.58 kcmil)</option>
                        <option value="17" >17 AWG (2.05 kcmil)</option>
                        <option value="18" >18 AWG (1.62 kcmil)</option>
                        <option value="19" >19 AWG (1.29 kcmil)</option>
                        <option value="20" >20 AWG (1.02 kcmil)</option>
                        <option value="21" >21 AWG (0.810 kcmil)</option>
                        <option value="22" >22 AWG (0.642 kcmil)</option>
                        <option value="23" >23 AWG (0.509 kcmil)</option>
                        <option value="24" >24 AWG (0.404 kcmil)</option>
                        <option value="25" >25 AWG (0.320 kcmil)</option>
                        <option value="26" >26 AWG (0.254 kcmil)</option>
                        <option value="27" >27 AWG (0.202 kcmil)</option>
                        <option value="28" >28 AWG (0.160 kcmil)</option>
                        <option value="29" >29 AWG (0.127 kcmil)</option>
                        <option value="30" >30 AWG (0.101 kcmil)</option>
                        <option value="31" >31 AWG (0.0797 kcmil)</option>
                        <option value="32" >32 AWG (0.0632 kcmil)</option>
                        <option value="33" >33 AWG (0.0501 kcmil)</option>
                        <option value="34" >34 AWG (0.0398 kcmil)</option>
                        <option value="35" >35 AWG (0.0315 kcmil)</option>
                        <option value="36" >36 AWG (0.0250 kcmil)</option>
                        <option value="37" >37 AWG (0.0198 kcmil)</option>
                        <option value="38" >38 AWG (0.0157 kcmil)</option>
                        <option value="39" >39 AWG (0.0125 kcmil)</option>
                        <option value="40" >40 AWG (0.00989 kcmil)</option>
                        <option value="41" ></option>
                        <option value="42" ></option>
                        <option value="43" ></option>
                        <option value="44" ></option>
                        <option value="45" ></option>
                        <option value="46" ></option>
                        <option value="47" ></option>
                        <option value="48" ></option>
                        <option value="49" ></option>
                        <option value="50" ></option>
                      </select>
                    </div>
              
            </div> */}
                </>
              )}
              {formData.tech_calculate_unit == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 cable_length ">
                    <label htmlFor="tech_cable_length" className="label">
                      {data?.payload?.tech_lang_keys["21"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_cable_length"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_cable_length}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_cable_length_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet", value: "ft" },
                            { label: "meters", value: "m" },
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
              {(formData.tech_calculate_unit == "1" ||
                formData.tech_calculate_unit == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 wire_length ">
                    <label htmlFor="tech_wire_length" className="label">
                      {data?.payload?.tech_lang_keys["21"]}
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
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_wire_length_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "mm", value: "mm" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
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
              {formData.tech_calculate_unit == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 gauge ">
                    <label htmlFor="tech_gauge" className="label">
                      {data?.payload?.tech_lang_keys["22"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_gauge"
                        id="tech_gauge"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_gauge}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculate_unit == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 wire_diameter_size">
                    <label htmlFor="tech_wire_diameter_size" className="label">
                      {data?.payload?.tech_lang_keys["23"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_wire_diameter_size"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_wire_diameter_size}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_wire_diameter_size_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "AWG", value: "AWG" },
                            { label: "inch", value: "inch" },
                            { label: "mm", value: "mm" },
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
              {(formData.tech_calculate_unit == "1" ||
                formData.tech_calculate_unit == "2" ||
                formData.tech_calculate_unit == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 load_current">
                    <label htmlFor="tech_load_current" className="label">
                      {data?.payload?.tech_lang_keys["24"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_load_current"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_load_current}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_load_current_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "amps", value: "am" },
                            { label: "milliamps", value: "mi" },
                            { label: "watts", value: "wa" },
                            { label: "hp", value: "hp" },
                            { label: "kW", value: "kW" },
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
              {(formData.tech_calculate_unit == "1" ||
                formData.tech_calculate_unit == "2" ||
                formData.tech_calculate_unit == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 conductors">
                    <label htmlFor="tech_conductors" className="label">
                      {data?.payload?.tech_lang_keys["25"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_conductors"
                        id="tech_conductors"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_conductors}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculate_unit == "1" ||
                formData.tech_calculate_unit == "2" ||
                formData.tech_calculate_unit == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 voltage">
                    <label htmlFor="tech_voltage" className="label">
                      {data?.payload?.tech_lang_keys["24"]}
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
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_voltage_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            {
                              label: data?.payload?.tech_lang_keys[27],
                              value: "volts",
                            },
                            {
                              label: data?.payload?.tech_lang_keys[28],
                              value: "kilovolts",
                            },
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
              {formData.tech_calculate_unit == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 conduit">
                    <label htmlFor="tech_material_of_conduit" className="label">
                      {data?.payload?.tech_lang_keys["29"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_material_of_conduit"
                        id="tech_material_of_conduit"
                        value={formData.tech_material_of_conduit}
                        onChange={handleChange}
                      >
                        <option value="pvc"> PVC </option>
                        <option value="aluminium">
                          {" "}
                          {data?.payload?.tech_lang_keys["11"]}
                        </option>
                        <option value="steel">
                          {" "}
                          {data?.payload?.tech_lang_keys["30"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculate_unit == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 power_factor ">
                    <label htmlFor="tech_power_voltage" className="label">
                      {data?.payload?.tech_lang_keys["31"]}(PF):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_power_voltage"
                        id="tech_power_voltage"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_power_voltage}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculate_unit == "3" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 wire_resistance ">
                    <label htmlFor="tech_wire_resistance" className="label">
                      {data?.payload?.tech_lang_keys["32"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_wire_resistance"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_wire_resistance}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_wire_resistance_unit} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Ω/km", value: "km" },
                            { label: "Ω/m", value: "m" },
                            { label: "Ω/1000f", value: "tft" },
                            { label: "Ω/ft", value: "hft" },
                            { label: "mΩ/m", value: "mqm" },
                            { label: "mΩ/ft", value: "mft" },
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
              {(formData.tech_calculate_unit == "1" ||
                formData.tech_calculate_unit == "2" ||
                formData.tech_calculate_unit == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 phase">
                    <label htmlFor="tech_phase_unit" className="label">
                      {data?.payload?.tech_lang_keys["33"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_phase_unit"
                        id="tech_phase_unit"
                        value={formData.tech_phase_unit}
                        onChange={handleChange}
                      >
                        <option value="1"> DC </option>
                        <option value="2"> AC single-phase</option>
                        <option value="3"> AC three-phase</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculate_unit == "1" ||
                formData.tech_calculate_unit == "2" ||
                formData.tech_calculate_unit == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 insulation">
                    <label htmlFor="tech_insulation" className="label">
                      {data?.payload?.tech_lang_keys["34"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_insulation"
                        id="tech_insulation"
                        value={formData.tech_insulation}
                        onChange={handleChange}
                      >
                        <option value="0">60°C</option>
                        <option value="1">75°C</option>
                        <option value="2">90°C</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculate_unit == "1" ||
                formData.tech_calculate_unit == "2" ||
                formData.tech_calculate_unit == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 installation">
                    <label htmlFor="tech_raceway" className="label">
                      {data?.payload?.tech_lang_keys["35"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_raceway"
                        id="tech_raceway"
                        value={formData.tech_raceway}
                        onChange={handleChange}
                      >
                        <option value="0"> Raceway </option>
                        <option value="0"> Cable</option>
                        <option value="0"> Burried in Earth</option>
                        <option value="1"> Open Air</option>
                      </select>
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[70%] lg:w-[70%] mt-2 overflow-auto">
                        <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                          <tbody>
                            {result?.tech_voltage_drop_formula &&
                              result.tech_voltage_drop_formula !== "" && (
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[36]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result.tech_voltage_drop_formula} (
                                    {data?.payload?.tech_lang_keys[37]})
                                  </td>
                                </tr>
                              )}

                            {result?.tech_voltage_drop_percentage &&
                              result.tech_voltage_drop_percentage !== "" && (
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[38]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result.tech_voltage_drop_percentage} (%)
                                  </td>
                                </tr>
                              )}

                            {result?.tech_wire_resistance &&
                              result.tech_wire_resistance !== "" && (
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[39]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result.tech_wire_resistance} (Ω)
                                  </td>
                                </tr>
                              )}

                            {result?.tech_voltage &&
                              result.tech_voltage !== "" && (
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[40]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result.tech_voltage -
                                      result.tech_voltage_drop_formula}{" "}
                                    ({data?.payload?.tech_lang_keys[37]})
                                  </td>
                                </tr>
                              )}

                            {result?.tech_wiresize &&
                              result.tech_wiresize !== "" && (
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[20]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result.tech_wiresize}
                                  </td>
                                </tr>
                              )}

                            {result?.tech_final && result.tech_final !== "" && (
                              <tr>
                                <td className="py-2 border-b" width="50%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[41]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result.tech_final}
                                </td>
                              </tr>
                            )}

                            {result?.tech_vv && result.tech_vv !== "" && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[42]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result.tech_vv} (ft)
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[42]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result.tech_vv * 0.3048).toFixed(4)} (m)
                                  </td>
                                </tr>
                              </>
                            )}

                            {result?.tech_din &&
                              result.tech_din !== "" &&
                              result?.tech_dmm &&
                              result.tech_dmm !== "" && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[43]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result.tech_din} (ft)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[43]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {(result.tech_dmm * 0.3048).toFixed(4)}{" "}
                                      (m)
                                    </td>
                                  </tr>
                                </>
                              )}

                            {result?.tech_amil &&
                              result.tech_amil !== "" &&
                              result?.tech_ain &&
                              result.tech_ain !== "" &&
                              result?.tech_amm &&
                              result.tech_amm !== "" && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[44]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result.tech_amil} (kmcil)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[44]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result.tech_ain} (in²)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[44]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result.tech_amm} (mm²)
                                    </td>
                                  </tr>
                                </>
                              )}
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

export default VoltageDropCalculator;

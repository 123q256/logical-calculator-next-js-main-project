"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTransformerCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TransformerCalculator = () => {
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
    tech_phase_unit: "1", //   1 2 3 4 5 6 7 8 9 10 11 12 13 14
    tech_transformer_rating: "12",
    tech_transformer_rating_unit: "VA",
    tech_calculation_unit: "1",
    tech_location: "1",
    tech_impedance: "50",
    tech_primary_transformer_voltage: "12",
    tech_primary_transformer_unit: "VA",
    tech_secondary_transformer_voltage: "12",
    tech_secondary_transformer_unit: "V",
    tech_primary_winding: "50",
    tech_secondary_winding: "50",
    tech_primary_current: "50",
    tech_secondary_current: "50",
    tech_kva: "50",
    tech_volts: "50",
    tech_amperes: "50",
    tech_eddy_current: "50",
    tech_thickness: "50",
    tech_flux_density: "50",
    tech_frequency: "50",
    tech_hysteresis_constant: "50",
    tech_number_of_turns: "50",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTransformerCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_phase_unit) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_phase_unit: formData.tech_phase_unit,
        tech_transformer_rating: formData.tech_transformer_rating,
        tech_transformer_rating_unit: formData.tech_transformer_rating_unit,
        tech_calculation_unit: formData.tech_calculation_unit,
        tech_location: formData.tech_location,
        tech_impedance: formData.tech_impedance,
        tech_primary_transformer_voltage:
          formData.tech_primary_transformer_voltage,
        tech_primary_transformer_unit: formData.tech_primary_transformer_unit,
        tech_secondary_transformer_voltage:
          formData.tech_secondary_transformer_voltage,
        tech_secondary_transformer_unit:
          formData.tech_secondary_transformer_unit,
        tech_primary_winding: formData.tech_primary_winding,
        tech_secondary_winding: formData.tech_secondary_winding,
        tech_primary_current: formData.tech_primary_current,
        tech_secondary_current: formData.tech_secondary_current,
        tech_kva: formData.tech_kva,
        tech_volts: formData.tech_volts,
        tech_amperes: formData.tech_amperes,
        tech_eddy_current: formData.tech_eddy_current,
        tech_thickness: formData.tech_thickness,
        tech_flux_density: formData.tech_flux_density,
        tech_frequency: formData.tech_frequency,
        tech_hysteresis_constant: formData.tech_hysteresis_constant,
        tech_number_of_turns: formData.tech_number_of_turns,
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
      tech_phase_unit: "1", //   1 2 3 4 5 6 7 8 9 10 11 12 13 14
      tech_transformer_rating: "12",
      tech_transformer_rating_unit: "VA",
      tech_calculation_unit: "1",
      tech_location: "1",
      tech_impedance: "50",
      tech_primary_transformer_voltage: "12",
      tech_primary_transformer_unit: "VA",
      tech_secondary_transformer_voltage: "12",
      tech_secondary_transformer_unit: "V",
      tech_primary_winding: "50",
      tech_secondary_winding: "50",
      tech_primary_current: "50",
      tech_secondary_current: "50",
      tech_kva: "50",
      tech_volts: "50",
      tech_amperes: "50",
      tech_eddy_current: "50",
      tech_thickness: "50",
      tech_flux_density: "50",
      tech_frequency: "50",
      tech_hysteresis_constant: "50",
      tech_number_of_turns: "50",
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
    setFormData((prev) => ({ ...prev, tech_transformer_rating_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_primary_transformer_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_secondary_transformer_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12  mt-3 gap-1  md:gap-4">
              {(formData.tech_calculation_unit == "9" ||
                formData.tech_calculation_unit == "10" ||
                formData.tech_calculation_unit == "11" ||
                formData.tech_calculation_unit == "12") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  transformer_phase ">
                    <label htmlFor="tech_phase_unit" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
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
                        <option value="1">
                          {data?.payload?.tech_lang_keys["2"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["3"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculation_unit == "9" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  transformer_rating ">
                    <label htmlFor="tech_transformer_rating" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_transformer_rating"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_transformer_rating}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_transformer_rating_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "VA", value: "VA" },
                            { label: "kVA", value: "kVA" },
                            { label: "lb", value: "lb" },
                            { label: "MVA", value: "MVA" },
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

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_calculation_unit" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calculation_unit"
                    id="tech_calculation_unit"
                    value={formData.tech_calculation_unit}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys[6]} &{" "}
                      {data?.payload?.tech_lang_keys[7]} (
                      {data?.payload?.tech_lang_keys[8]})
                    </option>
                    <option value="2">
                      {" "}
                      {data?.payload?.tech_lang_keys[9]} &{" "}
                      {data?.payload?.tech_lang_keys[7]} (
                      {data?.payload?.tech_lang_keys[8]})
                    </option>
                    <option value="3">
                      {" "}
                      {data?.payload?.tech_lang_keys[10]} &{" "}
                      {data?.payload?.tech_lang_keys[11]} (
                      {data?.payload?.tech_lang_keys[8]})
                    </option>
                    <option value="4">
                      {" "}
                      {data?.payload?.tech_lang_keys[12]} &{" "}
                      {data?.payload?.tech_lang_keys[11]} (
                      {data?.payload?.tech_lang_keys[8]})
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys[13]} &{" "}
                      {data?.payload?.tech_lang_keys[7]} (
                      {data?.payload?.tech_lang_keys[8]})
                    </option>
                    <option value="6">
                      {" "}
                      {data?.payload?.tech_lang_keys[14]} &{" "}
                      {data?.payload?.tech_lang_keys[7]} (
                      {data?.payload?.tech_lang_keys[8]})
                    </option>
                    <option value="7">
                      {" "}
                      {data?.payload?.tech_lang_keys[15]} &{" "}
                      {data?.payload?.tech_lang_keys[16]} (
                      {data?.payload?.tech_lang_keys[8]})
                    </option>
                    <option value="8">
                      {" "}
                      {data?.payload?.tech_lang_keys[15]} &{" "}
                      {data?.payload?.tech_lang_keys[17]} (
                      {data?.payload?.tech_lang_keys[8]})
                    </option>
                    <option value="9">
                      {" "}
                      {data?.payload?.tech_lang_keys[18]} &{" "}
                      {data?.payload?.tech_lang_keys[11]} (
                      {data?.payload?.tech_lang_keys[8]})
                    </option>
                    <option value="10">
                      {" "}
                      KVA & {data?.payload?.tech_lang_keys[19]}
                    </option>
                    <option value="11">
                      {" "}
                      {data?.payload?.tech_lang_keys[19]} &{" "}
                      {data?.payload?.tech_lang_keys[20]}
                    </option>
                    <option value="12">
                      {" "}
                      KVA & {data?.payload?.tech_lang_keys[20]}{" "}
                    </option>
                    <option value="13">
                      {" "}
                      {data?.payload?.tech_lang_keys[21]}{" "}
                    </option>
                    <option value="14">
                      {" "}
                      {data?.payload?.tech_lang_keys[22]} &{" "}
                      {data?.payload?.tech_lang_keys[23]} (
                      {data?.payload?.tech_lang_keys[24]})
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_calculation_unit == "9" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  location ">
                    <label htmlFor="tech_location" className="label">
                      {data?.payload?.tech_lang_keys["25"]}/
                      {data?.payload?.tech_lang_keys["26"]}
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_location"
                        id="tech_location"
                        value={formData.tech_location}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {" "}
                          {data?.payload?.tech_lang_keys[25]}{" "}
                        </option>
                        <option value="2">
                          {" "}
                          {data?.payload?.tech_lang_keys[27]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculation_unit == "9" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  impedance ">
                    <label htmlFor="tech_impedance" className="label">
                      % {data?.payload?.tech_lang_keys["28"]}{" "}
                      {data?.payload?.tech_lang_keys["28"]} %{" "}
                      {data?.payload?.tech_lang_keys["30"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_impedance"
                        id="tech_impedance"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_impedance}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {(formData.tech_calculation_unit == "1" ||
                formData.tech_calculation_unit == "3" ||
                formData.tech_calculation_unit == "4" ||
                formData.tech_calculation_unit == "9") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  mt-0 mt-lg-2 primary_voltage">
                    <label
                      htmlFor="tech_primary_transformer_voltage"
                      className="label"
                    >
                      {data?.payload?.tech_lang_keys["31"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_primary_transformer_voltage"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_primary_transformer_voltage}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_primary_transformer_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "VA", value: "VA" },
                            { label: "kVA", value: "kVA" },
                            { label: "lb", value: "lb" },
                            { label: "MVA", value: "MVA" },
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
              {(formData.tech_calculation_unit == "1" ||
                formData.tech_calculation_unit == "3" ||
                formData.tech_calculation_unit == "4" ||
                formData.tech_calculation_unit == "9") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  mt-0 mt-lg-2 primary_voltage">
                    <label
                      htmlFor="tech_secondary_transformer_voltage"
                      className="label"
                    >
                      {data?.payload?.tech_lang_keys["11"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_secondary_transformer_voltage"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_secondary_transformer_voltage}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_secondary_transformer_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "V", value: "V" },
                            { label: "kV", value: "kV" },
                            { label: "MV", value: "MV" },
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
              {(formData.tech_calculation_unit == "1" ||
                formData.tech_calculation_unit == "2" ||
                formData.tech_calculation_unit == "3" ||
                formData.tech_calculation_unit == "5" ||
                formData.tech_calculation_unit == "6" ||
                formData.tech_calculation_unit == "7" ||
                formData.tech_calculation_unit == "13") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  primary_winding">
                    <label htmlFor="tech_primary_winding" className="label">
                      {data?.payload?.tech_lang_keys["32"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_primary_winding"
                        id="tech_primary_winding"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_primary_winding}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculation_unit == "1" ||
                formData.tech_calculation_unit == "2" ||
                formData.tech_calculation_unit == "4" ||
                formData.tech_calculation_unit == "5" ||
                formData.tech_calculation_unit == "6" ||
                formData.tech_calculation_unit == "8" ||
                formData.tech_calculation_unit == "13") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  secondary_winding">
                    <label htmlFor="tech_secondary_winding" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_secondary_winding"
                        id="tech_secondary_winding"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_secondary_winding}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {(formData.tech_calculation_unit == "5" ||
                formData.tech_calculation_unit == "6" ||
                formData.tech_calculation_unit == "7" ||
                formData.tech_calculation_unit == "8" ||
                formData.tech_calculation_unit == "9") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  primary_current ">
                    <label htmlFor="tech_primary_current" className="label">
                      {data?.payload?.tech_lang_keys["33"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_primary_current"
                        id="tech_primary_current"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_primary_current}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculation_unit == "1" ||
                formData.tech_calculation_unit == "2" ||
                formData.tech_calculation_unit == "3" ||
                formData.tech_calculation_unit == "4" ||
                formData.tech_calculation_unit == "5" ||
                formData.tech_calculation_unit == "6" ||
                formData.tech_calculation_unit == "7" ||
                formData.tech_calculation_unit == "8" ||
                formData.tech_calculation_unit == "9") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  secondary_curren t">
                    <label htmlFor="tech_secondary_current" className="label">
                      {data?.payload?.tech_lang_keys["34"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_secondary_current"
                        id="tech_secondary_current"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_secondary_current}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculation_unit == "10" ||
                formData.tech_calculation_unit == "12") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  kva ">
                    <label htmlFor="tech_kva" className="label">
                      KVA:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_kva"
                        id="tech_kva"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_kva}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculation_unit == "10" ||
                formData.tech_calculation_unit == "11") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  volts ">
                    <label htmlFor="tech_volts" className="label">
                      {data?.payload?.tech_lang_keys["19"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_volts"
                        id="tech_volts"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_volts}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculation_unit == "11" ||
                formData.tech_calculation_unit == "12") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  amperes ">
                    <label htmlFor="tech_amperes" className="label">
                      {data?.payload?.tech_lang_keys["20"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_amperes"
                        id="tech_amperes"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_amperes}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculation_unit == "11" ||
                formData.tech_calculation_unit == "13") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  eddy_current ">
                    <label htmlFor="tech_eddy_current" className="label">
                      {data?.payload?.tech_lang_keys["35"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_eddy_current"
                        id="tech_eddy_current"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_eddy_current}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculation_unit == "11" ||
                formData.tech_calculation_unit == "13") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  thickness ">
                    <label htmlFor="tech_thickness" className="label">
                      {data?.payload?.tech_lang_keys["35"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_thickness"
                        id="tech_thickness"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_thickness}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculation_unit == "11" ||
                formData.tech_calculation_unit == "13" ||
                formData.tech_calculation_unit == "14") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  flux ">
                    <label htmlFor="tech_flux_density" className="label">
                      {data?.payload?.tech_lang_keys["22"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_flux_density"
                        id="tech_flux_density"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_flux_density}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculation_unit == "11" ||
                formData.tech_calculation_unit == "13" ||
                formData.tech_calculation_unit == "14") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  frequency ">
                    <label htmlFor="tech_frequency" className="label">
                      {data?.payload?.tech_lang_keys["23"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_frequency"
                        id="tech_frequency"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_frequency}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculation_unit == "11" ||
                formData.tech_calculation_unit == "13") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  hysteresis_constant ">
                    <label htmlFor="tech_hysteresis_constant" className="label">
                      {data?.payload?.tech_lang_keys["37"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_hysteresis_constant"
                        id="tech_hysteresis_constant"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_hysteresis_constant}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculation_unit == "11" ||
                formData.tech_calculation_unit == "13" ||
                formData.tech_calculation_unit == "14") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  number_of_turns ">
                    <label htmlFor="tech_number_of_turns" className="label">
                      {data?.payload?.tech_lang_keys["24"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_number_of_turns"
                        id="tech_number_of_turns"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_number_of_turns}
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
                      <div className="w-full md:w-[90%] lg:w-[70%]  mt-2">
                        <table className="w-full text-[16px] md:text-[18px]">
                          <tbody>
                            {result?.tech_primary_full_load_current && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[38]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_primary_full_load_current} (A)
                                </td>
                              </tr>
                            )}

                            {result?.tech_secondary_full_load_current && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[39]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_secondary_full_load_current} (A)
                                </td>
                              </tr>
                            )}

                            {result?.tech_turn_ratio && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[40]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_turn_ratio}
                                </td>
                              </tr>
                            )}

                            {result?.tech_type && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[41]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_type}
                                </td>
                              </tr>
                            )}

                            {result?.tech_impedance_value && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[42]} (kA){" "}
                                    {data?.payload?.tech_lang_keys[43]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_impedance_value}
                                </td>
                              </tr>
                            )}

                            {result?.tech_calculate_amps >= 0 && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[20]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_calculate_amps}
                                </td>
                              </tr>
                            )}

                            {result?.tech_calculate_kva && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>KVA</strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_calculate_kva}
                                </td>
                              </tr>
                            )}

                            {result?.tech_calculate_volts && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[19]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_calculate_volts}
                                </td>
                              </tr>
                            )}

                            {result?.tech_secondary_voltage && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[11]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_secondary_voltage} (
                                  {data?.payload?.tech_lang_keys[19]})
                                </td>
                              </tr>
                            )}

                            {result?.tech_primary_voltage && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[31]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_primary_voltage} (
                                  {data?.payload?.tech_lang_keys[19]})
                                </td>
                              </tr>
                            )}

                            {result?.tech_secondary && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[7]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_secondary_winding} (
                                  {data?.payload?.tech_lang_keys[19]})
                                </td>
                              </tr>
                            )}

                            {result?.tech_secondary_current && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[34]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_secondary_current} (
                                  {data?.payload?.tech_lang_keys[20]})
                                </td>
                              </tr>
                            )}

                            {result?.tech_primary_current && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[33]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_primary_current} (
                                  {data?.payload?.tech_lang_keys[20]})
                                </td>
                              </tr>
                            )}

                            {result?.tech_secondary_winding && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[7]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_secondary_winding}
                                </td>
                              </tr>
                            )}

                            {result?.tech_primary_winding && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[32]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_primary_winding}
                                </td>
                              </tr>
                            )}

                            {result?.tech_total_copper && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[44]} ,Pcu
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_total_copper}
                                </td>
                              </tr>
                            )}

                            {result?.tech_eddy_current_loss && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[45]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_eddy_current_loss}
                                </td>
                              </tr>
                            )}

                            {result?.tech_hysteresis_loss && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[46]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_hysteresis_loss}
                                </td>
                              </tr>
                            )}

                            {result?.tech_eddy_current_loss &&
                              result?.tech_hysteresis_loss && (
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[47]} w/m3
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_hysteresis_loss}+
                                    {result?.tech_eddy_current_loss}
                                  </td>
                                </tr>
                              )}

                            {result?.tech_rms && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    R.M.S {data?.payload?.tech_lang_keys[48]}{" "}
                                    EMF
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_rms}
                                </td>
                              </tr>
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

export default TransformerCalculator;

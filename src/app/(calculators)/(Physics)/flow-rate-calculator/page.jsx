"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useFlowRateCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FlowRateCalculator = () => {
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
    tech_conversion_type: "1", //  1 2 3
    tech_choice_unit: "cp", // cp cpf rec trap other
    tech_volume: "12",
    tech_volume_unit: "fluid-ounce",
    tech_time: "12",
    tech_time_unit: "second",
    tech_diameter: "12",
    tech_diameter_unit: "cm",
    tech_velocity: "12",
    tech_velocity_unit: "ms",
    tech_density: "12",
    tech_density_unit: "cm",
    tech_filled: "12",
    tech_filled_unit: "cm",
    tech_height: "12",
    tech_height_unit: "cm",
    tech_width: "12",
    tech_width_unit: "cm²",
    tech_cross: "12",
    tech_cross_unit: "cm²",
    tech_top_width: "12",
    tech_top_width_unit: "cm",
    tech_bottom_width: "2",
    tech_bottom_width_unit: "cm",
    tech_pressure_start: "2",
    tech_pressure_start_unit: "Pa",
    tech_pressure_end: "45",
    tech_pressure_end_unit: "Pa",
    tech_pipe_length: "45",
    tech_pipe_length_unit: "cm",
    tech_dynamic_viscosity: "45",
    tech_dynamic_viscosity_unit: "kgms",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFlowRateCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_conversion_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_conversion_type: formData.tech_conversion_type,
        tech_choice_unit: formData.tech_choice_unit,
        tech_volume: formData.tech_volume,
        tech_volume_unit: formData.tech_volume_unit,
        tech_time: formData.tech_time,
        tech_time_unit: formData.tech_time_unit,
        tech_diameter: formData.tech_diameter,
        tech_diameter_unit: formData.tech_diameter_unit,
        tech_velocity: formData.tech_velocity,
        tech_velocity_unit: formData.tech_velocity_unit,
        tech_density: formData.tech_density,
        tech_density_unit: formData.tech_density_unit,
        tech_filled: formData.tech_filled,
        tech_filled_unit: formData.tech_filled_unit,
        tech_height: formData.tech_height,
        tech_height_unit: formData.tech_height_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_cross: formData.tech_cross,
        tech_cross_unit: formData.tech_cross_unit,
        tech_top_width: formData.tech_top_width,
        tech_top_width_unit: formData.tech_top_width_unit,
        tech_bottom_width: formData.tech_bottom_width,
        tech_bottom_width_unit: formData.tech_bottom_width_unit,
        tech_pressure_start: formData.tech_pressure_start,
        tech_pressure_start_unit: formData.tech_pressure_start_unit,
        tech_pressure_end: formData.tech_pressure_end,
        tech_pressure_end_unit: formData.tech_pressure_end_unit,
        tech_pipe_length: formData.tech_pipe_length,
        tech_pipe_length_unit: formData.tech_pipe_length_unit,
        tech_dynamic_viscosity: formData.tech_dynamic_viscosity,
        tech_dynamic_viscosity_unit: formData.tech_dynamic_viscosity_unit,
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
      tech_conversion_type: "1", //  1 2 3
      tech_choice_unit: "cp", // cp cpf rec trap other
      tech_volume: "12",
      tech_volume_unit: "fluid-ounce",
      tech_time: "12",
      tech_time_unit: "second",
      tech_diameter: "12",
      tech_diameter_unit: "cm",
      tech_velocity: "12",
      tech_velocity_unit: "ms",
      tech_density: "12",
      tech_density_unit: "cm",
      tech_filled: "12",
      tech_filled_unit: "cm",
      tech_height: "12",
      tech_height_unit: "cm",
      tech_width: "12",
      tech_width_unit: "cm²",
      tech_cross: "12",
      tech_cross_unit: "cm²",
      tech_top_width: "12",
      tech_top_width_unit: "cm",
      tech_bottom_width: "2",
      tech_bottom_width_unit: "cm",
      tech_pressure_start: "2",
      tech_pressure_start_unit: "Pa",
      tech_pressure_end: "45",
      tech_pressure_end_unit: "Pa",
      tech_pipe_length: "45",
      tech_pipe_length_unit: "cm",
      tech_dynamic_viscosity: "45",
      tech_dynamic_viscosity_unit: "kgms",
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
    setFormData((prev) => ({ ...prev, tech_volume_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_time_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_diameter_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_velocity_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_density_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_filled_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_height_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_width_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cross_unit: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };

  //dropdown states
  const [dropdownVisible9, setDropdownVisible9] = useState(false);

  const setUnitHandler9 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_top_width_unit: unit }));
    setDropdownVisible9(false);
  };

  const toggleDropdown9 = () => {
    setDropdownVisible9(!dropdownVisible9);
  };

  //dropdown states
  const [dropdownVisible10, setDropdownVisible10] = useState(false);

  const setUnitHandler10 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_bottom_width_unit: unit }));
    setDropdownVisible10(false);
  };

  const toggleDropdown10 = () => {
    setDropdownVisible10(!dropdownVisible10);
  };

  //dropdown states
  const [dropdownVisible11, setDropdownVisible11] = useState(false);

  const setUnitHandler11 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pressure_start_unit: unit }));
    setDropdownVisible11(false);
  };

  const toggleDropdown11 = () => {
    setDropdownVisible11(!dropdownVisible11);
  };

  //dropdown states
  const [dropdownVisible12, setDropdownVisible12] = useState(false);

  const setUnitHandler12 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pressure_end_unit: unit }));
    setDropdownVisible12(false);
  };

  const toggleDropdown12 = () => {
    setDropdownVisible12(!dropdownVisible12);
  };

  //dropdown states
  const [dropdownVisible13, setDropdownVisible13] = useState(false);

  const setUnitHandler13 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pipe_length_unit: unit }));
    setDropdownVisible13(false);
  };

  const toggleDropdown13 = () => {
    setDropdownVisible13(!dropdownVisible13);
  };

  //dropdown states
  const [dropdownVisible14, setDropdownVisible14] = useState(false);

  const setUnitHandler14 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dynamic_viscosity_unit: unit }));
    setDropdownVisible14(false);
  };

  const toggleDropdown14 = () => {
    setDropdownVisible14(!dropdownVisible14);
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="md:col-span-6 col-span-12">
                <label htmlFor="tech_conversion_type" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_conversion_type"
                    id="tech_conversion_type"
                    value={formData.tech_conversion_type}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-6 col-span-12">
                <label htmlFor="tech_choice_unit" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_choice_unit"
                    id="tech_choice_unit"
                    value={formData.tech_choice_unit}
                    onChange={handleChange}
                  >
                    <option value="cp">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="cpf">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="rec">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="trap">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="other">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 flex justify-center">
                <div className="ch">
                  {formData.tech_conversion_type == "1" && (
                    <>
                      {formData.tech_choice_unit == "cp" && (
                        <>
                          <img
                            src="/images/circular.png?v=1"
                            alt="Flow Rate Calculator"
                            width="180"
                            height="180"
                            className="change_img"
                          />
                        </>
                      )}
                      {formData.tech_choice_unit == "cpf" && (
                        <>
                          <img
                            src="/images/circular_partial.png?v=1"
                            alt="Flow Rate Calculator"
                            width="180"
                            height="180"
                            className="change_img"
                          />
                        </>
                      )}
                      {formData.tech_choice_unit == "rec" && (
                        <>
                          <img
                            src="/images/recta.png?v=1"
                            alt="Flow Rate Calculator"
                            width="180"
                            height="180"
                            className="change_img"
                          />
                        </>
                      )}
                      {formData.tech_choice_unit == "trap" && (
                        <>
                          <img
                            src="/images/recta.png?v=1"
                            alt="Flow Rate Calculator"
                            width="180"
                            height="180"
                            className="change_img"
                          />
                        </>
                      )}
                      {formData.tech_choice_unit == "other" && (
                        <>
                          <img
                            src="/images/oth.png?v=1"
                            alt="Flow Rate Calculator"
                            width="180"
                            height="180"
                            className="change_img"
                          />
                        </>
                      )}
                    </>
                  )}
                  {formData.tech_conversion_type == "2" && (
                    <>
                      {formData.tech_choice_unit == "cp" && (
                        <>
                          <img
                            src="/images/circular.png?v=1"
                            alt="Flow Rate Calculator"
                            width="180"
                            height="180"
                            className="change_img"
                          />
                        </>
                      )}
                      {formData.tech_choice_unit == "cpf" && (
                        <>
                          <img
                            src="/images/circular_partial.png?v=1"
                            alt="Flow Rate Calculator"
                            width="180"
                            height="180"
                            className="change_img"
                          />
                        </>
                      )}
                      {formData.tech_choice_unit == "rec" && (
                        <>
                          <img
                            src="/images/recta.png?v=1"
                            alt="Flow Rate Calculator"
                            width="180"
                            height="180"
                            className="change_img"
                          />
                        </>
                      )}
                      {formData.tech_choice_unit == "trap" && (
                        <>
                          <img
                            src="/images/recta.png?v=1"
                            alt="Flow Rate Calculator"
                            width="180"
                            height="180"
                            className="change_img"
                          />
                        </>
                      )}
                      {formData.tech_choice_unit == "other" && (
                        <>
                          <img
                            src="/images/oth.png?v=1"
                            alt="Flow Rate Calculator"
                            width="180"
                            height="180"
                            className="change_img"
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              {formData.tech_conversion_type == "3" && (
                <>
                  <div className="md:col-span-6 col-span-12 volume ">
                    <label htmlFor="tech_volume" className="label">
                      {data?.payload?.tech_lang_keys["11"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_volume"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_volume}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_volume_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            {
                              label: data?.payload?.tech_lang_keys["12"],
                              value: "fluid-ounce",
                            },
                            {
                              label: data?.payload?.tech_lang_keys["13"],
                              value: "quart",
                            },
                            {
                              label: data?.payload?.tech_lang_keys["14"],
                              value: "pint",
                            },
                            {
                              label: data?.payload?.tech_lang_keys["15"],
                              value: "gallon",
                            },
                            {
                              label: data?.payload?.tech_lang_keys["16"],
                              value: "milliliter",
                            },
                            {
                              label: data?.payload?.tech_lang_keys["17"],
                              value: "liter",
                            },
                            { label: "cu in", value: "cubic-inch" },
                            { label: "cu ft", value: "cubic-foot" },
                            { label: "cu cm", value: "cubic-centimeter" },
                            { label: "cu m", value: "cubic-meter" },
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

                  <div className="md:col-span-6 col-span-12 time ">
                    <label htmlFor="tech_time" className="label">
                      {data?.payload?.tech_lang_keys["18"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_time"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_time}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_time_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "sec", value: "second" },
                            { label: "min", value: "minute" },
                            { label: "hours", value: "hour" },
                            { label: "days", value: "day" },
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

              {((formData.tech_conversion_type == "1" &&
                formData.tech_choice_unit == "cp") ||
                (formData.tech_conversion_type == "1" &&
                  formData.tech_choice_unit == "cpf") ||
                (formData.tech_conversion_type == "1" &&
                  formData.tech_choice_unit == "trap") ||
                (formData.tech_conversion_type == "2" &&
                  formData.tech_choice_unit == "cp") ||
                (formData.tech_conversion_type == "2" &&
                  formData.tech_choice_unit == "cpf") ||
                (formData.tech_conversion_type == "2" &&
                  formData.tech_choice_unit == "trap") ||
                (formData.tech_conversion_type == "3" &&
                  formData.tech_choice_unit == "cp") ||
                (formData.tech_conversion_type == "3" &&
                  formData.tech_choice_unit == "cpf") ||
                (formData.tech_conversion_type == "3" &&
                  formData.tech_choice_unit == "trap")) && (
                <>
                  <div className="md:col-span-6 col-span-12 diameter">
                    <label htmlFor="tech_diameter" className="label">
                      {data?.payload?.tech_lang_keys["19"]} (d)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_diameter"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_diameter}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_diameter_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
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

              <div className="col-span-6 velocity">
                <label htmlFor="tech_velocity" className="label">
                  {data?.payload?.tech_lang_keys["20"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_velocity"
                    step="any"
                    min="1"
                    className="mt-1 input"
                    value={formData.tech_velocity}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_velocity_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "ms", value: "ms" },
                        { label: "fts", value: "fts" },
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

              {((formData.tech_conversion_type == "1" &&
                formData.tech_choice_unit == "cp") ||
                (formData.tech_conversion_type == "1" &&
                  formData.tech_choice_unit == "cpf") ||
                (formData.tech_conversion_type == "1" &&
                  formData.tech_choice_unit == "rec") ||
                (formData.tech_conversion_type == "1" &&
                  formData.tech_choice_unit == "other") ||
                (formData.tech_conversion_type == "2" &&
                  formData.tech_choice_unit == "cp") ||
                (formData.tech_conversion_type == "2" &&
                  formData.tech_choice_unit == "cpf") ||
                (formData.tech_conversion_type == "2" &&
                  formData.tech_choice_unit == "rec") ||
                (formData.tech_conversion_type == "2" &&
                  formData.tech_choice_unit == "other") ||
                (formData.tech_conversion_type == "3" &&
                  formData.tech_choice_unit == "cp") ||
                (formData.tech_conversion_type == "3" &&
                  formData.tech_choice_unit == "cpf") ||
                (formData.tech_conversion_type == "3" &&
                  formData.tech_choice_unit == "rec") ||
                (formData.tech_conversion_type == "3" &&
                  formData.tech_choice_unit == "other")) && (
                <>
                  <div className="col-span-6 density">
                    <label htmlFor="tech_density" className="label">
                      {data?.payload?.tech_lang_keys["21"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_density"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_density}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_density_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kg/m³", value: "kg" },
                            { label: "lb/cu ft", value: "lb1" },
                            { label: "lb/cu yd", value: "lb2" },
                            { label: "g/cm³", value: "g" },
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
              {((formData.tech_conversion_type == "1" &&
                formData.tech_choice_unit == "cpf") ||
                (formData.tech_conversion_type == "2" &&
                  formData.tech_choice_unit == "cpf") ||
                (formData.tech_conversion_type == "3" &&
                  formData.tech_choice_unit == "cpf")) && (
                <>
                  <div className="col-span-6 filled ">
                    <label htmlFor="tech_filled" className="label">
                      {data?.payload?.tech_lang_keys["22"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_filled"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_filled}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_filled_unit} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                            { label: "mm", value: "mm" },
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
              {((formData.tech_conversion_type == "1" &&
                formData.tech_choice_unit == "rec") ||
                (formData.tech_conversion_type == "2" &&
                  formData.tech_choice_unit == "rec") ||
                (formData.tech_conversion_type == "3" &&
                  formData.tech_choice_unit == "rec")) && (
                <>
                  <div className="col-span-6 height ">
                    <label htmlFor="tech_height" className="label">
                      {data?.payload?.tech_lang_keys["23"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_height}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown6}
                      >
                        {formData.tech_height_unit} ▾
                      </label>
                      {dropdownVisible6 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                            { label: "mm", value: "mm" },
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
              {((formData.tech_conversion_type == "1" &&
                formData.tech_choice_unit == "rec") ||
                (formData.tech_conversion_type == "2" &&
                  formData.tech_choice_unit == "rec") ||
                (formData.tech_conversion_type == "3" &&
                  formData.tech_choice_unit == "rec")) && (
                <>
                  <div className="col-span-6 width ">
                    <label htmlFor="tech_width" className="label">
                      {data?.payload?.tech_lang_keys["24"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_width"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_width}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown7}
                      >
                        {formData.tech_width_unit} ▾
                      </label>
                      {dropdownVisible7 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                            { label: "mm", value: "mm" },
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
              {((formData.tech_conversion_type == "1" &&
                formData.tech_choice_unit == "other") ||
                (formData.tech_conversion_type == "2" &&
                  formData.tech_choice_unit == "other") ||
                (formData.tech_conversion_type == "3" &&
                  formData.tech_choice_unit == "other")) && (
                <>
                  <div className="col-span-6 area ">
                    <label htmlFor="tech_cross" className="label">
                      {data?.payload?.tech_lang_keys["25"]} (A)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_cross"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_cross}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown8}
                      >
                        {formData.tech_cross_unit} ▾
                      </label>
                      {dropdownVisible8 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm²", value: "cm²" },
                            { label: "m²", value: "m²" },
                            { label: "in²", value: "in²" },
                            { label: "ft²", value: "ft²" },
                            { label: "yd²", value: "yd²" },
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
              {/* {((formData.tech_conversion_type == "1" && formData.tech_choice_unit == "cp" )) && (
                  <>
                  <div className="col-span-6 top_width ">

                      <label htmlFor="tech_top_width" className="label" >
                        { data?.payload?.tech_lang_keys["26"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_top_width"
                              step="any"
                              min="1"
                              className="mt-1 input"
                              value={formData.tech_top_width}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown9}
                            >
                              {formData.tech_top_width_unit} ▾
                            </label>
                            {dropdownVisible9 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                      { label: "cm", value: "cm" },
                                      { label: "m", value: "m" },
                                      { label: "in", value: "in" },
                                      { label: "ft", value: "ft" },
                                      { label: "yd", value: "yd" },
                                      { label: "mm", value: "mm" },
                                
                                ].map((unit, index) => (
                                  <p
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setUnitHandler9(unit.value)}
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
                 {((formData.tech_conversion_type == "1" && formData.tech_choice_unit == "cp" )) && (
                  <>
                <div className="col-span-6 bottom_width ">
                   <label htmlFor="tech_bottom_width" className="label" >
                      { data?.payload?.tech_lang_keys["27"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_bottom_width"
                            step="any"
                             min="1"
                            className="mt-1 input"
                            value={formData.tech_bottom_width}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown10}
                          >
                            {formData.tech_bottom_width_unit} ▾
                          </label>
                          {dropdownVisible10 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                    { label: "mm", value: "mm" },
                               
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler10(unit.value)}
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
                  {((formData.tech_conversion_type == "1" && formData.tech_choice_unit == "cp" )) && (
                  <>
                <div className="col-span-6 pressure_start ">
                   <label htmlFor="tech_pressure_start" className="label" >
                      { data?.payload?.tech_lang_keys["28"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_pressure_start"
                            step="any"
                             min="1"
                            className="mt-1 input"
                            value={formData.tech_pressure_start}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown11}
                          >
                            {formData.tech_pressure_start_unit} ▾
                          </label>
                          {dropdownVisible11 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                    { label: "Pa", value: "Pa" },
                                    { label: "kPa", value: "kPa" },
                                    { label: "MPa", value: "MPa" },
                                    { label: "GPa", value: "GPa" },
                                    { label: "mbar", value: "mbar" },
                                    { label: "bar", value: "bar" },
                                    { label: "atm", value: "atm" },
                                    { label: "mmHg", value: "mmHg" },
                                    { label: "mmH2O", value: "mmH2O" },
                                    { label: "psi", value: "psi" },
                               
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler11(unit.value)}
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
                   {((formData.tech_conversion_type == "1" && formData.tech_choice_unit == "cp" )) && (
                  <>
                <div className="col-span-6 pressure_end ">

                    <label htmlFor="tech_pressure_end" className="label" >
                      { data?.payload?.tech_lang_keys["29"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_pressure_end"
                            step="any"
                             min="1"
                            className="mt-1 input"
                            value={formData.tech_pressure_end}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown12}
                          >
                            {formData.tech_pressure_end_unit} ▾
                          </label>
                          {dropdownVisible12 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                    { label: "Pa", value: "Pa" },
                                    { label: "kPa", value: "kPa" },
                                    { label: "MPa", value: "MPa" },
                                    { label: "GPa", value: "GPa" },
                                    { label: "mbar", value: "mbar" },
                                    { label: "bar", value: "bar" },
                                    { label: "atm", value: "atm" },
                                    { label: "mmHg", value: "mmHg" },
                                    { label: "mmH2O", value: "mmH2O" },
                                    { label: "psi", value: "psi" },
                               
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler12(unit.value)}
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
                  {((formData.tech_conversion_type == "1" && formData.tech_choice_unit == "cp" )) && (
                  <>
                <div className="col-span-6 pipe_length ">

                    <label htmlFor="tech_pipe_length" className="label" >
                      { data?.payload?.tech_lang_keys["30"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_pipe_length"
                            step="any"
                             min="1"
                            className="mt-1 input"
                            value={formData.tech_pipe_length}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown13}
                          >
                            {formData.tech_pipe_length_unit} ▾
                          </label>
                          {dropdownVisible13 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                    { label: "mm", value: "mm" },
                               
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler13(unit.value)}
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
                  {((formData.tech_conversion_type == "1" && formData.tech_choice_unit == "cp" )) && (
                  <>
                <div className="col-span-6 dynamic_viscosity ">
                   <label htmlFor="tech_dynamic_viscosity" className="label" >
                      { data?.payload?.tech_lang_keys["31"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_dynamic_viscosity"
                            step="any"
                             min="1"
                            className="mt-1 input"
                            value={formData.tech_dynamic_viscosity}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown14}
                          >
                            {formData.tech_dynamic_viscosity_unit} ▾
                          </label>
                          {dropdownVisible14 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                    { label: "kg/m·s", value: "kgms" },
                                    { label: "N·s/m2", value: "nsm2" },
                                    { label: "Pa·s", value: "pas" },
                                    { label: "cp", value: "cp" },
                               
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler14(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                            )}
                        </div>

                </div>
                  
                  </>
                )} */}
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

                  <div className="flex justify-center">
                    <div className="rounded-lg w-full mt-3 overflow-auto mt-2">
                      <table className="w-full text-[16px]">
                        <tbody>
                          <tr>
                            <td className="py-2 border-b" width="40%">
                              <strong>
                                {data?.payload?.tech_lang_keys[32]}
                              </strong>
                            </td>
                            <td className="py-2 border-b">
                              {result?.tech_volumetric_flow_rate} (m³/s)
                            </td>
                          </tr>
                          {result?.tech_mass_flow_rate && (
                            <>
                              <tr>
                                <td className="py-2 border-b" width="40%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[33]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_mass_flow_rate} (kg/s)
                                </td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>

                      <table className="w-full text-[16px] mt-4">
                        <tbody>
                          <tr>
                            <td className="py-2 border-b">
                              {data?.payload?.tech_lang_keys["32"]} (ft
                              <sup>3</sup>)
                            </td>
                            <td className="py-2 border-b">
                              <strong>
                                {result?.tech_volumetric_flow_rate * 35.3147} ft
                                <sup>3</sup>/h (
                                {result?.tech_volumetric_flow_rate * 127133} ft
                                <sup>3</sup>/s )
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 border-b">
                              {data?.payload?.tech_lang_keys["32"]} (yd
                              <sup>3</sup>)
                            </td>
                            <td className="py-2 border-b">
                              <strong>
                                {result?.tech_volumetric_flow_rate *
                                  4708.622229}{" "}
                                yd<sup>3</sup>/h (
                                {result?.tech_volumetric_flow_rate *
                                  1.3079506193144}{" "}
                                yd<sup>3</sup>/s )
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 border-b">
                              {data?.payload?.tech_lang_keys["32"]} (
                              {data?.payload?.tech_lang_keys["15"]})
                            </td>
                            <td className="py-2 border-b">
                              <strong>
                                {result?.tech_volumetric_flow_rate *
                                  951019.38848933}{" "}
                                gal/h (
                                {result?.tech_volumetric_flow_rate * 15850.323}{" "}
                                gal/min )
                              </strong>
                            </td>
                          </tr>
                          {result?.tech_mass_flow_rate && (
                            <>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["33"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_mass_flow_rate * 7937} lb/h (
                                    {result?.tech_mass_flow_rate * 132.28}{" "}
                                    lb/min )
                                  </strong>
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

export default FlowRateCalculator;

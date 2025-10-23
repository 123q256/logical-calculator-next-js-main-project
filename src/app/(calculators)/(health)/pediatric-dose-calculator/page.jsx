"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePediatricDoseCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PediatricDoseCalculator = () => {
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
    tech_type: "fourth", // first  second  third  fourth
    tech_dose: 10,
    tech_dose_unit: "mg/kg",
    tech_dose_unit2: "mg/m²",
    tech_dose_unit3: "mg/day",
    tech_weight: 120,
    tech_weight_unit: "kg",
    tech_bsa: 13,
    tech_child_age: 13,
    tech_mass: 120,
    tech_mass_unit: "mg",
    tech_per: 5,
    tech_per_unit: "ml",
    tech_dose_frequency: "qD",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePediatricDoseCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type || !formData.tech_dose) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_dose: formData.tech_dose,
        tech_dose_unit: formData.tech_dose_unit,
        tech_dose_unit2: formData.tech_dose_unit2,
        tech_dose_unit3: formData.tech_dose_unit3,
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
        tech_bsa: formData.tech_bsa,
        tech_child_age: formData.tech_child_age,
        tech_mass: formData.tech_mass,
        tech_mass_unit: formData.tech_mass_unit,
        tech_per: formData.tech_per,
        tech_per_unit: formData.tech_per_unit,
        tech_dose_frequency: formData.tech_dose_frequency,
        tech_y: formData.tech_y,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_type: "fourth", // first  second  third  fourth
      tech_dose: 10,
      tech_dose_unit: "mg/kg",
      tech_dose_unit2: "mg/m²",
      tech_dose_unit3: "mg/day",
      tech_weight: 120,
      tech_weight_unit: "kg",
      tech_bsa: 13,
      tech_child_age: 13,
      tech_mass: 120,
      tech_mass_unit: "mg",
      tech_per: 5,
      tech_per_unit: "ml",
      tech_dose_frequency: "qD",
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
    setFormData((prev) => ({ ...prev, tech_dose_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dose_unit2: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dose_unit3: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_mass_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_per_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="col-12 col-lg-9 mx-auto mt-2 lg:w-[90%] md:w-[90%] w-full  ">
            <input
              type="hidden"
              name="tech_type"
              id="calculator_time"
              value={formData.tech_type}
            />
            <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
              {/* Date Cal Tab */}
              <div className="lg:w-1/4 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                    formData.tech_type === "first" ? "tagsUnit" : ""
                  }`}
                  id="first"
                  onClick={() => {
                    setFormData({ ...formData, tech_type: "first" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["1"]}
                </div>
              </div>
              {/* Time Cal Tab */}
              <div className="lg:w-1/4 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_type === "second" ? "tagsUnit" : ""
                  }`}
                  id="second"
                  onClick={() => {
                    setFormData({ ...formData, tech_type: "second" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["2"]}
                </div>
              </div>
              {/* Time Cal Tab */}
              <div className="lg:w-1/4 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_type === "third" ? "tagsUnit" : ""
                  }`}
                  id="third"
                  onClick={() => {
                    setFormData({ ...formData, tech_type: "third" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["3"]}
                </div>
              </div>
              {/* Time Cal Tab */}
              <div className="lg:w-1/4 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_type === "fourth" ? "tagsUnit" : ""
                  }`}
                  id="fourth"
                  onClick={() => {
                    setFormData({ ...formData, tech_type: "fourth" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["4"]}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              {formData?.tech_type == "first" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_dose" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_dose"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_dose}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_dose_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mg/kg", value: "mg/kg" },
                            { label: "mg/kg/day", value: "mg/kg/day" },
                            { label: "mg/kg/dose", value: "mg/kg/dose" },
                            { label: "mcg/kg", value: "mcg/kg" },
                            { label: "mcg/kg/day", value: "mcg/kg/day" },
                            { label: "mcg/kg/dose", value: "mcg/kg/dose" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 weight">
                    <label htmlFor="tech_weight" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_weight"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_weight}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_weight_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "pounds (lbs)", value: "lbs" },
                            { label: "grams (kg)", value: "g" },
                            { label: "decagrams (dag)", value: "dag" },
                            { label: "ounces (oz)", value: "oz" },
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
              {formData?.tech_type == "second" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_dose" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_dose"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_dose}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_dose_unit2} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mg/m²", value: "mg/m²" },
                            { label: "mg/day", value: "mg/day" },
                            { label: "mg/dose", value: "mg/dose" },
                            { label: "mcg/m²", value: "mcg/m²" },
                            { label: "mcg/day", value: "mcg/day" },
                            { label: "mcg/dose", value: "mcg/dose" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 bsa ">
                    <label htmlFor="tech_bsa" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_bsa"
                        id="tech_bsa"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_bsa}
                        onChange={handleChange}
                      />
                      <span className="input_unit">
                        <span className="roy">
                          m<sup>2</sup>
                        </span>
                      </span>
                    </div>
                  </div>
                </>
              )}
              {formData?.tech_type == "third" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_dose" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_dose"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_dose}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_dose_unit3} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mg/day", value: "mg/day" },
                            { label: "mg/dose", value: "mg/dose" },
                            { label: "mcg/day", value: "mcg/day" },
                            { label: "mcg/dose", value: "mcg/dose" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ch ">
                    <label htmlFor="tech_child_age" className="label">
                      {data?.payload?.tech_lang_keys["8"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_child_age"
                        id="tech_child_age"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_child_age}
                        onChange={handleChange}
                      />
                      <span className="input_unit">years</span>
                    </div>
                  </div>
                </>
              )}
              {formData?.tech_type == "fourth" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_dose" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_dose"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_dose}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_dose_unit3} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mg/day", value: "mg/day" },
                            { label: "mg/dose", value: "mg/dose" },
                            { label: "mcg/day", value: "mcg/day" },
                            { label: "mcg/dose", value: "mcg/dose" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 weight">
                    <label htmlFor="tech_weight" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_weight"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_weight}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_weight_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "pounds (lbs)", value: "lbs" },
                            { label: "grams (kg)", value: "g" },
                            { label: "decagrams (dag)", value: "dag" },
                            { label: "ounces (oz)", value: "oz" },
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

              <p className="col-span-12">
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys["12"]}
                </strong>
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 weight">
                <label htmlFor="tech_mass" className="label">
                  {data?.payload?.tech_lang_keys["9"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_mass"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_mass}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown4}
                  >
                    {formData.tech_mass_unit} ▾
                  </label>
                  {dropdownVisible4 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "millgrams (mg)", value: "mg" },
                        { label: "micrograms (µg)", value: "µg" },
                        { label: "grams (g)", value: "g" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 weight">
                <label htmlFor="tech_per" className="label">
                  {data?.payload?.tech_lang_keys["10"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_per"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_per}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown5}
                  >
                    {formData.tech_per_unit} ▾
                  </label>
                  {dropdownVisible5 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "milliliters (ml)", value: "ml" },
                        { label: "cubic milliliters (mm³)", value: "mm³" },
                        { label: "cubic centimeters (cm³)", value: "cm³" },
                        { label: "cubic inches (cu in)", value: "cu in" },
                        { label: "centiliters (cl)", value: "cl" },
                        { label: "cubic centimeters (cc)", value: "cc" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_dose_frequency" className="label">
                  {data?.payload?.tech_lang_keys["11"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_dose_frequency"
                    id="tech_dose_frequency"
                    value={formData.tech_dose_frequency}
                    onChange={handleChange}
                  >
                    <option value="qD">qD</option>
                    <option value="BID">BID</option>
                    <option value="TID">TID</option>
                    <option value="QID">QID</option>
                    <option value="q8 hr">q8 hr</option>
                    <option value="q6 hr">q6 hr</option>
                    <option value="q4 hr">q4 hr</option>
                    <option value="q3 hr">q3 hr</option>
                    <option value="q2 hr">q2 hr</option>
                    <option value="q1 hr">q1 hr</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
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
                      <div className="col-12">
                        <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                          <div className="col-span-12 md:col-span-12 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg px-3 py-2 lg:text-[16px] md:text-[16px] text-[14px]">
                              <p className="">
                                {data?.payload?.tech_lang_keys["13"]} =
                                <strong>
                                  <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                    {" "}
                                    {Number(result?.tech_main_answer1).toFixed(
                                      2
                                    )}
                                  </span>
                                  <span className="text-[#119154]">
                                    {" "}
                                    (mg/day){" "}
                                  </span>
                                </strong>
                              </p>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-12 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg px-3 py-2 lg:text-[16px] md:text-[16px] text-[14px]">
                              <p className="">
                                {data?.payload?.tech_lang_keys["14"]} (
                                {result?.tech_dose_frequency}) =
                                <strong>
                                  <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                    {" "}
                                    {Number(result?.tech_ans1).toFixed(2)}
                                  </span>
                                  <span className="text-[#119154]">
                                    {" "}
                                    (mg/dose){" "}
                                  </span>
                                </strong>
                              </p>
                            </div>
                          </div>
                          <div className="col-span-12">
                            <strong>
                              {" "}
                              {data?.payload?.tech_lang_keys["15"]}{" "}
                              {result?.tech_mass} ({result?.tech_mass_unit}) /{" "}
                              {result?.tech_per} ({result?.tech_per_unit}) :
                            </strong>
                          </div>
                          <div className="col-span-12 md:col-span-12 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg px-3 py-2 lg:text-[16px] md:text-[16px] text-[14px]">
                              <p className="">
                                {data?.payload?.tech_lang_keys["13"]} =
                                <strong>
                                  <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                    {" "}
                                    {Number(
                                      result?.tech_main_answer1 /
                                        result?.tech_main_answer3
                                    ).toFixed(2)}
                                  </span>
                                  <span className="text-[#119154]">
                                    {" "}
                                    (mL/day){" "}
                                  </span>
                                </strong>
                              </p>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-12 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg px-3 py-2 lg:text-[16px] md:text-[16px] text-[14px]">
                              <p className="">
                                {data?.payload?.tech_lang_keys["14"]} (
                                {result?.tech_dose_frequency}) =
                                <strong>
                                  <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                    {" "}
                                    {Number(result?.tech_main_answer4).toFixed(
                                      2
                                    )}
                                  </span>
                                  <span className="text-[#119154]">
                                    {" "}
                                    (mL/dose){" "}
                                  </span>
                                </strong>
                              </p>
                            </div>
                          </div>
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

export default PediatricDoseCalculator;

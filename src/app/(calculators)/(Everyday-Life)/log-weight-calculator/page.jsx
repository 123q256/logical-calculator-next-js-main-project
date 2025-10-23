"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useLogWeightCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LogWeightCalculator = () => {
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
    tech_category: "board", // log board
    tech_woodSelector: "46@@@",
    tech_custom: 12,
    tech_custom_unit: "kg/m³",
    tech_small_end: 12,
    tech_small_unit: "cm",
    tech_length: 12,
    tech_length_unit: "cm",
    tech_large_end: 12,
    tech_large_unit: "cm",
    tech_stack_w: 12,
    tech_stackw_unit: "cm",
    tech_stack_h: 12,
    tech_stackh_unit: "cm",
    tech_submit: true,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLogWeightCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_category) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_category: formData.tech_category,
        tech_woodSelector: formData.tech_woodSelector,
        tech_custom: formData.tech_custom,
        tech_custom_unit: formData.tech_custom_unit,
        tech_small_end: formData.tech_small_end,
        tech_small_unit: formData.tech_small_unit,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_large_end: formData.tech_large_end,
        tech_large_unit: formData.tech_large_unit,
        tech_stack_w: formData.tech_stack_w,
        tech_stackw_unit: formData.tech_stackw_unit,
        tech_stack_h: formData.tech_stack_h,
        tech_stackh_unit: formData.tech_stackh_unit,
        tech_submit: formData.tech_submit,
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
      tech_category: "board", // log board
      tech_woodSelector: "46@@@",
      tech_custom: 12,
      tech_custom_unit: "kg/m³",
      tech_small_end: 12,
      tech_small_unit: "cm",
      tech_length: 12,
      tech_length_unit: "cm",
      tech_large_end: 12,
      tech_large_unit: "cm",
      tech_stack_w: 12,
      tech_stackw_unit: "cm",
      tech_stack_h: 12,
      tech_stackh_unit: "cm",
      tech_submit: true,
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
    setFormData((prev) => ({ ...prev, tech_custom_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_small_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_large_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_stackw_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_stackh_unit: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[70%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <div className="grid grid-cols-12  gap-4">
                  <div className="col-span-12">
                    <label htmlFor="tech_category" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_category"
                        id="tech_category"
                        value={formData.tech_category}
                        onChange={handleChange}
                      >
                        <option value="log">
                          {data?.payload?.tech_lang_keys["2"]}
                        </option>
                        <option value="board">
                          {data?.payload?.tech_lang_keys["3"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="tech_woodSelector" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_woodSelector"
                        id="tech_woodSelector"
                        value={formData.tech_woodSelector}
                        onChange={handleChange}
                      >
                        <option value="46@">
                          {data?.payload?.tech_lang_keys["5"]}
                        </option>
                        <option value="55@">
                          {data?.payload?.tech_lang_keys["6"]}
                        </option>
                        <option value="47@">
                          {data?.payload?.tech_lang_keys["7"]}
                        </option>
                        <option value="48@">
                          {data?.payload?.tech_lang_keys["8"]}
                        </option>
                        <option value="48@@">
                          {data?.payload?.tech_lang_keys["9"]}
                        </option>
                        <option value="43">
                          {data?.payload?.tech_lang_keys["10"]}
                        </option>
                        <option value="51@">
                          {data?.payload?.tech_lang_keys["11"]}
                        </option>
                        <option value="42">
                          {data?.payload?.tech_lang_keys["12"]}
                        </option>
                        <option value="54@">
                          {data?.payload?.tech_lang_keys["13"]}
                        </option>
                        <option value="50@@@@@@">
                          {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="57">
                          {data?.payload?.tech_lang_keys["15"]}
                        </option>
                        <option value="46@@">
                          {data?.payload?.tech_lang_keys["16"]}
                        </option>
                        <option value="45@">
                          {data?.payload?.tech_lang_keys["17"]}
                        </option>
                        <option value="28">
                          {data?.payload?.tech_lang_keys["18"]}
                        </option>
                        <option value="45@@">
                          {data?.payload?.tech_lang_keys["19"]}
                        </option>
                        <option value="55@@">
                          {data?.payload?.tech_lang_keys["20"]}
                        </option>
                        <option value="50@">
                          {data?.payload?.tech_lang_keys["21"]}
                        </option>
                        <option value="49@">
                          {data?.payload?.tech_lang_keys["22"]}
                        </option>
                        <option value="54@@">
                          {data?.payload?.tech_lang_keys["23"]}
                        </option>
                        <option value="39@">
                          {data?.payload?.tech_lang_keys["24"]}
                        </option>
                        <option value="29">
                          {data?.payload?.tech_lang_keys["25"]}
                        </option>
                        <option value="47@@">
                          {data?.payload?.tech_lang_keys["26"]}
                        </option>
                        <option value="45@@@">
                          {data?.payload?.tech_lang_keys["27"]}
                        </option>
                        <option value="50@@">
                          {data?.payload?.tech_lang_keys["28"]}
                        </option>
                        <option value="50@@@">
                          {data?.payload?.tech_lang_keys["29"]}
                        </option>
                        <option value="49@@">
                          {data?.payload?.tech_lang_keys["30"]}
                        </option>
                        <option value="41@">
                          {data?.payload?.tech_lang_keys["31"]}
                        </option>
                        <option value="64@">
                          {data?.payload?.tech_lang_keys["32"]}
                        </option>
                        <option value="63@">
                          {data?.payload?.tech_lang_keys["33"]}
                        </option>
                        <option value="41@@">
                          {data?.payload?.tech_lang_keys["34"]}
                        </option>
                        <option value="51@@">
                          {data?.payload?.tech_lang_keys["35"]}
                        </option>
                        <option value="58@">
                          {data?.payload?.tech_lang_keys["36"]}
                        </option>
                        <option value="61@">
                          {data?.payload?.tech_lang_keys["37"]}
                        </option>
                        <option value="59">
                          {data?.payload?.tech_lang_keys["38"]}
                        </option>
                        <option value="50@@@@">
                          {data?.payload?.tech_lang_keys["39"]}
                        </option>
                        <option value="45@@@@">
                          {data?.payload?.tech_lang_keys["40"]}
                        </option>
                        <option value="56">
                          {data?.payload?.tech_lang_keys["41"]}
                        </option>
                        <option value="62@">
                          {data?.payload?.tech_lang_keys["42"]}
                        </option>
                        <option value="66">
                          {data?.payload?.tech_lang_keys["43"]}
                        </option>
                        <option value="52@">
                          {data?.payload?.tech_lang_keys["44"]}
                        </option>
                        <option value="76">
                          {data?.payload?.tech_lang_keys["45"]}
                        </option>
                        <option value="64@@">
                          {data?.payload?.tech_lang_keys["46"]}
                        </option>
                        <option value="63@@">
                          {data?.payload?.tech_lang_keys["47"]}
                        </option>
                        <option value="63@@@">
                          {data?.payload?.tech_lang_keys["48"]}
                        </option>
                        <option value="64@@">
                          {data?.payload?.tech_lang_keys["49"]}
                        </option>
                        <option value="62@@">
                          {data?.payload?.tech_lang_keys["50"]}
                        </option>
                        <option value="62@@@">
                          {data?.payload?.tech_lang_keys["51"]}
                        </option>
                        <option value="61@@">
                          {data?.payload?.tech_lang_keys["52"]}
                        </option>
                        <option value="63@@@@">
                          {data?.payload?.tech_lang_keys["53"]}
                        </option>
                        <option value="53">
                          {data?.payload?.tech_lang_keys["54"]}
                        </option>
                        <option value="39@@">
                          {data?.payload?.tech_lang_keys["55"]}
                        </option>
                        <option value="55@@@">
                          {data?.payload?.tech_lang_keys["56"]}
                        </option>
                        <option value="46@@@">
                          {data?.payload?.tech_lang_keys["57"]}
                        </option>
                        <option value="58@@">
                          {data?.payload?.tech_lang_keys["58"]}
                        </option>
                        <option value="52@@">
                          {data?.payload?.tech_lang_keys["59"]}
                        </option>
                        <option value="36">
                          {data?.payload?.tech_lang_keys["60"]}
                        </option>
                        <option value="38">
                          {data?.payload?.tech_lang_keys["61"]}
                        </option>
                        <option value="50@@@@@">
                          {data?.payload?.tech_lang_keys["62"]}
                        </option>
                        <option value="44">
                          {data?.payload?.tech_lang_keys["63"]}
                        </option>
                        <option value="34">
                          {data?.payload?.tech_lang_keys["64"]}
                        </option>
                        <option value="32@">
                          {data?.payload?.tech_lang_keys["65"]}
                        </option>
                        <option value="55@@@@">
                          {data?.payload?.tech_lang_keys["66"]}
                        </option>
                        <option value="52@@@">
                          {data?.payload?.tech_lang_keys["67"]}
                        </option>
                        <option value="47@@@">
                          {data?.payload?.tech_lang_keys["68"]}
                        </option>
                        <option value="58@@@">
                          {data?.payload?.tech_lang_keys["69"]}
                        </option>
                        <option value="32@@">
                          {data?.payload?.tech_lang_keys["70"]}
                        </option>
                        <option value="custom">
                          {data?.payload?.tech_lang_keys["71"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  {formData.tech_woodSelector == "custom" && (
                    <>
                      <div className="col-span-12 denisty ">
                        <label htmlFor="tech_custom" className="label">
                          {data?.payload?.tech_lang_keys["87"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_custom"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_custom}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_custom_unit} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "kg/m³", value: "kg/m³" },
                                { label: "lb/ft", value: "lb/ft" },
                                { label: "lb/yf", value: "lb/yf" },
                                { label: "g/cm³", value: "g/cm³" },
                                { label: "kg/cm³", value: "kg/cm³" },
                                { label: "g/m³", value: "g/m³" },
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
                  <div className="col-span-12">
                    {formData?.tech_category === "log" ? (
                      <>
                        <label htmlFor="tech_small_end" className="label">
                          {data?.payload?.tech_lang_keys["73"]} d<sub>s</sub>:
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_small_end" className="label">
                          {data?.payload?.tech_lang_keys["72"]} w:
                        </label>
                      </>
                    )}

                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_small_end"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_small_end}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_small_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
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
                  <div className="col-span-12">
                    <label htmlFor="tech_length" className="label">
                      {data?.payload?.tech_lang_keys["89"]} L:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_length"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_length}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_length_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
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
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 flex items-center">
                <div>
                  {formData?.tech_category === "log" ? (
                    <>
                      <img
                        src="/images/wood_log.webp"
                        alt="Wood log"
                        className="max-width mt-5  img1"
                        width="500px"
                        height="150px"
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src="/images/wood_board.webp"
                        alt="Stack log"
                        className="max-width img2"
                        width="500px"
                        height="150px"
                      />
                    </>
                  )}

                  <div className="col-12 mt-3 mt-lg-5">
                    {formData?.tech_category === "log" ? (
                      <>
                        <label htmlFor="tech_large_end" className="label">
                          {data?.payload?.tech_lang_keys["75"]} d<sub>l</sub>:
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_large_end" className="label">
                          {data?.payload?.tech_lang_keys["74"]} t:
                        </label>
                      </>
                    )}

                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_large_end"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_large_end}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_large_unit} ▾
                      </label>
                      {dropdownVisible3 && (
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
                              onClick={() => setUnitHandler3(unit.value)}
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
              <p className="col-span-12">
                <strong>{data?.payload?.tech_lang_keys["76"]}</strong>
              </p>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <div className="col-12 mt-0 mt-lg-2">
                  <label htmlFor="tech_stack_w" className="label">
                    {data?.payload?.tech_lang_keys["77"]}:
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_stack_w"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_stack_w}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown4}
                    >
                      {formData.tech_stackw_unit} ▾
                    </label>
                    {dropdownVisible4 && (
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
                            onClick={() => setUnitHandler4(unit.value)}
                          >
                            {unit.label}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12 mt-0 mt-lg-2">
                  <label htmlFor="tech_stack_h" className="label">
                    {data?.payload?.tech_lang_keys["78"]}:
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_stack_h"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_stack_h}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown5}
                    >
                      {formData.tech_stackh_unit} ▾
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
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 flex items-center">
                {formData?.tech_category === "log" ? (
                  <>
                    <img
                      src="/images/stack_log.webp"
                      alt="Wood log"
                      className="max-width mt-5  img1"
                      width="500px"
                      height="150px"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src="/images/stack_board.webp"
                      alt="Stack log"
                      className="max-width img2"
                      width="500px"
                      height="150px"
                    />
                  </>
                )}
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
                      <div className="w-full">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto lg:text-[18px] md:text-[18px] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              {formData?.tech_category == "log" ? (
                                <>
                                  <tr>
                                    <td width="60%" className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["79"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_dm_of_mid}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["80"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_volume} cu ft
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["81"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_weight} lb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["82"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_quantity_stack}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["83"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_weight_stack} lb
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                <>
                                  <tr>
                                    <td width="60%" className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["80"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_volume} cu ft
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["84"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_weight} lb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["85"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_quantity_stack}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["86"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_weight_stack} lb
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

export default LogWeightCalculator;

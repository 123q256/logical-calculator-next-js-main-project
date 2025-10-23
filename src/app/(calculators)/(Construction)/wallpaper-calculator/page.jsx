"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useWallpaperCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WallpaperCalculator = () => {
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
    tech_type: "1",
    tech_room_length: "22",
    tech_room_length_unit: "cm",
    tech_room_width: "22",
    tech_room_width_unit: "cm",
    tech_room_height: "12",
    tech_room_height_unit: "m",
    tech_wall_width: "12",
    tech_wall_width_unit: "m",
    tech_wall_height: "20",
    tech_wall_height_unit: "m",
    tech_door_height: "20",
    tech_door_height_unit: "m",
    tech_door_width: "20",
    tech_door_width_unit: "m",
    tech_no_of_doors: "15",
    tech_window_height: "6",
    tech_window_height_unit: "m",
    tech_window_width: "8",
    tech_window_width_unit: "m",
    tech_currancy: "$",
    tech_no_of_windows: "10",
    tech_roll_length: "8",
    tech_roll_length_unit: "m",
    tech_roll_width: "8",
    tech_roll_width_unit: "m",
    tech_cost: "7",
    tech_pattern: "0.1",
    tech_pattern_unit: "m",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWallpaperCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_type ||
      !formData.tech_door_height_unit ||
      !formData.tech_door_width ||
      !formData.tech_door_width_unit ||
      !formData.tech_no_of_doors ||
      !formData.tech_window_height ||
      !formData.tech_window_height_unit ||
      !formData.tech_window_width ||
      !formData.tech_no_of_windows ||
      !formData.tech_roll_length ||
      !formData.tech_roll_length_unit ||
      !formData.tech_window_width_unit ||
      !formData.tech_roll_width ||
      !formData.tech_roll_width_unit ||
      !formData.tech_cost ||
      !formData.tech_pattern ||
      !formData.tech_pattern_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_room_length: formData.tech_room_length,
        tech_room_length_unit: formData.tech_room_length_unit,
        tech_room_width: formData.tech_room_width,
        tech_room_width_unit: formData.tech_room_width_unit,
        tech_room_height: formData.tech_room_height,
        tech_room_height_unit: formData.tech_room_height_unit,
        tech_wall_width: formData.tech_wall_width,
        tech_wall_width_unit: formData.tech_wall_width_unit,
        tech_wall_height: formData.tech_wall_height,
        tech_wall_height_unit: formData.tech_wall_height_unit,
        tech_door_height: formData.tech_door_height,
        tech_door_height_unit: formData.tech_door_height_unit,
        tech_door_width: formData.tech_door_width,
        tech_door_width_unit: formData.tech_door_width_unit,
        tech_no_of_doors: formData.tech_no_of_doors,
        tech_window_height: formData.tech_window_height,
        tech_window_height_unit: formData.tech_window_height_unit,
        tech_window_width: formData.tech_window_width,
        tech_window_width_unit: formData.tech_window_width_unit,
        tech_currancy: formData.tech_currancy,
        tech_no_of_windows: formData.tech_no_of_windows,
        tech_roll_length: formData.tech_roll_length,
        tech_roll_length_unit: formData.tech_roll_length_unit,
        tech_roll_width: formData.tech_roll_width,
        tech_roll_width_unit: formData.tech_roll_width_unit,
        tech_cost: formData.tech_cost,
        tech_pattern: formData.tech_pattern,
        tech_pattern_unit: formData.tech_pattern_unit,
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
      tech_type: "1",
      tech_room_length: "22",
      tech_room_length_unit: "cm",
      tech_room_width: "22",
      tech_room_width_unit: "cm",
      tech_room_height: "12",
      tech_room_height_unit: "m",
      tech_wall_width: "12",
      tech_wall_width_unit: "m",
      tech_wall_height: "20",
      tech_wall_height_unit: "m",
      tech_door_height: "20",
      tech_door_height_unit: "m",
      tech_door_width: "20",
      tech_door_width_unit: "m",
      tech_no_of_doors: "15",
      tech_window_height: "6",
      tech_window_height_unit: "m",
      tech_window_width: "8",
      tech_window_width_unit: "m",
      tech_currancy: "$",
      tech_no_of_windows: "10",
      tech_roll_length: "8",
      tech_roll_length_unit: "m",
      tech_roll_width: "8",
      tech_roll_width_unit: "m",
      tech_cost: "7",
      tech_pattern: "0.1",
      tech_pattern_unit: "m",
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
    setFormData((prev) => ({ ...prev, tech_room_length_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_room_width_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_room_height_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wall_width_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wall_height_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_door_height_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_door_width_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_window_height_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_window_width_unit: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };

  //dropdown states
  const [dropdownVisible9, setDropdownVisible9] = useState(false);

  const setUnitHandler9 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_roll_length_unit: unit }));
    setDropdownVisible9(false);
  };

  const toggleDropdown9 = () => {
    setDropdownVisible9(!dropdownVisible9);
  };

  //dropdown states
  const [dropdownVisible10, setDropdownVisible10] = useState(false);

  const setUnitHandler10 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_roll_width_unit: unit }));
    setDropdownVisible10(false);
  };

  const toggleDropdown10 = () => {
    setDropdownVisible10(!dropdownVisible10);
  };

  //dropdown states
  const [dropdownVisible11, setDropdownVisible11] = useState(false);

  const setUnitHandler11 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pattern_unit: unit }));
    setDropdownVisible11(false);
  };

  const toggleDropdown11 = () => {
    setDropdownVisible11(!dropdownVisible11);
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-6 pe-lg-3">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["22"]}:
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
                    <option value="1">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_type == "2" && (
                <>
                  <div className="col-span-6 pe-lg-3 rooms ">
                    <label htmlFor="tech_room_length" className="label">
                      {data?.payload?.tech_lang_keys["3"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_room_length"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_room_length}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_room_length_unit} ▾
                      </label>
                      {dropdownVisible && (
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
                              onClick={() => setUnitHandler(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-6 pe-lg-3 rooms ">
                    <label htmlFor="tech_room_width" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_room_width"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_room_width}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_room_width_unit} ▾
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
                  <div className="col-span-6 pe-lg-3 rooms ">
                    <label htmlFor="tech_room_height" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_room_height"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_room_height}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_room_height_unit} ▾
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
                </>
              )}

              {formData.tech_type == "1" && (
                <>
                  <div className="col-span-6  walls">
                    <label htmlFor="tech_wall_width" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_wall_width"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_wall_width}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_wall_width_unit} ▾
                      </label>
                      {dropdownVisible3 && (
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
                              onClick={() => setUnitHandler3(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12  pe-lg-3 walls">
                    <label htmlFor="tech_wall_height" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_wall_height"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_wall_height}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_wall_height_unit} ▾
                      </label>
                      {dropdownVisible4 && (
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

              <p className="col-span-12">
                {data?.payload?.tech_lang_keys["8"]}
              </p>

              <div className="col-span-6 pe-lg-3">
                <label htmlFor="tech_door_height" className="label">
                  {data?.payload?.tech_lang_keys["9"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_door_height"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_door_height}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown5}
                  >
                    {formData.tech_door_height_unit} ▾
                  </label>
                  {dropdownVisible5 && (
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
                          onClick={() => setUnitHandler5(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-6 pe-lg-3">
                <label htmlFor="tech_door_width" className="label">
                  {data?.payload?.tech_lang_keys["10"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_door_width"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_door_width}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown6}
                  >
                    {formData.tech_door_width_unit} ▾
                  </label>
                  {dropdownVisible6 && (
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
                          onClick={() => setUnitHandler6(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12  pe-lg-3">
                <label htmlFor="tech_no_of_doors" className="label">
                  {data?.payload?.tech_lang_keys["11"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_no_of_doors"
                    id="tech_no_of_doors"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_no_of_doors}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <p className="col-span-12">
                {data?.payload?.tech_lang_keys["12"]}
              </p>
              <div className="col-span-6 pe-lg-3">
                <label htmlFor="tech_window_height" className="label">
                  {data?.payload?.tech_lang_keys["13"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_window_height"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_window_height}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown7}
                  >
                    {formData.tech_window_height_unit} ▾
                  </label>
                  {dropdownVisible7 && (
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
                          onClick={() => setUnitHandler7(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-6 pe-lg-3">
                <label htmlFor="tech_window_width" className="label">
                  {data?.payload?.tech_lang_keys["13"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_window_width"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_window_width}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown8}
                  >
                    {formData.tech_window_width_unit} ▾
                  </label>
                  {dropdownVisible8 && (
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
                          onClick={() => setUnitHandler8(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="hidden"
                  name="tech_currancy"
                  id="tech_currancy"
                  className="input my-2"
                  aria-label="input"
                  value={currency.symbol}
                  onChange={handleChange}
                />
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12  pe-lg-3">
                <label htmlFor="tech_no_of_windows" className="label">
                  {data?.payload?.tech_lang_keys["15"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_no_of_windows"
                    id="tech_no_of_windows"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_no_of_windows}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <p className="col-span-12">
                {data?.payload?.tech_lang_keys["16"]}
              </p>

              <div className="col-span-6 pe-lg-3">
                <label htmlFor="tech_roll_length" className="label">
                  {data?.payload?.tech_lang_keys["17"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_roll_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_roll_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown9}
                  >
                    {formData.tech_roll_length_unit} ▾
                  </label>
                  {dropdownVisible9 && (
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
                          onClick={() => setUnitHandler9(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-6 pe-lg-3">
                <label htmlFor="tech_roll_width" className="label">
                  {data?.payload?.tech_lang_keys["17"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_roll_width"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_roll_width}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown10}
                  >
                    {formData.tech_roll_width_unit} ▾
                  </label>
                  {dropdownVisible10 && (
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
                          onClick={() => setUnitHandler10(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 pe-lg-3">
                <label htmlFor="tech_cost" className="label">
                  {data?.payload?.tech_lang_keys["19"]} ({" "}
                  {data?.payload?.tech_lang_keys["20"]}):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_cost"
                    id="tech_cost"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_cost}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 pe-lg-3">
                <label htmlFor="tech_pattern" className="label">
                  {data?.payload?.tech_lang_keys["21"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_pattern"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_pattern}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown11}
                  >
                    {formData.tech_pattern_unit} ▾
                  </label>
                  {dropdownVisible11 && (
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
                          onClick={() => setUnitHandler11(unit.value)}
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
                      <div className="w-full my-1">
                        <div className="w-full md:w-[70%] lg:w-[70%] overflow-auto text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  <strong>Wall surface area :</strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_area).toFixed(3)}
                                  <span className="text-sm">
                                    {" "}
                                    (m<sup>2</sup>)
                                  </span>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  <strong>Total doors area :</strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_door_area).toFixed(3)}
                                  <span className="text-sm">
                                    {" "}
                                    (m<sup>2</sup>)
                                  </span>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  <strong>Total windows area :</strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_window_area).toFixed(3)}
                                  <span className="text-sm">
                                    {" "}
                                    (m<sup>2</sup>)
                                  </span>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  <strong>Adjusted height :</strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_adjusted_height).toFixed(
                                    3
                                  )}
                                  <span className="text-sm"> m</span>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  <strong>Adjusted wall area :</strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_adjusted_wall_area
                                  ).toFixed(3)}
                                  <span className="text-sm">
                                    {" "}
                                    (m<sup>2</sup>)
                                  </span>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  <strong>Number of rolls :</strong>
                                </td>
                                <td className="border-b py-2">
                                  {parseInt(result?.tech_number_of_rolls)}
                                </td>
                              </tr>

                              {result?.tech_costs && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>Total cost :</strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol}{" "}
                                    {parseInt(result?.tech_costs)}
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

export default WallpaperCalculator;

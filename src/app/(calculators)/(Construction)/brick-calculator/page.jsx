"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useBrickCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BrickCalculator = () => {
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
    tech_wall_type: "double", // double  single
    tech_wall_length: Number(24),
    tech_wall_length_unit: "cm",
    tech_wall_width: Number(24),
    tech_wall_width_unit: "cm",
    tech_wall_height: Number(24),
    tech_wall_height_unit: "cm",
    tech_brick_type: "7.625x3.625",
    tech_brick_wastage: Number(24),
    tech_mortar_joint_thickness: Number(24),
    tech_mortar_joint_thickness_unit: "cm",
    tech_brick_length: Number(24),
    tech_brick_length_unit: "cm",
    tech_brick_width: Number(24),
    tech_brick_width_unit: "mm",
    tech_brick_height: Number(24),
    tech_brick_height_unit: "mm",
    tech_with_motar: "no",
    tech_wet_volume: Number(24),
    tech_wet_volume_unit: "m³",
    tech_mortar_wastage: Number(24),
    tech_mortar_ratio: "1:5",
    tech_bag_size: Number(24),
    tech_bag_size_unit: "g",
    tech_price_per_brick: Number(24),
    tech_price_of_cement: Number(24),
    tech_price_sand_per_volume: Number(24),
    tech_price_sand_volume_unit: "m³",
    tech_currancy: "$",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBrickCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_wall_type ||
      !formData.tech_wall_length ||
      !formData.tech_wall_length_unit ||
      !formData.tech_wall_width ||
      !formData.tech_wall_width_unit ||
      !formData.tech_wall_height ||
      !formData.tech_wall_height_unit ||
      !formData.tech_brick_type ||
      !formData.tech_brick_wastage ||
      !formData.tech_mortar_joint_thickness ||
      !formData.tech_mortar_joint_thickness_unit ||
      !formData.tech_with_motar ||
      !formData.tech_price_per_brick
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_wall_type: formData.tech_wall_type,
        tech_wall_length: formData.tech_wall_length,
        tech_wall_length_unit: formData.tech_wall_length_unit,
        tech_wall_width: formData.tech_wall_width,
        tech_wall_width_unit: formData.tech_wall_width_unit,
        tech_wall_height: formData.tech_wall_height,
        tech_wall_height_unit: formData.tech_wall_height_unit,
        tech_brick_type: formData.tech_brick_type,
        tech_brick_wastage: formData.tech_brick_wastage,
        tech_mortar_joint_thickness: formData.tech_mortar_joint_thickness,
        tech_mortar_joint_thickness_unit:
          formData.tech_mortar_joint_thickness_unit,
        tech_brick_length: formData.tech_brick_length,
        tech_brick_length_unit: formData.tech_brick_length_unit,
        tech_brick_width: formData.tech_brick_width,
        tech_brick_width_unit: formData.tech_brick_width_unit,
        tech_brick_height: formData.tech_brick_height,
        tech_brick_height_unit: formData.tech_brick_height_unit,
        tech_with_motar: formData.tech_with_motar,
        tech_wet_volume: formData.tech_wet_volume,
        tech_wet_volume_unit: formData.tech_wet_volume_unit,
        tech_mortar_wastage: formData.tech_mortar_wastage,
        tech_mortar_ratio: formData.tech_mortar_ratio,
        tech_bag_size: formData.tech_bag_size,
        tech_bag_size_unit: formData.tech_bag_size_unit,
        tech_price_per_brick: formData.tech_price_per_brick,
        tech_price_of_cement: formData.tech_price_of_cement,
        tech_price_sand_per_volume: formData.tech_price_sand_per_volume,
        tech_price_sand_volume_unit: formData.tech_price_sand_volume_unit,
        tech_currancy: formData.tech_currancy,
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
      tech_wall_type: "double", // double  single
      tech_wall_length: Number(24),
      tech_wall_length_unit: "cm",
      tech_wall_width: Number(24),
      tech_wall_width_unit: "cm",
      tech_wall_height: Number(24),
      tech_wall_height_unit: "cm",
      tech_brick_type: "7.625x3.625",
      tech_brick_wastage: Number(24),
      tech_mortar_joint_thickness: Number(24),
      tech_mortar_joint_thickness_unit: "cm",
      tech_brick_length: Number(24),
      tech_brick_length_unit: "cm",
      tech_brick_width: Number(24),
      tech_brick_width_unit: "mm",
      tech_brick_height: Number(24),
      tech_brick_height_unit: "mm",
      tech_with_motar: "no",
      tech_wet_volume: Number(24),
      tech_wet_volume_unit: "m³",
      tech_mortar_wastage: Number(24),
      tech_mortar_ratio: "1:5",
      tech_bag_size: Number(24),
      tech_bag_size_unit: "g",
      tech_price_per_brick: Number(24),
      tech_price_of_cement: Number(24),
      tech_price_sand_per_volume: Number(24),
      tech_price_sand_volume_unit: "m³",
      tech_currancy: "$",
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
    setFormData((prev) => ({ ...prev, tech_wall_length_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wall_width_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wall_height_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_mortar_joint_thickness_unit: unit,
    }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_brick_length_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_brick_width_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_brick_height_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wet_volume_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_bag_size_unit: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };

  //dropdown states
  const [dropdownVisible9, setDropdownVisible9] = useState(false);

  const setUnitHandler9 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_price_sand_volume_unit: unit }));
    setDropdownVisible9(false);
  };

  const toggleDropdown9 = () => {
    setDropdownVisible9(!dropdownVisible9);
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

          <input
            type="hidden"
            step="any"
            name="tech_currancy"
            id="tech_currancy"
            className="input my-2"
            aria-label="input"
            placeholder="00"
            value={currency.symbol}
            onChange={handleChange}
          />

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_wall_type" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_wall_type"
                    id="tech_wall_type"
                    value={formData.tech_wall_type}
                    onChange={handleChange}
                  >
                    <option value="single">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="double">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_wall_length" className="label">
                  {data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_wall_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_wall_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_wall_length_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "ft", value: "ft" },
                        { label: "in", value: "in" },
                        { label: "cm", value: "cm" },
                        { label: "mm", value: "mm" },
                        { label: "dm", value: "dm" },
                        { label: "m", value: "m" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
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
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_wall_width_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "ft", value: "ft" },
                        { label: "in", value: "in" },
                        { label: "cm", value: "cm" },
                        { label: "mm", value: "mm" },
                        { label: "dm", value: "dm" },
                        { label: "m", value: "m" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
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
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_wall_height_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "ft", value: "ft" },
                        { label: "in", value: "in" },
                        { label: "cm", value: "cm" },
                        { label: "mm", value: "mm" },
                        { label: "dm", value: "dm" },
                        { label: "m", value: "m" },
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

              <p className="col-span-12  my-1">
                {data?.payload?.tech_lang_keys["8"]}
              </p>

              <div className="col-span-12 md:col-span-6 lg:col-span-6 px-1">
                <label htmlFor="tech_brick_type" className="label">
                  Type
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_brick_type"
                    id="tech_brick_type"
                    value={formData.tech_brick_type}
                    onChange={handleChange}
                  >
                    <option value="7.625x3.625">
                      {data?.payload?.tech_lang_keys["9"]} (7 5/8" x 2 1/4")
                    </option>
                    <option value="8x2.25">
                      {data?.payload?.tech_lang_keys["10"]} (8" x 2 1/4")
                    </option>
                    <option value="8x2.75">
                      {data?.payload?.tech_lang_keys["11"]} (8" x 2 3/4")
                    </option>
                    <option value="9.625x2.625">
                      {data?.payload?.tech_lang_keys["12"]} (9 5/8" x 2 5/8")
                    </option>
                    <option value="11.625x1.625">
                      {data?.payload?.tech_lang_keys["13"]} (11 5/8" x 1 5/8")
                    </option>
                    <option value="11.625x2.25">
                      {data?.payload?.tech_lang_keys["14"]} (11 5/8" x 2 1/4")
                    </option>
                    <option value="11.625x3.625">
                      {data?.payload?.tech_lang_keys["15"]} (11 5/8" x 2 1/4")
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_brick_wastage" className="label">
                  {data?.payload?.tech_lang_keys["17"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_brick_wastage"
                    id="tech_brick_wastage"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_brick_wastage}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_mortar_joint_thickness" className="label">
                  {data?.payload?.tech_lang_keys["18"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_mortar_joint_thickness"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_mortar_joint_thickness}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_mortar_joint_thickness_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "in", value: "in" },
                        { label: "cm", value: "cm" },
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
              {formData.tech_brick_type == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 custom ">
                    <label htmlFor="tech_brick_length" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_brick_length"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_brick_length}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_brick_length_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "ft", value: "ft" },
                            { label: "in", value: "in" },
                            { label: "cm", value: "cm" },
                            { label: "mm", value: "mm" },
                            { label: "dm", value: "dm" },
                            { label: "m", value: "m" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 custom ">
                    <label htmlFor="tech_brick_width" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_brick_width"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_brick_width}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_brick_width_unit} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "ft", value: "ft" },
                            { label: "in", value: "in" },
                            { label: "cm", value: "cm" },
                            { label: "mm", value: "mm" },
                            { label: "dm", value: "dm" },
                            { label: "m", value: "m" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 custom ">
                    <label htmlFor="tech_brick_height" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_brick_height"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_brick_height}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown6}
                      >
                        {formData.tech_brick_height_unit} ▾
                      </label>
                      {dropdownVisible6 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "ft", value: "ft" },
                            { label: "in", value: "in" },
                            { label: "cm", value: "cm" },
                            { label: "mm", value: "mm" },
                            { label: "dm", value: "dm" },
                            { label: "m", value: "m" },
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
                </>
              )}

              <p className="col-span-12  my-1">
                {data?.payload?.tech_lang_keys["19"]}
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 px-1">
                <label htmlFor="tech_with_motar" className="label">
                  {data?.payload?.tech_lang_keys["20"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_with_motar"
                    id="tech_with_motar"
                    value={formData.tech_with_motar}
                    onChange={handleChange}
                  >
                    <option value="no">
                      {data?.payload?.tech_lang_keys["21"]}
                    </option>
                    <option value="yes">
                      {data?.payload?.tech_lang_keys["22"]}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_with_motar == "yes" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 yes ">
                    <label htmlFor="tech_wet_volume" className="label">
                      {data?.payload?.tech_lang_keys["23"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_wet_volume"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_wet_volume}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown7}
                      >
                        {formData.tech_wet_volume_unit} ▾
                      </label>
                      {dropdownVisible7 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m³", value: "m³" },
                            { label: "cm³", value: "cm³" },
                            { label: "cu ft", value: "cu ft" },
                            { label: "cu yd", value: "cu yd" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 yes ">
                    <label htmlFor="tech_mortar_wastage" className="label">
                      {data?.payload?.tech_lang_keys["24"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_mortar_wastage"
                        id="tech_mortar_wastage"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_mortar_wastage}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 px-1 yes ">
                    <label htmlFor="tech_mortar_ratio" className="label">
                      {data?.payload?.tech_lang_keys["25"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_mortar_ratio"
                        id="tech_mortar_ratio"
                        value={formData.tech_mortar_ratio}
                        onChange={handleChange}
                      >
                        <option value="1:5">
                          1:5 ({data?.payload?.tech_lang_keys["26"]})
                        </option>
                        <option value="1:6">
                          1:6 ({data?.payload?.tech_lang_keys["27"]}){" "}
                        </option>
                        <option value="1:4">
                          1:4 ({data?.payload?.tech_lang_keys["28"]}){" "}
                        </option>
                        <option value="1:3">
                          1:3 ({data?.payload?.tech_lang_keys["29"]}){" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 yes ">
                    <label htmlFor="tech_bag_size" className="label">
                      {data?.payload?.tech_lang_keys["30"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_bag_size"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_bag_size}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown8}
                      >
                        {formData.tech_bag_size_unit} ▾
                      </label>
                      {dropdownVisible8 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Kg", value: "Kg" },
                            { label: "g", value: "g" },
                            { label: "lb", value: "lb" },
                            { label: "t", value: "t" },
                            { label: "stone", value: "stone" },
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

              <p className="col-span-12  my-1">
                {data?.payload?.tech_lang_keys["31"]}
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_price_per_brick" className="label">
                  {data?.payload?.tech_lang_keys["32"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_price_per_brick"
                    id="tech_price_per_brick"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_price_per_brick}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>

              {formData.tech_with_motar == "yes" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 yes">
                    <label htmlFor="tech_price_of_cement" className="label">
                      {data?.payload?.tech_lang_keys["33"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_price_of_cement"
                        id="tech_price_of_cement"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_price_of_cement}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 yes">
                    <label
                      htmlFor="tech_price_sand_per_volume"
                      className="label"
                    >
                      {data?.payload?.tech_lang_keys["34"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_price_sand_per_volume"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_price_sand_per_volume}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown9}
                      >
                        {formData.tech_price_sand_volume_unit} ▾
                      </label>
                      {dropdownVisible9 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m³", value: "m³" },
                            { label: "cm³", value: "cm³" },
                            { label: "cu ft", value: "cu_ft" },
                            { label: "cu yd", value: "cu_yd" },
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

                  <div className="rounded-lg  flex items-center justify-center mt-5">
                    <div className="w-full ">
                      <div className="w-full">
                        <div className="w-full md:w-[90%] lg:w-[70%] overflow-auto text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[36]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_no_of_bricks_with_wastage}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[40]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_wall_area} m²
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[41]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_no_of_bricks}
                                </td>
                              </tr>
                              {result?.tech_dry_volume >= 0 &&
                                result?.tech_dry_volume_with_wastage >= 0 &&
                                result?.tech_volume_of_cement >= 0 &&
                                result?.tech_number_of_bags >= 0 &&
                                result?.tech_volume_of_sand >= 0 && (
                                  <>
                                    <tr>
                                      <td colSpan="2" className="pb-2 pt-3">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[53]}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[43]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_dry_volume} m³
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[44]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_dry_volume_with_wastage}{" "}
                                        m³
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[45]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_volume_of_cement} m³
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[46]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_number_of_bags}{" "}
                                        {data?.payload?.tech_lang_keys[48]}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[47]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_volume_of_sand} m³
                                      </td>
                                    </tr>
                                  </>
                                )}

                              <tr>
                                <td colSpan="2" className="pb-2 pt-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[54]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[49]} :
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol}{" "}
                                  {result?.tech_cost_of_bricks}
                                </td>
                              </tr>
                              {result?.tech_mortar_cost >= 0 &&
                                result?.tech_total_cost >= 0 && (
                                  <>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[50]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {result?.tech_mortar_cost}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="pt-2 pb-3">
                                        {data?.payload?.tech_lang_keys[51]} :
                                      </td>
                                      <td className="pt-2 pb-3">
                                        {currency.symbol}{" "}
                                        {result?.tech_total_cost}
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

export default BrickCalculator;

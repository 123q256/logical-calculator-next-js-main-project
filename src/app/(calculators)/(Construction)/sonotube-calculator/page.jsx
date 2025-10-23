"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useSonotubeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SonotubeCalculator = () => {
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
    tech_size_unit: "16 (40.64 cm)",
    tech_height: "120",
    tech_height_unit: "cm",
    tech_quantity: "1",
    tech_concerete_mix_unit: "I'll get pre-mixed concrete bags",
    tech_density: "6",
    tech_density_unit: "kg/m³",
    tech_concrete_ratio_unit: "1:5:10 (5.0 MPa or 725 psi)",
    tech_bag_size: "10",
    tech_bag_size_unit: "kg",
    tech_waste: "5",
    tech_Cost_bag_mix: "10",
    tech_Cost_of_cement: "50",
    tech_Cost_of_cement_unit: "cm³",
    tech_Cost_of_sand: "50",
    tech_Cost_of_sand_unit: "m³",
    tech_Cost_of_gravel: "50",
    tech_Cost_of_gravel_unit: "cm³",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSonotubeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_size_unit ||
      !formData.tech_height ||
      !formData.tech_height_unit ||
      !formData.tech_quantity ||
      !formData.tech_concerete_mix_unit ||
      !formData.tech_waste
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_size_unit: formData.tech_size_unit,
        tech_height: formData.tech_height,
        tech_height_unit: formData.tech_height_unit,
        tech_quantity: formData.tech_quantity,
        tech_concerete_mix_unit: formData.tech_concerete_mix_unit,
        tech_density: formData.tech_density,
        tech_density_unit: formData.tech_density_unit,
        tech_concrete_ratio_unit: formData.tech_concrete_ratio_unit,
        tech_bag_size: formData.tech_bag_size,
        tech_bag_size_unit: formData.tech_bag_size_unit,
        tech_waste: formData.tech_waste,
        tech_Cost_bag_mix: formData.tech_Cost_bag_mix,
        tech_Cost_of_cement: formData.tech_Cost_of_cement,
        tech_Cost_of_cement_unit: formData.tech_Cost_of_cement_unit,
        tech_Cost_of_sand: formData.tech_Cost_of_sand,
        tech_Cost_of_sand_unit: formData.tech_Cost_of_sand_unit,
        tech_Cost_of_gravel: formData.tech_Cost_of_gravel,
        tech_Cost_of_gravel_unit: formData.tech_Cost_of_gravel_unit,
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
      tech_size_unit: "16 (40.64 cm)",
      tech_height: "120",
      tech_height_unit: "cm",
      tech_quantity: "1",
      tech_concerete_mix_unit: "I'll get pre-mixed concrete bags",
      tech_density: "6",
      tech_density_unit: "kg/m³",
      tech_concrete_ratio_unit: "1:5:10 (5.0 MPa or 725 psi)",
      tech_bag_size: "10",
      tech_bag_size_unit: "kg",
      tech_waste: "5",
      tech_Cost_bag_mix: "10",
      tech_Cost_of_cement: "50",
      tech_Cost_of_cement_unit: "cm³",
      tech_Cost_of_sand: "50",
      tech_Cost_of_sand_unit: "m³",
      tech_Cost_of_gravel: "50",
      tech_Cost_of_gravel_unit: "cm³",
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
    setFormData((prev) => ({ ...prev, tech_height_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_density_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_bag_size_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_Cost_of_cement_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_Cost_of_sand_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_Cost_of_gravel_unit: unit }));
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 size_unit ">
                <label htmlFor="tech_size_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_size_unit"
                    id="tech_size_unit"
                    value={formData.tech_size_unit}
                    onChange={handleChange}
                  >
                    <option value="6 (15.24 cm)">6 (15.24 cm)</option>
                    <option value="8 (20.32 cm)">8 (20.32 cm)</option>
                    <option value="10 (25.40 cm)">10 (25.40 cm)</option>
                    <option value="12 (30.48 cm)">12 (30.48 cm)</option>
                    <option value="14 (35.56 cm)">14 (35.56 cm)</option>
                    <option value="16 (40.64 cm)">16 (40.64 cm)</option>
                    <option value="18 (45.72 cm)">18 (45.72 cm)</option>
                    <option value="20 (50.80 cm)">20 (50.80 cm)</option>
                    <option value="22 (55.88 cm)">22 (55.88 cm)</option>
                    <option value="24 (60.96 cm)">24 (60.96 cm)</option>
                    <option value="26 (66.04 cm)">26 (66.04 cm)</option>
                    <option value="28 (71.12 cm)">28 (71.12 cm)</option>
                    <option value="30 (76.20 cm)">30 (76.20 cm)</option>
                    <option value="32 (81.28 cm)">32 (81.28 cm)</option>
                    <option value="34 (86.36 cm)">34 (86.36 cm)</option>
                    <option value="36 (91.44 cm)">36 (91.44 cm)</option>
                    <option value="40 (101.60 cm)">40 (101.60 cm)</option>
                    <option value="42 (106.68 cm)">42 (106.68 cm)</option>
                    <option value="48 (121.91 cm)">48 (121.91 cm)</option>
                    <option value="54 (137.16 cm)">54 (137.16 cm)</option>
                    <option value="60 (152.40 cm)">60 (152.40 cm)</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 height">
                <label htmlFor="tech_height" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_height"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_height}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_height_unit} ▾
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 quantity">
                <label htmlFor="tech_quantity" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_quantity"
                    id="tech_quantity"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_quantity}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {data?.payload?.tech_lang_keys["4"]}
                  </span>
                </div>
              </div>
              <p className="col-span-12">
                <strong>{data?.payload?.tech_lang_keys["5"]}</strong>
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 width">
                <label htmlFor="tech_concerete_mix_unit" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_concerete_mix_unit"
                    id="tech_concerete_mix_unit"
                    value={formData.tech_concerete_mix_unit}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys["7"]}>
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["8"]}>
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_concerete_mix_unit ==
                data?.payload?.tech_lang_keys["7"] && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 density conc_mix_one">
                    <label htmlFor="tech_density" className="label">
                      {data?.payload?.tech_lang_keys["9"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_density"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_density}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_density_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kg/m³", value: "kg/m³" },
                            { label: "lb/cu ft", value: "lb/cu ft" },
                            { label: "lb/cu yd", value: "lb/cu yd" },
                            { label: "g/cm³", value: "g/cm³" },
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

              {formData.tech_concerete_mix_unit ==
                data?.payload?.tech_lang_keys["8"] && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 conc_mix_two ">
                    <label htmlFor="tech_concrete_ratio_unit" className="label">
                      {data?.payload?.tech_lang_keys["15"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_concrete_ratio_unit"
                        id="tech_concrete_ratio_unit"
                        value={formData.tech_concrete_ratio_unit}
                        onChange={handleChange}
                      >
                        <option value="1:5:10 (5.0 MPa or 725 psi)">
                          1:5:10 (5.0 MPa or 725 psi)
                        </option>
                        <option value="1:4:8 (7.5 MPa or 1085 psi)">
                          1:4:8 (7.5 MPa or 1085 psi)
                        </option>
                        <option value="1:3:6 (10.0 MPa or 1450 psi)">
                          1:3:6 (10.0 MPa or 1450 psi)
                        </option>
                        <option value="1:2:4 (15.0 MPa or 2175 psi)">
                          1:2:4 (15.0 MPa or 2175 psi)
                        </option>
                        <option value="1:1.5:3 (20.0 MPa or 2900 psi)">
                          1:1.5:3 (20.0 MPa or 2900 psi)
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_concerete_mix_unit ==
                data?.payload?.tech_lang_keys["7"] && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 bag_size conc_mix_one">
                    <label htmlFor="tech_bag_size" className="label">
                      {data?.payload?.tech_lang_keys["10"]}
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
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_bag_size_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kg", value: "kg" },
                            { label: "lb", value: "lb" },
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

              <div className="col-span-12 md:col-span-6 lg:col-span-6 cost">
                <label htmlFor="tech_waste" className="label">
                  {data?.payload?.tech_lang_keys["11"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_waste"
                    id="tech_waste"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_waste}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>

              <p className="col-span-12">
                <strong>{data?.payload?.tech_lang_keys["12"]}</strong>
              </p>

              {formData.tech_concerete_mix_unit ==
                data?.payload?.tech_lang_keys["7"] && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 cost conc_mix_one">
                    <label htmlFor="tech_Cost_bag_mix" className="label">
                      {data?.payload?.tech_lang_keys["13"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_Cost_bag_mix"
                        id="tech_Cost_bag_mix"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_Cost_bag_mix}
                        onChange={handleChange}
                      />
                      <span className="input_unit">
                        {currency.symbol}/{data?.payload?.tech_lang_keys["14"]}
                      </span>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_concerete_mix_unit ==
                data?.payload?.tech_lang_keys["8"] && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_Cost_of_cement" className="label">
                      {data?.payload?.tech_lang_keys["16"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_Cost_of_cement"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_Cost_of_cement}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_Cost_of_cement_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            {
                              label: currency.symbol + " cm³",
                              value: currency.symbol + " cm³",
                            },
                            {
                              label: currency.symbol + " m³",
                              value: currency.symbol + " m³",
                            },
                            {
                              label: currency.symbol + " cu ft",
                              value: currency.symbol + " cu ft",
                            },
                            {
                              label: currency.symbol + " cu yd",
                              value: currency.symbol + " cu yd",
                            },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_Cost_of_sand" className="label">
                      {data?.payload?.tech_lang_keys["17"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_Cost_of_sand"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_Cost_of_sand}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_Cost_of_sand_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            {
                              label: currency.symbol + " cm³",
                              value: currency.symbol + " cm³",
                            },
                            {
                              label: currency.symbol + " m³",
                              value: currency.symbol + " m³",
                            },
                            {
                              label: currency.symbol + " cu ft",
                              value: currency.symbol + " cu ft",
                            },
                            {
                              label: currency.symbol + " cu yd",
                              value: currency.symbol + " cu yd",
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_Cost_of_gravel" className="label">
                      {data?.payload?.tech_lang_keys["18"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_Cost_of_gravel"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_Cost_of_gravel}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_Cost_of_gravel_unit} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            {
                              label: currency.symbol + " cm³",
                              value: currency.symbol + " cm³",
                            },
                            {
                              label: currency.symbol + " m³",
                              value: currency.symbol + " m³",
                            },
                            {
                              label: currency.symbol + " cu ft",
                              value: currency.symbol + " cu ft",
                            },
                            {
                              label: currency.symbol + " cu yd",
                              value: currency.symbol + " cu yd",
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-1">
                        <div className="w-full md:w-[70%] lg:w-[70%] overflow-auto text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="70%" className="pt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["19"]} :
                                  </strong>
                                </td>
                                <td className="pt-2">
                                  {" "}
                                  {Number(result?.tech_volume).toFixed(2)}{" "}
                                  <span className="font-s-14">
                                    {data?.payload?.tech_lang_keys["21"]}{" "}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td colSpan="2" className="pt-3 pb-2 font-s-20">
                                  {data?.payload?.tech_lang_keys["20"]} :
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["22"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_volume * 28320).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["23"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_volume / 35.315).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["24"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_volume * 1728).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["25"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_volume * 27).toFixed(4)}
                                </td>
                              </tr>
                              {formData?.tech_concerete_mix_unit ==
                              "I'll get pre-mixed concrete bags" ? (
                                <>
                                  <tr>
                                    <td className="pt-3">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["26"]} :
                                      </strong>
                                    </td>
                                    <td className="pt-3">
                                      {" "}
                                      {Number(result?.tech_weghits).toFixed(
                                        4
                                      )}{" "}
                                      <span className="font-s-14">
                                        {data?.payload?.tech_lang_keys["35"]}{" "}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="2"
                                      className="pt-3 pb-2 font-s-20"
                                    >
                                      {data?.payload?.tech_lang_keys["27"]} :
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["28"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_weghits / 2.205
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["29"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_weghits / 2205
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["30"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_weghits / 14
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["31"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_weghits / 2000
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["32"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_weghits / 2240
                                      ).toFixed(4)}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b  pt-3 pb-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["33"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b  pt-3 pb-2">
                                      {" "}
                                      {result?.tech_bagsz}{" "}
                                      <span className="font-s-14">
                                        {data?.payload?.tech_lang_keys["34"]}{" "}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["36"]} :
                                      </strong>
                                    </td>
                                    <td className="py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_per_units).toFixed(
                                        4
                                      )}{" "}
                                      <span className="font-s-14">
                                        Per{" "}
                                        {data?.payload?.tech_lang_keys["21"]}{" "}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="2"
                                      className="pt-3 pb-2 font-s-20"
                                    >
                                      {data?.payload?.tech_lang_keys["37"]} :
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["22"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {" "}
                                      {Number(result?.tech_per_units / 28320)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["23"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_per_units / 35.315
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["25"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {" "}
                                      {Number(
                                        result?.tech_per_units / 27
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["39"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {" "}
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_cost_per_colums
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["40"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {" "}
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_total_costz).toFixed(
                                        4
                                      )}
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                <>
                                  <tr>
                                    <td className="pt-3">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["41"]} :
                                      </strong>
                                    </td>
                                    <td className="pt-3">
                                      {" "}
                                      {Number(
                                        result?.tech_total_volume
                                      ).toFixed(4)}{" "}
                                      <span className="font-s-14">
                                        {" "}
                                        {
                                          data?.payload?.tech_lang_keys["21"]
                                        }{" "}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="2"
                                      className="pt-3 pb-2 font-s-20"
                                    >
                                      {data?.payload?.tech_lang_keys["42"]} :
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["22"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_total_volume * 28320
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["23"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_total_volume / 35.315
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["24"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_total_volume * 1728
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["25"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_total_volume * 27
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="pt-3">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["43"]} :
                                      </strong>
                                    </td>
                                    <td className="pt-3">
                                      {" "}
                                      {Number(
                                        result?.tech_value_cement
                                      ).toFixed(4)}{" "}
                                      <span className="font-s-14">
                                        {" "}
                                        {
                                          data?.payload?.tech_lang_keys["21"]
                                        }{" "}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="2"
                                      className="pt-3 pb-2 font-s-20"
                                    >
                                      {data?.payload?.tech_lang_keys["44"]} :
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["22"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_value_cement * 28320
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["23"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_value_cement / 35.315
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["24"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_value_cement * 1728
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["25"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_value_cement * 27
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="pt-3">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["45"]} :
                                      </strong>
                                    </td>
                                    <td className="pt-3">
                                      {" "}
                                      {Number(result?.tech_value_sand).toFixed(
                                        4
                                      )}{" "}
                                      <span className="font-s-14">
                                        {" "}
                                        {
                                          data?.payload?.tech_lang_keys["21"]
                                        }{" "}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="2"
                                      className="pt-3 pb-2 font-s-20"
                                    >
                                      {data?.payload?.tech_lang_keys["46"]} :
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["22"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_value_sand * 28320
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["23"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_value_sand / 35.315
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["24"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_value_sand * 1728
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["25"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_value_sand * 27
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="pt-3">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["47"]} :
                                      </strong>
                                    </td>
                                    <td className="pt-3">
                                      {" "}
                                      {Number(
                                        result?.tech_value_gravel
                                      ).toFixed(4)}{" "}
                                      <span className="font-s-14">
                                        {" "}
                                        {
                                          data?.payload?.tech_lang_keys["21"]
                                        }{" "}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="2"
                                      className="pt-3 pb-2 font-s-20"
                                    >
                                      {data?.payload?.tech_lang_keys["46"]} :
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["22"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_value_gravel * 28320
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["23"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_value_gravel / 35.315
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["24"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_value_gravel * 1728
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["25"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_value_gravel * 27
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["39"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {" "}
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_total_costszz
                                      ).toFixed(4)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["40"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {" "}
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_total_costszz
                                      ).toFixed(4)}
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

export default SonotubeCalculator;

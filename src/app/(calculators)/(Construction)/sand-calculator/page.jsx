"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useSandCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SandCalculator = () => {
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
    tech_shape: "1",
    tech_g: "g1",
    tech_check: "g1",
    tech_length: Number(24),
    tech_length_unit: "cm",
    tech_width: Number(8),
    tech_width_unit: "cm",
    tech_area: Number(10),
    tech_area_unit: "mm²",
    tech_volume: Number(15),
    tech_volume_unit: "mm³",
    tech_diameter: Number(15),
    tech_diameter_unit: "cm",
    tech_depth: Number(10),
    tech_depth_unit: "cm",
    tech_density: Number(10),
    tech_density_unit: "kg/m³",
    tech_c_price: "",
    tech_mass_price: "",
    tech_mass_price_unit: "t",
    tech_hiddencurrancy: "$",
    tech_volume_price: "",
    tech_volume_price_unit: "t",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSandCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_shape || !formData.tech_g) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_shape: formData.tech_shape,
        tech_g: formData.tech_g,
        tech_check: formData.tech_check,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_area: formData.tech_area,
        tech_area_unit: formData.tech_area_unit,
        tech_volume: formData.tech_volume,
        tech_volume_unit: formData.tech_volume_unit,
        tech_diameter: formData.tech_diameter,
        tech_diameter_unit: formData.tech_diameter_unit,
        tech_depth: formData.tech_depth,
        tech_depth_unit: formData.tech_depth_unit,
        tech_density: formData.tech_density,
        tech_density_unit: formData.tech_density_unit,
        tech_c_price: formData.tech_c_price,
        tech_mass_price: formData.tech_mass_price,
        tech_mass_price_unit: formData.tech_mass_price_unit,
        tech_hiddencurrancy: formData.tech_hiddencurrancy,
        tech_volume_price: formData.tech_volume_price,
        tech_volume_price_unit: formData.tech_volume_price_unit,
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
      tech_shape: "1",
      tech_g: "g1",
      tech_check: "g1",
      tech_length: Number(24),
      tech_length_unit: "cm",
      tech_width: Number(8),
      tech_width_unit: "cm",
      tech_area: Number(10),
      tech_area_unit: "mm²",
      tech_volume: Number(15),
      tech_volume_unit: "mm³",
      tech_diameter: Number(15),
      tech_diameter_unit: "cm",
      tech_depth: Number(10),
      tech_depth_unit: "cm",
      tech_density: Number(10),
      tech_density_unit: "kg/m³",
      tech_c_price: "",
      tech_mass_price: "",
      tech_mass_price_unit: "t",
      tech_hiddencurrancy: "$",
      tech_volume_price: "",
      tech_volume_price_unit: "t",
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
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_width_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_volume_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_diameter_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_depth_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_density_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };
  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_mass_price_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_volume_price_unit: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };

  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-12">
                <label htmlFor="tech_shape" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_shape"
                    id="tech_shape"
                    value={formData.tech_shape}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_shape == "0" && (
                <>
                  <div className="col-span-12 chose">
                    <div className="grid grid-cols-12 mt-3  gap-2">
                      <div className="col-span-12 md:col-span-4 ">
                        <label className="pe-2" htmlFor="g1">
                          <input
                            type="radio"
                            name="tech_g"
                            value="g1"
                            id="g1"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_g === "g1"}
                          />
                          <span>{data?.payload?.tech_lang_keys["4"]}</span>
                        </label>
                      </div>
                      <div className="col-span-12 md:col-span-4 ">
                        <label htmlFor="g2">
                          <input
                            type="radio"
                            name="tech_g"
                            className="mr-2 border"
                            value="g2"
                            id="g2"
                            onChange={handleChange}
                            checked={formData.tech_g === "g2"}
                          />
                          <span>{data?.payload?.tech_lang_keys["5"]}</span>
                        </label>
                      </div>
                      <div className="col-span-12 md:col-span-4 ">
                        <label htmlFor="g3">
                          <input
                            type="radio"
                            name="tech_g"
                            className="mr-2 border"
                            value="g3"
                            id="g3"
                            onChange={handleChange}
                            checked={formData.tech_g === "g3"}
                          />
                          <span>{data?.payload?.tech_lang_keys["6"]}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6">
                {formData.tech_shape == "0" && formData.tech_g === "g1" && (
                  <>
                    <div className="col-span-12 length ">
                      <label htmlFor="tech_length" className="label">
                        {data?.payload?.tech_lang_keys["7"]}
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
                          onClick={toggleDropdown}
                        >
                          {formData.tech_length_unit} ▾
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
                  </>
                )}
                {formData.tech_shape == "0" && formData.tech_g === "g1" && (
                  <>
                    <div className="col-span-12 width ">
                      <label htmlFor="tech_width" className="label">
                        {data?.payload?.tech_lang_keys["8"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_width"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_width}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_width_unit} ▾
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
                  </>
                )}
                {formData.tech_shape == "0" && formData.tech_g === "g2" && (
                  <>
                    <div className="col-span-12 area ">
                      <label htmlFor="tech_area" className="label">
                        {data?.payload?.tech_lang_keys["9"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_area"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_area}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown2}
                        >
                          {formData.tech_area_unit} ▾
                        </label>
                        {dropdownVisible2 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mm²", value: "mm²" },
                              { label: "cm²", value: "cm²" },
                              { label: "m²", value: "m²" },
                              { label: "in²", value: "in²" },
                              { label: "ft²", value: "ft²" },
                              { label: "yd²", value: "yd²" },
                              { label: "hectares", value: "hectares" },
                              { label: "acres", value: "acres" },
                              {
                                label: "soccer fields",
                                value: "soccer fields",
                              },
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
                {formData.tech_shape == "0" && formData.tech_g === "g3" && (
                  <>
                    <div className="col-span-12 volume ">
                      <label htmlFor="tech_volume" className="label">
                        {data?.payload?.tech_lang_keys["10"]}
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
                          {formData.tech_volume_unit} ▾
                        </label>
                        {dropdownVisible3 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mm³", value: "mm³" },
                              { label: "cm³", value: "cm³" },
                              { label: "m³", value: "m³" },
                              { label: "in³", value: "in³" },
                              { label: "ft³", value: "ft³" },
                              { label: "yd³", value: "yd³" },
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
                {formData.tech_shape == "1" && (
                  <>
                    <div className="col-span-12 diameter ">
                      <label htmlFor="tech_diameter" className="label">
                        {data?.payload?.tech_lang_keys["11"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_diameter"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_diameter}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown4}
                        >
                          {formData.tech_diameter_unit} ▾
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
                {((formData.tech_shape === "0" && formData.tech_g === "g1") ||
                  formData.tech_g === "g2" ||
                  formData.tech_shape === "1") && (
                  <>
                    <div className="col-span-12 depth ">
                      <label htmlFor="tech_depth" className="label">
                        {data?.payload?.tech_lang_keys["12"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_depth"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_depth}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown5}
                        >
                          {formData.tech_depth_unit} ▾
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
                  </>
                )}

                {((formData.tech_shape === "0" && formData.tech_g === "g1") ||
                  (formData.tech_shape === "0" && formData.tech_g === "g2") ||
                  (formData.tech_shape === "0" &&
                    formData.tech_g === "g3")) && (
                  <>
                    <div className="col-span-12 density ">
                      <label htmlFor="tech_density" className="label">
                        {data?.payload?.tech_lang_keys["13"]}
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
                          onClick={toggleDropdown6}
                        >
                          {formData.tech_density_unit} ▾
                        </label>
                        {dropdownVisible6 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "kg/m³", value: "kg/m³" },
                              { label: "t/m³", value: "t/m³" },
                              { label: "g/cm³", value: "g/cm³" },
                              { label: "oz/in³", value: "oz/in³" },
                              { label: "lb/in³", value: "lb/in³" },
                              { label: "lb/ft³", value: "lb/ft³" },
                              { label: "lb/yd³", value: "lb/yd³" },
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
              <div className="col-span-12 md:col-span-6  flex items-center">
                {formData.tech_shape == "0" && (
                  <>
                    <img
                      src="/images/sand-square.webp"
                      alt="ShapeImage"
                      className="max-width imgset"
                      width="320px"
                      height="130px"
                    />
                  </>
                )}
                {formData.tech_shape == "1" && (
                  <>
                    <img
                      src="/images/sand-circle.webp"
                      alt="ShapeImage"
                      className="max-width imgset"
                      width="320px"
                      height="130px"
                    />
                  </>
                )}
              </div>
              <div
                className="col-span-12 cursor-pointer  flex items-center justify-center my-3"
                onClick={toggleDetails}
              >
                <strong className="pe-lg-3">
                  {data?.payload?.tech_lang_keys["14"]}:
                </strong>
                <img
                  src="/images/new-down.webp"
                  className={`right button mx-3 transition-transform duration-300 ease-in-out ${
                    showDetails ? "rotate-90" : "rotate-0"
                  }`}
                  alt="cost"
                  width="16px"
                  height="16px"
                />
              </div>
              {/* Toggle Content */}
              {showDetails && (
                <div className="col-span-12 current_input">
                  <div className="grid grid-cols-12 mt-3 gap-4">
                    {/* Cost Price */}
                    {formData.tech_shape == "1" && (
                      <>
                        <div className="lg:col-span-6 md:col-span-6 col-span-12 c_price">
                          <label htmlFor="tech_c_price" className="label">
                            {data?.payload?.tech_lang_keys["17"]}:
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_c_price"
                              id="tech_c_price"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_c_price}
                              onChange={handleChange}
                            />
                            <span className="input_unit">
                              {currency.symbol}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    {formData.tech_shape == "0" && (
                      <>
                        {/* Mass Price */}
                        <div className="lg:col-span-6 md:col-span-6 col-span-12 price">
                          <label htmlFor="tech_mass_price" className="label">
                            {data?.payload?.tech_lang_keys["15"]}
                          </label>
                          <div className="relative w-full">
                            <input
                              type="number"
                              name="tech_mass_price"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_mass_price}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown7}
                            >
                              {formData.tech_mass_price_unit} ▾
                            </label>
                            {dropdownVisible7 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  "µg",
                                  "mg",
                                  "g",
                                  "kg",
                                  "t",
                                  "lb",
                                  "stone",
                                  "US ton",
                                  "Long ton",
                                ].map((unit, index) => (
                                  <p
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setUnitHandler7(unit)}
                                  >
                                    {unit}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                          <input
                            type="hidden"
                            name="tech_amount"
                            id="tech_amount"
                            className="input my-2"
                            value={currency.symbol}
                            onChange={handleChange}
                          />
                        </div>
                        {/* Volume Price */}
                        <div className="lg:col-span-6 md:col-span-6 col-span-12 optional">
                          <label htmlFor="tech_volume_price" className="label">
                            {data?.payload?.tech_lang_keys["16"]}
                          </label>
                          <div className="relative w-full">
                            <input
                              type="number"
                              name="tech_volume_price"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_volume_price}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown8}
                            >
                              {formData.tech_volume_price_unit} ▾
                            </label>
                            {dropdownVisible8 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {["mm³", "cm³", "m³", "in³", "ft³", "yd³"].map(
                                  (unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() => setUnitHandler8(unit)}
                                    >
                                      {unit}
                                    </p>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-1">
                        <div className="w-full md:w-[100%] lg:w-[60%] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              {result?.tech_volume >= 0 && (
                                <>
                                  <tr>
                                    <td width="40%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["18"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_volume} (ft³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colspan="2" className="pt-3 pb-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["18"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_mm3} cubic milimeters (mm³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["18"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_cm3} cubic centimeters (cm³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["18"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_m3} cubic meters (m³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["18"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_in3} cubic inches (in³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["18"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_yd3} cubic yards (yd³)
                                    </td>
                                  </tr>
                                </>
                              )}
                              <tr>
                                <td className="border-b pb-2 pt-4">
                                  {data?.payload?.tech_lang_keys["20"]}
                                </td>
                                <td className="border-b pb-2 pt-4">
                                  {result?.tech_weight} t
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2" className="pt-3 pb-2">
                                  <strong>
                                    {" "}
                                    {data?.payload?.tech_lang_keys["19"]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["20"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_g} grams (g)
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["20"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_kg} kilograms (kg)
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["20"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_oz} ounces (oz)
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["20"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_lb} pounds (lb)
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["20"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_stone} stones (stone)
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["20"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_us_ton} US short tons (US ton)
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["20"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_long_ton} imperial tons (Long
                                  ton)
                                </td>
                              </tr>
                              {result?.tech_cost && (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["21"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol} {result?.tech_cost}
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

export default SandCalculator;

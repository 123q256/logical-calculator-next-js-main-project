"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCarpetCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CarpetCalculator = () => {
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
    tech_shape: "Rectangle",
    tech_length: "8",
    tech_length_unit: "cm",
    tech_width: "30",
    tech_width_unit: "cm",
    tech_radius: "30",
    tech_radius_unit: "cm",
    tech_axis_a: "30",
    tech_axis_a_unit: "cm",
    tech_axis_b: "30",
    tech_axis_b_unit: "cm",
    tech_side: "30",
    tech_side_unit: "cm",
    tech_sides: "30",
    tech_sides_unit: "m",
    tech_carpet: "30",
    tech_carpet_unit: "m",
    tech_price: "30",
    tech_price_unit: "cm²",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCarpetCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_shape == data?.payload?.tech_lang_keys[2]) {
      if (
        !formData.tech_shape ||
        !formData.tech_length ||
        !formData.tech_length_unit ||
        !formData.tech_width ||
        !formData.tech_width_unit ||
        !formData.tech_price ||
        !formData.tech_price_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_shape == data?.payload?.tech_lang_keys[3]) {
      if (
        !formData.tech_shape ||
        !formData.tech_radius ||
        !formData.tech_radius_unit ||
        !formData.tech_price ||
        !formData.tech_price_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_shape == data?.payload?.tech_lang_keys[4]) {
      if (
        !formData.tech_shape ||
        !formData.tech_axis_a ||
        !formData.tech_axis_a_unit ||
        !formData.tech_axis_b ||
        !formData.tech_axis_b_unit ||
        !formData.tech_price ||
        !formData.tech_price_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_shape == data?.payload?.tech_lang_keys[5]) {
      if (
        !formData.tech_shape ||
        !formData.tech_side ||
        !formData.tech_side_unit ||
        !formData.tech_price ||
        !formData.tech_price_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_shape == data?.payload?.tech_lang_keys[6]) {
      if (
        !formData.tech_shape ||
        !formData.tech_sides ||
        !formData.tech_sides_unit ||
        !formData.tech_price ||
        !formData.tech_price_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_shape == data?.payload?.tech_lang_keys[7]) {
      if (
        !formData.tech_shape ||
        !formData.tech_carpet ||
        !formData.tech_carpet_unit ||
        !formData.tech_price ||
        !formData.tech_price_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_shape: formData.tech_shape,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_radius: formData.tech_radius,
        tech_radius_unit: formData.tech_radius_unit,
        tech_axis_a: formData.tech_axis_a,
        tech_axis_a_unit: formData.tech_axis_a_unit,
        tech_axis_b: formData.tech_axis_b,
        tech_axis_b_unit: formData.tech_axis_b_unit,
        tech_side: formData.tech_side,
        tech_side_unit: formData.tech_side_unit,
        tech_sides: formData.tech_sides,
        tech_sides_unit: formData.tech_sides_unit,
        tech_carpet: formData.tech_carpet,
        tech_carpet_unit: formData.tech_carpet_unit,
        tech_price: formData.tech_price,
        tech_price_unit: formData.tech_price_unit,
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
      tech_shape: "Rectangle",
      tech_length: "8",
      tech_length_unit: "cm",
      tech_width: "30",
      tech_width_unit: "cm",
      tech_radius: "30",
      tech_radius_unit: "cm",
      tech_axis_a: "30",
      tech_axis_a_unit: "cm",
      tech_axis_b: "30",
      tech_axis_b_unit: "cm",
      tech_side: "30",
      tech_side_unit: "cm",
      tech_sides: "30",
      tech_sides_unit: "m",
      tech_carpet: "30",
      tech_carpet_unit: "m",
      tech_price: "30",
      tech_price_unit: "cm²",
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
    setFormData((prev) => ({ ...prev, tech_radius_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_axis_a_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_axis_b_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_side_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sides_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };
  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_carpet_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_price_unit: unit }));
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

          <input
            type="hidden"
            step="any"
            name="tech_currancy"
            id="tech_currancy"
            className="input my-2"
            aria-label="input"
            value={currency.symbol}
            onChange={handleChange}
          />

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-12 md:col-span-6">
                <div className="grid grid-cols-12 mt-3  gap-x-5">
                  <div className="col-span-12 md:col-span-12 mt-0">
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
                        <option value={data?.payload?.tech_lang_keys["2"]}>
                          {data?.payload?.tech_lang_keys["2"]}
                        </option>
                        <option value={data?.payload?.tech_lang_keys["3"]}>
                          {data?.payload?.tech_lang_keys["3"]}
                        </option>
                        <option value={data?.payload?.tech_lang_keys["4"]}>
                          {data?.payload?.tech_lang_keys["4"]}
                        </option>
                        <option value={data?.payload?.tech_lang_keys["5"]}>
                          {data?.payload?.tech_lang_keys["5"]}
                        </option>
                        <option value={data?.payload?.tech_lang_keys["6"]}>
                          {data?.payload?.tech_lang_keys["6"]}
                        </option>
                        <option value={data?.payload?.tech_lang_keys["7"]}>
                          {data?.payload?.tech_lang_keys["7"]}
                        </option>
                      </select>
                    </div>
                  </div>

                  {formData.tech_shape == data?.payload?.tech_lang_keys[2] && (
                    <>
                      <div className="col-span-12 md:col-span-12 mt-0 length">
                        <label htmlFor="tech_length" className="label">
                          {data?.payload?.tech_lang_keys["8"]}
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
                                { label: "dm", value: "dm" },
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

                  {formData.tech_shape == data?.payload?.tech_lang_keys[2] && (
                    <>
                      <div className="col-span-12 md:col-span-12 mt-0 width">
                        <label htmlFor="tech_width" className="label">
                          {data?.payload?.tech_lang_keys["9"]}
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
                                { label: "dm", value: "dm" },
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
                  {formData.tech_shape == data?.payload?.tech_lang_keys[3] && (
                    <>
                      <div className="col-span-12 md:col-span-12 mt-0  radius">
                        <label htmlFor="tech_radius" className="label">
                          {data?.payload?.tech_lang_keys["11"]} (r):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_radius"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_radius}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_radius_unit} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "dm", value: "dm" },
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
                  {formData.tech_shape == data?.payload?.tech_lang_keys[4] && (
                    <>
                      <div className="col-span-12 md:col-span-12 mt-0  axis_a">
                        <label htmlFor="tech_axis_a" className="label">
                          {data?.payload?.tech_lang_keys["12"]} (A):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_axis_a"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_axis_a}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_axis_a_unit} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "dm", value: "dm" },
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
                    </>
                  )}
                  {formData.tech_shape == data?.payload?.tech_lang_keys[4] && (
                    <>
                      <div className="col-span-12 md:col-span-12 mt-0  axis_b">
                        <label htmlFor="tech_axis_b" className="label">
                          {data?.payload?.tech_lang_keys["12"]} (B):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_axis_b"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_axis_b}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown4}
                          >
                            {formData.tech_axis_b_unit} ▾
                          </label>
                          {dropdownVisible4 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "dm", value: "dm" },
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
                  {formData.tech_shape == data?.payload?.tech_lang_keys[5] && (
                    <>
                      <div className="col-span-12 md:col-span-12 mt-0  side">
                        <label htmlFor="tech_side" className="label">
                          {data?.payload?.tech_lang_keys["13"]}:
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_side"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_side}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown5}
                          >
                            {formData.tech_side_unit} ▾
                          </label>
                          {dropdownVisible5 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "dm", value: "dm" },
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
                  {formData.tech_shape == data?.payload?.tech_lang_keys[6] && (
                    <>
                      <div className="col-span-12 md:col-span-12 mt-0  sides">
                        <label htmlFor="tech_sides" className="label">
                          {data?.payload?.tech_lang_keys["13"]}:
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_sides"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_sides}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown6}
                          >
                            {formData.tech_sides_unit} ▾
                          </label>
                          {dropdownVisible6 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "dm", value: "dm" },
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
                    </>
                  )}
                  {formData.tech_shape == data?.payload?.tech_lang_keys[7] && (
                    <>
                      <div className="col-span-12 md:col-span-12 mt-0  carpet">
                        <label htmlFor="tech_carpet" className="label">
                          {data?.payload?.tech_lang_keys["14"]}:
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_carpet"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_carpet}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown7}
                          >
                            {formData.tech_carpet_unit} ▾
                          </label>
                          {dropdownVisible7 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm²", value: "cm²" },
                                { label: "dm²", value: "dm²" },
                                { label: "m²", value: "m²" },
                                { label: "in²", value: "in²" },
                                { label: "ft²", value: "ft²" },
                                { label: "yd²", value: "yd²" },
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

                  <div className="col-span-12 md:col-span-12 mt-0 price">
                    <label htmlFor="tech_price" className="label">
                      {data?.payload?.tech_lang_keys["10"]}:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_price"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_price}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown8}
                      >
                        {formData.tech_price_unit} ▾
                      </label>
                      {dropdownVisible8 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm²", value: "cm²" },
                            { label: "dm²", value: "dm²" },
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
                </div>
              </div>
              <div className="col-span-8 md:col-span-6 flex items-center justify-center">
                <p className="altimge hidden">
                  {data?.payload?.tech_lang_keys[15]}
                </p>
                {formData.tech_shape == data?.payload?.tech_lang_keys[2] && (
                  <img
                    src="/images/Rectangle.webp"
                    alt="Rectangle"
                    className="max-width change_image"
                    width="150px"
                    height="150px"
                  />
                )}
                {formData.tech_shape == data?.payload?.tech_lang_keys[3] && (
                  <img
                    src="/images/cr_Circle.webp"
                    alt="cr_Circle"
                    className="max-width change_image"
                    width="150px"
                    height="150px"
                  />
                )}
                {formData.tech_shape == data?.payload?.tech_lang_keys[4] && (
                  <img
                    src="/images/ellipse.webp"
                    alt="ellipse"
                    className="max-width change_image"
                    width="150px"
                    height="150px"
                  />
                )}
                {formData.tech_shape == data?.payload?.tech_lang_keys[5] && (
                  <img
                    src="/images/Pentagon.webp"
                    alt="Pentagon"
                    className="max-width change_image"
                    width="150px"
                    height="150px"
                  />
                )}
                {formData.tech_shape == data?.payload?.tech_lang_keys[6] && (
                  <img
                    src="/images/Hexagon.webp"
                    alt="Hexagon"
                    className="max-width change_image"
                    width="150px"
                    height="150px"
                  />
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[70%] lg:w-[60%] overflow-auto text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="50%" className="border-b py-2">
                                  <strong>Carpet Area :</strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_answer).toFixed(4)}{" "}
                                  <span className="font-s-14">m²</span>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["16"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {currency?.symbol}{" "}
                                  {formData?.tech_price_unit === "m²"
                                    ? Number(result?.tech_sub_answer).toFixed(4)
                                    : formData?.tech_price_unit === "cm²"
                                    ? Number(
                                        result?.tech_sub_answer * 10000
                                      ).toFixed(4)
                                    : formData?.tech_price_unit === "dm²"
                                    ? Number(
                                        result?.tech_sub_answer * 100
                                      ).toFixed(4)
                                    : formData?.tech_price_unit === "in²"
                                    ? Number(
                                        result?.tech_sub_answer * 1550
                                      ).toFixed(4)
                                    : formData?.tech_price_unit === "ft²"
                                    ? Number(
                                        result?.tech_sub_answer * 10.764
                                      ).toFixed(4)
                                    : formData?.tech_price_unit === "yd²"
                                    ? Number(
                                        result?.tech_sub_answer * 1.196
                                      ).toFixed(4)
                                    : ""}
                                </td>
                              </tr>

                              <tr>
                                <td colSpan="2" className="pt-3 pb-1">
                                  {data?.payload?.tech_lang_keys[17]}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">cm² :</td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_answer * 10000).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">dm² :</td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_answer * 100).toFixed(4)}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">in² :</td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_answer * 1550).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">ft² :</td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_answer * 10.764).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">yd² :</td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_answer * 1.196).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>
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

export default CarpetCalculator;

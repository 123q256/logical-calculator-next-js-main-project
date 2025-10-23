"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useMulchCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MulchCalculator = () => {
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
    tech_m_shape: "0",
    tech_g: "g1",
    tech_check: "g1",
    tech_length: "24",
    tech_length1: "cm",
    tech_width: "10",
    tech_width1: "cm",
    tech_side1: "15",
    tech_side11: "cm",
    tech_side2: "15",
    tech_side21: "cm",
    tech_diameter: "15",
    tech_diameter1: "cm",
    tech_sqr_ft: "15",
    tech_sqr_ft1: "sq-ft",
    tech_depth: "15",
    tech_depth1: "cm",
    tech_m_type: "6",
    tech_price_bag: "",
    tech_bag_size: "",
    tech_bag_size1: "m³",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMulchCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_m_shape) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_m_shape: formData.tech_m_shape,
        tech_g: formData.tech_g,
        tech_check: formData.tech_check,
        tech_length: formData.tech_length,
        tech_length1: formData.tech_length1,
        tech_width: formData.tech_width,
        tech_width1: formData.tech_width1,
        tech_side1: formData.tech_side1,
        tech_side11: formData.tech_side11,
        tech_side2: formData.tech_side2,
        tech_side21: formData.tech_side21,
        tech_diameter: formData.tech_diameter,
        tech_diameter1: formData.tech_diameter1,
        tech_sqr_ft: formData.tech_sqr_ft,
        tech_sqr_ft1: formData.tech_sqr_ft1,
        tech_depth: formData.tech_depth,
        tech_depth1: formData.tech_depth1,
        tech_m_type: formData.tech_m_type,
        tech_price_bag: formData.tech_price_bag,
        tech_bag_size: formData.tech_bag_size,
        tech_bag_size1: formData.tech_bag_size1,
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
      tech_m_shape: "0",
      tech_g: "g1",
      tech_check: "g1",
      tech_length: "24",
      tech_length1: "m",
      tech_width: "10",
      tech_width1: "m",
      tech_side1: "10",
      tech_side11: "m",
      tech_side2: "10",
      tech_side21: "m",
      tech_diameter: "15",
      tech_diameter1: "m",
      tech_sqr_ft: "15",
      tech_sqr_ft1: "sq-ft",
      tech_depth: "15",
      tech_depth1: "cm",
      tech_m_type: "8",
      tech_price_bag: "",
      tech_bag_size: "",
      tech_bag_size1: "cm",
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
    setFormData((prev) => ({ ...prev, tech_length1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_width1: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_side11: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_side21: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_diameter1: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sqr_ft1: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_depth1: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };
  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_bag_size1: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  const [showDetails, setShowDetails] = useState(false); // Toggle state

  const handleToggle = () => {
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 ">
                <label htmlFor="tech_m_shape" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m_shape"
                    id="tech_m_shape"
                    value={formData.tech_m_shape}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_m_shape == "0" && (
                <>
                  <div className="col-span-12 chose ">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-12 md:col-span-6">
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
                          <span>{data?.payload?.tech_lang_keys["1"]}</span>
                        </label>
                      </div>
                      <div className="col-span-12 md:col-span-6">
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
                          <span>{data?.payload?.tech_lang_keys["2"]}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {formData.tech_m_shape == "0" && formData.tech_g === "g1" && (
                <>
                  <div className="col-span-6 length ">
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
                        {formData.tech_length1} ▾
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
                  <div className="col-span-6 width ">
                    <label htmlFor="tech_width" className="label">
                      {data?.payload?.tech_lang_keys["22"]}
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
                        {formData.tech_width1} ▾
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

              {formData.tech_m_shape == "2" && (
                <>
                  <div className="col-span-6 side1 ">
                    <label htmlFor="tech_side1" className="label">
                      {data?.payload?.tech_lang_keys["10"]} 1:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_side1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_side1}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_side11} ▾
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
                  <div className="col-span-6 side1 ">
                    <label htmlFor="tech_side2" className="label">
                      {data?.payload?.tech_lang_keys["10"]} 2:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_side2"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_side2}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_side21} ▾
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
                </>
              )}
              {formData.tech_m_shape == "1" && (
                <>
                  <div className="col-span-6 diameter">
                    <label htmlFor="tech_diameter" className="label">
                      {data?.payload?.tech_lang_keys["9"]} :
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
                        {formData.tech_diameter1} ▾
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

              {formData.tech_m_shape == "0" && formData.tech_g === "g2" && (
                <>
                  <div className="col-span-6 square ">
                    <label htmlFor="tech_sqr_ft" className="label">
                      {data?.payload?.tech_lang_keys["8"]} :
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_sqr_ft"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_sqr_ft}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_sqr_ft1} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "sq-ft", value: "sq-ft" },
                            { label: "acres", value: "acres" },
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

              <div className="col-span-6 depth">
                <label htmlFor="tech_depth" className="label">
                  {data?.payload?.tech_lang_keys["11"]} :
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
                    onClick={toggleDropdown6}
                  >
                    {formData.tech_depth1} ▾
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m_type" className="label">
                  {data?.payload?.tech_lang_keys["12"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m_type"
                    id="tech_m_type"
                    value={formData.tech_m_type}
                    onChange={handleChange}
                  >
                    <option value="0">Cedar</option>
                    <option value="1">Cypress</option>
                    <option value="2">Eucalyptus</option>
                    <option value="3">Hardwood</option>
                    <option value="4">Hemlock</option>
                    <option value="5">Pine</option>
                    <option value="6">Pine Needles</option>
                    <option value="7">Pine Nuggets</option>
                    <option value="8">Rubber</option>
                    <option value="9">Rubber Nuggets</option>
                    <option value="10">Wheat Straw</option>
                    <option value="11">Soil</option>
                  </select>
                </div>
              </div>

              {/* Toggle Header with Rotating Arrow */}
              <div
                className="col-span-12 cursor-pointer current_gpa flex items-center justify-center my-3"
                onClick={handleToggle}
              >
                <strong className="pe-lg-3">
                  {data?.payload?.tech_lang_keys["13"]}:
                </strong>
                <img
                  src="/images/new-down.webp"
                  className={`right button mx-3 transition-transform duration-300 ease-in-out ${
                    showDetails ? "rotate-90" : "rotate-0"
                  }`}
                  alt="arrow"
                  width="16px"
                  height="16px"
                />
              </div>
              {/* Toggle Content */}
              {showDetails && (
                <div className="col-span-12 current_input">
                  <div className="grid grid-cols-12 mt-3 gap-4">
                    {/* Price Input */}
                    <div className="lg:col-span-6 md:col-span-6 col-span-12 price">
                      <label htmlFor="tech_price_bag" className="label">
                        {data?.payload?.tech_lang_keys["14"]}:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_price_bag"
                          id="tech_price_bag"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_price_bag}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>

                    {formData.tech_m_type != "6" && (
                      <>
                        <div className="lg:col-span-6 md:col-span-6 col-span-12 optional">
                          <label htmlFor="tech_bag_size" className="label">
                            {data?.payload?.tech_lang_keys["23"]} :
                          </label>
                          <div className="relative w-full">
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
                              onClick={toggleDropdown7}
                            >
                              {formData.tech_bag_size1} ▾
                            </label>
                            {dropdownVisible7 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "m³", value: "m³" },
                                  { label: "cu ft", value: "cu ft" },
                                  { label: "cu yd", value: "cu yd" },
                                  { label: "liters", value: "liters" },
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
                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-1">
                        <div className="w-full md:w-[90%] lg:w-[60%] overflow-auto text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="50%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["15"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_cubic_yards} (cu yd)
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td colSpan="2" className="font-s-20 py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["16"]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td width="50%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["15"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_cubic_ft} cubic feet (cu ft)
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["15"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_cubic_meters} cubic meters (m³)
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["15"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_liters} liters
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["17"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_garden_size} sq.ft
                                </td>
                              </tr>

                              {/* First conditional block */}
                              {!result?.tech_total_cost1 &&
                                !result?.tech_total_cost &&
                                (formData?.tech_m_type == 6 ||
                                  formData?.tech_m_type == 10) && (
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["18"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_size1} sq.ft
                                    </td>
                                  </tr>
                                )}

                              {/* Second conditional block */}
                              {(result?.tech_size && result?.tech_total_cost) ||
                              (result?.tech_size1 &&
                                result?.tech_total_cost1) ? (
                                <>
                                  <tr>
                                    <td colSpan="2" className="font-s-20 py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </strong>
                                    </td>
                                  </tr>

                                  {formData?.tech_m_type == 6 ||
                                  formData?.tech_m_type == 10 ? (
                                    <>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["18"]}
                                        </td>
                                        <td className="border-b py-2">
                                          {result?.tech_size1}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["20"]}
                                        </td>
                                        <td className="border-b py-2">
                                          {result?.tech_total_cost1}{" "}
                                          {currency?.symbol}
                                        </td>
                                      </tr>
                                    </>
                                  ) : (
                                    <>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["21"]}
                                        </td>
                                        <td className="border-b py-2">
                                          {result?.tech_size}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["20"]}
                                        </td>
                                        <td className="border-b py-2">
                                          {result?.tech_total_cost}{" "}
                                          {currency?.symbol}
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                </>
                              ) : null}
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

export default MulchCalculator;

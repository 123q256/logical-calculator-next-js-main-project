"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useBeamDeflectionCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BeamDeflectionCalculator = () => {
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
    tech_operations: "1", //  1 2
    tech_shape_1: "1",
    tech_shape_2: "1",
    tech_first: "12",
    tech_unit1: "m",
    tech_six: "12",
    tech_unit6: "N/m",
    tech_seven: "12",
    tech_unit7: "N.m",
    tech_second: "12",
    tech_unit2: "N",
    tech_third: "12",
    tech_unit3: "kPa",
    tech_four: "12",
    tech_unit4: "m⁴",
    tech_five: "12",
    tech_unit5: "m",
    tech_shape1_extra: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBeamDeflectionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_shape_1: formData.tech_shape_1,
        tech_shape_2: formData.tech_shape_2,
        tech_first: formData.tech_first,
        tech_unit1: formData.tech_unit1,
        tech_six: formData.tech_six,
        tech_unit6: formData.tech_unit6,
        tech_seven: formData.tech_seven,
        tech_unit7: formData.tech_unit7,
        tech_second: formData.tech_second,
        tech_unit2: formData.tech_unit2,
        tech_third: formData.tech_third,
        tech_unit3: formData.tech_unit3,
        tech_four: formData.tech_four,
        tech_unit4: formData.tech_unit4,
        tech_five: formData.tech_five,
        tech_unit5: formData.tech_unit5,
        tech_shape1_extra: formData.tech_shape1_extra,
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
      tech_operations: "1", //  1 2
      tech_shape_1: "1",
      tech_shape_2: "1",
      tech_first: "12",
      tech_unit1: "m",
      tech_six: "12",
      tech_unit6: "N/m",
      tech_seven: "12",
      tech_unit7: "N.m",
      tech_second: "12",
      tech_unit2: "N",
      tech_third: "12",
      tech_unit3: "kPa",
      tech_four: "12",
      tech_unit4: "m⁴",
      tech_five: "12",
      tech_unit5: "m",
      tech_shape1_extra: "1",
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
    setFormData((prev) => ({ ...prev, tech_unit1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit6: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit7: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit2: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit3: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit4: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit5: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  const conversionFactors = {
    "MN·m²": 1,
    "kN·m²": 1000,
    "N·m²": 1000000,
    mm: 1,
    cm: 0.1,
    m: 0.001,
    in: 0.0393701,
    ft: 0.00328084,
  };

  const [firstUnit, setFirstUnit] = useState("N·m²");
  const [secondUnit, setSecondUnit] = useState("in");

  const stiffnessValue = Number(result?.tech_stiffness);
  const deflectionValue = Number(result?.tech_max_def);

  const convert = (value, unit) => {
    const factor = conversionFactors[unit] ?? 1;
    return (value * factor).toFixed(2);
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
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="grid grid-cols-12  gap-4">
                  <div className="col-span-12">
                    <label htmlFor="tech_operations" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_operations"
                        id="tech_operations"
                        value={formData.tech_operations}
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

                  {formData.tech_operations == "1" && (
                    <>
                      <div className="col-span-12 shape1">
                        <label htmlFor="tech_shape_1" className="label">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_shape_1"
                            id="tech_shape_1"
                            value={formData.tech_shape_1}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["5"]}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["6"]}{" "}
                            </option>
                            <option value="3">
                              {data?.payload?.tech_lang_keys["7"]}{" "}
                            </option>
                            <option value="4">
                              {data?.payload?.tech_lang_keys["8"]}{" "}
                            </option>
                            <option value="5">
                              {data?.payload?.tech_lang_keys["9"]}{" "}
                            </option>
                            <option value="6">
                              {data?.payload?.tech_lang_keys["10"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_operations == "2" && (
                    <>
                      <div className="col-span-12 shape2">
                        <label htmlFor="tech_shape_2" className="label">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_shape_2"
                            id="tech_shape_2"
                            value={formData.tech_shape_2}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["11"]}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["6"]}{" "}
                            </option>
                            <option value="3">
                              {data?.payload?.tech_lang_keys["7"]}{" "}
                            </option>
                            <option value="4">
                              {data?.payload?.tech_lang_keys["12"]}{" "}
                            </option>
                            <option value="5">
                              {data?.payload?.tech_lang_keys["13"]}{" "}
                            </option>
                            <option value="6">
                              {data?.payload?.tech_lang_keys["14"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-span-12 f1">
                    <label htmlFor="tech_first" className="label">
                      {data?.payload?.tech_lang_keys["15"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_first"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_first}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_unit1} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "mm", value: "mm" },
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

                  {((formData.tech_operations == "1" &&
                    formData.tech_shape_1 == "3") ||
                    (formData.tech_operations == "1" &&
                      formData.tech_shape_1 == "4") ||
                    (formData.tech_operations == "1" &&
                      formData.tech_shape_1 == "5") ||
                    (formData.tech_operations == "2" &&
                      formData.tech_shape_2 == "3") ||
                    (formData.tech_operations == "2" &&
                      formData.tech_shape_2 == "4") ||
                    (formData.tech_operations == "2" &&
                      formData.tech_shape_2 == "5")) && (
                    <>
                      <div className="col-span-12 f6">
                        {(formData.tech_operations == "1" &&
                          formData.tech_shape_1 == "4") ||
                        (formData.tech_operations == "1" &&
                          formData.tech_shape_1 == "5") ||
                        (formData.tech_operations == "2" &&
                          formData.tech_shape_2 == "4") ||
                        (formData.tech_operations == "2" &&
                          formData.tech_shape_2 == "5") ? (
                          <>
                            <label htmlFor="tech_six" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["28"]}{" "}
                            </label>
                          </>
                        ) : (
                          <label htmlFor="tech_six" className="label">
                            {" "}
                            {data?.payload?.tech_lang_keys["16"]}{" "}
                          </label>
                        )}

                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_six"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_six}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_unit6} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "N/m", value: "N/m" },
                                { label: "kN/m", value: "kN/m" },
                                { label: "ibf/in", value: "ibf/in" },
                                { label: "ibf/ft", value: "ibf/ft" },
                                { label: "dyn/cm", value: "dyn/cm" },
                                { label: "kip/ft", value: "kip/ft" },
                                { label: "kip/in", value: "kip/in" },
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
                  {((formData.tech_operations == "1" &&
                    formData.tech_shape_1 == "6") ||
                    (formData.tech_operations == "2" &&
                      formData.tech_shape_2 == "6")) && (
                    <>
                      <div className="col-span-12 f7">
                        {(formData.tech_operations == "1" &&
                          formData.tech_shape_1 == "6") ||
                        (formData.tech_operations == "2" &&
                          formData.tech_shape_2 == "6") ? (
                          <>
                            <label htmlFor="tech_seven" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["17"]}{" "}
                            </label>
                          </>
                        ) : (
                          <label htmlFor="tech_seven" className="label">
                            {" "}
                            {data?.payload?.tech_lang_keys["16"]}{" "}
                          </label>
                        )}

                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_seven"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_seven}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_unit7} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "N.m", value: "N.m" },
                                { label: "kgf.cm", value: "kgf.cm" },
                                { label: "J/rad", value: "J/rad" },
                                { label: "ibf.ft", value: "ibf.ft" },
                                { label: "ibf.in", value: "ibf.in" },
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
                  {((formData.tech_operations == "1" &&
                    formData.tech_shape_1 == "1") ||
                    (formData.tech_operations == "1" &&
                      formData.tech_shape_1 == "2") ||
                    (formData.tech_operations == "2" &&
                      formData.tech_shape_2 == "1") ||
                    (formData.tech_operations == "2" &&
                      formData.tech_shape_2 == "2")) && (
                    <>
                      <div className="col-span-12 f2">
                        <label htmlFor="tech_second" className="label">
                          {data?.payload?.tech_lang_keys["18"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_second"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_second}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_unit2} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "N", value: "N" },
                                { label: "kN", value: "kN" },
                                { label: "MN", value: "MN" },
                                { label: "GN", value: "GN" },
                                { label: "TN", value: "TN" },
                                { label: "ibf", value: "ibf" },
                                { label: "kip", value: "kip" },
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

                  <div className="col-span-12 f3">
                    <label htmlFor="tech_third" className="label">
                      {data?.payload?.tech_lang_keys["19"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_third"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_third}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_unit3} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Pa", value: "Pa" },
                            { label: "kPa", value: "kPa" },
                            { label: "MPa", value: "MPa" },
                            { label: "GPa", value: "GPa" },
                            { label: "kN/m²", value: "kN/m²" },
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
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 con">
                <div className="grid grid-cols-12  gap-4">
                  <div className="col-span-12 md:col-span-12 text-center">
                    {formData.tech_operations == "1" && (
                      <>
                        {formData.tech_shape_1 == "1" && (
                          <>
                            <img
                              src="/images/d1_img1.png"
                              alt="beam image"
                              width="100%"
                              height="100%"
                              className="set_img"
                            />
                          </>
                        )}
                        {formData.tech_shape_1 == "2" && (
                          <>
                            <img
                              src="/images/d1_img2.png"
                              alt="beam image"
                              width="100%"
                              height="100%"
                              className="set_img"
                            />
                          </>
                        )}
                        {formData.tech_shape_1 == "3" && (
                          <>
                            <img
                              src="/images/d1_img3.png"
                              alt="beam image"
                              width="100%"
                              height="100%"
                              className="set_img"
                            />
                          </>
                        )}
                        {formData.tech_shape_1 == "4" && (
                          <>
                            <img
                              src="/images/d1_img4.png"
                              alt="beam image"
                              width="100%"
                              height="100%"
                              className="set_img"
                            />
                          </>
                        )}
                        {formData.tech_shape_1 == "5" && (
                          <>
                            <img
                              src="/images/d1_img5.png"
                              alt="beam image"
                              width="100%"
                              height="100%"
                              className="set_img"
                            />
                          </>
                        )}
                        {formData.tech_shape_1 == "6" && (
                          <>
                            <img
                              src="/images/d1_img6.png"
                              alt="beam image"
                              width="100%"
                              height="100%"
                              className="set_img"
                            />
                          </>
                        )}
                      </>
                    )}

                    {formData.tech_operations == "2" && (
                      <>
                        {formData.tech_shape_2 == "1" && (
                          <>
                            <img
                              src="/images/d2_img1.png"
                              alt="beam image"
                              width="100%"
                              height="100%"
                              className="set_img"
                            />
                          </>
                        )}
                        {formData.tech_shape_2 == "2" && (
                          <>
                            <img
                              src="/images/d2_img2.png"
                              alt="beam image"
                              width="100%"
                              height="100%"
                              className="set_img"
                            />
                          </>
                        )}
                        {formData.tech_shape_2 == "3" && (
                          <>
                            <img
                              src="/images/d2_img3.png"
                              alt="beam image"
                              width="100%"
                              height="100%"
                              className="set_img"
                            />
                          </>
                        )}
                        {formData.tech_shape_2 == "4" && (
                          <>
                            <img
                              src="/images/d2_img4.png"
                              alt="beam image"
                              width="100%"
                              height="100%"
                              className="set_img"
                            />
                          </>
                        )}
                        {formData.tech_shape_2 == "5" && (
                          <>
                            <img
                              src="/images/d2_img5.png"
                              alt="beam image"
                              width="100%"
                              height="100%"
                              className="set_img"
                            />
                          </>
                        )}
                        {formData.tech_shape_2 == "6" && (
                          <>
                            <img
                              src="/images/d2_img6.png"
                              alt="beam image"
                              width="100%"
                              height="100%"
                              className="set_img"
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <div className="col-span-12 md:col-span-12 f4">
                    <label htmlFor="tech_four" className="label">
                      {data?.payload?.tech_lang_keys["20"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_four"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_four}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_unit4} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m⁴", value: "m⁴" },
                            { label: "cm⁴", value: "cm⁴" },
                            { label: "mm⁴", value: "mm⁴" },
                            { label: "in⁴", value: "in⁴" },
                            { label: "ft⁴", value: "ft⁴" },
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
                  {((formData.tech_operations == "1" &&
                    formData.tech_shape_1 == "2") ||
                    (formData.tech_operations == "2" &&
                      formData.tech_shape_2 == "2")) && (
                    <>
                      <div className="col-span-6 md:col-span-12 f5">
                        <label htmlFor="tech_five" className="label">
                          {data?.payload?.tech_lang_keys["21"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_five"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_five}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown6}
                          >
                            {formData.tech_unit5} ▾
                          </label>
                          {dropdownVisible6 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "m", value: "m" },
                                { label: "mm", value: "mm" },
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
                  {((formData.tech_operations == "1" &&
                    formData.tech_shape_1 == "4") ||
                    (formData.tech_operations == "1" &&
                      formData.tech_shape_1 == "6")) && (
                    <>
                      <div className="col-span-6 md:col-span-12 shape1_ex">
                        <label htmlFor="tech_shape1_extra" className="label">
                          {data?.payload?.tech_lang_keys["22"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_shape1_extra"
                            id="tech_shape1_extra"
                            value={formData.tech_shape1_extra}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["23"]}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["24"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
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
                      <div className="w-full">
                        <div className="w-full md:w-[90%] lg:w-[80%]  overflow-auto">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys[25]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {convert(stiffnessValue, firstUnit)}{" "}
                                    <select
                                      value={firstUnit}
                                      onChange={(e) =>
                                        setFirstUnit(e.target.value)
                                      }
                                      className="border-0 text-blue text-[16px] w-[90px] result_select_dropdown"
                                    >
                                      <option value="MN·m²">MN·m²</option>
                                      <option value="kN·m²">kN·m²</option>
                                      <option value="N·m²">N·m²</option>
                                    </select>
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys[26]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {convert(deflectionValue, secondUnit)}{" "}
                                    <select
                                      value={secondUnit}
                                      onChange={(e) =>
                                        setSecondUnit(e.target.value)
                                      }
                                      className="border-0 text-blue text-[16px] w-[80px] result_select_dropdown"
                                    >
                                      <option value="mm">mm</option>
                                      <option value="cm">cm</option>
                                      <option value="m">m</option>
                                      <option value="in">in</option>
                                      <option value="ft">ft</option>
                                    </select>
                                  </strong>
                                </td>
                              </tr>
                              {result?.tech_distance_b && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys[27]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {Number(
                                          result?.tech_distance_b
                                        ).toFixed(4)}{" "}
                                        (m)
                                      </strong>
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_x && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">x</td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {Number(result?.tech_x).toFixed(4)} (m)
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

export default BeamDeflectionCalculator;

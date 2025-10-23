"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTensionCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TensionCalculator = () => {
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
    tech_type: "1", //  1 2
    tech_operations1: "2",
    tech_operations2: "1",
    tech_first: "9",
    tech_unit1: "mg",
    tech_second: "56",
    tech_unit2: "mg",
    tech_third: "34",
    tech_unit3: "mg",
    tech_four: "9.865",
    tech_unit4: "m/s²",
    tech_six: "45",
    tech_unit6: "deg",
    tech_five: "50",
    tech_unit5: "deg",
    tech_seven: "7",
    tech_unit7: "N",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTensionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_operations1: formData.tech_operations1,
        tech_operations2: formData.tech_operations2,
        tech_first: formData.tech_first,
        tech_unit1: formData.tech_unit1,
        tech_second: formData.tech_second,
        tech_unit2: formData.tech_unit2,
        tech_third: formData.tech_third,
        tech_unit3: formData.tech_unit3,
        tech_four: formData.tech_four,
        tech_unit4: formData.tech_unit4,
        tech_six: formData.tech_six,
        tech_unit6: formData.tech_unit6,
        tech_five: formData.tech_five,
        tech_unit5: formData.tech_unit5,
        tech_seven: formData.tech_seven,
        tech_unit7: formData.tech_unit7,
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
      tech_type: "1", //  1 2
      tech_operations1: "2",
      tech_operations2: "1",
      tech_first: "9",
      tech_unit1: "mg",
      tech_second: "56",
      tech_unit2: "mg",
      tech_third: "34",
      tech_unit3: "mg",
      tech_four: "9.865",
      tech_unit4: "m/s²",
      tech_six: "45",
      tech_unit6: "deg",
      tech_five: "50",
      tech_unit5: "deg",
      tech_seven: "7",
      tech_unit7: "N",
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
    setFormData((prev) => ({ ...prev, tech_unit2: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit3: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit4: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit5: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit6: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit7: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-1  gap-4">
                <div className="space-y-2">
                  <label htmlFor="tech_type" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
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
                        {data?.payload?.tech_lang_keys["2"]}
                      </option>
                      <option value="2">
                        {data?.payload?.tech_lang_keys["3"]}
                      </option>
                    </select>
                  </div>
                </div>
                {formData.tech_type == "1" && (
                  <>
                    <div className="space-y-2" id="op1">
                      <label htmlFor="tech_operations1" className="label">
                        {data?.payload?.tech_lang_keys["4"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_operations1"
                          id="tech_operations1"
                          value={formData.tech_operations1}
                          onChange={handleChange}
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
                {formData.tech_type == "2" && (
                  <>
                    <div className="space-y-2 " id="op2">
                      <label htmlFor="tech_operations2" className="label">
                        {data?.payload?.tech_lang_keys["5"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_operations2"
                          id="tech_operations2"
                          value={formData.tech_operations2}
                          onChange={handleChange}
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {((formData.tech_type == "1" &&
                  formData.tech_operations1 == "1") ||
                  (formData.tech_type == "1" &&
                    formData.tech_operations1 == "2") ||
                  (formData.tech_type == "2" &&
                    formData.tech_operations2 == "1") ||
                  (formData.tech_type == "2" &&
                    formData.tech_operations2 == "3")) && (
                  <>
                    {/* Object's Mass */}
                    <div className="space-y-2 " id="a1">
                      {formData.tech_type == "2" &&
                      formData.tech_operations2 == "3" ? (
                        <>
                          <label htmlFor="tech_first" className="label">
                            First object's Mass:
                          </label>
                        </>
                      ) : (
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["6"]}
                        </label>
                      )}
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_first"
                          step="any"
                          className=" input"
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
                              { label: "mg", value: "mg" },
                              { label: "g", value: "g" },
                              { label: "kg", value: "kg" },
                              { label: "t", value: "t" },
                              { label: "oz", value: "oz" },
                              { label: "lb", value: "lb" },
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

                {((formData.tech_type == "2" &&
                  formData.tech_operations2 == "2") ||
                  (formData.tech_type == "2" &&
                    formData.tech_operations2 == "3")) && (
                  <>
                    <div className="space-y-2 " id="a11">
                      <label htmlFor="tech_second" className="label">
                        {data?.payload?.tech_lang_keys["7"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_second"
                          step="any"
                          className=" input"
                          value={formData.tech_second}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_unit2} ▾
                        </label>
                        {dropdownVisible1 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mg", value: "mg" },
                              { label: "g", value: "g" },
                              { label: "kg", value: "kg" },
                              { label: "t", value: "t" },
                              { label: "oz", value: "oz" },
                              { label: "lb", value: "lb" },
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

                {((formData.tech_type == "2" &&
                  formData.tech_operations2 == "2") ||
                  (formData.tech_type == "2" &&
                    formData.tech_operations2 == "3")) && (
                  <>
                    <div className="space-y-2 " id="a12">
                      <label htmlFor="tech_third" className="label">
                        {data?.payload?.tech_lang_keys["8"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_third"
                          step="any"
                          className=" input"
                          value={formData.tech_third}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown2}
                        >
                          {formData.tech_unit3} ▾
                        </label>
                        {dropdownVisible2 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mg", value: "mg" },
                              { label: "g", value: "g" },
                              { label: "kg", value: "kg" },
                              { label: "t", value: "t" },
                              { label: "oz", value: "oz" },
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

                {/* Gravitational */}
                {((formData.tech_type == "1" &&
                  formData.tech_operations1 == "1") ||
                  (formData.tech_type == "1" &&
                    formData.tech_operations1 == "2")) && (
                  <>
                    <div className="space-y-2 " id="a2">
                      <label htmlFor="tech_four" className="label">
                        {data?.payload?.tech_lang_keys["9"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_four"
                          step="any"
                          className=" input"
                          value={formData.tech_four}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown3}
                        >
                          {formData.tech_unit4} ▾
                        </label>
                        {dropdownVisible3 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "m/s²", value: "m/s²" },
                              { label: "g", value: "g" },
                              { label: "ft/s²", value: "ft/s²" },
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
                {formData.tech_type == "1" &&
                  formData.tech_operations1 == "2" && (
                    <>
                      <div className="space-y-2 " id="a4">
                        <label htmlFor="tech_six" className="label">
                          {data?.payload?.tech_lang_keys["10"]} β:
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_six"
                            step="any"
                            className=" input"
                            value={formData.tech_six}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown4}
                          >
                            {formData.tech_unit6} ▾
                          </label>
                          {dropdownVisible4 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "deg", value: "deg" },
                                { label: "rad", value: "rad" },
                                { label: "gon", value: "gon" },
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
              </div>
              <div className="grid grid-cols-1  lg:grid-cols-1 md:grid-cols-1  gap-4">
                <div className="w-full text-center">
                  {formData.tech_type == "1" ? (
                    <>
                      {formData.tech_type == "1" &&
                        formData.tech_operations1 == "1" && (
                          <>
                            <img
                              src="/images/tension1.png"
                              alt="Tension Calculator"
                              width="300px"
                              height="auto"
                              id="im"
                            />
                          </>
                        )}
                      {formData.tech_type == "1" &&
                        formData.tech_operations1 == "2" && (
                          <>
                            <img
                              src="/images/tension2.png"
                              alt="Tension Calculator"
                              width="300px"
                              height="auto"
                              id="im"
                            />
                          </>
                        )}
                    </>
                  ) : (
                    <>
                      {formData.tech_type == "2" &&
                        formData.tech_operations2 == "1" && (
                          <>
                            <img
                              src="/images/tension3.png"
                              alt="Tension Calculator"
                              width="300px"
                              height="auto"
                              id="im"
                            />
                          </>
                        )}
                      {formData.tech_type == "2" &&
                        formData.tech_operations2 == "2" && (
                          <>
                            <img
                              src="/images/tension4.png"
                              alt="Tension Calculator"
                              width="300px"
                              height="auto"
                              id="im"
                            />
                          </>
                        )}
                      {formData.tech_type == "2" &&
                        formData.tech_operations2 == "3" && (
                          <>
                            <img
                              src="/images/tension5.png"
                              alt="Tension Calculator"
                              width="300px"
                              height="auto"
                              id="im"
                            />
                          </>
                        )}
                    </>
                  )}
                </div>
                {((formData.tech_type == "1" &&
                  formData.tech_operations1 == "2") ||
                  (formData.tech_type == "2" &&
                    formData.tech_operations2 == "2") ||
                  (formData.tech_type == "2" &&
                    formData.tech_operations2 == "3") ||
                  (formData.tech_type == "2" &&
                    formData.tech_operations2 == "1") ||
                  (formData.tech_type == "2" &&
                    formData.tech_operations2 == "3")) && (
                  <>
                    <div className="space-y-2 " id="a3">
                      {(formData.tech_type == "1" &&
                        formData.tech_operations1 == "2") ||
                      (formData.tech_type == "2" &&
                        formData.tech_operations2 == "2") ||
                      (formData.tech_type == "2" &&
                        formData.tech_operations2 == "3") ? (
                        <>
                          <label htmlFor="tech_five" className="label">
                            {data?.payload?.tech_lang_keys["10"]} θ:
                          </label>
                        </>
                      ) : (
                        <>
                          <label htmlFor="tech_five" className="label">
                            {data?.payload?.tech_lang_keys["10"]} α:
                          </label>
                        </>
                      )}
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_five"
                          step="any"
                          className=" input"
                          value={formData.tech_five}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown5}
                        >
                          {formData.tech_unit5} ▾
                        </label>
                        {dropdownVisible5 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "deg", value: "deg" },
                              { label: "rad", value: "rad" },
                              { label: "gon", value: "gon" },
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
                {((formData.tech_type == "2" &&
                  formData.tech_operations2 == "1") ||
                  (formData.tech_type == "2" &&
                    formData.tech_operations2 == "3") ||
                  (formData.tech_type == "2" &&
                    formData.tech_operations2 == "2") ||
                  (formData.tech_type == "2" &&
                    formData.tech_operations2 == "3")) && (
                  <>
                    <div className="space-y-2 " id="a5">
                      <label htmlFor="tech_seven" className="label">
                        {data?.payload?.tech_lang_keys["11"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_seven"
                          step="any"
                          className=" input"
                          value={formData.tech_seven}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown6}
                        >
                          {formData.tech_unit7} ▾
                        </label>
                        {dropdownVisible6 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "N", value: "N" },
                              { label: "kN", value: "kN" },
                              { label: "MN", value: "MN" },
                              { label: "lbf", value: "lbf" },
                              { label: "kip", value: "kip" },
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
                    <div className="w-full radius-10 mt-3">
                      <div className="w-full">
                        <p className="col-12 mt-2 font-s-21">
                          <strong className="text-blue">
                            {data?.payload?.tech_lang_keys[12]}
                          </strong>
                        </p>
                        {result?.tech_weight ? (
                          <>
                            <div className="col-lg-6 mt-2 overflow-auto">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[13]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_weight).toFixed(3)}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[14]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_t_ans).toFixed(3)}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : result?.tech_weight2 ? (
                          <>
                            <div className="col-lg-6 mt-2 overflow-auto">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[13]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_weight2).toFixed(
                                          3
                                        )}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[14]} 1
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_t1_ans).toFixed(3)}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[14]} 2
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_t2_ans).toFixed(3)}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : result?.tech_op21 ? (
                          <>
                            <div className="col-lg-6 mt-2 overflow-auto">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[15]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_ans).toFixed(3)}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[14]} 1
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_op21).toFixed(3)}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : result?.tech_op22 ? (
                          <>
                            <div className="col-lg-6 mt-2 overflow-auto">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[15]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_ans).toFixed(3)}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[14]} 1
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_op22).toFixed(3)}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[14]} 2
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_answer2).toFixed(
                                          3
                                        )}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : result?.tech_op23 ? (
                          <>
                            <div className="col-lg-6 mt-2 overflow-auto">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[15]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_ans).toFixed(3)}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[14]} 1
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_answer2).toFixed(
                                          3
                                        )}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[14]} 2
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_op23).toFixed(3)}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[14]} 3
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_answer4).toFixed(
                                          3
                                        )}{" "}
                                        (N)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : null}
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

export default TensionCalculator;

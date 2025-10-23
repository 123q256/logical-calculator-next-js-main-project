"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useFenceCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FenceCalculator = () => {
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
    tech_f_length: 5,
    tech_fl_units: "mi",
    tech_post_space: 1,
    tech_po_units: "km",
    tech_drop1: "2",
    tech_first: 13,
    tech_units1: "m",
    tech_p_width: "9",
    tech_pw_units: "in",
    tech_p_spacing: "2",
    tech_ps_units: "mi",
    tech_drop2: "2",
    tech_second: 7,
    tech_drop3: "1",
    tech_third: 4,
    tech_units3: "cm",
    tech_four: "6",
    tech_units4: "ft",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFenceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_f_length) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_f_length: formData.tech_f_length,
        tech_fl_units: formData.tech_fl_units,
        tech_post_space: formData.tech_post_space,
        tech_po_units: formData.tech_po_units,
        tech_drop1: formData.tech_drop1,
        tech_first: formData.tech_first,
        tech_units1: formData.tech_units1,
        tech_p_width: formData.tech_p_width,
        tech_pw_units: formData.tech_pw_units,
        tech_p_spacing: formData.tech_p_spacing,
        tech_ps_units: formData.tech_ps_units,
        tech_drop2: formData.tech_drop2,
        tech_second: formData.tech_second,
        tech_drop3: formData.tech_drop3,
        tech_third: formData.tech_third,
        tech_units3: formData.tech_units3,
        tech_four: formData.tech_four,
        tech_units4: formData.tech_units4,
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
      tech_f_length: 5,
      tech_fl_units: "mi",
      tech_post_space: 1,
      tech_po_units: "km",
      tech_drop1: "2",
      tech_first: 13,
      tech_units1: "m",
      tech_p_width: "9",
      tech_pw_units: "in",
      tech_p_spacing: "2",
      tech_ps_units: "mi",
      tech_drop2: "2",
      tech_second: 7,
      tech_drop3: "1",
      tech_third: 4,
      tech_units3: "cm",
      tech_four: "6",
      tech_units4: "ft",
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
    setFormData((prev) => ({ ...prev, tech_fl_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_po_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units1: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pw_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ps_units: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units3: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units4: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_f_length" className="label">
                  {data?.payload?.tech_lang_keys["6"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_f_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_f_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_fl_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "yd", value: "yd" },
                        { label: "mi", value: "mi" },
                        { label: "km", value: "km" },
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
              <div className="space-y-2">
                <label htmlFor="tech_post_space" className="label">
                  {data?.payload?.tech_lang_keys["7"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_post_space"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_post_space}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_po_units} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "yd", value: "yd" },
                        { label: "mi", value: "mi" },
                        { label: "km", value: "km" },
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
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div className="mt-0 my-lg-2 -lg-3 chose">
                <label className="pe-2" htmlFor="a">
                  <input
                    type="radio"
                    name="tech_drop1"
                    value="2"
                    id="a"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_drop1 === "2"}
                  />
                  <span>{data?.payload?.tech_lang_keys["8"]}</span>
                </label>
                <label htmlFor="b">
                  <input
                    type="radio"
                    name="tech_drop1"
                    className="mr-2 border"
                    value="1"
                    id="b"
                    onChange={handleChange}
                    checked={formData.tech_drop1 === "1"}
                  />
                  <span>{data?.payload?.tech_lang_keys["9"]}</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_first" className="label">
                  {formData.tech_drop1 && formData.tech_drop1 !== "1"
                    ? data?.payload?.tech_lang_keys["8"]
                    : data?.payload?.tech_lang_keys["9"]}
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
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_units1} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "yd", value: "yd" },
                        { label: "mi", value: "mi" },
                        { label: "km", value: "km" },
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
            <div className="grid grid-cols-1 mt-2  gap-4">
              <p className="mt-2">
                <strong>{data?.payload?.tech_lang_keys["10"]}</strong>
              </p>
            </div>
            <div className="grid grid-cols-2 mt-2  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_p_width" className="label">
                  {data?.payload?.tech_lang_keys["11"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_p_width"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_p_width}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_pw_units} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "yd", value: "yd" },
                        { label: "mi", value: "mi" },
                        { label: "km", value: "km" },
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
              <div className="space-y-2">
                <label htmlFor="tech_p_spacing" className="label">
                  {data?.payload?.tech_lang_keys["12"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_p_spacing"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_p_spacing}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown4}
                  >
                    {formData.tech_ps_units} ▾
                  </label>
                  {dropdownVisible4 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "yd", value: "yd" },
                        { label: "mi", value: "mi" },
                        { label: "km", value: "km" },
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
            <div className="grid grid-cols-1   mt-2 gap-4">
              <p className="mt-2">
                <strong>{data?.payload?.tech_lang_keys["13"]}</strong>
              </p>
            </div>
            <div className="grid grid-cols-1 mt-2  gap-4">
              <div className="mt-0 my-lg-2 -lg-3 chose ">
                <label className="pe-2" htmlFor="c">
                  <input
                    type="radio"
                    name="tech_drop2"
                    value="2"
                    id="c"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_drop2 === "2"}
                  />
                  <span>{data?.payload?.tech_lang_keys["14"]}</span>
                </label>
                <label htmlFor="d">
                  <input
                    type="radio"
                    name="tech_drop2"
                    className="mr-2 border"
                    value="1"
                    id="d"
                    onChange={handleChange}
                    checked={formData.tech_drop2 === "1"}
                  />
                  <span>{data?.payload?.tech_lang_keys["15"]}</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-2  gap-4">
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_second" className="label">
                  {formData.tech_drop2 && formData.tech_drop2 == "1"
                    ? data?.payload?.tech_lang_keys["15"]
                    : data?.payload?.tech_lang_keys["14"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_second"
                    id="tech_second"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_second}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1  mt-2  gap-4">
              <p className="mt-2">
                <strong>{data?.payload?.tech_lang_keys["17"]}</strong>
              </p>
            </div>
            <div className="grid grid-cols-1  mt-2 gap-4">
              <div className="mt-0 my-lg-2 -lg-3 chose">
                <label className="pe-2" htmlFor="e">
                  <input
                    type="radio"
                    name="tech_drop3"
                    value="1"
                    id="e"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_drop3 === "1"}
                  />
                  <span>{data?.payload?.tech_lang_keys["18"]}</span>
                </label>
                <label htmlFor="f">
                  <input
                    type="radio"
                    name="tech_drop3"
                    className="mr-2 border"
                    value="2"
                    id="f"
                    onChange={handleChange}
                    checked={formData.tech_drop3 === "2"}
                  />
                  <span>{data?.payload?.tech_lang_keys["19"]}</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 mt-2  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_third" className="label">
                  {formData.tech_drop3 && formData.tech_drop3 !== "1"
                    ? data?.payload?.tech_lang_keys["31"]
                    : data?.payload?.tech_lang_keys["20"]}
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
                    onClick={toggleDropdown5}
                  >
                    {formData.tech_units3} ▾
                  </label>
                  {dropdownVisible5 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "yd", value: "yd" },
                        { label: "mi", value: "mi" },
                        { label: "km", value: "km" },
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
              {formData.tech_drop3 === "1" && (
                <>
                  <div className="space-y-2 third_div">
                    <label htmlFor="tech_four" className="label">
                      {data?.payload?.tech_lang_keys["21"]}
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
                        onClick={toggleDropdown6}
                      >
                        {formData.tech_units4} ▾
                      </label>
                      {dropdownVisible6 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "km", value: "km" },
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />
                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className=" my-2 grid grid-cols-12 gap-2">
                        <div className="col-span-12 md:col-span-10 text-[18px]">
                          <table className="">
                            <tbody>
                              {result?.tech_no_post && (
                                <tr>
                                  <td width="70%" className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["16"]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_no_post}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_no_sections && (
                                <tr className="rounded-top bg-light bg-opacity-50">
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["22"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_no_sections}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_post_heigth && (
                                <tr className="bg-light bg-opacity-50">
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["8"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_post_heigth}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_fence_heigth && (
                                <tr className="bg-light bg-opacity-50">
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_fence_heigth}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_no_rails && (
                                <tr className="bg-light bg-opacity-50">
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["14"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_no_rails}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_rails_section && (
                                <tr className="bg-light bg-opacity-50">
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["15"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_rails_section}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_no_pickets && (
                                <tr className="bg-light bg-opacity-50">
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["23"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_no_pickets}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_c_volume && (
                                <tr className="rounded-bottom bg-light bg-opacity-50">
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["24"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_c_volume} in³
                                  </td>
                                </tr>
                              )}

                              {result?.tech_ft_volume && (
                                <tr className="rounded-bottom bg-body-secondary bg-opacity-50">
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["25"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_ft_volume} ft³
                                  </td>
                                </tr>
                              )}

                              {result?.tech_yd_volume && (
                                <tr className="rounded-bottom bg-light bg-opacity-50">
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["26"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_yd_volume} yd³
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>

                          <p className="mt-3 mb-2">
                            {data?.payload?.tech_lang_keys["27"]}
                          </p>
                          <table className="">
                            <tbody>
                              <tr className="rounded-top bg-light bg-opacity-50">
                                <td width="70%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["28"]}
                                </td>
                                <td className="border-b py-2">
                                  {" "}
                                  3 {currency.symbol} - 7 {currency.symbol}{" "}
                                </td>
                              </tr>
                              <tr className="bg-body-secondary bg-opacity-50">
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["29"]}
                                </td>
                                <td className="border-b py-2">
                                  18 {currency.symbol} - 35 {currency.symbol}
                                </td>
                              </tr>
                              <tr className="bg-light bg-opacity-50">
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["30"]}
                                </td>
                                <td className="border-b py-2">
                                  25 {currency.symbol} - 50 {currency.symbol}
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

export default FenceCalculator;

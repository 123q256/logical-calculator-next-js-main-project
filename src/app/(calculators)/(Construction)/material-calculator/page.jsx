"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useMaterialCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MaterialCalculator = () => {
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
    tech_operations: "2",
    tech_first: "3",
    tech_units1: "cm",
    tech_second: "4",
    tech_units2: "cm",
    tech_ex_drop: "105",
    tech_third: "5",
    tech_units3: "ft",
    tech_four: "6",
    tech_units4: "ft",
    tech_five: "5",
    tech_units5: "in³",
    tech_six: "8",
    tech_units6: "lb",
    tech_seven: "8",
    tech_currancy: "$",
    tech_units7: "in³",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMaterialCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations || !formData.tech_first) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_first: formData.tech_first,
        tech_units1: formData.tech_units1,
        tech_second: formData.tech_second,
        tech_units2: formData.tech_units2,
        tech_ex_drop: formData.tech_ex_drop,
        tech_third: formData.tech_third,
        tech_units3: formData.tech_units3,
        tech_four: formData.tech_four,
        tech_units4: formData.tech_units4,
        tech_five: formData.tech_five,
        tech_units5: formData.tech_units5,
        tech_six: formData.tech_six,
        tech_units6: formData.tech_units6,
        tech_seven: formData.tech_seven,
        tech_currancy: formData.tech_currancy,
        tech_units7: formData.tech_units7,
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
      tech_operations: "2",
      tech_first: "3",
      tech_units1: "cm",
      tech_second: "3",
      tech_units2: "cm",
      tech_ex_drop: "105",
      tech_third: "3",
      tech_units3: "ft",
      tech_four: "6",
      tech_units4: "ft",
      tech_five: "5",
      tech_units5: "in³",
      tech_six: "8",
      tech_units6: "lb",
      tech_seven: "8",
      tech_currancy: "$",
      tech_units7: "in³",
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
    setFormData((prev) => ({ ...prev, tech_units1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units2: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units3: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units4: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units5: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units6: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units7: unit }));
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
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
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_operations == "1" && (
                <>
                  {/* length */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_first" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
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
                        {formData.tech_units1} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "cm", value: "cm" },
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
                </>
              )}
              {formData.tech_operations == "1" && (
                <>
                  {/* width */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_second" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
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
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_units2} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "cm", value: "cm" },
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
                </>
              )}
              {(formData.tech_operations == "1" ||
                formData.tech_operations == "2" ||
                formData.tech_operations == "3") && (
                <>
                  {/* Density */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_ex_drop" className="label">
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_ex_drop"
                        id="tech_ex_drop"
                        value={formData.tech_ex_drop}
                        onChange={handleChange}
                      >
                        <option value="105">
                          {data?.payload?.tech_lang_keys[10]} - 105 lb/ft³
                        </option>
                        <option value="150">
                          {data?.payload?.tech_lang_keys[11]} - 150 lb/ft³
                        </option>
                        <option value="160">
                          {data?.payload?.tech_lang_keys[12]} - 160 lb/ft³
                        </option>
                        <option value="145">
                          {data?.payload?.tech_lang_keys[13]} - 145 lb/ft³
                        </option>
                        <option value="168">
                          {data?.payload?.tech_lang_keys[14]} - 168 lb/ft³
                        </option>
                        <option value="160">
                          {data?.payload?.tech_lang_keys[15]} - 160 lb/ft³
                        </option>
                        <option value="168">
                          {data?.payload?.tech_lang_keys[16]} - 168 lb/ft³
                        </option>
                        <option value="188">
                          {data?.payload?.tech_lang_keys[17]} - 188 lb/ft³
                        </option>
                        <option value="100">
                          {data?.payload?.tech_lang_keys[18]} - 100 lb/ft³
                        </option>
                        <option value="100">
                          {data?.payload?.tech_lang_keys[19]} - 100 lb/ft³
                        </option>
                        <option value="168">
                          {data?.payload?.tech_lang_keys[16]} - 168 lb/ft³
                        </option>
                        <option value="188">
                          {data?.payload?.tech_lang_keys[17]} - 188 lb/ft³
                        </option>
                        <option value="100">
                          {data?.payload?.tech_lang_keys[18]} - 100 lb/ft³
                        </option>
                        <option value="100">
                          {data?.payload?.tech_lang_keys[19]} - 100 lb/ft³
                        </option>
                        <option value="110">
                          {data?.payload?.tech_lang_keys[20]} - 110 lb/ft³
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "1" ||
                formData.tech_operations == "2") && (
                <>
                  {/* Depth */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_third" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
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
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_units3} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "cm", value: "cm" },
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
                </>
              )}
              {formData.tech_operations == "2" && (
                <>
                  {/* Area: */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_four" className="label">
                      {data?.payload?.tech_lang_keys["8"]}
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
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_units4} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
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
              {formData.tech_operations == "3" && (
                <>
                  {/* Volume */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_five" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
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
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_units5} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in³", value: "in³" },
                            { label: "ft³", value: "ft³" },
                            { label: "yd³", value: "yd³" },
                            { label: "cm³", value: "cm³" },
                            { label: "m³", value: "m³" },
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
              {(formData.tech_operations == "1" ||
                formData.tech_operations == "2" ||
                formData.tech_operations == "3") && (
                <>
                  {/* Price per Unit of Mass: */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_six" className="label">
                      {data?.payload?.tech_lang_keys["21"]}
                    </label>
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
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_units6} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "lb", value: "lb" },
                            { label: "t", value: "t" },
                            { label: "long t", value: "long t" },
                            { label: "kg", value: "kg" },
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
              {(formData.tech_operations == "1" ||
                formData.tech_operations == "2" ||
                formData.tech_operations == "3") && (
                <>
                  {/* Price per Unit of Volume: */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_seven" className="label">
                      {data?.payload?.tech_lang_keys["22"]}
                    </label>
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
                        onClick={toggleDropdown6}
                      >
                        {formData.tech_units7} ▾
                      </label>
                      {dropdownVisible6 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in³", value: "in³" },
                            { label: "ft³", value: "ft³" },
                            { label: "yd³", value: "yd³" },
                            { label: "cm³", value: "cm³" },
                            { label: "m³", value: "m³" },
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="row mt-1">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto text-[16px]">
                          <table className=" w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[27]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_weight / 2000).toFixed(
                                    4
                                  )}
                                  <span className="font_size18 black-text">
                                    {" "}
                                    tons
                                  </span>
                                </td>
                              </tr>
                              {formData?.tech_operationss == "1" && (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>Area :</strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {" "}
                                      {Number(result?.tech_area).toFixed(4)}
                                      <span className="font_size18 black-text">
                                        {" "}
                                        in²
                                      </span>
                                    </td>
                                  </tr>
                                </>
                              )}
                              {(formData?.tech_operationss == "1" ||
                                formData?.tech_operationss == "2") && (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_volume).toFixed(4)}
                                      <span className="font_size18 black-text">
                                        {" "}
                                        in³
                                      </span>
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_cost_mass && (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[24]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_cost_mass).toFixed(
                                        4
                                      )}
                                    </td>
                                  </tr>
                                </>
                              )}

                              {!result?.tech_seven && (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[25]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_cost_volume).toFixed(
                                        4
                                      )}
                                    </td>
                                  </tr>
                                </>
                              )}

                              <tr>
                                <td colSpan="2" className="pt-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["26"]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">lbs</td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_weight).toFixed(4)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">long tons</td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_weight / 2240).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">kgs</td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_weight / 2.205).toFixed(
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

export default MaterialCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCubicYardCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CubicYardCalculator = () => {
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
    tech_operations: "3",
    tech_extra_area: "8",
    tech_extra_units: "ft²",
    tech_first: "8",
    tech_units1: "in",
    tech_second: "8",
    tech_units2: "in",
    tech_third: "8",
    tech_units3: "in",
    tech_four: "17",
    tech_units4: "in",
    tech_five: "17",
    tech_units5: "in",
    tech_fiveb: "17",
    tech_price: "",
    tech_price_unit: "ft³",
    tech_currancy: null,
    tech_quantity: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCubicYardCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations || !formData.tech_extra_area) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_extra_area: formData.tech_extra_area,
        tech_extra_units: formData.tech_extra_units,
        tech_first: formData.tech_first,
        tech_units1: formData.tech_units1,
        tech_second: formData.tech_second,
        tech_units2: formData.tech_units2,
        tech_third: formData.tech_third,
        tech_units3: formData.tech_units3,
        tech_four: formData.tech_four,
        tech_units4: formData.tech_units4,
        tech_five: formData.tech_five,
        tech_units5: formData.tech_units5,
        tech_fiveb: formData.tech_fiveb,
        tech_price: formData.tech_price,
        tech_price_unit: formData.tech_price_unit,
        tech_currancy: formData.tech_currancy,
        tech_quantity: formData.tech_quantity,
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
      tech_operations: "3",
      tech_extra_area: "8",
      tech_extra_units: "ft²",
      tech_first: "8",
      tech_units1: "in",
      tech_second: "8",
      tech_units2: "in",
      tech_third: "8",
      tech_units3: "in",
      tech_four: "17",
      tech_units4: "in",
      tech_five: "17",
      tech_units5: "in",
      tech_fiveb: "17",
      tech_price: "",
      tech_price_unit: "ft³",
      tech_currancy: null,
      tech_quantity: "1",
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
    setFormData((prev) => ({ ...prev, tech_extra_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units1: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units2: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units3: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units4: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units5: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_price_unit: unit }));
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-5">
              <div className="space-y-2">
                <div className="grid grid-cols-1  gap-2 ">
                  <div className="space-y-2 ">
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
                        <option value="3">
                          {data?.payload?.tech_lang_keys["2"]}
                        </option>
                        <option value="4">
                          {data?.payload?.tech_lang_keys["3"]}{" "}
                        </option>
                        <option value="5">
                          {data?.payload?.tech_lang_keys["4"]}{" "}
                        </option>
                        <option value="6">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                        </option>
                        <option value="7">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                        </option>
                        <option value="8">
                          {data?.payload?.tech_lang_keys["7"]}{" "}
                        </option>
                        <option value="9">
                          {data?.payload?.tech_lang_keys["8"]}{" "}
                        </option>
                        <option value="10">
                          {data?.payload?.tech_lang_keys["9"]}{" "}
                        </option>
                        <option value="11">
                          {data?.payload?.tech_lang_keys["10"]}{" "}
                        </option>
                        <option value="12">
                          {data?.payload?.tech_lang_keys["11"]}{" "}
                        </option>
                        <option value="13">
                          {data?.payload?.tech_lang_keys["12"]}{" "}
                        </option>
                        <option value="14">
                          {data?.payload?.tech_lang_keys["13"]}{" "}
                        </option>
                        <option value="15">
                          {data?.payload?.tech_lang_keys["14"]}{" "}
                        </option>
                        <option value="16">
                          {data?.payload?.tech_lang_keys["15"]}{" "}
                        </option>
                        <option value="17">
                          {data?.payload?.tech_lang_keys["16"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  {(formData.tech_operations == "16" ||
                    formData.tech_operations == "17") && (
                    <>
                      <div className="" id="area">
                        <label htmlFor="tech_extra_area" className="label">
                          {data?.payload?.tech_lang_keys["17"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_extra_area"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_extra_area}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_extra_units} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "in²", value: "in²" },
                                { label: "ft²", value: "ft²" },
                                { label: "cm²", value: "cm²" },
                                { label: "m²", value: "m²" },
                                { label: "yd²", value: "yd²" },
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
                  {(formData.tech_operations == "3" ||
                    formData.tech_operations == "4" ||
                    formData.tech_operations == "5" ||
                    formData.tech_operations == "6" ||
                    formData.tech_operations == "7" ||
                    formData.tech_operations == "8" ||
                    formData.tech_operations == "9" ||
                    formData.tech_operations == "10" ||
                    formData.tech_operations == "11" ||
                    formData.tech_operations == "12" ||
                    formData.tech_operations == "13" ||
                    formData.tech_operations == "14" ||
                    formData.tech_operations == "15") && (
                    <>
                      <div className=" first" id="1">
                        {formData.tech_operations == "3" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["18"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "4" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["18"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "5" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["18"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "6" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["18"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "7" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["18"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "8" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["18"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "9" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["18"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "10" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["18"]}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "11" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {" "}
                              Length and Depth / Height:
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "12" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {" "}
                              Radius:{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "13" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {" "}
                              Outer Radius:{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "14" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {" "}
                              Radius:{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "15" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              Radius:
                            </label>
                          </>
                        )}

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
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_units1} ▾
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
                  {(formData.tech_operations == "3" ||
                    formData.tech_operations == "4" ||
                    formData.tech_operations == "5" ||
                    formData.tech_operations == "6" ||
                    formData.tech_operations == "7" ||
                    formData.tech_operations == "8" ||
                    formData.tech_operations == "9" ||
                    formData.tech_operations == "10" ||
                    formData.tech_operations == "12" ||
                    formData.tech_operations == "13" ||
                    formData.tech_operations == "15" ||
                    formData.tech_operations == "16" ||
                    formData.tech_operations == "17") && (
                    <>
                      <div className=" second" id="2">
                        {formData.tech_operations == "3" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["19"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "4" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {" "}
                              Side Length:{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "5" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {" "}
                              Inner Length:{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "6" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {" "}
                              Diameter:{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "7" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {" "}
                              Inner Diameter:{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "8" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {" "}
                              Outer Diameter:{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "9" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {" "}
                              Side a Length:{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "10" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              Side a Length:
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "12" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {" "}
                              Depth / Height:
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "13" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              Inner Radius:{" "}
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "15" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              Depth / Height:
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "16" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              Depth / Height:
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "17" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              Depth / Height:
                            </label>
                          </>
                        )}

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
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_units2} ▾
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
                  {(formData.tech_operations == "3" ||
                    formData.tech_operations == "5" ||
                    formData.tech_operations == "7" ||
                    formData.tech_operations == "8" ||
                    formData.tech_operations == "9" ||
                    formData.tech_operations == "10" ||
                    formData.tech_operations == "13") && (
                    <>
                      <div className=" third" id="3">
                        {formData.tech_operations == "3" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["20"]}
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "5" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              {" "}
                              Inner Width:
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "7" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              {" "}
                              Border Width:{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "8" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              {" "}
                              Inner Diameter:{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "9" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              {" "}
                              Side b Length:{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "10" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              Side b Length:
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "13" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              Depth:{" "}
                            </label>
                          </>
                        )}

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
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_units3} ▾
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
                  {(formData.tech_operations == "5" ||
                    formData.tech_operations == "9" ||
                    formData.tech_operations == "10") && (
                    <>
                      <div className=" four" id="4">
                        {formData.tech_operations == "3" && (
                          <>
                            <label htmlFor="tech_four" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["21"]}
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "5" && (
                          <>
                            <label htmlFor="tech_four" className="label">
                              {" "}
                              Border Width:
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "9" && (
                          <>
                            <label htmlFor="tech_four" className="label">
                              {" "}
                              Side c Length:
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "10" && (
                          <>
                            <label htmlFor="tech_four" className="label">
                              {" "}
                              Height h{" "}
                            </label>
                          </>
                        )}

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
                            onClick={toggleDropdown4}
                          >
                            {formData.tech_units4} ▾
                          </label>
                          {dropdownVisible4 && (
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

                  {/* <div className=" five" id="5">

                                  <label htmlFor="tech_five" className="label" >
                                    {data?.payload?.tech_lang_keys["22"]}
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
                                          onClick={toggleDropdown5}
                                        >
                                          {formData.tech_units5} ▾
                                        </label>
                                        {dropdownVisible5 && (
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
                                                onClick={() => setUnitHandler5(unit.value)}
                                              >
                                                {unit.label}
                                              </p>
                                            ))}
                                          </div>
                                          )}
                                      </div>

                                 
                              </div>
                              <div className="  fiveb" id="5b">
                                 <label htmlFor="tech_fiveb" className="label">
                                  {data?.payload?.tech_lang_keys["23"]}:
                                    </label>
                                    <div className=" relative">
                                    <input
                                      type="number"
                                      step="any"
                                      name="tech_fiveb"
                                      id="tech_fiveb"
                                      className="input my-2"
                                      aria-label="input"
                                       placeholder="00"
                                      value={formData.tech_fiveb}
                                      onChange={handleChange}
                                    />
                                    </div>
                              </div>
                                 */}

                  <div className=" price">
                    <label htmlFor="tech_price" className="label">
                      {data?.payload?.tech_lang_keys["25"]}
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
                        onClick={toggleDropdown6}
                      >
                        {formData.tech_price_unit} ▾
                      </label>
                      {dropdownVisible6 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            {
                              label: currency.symbol + " ft³",
                              value: currency.symbol + " ft³",
                            },
                            {
                              label: currency.symbol + " yd³",
                              value: currency.symbol + " yd³",
                            },
                            {
                              label: currency.symbol + " m³",
                              value: currency.symbol + " m³",
                            },
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

                    <input
                      type="hidden"
                      name="tech_currancy"
                      id="tech_currancy"
                      className="input my-2"
                      value={currency.symbol}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="">
                <div className="grid grid-cols-1  ">
                  <div className=" quantity" id="6">
                    <label htmlFor="tech_quantity" className="label">
                      {data?.payload?.tech_lang_keys["24"]}:
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
                    </div>
                  </div>
                  <div className=" ">
                    {formData.tech_operations == "3" && (
                      <>
                        <img
                          src="/images/cubic-yards-rectangle.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "4" && (
                      <>
                        <img
                          src="/images/cubic-yards-square.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "5" && (
                      <>
                        <img
                          src="/images/cubic-yards-rectangle-border.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "6" && (
                      <>
                        <img
                          src="/images/cubic-yards-circle.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "7" && (
                      <>
                        <img
                          src="/images/cubic-yards-circle-border.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "8" && (
                      <>
                        <img
                          src="/images/cubic-yards-annulus.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "9" && (
                      <>
                        <img
                          src="/images/cubic-yards-annulus.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "10" && (
                      <>
                        <img
                          src="/images/cubic-yards-trapezoid.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "11" && (
                      <>
                        <img
                          src="/images/cube_yard.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "12" && (
                      <>
                        <img
                          src="/images/cylinder_yard.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "13" && (
                      <>
                        <img
                          src="/images/hollow-cylinder_yard.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "14" && (
                      <>
                        <img
                          src="/images/hemisphere_yard.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "15" && (
                      <>
                        <img
                          src="/images/cone_yard.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "16" && (
                      <>
                        <img
                          src="/images/pyramid_yard.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "17" && (
                      <>
                        <img
                          src="/images/other_yard.png"
                          alt="Tank First"
                          className="max-width"
                          id="im"
                          width="100%"
                          height="300px"
                        />
                      </>
                    )}
                  </div>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[80%] lg:w-[60%] font-s-18">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["26"]} ft³ :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_cubic_feet}ft³
                                </td>
                              </tr>
                              {result?.tech_estimated_price && (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["27"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {result?.tech_estimated_price}
                                    </td>
                                  </tr>
                                </>
                              )}
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["28"]} in³ :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_cubic_in} in³
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["28"]} cm³ :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_cubic_cm} cm³
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["28"]} m³ :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_cubic_meter} m³
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["28"]} yards³ :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_cubic_yard} yd³
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

export default CubicYardCalculator;

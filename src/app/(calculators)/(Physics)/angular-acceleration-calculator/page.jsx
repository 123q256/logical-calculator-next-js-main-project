"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAngularAccelerationCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AngularAccelerationCalculator = () => {
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
    tech_find: "0", //  0 1  2
    tech_select1: "angular_acceleration",
    tech_select2: "angular_acceleration_two",
    tech_select3: "angular_acceleration_three",
    tech_ta: "5",
    tech_ta_unit: "m/s²",
    tech_ra: "5",
    tech_ra_unit: "mm",
    tech_aa: "50",
    tech_torque: "50",
    tech_moment: "50",
    tech_inv: "5",
    tech_inv_unit: "rad/s",
    tech_fnv: "5",
    tech_fnv_unit: "rad/s",
    tech_time: "5",
    tech_time_unit: "sec",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAngularAccelerationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_find) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_find: formData.tech_find,
        tech_select1: formData.tech_select1,
        tech_select2: formData.tech_select2,
        tech_select3: formData.tech_select3,
        tech_ta: formData.tech_ta,
        tech_ta_unit: formData.tech_ta_unit,
        tech_ra: formData.tech_ra,
        tech_ra_unit: formData.tech_ra_unit,
        tech_aa: formData.tech_aa,
        tech_torque: formData.tech_torque,
        tech_moment: formData.tech_moment,
        tech_inv: formData.tech_inv,
        tech_inv_unit: formData.tech_inv_unit,
        tech_fnv: formData.tech_fnv,
        tech_fnv_unit: formData.tech_fnv_unit,
        tech_time: formData.tech_time,
        tech_time_unit: formData.tech_time_unit,
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
      tech_find: "0", //  0 1  2
      tech_select1: "angular_acceleration",
      tech_select2: "angular_acceleration_two",
      tech_select3: "angular_acceleration_three",
      tech_ta: "5",
      tech_ta_unit: "m/s²",
      tech_ra: "5",
      tech_ra_unit: "mm",
      tech_aa: "50",
      tech_torque: "50",
      tech_moment: "50",
      tech_inv: "5",
      tech_inv_unit: "rad/s",
      tech_fnv: "5",
      tech_fnv_unit: "rad/s",
      tech_time: "5",
      tech_time_unit: "sec",
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
    setFormData((prev) => ({ ...prev, tech_ta_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ra_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_inv_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fnv_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_time_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 w-set">
                <label htmlFor="tech_find" className="label">
                  {data?.payload?.tech_lang_keys["18"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_find"
                    id="tech_find"
                    value={formData.tech_find}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-3  gap-4">
              {formData.tech_find == "0" && (
                <>
                  <div className="col-span-12" id="g-hide">
                    <p className="col med-set">
                      <label>
                        <strong>{data?.payload?.tech_lang_keys["4"]}: </strong>
                      </label>
                    </p>
                    <p className="med-set1">
                      <label className="pe-2" htmlFor="angular_acceleration">
                        <input
                          type="radio"
                          name="tech_select1"
                          value="angular_acceleration"
                          id="angular_acceleration"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={
                            formData.tech_select1 === "angular_acceleration"
                          }
                        />
                        <span>{data?.payload?.tech_lang_keys["5"]}</span>
                      </label>

                      <label className="pe-2" htmlFor="radius">
                        <input
                          type="radio"
                          name="tech_select1"
                          value="radius"
                          id="radius"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={formData.tech_select1 === "radius"}
                        />
                        <span>{data?.payload?.tech_lang_keys["6"]}</span>
                      </label>

                      <label className="pe-2" htmlFor="tangential_acceleration">
                        <input
                          type="radio"
                          name="tech_select1"
                          value="tangential_acceleration"
                          id="tangential_acceleration"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={
                            formData.tech_select1 === "tangential_acceleration"
                          }
                        />
                        <span>{data?.payload?.tech_lang_keys["7"]}</span>
                      </label>
                    </p>
                  </div>
                </>
              )}
              {formData.tech_find == "2" && (
                <>
                  <div className="col-span-12 " id="g-hide1">
                    <p className="col med-set">
                      <label className="font_size16">
                        <strong>{data?.payload?.tech_lang_keys["4"]}: </strong>
                      </label>
                    </p>
                    <label className="pe-2" htmlFor="angular_acceleration_two">
                      <input
                        type="radio"
                        name="tech_select2"
                        value="angular_acceleration_two"
                        id="angular_acceleration_two"
                        className="mr-2 border"
                        onChange={handleChange}
                        checked={
                          formData.tech_select2 === "angular_acceleration_two"
                        }
                      />
                      <span>{data?.payload?.tech_lang_keys["5"]}</span>
                    </label>

                    <label className="pe-2" htmlFor="mass">
                      <input
                        type="radio"
                        name="tech_select2"
                        value="mass"
                        id="mass"
                        className="mr-2 border"
                        onChange={handleChange}
                        checked={formData.tech_select2 === "mass"}
                      />
                      <span>{data?.payload?.tech_lang_keys["8"]}</span>
                    </label>

                    <label className="pe-2" htmlFor="total_torque_two">
                      <input
                        type="radio"
                        name="tech_select2"
                        value="total_torque_two"
                        id="total_torque_two"
                        className="mr-2 border"
                        onChange={handleChange}
                        checked={formData.tech_select2 === "total_torque_two"}
                      />
                      <span>{data?.payload?.tech_lang_keys["9"]}</span>
                    </label>
                  </div>
                </>
              )}
              {formData.tech_find == "1" && (
                <>
                  <div className="col-span-12 " id="g-hide2">
                    <div className="col-span-12  root">
                      <p className="col med-set med-set2">
                        <label className="font_size16">
                          <strong>
                            {data?.payload?.tech_lang_keys["4"]}:{" "}
                          </strong>
                        </label>
                      </p>
                    </div>
                    <p className="med-set3">
                      <label
                        className="pe-2"
                        htmlFor="angular_acceleration_three"
                      >
                        <input
                          type="radio"
                          name="tech_select3"
                          value="angular_acceleration_three"
                          id="angular_acceleration_three"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={
                            formData.tech_select3 ===
                            "angular_acceleration_three"
                          }
                        />
                        <span>{data?.payload?.tech_lang_keys["5"]}</span>
                      </label>

                      <label className="pe-2" htmlFor="time">
                        <input
                          type="radio"
                          name="tech_select3"
                          value="time"
                          id="time"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={formData.tech_select3 === "time"}
                        />
                        <span>{data?.payload?.tech_lang_keys["10"]}</span>
                      </label>

                      <label className="pe-2" htmlFor="inv">
                        <input
                          type="radio"
                          name="tech_select3"
                          value="inv"
                          id="inv"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={formData.tech_select3 === "inv"}
                        />
                        <span>{data?.payload?.tech_lang_keys["11"]}</span>
                      </label>

                      <label className="pe-2" htmlFor="fnv">
                        <input
                          type="radio"
                          name="tech_select3"
                          value="fnv"
                          id="fnv"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={formData.tech_select3 === "fnv"}
                        />
                        <span>{data?.payload?.tech_lang_keys["12"]}</span>
                      </label>
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="grid grid-cols-12 mt-3  gap-4">
              {((formData.tech_find == "0" &&
                formData.tech_select1 == "angular_acceleration") ||
                (formData.tech_find == "0" &&
                  formData.tech_select1 == "radius")) && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="tangential_acceleration"
                  >
                    <label htmlFor="tech_ta" className="label">
                      {data?.payload?.tech_lang_keys["7"]} (a)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_ta"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_ta}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_ta_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s²", value: "m/s²" },
                            { label: "g", value: "g" },
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

              {((formData.tech_find == "0" &&
                formData.tech_select1 == "angular_acceleration") ||
                (formData.tech_find == "0" &&
                  formData.tech_select1 == "tangential_acceleration")) && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="radius"
                  >
                    <label htmlFor="tech_ra" className="label">
                      {data?.payload?.tech_lang_keys["6"]} (R)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_ra"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_ra}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_ra_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "km", value: "km" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
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

              {((formData.tech_find == "0" &&
                formData.tech_select1 == "radius") ||
                (formData.tech_find == "0" &&
                  formData.tech_select1 == "tangential_acceleration") ||
                (formData.tech_find == "2" &&
                  formData.tech_select2 == "mass") ||
                (formData.tech_find == "2" &&
                  formData.tech_select2 == "total_torque_two") ||
                (formData.tech_find == "1" &&
                  formData.tech_select3 == "time") ||
                (formData.tech_find == "1" && formData.tech_select3 == "inv") ||
                (formData.tech_find == "1" &&
                  formData.tech_select3 == "fnv")) && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 "
                    id="angular_acceleration"
                  >
                    <label htmlFor="tech_aa" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (α)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_aa"
                        id="tech_aa"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_aa}
                        onChange={handleChange}
                      />
                      <span className="input_unit">
                        rad/s<sup>2</sup>
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* 3th */}

              {((formData.tech_find == "2" &&
                formData.tech_select2 == "angular_acceleration_two") ||
                (formData.tech_find == "2" &&
                  formData.tech_select2 == "mass")) && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 "
                    id="total_torque"
                  >
                    <label htmlFor="tech_torque" className="label">
                      {data?.payload?.tech_lang_keys["9"]} (τ)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_torque"
                        id="tech_torque"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_torque}
                        onChange={handleChange}
                      />
                      <span className="input_unit">rad/sec</span>
                    </div>
                  </div>
                </>
              )}
              {((formData.tech_find == "2" &&
                formData.tech_select2 == "angular_acceleration_two") ||
                (formData.tech_find == "2" &&
                  formData.tech_select2 == "total_torque_two")) && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 "
                    id="moment"
                  >
                    <label htmlFor="tech_moment" className="label">
                      {data?.payload?.tech_lang_keys["8"]} (I)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_moment"
                        id="tech_moment"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_moment}
                        onChange={handleChange}
                      />
                      <span className="input_unit">
                        kg-m<sup>2</sup>/rad<sup>2</sup>
                      </span>
                    </div>
                  </div>
                </>
              )}

              {((formData.tech_find == "1" &&
                formData.tech_select3 == "angular_acceleration_three") ||
                (formData.tech_find == "1" &&
                  formData.tech_select3 == "time") ||
                (formData.tech_find == "1" &&
                  formData.tech_select3 == "fnv")) && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 "
                    id="inv"
                  >
                    <label htmlFor="tech_inv" className="label">
                      {data?.payload?.tech_lang_keys["11"]} (R)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_inv"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_inv}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_inv_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "rad/s", value: "rad/s" },
                            { label: "rpm", value: "rpm" },
                            { label: "Hz", value: "Hz" },
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
              {((formData.tech_find == "1" &&
                formData.tech_select3 == "angular_acceleration_three") ||
                (formData.tech_find == "1" &&
                  formData.tech_select3 == "time") ||
                (formData.tech_find == "1" &&
                  formData.tech_select3 == "inv")) && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 "
                    id="fnv"
                  >
                    <label htmlFor="tech_fnv" className="label">
                      {data?.payload?.tech_lang_keys["12"]} (R)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_fnv"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_fnv}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_fnv_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "rad/s", value: "rad/s" },
                            { label: "rpm", value: "rpm" },
                            { label: "Hz", value: "Hz" },
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
              {((formData.tech_find == "1" &&
                formData.tech_select3 == "angular_acceleration_three") ||
                (formData.tech_find == "1" && formData.tech_select3 == "fnv") ||
                (formData.tech_find == "1" &&
                  formData.tech_select3 == "inv")) && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 "
                    id="time"
                  >
                    <label htmlFor="tech_time" className="label">
                      {data?.payload?.tech_lang_keys["10"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_time"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_time}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_time_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "sec", value: "sec" },
                            { label: "min", value: "min" },
                            { label: "hrs", value: "hrs" },
                            { label: "days", value: "days" },
                            { label: "wks", value: "wks" },
                            { label: "mos", value: "mos" },
                            { label: "yrs", value: "yrs" },
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
                      <div className="w-full lg:text-[18px] md:text-[18px] text-[16px] overflow-auto">
                        {result?.tech_method == "1" && (
                          <>
                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["5"]} (
                                <InlineMath math="\alpha" />)
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {Number(result?.tech_ans).toFixed(2)}{" "}
                                <span>
                                  (rad/s<sup>2</sup>)
                                </span>
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="\alpha = \dfrac{a}{R}" />
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                <InlineMath
                                  math={`a = ${result?.tech_first_value}, \\ R = ${result?.tech_second_value}, \\ \\text{and} \\ \\alpha`}
                                />
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="\alpha = \dfrac{a}{R}" />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`\\alpha = \\dfrac{${result?.tech_first_value}}{${result?.tech_second_value}}`}
                              />
                            </div>

                            <div className="mt-2 dk">
                              <InlineMath
                                math={`\\alpha = ${result?.tech_ans}`}
                              />
                            </div>
                          </>
                        )}
                        {result?.tech_method == "2" && (
                          <>
                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["6"]} (
                                <InlineMath math="R" />)
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {Number(result?.tech_ans).toFixed(2)}
                                <span> (m)</span>
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["19"]}:
                              </strong>
                            </div>

                            <div className="mt-2 overflow-auto">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="color_blue">
                                      {data?.payload?.tech_lang_keys["6"]} (R)
                                    </td>
                                    <td>
                                      <strong>
                                        {result?.tech_ans * 1000} (mm)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color_blue">
                                      {data?.payload?.tech_lang_keys["6"]} (R)
                                    </td>
                                    <td>
                                      <strong>
                                        {result?.tech_ans * 100} (cm)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color_blue">
                                      {data?.payload?.tech_lang_keys["6"]} (R)
                                    </td>
                                    <td>
                                      <strong>
                                        {result?.tech_ans * 0.001} (km)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color_blue">
                                      {data?.payload?.tech_lang_keys["6"]} (R)
                                    </td>
                                    <td>
                                      <strong>
                                        {result?.tech_ans * 39.37} (in)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color_blue">
                                      {data?.payload?.tech_lang_keys["6"]} (R)
                                    </td>
                                    <td>
                                      <strong>
                                        {result?.tech_ans * 3.281} (ft)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color_blue">
                                      {data?.payload?.tech_lang_keys["6"]} (R)
                                    </td>
                                    <td>
                                      <strong>
                                        {result?.tech_ans * 1.0936} (yd)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color_blue">
                                      {data?.payload?.tech_lang_keys["6"]} (R)
                                    </td>
                                    <td>
                                      <strong>
                                        {result?.tech_ans * 0.0006214} (mi)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="R = \dfrac{a}{\alpha}" />
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                <InlineMath
                                  math={`a = ${result?.tech_second_value}, \\ \\alpha = ${result?.tech_first_value}, \\ \\text{and} \\ R`}
                                />
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]}:
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`R = \\dfrac{${result?.tech_second_value}}{${result?.tech_first_value}}`}
                              />
                            </div>

                            <div className="mt-2 dk">
                              <InlineMath math={`R = ${result?.tech_ans}`} />
                            </div>
                          </>
                        )}
                        {result?.tech_method == "3" && (
                          <>
                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]} (
                                <InlineMath math="a" />)
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {Number(result?.tech_ans).toFixed(2)}{" "}
                                <span>
                                  (m/s<sup>2</sup>)
                                </span>
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["19"]}:
                              </strong>
                            </div>

                            <div className="mt-2 overflow-auto">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="color_blue">
                                      {data?.payload?.tech_lang_keys["7"]} (a)
                                    </td>
                                    <td>
                                      <strong>
                                        {result?.tech_ans * 0.10197} (g)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="a = \alpha \cdot R" />
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                <InlineMath
                                  math={`\\alpha = ${result?.tech_first_value}, \\ R = ${result?.tech_second_value}, \\ \\text{and} \\ a`}
                                />
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]}:
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`a = ${result?.tech_first_value} \\times ${result?.tech_second_value}`}
                              />
                            </div>

                            <div className="mt-2 dk">
                              <InlineMath math={`a = ${result?.tech_ans}`} />
                            </div>
                          </>
                        )}

                        {result?.tech_method == "4" && (
                          <>
                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["5"]} (
                                <InlineMath math="\alpha" />)
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {Number(result?.tech_ans).toFixed(2)}{" "}
                                <span>
                                  (rad/s<sup>2</sup>)
                                </span>
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="\alpha = \dfrac{\omega_2 - \omega_1}{t}" />
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                <InlineMath
                                  math={`\\omega_1 = ${result?.tech_first_value}, \\omega_2 = ${result?.tech_second_value}, \\ t = ${result?.tech_third_value}, \\ \\text{and} \\ \\alpha`}
                                />
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="\alpha = \dfrac{\omega_2 - \omega_1}{t}" />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`\\alpha = \\dfrac{${result?.tech_second_value} - ${result?.tech_first_value}}{${result?.tech_third_value}}`}
                              />
                            </div>

                            <div className="mt-2 dk">
                              <InlineMath
                                math={`\\alpha = ${result?.tech_ans}`}
                              />
                            </div>
                          </>
                        )}
                        {result?.tech_method == "5" && (
                          <>
                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["10"]} (
                                <InlineMath math="t" />)
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {Number(result?.tech_ans).toFixed(2)}{" "}
                                <span>(sec)</span>
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["19"]}:
                              </strong>
                            </div>

                            <div className="mt-2 overflow-auto">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue-600">
                                      {data?.payload?.tech_lang_keys["10"]} (t)
                                    </td>
                                    <td>
                                      <strong>
                                        {(result?.tech_ans * 0.016667).toFixed(
                                          6
                                        )}{" "}
                                        minutes (min)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue-600">
                                      {data?.payload?.tech_lang_keys["10"]} (t)
                                    </td>
                                    <td>
                                      <strong>
                                        {(result?.tech_ans * 0.0002778).toFixed(
                                          6
                                        )}{" "}
                                        hours (hrs)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue-600">
                                      {data?.payload?.tech_lang_keys["10"]} (t)
                                    </td>
                                    <td>
                                      <strong>
                                        {(
                                          result?.tech_ans * 0.000011574
                                        ).toFixed(6)}{" "}
                                        days
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue-600">
                                      {data?.payload?.tech_lang_keys["10"]} (t)
                                    </td>
                                    <td>
                                      <strong>
                                        {(
                                          result?.tech_ans * 0.0000016534
                                        ).toFixed(6)}{" "}
                                        weeks
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue-600">
                                      {data?.payload?.tech_lang_keys["10"]} (t)
                                    </td>
                                    <td>
                                      <strong>
                                        {(
                                          result?.tech_ans * 0.00000038026
                                        ).toFixed(8)}{" "}
                                        months
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue-600">
                                      {data?.payload?.tech_lang_keys["10"]} (t)
                                    </td>
                                    <td>
                                      <strong>
                                        {(
                                          result?.tech_ans * 0.00000003169
                                        ).toFixed(8)}{" "}
                                        years
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="t = \dfrac{\omega_2 - \omega_1}{a}" />
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                <InlineMath
                                  math={`\\omega_1 = ${result?.tech_first_value}, \\omega_2 = ${result?.tech_second_value}, \\ a = ${result?.tech_third_value}, \\ \\text{and} \\ \\text{solve for} \\ t`}
                                />
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="t = \dfrac{\omega_2 - \omega_1}{a}" />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`t = \\dfrac{${result?.tech_second_value} - ${result?.tech_first_value}}{${result?.tech_third_value}}`}
                              />
                            </div>

                            <div className="mt-2 dk">
                              <InlineMath math={`t = ${result?.tech_ans}`} />
                            </div>
                          </>
                        )}
                        {result?.tech_method == "6" && (
                          <>
                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["11"]} (
                                <InlineMath math="\omega_1" />)
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {Number(result?.tech_ans).toFixed(2)}{" "}
                                <span>(rad/s)</span>
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["19"]}:
                              </strong>
                            </div>

                            <div className="mt-2">
                              <table className="w-full text-[18px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue-600">
                                      {data?.payload?.tech_lang_keys["11"]} (
                                      <InlineMath math="\omega_1" />)
                                    </td>
                                    <td>
                                      <strong>
                                        {Number(
                                          result?.tech_ans * 9.55
                                        ).toFixed(2)}{" "}
                                        Rotations per minute (rpm)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue-600">
                                      {data?.payload?.tech_lang_keys["11"]} (
                                      <InlineMath math="\omega_1" />)
                                    </td>
                                    <td>
                                      <strong>
                                        {Number(
                                          result?.tech_ans * 0.15915
                                        ).toFixed(2)}{" "}
                                        Hertz (Hz)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="\omega_1 = \omega_2 - (t \cdot \alpha)" />
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                <InlineMath
                                  math={`\\omega_2 = ${result?.tech_first_value}, \\ t = ${result?.tech_second_value}, \\ \\alpha = ${result?.tech_third_value}, \\ \\text{solve for} \\ \\omega_1`}
                                />
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="\omega_1 = \omega_2 - (t \cdot \alpha)" />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`\\omega_1 = ${result?.tech_first_value} - (${result?.tech_second_value} \\cdot ${result?.tech_third_value})`}
                              />
                            </div>

                            <div className="mt-2 dk">
                              <InlineMath
                                math={`\\omega_1 = ${result?.tech_ans}`}
                              />
                            </div>
                          </>
                        )}
                        {result?.tech_method == "7" && (
                          <>
                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["12"]} (
                                <InlineMath math="\omega_2" />)
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {Number(result?.tech_ans).toFixed(2)}{" "}
                                <span>(rad/s)</span>
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["19"]}:
                              </strong>
                            </div>

                            <div className="mt-2 overflow-auto">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue-600">
                                      {data?.payload?.tech_lang_keys["12"]} (
                                      <InlineMath math="\omega_2" />)
                                    </td>
                                    <td>
                                      <strong>
                                        {Number(
                                          result?.tech_ans * 9.55
                                        ).toFixed(2)}{" "}
                                        Rotations per minute (rpm)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue-600">
                                      {data?.payload?.tech_lang_keys["12"]} (
                                      <InlineMath math="\omega_2" />)
                                    </td>
                                    <td>
                                      <strong>
                                        {Number(
                                          result?.tech_ans * 0.15915
                                        ).toFixed(2)}{" "}
                                        Hertz (Hz)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="\omega_2 = (t \cdot \alpha) + \omega_1" />
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                <InlineMath
                                  math={`\\omega_1 = ${result?.tech_first_value}, \\ t = ${result?.tech_second_value}, \\ \\alpha = ${result?.tech_third_value}, \\ \\text{solve for} \\ \\omega_2`}
                                />
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="\omega_2 = (t \cdot \alpha) + \omega_1" />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`\\omega_2 = (${result?.tech_second_value} \\cdot ${result?.tech_third_value}) + ${result?.tech_first_value}`}
                              />
                            </div>

                            <div className="mt-2 dk">
                              <InlineMath
                                math={`\\omega_2 = ${result?.tech_ans}`}
                              />
                            </div>
                          </>
                        )}
                        {result?.tech_method == "8" && (
                          <>
                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["5"]} (
                                <InlineMath math="\alpha" />)
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {Number(result?.tech_ans).toFixed(2)}{" "}
                                <span>
                                  (rad/s<sup>2</sup>)
                                </span>
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="\alpha = \dfrac{\tau}{I}" />
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                <InlineMath
                                  math={`\\tau = ${result?.tech_first_value}, \\ I = ${result?.tech_second_value}, \\ \\text{solve for} \\ \\alpha`}
                                />
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="\alpha = \dfrac{\tau}{I}" />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`\\alpha = \\dfrac{${result?.tech_first_value}}{${result?.tech_second_value}}`}
                              />
                            </div>

                            <div className="mt-2 dk">
                              <InlineMath
                                math={`\\alpha = ${result?.tech_ans}`}
                              />
                            </div>
                          </>
                        )}
                        {result?.tech_method == "9" && (
                          <>
                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["8"]} (
                                <InlineMath math="I" />)
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {Number(result?.tech_ans).toFixed(2)}
                                <span>
                                  {" "}
                                  (kg·m<sup>2</sup>/rad<sup>2</sup>)
                                </span>
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="I = \dfrac{\tau}{\alpha}" />
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                <InlineMath
                                  math={`\\tau = ${result?.tech_first_value}, \\ \\alpha = ${result?.tech_second_value}, \\ \\text{solve for} \\ I`}
                                />
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="I = \dfrac{\tau}{\alpha}" />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`I = \\dfrac{${result?.tech_first_value}}{${result?.tech_second_value}}`}
                              />
                            </div>

                            <div className="mt-2 dk">
                              <InlineMath math={`I = ${result?.tech_ans}`} />
                            </div>
                          </>
                        )}
                        {result?.tech_method == "10" && (
                          <>
                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["9"]} (
                                <InlineMath math="\tau" />)
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {Number(result?.tech_ans).toFixed(2)}
                                <span> rad/sec</span>
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="\tau = I \cdot \alpha" />
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                <InlineMath
                                  math={`I = ${result?.tech_first_value}, \\ \\alpha = ${result?.tech_second_value}, \\ \\text{solve for } \\tau`}
                                />
                              </strong>
                            </div>

                            <div className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]} :
                              </strong>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="\tau = I \cdot \alpha" />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`\\tau = ${result?.tech_first_value} \\cdot ${result?.tech_second_value}`}
                              />
                            </div>

                            <div className="mt-2 dk">
                              <InlineMath
                                math={`\\tau = ${result?.tech_ans}`}
                              />
                            </div>
                          </>
                        )}
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

export default AngularAccelerationCalculator;

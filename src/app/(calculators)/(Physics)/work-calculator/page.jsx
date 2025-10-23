"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useWorkCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WorkCalculator = () => {
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
    tech_method: "work", // work power
    tech_method1: "velocity",
    tech_find: "work",
    tech_find1: "work1",
    tech_find2: "work2",
    tech_f: "5",
    tech_f_unit: "n",
    tech_d: "5",
    tech_d_unit: "mm",
    tech_m: "5",
    tech_m_unit: "mg",
    tech_v0: "5",
    tech_v0_unit: "ms",
    tech_v1: "5",
    tech_v1_unit: "ms",
    tech_w: "5",
    tech_w_unit: "ms",
    tech_p: "5",
    tech_p_unit: "ms",
    tech_t: "5",
    tech_t_unit: "ms",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWorkCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method: formData.tech_method,
        tech_method1: formData.tech_method1,
        tech_find: formData.tech_find,
        tech_find1: formData.tech_find1,
        tech_find2: formData.tech_find2,
        tech_f: formData.tech_f,
        tech_f_unit: formData.tech_f_unit,
        tech_d: formData.tech_d,
        tech_d_unit: formData.tech_d_unit,
        tech_m: formData.tech_m,
        tech_m_unit: formData.tech_m_unit,
        tech_v0: formData.tech_v0,
        tech_v0_unit: formData.tech_v0_unit,
        tech_v1: formData.tech_v1,
        tech_v1_unit: formData.tech_v1_unit,
        tech_w: formData.tech_w,
        tech_w_unit: formData.tech_w_unit,
        tech_p: formData.tech_p,
        tech_p_unit: formData.tech_p_unit,
        tech_t: formData.tech_t,
        tech_t_unit: formData.tech_t_unit,
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
      tech_method: "work", // work power
      tech_method1: "velocity",
      tech_find: "work",
      tech_find1: "work1",
      tech_find2: "work2",
      tech_f: "5",
      tech_f_unit: "n",
      tech_d: "5",
      tech_d_unit: "mm",
      tech_m: "5",
      tech_m_unit: "mg",
      tech_v0: "5",
      tech_v0_unit: "ms",
      tech_v1: "5",
      tech_v1_unit: "ms",
      tech_w: "5",
      tech_w_unit: "ms",
      tech_p: "5",
      tech_p_unit: "ms",
      tech_t: "5",
      tech_t_unit: "ms",
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
    setFormData((prev) => ({ ...prev, tech_f_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_d_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_v0_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_v1_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_w_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_p_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  // result

  const getLabel = () => {
    if (result?.tech_work || result?.tech_work1 || result?.tech_work2)
      return data?.payload?.tech_lang_keys["6"];
    if (result?.tech_force) return data?.payload?.tech_lang_keys["2"];
    if (result?.tech_dsplcmnt) return data?.payload?.tech_lang_keys["3"];
    if (result?.tech_i_v) return data?.payload?.tech_lang_keys["9"];
    if (result?.tech_f_v) return data?.payload?.tech_lang_keys["11"];
    if (result?.tech_mass) return data?.payload?.tech_lang_keys["10"];
    if (result?.tech_power) return data?.payload?.tech_lang_keys["7"];
    if (result?.tech_time) return data?.payload?.tech_lang_keys["8"];
    return null;
  };

  const getValue = () => {
    if (result?.tech_work || result?.tech_work1 || result?.tech_work2)
      return `${result?.tech_w} J`;
    if (result?.tech_force) return `${result?.tech_f} N`;
    if (result?.tech_dsplcmnt) return `${result?.tech_d} m`;
    if (result?.tech_i_v) return `${result?.tech_v0} m/s`;
    if (result?.tech_f_v) return `${result?.tech_v1} m/s`;
    if (result?.tech_mass) return `${result?.tech_m} kg`;
    if (result?.tech_power) return `${result?.tech_p} W`;
    if (result?.tech_time) return `${result?.tech_t} sec`;
    return null;
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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["calculate"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method"
                    id="tech_method"
                    value={formData.tech_method}
                    onChange={handleChange}
                  >
                    <option value="work">Work</option>
                    <option value="power">Power</option>
                  </select>
                </div>
              </div>

              {formData.tech_method == "work" && (
                <>
                  <div className="space-y-2 method1">
                    <label htmlFor="tech_method1" className="label">
                      {data?.payload?.tech_lang_keys["calculate"]}{" "}
                      {data?.payload?.tech_lang_keys["1"]} :
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_method1"
                        id="tech_method1"
                        value={formData.tech_method1}
                        onChange={handleChange}
                      >
                        <option value="fnd">
                          {data?.payload?.tech_lang_keys["2"]} &{" "}
                          {data?.payload?.tech_lang_keys["3"]}
                        </option>
                        <option value="velocity">
                          {data?.payload?.tech_lang_keys["4"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            {formData.tech_method1 == "fnd" &&
              formData.tech_method == "work" && (
                <>
                  <div className="grid grid-cols-12  gap-4" id="find">
                    <div className="col-span-12 py-2">
                      <p className="col">
                        <strong>{data?.payload?.tech_lang_keys["5"]}: </strong>
                      </p>
                      <p>
                        <label className="pe-2" htmlFor="work">
                          <input
                            type="radio"
                            name="tech_find"
                            value="work"
                            id="work"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_find === "work"}
                          />
                          <span>{data?.payload?.tech_lang_keys["6"]}</span>
                        </label>
                        <label className="pe-2" htmlFor="force">
                          <input
                            type="radio"
                            name="tech_find"
                            value="force"
                            id="force"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_find === "force"}
                          />
                          <span>{data?.payload?.tech_lang_keys["2"]}</span>
                        </label>
                        <label className="pe-2" htmlFor="dsplcmnt">
                          <input
                            type="radio"
                            name="tech_find"
                            value="dsplcmnt"
                            id="dsplcmnt"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_find === "dsplcmnt"}
                          />
                          <span>{data?.payload?.tech_lang_keys["3"]}</span>
                        </label>
                      </p>
                    </div>
                  </div>
                </>
              )}
            {formData.tech_method == "power" && (
              <>
                <div className="grid grid-cols-12  gap-4 " id="find1">
                  <div className="col-span-12 py-2">
                    <p className="col">
                      <strong>{data?.payload?.tech_lang_keys["5"]}: </strong>
                    </p>
                    <p>
                      <label className="pe-2" htmlFor="power">
                        <input
                          type="radio"
                          name="tech_find1"
                          value="power"
                          id="power"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={formData.tech_find1 === "power"}
                        />
                        <span>{data?.payload?.tech_lang_keys["7"]}</span>
                      </label>
                      <label className="pe-2" htmlFor="work1">
                        <input
                          type="radio"
                          name="tech_find1"
                          value="work1"
                          id="work1"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={formData.tech_find1 === "work1"}
                        />
                        <span>{data?.payload?.tech_lang_keys["6"]}</span>
                      </label>
                      <label className="pe-2" htmlFor="time">
                        <input
                          type="radio"
                          name="tech_find1"
                          value="time"
                          id="time"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={formData.tech_find1 === "time"}
                        />
                        <span>{data?.payload?.tech_lang_keys["8"]}</span>
                      </label>
                    </p>
                  </div>
                </div>
              </>
            )}

            {formData.tech_method1 == "velocity" &&
              formData.tech_method == "work" &&
              formData.tech_method == "work" && (
                <>
                  <div className="grid grid-cols-12  gap-4 " id="find2">
                    <div className="col-span-12 py-2">
                      <p className="col px-2">
                        <strong>{data?.payload?.tech_lang_keys["5"]}: </strong>
                      </p>
                      <p>
                        <label className="pe-2" htmlFor="work2">
                          <input
                            type="radio"
                            name="tech_find2"
                            value="work2"
                            id="work2"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_find2 === "work2"}
                          />
                          <span>{data?.payload?.tech_lang_keys["6"]}</span>
                        </label>
                        <label className="pe-2" htmlFor="v0">
                          <input
                            type="radio"
                            name="tech_find2"
                            value="v0"
                            id="v0"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_find2 === "v0"}
                          />
                          <span>{data?.payload?.tech_lang_keys["9"]}</span>
                        </label>
                        <label className="pe-2" htmlFor="v1">
                          <input
                            type="radio"
                            name="tech_find2"
                            value="v1"
                            id="v1"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_find2 === "v1"}
                          />
                          <span>{data?.payload?.tech_lang_keys["11"]}</span>
                        </label>
                        <label className="pe-2" htmlFor="mass">
                          <input
                            type="radio"
                            name="tech_find2"
                            value="mass"
                            id="mass"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_find2 === "mass"}
                          />
                          <span>{data?.payload?.tech_lang_keys["10"]}</span>
                        </label>
                      </p>
                    </div>
                  </div>
                </>
              )}

            <div className="grid grid-cols-2  lg:grid-cols-2 md:grid-cols-2  gap-4">
              {formData.tech_find != "force" &&
                formData.tech_method1 == "fnd" &&
                formData.tech_method == "work" && (
                  <>
                    <div className="space-y-2" id="fs">
                      <label htmlFor="tech_f" className="label">
                        {data?.payload?.tech_lang_keys["2"]} (F)
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_f"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_f}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown}
                        >
                          {formData.tech_f_unit} ▾
                        </label>
                        {dropdownVisible && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "N", value: "n" },
                              { label: "KN", value: "kn" },
                              { label: "MN", value: "mn" },
                              { label: "GN", value: "gn" },
                              { label: "TN", value: "tn" },
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
              {formData.tech_find != "dsplcmnt" &&
                formData.tech_method1 == "fnd" &&
                formData.tech_method == "work" && (
                  <>
                    <div className="space-y-2" id="ds">
                      <label htmlFor="tech_d" className="label">
                        {data?.payload?.tech_lang_keys["3"]} (d)
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_d"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_d}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_d_unit} ▾
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
                              { label: "nmi", value: "nmi" },
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
              {(formData.tech_find2 == "work2" ||
                formData.tech_find2 == "v0" ||
                formData.tech_find2 == "v1") &&
                formData.tech_method1 == "velocity" &&
                formData.tech_method == "work" && (
                  <>
                    <div className="space-y-2 " id="ms">
                      <label htmlFor="tech_m" className="label">
                        {data?.payload?.tech_lang_keys["10"]} (m)
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_m"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_m}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown2}
                        >
                          {formData.tech_m_unit} ▾
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
                              { label: "stone", value: "stone" },
                              { label: "US ton", value: "us_ton" },
                              { label: "Long ton", value: "long_ton" },
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
              {(formData.tech_find2 == "work2" ||
                formData.tech_find2 == "v1" ||
                formData.tech_find2 == "mass") &&
                formData.tech_method1 == "velocity" &&
                formData.tech_method == "work" && (
                  <>
                    <div className="space-y-2 " id="v0s">
                      <label htmlFor="tech_v0" className="label">
                        {data?.payload?.tech_lang_keys["9"]} (v₀)
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_v0"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_v0}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown3}
                        >
                          {formData.tech_v0_unit} ▾
                        </label>
                        {dropdownVisible3 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "m/s", value: "ms" },
                              { label: "km/h", value: "kmh" },
                              { label: "ft/s", value: "fts" },
                              { label: "mph", value: "mph" },
                              { label: "knots", value: "knots" },
                              { label: "ft/min", value: "ftmin" },
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
              {(formData.tech_find2 == "work2" ||
                formData.tech_find2 == "v0" ||
                formData.tech_find2 == "mass") &&
                formData.tech_method1 == "velocity" &&
                formData.tech_method == "work" && (
                  <>
                    <div className="space-y-2 " id="v1s">
                      <label htmlFor="tech_v1" className="label">
                        {data?.payload?.tech_lang_keys["11"]} (v₁)
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_v1"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_v1}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown4}
                        >
                          {formData.tech_v1_unit} ▾
                        </label>
                        {dropdownVisible4 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "m/s", value: "ms" },
                              { label: "km/h", value: "kmh" },
                              { label: "ft/s", value: "fts" },
                              { label: "mph", value: "mph" },
                              { label: "knots", value: "knots" },
                              { label: "ft/min", value: "ftmin" },
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

              {formData.tech_method == "work" ? (
                <>
                  {
                    // Secondary conditions
                    ((formData.tech_find === "force" &&
                      formData.tech_method1 === "fnd" &&
                      formData.tech_method === "work") ||
                      (formData.tech_find === "dsplcmnt" &&
                        formData.tech_method1 === "fnd" &&
                        formData.tech_method === "work") ||
                      formData.tech_find2 === "v0" ||
                      formData.tech_find2 === "v1" ||
                      formData.tech_find2 === "mass") && (
                      <>
                        <div className="space-y-2" id="ws">
                          <label htmlFor="tech_w" className="label">
                            {data?.payload?.tech_lang_keys["6"]} (W)
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_w"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_w}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown5}
                            >
                              {formData.tech_w_unit} ▾
                            </label>
                            {dropdownVisible5 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "J", value: "J" },
                                  { label: "kJ", value: "kJ" },
                                  { label: "mJ", value: "mJ" },
                                  { label: "Wh", value: "Wh" },
                                  { label: "kWh", value: "kWh" },
                                  { label: "ft-lbs", value: "ft_lbs" },
                                  { label: "kcal", value: "kcal" },
                                  { label: "eV", value: "eV" },
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
                    )
                  }
                </>
              ) : (
                <>
                  {
                    // Highest priority condition first
                    formData.tech_find1 !== "work1" &&
                      formData.tech_method === "power" && (
                        <>
                          <div className="space-y-2" id="ws">
                            <label htmlFor="tech_w" className="label">
                              {data?.payload?.tech_lang_keys["6"]} (W)
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_w"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_w}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown5}
                              >
                                {formData.tech_w_unit} ▾
                              </label>
                              {dropdownVisible5 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "J", value: "J" },
                                    { label: "kJ", value: "kJ" },
                                    { label: "mJ", value: "mJ" },
                                    { label: "Wh", value: "Wh" },
                                    { label: "kWh", value: "kWh" },
                                    { label: "ft-lbs", value: "ft_lbs" },
                                    { label: "kcal", value: "kcal" },
                                    { label: "eV", value: "eV" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler5(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )
                  }
                </>
              )}

              {(formData.tech_find1 == "work1" ||
                formData.tech_find1 == "time") &&
                formData.tech_method == "power" && (
                  <>
                    <div className="space-y-2 " id="ps">
                      <label htmlFor="tech_p" className="label">
                        {data?.payload?.tech_lang_keys["7"]} (P)
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_p"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_p}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown6}
                        >
                          {formData.tech_p_unit} ▾
                        </label>
                        {dropdownVisible6 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mW", value: "mW" },
                              { label: "W", value: "W" },
                              { label: "kW", value: "kW" },
                              { label: "MW", value: "MW" },
                              { label: "gw", value: "gw" },
                              { label: "BTU/h", value: "btu_h" },
                              { label: "hp(l)", value: "hp_l" },
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

              {(formData.tech_find1 == "work1" ||
                formData.tech_find1 == "power") &&
                formData.tech_method == "power" && (
                  <>
                    <div className="space-y-2 " id="ts">
                      <label htmlFor="tech_t" className="label">
                        {data?.payload?.tech_lang_keys["8"]} (t)
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_t"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_t}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown7}
                        >
                          {formData.tech_t_unit} ▾
                        </label>
                        {dropdownVisible7 && (
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
                      <div className="w-full md:w-[70%]  mt-2">
                        <table className="w-full text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b ">
                                <strong>{getLabel()}</strong>
                              </td>
                              <td className="py-2 border-b">{getValue()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-[14px] md:text-[18px]">
                        <div>
                          {result?.tech_work && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p className="mt-2">W = F * D</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["14"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                F = {result?.tech_f}, D = {result?.tech_d}, W =
                                ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}
                                </strong>
                              </p>
                              <p className="mt-2">W = F * D</p>
                              <p className="mt-2">
                                W = {result?.tech_f} * {result?.tech_d}
                              </p>
                              <p className="mt-2">
                                W = <strong>{result?.tech_w}</strong>
                              </p>
                            </>
                          )}

                          {result?.tech_force && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p className="mt-2">F = W / D</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["14"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                W = {result?.tech_w}, D = {result?.tech_d}, F =
                                ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}
                                </strong>
                              </p>
                              <p className="mt-2">F = W / D</p>
                              <p className="mt-2">
                                F = {result?.tech_w} / {result?.tech_d}
                              </p>
                              <p className="mt-2">
                                F = <strong>{result?.tech_f}</strong>
                              </p>
                            </>
                          )}

                          {result?.tech_dsplcmnt && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p className="mt-2">D = W / F</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["14"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                W = {result?.tech_w}, F = {result?.tech_f}, D =
                                ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}
                                </strong>
                              </p>
                              <p className="mt-2">D = W / F</p>
                              <p className="mt-2">
                                D = {result?.tech_w} / {result?.tech_f}
                              </p>
                              <p className="mt-2">
                                D = <strong>{result?.tech_d}</strong>
                              </p>
                            </>
                          )}

                          {result?.tech_work1 && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p className="mt-2">W = (m/2) * (v₁² - v₀²)</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["14"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                m = {result?.tech_f}, v₀ = {result?.tech_v0}, v₁
                                = {result?.tech_v1}, W = ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}
                                </strong>
                              </p>
                              <p className="mt-2">W = (m/2) * (v₁² - v₀²)</p>
                              <p className="mt-2">
                                W = ({result?.tech_m} / 2) * (({result?.tech_v1}
                                )² - ({result?.tech_v0})²)
                              </p>
                              <p className="mt-2">
                                W = ({result?.tech_s1}) * ({result?.tech_s2} -{" "}
                                {result?.tech_s3})
                              </p>
                              <p className="mt-2">
                                W = ({result?.tech_s1}) * ({result?.tech_s4})
                              </p>
                              <p className="mt-2">
                                W = <strong>{result?.tech_w}</strong>
                              </p>
                            </>
                          )}

                          {result?.tech_i_v && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p className="mt-2">v₀ = √(v₁² - (2/m * w))</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["14"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                w = {result?.tech_w}, m = {result?.tech_m}, v₁ ={" "}
                                {result?.tech_v1}, v₀ = ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                v₀ = √({result?.tech_v1}² - ((2/{result?.tech_m}
                                ) * {result?.tech_w}))
                              </p>
                              <p className="mt-2">
                                v₀ = √({result?.tech_s1} - {result?.tech_s2} *{" "}
                                {result?.tech_w})
                              </p>
                              <p className="mt-2">v₀ = √({result?.tech_s4})</p>
                              <p className="mt-2">
                                v₀ = <strong>{result?.tech_v0}</strong>
                              </p>
                            </>
                          )}

                          {result?.tech_f_v && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p className="mt-2">v₁ = √(v₀² + (2/m * w))</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["14"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                w = {result?.tech_w}, m = {result?.tech_m}, v₀ ={" "}
                                {result?.tech_v0}, v₁ = ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                v₁ = √({result?.tech_v0}² + ((2/{result?.tech_m}
                                ) * {result?.tech_w}))
                              </p>
                              <p className="mt-2">
                                v₁ = √({result?.tech_s1} + {result?.tech_s2} *{" "}
                                {result?.tech_w})
                              </p>
                              <p className="mt-2">v₁ = √({result?.tech_s4})</p>
                              <p className="mt-2">
                                v₁ = <strong>{result?.tech_v1}</strong>
                              </p>
                            </>
                          )}

                          {result?.tech_mass && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p className="mt-2">m = 2w / (v₁² - v₀²)</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["14"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                w = {result?.tech_w}, v₀ = {result?.tech_v0}, v₁
                                = {result?.tech_v1}, m = ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                m = (2 * {result?.tech_w}) / (({result?.tech_v1}
                                )² - ({result?.tech_v0})²)
                              </p>
                              <p className="mt-2">
                                m = {result?.tech_s1} / ({result?.tech_s2} -{" "}
                                {result?.tech_s3})
                              </p>
                              <p className="mt-2">
                                m = {result?.tech_s1} / {result?.tech_s4}
                              </p>
                              <p className="mt-2">
                                m = <strong>{result?.tech_m}</strong>
                              </p>
                            </>
                          )}

                          {result?.tech_power && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p className="mt-2">P = W / T</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["14"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                W = {result?.tech_w}, T = {result?.tech_t}, P =
                                ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                P = {result?.tech_w} / {result?.tech_t}
                              </p>
                              <p className="mt-2">
                                P = <strong>{result?.tech_p}</strong>
                              </p>
                            </>
                          )}

                          {result?.tech_work2 && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p className="mt-2">W = P * T</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["14"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                P = {result?.tech_p}, T = {result?.tech_t}, W =
                                ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                W = {result?.tech_p} * {result?.tech_t}
                              </p>
                              <p className="mt-2">
                                W = <strong>{result?.tech_w}</strong>
                              </p>
                            </>
                          )}

                          {result?.tech_time && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p className="mt-2">T = W / P</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["14"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                W = {result?.tech_w}, P = {result?.tech_p}, T =
                                ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                T = {result?.tech_w} / {result?.tech_p}
                              </p>
                              <p className="mt-2">
                                T = <strong>{result?.tech_t}</strong>
                              </p>
                            </>
                          )}
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

export default WorkCalculator;

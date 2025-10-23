"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCharlesLawCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CharlesLawCalculator = () => {
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
    tech_find: "p", // v1 t1 v2  t2  p   n
    tech_v1: "5",
    tech_unit_x: "m³",
    tech_t1: "5",
    tech_t1_unit: "°C",
    tech_v2: "5",
    tech_v2_unit: "m³",
    tech_t2: "8",
    tech_t2_unit: "°C",
    tech_p: "9",
    tech_p_unit: "Pa",
    tech_n: "10",
    tech_R: "8.3144626",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCharlesLawCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_find) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_find: formData.tech_find,
        tech_v1: Number(formData.tech_v1),
        tech_unit_x: formData.tech_unit_x,
        tech_t1: Number(formData.tech_t1),
        tech_t1_unit: formData.tech_t1_unit,
        tech_v2: Number(formData.tech_v2),
        tech_v2_unit: formData.tech_v2_unit,
        tech_t2: Number(formData.tech_t2),
        tech_t2_unit: formData.tech_t2_unit,
        tech_p: Number(formData.tech_p),
        tech_p_unit: formData.tech_p_unit,
        tech_n: Number(formData.tech_n),
        tech_R: Number(formData.tech_R),
      }).unwrap();
      setResult(response); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_find: "p", // v1 t1 v2  t2  p   n
      tech_v1: "5",
      tech_unit_x: "m³",
      tech_t1: "5",
      tech_t1_unit: "°C",
      tech_v2: "5",
      tech_v2_unit: "m³",
      tech_t2: "8",
      tech_t2_unit: "°C",
      tech_p: "9",
      tech_p_unit: "Pa",
      tech_n: "10",
      tech_R: "8.3144626",
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
  {
    /* <span className="text-blue input_unit">{currency.symbol}</span> */
  }
  // currency code

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_x: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t1_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_v2_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t2_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_p_unit: unit }));
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className=" relative">
                <label htmlFor="tech_find" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-1">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_find"
                    id="tech_find"
                    value={formData.tech_find}
                    onChange={handleChange}
                  >
                    <option value="v1">
                      {data?.payload?.tech_lang_keys["2"]} (V₁)
                    </option>
                    <option value="t1">
                      {data?.payload?.tech_lang_keys["3"]} (T₁)
                    </option>
                    <option value="v2">
                      {data?.payload?.tech_lang_keys["4"]} (V₂)
                    </option>
                    <option value="t2">
                      {data?.payload?.tech_lang_keys["5"]} (T₂)
                    </option>
                    <option value="p">
                      {data?.payload?.tech_lang_keys["6"]} (p)
                    </option>
                    <option value="n">
                      {data?.payload?.tech_lang_keys["7"]} (n)
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_find == "t1" ||
                formData.tech_find == "v2" ||
                formData.tech_find == "t2" ||
                formData.tech_find == "p" ||
                formData.tech_find == "n") && (
                <>
                  <div className=" v1">
                    <label htmlFor="tech_v1" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (V₁)
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
                        onClick={toggleDropdown}
                      >
                        {formData.tech_unit_x} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cubic millimeters (mm³)", value: "mm³" },
                            { label: "cubic centimeters (cm³)", value: "cm³" },
                            { label: "cubic decimeters (dm³)", value: "dm³" },
                            { label: "cubic meters (m³)", value: "m³" },
                            { label: "cubic inches (cu in)", value: "cu in" },
                            { label: "cubic feet (cu ft)", value: "cu ft" },
                            { label: "cubic yards (cu yd)", value: "cu yd" },
                            { label: "milliliters (ml)", value: "ml" },
                            { label: "liters", value: "liters" },
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
              {(formData.tech_find == "v1" ||
                formData.tech_find == "v2" ||
                formData.tech_find == "t2" ||
                formData.tech_find == "p" ||
                formData.tech_find == "n") && (
                <>
                  <div className=" t1">
                    <label htmlFor="tech_t1" className="label">
                      {data?.payload?.tech_lang_keys["3"]} (T₁)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_t1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_t1}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_t1_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Celsius (°C)", value: "°C" },
                            { label: "Fahrenheit (°F)", value: "°F" },
                            { label: "Kelvin (K)", value: "K" },
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
              {(formData.tech_find == "v1" ||
                formData.tech_find == "t1" ||
                formData.tech_find == "t2") && (
                <>
                  <div className=" v2">
                    <label htmlFor="tech_v2" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (V₂)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_v2"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_v2}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_v2_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cubic millimeters (mm³)", value: "mm³" },
                            { label: "cubic centimeters (cm³)", value: "cm³" },
                            { label: "cubic decimeters (dm³)", value: "dm³" },
                            { label: "cubic meters (m³)", value: "m³" },
                            { label: "cubic inches (cu in)", value: "cu in" },
                            { label: "cubic feet (cu ft)", value: "cu ft" },
                            { label: "cubic yards (cu yd)", value: "cu yd" },
                            { label: "milliliters (ml)", value: "ml" },
                            { label: "liters", value: "liters" },
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
              {(formData.tech_find == "v1" ||
                formData.tech_find == "t1" ||
                formData.tech_find == "v2") && (
                <>
                  <div className=" t2 ">
                    <label htmlFor="tech_t2" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (T₂)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_t2"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_t2}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_t2_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Celsius (°C)", value: "°C" },
                            { label: "Fahrenheit (°F)", value: "°F" },
                            { label: "Kelvin (K)", value: "K" },
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
              {formData.tech_find == "n" && (
                <>
                  <div className=" p ">
                    <label htmlFor="tech_p" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (p)
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
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_p_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Pa", value: "Pa" },
                            { label: "bar", value: "bar" },
                            { label: "psi", value: "psi" },
                            { label: "at", value: "at" },
                            { label: "atm", value: "atm" },
                            { label: "Torr", value: "Torr" },
                            { label: "hPa", value: "hPa" },
                            { label: "kPa", value: "kPa" },
                            { label: "MPa", value: "MPa" },
                            { label: "GPa", value: "GPa" },
                            { label: "mmHg", value: "mmHg" },
                            { label: "in Hg", value: "in Hg" },
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
              {formData.tech_find == "p" && (
                <>
                  <div className=" n  ">
                    <label htmlFor="tech_n" className="label">
                      {data?.payload?.tech_lang_keys["7"]} (n):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_n"
                        id="tech_n"
                        className="input my-1"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_n}
                        onChange={handleChange}
                      />
                      <span className="input_unit">mol</span>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_find == "p" || formData.tech_find == "n") && (
                <>
                  <div className=" n  ">
                    <label htmlFor="tech_R" className="label">
                      {data?.payload?.tech_lang_keys["8"]} (R):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_R"
                        id="tech_R"
                        className="input my-1"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_R}
                        onChange={handleChange}
                      />
                      <span className="input_unit">J⋅K⁻¹⋅mol⁻¹</span>
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
                    <div className="w-full  md:p-3 rounded mt-3">
                      <div className="col-12  text-center mx-auto">
                        <p>
                          <strong>
                            {result?.tech_v1
                              ? `${data?.payload?.tech_lang_keys["9"]} (v₁)`
                              : result?.tech_t1
                              ? `${data?.payload?.tech_lang_keys["10"]} (T₁)`
                              : result?.tech_v2
                              ? `${data?.payload?.tech_lang_keys["11"]} (v₂)`
                              : result?.tech_t2
                              ? `${data?.payload?.tech_lang_keys["12"]} (T₂)`
                              : result?.tech_p_val
                              ? `${data?.payload?.tech_lang_keys["6"]} (p)`
                              : result?.tech_n_val
                              ? `${data?.payload?.tech_lang_keys["13"]} (n)`
                              : null}
                          </strong>
                        </p>

                        <p>
                          <strong className="text-green-800  text-[32px]">
                            {result?.tech_v1 ? (
                              <>
                                {result.tech_v1}{" "}
                                <span className="text-green-800 font-s-22">
                                  m³
                                </span>
                              </>
                            ) : result?.tech_t1 ? (
                              <>
                                {result.tech_t1}{" "}
                                <span className="text-green-800 font-s-22">
                                  K
                                </span>
                              </>
                            ) : result?.tech_v2 ? (
                              <>
                                {result.tech_v2}{" "}
                                <span className="text-green-800 font-s-22">
                                  m³
                                </span>
                              </>
                            ) : result?.tech_t2 ? (
                              <>
                                {result.tech_t2}{" "}
                                <span className="text-green-800 font-s-22">
                                  K
                                </span>
                              </>
                            ) : result?.tech_p_val ? (
                              <>
                                {result.tech_p_val}{" "}
                                <span className="text-green-800 font-s-22">
                                  Pa
                                </span>
                              </>
                            ) : result?.tech_n_val ? (
                              <>
                                {result.tech_n_val}{" "}
                                <span className="text-green-800 font-s-22">
                                  mol
                                </span>
                              </>
                            ) : null}
                          </strong>
                        </p>

                        {!result?.tech_p_val && !result?.tech_n_val && (
                          <div className="grid grid-cols-12 gap-1">
                            <div className="col-span-12 md:col-span-6 mt-2 bg-sky-100">
                              <div className="border radius-10 px-3 py-2">
                                <p>{data?.payload?.tech_lang_keys["6"]} (p)</p>
                                <p>
                                  <strong>{result?.tech_p} pascals</strong>
                                </p>
                              </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 mt-2 bg-sky-100">
                              <div className="border radius-10 px-3 py-2">
                                <p>{data?.payload?.tech_lang_keys["13"]} (n)</p>
                                <p>
                                  <strong>{result?.tech_n} mol</strong>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {result?.tech_v1 || result?.tech_v2 ? (
                          <>
                            <p className="text-start text-[18px] mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]}
                              </strong>
                            </p>
                            <div className="col-12 overflow-auto text-[16px]">
                              <table className="col-12 text-start">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result?.tech_v1
                                        ? `${data?.payload?.tech_lang_keys["9"]} (v₁)`
                                        : `${data?.payload?.tech_lang_keys["11"]} (v₂)`}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_mm3} cubic millimeters (mm³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result?.tech_v1
                                        ? `${data?.payload?.tech_lang_keys["9"]} (v₁)`
                                        : `${data?.payload?.tech_lang_keys["11"]} (v₂)`}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_cm3} cubic centimeters (cm³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result?.tech_v1
                                        ? `${data?.payload?.tech_lang_keys["9"]} (v₁)`
                                        : `${data?.payload?.tech_lang_keys["11"]} (v₂)`}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_dm3} cubic decimeters (dm³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result?.tech_v1
                                        ? `${data?.payload?.tech_lang_keys["9"]} (v₁)`
                                        : `${data?.payload?.tech_lang_keys["11"]} (v₂)`}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_cu_in} cubic inches (cu in)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result?.tech_v1
                                        ? `${data?.payload?.tech_lang_keys["9"]} (v₁)`
                                        : `${data?.payload?.tech_lang_keys["11"]} (v₂)`}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_cu_ft} cubic feet (cu ft)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result?.tech_v1
                                        ? `${data?.payload?.tech_lang_keys["9"]} (v₁)`
                                        : `${data?.payload?.tech_lang_keys["11"]} (v₂)`}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_cu_yd} cubic yards (cu yd)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result?.tech_v1
                                        ? `${data?.payload?.tech_lang_keys["9"]} (v₁)`
                                        : `${data?.payload?.tech_lang_keys["11"]} (v₂)`}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_cm3} milliliters (ml)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result?.tech_v1
                                        ? `${data?.payload?.tech_lang_keys["9"]} (v₁)`
                                        : `${data?.payload?.tech_lang_keys["11"]} (v₂)`}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {result?.tech_dm3} liters (L)
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : result?.tech_t1 || result?.tech_t2 ? (
                          <>
                            <p className="text-start text-[18px] mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]}
                              </strong>
                            </p>
                            <div className="col-12 overflow-auto">
                              <table className="col-12 text-start">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result?.tech_t1
                                        ? `${data?.payload?.tech_lang_keys["10"]} (T₁)`
                                        : `${data?.payload?.tech_lang_keys["12"]} (T₂)`}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_c} Celsius (°C)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result?.tech_t1
                                        ? `${data?.payload?.tech_lang_keys["10"]} (T₁)`
                                        : `${data?.payload?.tech_lang_keys["12"]} (T₂)`}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {result?.tech_f} Fahrenheit (°F)
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : result?.tech_p_val ? (
                          <>
                            <p className="text-start text-[18px] mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]}
                              </strong>
                            </p>
                            <div className="col-12 overflow-auto">
                              <table className="col-12 text-start">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_bar} bars (bar)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_psi} pounds per square inch
                                      (psi)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_at} technical atmospheres
                                      (at)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_atm} standard atmospheres
                                      (atm)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_torr} torrs (Torr)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_hpa} hectopascals (hPa)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_kpa} kilopascals (kPa)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_mpa} megapascals (MPa)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_gpa} gigapascals (GPa)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_in_hg} inches of mercury (in
                                      Hg)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_mmhg} millimeters of mercury
                                      (mmHg)
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

export default CharlesLawCalculator;

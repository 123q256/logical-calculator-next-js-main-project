"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useProjectileMotionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ProjectileMotionCalculator = () => {
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
    tech_method: "tof", //  tof  range  mh  fp
    tech_v: "30",
    tech_v_unit: "km/h",
    tech_a: "45",
    tech_a_unit: "rad",
    tech_h: "45",
    tech_h_unit: "ft",
    tech_g: "9.80665",
    tech_g_unit: "g",
    tech_t: "2",
    tech_t_unit: "hrs",
    changeResultValue: "sec",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useProjectileMotionCalculatorMutation();

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
        tech_v: formData.tech_v,
        tech_v_unit: formData.tech_v_unit,
        tech_a: formData.tech_a,
        tech_a_unit: formData.tech_a_unit,
        tech_h: formData.tech_h,
        tech_h_unit: formData.tech_h_unit,
        tech_g: formData.tech_g,
        tech_g_unit: formData.tech_g_unit,
        tech_t: formData.tech_t,
        tech_t_unit: formData.tech_t_unit,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_method: "tof", //  tof  range  mh  fp
      tech_v: "30",
      tech_v_unit: "km/h",
      tech_a: "45",
      tech_a_unit: "rad",
      tech_h: "45",
      tech_h_unit: "ft",
      tech_g: "9.80665",
      tech_g_unit: "g",
      tech_t: "2",
      tech_t_unit: "hrs",
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
    setFormData((prev) => ({ ...prev, tech_v_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_a_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_h_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_g_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };
  // result

  const conversionFactors = {
    "m/s": 1,
    "km/h": 3.6,
    "ft/s": 3.28084,
    mph: 2.23694,
    m: 1,
    km: 0.001,
    cm: 100,
    mm: 1000,
    ft: 3.28084,
    in: 39.3701,
    yd: 1.09361,
    mi: 0.000621371,
    "m/s²": 1,
    g: 0.101971621298,
  };

  const unitOptions = {
    velocity: ["m/s", "km/h", "ft/s", "mph"],
    distance: ["m", "km", "cm", "mm", "ft", "in", "yd", "mi"],
    gravity: ["m/s²", "g"],
  };

  const initialUnits = {
    tech_vx: "m/s",
    tech_vy: "m/s",
    tech_g: "m/s²",
    tech_hv: "m/s",
    tech_vv: "m/s",
    tech_x: "m",
    tech_y: "m",
  };

  const [selectedUnits, setSelectedUnits] = useState(initialUnits);

  const handleUnitChange = (key, newUnit) => {
    setSelectedUnits((prev) => ({ ...prev, [key]: newUnit }));
  };

  const convertValue = (originalValue, fromUnit, toUnit) => {
    if (!originalValue || isNaN(originalValue)) return "";
    const converted =
      originalValue * (conversionFactors[toUnit] / conversionFactors[fromUnit]);
    return converted.toFixed(2);
  };

  const renderRow = (label, valueKey, unitType) => {
    const originalValue = result?.[valueKey];
    const fromUnit = initialUnits[valueKey];
    const toUnit = selectedUnits[valueKey];
    const convertedValue = convertValue(originalValue, fromUnit, toUnit);

    return (
      <tr key={valueKey}>
        <td className="py-2 border-b" width="60%">
          {label}
        </td>
        <td className="py-2 border-b">
          <span className="value-span">{convertedValue}</span>
          <select
            className="unitSelect d-inline border-0 text-blue text-[16px] bg-transparent outline-none w-[70px] result_select_dropdown"
            value={toUnit}
            onChange={(e) => handleUnitChange(valueKey, e.target.value)}
          >
            {unitOptions[unitType].map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </td>
      </tr>
    );
  };

  const [convertedResult, setConvertedResult] = useState(null);

  const handleChange1 = (e) => {
    const selectedUnit = e.target.value;
    const originalValue =
      result?.tech_check === "tof"
        ? result.tech_tof
        : result?.tech_check === "range"
        ? result.tech_r
        : result?.tech_check === "mh"
        ? result.tech_hmax
        : result?.tech_check === "fp"
        ? result.tech_vel
        : 0;

    const numericValue = parseFloat(originalValue);
    let convertedValue = numericValue;

    switch (selectedUnit) {
      case "sec":
      case "m":
      case "m/s":
        convertedValue = numericValue;
        break;
      case "min":
        convertedValue = numericValue / 60;
        break;
      case "hrs":
        convertedValue = numericValue / 3600;
        break;
      case "km":
        convertedValue = numericValue / 1000;
        break;
      case "cm":
        convertedValue = numericValue * 100;
        break;
      case "mm":
        convertedValue = numericValue * 1000;
        break;
      case "ft":
        convertedValue = numericValue * 3.28084;
        break;
      case "in":
        convertedValue = numericValue * 39.3701;
        break;
      case "yd":
        convertedValue = numericValue * 1.09361;
        break;
      case "mi":
        convertedValue = numericValue / 1609.34;
        break;
      case "km/h":
        convertedValue = numericValue * 3.6;
        break;
      case "ft/s":
        convertedValue = numericValue * 3.28084;
        break;
      case "mph":
        convertedValue = numericValue * 2.23694;
        break;
      default:
        convertedValue = numericValue;
    }

    setFormData({ ...formData, changeResultValue: selectedUnit });
    setConvertedResult(convertedValue.toFixed(2));
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
              <div className="col-span-12">
                <div className="w-full mx-auto col-12 px-2 mt-0 mt-lg-2">
                  <label htmlFor="tech_method" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
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
                      <option value="tof">
                        {data?.payload?.tech_lang_keys["2"]}
                      </option>
                      <option value="range">
                        {data?.payload?.tech_lang_keys["3"]}{" "}
                      </option>
                      <option value="mh">
                        {data?.payload?.tech_lang_keys["4"]}{" "}
                      </option>
                      <option value="fp">
                        {data?.payload?.tech_lang_keys["5"]}{" "}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                <label htmlFor="tech_v" className="label">
                  {data?.payload?.tech_lang_keys["12"]}{" "}
                  {data?.payload?.tech_lang_keys["8"]} (V)
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_v"
                    step="any"
                    min="1"
                    className="mt-1 input"
                    value={formData.tech_v}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_v_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m/s", value: "m/s" },
                        { label: "km/h", value: "km/h" },
                        { label: "ft/s", value: "ft/s" },
                        { label: "mph", value: "mph" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                <label htmlFor="tech_a" className="label">
                  {data?.payload?.tech_lang_keys["6"]} (α)
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_a"
                    step="any"
                    min="1"
                    className="mt-1 input"
                    value={formData.tech_a}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_a_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "deg", value: "deg" },
                        { label: "rad", value: "rad" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                <label htmlFor="tech_h" className="label">
                  {data?.payload?.tech_lang_keys["12"]}{" "}
                  {data?.payload?.tech_lang_keys["7"]} (h)
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_h"
                    step="any"
                    min="1"
                    className="mt-1 input"
                    value={formData.tech_h}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_h_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
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
                          onClick={() => setUnitHandler2(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                <label htmlFor="tech_g" className="label">
                  {data?.payload?.tech_lang_keys["9"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_g"
                    step="any"
                    min="1"
                    className="mt-1 input"
                    value={formData.tech_g}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_g_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m/s²", value: "m/s²" },
                        { label: "g", value: "g" },
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
              {formData.tech_method == "fp" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_t" className="label">
                      {data?.payload?.tech_lang_keys["10"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_t"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_t}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_t_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "sec", value: "sec" },
                            { label: "min", value: "min" },
                            { label: "hrs", value: "hrs" },
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[70%] lg:w-[70%]">
                        <table className="w-full font-s-18">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="60%">
                                <strong>
                                  {result?.tech_check === "tof"
                                    ? data?.payload?.tech_lang_keys["2"]
                                    : result?.tech_check === "range"
                                    ? data?.payload?.tech_lang_keys["3"]
                                    : result?.tech_check === "mh"
                                    ? data?.payload?.tech_lang_keys["4"]
                                    : result?.tech_check === "fp"
                                    ? data?.payload?.tech_lang_keys["8"]
                                    : ""}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                <strong
                                  className="text-blue answer1"
                                  id="resultValue"
                                >
                                  {convertedResult ??
                                    (result?.tech_check === "tof"
                                      ? result?.tech_tof
                                      : result?.tech_check === "range"
                                      ? result?.tech_r
                                      : result?.tech_check === "mh"
                                      ? result?.tech_hmax
                                      : result?.tech_check === "fp"
                                      ? result?.tech_vel
                                      : null)}
                                </strong>

                                <select
                                  id="changeResultValue"
                                  name="changeResultValue"
                                  value={formData.changeResultValue}
                                  onChange={handleChange1}
                                  className="d-inline border-0 border-none text-blue text-[16px] w-[70px] result_select_dropdown"
                                >
                                  {result?.tech_check === "tof" ? (
                                    <>
                                      <option value="sec">sec</option>
                                      <option value="min">min</option>
                                      <option value="hrs">hrs</option>
                                    </>
                                  ) : result?.tech_check === "range" ||
                                    result?.tech_check === "mh" ? (
                                    <>
                                      <option value="m">m</option>
                                      <option value="km">km</option>
                                      <option value="cm">cm</option>
                                      <option value="mm">mm</option>
                                      <option value="ft">ft</option>
                                      <option value="in">in</option>
                                      <option value="yd">yd</option>
                                      <option value="mi">mi</option>
                                    </>
                                  ) : result?.tech_check === "fp" ? (
                                    <>
                                      <option value="m/s">m/s</option>
                                      <option value="km/h">km/h</option>
                                      <option value="ft/s">ft/s</option>
                                      <option value="mph">mph</option>
                                    </>
                                  ) : null}
                                </select>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="w-full md:w-[70%] lg:w-[70%]">
                        <table className="w-full text-[16px]">
                          <tbody>
                            {renderRow(
                              `${data?.payload?.tech_lang_keys["12"]} ${data?.payload?.tech_lang_keys["13"]} ${data?.payload?.tech_lang_keys["8"]} (Vx)`,
                              "tech_vx",
                              "velocity"
                            )}
                            {renderRow(
                              `${data?.payload?.tech_lang_keys["12"]} ${data?.payload?.tech_lang_keys["14"]} ${data?.payload?.tech_lang_keys["8"]} (Vy)`,
                              "tech_vy",
                              "velocity"
                            )}
                            {renderRow(
                              `${data?.payload?.tech_lang_keys["9"]}`,
                              "tech_g",
                              "gravity"
                            )}

                            {result?.tech_check === "fp" && (
                              <>
                                {renderRow(
                                  `${data?.payload?.tech_lang_keys["13"]} ${data?.payload?.tech_lang_keys["8"]}`,
                                  "tech_hv",
                                  "velocity"
                                )}
                                {renderRow(
                                  `${data?.payload?.tech_lang_keys["14"]} ${data?.payload?.tech_lang_keys["8"]}`,
                                  "tech_vv",
                                  "velocity"
                                )}
                                {renderRow(
                                  `${data?.payload?.tech_lang_keys["13"]} ${data?.payload?.tech_lang_keys["15"]}`,
                                  "tech_x",
                                  "distance"
                                )}
                                {renderRow(
                                  `${data?.payload?.tech_lang_keys["7"]}`,
                                  "tech_y",
                                  "distance"
                                )}
                              </>
                            )}
                          </tbody>
                        </table>
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

export default ProjectileMotionCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useBoylesLawCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BoyleLawCalculator = () => {
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
    tech_find: "1", // 1 2 3 4 5 6
    tech_p1: Number(2),
    tech_p1_unit: "Pa",
    tech_v1: Number(3),
    tech_v1_unit: "m³",
    tech_p2: Number(3),
    tech_p2_unit: "Pa",
    tech_v2: Number(5),
    tech_v2_unit: "m³",
    tech_temp: Number(8),
    tech_temp_unit: "°C",
    tech_amount: Number(8),
    tech_R: "8.3144626",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBoylesLawCalculatorMutation();

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
      const response = await calculateActivationCalculator({
        tech_find: formData.tech_find,
        tech_p1: formData.tech_p1,
        tech_p1_unit: formData.tech_p1_unit,
        tech_v1: formData.tech_v1,
        tech_v1_unit: formData.tech_v1_unit,
        tech_p2: formData.tech_p2,
        tech_p2_unit: formData.tech_p2_unit,
        tech_v2: formData.tech_v2,
        tech_v2_unit: formData.tech_v2_unit,
        tech_temp: formData.tech_temp,
        tech_temp_unit: formData.tech_temp_unit,
        tech_amount: formData.tech_amount,
        tech_R: formData.tech_R,
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
      tech_find: "1", // 1 2 3 4 5 6
      tech_p1: "2",
      tech_p1_unit: "Pa",
      tech_v1: "3",
      tech_v1_unit: "m³",
      tech_p2: "3",
      tech_p2_unit: "Pa",
      tech_v2: "5",
      tech_v2_unit: "m³",
      tech_temp: "8",
      tech_temp_unit: "°C",
      tech_amount: "8",
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
    setFormData((prev) => ({ ...prev, tech_p1_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_v1_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_p2_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_v2_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_temp_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  const formatNumberSmart = (num) => {
    const number = Number(num);
    if (isNaN(number)) return "0";
    return Math.abs(number) >= 1e6 || (Math.abs(number) < 1e-4 && number !== 0)
      ? number.toExponential(2)
      : number.toLocaleString(undefined, { maximumFractionDigits: 6 });
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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 gap-1  md:gap-4">
              <div className="relative">
                <label htmlFor="tech_find" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
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
                    <option value="1">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["1"]}{" "}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {(formData.tech_find == "1" ||
                formData.tech_find == "2" ||
                formData.tech_find == "3") && (
                <>
                  <div className="pressure_one">
                    <label htmlFor="tech_p1" className="label">
                      {data?.payload?.tech_lang_keys["1"]} (p₁):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_p1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_p1}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_p1_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Pa", value: "Pa" },
                            { label: "Bar", value: "Bar" },
                            { label: "Torr", value: "Torr" },
                            { label: "psi", value: "psi" },
                            { label: "at", value: "at" },
                            { label: "atm", value: "atm" },
                            { label: "hPa", value: "hPa" },
                            { label: "MPa", value: "MPa" },
                            { label: "kPa", value: "kPa" },
                            { label: "GPa", value: "GPa" },
                            { label: "mmHg", value: "mmHg" },
                            { label: "in Hg", value: "in Hg" },
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
              {(formData.tech_find == "1" ||
                formData.tech_find == "2" ||
                formData.tech_find == "4" ||
                formData.tech_find == "5" ||
                formData.tech_find == "6") && (
                <>
                  <div className="volume_one">
                    <label htmlFor="tech_v1" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (V₁):
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
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_v1_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cubic millimeters (mm³)", value: "mm³" },
                            { label: "cubic centimeters (cm³)", value: "cm³" },
                            { label: "cubic decimeters (dm³)", value: "dm³" },
                            { label: "cubic meters (m³)", value: "m³" },
                            { label: "cubic inches (in³)", value: "in³" },
                            { label: "cubic feet (ft³)", value: "ft³" },
                            { label: "cubic yards (yd³)", value: "yd³" },
                            { label: "milliliters (ml)", value: "ml" },
                            { label: "liters", value: "liters" },
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
              {(formData.tech_find == "1" ||
                formData.tech_find == "3" ||
                formData.tech_find == "4") && (
                <>
                  <div className="pressure_two">
                    <label htmlFor="tech_p2" className="label">
                      {data?.payload?.tech_lang_keys["3"]} (p₂):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_p2"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_p2}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_p2_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Pa", value: "Pa" },
                            { label: "Bar", value: "Bar" },
                            { label: "Torr", value: "Torr" },
                            { label: "psi", value: "psi" },
                            { label: "at", value: "at" },
                            { label: "atm", value: "atm" },
                            { label: "hPa", value: "hPa" },
                            { label: "MPa", value: "MPa" },
                            { label: "kPa", value: "kPa" },
                            { label: "GPa", value: "GPa" },
                            { label: "mmHg", value: "mmHg" },
                            { label: "in Hg", value: "in Hg" },
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
              {(formData.tech_find == "2" ||
                formData.tech_find == "3" ||
                formData.tech_find == "4") && (
                <>
                  <div className="volume_two ">
                    <label htmlFor="tech_v2" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (V₂):
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
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_v2_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cubic millimeters (mm³)", value: "mm³" },
                            { label: "cubic centimeters (cm³)", value: "cm³" },
                            { label: "cubic decimeters (dm³)", value: "dm³" },
                            { label: "cubic meters (m³)", value: "m³" },
                            { label: "cubic inches (in³)", value: "in³" },
                            { label: "cubic feet (ft³)", value: "ft³" },
                            { label: "cubic yards (yd³)", value: "yd³" },
                            { label: "milliliters (ml)", value: "ml" },
                            { label: "liters", value: "liters" },
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
              {formData.tech_find == "6" && (
                <>
                  <div className="temperature ">
                    <label htmlFor="tech_temp" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_temp"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_temp}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_temp_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "°C", value: "°C" },
                            { label: "°F", value: "°F" },
                            { label: "K", value: "K" },
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
              {formData.tech_find == "5" && (
                <>
                  <div className=" amount ">
                    <label htmlFor="tech_amount" className="label">
                      {data?.payload?.tech_lang_keys["6"]} (n):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_amount"
                        id="tech_amount"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_amount}
                        onChange={handleChange}
                      />
                      <span className="input_unit">mol</span>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_find == "5" || formData.tech_find == "6") && (
                <>
                  <div className=" gas ">
                    <label htmlFor="tech_R" className="label">
                      {data?.payload?.tech_lang_keys["7"]} (R):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_R"
                        id="tech_R"
                        className="input my-2"
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>
        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full rounded-lg mt-3">
                      <div className="w-full">
                        {(result.tech_method == "1" ||
                          result.tech_method == "3") && (
                          <div className="bordered rounded-lg px-3 py-2 bg-sky">
                            <strong>{result.tech_content} = </strong>
                            <strong className="text-[#119154] text-[16px] md:text-[25px]">
                              {Number(result.tech_ans).toFixed(2)}{" "}
                              <span className="text-[#119154]">(m³)</span>
                            </strong>
                          </div>
                        )}

                        {(result.tech_method == "2" ||
                          result.tech_method == "4") && (
                          <div className="bordered rounded-lg px-3 py-2 bg-sky">
                            <strong>{result.tech_content} = </strong>
                            <strong className="text-[#119154] text-[16px] md:text-[25px]">
                              {Number(result.tech_ans).toFixed(2)}{" "}
                              <span className="text-[#119154]">(Pa)</span>
                            </strong>
                          </div>
                        )}

                        {result.tech_method == "5" && (
                          <>
                            <div className="bordered rounded-lg px-3 py-2 bg-sky">
                              <strong>{result.tech_content} = </strong>
                              <strong className="text-[#119154] text-[16px] md:text-[25px]">
                                {result.tech_pooran}{" "}
                                <span className="text-[#119154]">(K)</span>
                              </strong>
                            </div>
                            <p className="mt-3 mb-2">
                              <strong>Results in other units:</strong>
                            </p>
                            <div className="col-12 overflow-auto">
                              <table
                                className="col-12 col-lg-7"
                                cellSpacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result.tech_pooran - 273.15} (°C)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {(result.tech_pooran - 273.15) * (9 / 5) +
                                        32}{" "}
                                      (°F)
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {result.tech_method == "6" && (
                          <div className="col-12 text-center bg-sky bordered rounded-lg p-2">
                            <p>
                              <strong>{result.tech_content}</strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[16px] md:text-[25px]">
                                {result.tech_final}
                              </strong>
                            </p>
                          </div>
                        )}

                        {(result.tech_method == "1" ||
                          result.tech_method == "2" ||
                          result.tech_method == "3" ||
                          result.tech_method == "4") && (
                          <>
                            <div className="bordered rounded-lg px-3 py-2 bg-sky mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[5]} (t) ={" "}
                              </strong>
                              <strong className="text-[#119154] text-[16px] md:text-[25px]">
                                {result.tech_temp} K
                              </strong>
                            </div>
                            <div className="bordered rounded-lg px-3 py-2 bg-sky mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[6]} (n) ={" "}
                              </strong>
                              <strong className="text-[#119154] text-[16px] md:text-[25px]">
                                {result.tech_n} mol
                              </strong>
                            </div>
                          </>
                        )}

                        {(result.tech_method == "1" ||
                          result.tech_method == "3") && (
                          <>
                            <p className="mt-3 mb-2">
                              <strong>Results in other units:</strong>
                            </p>
                            <div className="col-12 overflow-auto">
                              <table className="" cellSpacing="0">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {Number(
                                        result.tech_ans * 1000000000
                                      ).toFixed(4)}{" "}
                                      (mm³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {Number(
                                        result.tech_ans * 1000000
                                      ).toFixed(4)}{" "}
                                      (cm³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {Number(result.tech_ans * 1000).toFixed(
                                        4
                                      )}{" "}
                                      (dm³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {Number(result.tech_ans * 61024).toFixed(
                                        4
                                      )}{" "}
                                      (cu in)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {Number(result.tech_ans * 35.315).toFixed(
                                        4
                                      )}{" "}
                                      (cu ft)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {Number(
                                        result.tech_ans * 1000000
                                      ).toFixed(4)}{" "}
                                      (ml)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {Number(result.tech_ans * 1000).toFixed(
                                        2
                                      )}{" "}
                                      (liters)
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {(result.tech_method == "2" ||
                          result.tech_method == "4") && (
                          <>
                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[8]}:
                              </strong>
                            </p>
                            <div className="col-12 overflow-auto text-[14px] md:text-[18px]">
                              <table className="" cellSpacing="0">
                                <tbody>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {formatNumberSmart(
                                        result.tech_ans * 0.00001
                                      )}{" "}
                                      bars (bar)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {formatNumberSmart(
                                        result.tech_ans * 0.00014504
                                      )}{" "}
                                      pounds per square inch (psi)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {formatNumberSmart(
                                        result.tech_ans * 0.000010197
                                      )}{" "}
                                      technical atmospheres (at)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {formatNumberSmart(
                                        result.tech_ans * 0.00000987
                                      )}{" "}
                                      standard atmospheres (atm)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {formatNumberSmart(
                                        result.tech_ans * 0.0075
                                      )}{" "}
                                      torrs (Torr)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {formatNumberSmart(
                                        result.tech_ans * 0.01
                                      )}{" "}
                                      hectopascals (hPa)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {formatNumberSmart(
                                        result.tech_ans * 0.001
                                      )}{" "}
                                      kilopascals (kPa)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {formatNumberSmart(
                                        result.tech_ans * 0.000001
                                      )}{" "}
                                      megapascals (MPa)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {formatNumberSmart(
                                        result.tech_ans * 0.000000001
                                      )}{" "}
                                      gigapascals (GPa)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {formatNumberSmart(
                                        result.tech_ans * 0.0002953
                                      )}{" "}
                                      inches of mercury (in Hg)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {result.tech_content}
                                    </td>
                                    <td className="py-2 ps-2">
                                      {formatNumberSmart(
                                        result.tech_ans * 0.0075
                                      )}{" "}
                                      millimeters of mercury (mmHg)
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
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

export default BoyleLawCalculator;

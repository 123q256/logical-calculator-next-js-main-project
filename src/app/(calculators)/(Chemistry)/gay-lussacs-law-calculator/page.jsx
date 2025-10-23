"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useGayLussacsLawCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GayLussacsLawCalculator = () => {
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
    tech_selection: "1", // 1 2 3 4 5 6
    tech_p1: Number(3),
    tech_p1_unit: "Pa",
    tech_t1: Number(3),
    tech_t1_unit: "K",
    tech_p2: Number(3),
    tech_p2_unit: "Pa",
    tech_t2: Number(3),
    tech_t2_unit: "K",
    tech_v1: Number(3),
    tech_v1_unit: "mm³",
    tech_amount: Number(1),
    tech_R: Number(8.3144626),
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGayLussacsLawCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_selection: formData.tech_selection,
        tech_p1: formData.tech_p1,
        tech_p1_unit: formData.tech_p1_unit,
        tech_t1: formData.tech_t1,
        tech_t1_unit: formData.tech_t1_unit,
        tech_p2: formData.tech_p2,
        tech_p2_unit: formData.tech_p2_unit,
        tech_t2: formData.tech_t2,
        tech_t2_unit: formData.tech_t2_unit,
        tech_v1: formData.tech_v1,
        tech_v1_unit: formData.tech_v1_unit,
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
      tech_selection: "1", // 1 2 3 4 5 6
      tech_p1: "3",
      tech_p1_unit: "Pa",
      tech_t1: "3",
      tech_t1_unit: "K",
      tech_p2: "3",
      tech_p2_unit: "Pa",
      tech_t2: "3",
      tech_t2_unit: "K",
      tech_v1: "3",
      tech_v1_unit: "mm³",
      tech_amount: "1",
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
    setFormData((prev) => ({ ...prev, tech_t1_unit: unit }));
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
    setFormData((prev) => ({ ...prev, tech_t2_unit: unit }));
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

  const formatNumberSmart = (num) => {
    const number = Number(num);
    if (isNaN(number)) return "0";
    return Math.abs(number) >= 1e6 || (Math.abs(number) < 1e-4 && number !== 0)
      ? number.toExponential(2)
      : number.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  // result
  let assign = "";
  if (result?.tech_method == "1") {
    assign = `${data?.payload?.tech_lang_keys["2"]} (T₂)`;
  } else if (result?.tech_method == "4") {
    assign = `${data?.payload?.tech_lang_keys["5"]} (T₁)`;
  } else if (result?.tech_method == "2") {
    assign = `${data?.payload?.tech_lang_keys["3"]} (p₂)`;
  } else if (result?.tech_method == "3") {
    assign = `${data?.payload?.tech_lang_keys["4"]} (p₁)`;
  } else if (result?.tech_method == "6") {
    assign = `${data?.payload?.tech_lang_keys["7"]} (n)`;
  } else if (result?.tech_method == "5") {
    assign = `${data?.payload?.tech_lang_keys["6"]} (V)`;
  }

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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 gap-1  md:gap-2">
              <div className="relative">
                <label htmlFor="tech_selection" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_selection"
                    id="tech_selection"
                    value={formData.tech_selection}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]} (T₂)
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]} (p₂)
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]} (p₁)
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["5"]} (T₁){" "}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["6"]} (V)
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["6"]} (n)
                    </option>
                  </select>
                </div>
              </div>

              {(formData.tech_selection == "1" ||
                formData.tech_selection == "2" ||
                formData.tech_selection == "4" ||
                formData.tech_selection == "5" ||
                formData.tech_selection == "6") && (
                <>
                  <div className="pressure_one">
                    <label htmlFor="tech_p1" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (p₁):
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
              {(formData.tech_selection == "1" ||
                formData.tech_selection == "2" ||
                formData.tech_selection == "3" ||
                formData.tech_selection == "5" ||
                formData.tech_selection == "6") && (
                <>
                  <div className="temperature_one">
                    <label htmlFor="tech_t1" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (T₁):
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
                            { label: "°C", value: "°C" },
                            { label: "°F", value: "°F" },
                            { label: "K", value: "K" },
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
              {(formData.tech_selection == "1" ||
                formData.tech_selection == "3" ||
                formData.tech_selection == "4") && (
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
              {(formData.tech_selection == "2" ||
                formData.tech_selection == "3" ||
                formData.tech_selection == "4") && (
                <>
                  <div className="volume_two ">
                    <label htmlFor="tech_t2" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (T₂):
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
                            { label: "°C", value: "°C" },
                            { label: "°F", value: "°F" },
                            { label: "K", value: "K" },
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
              {formData.tech_selection == "6" && (
                <>
                  <div className="temperature ">
                    <label htmlFor="tech_v1" className="label">
                      {data?.payload?.tech_lang_keys["6"]} (V):
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
                            { label: "mm³", value: "mm³" },
                            { label: "cm³", value: "cm³" },
                            { label: "dm³", value: "dm³" },
                            { label: "m³", value: "m³" },
                            { label: "in³", value: "in³" },
                            { label: "ft³", value: "ft³" },
                            { label: "yd³", value: "yd³" },
                            { label: "ml", value: "ml" },
                            { label: "liters", value: "liters" },
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
              {formData.tech_selection == "5" && (
                <>
                  <div className=" amount ">
                    <label htmlFor="tech_amount" className="label">
                      {data?.payload?.tech_lang_keys["7"]} (n):
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
              {(formData.tech_selection == "5" ||
                formData.tech_selection == "6") && (
                <>
                  <div className=" gas ">
                    <label htmlFor="tech_R" className="label">
                      {data?.payload?.tech_lang_keys["8"]} (R):
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
                        {(result?.tech_method == "1" ||
                          result?.tech_method == "4") && (
                          <>
                            <div className="bg-sky my-2 bordered rounded-lg px-3 py-2">
                              <strong>{assign} =</strong>
                              <strong className="text-[#119154] text-[21px]">
                                {result?.tech_temp}{" "}
                                <span className="text-[#119154] text-[18px]">
                                  (K)
                                </span>
                              </strong>
                            </div>
                          </>
                        )}
                        {(result?.tech_method == "2" ||
                          result?.tech_method == "3") && (
                          <>
                            <div className="bg-sky my-2 bordered rounded-lg px-3 py-2">
                              <strong>{assign} =</strong>
                              <strong className="text-[#119154] text-[21px]">
                                {result?.tech_temp}{" "}
                                <span className="text-[#119154] text-[18px]">
                                  (Pa)
                                </span>
                              </strong>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "5" && (
                          <>
                            <div className="bg-sky my-2 bordered rounded-lg px-3 py-2">
                              <strong>{assign} =</strong>
                              <strong className="text-[#119154] text-[21px]">
                                {result?.tech_calculate_volume}{" "}
                                <span className="text-[#119154] text-[18px]">
                                  (m³)
                                </span>
                              </strong>
                            </div>
                            <p className="mt-3 mb-2">
                              <strong>Results in other units:</strong>
                            </p>
                            <div className="w-full overflow-auto">
                              <table
                                className="w-full md:w-[80%] lg:w-[80%]"
                                cellSpacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {Number(
                                        result?.tech_calculate_volume *
                                          1000000000
                                      ).toFixed(2)}{" "}
                                      (mm³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {Number(
                                        result?.tech_calculate_volume * 1000000
                                      ).toFixed(2)}{" "}
                                      (cm³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {Number(
                                        result?.tech_calculate_volume * 1000
                                      ).toFixed(2)}{" "}
                                      (dm³)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {Number(
                                        result?.tech_calculate_volume * 61024
                                      ).toFixed(2)}{" "}
                                      (cu in)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {Number(
                                        result?.tech_calculate_volume * 35.315
                                      ).toFixed(2)}{" "}
                                      (cu ft)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {Number(
                                        result?.tech_calculate_volume * 1000000
                                      ).toFixed(2)}{" "}
                                      (ml)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">{assign}</td>
                                    <td className="py-2 ps-2">
                                      {Number(
                                        result?.tech_calculate_volume * 1000
                                      ).toFixed(2)}{" "}
                                      (liters)
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "6" && (
                          <>
                            <div className="bg-sky my-2 bordered rounded-lg px-3 py-2">
                              <strong>{assign} =</strong>
                              <strong className="text-[#119154] text-[21px]">
                                {result?.tech_n}{" "}
                                <span className="text-[#119154] text-[18px]">
                                  (mol)
                                </span>
                              </strong>
                            </div>
                          </>
                        )}
                        {(result?.tech_method == "1" ||
                          result?.tech_method == "4" ||
                          result?.tech_method == "2" ||
                          result?.tech_method == "3") && (
                          <>
                            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-sky my-2 bordered rounded-lg px-3 py-2">
                                  <strong>Volume (V) =</strong>
                                  <strong className="text-[#119154] text-[21px]">
                                    {Number(result?.tech_volume).toFixed(4)} m³
                                  </strong>
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-sky my-2 bordered rounded-lg px-3 py-2">
                                  <strong>Amount of gas (n) =</strong>
                                  <strong className="text-[#119154] text-[21px]">
                                    {result?.tech_amount_of_gas} mol
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {(result?.tech_method == "1" ||
                          result?.tech_method == "4") && (
                          <>
                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["9"]}:
                              </strong>
                            </p>
                            <div className="w-full overflow-auto">
                              <table
                                className="w-full md:w-[80%] lg:w-[80%]"
                                cellSpacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_temp - 273.15} (°C)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">{assign}</td>
                                    <td className="py-2 ps-2">
                                      {(result?.tech_temp - 273.15) * (9 / 5) +
                                        32}{" "}
                                      (°F)
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {(result?.tech_method == "2" ||
                          result?.tech_method == "3") && (
                          <>
                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["9"]}:
                              </strong>
                            </p>
                            <div className="w-full overflow-auto">
                              <table
                                className="w-full md:w-[80%] lg:w-[80%]"
                                cellSpacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_temp * 0.00001} bars (bar)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_temp * 0.00014504} pounds
                                      per square inch (psi)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_temp * 0.000010197}{" "}
                                      technical atmospheres (at)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_temp * 0.00000987} standard
                                      atmospheres (atm)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_temp * 0.0075} torrs (Torr)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_temp * 0.01} hectopascals
                                      (hPa)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_temp * 0.001} kilopascals
                                      (kPa)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_temp * 0.000001} megapascals
                                      (MPa)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_temp * 0.000000001}{" "}
                                      megapascals (GPa)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {assign}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      {result?.tech_temp * 0.0002953} inches of
                                      mercury (in Hg)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">{assign}</td>
                                    <td className="py-2 ps-2">
                                      {result?.tech_temp * 0.0075} millimeters
                                      of mercury (mmHg)
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

export default GayLussacsLawCalculator;

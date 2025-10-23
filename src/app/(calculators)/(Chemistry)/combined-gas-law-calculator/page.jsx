"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCombinedGasLawCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CombinedGasLawCalculator = () => {
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
    tech_calculation: "1", // 1 2 3 4 5 6
    tech_pressure_one: "10",
    tech_pressure_one_unit: "Pa",
    tech_volume_one: "12",
    tech_volume_one_unit: "m³",
    tech_temp_one: "5",
    tech_temp_one_unit: "K",
    tech_pressure_two: "7",
    tech_pressure_two_unit: "Pa",
    tech_volume_two: "2",
    tech_volume_two_unit: "m³",
    tech_temp_two: "8",
    tech_temp_two_unit: "K",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCombinedGasLawCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculation) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_calculation: formData.tech_calculation,
        tech_pressure_one: formData.tech_pressure_one,
        tech_pressure_one_unit: formData.tech_pressure_one_unit,
        tech_volume_one: formData.tech_volume_one,
        tech_volume_one_unit: formData.tech_volume_one_unit,
        tech_temp_one: formData.tech_temp_one,
        tech_temp_one_unit: formData.tech_temp_one_unit,
        tech_pressure_two: formData.tech_pressure_two,
        tech_pressure_two_unit: formData.tech_pressure_two_unit,
        tech_volume_two: formData.tech_volume_two,
        tech_volume_two_unit: formData.tech_volume_two_unit,
        tech_temp_two: formData.tech_temp_two,
        tech_temp_two_unit: formData.tech_temp_two_unit,
      }).unwrap();
      setResult(response); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_calculation: "1", // 1 2 3 4 5 6
      tech_pressure_one: "10",
      tech_pressure_one_unit: "Pa",
      tech_volume_one: "12",
      tech_volume_one_unit: "m³",
      tech_temp_one: "5",
      tech_temp_one_unit: "K",
      tech_pressure_two: "7",
      tech_pressure_two_unit: "Pa",
      tech_volume_two: "2",
      tech_volume_two_unit: "m³",
      tech_temp_two: "8",
      tech_temp_two_unit: "K",
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
    setFormData((prev) => ({ ...prev, tech_pressure_one_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_volume_one_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_temp_one_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pressure_two_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_volume_two_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_temp_two_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  // result

  const temperatureC = (result?.tech_temperature - 273.15).toFixed(4);
  const temperatureF = ((result?.tech_temperature - 273.15) * 9) / 5 + 32;
  const volumeLiters = result?.tech_volume / 0.001;
  const volumeML = result?.tech_volume / 0.000001;
  const volumeFeet = result?.tech_volume / 0.0283168;
  const volumeInch = result?.tech_volume / 1.63871e-5;
  const pressureKPA = result?.tech_pressure / 1000;
  const pressureBar = result?.tech_pressure / 100000;
  const pressureATM = result?.tech_pressure / 101325;
  const pressureHPA = result?.tech_pressure / 100;
  const pressureMMHG = result?.tech_pressure / 133.32;

  const isTemp = result?.tech_method == "1" || result?.tech_method == "4";
  const isVolume = result?.tech_method == "2" || result?.tech_method == "5";
  const isPressure = result?.tech_method == "3" || result?.tech_method == "6";

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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 gap-1 md:gap-2">
              <div className="space-y-2 relative">
                <label htmlFor="tech_calculation" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calculation"
                    id="tech_calculation"
                    value={formData.tech_calculation}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["7"]} (Tf)
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]} (Vi){" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["2"]} (Pi)
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["4"]} (Ti)
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["6"]} (Vf)
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["5"]} (Pf)
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_calculation == "1" ||
                formData.tech_calculation == "2" ||
                formData.tech_calculation == "4" ||
                formData.tech_calculation == "5" ||
                formData.tech_calculation == "6") && (
                <>
                  <div className="space-y-2 input-field p_one">
                    <label htmlFor="tech_pressure_one" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (P<sub>i</sub>):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_pressure_one"
                        step="any"
                        className="mt-2 input"
                        value={formData.tech_pressure_one}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_pressure_one_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Pa", value: "Pa" },
                            { label: "kPa", value: "kPa" },
                            { label: "Bar", value: "Bar" },
                            { label: "atm", value: "atm" },
                            { label: "mmHg", value: "mmHg" },
                            { label: "mbar", value: "mbar" },
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
              {(formData.tech_calculation == "1" ||
                formData.tech_calculation == "4" ||
                formData.tech_calculation == "5" ||
                formData.tech_calculation == "3" ||
                formData.tech_calculation == "6") && (
                <>
                  <div className="space-y-2 input-field v_one">
                    <label htmlFor="tech_volume_one" className="label">
                      {data?.payload?.tech_lang_keys["3"]} (V<sub>i</sub>):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_volume_one"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_volume_one}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_volume_one_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cubic meters (m³)", value: "m³" },
                            { label: "liters (l)", value: "l" },
                            { label: "milliliters (ml)", value: "ml" },
                            { label: "cubic feet (ft³)", value: "ft³" },
                            { label: "cubic inches (in³)", value: "in³" },
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
              {(formData.tech_calculation == "1" ||
                formData.tech_calculation == "2" ||
                formData.tech_calculation == "3" ||
                formData.tech_calculation == "5" ||
                formData.tech_calculation == "6") && (
                <>
                  <div className="space-y-2 input-field t_one">
                    <label htmlFor="tech_temp_one" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (T<sub>i</sub>):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_temp_one"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_temp_one}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_temp_one_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "°C", value: "°C" },
                            { label: "°F", value: "°F" },
                            { label: "K", value: "K" },
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
              {(formData.tech_calculation == "1" ||
                formData.tech_calculation == "2" ||
                formData.tech_calculation == "3" ||
                formData.tech_calculation == "4" ||
                formData.tech_calculation == "5") && (
                <>
                  <div className="space-y-2 input-field p_two">
                    <label htmlFor="tech_pressure_two" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (P<sub>f</sub>):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_pressure_two"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_pressure_two}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_pressure_two_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Pa", value: "Pa" },
                            { label: "kPa", value: "kPa" },
                            { label: "Bar", value: "Bar" },
                            { label: "atm", value: "atm" },
                            { label: "mmHg", value: "mmHg" },
                            { label: "mbar", value: "mbar" },
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
              {(formData.tech_calculation == "1" ||
                formData.tech_calculation == "2" ||
                formData.tech_calculation == "3" ||
                formData.tech_calculation == "4" ||
                formData.tech_calculation == "6") && (
                <>
                  <div className="space-y-2 input-field v_two">
                    <label htmlFor="tech_volume_two" className="label">
                      {data?.payload?.tech_lang_keys["3"]} (V<sub>f</sub>):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_volume_two"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_volume_two}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_volume_two_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cubic meters (m³)", value: "m³" },
                            { label: "liters (l)", value: "l" },
                            { label: "milliliters (ml)", value: "ml" },
                            { label: "cubic feet (ft³)", value: "ft³" },
                            { label: "cubic inches (in³)", value: "in³" },
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
              {(formData.tech_calculation == "2" ||
                formData.tech_calculation == "3" ||
                formData.tech_calculation == "4" ||
                formData.tech_calculation == "5" ||
                formData.tech_calculation == "6") && (
                <>
                  <div className="space-y-2 input-field t_two ">
                    <label htmlFor="tech_temp_two" className="label">
                      {data?.payload?.tech_lang_keys["7"]} (T<sub>f</sub>):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_temp_two"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_temp_two}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_temp_two_unit} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "°C", value: "°C" },
                            { label: "°F", value: "°F" },
                            { label: "K", value: "K" },
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full p-3 mt-3 grid gap-4">
                      {result?.tech_method == "1" && (
                        <>
                          <p>
                            <strong>
                              {data?.payload?.tech_lang_keys["7"]} (T
                              <sub>f</sub>)
                            </strong>
                          </p>
                          <p className="text-[#119154] text-[28px] font-bold">
                            {Number(result.tech_temperature).toFixed(2)} (K)
                          </p>
                        </>
                      )}

                      {result?.tech_method == "2" && (
                        <>
                          <p>
                            <strong>
                              {data?.payload?.tech_lang_keys["3"]} (V
                              <sub>i</sub>)
                            </strong>
                          </p>
                          <p className="text-[#119154] text-[28px] font-bold">
                            {Number(result.tech_volume).toFixed(2)} (m
                            <sup className="text-[22px]">3</sup>)
                          </p>
                        </>
                      )}

                      {result?.tech_method == "3" && (
                        <>
                          <p>
                            <strong>
                              {data?.payload?.tech_lang_keys["2"]}(P<sub>i</sub>
                              )
                            </strong>
                          </p>
                          <p className="text-[#119154] text-[28px] font-bold">
                            {Number(result.tech_pressure).toFixed(2)} (Pa)
                          </p>
                        </>
                      )}

                      {result?.tech_method == "4" && (
                        <>
                          <p>
                            <strong>
                              {data?.payload?.tech_lang_keys["4"]} (T
                              <sub>i</sub>)
                            </strong>
                          </p>
                          <p className="text-[#119154] text-[28px] font-bold">
                            {Number(result.tech_temperature).toFixed(2)} (K)
                          </p>
                        </>
                      )}

                      {result?.tech_method == "5" && (
                        <>
                          <p>
                            <strong>
                              {data?.payload?.tech_lang_keys["6"]} (V
                              <sub>f</sub>)
                            </strong>
                          </p>
                          <p className="text-[#119154] text-[28px] font-bold">
                            {Number(result.tech_volume).toFixed(2)} (m
                            <sup className="text-[22px]">3</sup>)
                          </p>
                        </>
                      )}

                      {result?.tech_method == "6" && (
                        <>
                          <p>
                            <strong>
                              {data?.payload?.tech_lang_keys["5"]}(P<sub>f</sub>
                              )
                            </strong>
                          </p>
                          <p className="text-[#119154] text-[28px] font-bold">
                            {Number(result.tech_pressure).toFixed(2)} (Pa)
                          </p>
                        </>
                      )}

                      {(isTemp || isVolume || isPressure) && (
                        <div className="col-span-full">
                          <p className="mt-3 mb-2 font-bold">
                            Results in other units:
                          </p>
                          <div className="overflow-auto">
                            <table className="w-full text-left text-[16px]">
                              <tbody>
                                {isTemp && (
                                  <>
                                    <tr>
                                      <td className="border-b py-2 pr-4 ">
                                        {result?.tech_method == "1" ? (
                                          <>
                                            {data.payload.tech_lang_keys["7"]}{" "}
                                            (T<sub>f</sub>)
                                          </>
                                        ) : (
                                          <>
                                            {data.payload.tech_lang_keys["4"]}{" "}
                                            (T<sub>i</sub>)
                                          </>
                                        )}
                                      </td>
                                      <td className="border-b py-2 pl-4 ">
                                        {temperatureC} (°C)
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 pr-4">
                                        {result?.tech_method == "1" ? (
                                          <>
                                            {data.payload.tech_lang_keys["7"]}{" "}
                                            (T<sub>f</sub>)
                                          </>
                                        ) : (
                                          <>
                                            {data.payload.tech_lang_keys["4"]}{" "}
                                            (T<sub>i</sub>)
                                          </>
                                        )}
                                      </td>

                                      <td className="py-2 pl-4 ">
                                        {temperatureF.toFixed(4)} (°F)
                                      </td>
                                    </tr>
                                  </>
                                )}

                                {isVolume && (
                                  <>
                                    <tr>
                                      <td className="border-b py-2 pr-4 ">
                                        {result?.tech_method == "2" ? (
                                          <>
                                            {data.payload.tech_lang_keys["3"]}{" "}
                                            (V<sub>i</sub>)
                                          </>
                                        ) : (
                                          <>
                                            {data.payload.tech_lang_keys["6"]}{" "}
                                            (V<sub>f</sub>)
                                          </>
                                        )}
                                      </td>

                                      <td className="border-b py-2 pl-4 ">
                                        {volumeLiters} liters (l)
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2 pr-4 ">
                                        {result?.tech_method == "2" ? (
                                          <>
                                            {data.payload.tech_lang_keys["3"]}{" "}
                                            (V<sub>i</sub>)
                                          </>
                                        ) : (
                                          <>
                                            {data.payload.tech_lang_keys["6"]}{" "}
                                            (V<sub>f</sub>)
                                          </>
                                        )}
                                      </td>

                                      <td className="border-b py-2 pl-4 ">
                                        {volumeML} milliliters (ml)
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2 pr-4 ">
                                        {result?.tech_method == "2" ? (
                                          <>
                                            {data.payload.tech_lang_keys["3"]}{" "}
                                            (V<sub>i</sub>)
                                          </>
                                        ) : (
                                          <>
                                            {data.payload.tech_lang_keys["6"]}{" "}
                                            (V<sub>f</sub>)
                                          </>
                                        )}
                                      </td>

                                      <td className="border-b py-2 pl-4">
                                        {volumeFeet.toFixed(6)} ft³
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 pr-4 ">
                                        {result?.tech_method == "2" ? (
                                          <>
                                            {data.payload.tech_lang_keys["3"]}{" "}
                                            (V<sub>i</sub>)
                                          </>
                                        ) : (
                                          <>
                                            {data.payload.tech_lang_keys["6"]}{" "}
                                            (V<sub>f</sub>)
                                          </>
                                        )}
                                      </td>

                                      <td className="py-2 pl-4 ">
                                        {volumeInch.toFixed(6)} in³
                                      </td>
                                    </tr>
                                  </>
                                )}

                                {isPressure && (
                                  <>
                                    <tr>
                                      <td className="border-b py-2 pr-4">
                                        {result?.tech_method == "3" ? (
                                          <>
                                            {data.payload.tech_lang_keys["2"]}{" "}
                                            (P<sub>i</sub>)
                                          </>
                                        ) : (
                                          <>
                                            {data.payload.tech_lang_keys["5"]}{" "}
                                            (P<sub>f</sub>)
                                          </>
                                        )}
                                      </td>

                                      <td className="border-b py-2 pl-4 ">
                                        {pressureKPA} kPa
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2 pr-4 ">
                                        {result?.tech_method == "3" ? (
                                          <>
                                            {data.payload.tech_lang_keys["2"]}{" "}
                                            (P<sub>i</sub>)
                                          </>
                                        ) : (
                                          <>
                                            {data.payload.tech_lang_keys["5"]}{" "}
                                            (P<sub>f</sub>)
                                          </>
                                        )}
                                      </td>

                                      <td className="border-b py-2 pl-4 ">
                                        {pressureBar} bar
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2 pr-4">
                                        {result?.tech_method == "3" ? (
                                          <>
                                            {data.payload.tech_lang_keys["2"]}{" "}
                                            (P<sub>i</sub>)
                                          </>
                                        ) : (
                                          <>
                                            {data.payload.tech_lang_keys["5"]}{" "}
                                            (P<sub>f</sub>)
                                          </>
                                        )}
                                      </td>

                                      <td className="border-b py-2 pl-4 ">
                                        {pressureATM.toFixed(4)} atm
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2 pr-4 ">
                                        {result?.tech_method == "3" ? (
                                          <>
                                            {data.payload.tech_lang_keys["2"]}{" "}
                                            (P<sub>i</sub>)
                                          </>
                                        ) : (
                                          <>
                                            {data.payload.tech_lang_keys["5"]}{" "}
                                            (P<sub>f</sub>)
                                          </>
                                        )}
                                      </td>

                                      <td className="border-b py-2 pl-4 ">
                                        {pressureHPA} hPa
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 pr-4 ">
                                        {result?.tech_method == "3" ? (
                                          <>
                                            {data.payload.tech_lang_keys["2"]}{" "}
                                            (P<sub>i</sub>)
                                          </>
                                        ) : (
                                          <>
                                            {data.payload.tech_lang_keys["5"]}{" "}
                                            (P<sub>f</sub>)
                                          </>
                                        )}
                                      </td>

                                      <td className="py-2 pl-4 ">
                                        {pressureMMHG.toFixed(2)} mmHg
                                      </td>
                                    </tr>
                                  </>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
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

export default CombinedGasLawCalculator;

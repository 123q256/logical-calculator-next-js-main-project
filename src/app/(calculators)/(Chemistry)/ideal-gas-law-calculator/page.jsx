"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useIdealGasLawCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const IdealGasLawCalculator = () => {
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
    tech_method: "press", // press  volume temp  sub
    tech_x: "3",
    tech_x_v_unit: "m³",
    tech_x_t_unit: "°C",
    tech_y: "2",
    tech_y_s_unit: "mol",
    tech_y_p_unit: "Pa",
    tech_z: "2",
    tech_z_t_unit: "°C",
    tech_z_p_unit: "Pa",
    tech_R: "8.3144626",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useIdealGasLawCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_method ||
      !formData.tech_x ||
      !formData.tech_y ||
      !formData.tech_z
    ) {
      setFormError("Please fill in field");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_method: formData.tech_method,
        tech_x: formData.tech_x,
        tech_x_v_unit: formData.tech_x_v_unit,
        tech_x_t_unit: formData.tech_x_t_unit,
        tech_y: formData.tech_y,
        tech_y_s_unit: formData.tech_y_s_unit,
        tech_y_p_unit: formData.tech_y_p_unit,
        tech_z: formData.tech_z,
        tech_z_t_unit: formData.tech_z_t_unit,
        tech_z_p_unit: formData.tech_z_p_unit,
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
      tech_method: "press", // press  volume temp  sub
      tech_x: "3",
      tech_x_v_unit: "m³",
      tech_x_t_unit: "°C",
      tech_y: "2",
      tech_y_s_unit: "mol",
      tech_y_p_unit: "Pa",
      tech_z: "2",
      tech_z_t_unit: "°C",
      tech_z_p_unit: "Pa",
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
    setFormData((prev) => ({ ...prev, tech_x_v_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_x_t_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_y_s_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_y_p_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_z_t_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_z_p_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

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
            <div className="grid grid-cols-2  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-1 relative">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["to_cal"]}
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
                    <option value="press">
                      {data?.payload?.tech_lang_keys["p"]}
                    </option>
                    <option value="temp">
                      {data?.payload?.tech_lang_keys["t"]}
                    </option>
                    <option value="volume">
                      {data?.payload?.tech_lang_keys["v"]}
                    </option>
                    <option value="sub">
                      {data?.payload?.tech_lang_keys["s"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_method != "volume" && (
                <>
                  <div className="space-y-1">
                    <label htmlFor="tech_x" className="label">
                      {data?.payload?.tech_lang_keys["v"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_x"
                        step="any"
                        className=" input"
                        value={formData.tech_x}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_x_v_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cubic meters (m³)", value: "m³" },
                            { label: "cubic centimeters (cm³)", value: "cm³" },
                            { label: "cubic mmillimeters (mm³)", value: "mm³" },
                            { label: "cubic decimeters (dm³)", value: "dm³" },
                            { label: "cubic feet (ft³)", value: "ft³" },
                            { label: "cubic inches (in³)", value: "in³" },
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

              {formData.tech_method == "volume" && (
                <>
                  <div className="space-y-1">
                    <label htmlFor="tech_x" className="label">
                      {data?.payload?.tech_lang_keys["t"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_x"
                        step="any"
                        className=" input"
                        value={formData.tech_x}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_x_t_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Celsius (°C)", value: "°C" },
                            { label: "Kelvin (K)", value: "K" },
                            { label: "Fahrenheit (°F)", value: "°F" },
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

              {formData.tech_method != "sub" && (
                <>
                  <div className="space-y-1">
                    <label htmlFor="tech_y" className="label">
                      {data?.payload?.tech_lang_keys["s"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_y"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_y}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_y_s_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mol", value: "mol" },
                            { label: "µmol", value: "µmol" },
                            { label: "mmol", value: "mmol" },
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
              {formData.tech_method == "sub" && (
                <>
                  <div className="space-y-1">
                    <label htmlFor="tech_y" className="label">
                      {data?.payload?.tech_lang_keys["p"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_y"
                        step="any"
                        className=" input"
                        value={formData.tech_y}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_y_p_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Pa", value: "Pa" },
                            { label: ">psi", value: "psi" },
                            { label: "bar", value: "bar" },
                            { label: "atm", value: "atm" },
                            { label: "at", value: "at" },
                            { label: "Torr", value: "Torr" },
                            { label: "mmHg", value: "mmHg" },
                            { label: "kPa", value: "kPa" },
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
              {(formData.tech_method == "press" ||
                formData.tech_method == "sub") && (
                <>
                  <div className="space-y-1">
                    <label htmlFor="tech_z" className="label">
                      {data?.payload?.tech_lang_keys["t"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_z"
                        step="any"
                        className=" input"
                        value={formData.tech_z}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_z_t_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Celsius (°C)", value: "°C" },
                            { label: "Kelvin (K)", value: "K" },
                            { label: "Fahrenheit (°F)", value: "°F" },
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

              {(formData.tech_method == "temp" ||
                formData.tech_method == "volume") && (
                <>
                  <div className="space-y-1">
                    <label htmlFor="tech_z" className="label">
                      {data?.payload?.tech_lang_keys["p"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_z"
                        step="any"
                        className=" input"
                        value={formData.tech_z}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_z_p_unit} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Pa", value: "Pa" },
                            { label: ">psi", value: "psi" },
                            { label: "bar", value: "bar" },
                            { label: "atm", value: "atm" },
                            { label: "at", value: "at" },
                            { label: "Torr", value: "Torr" },
                            { label: "mmHg", value: "mmHg" },
                            { label: "kPa", value: "kPa" },
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
              <div className="space-y-1 col-span-2 md:col-span-1 ">
                <label htmlFor="tech_R" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (R):
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
                    <div className="w-full p-3 rounded-lg mt-3 text-[14px] md:text-[18px]">
                      <div className="w-full">
                        {formData.tech_method == "press" && (
                          <>
                            <p className="mt-2 font-bold">
                              {data?.payload?.tech_lang_keys["p"]}{" "}
                            </p>
                          </>
                        )}
                        {formData.tech_method == "temp" && (
                          <>
                            <p className="mt-2 font-bold">
                              {" "}
                              {data?.payload?.tech_lang_keys["t"]}
                            </p>
                          </>
                        )}
                        {formData.tech_method == "volume" && (
                          <>
                            <p className="mt-2 font-bold">
                              {" "}
                              {data?.payload?.tech_lang_keys["v"]}
                            </p>
                          </>
                        )}
                        {formData.tech_method == "sub" && (
                          <>
                            <p className="mt-2 font-bold">
                              {data?.payload?.tech_lang_keys["s"]}{" "}
                            </p>
                          </>
                        )}
                        <p className="mb-2 text-green-600 text-xl md:text-2xl font-bold">
                          {result?.tech_ans ?? "0.0"}
                        </p>
                        <p className="font-bold">
                          {data?.payload?.tech_lang_keys[1]}
                        </p>
                        <div className="w-full overflow-auto mt-2">
                          {formData?.tech_method == "press" ? (
                            <>
                              <table className="w-full lg:w-[70%] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["p"]}
                                    </td>
                                    <td className="border-b py-2 font-bold">
                                      {Number(
                                        result?.tech_ans1 / 6894.757
                                      ).toFixed(5)}{" "}
                                      psi
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["p"]}
                                    </td>
                                    <td className="border-b py-2 font-bold">
                                      {Number(
                                        result?.tech_ans1 / 100000
                                      ).toFixed(5)}{" "}
                                      bar
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["p"]}
                                    </td>
                                    <td className="border-b py-2 font-bold">
                                      {Number(
                                        result?.tech_ans1 / 101325
                                      ).toFixed(5)}{" "}
                                      atm
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["p"]}
                                    </td>
                                    <td className="border-b py-2 font-bold">
                                      {Number(
                                        result?.tech_ans1 / 98067
                                      ).toFixed(5)}{" "}
                                      at
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["p"]}
                                    </td>
                                    <td className="border-b py-2 font-bold">
                                      {Number(
                                        result?.tech_ans1 / 133.322
                                      ).toFixed(5)}{" "}
                                      Torr
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["p"]}
                                    </td>
                                    <td className="border-b py-2 font-bold">
                                      {Number(
                                        result?.tech_ans1 / 133.322
                                      ).toFixed(5)}{" "}
                                      mmHg
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">
                                      {data?.payload?.tech_lang_keys["p"]}
                                    </td>
                                    <td className="py-2 font-bold">
                                      {Number(result?.tech_ans1 / 1000).toFixed(
                                        5
                                      )}{" "}
                                      kPa
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          ) : formData?.tech_method == "sub" ? (
                            <>
                              <table className="w-full lg:w-[70%] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["s"]}
                                    </td>
                                    <td className="border-b py-2 font-bold">
                                      {Number(result?.tech_ans1 * 1e6).toFixed(
                                        5
                                      )}{" "}
                                      μmol
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">
                                      {data?.payload?.tech_lang_keys["s"]}
                                    </td>
                                    <td className="py-2 font-bold">
                                      {Number(result?.tech_ans1 * 1000).toFixed(
                                        5
                                      )}{" "}
                                      mmol
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          ) : formData?.tech_method == "volume" ? (
                            <>
                              <table className="w-full lg:w-[70%] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["v"]}
                                    </td>
                                    <td className="border-b py-2 font-bold">
                                      {Number(result?.tech_ans1 * 1e6).toFixed(
                                        5
                                      )}{" "}
                                      cm³
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["v"]}
                                    </td>
                                    <td className="border-b py-2 font-bold">
                                      {Number(result?.tech_ans1 * 1e9).toFixed(
                                        5
                                      )}{" "}
                                      mm³
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["v"]}
                                    </td>
                                    <td className="border-b py-2 font-bold">
                                      {Number(result?.tech_ans1 * 1000).toFixed(
                                        5
                                      )}{" "}
                                      dm³
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["v"]}
                                    </td>
                                    <td className="border-b py-2 font-bold">
                                      {Number(
                                        result?.tech_ans1 * 35.315
                                      ).toFixed(5)}{" "}
                                      ft³
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">
                                      {data?.payload?.tech_lang_keys["v"]}
                                    </td>
                                    <td className="py-2 font-bold">
                                      {Number(
                                        result?.tech_ans1 * 61024
                                      ).toFixed(5)}{" "}
                                      in³
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          ) : formData?.tech_method == "temp" ? (
                            <>
                              <table className="w-full lg:w-[70%] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["t"]}
                                    </td>
                                    <td className="border-b py-2 font-bold">
                                      {Number(
                                        result?.tech_ans1 - 273.15
                                      ).toFixed(5)}{" "}
                                      °C
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">
                                      {data?.payload?.tech_lang_keys["t"]}
                                    </td>
                                    <td className="py-2 font-bold">
                                      {Number(
                                        ((result?.tech_ans1 - 273.15) * 9) / 5 +
                                          32
                                      ).toFixed(5)}{" "}
                                      °F
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          ) : null}
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

export default IdealGasLawCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useEscapeVelocityCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EscapeVelocityCalculator = () => {
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
    tech_find: "3",
    tech_planet: "8",
    tech_mass: 7.347673e22,
    tech_mass_unit: "kg",
    tech_radius: 476.2,
    tech_radius_unit: "m",
    tech_orbit: 2.766,
    tech_galaxy_mass: 1.989e30,
    tech_gravity: 6.67438e-11,
    tech_escape_velocity: 7,
    tech_escape_unit: "m/s",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEscapeVelocityCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Resetting results and errors
    setResult(null);
    setFormError(null);

    if (name === "tech_planet") {
      const planetValues = {
        1: {
          tech_mass: "1.989E30",
          tech_radius: "6.96E5",
          tech_orbit: "1.9E9",
          tech_galaxy_mass: "2.8E41",
          tech_gravity: "6.67438E-11",
        },
        2: {
          tech_mass: "3.302E23",
          tech_radius: "2.4397E3",
          tech_orbit: "0.38710",
          tech_galaxy_mass: "1.989E30",
          tech_gravity: "6.67438E-11",
        },
        3: {
          tech_mass: "4.869E24",
          tech_radius: "6.0518E3",
          tech_orbit: "0.72333",
          tech_galaxy_mass: "1.989E30",
          tech_gravity: "6.67438E-11",
        },
        4: {
          tech_mass: "5.974E24",
          tech_radius: "6.37815E3",
          tech_orbit: "1.00",
          tech_galaxy_mass: "1.989E30",
          tech_gravity: "6.67438E-11",
        },
        5: {
          tech_mass: "7.347673E22",
          tech_radius: "1.73715E3",
          tech_orbit: "0.00256955",
          tech_galaxy_mass: "5.974E24",
          tech_gravity: "6.67438E-11",
        },
        6: {
          tech_mass: "6.419E23",
          tech_radius: "3.3972E3",
          tech_orbit: "1.52366",
          tech_galaxy_mass: "1.989E30",
          tech_gravity: "6.67438E-11",
        },
        7: {
          tech_mass: "3.510E10",
          tech_radius: "0.165",
          tech_orbit: "1.324",
          tech_galaxy_mass: "1.989E30",
          tech_gravity: "6.67438E-11",
        },
        8: {
          tech_mass: "9.445E20",
          tech_radius: "476.2",
          tech_orbit: "2.766",
          tech_galaxy_mass: "1.989E30",
          tech_gravity: "6.67438E-11",
        },
        9: {
          tech_mass: "1.899E27",
          tech_radius: "7.1492E4",
          tech_orbit: "5.20336",
          tech_galaxy_mass: "1.989E30",
          tech_gravity: "6.67438E-11",
        },
        10: {
          tech_mass: "5.688E26",
          tech_radius: "6.0268E4",
          tech_orbit: "9.53707",
          tech_galaxy_mass: "1.989E30",
          tech_gravity: "6.67438E-11",
        },
        11: {
          tech_mass: "8.683E25",
          tech_radius: "2.5559E4",
          tech_orbit: "19.19138",
          tech_galaxy_mass: "1.989E30",
          tech_gravity: "6.67438E-11",
        },
        12: {
          tech_mass: "1.024E26",
          tech_radius: "2.4786E4",
          tech_orbit: "30.06896",
          tech_galaxy_mass: "1.989E30",
          tech_gravity: "6.67438E-11",
        },
      };

      const selectedValues = planetValues[value] || {};

      // Set all values including tech_planet itself
      setFormData((prevData) => ({
        ...prevData,
        tech_planet: value,
        ...selectedValues,
      }));
    } else {
      // Regular field update
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
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
        tech_planet: formData.tech_planet,
        tech_mass: formData.tech_mass,
        tech_mass_unit: formData.tech_mass_unit,
        tech_radius: formData.tech_radius,
        tech_radius_unit: formData.tech_radius_unit,
        tech_orbit: formData.tech_orbit,
        tech_galaxy_mass: formData.tech_galaxy_mass,
        tech_gravity: formData.tech_gravity,
        tech_escape_velocity: formData.tech_escape_velocity,
        tech_escape_unit: formData.tech_escape_unit,
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
      tech_find: "3",
      tech_planet: "8",
      tech_mass: 7.347673e22,
      tech_mass_unit: "kg",
      tech_radius: 476.2,
      tech_radius_unit: "m",
      tech_orbit: 2.766,
      tech_galaxy_mass: 1.989e30,
      tech_gravity: 6.67438e-11,
      tech_escape_velocity: 7,
      tech_escape_unit: "m/s",
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
    setFormData((prev) => ({ ...prev, tech_mass_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_radius_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_escape_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  // reult
  const sqrt2 = Math.sqrt(2);

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
            <div className="grid grid-cols-12 mt-3  lg:gap-4 md:gap-4 gap-2">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_find" className="label">
                  {data?.payload?.tech_lang_keys["26"]}:
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
                      {data?.payload?.tech_lang_keys["27"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["28"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["29"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_planet" className="label">
                  {data?.payload?.tech_lang_keys["13"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_planet"
                    id="tech_planet"
                    value={formData.tech_planet}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["18"]}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["19"]}
                    </option>
                    <option value="7">
                      {data?.payload?.tech_lang_keys["20"]}
                    </option>
                    <option value="8">
                      {data?.payload?.tech_lang_keys["21"]}
                    </option>
                    <option value="9">
                      {data?.payload?.tech_lang_keys["22"]}
                    </option>
                    <option value="10">
                      {data?.payload?.tech_lang_keys["23"]}
                    </option>
                    <option value="11">
                      {data?.payload?.tech_lang_keys["24"]}
                    </option>
                    <option value="12">
                      {data?.payload?.tech_lang_keys["25"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_find != "2" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 planet_mass">
                    <label htmlFor="tech_mass" className="label">
                      {data?.payload?.tech_lang_keys["12"]} (M)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_mass"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_mass}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_mass_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kg", value: "kg" },
                            { label: "t", value: "t" },
                            { label: "lb", value: "lb" },
                            { label: "oz", value: "oz" },
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
              {formData.tech_find != "3" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 planet_radius">
                    <label htmlFor="tech_radius" className="label">
                      {data?.payload?.tech_lang_keys["11"]} (r)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_radius"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_radius}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_radius_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m", value: "m" },
                            { label: "km", value: "km" },
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

              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_orbit" className="label">
                  {data?.payload?.tech_lang_keys["10"]} (R)
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_orbit"
                    id="tech_orbit"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_orbit}
                    onChange={handleChange}
                  />
                  <span className=" input_unit">AU</span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_galaxy_mass" className="label">
                  {data?.payload?.tech_lang_keys["9"]} (Mc)
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_galaxy_mass"
                    id="tech_galaxy_mass"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_galaxy_mass}
                    onChange={handleChange}
                  />
                  <span className=" input_unit">kg</span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_gravity" className="label">
                  {data?.payload?.tech_lang_keys["8"]} G
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_gravity"
                    id="tech_gravity"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_gravity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_find != "1" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12  escape_velocity">
                    <label htmlFor="tech_escape_velocity" className="label">
                      {data?.payload?.tech_lang_keys["1"]} (r)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_escape_velocity"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_escape_velocity}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_escape_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s", value: "m/s" },
                            { label: "km/h", value: "km/h" },
                            { label: "mph", value: "mph" },
                            { label: "km/s", value: "km/s" },
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
                      <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                        {result?.tech_method == "1" && (
                          <>
                            <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[1]} (V
                                      <sub>e</sub>)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {" "}
                                    {result?.tech_escape_velocity} (km/s)
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    {data?.payload?.tech_lang_keys["2"]} (V
                                    <sub>1)</sub>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(
                                        result?.tech_first_cosmic_velocity
                                      ).toFixed(3)}
                                      <span>(km/s)</span>
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    {data?.payload?.tech_lang_keys["3"]} (V
                                    <sub>c</sub>)
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(
                                        result?.tech_orbital_speed / 1000
                                      )}
                                      <span>(km/s)</span>
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    {data?.payload?.tech_lang_keys["4"]} (V
                                    <sub>3</sub>)
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(
                                        (result?.tech_orbital_speed / 1000) *
                                          Math.sqrt(2)
                                      )}
                                      <span>(km/s)</span>
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    {data?.payload?.tech_lang_keys["5"]} (T
                                    <sub>c</sub>)
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(
                                        result?.tech_orbital_period
                                      ).toFixed(2)}
                                      <span>(year)</span>
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </>
                        )}
                        {result?.tech_method == "2" && (
                          <>
                            <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (M)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {" "}
                                    {result?.tech_mass_value} (kg)
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    {data?.payload?.tech_lang_keys["2"]} (V
                                    <sub>1)</sub>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(
                                        result?.tech_first_cosmic_velocity
                                      ).toFixed(3)}
                                      <span>(km/s)</span>
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    {data?.payload?.tech_lang_keys["3"]}(V
                                    <sub>c</sub>)
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(
                                        result?.tech_orbital_speed / 1000
                                      )}
                                      <span>(km/s)</span>
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    {data?.payload?.tech_lang_keys["4"]} (V
                                    <sub>3</sub>)
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(
                                        (result?.tech_orbital_speed / 1000) *
                                          Math.sqrt(2)
                                      )}
                                      <span>(km/s)</span>
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    {data?.payload?.tech_lang_keys["5"]} (T
                                    <sub>c</sub>)
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(
                                        result?.tech_orbital_period
                                      ).toFixed(2)}
                                      <span>(year)</span>
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </>
                        )}
                        {result?.tech_method == "3" && (
                          <>
                            <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (r)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {" "}
                                    {result?.tech_mass_value} (m)
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    {data?.payload?.tech_lang_keys["2"]} (V
                                    <sub>1)</sub>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(
                                        result?.tech_first_cosmic_velocity
                                      ).toFixed(3)}
                                      <span>(km/s)</span>
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    {data?.payload?.tech_lang_keys["3"]}(V
                                    <sub>c</sub>)
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(
                                        result?.tech_orbital_speed / 1000
                                      )}
                                      <span>(km/s)</span>
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    {data?.payload?.tech_lang_keys["4"]} (V
                                    <sub>3</sub>)
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(
                                        (result?.tech_orbital_speed / 1000) *
                                          Math.sqrt(2)
                                      )}
                                      <span>(km/s)</span>
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    {data?.payload?.tech_lang_keys["5"]} (T
                                    <sub>c</sub>)
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(
                                        result?.tech_orbital_period
                                      ).toFixed(2)}
                                      <span>(year)</span>
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
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

export default EscapeVelocityCalculator;

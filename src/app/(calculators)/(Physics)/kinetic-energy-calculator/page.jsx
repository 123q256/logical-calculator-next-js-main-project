"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useKineticEnergyCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const KineticEnergyCalculator = () => {
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
    tech_type: "linear", // rotational  linear
    tech_to_cal: "kin",
    tech_mass: "53",
    tech_unit_m: "kg",
    tech_velocity: "4.78",
    tech_unit_v: "miles/s",
    tech_kin: "13",
    tech_unit_k: "j",
    tech_to_calr: "a_v",
    tech_r_kin: "52600",
    tech_unit_k_r: "j",
    tech_moment: "1067",
    tech_unit_i: "kg*m²",
    tech_a_velocity: "31.4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useKineticEnergyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_to_cal: formData.tech_to_cal,
        tech_mass: formData.tech_mass,
        tech_unit_m: formData.tech_unit_m,
        tech_velocity: formData.tech_velocity,
        tech_unit_v: formData.tech_unit_v,
        tech_kin: formData.tech_kin,
        tech_unit_k: formData.tech_unit_k,
        tech_to_calr: formData.tech_to_calr,
        tech_r_kin: formData.tech_r_kin,
        tech_unit_k_r: formData.tech_unit_k_r,
        tech_moment: formData.tech_moment,
        tech_unit_i: formData.tech_unit_i,
        tech_a_velocity: formData.tech_a_velocity,
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
      tech_type: "linear", // rotational  linear
      tech_to_cal: "kin",
      tech_mass: "53",
      tech_unit_m: "kg",
      tech_velocity: "4.78",
      tech_unit_v: "miles/s",
      tech_kin: "13",
      tech_unit_k: "j",
      tech_to_calr: "a_v",
      tech_r_kin: "52600",
      tech_unit_k_r: "j",
      tech_moment: "1067",
      tech_unit_i: "kg*m²",
      tech_a_velocity: "31.4",
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
    setFormData((prev) => ({ ...prev, tech_unit_m: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_v: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_k: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_k_r: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_i: unit }));
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
            <div className=" mx-auto mt-2 lg:w-[70%] w-full">
              <input
                type="hidden"
                name="tech_type"
                id="calculator_time"
                value={formData.tech_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_type === "linear" ? "tagsUnit" : ""
                    }`}
                    id="linear"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "linear" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["linear"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_type === "rotational" ? "tagsUnit" : ""
                    }`}
                    id="rotational"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "rotational" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["rot"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12  gap-4">
              {formData.tech_type == "linear" && (
                <>
                  <div className="col-span-12">
                    <div className="grid grid-cols-12  gap-4">
                      <strong className="col-span-12 mt-2 px-2">
                        To Calculate:
                      </strong>
                      <div className="col-span-12 flex items-center">
                        <label className="pe-2" htmlFor="kin">
                          <input
                            type="radio"
                            name="tech_to_cal"
                            value="kin"
                            id="kin"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_to_cal === "kin"}
                          />
                          <span>{data?.payload?.tech_lang_keys["kin"]}</span>
                        </label>
                        <label className="pe-2" htmlFor="mass">
                          <input
                            type="radio"
                            name="tech_to_cal"
                            value="mass"
                            id="mass"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_to_cal === "mass"}
                          />
                          <span>{data?.payload?.tech_lang_keys["mass"]}</span>
                        </label>
                        <label className="pe-2" htmlFor="velo">
                          <input
                            type="radio"
                            name="tech_to_cal"
                            value="velo"
                            id="velo"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_to_cal === "velo"}
                          />
                          <span>{data?.payload?.tech_lang_keys["velo"]}</span>
                        </label>
                      </div>
                      {formData.tech_to_cal != "mass" && (
                        <>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 mass">
                            <label htmlFor="tech_mass" className="label">
                              {data?.payload?.tech_lang_keys["mass"]}
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
                                {formData.tech_unit_m} ▾
                              </label>
                              {dropdownVisible && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "kg", value: "kg" },
                                    { label: "mg", value: "mg" },
                                    { label: "g", value: "g" },
                                    { label: "lbs", value: "lbs" },
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
                      {formData.tech_to_cal != "velo" && (
                        <>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 velocity">
                            <label htmlFor="tech_velocity" className="label">
                              {data?.payload?.tech_lang_keys["velo"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_velocity"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_velocity}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown1}
                              >
                                {formData.tech_unit_v} ▾
                              </label>
                              {dropdownVisible1 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "miles/s", value: "miles/s" },
                                    { label: "km/s", value: "km/s" },
                                    { label: "m/s", value: "m/s" },
                                    { label: "ft/s", value: "ft/s" },
                                    { label: "in/s", value: "in/s" },
                                    { label: "yd/s", value: "yd/s" },
                                    { label: "km/h", value: "km/h" },
                                    { label: "m/h", value: "m/h" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler1(unit.value)
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
                      )}
                      {formData.tech_to_cal != "kin" && (
                        <>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6  kin">
                            <label htmlFor="tech_kin" className="label">
                              {data?.payload?.tech_lang_keys["kin"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_kin"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_kin}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown2}
                              >
                                {formData.tech_unit_k} ▾
                              </label>
                              {dropdownVisible2 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "j", value: "j" },
                                    { label: "kJ", value: "kJ" },
                                    { label: "MJ", value: "MJ" },
                                    { label: "Wh", value: "Wh" },
                                    { label: "kWh", value: "kWh" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler2(unit.value)
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
                      )}
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type == "rotational" && (
                <>
                  <div className="col-span-12 ">
                    <div className="grid grid-cols-12  gap-4">
                      <strong className="col-span-12 mt-2 px-2">
                        To Calculate:
                      </strong>
                      <div className="col-span-12 flex items-center">
                        <label className="pe-2" htmlFor="r_kin">
                          <input
                            type="radio"
                            name="tech_to_calr"
                            value="r_kin"
                            id="r_kin"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_to_calr === "r_kin"}
                          />
                          <span>{data?.payload?.tech_lang_keys["kin"]}</span>
                        </label>
                        <label className="pe-2" htmlFor="moi">
                          <input
                            type="radio"
                            name="tech_to_calr"
                            value="moi"
                            id="moi"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_to_calr === "moi"}
                          />
                          <span>{data?.payload?.tech_lang_keys["moi"]}</span>
                        </label>
                        <label className="pe-2" htmlFor="a_v">
                          <input
                            type="radio"
                            name="tech_to_calr"
                            value="a_v"
                            id="a_v"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_to_calr === "a_v"}
                          />
                          <span>{data?.payload?.tech_lang_keys["a_v"]}</span>
                        </label>
                      </div>
                      {formData.tech_to_calr != "r_kin" && (
                        <>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6  r_kin">
                            <label htmlFor="tech_r_kin" className="label">
                              {data?.payload?.tech_lang_keys["kin"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_r_kin"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_r_kin}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown3}
                              >
                                {formData.tech_unit_k_r} ▾
                              </label>
                              {dropdownVisible3 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "j", value: "j" },
                                    { label: "kJ", value: "kJ" },
                                    { label: "MJ", value: "MJ" },
                                    { label: "Wh", value: "Wh" },
                                    { label: "kWh", value: "kWh" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler3(unit.value)
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
                      )}
                      {formData.tech_to_calr != "moi" && (
                        <>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 moment">
                            <label htmlFor="tech_moment" className="label">
                              {data?.payload?.tech_lang_keys["moi"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_moment"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_moment}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown4}
                              >
                                {formData.tech_unit_i} ▾
                              </label>
                              {dropdownVisible4 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "kg*m²", value: "kg*m²" },
                                    { label: "lbs*ft²", value: "lbs*ft²" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler4(unit.value)
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
                      )}
                      {formData.tech_to_calr != "a_v" && (
                        <>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 a_velocity">
                            <label htmlFor="tech_a_velocity" className="label">
                              {data?.payload?.tech_lang_keys["a_v"]}:
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_a_velocity"
                                id="tech_a_velocity"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_a_velocity}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
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
                      <div className="w-full">
                        {result?.tech_a_velocity && (
                          <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    {data?.payload?.tech_lang_keys["a_v"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {result.tech_a_velocity} rad/s
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    {data?.payload?.tech_lang_keys["kin"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {formData?.tech_r_kin}{" "}
                                      {formData?.tech_unit_k_r}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    {data?.payload?.tech_lang_keys["moi"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {formData?.tech_moment}{" "}
                                      {formData?.tech_unit_i}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}

                        {result?.tech_moment && (
                          <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    {data?.payload?.tech_lang_keys["moi"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>{result.tech_moment} kg·m²</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    {data?.payload?.tech_lang_keys["kin"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {formData?.tech_r_kin}{" "}
                                      {formData?.tech_unit_k_r}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    {data?.payload?.tech_lang_keys["a_v"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {formData?.tech_a_velocity} rad/s
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}

                        {result?.tech_r_kin && (
                          <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    {data?.payload?.tech_lang_keys["kin"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>{result.tech_r_kin} J</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    {data?.payload?.tech_lang_keys["moi"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {formData?.tech_moment}{" "}
                                      {formData?.tech_unit_i}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    {data?.payload?.tech_lang_keys["a_v"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {formData?.tech_a_velocity} rad/s
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}

                        {result?.tech_velocity && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["velo"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result.tech_velocity} m/s
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="col-12 mt-3 font-s-18">
                              <strong>Result in Other Units</strong>
                            </p>

                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["velo"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(result.tech_velocity / 1609).toFixed(
                                          4
                                        )}{" "}
                                        miles/s
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["velo"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(result.tech_velocity / 1000).toFixed(
                                          4
                                        )}{" "}
                                        km/s
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["velo"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(
                                          result.tech_velocity * 3.28084
                                        ).toFixed(4)}{" "}
                                        ft/s
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["velo"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(
                                          result.tech_velocity * 2.23694
                                        ).toFixed(4)}{" "}
                                        miles/h
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["velo"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(result.tech_velocity * 3.6).toFixed(
                                          4
                                        )}{" "}
                                        km/h
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {result?.tech_mass <= 0 && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["mass"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result.tech_mass} kg</strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="col-12 mt-3 font-s-18">
                              <strong>Result in Other Units</strong>
                            </p>

                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["mass"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(result.tech_mass * 1e6).toFixed(4)} mg
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["mass"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(result.tech_mass * 1e3).toFixed(4)} g
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["mass"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(result.tech_mass * 2.205).toFixed(4)}{" "}
                                        lbs
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {result?.tech_kin && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["kin"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result.tech_kin} J</strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="col-12 mt-3 font-s-18">
                              <strong>Result in Other Units</strong>
                            </p>

                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["kin"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(formData?.tech_kin / 1000).toFixed(6)}{" "}
                                        kJ
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["kin"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(formData?.tech_kin / 1000000).toFixed(
                                          6
                                        )}{" "}
                                        MJ
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["kin"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(formData?.tech_kin / 3600).toFixed(6)}{" "}
                                        Wh
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["kin"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(formData?.tech_kin / 3.6e6).toFixed(
                                          6
                                        )}{" "}
                                        kWh
                                      </strong>
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

export default KineticEnergyCalculator;

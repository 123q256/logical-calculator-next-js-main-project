"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useMomentumCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MomentumCalculator = () => {
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
    tech_type: "velocity", // velocity  rotational
    tech_to_cal: "mom",
    tech_mass: "12",
    tech_unit_m: "kg",
    tech_velocity: "12",
    tech_unit_v: "miles/s",
    tech_mom: "13",
    tech_unit_k: "kg-ms",
    tech_to_calr: "mom_t",
    tech_mom_t: "13",
    tech_unit_mt: "kg-ms",
    tech_force: "20",
    tech_unit_i: "N",
    tech_time: "20",
    tech_unit_t: "s",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMomentumCalculatorMutation();

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
        tech_mom: formData.tech_mom,
        tech_unit_k: formData.tech_unit_k,
        tech_to_calr: formData.tech_to_calr,
        tech_mom_t: formData.tech_mom_t,
        tech_unit_mt: formData.tech_unit_mt,
        tech_force: formData.tech_force,
        tech_unit_i: formData.tech_unit_i,
        tech_time: formData.tech_time,
        tech_unit_t: formData.tech_unit_t,
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
      tech_type: "velocity", // velocity  rotational
      tech_to_cal: "mom",
      tech_mass: "12",
      tech_unit_m: "kg",
      tech_velocity: "12",
      tech_unit_v: "miles/s",
      tech_mom: "13",
      tech_unit_k: "kg-ms",
      tech_to_calr: "mom_t",
      tech_mom_t: "13",
      tech_unit_mt: "kg-ms",
      tech_force: "20",
      tech_unit_i: "N",
      tech_time: "20",
      tech_unit_t: "s",
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
    setFormData((prev) => ({ ...prev, tech_unit_mt: unit }));
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

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_t: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
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
            <div className="col-lg-7 mb-3 px-2 mx-auto">
              <div className="col-12 col-lg-9 mx-auto mt-2 w-full">
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
                        formData.tech_type === "velocity" ? "tagsUnit" : ""
                      }`}
                      id="velocity"
                      onClick={() => {
                        setFormData({ ...formData, tech_type: "velocity" });
                        setResult(null);
                        setFormError(null);
                      }}
                    >
                      {data?.payload?.tech_lang_keys["1"]}
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
                      {data?.payload?.tech_lang_keys["2"]}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12 mt-3  gap-4">
                {formData.tech_type == "velocity" && (
                  <>
                    <div id="linear" className="col-span-12">
                      <div className="grid grid-cols-12 gap-2">
                        <strong className="col-span-12">
                          {data?.payload?.tech_lang_keys[3]}:
                        </strong>
                        <div className="col-span-12 mb-3 mt-3 flex items-center">
                          <label className="pe-2" htmlFor="mom">
                            <input
                              type="radio"
                              name="tech_to_cal"
                              value="mom"
                              id="mom"
                              className="mr-2 border"
                              onChange={handleChange}
                              checked={formData.tech_to_cal === "mom"}
                            />
                            <span>{data?.payload?.tech_lang_keys["4"]}</span>
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
                            <span>{data?.payload?.tech_lang_keys["5"]}</span>
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
                            <span>{data?.payload?.tech_lang_keys["6"]}</span>
                          </label>
                        </div>
                        {(formData.tech_to_cal === "mom" ||
                          formData.tech_to_cal === "velo") && (
                          <>
                            <div className="col-span-6 mass">
                              <label htmlFor="tech_mass" className="label">
                                {data?.payload?.tech_lang_keys["5"]}
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
                                        onClick={() =>
                                          setUnitHandler(unit.value)
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
                        {(formData.tech_to_cal === "mom" ||
                          formData.tech_to_cal === "mass") && (
                          <>
                            <div className="col-span-6 velocity">
                              <label htmlFor="tech_velocity" className="label">
                                {data?.payload?.tech_lang_keys["6"]}
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

                        {(formData.tech_to_cal === "mass" ||
                          formData.tech_to_cal === "velo") && (
                          <>
                            <div className="col-span-6  kin">
                              <label htmlFor="tech_mom" className="label">
                                {data?.payload?.tech_lang_keys["4"]}
                              </label>
                              <div className="relative w-full ">
                                <input
                                  type="number"
                                  name="tech_mom"
                                  step="any"
                                  className="mt-1 input"
                                  value={formData.tech_mom}
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
                                      { label: "kg-ms", value: "kg-ms" },
                                      { label: "N-s", value: "Ns" },
                                      { label: "min", value: "Nm" },
                                      { label: "N-h", value: "Nh" },
                                      { label: "lb-ft", value: "lb-ft" },
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
                    <div id="rotational" className="col-span-12 ">
                      <div className="grid grid-cols-12 gap-2">
                        <strong className="col-span-12">
                          {data?.payload?.tech_lang_keys[3]}:
                        </strong>
                        <div className="col-span-12  mb-3 mt-3 flex items-center">
                          <label className="pe-2" htmlFor="mom_t">
                            <input
                              type="radio"
                              name="tech_to_calr"
                              value="mom_t"
                              id="mom_t"
                              className="mr-2 border"
                              onChange={handleChange}
                              checked={formData.tech_to_calr === "mom_t"}
                            />
                            <span>{data?.payload?.tech_lang_keys["4"]}</span>
                          </label>

                          <label className="pe-2" htmlFor="force">
                            <input
                              type="radio"
                              name="tech_to_calr"
                              value="force"
                              id="force"
                              className="mr-2 border"
                              onChange={handleChange}
                              checked={formData.tech_to_calr === "force"}
                            />
                            <span>
                              {data?.payload?.tech_lang_keys["7"]} (F)
                            </span>
                          </label>
                          <label className="pe-2" htmlFor="time_c">
                            <input
                              type="radio"
                              name="tech_to_calr"
                              value="time_c"
                              id="time_c"
                              className="mr-2 border"
                              onChange={handleChange}
                              checked={formData.tech_to_calr === "time_c"}
                            />
                            <span>
                              {data?.payload?.tech_lang_keys["8"]} (ΔT)
                            </span>
                          </label>
                        </div>

                        {(formData.tech_to_calr === "force" ||
                          formData.tech_to_calr === "time_c") && (
                          <>
                            <div className="col-span-6   moment">
                              <label htmlFor="tech_mom_t" className="label">
                                {data?.payload?.tech_lang_keys["4"]} (p):
                              </label>
                              <div className="relative w-full ">
                                <input
                                  type="number"
                                  name="tech_mom_t"
                                  step="any"
                                  className="mt-1 input"
                                  value={formData.tech_mom_t}
                                  placeholder="00"
                                  onChange={handleChange}
                                />
                                <label
                                  className="absolute cursor-pointer text-sm underline right-6 top-4"
                                  onClick={toggleDropdown3}
                                >
                                  {formData.tech_unit_mt} ▾
                                </label>
                                {dropdownVisible3 && (
                                  <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                    {[
                                      { label: "kg-ms", value: "kg-ms" },
                                      { label: "N-s", value: "Ns" },
                                      { label: "N-min", value: "Nm" },
                                      { label: "N-h", value: "Nh" },
                                      { label: "lb-ft", value: "lb-ft" },
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
                        {(formData.tech_to_calr === "mom_t" ||
                          formData.tech_to_calr === "time_c") && (
                          <>
                            <div className="col-span-6 ">
                              <label htmlFor="tech_force" className="label">
                                {data?.payload?.tech_lang_keys["7"]} (F)
                              </label>
                              <div className="relative w-full ">
                                <input
                                  type="number"
                                  name="tech_force"
                                  step="any"
                                  className="mt-1 input"
                                  value={formData.tech_force}
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
                                      { label: "N", value: "N" },
                                      { label: "KN", value: "KN" },
                                      { label: "MN", value: "MN" },
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
                        {(formData.tech_to_calr === "mom_t" ||
                          formData.tech_to_calr === "force") && (
                          <>
                            <div className="col-span-6 a_velocity">
                              <label htmlFor="tech_time" className="label">
                                {data?.payload?.tech_lang_keys["8"]} (ΔT):
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
                                  onClick={toggleDropdown5}
                                >
                                  {formData.tech_unit_t} ▾
                                </label>
                                {dropdownVisible5 && (
                                  <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                    {[
                                      { label: "s", value: "s" },
                                      { label: "min", value: "min" },
                                      { label: "h", value: "h" },
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
                        )}
                      </div>
                    </div>
                  </>
                )}
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />
                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {result?.tech_mom && (
                          <>
                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["4"]}(p)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_mom} (N-s) kg m/s
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="col-12 mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[9]}
                              </strong>
                            </p>

                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["4"]}(p)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_mom * 0.01666667
                                        ).toFixed(5)}{" "}
                                        N-min
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["4"]}(p)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_mom * 0.000277778
                                        ).toFixed(5)}{" "}
                                        N-h
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["4"]}(p)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_mom * 0.22482
                                        ).toFixed(5)}{" "}
                                        lb-ft/s
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {result?.tech_mass && (
                          <>
                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["5"]}(m)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result?.tech_mass} kg</strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="col-12 mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[9]}
                              </strong>
                            </p>

                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["5"]}(m)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_mass * 2.20462
                                        ).toFixed(5)}{" "}
                                        lbs
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["5"]}(m)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_mass * 1000
                                        ).toFixed(5)}{" "}
                                        g
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["5"]}(m)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_mass * 1000000
                                        ).toFixed(5)}{" "}
                                        mg
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {result?.tech_velo && (
                          <>
                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["6"]}(v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result?.tech_velo} m/s</strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="col-12 mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[9]}
                              </strong>
                            </p>

                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["6"]}(v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_velo / 1609
                                        ).toFixed(5)}{" "}
                                        miles/s
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["6"]}(v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_velo / 1000
                                        ).toFixed(5)}{" "}
                                        km/s
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["6"]}(v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_velo * 3.281
                                        ).toFixed(5)}{" "}
                                        ft/s
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["6"]}(v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_velo * 39.37
                                        ).toFixed(5)}{" "}
                                        in/s
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["6"]}(v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_velo * 1.094
                                        ).toFixed(5)}{" "}
                                        yd/s
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["6"]}(v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_velo * 3.6
                                        ).toFixed(5)}{" "}
                                        km/h
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["6"]}(v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_velo * 2.237
                                        ).toFixed(5)}{" "}
                                        m/h
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {result?.tech_momt && (
                          <>
                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["4"]}(p)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_momt} (N-s) kg m/s
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="col-12 mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[9]}
                              </strong>
                            </p>

                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["4"]}(p)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_momt * 0.01666667
                                        ).toFixed(5)}{" "}
                                        N-min
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["4"]}(p)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_momt * 0.000277778
                                        ).toFixed(5)}{" "}
                                        N-h
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["4"]}(p)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_momt * 0.22482
                                        ).toFixed(5)}{" "}
                                        lb-ft/s
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {result?.tech_forcet && (
                          <>
                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["7"]}(F)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result?.tech_forcet} N</strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="col-12 mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[9]}
                              </strong>
                            </p>

                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["7"]}(F)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(result?.tech_forcet / 1e3).toFixed(6)}{" "}
                                        kN
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["7"]}(F)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(result?.tech_forcet / 1e6).toFixed(6)}{" "}
                                        MN
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {result?.tech_time && (
                          <>
                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["8"]}(ΔT)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result?.tech_time} s</strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="col-12 mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[9]}
                              </strong>
                            </p>

                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["8"]}(ΔT)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_time * 60).toFixed(
                                          6
                                        )}{" "}
                                        min
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["8"]}(ΔT)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_time * 3600
                                        ).toFixed(6)}{" "}
                                        h
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

export default MomentumCalculator;

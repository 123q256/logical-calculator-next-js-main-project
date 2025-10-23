"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCentripetalForceCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CentripetalForceCalculator = () => {
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
    tech_mass: "7",
    tech_mass_unit: "g",
    tech_radius: "7",
    tech_radius_unit: "mm",
    tech_t_velocity: "7",
    tech_t_velocity_unit: "m/s",
    tech_c_force: "7",
    tech_c_force_unit: "N",
    tech_angular_velocity: "7",
    tech_angular_velocity_unit: "rpm",
    tech_centripetal_acceleration: "7",
    tech_centripetal_acceleration_unit: "m/s²",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCentripetalForceCalculatorMutation();

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
      const response = await calculateEbitCalculator({
        tech_find: formData.tech_find,
        tech_mass: formData.tech_mass,
        tech_mass_unit: formData.tech_mass_unit,
        tech_radius: formData.tech_radius,
        tech_radius_unit: formData.tech_radius_unit,
        tech_t_velocity: formData.tech_t_velocity,
        tech_t_velocity_unit: formData.tech_t_velocity_unit,
        tech_c_force: formData.tech_c_force,
        tech_c_force_unit: formData.tech_c_force_unit,
        tech_angular_velocity: formData.tech_angular_velocity,
        tech_angular_velocity_unit: formData.tech_angular_velocity_unit,
        tech_centripetal_acceleration: formData.tech_centripetal_acceleration,
        tech_centripetal_acceleration_unit:
          formData.tech_centripetal_acceleration_unit,
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
      tech_find: "1", // 1 2 3 4 5 6
      tech_mass: "7",
      tech_mass_unit: "g",
      tech_radius: "7",
      tech_radius_unit: "mm",
      tech_t_velocity: "7",
      tech_t_velocity_unit: "m/s",
      tech_c_force: "7",
      tech_c_force_unit: "N",
      tech_angular_velocity: "7",
      tech_angular_velocity_unit: "rpm",
      tech_centripetal_acceleration: "7",
      tech_centripetal_acceleration_unit: "m/s²",
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
    setFormData((prev) => ({ ...prev, tech_t_velocity_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_c_force_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angular_velocity_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_centripetal_acceleration_unit: unit,
    }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12 ">
                <label htmlFor="tech_find" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
                      {data?.payload?.tech_lang_keys["2"]} (m)
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]} (r)
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]} (v)
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["5"]} (F)
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["6"]} (ω)
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["9"]} (a){" "}
                    </option>
                  </select>
                </div>
              </div>

              {(formData.tech_find == "2" ||
                formData.tech_find == "3" ||
                formData.tech_find == "4" ||
                formData.tech_find == "5") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12  mass ">
                    <label htmlFor="tech_mass" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (M)
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
                            { label: "g", value: "g" },
                            { label: "kg", value: "kg" },
                            { label: "t", value: "t" },
                            { label: "oz", value: "oz" },
                            { label: "lb", value: "lb" },
                            { label: "stone", value: "stone" },
                            { label: "US ton", value: "US ton" },
                            { label: "Long ton", value: "Long ton" },
                            { label: "Earths", value: "Earths" },
                            { label: "Suns", value: "Suns" },
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
                formData.tech_find == "3" ||
                formData.tech_find == "5" ||
                formData.tech_find == "6" ||
                formData.tech_find == "4") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12  radius">
                    <label htmlFor="tech_radius" className="label">
                      {data?.payload?.tech_lang_keys["3"]}
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
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "km", value: "km" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "ly", value: "ly" },
                            { label: "au", value: "au" },
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
                formData.tech_find == "2" ||
                formData.tech_find == "4" ||
                formData.tech_find == "6") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12  t_velocity">
                    <label htmlFor="tech_t_velocity" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_t_velocity"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_t_velocity}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_t_velocity_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s", value: "m/s" },
                            { label: "km/h", value: "km/h" },
                            { label: "ft/s", value: "ft/s" },
                            { label: "mph", value: "mph" },
                            { label: "ft/min", value: "ft/min" },
                            { label: "m/min", value: "m/min" },
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
              {(formData.tech_find == "1" ||
                formData.tech_find == "2" ||
                formData.tech_find == "3" ||
                formData.tech_find == "5") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12  centi_force">
                    <label htmlFor="tech_c_force" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (F)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_c_force"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_c_force}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_c_force_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "N", value: "N" },
                            { label: "km/h", value: "km/h" },
                            { label: "kN", value: "kN" },
                            { label: "pdl", value: "pdl" },
                            { label: "lbf", value: "lbf" },
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
              {(formData.tech_find == "1" ||
                formData.tech_find == "2" ||
                formData.tech_find == "3" ||
                formData.tech_find == "4") && (
                <>
                  {/* <div className="col-span-6  angular_velocity  ">
                      <label htmlFor="tech_angular_velocity" className="label" >
                        { data?.payload?.tech_lang_keys["6"]}  (ω)
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_angular_velocity"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_angular_velocity}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-3"
                              onClick={toggleDropdown4}
                            >
                              {formData.tech_angular_velocity_unit} ▾
                            </label>
                            {dropdownVisible4 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "rpm", value: "rpm" },
                                  { label: "rad/s", value: "rad/s" },
                                  { label: "Hz", value: "Hz" },

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

                   
                  </div> */}
                </>
              )}
              {(formData.tech_find == "2" ||
                formData.tech_find == "3" ||
                formData.tech_find == "5" ||
                formData.tech_find == "6") && (
                <>
                  {/* <div className="col-span-6  centripetal_acceleration  ">
                     <label htmlFor="tech_centripetal_acceleration" className="label" >
                        { data?.payload?.tech_lang_keys["7"]}  (a)
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_centripetal_acceleration"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_centripetal_acceleration}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-3"
                              onClick={toggleDropdown5}
                            >
                              {formData.tech_centripetal_acceleration_unit} ▾
                            </label>
                            {dropdownVisible5 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "m/s²", value: "m/s²" },
                                  { label: "g", value: "g" },
                                  { label: "m/s", value: "m/s" },

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
                  </div> */}
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
                      <div className="w-full text-[18px] overflow-auto">
                        <div
                          id="res_copy"
                          className=" text-[18px] md:text-[20px]"
                        >
                          {result?.tech_mass && (
                            <>
                              <div className="col-lg-5 mt-2 overflow-auto">
                                <table className="w-full md:w-[60%] lg:text-[18px] md:text-[18px] text-[16px]">
                                  <tbody>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[2]}{" "}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {" "}
                                        {result?.tech_mass} (kg)
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["8"]}
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["9"]} :
                                </strong>
                              </p>
                              <p className="mt-2">
                                <InlineMath math="m = d \cdot \frac{F_c \cdot r}{v^2}" />
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]} :
                                </strong>
                              </p>
                              <p className="mt-2">
                                <InlineMath math="m = d \cdot \frac{F_c \cdot r}{v^2}" />
                              </p>
                              <p className="mt-2">
                                <InlineMath
                                  math={`m = d \\cdot \\frac{${result?.tech_c} \\cdot ${result?.tech_r}}{(${result?.tech_v})^2}`}
                                />
                              </p>
                              <p className="mt-2 dk">m = {result?.tech_mass}</p>
                            </>
                          )}

                          {result?.tech_radius && (
                            <>
                              <div className="col-lg-5 mt-2">
                                <table className="w-full md:w-[50%] lg:text-[18px] md:text-[18px] text-[16px]">
                                  <tbody>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[3]}{" "}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {" "}
                                        {result?.tech_radius} (m)
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["8"]} :
                                </strong>
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["9"]} :
                                </strong>
                              </p>
                              <p className="mt-2">
                                <InlineMath math="r = \frac{mv^2}{F}" />
                              </p>

                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]} :
                                </strong>
                              </p>

                              <p className="mt-2">
                                <InlineMath math="r = \frac{mv^2}{F}" />
                              </p>

                              <p className="mt-2">
                                <InlineMath
                                  math={`r = \\frac{${result?.tech_m} \\cdot ${result?.tech_v}^2}{${result?.tech_c}}`}
                                />
                              </p>
                              <p className="mt-2 dk">
                                r = {result?.tech_radius}
                              </p>
                            </>
                          )}

                          {result?.tech_velocity && (
                            <>
                              <div className="col-lg-8 mt-2">
                                <table className="w-full md:w-[50%] lg:text-[18px] md:text-[18px] text-[16px]">
                                  <tbody>
                                    <tr>
                                      <td className="py-2 border-b" width="50%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[4]} (v)
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {" "}
                                        {result?.tech_velocity} (m/s)
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["8"]} :
                                </strong>
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["9"]} :
                                </strong>
                              </p>
                              <p className="mt-2">
                                <InlineMath math="v = \frac{\sqrt{r \cdot F_c}}{m}" />
                              </p>

                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]} :
                                </strong>
                              </p>

                              <p className="mt-2">
                                <InlineMath math="v = \frac{\sqrt{r \cdot F_c}}{m}" />
                              </p>

                              <p className="mt-2">
                                <InlineMath
                                  math={`v = \\frac{\\sqrt{${result?.r} \\cdot ${result?.c}}}{${result?.m}}`}
                                />
                              </p>

                              <p className="mt-2">
                                <InlineMath
                                  math={`v = \\frac{\\sqrt{${result?.r} \\cdot ${result?.c}}}{${result?.m}}`}
                                />
                              </p>

                              <p className="mt-2 dk">
                                v = {result?.tech_velocity}
                              </p>
                            </>
                          )}

                          {result?.tech_centripetal_force && (
                            <>
                              <div className="col-lg-8 mt-2">
                                <table className="w-full md:w-[50%] lg:text-[18px] md:text-[18px] text-[16px]">
                                  <tbody>
                                    <tr>
                                      <td className="py-2 border-b" width="50%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[5]} (F)
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {" "}
                                        {result?.tech_centripetal_force} (N)
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]}
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["9"]} :
                                </strong>
                              </p>
                              <p className="mt-2">
                                <InlineMath math="F = \frac{m v^2}{r}" />
                              </p>

                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]} :
                                </strong>
                              </p>

                              <p className="mt-2">
                                <InlineMath math="F = \frac{m v^2}{r}" />
                              </p>

                              <p className="mt-2">
                                <InlineMath
                                  math={`F = \\frac{${result?.tech_m} \\cdot ${result?.tech_v}^2}{${result?.tech_r}}`}
                                />
                              </p>
                              <p className="mt-2 dk">
                                F = {result?.tech_centripetal_force}
                              </p>
                            </>
                          )}

                          {result?.tech_angular_velocity && (
                            <>
                              <div className="col-lg-8 mt-2">
                                <table className="w-full md:w-[50%] lg:text-[18px] md:text-[18px] text-[16px]">
                                  <tbody>
                                    <tr>
                                      <td className="py-2 border-b" width="50%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[6]} (ω)
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {" "}
                                        {result?.tech_angular_velocity} (rad/s)
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["8"]}
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["9"]} :
                                </strong>
                              </p>
                              <p className="mt-2">
                                <InlineMath math="\\omega = \\frac{F}{m \\cdot r}" />
                              </p>

                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]} :
                                </strong>
                              </p>

                              <p className="mt-2">
                                <InlineMath math="\\omega = \\frac{F}{m \\cdot r}" />
                              </p>

                              <p className="mt-2">
                                <InlineMath
                                  math={`\\omega = \\frac{${result?.tech_c}}{${result?.tech_m} \\cdot ${result?.tech_r}}`}
                                />
                              </p>
                              <p className="mt-2 dk">
                                ω = {result?.tech_angular_velocity}
                              </p>
                            </>
                          )}

                          {result?.tech_ac && (
                            <>
                              <div className="col-lg-8 mt-2">
                                <table className="w-full md:w-[50%] lg:text-[18px] md:text-[18px] text-[16px]">
                                  <tbody>
                                    <tr>
                                      <td className="py-2 border-b" width="50%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[7]} (a)
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {" "}
                                        {result?.tech_ac} (m/s<sup>2</sup>)
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]}
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["9"]}:
                                </strong>
                              </p>
                              <p className="mt-2">
                                <InlineMath math="a = \frac{v^2}{r}" />
                              </p>

                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]} :
                                </strong>
                              </p>

                              <p className="mt-2">
                                <InlineMath
                                  math={`a = \\frac{${result?.tech_v}^2}{${result?.tech_r}}`}
                                />
                              </p>

                              <p className="mt-2">
                                <InlineMath
                                  math={`a = \\frac{${
                                    result?.tech_v * result?.tech_v
                                  }}{${result?.tech_r}}`}
                                />
                              </p>
                              <p className="mt-2 dk">a = {result?.tech_ac}</p>
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

export default CentripetalForceCalculator;

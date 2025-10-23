"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useChangeInMomentumCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ChangeInMomentumCalculator = () => {
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
    tech_operation: "1", // 1 2 3
    tech_mass: 12,
    tech_mass_unit: "tons(t)",
    tech_i_velocity: 1200,
    tech_i_velocity_unit: "m/s",
    tech_f_velocity: 1200,
    tech_f_velocity_unit: "m/s",
    tech_chnage_velocity: "1200",
    tech_c_velocity_unit: "knots",
    tech_force: 1200,
    tech_force_unit: "N",
    tech_time: 15,
    tech_time_unit: "sec",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useChangeInMomentumCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operation) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operation: formData.tech_operation,
        tech_mass: formData.tech_mass,
        tech_mass_unit: formData.tech_mass_unit,
        tech_i_velocity: formData.tech_i_velocity,
        tech_i_velocity_unit: formData.tech_i_velocity_unit,
        tech_f_velocity: formData.tech_f_velocity,
        tech_f_velocity_unit: formData.tech_f_velocity_unit,
        tech_chnage_velocity: formData.tech_chnage_velocity,
        tech_c_velocity_unit: formData.tech_c_velocity_unit,
        tech_force: formData.tech_force,
        tech_force_unit: formData.tech_force_unit,
        tech_time: formData.tech_time,
        tech_time_unit: formData.tech_time_unit,
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
      tech_operation: "1", // 1 2 3
      tech_mass: 12,
      tech_mass_unit: "tons(t)",
      tech_i_velocity: 1200,
      tech_i_velocity_unit: "m/s",
      tech_f_velocity: 1200,
      tech_f_velocity_unit: "m/s",
      tech_chnage_velocity: "1200",
      tech_c_velocity_unit: "knots",
      tech_force: 1200,
      tech_force_unit: "N",
      tech_time: 15,
      tech_time_unit: "sec",
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
    setFormData((prev) => ({ ...prev, tech_i_velocity_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_f_velocity_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_c_velocity_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_force_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_time_unit: unit }));
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

          <div className="lg:w-[50%] md:w-[50%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-1 md:gap-4">
              <div className="col-span-12  mt-lg-2" id="optional">
                <label htmlFor="tech_operation" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_operation"
                    id="tech_operation"
                    value={formData.tech_operation}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12  px-2 mt-0 mt-lg-2">
                {formData.tech_operation == "1" && (
                  <>
                    <div
                      className="col s12 font_s28 black-text txt"
                      id="math_s"
                    >
                      <b className="col s12 center">
                        <BlockMath math="\Delta P = m(V_f - V_i)" />
                      </b>
                    </div>
                  </>
                )}
                {formData.tech_operation == "2" && (
                  <>
                    <p className="col s12 font_s28 black-text txt " id="math_d">
                      <b className="col s12 center">
                        <BlockMath math="\Delta P = m \Delta V" />
                      </b>
                    </p>
                  </>
                )}
                {formData.tech_operation == "3" && (
                  <>
                    <div
                      className="col s12 font_s28 black-text txt "
                      id="math_t"
                    >
                      <b className="col s12 center">
                        <BlockMath math="\Delta P = F \cdot T" />
                      </b>
                    </div>
                  </>
                )}
              </div>
              {(formData.tech_operation == "1" ||
                formData.tech_operation == "2") && (
                <>
                  <div className="col-span-12 md:col-span-6 mass">
                    <label htmlFor="tech_mass" className="label">
                      {data?.payload?.tech_lang_keys["13"]}
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
                            { label: "g", value: "g" },
                            { label: "mg", value: "mg" },
                            { label: "µg", value: "µg" },
                            { label: "tons(t)", value: "tons(t)" },
                            { label: "US ton", value: "US ton" },
                            { label: "long ton", value: "long ton" },
                            { label: "oz", value: "oz" },
                            { label: "lb", value: "lb" },
                            { label: "stone", value: "stone" },
                            { label: "me", value: "me" },
                            { label: "u", value: "u" },
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
              {formData.tech_operation == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 i_velocity">
                    <label htmlFor="tech_i_velocity" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_i_velocity"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_i_velocity}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_i_velocity_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s", value: "m/s" },
                            { label: "km/h", value: "km/h" },
                            { label: "ft/s", value: "ft/s" },
                            { label: "mph", value: "mph" },
                            { label: "knots", value: "knots" },
                            { label: "ft/min", value: "ft/min" },
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
              {formData.tech_operation == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 f_velocity">
                    <label htmlFor="tech_f_velocity" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_f_velocity"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_f_velocity}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_f_velocity_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s", value: "m/s" },
                            { label: "km/h", value: "km/h" },
                            { label: "ft/s", value: "ft/s" },
                            { label: "mph", value: "mph" },
                            { label: "knots", value: "knots" },
                            { label: "ft/min", value: "ft/min" },
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
              {formData.tech_operation == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 chnage_velocity ">
                    <label htmlFor="tech_chnage_velocity" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_chnage_velocity"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_chnage_velocity}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_c_velocity_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s", value: "m/s" },
                            { label: "km/h", value: "km/h" },
                            { label: "ft/s", value: "ft/s" },
                            { label: "mph", value: "mph" },
                            { label: "knots", value: "knots" },
                            { label: "ft/min", value: "ft/min" },
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
              {formData.tech_operation == "3" && (
                <>
                  <div className="col-span-12 md:col-span-6 force ">
                    <label htmlFor="tech_force" className="label">
                      {data?.payload?.tech_lang_keys["8"]}
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
                        {formData.tech_force_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "N", value: "N" },
                            { label: "KN", value: "KN" },
                            { label: "MN", value: "MN" },
                            { label: "GN", value: "GN" },
                            { label: "TN", value: "TN" },
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
              {formData.tech_operation == "3" && (
                <>
                  <div className="col-span-12 md:col-span-6 time ">
                    <label htmlFor="tech_time" className="label">
                      {data?.payload?.tech_lang_keys["9"]}
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
                        {formData.tech_time_unit} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "sec", value: "sec" },
                            { label: "min", value: "min" },
                            { label: "hr", value: "hr" },
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
                      {formData?.tech_operation == "1" ? (
                        <>
                          <div className="w-full md:w-[70%] lg:w-[90%]  mt-2">
                            <table className="w-full text-[14px] md:text-[18px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[3]}{" "}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {" "}
                                    {Number(
                                      result?.tech_initial_momentum
                                    ).toFixed(2)}{" "}
                                    Ns
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[3]}{" "}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {" "}
                                    {Number(
                                      result?.tech_final_momentum
                                    ).toFixed(2)}{" "}
                                    Ns
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[3]}{" "}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {" "}
                                    {Number(
                                      result?.tech_change_momentum_val
                                    ).toFixed(2)}{" "}
                                    Ns
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full text-center text-[25px]">
                            <p>{data?.payload?.tech_lang_keys[12]}</p>
                            <p className="my-3">
                              <strong className="bg-sky-100 px-3 py-2 ">
                                {Number(
                                  result?.tech_change_momentum_val
                                ).toFixed(2)}
                              </strong>
                            </p>
                          </div>
                        </>
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

export default ChangeInMomentumCalculator;

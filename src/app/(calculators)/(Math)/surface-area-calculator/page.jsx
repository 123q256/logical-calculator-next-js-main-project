"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useSurfaceAreaCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SurfaceAreaCalculator = () => {
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
    tech_operations: "1",
    tech_shape: "1",
    tech_first: "12",
    tech_unit1: "m",
    tech_second: "7",
    tech_unit2: "m",
    tech_third: "7",
    tech_unit3: "m",
    tech_four: "7",
    tech_unit4: "m",
    tech_pi: "3.141593",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSurfaceAreaCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_shape: formData.tech_shape,
        tech_first: formData.tech_first,
        tech_unit1: formData.tech_unit1,
        tech_second: formData.tech_second,
        tech_unit2: formData.tech_unit2,
        tech_third: formData.tech_third,
        tech_unit3: formData.tech_unit3,
        tech_four: formData.tech_four,
        tech_unit4: formData.tech_unit4,
        tech_pi: formData.tech_pi,
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
      tech_operations: "1",
      tech_shape: "1",
      tech_first: "12",
      tech_unit1: "m",
      tech_second: "7",
      tech_unit2: "m",
      tech_third: "7",
      tech_unit3: "m",
      tech_four: "7",
      tech_unit4: "m",
      tech_pi: "3.141593",
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
    setFormData((prev) => ({ ...prev, tech_unit1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit2: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit3: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit4: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  // result

  const [selectedUnit, setSelectedUnit] = useState("cm²");
  const [convertedValue, setConvertedValue] = useState(null);

  const conversionFactors = {
    "in²": 6.452,
    "cm²": 1,
    "ft²": 929,
    "yd²": 8381,
    "m²": 10000,
    "km²": 1e10, // correct to convert to cm²
    "mm²": 0.01,
  };

  const originalValue = parseFloat(result?.tech_ttsa || 0);

  useEffect(() => {
    const factor = conversionFactors[selectedUnit] || 1;
    let newVal;

    if (selectedUnit === "mm²") {
      newVal = originalValue / factor; // mm² is smaller than cm²
    } else if (selectedUnit === "km²") {
      newVal = originalValue / factor; // km² is very large
    } else {
      newVal = originalValue / factor;
    }

    setConvertedValue(Number(newVal.toFixed(6)));
  }, [selectedUnit, originalValue]);

  const renderRow = (labelKey, value, unit = "cm") =>
    value !== undefined && (
      <tr>
        <td className="border-b py-2 font-semibold">
          {data?.payload?.tech_lang_keys[labelKey]}:
        </td>
        <td className="border-b py-2">
          {Number(value).toFixed(3)} <span className="text-sm">({unit})</span>
        </td>
      </tr>
    );

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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="col-12 px-2">
                  <label htmlFor="tech_operations" className="label">
                    {data?.payload?.tech_lang_keys["43"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_operations"
                      id="tech_operations"
                      value={formData.tech_operations}
                      onChange={handleChange}
                    >
                      <option value="1">
                        {data?.payload?.tech_lang_keys["1"]}{" "}
                      </option>
                      <option value="2">
                        {data?.payload?.tech_lang_keys["2"]}{" "}
                      </option>
                      <option value="3">
                        {data?.payload?.tech_lang_keys["3"]}{" "}
                      </option>
                      <option value="4">
                        {data?.payload?.tech_lang_keys["4"]}{" "}
                      </option>
                      <option value="5">
                        {data?.payload?.tech_lang_keys["5"]}{" "}
                      </option>
                      <option value="6">
                        {data?.payload?.tech_lang_keys["6"]}{" "}
                      </option>
                      <option value="7">
                        {data?.payload?.tech_lang_keys["7"]}{" "}
                      </option>
                      <option value="8">
                        {data?.payload?.tech_lang_keys["8"]}{" "}
                      </option>
                      <option value="9">
                        {data?.payload?.tech_lang_keys["9"]}{" "}
                      </option>
                      <option value="10">
                        {data?.payload?.tech_lang_keys["10"]}{" "}
                      </option>
                      <option value="11">
                        {data?.payload?.tech_lang_keys["11"]}{" "}
                      </option>
                      <option value="12">
                        {data?.payload?.tech_lang_keys["12"]}{" "}
                      </option>
                      <option value="13">
                        {data?.payload?.tech_lang_keys["13"]}{" "}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  {formData.tech_operations == "11" && (
                    <>
                      <div className="col-lg-12 col-6 px-2 shape">
                        <label htmlFor="tech_shape" className="label">
                          {data?.payload?.tech_lang_keys["16"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_shape"
                            id="tech_shape"
                            value={formData.tech_shape}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["15"]}{" "}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["16"]}{" "}
                            </option>
                            <option value="3">
                              {data?.payload?.tech_lang_keys["17"]}{" "}
                            </option>
                            <option value="4">
                              {data?.payload?.tech_lang_keys["18"]}{" "}
                            </option>
                            <option value="5">
                              {data?.payload?.tech_lang_keys["19"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-lg-12 col-6 px-2 f1">
                    {formData.tech_operations == "1" && (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["29"]}{" "}
                        </label>
                      </>
                    )}
                    {formData.tech_operations == "2" && (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["29"]}{" "}
                        </label>
                      </>
                    )}
                    {formData.tech_operations == "3" && (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["20"]}{" "}
                        </label>
                      </>
                    )}
                    {formData.tech_operations == "4" && (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["30"]}{" "}
                        </label>
                      </>
                    )}
                    {formData.tech_operations == "5" && (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["29"]}{" "}
                        </label>
                      </>
                    )}
                    {formData.tech_operations == "6" && (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["29"]}{" "}
                        </label>
                      </>
                    )}
                    {formData.tech_operations == "7" && (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["24"]}{" "}
                        </label>
                      </>
                    )}
                    {formData.tech_operations == "8" && (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["29"]}{" "}
                        </label>
                      </>
                    )}
                    {formData.tech_operations == "9" && (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["33"]}{" "}
                        </label>
                      </>
                    )}
                    {formData.tech_operations == "10" && (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["30"]}{" "}
                        </label>
                      </>
                    )}

                    {formData.tech_operations == "10" && (
                      <>
                        {formData.tech_shape == "1" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {data?.payload?.tech_lang_keys["37"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_shape == "2" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {data?.payload?.tech_lang_keys["37"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_shape == "3" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {data?.payload?.tech_lang_keys["37"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_shape == "4" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {data?.payload?.tech_lang_keys["37"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_shape == "5" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {data?.payload?.tech_lang_keys["37"]}{" "}
                            </label>
                          </>
                        )}
                      </>
                    )}

                    {formData.tech_operations == "12" && (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["29"]}{" "}
                        </label>
                      </>
                    )}
                    {formData.tech_operations == "13" && (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["39"]}{" "}
                        </label>
                      </>
                    )}

                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_first"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_first}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_unit1} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "millimetre  (mm)", value: "mm" },
                            { label: "meters (m)", value: "m" },
                            { label: "inches (in)", value: "in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "yards (yd)", value: "yd" },
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
                  {((formData.tech_operations == "11" &&
                    formData.tech_shape == "1") ||
                    (formData.tech_operations == "11" &&
                      formData.tech_shape == "2") ||
                    (formData.tech_operations == "11" &&
                      formData.tech_shape == "3") ||
                    (formData.tech_operations == "11" &&
                      formData.tech_shape == "4") ||
                    (formData.tech_operations == "11" &&
                      formData.tech_shape == "5") ||
                    formData.tech_operations == "1" ||
                    formData.tech_operations == "2" ||
                    formData.tech_operations == "3" ||
                    formData.tech_operations == "5" ||
                    formData.tech_operations == "7" ||
                    formData.tech_operations == "9" ||
                    formData.tech_operations == "10" ||
                    formData.tech_operations == "13") && (
                    <>
                      <div className="col-lg-12 col-6 px-2 f2">
                        {formData.tech_operations == "1" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {data?.payload?.tech_lang_keys["30"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "2" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {data?.payload?.tech_lang_keys["24"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "3" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {data?.payload?.tech_lang_keys["21"]}{" "}
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "5" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {data?.payload?.tech_lang_keys["24"]}{" "}
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "7" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {data?.payload?.tech_lang_keys["31"]}{" "}
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "9" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {data?.payload?.tech_lang_keys["34"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "10" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {data?.payload?.tech_lang_keys["35"]}{" "}
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "10" && (
                          <>
                            {formData.tech_shape == "1" && (
                              <>
                                <label htmlFor="tech_first" className="label">
                                  {data?.payload?.tech_lang_keys["38"]}{" "}
                                </label>
                              </>
                            )}
                            {formData.tech_shape == "2" && (
                              <>
                                <label htmlFor="tech_first" className="label">
                                  {data?.payload?.tech_lang_keys["38"]}{" "}
                                </label>
                              </>
                            )}
                            {formData.tech_shape == "3" && (
                              <>
                                <label htmlFor="tech_first" className="label">
                                  {data?.payload?.tech_lang_keys["42"]}{" "}
                                </label>
                              </>
                            )}
                            {formData.tech_shape == "4" && (
                              <>
                                <label htmlFor="tech_first" className="label">
                                  {data?.payload?.tech_lang_keys["38"]}{" "}
                                </label>
                              </>
                            )}
                            {formData.tech_shape == "5" && (
                              <>
                                <label htmlFor="tech_first" className="label">
                                  {data?.payload?.tech_lang_keys["38"]}{" "}
                                </label>
                              </>
                            )}
                          </>
                        )}
                        {formData.tech_operations == "13" && (
                          <>
                            <label htmlFor="tech_second" className="label">
                              {data?.payload?.tech_lang_keys["40"]}{" "}
                            </label>
                          </>
                        )}

                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_second"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_second}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_unit2} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "millimetre  (mm)", value: "mm" },
                                { label: "meters (m)", value: "m" },
                                { label: "inches (in)", value: "in" },
                                { label: "feet (ft)", value: "ft" },
                                { label: "yards (yd)", value: "yd" },
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
                  {((formData.tech_operations == "11" &&
                    formData.tech_shape == "3") ||
                    formData.tech_operations == "3" ||
                    formData.tech_operations == "7" ||
                    formData.tech_operations == "10") && (
                    <>
                      <div className="col-lg-12 col-6 px-2 f3">
                        {formData.tech_shape == "3" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              {data?.payload?.tech_lang_keys["24"]}{" "}
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "1" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              {data?.payload?.tech_lang_keys["24"]}{" "}
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "3" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              {data?.payload?.tech_lang_keys["24"]}{" "}
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "7" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              {data?.payload?.tech_lang_keys["32"]}{" "}
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "10" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              {data?.payload?.tech_lang_keys["36"]}{" "}
                            </label>
                          </>
                        )}

                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_third"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_third}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_unit3} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "millimetre  (mm)", value: "mm" },
                                { label: "meters (m)", value: "m" },
                                { label: "inches (in)", value: "in" },
                                { label: "feet (ft)", value: "ft" },
                                { label: "yards (yd)", value: "yd" },
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

                  {formData.tech_operations == "10" && (
                    <>
                      <div className="col-lg-12 col-6 px-2 f4">
                        {formData.tech_operations == "1" && (
                          <>
                            <label htmlFor="tech_four" className="label">
                              {data?.payload?.tech_lang_keys["22"]}{" "}
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "10" && (
                          <>
                            <label htmlFor="tech_four" className="label">
                              {data?.payload?.tech_lang_keys["24"]}{" "}
                            </label>
                          </>
                        )}

                        {formData.tech_operations == "13" && (
                          <>
                            <label htmlFor="tech_four" className="label">
                              {data?.payload?.tech_lang_keys["41"]}{" "}
                            </label>
                          </>
                        )}

                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_four"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_four}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_unit4} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "millimetre  (mm)", value: "mm" },
                                { label: "meters (m)", value: "m" },
                                { label: "inches (in)", value: "in" },
                                { label: "feet (ft)", value: "ft" },
                                { label: "yards (yd)", value: "yd" },
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

                  {(formData.tech_operations == "1" ||
                    formData.tech_operations == "2" ||
                    formData.tech_operations == "3" ||
                    formData.tech_operations == "5" ||
                    formData.tech_operations == "6" ||
                    formData.tech_operations == "8" ||
                    formData.tech_operations == "9") && (
                    <>
                      <div className="col-lg-12 col-6 px-2 pi">
                        <label htmlFor="tech_pi" className="label">
                          {data?.payload?.tech_lang_keys["23"]} π:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_pi"
                            id="tech_pi"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_pi}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 flex items-center ps-lg-3 justify-center">
                {formData.tech_operations == "1" && (
                  <>
                    <img
                      src="/images/surface_area_images/surface1.png"
                      alt="surface image"
                      width="200px"
                      height="200px"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_operations == "2" && (
                  <>
                    <img
                      src="/images/surface_area_images/surface2.png"
                      alt="surface image"
                      width="200px"
                      height="200px"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_operations == "3" && (
                  <>
                    <img
                      src="/images/surface_area_images/surface3.png"
                      alt="surface image"
                      width="200px"
                      height="200px"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_operations == "4" && (
                  <>
                    <img
                      src="/images/surface_area_images/surface4.png"
                      alt="surface image"
                      width="200px"
                      height="200px"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_operations == "5" && (
                  <>
                    <img
                      src="/images/surface_area_images/surface5.png"
                      alt="surface image"
                      width="200px"
                      height="200px"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_operations == "6" && (
                  <>
                    <img
                      src="/images/surface_area_images/surface6.png"
                      alt="surface image"
                      width="200px"
                      height="200px"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_operations == "7" && (
                  <>
                    <img
                      src="/images/surface_area_images/surface7.png"
                      alt="surface image"
                      width="200px"
                      height="200px"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_operations == "8" && (
                  <>
                    <img
                      src="/images/surface_area_images/surface8.png"
                      alt="surface image"
                      width="200px"
                      height="200px"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_operations == "9" && (
                  <>
                    <img
                      src="/images/surface_area_images/surface9.png"
                      alt="surface image"
                      width="200px"
                      height="200px"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_operations == "10" && (
                  <>
                    <img
                      src="/images/surface_area_images/surface10.png"
                      alt="surface image"
                      width="200px"
                      height="200px"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_operations == "11" && (
                  <>
                    {formData.tech_shape == "1" && (
                      <>
                        <img
                          src="/images/surface_area_images/surface11.png"
                          alt="surface image"
                          width="200px"
                          height="200px"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_shape == "2" && (
                      <>
                        <img
                          src="/images/surface_area_images/pyramids2.png"
                          alt="surface image"
                          width="200px"
                          height="200px"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_shape == "3" && (
                      <>
                        <img
                          src="/images/surface_area_images/pyramids3.png"
                          alt="surface image"
                          width="200px"
                          height="200px"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_shape == "4" && (
                      <>
                        <img
                          src="/images/surface_area_images/pyramids4.png"
                          alt="surface image"
                          width="200px"
                          height="200px"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_shape == "5" && (
                      <>
                        <img
                          src="/images/surface_area_images/pyramids5.png"
                          alt="surface image"
                          width="200px"
                          height="200px"
                          className="change_img"
                        />
                      </>
                    )}
                  </>
                )}
                {formData.tech_operations == "12" && (
                  <>
                    <img
                      src="/images/surface_area_images/surface12.png"
                      alt="surface image"
                      width="200px"
                      height="200px"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_operations == "13" && (
                  <>
                    <img
                      src="/images/surface_area_images/surface13.png"
                      alt="surface image"
                      width="200px"
                      height="200px"
                      className="change_img"
                    />
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[80%] lg:w-[80%] text-[16px] overflow-auto">
                          <table className="w-full">
                            <tbody>
                              {renderRow(25, result?.tech_height, "cm")}
                              {result?.tech_ttsa !== undefined && (
                                <tr>
                                  <td className="border-b py-2 font-semibold">
                                    {data?.payload?.tech_lang_keys[26]}:
                                  </td>
                                  <td className="border-b py-2">
                                    <span className=" font-medium">
                                      {convertedValue}{" "}
                                    </span>
                                    <select
                                      value={selectedUnit}
                                      onChange={(e) =>
                                        setSelectedUnit(e.target.value)
                                      }
                                      className="inline ms-2 border px-1 py-[2px]  rounded"
                                      style={{ width: "100px" }}
                                    >
                                      {[
                                        "in²",
                                        "cm²",
                                        "m²",
                                        "ft²",
                                        "yd²",
                                        "km²",
                                        "mm²",
                                      ].map((unit) => (
                                        <option value={unit} key={unit}>
                                          {unit}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                </tr>
                              )}
                              {renderRow(27, result?.tech_csa, "cm²")}
                              {renderRow(28, result?.tech_top, "cm²")}
                              {renderRow(44, result?.tech_bsa, "cm²")}
                              {renderRow(45, result?.tech_lsa, "cm²")}
                            </tbody>
                          </table>
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

export default SurfaceAreaCalculator;

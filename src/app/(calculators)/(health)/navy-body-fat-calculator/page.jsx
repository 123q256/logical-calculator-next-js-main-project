"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useNavyBodyFatCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const NavyBodyFatCalculator = () => {
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
    tech_gender: "male",
    tech_age: "23",
    tech_weight: "15",
    tech_weight_unit: "lbs",
    tech_height_ft: "6",
    tech_unit_ft_in: "cm",
    tech_height_in: "15",
    tech_unit_h: "cm",
    tech_height_cm: "168",
    tech_unit_h_cm: "cm",
    tech_neck_ft: "0",
    tech_unit_ft_in1: "cm",
    tech_neck_in: "0",
    tech_unit_h1: "ft/in",
    tech_neck_cm: "30",
    tech_unit_h_cm1: "cm",
    tech_waist_ft: "0",
    tech_unit_ft_in2: "cm",
    tech_waist_in: "0",
    tech_unit_h2: "cm",
    tech_waist_cm: "81",
    tech_unit_h_cm2: "cm",
    tech_hip_ft: "1",
    tech_unit_ft_in3: "cm",
    tech_hip_in: "45",
    tech_unit_h3: "cm",
    tech_hip_cm: "97",
    tech_unit_h_cm3: "cm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useNavyBodyFatCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_gender ||
      !formData.tech_age ||
      !formData.tech_weight ||
      !formData.tech_weight_unit
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_gender: formData.tech_gender,
        tech_age: formData.tech_age,
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
        tech_height_ft: formData.tech_height_ft,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_height_in: formData.tech_height_in,
        tech_unit_h: formData.tech_unit_h,
        tech_height_cm: formData.tech_height_cm,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_neck_ft: formData.tech_neck_ft,
        tech_unit_ft_in1: formData.tech_unit_ft_in1,
        tech_neck_in: formData.tech_neck_in,
        tech_unit_h1: formData.tech_unit_h1,
        tech_neck_cm: formData.tech_neck_cm,
        tech_unit_h_cm1: formData.tech_unit_h_cm1,
        tech_waist_ft: formData.tech_waist_ft,
        tech_unit_ft_in2: formData.tech_unit_ft_in2,
        tech_waist_in: formData.tech_waist_in,
        tech_unit_h2: formData.tech_unit_h2,
        tech_waist_cm: formData.tech_waist_cm,
        tech_unit_h_cm2: formData.tech_unit_h_cm2,
        tech_hip_ft: formData.tech_hip_ft,
        tech_unit_ft_in3: formData.tech_unit_ft_in3,
        tech_hip_in: formData.tech_hip_in,
        tech_unit_h3: formData.tech_unit_h3,
        tech_hip_cm: formData.tech_hip_cm,
        tech_unit_h_cm3: formData.tech_unit_h_cm3,
        tech_y: formData.tech_y,
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
      tech_gender: "male",
      tech_age: "23",
      tech_weight: "15",
      tech_weight_unit: "lbs",
      tech_height_ft: "6",
      tech_unit_ft_in: "cm",
      tech_height_in: "15",
      tech_unit_h: "cm",
      tech_height_cm: "168",
      tech_unit_h_cm: "cm",
      tech_neck_ft: "0",
      tech_unit_ft_in1: "cm",
      tech_neck_in: "0",
      tech_unit_h1: "ft/in",
      tech_neck_cm: "30",
      tech_unit_h_cm1: "cm",
      tech_waist_ft: "0",
      tech_unit_ft_in2: "cm",
      tech_waist_in: "0",
      tech_unit_h2: "cm",
      tech_waist_cm: "81",
      tech_unit_h_cm2: "cm",
      tech_hip_ft: "1",
      tech_unit_ft_in3: "cm",
      tech_hip_in: "45",
      tech_unit_h3: "cm",
      tech_hip_cm: "97",
      tech_unit_h_cm3: "cm",
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

  //dropdown states 0
  const [dropdownVisible0, setDropdownVisible0] = useState(false);

  const setUnitHandler0 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_weight_unit: unit,
    }));
    setDropdownVisible0(false);
  };

  const toggleDropdown0 = () => {
    setDropdownVisible0(!dropdownVisible0);
  };

  //dropdown states 1
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h: unit,
      tech_unit_ft_in: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 2
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: unit,
      tech_unit_ft_in: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 3
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h1: unit,
      tech_unit_ft_in1: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states 4
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm1: unit,
      tech_unit_ft_in1: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states 5
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_waist_in: unit,
      tech_unit_ft_in2: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states 6
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm2: unit,
      tech_unit_ft_in2: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states 7
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h3: unit,
      tech_unit_ft_in3: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  //dropdown states 8
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm3: unit,
      tech_unit_ft_in3: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_gender"
                    id="tech_gender"
                    value={formData.tech_gender}
                    onChange={handleChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_age"
                    id="tech_age"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_age}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_weight"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_weight}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown0}
                  >
                    {formData.tech_weight_unit} ▾
                  </label>
                  {dropdownVisible0 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "kilograms (kg)", value: "kg" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler0(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <input
                type="hidden"
                step="any"
                name="tech_unit_ft_in"
                id="tech_unit_ft_in"
                className="input my-2"
                aria-label="input"
                value={formData.tech_unit_ft_in}
                onChange={handleChange}
              />
              {/* 1 */}
              {formData.tech_unit_ft_in == "ft/in" && (
                <>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3">
                    <label htmlFor="tech_height_ft" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_height_ft"
                        id="tech_height_ft"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_height_ft}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3">
                    <label htmlFor="tech_height_in" className="label">
                      &nbsp;
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height_in"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_height_in}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_unit_h} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inch (in)", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
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
              {(formData.tech_unit_ft_in == "m" ||
                formData.tech_unit_ft_in == "cm" ||
                formData.tech_unit_ft_in == "in" ||
                formData.tech_unit_ft_in == "ft") && (
                <>
                  <div className="col-span-12 md:col-span-6 h_cm">
                    <label htmlFor="tech_height_cm" className="label">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                      {formData.tech_unit_ft_in == "m" ? (
                        <span className="text-blue height_unit">(m)</span>
                      ) : formData.tech_unit_ft_in == "cm" ? (
                        <span className="text-blue height_unit">(cm)</span>
                      ) : formData.tech_unit_ft_in == "in" ? (
                        <span className="text-blue height_unit">(in)</span>
                      ) : formData.tech_unit_ft_in == "ft" ? (
                        <span className="text-blue height_unit">(ft)</span>
                      ) : null}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height_cm"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_height_cm}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_unit_h_cm} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inch (in)", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
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

              <input
                type="hidden"
                step="any"
                name="tech_unit_ft_in1"
                id="tech_unit_ft_in1"
                className="input my-2"
                aria-label="input"
                value={formData.tech_unit_ft_in1}
                onChange={handleChange}
              />
              {/* 2 */}

              {formData.tech_unit_ft_in1 == "ft/in" && (
                <>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3">
                    <label htmlFor="tech_neck_ft" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_neck_ft"
                        id="tech_neck_ft"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_neck_ft}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3">
                    <label htmlFor="tech_neck_in" className="label">
                      &nbsp;
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_neck_in"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_neck_in}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_unit_h1} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inch (in)", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
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
              {(formData.tech_unit_ft_in1 == "m" ||
                formData.tech_unit_ft_in1 == "cm" ||
                formData.tech_unit_ft_in1 == "in" ||
                formData.tech_unit_ft_in1 == "ft") && (
                <>
                  <div className="col-span-12  md:col-span-6 h_cm1">
                    <label htmlFor="tech_neck_cm" className="label">
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                      {formData.tech_unit_ft_in1 == "m" ? (
                        <span className="text-blue height_unit">(m)</span>
                      ) : formData.tech_unit_ft_in1 == "cm" ? (
                        <span className="text-blue height_unit">(cm)</span>
                      ) : formData.tech_unit_ft_in1 == "in" ? (
                        <span className="text-blue height_unit">(in)</span>
                      ) : formData.tech_unit_ft_in1 == "ft" ? (
                        <span className="text-blue height_unit">(ft)</span>
                      ) : null}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_neck_cm"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_neck_cm}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_unit_h_cm1} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inch (in)", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
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

              <input
                type="hidden"
                step="any"
                name="tech_unit_ft_in2"
                id="tech_unit_ft_in2"
                className="input my-2"
                aria-label="input"
                value={formData.tech_unit_ft_in2}
                onChange={handleChange}
              />
              {/* 3 */}

              {formData.tech_unit_ft_in2 == "ft/in" && (
                <>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3 ft_in2">
                    <label htmlFor="tech_waist_ft" className="label">
                      {data?.payload?.tech_lang_keys["8"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_waist_ft"
                        id="tech_waist_ft"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_waist_ft}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3 ft_in2">
                    <label htmlFor="tech_waist_in" className="label">
                      &nbsp;
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_waist_in"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_waist_in}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_unit_h2} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inch (in)", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
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
              {(formData.tech_unit_ft_in2 == "m" ||
                formData.tech_unit_ft_in2 == "cm" ||
                formData.tech_unit_ft_in2 == "in" ||
                formData.tech_unit_ft_in2 == "ft") && (
                <>
                  <div className="col-span-12  md:col-span-6 h_cm2">
                    <label htmlFor="tech_waist_cm" className="label">
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                      {formData.tech_unit_ft_in2 == "m" ? (
                        <span className="text-blue height_unit">(m)</span>
                      ) : formData.tech_unit_ft_in2 == "cm" ? (
                        <span className="text-blue height_unit">(cm)</span>
                      ) : formData.tech_unit_ft_in2 == "in" ? (
                        <span className="text-blue height_unit">(in)</span>
                      ) : formData.tech_unit_ft_in2 == "ft" ? (
                        <span className="text-blue height_unit">(ft)</span>
                      ) : null}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_waist_cm"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_waist_cm}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_unit_h_cm2} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inch (in)", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
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
              {formData.tech_gender == "female" && (
                <>
                  <input
                    type="hidden"
                    step="any"
                    name="tech_unit_ft_in3"
                    id="tech_unit_ft_in3"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_unit_ft_in3}
                    onChange={handleChange}
                  />

                  {formData.tech_unit_ft_in3 == "ft/in" && (
                    <>
                      <div className="col-span-6 md:col-span-3 lg:col-span-3  ft_in3">
                        <label htmlFor="tech_hip_ft" className="label">
                          {data?.payload?.tech_lang_keys["9"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_hip_ft"
                            id="tech_hip_ft"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_hip_ft}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-3 lg:col-span-3  ft_in3">
                        <label htmlFor="tech_hip_in" className="label">
                          &nbsp;
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_hip_in"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_hip_in}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown6}
                          >
                            {formData.tech_unit_h3} ▾
                          </label>
                          {dropdownVisible6 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                {
                                  label: "feet / inches (ft/in)",
                                  value: "ft/in",
                                },
                                { label: "feet (ft)", value: "ft" },
                                { label: "inch (in)", value: "in" },
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "meters (m)", value: "m" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler6(unit.value)}
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
                  {(formData.tech_unit_ft_in3 == "m" ||
                    formData.tech_unit_ft_in3 == "cm" ||
                    formData.tech_unit_ft_in3 == "in" ||
                    formData.tech_unit_ft_in3 == "ft") && (
                    <>
                      <div className="col-span-12 md:col-span-6">
                        <label htmlFor="tech_hip_cm" className="label">
                          {data?.payload?.tech_lang_keys["9"]}{" "}
                          {formData.tech_unit_ft_in3 == "m" ? (
                            <span className="text-blue height_unit">(m)</span>
                          ) : formData.tech_unit_ft_in3 == "cm" ? (
                            <span className="text-blue height_unit">(cm)</span>
                          ) : formData.tech_unit_ft_in3 == "in" ? (
                            <span className="text-blue height_unit">(in)</span>
                          ) : formData.tech_unit_ft_in3 == "ft" ? (
                            <span className="text-blue height_unit">(ft)</span>
                          ) : null}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_hip_cm"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_hip_cm}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown7}
                          >
                            {formData.tech_unit_h_cm3} ▾
                          </label>
                          {dropdownVisible7 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                {
                                  label: "feet / inches (ft/in)",
                                  value: "ft/in",
                                },
                                { label: "feet (ft)", value: "ft" },
                                { label: "inch (in)", value: "in" },
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "meters (m)", value: "m" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler7(unit.value)}
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
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue result radius-10 p-3 mt-3">
                      <div className="w-full mt-2">
                        <div className="bg-sky bordered p-3  rounded-lg">
                          <div className="w-full md:w-[60%] lg:w-[60%]  py-2">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-12 md:col-span-5">
                                <p>
                                  <strong>
                                    {data?.payload?.tech_lang_keys["10"]}
                                  </strong>
                                </p>
                                <p>
                                  <strong className="text-[#119154] text-[32px]">
                                    {result?.tech_bodyFat}
                                  </strong>
                                  <span className="text-[#119154] text-[18px]">
                                    {data?.payload?.tech_lang_keys["15"]}
                                  </span>
                                </p>
                              </div>
                              <div className="col-span-2 hidden lg:flex md:flex justify-center">
                                <div className="border w-[2px]"></div>
                              </div>
                              <div className="col-span-12 md:col-span-5 ps-md-4">
                                <p>
                                  <strong>
                                    {data?.payload?.tech_lang_keys["11"]}
                                  </strong>
                                </p>
                                <p>
                                  <strong className="text-[#119154] text-[32px]">
                                    {result?.tech_fatMass}
                                  </strong>
                                  <span className="text-[#119154] text-[18px]">
                                    {data?.payload?.tech_lang_keys["14"]}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full md:w-[60%] lg:w-[60%]  py-2 p-3 mt-2">
                          <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-12 md:col-span-5">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["12"]}
                                </strong>
                              </p>
                              <p>
                                <strong className="text-[#119154] text-[32px]">
                                  {result?.tech_leanMass}
                                </strong>
                                <span className="text-[#119154] text-[18px]">
                                  {data?.payload?.tech_lang_keys["14"]}
                                </span>
                              </p>
                            </div>
                            <div className="col-span-2 hidden lg:flex md:flex justify-center">
                              <div className="border w-[2px]"></div>
                            </div>
                            <div className="col-span-12 md:col-span-5 ps-md-4">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p>
                                <strong className="text-[#119154] text-[32px]">
                                  {result?.tech_bodyFatCategory}
                                </strong>
                              </p>
                            </div>
                          </div>
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

export default NavyBodyFatCalculator;

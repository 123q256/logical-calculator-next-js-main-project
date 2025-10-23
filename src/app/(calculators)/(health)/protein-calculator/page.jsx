"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useProteinCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ProteinCalculator = () => {
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
    tech_age: 24,
    tech_gender: "male",
    tech_height_ft: 5,
    tech_unit_ft_in: "ft/in",
    tech_height_in: 12,
    tech_unit_h: "ft",
    tech_height_cm: 175.26,
    tech_unit_h_cm: "ft/in",
    tech_weight: 175.26,
    tech_weight_unit: "kg",
    tech_activity_level: "extra_active", // sedentary light moderate  very_active  extra_active
    tech_protein_for: "general",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useProteinCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_age || !formData.tech_gender) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_age: formData.tech_age,
        tech_gender: formData.tech_gender,
        tech_height_ft: formData.tech_height_ft,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_height_in: formData.tech_height_in,
        tech_unit_h: formData.tech_unit_h,
        tech_height_cm: formData.tech_height_cm,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
        tech_activity_level: formData.tech_activity_level,
        tech_protein_for: formData.tech_protein_for,
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
      tech_age: 24,
      tech_gender: "male",
      tech_height_ft: 5,
      tech_unit_ft_in: "ft/in",
      tech_height_in: 12,
      tech_unit_h: "ft",
      tech_height_cm: 175.26,
      tech_unit_h_cm: "ft/in",
      tech_weight: 175.26,
      tech_weight_unit: "kg",
      tech_activity_level: "extra_active", // sedentary light moderate  very_active  extra_active
      tech_protein_for: "general",
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
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h: unit,
      tech_unit_ft_in: unit,
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 2
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: unit,
      tech_unit_ft_in: unit,
    }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_age"
                    id="tech_age"
                    className="input "
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_age}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
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
                    <option value="male">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="female">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 flex">
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
                {formData.tech_unit_ft_in == "ft/in" && (
                  <>
                    <div className="w-[50%] ft_in  mt-2 mr-2">
                      <label htmlFor="tech_height_ft" className="label">
                        {data?.payload?.tech_lang_keys["5"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_height_ft"
                          id="tech_height_ft"
                          className="input my-1"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_height_ft}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="w-[50%] ft_in">
                      <label htmlFor="tech_height_in" className="label">
                        &nbsp;
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_height_in"
                          step="any"
                          className="mt-2 input"
                          value={formData.tech_height_in}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-4 top-5"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_unit_h} ▾
                        </label>
                        {dropdownVisible1 && (
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
                {(formData.tech_unit_ft_in == "m" ||
                  formData.tech_unit_ft_in == "cm" ||
                  formData.tech_unit_ft_in == "in" ||
                  formData.tech_unit_ft_in == "ft") && (
                  <>
                    <div className="space-y-2 h_cm  w-full">
                      <label htmlFor="tech_height_cm" className="label">
                        {data?.payload?.tech_lang_keys["5"]}{" "}
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
                      <div className="relative w-full mt-1 ">
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
                          className="absolute cursor-pointer text-sm underline right-4 top-5"
                          onClick={toggleDropdown2}
                        >
                          {formData.tech_unit_h_cm} ▾
                        </label>
                        {dropdownVisible2 && (
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
              <div className="space-y-2 relative">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["6"]} :
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
                    onClick={toggleDropdown}
                  >
                    {formData.tech_weight_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "grams (g)", value: "g" },
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "stone ", value: "stone" },
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
              <div className="space-y-2 relative">
                <label htmlFor="tech_activity_level" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_activity_level"
                    id="tech_activity_level"
                    value={formData.tech_activity_level}
                    onChange={handleChange}
                  >
                    <option value="sedentary">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="light">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="moderate">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="very_active">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="extra_active">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_protein_for" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_protein_for"
                    id="tech_protein_for"
                    value={formData.tech_protein_for}
                    onChange={handleChange}
                  >
                    <option value="general">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="sport">
                      {data?.payload?.tech_lang_keys["18"]}
                    </option>
                  </select>
                </div>
              </div>
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full p-3 mt-3">
                      <div className="w-full ">
                        <div className="w-full  border-b pb-2">
                          <p>
                            <strong>{data?.payload?.tech_lang_keys[31]}</strong>
                          </p>
                          <p className="text-[32px]">
                            <strong className="text-[#119154]">
                              {Math.ceil(result?.tech_calories)}
                            </strong>
                          </p>
                        </div>
                        <div className="w-full  mt-3">
                          <p className="text-[18px] mb-1">
                            <strong className="text-[#2845F5]">
                              {data?.payload?.tech_lang_keys[21]}
                            </strong>
                          </p>
                          {formData?.tech_protein_for == "general" ? (
                            <>
                              <p className="mb-1">
                                {data?.payload?.tech_lang_keys[27]}:{" "}
                                <strong>
                                  {Math.ceil((result?.tech_calories * 0.1) / 4)}{" "}
                                  -{" "}
                                  {Math.ceil((result?.tech_calories * 0.3) / 4)}{" "}
                                  {data?.payload?.tech_lang_keys[32]} (
                                  {Math.ceil(result?.tech_calories * 0.1)} -{" "}
                                  {Math.ceil(result?.tech_calories * 0.3)} kcal)
                                </strong>
                              </p>
                              <p>
                                {data?.payload?.tech_lang_keys[28]}:{" "}
                                <strong>
                                  {Math.ceil(result?.tech_weight_kg * 0.83)}{" "}
                                  {data?.payload?.tech_lang_keys[32]} (
                                  {Math.ceil(result?.tech_weight_kg * 0.83 * 4)}{" "}
                                  kcal)
                                </strong>
                              </p>
                            </>
                          ) : (
                            <>
                              <p>
                                {data?.payload?.tech_lang_keys[22]}:{" "}
                                <strong>
                                  {Math.ceil(result?.tech_weight_kg * 0.8)}{" "}
                                  {data?.payload?.tech_lang_keys[32]}
                                </strong>{" "}
                                ({Math.ceil(result?.tech_weight_kg * 0.8 * 4)}{" "}
                                kcal)
                              </p>
                              <p>
                                {data?.payload?.tech_lang_keys[23]}:{" "}
                                <strong>
                                  {Math.ceil(result?.tech_weight_kg)}{" "}
                                  {data?.payload?.tech_lang_keys[32]}
                                </strong>{" "}
                                ({Math.ceil(result?.tech_weight_kg * 4)} kcal)
                              </p>
                              <p>
                                {data?.payload?.tech_lang_keys[24]}:{" "}
                                <strong>
                                  {Math.ceil(result?.tech_weight_kg * 1.3)}{" "}
                                  {data?.payload?.tech_lang_keys[32]}
                                </strong>{" "}
                                ({Math.ceil(result?.tech_weight_kg * 1.3 * 4)}{" "}
                                kcal)
                              </p>
                              <p>
                                {data?.payload?.tech_lang_keys[25]}:{" "}
                                <strong>
                                  {Math.ceil(result?.tech_weight_kg * 1.6)}{" "}
                                  {data?.payload?.tech_lang_keys[32]}
                                </strong>{" "}
                                ({Math.ceil(result?.tech_weight_kg * 1.6 * 4)}{" "}
                                kcal)
                              </p>
                              <p>
                                {data?.payload?.tech_lang_keys[26]}:{" "}
                                <strong>
                                  {Math.ceil(result?.tech_weight_kg * 2)}{" "}
                                  {data?.payload?.tech_lang_keys[32]}
                                </strong>{" "}
                                ({Math.ceil(result?.tech_weight_kg * 2 * 4)}{" "}
                                kcal)
                              </p>
                              <p>
                                <strong>
                                  ❗ {data?.payload?.tech_lang_keys[30]}
                                </strong>
                              </p>
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

export default ProteinCalculator;

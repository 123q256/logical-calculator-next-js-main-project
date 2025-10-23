"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useCaloriesBurnedBikingCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CaloriesBurnedBikingCalculator = () => {
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
    tech_age: 25,
    tech_operations: "No",
    tech_activity: 4,
    tech_first: 13,
    tech_units1: "mW",
    tech_second: 65,
    tech_units2: "kg",
    tech_height_ft: 5,
    tech_unit_ft_in: "ft/in",
    tech_height_in: 9,
    tech_unit_h: "in",
    tech_height_cm: 175.26,
    tech_unit_h_cm: "ft/in",
    tech_gender: "male",
    tech_met: 4,
    tech_units3: "hrs",
    tech_third: 7,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCaloriesBurnedBikingCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_age ||
      !formData.tech_operations ||
      !formData.tech_activity ||
      !formData.tech_second ||
      !formData.tech_units2 ||
      !formData.tech_gender ||
      !formData.tech_met ||
      !formData.tech_third ||
      !formData.tech_units3
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_age: formData.tech_age,
        tech_operations: formData.tech_operations,
        tech_activity: formData.tech_activity,
        tech_first: formData.tech_first,
        tech_units1: formData.tech_units1,
        tech_second: formData.tech_second,
        tech_units2: formData.tech_units2,
        tech_height_ft: formData.tech_height_ft,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_height_in: formData.tech_height_in,
        tech_unit_h: formData.tech_unit_h,
        tech_height_cm: formData.tech_height_cm,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_gender: formData.tech_gender,
        tech_met: formData.tech_met,
        tech_units3: formData.tech_units3,
        tech_third: formData.tech_third,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_age: 25,
      tech_operations: "No",
      tech_activity: 12,
      tech_first: 13,
      tech_units1: "mW",
      tech_second: 65,
      tech_units2: "lbs",
      tech_height_ft: 5,
      tech_unit_ft_in: "ft/in",
      tech_height_in: 9,
      tech_unit_h: "in",
      tech_height_cm: 175.26,
      tech_unit_h_cm: "ft/in",
      tech_gender: "female",
      tech_met: 12,
      tech_units3: "sec",
      tech_third: null,
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
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units2: unit }));
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
      tech_unit_h: unit,
      tech_unit_ft_in: unit,
    }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states 3
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: unit,
      tech_unit_ft_in: unit,
    }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units3: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
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
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["23"]}:
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
                    min="1"
                    value={formData.tech_age}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_operations" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="">
                  <select
                    className="input mt-2"
                    aria-label="select"
                    name="tech_operations"
                    id="tech_operations"
                    value={formData.tech_operations}
                    onChange={handleChange}
                  >
                    <option value="Yes">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="No">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 drop_down">
                <label htmlFor="tech_activity" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="">
                  <select
                    className="input mt-2"
                    aria-label="select"
                    name="tech_activity"
                    id="tech_activity"
                    value={formData.tech_activity}
                    onChange={handleChange}
                  >
                    <option value="8.5">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="8">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="10">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="12">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="16">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                  </select>
                </div>
              </div>

              <div
                className="col-span-12 md:col-span-6 lg:col-span-6 hidden"
                id="f1"
              >
                <label htmlFor="tech_first" className="label">
                  {data?.payload?.tech_lang_keys["14"]}
                </label>
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
                    className="absolute cursor-pointer text-sm underline right-6 top-3"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_units1} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "megawatt (mW)", value: "mW" },
                        { label: "watt (W)", value: "W" },
                        { label: "kilowatt (kW)", value: "kW" },
                        {
                          label: "british thermal units per hour (BTU/h)",
                          value: "BTU/h",
                        },
                        { label: "horsepower hp(l)", value: "hp(l)" },
                        {
                          label: "kilocalories per minute (kcal/min)",
                          value: "kcal/min",
                        },
                        {
                          label: "kilocalories per hour (kcal/h)",
                          value: "kcal/h",
                        },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6" id="f2">
                <label htmlFor="tech_second" className="label">
                  {data?.payload?.tech_lang_keys["15"]}
                </label>
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
                    className="absolute cursor-pointer text-sm underline right-6 top-3"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_units2} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "stone", value: "stone" },
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
                  <div className="col-span-6 md:col-span-3 lg:col-span-3 ft_in">
                    <label htmlFor="tech_height_ft" className="label">
                      {data?.payload?.tech_lang_keys["24"]}:
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
                  <div className="col-span-6 md:col-span-3 lg:col-span-3 ft_in">
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
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_unit_h} ▾
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
              {(formData.tech_unit_ft_in == "m" ||
                formData.tech_unit_ft_in == "cm" ||
                formData.tech_unit_ft_in == "in" ||
                formData.tech_unit_ft_in == "ft") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  h_cm">
                    <label htmlFor="tech_height_cm" className="label">
                      {data?.payload?.tech_lang_keys["24"]}{" "}
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
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_unit_h_cm} ▾
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

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["25"]}:
                </label>
                <div className="">
                  <select
                    className="input mt-2"
                    aria-label="select"
                    name="tech_gender"
                    id="tech_gender"
                    value={formData.tech_gender}
                    onChange={handleChange}
                  >
                    <option value="male">
                      {data?.payload?.tech_lang_keys["26"]}
                    </option>
                    <option value="female">
                      {data?.payload?.tech_lang_keys["27"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_met" className="label">
                  MET:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_met"
                    id="tech_met"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_met}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6" id="f3">
                <label htmlFor="tech_third" className="label">
                  {data?.payload?.tech_lang_keys["16"]}
                </label>
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
                    className="absolute cursor-pointer text-sm underline right-6 top-3"
                    onClick={toggleDropdown4}
                  >
                    {formData.tech_units3} ▾
                  </label>
                  {dropdownVisible4 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "seconds (sec)", value: "sec" },
                        { label: "minutes (min)", value: "min" },
                        { label: "hours (hrs)", value: "hrs" },
                        { label: "days", value: "days" },
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
              <div className="col-span-12">
                <span>{data?.payload?.tech_lang_keys[19]}:</span>
                <span>
                  <a
                    className="text-[#2845F5] px-1 text-[14px] text-decoration-none"
                    href="weightloss-calculator"
                    target="_blank"
                    rel="noopener"
                  >
                    {data?.payload?.tech_lang_keys[20]}
                  </a>
                </span>
                ,
                <span>
                  <a
                    className="text-[#2845F5] text-[14px] text-decoration-none"
                    href="calorie-deficit-calculator"
                    target="_blank"
                    rel="noopener"
                  >
                    {data?.payload?.tech_lang_keys[21]}
                  </a>
                </span>
                ,
                <span>
                  <a
                    className="text-[#2845F5] text-[14px] text-decoration-none"
                    href="bmr-calculator"
                    target="_blank"
                    rel="noopener"
                  >
                    {data?.payload?.tech_lang_keys[22]}
                  </a>
                </span>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg p-3">
                              <strong>
                                {data?.payload?.tech_lang_keys[17]} ={" "}
                                <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                  {Number(result?.tech_calories).toFixed(2)}
                                </span>{" "}
                                kcal
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg p-3">
                              <strong>
                                {data?.payload?.tech_lang_keys[18]} ={" "}
                                <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                  {Number(result?.tech_w_loss).toFixed(2)}
                                </span>{" "}
                                kg
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg p-3">
                              <strong>
                                BMR ={" "}
                                <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                  {result?.tech_bmr_ans}
                                </span>{" "}
                                kcal/day
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="bg-sky bordered rounded-lg p-3">
                              <strong>
                                {data?.payload?.tech_lang_keys[28]} ={" "}
                                <span className="text-[#119154] lg:text-[28px] md:text-[28px] text-[24px]">
                                  {result?.tech_exercise}
                                </span>{" "}
                                Mets
                              </strong>
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

export default CaloriesBurnedBikingCalculator;

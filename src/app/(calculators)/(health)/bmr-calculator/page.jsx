"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBmrCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BMRCalculator = () => {
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
    tech_age: 44,
    tech_weight: 94,
    tech_height_ft: 5,
    tech_height_in: 9,
    tech_height_cm: "9",
    tech_unit: "lbs",
    tech_unit_h: "ft/in",
    tech_unit_ft_in: "ft/in",
    tech_unit_h_cm: "ft/in",
    tech_activity: "1.375", // 1.2  1.375  1.55  1.725  1.9
    tech_gender: "Male", // Male  Female
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBmrCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_age ||
      !formData.tech_gender ||
      !formData.tech_height_cm ||
      !formData.tech_unit_h_cm ||
      !formData.tech_activity
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_age: formData.tech_age,
        tech_weight: formData.tech_weight,
        tech_height_ft: formData.tech_height_ft,
        tech_height_in: formData.tech_height_in,
        tech_height_cm: formData.tech_height_cm,
        tech_unit: formData.tech_unit,
        tech_unit_h: formData.tech_unit_h,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_activity: formData.tech_activity,
        tech_gender: formData.tech_gender,
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
      tech_age: 44,
      tech_weight: 94,
      tech_height_ft: 5,
      tech_height_in: 9,
      tech_height_cm: "9",
      tech_unit: "lbs",
      tech_unit_h: "ft/in",
      tech_unit_ft_in: "ft/in",
      tech_unit_h_cm: "ft/in",
      tech_activity: "1.375", // 1.2  1.375  1.55  1.725  1.9
      tech_gender: "Male", // Male  Female
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
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
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
                  {data?.payload?.tech_lang_keys["age_year"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_age"
                    id="tech_age"
                    className="input mt-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_age}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["gender"]}:
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
                    <option value="Male">
                      {data?.payload?.tech_lang_keys["male"]}
                    </option>
                    <option value="Female">
                      {data?.payload?.tech_lang_keys["female"]}
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
                        {data?.payload?.tech_lang_keys["height"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_height_ft"
                          id="tech_height_ft"
                          className="input"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_height_ft}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
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
                              { label: "centimeters (cm)", value: "cm" },
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
                {formData.tech_unit_ft_in == "cm" && (
                  <>
                    <div className="space-y-2 h_cm  w-full">
                      <label htmlFor="tech_height_cm" className="label">
                        {data?.payload?.tech_lang_keys["height"]} (cm):
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
                              { label: "centimeters (cm)", value: "cm" },
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
                <label htmlFor="tech_height_cm" className="label">
                  {data?.payload?.tech_lang_keys["height"]} (cm):
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
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "kilograms (kg)", value: "kg" },
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
                <label htmlFor="tech_activity" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_activity"
                    id="tech_activity"
                    value={formData.tech_activity}
                    onChange={handleChange}
                  >
                    <option value="1.2">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="1.375">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="1.55">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="1.725">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="1.9">
                      {data?.payload?.tech_lang_keys["14"]}
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
                    <div className="w-full rounded-lg mt-3">
                      <div className="w-full mt-2">
                        <div className="flex justify-center">
                          <div className="lg:w-10/12">
                            <div className="flex flex-col lg:flex-row  text-center bordered bg-sky rounded-lg p-3">
                              <div className="lg:w-7/12 lg:border-r border-b-2 lg:border-b-0 pb-3 lg:pb-0">
                                <div className="lg:text-[16px] md:text-[16px] text-[14px] mb-2">
                                  {data?.payload?.tech_lang_keys["bmr"]}
                                </div>
                                <strong className="text-[#119154] text-[25px] md:text-[32px]">
                                  {result?.tech_BMR}
                                </strong>
                                <sub className=" text-lg">
                                  {
                                    data?.payload?.tech_lang_keys[
                                      "Calories/Day"
                                    ]
                                  }
                                </sub>
                              </div>
                              <div className="lg:w-5/12 lg:pl-4 mt-3 lg:mt-0">
                                <div className="lg:text-[16px] md:text-[16px] text-[14px]">
                                  {data?.payload?.tech_lang_keys["17"]}
                                </div>
                                <strong className="text-[#119154] text-[25px] md:text-[32px]">
                                  {Number(
                                    result?.tech_BMR * formData?.tech_activity
                                  ).toFixed(2)}
                                </strong>
                                <sub className=" text-lg">kcal</sub>
                              </div>
                            </div>

                            <div className="w-full overflow-auto mt-4">
                              <table
                                className="w-full lg:w-12/12 mx-auto"
                                cellSpacing="0"
                              >
                                <thead>
                                  <tr>
                                    <th className="text-left border-b py-2">
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </th>
                                    <th className="text-left border-b py-2">
                                      {data?.payload?.tech_lang_keys["17"]}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    className={
                                      formData?.tech_activity === "1.2"
                                        ? "bg-[#2845F5]  text-white"
                                        : ""
                                    }
                                  >
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_BMR * 1.2).toFixed(
                                        2
                                      )}{" "}
                                      kcal
                                    </td>
                                  </tr>
                                  <tr
                                    className={
                                      formData?.tech_activity === "1.375"
                                        ? "bg-[#2845F5]  text-white"
                                        : ""
                                    }
                                  >
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["11"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_BMR * 1.375).toFixed(
                                        2
                                      )}{" "}
                                      kcal
                                    </td>
                                  </tr>
                                  <tr
                                    className={
                                      formData?.tech_activity === "1.55"
                                        ? "bg-[#2845F5]  text-white"
                                        : ""
                                    }
                                  >
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["12"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_BMR * 1.55).toFixed(
                                        2
                                      )}{" "}
                                      kcal
                                    </td>
                                  </tr>
                                  <tr
                                    className={
                                      formData?.tech_activity === "1.725"
                                        ? "bg-[#2845F5]  text-white"
                                        : ""
                                    }
                                  >
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["13"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_BMR * 1.725).toFixed(
                                        2
                                      )}{" "}
                                      kcal
                                    </td>
                                  </tr>
                                  <tr
                                    className={
                                      formData?.tech_activity === "1.9"
                                        ? "bg-[#2845F5]  text-white"
                                        : ""
                                    }
                                  >
                                    <td className="py-2">
                                      {data?.payload?.tech_lang_keys["14"]}
                                    </td>
                                    <td className="py-2">
                                      {Number(result?.tech_BMR * 1.9).toFixed(
                                        2
                                      )}{" "}
                                      kcal
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="w-full overflow-auto mt-4">
                              <table className="w-full mx-auto" cellSpacing="0">
                                <thead>
                                  <tr>
                                    <th className=" text-left border-b py-2">
                                      {data?.payload?.tech_lang_keys["15"]}
                                    </th>
                                    <th className=" text-left border-b py-2">
                                      {data?.payload?.tech_lang_keys["16"]}
                                    </th>
                                    <th className=" text-left border-b py-2">
                                      {data?.payload?.tech_lang_keys["17"]}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      Revised Harris-Benedict
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_hbmr} kcal
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_hbmr *
                                          formData?.tech_activity
                                      ).toFixed(2)}{" "}
                                      kcal
                                    </td>
                                  </tr>
                                  <tr className="bg-[#2845F5]  text-white">
                                    <td className="border-b py-2">
                                      Mifflin St Jeor
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_BMR} kcal
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_BMR *
                                          formData?.tech_activity
                                      ).toFixed(2)}{" "}
                                      kcal
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">Schofield</td>
                                    <td className="border-b py-2">
                                      {result?.tech_sbmr} kcal
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_sbmr *
                                          formData?.tech_activity
                                      ).toFixed(2)}{" "}
                                      kcal
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
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

export default BMRCalculator;

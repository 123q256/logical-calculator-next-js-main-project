"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useFuelCostCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FuelCostCalculator = () => {
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
    tech_distance: "12",
    tech_d_units: "mi",
    tech_f_efficiency: "12",
    tech_f_eff_units: "UK mpg",
    tech_f_price: "12",
    tech_f_p_units: "/US gal",
    tech_currancy: "$",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFuelCostCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_distance ||
      !formData.tech_d_units ||
      !formData.tech_f_efficiency ||
      !formData.tech_f_eff_units ||
      !formData.tech_f_price ||
      !formData.tech_f_p_units
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_distance: formData.tech_distance,
        tech_d_units: formData.tech_d_units,
        tech_f_efficiency: formData.tech_f_efficiency,
        tech_f_eff_units: formData.tech_f_eff_units,
        tech_f_price: formData.tech_f_price,
        tech_f_p_units: formData.tech_f_p_units,
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
      tech_distance: "12",
      tech_d_units: "mi",
      tech_f_efficiency: "12",
      tech_f_eff_units: "UK mpg",
      tech_f_price: "12",
      tech_f_p_units: "/US gal",
      tech_currancy: "$",
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
    setFormData((prev) => ({ ...prev, tech_d_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_f_eff_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 2
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_f_p_units: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_distance" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_distance"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_distance}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_d_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "km", value: "km" },
                        { label: "mi", value: "mi" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_f_efficiency" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_f_efficiency"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_f_efficiency}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_f_eff_units} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "L/100km", value: "L/100km" },
                        { label: "US mpg", value: "US mpg" },
                        { label: "UK mpg", value: "UK mpg" },
                        { label: "kmpl", value: "kmpl" },
                        { label: "liters per mile", value: "lpm" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_f_price" className="label">
                  {data?.payload?.tech_lang_keys["8"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_f_price"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_f_price}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_f_p_units} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: currency.symbol + "/cl",
                          value: currency.symbol + "/cl",
                        },
                        {
                          label: currency.symbol + "/liter",
                          value: currency.symbol + "/liter",
                        },
                        {
                          label: currency.symbol + "/US gal",
                          value: currency.symbol + "/US gal",
                        },
                        {
                          label: currency.symbol + "/UK gal",
                          value: currency.symbol + "/UK gal",
                        },
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
                <input
                  type="hidden"
                  step="any"
                  name="tech_currancy"
                  id="tech_currancy"
                  className="input my-2"
                  aria-label="input"
                  value={currency.symbol}
                />
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[60%] lg:w-[60%]  text-[18px] overflow-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["9"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_fuel).toFixed(2)}{" "}
                                  {data?.payload?.tech_lang_keys["10"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["11"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol}{" "}
                                  {Number(result?.tech_trip_cost).toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="text-[18px] mb-3 mt-4">
                            <strong>
                              {data?.payload?.tech_lang_keys["12"]}
                            </strong>
                          </p>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["9"]} (
                                  {data?.payload?.tech_lang_keys["13"]}) :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_fuel * 0.26417).toFixed(
                                    2
                                  )}{" "}
                                  {data?.payload?.tech_lang_keys["14"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["9"]} (
                                  {data?.payload?.tech_lang_keys["15"]}) :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_fuel * 0.21997).toFixed(
                                    2
                                  )}{" "}
                                  {data?.payload?.tech_lang_keys["14"]}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full mt-3 text-[18px]">
                          {result?.tech_f_eff_units == "L/100km" ? (
                            <>
                              <p className="mt-2">
                                if 40 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (100 / 40)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (100 / 40)) * 0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {(result?.tech_distance / (100 / 40)) *
                                  result?.tech_f_price}
                                .
                              </p>
                              <p className="mt-2">
                                if 30 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (100 / 30)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (100 / 30)) * 0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {(result?.tech_distance / (100 / 30)) *
                                  result?.tech_f_price}
                              </p>
                              <p className="mt-2">
                                if 20 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (100 / 20)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (100 / 20)) * 0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {(result?.tech_distance / (100 / 20)) *
                                  result?.tech_f_price}
                              </p>
                              <p className="mt-2">
                                if 10 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (100 / 10)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (100 / 10)) * 0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {(result?.tech_distance / (100 / 10)) *
                                  result?.tech_f_price}
                              </p>
                              <p className="mt-2">
                                if 5 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (100 / 5)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (100 / 5)) * 0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {(result?.tech_distance / (100 / 5)) *
                                  result?.tech_f_price}
                              </p>
                              <p className="mt-2">
                                if 3 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (100 / 3)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (100 / 3)) * 0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {(result?.tech_distance / (100 / 3)) *
                                  result?.tech_f_price}
                              </p>
                              <p className="mt-2">
                                if 2 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (100 / 2)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (100 / 2)) * 0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {(result?.tech_distance / (100 / 2)) *
                                  result?.tech_f_price}
                              </p>
                            </>
                          ) : result?.tech_f_eff_units == "US mpg" ? (
                            <>
                              <p className="mt-2">
                                if 5 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (5 * 0.425144)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (5 * 0.425144)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (5 * 0.425144)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 10 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (10 * 0.425144)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (10 * 0.425144)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (10 * 0.425144)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 20 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (20 * 0.425144)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (20 * 0.425144)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (20 * 0.425144)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 30 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (30 * 0.425144)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (30 * 0.425144)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (30 * 0.425144)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 40 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (40 * 0.425144)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (40 * 0.425144)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (40 * 0.425144)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 50 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (50 * 0.425144)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (50 * 0.425144)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (50 * 0.425144)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 60 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (60 * 0.425144)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (60 * 0.425144)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (60 * 0.425144)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                            </>
                          ) : result?.tech_f_eff_units == "UK mpg" ? (
                            <>
                              <p className="mt-2">
                                if 5 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (5 * 0.354006)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (5 * 0.354006)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (5 * 0.354006)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 10 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (10 * 0.354006)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (5 * 0.354006)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (10 * 0.354006)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 20 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (20 * 0.354006)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (5 * 0.354006)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (20 * 0.354006)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 30 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (30 * 0.354006)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (5 * 0.354006)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (30 * 0.354006)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 40 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (40 * 0.354006)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (5 * 0.354006)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (40 * 0.354006)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 50 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (50 * 0.354006)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (5 * 0.354006)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (50 * 0.354006)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 60 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / (60 * 0.354006)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / (5 * 0.354006)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / (60 * 0.354006)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                            </>
                          ) : result?.tech_f_eff_units == "kmpl" ? (
                            <>
                              <p className="mt-2">
                                if 3 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(result?.tech_distance / 3, 1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / 3) * 0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / 3) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 5 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(result?.tech_distance / 5).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / 5) * 0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / 5) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 10 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(result?.tech_distance / 10).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / 10) * 0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / 10) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 20 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(result?.tech_distance / 20).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / 20) * 0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / 20) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 30 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(result?.tech_distance / 30).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / 30) * 0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / 30) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 50 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(result?.tech_distance / 50).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / 50) * 0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / 50) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                            </>
                          ) : result?.tech_f_eff_units == "lpm" ? (
                            <>
                              <p className="mt-2">
                                if 1 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / ((1 / 1) * 1.6093),
                                  1
                                )}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance / ((1 / 1) * 1.6093)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance / ((1 / 1) * 1.6093)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 0.5 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / ((1 / 0.5) * 1.6093)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance /
                                    ((1 / 0.5) * 1.6093)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance /
                                    ((1 / 0.5) * 1.6093)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 0.2 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / ((1 / 0.2) * 1.6093)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance /
                                    ((1 / 0.2) * 1.6093)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance /
                                    ((1 / 0.2) * 1.6093)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 0.1 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / ((1 / 0.1) * 1.6093)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance /
                                    ((1 / 0.1) * 1.6093)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance /
                                    ((1 / 0.1) * 1.6093)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 0.08 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / ((1 / 0.08) * 1.6093)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance /
                                    ((1 / 0.08) * 1.6093)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance /
                                    ((1 / 0.08) * 1.6093)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                              <p className="mt-2">
                                if 0.05 {result?.tech_f_eff_units},{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {Number(
                                  result?.tech_distance / ((1 / 0.05) * 1.6093)
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["17"]} /{" "}
                                {Number(
                                  (result?.tech_distance /
                                    ((1 / 0.05) * 1.6093)) *
                                    0.26417
                                ).toFixed(1)}{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <i>{currency.symbol}</i>{" "}
                                {Number(
                                  (result?.tech_distance /
                                    ((1 / 0.05) * 1.6093)) *
                                    result?.tech_f_price
                                ).toFixed(2)}
                              </p>
                            </>
                          ) : null}
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

export default FuelCostCalculator;

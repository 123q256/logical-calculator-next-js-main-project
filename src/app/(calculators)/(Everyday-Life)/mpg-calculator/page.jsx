"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useMpgCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MpgCalculator = () => {
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
    tech_type: "second", //  second  first
    tech_operations: "3",
    tech_first: "23",
    tech_units1: "km",
    tech_second: "8",
    tech_units2: "liters",
    tech_third: "3",
    tech_units3: "L/100km",
    tech_four: "3",
    tech_units4: "US gal",
    tech_ad_first: "2105",
    tech_ad_second: "2251",
    tech_ad_third: "4",
    tech_ad_units3: "US gal",
    tech_ad_four: "6",
    tech_ad_units4: "US gal",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMpgCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_type == 1) {
      if (!formData.tech_type || !formData.tech_operations) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_type ||
        !formData.tech_ad_first ||
        !formData.tech_ad_second ||
        !formData.tech_ad_third ||
        !formData.tech_ad_four
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_operations: formData.tech_operations,
        tech_first: formData.tech_first,
        tech_units1: formData.tech_units1,
        tech_second: formData.tech_second,
        tech_units2: formData.tech_units2,
        tech_third: formData.tech_third,
        tech_units3: formData.tech_units3,
        tech_four: formData.tech_four,
        tech_units4: formData.tech_units4,
        tech_ad_first: formData.tech_ad_first,
        tech_ad_second: formData.tech_ad_second,
        tech_ad_third: formData.tech_ad_third,
        tech_ad_units3: formData.tech_ad_units3,
        tech_ad_four: formData.tech_ad_four,
        tech_ad_units4: formData.tech_ad_units4,
        tech_submit: formData.tech_submit,
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
      tech_type: "second", //  second  first
      tech_operations: "3",
      tech_first: "23",
      tech_units1: "km",
      tech_second: "8",
      tech_units2: "liters",
      tech_third: "3",
      tech_units3: "L/100km",
      tech_four: "3",
      tech_units4: "US gal",
      tech_ad_first: "2105",
      tech_ad_second: "2251",
      tech_ad_third: "4",
      tech_ad_units3: "US gal",
      tech_ad_four: "6",
      tech_ad_units4: "US gal",
      tech_submit: "calculate",
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
    setFormData((prev) => ({ ...prev, tech_units3: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states 3
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units4: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };
  //dropdown states 5
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ad_units3: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };
  //dropdown states 6
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ad_units4: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
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
            <div className="col-12 col-lg-9 mx-auto mt-2 w-full">
              <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
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
                        formData.tech_type === "first" ? "tagsUnit" : ""
                      }`}
                      id="first"
                      onClick={() => {
                        setFormData({ ...formData, tech_type: "first" });
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
                        formData.tech_type === "second" ? "tagsUnit" : ""
                      }`}
                      id="second"
                      onClick={() => {
                        setFormData({ ...formData, tech_type: "second" });
                        setResult(null);
                        setFormError(null);
                      }}
                    >
                      {data?.payload?.tech_lang_keys["2"]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <input
              type="hidden"
              step="any"
              name="tech_currency"
              id="tech_currency"
              className="input my-2"
              aria-label="input"
              value={currency.symbol}
            />
            <div className="grid grid-cols-12 mt-3  gap-4">
              {formData.tech_type == "first" && (
                <>
                  <div className="col-span-12 simple mt-2 ">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                        <label htmlFor="tech_operations" className="label">
                          {data?.payload?.tech_lang_keys["3"]}:
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
                              {data?.payload?.tech_lang_keys["4"]}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["5"]}
                            </option>
                            <option value="3">
                              {data?.payload?.tech_lang_keys["6"]}
                            </option>
                          </select>
                        </div>
                      </div>
                      {(formData.tech_operations == "2" ||
                        formData.tech_operations == "3") && (
                        <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                          <label htmlFor="tech_first" className="label">
                            {data?.payload?.tech_lang_keys["4"]} :
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
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown}
                            >
                              {formData.tech_units1} ▾
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
                      )}
                      {(formData.tech_operations == "1" ||
                        formData.tech_operations == "3") && (
                        <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                          <label htmlFor="tech_second" className="label">
                            {data?.payload?.tech_lang_keys["5"]} :
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
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown1}
                            >
                              {formData.tech_units2} ▾
                            </label>
                            {dropdownVisible1 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "liters", value: "liters" },
                                  { label: "US gal", value: "US gal" },
                                  { label: "UK ga", value: "UK ga" },
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
                      )}
                      {(formData.tech_operations == "1" ||
                        formData.tech_operations == "2") && (
                        <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                          <label htmlFor="tech_third" className="label">
                            {data?.payload?.tech_lang_keys["5"]} :
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
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown2}
                            >
                              {formData.tech_units3} ▾
                            </label>
                            {dropdownVisible2 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "L/100km", value: "L/100km" },
                                  { label: "US mpg", value: "US mpg" },
                                  { label: "UK mpg", value: "UK mpg" },
                                  { label: "kmpl", value: "kmpl" },
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
                      )}

                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_four" className="label">
                          {data?.payload?.tech_lang_keys["8"]} (
                          {data?.payload?.tech_lang_keys["9"]}) :
                        </label>
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
                            {formData.tech_units4} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                {
                                  label: currency.symbol + " liters",
                                  value: "liters",
                                },
                                {
                                  label: currency.symbol + " US gal",
                                  value: "US gal",
                                },
                                {
                                  label: currency.symbol + " UK gal",
                                  value: "UK gal",
                                },
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
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type == "second" && (
                <>
                  <div className=" col-span-12 advance mt-2">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                        <label htmlFor="tech_ad_first" className="label">
                          {data?.payload?.tech_lang_keys["11"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_ad_first"
                            id="tech_ad_first"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ad_first}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_ad_second" className="label">
                          {data?.payload?.tech_lang_keys["12"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_ad_second"
                            id="tech_ad_second"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ad_second}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_ad_third" className="label">
                          {data?.payload?.tech_lang_keys["5"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_ad_third"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_ad_third}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown5}
                          >
                            {formData.tech_ad_units3} ▾
                          </label>
                          {dropdownVisible5 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                {
                                  label: currency.symbol + " liters",
                                  value: "liters",
                                },
                                {
                                  label: currency.symbol + " US gal",
                                  value: "US gal",
                                },
                                {
                                  label: currency.symbol + " UK gal",
                                  value: "UK gal",
                                },
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
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_ad_four" className="label">
                          {data?.payload?.tech_lang_keys["8"]} ({" "}
                          {data?.payload?.tech_lang_keys["9"]})
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_ad_four"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_ad_four}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown6}
                          >
                            {formData.tech_ad_units4} ▾
                          </label>
                          {dropdownVisible6 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                {
                                  label: currency.symbol + " liters",
                                  value: "liters",
                                },
                                {
                                  label: currency.symbol + " US gal",
                                  value: "US gal",
                                },
                                {
                                  label: currency.symbol + " UK gal",
                                  value: "UK gal",
                                },
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
                    </div>
                  </div>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto lg:text-[18px] md:text-[18px] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              {formData?.tech_type == "first" ? (
                                <>
                                  {formData?.tech_operations == "1" && (
                                    <>
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {data?.payload?.tech_lang_keys[4]}{" "}
                                            <span>(miles)</span> :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          {Number(result?.tech_jawab).toFixed(
                                            3
                                          )}{" "}
                                          <span>(mi)</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {data?.payload?.tech_lang_keys[4]}{" "}
                                            <span>
                                              (
                                              {
                                                data?.payload
                                                  ?.tech_lang_keys[13]
                                              }
                                              )
                                            </span>{" "}
                                            :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          {Number(
                                            1.609344 * result?.tech_jawab
                                          ).toFixed(3)}{" "}
                                          <span>(km)</span>
                                        </td>
                                      </tr>
                                      {result?.tech_cost && (
                                        <tr>
                                          <td className="border-b py-2">
                                            <strong>
                                              {
                                                data?.payload
                                                  ?.tech_lang_keys[14]
                                              }{" "}
                                              :
                                            </strong>
                                          </td>
                                          <td className="border-b py-2">
                                            {currency.symbol}{" "}
                                            {result?.tech_cost}
                                          </td>
                                        </tr>
                                      )}
                                    </>
                                  )}
                                  {formData?.tech_operations == "2" && (
                                    <>
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {data?.payload?.tech_lang_keys[5]} :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          {Number(result?.tech_jawab).toFixed(
                                            3
                                          )}{" "}
                                          (US gal)
                                        </td>
                                      </tr>
                                      {result?.tech_cost && (
                                        <tr>
                                          <td className="border-b py-2">
                                            <strong>
                                              {
                                                data?.payload
                                                  ?.tech_lang_keys[14]
                                              }{" "}
                                              :
                                            </strong>
                                          </td>
                                          <td className="border-b py-2">
                                            {currency.symbol}{" "}
                                            {result?.tech_cost}
                                          </td>
                                        </tr>
                                      )}
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {data?.payload?.tech_lang_keys[7]}{" "}
                                            <span>
                                              (
                                              {
                                                data?.payload
                                                  ?.tech_lang_keys[13]
                                              }
                                              )
                                            </span>{" "}
                                            :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          {Number(
                                            3.78541 * result?.tech_jawab
                                          ).toFixed(3)}{" "}
                                          ({data?.payload?.tech_lang_keys[7]})
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {data?.payload?.tech_lang_keys[15]}{" "}
                                            <span>
                                              (
                                              {
                                                data?.payload
                                                  ?.tech_lang_keys[13]
                                              }
                                              )
                                            </span>{" "}
                                            :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          {Number(
                                            result?.tech_jawab / 1.201
                                          ).toFixed(3)}{" "}
                                          (UK gal)
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                  {formData?.tech_operations == "3" && (
                                    <>
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {data?.payload?.tech_lang_keys[6]} :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          {Number(result?.tech_jawab).toFixed(
                                            3
                                          )}{" "}
                                          (US mpg)
                                        </td>
                                      </tr>
                                      {result?.tech_cost && (
                                        <tr>
                                          <td className="border-b py-2">
                                            <strong>
                                              {
                                                data?.payload
                                                  ?.tech_lang_keys[14]
                                              }{" "}
                                              :
                                            </strong>
                                          </td>
                                          <td className="border-b py-2">
                                            {currency.symbol}{" "}
                                            {result?.tech_cost}
                                          </td>
                                        </tr>
                                      )}
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {data?.payload?.tech_lang_keys[16]}{" "}
                                            100{" "}
                                            {data?.payload?.tech_lang_keys[13]}{" "}
                                            :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          {Number(
                                            result?.tech_jawab / 1.201
                                          ).toFixed(3)}{" "}
                                          (L/100km)
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {data?.payload?.tech_lang_keys[18]}{" "}
                                            (US) :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          {Number(
                                            235.215 / result?.tech_jawab
                                          ).toFixed(3)}{" "}
                                          (US mpg)
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {data?.payload?.tech_lang_keys[18]}{" "}
                                            (UK) :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          {Number(
                                            1.2 * result?.tech_jawab
                                          ).toFixed(3)}{" "}
                                          (UK mpg)
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {data?.payload?.tech_lang_keys[17]}{" "}
                                            (UK) :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          {Number(
                                            0.425144 * result?.tech_jawab
                                          ).toFixed(3)}{" "}
                                          (kmpl)
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                </>
                              ) : formData?.tech_type == "second" ? (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_distance} (
                                      {data?.payload?.tech_lang_keys[19]})
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[6]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_mi_jawab).toFixed(3)}{" "}
                                      (US mpg)
                                    </td>
                                  </tr>
                                  {result?.tech_ad_cost && (
                                    <tr>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[14]} :
                                        </strong>
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol} {result?.tech_ad_cost}
                                      </td>
                                    </tr>
                                  )}
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[16]} 100{" "}
                                        {data?.payload?.tech_lang_keys[13]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        235.215 / result?.tech_mi_jawab
                                      ).toFixed(3)}{" "}
                                      (L/100km)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[18]} (US)
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_mi_jawab).toFixed(3)}{" "}
                                      (US mpg)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[18]} (UK)
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        1.2 * result?.tech_mi_jawab
                                      ).toFixed(3)}{" "}
                                      (UK mpg)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[17]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        0.425144 * result?.tech_mi_jawab
                                      ).toFixed(3)}{" "}
                                      (kmpl)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_km_dis).toFixed(3)}{" "}
                                      (km)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[6]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_km_jawab).toFixed(3)}{" "}
                                      (US mpg)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[16]} 100{" "}
                                        {data?.payload?.tech_lang_keys[13]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        235.215 / result?.tech_km_jawab
                                      ).toFixed(3)}{" "}
                                      (L/100km)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[18]} (US)
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_km_jawab).toFixed(3)}{" "}
                                      (US mpg)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[18]} (UK)
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        1.2 * result?.tech_km_jawab
                                      ).toFixed(3)}{" "}
                                      (UK mpg)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[17]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        0.425144 * result?.tech_km_jawab
                                      ).toFixed(3)}{" "}
                                      (kmpl)
                                    </td>
                                  </tr>
                                </>
                              ) : null}
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

export default MpgCalculator;

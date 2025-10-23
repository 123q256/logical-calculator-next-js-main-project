"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useGasCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GasCalculator = () => {
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
    tech_type: "second", // second  first
    tech_trip_type: "1",
    tech_distance: "250",
    tech_distance_unit: "km",
    tech_week_day: "5",
    tech_price: "250",
    tech_price_unit: "liter",
    tech_peoples: "4",
    tech_name_v1: "Toyota Grande",
    tech_fule_effi_v1: "250",
    tech_fule_effi_v1_unit: "kmpl",
    tech_name_v2: "Honda Civic",
    tech_fule_effi_v2: "250",
    tech_fule_effi_v2_unit: "kmpl",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGasCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type || !formData.tech_trip_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_trip_type: formData.tech_trip_type,
        tech_distance: formData.tech_distance,
        tech_distance_unit: formData.tech_distance_unit,
        tech_week_day: formData.tech_week_day,
        tech_price: formData.tech_price,
        tech_price_unit: formData.tech_price_unit,
        tech_peoples: formData.tech_peoples,
        tech_name_v1: formData.tech_name_v1,
        tech_fule_effi_v1: formData.tech_fule_effi_v1,
        tech_fule_effi_v1_unit: formData.tech_fule_effi_v1_unit,
        tech_name_v2: formData.tech_name_v2,
        tech_fule_effi_v2: formData.tech_fule_effi_v2,
        tech_fule_effi_v2_unit: formData.tech_fule_effi_v2_unit,
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
      tech_type: "second", // second  first
      tech_trip_type: "1",
      tech_distance: "250",
      tech_distance_unit: "km",
      tech_week_day: "5",
      tech_price: "250",
      tech_price_unit: "liter",
      tech_peoples: "4",
      tech_name_v1: "Toyota Grande",
      tech_fule_effi_v1: "250",
      tech_fule_effi_v1_unit: "kmpl",
      tech_name_v2: "Honda Civic",
      tech_fule_effi_v2: "250",
      tech_fule_effi_v2_unit: "kmpl",
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
    setFormData((prev) => ({ ...prev, tech_distance_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_price_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };
  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fule_effi_v1_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };
  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fule_effi_v2_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
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

          <div className="lg:w-[60%] md:w-[95%] w-full mx-auto ">
            <div className="flex items-center justify-center my-2">
              <p className="pe-lg-3 text-blue">
                {data?.payload?.tech_lang_keys["1"]}:
              </p>
              <p>
                <label className="pe-2" htmlFor="first">
                  <input
                    type="radio"
                    name="tech_type"
                    value="first"
                    id="first"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_type === "first"}
                  />
                  <span>{data?.payload?.tech_lang_keys["2"]}</span>
                </label>
              </p>

              <p className="my-2">
                <label htmlFor="second">
                  <input
                    type="radio"
                    name="tech_type"
                    className="mr-2 border"
                    value="second"
                    id="second"
                    onChange={handleChange}
                    checked={formData.tech_type === "second"}
                  />
                  <span>{data?.payload?.tech_lang_keys["3"]}</span>
                </label>
              </p>
            </div>
            <div className="grid grid-cols-12   gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_trip_type" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_trip_type"
                    id="tech_trip_type"
                    value={formData.tech_trip_type}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_distance" className="label">
                  {data?.payload?.tech_lang_keys["9"]}
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
                    {formData.tech_distance_unit} ▾
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
                <label htmlFor="tech_week_day" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_week_day"
                    id="tech_week_day"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_week_day}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <p className="col-span-12 ">
                <strong>{data?.payload?.tech_lang_keys[11]}</strong>
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_price" className="label">
                  {data?.payload?.tech_lang_keys["12"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_price"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_price}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_price_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: data?.payload?.tech_lang_keys["14"],
                          value: data?.payload?.tech_lang_keys["14"],
                        },
                        {
                          label: data?.payload?.tech_lang_keys["15"],
                          value: data?.payload?.tech_lang_keys["15"],
                        },
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

              {formData.tech_type === "first" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                    <label htmlFor="tech_peoples" className="label">
                      {data?.payload?.tech_lang_keys["16"]} (
                      {data?.payload?.tech_lang_keys["17"]}):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_peoples"
                        id="tech_peoples"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_peoples}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              <p className="my-2 col-span-12 ">
                <strong className="vehical">
                  {formData?.tech_type === "second"
                    ? data?.payload?.tech_lang_keys[38]
                    : data?.payload?.tech_lang_keys[18]}
                </strong>
              </p>

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_name_v1" className="label">
                  {data?.payload?.tech_lang_keys["19"]} :
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_name_v1"
                    id="tech_name_v1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_name_v1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_fule_effi_v1" className="label">
                  {data?.payload?.tech_lang_keys["20"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_fule_effi_v1"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_fule_effi_v1}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_fule_effi_v1_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kmpl", value: "kmpl" },
                        { label: "mpg", value: "mpg" },
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
              {formData.tech_type === "second" && (
                <>
                  <div className="col-span-12 " id="comparison">
                    <div className="grid grid-cols-12  gap-4">
                      <p className="my-2 col-span-12">
                        <strong>{data?.payload?.tech_lang_keys[21]}</strong>
                      </p>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_name_v2" className="label">
                          {data?.payload?.tech_lang_keys["19"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_name_v2"
                            id="tech_name_v2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_name_v2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_fule_effi_v2" className="label">
                          {data?.payload?.tech_lang_keys["20"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_fule_effi_v2"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_fule_effi_v2}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_fule_effi_v2_unit} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "kmpl", value: "kmpl" },
                                { label: "mpg", value: "mpg" },
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        {formData?.tech_type === "first" ? (
                          <>
                            <p>
                              {data?.payload?.tech_lang_keys[22]}{" "}
                              <strong>
                                {result?.tech_fule_req}{" "}
                                {formData?.tech_distance_unit === "km"
                                  ? data?.payload?.tech_lang_keys[14]
                                  : data?.payload?.tech_lang_keys[15]}
                                ,
                              </strong>{" "}
                              {data?.payload?.tech_lang_keys[23]}{" "}
                              <strong>
                                {currency.symbol}{" "}
                                {result?.tech_fule_price_daily}
                              </strong>
                            </p>

                            {formData?.tech_peoples && (
                              <p className="mt-1">
                                {data?.payload?.tech_lang_keys[24]}{" "}
                                <strong>
                                  {currency.symbol}
                                  {result?.tech_each_pay}
                                </strong>
                              </p>
                            )}

                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto lg:text-[18px] md:text-[18px] text-[16px]">
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[27]}
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[25]}
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[26]}
                                      </strong>
                                    </td>
                                  </tr>

                                  {[
                                    {
                                      label: data?.payload?.tech_lang_keys[28],
                                      fuel: result?.tech_fule_req,
                                      price: result?.tech_fule_price_daily,
                                    },
                                    {
                                      label: data?.payload?.tech_lang_keys[29],
                                      fuel: result?.tech_fule_req_weekly,
                                      price: result?.tech_fule_price_weekly,
                                    },
                                    {
                                      label: data?.payload?.tech_lang_keys[30],
                                      fuel: result?.tech_fule_req_biweekly,
                                      price: result?.tech_fule_price_biweekly,
                                    },
                                    {
                                      label: data?.payload?.tech_lang_keys[31],
                                      fuel: result?.tech_fule_req_monthly,
                                      price: result?.tech_fule_price_monthly,
                                    },
                                    {
                                      label: data?.payload?.tech_lang_keys[32],
                                      fuel: result?.tech_fule_req_yearly,
                                      price: result?.tech_fule_price_yearly,
                                    },
                                  ].map((row, index) => (
                                    <tr key={index}>
                                      <td className="border-b py-2">
                                        {row.label}
                                      </td>
                                      <td className="border-b py-2">
                                        {row.fuel}{" "}
                                        {formData?.tech_distance_unit === "km"
                                          ? data?.payload?.tech_lang_keys[14]
                                          : data?.payload?.tech_lang_keys[15]}
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol} {row.price}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-wrap lg:flex-nowrap">
                              <div className="lg:w-1/3 border-r">
                                <p>{data?.payload?.tech_lang_keys[35]}</p>
                                <p>
                                  <strong className="text-green font-s-21">
                                    {result?.tech_weekly_saving}
                                  </strong>
                                </p>
                              </div>
                              <div className="lg:w-1/3 ps-lg-4 border-r">
                                <p>{data?.payload?.tech_lang_keys[36]}</p>
                                <p>
                                  <strong className="text-green font-s-21">
                                    {result?.tech_monthly_saving}
                                  </strong>
                                </p>
                              </div>
                              <div className="lg:w-1/3 ps-lg-4">
                                <p>{data?.payload?.tech_lang_keys[37]}</p>
                                <p>
                                  <strong className="text-green font-s-21">
                                    {result?.tech_yearly_saving}
                                  </strong>
                                </p>
                              </div>
                            </div>

                            <div className="w-full md:w-[60%] lg:w-[60%] text-[18px] mt-3">
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[27]}
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      <strong>{formData?.tech_name_v1}</strong>
                                    </td>
                                    <td className="border-b py-2">
                                      <strong>{formData?.tech_name_v2}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <p className="left-align">
                                        {data?.payload?.tech_lang_keys[33]}
                                      </p>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_fule_req_v1}{" "}
                                      {formData?.tech_distance_unit === "km"
                                        ? data?.payload?.tech_lang_keys[14]
                                        : data?.payload?.tech_lang_keys[15]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_fule_req_v2}{" "}
                                      {formData?.tech_distance_unit === "km"
                                        ? data?.payload?.tech_lang_keys[14]
                                        : data?.payload?.tech_lang_keys[15]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <p className="left-align">
                                        {data?.payload?.tech_lang_keys[34]}
                                      </p>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {result?.tech_price_price_v1}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {result?.tech_price_price_v2}
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

export default GasCalculator;

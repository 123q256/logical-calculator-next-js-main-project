"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useLawnmowingCostCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LawnMowingCostCalculator = () => {
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
    tech_type: "mowing_time", // mowing_time   lawn_mowed
    tech_charges: "area",
    tech_mow_price: "12",
    tech_m_p_units: "km²",
    tech_currancy: "$",
    tech_area_mow: "10",
    tech_a_m_units: "km²",
    tech_hours_work: "10",
    tech_mow_speed: "10",
    tech_mow_speed_units: "m/h",
    tech_mow_width: "6",
    tech_mow_width_units: "in",
    tech_mow_pro: "80",
    tech_to_mow: "6",
    tech_to_mow_units: "km²/to mow",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLawnmowingCostCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_charges: formData.tech_charges,
        tech_mow_price: formData.tech_mow_price,
        tech_m_p_units: formData.tech_m_p_units,
        tech_currancy: formData.tech_currancy,
        tech_area_mow: formData.tech_area_mow,
        tech_a_m_units: formData.tech_a_m_units,
        tech_hours_work: formData.tech_hours_work,
        tech_mow_speed: formData.tech_mow_speed,
        tech_mow_speed_units: formData.tech_mow_speed_units,
        tech_mow_width: formData.tech_mow_width,
        tech_mow_width_units: formData.tech_mow_width_units,
        tech_mow_pro: formData.tech_mow_pro,
        tech_to_mow: formData.tech_to_mow,
        tech_to_mow_units: formData.tech_to_mow_units,
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
      tech_type: "mowing_time", // mowing_time   lawn_mowed
      tech_charges: "area",
      tech_mow_price: "12",
      tech_m_p_units: "km²",
      tech_currancy: "$",
      tech_area_mow: "10",
      tech_a_m_units: "km²",
      tech_hours_work: "10",
      tech_mow_speed: "10",
      tech_mow_speed_units: "m/h",
      tech_mow_width: "6",
      tech_mow_width_units: "in",
      tech_mow_pro: "80",
      tech_to_mow: "6",
      tech_to_mow_units: "km²/to mow",
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
    setFormData((prev) => ({ ...prev, tech_m_p_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_a_m_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_mow_speed_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_mow_width_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };
  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_to_mow_units: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type"
                    id="tech_type"
                    value={formData.tech_type}
                    onChange={handleChange}
                  >
                    <option value="lawn_mowed">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="mowing_time">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_type == "lawn_mowed" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 lawn_mowed">
                    <label htmlFor="tech_charges " className="text-[13px]">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_charges"
                        id="tech_charges"
                        value={formData.tech_charges}
                        onChange={handleChange}
                      >
                        <option value="area">
                          {data?.payload?.tech_lang_keys["5"]}
                        </option>
                        <option value="hour">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mow_price">
                    <label htmlFor="tech_mow_price" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_mow_price"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_mow_price}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      {formData.tech_charges == "hour" && (
                        <span className="input_unit text-blue  hour">
                          {currency.symbol}/h
                        </span>
                      )}
                      {formData.tech_charges == "area" && (
                        <>
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_m_p_units} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                {
                                  label: currency.symbol + "m²",
                                  value: currency.symbol + "m²",
                                },
                                {
                                  label: currency.symbol + "km²",
                                  value: currency.symbol + "km²",
                                },
                                {
                                  label: currency.symbol + "ft²",
                                  value: currency.symbol + "ft²",
                                },
                                {
                                  label: currency.symbol + "yd²",
                                  value: currency.symbol + "yd²",
                                },
                                {
                                  label: currency.symbol + "a",
                                  value: currency.symbol + "a",
                                },
                                {
                                  label: currency.symbol + "da",
                                  value: currency.symbol + "da",
                                },
                                {
                                  label: currency.symbol + "ha",
                                  value: currency.symbol + "ha",
                                },
                                {
                                  label: currency.symbol + "ac",
                                  value: currency.symbol + "ac",
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
                        </>
                      )}
                    </div>

                    <input
                      type="hidden"
                      step="any"
                      name="tech_currancy"
                      id="tech_currancy"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={currency.symbol}
                      onChange={handleChange}
                    />
                  </div>
                  {formData.tech_charges == "area" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 area_mow">
                        <label htmlFor="tech_area_mow" className="label">
                          {data?.payload?.tech_lang_keys["8"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_area_mow"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_area_mow}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_a_m_units} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "m²", value: "m²" },
                                { label: "km²", value: "km²" },
                                { label: "ft²", value: "ft²" },
                                { label: "yd²", value: "yd²" },
                                { label: "a", value: "a" },
                                { label: "da", value: "da" },
                                { label: "ha", value: "ha" },
                                { label: "ac", value: "ac" },
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
                  {formData.tech_charges == "hour" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 hours_work">
                        <label htmlFor="tech_hours_work" className="label">
                          {data?.payload?.tech_lang_keys["9"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_hours_work"
                            id="tech_hours_work"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_hours_work}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {formData.tech_type == "mowing_time" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mowing_time">
                    <label htmlFor="tech_mow_speed" className="label">
                      {data?.payload?.tech_lang_keys["10"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_mow_speed"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_mow_speed}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_mow_speed_units} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "km/h", value: "km/h" },
                            { label: "m/h", value: "m/h" },
                            { label: "ft/h", value: "ft/h" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mow_width">
                    <label htmlFor="tech_mow_width" className="label">
                      {data?.payload?.tech_lang_keys["11"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_mow_width"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_mow_width}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_mow_width_units} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "km", value: "km" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
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
                  <div className="col-span-12  mow_pro">
                    <label htmlFor="tech_mow_pro" className="label">
                      {data?.payload?.tech_lang_keys["12"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_mow_pro"
                        id="tech_mow_pro"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_mow_pro}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="col-span-12 to_mow pe-lg-3">
                    <p>
                      {data?.payload?.tech_lang_keys["13"]} (
                      {data?.payload?.tech_lang_keys["14"]})
                    </p>
                    <label htmlFor="tech_to_mow" className="label">
                      {data?.payload?.tech_lang_keys["15"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_to_mow"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_to_mow}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_to_mow_units} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m²/to mow", value: "m²/to mow" },
                            { label: "km²/to mow", value: "km²/to mow" },
                            { label: "ft²/to mow", value: "ft²/to mow" },
                            { label: "yd²/to mow", value: "yd²/to mow" },
                            { label: "a/to mow", value: "a/to mow" },
                            { label: "ha/to mow", value: "ha/to mow" },
                            { label: "ac/to mow", value: "ac/to mow" },
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

                  <div className="rounded-lg flex items-center justify-center w-full mt-3">
                    <div className="w-full">
                      {result?.tech_type == "lawn_mowed" &&
                        (result?.charges == "area" ? (
                          <div className="text-center">
                            <p className="text-[20px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["16"]}
                              </strong>
                            </p>
                            <p className="text-[32px] bg-sky-100 px-3 py-2 rounded-lg inline-block my-3">
                              <strong className="text-blue">
                                <span>{currency.symbol}</span>{" "}
                                {Number(result?.tech_total_cost).toFixed(2)}
                              </strong>
                            </p>
                            <div>
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["17"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["18"]} ={" "}
                                {result?.tech_mow_price} km²
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]} ={" "}
                                {result?.tech_area_mow} km²
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["19"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["16"]} ={" "}
                                {result?.tech_mow_price} *{" "}
                                {result?.tech_area_mow}
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["16"]}
                                </strong>{" "}
                                = <i>{currency.symbol}</i>{" "}
                                {result?.tech_total_cost}
                              </p>
                            </div>
                          </div>
                        ) : (
                          result?.charges == "hour" && (
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["16"]}
                                </strong>
                              </p>
                              <p className="text-[32px] bg-sky-100 px-3 py-2 rounded-lg inline-block my-3">
                                <strong className="text-blue">
                                  <span>{currency.symbol}</span>{" "}
                                  {Number(result?.tech_total_cost).toFixed(2)}
                                </strong>
                              </p>
                              <div>
                                <p>
                                  <strong>
                                    {data?.payload?.tech_lang_keys["17"]}
                                  </strong>
                                </p>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["18"]} ={" "}
                                  {result?.tech_mow_price}/h
                                </p>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["8"]} ={" "}
                                  {result?.tech_hours_work}h
                                </p>
                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["19"]}
                                  </strong>
                                </p>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["16"]} ={" "}
                                  {result?.tech_mow_price} *{" "}
                                  {result?.tech_hours_work}
                                </p>
                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["16"]}
                                  </strong>{" "}
                                  = <i>{currency.symbol}</i>{" "}
                                  {result?.tech_total_cost}
                                </p>
                              </div>
                            </div>
                          )
                        ))}

                      {result?.tech_type == "mowing_time" && (
                        <>
                          <div className="col-lg-8 text-[16px] overflow-auto">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td width="50%" className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["21"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_m_cost}{" "}
                                    <span className="font-s-16">
                                      km² {data?.payload?.tech_lang_keys["6"]}
                                    </span>
                                  </td>
                                </tr>
                                {result?.tech_hours && (
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["13"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_hours}{" "}
                                      <span className="font-s-16">
                                        {data?.payload?.tech_lang_keys["21"]}
                                      </span>{" "}
                                      : {result?.tech_minutes}{" "}
                                      <span className="font-s-16">
                                        {data?.payload?.tech_lang_keys["22"]}
                                      </span>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className="col-lg-8 text-[16px] overflow-auto">
                            <p>{data?.payload?.tech_lang_keys["23"]}</p>
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["21"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_m_cost * 1000000} m²
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["21"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_m_cost * 10763910} ft²
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["21"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_m_cost * 1195990} yd²
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["21"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_m_cost * 10000} a
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["21"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_m_cost * 100} ha
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["21"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {(result?.tech_m_cost * 247.1).toFixed(3)}{" "}
                                    ac
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div>
                            <p className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]}
                              </strong>
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["10"]} ={" "}
                              {result?.tech_mow_speed} km/h
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["11"]} ={" "}
                              {result?.tech_mow_width} km
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["30"]} ={" "}
                              {result?.tech_mow_pro} %
                            </p>

                            {result?.tech_hours && (
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]} ={" "}
                                {result?.tech_to_mow} km²
                              </p>
                            )}

                            <p className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["19"]}
                              </strong>
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["21"]} ={" "}
                              {result?.tech_mow_speed} *{" "}
                              {result?.tech_mow_width} * ({result?.tech_mow_pro}{" "}
                              / 100)
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["21"]} ={" "}
                              {(
                                result?.tech_mow_speed *
                                result?.tech_mow_width *
                                (result?.tech_mow_pro / 100)
                              ).toFixed(3)}{" "}
                              km² {data?.payload?.tech_lang_keys["6"]}
                            </p>

                            {result?.tech_hours && (
                              <>
                                <p className="mt-2 font-s-16">
                                  {data?.payload?.tech_lang_keys["31"]}
                                </p>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["13"]} ={" "}
                                  {result?.tech_to_mow} / {result?.tech_m_cost}
                                </p>
                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["13"]} ={" "}
                                    {result?.tech_hours}{" "}
                                    {data?.payload?.tech_lang_keys["21"]} :{" "}
                                    {result?.tech_minutes}{" "}
                                    {data?.payload?.tech_lang_keys["22"]}
                                  </strong>
                                </p>
                              </>
                            )}
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

export default LawnMowingCostCalculator;

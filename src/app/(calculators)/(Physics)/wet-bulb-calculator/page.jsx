"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useWetBulbCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WetBulbCalculator = () => {
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
    tech_temp: "17",
    tech_temp_unit: "°F", // °F  °C  K
    tech_hum: "65",
    tech_temp1: "17",
    tech_temp1_unit: "°F", // °F  °C  K
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWetBulbCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_temp || !formData.tech_temp_unit || !formData.tech_hum) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_temp: formData.tech_temp,
        tech_temp_unit: formData.tech_temp_unit,
        tech_hum: formData.tech_hum,
        tech_temp1: formData.tech_temp1,
        tech_temp1_unit: formData.tech_temp1_unit,
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
      tech_temp: "17",
      tech_temp_unit: "°F", // °F  °C  K
      tech_hum: "65",
      tech_temp1: "17",
      tech_temp1_unit: "°F", // °F  °C  K
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
    setFormData((prev) => ({ ...prev, tech_temp_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_temp1_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  const round = (value, decimals) => {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  };

  const handleChange1 = (event) => {
    const { name, value } = event.target;

    // سب سے پہلے formData اپڈیٹ کریں
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // متعلقہ span تلاش کریں (جو کہ event.target کے ساتھ ہے)
    // چونکہ span اور select ایک ہی td میں ہیں، ہم parentNode استعمال کر سکتے ہیں:
    const td = event.target.parentNode;
    const circleResultSpan = td.querySelector(".circle_result");

    if (!circleResultSpan) return;

    // original value کو data-initial-value attribute میں رکھیں، اگر نہیں ہے تو موجودہ span کی text سے لے لیں
    let originalValue = parseFloat(
      circleResultSpan.getAttribute("data-initial-value")
    );
    if (isNaN(originalValue)) {
      originalValue = parseFloat(circleResultSpan.innerText);
      circleResultSpan.setAttribute("data-initial-value", originalValue);
    }

    let newValue;
    if (value === "°F") {
      newValue = originalValue * (9 / 5) + 32;
    } else if (value === "K") {
      newValue = originalValue + 273.15;
    } else {
      // °C
      newValue = originalValue;
    }

    // span کا text اپڈیٹ کریں
    circleResultSpan.innerText = newValue.toFixed(5);
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
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_temp" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_temp"
                    step="any"
                    className="mt-1 input"
                    min="1"
                    value={formData.tech_temp}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_temp_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "°C", value: "°C" },
                        { label: "°F", value: "°F" },
                        { label: "K", value: "K" },
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
              <div className="space-y-2">
                <label htmlFor="tech_hum" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (%):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_hum"
                    id="tech_hum"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_hum}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_temp1" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>{" "}
                <span className="text-blue">
                  ({data?.payload?.tech_lang_keys["4"]})
                </span>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_temp1"
                    step="any"
                    className="mt-1 input"
                    min="1"
                    value={formData.tech_temp1}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_temp1_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "°C", value: "°C" },
                        { label: "°F", value: "°F" },
                        { label: "K", value: "K" },
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
                    <div className="w-full bg-light-blue rounded-lg mt-3">
                      <div className="w-full mt-2 overflow-auto">
                        <table className="w-full text-[14px] md:text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b">
                                <strong>
                                  {data?.payload?.tech_lang_keys[5]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                <div className="mt-2  flex">
                                  <p className="circle_result flex items-center">
                                    {round(result?.tech_ans, 5)}
                                  </p>
                                  <select
                                    className=" d-inline border-0 border-none text-blue text-[16px] w-[80px] result_select_dropdown ml-2"
                                    aria-label="select"
                                    name="circle_unit_result"
                                    id="circle_unit_result"
                                    value={formData.circle_unit_result}
                                    onChange={handleChange1}
                                  >
                                    <option value="°C">°C</option>
                                    <option value="°F">°F</option>
                                    <option value="K">K</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table className="w-full text-[16] md:text-[18px]">
                          <tbody>
                            {result?.tech_outdoor !== undefined && (
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[11]} (
                                    {data?.payload?.tech_lang_keys[12]})
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <div className="mt-2   flex">
                                    <p className="circle_result flex items-center">
                                      {round(result?.tech_outdoor, 5)}
                                    </p>
                                    <select
                                      className=" d-inline border-0 border-none text-blue text-[16px] w-[80px] result_select_dropdown ml-2"
                                      aria-label="select"
                                      name="circle_unit_result2"
                                      id="circle_unit_result2"
                                      value={formData.circle_unit_result2}
                                      onChange={handleChange1}
                                    >
                                      <option value="°C">°C</option>
                                      <option value="°F">°F</option>
                                      <option value="K">K</option>
                                    </select>
                                  </div>
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td className="py-2 border-b">
                                <strong>
                                  {data?.payload?.tech_lang_keys[11]} (
                                  {data?.payload?.tech_lang_keys[13]})
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                <div className="mt-2   flex">
                                  <p className="circle_result flex items-center">
                                    {round(result?.tech_indoor, 5)}
                                  </p>
                                  <select
                                    className=" d-inline border-0 border-none text-blue text-[16px] w-[80px] result_select_dropdown ml-2"
                                    aria-label="select"
                                    name="circle_unit_result3"
                                    id="circle_unit_result3"
                                    value={formData.circle_unit_result3}
                                    onChange={handleChange1}
                                  >
                                    <option value="°C">°C</option>
                                    <option value="°F">°F</option>
                                    <option value="K">K</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {result?.tech_ans < 32 ? (
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys[6]}.
                          </p>
                        ) : result?.tech_ans >= 32 && result?.tech_ans < 35 ? (
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys[7]} 32 °C (90 °F){" "}
                            {data?.payload?.tech_lang_keys[8]}.
                          </p>
                        ) : result?.tech_ans >= 35 ? (
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys[9]} 35 °C (95 °F){" "}
                            {data?.payload?.tech_lang_keys[10]}.
                          </p>
                        ) : null}
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

export default WetBulbCalculator;

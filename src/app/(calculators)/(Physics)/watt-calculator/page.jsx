"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useWattCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WattCalculator = () => {
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
    tech_resistance: "3",
    tech_resistance_unit: "MΩ",
    tech_current: "",
    tech_current_unit: "MA",
    tech_voltage: "",
    tech_voltage_unit: "mV",
    tech_power: "5",
    tech_power_unit: "KW",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWattCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_resistance: formData.tech_resistance,
        tech_resistance_unit: formData.tech_resistance_unit,
        tech_current: formData.tech_current,
        tech_current_unit: formData.tech_current_unit,
        tech_voltage: formData.tech_voltage,
        tech_voltage_unit: formData.tech_voltage_unit,
        tech_power: formData.tech_power,
        tech_power_unit: formData.tech_power_unit,
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
      tech_resistance: "3",
      tech_resistance_unit: "MΩ",
      tech_current: "",
      tech_current_unit: "MA",
      tech_voltage: "",
      tech_voltage_unit: "mV",
      tech_power: "5",
      tech_power_unit: "KW",
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
    setFormData((prev) => ({ ...prev, tech_resistance_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_current_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_voltage_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_power_unit: unit }));
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
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <p className="w-full my-2 px-2">
              {data?.payload?.tech_lang_keys[5]}
            </p>
            <div className="grid grid-cols-2  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_resistance" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (R):
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_resistance"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_resistance}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_resistance_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "Ω", value: "Ω" },
                        { label: "kΩ", value: "kΩ" },
                        { label: "MΩ", value: "MΩ" },
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
                <label htmlFor="tech_current" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (I):
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_current"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_current}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_current_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "A", value: "A" },
                        { label: "μA", value: "μA" },
                        { label: "mA", value: "mA" },
                        { label: "kA", value: "kA" },
                        { label: "MA", value: "MA" },
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
              <div className="space-y-2">
                <label htmlFor="tech_voltage" className="label">
                  {data?.payload?.tech_lang_keys["3"]} (V):
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_voltage"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_voltage}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_voltage_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "V", value: "V" },
                        { label: "μV", value: "μV" },
                        { label: "mV", value: "mV" },
                        { label: "KV", value: "KV" },
                        { label: "MV", value: "MV" },
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
              <div className="space-y-2">
                <label htmlFor="tech_power" className="label">
                  {data?.payload?.tech_lang_keys["4"]} (P):
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_power"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_power}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_power_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "W", value: "W" },
                        { label: "μW", value: "μW" },
                        { label: "mW", value: "mW" },
                        { label: "KW", value: "KW" },
                        { label: "MW", value: "MW" },
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue   rounded-lg mt-3">
                      <div className="flex">
                        <div className="w-full lg:w-1/2 mt-2 px-2">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              {result?.tech_resistance && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["1"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {Number(
                                          result?.tech_resistance
                                        ).toFixed(3)}{" "}
                                        (Ω)
                                      </strong>
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_current && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["2"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {Number(result?.tech_current).toFixed(
                                          3
                                        )}{" "}
                                        (A)
                                      </strong>
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_power && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["4"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {Number(result?.tech_power).toFixed(3)}{" "}
                                        (W)
                                      </strong>
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_voltage && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["3"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {Number(result?.tech_voltage).toFixed(
                                          3
                                        )}{" "}
                                        (V)
                                      </strong>
                                    </td>
                                  </tr>
                                </>
                              )}
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

export default WattCalculator;

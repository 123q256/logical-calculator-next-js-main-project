"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useOhmsLawCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const OhmsLawCalculator = () => {
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
    tech_voltage: "1",
    tech_unit_v: "V",
    tech_current: "2",
    tech_unit_i: "A",
    tech_resistance: "",
    tech_unit_r: "Ω",
    tech_power: "",
    tech_unit_p: "W",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useOhmsLawCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!formData.tech_x || !formData.tech_y ) {
    //   setFormError("Please fill in input.");
    //   return;
    // }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_voltage: formData.tech_voltage,
        tech_unit_v: formData.tech_unit_v,
        tech_current: formData.tech_current,
        tech_unit_i: formData.tech_unit_i,
        tech_resistance: formData.tech_resistance,
        tech_unit_r: formData.tech_unit_r,
        tech_power: formData.tech_power,
        tech_unit_p: formData.tech_unit_p,
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
      tech_voltage: "1",
      tech_unit_v: "V",
      tech_current: "2",
      tech_unit_i: "A",
      tech_resistance: "",
      tech_unit_r: "Ω",
      tech_power: "",
      tech_unit_p: "W",
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
    setFormData((prev) => ({ ...prev, tech_unit_v: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_i: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_r: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_p: unit }));
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
            <p className="w-full">
              {data?.payload?.tech_lang_keys["voltage"]} ={" "}
              {data?.payload?.tech_lang_keys["current"]} *{" "}
              {data?.payload?.tech_lang_keys["resistance"]}
            </p>
            <p className="w-full">
              {data?.payload?.tech_lang_keys["power"]} ={" "}
              {data?.payload?.tech_lang_keys["voltage"]} *{" "}
              {data?.payload?.tech_lang_keys["current"]}
            </p>
            <p className="w-full">
              {data?.payload?.tech_lang_keys["note"]}{" "}
              {data?.payload?.tech_lang_keys["note_value"]}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_voltage" className="label">
                  {data?.payload?.tech_lang_keys["voltage"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_voltage"
                    step="any"
                    min="1"
                    className="mt-1 input"
                    value={formData.tech_voltage}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit_v} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "V", value: "V" },
                        { label: "KV", value: "KV" },
                        { label: "mV", value: "mV" },
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
                  {data?.payload?.tech_lang_keys["current"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_current"
                    step="any"
                    min="1"
                    className="mt-1 input"
                    value={formData.tech_current}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_unit_i} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "A", value: "A" },
                        { label: "mA", value: "mA" },
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
                <label htmlFor="tech_resistance" className="label">
                  {data?.payload?.tech_lang_keys["resistance"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_resistance"
                    step="any"
                    min="1"
                    className="mt-1 input"
                    value={formData.tech_resistance}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_unit_r} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "Ω", value: "Ω" },
                        { label: "kΩ", value: "kΩ" },
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
                  {data?.payload?.tech_lang_keys["power"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_power"
                    step="any"
                    min="1"
                    className="mt-1 input"
                    value={formData.tech_power}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_unit_p} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "W", value: "W" },
                        { label: "kW", value: "kW" },
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />
                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue rounded-lg mt-6">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-12 md:col-span-6 mt-4">
                          <table className="w-full text-base">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b w-3/5">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["voltage"]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_voltage}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-3/5">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["current"]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_current}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-3/5">
                                  <strong>
                                    {
                                      data?.payload?.tech_lang_keys[
                                        "resistance"
                                      ]
                                    }{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_resistance}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-3/5">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["power"]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_power}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="col-span-12 md:col-span-6 mt-4 text-center">
                          <img
                            src="/images/ohm-min.webp"
                            alt="ohm's law calculator"
                            className="mx-auto"
                            width="308px"
                            height="auto"
                          />
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

export default OhmsLawCalculator;

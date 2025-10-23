"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBatteryLifeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BatteryLifeCalculator = () => {
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
    tech_battery_capacity: "12",
    tech_battery_units: "mAh",
    tech_discharge_safety: "20",
    tech_device_con1: "5",
    tech_device_con1_units: "mA",
    tech_awake_time: "5",
    tech_awake_time_units: "mos",
    tech_device_con2: "5",
    tech_device_con2_units: "A",
    tech_sleep_time: "5",
    tech_sleep_time_units: "min",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBatteryLifeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_battery_capacity ||
      !formData.tech_battery_units ||
      !formData.tech_discharge_safety ||
      !formData.tech_device_con1 ||
      !formData.tech_device_con1_units ||
      !formData.tech_awake_time ||
      !formData.tech_awake_time_units ||
      !formData.tech_device_con2 ||
      !formData.tech_device_con2_units ||
      !formData.tech_sleep_time ||
      !formData.tech_sleep_time_units
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_battery_capacity: formData.tech_battery_capacity,
        tech_battery_units: formData.tech_battery_units,
        tech_discharge_safety: formData.tech_discharge_safety,
        tech_device_con1: formData.tech_device_con1,
        tech_device_con1_units: formData.tech_device_con1_units,
        tech_awake_time: formData.tech_awake_time,
        tech_awake_time_units: formData.tech_awake_time_units,
        tech_device_con2: formData.tech_device_con2,
        tech_device_con2_units: formData.tech_device_con2_units,
        tech_sleep_time: formData.tech_sleep_time,
        tech_sleep_time_units: formData.tech_sleep_time_units,
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
      tech_battery_capacity: "12",
      tech_battery_units: "mAh",
      tech_discharge_safety: "20",
      tech_device_con1: "5",
      tech_device_con1_units: "mA",
      tech_awake_time: "5",
      tech_awake_time_units: "mos",
      tech_device_con2: "5",
      tech_device_con2_units: "A",
      tech_sleep_time: "5",
      tech_sleep_time_units: "min",
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
    setFormData((prev) => ({ ...prev, tech_battery_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_device_con1_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_awake_time_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_device_con2_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sleep_time_units: unit }));
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_battery_capacity" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_battery_capacity"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_battery_capacity}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_battery_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "Ah", value: "Ah" },
                        { label: "mAh", value: "mAh" },
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
                <label htmlFor="tech_discharge_safety" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_discharge_safety"
                    id="tech_discharge_safety"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_discharge_safety}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_device_con1" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_device_con1"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_device_con1}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_device_con1_units} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "A", value: "A" },
                        { label: "mA", value: "mA" },
                        { label: "µA", value: "µA" },
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
                <label htmlFor="tech_awake_time" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_awake_time"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_awake_time}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_awake_time_units} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "sec", value: "sec" },
                        { label: "min", value: "min" },
                        { label: "hrs", value: "hrs" },
                        { label: "days", value: "days" },
                        { label: "wks", value: "wks" },
                        { label: "mos", value: "mos" },
                        { label: "yrs", value: "yrs" },
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
              <p className="col-span-12">
                {data?.payload?.tech_lang_keys["5"]}
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_device_con2" className="label">
                  {data?.payload?.tech_lang_keys["6"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_device_con2"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_device_con2}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_device_con2_units} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "A", value: "A" },
                        { label: "mA", value: "mA" },
                        { label: "µA", value: "µA" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_sleep_time" className="label">
                  {data?.payload?.tech_lang_keys["7"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_sleep_time"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_sleep_time}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown4}
                  >
                    {formData.tech_sleep_time_units} ▾
                  </label>
                  {dropdownVisible4 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "sec", value: "sec" },
                        { label: "min", value: "min" },
                        { label: "hrs", value: "hrs" },
                        { label: "days", value: "days" },
                        { label: "wks", value: "wks" },
                        { label: "mos", value: "mos" },
                        { label: "mos", value: "mos" },
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
                        <div className="w-full md:w-[60%] lg:w-[60%] lg:text-[18px] md:text-[18px] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2" width="60%">
                                  {data?.payload?.tech_lang_keys[6]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_Average_consumption} mA
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[7]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_Battery_life).toFixed(1)}{" "}
                                  hrs
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="py-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["8"]}
                            </strong>
                          </p>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["9"]} :
                                </td>
                                <td className="border-b">
                                  {Number(
                                    result?.tech_Average_consumption * 0.001
                                  ).toFixed(2)}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b">
                                  {data?.payload?.tech_lang_keys["10"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_Average_consumption * 1000
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="pt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["11"]}
                            </strong>
                          </p>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b ">
                                  {data?.payload?.tech_lang_keys["12"]}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_Battery_life * 3600
                                  ).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b ">
                                  {data?.payload?.tech_lang_keys["13"]}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_Battery_life * 60
                                  ).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b ">
                                  {data?.payload?.tech_lang_keys["14"]}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_Battery_life * 0.04167
                                  ).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b ">
                                  {data?.payload?.tech_lang_keys["15"]}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_Battery_life * 0.005952
                                  ).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b ">
                                  {data?.payload?.tech_lang_keys["16"]}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_Battery_life * 0.001369
                                  ).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b ">
                                  {data?.payload?.tech_lang_keys["17"]}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_Battery_life * 0.00011408
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="font-s-18 overflow-auto">
                          <p className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["19"]}
                            </strong>
                          </p>
                          <span>{data?.payload?.tech_lang_keys["7"]} = </span>
                          <span className="fraction">
                            <span className="num">Capacity</span>
                            <span className="visually-hidden"></span>
                            <span className="den">Consumption</span>
                          </span>
                          <span>
                            <i>x </i> (1 - Discharge safety)
                          </span>
                          <div>
                            <span>{data?.payload?.tech_lang_keys["7"]} = </span>
                            <span className="fraction">
                              <span className="num">
                                {formData?.tech_battery_capacity}
                              </span>
                              <span className="visually-hidden"></span>
                              <span className="den">
                                {formData?.tech_device_con1}
                              </span>
                            </span>
                            <span>
                              <i>x </i> (1 - {formData?.tech_discharge_safety})
                            </span>
                          </div>
                          <div>
                            {data?.payload?.tech_lang_keys["7"]} ={" "}
                            {Number(result?.tech_Battery_life).toFixed(2)}
                          </div>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["20"]}
                          </p>
                          <div>
                            <span>{data?.payload?.tech_lang_keys["6"]} = </span>
                            <span className="fraction">
                              <span className="num">
                                {" "}
                                ( Consumption1 x Time1 + Consumption2 x Time2)
                              </span>
                              <span className="visually-hidden"></span>
                              <span className="den">(Time1 + Time2)</span>
                            </span>
                          </div>
                          <div>
                            <span>{data?.payload?.tech_lang_keys["6"]} = </span>
                            <span className="fraction">
                              <span className="num">
                                {" "}
                                ( {formData?.tech_device_con1} x{" "}
                                {formData?.tech_awake_time} +
                                {formData?.tech_device_con2} x{" "}
                                {formData?.tech_sleep_time})
                              </span>
                              <span className="visually-hidden"></span>
                              <span className="den">
                                ({formData?.tech_awake_time} +{" "}
                                {formData?.tech_sleep_time})
                              </span>
                            </span>
                          </div>
                          <div>
                            {data?.payload?.tech_lang_keys["6"]} ={" "}
                            {Number(result?.tech_Average_consumption).toFixed(
                              2
                            )}
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

export default BatteryLifeCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useOvertimeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const conversionFactors = {
  week: 4.344,
  month: 1,
  year: 12,
};

const OvertimeCalculator = ({ initialValue }) => {
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
    tech_pay: Number(5),
    tech_per: "hour",
    tech_overtime: "half",
    tech_multi: Number(1.5),
    tech_time: Number(1),
    tech_over: Number(1),
    tech_overper: "hour",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useOvertimeCalculatorMutation();

  const [readOnly, setReadOnly] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for overtime field
    if (name === "tech_overtime") {
      let multiValue = "";
      let isReadOnly = false;

      if (value === "half") {
        multiValue = "1.5";
        isReadOnly = true;
      } else if (value === "double") {
        multiValue = "2";
        isReadOnly = true;
      } else if (value === "triple") {
        multiValue = "3";
        isReadOnly = true;
      } else {
        multiValue = "";
        isReadOnly = false;
      }

      setFormData((prevData) => ({
        ...prevData,
        tech_overtime: value,
        tech_multi: multiValue,
      }));
      setReadOnly(isReadOnly);
    } else {
      // For all other inputs
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_pay ||
      !formData.tech_per ||
      !formData.tech_overtime ||
      !formData.tech_multi
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_pay: formData.tech_pay,
        tech_per: formData.tech_per,
        tech_overtime: formData.tech_overtime,
        tech_multi: formData.tech_multi,
        tech_time: formData.tech_time,
        tech_over: formData.tech_over,
        tech_overper: formData.tech_overper,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      console.log(err.data.message);
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_pay: Number(5),
      tech_per: "hour",
      tech_overtime: "double",
      tech_multi: Number(1.5),
      tech_time: Number(0),
      tech_over: Number(0),
      tech_overper: "hour",
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
    setFormData((prev) => ({ ...prev, tech_per: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const [unit, setUnit] = useState("month"); // Default to month
  const [convertedValue, setConvertedValue] = useState(0);

  // Ensure initialValue is a valid number
  const validInitialValue = !isNaN(result?.tech_total) ? result?.tech_total : 0;

  useEffect(() => {
    let newValue;

    // Check if the unit is valid and handle conversion
    if (conversionFactors[unit] !== undefined) {
      if (unit === "year") {
        newValue = validInitialValue * conversionFactors[unit];
      } else {
        newValue = validInitialValue / conversionFactors[unit];
      }
    } else {
      console.error("Invalid unit selected: " + unit);
      return;
    }

    // Update converted value only if it's a valid number
    if (!isNaN(newValue)) {
      setConvertedValue(Number(newValue.toFixed(4)));
    } else {
      setConvertedValue(0); // Fallback to 0 if NaN
    }
  }, [unit, validInitialValue]);

  function copyTextByClass(className) {
    const element = document.querySelector(className);
    if (!element) return;

    const range = document.createRange();
    range.selectNode(element);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    try {
      document.execCommand("copy");
      toast.success("Copied!");
    } catch (err) {
      toast.error("Failed to copy");
    }

    window.getSelection().removeAllRanges();
  }

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
          <div className="lg:w-[80%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12 md:col-span-5 lg:col-span-5">
                <label htmlFor="tech_pay" className="label">
                  {data?.payload?.tech_lang_keys["2"]} {currency.symbol}{" "}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_pay"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_pay}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_per} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: data?.payload?.tech_lang_keys?.hrs ?? "hour",
                          value: "hour",
                        },
                        {
                          label: data?.payload?.tech_lang_keys?.dys ?? "day",
                          value: "day",
                        },
                        {
                          label: data?.payload?.tech_lang_keys?.wks ?? "week",
                          value: "week",
                        },
                        {
                          label: data?.payload?.tech_lang_keys?.mos ?? "month",
                          value: "month",
                        },
                        {
                          label: data?.payload?.tech_lang_keys?.yrs ?? "anualy",
                          value: "anualy",
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
              <div className="col-span-12 md:col-span-7 lg:col-span-7">
                <div className="grid grid-cols-5 lg:grid-cols-5 md:grid-cols-5 gap-4">
                  <div className="col-span-3 space-y-2">
                    <label htmlFor="tech_overtime" className="label">
                      {data?.payload?.tech_lang_keys["10"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_overtime"
                        id="tech_overtime"
                        value={formData.tech_overtime}
                        onChange={handleChange}
                      >
                        <option value="half">
                          {data?.payload?.tech_lang_keys?.half_t ??
                            "Time and a Half"}
                        </option>
                        <option value="double">
                          {data?.payload?.tech_lang_keys?.duble_t ??
                            "Double Time"}
                        </option>
                        <option value="triple">
                          {data?.payload?.tech_lang_keys?.triple_t ??
                            "Triple Time"}
                        </option>
                        <option value="other">
                          {data?.payload?.tech_lang_keys?.other ?? "Other"}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label htmlFor="tech_multi" className="label">
                      &nbsp;
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="tech_multi"
                      min="0"
                      id="tech_multi"
                      className="input my-2"
                      aria-label="input"
                      readOnly={readOnly}
                      placeholder="0"
                      value={formData.tech_multi}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_time" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="w-full py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_time"
                    min="0"
                    id="tech_time"
                    className="input my-2"
                    aria-label="input"
                    placeholder={data?.payload?.tech_lang_keys["opt"]}
                    value={formData.tech_time}
                    onChange={handleChange}
                  />
                  <span className="input_unit text-blue">hrs</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_over" className="label">
                  {data?.payload?.tech_lang_keys["12"]}:
                </label>
                <div className="w-full py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_over"
                    min="0"
                    id="tech_over"
                    className="input my-2"
                    aria-label="input"
                    placeholder={data?.payload?.tech_lang_keys["opt"]}
                    value={formData.tech_over}
                    onChange={handleChange}
                  />
                  <span className="input_unit text-blue">hrs</span>
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
                    <div className="w-full radius-10 mt-3">
                      <div className="w-full  mt-2 md:hidden">
                        <div>
                          <p>
                            <strong>
                              {data?.payload?.tech_lang_keys["13"]}
                            </strong>
                          </p>
                          <p className="pb-1 border-b flex justify-between">
                            <span className="or1">
                              {currency.symbol}
                              <strong className="text-orange-500 text-[18px]">
                                {" "}
                                {result?.tech_overPayPerHour}{" "}
                              </strong>
                            </span>
                            <span>
                              <img
                                src="/images/all_calculators/copy.png"
                                alt="Copy"
                                title="Copy"
                                width="20"
                                height="20"
                                className="me-3 cursor-pointer copy_result"
                                onClick={() => copyTextByClass(".or1")}
                              />
                            </span>
                          </p>
                        </div>
                        {formData?.tech_over && (
                          <div className="pt-2">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["18"]}
                              </strong>
                            </p>
                            <p className="pb-1 border-b flex justify-between">
                              <span className="or2">
                                {currency.symbol}{" "}
                                <strong className="text-orange-500 text-[18px]">
                                  {result?.tech_overTotalPay}
                                </strong>
                              </span>
                              <span>
                                <img
                                  src="/images/all_calculators/copy.png"
                                  alt="Copy"
                                  title="Copy"
                                  width="20"
                                  height="20"
                                  className="me-3 cursor-pointer copy_result"
                                  onClick={() => copyTextByClass(".or2")}
                                />
                              </span>
                            </p>
                          </div>
                        )}

                        {formData?.tech_time && (
                          <div className="pt-2">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["19"]}
                              </strong>
                            </p>
                            <p className="pb-1 border-b flex justify-between">
                              <span className="or3">
                                {currency.symbol}{" "}
                                <strong className="text-orange-500 text-[18px]">
                                  {result?.tech_regPay}
                                </strong>
                              </span>
                              <span>
                                <img
                                  src="/images/all_calculators/copy.png"
                                  alt="Copy"
                                  title="Copy"
                                  width="20"
                                  height="20"
                                  className="me-3 cursor-pointer copy_result"
                                  onClick={() => copyTextByClass(".or3")}
                                />
                              </span>
                            </p>
                          </div>
                        )}

                        {formData?.tech_time && formData?.tech_over && (
                          <div className="pt-2">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]}
                              </strong>
                            </p>
                            <div className="flex justify-between">
                              <div className="flex space-x-2 or4">
                                <div>
                                  <span id="circle_result">
                                    {convertedValue}
                                  </span>
                                </div>
                                <div>
                                  <select
                                    id="onetw"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    aria-label="Select unit"
                                  >
                                    <option value="week">Per Week</option>
                                    <option value="month">Per Month</option>
                                    <option value="year">Per Year</option>
                                  </select>
                                </div>
                              </div>
                              <span>
                                <img
                                  src="/images/all_calculators/copy.png"
                                  alt="Copy"
                                  title="Copy"
                                  width="20"
                                  height="20"
                                  className="me-3 cursor-pointer copy_result"
                                  onClick={() => copyTextByClass(".or4")}
                                />
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="w-full  hidden md:flex mt-2">
                        <table className="w-full md:w-[80%]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="60%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {currency.symbol} {result?.tech_overPayPerHour}{" "}
                                <span className="font-s-14">
                                  {data?.payload?.tech_lang_keys["15"]}
                                </span>
                              </td>
                            </tr>

                            {formData?.tech_over && (
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["18"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol} {result?.tech_overTotalPay}{" "}
                                  <span className="font-s-14">
                                    {data?.payload?.tech_lang_keys["16"]}
                                  </span>
                                </td>
                              </tr>
                            )}

                            {formData?.tech_time && (
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["19"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol} {result?.tech_regPay}{" "}
                                  <span className="font-s-14">
                                    {data?.payload?.tech_lang_keys["16"]}
                                  </span>
                                </td>
                              </tr>
                            )}

                            {formData?.tech_time && formData?.tech_over && (
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["14"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <div className="flex space-x-2">
                                    <div>
                                      <span id="circle_result">
                                        {convertedValue}
                                      </span>
                                    </div>
                                    <div>
                                      <select
                                        id="onetw"
                                        value={unit}
                                        onChange={(e) =>
                                          setUnit(e.target.value)
                                        }
                                        aria-label="Select unit"
                                      >
                                        <option value="week">Per Week</option>
                                        <option value="month">Per Month</option>
                                        <option value="year">Per Year</option>
                                      </select>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
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

export default OvertimeCalculator;

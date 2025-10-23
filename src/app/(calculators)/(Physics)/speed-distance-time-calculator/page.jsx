"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useSpeedDistanceTimeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SpeedDistanceTimeCalculator = () => {
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
    tech_operations: "3", // 3 4 5
    tech_first: "7",
    tech_f_unit: "inch per second",
    tech_second: "7",
    tech_s_unit: "inch",
    tech_third: "8",
    tech_t_unit: "year",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSpeedDistanceTimeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_first: formData.tech_first,
        tech_f_unit: formData.tech_f_unit,
        tech_second: formData.tech_second,
        tech_s_unit: formData.tech_s_unit,
        tech_third: formData.tech_third,
        tech_t_unit: formData.tech_t_unit,
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
      tech_operations: "3", // 3 4 5
      tech_first: "7",
      tech_f_unit: "inch per second",
      tech_second: "7",
      tech_s_unit: "inch",
      tech_third: "8",
      tech_t_unit: "year",
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
    setFormData((prev) => ({ ...prev, tech_f_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units3: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  const a = data?.payload?.tech_lang_keys[5];
  const b = data?.payload?.tech_lang_keys[6];
  const c = data?.payload?.tech_lang_keys[7];

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[50%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-4">
              <div className="col-span-12 ">
                <label htmlFor="tech_operations" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
                    <option value="3">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 text-center mt-0 mt-lg-2">
                {formData.tech_operations == "3" && (
                  <p id="math_s">
                    <InlineMath math={`Speed = \\frac{Distance}{Time}`} />
                  </p>
                )}

                {formData.tech_operations == "4" && (
                  <p id="math_d">
                    <InlineMath math={`Distance = Speed \\times Time`} />
                  </p>
                )}

                {formData.tech_operations == "5" && (
                  <p id="math_t">
                    <InlineMath math={`Time = \\frac{Distance}{Speed}`} />
                  </p>
                )}
              </div>
              {(formData.tech_operations == "4" ||
                formData.tech_operations == "5") && (
                <>
                  <div className="col-span-12  " id="f_div">
                    <label htmlFor="tech_first" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_first"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_first}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_f_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in/s", value: "inch per second" },
                            { label: "in/min", value: "inch per minute" },
                            { label: "ft/s", value: "foot per second" },
                            { label: "ft/min", value: "foot per minute" },
                            { label: "ft/hr", value: "foot per hour" },
                            { label: "yd/s", value: "yard per second" },
                            { label: "yd/min", value: "yard per minute" },
                            { label: "yd/hr", value: "yard per hour" },
                            { label: "cm/s", value: "centimeter per second" },
                            { label: "cm/min", value: "centimeter per minute" },
                            { label: "m/s", value: "meter per second" },
                            { label: "m/min", value: "meter per minute" },
                            { label: "m/hr", value: "meter per hour" },
                            { label: "mi/s", value: "mile per second" },
                            { label: "mi/min", value: "mile per minute" },
                            { label: "mi/h (mph)", value: "mile per hour" },
                            { label: "km/s", value: "kilometer per second" },
                            {
                              label: "km/h (kph)",
                              value: "kilometer per hour",
                            },
                            { label: "knots", value: "knot (nautical mi/h)" },
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
                </>
              )}
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "5") && (
                <>
                  <div className="col-span-12  " id="s_div">
                    <label htmlFor="tech_second" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_second"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_second}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_s_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "inch" },
                            { label: "ft", value: "foot" },
                            { label: "yd", value: "yard" },
                            { label: "mi", value: "mile" },
                            { label: "cm", value: "centimeter" },
                            { label: "m", value: "meter" },
                            { label: "km", value: "kilometer" },
                            { label: "nmi", value: "nautical mile" },
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
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "4") && (
                <>
                  <div className="col-span-12 " id="t_div">
                    <label htmlFor="tech_third" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_third"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_third}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_t_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "yr", value: "year" },
                            { label: "d", value: "day" },
                            { label: "hr", value: "hour" },
                            { label: "min", value: "minute" },
                            { label: "s", value: "second" },
                            { label: "hh:mm:ss", value: "hhmmss" },
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
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys["calculate"]}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
                      {result?.tech_select == 3 && (
                        <>
                          <div className="w-full md:w-[60%] lg:w-[60%] mt-2 overflow-auto">
                            <table className="lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_answer).toFixed(6)}{" "}
                                    {data?.payload?.tech_lang_keys[22]}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_answer).toFixed(6)} m/s
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="w-full md:w-[80%] lg:w-[60%] mt-2 overflow-auto">
                            <table className="lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer * 39.37).toFixed(4)}{" "}
                                    in/s
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer * 3.281).toFixed(4)}{" "}
                                    ft/s
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[12]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer * 100).toFixed(4)}{" "}
                                    cm/s
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table className="lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[13]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer / 1609).toFixed(4)}{" "}
                                    mi/s
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[14]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer / 1000).toFixed(4)}{" "}
                                    km/s
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[15]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer * 1.094).toFixed(4)}{" "}
                                    yd/s
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                      {result?.tech_select == 4 && (
                        <>
                          <div className="w-full md:w-[80%] lg:w-[60%] mt-2 overflow-auto">
                            <table className="lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_answer).toFixed(6)}{" "}
                                    {data?.payload?.tech_lang_keys[23]}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_answer).toFixed(6)} m
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="w-full md:w-[80%] lg:w-[60%] mt-2 overflow-auto">
                            <table className="lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer * 39.37).toFixed(4)}{" "}
                                    in/s
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer * 3.281).toFixed(4)}{" "}
                                    ft/s
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[12]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer * 100).toFixed(4)}{" "}
                                    cm/s
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table className="lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[13]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer / 1609).toFixed(4)}{" "}
                                    mi/s
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[14]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer / 1000).toFixed(4)}{" "}
                                    km/s
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[15]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer * 1.094).toFixed(4)}{" "}
                                    yd/s
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                      {result?.tech_select == 5 && (
                        <>
                          <div className="w-full md:w-[80%] lg:w-[60%] mt-2 overflow-auto">
                            <table className="lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_answer}{" "}
                                    {data?.payload?.tech_lang_keys[24]}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_answer} s
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_time_show}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_hours}{" "}
                                    {data?.payload?.tech_lang_keys[25]}{" "}
                                    {result?.tech_min}
                                    {data?.payload?.tech_lang_keys[26]}{" "}
                                    {result?.tech_sec}{" "}
                                    {data?.payload?.tech_lang_keys[24]}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="w-full md:w-[80%] lg:w-[60%] mt-2 overflow-auto">
                            <table className="lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[27]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer / 31540000).toFixed(
                                      4
                                    )}{" "}
                                    yr
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[28]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer / 2628000).toFixed(4)}{" "}
                                    mon
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[29]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer / 86400).toFixed(4)} d
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table className="lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["25"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer / 3600).toFixed(4)} h
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["26"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {(result?.tech_answer / 60).toFixed(4)} min
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>hh:mm:ss</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_time_show}{" "}
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

export default SpeedDistanceTimeCalculator;

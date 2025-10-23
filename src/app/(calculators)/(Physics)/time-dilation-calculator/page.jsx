"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTimeDilationCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TimeDilationCalculator = () => {
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
    tech_interval: "5",
    tech_interval_one: "9",
    tech_interval_sec: "7",
    tech_interval_unit: "wks/days",
    tech_velocity: "8",
    tech_velocity_unit: "mi/s",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTimeDilationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_interval || !formData.tech_interval_one) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_interval: formData.tech_interval,
        tech_interval_one: formData.tech_interval_one,
        tech_interval_sec: formData.tech_interval_sec,
        tech_interval_unit: formData.tech_interval_unit,
        tech_velocity: formData.tech_velocity,
        tech_velocity_unit: formData.tech_velocity_unit,
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
      tech_interval: "5",
      tech_interval_one: "9",
      tech_interval_sec: "7",
      tech_interval_unit: "wks/days",
      tech_velocity: "8",
      tech_velocity_unit: "mi/s",
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
    setFormData((prev) => ({ ...prev, tech_velocity_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  mt-3  md:gap-4 gap-1">
              {(formData.tech_interval_unit == "sec" ||
                formData.tech_interval_unit == "mins" ||
                formData.tech_interval_unit == "hrs" ||
                formData.tech_interval_unit == "days" ||
                formData.tech_interval_unit == "wks" ||
                formData.tech_interval_unit == "mos" ||
                formData.tech_interval_unit == "yrs") && (
                <>
                  <p className="col-span-12 ">
                    {data?.payload?.tech_lang_keys["1"]} (Δt):
                  </p>
                  <div className="col-span-8" id="interval">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_interval"
                        id="tech_interval"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_interval}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_interval_unit == "mins/sec" ||
                formData.tech_interval_unit == "hrs/mins" ||
                formData.tech_interval_unit == "yrs/mos" ||
                formData.tech_interval_unit == "wks/days") && (
                <>
                  <p className="col-span-12 ">
                    {data?.payload?.tech_lang_keys["1"]} (Δt):
                  </p>
                  <div className="col-span-4 ">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_interval_one"
                        id="tech_interval_one"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_interval_one}
                        onChange={handleChange}
                      />
                      {formData.tech_interval_unit == "mins/sec" && (
                        <>
                          <span className="text-blue input_unit" id="one_in">
                            mins
                          </span>
                        </>
                      )}
                      {formData.tech_interval_unit == "hrs/mins" && (
                        <>
                          <span className="text-blue input_unit" id="one_in">
                            hrs
                          </span>
                        </>
                      )}
                      {formData.tech_interval_unit == "yrs/mos" && (
                        <>
                          <span className="text-blue input_unit" id="one_in">
                            yrs
                          </span>
                        </>
                      )}
                      {formData.tech_interval_unit == "wks/days" && (
                        <>
                          <span className="text-blue input_unit" id="one_in">
                            wks
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_interval_sec"
                        id="tech_interval_sec"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_interval_sec}
                        onChange={handleChange}
                      />
                      {formData.tech_interval_unit == "mins/sec" && (
                        <>
                          <span className="text-blue input_unit" id="one_in">
                            sec
                          </span>
                        </>
                      )}
                      {formData.tech_interval_unit == "hrs/mins" && (
                        <>
                          <span className="text-blue input_unit" id="one_in">
                            mins
                          </span>
                        </>
                      )}
                      {formData.tech_interval_unit == "yrs/mos" && (
                        <>
                          <span className="text-blue input_unit" id="one_in">
                            mos
                          </span>
                        </>
                      )}
                      {formData.tech_interval_unit == "wks/days" && (
                        <>
                          <span className="text-blue input_unit" id="one_in">
                            days
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-4 ">
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_interval_unit"
                    id="tech_interval_unit"
                    value={formData.tech_interval_unit}
                    onChange={handleChange}
                  >
                    <option value="sec">sec</option>
                    <option value="mins">mins</option>
                    <option value="hrs">hrs</option>
                    <option value="days">days</option>
                    <option value="wks">wks</option>
                    <option value="mos">mos</option>
                    <option value="yrs">yrs</option>
                    <option value="mins/sec">mins/sec</option>
                    <option value="hrs/mins">hrs/mins</option>
                    <option value="yrs/mos">yrs/mos</option>
                    <option value="wks/days">wks/days</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_velocity" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (v):
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_velocity"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_velocity}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_velocity_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "km/s", value: "km/s" },
                        { label: "m/s", value: "m/s" },
                        { label: "mi/s", value: "mi/s" },
                        { label: "c", value: "c" },
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[90%] lg:w-[80%]  overflow-auto">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[3]} (Δt')
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_answer).toFixed(2)}{" "}
                                    {data?.payload?.tech_lang_keys[5]}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="col-12 mt-3 px-2">
                          <strong>
                            {data?.payload?.tech_lang_keys[3]} (Δt'){" "}
                            {data?.payload?.tech_lang_keys[4]}
                          </strong>
                        </p>
                        <div className="w-full md:w-[90%] lg:w-[80%] overflow-auto">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[6]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_answer / 60).toFixed(
                                      4
                                    )}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[7]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_answer / 3600).toFixed(
                                      4
                                    )}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[8]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_answer / 86400
                                    ).toFixed(4)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[9]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_answer / 604800
                                    ).toFixed(4)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[10]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_answer / 2629800
                                    ).toFixed(4)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[11]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_answer / 31557600
                                    ).toFixed(4)}
                                  </strong>
                                </td>
                              </tr>
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

export default TimeDilationCalculator;

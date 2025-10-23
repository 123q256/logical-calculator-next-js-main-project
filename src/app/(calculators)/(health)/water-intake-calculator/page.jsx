"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useWaterIntakeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DailyWaterIntakeCalculator = () => {
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

  console.log(data);

  const [formData, setFormData] = useState({
    tech_gender: "Male",
    tech_weight: "160",
    tech_unit: "kg",
    tech_activity: "0",
    tech_weather: "0.05",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWaterIntakeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_gender ||
      !formData.tech_weight ||
      !formData.tech_unit ||
      !formData.tech_activity ||
      !formData.tech_weather
    ) {
      setFormError("Please fill field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_gender: formData.tech_gender,
        tech_weight: formData.tech_weight,
        tech_unit: formData.tech_unit,
        tech_activity: formData.tech_activity,
        tech_weather: formData.tech_weather,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_gender: "Male",
      tech_weight: "160",
      tech_unit: "kg",
      tech_activity: "0",
      tech_weather: "0.05",
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
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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

          <div className="w-full lg:w-8/12 mx-auto">
            <div className="flex flex-wrap justify-center">
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 mt-5 w-full">
                <div className="w-full ">
                  <label htmlFor="tech_gender" className="label">
                    {data?.payload?.tech_lang_keys["gender"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_gender"
                      id="tech_gender"
                      value={formData.tech_gender}
                      onChange={handleChange}
                    >
                      <option value="Male">
                        {data?.payload?.tech_lang_keys["male"]}
                      </option>
                      <option value="Female">
                        {data?.payload?.tech_lang_keys["female"]}{" "}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label htmlFor="tech_weight" className="label">
                    {data?.payload?.tech_lang_keys["weight"]}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_weight"
                      step="any"
                      className="border mt-2 input border-gray-300 rounded-lg focus:ring-2 w-full "
                      value={formData.tech_weight}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-5"
                      onClick={toggleDropdown}
                    >
                      {formData.tech_unit} ▾
                    </label>
                    {dropdownVisible && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "kilograms (kg)", value: "kg" },
                          { label: "pounds (lbs)", value: "lbs" },
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5 w-full">
                <div className="w-full">
                  <label htmlFor="tech_activity" className="label">
                    {data?.payload?.tech_lang_keys["activity"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_activity"
                      id="tech_activity"
                      value={formData.tech_activity}
                      onChange={handleChange}
                    >
                      <option value="0">
                        {data?.payload?.tech_lang_keys["Sedentary"]}
                      </option>
                      <option value="0.1">
                        {data?.payload?.tech_lang_keys["Lightly"]}{" "}
                      </option>
                      <option value="0.2">
                        {data?.payload?.tech_lang_keys["Moderately"]}{" "}
                      </option>
                      <option value="0.4">
                        {data?.payload?.tech_lang_keys["Very"]}{" "}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="w-full ">
                  <label htmlFor="tech_weather" className="label">
                    {data?.payload?.tech_lang_keys["weather"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_weather"
                      id="tech_weather"
                      value={formData.tech_weather}
                      onChange={handleChange}
                    >
                      <option value="0.05">
                        {data?.payload?.tech_lang_keys["e_cool"]}
                      </option>
                      <option value="0">
                        {data?.payload?.tech_lang_keys["cool"]}{" "}
                      </option>
                      <option value="0.1">
                        {data?.payload?.tech_lang_keys["hot"]}{" "}
                      </option>
                      <option value="0.2">
                        {data?.payload?.tech_lang_keys["e_hot"]}{" "}
                      </option>
                    </select>
                  </div>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full rounded-xl  mt-4 result">
                      <div className="w-full">
                        <div className="bordered rounded-xl px-4 py-3 mt-2">
                          <strong>{data?.payload?.tech_lang_keys["1"]} </strong>
                          <strong className="text-[#119154] text-[20px]">
                            {Math.round(result?.tech_cups)}
                          </strong>
                          <strong> {data?.payload?.tech_lang_keys["2"]}</strong>
                        </div>

                        <div className="bordered rounded-xl px-4 py-3 mt-3">
                          <strong>Which is </strong>
                          <strong className="text-[#119154] text-[20px]">
                            {Number(
                              result?.tech_us_ounce * 1.043175556502
                            ).toFixed(1)}
                          </strong>
                          <strong> Ounces</strong>
                        </div>

                        <div className="w-full">
                          <div className="flex flex-wrap items-center">
                            <div className="w-full lg:w-1/4 mt-3 lg:pr-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["result"]}
                              </strong>
                            </div>
                            <div className="w-full lg:w-1/4 mt-3 px-2">
                              <div className="flex justify-between bordered rounded-xl px-4 py-3">
                                <strong className="pr-3">
                                  {Number(
                                    result?.tech_us_ounce * 29.5735
                                  ).toFixed(2)}
                                </strong>
                                <strong>
                                  {data?.payload?.tech_lang_keys["mili"]}
                                </strong>
                              </div>
                            </div>
                            <div className="w-full lg:w-1/4 mt-3 px-2">
                              <div className="flex justify-between bordered rounded-xl px-4 py-3">
                                <strong className="pr-3">
                                  {Number(
                                    result?.tech_us_ounce * 0.0295735
                                  ).toFixed(2)}
                                </strong>
                                <strong>
                                  {data?.payload?.tech_lang_keys["li"]}
                                </strong>
                              </div>
                            </div>
                            <div className="w-full lg:w-1/4 mt-3 px-2">
                              <div className="flex justify-between bordered rounded-xl px-4 py-3">
                                <strong className="pr-3">
                                  {Number(
                                    result?.tech_us_ounce * 0.125
                                  ).toFixed(2)}
                                </strong>
                                <strong>
                                  {data?.payload?.tech_lang_keys["cu"]}
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="mt-3">
                          <strong className="text-blue">
                            {data?.payload?.tech_lang_keys["12"]}
                          </strong>
                        </p>
                        <p>{data?.payload?.tech_lang_keys["13"]}</p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["14"]}
                        </p>
                        <div className="w-full overflow-auto mt-4">
                          <table className="w-full text-sm" cellspacing="0">
                            <tr className="bg-[#2845F5] text-white">
                              <td
                                rowSpan="2"
                                className="text-center rounded-l-xl border-r px-4 py-3"
                              >
                                {data?.payload?.tech_lang_keys["15"]}
                              </td>
                              <td
                                colspan="2"
                                className="border-r text-center px-4 py-3"
                              >
                                {data?.payload?.tech_lang_keys["16"]}
                              </td>
                              <td
                                colspan="2"
                                className="text-center rounded-tr-xl px-4 py-3"
                              >
                                {data?.payload?.tech_lang_keys["17"]}
                              </td>
                            </tr>
                            <tr className="bg-[#2845F5] text-white">
                              <td className="border-r px-4 py-3">
                                {data?.payload?.tech_lang_keys["18"]} (
                                {data?.payload?.tech_lang_keys["30"]})
                              </td>
                              <td className="border-r px-4 py-3">
                                {data?.payload?.tech_lang_keys["19"]} (
                                {data?.payload?.tech_lang_keys["30"]})
                              </td>
                              <td className="border-r px-4 py-3">
                                {data?.payload?.tech_lang_keys["18"]} (
                                {data?.payload?.tech_lang_keys["30"]})
                              </td>
                              <td className="rounded-br-xl px-4 py-3">
                                {data?.payload?.tech_lang_keys["19"]} (
                                {data?.payload?.tech_lang_keys["30"]})
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                0-6 mo.
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                0.68 ({data?.payload?.tech_lang_keys["20"]})
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                0.68 ({data?.payload?.tech_lang_keys["20"]})
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                0.70
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                0.70
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                6-12 mo.
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                0.80 - 1.00
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                0.64 - 0.80
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                0.80
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                0.80
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1-2 {data?.payload?.tech_lang_keys["21"]}
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.10 - 1.20
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                0.88 - 0.90
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                N/A
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                N/A
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2-3 {data?.payload?.tech_lang_keys["21"]}
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.30
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.00
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                N/A
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                N/A
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1-3 {data?.payload?.tech_lang_keys["21"]}
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                N/A
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                N/A
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.30
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                0.90
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                4-8 {data?.payload?.tech_lang_keys["21"]}
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.60
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.20
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.70
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.20
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                9-13 y. {data?.payload?.tech_lang_keys["22"]}
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2.10
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.60
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2.40
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.80
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                9-13 y. {data?.payload?.tech_lang_keys["23"]}
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.90
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.50
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2.10
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.60
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                {data?.payload?.tech_lang_keys["22"]} 14+ &amp;{" "}
                                {data?.payload?.tech_lang_keys["24"]}
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2.50
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2.00
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                3.30
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2.60
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                {data?.payload?.tech_lang_keys["23"]} 14+ &amp;{" "}
                                {data?.payload?.tech_lang_keys["25"]}
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2.00
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.60
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2.30
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.80
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                {data?.payload?.tech_lang_keys["26"]}
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2.30
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.84
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2.60
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                1.90
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                {data?.payload?.tech_lang_keys["27"]}
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2.60
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2.10
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                3.40
                              </td>
                              <td className="border-b border-[#99EA48]  px-3 py-2">
                                2.80
                              </td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2">
                                {data?.payload?.tech_lang_keys["28"]}
                              </td>
                              <td className="px-3 py-2">
                                {data?.payload?.tech_lang_keys["29"]}
                              </td>
                              <td className="px-3 py-2">
                                {data?.payload?.tech_lang_keys["29"]}
                              </td>
                              <td className="px-3 py-2">
                                {data?.payload?.tech_lang_keys["29"]}
                              </td>
                              <td className="px-3 py-2">
                                {data?.payload?.tech_lang_keys["29"]}
                              </td>
                            </tr>
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

export default DailyWaterIntakeCalculator;

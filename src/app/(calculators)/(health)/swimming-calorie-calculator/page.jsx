"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useSwimmingCalorieCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SwimmingCalorieCalculator = () => {
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
    tech_style: 13.8,
    tech_weight: 1.5,
    tech_weight_unit: "kg",
    tech_time: 30,
    tech_time_unit: "sec",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSwimmingCalorieCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_style ||
      !formData.tech_weight ||
      !formData.tech_weight_unit ||
      !formData.tech_time ||
      !formData.tech_time_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_style: formData.tech_style,
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
        tech_time: formData.tech_time,
        tech_time_unit: formData.tech_time_unit,
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
      tech_style: 13.8,
      tech_weight: 1.5,
      tech_weight_unit: "kg",
      tech_time: 30,
      tech_time_unit: "sec",
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

  //dropdown states 0
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_time_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 ">
                <label htmlFor="tech_style" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_style"
                    id="tech_style"
                    value={formData.tech_style}
                    onChange={handleChange}
                  >
                    <option value="13.8">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="9.5">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="4.8">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="10.3">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="5.3">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                    <option value="10">
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                    <option value="8.3">
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                    <option value="7">
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                    <option value="9.8">
                      {data?.payload?.tech_lang_keys["10"]}{" "}
                    </option>
                    <option value="3.5">
                      {data?.payload?.tech_lang_keys["11"]}{" "}
                    </option>
                    <option value="5.5">
                      {data?.payload?.tech_lang_keys["12"]}{" "}
                    </option>
                    <option value="9.8">
                      {data?.payload?.tech_lang_keys["13"]}{" "}
                    </option>
                    <option value="6.8">
                      {data?.payload?.tech_lang_keys["14"]}{" "}
                    </option>
                    <option value="4.5">
                      {data?.payload?.tech_lang_keys["15"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              <div className="col-span-6">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["16"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_weight"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_weight}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_weight_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kg", value: "kg" },
                        { label: "lb", value: "lb" },
                        { label: "stone", value: "stone" },
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
              <div className="col-span-6">
                <label htmlFor="tech_time" className="label">
                  {data?.payload?.tech_lang_keys["17"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_time"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_time}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_time_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "sec", value: "sec" },
                        { label: "min", value: "min" },
                        { label: "hrs", value: "hrs" },
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[60%] lg:w-[60%]  text-[18px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["18"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_cal_burned_per_min} kcal
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["19"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_total_cal_burned} kal
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

export default SwimmingCalorieCalculator;

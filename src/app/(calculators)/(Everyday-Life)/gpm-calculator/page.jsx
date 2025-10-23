"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useGpmCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GpmCalculator = () => {
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
    tech_volume: "5",
    tech_vol_unit: "ml",
    tech_time: "5",
    tech_time_unit: "days",
    tech_ans_unit: "27",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGpmCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_volume ||
      !formData.tech_vol_unit ||
      !formData.tech_time ||
      !formData.tech_time_unit ||
      !formData.tech_ans_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_volume: formData.tech_volume,
        tech_vol_unit: formData.tech_vol_unit,
        tech_time: formData.tech_time,
        tech_time_unit: formData.tech_time_unit,
        tech_ans_unit: formData.tech_ans_unit,
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
      tech_volume: "5",
      tech_vol_unit: "ml",
      tech_time: "5",
      tech_time_unit: "days",
      tech_ans_unit: "27",
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
    setFormData((prev) => ({ ...prev, tech_vol_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_volume" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_volume"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_volume}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_vol_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "mm³", value: "mm³" },
                        { label: "cm³", value: "cm³" },
                        { label: "dm³", value: "dm³" },
                        { label: "m³", value: "m³" },
                        { label: "cu in", value: "cu in" },
                        { label: "cu ft", value: "cu ft" },
                        { label: "cu yd", value: "cu yd" },
                        { label: "ml", value: "ml" },
                        { label: "cl", value: "cl" },
                        { label: "liters", value: "liters" },
                        { label: "US gal", value: "US gal" },
                        { label: "UK gal", value: "UK gal" },
                        { label: "US fl oz", value: "US fl oz" },
                        { label: "UK fl oz", value: "UK fl oz" },
                        { label: "cups", value: "cups" },
                        { label: "tbsp", value: "tbsp" },
                        { label: "tsp", value: "tsp" },
                        { label: "US qt", value: "US qt" },
                        { label: "UK qt", value: "UK qt" },
                        { label: "US pt", value: "US pt" },
                        { label: "UK pt", value: "UK pt" },
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
                <label htmlFor="tech_time" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
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
                        {
                          label: data?.payload?.tech_lang_keys["3"],
                          value: "days",
                        },
                        { label: "wks", value: "wks" },
                        { label: "mos", value: "mos" },
                        { label: "yrs", value: "yrs" },
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
              <div className="space-y-2 relative">
                <label htmlFor="tech_ans_unit" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_ans_unit"
                    id="tech_ans_unit"
                    value={formData.tech_ans_unit}
                    onChange={handleChange}
                  >
                    <option value="1">US gal/s</option>
                    <option value="2">US gal/min</option>
                    <option value="3">US gal/h</option>
                    <option value="4">US gal/day</option>
                    <option value="5">UK gal/s</option>
                    <option value="6">UK gal/min</option>
                    <option value="7">UK gal/h</option>
                    <option value="8">UK gal/day</option>
                    <option value="9">ft³/s</option>
                    <option value="10">ft³/min</option>
                    <option value="11">ft³/h</option>
                    <option value="12">ft³/day</option>
                    <option value="13">mm³/s</option>
                    <option value="14">m³/s</option>
                    <option value="15">m³/min</option>
                    <option value="16">m³/h</option>
                    <option value="17">m³/day</option>
                    <option value="18">L/s</option>
                    <option value="19">L/min</option>
                    <option value="20">L/h</option>
                    <option value="21">L/day</option>
                    <option value="22">ml/min</option>
                    <option value="23">ml/h</option>
                    <option value="24">US fl oz / min</option>
                    <option value="25">US fl oz / h</option>
                    <option value="26">UK fl oz / min</option>
                    <option value="27">UK fl oz / h</option>
                    <option value="28">US pt / min</option>
                    <option value="29">US pt / h</option>
                    <option value="30">UK pt / min</option>
                    <option value="31">UK pt / h</option>
                  </select>
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
                    <div className="w-full bg-light-blue p-3 rounded-lg mt-3">
                      <div className="flex justify-center mt-3">
                        <div className="text-center">
                          <p className="text-lg font-semibold px-3">
                            {data?.payload?.tech_lang_keys["4"]}
                          </p>
                          <p className="lg:text-4xl md:text-4xl text-2xl px-3 py-2 bg-[#2845F5] text-white inline-block rounded-lg my-3">
                            <strong className="text-blue">
                              {Number(result?.tech_main_ans).toFixed(6)} {""}
                            </strong>
                            <span className="text-base">
                              {result?.tech_answer_unit}
                            </span>
                          </p>
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

export default GpmCalculator;

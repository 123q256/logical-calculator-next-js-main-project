"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useEllipticalCalorieCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EllipticalCalorieCalculator = () => {
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
    tech_weight: "75",
    tech_weight_unit: "lbs",
    tech_hour: "9",
    tech_unit_hrs_min: "hrs/min",
    tech_min: "75",
    tech_unit_h: "sec",
    tech_time: "75",
    tech_unit_h_cm: "hrs/min",
    tech_effort_unit: "Vigorous (MET = 5.7)",
    tech_effort: "4.9",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEllipticalCalorieCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_weight ||
      !formData.tech_weight_unit ||
      !formData.tech_effort_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
        tech_hour: formData.tech_hour,
        tech_unit_hrs_min: formData.tech_unit_hrs_min,
        tech_min: formData.tech_min,
        tech_unit_h: formData.tech_unit_h,
        tech_time: formData.tech_time,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_effort_unit: formData.tech_effort_unit,
        tech_effort: formData.tech_effort,
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
      tech_weight: "75",
      tech_weight_unit: "lbs",
      tech_hour: "9",
      tech_unit_hrs_min: "hrs/min",
      tech_min: "75",
      tech_unit_h: "sec",
      tech_time: "75",
      tech_unit_h_cm: "hrs/min",
      tech_effort_unit: "Vigorous (MET = 5.7)",
      tech_effort: "4.9",
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

  //dropdown states 1
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 2
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h: unit,
      tech_unit_hrs_min: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 3
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: unit,
      tech_unit_hrs_min: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4 ">
              <div className="col-span-12 md:col-span-5 lg:col-span-5">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
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
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "pounds (lbs)", value: "lbs" },
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

              <input
                type="hidden"
                step="any"
                name="tech_unit_hrs_min"
                id="tech_unit_hrs_min"
                className="input my-2"
                aria-label="input"
                value={formData.tech_unit_hrs_min}
                onChange={handleChange}
              />

              {formData.tech_unit_hrs_min == "hrs/min" && (
                <>
                  <div className="col-span-6 md:col-span-2 lg:col-span-3">
                    <label htmlFor="tech_hour" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_hour"
                        id="tech_hour"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_hour}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-4 lg:col-span-4  ">
                    <label htmlFor="tech_min" className="label">
                      &nbsp;
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_min"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_min}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_unit_h} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "seconds (sec)", value: "sec" },
                            { label: "minutes (min)", value: "min" },
                            { label: "hours (hrs)", value: "hrs" },
                            {
                              label: "hours / minute (hrs/min)",
                              value: "hrs/min",
                            },
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
              {(formData.tech_unit_hrs_min == "sec" ||
                formData.tech_unit_hrs_min == "min" ||
                formData.tech_unit_hrs_min == "in" ||
                formData.tech_unit_hrs_min == "hrs") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 h_cm">
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
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_unit_h_cm} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "seconds (sec)", value: "sec" },
                            { label: "minutes (min)", value: "min" },
                            { label: "hours (hrs)", value: "hrs" },
                            {
                              label: "hours / minute (hrs/min)",
                              value: "hrs/min",
                            },
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

              <div className="col-span-12 md:col-span-5 lg:col-span-5">
                <label htmlFor="tech_effort_unit" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_effort_unit"
                    id="tech_effort_unit"
                    value={formData.tech_effort_unit}
                    onChange={handleChange}
                  >
                    <option value="Light (MET = 4.6)">Light (MET = 4.6)</option>
                    <option value="Moderate (MET = 4.9)">
                      Moderate (MET = 4.9)
                    </option>
                    <option value="Vigorous (MET = 5.7)">
                      Vigorous (MET = 5.7)
                    </option>
                    <option value="Custom (enter MET value)">
                      Custom (enter MET value)
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_effort_unit == "Custom (enter MET value)" && (
                <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                  <label htmlFor="tech_effort" className="label">
                    {data?.payload?.tech_lang_keys["4"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_effort"
                      id="tech_effort"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_effort}
                      onChange={handleChange}
                    />
                    <span className="input_unit">%</span>
                  </div>
                </div>
              )}
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
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[80%] flex flex-md-row justify-between">
                          <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                            <div className="col-span-12 md:col-span-5 lg:col-span-5">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["5"]}
                                </strong>
                              </p>
                              <p>
                                <strong className="text-[#119154] text-[32px]">
                                  {Number(result?.tech_answer).toFixed(2)}
                                </strong>
                                <span className="text-[#2845F5] px-1">
                                  kcal
                                </span>
                              </p>
                            </div>
                            <div className="col-span-1 border-r-2  me-3 hidden lg:block md:block">
                              &nbsp;
                            </div>
                            <div className="col-span-12 md:col-span-5 lg:col-span-5">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["6"]}
                                </strong>
                              </p>
                              <p>
                                <strong className="text-[#119154] text-[32px]">
                                  {Number(result?.tech_sub_answer).toFixed(2)}
                                </strong>
                                <span className="text-[#2845F5] px-1">
                                  kcal
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <p>
                          <strong>{data?.payload?.tech_lang_keys["7"]}</strong>
                        </p>
                        <p className="py-1">
                          {data?.payload?.tech_lang_keys["8"]}.
                        </p>
                        <p className="py-1">
                          {data?.payload?.tech_lang_keys["9"]} ={" "}
                          {data?.payload?.tech_lang_keys["12"]} (in sec)*{" "}
                          {data?.payload?.tech_lang_keys["3"]} * 3.5 *{" "}
                          {data?.payload?.tech_lang_keys["1"]} (in kg) / (200 *
                          60)
                        </p>
                        <p className="py-1">
                          {data?.payload?.tech_lang_keys["9"]} ={" "}
                          {result?.tech_time} * {formData?.tech_effort} * 3.5 *{" "}
                          {Number(result?.tech_weight).toFixed(2)} / (200 * 60)
                        </p>
                        <p className="py-1">
                          {data?.payload?.tech_lang_keys["9"]} ={" "}
                          {Number(result?.tech_answer).toFixed(2)}kcal
                        </p>
                        <p className="py-1">
                          {data?.payload?.tech_lang_keys["10"]}
                        </p>
                        <p className="py-1">
                          {data?.payload?.tech_lang_keys["11"]} = 60 *{" "}
                          {data?.payload?.tech_lang_keys["3"]} * 3.5 *{" "}
                          {data?.payload?.tech_lang_keys["1"]} (in kg) / 200
                        </p>
                        <p className="py-1">
                          {data?.payload?.tech_lang_keys["11"]} = 60 *{" "}
                          {formData?.tech_effort} * 3.5 *{" "}
                          {Number(result?.tech_weight).toFixed(2)} / 200
                        </p>
                        <p className="py-1">
                          {data?.payload?.tech_lang_keys["11"]} ={" "}
                          {Number(result?.tech_sub_answer).toFixed(2)}kcal
                        </p>
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

export default EllipticalCalorieCalculator;

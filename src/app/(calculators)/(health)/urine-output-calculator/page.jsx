"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useUrineOutputCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const UrineOutputCalculator = () => {
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
    tech_weight: "57",
    tech_weight_unit: "g",
    tech_time_min: "10",
    tech_time_unit: "min/sec",
    tech_time_sec: "10",
    tech_unit_h: "sec",
    tech_time: "27",
    tech_unit_h_cm: "min/sec",
    tech_urine: "37",
    tech_urine_unit: "cm³",
    tech_fluid: "47",
    tech_fluid_unit: "cl",
    tech_output_unit: "dag",
    tech_balance_unit: "dm³",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useUrineOutputCalculatorMutation();

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
      !formData.tech_urine ||
      !formData.tech_urine_unit ||
      !formData.tech_fluid ||
      !formData.tech_fluid_unit ||
      !formData.tech_output_unit ||
      !formData.tech_balance_unit
    ) {
      setFormError("Please fill in filed.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
        tech_time_min: formData.tech_time_min,
        tech_time_unit: formData.tech_time_unit,
        tech_time_sec: formData.tech_time_sec,
        tech_unit_h: formData.tech_unit_h,
        tech_time: formData.tech_time,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_urine: formData.tech_urine,
        tech_urine_unit: formData.tech_urine_unit,
        tech_fluid: formData.tech_fluid,
        tech_fluid_unit: formData.tech_fluid_unit,
        tech_output_unit: formData.tech_output_unit,
        tech_balance_unit: formData.tech_balance_unit,
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
      tech_weight: "57",
      tech_weight_unit: "g",
      tech_time_min: "10",
      tech_time_unit: "min/sec",
      tech_time_sec: "10",
      tech_unit_h: "sec",
      tech_time: "27",
      tech_unit_h_cm: "min/sec",
      tech_urine: "37",
      tech_urine_unit: "cm³",
      tech_fluid: "47",
      tech_fluid_unit: "cl",
      tech_output_unit: "dag",
      tech_balance_unit: "dm³",
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
    setFormData((prev) => ({ ...prev, tech_urine_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fluid_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states 4
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h: unit,
      tech_time_unit: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states 5
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: unit,
      tech_time_unit: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
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
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_weight_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "grams (g)", value: "g" },
                        { label: "decagrams (dag)", value: "dag" },
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "ounces (oz)", value: "oz" },
                        { label: "pounds (lbs)", value: "lbs" },
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
              <input
                type="hidden"
                step="any"
                name="tech_time_unit"
                id="tech_time_unit"
                className="input my-2"
                aria-label="input"
                value={formData.tech_time_unit}
                onChange={handleChange}
              />
              {(formData.tech_time_unit == "min/sec" ||
                formData.tech_time_unit == "hrs/min") && (
                <>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3 ">
                    <label htmlFor="tech_time_min" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_time_min"
                        id="tech_time_min"
                        className="input my-1"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_time_min}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-4 lg:col-span-4 ">
                    <label htmlFor="tech_time_sec" className="label">
                      &nbsp;
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_time_sec"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_time_sec}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_unit_h} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "seconds (sec)", value: "sec" },
                            { label: "minutes (min)", value: "min" },
                            { label: "hours (hrs)", value: "hrs" },
                            { label: "day", value: "day" },
                            {
                              label: "minutes / second (min/sec)",
                              value: "min/sec",
                            },
                            {
                              label: "hours / minute (hrs/min)",
                              value: "hrs/min",
                            },
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
                </>
              )}
              {(formData.tech_time_unit == "sec" ||
                formData.tech_time_unit == "min" ||
                formData.tech_time_unit == "hrs" ||
                formData.tech_time_unit == "day") && (
                <>
                  <div className="col-span-12 md:col-span-7 lg:col-span-7">
                    <label htmlFor="tech_time" className="label">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                      {formData.tech_time_unit == "sec" ? (
                        <span className="text-blue height_unit">(sec)</span>
                      ) : formData.tech_time_unit == "min" ? (
                        <span className="text-blue height_unit">(min)</span>
                      ) : formData.tech_time_unit == "hrs" ? (
                        <span className="text-blue height_unit">(hrs)</span>
                      ) : formData.tech_time_unit == "day" ? (
                        <span className="text-blue height_unit">(day)</span>
                      ) : null}
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
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_unit_h_cm} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "seconds (sec)", value: "sec" },
                            { label: "minutes (min)", value: "min" },
                            { label: "hours (hrs)", value: "hrs" },
                            { label: "day", value: "day" },
                            {
                              label: "minutes / second (min/sec)",
                              value: "min/sec",
                            },
                            {
                              label: "hours / minute (hrs/min)",
                              value: "hrs/min",
                            },
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
                </>
              )}

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_urine" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_urine"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_urine}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_urine_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "mm³", value: "mm³" },
                        { label: "cm³", value: "cm³" },
                        { label: "dm³", value: "dm³" },
                        { label: "cu in", value: "cu in" },
                        { label: "ml", value: "ml" },
                        { label: "cl", value: "cl" },
                        { label: "liters", value: "liters" },
                        { label: "us gal", value: "us gal" },
                        { label: "uk gal", value: "uk gal" },
                        { label: "us fl oz", value: "us fl oz" },
                        { label: "uk fl oz", value: "uk fl oz" },
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
                <label htmlFor="tech_fluid" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_fluid"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_fluid}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_fluid_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "mm³", value: "mm³" },
                        { label: "cm³", value: "cm³" },
                        { label: "dm³", value: "dm³" },
                        { label: "cu in", value: "cu in" },
                        { label: "ml", value: "ml" },
                        { label: "cl", value: "cl" },
                        { label: "liters", value: "liters" },
                        { label: "us gal", value: "us gal" },
                        { label: "uk gal", value: "uk gal" },
                        { label: "us fl oz", value: "us fl oz" },
                        { label: "uk fl oz", value: "uk fl oz" },
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
                <label htmlFor="tech_output_unit" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_output_unit"
                    id="tech_output_unit"
                    value={formData.tech_output_unit}
                    onChange={handleChange}
                  >
                    <option value="g">g</option>
                    <option value="dag">dag</option>
                    <option value="kg">kg</option>
                    <option value="oz">oz</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_balance_unit" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_balance_unit"
                    id="tech_balance_unit"
                    value={formData.tech_balance_unit}
                    onChange={handleChange}
                  >
                    <option value="mm³">mm³</option>
                    <option value="cm³">cm³</option>
                    <option value="dm³">dm³</option>
                    <option value="cu in">cu in</option>
                    <option value="ml">ml</option>
                    <option value="cl">cl</option>
                    <option value="liters">liters</option>
                    <option value="us gal">us gal</option>
                    <option value="uk gal">uk gal</option>
                    <option value="us fl oz">us fl oz</option>
                    <option value="uk fl oz">uk fl oz</option>
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  mt-3">
                      <div className="w-full mt-2">
                        <div className="w-full border-b pb-3">
                          <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-12 md:col-span-5 lg:col-span-5">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["7"]}:
                                </strong>
                              </p>
                              <p>
                                <strong className="text-[#119154] text-[30px]">
                                  {Number(result?.tech_answer).toFixed(2)}
                                </strong>
                                <span className="text-[#2845F5] px-1 text-[18px]">
                                  (ml/{formData?.tech_output_unit}/hr)
                                </span>
                              </p>
                            </div>
                            <div className="col-span-1 border-r hidden mf:block lg:block">
                              &nbsp;
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-6">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["8"]}:
                                </strong>
                              </p>
                              <p>
                                <strong className="text-[#119154] text-[30px]">
                                  {Number(result?.tech_sec_answer).toFixed(2)}
                                </strong>
                                <span className="text-[#2845F5] px-1 text-[18px]">
                                  ({formData?.tech_balance_unit})
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full mt-3 ">
                          <p className="text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["9"]}:
                            </strong>
                          </p>
                          <p>
                            <strong>
                              {data?.payload?.tech_lang_keys["10"]}.
                            </strong>
                          </p>
                          <p>
                            {data?.payload?.tech_lang_keys["11"]} ={" "}
                            {data?.payload?.tech_lang_keys["3"]} / (
                            {data?.payload?.tech_lang_keys["1"]} ×{" "}
                            {data?.payload?.tech_lang_keys["2"]})
                          </p>
                          <p>
                            {data?.payload?.tech_lang_keys["11"]} ={" "}
                            {formData?.tech_urine} / ({formData?.tech_weight} ×{" "}
                            {result?.tech_time_ans})
                          </p>
                          <p>
                            {data?.payload?.tech_lang_keys["11"]} ={" "}
                            {Number(result?.tech_answer).toFixed(2)}
                          </p>
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["12"]}.
                            </strong>
                          </p>
                          <p>
                            {data?.payload?.tech_lang_keys["8"]} ={" "}
                            {data?.payload?.tech_lang_keys["4"]} -{" "}
                            {data?.payload?.tech_lang_keys["3"]}
                          </p>
                          <p>
                            {data?.payload?.tech_lang_keys["8"]} ={" "}
                            {formData?.tech_urine} - {formData?.tech_fluid}
                          </p>
                          <p>
                            {data?.payload?.tech_lang_keys["8"]} ={" "}
                            {Number(result?.tech_sec_answer).toFixed(2)}
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

export default UrineOutputCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDosageCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DosageCalculator = () => {
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
    tech_w: 56,
    tech_w1: "kg",
    tech_d: 34,
    tech_d1: "kg",
    tech_f: "2h",
    tech_mc: 17,
    tech_mc1: "µg/mL",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDosageCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_w ||
      !formData.tech_w1 ||
      !formData.tech_d ||
      !formData.tech_d1 ||
      !formData.tech_f
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_w: formData.tech_w,
        tech_w1: formData.tech_w1,
        tech_d: formData.tech_d,
        tech_d1: formData.tech_d1,
        tech_f: formData.tech_f,
        tech_mc: formData.tech_mc,
        tech_mc1: formData.tech_mc1,
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
      tech_w: 56,
      tech_w1: "kg",
      tech_d: 34,
      tech_d1: "kg",
      tech_f: "2h",
      tech_mc: 17,
      tech_mc1: "µg/mL",
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
    setFormData((prev) => ({ ...prev, tech_w1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_d1: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_mc1: unit }));
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

          <div className="lg:w-[90%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_w" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_w"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_w}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_w1} ▾
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_d" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_d"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_d}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_d1} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "grams per liter (g/L)", value: "µg/kg" },
                        {
                          label: "milligrams per liter (mg/mL)",
                          value: "mg/kg",
                        },
                        { label: "micrograms per liter (µg/L)", value: "g/kg" },
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
                <label htmlFor="tech_f" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_f"
                    id="tech_f"
                    value={formData.tech_f}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                    <option value="4h">
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                    <option value="3h">
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                    <option value="2h">
                      {data?.payload?.tech_lang_keys["10"]}{" "}
                    </option>
                    <option value="h">
                      {data?.payload?.tech_lang_keys["1"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_mc" className="label">
                  {data?.payload?.tech_lang_keys["12"]} (
                  {data?.payload?.tech_lang_keys["17"]})
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_mc"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_mc}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_mc1} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "grams per liter (g/L)", value: "g/L" },
                        {
                          label: "milligrams per liter (mg/mL)",
                          value: "mg/mL",
                        },
                        { label: "micrograms per liter (µg/L)", value: "µg/L" },
                        {
                          label: "milligrams per milliliter (mg/mL)",
                          value: "mg/mL",
                        },
                        {
                          label: "micrograms per milliliter (µg/mL)",
                          value: "µg/mL",
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full mt-2">
                        <div className="grid grid-cols-12 bordered bg-sky my-1 rounded-lg">
                          <p className="col-span-12 md:col-span-6 flex items-center p-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["13"]}
                            </strong>
                          </p>
                          <p className="col-span-12 md:col-span-6 p-3">
                            <strong className="text-[#119154] lg:text-[22px] md:text-[18px] text-[20px]">
                              {result?.tech_tdose} mg
                            </strong>
                            <span className="text-blue ms-2">
                              ({result?.tech_ug} µg, {result?.tech_gr} g)
                            </span>
                          </p>
                        </div>
                        {/* First Dose Block */}
                        {result?.tech_dose && (
                          <div className="grid grid-cols-12 bordered bg-sky my-1 rounded-lg">
                            <p className="col-span-12 md:col-span-6 flex items-center p-3">
                              <strong>
                                {data?.payload?.tech_lang_keys?.["14"]}
                              </strong>
                            </p>
                            <p className="col-span-12 md:col-span-6 p-3">
                              <strong className="text-[#119154] lg:text-[22px] md:text-[18px] text-[20px]">
                                {result.tech_dose} mg
                              </strong>
                            </p>
                          </div>
                        )}

                        {/* Liquid Dose Block */}
                        {result?.tech_lq_dose && (
                          <>
                            <div className="grid grid-cols-12 bordered bg-sky my-1 rounded-lg">
                              <p className="col-span-12 md:col-span-6 flex items-center p-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys?.["15"]}
                                </strong>
                              </p>
                              <p className="col-span-12 md:col-span-6 p-3">
                                <strong className="text-[#119154] lg:text-[22px] md:text-[18px] text-[20px]">
                                  {result.tech_lq_dose} ml
                                </strong>
                                <span className="text-blue ms-2">
                                  ({result?.tech_g} L)
                                </span>
                              </p>
                            </div>

                            {/* Liquid Dose 1 Block */}
                            {result?.tech_lq_dose1 && (
                              <div className="grid grid-cols-12 bordered bg-sky my-1 rounded-lg">
                                <p className="col-span-12 md:col-span-6 flex items-center p-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys?.["16"]}
                                  </strong>
                                </p>
                                <p className="col-span-12 md:col-span-6 p-3">
                                  <strong className="text-[#119154] lg:text-[22px] md:text-[18px] text-[20px]">
                                    {result.tech_lq_dose1} ml
                                  </strong>
                                </p>
                              </div>
                            )}
                          </>
                        )}
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

export default DosageCalculator;

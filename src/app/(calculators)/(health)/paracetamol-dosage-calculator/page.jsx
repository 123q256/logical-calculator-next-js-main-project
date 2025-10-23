"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useParacetamolDosageCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ParacetamolDosageCalculator = () => {
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
    tech_age: Number(4),
    tech_age_unit: "weeks", // weeks
    tech_weight: 20,
    tech_weight_unit: "lbs", // lbs
    tech_med_type: "2",
    tech_ss: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useParacetamolDosageCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_age ||
      !formData.tech_age_unit ||
      !formData.tech_weight ||
      !formData.tech_weight_unit ||
      !formData.tech_med_type
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_age: formData.tech_age,
        tech_age_unit: formData.tech_age_unit,
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
        tech_med_type: formData.tech_med_type,
        tech_ss: formData.tech_ss,
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
      tech_age: 4,
      tech_age_unit: "weeks", // weeks
      tech_weight: 20,
      tech_weight_unit: "kg", // lbs
      tech_med_type: "2",
      tech_ss: 7,
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
    setFormData((prev) => ({ ...prev, tech_age_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-lg-6 px-2 pe-lg-4">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_age"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_age}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_age_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "weeks", value: "weeks" },
                        { label: "months", value: "months" },
                        { label: "years", value: "years" },
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

              <div className="col-lg-6 px-2 pe-lg-4">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
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
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_weight_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "pounds (lbs)", value: "lbs" },
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

              <div className="col-lg-6 px-2 pe-lg-4">
                <label htmlFor="tech_med_type" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_med_type"
                    id="tech_med_type"
                    value={formData.tech_med_type}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["5"]} (120 mg/5 mL)
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["6"]} (250 mg/5 mL)
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["7"]} (500 mg)
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_med_type == "4" && (
                <div className="col-lg-6 px-2 ps-lg-4 ">
                  <label htmlFor="tech_ss" className="label">
                    {data?.payload?.tech_lang_keys["4"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_ss"
                      id="tech_ss"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_ss}
                      onChange={handleChange}
                    />
                    <span className="input_unit">mg/mL</span>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {result?.tech_dose != null && (
                          <p>
                            <strong className="text-[#119154] text-[32px]">
                              {Number(result.tech_dose).toFixed(2)}
                            </strong>
                            <span className="text-[#119154] text-[20px]">
                              {result.tech_med_type === "1" ||
                              result.tech_med_type === "2"
                                ? "(ml)"
                                : "(tabl)"}
                            </span>
                          </p>
                        )}

                        {result?.tech_line != null && (
                          <p>
                            <strong>{result.tech_line}</strong>
                          </p>
                        )}

                        {result?.tech_solution_amount != null && (
                          <p>
                            <strong className="text-[#119154] text-[32px]">
                              {Number(result.tech_solution_amount).toFixed(2)}
                            </strong>
                            <span className="text-[#119154] text-[20px]">
                              (mL)
                            </span>
                          </p>
                        )}

                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["11"]}.
                        </p>
                        <p className="mt-2">
                          <span className="">
                            {data?.payload?.tech_lang_keys["12"]}{" "}
                            <u>{data?.payload?.tech_lang_keys["13"]}</u>{" "}
                            {data?.payload?.tech_lang_keys["15"]} is{" "}
                          </span>
                          <strong className="text-[#119154]">
                            {Number(result?.tech_fifteen).toFixed(2)}
                          </strong>
                          <strong>
                            <span> (mg)</span>
                          </strong>
                        </p>
                        <p className="mt-2">
                          <span className="">
                            {data?.payload?.tech_lang_keys["12"]}{" "}
                            <u>{data?.payload?.tech_lang_keys["14"]}</u>{" "}
                            {data?.payload?.tech_lang_keys["15"]} is{" "}
                          </span>
                          <strong className="text-[#119154]">
                            {Number(result?.tech_sixty).toFixed(2)}
                          </strong>
                          <strong>
                            <span> (mg)</span>
                          </strong>
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

export default ParacetamolDosageCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useEfficiencyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EfficiencyCalculator = () => {
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
    tech_solve: "1", // "1" for efficiency, "2" for input energy, others for output energy
    tech_en_in: "12", // Energy Input value
    tech_en_in_unit: "kcal", // Units: same as above
    tech_en_ou: "12", // Energy Output value
    tech_en_ou_unit: "kWh", // Units: "J", "kJ", "MJ", "Wh", "kWh", "ft-lbs", "kcal", etc.
    tech_en_ef: "7",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEfficiencyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_solve) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_solve: formData.tech_solve,
        tech_en_in: formData.tech_en_in,
        tech_en_in_unit: formData.tech_en_in_unit,
        tech_en_ou: formData.tech_en_ou,
        tech_en_ou_unit: formData.tech_en_ou_unit,
        tech_en_ef: formData.tech_en_ef,
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
      tech_solve: "1", // "1" for efficiency, "2" for input energy, others for output energy
      tech_en_in: "12", // Energy Input value
      tech_en_in_unit: "kcal", // Units: same as above
      tech_en_ou: "12", // Energy Output value
      tech_en_ou_unit: "kWh", // Units: "J", "kJ", "MJ", "Wh", "kWh", "ft-lbs", "kcal", etc.
      tech_en_ef: "7",
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
    setFormData((prev) => ({ ...prev, tech_en_in_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_en_ou_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_solve" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_solve"
                    id="tech_solve"
                    value={formData.tech_solve}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {(formData.tech_solve == "1" || formData.tech_solve == "3") && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="en_in"
                  >
                    <label htmlFor="tech_en_in" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_en_in"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_en_in}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_en_in_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "J", value: "J" },
                            { label: "kJ", value: "kJ" },
                            { label: "MJ", value: "MJ" },
                            { label: "Wh", value: "Wh" },
                            { label: "kWh", value: "kWh" },
                            { label: "ft-lbs", value: "ft-lbs" },
                            { label: "kcal", value: "kcal" },
                            { label: "eV", value: "eV" },
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
              {(formData.tech_solve == "1" || formData.tech_solve == "2") && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="en_ou"
                  >
                    <label htmlFor="tech_en_ou" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_en_ou"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_en_ou}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_en_ou_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "J", value: "J" },
                            { label: "kJ", value: "kJ" },
                            { label: "MJ", value: "MJ" },
                            { label: "Wh", value: "Wh" },
                            { label: "kWh", value: "kWh" },
                            { label: "ft-lbs", value: "ft-lbs" },
                            { label: "kcal", value: "kcal" },
                            { label: "eV", value: "eV" },
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
              {(formData.tech_solve == "2" || formData.tech_solve == "3") && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="en_ef"
                  >
                    <label htmlFor="tech_en_ef" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_en_ef"
                        id="tech_en_ef"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_en_ef}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="text-center">
                          <p className="text-[20px]">
                            <strong>
                              {formData?.tech_solve === "1"
                                ? data?.payload?.tech_lang_keys[2]
                                : formData?.tech_solve === "2"
                                ? data?.payload?.tech_lang_keys[3]
                                : data?.payload?.tech_lang_keys[4]}
                            </strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="md:text-[25px] text-[18px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong className="text-white">
                                {Number(result?.tech_answer).toFixed(4)}{" "}
                                {formData?.tech_solve === "2" ||
                                formData?.tech_solve === "3"
                                  ? "J"
                                  : "%"}
                              </strong>
                            </p>
                          </div>
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

export default EfficiencyCalculator;

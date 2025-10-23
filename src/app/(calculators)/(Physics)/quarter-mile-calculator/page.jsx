"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useQuarterMileCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const QuarterMileCalculator = () => {
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
    tech_equation: "1", //  1 2 3
    tech_selection: "1", //  1 2 3
    tech_power: "2",
    tech_power_unit: "watts (W)",
    tech_powers: "2",
    tech_sample_unit: "Wheel horsepower",
    tech_weight: "2",
    tech_weight_unit: "(t)",
    tech_trap: "23",
    tech_et: "2",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useQuarterMileCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_equation || !formData.tech_selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_equation: formData.tech_equation,
        tech_selection: formData.tech_selection,
        tech_power: formData.tech_power,
        tech_power_unit: formData.tech_power_unit,
        tech_powers: formData.tech_powers,
        tech_sample_unit: formData.tech_sample_unit,
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
        tech_trap: formData.tech_trap,
        tech_et: formData.tech_et,
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
      tech_equation: "1", //  1 2 3
      tech_selection: "1", //  1 2 3
      tech_power: "2",
      tech_power_unit: "watts (W)",
      tech_powers: "2",
      tech_sample_unit: "Wheel horsepower",
      tech_weight: "2",
      tech_weight_unit: "(t)",
      tech_trap: "23",
      tech_et: "2",
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
    setFormData((prev) => ({ ...prev, tech_power_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sample_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-4">
              <div className="col-span-12 equation">
                <label htmlFor="tech_equation" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_equation"
                    id="tech_equation"
                    value={formData.tech_equation}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 selection">
                <label htmlFor="tech_selection" className="label">
                  {data?.payload?.tech_lang_keys["17"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_selection"
                    id="tech_selection"
                    value={formData.tech_selection}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_selection == "1" && (
                <>
                  {(formData.tech_equation == "1" ||
                    formData.tech_equation == "2") && (
                    <>
                      <div className="col-span-12  power_units">
                        <label htmlFor="tech_power" className="label">
                          {data?.payload?.tech_lang_keys["15"]} (HP)
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_power"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_power}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_power_unit} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "watts (W)", value: "watts (W)" },
                                {
                                  label: "kilowatts (kW)",
                                  value: "kilowatts (kW)",
                                },
                                {
                                  label: "megawatts (mW)",
                                  value: "megawatts (mW)",
                                },
                                {
                                  label: "mechanical horsepowers hp (l)",
                                  value: "mechanical horsepowers hp (l)",
                                },
                                {
                                  label: "metric horsepowers hp (M)",
                                  value: "metric horsepowers hp (M)",
                                },
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
                  {formData.tech_equation == "3" && (
                    <>
                      <div className="col-span-12 sample_units ">
                        <label htmlFor="tech_powers" className="label">
                          {data?.payload?.tech_lang_keys["15"]} (HP)
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_powers"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_powers}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_sample_unit} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                {
                                  label: data?.payload?.tech_lang_keys["18"],
                                  value: data?.payload?.tech_lang_keys["18"],
                                },
                                {
                                  label: data?.payload?.tech_lang_keys["19"],
                                  value: data?.payload?.tech_lang_keys["19"],
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
                </>
              )}

              <div className="col-span-12 weight">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["16"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_weight"
                    step="any"
                    min="1"
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
                        { label: "(kg)", value: "(kg)" },
                        { label: "(t)", value: "(t)" },
                        { label: "(lb)", value: "(lb)" },
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

              {formData.tech_selection == "2" && (
                <>
                  <div className="col-span-12 mph ">
                    <label htmlFor="tech_trap" className="label">
                      {data?.payload?.tech_lang_keys["10"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_trap"
                        id="tech_trap"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_trap}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_selection == "3" && (
                <>
                  <div className="col-span-12 et ">
                    <label htmlFor="tech_et" className="label">
                      {data?.payload?.tech_lang_keys["11"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_et"
                        id="tech_et"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_et}
                        onChange={handleChange}
                      />
                      <span className="input_unit">sec</span>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                        <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                          <tbody>
                            {result?.tech_one_eight && result?.tech_sixty && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      60 {data?.payload?.tech_lang_keys["12"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_sixty).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      1/8 {data?.payload?.tech_lang_keys["13"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_one_eight).toFixed(2)}
                                  </td>
                                </tr>
                              </>
                            )}

                            {result?.tech_elapsed_time && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    1/4 {data?.payload?.tech_lang_keys["14"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_elapsed_time).toFixed(2)}{" "}
                                  (sec)
                                </td>
                              </tr>
                            )}

                            {result?.tech_trap_speed && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    1/4 {data?.payload?.tech_lang_keys["13"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_trap_speed).toFixed(2)}{" "}
                                  (mph)
                                </td>
                              </tr>
                            )}

                            {result?.tech_final_value && (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    1/4 {data?.payload?.tech_lang_keys["13"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_final_value).toFixed(2)}{" "}
                                  (lb)
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
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

export default QuarterMileCalculator;

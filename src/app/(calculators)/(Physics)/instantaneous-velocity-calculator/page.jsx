"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useInstantaneousVelocityCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const InstantaneousVelocityCalculator = () => {
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
    tech_i_d: "1",
    tech_i_d_unit: "cm",
    tech_f_d: "3",
    tech_f_d_unit: "cm",
    tech_i_tt: "10",
    tech_i_tt_unit: "sec",
    tech_f_tt: "7",
    tech_f_tt_unit: "sec",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useInstantaneousVelocityCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_i_d ||
      !formData.tech_f_d ||
      !formData.tech_i_tt ||
      !formData.tech_f_tt
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_i_d: formData.tech_i_d,
        tech_i_d_unit: formData.tech_i_d_unit,
        tech_f_d: formData.tech_f_d,
        tech_f_d_unit: formData.tech_f_d_unit,
        tech_i_tt: formData.tech_i_tt,
        tech_i_tt_unit: formData.tech_i_tt_unit,
        tech_f_tt: formData.tech_f_tt,
        tech_f_tt_unit: formData.tech_f_tt_unit,
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
      tech_i_d: "1",
      tech_i_d_unit: "cm",
      tech_f_d: "3",
      tech_f_d_unit: "cm",
      tech_i_tt: "10",
      tech_i_tt_unit: "sec",
      tech_f_tt: "7",
      tech_f_tt_unit: "sec",
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
    setFormData((prev) => ({ ...prev, tech_i_d_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_f_d_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_i_tt_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_f_tt_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };
  const conversionFactors = {
    "m/s": 1,
    "ft/s": 3.281,
    "km/s": 0.001,
    "km/h": 3.6,
    "mi/s": 0.000621,
    mph: 2.237,
  };

  const [selectedUnit, setSelectedUnit] = useState("m/s");
  const [initialValue, setInitialValue] = useState(0);
  const [convertedValue, setConvertedValue] = useState(0);

  // When result is available, update initialValue and convertedValue
  useEffect(() => {
    if (result?.tech_iv !== undefined) {
      const iv = parseFloat(result.tech_iv);
      setInitialValue(iv);
      setConvertedValue((iv * conversionFactors[selectedUnit]).toFixed(7));
    }
  }, [result]);

  // When unit is changed
  useEffect(() => {
    const newVal = (initialValue * conversionFactors[selectedUnit]).toFixed(7);
    setConvertedValue(newVal);
  }, [selectedUnit, initialValue]);

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
          <div className="lg:w-[60%] md:w-[85%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6" id="i_d">
                <label htmlFor="tech_i_d" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (x₁):
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_i_d"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_i_d}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_i_d_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "km", value: "km" },
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "yd", value: "yd" },
                        { label: "mi", value: "mi" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6" id="f_d">
                <label htmlFor="tech_f_d" className="label">
                  {data?.payload?.tech_lang_keys["3"]} (x₂):
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_f_d"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_f_d}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_f_d_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "km", value: "km" },
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "yd", value: "yd" },
                        { label: "mi", value: "mi" },
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
              <div
                className="col-span-12 md:col-span-6 lg:col-span-6"
                id="i_tt"
              >
                <label htmlFor="tech_i_tt" className="label">
                  {data?.payload?.tech_lang_keys["4"]} (t₁):
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_i_tt"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_i_tt}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_i_tt_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "sec", value: "sec" },
                        { label: "min", value: "min" },
                        { label: "hrs", value: "hrs" },
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
              <div
                className="col-span-12 md:col-span-6 lg:col-span-6"
                id="f_tt"
              >
                <label htmlFor="tech_f_tt" className="label">
                  {data?.payload?.tech_lang_keys["5"]} (t₂):
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_f_tt"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_f_tt}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_f_tt_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "sec", value: "sec" },
                        { label: "min", value: "min" },
                        { label: "hrs", value: "hrs" },
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="text-center">
                          <p className="text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["iv"]} (V
                              <sub>int</sub>)
                            </strong>
                          </p>
                          <div className="text-[21px] bg-sky bordered px-3 py-2 rounded-lg flex flex-col sm:flex-row justify-center items-center gap-2 my-3">
                            <strong className="text-blue" id="circle_result">
                              {convertedValue} {selectedUnit}
                            </strong>

                            <div className="mt-2 w-[80px]">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_circle_unit_result"
                                id="tech_circle_unit_result"
                                value={selectedUnit}
                                onChange={(e) =>
                                  setSelectedUnit(e.target.value)
                                }
                              >
                                {Object.keys(conversionFactors).map((unit) => (
                                  <option key={unit} value={unit}>
                                    {unit}
                                  </option>
                                ))}
                              </select>
                            </div>
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

export default InstantaneousVelocityCalculator;

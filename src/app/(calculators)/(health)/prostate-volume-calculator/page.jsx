"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useProstateVolumeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ProstateVolumeCalculator = () => {
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
    tech_length: 3,
    tech_length_unit: "cm",
    tech_width: 5,
    tech_width_unit: "cm",
    tech_height: 7,
    tech_height_unit: "cm",
    tech_psa: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useProstateVolumeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_length ||
      !formData.tech_length_unit ||
      !formData.tech_width ||
      !formData.tech_width_unit ||
      !formData.tech_height ||
      !formData.tech_height_unit
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_height: formData.tech_height,
        tech_height_unit: formData.tech_height_unit,
        tech_psa: formData.tech_psa,
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
      tech_length: 9,
      tech_length_unit: "km",
      tech_width: 6,
      tech_width_unit: "in",
      tech_height: 22,
      tech_height_unit: "m",
      tech_psa: 27,
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
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_width_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_height_unit: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_length" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_length_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "millimeters (mm)", value: "mm" },
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "decimeters (dm)", value: "dm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "miles (mi)", value: "mi" },
                        { label: "inches (in)", value: "in" },
                        { label: "feet (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
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
                <label htmlFor="tech_width" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_width"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_width}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_width_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "millimeters (mm)", value: "mm" },
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "decimeters (dm)", value: "dm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "miles (mi)", value: "mi" },
                        { label: "inches (in)", value: "in" },
                        { label: "feet (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
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
                <label htmlFor="tech_height" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_height"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_height}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_height_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "millimeters (mm)", value: "mm" },
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "decimeters (dm)", value: "dm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "miles (mi)", value: "mi" },
                        { label: "inches (in)", value: "in" },
                        { label: "feet (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
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

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_psa" className="label">
                  PSA {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_psa"
                    id="tech_psa"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_psa}
                    onChange={handleChange}
                  />
                  <span className="input_unit">ng/ml</span>
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
                    <div className="w-full p-3 mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[80%] flex flex-wrap justify-between">
                          <div className="px-3 mt-3">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys[5]} cm³
                              </strong>
                            </p>
                            <p className="text-[28px]">
                              <strong className="text-green-500">
                                {Number(result?.tech_answer).toFixed(2)} cm³
                              </strong>
                            </p>
                            {result.tech_answer2 > 0 && (
                              <>
                                <p>
                                  <strong>
                                    PSA {data?.payload?.tech_lang_keys[6]}
                                  </strong>
                                </p>
                                <p className="text-[28px]">
                                  <strong className="text-green-500">
                                    {Number(result?.tech_answer2).toFixed(2)}{" "}
                                    ng/ml²
                                  </strong>
                                </p>
                              </>
                            )}
                          </div>
                          <div className="border-r hidden md:block lg:block">
                            &nbsp;
                          </div>

                          <div className="px-3 mt-3">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys[7]} cm³
                              </strong>
                            </p>
                            <p className="text-[28px]">
                              <strong className="text-green-500">
                                {Number(result?.tech_answer22).toFixed(2)} cm³
                              </strong>
                            </p>
                            {result.tech_answer23 > 0 && (
                              <>
                                <p>
                                  <strong>
                                    PSA {data?.payload?.tech_lang_keys[6]}
                                  </strong>
                                </p>
                                <p className="text-[28px]">
                                  <strong className="text-green-500">
                                    {Number(result.tech_answer23).toFixed(2)}{" "}
                                    ng/ml²
                                  </strong>
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap text-center justify-between mt-3">
                          <div className="px-3 mt-3">
                            <p>{data?.payload?.tech_lang_keys[5]} in³</p>
                            <p>
                              <strong>
                                {Number(result?.tech_answer / 16.387).toFixed(
                                  2
                                )}{" "}
                                in³
                              </strong>
                            </p>
                          </div>
                          <div className="border-r hidden md:block lg:block">
                            &nbsp;
                          </div>
                          <div className="px-3 mt-3">
                            <p>{data?.payload?.tech_lang_keys[7]} in³</p>
                            <p>
                              <strong>
                                {Number(result?.tech_answer22 / 16.387).toFixed(
                                  2
                                )}{" "}
                                in³"{" "}
                              </strong>
                            </p>
                          </div>
                          <div className="border-r hidden md:block lg:block">
                            &nbsp;
                          </div>
                          <div className="px-3 mt-3">
                            <p>{data?.payload?.tech_lang_keys[5]} mm³</p>
                            <p>
                              <strong>
                                {Number(result?.tech_answer * 100).toFixed(2)}{" "}
                                mm³
                              </strong>
                            </p>
                          </div>
                          <div className="border-r hidden md:block lg:block">
                            &nbsp;
                          </div>
                          <div className="px-3 mt-3">
                            <p>{data?.payload?.tech_lang_keys[7]} mm³</p>
                            <p>
                              <strong>
                                {Number(result?.tech_answer22 * 100).toFixed(2)}{" "}
                                mm³{" "}
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

export default ProstateVolumeCalculator;

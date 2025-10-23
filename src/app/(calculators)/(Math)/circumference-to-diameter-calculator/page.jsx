"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useCircumferenceToDiameterCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CircumferenceToDiameterCalculator = () => {
  //location
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

  // calculaote detail page
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

  // calculaote api result
  const [
    calculateLovePercentage,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCircumferenceToDiameterCalculatorMutation();

  // form data and validation
  const [formData, setFormData] = useState({
    tech_conversionType: "circumferenceToDiameter",
    tech_value: "100",
    tech_unit: "in",
    // tech_1: "100",
    // tech_2: "in",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_conversionType ||
      !formData.tech_value ||
      !formData.tech_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateLovePercentage({
        tech_conversionType: formData.tech_conversionType,
        tech_value: Number(formData.tech_value),
        tech_unit: formData.tech_unit,
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
      tech_value: "50",
      tech_unit: "cm",
      tech_conversionType: "circumferenceToDiameter",
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
  // const [zaindropdownVisible, setZainDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible(false);
  };

  // const setZainUnitHandler = (unit) => {
  //   setFormData((prev) => ({ ...prev, tech_2: unit }));
  //   setZainDropdownVisible(false);
  // };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // const zaintoggleDropdown = () => {
  //   setZainDropdownVisible(!zaindropdownVisible);
  // };

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

          <div className="lg:w-[40%] md:w-[40%] mx-auto">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <p>
                  <label
                    className="pe-2 cursor-pointer"
                    htmlFor="circumferenceToDiameter"
                  >
                    <input
                      type="radio"
                      name="tech_conversionType"
                      value="circumferenceToDiameter"
                      id="circumferenceToDiameter"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={
                        formData.tech_conversionType ===
                        "circumferenceToDiameter"
                      }
                    />
                    <span>{data?.payload?.tech_lang_keys["1"]}</span>
                  </label>
                </p>

                <p className="my-2">
                  <label
                    className="cursor-pointer"
                    htmlFor="diameterToCircumference"
                  >
                    <input
                      type="radio"
                      name="tech_conversionType"
                      className="mr-2 border cursor-pointer"
                      value="diameterToCircumference"
                      id="diameterToCircumference"
                      onChange={handleChange}
                      checked={
                        formData.tech_conversionType ===
                        "diameterToCircumference"
                      }
                    />
                    <span>{data?.payload?.tech_lang_keys["2"]}</span>
                  </label>
                </p>
              </div>
              <div className="col-span-12">
                <label htmlFor="value" className="label" id="textChanged">
                  {formData.tech_conversionType === "circumferenceToDiameter"
                    ? data?.payload?.tech_lang_keys["3"]
                    : data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_value"
                    step="any"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                    value={formData.tech_value}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
                        { label: "miles (mi)", value: "mi" },
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[60%] mt-2 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {formData.tech_conversionType ===
                                    "circumferenceToDiameter"
                                      ? data?.payload?.tech_lang_keys["4"]
                                      : data?.payload?.tech_lang_keys["3"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Math.round(result?.tech_result * 1000) /
                                    1000}{" "}
                                  {result?.tech_unit}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <p className="col-12 pb-2 mt-3">
                          <strong>{data?.payload?.tech_lang_keys["5"]}</strong>
                        </p>

                        <div className="w-full md:w-[80%] lg:w-[60%] mt-2 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["6"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Math.round(
                                      result?.tech_result * 10 * 1000
                                    ) / 1000}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["7"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Math.round(
                                      result?.tech_result * 0.01 * 1000
                                    ) / 1000}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["8"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {(Math.round(result?.tech_result * 10) /
                                      10) *
                                      0.00001}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["9"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Math.round(
                                      result?.tech_result * 0.3937 * 100
                                    ) / 100}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["10"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Math.round(
                                      result?.tech_result * 0.0328084 * 1000
                                    ) / 1000}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Math.round(
                                      result?.tech_result * 0.0109361 * 100000
                                    ) / 100000}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["12"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Math.round(
                                      result?.tech_result *
                                        0.0000062137 *
                                        1000000
                                    ) / 1000000}
                                  </strong>
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

export default CircumferenceToDiameterCalculator;

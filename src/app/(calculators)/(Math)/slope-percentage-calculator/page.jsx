"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useSlopePercentageCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SlopePercentageCalculator = () => {
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
    tech_rise: "6",
    tech_run: "6",
    tech_rise_unit: "m",
    tech_run_unit: "m",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSlopePercentageCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_rise: formData.tech_rise,
        tech_run: formData.tech_run,
        tech_rise_unit: formData.tech_rise_unit,
        tech_run_unit: formData.tech_run_unit,
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
      tech_rise: "6",
      tech_run: "6",
      tech_rise_unit: "m",
      tech_run_unit: "m",
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
    setFormData((prev) => ({ ...prev, tech_rise_unit: unit }));
    setDropdownVisible(false);
  };
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_run_unit: unit }));
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

          <div className="lg:w-[40%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_rise" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_rise"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_rise}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_rise_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "millimeters (mm)", value: "mm" },
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
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
              <div className="col-span-12">
                <label htmlFor="tech_run" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_run"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_run}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_run_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "millimeters (mm)", value: "mm" },
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
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
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["3"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(
                                    result?.tech_slopeAngleDegrees
                                  ).toFixed(2)}
                                  °
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["4"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_slopePercentage).toFixed(
                                    2
                                  )}
                                  %
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="my-2 text-[16px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["5"]}
                            </strong>
                          </p>
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["6"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Number(
                                      result?.tech_slopeAngleDegrees * 0.017453
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["7"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Number(
                                      result?.tech_slopeAngleDegrees * 1.111,
                                      2
                                    )}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["8"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Number(
                                      result?.tech_slopeAngleDegrees * 0.005556
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["14"]}
                            </strong>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["10"]}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[11]} = (
                            <span className="quadratic_fraction">
                              <span className="num">Rise</span>
                              <span>Run</span>
                            </span>
                            ) × 100%
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[11]} = (
                            <span className="quadratic_fraction">
                              <span className="num">{formData?.tech_rise}</span>
                              <span>{formData?.tech_run}</span>
                            </span>
                            ) × 100%
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[11]} ={" "}
                            {Number(result?.tech_slopePercentage).toFixed(2)}%
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["12"]}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[13]} = atan × (
                            <span className="quadratic_fraction">
                              <span className="num">Rise</span>
                              <span>Run</span>
                            </span>
                            )
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[13]} = atan × (
                            <span className="quadratic_fraction">
                              <span className="num">{formData?.tech_rise}</span>
                              <span>{formData?.tech_run}</span>
                            </span>
                            )
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[13]} ={" "}
                            {Number(result?.tech_slopeAngle).toFixed(5)}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[13]} = rad2deg(
                            {data?.payload?.tech_lang_keys["13"]})
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[13]} = rad2deg(
                            {Number(result?.tech_slopeAngle).toFixed(5)})
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[13]} ={" "}
                            {Number(result?.tech_slopeAngleDegrees).toFixed(2)}°
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

export default SlopePercentageCalculator;

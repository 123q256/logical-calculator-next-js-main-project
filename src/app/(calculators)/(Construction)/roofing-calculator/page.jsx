"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useRoofingCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RoofingCalculator = () => {
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
    tech_length: "4",
    tech_length_units: "cm",
    tech_width: "8",
    tech_width_units: "cm",
    tech_pitch: "6",
    tech_price: "5",
    tech_price_units: "mm²",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRoofingCalculatorMutation();

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
      !formData.tech_length_units ||
      !formData.tech_width ||
      !formData.tech_width_units ||
      !formData.tech_pitch ||
      !formData.tech_price ||
      !formData.tech_price_units
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_length: formData.tech_length,
        tech_length_units: formData.tech_length_units,
        tech_width: formData.tech_width,
        tech_width_units: formData.tech_width_units,
        tech_pitch: formData.tech_pitch,
        tech_price: formData.tech_price,
        tech_price_units: formData.tech_price_units,
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
      tech_length: "4",
      tech_length_units: "cm",
      tech_width: "8",
      tech_width_units: "cm",
      tech_pitch: "6",
      tech_price: "5",
      tech_price_units: "mm²",
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
    setFormData((prev) => ({ ...prev, tech_length_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_width_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_price_units: unit }));
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="">
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
                    {formData.tech_length_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
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
              <div className="">
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
                    {formData.tech_width_units} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
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
              <div className=" relative">
                <label htmlFor="tech_pitch" className="label">
                  Insert Value
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_pitch"
                    id="tech_pitch"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_pitch}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>
              <div className="">
                <label htmlFor="tech_price" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_price"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_price}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_price_units} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "mm²", value: "mm²" },
                        { label: "cm²", value: "cm²" },
                        { label: "m²", value: "m²" },
                        { label: "in²", value: "in²" },
                        { label: "ft²", value: "ft²" },
                        { label: "yd²", value: "yd²" },
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 rounded-lg result_calculator space-y-6 result">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 rounded-lg result_calculator space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center ">
                    <div className="w-full md:w-[50%] lg:w-[50%] my-2">
                      <div className="w-full overflow-auto text-[16px]">
                        <table className="w-full">
                          <tbody>
                            <tr>
                              <td width="70%" className="border-b py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["5"]}
                                </strong>
                              </td>
                              <td className="border-b py-2">
                                {Number(result?.tech_roof_area).toFixed(2)} m²
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["6"]}
                                </strong>
                              </td>
                              <td className="border-b py-2">
                                {currency.symbol}{" "}
                                {Number(result?.tech_cost).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["7"]}
                                </strong>
                              </td>
                              <td className="border-b py-2">
                                {Number(result?.tech_house_area).toFixed(2)} m²
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["8"]}
                                </strong>
                              </td>
                              <td className="border-b py-2">
                                {Number(result?.tech_pitch_deg).toFixed(2)} deg
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["9"]}
                                </strong>
                              </td>
                              <td className="border-b py-2">
                                {Number(result?.tech_slop).toFixed(2)} :12
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p className="mt-3 mb-1">
                          {data?.payload?.tech_lang_keys["10"]}
                        </p>
                        <table className="w-full">
                          <tbody>
                            <tr>
                              <td width="70%" className="border-b py-2">
                                mm²
                              </td>
                              <td className="border-b py-2">
                                {Number(
                                  result?.tech_roof_area * 1000000
                                ).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">cm²</td>
                              <td className="border-b py-2">
                                {Number(result?.tech_roof_area * 10000).toFixed(
                                  2
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">in²</td>
                              <td className="border-b py-2">
                                {Number(
                                  result?.tech_roof_area * 1550.0031
                                ).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">ft²</td>
                              <td className="border-b py-2">
                                {Number(
                                  result?.tech_roof_area * 10.7639
                                ).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">yd²</td>
                              <td className="border-b py-2">
                                {Number(
                                  result?.tech_roof_area * 1.19599
                                ).toFixed(2)}
                              </td>
                            </tr>
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

export default RoofingCalculator;

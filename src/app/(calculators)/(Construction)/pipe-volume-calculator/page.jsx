"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePipeVolumeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PipeVolumeCalculator = () => {
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
    tech_inner_diameter: "9",
    tech_inner_diameter_unit: "cm",
    tech_length: "12",
    tech_length_unit: "cm",
    tech_density: "12",
    tech_density_unit: "kg/m³",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePipeVolumeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_inner_diameter ||
      !formData.tech_inner_diameter_unit ||
      !formData.tech_length ||
      !formData.tech_length_unit ||
      !formData.tech_density ||
      !formData.tech_density_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_inner_diameter: formData.tech_inner_diameter,
        tech_inner_diameter_unit: formData.tech_inner_diameter_unit,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_density: formData.tech_density,
        tech_density_unit: formData.tech_density_unit,
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
      tech_inner_diameter: "9",
      tech_inner_diameter_unit: "cm",
      tech_length: "12",
      tech_length_unit: "cm",
      tech_density: "12",
      tech_density_unit: "kg/m³",
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
    setFormData((prev) => ({ ...prev, tech_inner_diameter_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_density_unit: unit }));
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1   gap-4">
              <p className="px-2">{data?.payload?.tech_lang_keys["1"]}</p>
            </div>
            <div className="grid grid-cols-12 mt-3   gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_inner_diameter" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_inner_diameter"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_inner_diameter}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_inner_diameter_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "yard (yd)", value: "yd" },
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_length" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
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
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_length_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "yard (yd)", value: "yd" },
                        { label: "miles (mi)", value: "mi" },
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_density" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_density"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_density}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_density_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kg/m³", value: "kg/m³" },
                        { label: "kg/dm³", value: "kg/dm³" },
                        { label: "kg/L", value: "kg/L" },
                        { label: "g/mL", value: "g/mL" },
                        { label: "g/cm³", value: "g/cm³" },
                        { label: "oz/cu in", value: "oz/cu in" },
                        { label: "lb/cu in", value: "lb/cu in" },
                        { label: "lb/cu ft", value: "lb/cu ft" },
                        { label: "lb/US gal", value: "lb/US gal" },
                        { label: "g/L", value: "g/L" },
                        { label: "g/dL", value: "g/dL" },
                        { label: "mg/L", value: "mg/L" },
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  mt-3">
                      <div className="lg:w-[60%] md:w-[60%] gap-2">
                        <div className="md:col-span-6 overflow-auto lg:text-[18px] md:text-[18px] text-[16px]">
                          <table className="w-full">
                            <tr>
                              <td className="border-b py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["5"]} :
                                </strong>
                              </td>
                              <td className="border-b py-2">
                                {Number(result?.tech_volume).toFixed(2)} (cubic
                                inch)
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2" className="pt-2">
                                {data?.payload?.tech_lang_keys["6"]}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">
                                {data?.payload?.tech_lang_keys["5"]} :
                              </td>
                              <td className="border-b py-2">
                                {Number(result?.tech_volume / 231).toFixed(3)}{" "}
                                <span>(gallons)</span>
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">
                                {data?.payload?.tech_lang_keys["5"]} :
                              </td>
                              <td className="border-b py-2">
                                {Number(result?.tech_volume / 16390).toFixed(3)}{" "}
                                <span>(cu mm)</span>
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">
                                {data?.payload?.tech_lang_keys["5"]} :
                              </td>
                              <td className="border-b py-2">
                                {Number(result?.tech_volume / 61.0237).toFixed(
                                  3
                                )}{" "}
                                <span>(liters)</span>
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["7"]} :
                                </strong>
                              </td>
                              <td className="border-b py-2">
                                {Number(result?.tech_weight).toFixed(2)} (lb)
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2" className="pt-2">
                                {data?.payload?.tech_lang_keys["6"]}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">
                                {data?.payload?.tech_lang_keys["7"]} :
                              </td>
                              <td className="border-b py-2">
                                {Number(result?.tech_weight / 2.205).toFixed(3)}{" "}
                                <span>(kg)</span>
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">
                                {data?.payload?.tech_lang_keys["7"]} :
                              </td>
                              <td className="border-b py-2">
                                {Number(result?.tech_weight * 453600).toFixed(
                                  3
                                )}{" "}
                                <span>(mg)</span>
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">
                                {data?.payload?.tech_lang_keys["7"]} :
                              </td>
                              <td className="border-b py-2">
                                {Number(result?.tech_weight * 45.36).toFixed(3)}{" "}
                                <span>(dag)</span>
                              </td>
                            </tr>
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

export default PipeVolumeCalculator;

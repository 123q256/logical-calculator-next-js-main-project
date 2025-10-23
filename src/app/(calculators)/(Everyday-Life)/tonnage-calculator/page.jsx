"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTonnageCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TonnageCalculator = () => {
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
    tech_material: 1762,
    tech_unit_weight: 1762,
    tech_length: 11,
    tech_length_units: "cm",
    tech_width: 12,
    tech_width_units: "yd",
    tech_depth: 12,
    tech_depth_units: "in",
    tech_price_per: 12,
    tech_price_per_units: "lb",
    tech_wastage: 4,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTonnageCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tech_material") {
      setFormData((prevData) => ({
        ...prevData,
        tech_material: value,
        tech_unit_weight: value, // 👈 dropdown value ko input mein daalna
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_material || !formData.tech_unit_weight) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_material: formData.tech_material,
        tech_unit_weight: formData.tech_unit_weight,
        tech_length: formData.tech_length,
        tech_length_units: formData.tech_length_units,
        tech_width: formData.tech_width,
        tech_width_units: formData.tech_width_units,
        tech_depth: formData.tech_depth,
        tech_depth_units: formData.tech_depth_units,
        tech_price_per: formData.tech_price_per,
        tech_price_per_units: formData.tech_price_per_units,
        tech_wastage: formData.tech_wastage,
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
      tech_material: 1762,
      tech_unit_weight: 1762,
      tech_length: 11,
      tech_length_units: "cm",
      tech_width: 12,
      tech_width_units: "yd",
      tech_depth: 12,
      tech_depth_units: "in",
      tech_price_per: 12,
      tech_price_per_units: "lb",
      tech_wastage: 4,
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
    setFormData((prev) => ({ ...prev, tech_depth_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_price_per_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_material" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_material"
                    id="tech_material"
                    value={formData.tech_material}
                    onChange={handleChange}
                  >
                    <option value="12243">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2243">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="1466">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="1710">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="1625">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="721">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="1554">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="1872">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="1320">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="1602">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="1476">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="1720">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="1710">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="1642">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="2643">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="1482">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="1398">
                      {data?.payload?.tech_lang_keys["18"]}
                    </option>
                    <option value="1788">
                      {data?.payload?.tech_lang_keys["19"]}
                    </option>
                    <option value="1426">
                      {data?.payload?.tech_lang_keys["20"]}
                    </option>
                    <option value="1602">
                      {data?.payload?.tech_lang_keys["21"]}
                    </option>
                    <option value="1762">
                      {data?.payload?.tech_lang_keys["22"]}
                    </option>
                    <option value="1682">
                      {data?.payload?.tech_lang_keys["23"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_unit_weight" className="label">
                  {data?.payload?.tech_lang_keys["23"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_unit_weight"
                    id="tech_unit_weight"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_unit_weight}
                    onChange={handleChange}
                  />
                  <span className="input_unit">kg/m³</span>
                </div>
              </div>
              <p className="col-span-12">
                <strong>{data?.payload?.tech_lang_keys["24"]}</strong>
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_length" className="label">
                  {data?.payload?.tech_lang_keys["25"]}
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
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "yd", value: "yd" },
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
                  {data?.payload?.tech_lang_keys["26"]}
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
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "yd", value: "yd" },
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
                <label htmlFor="tech_depth" className="label">
                  {data?.payload?.tech_lang_keys["27"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_depth"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_depth}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_depth_units} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "yd", value: "yd" },
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
              <p className="col-span-12">
                <strong>{data?.payload?.tech_lang_keys["28"]}</strong>
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_price_per" className="label">
                  {data?.payload?.tech_lang_keys["29"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_price_per"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_price_per}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_price_per_units} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kg", value: "kg" },
                        { label: "t", value: "t" },
                        { label: "lb", value: "lb" },
                        { label: "st", value: "st" },
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

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_wastage" className="label">
                  {data?.payload?.tech_lang_keys["30"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_wastage"
                    id="tech_wastage"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_wastage}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
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
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[80%]  text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["31"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_tonnage} t
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["32"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_area} m²
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["33"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_volume} m³
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["34"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_weight_needed} t
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["35"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol} {result?.tech_total_cost}{" "}
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

export default TonnageCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTopsoilCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TopSoilCalculator = () => {
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
    tech_calculation_unit: "1", // 1 2
    tech_length: "15",
    tech_length_unit: "m",
    tech_width: "24",
    tech_width_unit: "m",
    tech_depth: "24",
    tech_depth_unit: "m",
    tech_area: "15",
    tech_area_unit: "sq ft",
    tech_purchase_unit: "2",
    tech_bag_size: "5",
    tech_bag_size_unit: "cu ft",
    tech_price_per_bag: "12",
    tech_price_per_ton: "12",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTopsoilCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculation_unit || !formData.tech_length) {
      setFormError("Please fill in input.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculation_unit: formData.tech_calculation_unit,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_depth: formData.tech_depth,
        tech_depth_unit: formData.tech_depth_unit,
        tech_area: formData.tech_area,
        tech_area_unit: formData.tech_area_unit,
        tech_purchase_unit: formData.tech_purchase_unit,
        tech_bag_size: formData.tech_bag_size,
        tech_bag_size_unit: formData.tech_bag_size_unit,
        tech_price_per_bag: formData.tech_price_per_bag,
        tech_price_per_ton: formData.tech_price_per_ton,
        tech_submit: formData.tech_submit,
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
      tech_calculation_unit: "1", // 1 2
      tech_length: "15",
      tech_length_unit: "m",
      tech_width: "24",
      tech_width_unit: "m",
      tech_depth: "24",
      tech_depth_unit: "m",
      tech_area: "15",
      tech_area_unit: "sq ft",
      tech_purchase_unit: "2",
      tech_bag_size: "5",
      tech_bag_size_unit: "cu ft",
      tech_price_per_bag: "12",
      tech_price_per_ton: "12",
      tech_submit: "calculate",
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
    setFormData((prev) => ({ ...prev, tech_depth_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_bag_size_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
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
            <div className="grid grid-cols-1  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_calculation_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calculation_unit"
                    id="tech_calculation_unit"
                    value={formData.tech_calculation_unit}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]} &{" "}
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["4"]} &{" "}
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 mt-3 lg:grid-cols-2 md:grid-cols-2  gap-4">
              {formData.tech_calculation_unit == "1" && (
                <>
                  <div className="space-y-2 length">
                    <label htmlFor="tech_length" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
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
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "km", value: "km" },
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
              {formData.tech_calculation_unit == "1" && (
                <>
                  <div className="space-y-2  width">
                    <label htmlFor="tech_width" className="label">
                      {data?.payload?.tech_lang_keys["7"]} /{" "}
                      {data?.payload?.tech_lang_keys["8"]}
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
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "km", value: "km" },
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

              {(formData.tech_calculation_unit == "1" ||
                formData.tech_calculation_unit == "2") && (
                <>
                  <div className="space-y-2  depth">
                    <label htmlFor="tech_depth" className="label">
                      {data?.payload?.tech_lang_keys["3"]} /{" "}
                      {data?.payload?.tech_lang_keys["9"]}
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
                        {formData.tech_depth_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "km", value: "km" },
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
                </>
              )}
              {formData.tech_calculation_unit == "2" && (
                <>
                  <div className="space-y-2  area">
                    <label htmlFor="tech_area" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_area"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_area}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_area_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "sq yd", value: "sq yd" },
                            { label: "sq ft", value: "sq ft" },
                            { label: "sq m", value: "sq m" },
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
                </>
              )}
            </div>

            <p className="mt-2">
              <strong>
                {data?.payload?.tech_lang_keys["10"]} (
                {data?.payload?.tech_lang_keys["11"]})
              </strong>
            </p>
            <div className="grid grid-cols-1 mt-3 lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_purchase_unit" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_purchase_unit"
                    id="tech_purchase_unit"
                    value={formData.tech_purchase_unit}
                    onChange={handleChange}
                  >
                    <option value="1">In Bags</option>
                    <option value="2">In Bulk</option>
                  </select>
                </div>
              </div>
              {formData.tech_purchase_unit == "1" && (
                <>
                  <div className="space-y-2  area  ">
                    <label htmlFor="tech_bag_size" className="label">
                      {data?.payload?.tech_lang_keys["12"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_bag_size"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_bag_size}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_bag_size_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cu ft", value: "cu ft" },
                            { label: "cu yd", value: "cu yd" },
                            { label: "cu m", value: "cu m" },
                            { label: "lbs", value: "lbs" },
                            { label: "kg", value: "kg" },
                            { label: "liters", value: "liters" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler4(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 cost ">
                    <label htmlFor="tech_price_per_bag" className="label">
                      {data?.payload?.tech_lang_keys["13"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_price_per_bag"
                        id="tech_price_per_bag"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_price_per_bag}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_purchase_unit == "2" && (
                <>
                  <div className="space-y-2  ton_cost ">
                    <label htmlFor="tech_price_per_ton" className="label">
                      {data?.payload?.tech_lang_keys["14"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_price_per_ton"
                        id="tech_price_per_ton"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_price_per_ton}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  p-3 radius-10 mt-3">
                      <div className="w-full my-2">
                        <p className="font-s-20">
                          <strong>{data?.payload?.tech_lang_keys[15]}</strong>
                        </p>
                        <div className="col-lg-9 text-[16px] overflow-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[16]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_calculation} (ft³)
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[17]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_calculation * 0.037037}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[18]} (
                                    {data?.payload?.tech_lang_keys[19]}) :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {parseFloat(
                                    result?.tech_calculation * 0.037037
                                  ).toFixed(2)}{" "}
                                  -{" "}
                                  {parseFloat(
                                    result?.tech_calculation * 0.037037 * 1.3
                                  ).toFixed(2)}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[20]} (wet) :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {parseFloat(
                                    result?.tech_calculation * 0.037037 * 1.5
                                  ).toFixed(2)}{" "}
                                  -{" "}
                                  {parseFloat(
                                    result?.tech_calculation * 0.037037 * 1.7
                                  ).toFixed(2)}
                                </td>
                              </tr>

                              {result?.tech_calculate_cost && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[21]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_calculate_cost}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_number_of_bags && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[22]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_number_of_bags}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_total_cost && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[23]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    ${result.tech_total_cost}
                                    <span className="text-[16px] italic">
                                      (${result.tech_price_in_ton}{" "}
                                      {data?.payload?.tech_lang_keys[24]})
                                    </span>
                                  </td>
                                </tr>
                              )}

                              {result?.tech_bag1 && (
                                <tr>
                                  <td className="border-b py-2">
                                    0.75 cu.ft.{" "}
                                    {data?.payload?.tech_lang_keys[25]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_bag1}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_bag2 && (
                                <tr>
                                  <td className="border-b py-2">
                                    1 cu.ft. {data?.payload?.tech_lang_keys[25]}{" "}
                                    :
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_bag2}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_bag3 && (
                                <tr>
                                  <td className="border-b py-2">
                                    1.5 cu.ft.{" "}
                                    {data?.payload?.tech_lang_keys[25]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_bag3}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_bag4 && (
                                <tr>
                                  <td className="border-b py-2">
                                    2 cu.ft. {data?.payload?.tech_lang_keys[25]}{" "}
                                    :
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_bag4}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_bag5 && (
                                <tr>
                                  <td className="border-b py-2">
                                    3 cu.ft. {data?.payload?.tech_lang_keys[25]}{" "}
                                    :
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_bag5}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_bag6 && (
                                <tr>
                                  <td className="border-b py-2">
                                    25 quart {data?.payload?.tech_lang_keys[25]}{" "}
                                    :
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_bag6}
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

export default TopSoilCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useMetalRoofCostCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MetalRoofCostCalculator = () => {
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
    tech_type: "yes", //yes  no
    tech_r_length: Number(100),
    tech_rl_units: "ft",
    tech_r_width: Number(120),
    tech_rw_units: "ft",
    tech_roof_pitch: "1:12",
    tech_p_length: Number(16),
    tech_pl_units: "ft",
    tech_p_width: Number(16),
    tech_pw_units: "ft",
    tech_cost: Number(3),
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMetalRoofCostCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_type ||
      !formData.tech_r_length ||
      !formData.tech_rl_units ||
      !formData.tech_r_width ||
      !formData.tech_rw_units ||
      !formData.tech_pl_units ||
      !formData.tech_p_width ||
      !formData.tech_p_width ||
      !formData.tech_pw_units ||
      !formData.tech_cost
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_r_length: formData.tech_r_length,
        tech_rl_units: formData.tech_rl_units,
        tech_r_width: formData.tech_r_width,
        tech_rw_units: formData.tech_rw_units,
        tech_roof_pitch: formData.tech_roof_pitch,
        tech_p_length: formData.tech_p_length,
        tech_pl_units: formData.tech_pl_units,
        tech_p_width: formData.tech_p_width,
        tech_pw_units: formData.tech_pw_units,
        tech_cost: formData.tech_cost,
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
      tech_type: "yes", //yes  no
      tech_r_length: Number(100),
      tech_rl_units: "ft",
      tech_r_width: Number(120),
      tech_rw_units: "ft",
      tech_roof_pitch: "1:12",
      tech_p_length: Number(16),
      tech_pl_units: "ft",
      tech_p_width: Number(16),
      tech_pw_units: "ft",
      tech_cost: Number(3),
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
    setFormData((prev) => ({ ...prev, tech_rl_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_rw_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pl_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pw_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
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
            <div className="grid grid-cols-12 mt-2 gap-4">
              <div className="col-span-12 relative">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type"
                    id="tech_type"
                    value={formData.tech_type}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1  mt-3 gap-4">
              <p className="mt-1">{data?.payload?.tech_lang_keys["2"]}</p>
            </div>
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_r_length" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_r_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_r_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_rl_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "in)", value: "in" },
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
              <div className="col-span-6">
                <label htmlFor="tech_r_width" className="label">
                  {data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_r_width"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_r_width}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_rw_units} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "in)", value: "in" },
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
              {formData.tech_type == "no" && (
                <>
                  <div className="col-span-6  noclass">
                    <label htmlFor="tech_roof_pitch" className="label">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_roof_pitch"
                        id="tech_roof_pitch"
                        value={formData.tech_roof_pitch}
                        onChange={handleChange}
                      >
                        {Array.from({ length: 30 }, (_, i) => {
                          const value = `${i + 1}:12`;
                          return (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 mt-3  gap-4">
              <p className="mt-1">{data?.payload?.tech_lang_keys["8"]}</p>
            </div>
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_p_length" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_p_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_p_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_pl_units} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "in)", value: "in" },
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
              <div className="col-span-6">
                <label htmlFor="tech_p_width" className="label">
                  {data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_p_width"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_p_width}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_pw_units} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "in)", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "yd", value: "yd" },
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
            <div className="grid grid-cols-1  mt-3  gap-4">
              <p className="mt-1">{data?.payload?.tech_lang_keys["10"]}</p>
            </div>
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_cost" className="label">
                  {data?.payload?.tech_lang_keys["11"]}{" "}
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_cost"
                    id="tech_cost"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_cost}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
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
                      <div className="w-full md:w-[70%]">
                        <div className="col-lg-8 font-s-18">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["12"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_panel).toFixed(0)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["10"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol}{" "}
                                  {Number(result?.tech_expense).toFixed(0)}
                                </td>
                              </tr>
                              <tr>
                                <td className="pt-2" colSpan="2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["6"]}{" "}
                                    {data?.payload?.tech_lang_keys["13"]}{" "}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]}{" "}
                                  {data?.payload?.tech_lang_keys["15"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_r_area).toFixed(2)} ft
                                  <sup>2</sup>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]}{" "}
                                  {data?.payload?.tech_lang_keys["16"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_r_area * 0.0929).toFixed(
                                    2
                                  )}{" "}
                                  m<sup>2</sup>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]}{" "}
                                  {data?.payload?.tech_lang_keys["17"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_r_area * 0.1111).toFixed(
                                    2
                                  )}{" "}
                                  yd<sup>2</sup>
                                </td>
                              </tr>
                              <tr>
                                <td className="pt-2" colSpan="2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["8"]}{" "}
                                    {data?.payload?.tech_lang_keys["13"]}{" "}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]}{" "}
                                  {data?.payload?.tech_lang_keys["15"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_p_area).toFixed(2)} ft
                                  <sup>2</sup>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]}{" "}
                                  {data?.payload?.tech_lang_keys["18"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_r_area * 0.0929).toFixed(
                                    2
                                  )}{" "}
                                  cm<sup>2</sup>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]}{" "}
                                  {data?.payload?.tech_lang_keys["19"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_r_area * 9.29).toFixed(
                                    2
                                  )}{" "}
                                  dm<sup>2</sup>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]}{" "}
                                  {data?.payload?.tech_lang_keys["16"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_r_area * 0.0929).toFixed(
                                    2
                                  )}{" "}
                                  m<sup>2</sup>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]}{" "}
                                  {data?.payload?.tech_lang_keys["20"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_r_area * 144).toFixed(2)}{" "}
                                  in<sup>2</sup>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]}{" "}
                                  {data?.payload?.tech_lang_keys["17"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_r_area * 0.1111).toFixed(
                                    2
                                  )}{" "}
                                  yd<sup>2</sup>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="">
                          <div className="col s12 padding_0">
                            <p className="mt-2 font-s-18">
                              {" "}
                              <strong>
                                {data?.payload?.tech_lang_keys["21"]}
                              </strong>
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["6"]}{" "}
                              {data?.payload?.tech_lang_keys["4"]} ={" "}
                              {result?.tech_r_length} ft
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["6"]}{" "}
                              {data?.payload?.tech_lang_keys["5"]} ={" "}
                              {result?.tech_r_width} ft
                            </p>
                            {result?.tech_roof_pitch && (
                              <>
                                <p className="mt-2">
                                  {" "}
                                  {data?.payload?.tech_lang_keys["6"]}{" "}
                                  {data?.payload?.tech_lang_keys["7"]} ={" "}
                                  {result?.tech_roof_pitch} -{" "}
                                  {data?.payload?.tech_lang_keys["22"]} -{" "}
                                  {result?.tech_value}
                                </p>
                              </>
                            )}
                            <p className="mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["8"]}{" "}
                              {data?.payload?.tech_lang_keys["4"]} ={" "}
                              {result?.tech_p_length} ft
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["8"]}{" "}
                              {data?.payload?.tech_lang_keys["5"]} ={" "}
                              {result?.tech_p_width} ft
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["11"]}{" "}
                              {data?.payload?.tech_lang_keys["8"]} ={" "}
                              {currency.symbol} {result?.tech_cost}{" "}
                            </p>
                            <p className="mt-2 font-s-18">
                              {" "}
                              <strong>
                                {data?.payload?.tech_lang_keys["23"]}
                              </strong>
                            </p>
                            <p className="mt-2 color_blue padding_5">
                              {data?.payload?.tech_lang_keys["24"]}{" "}
                              {data?.payload?.tech_lang_keys["6"]}{" "}
                              {data?.payload?.tech_lang_keys["13"]}.{" "}
                            </p>
                            <p className="mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["6"]}{" "}
                              {data?.payload?.tech_lang_keys["13"]} ={" "}
                              {data?.payload?.tech_lang_keys["6"]}{" "}
                              {data?.payload?.tech_lang_keys["4"]} <i>x</i>{" "}
                              {data?.payload?.tech_lang_keys["6"]}{" "}
                              {data?.payload?.tech_lang_keys["5"]}
                              {/* {result?.tech_roof_pitch && (
                                                <>
                                                \( \times \text{ { data?.payload?.tech_lang_keys['6'] } { data?.payload?.tech_lang_keys['7'] }}\)
                                                </>
                                              )} */}
                              {result?.tech_roof_pitch && (
                                <span>
                                  ×{" "}
                                  <strong>{`${data?.payload?.tech_lang_keys["6"]} ${data?.payload?.tech_lang_keys["7"]}`}</strong>
                                </span>
                              )}
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["6"]}{" "}
                              {data?.payload?.tech_lang_keys["13"]} ={" "}
                              {result?.tech_r_length} <i>x</i>{" "}
                              {result?.tech_r_width}
                              {result?.tech_roof_pitch && (
                                <>\( \times {result?.tech_value}\)</>
                              )}
                            </p>
                            <p className="mt-2 orange-text text-accent-4">
                              {data?.payload?.tech_lang_keys["6"]}{" "}
                              {data?.payload?.tech_lang_keys["13"]} ={" "}
                              {result?.tech_r_area} ft<sup>2</sup>
                            </p>
                            <p className="mt-2 color_blue padding_5">
                              {data?.payload?.tech_lang_keys["24"]}{" "}
                              {data?.payload?.tech_lang_keys["8"]}{" "}
                              {data?.payload?.tech_lang_keys["13"]}.{" "}
                            </p>
                            <p className="mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["8"]}{" "}
                              {data?.payload?.tech_lang_keys["13"]} ={" "}
                              {data?.payload?.tech_lang_keys["8"]}{" "}
                              {data?.payload?.tech_lang_keys["4"]} <i>x</i>{" "}
                              {data?.payload?.tech_lang_keys["8"]}{" "}
                              {data?.payload?.tech_lang_keys["5"]}
                            </p>
                            <p className="mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["8"]}{" "}
                              {data?.payload?.tech_lang_keys["13"]} ={" "}
                              {result?.tech_p_length} <i>x</i>{" "}
                              {result?.tech_p_width}
                            </p>
                            <p className="mt-2 orange-text text-accent-4">
                              {data?.payload?.tech_lang_keys["8"]}{" "}
                              {data?.payload?.tech_lang_keys["13"]} ={" "}
                              {result?.tech_p_area} ft<sup>2</sup>
                            </p>
                            <p className="mt-2 color_blue padding_5">
                              {data?.payload?.tech_lang_keys["24"]}{" "}
                              {data?.payload?.tech_lang_keys["12"]}.
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["25"]} =
                              <span className="fraction">
                                <span className="num">
                                  {data?.payload?.tech_lang_keys["6"]}{" "}
                                  {data?.payload?.tech_lang_keys["13"]}
                                </span>
                                <span className="visually-hidden "></span>
                                <span className="den">
                                  {data?.payload?.tech_lang_keys["8"]}{" "}
                                  {data?.payload?.tech_lang_keys["13"]}
                                </span>
                              </span>
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["25"]}
                              <span className="fraction">
                                <span className="num">
                                  {Number(result?.tech_r_area).toFixed(0)}
                                </span>
                                <span className="visually-hidden "></span>
                                <span className="den">
                                  {result?.tech_p_area}
                                </span>
                              </span>
                            </p>
                            <p className="mt-2 orange-text text-accent-4">
                              {data?.payload?.tech_lang_keys["25"]} ={" "}
                              {result?.tech_panel}{" "}
                            </p>
                            <p className="mt-2 color_blue padding_5">
                              {data?.payload?.tech_lang_keys["24"]}{" "}
                              {data?.payload?.tech_lang_keys["10"]}.
                            </p>
                            <p className="mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["10"]} ={" "}
                              {data?.payload?.tech_lang_keys["11"]}{" "}
                              {data?.payload?.tech_lang_keys["8"]} <i>x</i>{" "}
                              {data?.payload?.tech_lang_keys["25"]}
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["10"]} ={" "}
                              {result?.tech_cost} <i>x</i> {result?.tech_panel}
                            </p>
                            <p className="mt-2 orange-text text-accent-4">
                              {" "}
                              {data?.payload?.tech_lang_keys["10"]} ={" "}
                              {Number(result?.tech_expense).toFixed(0)}
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

export default MetalRoofCostCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useGearRatioCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GearRatioCalculator = () => {
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
    tech_type: "first", // first  second
    tech_f_first: "15",
    tech_f_second: "10",
    tech_f_third: "9",
    tech_ft_unit: "rpm",
    tech_f_four: "5",
    tech_ff_unit: "Nm",
    tech_transmissions: "Magnum XL 2.66 - .50",
    tech_s_first: "100",
    tech_s_second: "45",
    tech_s_third: "20",
    tech_s_four: "26",
    tech_s_five: "8",
    tech_s_six: "6",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGearRatioCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_f_first: formData.tech_f_first,
        tech_f_second: formData.tech_f_second,
        tech_f_third: formData.tech_f_third,
        tech_ft_unit: formData.tech_ft_unit,
        tech_f_four: formData.tech_f_four,
        tech_ff_unit: formData.tech_ff_unit,
        tech_transmissions: formData.tech_transmissions,
        tech_s_first: formData.tech_s_first,
        tech_s_second: formData.tech_s_second,
        tech_s_third: formData.tech_s_third,
        tech_s_four: formData.tech_s_four,
        tech_s_five: formData.tech_s_five,
        tech_s_six: formData.tech_s_six,
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
      tech_type: "first", // first  second
      tech_f_first: "15",
      tech_f_second: "10",
      tech_f_third: "9",
      tech_ft_unit: "rpm",
      tech_f_four: "5",
      tech_ff_unit: "Nm",
      tech_transmissions: "Magnum XL 2.66 - .50",
      tech_s_first: "100",
      tech_s_second: "45",
      tech_s_third: "20",
      tech_s_four: "26",
      tech_s_five: "8",
      tech_s_six: "6",
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
    setFormData((prev) => ({ ...prev, tech_ft_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ff_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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
              <div className="col-span-12 mx-auto md:mb-2">
                <div className="row">
                  <strong className="col-12 mt-2 px-2 text-center">
                    {data?.payload?.tech_lang_keys[1]}:
                  </strong>
                  <div className="col-12 px-2 mb-3 mt-3 d-flex align-items-center justify-content-center">
                    <label className="pe-2" htmlFor="first">
                      <input
                        type="radio"
                        name="tech_type"
                        value="first"
                        id="first"
                        className="mr-2 border"
                        onChange={handleChange}
                        checked={formData.tech_type === "first"}
                      />
                      <span>{data?.payload?.tech_lang_keys["2"]}</span>
                    </label>

                    <label className="pe-2" htmlFor="second">
                      <input
                        type="radio"
                        name="tech_type"
                        value="second"
                        id="second"
                        className="mr-2 border"
                        onChange={handleChange}
                        checked={formData.tech_type === "second"}
                      />
                      <span>{data?.payload?.tech_lang_keys["3"]}</span>
                    </label>
                  </div>
                </div>
              </div>
              {formData.tech_type === "first" && (
                <>
                  <div className="col-span-12" id="calculator">
                    <div className="grid grid-cols-12 mt-3  md:gap-4 gap-1">
                      <div className="lg:col-span-6 md:col-span-6 col-span-12">
                        <label htmlFor="tech_f_first" className="label">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_f_first"
                            id="tech_f_first"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_f_first}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="lg:col-span-6 md:col-span-6 col-span-12">
                        <label htmlFor="tech_f_second" className="label">
                          {data?.payload?.tech_lang_keys["5"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_f_second"
                            id="tech_f_second"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_f_second}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="lg:col-span-6 md:col-span-6 col-span-12">
                        <label htmlFor="tech_f_third" className="label">
                          {data?.payload?.tech_lang_keys["6"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_f_third"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_f_third}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_ft_unit} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "rpm", value: "rpm" },
                                { label: "rad/s", value: "rad/s" },
                                { label: "Hz", value: "Hz" },
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
                        <label htmlFor="tech_f_four" className="label">
                          {data?.payload?.tech_lang_keys["7"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_f_four"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_f_four}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_ff_unit} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "Nm", value: "Nm" },
                                { label: "kg-cm", value: "kg-cm" },
                                { label: "J/rad", value: "J/rad" },
                                { label: "ft-lb", value: "ft-lb" },
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
                </>
              )}

              {formData.tech_type === "second" && (
                <>
                  <div id="" className="col-span-12 ">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="lg:col-span-6 md:col-span-6 col-span-12">
                        <label htmlFor="tech_transmissions" className="label">
                          {data?.payload?.tech_lang_keys["8"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_transmissions"
                            id="tech_transmissions"
                            value={formData.tech_transmissions}
                            onChange={handleChange}
                          >
                            {[
                              "Magnum XL 2.66 - .50",
                              "Magnum XL 2.97 - .63",
                              "Magnum 2.66 - .63",
                              "Magnum 2.97 - .50",
                              "Magnum-F 2.66 - .63",
                              "Magnum-F 2.97 - .63",
                              "Magnum-F 2.66 - .50",
                              "Magnum-F 2.97 - .50",
                              "T-5 2.95 - .63",
                              "TKO-500 3.27 - .68",
                              "TKO-600 2.87 - .64",
                              "TKO-600 2.87 - .82",
                              "TKX 3.27 - .72",
                              "TKX 2.87 - .81",
                              "TKX 2.87 - .68",
                              "GM Muncie 2.20 - 1.00",
                              "Ford Toploader 2.32 - 1.00",
                              "Ford Toploader 2.78 - 1.00",
                              "A-833 HEMI 4-Speed 2.44 - 1.00",
                            ].map((val, index) => (
                              <option key={index} value={val}>
                                {val}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_s_first" className="label">
                          {data?.payload?.tech_lang_keys["13"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_s_first"
                            id="tech_s_first"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_s_first}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_s_second" className="label">
                          {data?.payload?.tech_lang_keys["14"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_s_second"
                            id="tech_s_second"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_s_second}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_s_third" className="label">
                          {data?.payload?.tech_lang_keys["15"]} (in):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_s_third"
                            id="tech_s_third"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_s_third}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_s_four" className="label">
                          {data?.payload?.tech_lang_keys["16"]} (mm):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_s_four"
                            id="tech_s_four"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_s_four}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_s_five" className="label">
                          {data?.payload?.tech_lang_keys["17"]} (in):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_s_five"
                            id="tech_s_five"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_s_five}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_s_six" className="label">
                          {data?.payload?.tech_lang_keys["18"]} (1-100):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_s_six"
                            id="tech_s_six"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_s_six}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <p className="col-12 mt-2 font-s-21">
                          <strong className="text-blue">
                            {data?.payload?.tech_lang_keys[19]}
                          </strong>
                        </p>
                        {result?.tech_type == "first" && (
                          <>
                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[20]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_gear_ratio
                                        ).toFixed(2)}{" "}
                                        :1
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[21]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_mechanical
                                        ).toFixed(2)}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[22]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_output_rot
                                        ).toFixed(2)}{" "}
                                        (rpm)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[23]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.tech_output_tor
                                        ).toFixed(2)}{" "}
                                        (Nm)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {result?.tech_type == "second" && (
                          <>
                            <div className="w-full md:w-[60%] lg:w-[60%]mt-2 overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[24]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_height).toFixed(2)}{" "}
                                        (in)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys[25]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(result?.tech_width).toFixed(2)}{" "}
                                        (in)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr className="bg-[#2845F5] text-white">
                                    <td className="p-2  text-center">
                                      <strong className="text-white">
                                        {data?.payload?.tech_lang_keys[26]}
                                      </strong>
                                    </td>
                                    <td className="p-2  text-center">
                                      <strong className="text-white">
                                        {data?.payload?.tech_lang_keys[27]}
                                      </strong>
                                    </td>
                                    <td className="p-2  text-center">
                                      <strong className="text-white">
                                        MPH
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr className="bg-white">
                                    <td className="p-2 border text-center">
                                      1st {data?.payload?.tech_lang_keys[28]}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_transratio1_value}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_mph1_value}
                                    </td>
                                  </tr>
                                  <tr className="bg-white">
                                    <td className="p-2 border text-center">
                                      2nd {data?.payload?.tech_lang_keys[28]}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_transratio2_value}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_mph2_value}
                                    </td>
                                  </tr>
                                  <tr className="bg-white">
                                    <td className="p-2 border text-center">
                                      3rd {data?.payload?.tech_lang_keys[28]}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_transratio3_value}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_mph3_value}
                                    </td>
                                  </tr>
                                  <tr className="bg-white">
                                    <td className="p-2 border text-center">
                                      4th {data?.payload?.tech_lang_keys[28]}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_transratio4_value}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_mph4_value}
                                    </td>
                                  </tr>
                                  <tr className="bg-white">
                                    <td className="p-2 border text-center">
                                      5th {data?.payload?.tech_lang_keys[28]}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_transratio5_value}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_mph5_value}
                                    </td>
                                  </tr>
                                  <tr className="bg-white">
                                    <td className="p-2 border text-center">
                                      6th {data?.payload?.tech_lang_keys[28]}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_transratio6_value}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {result?.tech_mph6_value}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
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

export default GearRatioCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTwosComplementCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TwosComplementCalculator = () => {
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
    tech_selection: "distance", // add_sub  distance
    tech_cal: "dec_cal", // dec_cal bnry_cal  hex_cal
    tech_bits: "8",
    tech_dec: "5",
    tech_bnry: "0101",
    tech_hex: "F",
    tech_no_of_bits: "8",
    tech_no: "11101",
    tech_action: "+", //   +  -
    tech_no1: "10110",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTwosComplementCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_cal: formData.tech_cal,
        tech_bits: formData.tech_bits,
        tech_dec: formData.tech_dec,
        tech_bnry: formData.tech_bnry,
        tech_hex: formData.tech_hex,
        tech_no_of_bits: formData.tech_no_of_bits,
        tech_no: formData.tech_no,
        tech_action: formData.tech_action,
        tech_no1: formData.tech_no1,
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
      tech_selection: "distance", // add_sub  distance
      tech_cal: "dec_cal", // dec_cal bnry_cal  hex_cal
      tech_bits: "8",
      tech_dec: "5",
      tech_bnry: "0101",
      tech_hex: "F",
      tech_no_of_bits: "8",
      tech_no: "11101",
      tech_action: "+", //   +  -
      tech_no1: "10110",
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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2 w-full">
              <input
                type="hidden"
                name="tech_selection"
                id="calculator_time"
                value={formData.tech_selection}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_selection == "distance" ? "tagsUnit" : ""
                    }`}
                    id="distance"
                    onClick={() => {
                      setFormData({ ...formData, tech_selection: "distance" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["24"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_selection == "add_sub" ? "tagsUnit" : ""
                    }`}
                    id="add_sub"
                    onClick={() => {
                      setFormData({ ...formData, tech_selection: "add_sub" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["26"]}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              {formData.tech_selection == "distance" && (
                <>
                  <div className="col-span-12  twocomp mt-3">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <div className="md:col-span-6 col-span-12 ">
                        <label htmlFor="tech_cal" className="label">
                          {data?.payload?.tech_lang_keys["1"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_cal"
                            id="tech_cal"
                            value={formData.tech_cal}
                            onChange={handleChange}
                          >
                            <option value="dec_cal">
                              {data?.payload?.tech_lang_keys["2"]}{" "}
                            </option>
                            <option value="bnry_cal">
                              {data?.payload?.tech_lang_keys["3"]}{" "}
                            </option>
                            <option value="hex_cal">
                              {data?.payload?.tech_lang_keys["4"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="md:col-span-6 col-span-12" id="bit">
                        <label htmlFor="tech_bits" className="label">
                          {data?.payload?.tech_lang_keys["5"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_bits"
                            id="tech_bits"
                            value={formData.tech_bits}
                            onChange={handleChange}
                          >
                            <option value="4">4-bit </option>
                            <option value="8">8-bit </option>
                            <option value="12">12-bit </option>
                            <option value="16">16-bit </option>
                            <option value="other">
                              {data?.payload?.tech_lang_keys["6"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                      {formData.tech_cal == "dec_cal" && (
                        <>
                          <div id="dec" className="md:col-span-6 col-span-12 ">
                            <div className="input-field col m6 s12 margin_zero padding_l_r_20">
                              <label htmlFor="tech_dec" className="label">
                                {data?.payload?.tech_lang_keys["2"]}:
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_dec"
                                  id="tech_dec"
                                  min="-128"
                                  max="127"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_dec}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_cal == "bnry_cal" && (
                        <>
                          <div id="bnry" className="md:col-span-6 col-span-12">
                            <div className="input-field col m6 s12 margin_zero padding_l_r_20">
                              <label htmlFor="tech_bnry" className="label">
                                {data?.payload?.tech_lang_keys["3"]}:
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_bnry"
                                  id="tech_bnry"
                                  maxLength="8"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="1010"
                                  value={formData.tech_bnry}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_cal == "hex_cal" && (
                        <>
                          <div id="hex" className="md:col-span-6 col-span-12">
                            <div className="input-field col m6 s12 margin_zero padding_l_r_20">
                              <label htmlFor="tech_hex" className="label">
                                {data?.payload?.tech_lang_keys["4"]}:
                              </label>
                              <div className=" relative">
                                <input
                                  type="text"
                                  step="any"
                                  name="tech_hex"
                                  id="tech_hex"
                                  maxlength="16"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="1010"
                                  value={formData.tech_hex}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_bits == "other" && (
                        <>
                          <div
                            className="md:col-span-6 col-span-12 "
                            id="no_of_bits"
                          >
                            <label htmlFor="tech_no_of_bits" className="label">
                              {data?.payload?.tech_lang_keys["7"]}:
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_no_of_bits"
                                id="tech_no_of_bits"
                                min="2"
                                max="70"
                                className="input my-2"
                                aria-label="input"
                                placeholder="1010"
                                value={formData.tech_no_of_bits}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_cal == "dec_cal" && (
                        <>
                          <div
                            id="dec_rng"
                            className="col-span-12 text-[12px] "
                          >
                            <div>
                              <p>
                                {data?.payload?.tech_lang_keys["8"]}
                                <span id="dec_range">-128 to 127</span>
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_cal == "bnry_cal" && (
                        <>
                          <div
                            id="bnry_rng"
                            className="col-span-12 text-[12px]"
                          >
                            <div>
                              <p>
                                {data?.payload?.tech_lang_keys["9"]}
                                <span id="bnry_range">
                                  8 {data?.payload?.tech_lang_keys[16]}
                                </span>
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_cal == "hex_cal" && (
                        <>
                          <div id="hex_rng" className="col-span-12 text-[12px]">
                            <div>
                              <p>
                                {data?.payload?.tech_lang_keys["10"]}
                                <span id="hex_range">
                                  0-9 and A-F (16-Digits)
                                </span>
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              {formData.tech_selection == "add_sub" && (
                <>
                  <div className="col-span-12  twocomp2 mt-3">
                    <div className="md:">
                      <div className="md:col-span-5">
                        <label htmlFor="tech_no" className="label">
                          {data?.payload?.tech_lang_keys["25"]} 1:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_no"
                            id="tech_no"
                            maxlength="8"
                            className="input my-2"
                            aria-label="input"
                            placeholder="1010"
                            value={formData.tech_no}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 flex justify-center items-center mt-4">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_action"
                          id="tech_action"
                          value={formData.tech_action}
                          onChange={handleChange}
                        >
                          <option value="+">+</option>
                          <option value="-">- </option>
                        </select>
                      </div>
                      <div className="md:col-span-5">
                        <label htmlFor="tech_no1" className="label">
                          {data?.payload?.tech_lang_keys["25"]} 2:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_no1"
                            id="tech_no1"
                            maxlength="8"
                            className="input my-2"
                            aria-label="input"
                            placeholder="1010"
                            value={formData.tech_no1}
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
                        {formData?.tech_selection == "add_sub" ? (
                          <>
                            <div className="text-center">
                              <p className="md:text-[20px]">
                                <strong>
                                  {result?.tech_action == "+"
                                    ? "Addition "
                                    : "Subtraction "}
                                  of Two's Complements
                                </strong>
                              </p>

                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-3">
                                <strong className="text-blue">
                                  {result?.tech_add_sub}
                                </strong>
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]}
                                </strong>
                              </p>

                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-3">
                                <strong className="text-blue">
                                  {result?.tech__2s}
                                </strong>
                              </p>
                            </div>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["12"]}{" "}
                                {result?.tech_bit}-bit{" "}
                                {data?.payload?.tech_lang_keys["13"]}:
                              </strong>
                            </p>
                            <div className="w-full md:w-[80%] lg:w-[80%] text-[18px]">
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["2"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_dec}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["3"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_binary}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["4"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_hex}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["14"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech__1s}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["15"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech__2s}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <p className="text-[20px] mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[17]}
                              </strong>
                              :
                            </p>
                            <p className="text-[18px] mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[18]} 1:
                              </strong>
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys[19]}{" "}
                              <a
                                href="/ones-complement-calculator"
                                title="One's complement Calculator"
                                target="_blank"
                                rel="noopener"
                                className="text-blue-600 underline"
                              >
                                One's complement
                              </a>{" "}
                              {data?.payload?.tech_lang_keys[20]}:
                            </p>
                            <p className="text-center my-2">
                              {data?.payload?.tech_lang_keys[21]}
                            </p>
                            {/* Binary Row Table */}
                            <div className="overflow-auto w-full md:w-[80%] lg:w-[80%] text-[18px] text-center mx-auto">
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    {result?.tech_binary
                                      ?.replace(/\s/g, "")
                                      .split("")
                                      .map((bit, index) => (
                                        <td
                                          key={`bin-${index}`}
                                          className="bin_cell"
                                        >
                                          {bit}
                                        </td>
                                      ))}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <p className="text-center my-2">
                              {data?.payload?.tech_lang_keys[22]}:
                            </p>
                            {/* Binary to One's Complement Table */}
                            <div className="overflow-auto w-full md:w-[80%] lg:w-[80%] text-[18px] text-center mx-auto">
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    {result?.tech_binary
                                      ?.replace(/\s/g, "")
                                      .split("")
                                      .map((bit, index) => (
                                        <td
                                          key={`bin2-${index}`}
                                          className="bin_cell"
                                        >
                                          {bit}
                                        </td>
                                      ))}
                                  </tr>
                                  <tr>
                                    {result?.tech_binary
                                      ?.replace(/\s/g, "")
                                      .split("")
                                      .map((_, index) => (
                                        <td key={`arrow-${index}`}>↓</td>
                                      ))}
                                  </tr>
                                  <tr>
                                    {result?.tech__1s
                                      ?.replace(/\s/g, "")
                                      .split("")
                                      .map((bit, index) => (
                                        <td
                                          key={`one-${index}`}
                                          className="bin_cell"
                                        >
                                          {bit}
                                        </td>
                                      ))}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <p className="text-[18px] mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[18]} 2:
                              </strong>
                            </p>
                            <p className="text-center my-2">
                              {data?.payload?.tech_lang_keys[23]}:
                            </p>
                            <div className="overflow-auto w-full md:w-[80%] lg:w-[80%] text-[18px] text-center mx-auto">
                              <table className="w-full">
                                <tbody>
                                  {/* First row – One's complement */}
                                  <tr>
                                    {result?.tech__1s
                                      ?.replace(/\s/g, "")
                                      .split("")
                                      .map((bit, index) => (
                                        <td
                                          key={`row1-${index}`}
                                          className="bin_cell"
                                        >
                                          {bit}
                                        </td>
                                      ))}
                                  </tr>

                                  {/* Second row – Add 1 logic */}
                                  <tr>
                                    {result?.tech__1s
                                      ?.replace(/\s/g, "")
                                      .split("")
                                      .map((_, index, array) => {
                                        if (index === 0)
                                          return (
                                            <td key={`plus-${index}`}>+</td>
                                          );
                                        else if (index === array.length - 1)
                                          return (
                                            <td
                                              key={`one-${index}`}
                                              className="bin_cell"
                                            >
                                              1
                                            </td>
                                          );
                                        else
                                          return (
                                            <td key={`empty-${index}`}></td>
                                          );
                                      })}
                                  </tr>

                                  {/* Third row – Down arrows */}
                                  <tr>
                                    {result?.tech__1s
                                      ?.replace(/\s/g, "")
                                      .split("")
                                      .map((_, index) => (
                                        <td key={`arrow-${index}`}>↓</td>
                                      ))}
                                  </tr>

                                  {/* Fourth row – Final two's complement */}
                                  <tr>
                                    {result?.tech__2s
                                      ?.replace(/\s/g, "")
                                      .split("")
                                      .map((bit, index) => (
                                        <td
                                          key={`twos-${index}`}
                                          className="bin_cell"
                                        >
                                          {bit}
                                        </td>
                                      ))}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <p className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["12"]}{" "}
                                {result?.tech_bit}-bit{" "}
                                {data?.payload?.tech_lang_keys["13"]}:
                              </strong>
                            </p>
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["2"]}
                                  </td>
                                  <td className="border-b py-2">
                                    <strong>{result?.tech_dec}</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["3"]}
                                  </td>
                                  <td className="border-b py-2">
                                    <strong>{result?.tech_binary}</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["15"]}
                                  </td>
                                  <td className="border-b py-2">
                                    <strong>{result?.tech__2s}</strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
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

export default TwosComplementCalculator;

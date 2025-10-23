"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useOnesComplementCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const OnesComplementCalculator = () => {
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
    tech_cal: "bnry_cal", // bnry_cal dec_cal hex_cal
    tech_dec: "5",
    tech_bnry: "0101",
    tech_hex: "F",
    tech_bits: "8",
    tech_no_of_bits: "8",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useOnesComplementCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cal: formData.tech_cal,
        tech_dec: formData.tech_dec,
        tech_bnry: formData.tech_bnry,
        tech_hex: formData.tech_hex,
        tech_bits: formData.tech_bits,
        tech_no_of_bits: formData.tech_no_of_bits,
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
      tech_cal: "bnry_cal", // bnry_cal dec_cal hex_cal
      tech_dec: "5",
      tech_bnry: "0101",
      tech_hex: "F",
      tech_bits: "8",
      tech_no_of_bits: "8",
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 flex items-center justify-evenly">
                <p className="label">
                  <strong>{data?.payload?.tech_lang_keys["1"]}:</strong>
                </p>
                <p className="bnry_cal">
                  <label className="pe- cursor-pointer2" htmlFor="bnry_cal">
                    <input
                      type="radio"
                      name="tech_cal"
                      value="bnry_cal"
                      id="bnry_cal"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_cal === "bnry_cal"}
                    />
                    <span>{data?.payload?.tech_lang_keys["2"]}</span>
                  </label>
                </p>
                <p className="dec_cal">
                  <label className="pe-2 cursor-pointer" htmlFor="dec_cal">
                    <input
                      type="radio"
                      name="tech_cal"
                      value="dec_cal"
                      id="dec_cal"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_cal === "dec_cal"}
                    />
                    <span>{data?.payload?.tech_lang_keys["3"]}</span>
                  </label>
                </p>
                <p className="hex_cal">
                  <label className="pe-2 cursor-pointer" htmlFor="hex_cal">
                    <input
                      type="radio"
                      name="tech_cal"
                      value="hex_cal"
                      id="hex_cal"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_cal === "hex_cal"}
                    />
                    <span>{data?.payload?.tech_lang_keys["4"]}</span>
                  </label>
                </p>
              </div>
              {formData.tech_cal === "bnry_cal" && (
                <>
                  <p
                    className="col-span-12 text-center my-3 text-[14px] "
                    id="dec_rng"
                  >
                    {data?.payload?.tech_lang_keys["2"]}{" "}
                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                    <span id="dec_range">-127 to 127</span>
                  </p>
                </>
              )}
              {formData.tech_cal === "dec_cal" && (
                <>
                  <p
                    className="col-span-12 text-center my-3 text-[14px]"
                    id="bnry_rng"
                  >
                    {data?.payload?.tech_lang_keys["3"]}{" "}
                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                    <span id="bnry_range">
                      8 {data?.payload?.tech_lang_keys["13"]} (
                      {data?.payload?.tech_lang_keys["14"]})
                    </span>
                  </p>
                </>
              )}
              {formData.tech_cal === "hex_cal" && (
                <>
                  <p
                    className="col-span-12 text-center my-3 text-[14px] "
                    id="hex_rng"
                  >
                    {data?.payload?.tech_lang_keys["4"]}{" "}
                    {data?.payload?.tech_lang_keys["8"]} ={" "}
                    <span id="hex_range">
                      0-9 {data?.payload?.tech_lang_keys["15"]} A-F (16-
                      {data?.payload?.tech_lang_keys["13"]})
                    </span>
                  </p>
                </>
              )}

              {formData.tech_cal === "bnry_cal" && (
                <>
                  <div className="col-span-12 " id="dec">
                    <label htmlFor="tech_dec" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        min="-127"
                        max="127"
                        name="tech_dec"
                        id="tech_dec"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_dec}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_cal === "dec_cal" && (
                <>
                  <div className="col-span-12 " id="bnry">
                    <label htmlFor="tech_bnry" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        maxLength="8"
                        name="tech_bnry"
                        id="tech_bnry"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_bnry}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_cal === "hex_cal" && (
                <>
                  <div className="col-span-12 " id="hex">
                    <label htmlFor="tech_hex" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="text"
                        step="any"
                        maxLength="16"
                        name="tech_hex"
                        id="tech_hex"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_hex}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_cal === "bnry_cal" ||
                formData.tech_cal === "dec_cal") && (
                <>
                  <div className="col-span-12 " id="bit">
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
                        <option value="4">4-bit</option>
                        <option value="8">8-bit </option>
                        <option value="12">12-bit </option>
                        <option value="16">16-bit </option>
                        <option value="other">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>

                  {formData.tech_bits === "other" && (
                    <>
                      <div className="col-span-12" id="no_of_bits">
                        <label htmlFor="tech_no_of_bits" className="label">
                          {data?.payload?.tech_lang_keys["7"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            min="2"
                            max="70"
                            name="tech_no_of_bits"
                            id="tech_no_of_bits"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_no_of_bits}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[90%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech__1s}
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <p className="mt-2 text-[16px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["10"]}{" "}
                              {result?.tech_bit}-bit{" "}
                              {data?.payload?.tech_lang_keys["11"]}:
                            </strong>
                          </p>

                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["2"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_dec}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["3"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_binary}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["4"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_hex}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  1's {data?.payload?.tech_lang_keys["12"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech__1s}</strong>
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

export default OnesComplementCalculator;

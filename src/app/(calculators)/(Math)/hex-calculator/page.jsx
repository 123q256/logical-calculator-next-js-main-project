"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useHexCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HexCalculator = () => {
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
    tech_bnr_frs: "8AB",
    tech_bnr_slc: "add", // add sub  mul  divide
    tech_bnr_sec: "B78",
    tech_options: "1", //  1 2 3 4
    tech_nmbr: "101010",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [inputMode, setInputMode] = useState("hex"); // Add inputMode state

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHexCalculatorMutation();

  // Validation function for different input modes
  const validateInput = (value, mode) => {
    switch (mode) {
      case "hex":
        return /^[0-9A-Fa-f]+$/.test(value) || value === "";
      case "dec":
        return /^\d+$/.test(value) || value === "";
      case "bin":
        return /^[01]+$/.test(value) || value === "";
      default:
        return true;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tech_options") {
      let newValue = "";
      let mode = "all";

      switch (value) {
        case "1": // Hex -> Dec
          newValue = "34A";
          mode = "hex";
          break;
        case "2": // Dec -> Hex
          newValue = "42";
          mode = "dec";
          break;
        case "3": // Hex -> Bin
          newValue = "54f";
          mode = "hex";
          break;
        case "4": // Bin -> Dec
          newValue = "101010";
          mode = "bin";
          break;
        default:
          break;
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        tech_nmbr: newValue,
      }));
      setInputMode(mode); // Now setInputMode is defined
    } else if (name === "tech_nmbr") {
      // validate input as you type
      if (validateInput(value, inputMode)) {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    } else {
      // For all other inputs
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

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
        tech_bnr_frs: formData.tech_bnr_frs,
        tech_bnr_slc: formData.tech_bnr_slc,
        tech_bnr_sec: formData.tech_bnr_sec,
        tech_options: formData.tech_options,
        tech_nmbr: formData.tech_nmbr,
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
      tech_type: "first", // first  second
      tech_bnr_frs: "8AB",
      tech_bnr_slc: "add", // add sub  mul  divide
      tech_bnr_sec: "B78",
      tech_options: "1", //  1 2 3 4
      tech_nmbr: "101010",
    });
    setResult(null);
    setFormError(null);
    setInputMode("hex"); // Reset input mode as well
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="tech_type"
                id="calculator_time"
                value={formData.tech_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_type === "first" ? "tagsUnit" : ""
                    }`}
                    id="first"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "first" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["10"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_type === "second" ? "tagsUnit" : ""
                    }`}
                    id="second"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "second" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["11"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              {formData.tech_type == "first" && (
                <>
                  <div className="col-span-12 row " id="hexCalculator">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-3"></div>
                      <div className="col-span-9">
                        <label htmlFor="tech_bnr_frs" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_bnr_frs"
                            id="tech_bnr_frs"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_bnr_frs}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-3">
                        <label htmlFor="tech_bnr_slc" className="label">
                          &nbsp;
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_bnr_slc"
                            id="tech_bnr_slc"
                            value={formData.tech_bnr_slc}
                            onChange={handleChange}
                          >
                            <option value="add">+ </option>
                            <option value="sub">- </option>
                            <option value="mult">* </option>
                            <option value="divd">/ </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-9">
                        <label htmlFor="tech_bnr_sec" className="label">
                          {data?.payload?.tech_lang_keys["7"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_bnr_sec"
                            id="tech_bnr_sec"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_bnr_sec}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type == "second" && (
                <>
                  <div className="col-span-12 row " id="hexConverter">
                    <div className="col-12 mt-0 mt-lg-2 flex justify-around ">
                      <p id="hex_to_dec">
                        <label className="pe-2 cursor-pointer" htmlFor="1">
                          <input
                            type="radio"
                            name="tech_options"
                            value="1"
                            id="1"
                            className="mr-2 border cursor-pointer"
                            onChange={handleChange}
                            checked={formData.tech_options === "1"}
                          />
                          <span>{data?.payload?.tech_lang_keys["12"]}</span>
                        </label>
                      </p>
                      <p id="dec_to_hex">
                        <label className="pe-2 cursor-pointer" htmlFor="2">
                          <input
                            type="radio"
                            name="tech_options"
                            value="2"
                            id="2"
                            className="mr-2 border cursor-pointer"
                            onChange={handleChange}
                            checked={formData.tech_options === "2"}
                          />
                          <span>{data?.payload?.tech_lang_keys["13"]}</span>
                        </label>
                      </p>
                    </div>
                    <div className="col-12 mt-0 mt-lg-2 flex justify-around ">
                      <p id="hex_to_dec">
                        <label className="pe-2 cursor-pointer" htmlFor="3">
                          <input
                            type="radio"
                            name="tech_options"
                            value="3"
                            id="3"
                            className="mr-2 border cursor-pointer"
                            onChange={handleChange}
                            checked={formData.tech_options === "3"}
                          />
                          <span>{data?.payload?.tech_lang_keys["14"]}</span>
                        </label>
                      </p>
                      <p id="hex_to_dec">
                        <label className="pe-2 cursor-pointer" htmlFor="4">
                          <input
                            type="radio"
                            name="tech_options"
                            value="4"
                            id="4"
                            className="mr-2 border cursor-pointer"
                            onChange={handleChange}
                            checked={formData.tech_options === "4"}
                          />
                          <span>{data?.payload?.tech_lang_keys["15"]}</span>
                        </label>
                      </p>
                    </div>
                    <div className="col-12 mt-0 mt-lg-2">
                      <label htmlFor="tech_nmbr" className="label">
                        {data?.payload?.tech_lang_keys["16"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="text"
                          step="any"
                          name="tech_nmbr"
                          id="tech_nmbr"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_nmbr}
                          onChange={handleChange}
                        />
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
                        {result?.tech_type == "first" ? (
                          <>
                            <div className="col-lg-6 mt-2 overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[17]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_hx}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys[3]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_dc}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys[2]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_bn}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys[5]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_oc}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      {data?.payload?.tech_lang_keys[17]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_hx}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="w-full text-[16px]">
                              <p className="mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys[18]}:
                                </strong>
                              </p>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[19]}
                              </p>
                              <p className="mt-3">
                                {result?.tech_first_ans1} {result?.tech_op}{" "}
                                {result?.tech_second_ans1} {" = "}{" "}
                                {result?.tech_hx}
                              </p>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys[20]}
                              </p>
                              <p className="mt-3">
                                {result?.tech_first_ans} {result?.tech_op}{" "}
                                {result?.tech_second_ans} {" = "}{" "}
                                {result?.tech_dc}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full text-center my-2">
                              <p>
                                <strong className="bg-[#2845F5]  px-3 py-2 text-[21px] rounded-lg text-white">
                                  {result?.tech_answer} {result?.tech_text}
                                </strong>
                              </p>
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

export default HexCalculator;

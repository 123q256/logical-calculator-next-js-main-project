"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDiscountedCashFlowCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DiscountedCashFlowCalculator = () => {
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
    tech_main_unit: "Free cash flow to firm (FCFF)",
    tech_input: ["50", "50"],
    tech_cash: "50",
    tech_outstanding: "60000",
    tech_perpetual: "4.48",
    tech_wacc: "9.94",
    tech_shares: "1000",
    tech_price: "17",
    tech_earnings: "200",
    tech_discount: "11",
    tech_growth: "200",
    tech_growth_time: "1",
    tech_growth_time_one: "200",
    tech_growth_time_sec: "1",
    tech_growth_unit: "mos",
    tech_terminal: "200",
    tech_terminal_time: "1",
    tech_terminal_one: "200",
    tech_terminal_sec: "1",
    tech_terminal_unit: "mos",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDiscountedCashFlowCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if it's an array field like "tech_year[3]"
    const match = name.match(/^(\w+)\[(\d+)\]$/);
    if (match) {
      const field = match[1]; // e.g., "tech_year"
      const index = parseInt(match[2]); // e.g., 3

      const updatedArray = [...formData[field]];
      updatedArray[index] = value;

      setFormData((prevData) => ({
        ...prevData,
        [field]: updatedArray,
      }));
    } else {
      // Normal field
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

    if (formData.tech_main_unit == "Free cash flow to firm (FCFF)") {
      if (
        !formData.tech_main_unit ||
        !formData.tech_cash ||
        !formData.tech_outstanding ||
        !formData.tech_perpetual ||
        !formData.tech_wacc ||
        !formData.tech_shares ||
        !formData.tech_price
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_main_unit ||
        !formData.tech_earnings ||
        !formData.tech_discount ||
        !formData.tech_growth ||
        !formData.tech_growth_unit ||
        !formData.tech_terminal ||
        !formData.tech_terminal_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_main_unit: formData.tech_main_unit,
        tech_input: formData.tech_input,
        tech_cash: formData.tech_cash,
        tech_outstanding: formData.tech_outstanding,
        tech_perpetual: formData.tech_perpetual,
        tech_wacc: formData.tech_wacc,
        tech_shares: formData.tech_shares,
        tech_price: formData.tech_price,
        tech_earnings: formData.tech_earnings,
        tech_discount: formData.tech_discount,
        tech_growth: formData.tech_growth,
        tech_growth_time: formData.tech_growth_time,
        tech_growth_time_one: formData.tech_growth_time_one,
        tech_growth_time_sec: formData.tech_growth_time_sec,
        tech_growth_unit: formData.tech_growth_unit,
        tech_terminal: formData.tech_terminal,
        tech_terminal_time: formData.tech_terminal_time,
        tech_terminal_one: formData.tech_terminal_one,
        tech_terminal_sec: formData.tech_terminal_sec,
        tech_terminal_unit: formData.tech_terminal_unit,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_main_unit: "Earnings per share (EPS)",
      tech_input: ["50", "50", "50"],
      tech_cash: "50",
      tech_outstanding: "60000",
      tech_perpetual: "4.48",
      tech_wacc: "9.94",
      tech_shares: "1000",
      tech_price: "17",
      tech_earnings: "200",
      tech_discount: "11",
      tech_growth: "200",
      tech_growth_time: "1",
      tech_growth_time_one: "200",
      tech_growth_time_sec: "1",
      tech_growth_unit: "mos",
      tech_terminal: "200",
      tech_terminal_time: "1",
      tech_terminal_one: "200",
      tech_terminal_sec: "1",
      tech_terminal_unit: "mos",
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

  const addYear = () => {
    setFormData((prev) => ({
      ...prev,
      tech_input: [...prev.tech_input, 0], // Add a new year with default value 0
    }));
  };

  const removeYear = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tech_input: prev.tech_input.filter((_, i) => i !== indexToRemove),
    }));
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_main_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_main_unit"
                    id="tech_main_unit"
                    value={formData.tech_main_unit}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys["2"]}>
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["3"]}>
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_main_unit ==
                data?.payload?.tech_lang_keys["2"] && (
                <div className="col-span-12" id="first">
                  <div className="grid lg:grid-cols-12 md:grid-cols-12  grid-cols-6 mt-3  gap-4">
                    <p className="col-span-12 px-2">
                      <strong>{data?.payload?.tech_lang_keys[4]}</strong>
                    </p>
                    <div className="col-span-12">
                      <div
                        className="grid grid-cols-12 mt-3  gap-4"
                        id="inputContainer"
                      >
                        <div className="col-span-12 ">
                          <div className="grid grid-cols-12 mt-3  gap-4 add_year">
                            {formData.tech_input.map((value, index) => (
                              <div className="col-span-6 relative" key={index}>
                                {/* Label and delete image in flex row */}
                                <div className="flex items-center justify-between mx-1 py-2">
                                  <label
                                    htmlFor={`tech_input_${index}`}
                                    className="label"
                                  >
                                    FCFF {index + 1}
                                  </label>

                                  {formData.tech_input.length > 2 && (
                                    <img
                                      src="/images/images_mix/belete_btn.png"
                                      width="15"
                                      height="20"
                                      className="cursor-pointer ml-2"
                                      alt="Delete"
                                      onClick={() => removeYear(index)}
                                    />
                                  )}
                                </div>

                                {/* Input with unit */}
                                <div className="relative">
                                  <input
                                    type="number"
                                    step="any"
                                    id={`tech_input_${index}`}
                                    name={`tech_input[${index}]`}
                                    className="input"
                                    placeholder="413"
                                    value={formData.tech_input[index]}
                                    onChange={handleChange}
                                  />
                                  <span className="input_unit">
                                    {currency.symbol}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-span-12 text-end mt-3">
                          <button
                            type="button"
                            onClick={addYear}
                            className="px-3 py-2 mx-1 addmore bg-[#2845F5] rounded-[10px] text-white font-semibold cursor-pointer"
                          >
                            <span className="mr-1">+</span>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="my-2 col-span-12">
                      <strong>{data?.payload?.tech_lang_keys[5]}</strong>
                    </p>

                    <div className="col-span-6">
                      <label htmlFor="tech_cash" className="label">
                        {data?.payload?.tech_lang_keys["6"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_cash"
                          id="tech_cash"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_cash}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_outstanding" className="label">
                        {data?.payload?.tech_lang_keys["7"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_outstanding"
                          id="tech_outstanding"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_outstanding}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <p className="my-2 col-span-12">
                      <strong>{data?.payload?.tech_lang_keys[8]}</strong>
                    </p>
                    <div className="col-span-6">
                      <label htmlFor="tech_perpetual" className="label">
                        {data?.payload?.tech_lang_keys["9"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_perpetual"
                          id="tech_perpetual"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_perpetual}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_wacc" className="label">
                        {data?.payload?.tech_lang_keys["10"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_wacc"
                          id="tech_wacc"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_wacc}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>
                    <p className="my-2 col-span-12">
                      <strong>{data?.payload?.tech_lang_keys[11]}</strong>
                    </p>
                    <div className="col-span-6">
                      <label htmlFor="tech_shares" className="label">
                        {data?.payload?.tech_lang_keys["12"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_shares"
                          id="tech_shares"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_shares}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_price" className="label">
                        {data?.payload?.tech_lang_keys["13"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_price"
                          id="tech_price"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_price}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {formData.tech_main_unit ==
                data?.payload?.tech_lang_keys["3"] && (
                <div className="col-span-12 " id="second">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <p className="col-span-12 my-2 px-2">
                      <strong>{data?.payload?.tech_lang_keys[14]}</strong>
                    </p>
                    <div className="col-span-12 md:col-span-6    ">
                      <label htmlFor="tech_earnings" className="label">
                        {data?.payload?.tech_lang_keys["15"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_earnings"
                          id="tech_earnings"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_earnings}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <label htmlFor="tech_discount" className="label">
                        {data?.payload?.tech_lang_keys["16"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_discount"
                          id="tech_discount"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_discount}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>
                    <p className="col-span-12 my-2 px-2">
                      <strong>{data?.payload?.tech_lang_keys[17]}</strong>
                    </p>
                    <div className="col-span-12 md:col-span-6   ">
                      <label htmlFor="tech_growth" className="label">
                        {data?.payload?.tech_lang_keys["18"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_growth"
                          id="tech_growth"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_growth}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>

                    {formData.tech_growth_unit != "yrs/mos" && (
                      <>
                        <div className="col-span-12 md:col-span-6">
                          <label htmlFor="tech_growth_time" className="label">
                            {data?.payload?.tech_lang_keys["19"]}...:
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_growth_time"
                              id="tech_growth_time"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_growth_time}
                              onChange={handleChange}
                            />
                            <span className="input_unit">%</span>
                          </div>
                        </div>
                      </>
                    )}
                    {formData.tech_growth_unit == "yrs/mos" && (
                      <>
                        <div className="col-span-12 md:col-span-6 ">
                          <label
                            htmlFor="tech_growth_time_one"
                            className="label"
                          >
                            {data?.payload?.tech_lang_keys["19"]}...:
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_growth_time_one"
                              id="tech_growth_time_one"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_growth_time_one}
                              onChange={handleChange}
                            />
                            <span className="input_unit">yrs</span>
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-6">
                          <label
                            htmlFor="tech_growth_time_sec"
                            className="label"
                          >
                            &nbsp;
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_growth_time_sec"
                              id="tech_growth_time_sec"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_growth_time_sec}
                              onChange={handleChange}
                            />
                            <span className="input_unit">mos</span>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="col-span-12 md:col-span-6 ">
                      <label htmlFor="tech_growth_unit" className="label">
                        {data?.payload?.tech_lang_keys["18"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_growth_unit"
                          id="tech_growth_unit"
                          value={formData.tech_growth_unit}
                          onChange={handleChange}
                        >
                          <option value="mos">mos</option>
                          <option value="yrs">yrs</option>
                          <option value="yrs/mos">yrs/mos</option>
                        </select>
                      </div>
                    </div>
                    <p className="col-span-12 ">
                      <strong>{data?.payload?.tech_lang_keys[20]}</strong>
                    </p>
                    <div className="col-span-12 md:col-span-6   ">
                      <label htmlFor="tech_terminal" className="label">
                        {data?.payload?.tech_lang_keys["21"]}...:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_terminal"
                          id="tech_terminal"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_terminal}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>

                    {formData.tech_terminal_unit != "yrs/mos" && (
                      <>
                        <div className="col-span-12 md:col-span-6 ">
                          <label htmlFor="tech_terminal_time" className="label">
                            {data?.payload?.tech_lang_keys["19"]}...:
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_terminal_time"
                              id="tech_terminal_time"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_terminal_time}
                              onChange={handleChange}
                            />
                            <span className="input_unit">%</span>
                          </div>
                        </div>
                      </>
                    )}
                    {formData.tech_terminal_unit == "yrs/mos" && (
                      <>
                        <div className="col-span-12 md:col-span-6 ">
                          <label htmlFor="tech_terminal_one" className="label">
                            {data?.payload?.tech_lang_keys["19"]}...:
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_terminal_one"
                              id="tech_terminal_one"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_terminal_one}
                              onChange={handleChange}
                            />
                            <span className="input_unit">yrs</span>
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-6">
                          <label htmlFor="tech_terminal_sec" className="label">
                            &nbsp;
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_terminal_sec"
                              id="tech_terminal_sec"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_terminal_sec}
                              onChange={handleChange}
                            />
                            <span className="input_unit">mos</span>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="col-span-12 md:col-span-6  ">
                      <label htmlFor="tech_terminal_unit" className="label">
                        {data?.payload?.tech_lang_keys["18"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_terminal_unit"
                          id="tech_terminal_unit"
                          value={formData.tech_terminal_unit}
                          onChange={handleChange}
                        >
                          <option value="mos">mos</option>
                          <option value="yrs">yrs</option>
                          <option value="yrs/mos">yrs/mos</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
        </div>
        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      {formData.tech_main_unit == "Earnings per share (EPS)" ? (
                        <div className="w-full md:w-[80%] lg:w-[80%]  mt-2">
                          <p className="mt-2">
                            <strong>{data?.payload?.tech_lang_keys[28]}</strong>
                          </p>
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="40%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[29]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol}{" "}
                                  {Number(result?.tech_groeth_answer).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="40%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[30]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol}{" "}
                                  {Number(result?.tech_terminal_answer).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="40%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[31]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol}{" "}
                                  {Number(
                                    result?.tech_Total_intrinsic_answer
                                  ).toFixed(4)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="w-full md:w-[80%] lg:w-[80%]  mt-2">
                          <p className="mt-2">
                            <strong>{data?.payload?.tech_lang_keys[14]}</strong>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[22]}:
                          </p>
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[23]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol}{" "}
                                  {Number(result?.tech_terminal_value).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[24]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol}{" "}
                                  {Number(result?.tech_answer_sec).toFixed(4)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[24]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol}{" "}
                                  {Number(result?.tech_equdiry).toFixed(4)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[24]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol}{" "}
                                  {Number(result?.tech_fair_val).toFixed(4)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[24]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_percentage).toFixed(4)} %
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
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

export default DiscountedCashFlowCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useDiscountCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
const DiscountCalculator = () => {
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
    lang: "en",
    type: "8", // 1 2 3 4 5 6 7 8 9 10
    amount: "5",
    off: "3",
    pay: "",
    saving: "",
    dis_p: "",
    off2: "400",
    off3: "400",
    p1: "400",
    p2: "500",
    p3: "500",
    p4: "500",
    nbr: "3000",
    up: "4000",
    fix: "4000",
    tax: "yes",
    sale: "6",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDiscountCalculatorMutation();

  const getFilledCount = () => {
    return ["amount", "off", "pay", "saving"].filter(
      (field) => formData[field] !== ""
    ).length;
  };

  const isDisabled = (fieldName) => {
    const filledCount = getFilledCount();
    return filledCount >= 2 && formData[fieldName] === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        lang: formData.lang,
        type: formData.type,
        amount: formData.amount,
        dis_p: formData.dis_p,
        off: formData.off,
        off2: formData.off2,
        off3: formData.off3,
        p1: formData.p1,
        p2: formData.p2,
        p3: formData.p3,
        p4: formData.p4,
        nbr: formData.nbr,
        up: formData.up,
        fix: formData.fix,
        tax: formData.tax,
        sale: formData.sale,
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
      lang: "en",
      type: "8", // 1 2 3 4 5 6 7 8 9 10
      amount: "5",
      off: "3",
      pay: "",
      saving: "",
      dis_p: "",
      off2: "400",
      off3: "400",
      p1: "400",
      p2: "500",
      p3: "500",
      p4: "500",
      nbr: "3000",
      up: "4000",
      fix: "4000",
      tax: "yes",
      sale: "6",
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
            <input
              type="hidden"
              name="lang"
              id="lang"
              className="input my-2"
              aria-label="input"
              value={formData.lang}
            />

            <div className="grid grid-cols-1    gap-4" id="advance">
              <div className="space-y-2">
                <label htmlFor="type" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="type"
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="1">
                      % {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="2">
                      % {data?.payload?.tech_lang_keys["11"]} 2{" "}
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="3">
                      % {data?.payload?.tech_lang_keys["11"]} 3{" "}
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="4">
                      {" "}
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="5">
                      2{data?.payload?.tech_lang_keys["15"]} 1
                    </option>
                    <option value="6">
                      3{data?.payload?.tech_lang_keys["15"]} 2
                    </option>
                    <option value="7">
                      4 {data?.payload?.tech_lang_keys["15"]} 3
                    </option>
                    <option value="8">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="9">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="10">
                      {" "}
                      {data?.payload?.tech_lang_keys["18"]}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <p className="px-2 input_line my-4">
              {data?.payload?.tech_lang_keys["input_line"]}
            </p>
            <div className="grid grid-cols-2 mt-4 lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 hidden dis_p ">
                <label htmlFor="dis_p" className="label">
                  {data?.payload?.tech_lang_keys["discount"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="dis_p"
                    id="dis_p"
                    className="input my-2"
                    aria-label="input"
                    value={formData.dis_p}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>

              {(formData.type == "1" || formData.type == "4") && (
                <>
                  {/* Original */}
                  <div className="space-y-2 original">
                    <label htmlFor="amount" className="label">
                      {data?.payload?.tech_lang_keys["original"]}:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="amount"
                        id="amount"
                        className="input my-2"
                        aria-label="input"
                        value={formData.amount}
                        onChange={handleChange}
                        disabled={isDisabled("tech_amount")}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  {/* Discount */}
                  <div className="space-y-2 dis">
                    <label htmlFor="off" className="label">
                      {data?.payload?.tech_lang_keys["20"]} (%):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="off"
                        id="off"
                        className="input my-2"
                        aria-label="input"
                        value={formData.off}
                        onChange={handleChange}
                        disabled={isDisabled("tech_off")}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  {/* You Pay */}
                  <div className="space-y-2 pay">
                    <label htmlFor="pay" className="label">
                      You Pay
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="pay"
                        id="pay"
                        className="input my-2"
                        aria-label="input"
                        value={formData.pay}
                        onChange={handleChange}
                        disabled={isDisabled("tech_pay")}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  {/* You're saving */}
                  <div className="space-y-2 saving">
                    <label htmlFor="saving" className="label">
                      You're saving
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="saving"
                        id="saving"
                        className="input my-2"
                        aria-label="input"
                        value={formData.saving}
                        onChange={handleChange}
                        disabled={isDisabled("tech_saving")}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}

              {formData.type == "2" && (
                <>
                  <div className="space-y-2 dis">
                    <label htmlFor="off" className="label">
                      {data?.payload?.tech_lang_keys["20"]} (%):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="off"
                        id="off"
                        className="input my-2"
                        aria-label="input"
                        value={formData.off}
                        onChange={handleChange}
                        disabled={isDisabled("tech_off")}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="space-y-2  p1 ">
                    <label htmlFor="p1" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 1
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p1"
                        id="p1"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p1}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p2 ">
                    <label htmlFor="p2" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 2
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p2"
                        id="p2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p2}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}

              {formData.type == "3" && (
                <>
                  <div className="space-y-2 dis">
                    <label htmlFor="off" className="label">
                      {data?.payload?.tech_lang_keys["20"]} (%):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="off"
                        id="off"
                        className="input my-2"
                        aria-label="input"
                        value={formData.off}
                        onChange={handleChange}
                        disabled={isDisabled("tech_off")}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="space-y-2  p1 ">
                    <label htmlFor="p1" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 1
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p1"
                        id="p1"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p1}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p2 ">
                    <label htmlFor="p2" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 2
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p2"
                        id="p2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p2}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>

                  <div className="space-y-2  p3 ">
                    <label htmlFor="p3" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 3
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p3"
                        id="p3"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p3}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}

              {formData.type == "8" && (
                <>
                  <div className="space-y-2 original">
                    <label htmlFor="amount" className="label">
                      {data?.payload?.tech_lang_keys["original"]}:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="amount"
                        id="amount"
                        className="input my-2"
                        aria-label="input"
                        value={formData.amount}
                        onChange={handleChange}
                        disabled={isDisabled("tech_amount")}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2 dis">
                    <label htmlFor="off" className="label">
                      1st {data?.payload?.tech_lang_keys["20"]} (%):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="off"
                        id="off"
                        className="input my-2"
                        aria-label="input"
                        value={formData.off}
                        onChange={handleChange}
                        disabled={isDisabled("tech_off")}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="space-y-2  dis2 ">
                    <label htmlFor="off2" className="label">
                      2nd {data?.payload?.tech_lang_keys["20"]} (%)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="off2"
                        id="off2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.off2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.type == "9" && (
                <>
                  <div className="space-y-2 original">
                    <label htmlFor="amount" className="label">
                      {data?.payload?.tech_lang_keys["original"]}:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="amount"
                        id="amount"
                        className="input my-2"
                        aria-label="input"
                        value={formData.amount}
                        onChange={handleChange}
                        disabled={isDisabled("tech_amount")}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2 dis">
                    <label htmlFor="off" className="label">
                      1st {data?.payload?.tech_lang_keys["20"]} (%):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="off"
                        id="off"
                        className="input my-2"
                        aria-label="input"
                        value={formData.off}
                        onChange={handleChange}
                        disabled={isDisabled("tech_off")}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="space-y-2  dis2 ">
                    <label htmlFor="off2" className="label">
                      2nd {data?.payload?.tech_lang_keys["20"]} (%)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="off2"
                        id="off2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.off2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2  dis3 ">
                    <label htmlFor="off3" className="label">
                      3rd {data?.payload?.tech_lang_keys["20"]} (%)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="off3"
                        id="off3"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.off3}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.type == "5" && (
                <>
                  <div className="space-y-2  p1 ">
                    <label htmlFor="p1" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 1
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p1"
                        id="p1"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p1}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p2 ">
                    <label htmlFor="p2" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 2
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p2"
                        id="p2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p2}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}
              {formData.type == "6" && (
                <>
                  <div className="space-y-2  p1 ">
                    <label htmlFor="p1" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 1
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p1"
                        id="p1"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p1}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p2 ">
                    <label htmlFor="p2" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 2
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p2"
                        id="p2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p2}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p3 ">
                    <label htmlFor="p3" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 3
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p3"
                        id="p3"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p3}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}
              {formData.type == "7" && (
                <>
                  <div className="space-y-2  p1 ">
                    <label htmlFor="p1" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 1
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p1"
                        id="p1"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p1}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p2 ">
                    <label htmlFor="p2" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 2
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p2"
                        id="p2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p2}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p3 ">
                    <label htmlFor="p3" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 3
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p3"
                        id="p3"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p3}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p4 ">
                    <label htmlFor="p4" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 4
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="p4"
                        id="p4"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.p4}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}
              {formData.type == "10" && (
                <>
                  <div className="space-y-2  multi  ">
                    <label htmlFor="nbr" className="label">
                      {data?.payload?.tech_lang_keys["21"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="nbr"
                        id="nbr"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.nbr}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  multi  ">
                    <label htmlFor="up" className="label">
                      {data?.payload?.tech_lang_keys["22"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="up"
                        id="up"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.up}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  multi  ">
                    <label htmlFor="fix" className="label">
                      {data?.payload?.tech_lang_keys["23"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="fix"
                        id="fix"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.fix}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12 mt-5 md:col-span-6">
                <label className="pe-2 cursor-pointer" htmlFor="yes">
                  <input
                    type="radio"
                    name="tax"
                    value="yes"
                    id="yes"
                    className="mr-2 border cursor-pointer"
                    onChange={handleChange}
                    checked={formData.tax === "yes"}
                  />
                  <span>{data?.payload?.tech_lang_keys["25"]}</span>
                </label>

                <label className="cursor-pointer" htmlFor="no">
                  <input
                    type="radio"
                    name="tax"
                    className="mr-2 border cursor-pointer"
                    value="no"
                    id="no"
                    onChange={handleChange}
                    checked={formData.tax === "no"}
                  />
                  <span>{data?.payload?.tech_lang_keys["26"]}</span>
                </label>
              </div>
              {formData.tax == "no" && (
                <div className="col-span-12 md:col-span-6  sales">
                  <label htmlFor="sale" className="label">
                    {data?.payload?.tech_lang_keys["27"]}
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="sale"
                      id="sale"
                      className="input my-2"
                      aria-label="input"
                      min="0"
                      value={formData.sale}
                      onChange={handleChange}
                    />
                    <span className="input_unit">%</span>
                  </div>
                </div>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center ">
                    <div className="w-full  p-3 radius-10 mt-3">
                      {/* @if (isset($detail['nor']))
                                  <div className="w-full M">
                                      <table className="w-full">
                                          <tr>
                                              <td className="py-2 border-b">Normal Fiyat</td>
                                              <td className="py-2 border-b"><strong>{ $detail['nor'] } TL</strong></td>
                                          </tr>
                                          <tr>
                                              <td className="py-2 border-b">İndirimli Fiyat</td>
                                              <td className="py-2 border-b"><strong>{ $detail['ind'] } TL</strong></td>
                                          </tr>
                                          <tr>
                                              <td className="py-2 border-b">İndirim Miktarı</td>
                                              <td className="py-2 border-b"><strong>{ $detail['mik'] } TL</strong></td>
                                          </tr>
                                          <tr>
                                              <td className="py-2 border-b">İndirim Oranı (%)</td>
                                              <td className="py-2 border-b"><strong>{ $detail['ora'] }%</strong></td>
                                          </tr>
                                      </table>
                                  </div>
                              @elseif(isset($detail['arabic']))
                                  @if (isset($detail['third']))
                                      <div className="col-lg-8 mt-2 ms-auto  text-end">
                                          <p className="mt-2 text-end"><strong>المدخلات</strong></p>
                                          <table className="w-full">
                                              <tr>
                                                  <td className="py-2 border-b">{ $_POST['thir'] } %</td>
                                                  <td className="py-2 border-b" width="70%">:نسبة الخصم</td>
                                              </tr>
                                              <tr>
                                                  <td className="py-2 border-b">{ $_POST['first1'] } </td>
                                                  <td className="py-2 border-b" width="70%">: السعر قبل الخصم</td>
                                              </tr>
                                          </table>
                                          <p className="mt-2 text-end"><strong>النتيجة</strong></p>
                                          <table className="w-full">
                                              <tr>
                                                  <td className="py-2 border-b">{ $detail['dis'] }</td>
                                                  <td className="py-2 border-b" width="70%">:السعر بعد الخصم يصبح</td>
                                              </tr>
                                              <tr>
                                                  <td className="py-2 border-b">{ $detail['third'] } </td>
                                                  <td className="py-2 border-b" width="70%"> :قيمة الخصم</td>
                                              </tr>
                                          </table>
                                      </div>
                                  @elseif(isset($detail['first']))
                                      <div className="col-lg-8 mt-2 ms-auto  text-end">
                                          <p className="mt-2 text-end"><strong>المدخلات</strong></p>
                                          <table className="w-full">
                                              <tr>
                                                  <td className="py-2 border-b">{ $_POST['thir'] } %</td>
                                                  <td className="py-2 border-b" width="70%">:نسبة الخصم</td>
                                              </tr>
                                              <tr>
                                                  <td className="py-2 border-b">{ $_POST['sec'] } </td>
                                                  <td className="py-2 border-b" width="70%"> :السعر بعد الخصم</td>
                                              </tr>
                                          </table>
                                          <p className="mt-2 text-end"><strong>النتيجة</strong></p>
                                          <table className="w-full">
                                              <tr>
                                                  <td className="py-2 border-b">{ $detail['dis'] } %</td>
                                                  <td className="py-2 border-b" width="70%">:اقيمة الخصم</td>
                                              </tr>
                                              <tr>
                                                  <td className="py-2 border-b">{ $detail['first'] } </td>
                                                  <td className="py-2 border-b" width="70%">:السعر قبل الخصم كان</td>
                                              </tr>
                                          </table>
                                      </div>
                                  @elseif(isset($detail['thirl']))
                                      <div className="col-lg-8 mt-2 ms-auto text-end">
                                          <p className="mt-2 text-end"><strong>المدخلات</strong></p>
                                          <table className="w-full">
                                              <tr>
                                                  <td className="py-2 border-b">{ $_POST['first1'] } </td>
                                                  <td className="py-2 border-b" width="70%">:السعر قبل الخصم</td>
                                              </tr>
                                              <tr>
                                                  <td className="py-2 border-b">{ $_POST['sec'] } </td>
                                                  <td className="py-2 border-b" width="70%"> :السعر بعد الخصم</td>
                                              </tr>
                                          </table>
                                          <p className="mt-2 text-end"><strong>النتيجة</strong></p>
                                          <table className="w-full">
                                              <tr>
                                                  <td className="py-2 border-b">{ $detail['dis'] } </td>
                                                  <td className="py-2 border-b" width="70%">:اقيمة الخصم</td>
                                              </tr>
                                              <tr>
                                                  <td className="py-2 border-b">{ $detail['thirl'] } % </td>
                                                  <td className="py-2 border-b" width="70%">:نسبة الخصم على سعر السلعة</td>
                                              </tr>
                                          </table>
                                      </div>
                                  @endif
                              @elseif(isset($detail['discount_id']))
                                  <p className="mt-2 font-s-18"><strong>Diskon Anda</strong></p>
                                  <div className="col-lg-8 mt-2">
                                      <table className="w-full">
                                          <tr>
                                              <td className="py-2 border-b">Harga Sebelum Diskon</td>
                                              <td className="py-2 border-b"><strong>{ number_format($_POST['id_rp'], 2) } Rp</strong></td>
                                          </tr>
                                          <tr>
                                              <td className="py-2 border-b">Besar Diskon</td>
                                              <td className="py-2 border-b"><strong>{ number_format($detail['discount_id'], 2) } Rp  ({ $_POST['id_p'] } %)</strong></td>
                                          </tr>
                                          <tr>
                                              <td className="py-2 border-b">Harga Setelah Diskon</td>
                                              <td className="py-2 border-b"><strong>{ number_format($_POST['id_rp'] - $detail['discount_id'], 2) } Rp</strong></td>
                                          </tr>
                                      </table>
                                  </div>
                              @else */}
                      <div className="grid grid-cols-12 gap-1 md:gap-3 text-[14px] md:text-[18px]">
                        <div className="col-span-12 md:col-span-8 overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["28"]}
                            </strong>
                          </p>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["discount"]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {formData?.tech_cur} {result?.pay}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["save"]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {formData?.tech_cur}
                                  {result?.Ans}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {result?.ave && (
                          <div className="col-span-12 md:col-span-8">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["29"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_cur} {result?.ave}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2" width="70%">
                                    <strong>
                                      {result?.per}%{" "}
                                      {data?.payload?.tech_lang_keys["30"]}{" "}
                                      {result?.stand}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}

                        {result?.effect && (
                          <div className="col-span-12 ">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["31"]}{" "}
                                      {result?.effect} %,
                                      {data?.payload?.tech_lang_keys["32"]}{" "}
                                      {result?.sum}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                      {/* @endif */}
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

export default DiscountCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDiscountCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

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
    tech_lang: "en",
    tech_type: "8", // 1 2 3 4 5 6 7 8 9 10
    tech_amount: "5",
    tech_off: "3",
    tech_pay: "",
    tech_saving: "",
    tech_dis_p: "",
    tech_off2: "400",
    tech_off3: "400",
    tech_p1: "400",
    tech_p2: "500",
    tech_p3: "500",
    tech_p4: "500",
    tech_nbr: "3000",
    tech_up: "4000",
    tech_fix: "4000",
    tech_tax: "yes",
    tech_sale: "6",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDiscountCalculatorMutation();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  // };

  const getFilledCount = () => {
    return ["tech_amount", "tech_off", "tech_pay", "tech_saving"].filter(
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!formData.tech_type ) {
    //   setFormError("Please fill in input.");
    //   return;
    // }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_lang: formData.tech_lang,
        tech_type: formData.tech_type,
        tech_amount: formData.tech_amount,
        tech_dis_p: formData.tech_dis_p,
        tech_off: formData.tech_off,
        tech_off2: formData.tech_off2,
        tech_off3: formData.tech_off3,
        tech_p1: formData.tech_p1,
        tech_p2: formData.tech_p2,
        tech_p3: formData.tech_p3,
        tech_p4: formData.tech_p4,
        tech_nbr: formData.tech_nbr,
        tech_up: formData.tech_up,
        tech_fix: formData.tech_fix,
        tech_tax: formData.tech_tax,
        tech_sale: formData.tech_sale,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      console.log(err);
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_lang: "en",
      tech_type: "8", // 1 2 3 4 5 6 7 8 9 10
      tech_amount: "5",
      tech_off: "3",
      tech_pay: "",
      tech_saving: "",
      tech_dis_p: "",
      tech_off2: "400",
      tech_off3: "400",
      tech_p1: "400",
      tech_p2: "500",
      tech_p3: "500",
      tech_p4: "500",
      tech_nbr: "3000",
      tech_up: "4000",
      tech_fix: "4000",
      tech_tax: "yes",
      tech_sale: "6",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <input
              type="hidden"
              name="tech_lang"
              id="tech_lang"
              className="input my-2"
              aria-label="input"
              value={formData.tech_lang}
            />

            <div className="grid grid-cols-1    gap-4" id="advance">
              <div className="space-y-2">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
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
                <label htmlFor="tech_dis_p" className="label">
                  {data?.payload?.tech_lang_keys["discount"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_dis_p"
                    id="tech_dis_p"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_dis_p}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>

              {(formData.tech_type == "1" || formData.tech_type == "4") && (
                <>
                  {/* Original */}
                  <div className="space-y-2 original">
                    <label htmlFor="tech_amount" className="label">
                      {data?.payload?.tech_lang_keys["original"]}:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_amount"
                        id="tech_amount"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_amount}
                        onChange={handleChange}
                        disabled={isDisabled("tech_amount")}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  {/* Discount */}
                  <div className="space-y-2 dis">
                    <label htmlFor="tech_off" className="label">
                      {data?.payload?.tech_lang_keys["20"]} (%):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_off"
                        id="tech_off"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_off}
                        onChange={handleChange}
                        disabled={isDisabled("tech_off")}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  {/* You Pay */}
                  <div className="space-y-2 pay">
                    <label htmlFor="tech_pay" className="label">
                      You Pay
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_pay"
                        id="tech_pay"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_pay}
                        onChange={handleChange}
                        disabled={isDisabled("tech_pay")}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  {/* You're saving */}
                  <div className="space-y-2 saving">
                    <label htmlFor="tech_saving" className="label">
                      You're saving
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_saving"
                        id="tech_saving"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_saving}
                        onChange={handleChange}
                        disabled={isDisabled("tech_saving")}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}

              {formData.tech_type == "2" && (
                <>
                  <div className="space-y-2 dis">
                    <label htmlFor="tech_off" className="label">
                      {data?.payload?.tech_lang_keys["20"]} (%):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_off"
                        id="tech_off"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_off}
                        onChange={handleChange}
                        disabled={isDisabled("tech_off")}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="space-y-2  p1 ">
                    <label htmlFor="tech_p1" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 1
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p1"
                        id="tech_p1"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p1}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p2 ">
                    <label htmlFor="tech_p2" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 2
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p2"
                        id="tech_p2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p2}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}

              {formData.tech_type == "3" && (
                <>
                  <div className="space-y-2 dis">
                    <label htmlFor="tech_off" className="label">
                      {data?.payload?.tech_lang_keys["20"]} (%):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_off"
                        id="tech_off"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_off}
                        onChange={handleChange}
                        disabled={isDisabled("tech_off")}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="space-y-2  p1 ">
                    <label htmlFor="tech_p1" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 1
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p1"
                        id="tech_p1"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p1}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p2 ">
                    <label htmlFor="tech_p2" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 2
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p2"
                        id="tech_p2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p2}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>

                  <div className="space-y-2  p3 ">
                    <label htmlFor="tech_p3" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 3
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p3"
                        id="tech_p3"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p3}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}

              {formData.tech_type == "8" && (
                <>
                  <div className="space-y-2 original">
                    <label htmlFor="tech_amount" className="label">
                      {data?.payload?.tech_lang_keys["original"]}:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_amount"
                        id="tech_amount"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_amount}
                        onChange={handleChange}
                        disabled={isDisabled("tech_amount")}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2 dis">
                    <label htmlFor="tech_off" className="label">
                      1st {data?.payload?.tech_lang_keys["20"]} (%):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_off"
                        id="tech_off"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_off}
                        onChange={handleChange}
                        disabled={isDisabled("tech_off")}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="space-y-2  dis2 ">
                    <label htmlFor="tech_off2" className="label">
                      2nd {data?.payload?.tech_lang_keys["20"]} (%)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_off2"
                        id="tech_off2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_off2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_type == "9" && (
                <>
                  <div className="space-y-2 original">
                    <label htmlFor="tech_amount" className="label">
                      {data?.payload?.tech_lang_keys["original"]}:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_amount"
                        id="tech_amount"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_amount}
                        onChange={handleChange}
                        disabled={isDisabled("tech_amount")}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2 dis">
                    <label htmlFor="tech_off" className="label">
                      1st {data?.payload?.tech_lang_keys["20"]} (%):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_off"
                        id="tech_off"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_off}
                        onChange={handleChange}
                        disabled={isDisabled("tech_off")}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="space-y-2  dis2 ">
                    <label htmlFor="tech_off2" className="label">
                      2nd {data?.payload?.tech_lang_keys["20"]} (%)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_off2"
                        id="tech_off2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_off2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2  dis3 ">
                    <label htmlFor="tech_off3" className="label">
                      3rd {data?.payload?.tech_lang_keys["20"]} (%)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_off3"
                        id="tech_off3"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_off3}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type == "5" && (
                <>
                  <div className="space-y-2  p1 ">
                    <label htmlFor="tech_p1" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 1
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p1"
                        id="tech_p1"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p1}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p2 ">
                    <label htmlFor="tech_p2" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 2
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p2"
                        id="tech_p2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p2}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type == "6" && (
                <>
                  <div className="space-y-2  p1 ">
                    <label htmlFor="tech_p1" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 1
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p1"
                        id="tech_p1"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p1}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p2 ">
                    <label htmlFor="tech_p2" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 2
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p2"
                        id="tech_p2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p2}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p3 ">
                    <label htmlFor="tech_p3" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 3
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p3"
                        id="tech_p3"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p3}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type == "7" && (
                <>
                  <div className="space-y-2  p1 ">
                    <label htmlFor="tech_p1" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 1
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p1"
                        id="tech_p1"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p1}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p2 ">
                    <label htmlFor="tech_p2" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 2
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p2"
                        id="tech_p2"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p2}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p3 ">
                    <label htmlFor="tech_p3" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 3
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p3"
                        id="tech_p3"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p3}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  p4 ">
                    <label htmlFor="tech_p4" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 4
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_p4"
                        id="tech_p4"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_p4}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type == "10" && (
                <>
                  <div className="space-y-2  multi  ">
                    <label htmlFor="tech_nbr" className="label">
                      {data?.payload?.tech_lang_keys["21"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_nbr"
                        id="tech_nbr"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_nbr}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  multi  ">
                    <label htmlFor="tech_up" className="label">
                      {data?.payload?.tech_lang_keys["22"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_up"
                        id="tech_up"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_up}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="space-y-2  multi  ">
                    <label htmlFor="tech_fix" className="label">
                      {data?.payload?.tech_lang_keys["23"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_fix"
                        id="tech_fix"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        value={formData.tech_fix}
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
                <label className="pe-2" htmlFor="yes">
                  <input
                    type="radio"
                    name="tech_tax"
                    value="yes"
                    id="yes"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_tax === "yes"}
                  />
                  <span>{data?.payload?.tech_lang_keys["25"]}</span>
                </label>

                <label htmlFor="no">
                  <input
                    type="radio"
                    name="tech_tax"
                    className="mr-2 border"
                    value="no"
                    id="no"
                    onChange={handleChange}
                    checked={formData.tech_tax === "no"}
                  />
                  <span>{data?.payload?.tech_lang_keys["26"]}</span>
                </label>
              </div>
              {formData.tech_tax == "no" && (
                <div className="col-span-12 md:col-span-6  sales">
                  <label htmlFor="tech_sale" className="label">
                    {data?.payload?.tech_lang_keys["27"]}
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_sale"
                      id="tech_sale"
                      className="input my-2"
                      aria-label="input"
                      min="0"
                      value={formData.tech_sale}
                      onChange={handleChange}
                    />
                    <span className="input_unit">%</span>
                  </div>
                </div>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center ">
                    <div className="w-full md:w-[70%] p-3 radius-10 mt-3">
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
                      <div className="mt-2">
                        <div className="col-lg-8 mt-2">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="mt-2">
                                  <strong>
                                    <p className="text-[18px]">
                                      {data?.payload?.tech_lang_keys["28"]}
                                    </p>
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["discount"]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {formData?.tech_cur} {result?.tech_pay}
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
                                  {result?.tech_Ans}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {result?.tech_ave && (
                          <div className="col-lg-8">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["29"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_cur} {result?.tech_ave}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2" width="70%">
                                    <strong>
                                      {result?.tech_per}%{" "}
                                      {data?.payload?.tech_lang_keys["30"]}{" "}
                                      {result?.tech_stand}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}

                        {result?.tech_effect && (
                          <div className="col-lg-8">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["31"]}{" "}
                                      {result?.tech_effect} %,
                                      {data?.payload?.tech_lang_keys["32"]}{" "}
                                      {result?.tech_sum}
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

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useBattingAverageCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BattingAverageCalculator = () => {
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
    tech_operations: "12",
    tech_first: "5",
    tech_second: "3",
    tech_third: "4",
    tech_four: "6",
    tech_five: "2",
    tech_fiveb: "4",
    tech_quantity: "7",
    tech_seven: "9",
    tech_eight: "3",
    tech_nine: "7",
    tech_ten: "3",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBattingAverageCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations || !formData.tech_operations) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
        tech_third: formData.tech_third,
        tech_four: formData.tech_four,
        tech_five: formData.tech_five,
        tech_fiveb: formData.tech_fiveb,
        tech_quantity: formData.tech_quantity,
        tech_seven: formData.tech_seven,
        tech_eight: formData.tech_eight,
        tech_nine: formData.tech_nine,
        tech_ten: formData.tech_ten,
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
      tech_operations: "12",
      tech_first: "5",
      tech_second: "3",
      tech_third: "4",
      tech_four: "6",
      tech_five: "2",
      tech_fiveb: "4",
      tech_quantity: "7",
      tech_seven: "9",
      tech_eight: "3",
      tech_nine: "7",
      tech_ten: "3",
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_operations" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_operations"
                    id="tech_operations"
                    value={formData.tech_operations}
                    onChange={handleChange}
                  >
                    <option value="3">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="7">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="8">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="9">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="10">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="11">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="12">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="13">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="14">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="15">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="16">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="17">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="18">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="19">
                      {data?.payload?.tech_lang_keys["18"]}
                    </option>
                    <option value="20">
                      {data?.payload?.tech_lang_keys["19"]}
                    </option>
                    <option value="21">
                      {data?.payload?.tech_lang_keys["20"]}
                    </option>
                    <option value="22">
                      {data?.payload?.tech_lang_keys["21"]}
                    </option>
                    <option value="23">
                      {data?.payload?.tech_lang_keys["22"]}
                    </option>
                    <option value="24">
                      {data?.payload?.tech_lang_keys["23"]}
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "4" ||
                formData.tech_operations == "5" ||
                formData.tech_operations == "6" ||
                formData.tech_operations == "7" ||
                formData.tech_operations == "8" ||
                formData.tech_operations == "9" ||
                formData.tech_operations == "10" ||
                formData.tech_operations == "11" ||
                formData.tech_operations == "12" ||
                formData.tech_operations == "13" ||
                formData.tech_operations == "14" ||
                formData.tech_operations == "15" ||
                formData.tech_operations == "16" ||
                formData.tech_operations == "17" ||
                formData.tech_operations == "18" ||
                formData.tech_operations == "19" ||
                formData.tech_operations == "20" ||
                formData.tech_operations == "21" ||
                formData.tech_operations == "22" ||
                formData.tech_operations == "23" ||
                formData.tech_operations == "24") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="1"
                  >
                    {formData?.tech_operations == "3" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          {data?.payload?.tech_lang_keys["24"]}:
                        </label>
                      </>
                    ) : formData?.tech_operations == "4" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          {" "}
                          Number of At Bats:
                        </label>
                      </>
                    ) : formData?.tech_operations == "5" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          At Bats:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "6" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          At Bats:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "7" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          Singles :
                        </label>
                      </>
                    ) : formData?.tech_operations == "8" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          {" "}
                          Plate Appearances:
                        </label>
                      </>
                    ) : formData?.tech_operations == "9" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          At Bats:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "10" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          At Bats:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "11" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          At Bats:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "12" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          Total Bases :
                        </label>
                      </>
                    ) : formData?.tech_operations == "13" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          Singles:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "14" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          {" "}
                          At Bats:
                        </label>
                      </>
                    ) : formData?.tech_operations == "15" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          Assists:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "16" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          Games Played:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "17" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          Innings Played:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "18" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          {" "}
                          Earned Runs:
                        </label>
                      </>
                    ) : formData?.tech_operations == "19" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          Hits Allowed:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "20" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          Innings Pitched:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "21" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          Innings Pitched:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "22" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          Innings Pitched:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "23" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          Innings Pitched:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "24" ? (
                      <>
                        <label htmlFor="tech_first" className="label" id="lb_1">
                          Strikeouts:{" "}
                        </label>
                      </>
                    ) : null}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_first"
                        id="tech_first"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_first}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "4" ||
                formData.tech_operations == "5" ||
                formData.tech_operations == "6" ||
                formData.tech_operations == "7" ||
                formData.tech_operations == "8" ||
                formData.tech_operations == "9" ||
                formData.tech_operations == "10" ||
                formData.tech_operations == "11" ||
                formData.tech_operations == "12" ||
                formData.tech_operations == "13" ||
                formData.tech_operations == "14" ||
                formData.tech_operations == "15" ||
                formData.tech_operations == "16" ||
                formData.tech_operations == "17" ||
                formData.tech_operations == "18" ||
                formData.tech_operations == "19" ||
                formData.tech_operations == "20" ||
                formData.tech_operations == "21" ||
                formData.tech_operations == "22" ||
                formData.tech_operations == "23" ||
                formData.tech_operations == "24") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 second"
                    id="2"
                  >
                    {formData?.tech_operations == "3" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          {data?.payload?.tech_lang_keys["25"]}:
                        </label>
                      </>
                    ) : formData?.tech_operations == "4" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          {" "}
                          Number of Hits:
                        </label>
                      </>
                    ) : formData?.tech_operations == "5" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Hits:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "6" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Singles:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "7" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Doubles :
                        </label>
                      </>
                    ) : formData?.tech_operations == "8" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          {" "}
                          Non Intentional Walks (BB-IBB):
                        </label>
                      </>
                    ) : formData?.tech_operations == "9" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Hits:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "10" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Doubles:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "11" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Hits:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "12" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Hits :
                        </label>
                      </>
                    ) : formData?.tech_operations == "13" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Doubles:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "14" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          {" "}
                          Home Runs:
                        </label>
                      </>
                    ) : formData?.tech_operations == "15" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Putouts:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "16" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Putouts:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "17" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Putouts:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "18" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          {" "}
                          Innings Pitched:
                        </label>
                      </>
                    ) : formData?.tech_operations == "19" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Walks Allowed:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "20" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Hits Allowed:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "21" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Home Runs:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "22" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Strikeouts:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "23" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Innings Pitched:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "24" ? (
                      <>
                        <label
                          htmlFor="tech_second"
                          className="label"
                          id="lb_2"
                        >
                          Walks:{" "}
                        </label>
                      </>
                    ) : null}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_second"
                        id="tech_second"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_second}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {(formData.tech_operations == "3" ||
                formData.tech_operations == "5" ||
                formData.tech_operations == "6" ||
                formData.tech_operations == "7" ||
                formData.tech_operations == "8" ||
                formData.tech_operations == "9" ||
                formData.tech_operations == "10" ||
                formData.tech_operations == "11" ||
                formData.tech_operations == "12" ||
                formData.tech_operations == "13" ||
                formData.tech_operations == "15" ||
                formData.tech_operations == "16" ||
                formData.tech_operations == "17" ||
                formData.tech_operations == "19") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 third "
                    id="3"
                  >
                    {formData?.tech_operations == "3" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          {data?.payload?.tech_lang_keys["26"]}:
                        </label>
                      </>
                    ) : formData?.tech_operations == "4" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          {data?.payload?.tech_lang_keys["26"]}:
                        </label>
                      </>
                    ) : formData?.tech_operations == "5" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          Walks:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "6" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          Doubles:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "7" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          Triples :
                        </label>
                      </>
                    ) : formData?.tech_operations == "8" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          {" "}
                          Hit by Pitch:
                        </label>
                      </>
                    ) : formData?.tech_operations == "9" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          Home Runs:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "10" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          Triples:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "11" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          Walks:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "12" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          Walks :
                        </label>
                      </>
                    ) : formData?.tech_operations == "13" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          Triples:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "14" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          {data?.payload?.tech_lang_keys["26"]}:
                        </label>
                      </>
                    ) : formData?.tech_operations == "15" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          Errors:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "16" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          Assists:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "17" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          Assists:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations == "18" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          {data?.payload?.tech_lang_keys["26"]}:
                        </label>
                      </>
                    ) : formData?.tech_operations == "19" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          {data?.payload?.tech_lang_keys["26"]}:
                        </label>
                      </>
                    ) : formData?.tech_operations == "20" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          {data?.payload?.tech_lang_keys["26"]}:
                        </label>
                      </>
                    ) : formData?.tech_operations == "21" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          {data?.payload?.tech_lang_keys["26"]}:
                        </label>
                      </>
                    ) : formData?.tech_operations == "22" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          {data?.payload?.tech_lang_keys["26"]}:
                        </label>
                      </>
                    ) : formData?.tech_operations == "23" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          {data?.payload?.tech_lang_keys["26"]}:
                        </label>
                      </>
                    ) : formData?.tech_operations == "24" ? (
                      <>
                        <label htmlFor="tech_third" className="label" id="lb_3">
                          {data?.payload?.tech_lang_keys["26"]}:
                        </label>
                      </>
                    ) : null}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_third"
                        id="tech_third"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_third}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "5" ||
                formData.tech_operations == "6" ||
                formData.tech_operations == "7" ||
                formData.tech_operations == "8" ||
                formData.tech_operations == "9" ||
                formData.tech_operations == "10" ||
                formData.tech_operations == "11" ||
                formData.tech_operations == "12" ||
                formData.tech_operations == "13") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 four  "
                    id="4"
                  >
                    {formData?.tech_operations === "5" ? (
                      <>
                        <label htmlFor="tech_four" className="label" id="lb_4">
                          Hit by Pitch{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "6" ? (
                      <>
                        <label htmlFor="tech_four" className="label" id="lb_4">
                          Triples{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "7" ? (
                      <>
                        <label htmlFor="tech_four" className="label" id="lb_4">
                          Home Runs{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "8" ? (
                      <>
                        <label htmlFor="tech_four" className="label" id="lb_4">
                          Singles{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "9" ? (
                      <>
                        <label htmlFor="tech_four" className="label" id="lb_4">
                          Sacrifice Flies{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "10" ? (
                      <>
                        <label htmlFor="tech_four" className="label" id="lb_4">
                          Home Runs{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "11" ? (
                      <>
                        <label htmlFor="tech_four" className="label" id="lb_4">
                          Total Bases{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "12" ? (
                      <>
                        <label htmlFor="tech_four" className="label" id="lb_4">
                          Stolen Bases{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "13" ? (
                      <>
                        <label htmlFor="tech_four" className="label" id="lb_4">
                          Home Runs{" "}
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_four" className="label" id="lb_4">
                          {data?.payload?.tech_lang_keys["27"]} (a):{" "}
                        </label>
                      </>
                    )}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_four"
                        id="tech_four"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_four}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "5" ||
                formData.tech_operations == "6" ||
                formData.tech_operations == "7" ||
                formData.tech_operations == "8" ||
                formData.tech_operations == "9" ||
                formData.tech_operations == "11" ||
                formData.tech_operations == "12") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 five "
                    id="5"
                  >
                    {formData?.tech_operations === "5" ? (
                      <>
                        <label htmlFor="tech_five" className="label" id="lb_5">
                          Sacrifice Flies{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "6" ? (
                      <>
                        <label htmlFor="tech_five" className="label" id="lb_5">
                          Home Runs{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "7" ? (
                      <>
                        <label htmlFor="tech_five" className="label" id="lb_5">
                          Hits{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "8" ? (
                      <>
                        <label htmlFor="tech_five" className="label" id="lb_5">
                          Doubles{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "9" ? (
                      <>
                        <label htmlFor="tech_five" className="label" id="lb_5">
                          Strikeouts{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "11" ? (
                      <>
                        <label htmlFor="tech_five" className="label" id="lb_5">
                          Hit by Pitch{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "12" ? (
                      <>
                        <label htmlFor="tech_five" className="label" id="lb_5">
                          Caught Stealing{" "}
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_five" className="label" id="lb_5">
                          {data?.payload?.tech_lang_keys["28"]}:{" "}
                        </label>
                      </>
                    )}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_five"
                        id="tech_five"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_five}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "7" ||
                formData.tech_operations == "8" ||
                formData.tech_operations == "11") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 fiveb "
                    id="5b"
                  >
                    {formData?.tech_operations === "7" ? (
                      <>
                        <label
                          htmlFor="tech_fiveb"
                          className="label"
                          id="lb_5b"
                        >
                          Sacrifice Flies{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "8" ? (
                      <>
                        <label
                          htmlFor="tech_fiveb"
                          className="label"
                          id="lb_5b"
                        >
                          Home Runs{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "11" ? (
                      <>
                        <label
                          htmlFor="tech_fiveb"
                          className="label"
                          id="lb_5b"
                        >
                          IBB (Intentional Base on Balls){" "}
                        </label>
                      </>
                    ) : (
                      <>
                        <label
                          htmlFor="tech_fiveb"
                          className="label"
                          id="lb_5b"
                        >
                          {data?.payload?.tech_lang_keys["29"]}:{" "}
                        </label>
                      </>
                    )}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_fiveb"
                        id="tech_fiveb"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_fiveb}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "7" ||
                formData.tech_operations == "8" ||
                formData.tech_operations == "11" ||
                formData.tech_operations == "12") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 six "
                    id="6"
                  >
                    {formData?.tech_operations === "7" ? (
                      <>
                        <label
                          htmlFor="tech_quantity"
                          className="label"
                          id="lb_6"
                        >
                          Walks:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "8" ? (
                      <>
                        <label
                          htmlFor="tech_quantity"
                          className="label"
                          id="lb_6"
                        >
                          Triples :{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "11" ? (
                      <>
                        <label
                          htmlFor="tech_quantity"
                          className="label"
                          id="lb_6"
                        >
                          GIDP (Grounded into Double Play):{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "12" ? (
                      <>
                        <label
                          htmlFor="tech_quantity"
                          className="label"
                          id="lb_6"
                        >
                          At Bats::{" "}
                        </label>
                      </>
                    ) : (
                      <>
                        <label
                          htmlFor="tech_quantity"
                          className="label"
                          id="lb_6"
                        >
                          {data?.payload?.tech_lang_keys["30"]}:{" "}
                        </label>
                      </>
                    )}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_quantity"
                        id="tech_quantity"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_quantity}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "7" ||
                formData.tech_operations == "8" ||
                formData.tech_operations == "11") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 seven "
                    id="7"
                  >
                    {formData?.tech_operations === "7" ? (
                      <>
                        <label htmlFor="tech_seven" className="label" id="lb_7">
                          Hits by Pitch:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "8" ? (
                      <>
                        <label htmlFor="tech_seven" className="label" id="lb_7">
                          Reached Base on Error :{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "11" ? (
                      <>
                        <label htmlFor="tech_seven" className="label" id="lb_7">
                          Sacrifice Hits:{" "}
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_seven" className="label" id="lb_7">
                          {data?.payload?.tech_lang_keys["31"]}:{" "}
                        </label>
                      </>
                    )}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_seven"
                        id="tech_seven"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_seven}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "7" ||
                formData.tech_operations == "11") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 eight "
                    id="8"
                  >
                    {formData?.tech_operations === "7" ? (
                      <>
                        <label htmlFor="tech_eight" className="label" id="lb_8">
                          At Bats:{" "}
                        </label>
                      </>
                    ) : formData?.tech_operations === "11" ? (
                      <>
                        <label htmlFor="tech_eight" className="label" id="lb_8">
                          Sacrifice Flies :{" "}
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_eight" className="label" id="lb_8">
                          {data?.payload?.tech_lang_keys["31"]}:{" "}
                        </label>
                      </>
                    )}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_eight"
                        id="tech_eight"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_eight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "11") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 nine "
                    id="9"
                  >
                    {formData?.tech_operations === "11" ? (
                      <>
                        <label htmlFor="tech_nine" className="label" id="lb_9">
                          Stolen Bases:{" "}
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_nine" className="label" id="lb_9">
                          {data?.payload?.tech_lang_keys["31"]}:{" "}
                        </label>
                      </>
                    )}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_nine"
                        id="tech_nine"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_nine}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "11") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 ten "
                    id="10"
                  >
                    {formData?.tech_operations === "11" ? (
                      <>
                        <label htmlFor="tech_ten" className="label" id="lb_10">
                          Caught Stealing:{" "}
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_ten" className="label" id="lb_10">
                          {data?.payload?.tech_lang_keys["31"]}:{" "}
                        </label>
                      </>
                    )}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_ten"
                        id="tech_ten"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_ten}
                        onChange={handleChange}
                      />
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
                      <div className="w-full my-2">
                        <div className="text-center">
                          <p className="text-[20px]">
                            <strong>{result?.tech_heading}</strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong className="text-blue">
                                {result?.tech_batting}
                              </strong>
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

export default BattingAverageCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useMoneyCounterCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MoneyCounterCalculator = () => {
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
    tech_currency: "INR",
    tech_checkbox1: "true",
    tech_checkbox2: "true",
    tech_checkbox3: "true",
    tech_bank_notes: [],
    tech_coins: [],
    tech_rolls: [],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMoneyCounterCalculatorMutation();

  const handleChange = (e, type = null, index = null) => {
    const { name, value, type: inputType, checked } = e.target;

    if (type && index !== null) {
      // For array inputs like tech_bank_notes[], tech_coins[], etc.
      const newValues = [...(formData[type] || [])];
      newValues[index] = value.toString(); // Ensure the value is stored as a string
      setFormData((prevData) => ({ ...prevData, [type]: newValues }));
    } else {
      // For checkboxes, store "true" or "false" as string
      const newValue =
        inputType === "checkbox"
          ? checked
            ? "true"
            : "false"
          : value.toString();
      setFormData((prevData) => ({ ...prevData, [name]: newValue }));
    }

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_currency) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_currency: formData.tech_currency,
        tech_checkbox1: formData.tech_checkbox1,
        tech_checkbox2: formData.tech_checkbox2,
        tech_checkbox3: formData.tech_checkbox3,
        tech_bank_notes: formData.tech_bank_notes,
        tech_coins: formData.tech_coins,
        tech_rolls: formData.tech_rolls,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      console.log(err);
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };
  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_currency: "INR",
      tech_checkbox1: "true",
      tech_checkbox2: "true",
      tech_checkbox3: "true",
      tech_bank_notes: [],
      tech_coins: [],
      tech_rolls: [],
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
  const [enabled, setEnabled] = useState({
    hours: true,
    minutes: true,
    seconds: false,
  });

  const inputLimits = {
    INR: {
      tech_bank_notes: {
        count: 9,
        values: [
          "$ 1",
          "$ 2",
          "5 ¢",
          "10 ¢",
          "$ 20",
          "50 ¢",
          "$ 100",
          "$ 100",
          "$ 100",
        ],
      },
      tech_coins: {
        count: 6,
        values: ["$ 1", "5 ¢", "10 ¢", "25 ¢", "50 ¢", "$ 1"],
      },
      tech_rolls: {
        count: 6,
        values: ["$ 1", "5 ¢", "10 ¢", "25 ¢", "50 ¢", "$ 1"],
      },
    },
    USD: {
      tech_bank_notes: {
        count: 7,
        values: ["$ 1", "$ 2", "$ 5", "10 $", "20 $", "$ 50", "100 $"],
      },
      tech_coins: {
        count: 6,
        values: ["1 ¢", "5 ¢", "10 ¢", "25 ¢", "50 ¢", "$ 1"],
      },
      tech_rolls: {
        count: 6,
        values: ["1 ¢", "5 ¢", "10 ¢", "25 ¢", "50 ¢", "$ 1"],
      },
    },
    EUR: {
      tech_bank_notes: {
        count: 7,
        values: ["€ 5", "€ 10", "€ 20", "€ 50", "€ 100", "€ 200", "€ 500"],
      },
      tech_coins: {
        count: 8,
        values: ["1 c", "2 c", "5 c", "10 c", "20 c", "50 c", "€ 1", "€ 2"],
      },
      tech_rolls: {
        count: 8,
        values: ["1 c", "2 c", "5 c", "10 c", "20 c", "50 c", "€ 1", "€ 2"],
      },
    },
    JPY: {
      tech_bank_notes: {
        count: 4,
        values: ["¥ 1000", "¥ 2000", "¥ 5000", "¥ 10000"],
      },
      tech_coins: {
        count: 6,
        values: ["¥ 1", "¥ 5", "¥ 10", "¥ 50", "¥ 100", "¥ 500"],
      },
      tech_rolls: {
        count: 6,
        values: ["¥ 1", "¥ 5", "¥ 10", "¥ 50", "¥ 100", "¥ 500"],
      },
    },
    GBP: {
      tech_bank_notes: {
        count: 4,
        values: ["£ 5", "£ 10", "£ 20", "£ 50"],
      },
      tech_coins: {
        count: 8,
        values: ["1 p", "2 p", "5 p", "10 p", "20 p", "50 p", "£ 1", "£ 2"],
      },
      tech_rolls: {
        count: 8,
        values: ["1 p", "2 p", "5 p", "10 p", "20 p", "50 p", "£ 1", "£ 2"],
      },
    },
    AUD: {
      tech_bank_notes: {
        count: 5,
        values: ["$ 5", "$ 10", "$ 20", "$ 50", "$ 100"],
      },
      tech_coins: {
        count: 6,
        values: ["5 c", "10 c", "20 c", "50 c", "$ 1", "$ 2"],
      },
      tech_rolls: {
        count: 6,
        values: ["5 c", "10 c", "20 c", "50 c", "$ 1", "$ 2"],
      },
    },
    CAD: {
      tech_bank_notes: {
        count: 6,
        values: ["$ 1", "$ 5", "$ 10", "$ 20", "$ 50", "$ 100"],
      },
      tech_coins: {
        count: 7,
        values: ["1 ¢", "5 ¢", "10 ¢", "25 ¢", "50 ¢", "$ 1", "$ 2"],
      },
      tech_rolls: {
        count: 7,
        values: ["1 ¢", "5 ¢", "10 ¢", "25 ¢", "50 ¢", "$ 1", "$ 2"],
      },
    },
    CHF: {
      tech_bank_notes: {
        count: 6,
        values: ["fr 10", "fr 20", "fr 50", "fr 100", "fr 200", "fr 1000"],
      },
      tech_coins: {
        count: 7,
        values: ["5 c", "10 c", "20 c", "fr ½", "fr 1", "fr 2", "fr 5"],
      },
      tech_rolls: {
        count: 7,
        values: ["5 c", "10 c", "20 c", "fr ½", "fr 1", "fr 2", "fr 5"],
      },
    },
    SEK: {
      tech_bank_notes: {
        count: 6,
        values: ["kr 20", "kr 50", "kr 100", "kr 200", "kr 500", "kr 1000"],
      },
      tech_coins: {
        count: 4,
        values: ["kr 1", "kr 2", "kr 5", "kr 10"],
      },
      tech_rolls: {
        count: 4,
        values: ["kr 1", "kr 2", "kr 5", "kr 10"],
      },
    },
    MXN: {
      tech_bank_notes: {
        count: 4,
        values: ["$ 20", "$ 50", "$ 100", "$ 200"],
      },
      tech_coins: {
        count: 9,
        values: [
          "5 ¢",
          "10 ¢",
          "20 ¢",
          "50 ¢",
          "$ 1",
          "$ 2",
          "$ 5",
          "$ 10",
          "$ 20",
        ],
      },
      tech_rolls: {
        count: 0,
        values: [""],
      },
    },
    NZD: {
      tech_bank_notes: {
        count: 4,
        values: ["$ 10", "$ 20", "$ 50", "$ 100"],
      },
      tech_coins: {
        count: 5,
        values: ["10 c", "20 c", "50 c", "$ 1", "$ 2"],
      },
      tech_rolls: {
        count: 5,
        values: ["10 c", "20 c", "50 c", "$ 1", "$ 2"],
      },
    },
    PHP: {
      tech_bank_notes: {
        count: 6,
        values: ["₱ 20", "₱ 50", "₱ 100", "₱ 200", "₱ 500", "₱ 1000"],
      },
      tech_coins: {
        count: 8,
        values: ["1 ¢", "5 ¢", "10 ¢", "25 ¢", "₱ 1", "₱ 5", "₱ 10", "₱ 20"],
      },
      tech_rolls: {
        count: 0,
        values: [""],
      },
    },

    // Add other currencies here...
    default: {
      tech_bank_notes: {
        count: 9,
        values: [
          "$ 1",
          "$ 2",
          "5 ¢",
          "10 ¢",
          "$ 20",
          "50 ¢",
          "$ 100",
          "$ 100",
          "$ 100",
        ],
      },
      tech_coins: {
        count: 6,
        values: ["$ 1", "5 ¢", "10 ¢", "25 ¢", "50 ¢", "$ 1"],
      },
      tech_rolls: {
        count: 6,
        values: ["$ 1", "5 ¢", "10 ¢", "25 ¢", "50 ¢", "$ 1"],
      },
    },
  };

  const renderInputs = (type) => {
    const selectedCurrency = formData.tech_currency || "default";
    const limits = inputLimits[selectedCurrency] || inputLimits["default"];
    const { values = [], count = values.length } = limits[type] || {};

    // Disable logic based on checkbox states
    const isDisabled1 = formData.tech_checkbox1 === "false"; // Disable tech_bank_notes if tech_checkbox1 is false
    const isDisabled2 = formData.tech_checkbox2 === "false"; // Disable tech_coins if tech_checkbox2 is false
    const isDisabled3 = formData.tech_checkbox3 === "false"; // Disable tech_rolls if tech_checkbox3 is false

    // Return inputs based on type and corresponding disable logic
    return values.slice(0, count).map((label, index) => (
      <div className="col-span-4" key={index}>
        <label className={`font-s-14 text-blue ${type}_val_${index + 1}`}>
          {label}
        </label>
        <div className="w-full py-2 position-relative">
          <input
            type="number"
            min="0"
            name={`${type}[]`}
            value={formData[type]?.[index] || ""}
            onChange={(e) => handleChange(e, type, index)}
            className={`input ${type} ${type}_val_${index + 1}`}
            disabled={
              (type === "tech_bank_notes" && isDisabled1) ||
              (type === "tech_coins" && isDisabled2) ||
              (type === "tech_rolls" && isDisabled3)
            } // Disable based on the respective checkbox state
          />
        </div>
      </div>
    ));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[50%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_currency" className="label">
                  Note: Please enter all values first. Only after entering the
                  values, check the relevant checkbox to include them in the
                  calculation.
                </label>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_currency" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_currency"
                    id="tech_currency"
                    value={formData.tech_currency}
                    onChange={handleChange}
                  >
                    <option value="INR">INR - Indian Rupee </option>
                    <option value="USD"> USD - US Dollar</option>
                    <option value="EUR">EUR - Euro </option>
                    <option value="JPY"> JPY - Japanese yen</option>
                    <option value="GBP"> GBP - British Pound</option>
                    <option value="AUD"> AUD - Australian Dollar</option>
                    <option value="CAD"> CAD - Canadian Dollar </option>
                    <option value="CHF">CHF - Swiss Franc </option>
                    <option value="SEK">SEK - Swedish Krona</option>
                    <option value="MXN">MXN - Mexican Peso </option>
                    <option value="NZD">NZD - New Zealand </option>
                    <option value="PHP">PHP - Philippine Peso </option>
                  </select>
                </div>
              </div>

              <div className="col-span-12">
                <div className="col-span-12">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Checkboxes */}
                    <div className="col-span-4">
                      <label className="font-s-14 text-blue">
                        <input
                          type="checkbox"
                          name="tech_checkbox1"
                          checked={formData.tech_checkbox1 === "true"} // Check the value from formData
                          onChange={handleChange}
                        />
                        {data?.payload?.tech_lang_keys["2"]}
                      </label>
                    </div>
                    <div className="col-span-4">
                      <label className="font-s-14 text-blue">
                        <input
                          type="checkbox"
                          name="tech_checkbox2"
                          checked={formData.tech_checkbox2 === "true"} // Check the value from formData
                          onChange={handleChange}
                        />
                        {data?.payload?.tech_lang_keys["3"]}
                      </label>
                    </div>
                    <div className="col-span-4">
                      <label className="font-s-14 text-blue">
                        <input
                          type="checkbox"
                          name="tech_checkbox3"
                          checked={formData.tech_checkbox3 === "true"} // Check the value from formData
                          onChange={handleChange}
                        />
                        {data?.payload?.tech_lang_keys["4"]}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 grid grid-cols-12 gap-4 mt-3">
                  <div className="col-span-4">
                    {renderInputs("tech_bank_notes")}
                  </div>

                  <div className="col-span-4">{renderInputs("tech_coins")}</div>

                  <div className="col-span-4">{renderInputs("tech_rolls")}</div>
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator  rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%]  mt-2">
                        {/* <table className="w-full font-s-18">
                                  <tr>
                                      <td className="py-2 border-b" width="70%"><strong>{ data?.payload?.tech_lang_keys[5] }</strong></td>
                                       <td className="py-2 border-b"> { result?.tech_ans_currency } { result?.tech_total_money }</td>
                                  </tr>
                                </table> */}
                      </div>
                      <div className="w-full text-[16px]">
                        <div className="w-full md:w-[60%] lg:w-[60%] ">
                          {formData?.tech_checkbox1 == "true" && (
                            <div className="col">
                              <p className="col mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys[2]}
                                </strong>
                              </p>
                              <table className="w-full">
                                <thead>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys[7]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys[8]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys[9]}
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {result?.tech_note_input?.map(
                                    (value, key) => (
                                      <tr key={key}>
                                        <td className="py-2 border-b">
                                          {result?.tech_ans_currency}{" "}
                                          {result?.tech_note_quantity?.[key]}
                                        </td>
                                        <td className="py-2 border-b">
                                          {value}
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_ans_currency}{" "}
                                          {result?.tech_note_total?.[key]}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys[10]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_note_input?.reduce(
                                        (sum, val) => sum + Number(val || 0),
                                        0
                                      )}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_ans_currency}{" "}
                                      {result?.tech_note_total?.reduce(
                                        (sum, val) => sum + Number(val || 0),
                                        0
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                          {formData?.tech_checkbox2 == "true" && (
                            <div className="col">
                              <p className="mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys[3]}
                                </strong>
                              </p>
                              <table className="w-full">
                                <thead>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys[7]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys[8]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys[9]}
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {result?.tech_coins_input?.map(
                                    (value, key) => (
                                      <tr key={key}>
                                        <td className="py-2 border-b">
                                          {result?.tech_ans_currency}{" "}
                                          {result?.tech_coins_quantity?.[key]}
                                        </td>
                                        <td className="py-2 border-b">
                                          {value}
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_ans_currency}{" "}
                                          {result?.tech_coins_total?.[key]}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys[11]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_coins_input?.reduce(
                                        (sum, val) => sum + Number(val || 0),
                                        0
                                      )}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_ans_currency}{" "}
                                      {result?.tech_coins_total?.reduce(
                                        (sum, val) => sum + Number(val || 0),
                                        0
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}

                          {[
                            "USD",
                            "EUR",
                            "JPY",
                            "GBP",
                            "AUD",
                            "CAD",
                            "CHF",
                            "SEK",
                            "NZD",
                            "INR",
                          ].includes(formData?.tech_currency) &&
                            formData?.tech_checkbox3 == "true" && (
                              <div className="col">
                                <p className="mt-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[12]}
                                  </strong>
                                </p>
                                <table className="w-full">
                                  <thead>
                                    <tr>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys[7]} ×{" "}
                                        {data?.payload?.tech_lang_keys[13]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys[8]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys[9]}
                                      </td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result?.tech_rolls_input?.map(
                                      (value, key) => (
                                        <tr key={key}>
                                          <td className="py-2 border-b">
                                            {result?.tech_ans_currency}{" "}
                                            {result?.tech_rolls_quantity?.[key]}{" "}
                                            ×{" "}
                                            {
                                              result?.tech_rolls_count_ans?.[
                                                key
                                              ]
                                            }
                                          </td>
                                          <td className="py-2 border-b">
                                            {value}
                                          </td>
                                          <td className="py-2 border-b">
                                            {result?.tech_ans_currency}{" "}
                                            {result?.tech_rolls_total?.[key]}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                    <tr>
                                      <td className="py-2 border-b">
                                        {data?.payload?.tech_lang_keys[14]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_rolls_input?.reduce(
                                          (sum, val) => sum + Number(val || 0),
                                          0
                                        )}
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_ans_currency}{" "}
                                        {result?.tech_rolls_total?.reduce(
                                          (sum, val) => sum + Number(val || 0),
                                          0
                                        )}
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

export default MoneyCounterCalculator;

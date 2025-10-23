"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import {
  useGetSingleCalculatorDetailsMutation,
  useLoveCalculatorCalculationMutation,
  useHourlyPayCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HourlyPaycheckCalculator = () => {
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
    tech_paytype: 26,
    tech_status: "head_of_household",
    tech_paidtype: ["hourly", "salary"],
    tech_grosspay: ["per_year", "per_year"],
    tech_working: [8, 5],
    tech_wage: [15, 3],
    tech_overtimeType: ["doubletime", "doubletime"],
    tech_h_over: [56, 4],
    tech_w_over: [4, 7],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHourlyPayCalculatorMutation();

  const handleChange = (indexOrEvent, e) => {
    let name,
      value,
      index = null;

    // Case: called with index and event (for arrays)
    if (typeof indexOrEvent === "number") {
      index = indexOrEvent;
      const rawName = e.target.name;
      name = rawName.replace("[]", "");
      value = e.target.value;

      setFormData((prev) => {
        if (!Array.isArray(prev[name])) return prev;

        const updatedArray = [...prev[name]];
        updatedArray[index] = value;

        return {
          ...prev,
          [name]: updatedArray,
        };
      });
    } else {
      // Case: called directly for normal fields
      const rawName = indexOrEvent.target.name;
      name = rawName.replace("[]", "");
      value = indexOrEvent.target.value;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_paytype || !formData.tech_status) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_paytype: formData.tech_paytype,
        tech_status: formData.tech_status,
        tech_paidtype: formData.tech_paidtype,
        tech_grosspay: formData.tech_grosspay,
        tech_working: formData.tech_working,
        tech_wage: formData.tech_wage,
        tech_overtimeType: formData.tech_overtimeType,
        tech_h_over: formData.tech_h_over,
        tech_w_over: formData.tech_w_over,
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
      tech_paytype: 26,
      tech_status: "head_of_household",
      tech_paidtype: ["hourly", "salary"],
      tech_grosspay: ["per_year", "per_year"],
      tech_working: [8, 5],
      tech_wage: [15, 3],
      tech_overtimeType: ["doubletime", "doubletime"],
      tech_h_over: [56, 4],
      tech_w_over: [4, 7],
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

  // charrt
  const datachart = {
    labels: ["Take Home", "Taxes"],
    datasets: [
      {
        label: "Salary Distribution",
        data: [result?.tech_take_home, result?.tech_total_tax],
        backgroundColor: ["#36A2EB", "#FF6384"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${currency.symbol} ${tooltipItem.raw}`;
          },
        },
      },
      legend: {
        position: "bottom",
      },
    },
  };

  const addRow = () => {
    setFormData((prev) => ({
      ...prev,
      tech_paidtype: [...prev.tech_paidtype, "hourly"],
      tech_grosspay: [...prev.tech_grosspay, "per_year"],
      tech_working: [...prev.tech_working, 0],
      tech_wage: [...prev.tech_wage, 0],
    }));
  };

  const removeRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      tech_paidtype: prev.tech_paidtype.filter((_, i) => i !== index),
      tech_grosspay: prev.tech_grosspay.filter((_, i) => i !== index),
      tech_working: prev.tech_working.filter((_, i) => i !== index),
      tech_wage: prev.tech_wage.filter((_, i) => i !== index),
    }));
  };

  const addOvertimeRow = () => {
    setFormData((prev) => ({
      ...prev,
      tech_overtimeType: [...prev.tech_overtimeType, "doubletime"],
      tech_h_over: [...prev.tech_h_over, 0],
      tech_w_over: [...prev.tech_w_over, 0],
    }));
  };

  const removeOvertimeRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      tech_overtimeType: prev.tech_overtimeType.filter((_, i) => i !== index),
      tech_h_over: prev.tech_h_over.filter((_, i) => i !== index),
      tech_w_over: prev.tech_w_over.filter((_, i) => i !== index),
    }));
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

          <div className="lg:w-[60%] md:w-[95%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <p className="col-span-12">
                <b className="label">How often are you paid?</b>
              </p>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_paytype" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_paytype"
                    id="tech_paytype"
                    value={formData.tech_paytype}
                    onChange={handleChange}
                  >
                    <option value="52">Weekly</option>
                    <option value="26">Bi-Weekly</option>
                    <option value="12">Monthly</option>
                    <option value="24">Semi-Monthly</option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_status" className="label">
                  Your Filing Status?
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_status"
                    id="tech_status"
                    value={formData.tech_status}
                    onChange={handleChange}
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="head_of_household">Head of the House</option>
                  </select>
                </div>
              </div>

              <p className="col-span-12">
                <b className="label">How are you paid?</b>
              </p>

              <div className="col-span-12">
                {formData.tech_paidtype.map((type, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4   mb-4 rounded"
                  >
                    {/* Type */}
                    <div className="lg:col-span-4 md:col-span-4 col-span-6">
                      <label className="label">Type</label>
                      <select
                        name="tech_paidtype"
                        value={formData.tech_paidtype[index]}
                        onChange={(e) => handleChange(index, e)}
                        className="input mt-2"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="salary">Salary</option>
                      </select>
                    </div>

                    {/* Gross Pay */}
                    {formData.tech_paidtype[index] === "salary" && (
                      <div className="lg:col-span-4 md:col-span-4 col-span-6">
                        <label className="label">Gross Pay</label>
                        <select
                          name="tech_grosspay"
                          value={formData.tech_grosspay[index]}
                          onChange={(e) => handleChange(index, e)}
                          className="input mt-2"
                        >
                          <option value="per_year">Per Year</option>
                          <option value="pay_period">Pay Per Period</option>
                        </select>
                      </div>
                    )}

                    {/* Working (hourly only) */}
                    {formData.tech_paidtype[index] === "hourly" && (
                      <div className="lg:col-span-4 md:col-span-4 col-span-6">
                        <label className="label">Working Hours</label>
                        <input
                          type="number"
                          name="tech_working"
                          step="any"
                          value={formData.tech_working[index]}
                          onChange={(e) => handleChange(index, e)}
                          className="input mt-2"
                        />
                      </div>
                    )}

                    {/* Wage */}
                    <div className="lg:col-span-4 md:col-span-4 col-span-6">
                      <div className="flex justify-between">
                        <label className="label">Wage</label>
                        <div className="">
                          {formData.tech_paidtype.length > 1 && (
                            <img
                              src="/images/images_mix/belete_btn.png"
                              width="25px"
                              className="p_5 remove"
                              alt="Delete"
                              onClick={() => removeRow(index)}
                            />
                          )}
                        </div>
                      </div>
                      <input
                        type="number"
                        name="tech_wage"
                        step="any"
                        value={formData.tech_wage[index]}
                        onChange={(e) => handleChange(index, e)}
                        className="input mt-2"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-span-12 flex px-2 items-center">
                <img
                  loading="lazy"
                  decoding="async"
                  src="/images/hourly_add.png"
                  alt="more hourly add icon"
                  height="15px"
                  width="15px"
                />
                <p
                  className="label ms-1 text-blue-500 cursor-pointer"
                  id="add_hour"
                  onClick={addRow}
                >
                  Add Another
                </p>
              </div>
              <p className="col-span-12">
                <b className="label">Any overtime?</b>
              </p>

              <div className="col-span-12">
                {formData.tech_overtimeType.map((type, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                    {/* Overtime Type */}
                    <div className="lg:col-span-4 md:col-span-4 col-span-6">
                      <label
                        htmlFor={`tech_overtime_${index}`}
                        className="label"
                      >
                        Type
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_overtimeType[]"
                          id={`tech_overtime_${index}`}
                          value={formData.tech_overtimeType[index]}
                          onChange={(e) => handleChange(index, e)}
                        >
                          <option value="overtime">Overtime</option>
                          <option value="doubletime">Double Time</option>
                        </select>
                      </div>
                    </div>

                    {/* Hourly Over */}
                    <div className="lg:col-span-4 md:col-span-4 col-span-6">
                      <label htmlFor={`tech_h_over_${index}`} className="label">
                        {data?.payload?.tech_lang_keys["3"]}:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_h_over[]"
                          id={`tech_h_over_${index}`}
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_h_over[index]}
                          onChange={(e) => handleChange(index, e)}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>

                    {/* Weekly Over */}
                    <div className="lg:col-span-4 md:col-span-4 col-span-6">
                      <div className="flex justify-between">
                        <label
                          htmlFor={`tech_w_over_${index}`}
                          className="label"
                        >
                          {data?.payload?.tech_lang_keys["3"]}:
                        </label>
                        <div className="">
                          {formData.tech_overtimeType.length > 1 && (
                            <div className="col-span-12 flex justify-end">
                              <img
                                src="/images/images_mix/belete_btn.png"
                                width="25px"
                                className="p_5 remove"
                                alt="Delete"
                                onClick={() => removeOvertimeRow(index)}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_w_over[]"
                          id={`tech_w_over_${index}`}
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_w_over[index]}
                          onChange={(e) => handleChange(index, e)}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>

                    {/* Remove Button (optional) */}
                  </div>
                ))}
              </div>

              <div
                className="col-span-12 flex px-2 items-center cursor-pointer"
                onClick={addOvertimeRow}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src="/images/hourly_add.png"
                  alt="Add more overtime"
                  height="15px"
                  width="15px"
                />
                <p className="label ms-1 text-blue-500">Add Another</p>
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="text-center">
                          <p className="font-s-20">
                            <strong>Take Home Salary</strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong className="text-blue">
                                {currency.symbol} {result?.tech_take_home}
                              </strong>
                            </p>
                          </div>
                        </div>

                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto lg:text-[18px] md:text-[18px] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2 text-[18px]">
                                  <b>Earnings</b>
                                </td>
                                <td className="border-b py-2 text-[18px]">
                                  <b>
                                    {currency.symbol}{" "}
                                    {result?.tech_total_weekly_salary}
                                  </b>
                                </td>
                              </tr>

                              {result?.tech_salaries?.map((salary, i) => (
                                <tr key={`salary-${i}`}>
                                  <td
                                    className="border-b py-2"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        formData?.tech_paidtype[i] === "hourly"
                                          ? `Hourly <span className='font-s-12'>(${currency.symbol}${formData?.tech_working[i]} × ${currency.symbol}${formData?.tech_wage[i]})</span>`
                                          : `Salary <span className='font-s-12'>(${
                                              formData?.tech_grosspay[i] ===
                                              "per_year"
                                                ? "Per Year"
                                                : "Pay Per Period"
                                            })</span>`,
                                    }}
                                  ></td>
                                  <td className="border-b py-2">
                                    {currency.symbol}{" "}
                                    {Math.round(salary * 100) / 100}
                                  </td>
                                </tr>
                              ))}

                              {result?.tech_overtimes?.map((overtime, i) => (
                                <tr key={`overtime-${i}`}>
                                  <td
                                    className="border-b py-2"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        formData?.tech_overtimeType[i] ===
                                        "overtime"
                                          ? `Overtime <span className='font-s-12'>(1.5 × ${formData?.tech_h_over[i]} hrs × ${currency.symbol}${formData?.tech_w_over[i]})</span>`
                                          : `Double Time <span className='font-s-12'>(2 × ${formData?.tech_h_over[i]} hrs × ${currency.symbol}${formData?.tech_w_over[i]})</span>`,
                                    }}
                                  ></td>
                                  <td className="border-b py-2">
                                    {currency.symbol}{" "}
                                    {Math.round(overtime * 100) / 100}
                                  </td>
                                </tr>
                              ))}

                              <tr>
                                <td className="border-b py-2 text-[18px]">
                                  <b>Taxes</b>
                                </td>
                                <td className="border-b py-2 text-[18px]">
                                  <b>
                                    {currency.symbol} {result?.tech_total_tax}
                                  </b>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  Federal Income Tax
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol} {result?.tech_federalTax}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">Medicare Tax</td>
                                <td className="border-b py-2">
                                  {currency.symbol} {result?.tech_medicareTax}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  Social Security Tax
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol}{" "}
                                  {result?.tech_socialSecurityTax}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2 text-[18px]">
                                  <b>Benefits</b>
                                </td>
                                <td className="border-b py-2 text-[18px]">
                                  <b>{currency.symbol} 0</b>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2 text-[18px]">
                                  <b>Take Home</b>
                                </td>
                                <td className="border-b py-2 text-[18px]">
                                  <b>
                                    {currency.symbol} {result?.tech_take_home}
                                  </b>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full md:w-[30%] lg:w-[30%] mx-auto mt-3">
                          <Doughnut data={datachart} options={options} />
                        </div>
                      </div>
                      <div className="pay-calc-graph"></div>
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

export default HourlyPaycheckCalculator;

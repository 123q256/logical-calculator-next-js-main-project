"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useEmployeeCostCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EmployeeCostCalculator = () => {
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
    tech_unit_type: "salary", //  salary  hourly
    tech_rate: "413",
    tech_hour_worked: "40",
    tech_month: "10",
    tech_benefits: "10",
    tech_health: "10",
    tech_dental: "10",
    tech_vision: "10",
    tech_perk_name: [],
    tech_annual_contribution: [],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEmployeeCostCalculatorMutation();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  // };

  const handleChange = (e, index, fieldName) => {
    const { value } = e.target;
    const updatedArray = [...formData[fieldName]];
    updatedArray[index] = value;

    setFormData({
      ...formData,
      [fieldName]: updatedArray,
    });
  };

  const addPerk = () => {
    setFormData({
      ...formData,
      tech_perk_name: [...formData.tech_perk_name, ""],
      tech_annual_contribution: [...formData.tech_annual_contribution, ""],
    });
  };

  const removePerk = (index) => {
    const updatedTechPerkName = formData.tech_perk_name.filter(
      (_, i) => i !== index
    );
    const updatedTechAnnualContribution =
      formData.tech_annual_contribution.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      tech_perk_name: updatedTechPerkName,
      tech_annual_contribution: updatedTechAnnualContribution,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_operations == "salary") {
      if (
        !formData.tech_rate ||
        !formData.tech_hour_worked ||
        !formData.tech_month
      ) {
        setFormError("Please fill in all fields.");
        return;
      }
    } else {
      if (!formData.tech_rate || !formData.tech_month) {
        setFormError("Please fill in all fields.");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_rate: formData.tech_rate,
        tech_hour_worked: formData.tech_hour_worked,
        tech_month: formData.tech_month,
        tech_benefits: formData.tech_benefits,
        tech_health: formData.tech_health,
        tech_dental: formData.tech_dental,
        tech_vision: formData.tech_vision,
        tech_perk_name: formData.tech_perk_name,
        tech_annual_contribution: formData.tech_annual_contribution,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_unit_type: "salary", //  salary  hourly
      tech_rate: "413",
      tech_hour_worked: "40",
      tech_month: "10",
      tech_benefits: "10",
      tech_health: "10",
      tech_dental: "10",
      tech_vision: "10",
      tech_perk_name: [],
      tech_annual_contribution: [],
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="tech_unit_type"
                id="calculator_time"
                value={formData.tech_unit_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_unit_type === "salary" ? "tagsUnit" : ""
                    }`}
                    id="salary"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "salary" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["1"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit_type === "hourly" ? "tagsUnit" : ""
                    }`}
                    id="hourly"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "hourly" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_rate" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                  {formData.tech_unit_type == "salary" ? (
                    <span className="label hourly_rate">
                      {data?.payload?.tech_lang_keys["4"]}
                    </span>
                  ) : (
                    <span className="label annual_rate ">
                      {data?.payload?.tech_lang_keys["5"]}
                    </span>
                  )}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_rate"
                    id="tech_rate"
                    className="input my-2"
                    aria-label="input"
                    placeholder="413"
                    min="0"
                    value={formData.tech_rate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_unit_type == "salary" && (
                <div className="col-span-12 md:col-span-6 hours_worked">
                  <label htmlFor="tech_hour_worked" className="label">
                    {data?.payload?.tech_lang_keys["6"]}
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_hour_worked"
                      id="tech_hour_worked"
                      className="input my-2"
                      aria-label="input"
                      placeholder="40"
                      min="0"
                      value={formData.tech_hour_worked}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_month" className="label">
                  {data?.payload?.tech_lang_keys["7"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_month"
                    id="tech_month"
                    className="input my-2"
                    aria-label="input"
                    placeholder="40"
                    min="0"
                    value={formData.tech_month}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {formData.tech_unit_type == "salary" ? (
                <p className="col-span-12 hourly_rate px-2 mt-2">
                  Note : {data?.payload?.tech_lang_keys["8"]}
                </p>
              ) : (
                <p className="col-span-12 annual_rate px-2  mt-2">
                  Note : {data?.payload?.tech_lang_keys["9"]}
                </p>
              )}

              <div className="col-span-6">
                <label htmlFor="tech_benefits" className="label">
                  {data?.payload?.tech_lang_keys["11"]}{" "}
                  {data?.payload?.tech_lang_keys["10"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_benefits"
                    id="tech_benefits"
                    className="input my-2"
                    aria-label="input"
                    placeholder="10"
                    min="0"
                    value={formData.tech_benefits}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_health" className="label">
                  {data?.payload?.tech_lang_keys["12"]}{" "}
                  {data?.payload?.tech_lang_keys["10"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_health"
                    id="tech_health"
                    className="input my-2"
                    aria-label="input"
                    placeholder="10"
                    min="0"
                    value={formData.tech_health}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_dental" className="label">
                  {data?.payload?.tech_lang_keys["13"]}{" "}
                  {data?.payload?.tech_lang_keys["10"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_dental"
                    id="tech_dental"
                    className="input my-2"
                    aria-label="input"
                    placeholder="10"
                    min="0"
                    value={formData.tech_dental}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_vision" className="label">
                  {data?.payload?.tech_lang_keys["14"]}{" "}
                  {data?.payload?.tech_lang_keys["10"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_vision"
                    id="tech_vision"
                    className="input my-2"
                    aria-label="input"
                    placeholder="10"
                    min="0"
                    value={formData.tech_vision}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                {formData.tech_perk_name.map((perk, index) => (
                  <div className="grid grid-cols-12 mt-3 gap-4" key={index}>
                    <div className="col-span-6">
                      <label htmlFor={`perk_name_${index}`} className="label">
                        Perk Name:
                      </label>
                      <div className="w-full py-2 position-relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_perk_name[]"
                          id={`perk_name_${index}`}
                          className="input"
                          placeholder="00"
                          value={perk}
                          onChange={(e) =>
                            handleChange(e, index, "tech_perk_name")
                          }
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor={`annual_contribution_${index}`}
                        className="flex justify-between label"
                      >
                        <div>Annual Contribution:</div>
                        <img
                          src="/images/images_mix/belete_btn.png"
                          alt="Remove"
                          className="remove right mx-1 object-contain cursor-pointer"
                          width="15px"
                          onClick={() => removePerk(index)}
                        />
                      </label>
                      <div className="w-full py-2 position-relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_annual_contribution[]"
                          id={`annual_contribution_${index}`}
                          className="input"
                          placeholder="00"
                          value={formData.tech_annual_contribution[index]}
                          onChange={(e) =>
                            handleChange(e, index, "tech_annual_contribution")
                          }
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-span-12 text-end mt-3">
                <button
                  type="button"
                  onClick={addPerk}
                  className="px-3 py-2 mx-1 addmore bg-[#2845F5] rounded-[10px] text-white font-semibold cursor-pointer"
                >
                  <span className="mr-1">+</span>{" "}
                  {data?.payload?.tech_lang_keys["15"]}
                </button>
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      {result?.tech_submit == "hourly" && (
                        <>
                          <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-3">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[16]}{" "}
                                    </strong>
                                  </td>
                                  {!result?.tech_perk_array ? (
                                    <td className="py-2 border-b">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_emp_h_r).toFixed(2)}
                                    </td>
                                  ) : (
                                    <td className="py-2 border-b">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_emp_h_r_p).toFixed(
                                        2
                                      )}
                                    </td>
                                  )}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="w-full md:w-[60%] lg:w-[60%]  mt-3">
                            <table className="w-full text-[18px]">
                              <tbody>
                                {!result?.tech_perk_array ? (
                                  <>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[17]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {Number(
                                            result?.tech_emp_h_r / 2
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[18]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {Number(
                                            result?.tech_emp_h_r / 4
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[19]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {Number(
                                            result?.tech_emp_h_r / 12
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[20]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {Number(
                                            result?.tech_emp_h_r / 52
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[21]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {Number(
                                            result?.tech_emp_h_r / 365
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[17]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {Number(
                                            result?.tech_emp_h_r_p / 2
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[18]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {Number(
                                            result?.tech_emp_h_r_p / 4
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[19]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {Number(
                                            result?.tech_emp_h_r_p / 12
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[20]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {Number(
                                            result?.tech_emp_h_r_p / 52
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[21]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {Number(
                                            result?.tech_emp_h_r_p / 365
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                  </>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <div className="col-12 mt-2 font-s-14">
                            <div className="col">
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["23"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["24"]} ={" "}
                                {data?.payload?.tech_lang_keys["3"]}{" "}
                                {data?.payload?.tech_lang_keys["4"]} x 4.66484 x{" "}
                                {data?.payload?.tech_lang_keys["6"]} x{" "}
                                {data?.payload?.tech_lang_keys["7"]}
                                {result?.tech_benefits &&
                                  ` + ${data?.payload?.tech_lang_keys["11"]}`}
                                {result?.tech_health &&
                                  ` + ${data?.payload?.tech_lang_keys["12"]}`}
                                {result?.tech_dental &&
                                  ` + ${data?.payload?.tech_lang_keys["13"]}`}
                                {result?.tech_vision &&
                                  ` + ${data?.payload?.tech_lang_keys["14"]}`}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["24"]} ={" "}
                                {result?.tech_rate} x 4.66484 x{" "}
                                {result?.tech_hour_worked} x{" "}
                                {result?.tech_month}
                                {result?.tech_benefits &&
                                  ` + ${result?.tech_benefits}`}
                                {result?.tech_health &&
                                  ` + ${result?.tech_health}`}
                                {result?.tech_dental &&
                                  ` + ${result?.tech_dental}`}
                                {result?.tech_vision &&
                                  ` + ${result?.tech_vision}`}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["24"]} ={" "}
                                {currency.symbol}{" "}
                                {result?.tech_emp_h_r.toFixed(2)}
                              </p>
                              {result?.tech_perk_array && (
                                <>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["25"]}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["24"]} ={" "}
                                    {data?.payload?.tech_lang_keys["24"]}
                                    {result?.tech_perk_array.map(
                                      (name, index) => (
                                        <span key={index}>+ {name} </span>
                                      )
                                    )}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["24"]} ={" "}
                                    {result?.tech_emp_h_r.toFixed(2)}
                                    {result?.tech_perk_array.map(
                                      (name, index) => (
                                        <span key={index}>
                                          + {result?.tech_perk_val[index]}{" "}
                                        </span>
                                      )
                                    )}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["24"]} ={" "}
                                    {currency.symbol}{" "}
                                    {result?.tech_emp_h_r_p.toFixed(2)}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      {result?.tech_submit == "salary" && (
                        <>
                          <div className="w-full md:w-[60%] lg:w-[60%]  mt-3">
                            <table className="w-full text-[18px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[16]}{" "}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_perk_array
                                      ? `${currency.symbol} ${Number(
                                          result?.tech_emp_h_r_p
                                        ).toFixed(2)}`
                                      : `${currency.symbol} ${Number(
                                          result?.tech_anual_salary
                                        ).toFixed(2)}`}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="w-full md:w-[60%] lg:w-[60%]  mt-3">
                            <table className="w-full text-[18px]">
                              <tbody>
                                {!result?.tech_perk_array ? (
                                  <>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[17]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {(
                                            result?.tech_anual_salary / 2
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[18]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {(
                                            result?.tech_anual_salary / 4
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[19]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {(
                                            result?.tech_anual_salary / 12
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[20]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {(
                                            result?.tech_anual_salary / 52
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[21]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {(
                                            result?.tech_anual_salary / 365
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[17]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {(result?.tech_emp_h_r_p / 2).toFixed(
                                            2
                                          )}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[18]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {(result?.tech_emp_h_r_p / 4).toFixed(
                                            2
                                          )}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[19]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {(
                                            result?.tech_emp_h_r_p / 12
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[20]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {(
                                            result?.tech_emp_h_r_p / 52
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="70%">
                                        {data?.payload?.tech_lang_keys[21]}
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        <strong>
                                          {(
                                            result?.tech_emp_h_r_p / 365
                                          ).toFixed(2)}
                                        </strong>
                                      </td>
                                    </tr>
                                  </>
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className="col-12 mt-2 font-s-14">
                            <div className="col">
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["23"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["5"]} ={" "}
                                {data?.payload?.tech_lang_keys["3"]}{" "}
                                {data?.payload?.tech_lang_keys["5"]} x 0.0765
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["5"]} ={" "}
                                {result?.tech_rate} x 0.0765
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["5"]} ={" "}
                                {currency.symbol} {result?.tech_per_anum}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["24"]} ={" "}
                                {data?.payload?.tech_lang_keys["3"]}{" "}
                                {data?.payload?.tech_lang_keys["5"]} +{" "}
                                {data?.payload?.tech_lang_keys["5"]}
                                {result?.tech_benefits && (
                                  <> + {data?.payload?.tech_lang_keys["11"]}</>
                                )}
                                {result?.tech_health && (
                                  <> + {data?.payload?.tech_lang_keys["12"]}</>
                                )}
                                {result?.tech_dental && (
                                  <> + {data?.payload?.tech_lang_keys["13"]}</>
                                )}
                                {result?.tech_vision && (
                                  <> + {data?.payload?.tech_lang_keys["14"]}</>
                                )}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["24"]} ={" "}
                                {result?.tech_rate} + {result?.tech_per_anum}
                                {result?.tech_benefits && (
                                  <> + {result?.tech_benefits}</>
                                )}
                                {result?.tech_health && (
                                  <> + {result?.tech_health}</>
                                )}
                                {result?.tech_dental && (
                                  <> + {result?.tech_dental}</>
                                )}
                                {result?.tech_vision && (
                                  <> + {result?.tech_vision}</>
                                )}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["24"]} ={" "}
                                {currency.symbol}{" "}
                                {Number(result?.tech_anual_salary).toFixed(2)}
                              </p>
                              {result?.tech_perk_array && (
                                <>
                                  <p className="mt-2 color_blue">
                                    {data?.payload?.tech_lang_keys["25"]}.{" "}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["24"]} ={" "}
                                    {data?.payload?.tech_lang_keys["24"]}
                                    {result?.tech_perk_array && (
                                      <>
                                        +{" "}
                                        {result?.tech_perk_array.map(
                                          (perk, index) => (
                                            <span key={index}>{perk} + </span>
                                          )
                                        )}
                                      </>
                                    )}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["24"]} ={" "}
                                    {Number(result?.tech_anual_salary).toFixed(
                                      2
                                    )}
                                    {result?.tech_perk_array && (
                                      <>
                                        +{" "}
                                        {result?.tech_perk_array.map(
                                          (perk, index) => (
                                            <span key={index}>
                                              {result?.tech_perk_val[index]} +{" "}
                                            </span>
                                          )
                                        )}
                                      </>
                                    )}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["24"]} ={" "}
                                    {currency.symbol}{" "}
                                    {Number(result?.tech_emp_h_r_p).toFixed(2)}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </>
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

export default EmployeeCostCalculator;

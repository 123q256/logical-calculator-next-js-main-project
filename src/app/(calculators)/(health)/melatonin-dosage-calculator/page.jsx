"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useMelatoninDosageCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MelatoninDosageCalculator = () => {
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
    tech_selection: "6",
    tech_selection3: "3",
    tech_d_unit: "weeks", // months  weeks days  years
    tech_charge: "36",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMelatoninDosageCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_selection ||
      !formData.tech_selection3 ||
      !formData.tech_d_unit ||
      !formData.tech_charge
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_selection3: formData.tech_selection3,
        tech_d_unit: formData.tech_d_unit,
        tech_charge: formData.tech_charge,
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
      tech_selection: "6",
      tech_selection3: "3",
      tech_d_unit: "weeks", // months  weeks days  years
      tech_charge: "36",
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

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_d_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_selection" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_selection"
                    id="tech_selection"
                    value={formData.tech_selection}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_selection3" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_selection3"
                    id="tech_selection3"
                    value={formData.tech_selection3}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                  </select>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_charge" className="label">
                  {data?.payload?.tech_lang_keys["13"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_charge"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_charge}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_d_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: data?.payload?.tech_lang_keys["14"],
                          value: data?.payload?.tech_lang_keys["14"],
                        },
                        {
                          label: data?.payload?.tech_lang_keys["15"],
                          value: data?.payload?.tech_lang_keys["15"],
                        },
                        {
                          label: data?.payload?.tech_lang_keys["16"],
                          value: data?.payload?.tech_lang_keys["16"],
                        },
                        {
                          label: data?.payload?.tech_lang_keys["17"],
                          value: data?.payload?.tech_lang_keys["17"],
                        },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="bg-sky bordered  rounded-lg p-3">
                          {data?.payload?.tech_lang_keys["18"]} ={" "}
                          <strong className="text-[#119154] text-[25px]">
                            {result?.tech_answer1}
                          </strong>{" "}
                          mg {data?.payload?.tech_lang_keys["19"]}
                        </div>
                        <div className="bg-sky bordered  rounded-lg p-3 mt-2">
                          {data?.payload?.tech_lang_keys["20"]} ={" "}
                          <strong className="text-[#119154] text-[16px]">
                            {result?.tech_answer2}
                          </strong>
                        </div>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["21"]}
                        </p>
                        <p>
                          {result?.tech_answer3}{" "}
                          <strong className="text-[#119154] text-[18px]">
                            {result?.tech_answer4} {result?.tech_days}
                            {result?.tech_weeks}
                            {result?.tech_months}
                            {result?.tech_years}
                          </strong>
                          -{data?.payload?.tech_lang_keys["22"]}:
                        </p>
                        <div className="w-full overflow-auto">
                          <table className="w-full col-lg-3" cellSpacing="0">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {result?.tech_ans1} {result?.tech_ans1_first}{" "}
                                  {result?.tech_tablets} {result?.tech_tablet}{" "}
                                  {result?.tech_ml} {result?.tech_applications}{" "}
                                  {result?.tech_strips}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {result?.tech_ans2} {result?.tech_ans1_second}{" "}
                                  {result?.tech_tablets} {result?.tech_tablet}{" "}
                                  {result?.tech_drops} {result?.tech_strips}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {result?.tech_ans3} {result?.tech_ans1_third}{" "}
                                  {result?.tech_tablets}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">
                                  {result?.tech_ans4} {result?.tech_ans1_four}{" "}
                                  {result?.tech_tablets}
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

export default MelatoninDosageCalculator;

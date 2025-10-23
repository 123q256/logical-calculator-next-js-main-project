"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBenchPressCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BenchPressCalculator = () => {
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
    tech_weight: 12,
    tech_unit: "lbs",
    tech_reps: 14,
    tech_tableType: "Percentage of 1RM",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBenchPressCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_weight ||
      !formData.tech_unit ||
      !formData.tech_reps ||
      !formData.tech_tableType
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_weight: formData.tech_weight,
        tech_unit: formData.tech_unit,
        tech_reps: formData.tech_reps,
        tech_tableType: formData.tech_tableType,
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
      tech_weight: 12,
      tech_unit: "lbs",
      tech_reps: 14,
      tech_tableType: "Percentage of 1RM",
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
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_weight"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_weight}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "stone", value: "stone" },
                        { label: "oz", value: "oz" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_reps" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_reps"
                    id="tech_reps"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_reps}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_tableType" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_tableType"
                    id="tech_tableType"
                    value={formData.tech_tableType}
                    onChange={handleChange}
                  >
                    <option value="Percentage of 1RM">Percentage of 1RM</option>
                    <option value="Repetitions">Repetitions</option>
                  </select>
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
                    <div className="w-full p-3 mt-3">
                      <div className="w-full">
                        {result?.tech_oneRepMax && (
                          <div>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["4"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[32px]">
                                {Number(result.tech_oneRepMax).toFixed(3)}
                              </strong>
                              <span className="text-[#2845F5] px-1 text-[18px]">
                                {formData?.tech_unit}
                              </span>
                            </p>
                          </div>
                        )}

                        {formData?.tech_tableType === "Percentage of 1RM" &&
                          result?.tech_oneRepMax && (
                            <div>
                              <p className="mb-2">
                                <strong className="text-[#2845F5] border-b-2-blue">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </strong>
                              </p>
                              <div className="w-full overflow-auto">
                                <table
                                  className="w-full md:w-[60%] lg:w-[60%]"
                                  cellSpacing="0"
                                >
                                  <thead>
                                    <tr>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["6"]}
                                        </strong>
                                      </td>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["7"]}
                                        </strong>
                                      </td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[...Array(11)].map((_, i) => {
                                      const percentage = 100 - i * 5;
                                      const percentageWeight = (
                                        (percentage / 100) *
                                        result.tech_oneRepMax
                                      ).toFixed(2);
                                      const borderClass =
                                        percentage === 50 ? "" : "border-b";
                                      return (
                                        <tr key={percentage}>
                                          <td className={`${borderClass} py-2`}>
                                            {percentage} %
                                          </td>
                                          <td className={`${borderClass} py-2`}>
                                            {percentageWeight}{" "}
                                            {formData?.tech_unit}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                        {formData?.tech_tableType === "Repetitions" &&
                          result?.tech_oneRepMax && (
                            <div>
                              <p>
                                <strong className="text-blue-700 border-b-2">
                                  {data?.payload?.tech_lang_keys["8"]}
                                </strong>
                              </p>
                              <div className="w-full overflow-auto">
                                <table
                                  className="w-full md:w-[60%] lg:w-[60%]"
                                  cellSpacing="0"
                                >
                                  <thead>
                                    <tr>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["8"]}
                                        </strong>
                                      </td>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["7"]}
                                        </strong>
                                      </td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[...Array(12)].map((_, i) => {
                                      const rep = i + 1;
                                      const repWeight = (
                                        result.tech_oneRepMax /
                                        (1 + rep / 30)
                                      ).toFixed(2);
                                      const borderClass =
                                        rep === 12 ? "" : "border-b";
                                      return (
                                        <tr key={rep}>
                                          <td className={`${borderClass} py-2`}>
                                            {rep}
                                          </td>
                                          <td className={`${borderClass} py-2`}>
                                            {repWeight} {formData?.tech_unit}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
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

export default BenchPressCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useA1cCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const A1cCalculator = () => {
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
    tech_solve: "1",
    tech_input: "9",
    tech_unit1: "%",
    tech_unit2: "mmol/L",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useA1cCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_solve == 1) {
      if (
        !formData.tech_solve ||
        !formData.tech_input ||
        !formData.tech_unit1
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_solve ||
        !formData.tech_input ||
        !formData.tech_unit2
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_solve: formData.tech_solve,
        tech_input: formData.tech_input,
        tech_unit1: formData.tech_unit1,
        tech_unit2: formData.tech_unit2,
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
      tech_solve: "1",
      tech_input: "9",
      tech_unit1: "%",
      tech_unit2: "mmol/L",
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
    setFormData((prev) => ({ ...prev, tech_unit1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit2: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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

          <div className="lg:w-[40%] md:w-[40%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_solve" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_solve"
                    id="tech_solve"
                    value={formData.tech_solve}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {formData?.tech_solve === "1" ? (
                <div className="col-span-12">
                  <label htmlFor="tech_input" className="label">
                    {data?.payload?.tech_lang_keys["3"]}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_input"
                      step="any"
                      className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                      value={formData.tech_input}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-5"
                      onClick={toggleDropdown}
                    >
                      {formData.tech_unit1} ▾
                    </label>
                    {dropdownVisible && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "(%)", value: "percent (%)" },
                          { label: "mmol/mol", value: "mmol/mol" },
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
              ) : (
                <div className="col-span-12">
                  <label htmlFor="tech_input" className="label">
                    {data?.payload?.tech_lang_keys["2"]}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_input"
                      step="any"
                      className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                      value={formData.tech_input}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown1}
                    >
                      {formData.tech_unit2} ▾
                    </label>
                    {dropdownVisible1 && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "mmol/L", value: "mmol/L" },
                          { label: "mg/dL", value: "mg/dL" },
                        ].map((unit, index) => (
                          <p
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setUnitHandler1(unit.value)}
                          >
                            {unit.label}
                          </p>
                        ))}
                      </div>
                    )}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                          {formData?.tech_solve === "1" ? (
                            <>
                              <p className="col-span-12 mb-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[2]}
                                </strong>
                              </p>
                              <div className="col-span-12">
                                <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                                  <div className="col-span-12 md:col-span-5 lg:col-span-5">
                                    <strong className="text-[#119154] text-[32px]">
                                      {Number(
                                        result?.tech_jawab / 18.016
                                      ).toFixed(2)}
                                    </strong>
                                    <span className="text-blue-500 text-[20px] px-2">
                                      mmol/L
                                    </span>
                                  </div>
                                  <div className="col-span-1 border-r hidden md:block lg:block ps-3 me-3">
                                    &nbsp;
                                  </div>
                                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                    <strong className="text-[#119154] text-[32px] ">
                                      {result?.tech_jawab}
                                    </strong>
                                    <span className="text-blue-500 text-[20px] px-2">
                                      mg/dL
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="col-span-12 mb-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[3]}
                                </strong>
                              </p>
                              <div className="col-span-12">
                                <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                                  <div className="col-span-12 md:col-span-5 lg:col-span-5">
                                    <strong className="text-green-500 text-[32px]">
                                      {Number(result?.tech_jawab).toFixed(2)}
                                    </strong>
                                    <span className="text-blue-500 text-[20px]">
                                      %
                                    </span>
                                  </div>
                                  <div className="col-span-1 border-r hidden md:block lg:block ps-3 me-3">
                                    &nbsp;
                                  </div>
                                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                    <strong className="text-green-500 text-[32px]">
                                      {Number(
                                        (result?.tech_jawab - 2.152) / 0.09148
                                      ).toFixed(2)}
                                    </strong>
                                    <span className="text-blue-500 text-[20px]">
                                      mmol/mol
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        {/* Last condition for percentage checking */}
                        {result?.tech_percent < 5.7 ? (
                          <p className="mt-2 w-full">
                            {data?.payload?.tech_lang_keys[4]}
                          </p>
                        ) : result?.tech_percent >= 5.7 &&
                          result?.tech_percent < 6.4 ? (
                          <p className="mt-2 w-full">
                            {data?.payload?.tech_lang_keys[5]}
                          </p>
                        ) : (
                          <p className="mt-2 w-full">
                            {data?.payload?.tech_lang_keys[6]}
                          </p>
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

export default A1cCalculator;

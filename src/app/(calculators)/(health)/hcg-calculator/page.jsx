"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useHcgCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HcgCalculator = () => {
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
    tech_first: 31,
    tech_second: 54,
    tech_third: 160,
    tech_unit3: "days", // days  hours
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHcgCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_first ||
      !formData.tech_second ||
      !formData.tech_third ||
      !formData.tech_unit3
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
        tech_third: formData.tech_third,
        tech_unit3: formData.tech_unit3,
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
      tech_first: 31,
      tech_second: 54,
      tech_third: 160,
      tech_unit3: "days", // days  hours
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
    setFormData((prev) => ({ ...prev, tech_unit3: unit }));
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

          <div className="w-full lg:w-9/12 mx-auto">
            <div className="flex flex-col">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
                <div className="px-2 lg:px-4">
                  <label htmlFor="tech_first" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
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
                    <span className="input_unit">mlU/ml</span>
                  </div>
                </div>
                <div className="px-2 lg:px-4">
                  <label htmlFor="tech_second" className="label">
                    {data?.payload?.tech_lang_keys["2"]}:
                  </label>
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
                    <span className="input_unit">mlU/ml</span>
                  </div>
                </div>

                <div className="w-full px-2 lg:pl-4">
                  <label htmlFor="tech_third" className="label">
                    {data?.payload?.tech_lang_keys["3"]}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_third"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_third}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown}
                    >
                      {formData.tech_unit3} ▾
                    </label>
                    {dropdownVisible && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          {
                            label: data?.payload?.tech_lang_keys["4"],
                            value: data?.payload?.tech_lang_keys["4"],
                          },
                          {
                            label: data?.payload?.tech_lang_keys["5"],
                            value: data?.payload?.tech_lang_keys["5"],
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full   rounded-lg mt-3">
                      <div className="w-full mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2">
                          <div className="px-3" style={{ minHeight: "70px" }}>
                            <div className="flex items-center bg-sky bordered rounded-lg px-3 py-2 h-full">
                              <p className="w-1/2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["7"]}
                                </strong>
                              </p>
                              <p className="w-1/2 text-right">
                                <strong className="text-green-800 text-2xl">
                                  {result?.tech_difference}
                                </strong>
                                <span className="text-green-800 ml-2">
                                  (mlU/ml)
                                </span>
                              </p>
                            </div>
                          </div>
                          <div
                            className="px-3 mt-3 md:mt-0"
                            style={{ minHeight: "70px" }}
                          >
                            <div className="flex items-center bg-sky bordered rounded-lg px-3 py-2 h-full">
                              <p className="w-1/2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["8"]}
                                </strong>
                              </p>
                              <p className="w-1/2 text-right">
                                <strong className="text-green-800 text-2xl">
                                  {Number(result?.tech_percent).toFixed(2)}
                                </strong>
                                <span className="text-green-800 ml-2">(%)</span>
                              </p>
                            </div>
                          </div>
                          <div
                            className="px-3 mt-3"
                            style={{ minHeight: "70px" }}
                          >
                            <div className="flex items-center bg-sky bordered rounded-lg px-3 py-2 h-full">
                              <p className="w-1/2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["9"]}
                                </strong>
                              </p>
                              <p className="w-1/2 text-right">
                                <strong className="text-green-800 text-2xl">
                                  {Number(result?.tech_t2).toFixed(2)}
                                </strong>
                                <span className="text-green-800 ml-2">
                                  (days)
                                </span>
                              </p>
                            </div>
                          </div>
                          <div
                            className="px-3 mt-3"
                            style={{ minHeight: "70px" }}
                          >
                            <div className="flex items-center bg-sky bordered rounded-lg px-3 py-2 h-full">
                              <p className="w-1/2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["10"]}
                                </strong>
                              </p>
                              <p className="w-1/2 text-right">
                                <strong className="text-green-800 text-2xl">
                                  {Number(result?.tech_i1).toFixed(2)}
                                </strong>
                                <span className="text-green-800 ml-2">(%)</span>
                              </p>
                            </div>
                          </div>
                          <div
                            className="px-3 mt-3"
                            style={{ minHeight: "70px" }}
                          >
                            <div className="flex items-center bg-sky bordered rounded-lg px-3 py-2 h-full">
                              <p className="w-1/2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]}
                                </strong>
                              </p>
                              <p className="w-1/2 text-right">
                                <strong className="text-green-800 text-2xl">
                                  {Number(result?.tech_i2).toFixed(2)}
                                </strong>
                                <span className="text-green-800 ml-2">(%)</span>
                              </p>
                            </div>
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

export default HcgCalculator;

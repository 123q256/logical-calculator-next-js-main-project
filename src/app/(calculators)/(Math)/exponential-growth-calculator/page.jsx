"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useExponentialGrowthCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ExponentialGrowthCalculator = () => {
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
    tech_operations: "1",
    tech_first: 1,
    tech_second: 3,
    tech_third: 12,
    tech_four: 7,
    tech_t_unit: "mon",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useExponentialGrowthCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations) {
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
        tech_t_unit: formData.tech_t_unit,
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
      tech_operations: "1",
      tech_first: 1,
      tech_second: 3,
      tech_third: 12,
      tech_four: 7,
      tech_t_unit: "mon",
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
    setFormData((prev) => ({ ...prev, tech_t_unit: unit }));
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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 text-center flex justify-center items-center">
                <p className="text-[20px]">
                  <strong>
                    <InlineMath
                      math={`x(t) = x_0 \\times \\left(1 + \\frac{r}{100}\\right)^t`}
                    />
                  </strong>
                </p>
              </div>
              <div className="col-span-12">
                <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-12">
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
                        <option value="1">
                          {data?.payload?.tech_lang_keys["2"]} x₀
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["3"]} r
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["4"]} t
                        </option>
                        <option value="4">
                          {data?.payload?.tech_lang_keys["5"]} x(t)
                        </option>
                      </select>
                    </div>
                  </div>

                  {formData.tech_operations != "1" && (
                    <>
                      <div className="col-span-6 " id="firstInput">
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["2"]} x₀:
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
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_operations != "2" && (
                    <>
                      <div className="col-span-6 " id="secondInput">
                        <label htmlFor="tech_second" className="label">
                          {data?.payload?.tech_lang_keys["3"]} r:
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
                          <span className="input_unit">%</span>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_operations != "3" && (
                    <>
                      <div className="col-span-6 " id="thirdInput">
                        <label htmlFor="tech_third" className="label">
                          {data?.payload?.tech_lang_keys["4"]} t:
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
                            {formData.tech_t_unit} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                {
                                  label:
                                    data?.payload?.tech_lang_keys["6"] +
                                    "(sec)",
                                  value: "sec",
                                },
                                {
                                  label:
                                    data?.payload?.tech_lang_keys["7"] +
                                    "(min)",
                                  value: "min",
                                },
                                {
                                  label:
                                    data?.payload?.tech_lang_keys["8"] + "(hr)",
                                  value: "hr",
                                },
                                {
                                  label: data?.payload?.tech_lang_keys["9"],
                                  value: "days",
                                },
                                {
                                  label: data?.payload?.tech_lang_keys["10"],
                                  value: "wks",
                                },
                                {
                                  label:
                                    data?.payload?.tech_lang_keys["11"] +
                                    "(mon)",
                                  value: "mon",
                                },
                                {
                                  label:
                                    data?.payload?.tech_lang_keys["12"] +
                                    "(yrs)",
                                  value: "yrs",
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
                    </>
                  )}
                  {formData.tech_operations != "4" && (
                    <>
                      <div className="col-span-6 " id="fourInput">
                        <label htmlFor="tech_four" className="label">
                          {data?.payload?.tech_lang_keys["5"]} x(t):
                        </label>
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
                </div>
              </div>
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
                      <div className="w-full">
                        <div className="w-full text-center text-[20px]">
                          <p>{result?.jawab}</p>
                          <p className="my-3">
                            <strong className="bg-[#2845F5] px-3 py-2 md:text-[32px] text-[16px] rounded-lg text-white">
                              {result?.final}
                              {result?.operations == "2" && " %"}
                              {result?.operations == "3" && " years"}
                            </strong>
                          </p>
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

export default ExponentialGrowthCalculator;

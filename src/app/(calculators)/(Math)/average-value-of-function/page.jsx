"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useAverageValueOfFunctionMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AverageValueOfAFunctionCalculator = () => {
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
    tech_fun: "x^2 + 3x",
    tech_lb: 2,
    tech_ub: 3,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAverageValueOfFunctionMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_fun || !formData.tech_lb) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_fun: formData.tech_fun,
        tech_lb: formData.tech_lb,
        tech_ub: formData.tech_ub,
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
      tech_fun: "x^2 + 3x",
      tech_lb: 2,
      tech_ub: 3,
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[40%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_fun" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_fun"
                    id="tech_fun"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_fun}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_lb" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_lb"
                    id="tech_lb"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_lb}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_ub" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_ub"
                    id="tech_ub"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_ub}
                    onChange={handleChange}
                  />
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
                        <div className="col-12 text-[16px] overflow-auto">
                          <div className="mt-3 text-[18px]">
                            <BlockMath
                              math={`\\int_{${formData?.tech_lb}}^{${formData?.tech_ub}} ${result?.tech_sim} \\, d${result?.tech_with} = ${result?.tech_ans}`}
                            />
                          </div>

                          <p className="mt-3">
                            <strong>{data?.payload?.tech_lang_keys[5]}:</strong>
                          </p>

                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys[6]}{" "}
                            <BlockMath math={`${result?.tech_input}`} />{" "}
                            {data?.payload?.tech_lang_keys[7]}{" "}
                            <BlockMath
                              math={`\\left[${formData?.tech_lb},${formData?.tech_ub}\\right]`}
                            />
                          </div>

                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys[8]}{" "}
                            <BlockMath math="f(x)" />{" "}
                            {data?.payload?.tech_lang_keys[7]}{" "}
                            <BlockMath math="[a,b]" /> is{" "}
                            <BlockMath
                              math={`\\bar{f}= \\frac{1}{b-a} \\int_a^b f \\left( x \\right) d x`}
                            />
                          </div>

                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys[9]}{" "}
                            <BlockMath
                              math={`L = \\frac{1}{\\left(${formData?.tech_ub}\\right)-\\left(${formData?.tech_lb}\\right)}\\int_{${formData?.tech_lb}}^{${formData?.tech_ub}} ${result?.tech_input} d${result?.tech_with} = \\int_{${formData?.tech_lb}}^{${formData?.tech_ub}} ${result?.tech_sim} d${result?.tech_with}`}
                            />
                          </div>

                          <div className="mt-3">
                            {data?.payload?.tech_lang_keys[10]}:{" "}
                            <a
                              href="https://technical-calculator/integral-calculator"
                              className="text-blue"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {data?.payload?.tech_lang_keys[11]}
                            </a>
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

export default AverageValueOfAFunctionCalculator;

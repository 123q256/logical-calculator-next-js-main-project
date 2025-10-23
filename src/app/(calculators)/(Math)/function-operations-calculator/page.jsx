"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useFunctionOperationsCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FunctionOperationsCalculator = () => {
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
    tech_fx: "2x + 1",
    tech_gx: "3x - 13",
    tech_point: 2,
    tech_variable: "x",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFunctionOperationsCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_fx || !formData.tech_gx) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_fx: formData.tech_fx,
        tech_gx: formData.tech_gx,
        tech_point: formData.tech_point,
        tech_variable: formData.tech_variable,
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
      tech_fx: "2x + 1",
      tech_gx: "3x - 13",
      tech_point: 2,
      tech_variable: "x",
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
  // result
  const x = result?.tech_x;
  const point = result?.tech_point;

  const renderPointExpression = (expression, value) =>
    expression?.replaceAll(`${x}`, `(${value})`);
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_fx" className="label">
                  {data?.payload?.tech_lang_keys["1"]} f:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_fx"
                    id="tech_fx"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_fx}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_gx" className="label">
                  {data?.payload?.tech_lang_keys["1"]} g:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_gx"
                    id="tech_gx"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_gx}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_variable" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_variable"
                    id="tech_variable"
                    value={formData.tech_variable}
                    onChange={handleChange}
                  >
                    <option value="a">a </option>
                    <option value="z">z </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_point" className="label">
                  {data?.payload?.tech_lang_keys["3"]} :
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_point"
                    id="tech_point"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_point}
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
                      <div className="w-full overflow-auto text-[18px]">
                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["4"]}</strong>
                        </p>
                        <BlockMath
                          math={`(f + g)(${x}) = ${result?.tech_add}`}
                        />
                        <BlockMath
                          math={`(f - g)(${x}) = ${result?.tech_sub}`}
                        />
                        <BlockMath
                          math={`(f \\times g)(${x}) = ${result?.tech_mul}`}
                        />
                        <BlockMath
                          math={`(f \\div g)(${x}) = ${result?.tech_div}`}
                        />

                        {point && (
                          <>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["5"]} {x} = {point}
                            </p>
                            <BlockMath
                              math={`(f + g)(${point}) = ${result?.tech_add1}`}
                            />
                            <BlockMath
                              math={`(f - g)(${point}) = ${result?.tech_sub1}`}
                            />
                            <BlockMath
                              math={`(f \\times g)(${point}) = ${result?.tech_mul1}`}
                            />
                            <BlockMath
                              math={`(f \\div g)(${point}) = ${result?.tech_div1}`}
                            />
                          </>
                        )}
                      </div>

                      <div className="w-full overflow-auto text-[16px]">
                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["6"]}</strong>
                        </p>
                        <BlockMath
                          math={`(f + g)(${x}) = (${result?.tech_fox}) + (${result?.tech_gox}) = ${result?.tech_add}`}
                        />
                        <BlockMath
                          math={`(f - g)(${x}) = (${result?.tech_fox}) - (${result?.tech_gox}) = ${result?.tech_sub}`}
                        />
                        <BlockMath
                          math={`(f \\times g)(${x}) = (${result?.tech_fox}) \\times (${result?.tech_gox}) = ${result?.tech_mul}`}
                        />
                        <BlockMath
                          math={`(f \\div g)(${x}) = \\frac{${result?.tech_fox}}{${result?.tech_gox}} = ${result?.tech_div}`}
                        />

                        {point && (
                          <>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["5"]} {x} = {point}
                            </p>
                            <BlockMath
                              math={`(f + g)(${point}) = ${renderPointExpression(
                                result?.tech_add,
                                point
                              )} = ${result?.tech_add1}`}
                            />
                            <BlockMath
                              math={`(f - g)(${point}) = ${renderPointExpression(
                                result?.tech_sub,
                                point
                              )} = ${result?.tech_sub1}`}
                            />
                            <BlockMath
                              math={`(f \\times g)(${point}) = ${renderPointExpression(
                                result?.tech_mul,
                                point
                              )} = ${result?.tech_mul1}`}
                            />
                            <BlockMath
                              math={`(f \\div g)(${point}) = ${renderPointExpression(
                                result?.tech_div,
                                point
                              )} = ${result?.tech_div1}`}
                            />
                          </>
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

export default FunctionOperationsCalculator;

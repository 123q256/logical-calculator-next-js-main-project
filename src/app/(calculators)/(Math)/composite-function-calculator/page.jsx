"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useCompositeFunctionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CompositeFunctionCalculator = () => {
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
    tech_one: "x^2 + 3x",
    tech_two: "x + 13",
    tech_point: 12,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCompositeFunctionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_one || !formData.tech_two) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_one: formData.tech_one,
        tech_two: formData.tech_two,
        tech_point: formData.tech_point,
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
      tech_one: "x^2 + 3x",
      tech_two: "x + 13",
      tech_point: 12,
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

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-1   gap-2 ">
              <div className="col-span-12">
                <label htmlFor="tech_one" className="label">
                  {data?.payload?.tech_lang_keys["1"]} f(x):
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_one"
                    id="tech_one"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_one}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_two" className="label">
                  {data?.payload?.tech_lang_keys["1"]} g(x):
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_two"
                    id="tech_two"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_two}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_point" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
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
                      <div className="w-full text-[18px] overflow-auto">
                        <p className="mt-2">
                          <InlineMath
                            math={`(f∘g)(x) = ${result?.tech_enter2}`}
                          />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`(g∘f)(x) = ${result?.tech_enter3}`}
                          />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`(f∘g)(${result?.tech_point}) = ${result?.tech_res}`}
                          />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`(g∘f)(${result?.tech_point}) = ${result?.tech_res1}`}
                          />
                        </p>
                      </div>

                      <div className="w-full text-[16px] overflow-auto">
                        <p className="mt-2">
                          <strong>
                            {data?.payload?.tech_lang_keys?.["4"]}
                          </strong>
                        </p>
                        <p className="mt-2">Your Input</p>
                        <p className="mt-2">
                          <InlineMath math={`f(x) = ${result?.tech_one}`} />
                        </p>
                        <p className="mt-2">
                          <InlineMath math={`g(x) = ${result?.tech_two}`} />
                        </p>
                        <p className="mt-2">
                          <InlineMath math={`x = ${result?.tech_point}`} />
                        </p>
                        <p className="mt-2">
                          <InlineMath math={`(f∘g)(x) = f(g(x))`} />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`(f∘g)(x) = f(${result?.tech_two})`}
                          />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`(f∘g)(x) = ${result?.tech_enter}`}
                          />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`(f∘g)(x) = ${result?.tech_enter2}`}
                          />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`(f∘g)(${
                              result?.tech_point
                            }) = ${result?.tech_enter2?.replace(
                              /x/g,
                              `(${result?.tech_point})`
                            )}`}
                          />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`(f∘g)(${result?.tech_point}) = ${result?.tech_res}`}
                          />
                        </p>
                        <p className="mt-2">
                          <InlineMath math={`(g∘f)(x) = g(f(x))`} />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`(g∘f)(x) = g(${result?.tech_one})`}
                          />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`(g∘f)(x) = ${result?.tech_enter1}`}
                          />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`(g∘f)(x) = ${result?.tech_enter3}`}
                          />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`(g∘f)(${
                              result?.tech_point
                            }) = ${result?.tech_enter3?.replace(
                              /x/g,
                              `(${result?.tech_point})`
                            )}`}
                          />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`(g∘f)(${result?.tech_point}) = ${result?.tech_res1}`}
                          />
                        </p>
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

export default CompositeFunctionCalculator;

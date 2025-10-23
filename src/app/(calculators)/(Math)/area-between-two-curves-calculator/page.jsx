"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import katex from "katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useAreaBetweenTwoCurvesCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AreaBetweenTwoCurvesCalculator = ({ htmlContent }) => {
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
    tech_enter_eq1: "6x+x^3",
    tech_enter_eq2: "6x + 4",
    tech_with: "x",
    tech_upper: 3,
    tech_lower: 1,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAreaBetweenTwoCurvesCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_enter_eq1 || !formData.tech_enter_eq2) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_enter_eq1: formData.tech_enter_eq1,
        tech_enter_eq2: formData.tech_enter_eq2,
        tech_with: formData.tech_with,
        tech_upper: formData.tech_upper,
        tech_lower: formData.tech_lower,
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
      tech_enter_eq1: "6x+x^3",
      tech_enter_eq2: "6x + 4",
      tech_with: "x",
      tech_upper: 3,
      tech_lower: 1,
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
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const scripts = containerRef.current.querySelectorAll(
        'script[type^="math/tex"]'
      );

      scripts.forEach((script) => {
        const isDisplayMode = script.type.includes("mode=display");
        const tex = script.textContent;
        const span = document.createElement("span");

        try {
          katex.render(tex, span, { displayMode: isDisplayMode });
          script.replaceWith(span);
        } catch (err) {
          console.error("KaTeX render error:", err);
        }
      });
    }
  }, [result?.tech_steps]);

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

          <div className="lg:w-[50%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12    gap-2 ">
              <div className="col-span-12">
                <label htmlFor="tech_enter_eq1" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    name="tech_enter_eq1"
                    id="tech_enter_eq1"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_enter_eq1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_enter_eq2" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    name="tech_enter_eq2"
                    id="tech_enter_eq2"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_enter_eq2}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_upper" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    name="tech_upper"
                    id="tech_upper"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_upper}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_lower" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    name="tech_lower"
                    id="tech_lower"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_lower}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_with" className="label">
                  W.R.T:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_with"
                    id="tech_with"
                    value={formData.tech_with}
                    onChange={handleChange}
                  >
                    <option value="x">x</option>
                    <option value="y">y </option>
                  </select>
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
                      <div className="w-full text-[16px] overflow-auto">
                        <p className="mt-3 text-[18px]">
                          <strong>{data?.payload?.tech_lang_keys["6"]}</strong>
                        </p>

                        {/* Main result using KaTeX */}
                        <div className="mt-3">
                          <BlockMath math={String(result?.tech_ans)} />
                        </div>

                        {/* Alternative result (plain text) */}
                        <div className="mt-3">= {result?.tech_ans1}</div>

                        {/* Equation Heading */}
                        <div className="mt-3 text-[18px]">
                          <strong>{data?.payload?.tech_lang_keys["5"]}</strong>
                        </div>

                        {/* Integral formula */}
                        <div className="mt-3">
                          <BlockMath
                            math={`\\int_{${result?.tech_lb}}^{${result?.tech_ub}} ${result?.tech_enter} \\, d${result?.tech_with}`}
                          />
                        </div>

                        {/* Steps Heading */}
                        <div className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["7"]}</strong>
                        </div>

                        {/* Steps content (HTML rendered from backend) */}

                        {result?.tech_steps && (
                          <div
                            ref={containerRef}
                            className="katex-rendered-content res_step"
                            dangerouslySetInnerHTML={{
                              __html: result.tech_steps,
                            }}
                          />
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

export default AreaBetweenTwoCurvesCalculator;

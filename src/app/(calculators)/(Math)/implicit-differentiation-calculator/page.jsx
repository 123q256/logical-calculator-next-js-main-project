"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";

import katex from "katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useImplicitDifferentiationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ImplicitDifferentiationCalculator = () => {
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
    tech_EnterEq: "x^2+3y",
    tech_EnterEq1: "3xy",
    tech_x: "1",
    tech_y: "3",
    tech_with: "x",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useImplicitDifferentiationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_EnterEq) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_EnterEq: formData.tech_EnterEq,
        tech_EnterEq1: formData.tech_EnterEq1,
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_with: formData.tech_with,
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
      tech_EnterEq: "x^2+3y",
      tech_EnterEq1: "3xy",
      tech_x: "1",
      tech_y: "3",
      tech_with: "x",
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
      const elements = containerRef.current.querySelectorAll(".math");

      elements.forEach((el) => {
        const tex = el.textContent;
        const span = document.createElement("span");

        try {
          katex.render(tex, span, {
            displayMode: false,
            throwOnError: false,
          });
          el.replaceWith(span);
        } catch (err) {
          console.error("KaTeX render error:", err);
        }
      });
    }
  }, [result, formData]);

  const isNumeric = (val) => !isNaN(parseFloat(val)) && isFinite(val);

  const withX = formData?.tech_with === "x";
  const res = result?.tech_res ?? "";
  const resf = result?.tech_resf ?? "";
  const x = formData?.tech_x;
  const y = formData?.tech_y;

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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <p className="col-span-12">
                <strong>
                  {data?.payload?.tech_lang_keys["1"]}: f(x,y) = g(x,y)
                </strong>
              </p>
              <div className="col-span-6">
                <label htmlFor="tech_EnterEq" className="label">
                  f(x,y):
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_EnterEq"
                    id="tech_EnterEq"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_EnterEq}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_EnterEq1" className="label">
                  g(x,y):
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_EnterEq1"
                    id="tech_EnterEq1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_EnterEq1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_want" className="label">
                  {data?.payload?.tech_lang_keys["2"]} W.R.T:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_want"
                    id="tech_want"
                    value={formData.tech_want}
                    onChange={handleChange}
                  >
                    <option value="x">x </option>
                    <option value="y">y </option>
                  </select>
                </div>
              </div>
              <p className="col-span-12">
                <strong>
                  {data?.payload?.tech_lang_keys["3"]} (x,y): (
                  {data?.payload?.tech_lang_keys["5"]})
                </strong>
              </p>
              <div className="col-span-6">
                <label htmlFor="tech_x" className="label">
                  x:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x"
                    id="tech_x"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_y" className="label">
                  y:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_y"
                    id="tech_y"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_y}
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
                    <div className="w-full mt-3" ref={containerRef}>
                      <div className="w-full text-center overflow-auto">
                        <p className="my-3">
                          <strong className="bg-sky px-3 py-4 text-[32px] rounded-lg text-blue-500 math">
                            {withX
                              ? `\\color{#1670a7} {\\frac{dy}{dx} = ${res}}`
                              : `\\color{#1670a7} {\\frac{dx}{dy} = ${res}}`}
                          </strong>
                        </p>
                      </div>

                      {isNumeric(x) && isNumeric(y) && (
                        <div className="w-full text-center overflow-auto mt-3">
                          <p className="my-3">
                            <strong className="bg-sky px-3 py-4 text-[32px] rounded-lg text-blue-500 math">
                              {withX
                                ? `\\color{#1670a7} {\\frac{dy}{dx}\\Big|_{(x,y)=(${x},${y})} = ${Number(
                                    resf
                                  ).toFixed(3)}}`
                                : `\\color{#1670a7} {\\frac{dx}{dy}\\Big|_{(x,y)=(${x},${y})} = ${Number(
                                    resf
                                  ).toFixed(3)}}`}
                            </strong>
                          </p>
                        </div>
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

export default ImplicitDifferentiationCalculator;

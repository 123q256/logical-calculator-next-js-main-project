"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useInstantaneousRateOfChangeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const InstantaneousRateOfChangeCalculator = () => {
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
    tech_hidden_val: "0",
    tech_EnterEq: "(6x^2 - 4)",
    tech_x: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useInstantaneousRateOfChangeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_EnterEq || !formData.tech_x) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_hidden_val: formData.tech_hidden_val,
        tech_EnterEq: formData.tech_EnterEq,
        tech_x: formData.tech_x,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_hidden_val: "0",
      tech_EnterEq: "(6x^2 - 4)",
      tech_x: "4",
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

  const [showKeyboard, setShowKeyboard] = useState(false);
  const toggleKeyboard = () => {
    setShowKeyboard((prev) => !prev);
    setFormData((prev) => ({
      ...prev,
      tech_hidden_val: prev.tech_hidden_val === "0" ? "1" : "0",
    }));
  };

  const handleInsertSymbol = (symbol) => {
    if (symbol === "CLS") {
      setFormData({ ...formData, tech_EnterEq: "" });
    } else if (symbol === "√") {
      setFormData((prev) => ({
        ...prev,
        tech_EnterEq: prev.tech_EnterEq + "sqrt(",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        tech_EnterEq: prev.tech_EnterEq + symbol,
      }));
    }
  };

  // Utility to replace math <script> tags with React components
  const parseTechSteps = (html) => {
    // Split on math script tags
    const parts = html.split(
      /<script[^>]*type="math\/tex[^>]*">([\s\S]*?)<\/script>/g
    );

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // Every odd index is LaTeX content
        const isBlock = html.includes(
          `type="math/tex; mode=display"`,
          html.indexOf(part)
        );
        return isBlock ? (
          <BlockMath key={index} math={part} />
        ) : (
          <InlineMath key={index} math={part} />
        );
      } else {
        // Even index is normal HTML
        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
      }
    });
  };

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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
            <input
              type="hidden"
              step="any"
              name="tech_hidden_val"
              id="tech_hidden_val"
              className="input my-2"
              placeholder="00"
              value={formData.tech_hidden_val}
              onChange={handleChange}
            />
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-10 mt-lg-2">
                <label htmlFor="tech_EnterEq" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
              <div className="col-span-2 mt-lg-2 flex items-center">
                <label htmlFor="EnterEq" className="font-s-14 text-blue">
                  &nbsp;
                </label>
                <span
                  className="text-blue-700 keyshow mt-3 cursor-pointer"
                  onClick={toggleKeyboard}
                >
                  <img
                    src="/images/keyboard.png"
                    className="keyboardImg transform w-9 h-9"
                    alt="keyboard"
                  />
                </span>
              </div>
              <div
                className={`col-span-12 mt-4 justify-center keyboard ${
                  showKeyboard ? "flex flex-wrap" : "hidden"
                }`}
              >
                {["CLS", "+", "-", "/", "*", "^", "√", "(", ")"].map(
                  (symbol, index) => (
                    <button
                      key={index}
                      type="button"
                      className="btn buttn px-2 py-2 mx-1 mb-2 bg-blue-700 text-white rounded-sm h-9 px-4 uppercase shadow-md hover:bg-blue-600"
                      onClick={() => handleInsertSymbol(symbol)}
                    >
                      {symbol}
                    </button>
                  )
                )}
              </div>
              <div className="col-span-2">
                <label htmlFor="x" className="font-s-14 text-blue">
                  &nbsp;
                </label>
                <p className="p_set pt-3">
                  <strong>x = {data?.payload?.tech_lang_keys["2"]}</strong>
                </p>
              </div>
              <div className="col-span-10">
                <label htmlFor="tech_x" className="label">
                  &nbsp;
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
                      <div className="w-full text-[18px]">
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["3"]}
                        </p>

                        <p className="mt-2">
                          <InlineMath
                            math={`\\frac{\\partial (${result?.tech_equation})}{\\partial x}`}
                          />
                          <span>
                            <InlineMath
                              math={`\\quad ${data?.payload?.tech_lang_keys["4"]}\\;x = ${formData?.tech_x}`}
                            />
                          </span>
                        </p>

                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["5"]}
                        </p>

                        <p className="mt-2">
                          <InlineMath math={`${result?.tech_deriv}`} />
                        </p>

                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["6"]}:
                        </p>

                        <div className="mt-2 px-3">
                          {result?.tech_steps
                            ? parseTechSteps(result.tech_steps)
                            : null}
                        </div>

                        <p className="mt-2">
                          <strong>
                            3. {data?.payload?.tech_lang_keys["7"]}:
                          </strong>{" "}
                          <InlineMath math={`${result?.tech_deriv}`} />
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

export default InstantaneousRateOfChangeCalculator;

"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { jStat } from "jstat";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useRelativeRiskCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RelativeRiskCalculator = () => {
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
    tech_e_disease: "54",
    tech_e_no_disease: "34",
    tech_c_disease: "74",
    tech_c_no_disease: "104",
    tech_z_score: "1.9600",
    tech_confidenceLevel: "50",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRelativeRiskCalculatorMutation();

  // To avoid multiple alerts, keep track if alert shown already
  const alertShownRef = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tech_confidenceLevel") {
      if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
        alertShownRef.current = false; // Reset alert shown flag on valid input
      } else {
        // Invalid input — do not update state to prevent invalid value
        if (!alertShownRef.current) {
          alert("Please enter a valid confidence level between 0 and 100.");
          alertShownRef.current = true;
        }
      }
    }
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  //       setResult(null);
  //   setFormError(null);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_e_disease ||
      !formData.tech_e_no_disease ||
      !formData.tech_c_disease ||
      !formData.tech_c_no_disease ||
      !formData.tech_z_score
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_e_disease: formData.tech_e_disease,
        tech_e_no_disease: formData.tech_e_no_disease,
        tech_c_disease: formData.tech_c_disease,
        tech_c_no_disease: formData.tech_c_no_disease,
        tech_z_score: formData.tech_z_score,
        tech_confidenceLevel: formData.tech_confidenceLevel,
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
      tech_e_disease: "54",
      tech_e_no_disease: "34",
      tech_c_disease: "74",
      tech_c_no_disease: "104",
      tech_z_score: "1.9600",
      tech_confidenceLevel: "50",
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

  useEffect(() => {
    const confidenceStr = formData.tech_confidenceLevel;

    if (confidenceStr === "") {
      setFormData((prev) => ({ ...prev, tech_z_score: "" }));
      return;
    }

    const confidenceLevel = parseFloat(confidenceStr) / 100;

    if (confidenceLevel > 0 && confidenceLevel < 1) {
      const alpha = (1 - confidenceLevel) / 2;
      const zScore = jStat.normal.inv(1 - alpha, 0, 1);
      setFormData((prev) => ({
        ...prev,
        tech_z_score: zScore.toFixed(4),
      }));
    } else {
      setFormData((prev) => ({ ...prev, tech_z_score: "" }));
      // No alert here, already handled in handleChange
    }
  }, [formData.tech_confidenceLevel]);

  const e_disease = formData?.tech_e_disease;
  const e_no_disease = formData?.tech_e_no_disease;
  const c_disease = formData?.tech_c_disease;
  const c_no_disease = formData?.tech_c_no_disease;
  const z_score = formData?.tech_z_score;
  const RR = result?.tech_relative;

  const lnRR = Math.log(RR);
  const sqrtTerm = Math.sqrt(
    1 / e_disease +
      1 / c_disease -
      1 / (e_disease + e_no_disease) -
      1 / (c_disease + c_no_disease)
  );
  const lowerBound = Math.exp(lnRR - z_score * sqrtTerm);
  const upperBound = Math.exp(lnRR + z_score * sqrtTerm);

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
            <div className="grid grid-cols-12 mt-3  gap-2">
              <p className="col-span-12 ">
                <strong>{data?.payload?.tech_lang_keys["1"]}</strong>
              </p>
              <div className="col-span-6 ">
                <label htmlFor="tech_e_disease" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_e_disease"
                    id="tech_e_disease"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_e_disease}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6 ">
                <label htmlFor="tech_e_no_disease" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_e_no_disease"
                    id="tech_e_no_disease"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_e_no_disease}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <p className="col-span-12 ">
                <strong>{data?.payload?.tech_lang_keys[4]}</strong>
              </p>
              <div className="col-span-6 ">
                <label htmlFor="tech_c_disease" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_c_disease"
                    id="tech_c_disease"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_c_disease}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6 ">
                <label htmlFor="tech_c_no_disease" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_c_no_disease"
                    id="tech_c_no_disease"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_c_no_disease}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <input
                type="hidden"
                step="any"
                name="tech_z_score"
                min="0"
                value={formData.tech_z_score}
                onChange={handleChange}
              />
              <div className="col-span-6 ">
                <label htmlFor="tech_confidenceLevel" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_confidenceLevel"
                    id="tech_confidenceLevel"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_confidenceLevel}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
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
                    <div className="w-full mt-3 overflow-auto">
                      <div className="w-full md:w-[70%] lg:w-[70%] overflow-auto">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="p-2 border-b">
                                {data?.payload?.tech_lang_keys["7"]}
                              </td>
                              <td className="p-2 border-b">
                                <strong className="text-blue">{RR}</strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 border-b">
                                {data?.payload?.tech_lang_keys["8"]}
                              </td>
                              <td className="p-2 border-b">
                                <strong className="text-blue">
                                  {lowerBound.toFixed(3)}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 border-b">
                                {data?.payload?.tech_lang_keys["9"]}
                              </td>
                              <td className="p-2 border-b">
                                <strong className="text-blue">
                                  {upperBound.toFixed(3)}
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <p className="w-full mt-3 text-[18px]">
                        <strong className="text-blue">
                          {data?.payload?.tech_lang_keys["10"]}
                        </strong>
                      </p>

                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["5"]}:{" "}
                        {formData?.tech_confidenceLevel}
                        {data?.payload?.tech_lang_keys["6"]}
                      </p>

                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["11"]}: {z_score}
                      </p>

                      <p className="w-full mt-3">
                        <strong className="text-blue">
                          {data?.payload?.tech_lang_keys["1"]}
                        </strong>
                      </p>
                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["2"]}: {e_disease}
                      </p>
                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["3"]}: {e_no_disease}
                      </p>

                      <p className="w-full mt-3">
                        <strong className="text-blue">
                          {data?.payload?.tech_lang_keys["4"]}
                        </strong>
                      </p>
                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["2"]}: {c_disease}
                      </p>
                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["3"]}: {c_no_disease}
                      </p>

                      <p className="w-full mt-3 text-[18px]">
                        <strong className="text-blue">Solution</strong>
                      </p>
                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["12"]}
                      </p>
                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["7"]} ={" "}
                        <InlineMath math="\frac{a}{a + b} \div \frac{c}{c + d}" />
                      </p>

                      <p className="w-full mt-2">
                        <strong>{data?.payload?.tech_lang_keys["13"]}:</strong>
                      </p>
                      <p className="w-full mt-2">
                        <strong>a</strong> →{" "}
                        {data?.payload?.tech_lang_keys["15"]}
                      </p>
                      <p className="w-full mt-2">
                        <strong>b</strong> →{" "}
                        {data?.payload?.tech_lang_keys["16"]}
                      </p>
                      <p className="w-full mt-2">
                        <strong>c</strong> →{" "}
                        {data?.payload?.tech_lang_keys["17"]}
                      </p>
                      <p className="w-full mt-2">
                        <strong>d</strong> →{" "}
                        {data?.payload?.tech_lang_keys["18"]}
                      </p>

                      <p className="w-full mt-2">
                        <InlineMath
                          math={`\\frac{${e_disease}}{${e_disease} + ${e_no_disease}} \\div \\frac{${c_disease}}{${c_disease} + ${c_no_disease}}`}
                        />
                      </p>

                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["7"]} ={" "}
                        <InlineMath
                          math={`\\frac{${result?.tech_riskExposed}}{${result?.tech_riskControl}}`}
                        />
                      </p>

                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["7"]} = {RR}
                      </p>

                      <div className="w-full mt-3 text-[18px]">
                        <strong className="text-blue">
                          {data?.payload?.tech_lang_keys["14"]}
                        </strong>
                      </div>

                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["19"]} (RR):
                      </p>

                      <p className="w-full mt-2">
                        <InlineMath math={`\\ln(RR) = ${lnRR.toFixed(3)}`} />
                      </p>

                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["20"]}:
                      </p>
                      <p className="w-full mt-2">
                        <InlineMath
                          math={`\\sqrt{\\frac{1}{a} + \\frac{1}{c} - \\frac{1}{a + b} - \\frac{1}{c + d}} = ${sqrtTerm.toFixed(
                            3
                          )}`}
                        />
                      </p>

                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["21"]}:
                      </p>
                      <p className="w-full mt-2">
                        <InlineMath
                          math={`\\text{Lower Bound} = \\exp(${lnRR.toFixed(
                            3
                          )} - (${z_score} \\times ${sqrtTerm.toFixed(
                            3
                          )})) = ${lowerBound.toFixed(3)}`}
                        />
                      </p>

                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["22"]}:
                      </p>
                      <p className="w-full mt-2">
                        <InlineMath
                          math={`\\text{Upper Bound} = \\exp(${lnRR.toFixed(
                            3
                          )} + (${z_score} \\times ${sqrtTerm.toFixed(
                            3
                          )})) = ${upperBound.toFixed(3)}`}
                        />
                      </p>
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

export default RelativeRiskCalculator;

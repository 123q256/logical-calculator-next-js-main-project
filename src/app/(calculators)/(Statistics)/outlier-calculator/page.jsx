"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useOutlierCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const OutlierCalculator = () => {
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
    tech_x: "10, 12, 11, 15, 11, 14, 13, 17, 12, 22, 14, 11",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useOutlierCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
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
      tech_x: "10, 12, 11, 15, 11, 14, 13, 17, 12, 22, 14, 11",
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
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (
                  {data?.payload?.tech_lang_keys["2"]}):
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="10, 12, 11, 15, 11, 14, 13, 17, 12, 22, 14, 11"
                    value={formData.tech_x || ""}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[60%] mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["3"]} (s)
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Array.isArray(result?.tech_poutlier) &&
                                  result.tech_poutlier.length > 0
                                    ? result.tech_poutlier.join(", ")
                                    : "None"}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["4"]} (s)
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Array.isArray(result?.tech_outlier) &&
                                  result.tech_outlier.length > 0
                                    ? result.tech_outlier.join(", ")
                                    : "None"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full md:w-[80%] lg:w-[60%] mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]} Q1
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_first}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]} Q3
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_third}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["6"]} IQR
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_inner}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["7"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_median}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full mt-3 text-[14px] md:text-[16px]">
                          <p>
                            <strong className="text-blue">
                              {data?.payload?.tech_lang_keys[8]}:
                            </strong>
                          </p>

                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys[9]}:{" "}
                            <strong>{result?.tech_values?.join(", ")}</strong>
                          </p>

                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys[10]}, IQR
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath math="IQR = Q_3 - Q_1" />
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath math={`Q_1 = ${result?.tech_first}`} />
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath math={`Q_3 = ${result?.tech_third}`} />
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath
                              math={`IQR = ${result?.tech_third} - ${result?.tech_first}`}
                            />
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath math={`IQR = ${result?.tech_inner}`} />
                          </p>

                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys[11]}:
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath
                              math={`Q1 - (1.5 \\times IQR) \\text{ ${data?.payload?.tech_lang_keys[12]} } Q3 + (1.5 \\times IQR)`}
                            />
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath
                              math={`${result?.tech_first} - (1.5 \\times ${result?.tech_inner}) \\text{ ${data?.payload?.tech_lang_keys[12]} } ${result?.tech_third} + (1.5 \\times ${result?.tech_inner})`}
                            />
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys[13]}: } ${result?.tech_in_f1} \\text{ ${data?.payload?.tech_lang_keys[12]} } ${result?.tech_in_f2}`}
                            />
                          </p>

                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys[14]}:
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath
                              math={`Q1 - (3 \\times IQR) \\text{ ${data?.payload?.tech_lang_keys[12]} } Q3 + (3 \\times IQR)`}
                            />
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath
                              math={`${result?.tech_first} - (3 \\times ${result?.tech_inner}) \\text{ ${data?.payload?.tech_lang_keys[12]} } ${result?.tech_third} + (3 \\times ${result?.tech_inner})`}
                            />
                          </p>
                          <p className="w-full mt-2">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys[15]}: } ${result?.tech_out_f1} \\text{ and } ${result?.tech_out_f2}`}
                            />
                          </p>

                          <p className="w-full mt-2">
                            <strong className="text-blue">
                              {data?.payload?.tech_lang_keys[3]}(s)
                            </strong>
                          </p>
                          <p className="w-full mt-2">
                            <strong>
                              {result?.tech_poutlier?.length > 0
                                ? result.tech_poutlier.join(", ")
                                : "None"}
                            </strong>
                          </p>

                          <p className="w-full mt-2">
                            <strong className="text-blue">
                              {data?.payload?.tech_lang_keys[4]}(s)
                            </strong>
                          </p>
                          <p className="w-full mt-2">
                            <strong>
                              {result?.tech_outlier?.length > 0
                                ? result.tech_outlier.join(", ")
                                : "None"}
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

export default OutlierCalculator;

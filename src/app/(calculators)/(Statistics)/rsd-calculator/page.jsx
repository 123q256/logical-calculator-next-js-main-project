"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useRsdCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RsdCalculator = () => {
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
    tech_form: "raw", // raw  summary
    tech_x: "12, 23, 45, 33, 65, 54, 54",
    tech_mean: "20.75",
    tech_deviation: "8.3016",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRsdCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_form || !formData.tech_x) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_form: formData.tech_form,
        tech_x: formData.tech_x,
        tech_mean: formData.tech_mean,
        tech_deviation: formData.tech_deviation,
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
      tech_form: "raw", // raw  summary
      tech_x: "12, 23, 45, 33, 65, 54, 54",
      tech_mean: "20.75",
      tech_deviation: "8.3016",
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
            <div className="grid grid-cols-12 gap-1 summary md:gap-2">
              <div className="col-span-12 px-2 mb-3 ">
                <p className="col-span-12 text-blue me-2 mb-0">
                  {data?.payload?.tech_lang_keys[19]}
                </p>
                <label className="pe-2" htmlFor="raw">
                  <input
                    type="radio"
                    name="tech_form"
                    value="raw"
                    id="raw"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_form === "raw"}
                  />
                  <span>{data?.payload?.tech_lang_keys["1"]}</span>
                </label>
                <label className="pe-2" htmlFor="summary">
                  <input
                    type="radio"
                    name="tech_form"
                    value="summary"
                    id="summary"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_form === "summary"}
                  />
                  <span>{data?.payload?.tech_lang_keys["2"]}</span>
                </label>
              </div>
            </div>

            {formData.tech_form === "raw" && (
              <>
                <div className="grid grid-cols-1  gap-4">
                  <div className="space-y-2 raw">
                    <label htmlFor="tech_x" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (
                      {data?.payload?.tech_lang_keys["6"]}):
                    </label>
                    <div className="w-full py-2">
                      <textarea
                        name="tech_x"
                        id="tech_x"
                        className="input textareaInput"
                        aria-label="textarea input"
                        placeholder="e.g. 12, 23, 45, 33, 65, 54, 54"
                        value={formData.tech_x || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {formData.tech_form === "summary" && (
              <>
                <div className="grid grid-cols-12 gap-1 summary md:gap-2">
                  <div className="lg:col-span-6 md:col-span-6 col-span-12">
                    <label htmlFor="tech_mean" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_mean"
                        id="tech_mean"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_mean}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12">
                    <label htmlFor="tech_deviation" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_deviation"
                        id="tech_deviation"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_deviation}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center mt-3 justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="text-center">
                          <p className="text-[20px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["7"]}
                            </strong>
                          </p>
                          <p className="text-[32px] px-3 py-2 my-3">
                            <strong className="bg-[#2845F5] text-white rounded-lg px-3 py-2">
                              {Number(result?.tech_rsd).toFixed(3)}%
                            </strong>
                          </p>
                        </div>

                        {result?.tech_form === "raw" && (
                          <div className="grid grid-cols-12 gap-1 ">
                            <div className="col-span-12 md:col-span-10 lg:col-span-7 mt-2 overflow-auto">
                              <table className="w-full text-[18px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["8"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {result?.tech_min}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {result?.tech_max}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {result?.tech_range}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["11"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {result?.tech_count}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["12"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {result?.tech_sum}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["13"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {result?.tech_median}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["14"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {result?.tech_mode?.map(
                                          (mode, index) => (
                                            <span key={index}>{mode} </span>
                                          )
                                        )}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["3"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {Number(result?.tech_mean).toFixed(2)}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["15"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {Number(result?.tech_SD).toFixed(2)}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["16"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {Number(result?.tech_svar).toFixed(2)}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["17"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {Number(result?.tech_PSD).toFixed(2)}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["18"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {Number(result?.tech_pvar).toFixed(2)}
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
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

export default RsdCalculator;

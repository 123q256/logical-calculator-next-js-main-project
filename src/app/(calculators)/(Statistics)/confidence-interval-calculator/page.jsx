"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useConfidenceIntervalCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ConfidenceIntervalCalculator = () => {
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
    tech_x: 20.6,
    tech_s: 3.2,
    tech_n: 50,
    tech_cl: 95,
    tech_z: 1.959964,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useConfidenceIntervalCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_x ||
      !formData.tech_s ||
      !formData.tech_n ||
      !formData.tech_cl
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_s: formData.tech_s,
        tech_n: formData.tech_n,
        tech_cl: formData.tech_cl,
        tech_z: formData.tech_z,
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
      tech_x: 20.6,
      tech_s: 3.2,
      tech_n: 50,
      tech_cl: 95,
      tech_z: 1.959964,
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
            <div className="grid grid-cols-12 mt-3 gap-1 md:gap-3">
              <div className="col-span-12 text-center mb-2 justify-center flex">
                <img
                  src="/images/c_i_e.svg"
                  alt={`${data?.payload?.tech_lang_keys["5"]} ${data?.payload?.tech_lang_keys["17"]}`}
                  width="100"
                  height="75"
                />
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (x̅)
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_s" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (s)
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_s"
                    id="tech_s"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_s}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_n" className="label">
                  {data?.payload?.tech_lang_keys["3"]} (n)
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_n"
                    id="tech_n"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_n}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_cl" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_cl"
                    id="tech_cl"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_cl}
                    onChange={handleChange}
                  />
                  <span className=" input_unit">%</span>
                </div>
              </div>
            </div>
            <input
              type="hidden"
              name="tech_z"
              value={formData.tech_z}
              onChange={handleChange}
            />
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[70%] lg:w-[70%] mt-2 overflow-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </td>
                                <td className="p-2 border-b">
                                  <b>{result?.tech_ci}</b>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["6"]}
                                </td>
                                <td className="p-2 border-b">
                                  <b>
                                    {result?.tech_ci1} to {result?.tech_ci2}
                                  </b>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="col-7 mt-3">
                          {data?.payload?.tech_lang_keys["7"]} (μ){" "}
                          {data?.payload?.tech_lang_keys["8"]} x̅ ± E{" "}
                          {data?.payload?.tech_lang_keys["9"]}{" "}
                          {formData?.tech_cl}%{" "}
                          {data?.payload?.tech_lang_keys["10"]}.
                        </p>
                        <div className="w-full md:w-[70%] lg:w-[70%] mt-2 overflow-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b text-blue">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_se}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b text-blue">
                                  {data?.payload?.tech_lang_keys["12"]} (Z)
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_zscore} σ</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b text-blue">
                                  {data?.payload?.tech_lang_keys["13"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_rtpv}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b text-blue">
                                  {data?.payload?.tech_lang_keys["14"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_lb}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b text-blue">
                                  {data?.payload?.tech_lang_keys["15"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_ub}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b text-blue">
                                  {data?.payload?.tech_lang_keys["16"]} (E)
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_moe}</strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
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

export default ConfidenceIntervalCalculator;

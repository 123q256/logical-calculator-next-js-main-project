"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useStandardErrorCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const StandardErrorCalculator = () => {
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
    tech_x: "10, 20, 30, 40, 50",
    tech_deviation: 4.5,
    tech_sample: 10,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useStandardErrorCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_form) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_form: formData.tech_form,
        tech_x: formData.tech_x,
        tech_deviation: formData.tech_deviation,
        tech_sample: formData.tech_sample,
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
      tech_x: "10, 20, 30, 40, 50",
      tech_deviation: 4.5,
      tech_sample: 10,
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12 flex items-center justify-between">
                <div className="grid grid-cols-12  gap-4">
                  <p className="col-span-12 md:col-span-4">
                    {data?.payload?.tech_lang_keys["1"]}
                  </p>
                  <div className=" col-span-12 md:col-span-8 flex items-center">
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
                      <span>{data?.payload?.tech_lang_keys["2"]}</span>
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
                      <span>{data?.payload?.tech_lang_keys["3"]}</span>
                    </label>
                  </div>
                </div>
              </div>
              {formData.tech_form === "summary" && (
                <>
                  <div className="col-span-12 summary mt-4">
                    <div className="grid grid-cols-12  gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_deviation" className="label">
                          {data?.payload?.tech_lang_keys["4"]} σ:
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
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 sample">
                        <label htmlFor="tech_sample" className="label">
                          {data?.payload?.tech_lang_keys["5"]} (n):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_sample"
                            id="tech_sample"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_sample}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_form === "raw" && (
                <>
                  <div className="col-span-12  raw ">
                    <label htmlFor="tech_x" className="label">
                      {data?.payload?.tech_lang_keys["6"]} (
                      {data?.payload?.tech_lang_keys["7"]}):
                    </label>
                    <div className="w-full py-2">
                      <textarea
                        name="tech_x"
                        id="tech_x"
                        className="input textareaInput"
                        aria-label="textarea input"
                        placeholder="e.g. 12, 23, 45, 33, 65, 54, 54"
                        value={
                          formData.tech_x || "e.g. 12, 23, 45, 33, 65, 54, 54"
                        }
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
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
                        <div className="text-center">
                          <p className="text-[25px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["14"]}
                            </strong>
                          </p>
                          <p className="text-[30px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-3">
                            <strong>{result?.tech_se}</strong>
                          </p>
                        </div>

                        {formData?.tech_form == "raw" ? (
                          <>
                            <div className="w-full md:w-[50%] lg:w-[50%] mt-2">
                              <table className="w-full text-[18px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]} n
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result?.tech_count}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["10"]} ∑ x
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result?.tech_sum}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["11"]} x̄
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result?.tech_mean}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["4"]} σ
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result?.tech_e}</strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="w-full mt-3 text-[20px]">
                              {data?.payload?.tech_lang_keys["12"]}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["8"]} : (
                              {formData?.tech_x})
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["9"]} :{" "}
                              {result?.tech_count}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["13"]} = σ / √n{" "}
                            </p>
                            <p className="w-full mt-2">
                              σ = {data?.payload?.tech_lang_keys["4"]}
                            </p>
                            <p className="w-full mt-2">
                              σ = √( ∑ (x - x̄)² / n - 1 )
                            </p>
                            <p className="w-full mt-2">
                              x = {data?.payload?.tech_lang_keys["15"]}
                            </p>
                            <p className="w-full mt-2">
                              x̄ = {data?.payload?.tech_lang_keys["11"]}
                            </p>
                            <p className="w-full mt-2">
                              n = {data?.payload?.tech_lang_keys["9"]}
                            </p>
                            <p className="w-full mt-2">
                              σ = √(1/{result?.tech_count}-1) * (
                              {result?.tech_v1})
                            </p>
                            <p className="w-full mt-2">
                              σ = √(1/{result?.tech_v2}) * ({result?.tech_v})
                            </p>
                            <p className="w-full mt-2">
                              σ = √(1/{result?.tech_v2}) * ({result?.tech_v3})
                            </p>
                            <p className="w-full mt-2">
                              σ = √(1/{result?.tech_v2}) * ({result?.tech_c})
                            </p>
                            <p className="w-full mt-2">
                              σ = √({result?.tech_v4}) * ({result?.tech_c})
                            </p>
                            <p className="w-full mt-2">
                              σ = √{result?.tech_v5}
                            </p>
                            <p className="w-full mt-2">
                              σ = √{result?.tech_rv}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["14"]} = σ / √n
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["14"]} ={" "}
                              {result?.tech_rv} / √{result?.tech_count}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["14"]} ={" "}
                              {result?.tech_rv} / {result?.tech_v6}
                            </p>
                            <p className="w-full mt-2 text-[1.3em] font-bold px-4 py-3 bg-[#d4edda] text-[#155724] border-l-[6px] border-[#28a745]">
                              {data?.payload?.tech_lang_keys["14"]} ={" "}
                              {result?.tech_v7}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="w-full mt-3 text-[20px]">
                              {data?.payload?.tech_lang_keys["12"]}
                            </p>
                            <p className="w-full mt-2">
                              σ = {formData?.tech_deviation}
                            </p>
                            <p className="w-full mt-2">
                              n = {formData?.tech_sample}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["13"]} = σ / √n{" "}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["14"]} ={" "}
                              {formData?.tech_deviation} / √
                              {formData?.tech_sample}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["14"]} ={" "}
                              {formData?.tech_deviation} / {result?.tech_sn}
                            </p>
                            <p className="w-full mt-2 text-[1.3em] font-bold px-4 py-3 bg-[#d4edda] text-[#155724] border-l-[6px] border-[#28a745]">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} ={" "}
                                {result?.tech_se}
                              </strong>
                            </p>
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

export default StandardErrorCalculator;

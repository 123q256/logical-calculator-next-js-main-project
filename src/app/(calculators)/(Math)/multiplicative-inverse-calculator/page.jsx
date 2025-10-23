"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useMultiplicativeInverseCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MultiplicativeInverseCalculator = () => {
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
    tech_is_frac: 2,
    tech_s1: "3",
    tech_n1: "2",
    tech_d1: "5",
    tech_dec: "13",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMultiplicativeInverseCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_is_frac) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_is_frac: formData.tech_is_frac,
        tech_s1: formData.tech_s1,
        tech_n1: formData.tech_n1,
        tech_d1: formData.tech_d1,
        tech_dec: formData.tech_dec,
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
      tech_is_frac: 2,
      tech_s1: "3",
      tech_n1: "2",
      tech_d1: "5",
      tech_dec: "13",
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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_is_frac" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_is_frac"
                    id="tech_is_frac"
                    value={formData.tech_is_frac}
                    onChange={handleChange}
                  >
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]} /{" "}
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div
                className={`col-span-12 simple_mixed ${
                  formData?.tech_is_frac === "3" ? "flex items-center" : ""
                }`}
              >
                {formData.tech_is_frac == "3" && (
                  <>
                    <div className="pe-2  mixed">
                      <input
                        type="number"
                        step="any"
                        name="tech_s1"
                        id="tech_s1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="whole number"
                        value={formData.tech_s1}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
                {(formData.tech_is_frac == "2" ||
                  formData.tech_is_frac == "3") && (
                  <>
                    <div className="simple ">
                      <input
                        type="number"
                        step="any"
                        name="tech_n1"
                        id="tech_n1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="numerator"
                        value={formData.tech_n1}
                        onChange={handleChange}
                      />

                      <hr />
                      <input
                        type="number"
                        step="any"
                        name="tech_d1"
                        id="tech_d1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="numerator"
                        value={formData.tech_d1}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
              </div>
              {formData.tech_is_frac == "1" && (
                <>
                  <div className="col-span-12  integer">
                    <input
                      type="number"
                      step="any"
                      name="tech_dec"
                      id="tech_dec"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_dec}
                      onChange={handleChange}
                    />
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 rounded-lg result_calculator space-y-6 result">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 rounded-lg result_calculator space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                          <table className="w-full text-[18px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["6"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_ans}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="col-12 text-[16px]">
                          {formData?.tech_is_frac === 1 ? (
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["7"]}:
                            </p>
                          ) : formData?.tech_is_frac === 2 ? (
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["8"]}:
                            </p>
                          ) : (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["9"]}:
                              </p>
                              <table className="mt-3 text-center mx-auto">
                                <tbody>
                                  <tr>
                                    <td rowSpan="2" className="p-2">
                                      <strong>{formData?.tech_s1}</strong>
                                    </td>
                                    <td className="bdr_btm text-blue p-2">
                                      <strong>{formData?.tech_n1}</strong>
                                    </td>
                                    <td rowSpan="2" className="p-2">
                                      <strong>=</strong>
                                    </td>
                                    <td className="bdr_btm p-2">
                                      <strong>{formData?.tech_d1}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="p-2">
                                      <strong>{result?.tech_upr}</strong>
                                    </td>
                                    <td className="text-blue p-2">
                                      <strong>{formData?.tech_d1}</strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          )}

                          <table className="mt-3 text-center mx-auto">
                            <tbody>
                              <tr>
                                <td className="bdr_btm text-blue p-2">
                                  <strong>{result?.tech_upr}</strong>
                                </td>
                                <td rowSpan="2">
                                  <img
                                    className="mx-2"
                                    src="/images/cross-arrow1.png"
                                    height="30"
                                    width="30"
                                    alt="Multiplicative inverse"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                </td>
                                <td className="bdr_btm p-2">
                                  <strong>{result?.tech_btm}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2">
                                  <strong>{result?.tech_btm}</strong>
                                </td>
                                <td className="text-blue p-2">
                                  <strong>{result?.tech_upr}</strong>
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

export default MultiplicativeInverseCalculator;

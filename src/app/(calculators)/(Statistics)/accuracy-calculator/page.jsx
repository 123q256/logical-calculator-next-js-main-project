"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useAccuracyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AccuracyCalculator = () => {
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
    tech_method_unit: "Percent error method",
    tech_observed_value: "40",
    tech_accepted_value: "50",
    tech_true_positive: "100",
    tech_false_negative: "20",
    tech_false_positive: "10",
    tech_true_negative: "40",
    tech_prevalence: "10",
    tech_sensitivity: "20",
    tech_specificity: "10",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAccuracyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_method_unit) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method_unit: formData.tech_method_unit,
        tech_observed_value: formData.tech_observed_value,
        tech_accepted_value: formData.tech_accepted_value,
        tech_true_positive: formData.tech_true_positive,
        tech_false_negative: formData.tech_false_negative,
        tech_false_positive: formData.tech_false_positive,
        tech_true_negative: formData.tech_true_negative,
        tech_prevalence: formData.tech_prevalence,
        tech_sensitivity: formData.tech_sensitivity,
        tech_specificity: formData.tech_specificity,
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
      tech_method_unit: "Percent error method",
      tech_observed_value: "40",
      tech_accepted_value: "50",
      tech_true_positive: "100",
      tech_false_negative: "20",
      tech_false_positive: "10",
      tech_true_negative: "40",
      tech_prevalence: "10",
      tech_sensitivity: "20",
      tech_specificity: "10",
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
  const method = formData?.tech_method_unit;
  const answer = Number(result?.tech_answer).toFixed(4);
  const lang = data?.payload?.tech_lang_keys || [];

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
            <div className="grid grid-cols-12 mt-3  gap-3">
              <div className="col-span-12 ">
                <label htmlFor="tech_method_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method_unit"
                    id="tech_method_unit"
                    value={formData.tech_method_unit}
                    onChange={handleChange}
                  >
                    <option value="Standard method">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="Prevalence method">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="Percent error method">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_method_unit == "Standard method" && (
                <>
                  <div className="col-span-12" id="standard">
                    <div className="grid grid-cols-12 mt-3  gap-3">
                      <div className="col-span-6">
                        <label htmlFor="tech_true_postive" className="label">
                          {data?.payload?.tech_lang_keys["2"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_true_postive"
                            id="tech_true_postive"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_true_postive}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_false_negative" className="label">
                          {data?.payload?.tech_lang_keys["3"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_false_negative"
                            id="tech_false_negative"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_false_negative}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_false_positive" className="label">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_false_positive"
                            id="tech_false_positive"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_false_positive}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_true_negative" className="label">
                          {data?.payload?.tech_lang_keys["5"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_true_negative"
                            id="tech_true_negative"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_true_negative}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_method_unit == "Prevalence method" && (
                <>
                  <div className="col-span-12 " id="prevalence">
                    <div className="grid grid-cols-12 mt-3  gap-3">
                      <div className="col-span-6">
                        <label htmlFor="tech_prevalence" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_prevalence"
                            id="tech_prevalence"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_prevalence}
                            onChange={handleChange}
                          />
                          <span className="text-blue input_unit">%</span>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_sensitivity" className="label">
                          {data?.payload?.tech_lang_keys["7"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_sensitivity"
                            id="tech_sensitivity"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_sensitivity}
                            onChange={handleChange}
                          />
                          <span className="text-blue input_unit">%</span>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_specificity" className="label">
                          {data?.payload?.tech_lang_keys["8"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_specificity"
                            id="tech_specificity"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_specificity}
                            onChange={handleChange}
                          />
                          <span className="text-blue input_unit">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_method_unit == "Percent error method" && (
                <>
                  <div className="col-span-12 " id="percent">
                    <div className="grid grid-cols-12 mt-3  gap-3">
                      <div className="col-span-6">
                        <label htmlFor="tech_observed_value" className="label">
                          {data?.payload?.tech_lang_keys["9"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_observed_value"
                            id="tech_observed_value"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_observed_value}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_accepted_value" className="label">
                          {data?.payload?.tech_lang_keys["10"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_accepted_value"
                            id="tech_accepted_value"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_accepted_value}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
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
                        {/* Main Percentage Display */}
                        <div className="text-center">
                          <p className="text-[18px] font-bold">
                            {method === "Standard method" ||
                            method === "Prevalence method"
                              ? lang[14]
                              : lang[15]}
                          </p>
                          <p className="text-[21px] bg-[#2845F5] px-3 py-2 rounded-lg inline-block my-3">
                            <strong className="text-white">
                              {Number(result?.tech_answer).toFixed(2)}%
                            </strong>
                          </p>
                        </div>

                        {/* Formulas and Explanation */}
                        {method === "Standard method" && (
                          <>
                            <p className="col-12 mt-2 text-[18px]">
                              <strong className="text-blue">{lang[19]}</strong>
                            </p>
                            <p className="col-12 mt-2">{lang[17]}.</p>
                            <p className="col-12 mt-2">
                              {lang[14]} = (TP + TN) / (TP + TN + FP + FN)
                            </p>
                            <p className="col-12 mt-2">
                              {lang[14]} = ({formData?.tech_true_postive} +{" "}
                              {formData?.tech_true_negative}) / (
                              {formData?.tech_true_postive} +{" "}
                              {formData?.tech_true_negative} +{" "}
                              {formData?.tech_false_positive} +{" "}
                              {formData?.tech_false_negative})
                            </p>
                            <p className="col-12 mt-2">
                              {lang[14]} = {answer}
                            </p>
                          </>
                        )}

                        {method === "Prevalence method" && (
                          <>
                            <p className="col-12 mt-2 text-[18px]">
                              <strong className="text-blue">{lang[19]}</strong>
                            </p>
                            <p className="col-12 mt-2">{lang[17]}.</p>
                            <p className="col-12 mt-2">
                              {lang[14]} = (({lang[7]}) * ({lang[6]})) + ((
                              {lang[8]}) * (1 - {lang[6]}))
                            </p>
                            <p className="col-12 mt-2">
                              {lang[14]} = ({formData?.tech_sensitivity} *{" "}
                              {formData?.tech_prevalence}) + (
                              {formData?.tech_specificity} * (1 -{" "}
                              {formData?.tech_prevalence}))
                            </p>
                            <p className="col-12 mt-2">
                              {lang[14]} = {answer}
                            </p>
                          </>
                        )}

                        {method !== "Standard method" &&
                          method !== "Prevalence method" && (
                            <>
                              <p className="col-12 mt-2 text-[18px]">
                                <strong>{lang[19]}</strong>
                              </p>
                              <p className="col-12 mt-2">{lang[18]}.</p>
                              <p className="col-12 mt-2">
                                {lang[15]} = (({lang[9]} - {lang[10]}) /{" "}
                                {lang[10]}) * 100
                              </p>
                              <p className="col-12 mt-2">
                                {lang[15]} = (({formData?.tech_observed_value} -{" "}
                                {formData?.tech_accepted_value}) /{" "}
                                {formData?.tech_accepted_value}) * 100
                              </p>
                              <p className="col-12 mt-2">
                                {lang[15]} = {answer}
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

export default AccuracyCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useRawScoreCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RawScoreCalculator = () => {
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
    tech_type: "first", //  first  second
    tech_mean: 10,
    tech_standard_daviation: 20,
    tech_z_score: 30,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRawScoreCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_type ||
      !formData.tech_mean ||
      !formData.tech_standard_daviation ||
      !formData.tech_z_score
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_mean: formData.tech_mean,
        tech_standard_daviation: formData.tech_standard_daviation,
        tech_z_score: formData.tech_z_score,
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
      tech_type: "first", //  first  second
      tech_mean: 10,
      tech_standard_daviation: 20,
      tech_z_score: 30,
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
            <div className="col-12 px-2 mb-3 mt-0 mt-lg-2 text-center d-flex align-items-center justify-content-center">
              <div className="flex items-center">
                <label className="pe-2" htmlFor="first">
                  <input
                    type="radio"
                    name="tech_type"
                    value="first"
                    id="first"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_type === "first"}
                  />
                  <span>{data?.payload?.tech_lang_keys["1"]}</span>
                </label>

                <label className="pe-2" htmlFor="second">
                  <input
                    type="radio"
                    name="tech_type"
                    value="second"
                    id="second"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_type === "second"}
                  />
                  <span>{data?.payload?.tech_lang_keys["2"]}</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-12  gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_mean" className="label">
                  {formData.tech_type == "second" ? (
                    <>
                      {data?.payload?.tech_lang_keys["13"]} (<span>X</span>)
                    </>
                  ) : (
                    <span className="population text-blue">
                      {data?.payload?.tech_lang_keys["12"]}(μ)
                    </span>
                  )}
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
                <label htmlFor="tech_standard_daviation" className="label">
                  {formData.tech_type == "second" ? (
                    <>
                      {data?.payload?.tech_lang_keys["4"]} <span>(s)</span>
                    </>
                  ) : (
                    <span className="population text-blue">
                      {data?.payload?.tech_lang_keys["4"]}(σ)
                    </span>
                  )}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_standard_daviation"
                    id="tech_standard_daviation"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_standard_daviation}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_z_score" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_z_score"
                    id="tech_z_score"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_z_score}
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="text-center">
                          <p className="font-s-20">
                            <strong>
                              {data?.payload?.tech_lang_keys["6"]}
                            </strong>
                          </p>
                          <p className="font-s-32 px-3 py-2 d-inline-block my-3">
                            <strong className="bg-[#2845F5] text-white rounded-lg p-4 text-[30px] px-3 py-2">
                              {result?.tech_res}
                            </strong>
                          </p>
                        </div>

                        <p className="col-12 mt-3 font-s-20 text-blue">
                          {data?.payload?.tech_lang_keys[7]}
                        </p>

                        <p className="col-12 mt-2">
                          <b>{data?.payload?.tech_lang_keys[8]}</b>
                        </p>

                        {result?.tech_type === "first" && (
                          <>
                            <p className="col-12 mt-2">μ = Population Mean</p>
                            <p className="col-12 mt-2">z = Z Score</p>
                            <p className="col-12 mt-2">
                              σ = Standard Deviation
                            </p>
                            <p className="col-12 mt-2">
                              <strong>Inputs</strong>
                            </p>
                          </>
                        )}

                        {result?.tech_type === "second" && (
                          <>
                            <p className="col-12 mt-2">
                              <span style={{ borderTop: "1px solid" }}>x</span>{" "}
                              = Sample Mean
                            </p>
                            <p className="col-12 mt-2">z = Z Score</p>
                            <p className="col-12 mt-2">
                              s = Standard Deviation
                            </p>
                            <p className="col-12 mt-2">
                              <strong>Inputs</strong>
                            </p>
                            <p className="col-12 mt-2">
                              <span style={{ borderTop: "1px solid" }}>x</span>{" "}
                              = {result?.tech_mean}
                            </p>
                          </>
                        )}

                        {result?.tech_type === "first" && (
                          <p className="col-12 mt-2">μ = {result?.tech_mean}</p>
                        )}

                        <p className="col-12 mt-2">
                          z = {result?.tech_z_score}
                        </p>

                        {result?.tech_type === "first" && (
                          <p className="col-12 mt-2">
                            σ = {result?.tech_standard_daviation}
                          </p>
                        )}
                        {result?.tech_type === "second" && (
                          <p className="col-12 mt-2">
                            s = {result?.tech_standard_daviation}
                          </p>
                        )}

                        <p className="col-12 mt-2">
                          <b>{data?.payload?.tech_lang_keys[14]}</b>
                        </p>

                        {result?.tech_type === "first" && (
                          <p className="col-12 mt-2">X = μ + z(σ)</p>
                        )}
                        {result?.tech_type === "second" && (
                          <p className="col-12 mt-2">
                            X ={" "}
                            <span style={{ borderTop: "1px solid" }}>x</span> +
                            zs
                          </p>
                        )}

                        <p className="col-12 mt-2">
                          <b>{data?.payload?.tech_lang_keys[15]}</b>
                        </p>

                        <p className="col-12 mt-2">
                          X = {result?.tech_mean} + ({result?.tech_z_score})(
                          {result?.tech_standard_daviation})
                        </p>
                        <p className="col-12 mt-2">
                          X = {result?.tech_mean} +{" "}
                          {result?.tech_z_score *
                            result?.tech_standard_daviation}
                        </p>
                        <p className="col-12 mt-2">
                          <strong>X = {result?.tech_res}</strong>
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

export default RawScoreCalculator;

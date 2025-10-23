"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useZScoreToPercentileMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ZscoreToPercentileCalculator = () => {
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
    tech_z_score: "0.3",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useZScoreToPercentileMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_z_score) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
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
      tech_z_score: "17",
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

  const resVal = Number(result?.tech_res_val);
  const zScore = Number(result?.tech_z_score);
  const percentile = (resVal * 100).toFixed(2);
  const percentileInt = (resVal * 100).toFixed(0);

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
            <div className="grid grid-cols-1    gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_z_score" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (-5 to 5):
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
                    min="-5"
                    max="5"
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
                          <p className="text-[20px]">
                            <strong>
                              {percentileInt}-th{" "}
                              {data?.payload?.tech_lang_keys[2]}
                            </strong>
                          </p>
                          <p className="text-[32px] px-3 py-2 rounded-lg d-inline-block my-3">
                            <strong className="bg-[#2845F5] text-white p-4 rounded-lg">
                              {percentile}%
                            </strong>
                          </p>
                        </div>

                        <p className="col-12 mt-3 text-[20px] text-blue">
                          {data?.payload?.tech_lang_keys[3]}:
                        </p>

                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[4]}{" "}
                          <span>Z = {zScore.toFixed(2)}</span>
                        </p>

                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[5]} (Z &lt;{" "}
                          {zScore.toFixed(4)})
                          <br />
                          <br />
                          Pr (Z &lt; {zScore.toFixed(4)}) = {resVal.toFixed(2)}
                        </p>

                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[6]}:
                          <br />
                          <br />
                          100 × Pr (Z &gt; {zScore.toFixed(4)}) = 100 ×{" "}
                          {resVal.toFixed(2)} = {percentile}%
                        </p>

                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[7]}:
                          <br />
                          <br />
                          {zScore.toFixed(2)} is the {percentileInt}-th{" "}
                          {data?.payload?.tech_lang_keys[2]}
                        </p>

                        <p className="col-12 mt-3 text-[20px] text-center">
                          {data?.payload?.tech_lang_keys[8]}
                        </p>

                        <p className="col-12 mt-2">
                          The {percentileInt}-th{" "}
                          {data?.payload?.tech_lang_keys[2]}{" "}
                          {data?.payload?.tech_lang_keys[9]} z ={" "}
                          {zScore.toFixed(2)}
                        </p>

                        <div className="col-12 mt-2">
                          <img
                            src={`/images/z_score/${result?.tech_img}`}
                            alt="Z-Score to Percentile Graph"
                            width="100%"
                          />
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

export default ZscoreToPercentileCalculator;

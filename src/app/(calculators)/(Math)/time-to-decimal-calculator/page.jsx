"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTimeToDecimalCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TimeToDecimalCalculator = () => {
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
    tech_hh: "2",
    tech_mm: "13",
    tech_ss: "21",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTimeToDecimalCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_hh) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_hh: formData.tech_hh,
        tech_mm: formData.tech_mm,
        tech_ss: formData.tech_ss,
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
      tech_hh: "2",
      tech_mm: "13",
      tech_ss: "21",
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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-4">
                    <label htmlFor="tech_hh" className="label">
                      HH:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_hh"
                        id="tech_hh"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_hh}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <label htmlFor="tech_mm" className="label">
                      MM:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_mm"
                        id="tech_mm"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_mm}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <label htmlFor="tech_ss" className="label">
                      SS:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_ss"
                        id="tech_ss"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_ss}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
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
                        {/* Table for Time Results */}
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b w-[60%]">
                                  <strong>Time in Hours</strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_hours}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-[60%]">
                                  <strong>Time in Minutes</strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_mins}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-[60%]">
                                  <strong>Time in Seconds</strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_secs}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Detailed Explanation */}
                        <div className="w-full text-[16px] mt-2 overflow-auto">
                          <p className="mt-2">
                            <strong>{data?.payload?.tech_lang_keys[5]}</strong>
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[6]}:{" "}
                            {`${result?.tech_hour}:${result?.tech_min}:${result?.tech_sec}`}{" "}
                            (
                            {`${result?.tech_hour} ${data?.payload?.tech_lang_keys[2]} ${result?.tech_min} ${data?.payload?.tech_lang_keys[3]} ${result?.tech_sec} ${data?.payload?.tech_lang_keys[4]}`}
                            )
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[7]}
                          </p>

                          <p className="mt-2">
                            {result?.tech_hour}hr + ({result?.tech_min}min ×
                            <span className="quadratic_fraction">
                              <span className="num">1hr</span>
                              <span>60min</span>
                            </span>
                            ) + ({result?.tech_sec}sec ×
                            <span className="quadratic_fraction">
                              <span className="num">1hr</span>
                              <span>3600sec</span>
                            </span>
                            )
                          </p>

                          <p className="mt-2">
                            = {result?.tech_hour}hr +{" "}
                            {Number(result?.tech_min / 60).toFixed(3)}hr +{" "}
                            {Number(result?.tech_sec / 3600).toFixed(3)}hr
                          </p>
                          <p className="mt-2">= {result?.tech_hours}hr</p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[8]}
                          </p>

                          <p className="mt-2">
                            ({result?.tech_hour}hr × 60min) + {result?.tech_min}
                            min + ({result?.tech_sec}sec ×
                            <span className="quadratic_fraction">
                              <span className="num">1min</span>
                              <span>60sec</span>
                            </span>
                            )
                          </p>

                          <p className="mt-2">
                            = {result?.tech_hour * 60}min + {result?.tech_min}
                            min + {Number(result?.tech_sec / 60).toFixed(3)}min
                          </p>
                          <p className="mt-2">= {result?.tech_mins}min</p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[9]}
                          </p>
                          <p className="mt-2">
                            ({result?.tech_hour}hr × 3600sec) + (
                            {result?.tech_min}min × 60sec) + {result?.tech_sec}
                            sec
                          </p>
                          <p className="mt-2">
                            = {result?.tech_hour * 3600}sec +{" "}
                            {result?.tech_min * 60}sec + {result?.tech_sec}sec
                          </p>
                          <p className="mt-2">= {result?.tech_secs}sec</p>
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

export default TimeToDecimalCalculator;

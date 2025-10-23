"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useMapCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MapCalculator = () => {
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

  console.log(data);

  const [formData, setFormData] = useState({
    tech_sbp: "120",
    tech_dbp: "80",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMapCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_sbp || !formData.tech_dbp) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_sbp: formData.tech_sbp,
        tech_dbp: formData.tech_dbp,
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
      tech_sbp: "120",
      tech_dbp: "80",
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

          <div className="col-12 lg:w-[70%] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
              <div className="w-full">
                <label htmlFor="tech_sbp" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (
                  {data?.payload?.tech_lang_keys["10"]} 100-120):
                </label>
                <div className="w-full py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_sbp"
                    id="tech_sbp"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_sbp}
                    onChange={handleChange}
                  />
                  <span className="input_unit">mmHg</span>
                </div>
              </div>
              <div className="w-full">
                <label htmlFor="tech_dbp" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (
                  {data?.payload?.tech_lang_keys["10"]} 60-80):
                </label>
                <div className="w-full py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_dbp"
                    id="tech_dbp"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_dbp}
                    onChange={handleChange}
                  />
                  <span className="input_unit">mmHg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full  p-3 rounded-lg mt-3 result">
                      <div className="w-full">
                        <div className="w-full lg:w-8/12">
                          <div className="flex flex-wrap justify-between">
                            <div className="mt-2 sm:mt-0">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["3"]}
                                </strong>
                              </p>
                              <p className="lg:text-lg md:text-lg text-sm">
                                <strong className="text-[#119154] text-2xl">
                                  {Number(result?.tech_map).toFixed(2)}
                                </strong>
                                <span className="text-[#119154] text-lg">
                                  (mmHg)
                                </span>
                              </p>
                            </div>
                            <div className="border-r border-gray-300 px-3 hidden sm:block">
                              &nbsp;
                            </div>
                            <div className="mt-2 sm:mt-0">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["4"]}
                                </strong>
                              </p>
                              <p className="lg:text-lg md:text-lg text-sm">
                                <strong className="text-[#119154] text-2xl">
                                  {Number(result?.tech_pr).toFixed(2)}
                                </strong>
                                <span className="text-[#119154] text-lg">
                                  (mmHg)
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Checking the tech_map value */}
                        {result?.tech_map < 65 && (
                          <div>
                            <p className="text-lg mt-2">
                              <strong className="text-[#119154]">
                                {data?.payload?.tech_lang_keys["5"]}:-
                              </strong>
                            </p>
                            <p className="lg:text-lg md:text-lg text-sm">
                              <strong>
                                {data?.payload?.tech_lang_keys["6"]} {">="} 65
                                mmHg.
                              </strong>
                            </p>
                          </div>
                        )}

                        {/* Checking the tech_dbp value */}
                        {result?.tech_dbp >= 80 && (
                          <div>
                            <p className="text-lg mt-2">
                              <strong className="text-[#119154]">
                                {data?.payload?.tech_lang_keys["5"]}:-
                              </strong>
                            </p>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]}.{" "}
                                {data?.payload?.tech_lang_keys["8"]}.
                              </strong>
                            </p>
                          </div>
                        )}

                        {/* Checking the tech_sbp value */}
                        {result?.tech_sbp >= 120 && result?.tech_sbp <= 129 && (
                          <div>
                            <p className="text-lg mt-2">
                              <strong className="text-[#119154]">
                                {data?.payload?.tech_lang_keys["5"]}:-
                              </strong>
                            </p>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["9"]}.{" "}
                                {data?.payload?.tech_lang_keys["8"]}.
                              </strong>
                            </p>
                          </div>
                        )}

                        {/* Checking if tech_sbp is greater than 129 */}
                        {result?.tech_sbp > 129 && (
                          <div>
                            <p className="text-lg mt-2">
                              <strong className="text-[#119154]">
                                {data?.payload?.tech_lang_keys["5"]}:-
                              </strong>
                            </p>
                            <p className="lg:text-lg md:text-lg text-sm">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]}.{" "}
                                {data?.payload?.tech_lang_keys["8"]}.
                              </strong>
                            </p>
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

export default MapCalculator;

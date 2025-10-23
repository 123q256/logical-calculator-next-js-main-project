"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePercentageIncreaseCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PercentageIncreaseCalculator = () => {
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
    tech_start: "21",
    tech_final: "25",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePercentageIncreaseCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_start || !formData.tech_final) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_start: formData.tech_start,
        tech_final: formData.tech_final,
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
      tech_start: "21",
      tech_final: "25",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_start" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_start"
                    id="tech_start"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_start}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_final" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_final"
                    id="tech_final"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_final}
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
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["3"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_ans).toFixed(5)} %
                                </td>
                              </tr>

                              {result?.tech_ans < 0 && (
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["4"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Math.abs(Number(result?.tech_ans)).toFixed(
                                      5
                                    )}{" "}
                                    %
                                  </td>
                                </tr>
                              )}

                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_dif).toFixed(5)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full">
                          <p className="mt-2">
                            <strong className="text-[20px]">
                              {data?.payload?.tech_lang_keys["6"]}:
                            </strong>
                          </p>

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["1"]} ={" "}
                            {formData?.tech_start}
                          </p>
                          <p className="my-3">
                            {data?.payload?.tech_lang_keys["2"]} ={" "}
                            {formData?.tech_final}
                          </p>

                          <p>
                            <span className="fraction">
                              <span className="num">
                                {data?.payload?.tech_lang_keys["8"]} -{" "}
                                {data?.payload?.tech_lang_keys["7"]}
                              </span>
                              <span className="den">
                                |{data?.payload?.tech_lang_keys["7"]}|
                              </span>
                            </span>{" "}
                            × 100
                          </p>

                          <p>
                            <span className="fraction">
                              <span className="num">
                                {formData?.tech_final} - {formData?.tech_start}
                              </span>
                              <span className="den">
                                |{formData?.tech_start}|
                              </span>
                            </span>{" "}
                            × 100
                          </p>

                          <p>
                            <span className="fraction">
                              <span className="num">{result?.tech_dif}</span>
                              <span className="den">
                                {formData?.tech_start}
                              </span>
                            </span>{" "}
                            × 100
                          </p>

                          <p className="mt-3">{result?.tech_ans1} × 100</p>

                          <p className="mt-3">
                            <span>{data?.payload?.tech_lang_keys["3"]} = </span>
                            <span>{Number(result?.tech_ans).toFixed(5)} %</span>
                          </p>

                          {result?.tech_ans < 0 && (
                            <p className="mt-3">
                              <span>
                                {data?.payload?.tech_lang_keys["4"]} ={" "}
                              </span>
                              <span>
                                {Math.abs(Number(result?.tech_ans)).toFixed(5)}{" "}
                                %
                              </span>
                            </p>
                          )}

                          <p className="mt-3">
                            <span>{data?.payload?.tech_lang_keys["5"]} = </span>
                            <span>{Number(result?.tech_dif).toFixed(5)}</span>
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

export default PercentageIncreaseCalculator;

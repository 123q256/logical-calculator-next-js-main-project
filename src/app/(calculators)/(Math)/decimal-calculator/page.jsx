"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDecimalCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DecimalCalculator = () => {
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
    tech_method: "1", //  1 2 3 4 5 6 7
    tech_rounding: "1",
    tech_a: "8",
    tech_b: "7.65",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDecimalCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method: formData.tech_method,
        tech_rounding: formData.tech_rounding,
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
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
      tech_method: "1", //  1 2 3 4 5 6 7
      tech_rounding: "1",
      tech_a: "8",
      tech_b: "7.65",
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

  const renderLogSteps = () => {
    const [intPart, decimalPart] = (formData?.tech_b || "").split(".") || [];
    if (decimalPart) {
      const divideB = 10 ** decimalPart.length;
      const newB = parseFloat(formData.tech_b) * divideB;
      return (
        <>
          <p className="mt-2">
            = log<sub className="font-s-14">{formData.tech_a}</sub>
            {formData.tech_b}
          </p>
          <p className="mt-2">
            = log<sub className="font-s-14">{formData.tech_a}</sub>({newB}/
            {divideB})
          </p>
          <p className="mt-2">
            = log<sub className="font-s-14">{formData.tech_a}</sub>({newB}) -
            log<sub className="font-s-14">{formData.tech_a}</sub>({divideB})
          </p>
          <p className="mt-2">= {result?.tech_ans}</p>
        </>
      );
    } else {
      return (
        <p className="mt-2">
          = log<sub className="font-s-14">{formData.tech_a}</sub>
          {formData.tech_b} = {result?.tech_ans}
        </p>
      );
    }
  };

  // Placeholder: You can add similar breakdowns for methods 5 and 6 if needed

  const roundingLabels = {
    "-3": "Thousands",
    "-2": "Hundreds",
    "-1": "Tens",
    0: "Ones",
    1: "1 Decimal",
    2: "2 Decimal",
    3: "3 Decimal",
    4: "4 Decimal",
    5: "5 Decimal",
    6: "6 Decimal",
  };

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
          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <p className="col-span-12 text-center my-3 text-[18px]">
                <strong id="changeText">
                  {formData?.tech_method === "2" && "a - b = ?"}
                  {formData?.tech_method === "3" && "a × b = ?"}
                  {formData?.tech_method === "4" && "a ÷ b = ?"}
                  {formData?.tech_method === "5" && (
                    <>
                      a<sup className="font-s-14">b</sup> = ?
                    </>
                  )}
                  {formData?.tech_method === "6" && (
                    <>
                      <sup className="font-s-14">a</sup>√b = ?
                    </>
                  )}
                  {formData?.tech_method === "7" && (
                    <>
                      log<sub>a</sub>b = ?
                    </>
                  )}
                  {!["2", "3", "4", "5", "6", "7"].includes(
                    formData?.tech_method
                  ) && "a + b = ?"}
                </strong>
              </p>
              <div className="col-span-12">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method"
                    id="tech_method"
                    value={formData.tech_method}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]} (+)
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]} (-)
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]} (×)
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["5"]} (÷)
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["7"]} (√)
                    </option>
                    <option value="7">
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_a" className="label">
                  a
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_a"
                    id="tech_a"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_a}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_b" className="label">
                  b
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_b"
                    id="tech_b"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_b}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_method" className="label">
                  Rounding to:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_rounding"
                    id="tech_rounding"
                    value={formData.tech_rounding}
                    onChange={handleChange}
                  >
                    <option value="not">Do Not Round</option>
                    <option value="-3">Thousands</option>
                    <option value="-2">Hundreds</option>
                    <option value="-1">Tens</option>
                    <option value="0">Ones</option>
                    <option value="1">1 decimal</option>
                    <option value="2">2 decimals</option>
                    <option value="3">3 decimals</option>
                    <option value="4">4 decimals</option>
                    <option value="5">5 decimals</option>
                    <option value="6">6 decimals</option>
                  </select>
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
                                <td className="py-2 border-b w-[60%]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[9]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_ans).toFixed(5)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2">
                            <strong>{data?.payload?.tech_lang_keys[12]}</strong>
                          </p>

                          {formData?.tech_method > 4 && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[11]}
                                </strong>
                              </p>
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_res,
                                }}
                              ></p>
                            </>
                          )}

                          {formData?.tech_method === "7" && renderLogSteps()}

                          {formData?.tech_method <= 4 &&
                            formData?.tech_method !== "7" && (
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_res,
                                }}
                              ></p>
                            )}

                          {result?.tech_round_ans && (
                            <>
                              <p className="mt-2">
                                Rounding to{" "}
                                {roundingLabels[formData?.tech_rounding]} Place
                              </p>
                              <p className="mt-2">= {result?.tech_round_ans}</p>
                            </>
                          )}
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

export default DecimalCalculator;

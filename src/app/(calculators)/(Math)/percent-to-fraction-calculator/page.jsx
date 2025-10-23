"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import {
  useGetSingleCalculatorDetailsMutation,
  usePercentToFractionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PercentToFractionCalculator = () => {
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
    tech_percent: 3,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePercentToFractionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_percent) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_percent: formData.tech_percent,
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
      tech_percent: 3,
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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_percent" className="label">
                  {data?.payload?.tech_lang_keys["1"]} %
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_percent"
                    id="tech_percent"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_percent}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
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
                        <div className="w-full md:w-[80%] lg:w-[80%] mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="55%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["ans"]}{" "}
                                    {formData?.tech_percent}% =
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <InlineMath
                                    math={`\\dfrac{${result?.tech_uper}}{${result?.tech_btm}}`}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["ex"]}
                            </strong>
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["step"]} # 1 ={" "}
                            <InlineMath
                              math={`\\dfrac{${formData?.tech_percent}}{100}`}
                            />{" "}
                            = {formData?.tech_percent / 100}
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["step"]} # 2 ={" "}
                            <InlineMath
                              math={`\\dfrac{${result?.tech_upr}}{${result?.tech_div}}`}
                            />
                          </p>

                          {result?.tech_g !== 1 && (
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["step"]} # 3 ={" "}
                              <InlineMath
                                math={`\\dfrac{${result?.tech_upr} \\div ${result?.tech_g}}{${result?.tech_div} \\div ${result?.tech_g}}`}
                              />
                            </p>
                          )}

                          {result?.tech_btm === "1" ? (
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["an"]} ={" "}
                              {result?.tech_uper}
                            </p>
                          ) : (
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["an"]} ={" "}
                              <InlineMath
                                math={`\\dfrac{${result?.tech_uper}}{${result?.tech_btm}}`}
                              />
                            </p>
                          )}

                          {result?.tech_uper > result?.tech_btm &&
                            result?.tech_btm !== "1" && (
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["or"]} ={" "}
                                {Math.floor(
                                  result?.tech_uper / result?.tech_btm
                                )}{" "}
                                <InlineMath
                                  math={`\\dfrac{${
                                    result?.tech_uper % result?.tech_btm
                                  }}{${result?.tech_btm}}`}
                                />
                              </p>
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

export default PercentToFractionCalculator;

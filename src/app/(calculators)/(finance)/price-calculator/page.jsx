"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePriceCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PriceCalculator = () => {
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
    tech_price: 500,
    tech_gross: 70,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePriceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_price || !formData.tech_gross) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_price: formData.tech_price,
        tech_gross: formData.tech_gross,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_price: 500,
      tech_gross: 70,
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_price" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (C):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_price"
                    id="tech_price"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_price}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_gross" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (G):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    max="100"
                    name="tech_gross"
                    id="tech_gross"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_gross}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%]  mt-2">
                        <table className="w-full text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[3]} (R){" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {currency.symbol} {result?.tech_revenue}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[4]} (P)
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {currency.symbol} {result?.tech_gross_profit}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[5]} (M)
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {result?.tech_mark_up}%
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-[16px] mt-2">
                        <p className="mt-2">
                          <strong>{data?.payload?.tech_lang_keys[7]}</strong>
                        </p>
                        <p className="mt-2">
                          {" "}
                          {data?.payload?.tech_lang_keys[3]} ={" "}
                          {data?.payload?.tech_lang_keys[1]} / 1 -{" "}
                          {data?.payload?.tech_lang_keys[2]}{" "}
                        </p>
                        <p className="mt-2">
                          {" "}
                          {data?.payload?.tech_lang_keys[3]} ={" "}
                          {formData?.tech_price} / 1 - {formData?.tech_gross}
                          /100{" "}
                        </p>
                        <p className="mt-2">
                          {" "}
                          {data?.payload?.tech_lang_keys[3]} ={" "}
                          {result?.tech_revenue}
                        </p>
                        <p className="mt-2">
                          {" "}
                          {data?.payload?.tech_lang_keys[4]} ={" "}
                          {data?.payload?.tech_lang_keys[3]} ×{" "}
                          {data?.payload?.tech_lang_keys[2]}{" "}
                        </p>
                        <p className="mt-2">
                          {" "}
                          {data?.payload?.tech_lang_keys[4]} ={" "}
                          {result?.tech_revenue} × {formData?.tech_gross / 100}{" "}
                        </p>
                        <p className="mt-2">
                          {" "}
                          {data?.payload?.tech_lang_keys[4]} ={" "}
                          {result?.tech_gross_profit}{" "}
                        </p>
                        <p className="mt-2">
                          {" "}
                          {data?.payload?.tech_lang_keys[5]} ={" "}
                          {data?.payload?.tech_lang_keys[4]} /{" "}
                          {data?.payload?.tech_lang_keys[1]} × 100
                        </p>
                        <p className="mt-2">
                          {" "}
                          {data?.payload?.tech_lang_keys[5]} ={" "}
                          {result?.tech_gross_profit} / {formData?.tech_price} ×
                          100{" "}
                        </p>
                        <p className="mt-2">
                          {" "}
                          {data?.payload?.tech_lang_keys[5]} ={" "}
                          {result?.tech_mark_up}{" "}
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

export default PriceCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useCostPerMileDrivingCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CostPerMileCalculator = () => {
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
    tech_cost_of_gas: "73",
    tech_miles_per_gallon: "74",
    tech_car_value: "45",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCostPerMileDrivingCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_cost_of_gas ||
      !formData.tech_miles_per_gallon ||
      !formData.tech_car_value
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cost_of_gas: formData.tech_cost_of_gas,
        tech_miles_per_gallon: formData.tech_miles_per_gallon,
        tech_car_value: formData.tech_car_value,
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
      tech_cost_of_gas: "73",
      tech_miles_per_gallon: "74",
      tech_car_value: "45",
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

          <div className="lg:w-[50%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_cost_of_gas" className="label">
                  {data?.payload?.tech_lang_keys["1"]} ({currency.symbol}{" "}
                  {data?.payload?.tech_lang_keys["1"]}):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_cost_of_gas"
                    id="tech_cost_of_gas"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_cost_of_gas}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 ">
                <label htmlFor="tech_miles_per_gallon" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_miles_per_gallon"
                    id="tech_miles_per_gallon"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_miles_per_gallon}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_car_value" className="label">
                  {data?.payload?.tech_lang_keys["4"]} ({currency.symbol}):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_car_value"
                    id="tech_car_value"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_car_value}
                    onChange={handleChange}
                  />
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="col-span-12 mt-3">
                      <div className="w-full my-2">
                        <div className="text-center">
                          <p className="text-[20px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["5"]}
                            </strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong className="text-blue">
                                {Number(result?.tech_answer).toFixed(3)}
                                <span className="text-[20px]">
                                  {" "}
                                  {currency.symbol}
                                </span>
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div className="col-12">
                          <p className="text-[20px]">
                            <strong>{data?.payload?.tech_lang_keys[6]}</strong>
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys[7]}
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys[8]}.
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys[5]} ={" "}
                            {data?.payload?.tech_lang_keys[1]}/{" "}
                            {data?.payload?.tech_lang_keys[3]} + (
                            {data?.payload?.tech_lang_keys[4]} /25000*0.03) +
                            0.05{" "}
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys[9]}
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys[5]} ={" "}
                            {formData.tech_cost_of_gas}/{" "}
                            {formData.tech_miles_per_gallon}+(
                            {formData.tech_car_value}/25000*0.03) + 0.05
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys[5]} ={" "}
                            {formData.tech_cost_of_gas}/{" "}
                            {formData.tech_miles_per_gallon}+
                            {result?.tech_car_value * 0.03 + 0.05}
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys[5]} ={" "}
                            {formData.tech_cost_of_gas}/{" "}
                            {formData.tech_miles_per_gallon}+
                            {result?.tech_total_car_value + 0.05}
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys[5]} ={" "}
                            {Number(result?.tech_total_cost_mile).toFixed(3)} +
                            {result?.tech_total_car_value} + 0.05
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys[5]} ={" "}
                            {Number(result?.tech_answer).toFixed(3)}{" "}
                            {currency.symbol}
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

export default CostPerMileCalculator;

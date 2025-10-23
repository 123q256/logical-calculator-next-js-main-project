"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useMaxHeartRateCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MaxHeartRateCalculator = () => {
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
    formula: "1",
    age: "19",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMaxHeartRateCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.formula || !formData.age) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        formula: formData.formula,
        age: formData.age,
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
      formula: "1",
      age: "19",
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
          <div className="lg:w-[40%] md:w-[40%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="w-full py-2 relative">
                  <label htmlFor="formula" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <div className="">
                    <select
                      className="input"
                      aria-label="select"
                      name="formula"
                      id="formula"
                      value={formData.formula}
                      onChange={handleChange}
                    >
                      <option value="1">
                        {data?.payload?.tech_lang_keys["2"]}
                      </option>
                      <option value="2">
                        {data?.payload?.tech_lang_keys["3"]}
                      </option>
                      <option value="3">
                        {data?.payload?.tech_lang_keys["4"]}
                      </option>
                      <option value="4">
                        {data?.payload?.tech_lang_keys["5"]}
                      </option>
                      <option value="5">
                        {data?.payload?.tech_lang_keys["6"]}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-span-12  text-center">
                {formData?.formula === "1" ? (
                  <div>
                    <strong>
                      HR<sub>{data?.payload?.tech_lang_keys[7]}</sub> = 205.8 -
                      (0.685 × {data?.payload?.tech_lang_keys[8]})
                    </strong>
                  </div>
                ) : formData?.formula === "2" ? (
                  <div>
                    <strong>
                      HR<sub>{data?.payload?.tech_lang_keys[7]}</sub> = 220 -{" "}
                      {data?.payload?.tech_lang_keys[8]}
                    </strong>
                  </div>
                ) : formData?.formula === "3" ? (
                  <div>
                    <strong>
                      HR<sub>{data?.payload?.tech_lang_keys[7]}</sub> = 211 -
                      (0.64 × {data?.payload?.tech_lang_keys[8]})
                    </strong>
                  </div>
                ) : formData?.formula === "4" ? (
                  <div>
                    <strong>
                      HR<sub>{data?.payload?.tech_lang_keys[7]}</sub> = 192 -
                      (0.007 × {data?.payload?.tech_lang_keys[8]}
                      <sup>2</sup>)
                    </strong>
                  </div>
                ) : formData?.formula === "5" ? (
                  <div>
                    <strong>
                      HR<sub>{data?.payload?.tech_lang_keys[7]}</sub> = 208 -
                      (0.07 × {data?.payload?.tech_lang_keys[8]})
                    </strong>
                  </div>
                ) : null}
              </div>
              <div className="col-span-12">
                <label htmlFor="age" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
                </label>
                <div className="w-full py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="age"
                    id="age"
                    className="input my-2"
                    aria-label="input"
                    value={formData.age}
                    onChange={handleChange}
                  />
                  <span className=" input_unit">years</span>
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
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <p>
                          <strong>{data?.payload?.tech_lang_keys[10]}</strong>
                        </p>
                        <p>
                          <strong className="text-[#119154] text-[32px]">
                            {Number(result?.answer).toFixed(2)}
                          </strong>
                          <span className="text-green-700 text-[18px] ml-1">
                            BPM
                          </span>
                        </p>

                        <p className="my-2">
                          {data?.payload?.tech_lang_keys[11]}.
                        </p>
                        <p>{data?.payload?.tech_lang_keys[12]}.</p>
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

export default MaxHeartRateCalculator;

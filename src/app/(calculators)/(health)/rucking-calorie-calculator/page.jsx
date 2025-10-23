"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useRuckingCalorieCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RuckingCalorieCalculator = () => {
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
    tech_weight: "5",
    tech_time: "19",
    tech_activities: "0.95",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRuckingCalorieCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_weight ||
      !formData.tech_time ||
      !formData.tech_activities
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_weight: formData.tech_weight,
        tech_time: formData.tech_time,
        tech_activities: formData.tech_activities,
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
      tech_weight: "5",
      tech_time: "19",
      tech_activities: "0.95",
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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 px-2">
                <div className="grid grid-cols-12 gap-1">
                  {[
                    {
                      id: "btn1",
                      value: "0.95",
                      label: data?.payload?.tech_lang_keys["2"],
                    },
                    {
                      id: "btn2",
                      value: "3.0",
                      label: data?.payload?.tech_lang_keys["3"],
                    },
                    {
                      id: "btn3",
                      value: "7.8",
                      label: data?.payload?.tech_lang_keys["4"],
                    },
                    {
                      id: "btn4",
                      value: "8.5",
                      label: data?.payload?.tech_lang_keys["5"],
                    },
                    {
                      id: "btn5",
                      value: "8.2",
                      label: data?.payload?.tech_lang_keys["6"],
                    },
                    {
                      id: "btn6",
                      value: "9.0",
                      label: data?.payload?.tech_lang_keys["7"],
                    },
                    {
                      id: "btn7",
                      value: "10.0",
                      label: data?.payload?.tech_lang_keys["8"],
                    },
                    {
                      id: "btn8",
                      value: "10.7",
                      label: data?.payload?.tech_lang_keys["9"],
                    },
                    {
                      id: "btn9",
                      value: "8.0",
                      label: data?.payload?.tech_lang_keys["10"],
                    },
                    {
                      id: "btn10",
                      value: "4.5",
                      label: data?.payload?.tech_lang_keys["11"],
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="col-span-12 md:col-span-6 lg:col-span-6"
                    >
                      <input
                        type="radio"
                        name="tech_activities"
                        className="border mx-2"
                        id={item.id}
                        value={item.value}
                        onChange={handleChange}
                        checked={formData.tech_activities === item.value}
                      />
                      <label htmlFor={item.id} className="text-[12px]">
                        {item.label}:
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["12"]}:
                </label>
                <div className=" py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_weight"
                    id="tech_weight"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_weight}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">lbs</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_time" className="label">
                  {data?.payload?.tech_lang_keys["13"]}:
                </label>
                <div className=" py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_time"
                    id="tech_time"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_time}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">hours</span>
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
                    <div className="w-full mt-3">
                      <div className="w-full text-center">
                        <p>{data?.payload?.tech_lang_keys[14]}</p>
                        <p>
                          <strong className="text-green-700 text-[32px]">
                            {result?.tech_calories}
                          </strong>
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

export default RuckingCalorieCalculator;

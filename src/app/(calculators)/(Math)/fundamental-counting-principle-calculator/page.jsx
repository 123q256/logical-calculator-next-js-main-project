"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useFundamentalCountingPrincipleCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FundamentalCountingPrincipleCalculator = () => {
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

  const ordinalSuffix = (number) => {
    if ([11, 12, 13].includes(number % 100)) return `${number}th`;
    switch (number % 10) {
      case 1:
        return `${number}st`;
      case 2:
        return `${number}nd`;
      case 3:
        return `${number}rd`;
      default:
        return `${number}th`;
    }
  };

  const [formData, setFormData] = useState({
    tech_choices: [45, 15],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFundamentalCountingPrincipleCalculatorMutation();

  const handleChange = (index, value) => {
    const updatedChoices = [...formData.tech_choices];
    updatedChoices[index] = value;
    setFormData((prev) => ({ ...prev, tech_choices: updatedChoices }));
    setResult(null);
    setFormError(null);
  };

  const addChoice = () => {
    setFormData((prev) => ({
      ...prev,
      tech_choices: [...prev.tech_choices, ""],
    }));
  };

  const removeChoice = (index) => {
    const updatedChoices = [...formData.tech_choices];
    updatedChoices.splice(index, 1);
    setFormData((prev) => ({ ...prev, tech_choices: updatedChoices }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_choices) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_choices: formData.tech_choices,
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
      tech_choices: [45, 15],
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              {formData.tech_choices.map((choice, i) => (
                <div className="col-span-12 mb-3" key={i}>
                  <span className="font-s-14 text-blue">
                    Number of choices for the {ordinalSuffix(i + 1)} thing:
                  </span>
                  <div className="w-full flex items-center gap-3">
                    <input
                      type="number"
                      step="any"
                      name={`tech_choices[${i}]`}
                      className="input my-2"
                      placeholder="00"
                      value={choice}
                      onChange={(e) => handleChange(i, e.target.value)}
                    />
                    {formData.tech_choices.length > 1 && (
                      <button
                        type="button"
                        className="text-red-600 cursor-pointer font-bold px-2"
                        onClick={() => removeChoice(i)}
                        title="Remove Row"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="col-span-12 text-end mt-3">
                <button
                  type="button"
                  onClick={addChoice}
                  className="px-3 py-2 mx-1 cursor-pointer bg-[#2845F5] text-white rounded-lg"
                >
                  <span>+</span> {data?.payload?.tech_lang_keys[6] || "Add"}
                </button>
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
                                    {data?.payload?.tech_lang_keys["7"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_answer).toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["9"]}
                            </strong>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["1"]}
                          </p>

                          <p className="mt-2">
                            {result?.tech_choices?.map((val, i) => (
                              <span key={i}>
                                {val}
                                {i < result.tech_choices.length - 1 && " × "}
                              </span>
                            ))}{" "}
                            = {Number(result?.tech_answer).toFixed(2)}
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["5"]}{" "}
                            {result?.tech_choices?.length}{" "}
                            {data?.payload?.tech_lang_keys["6"]}
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

export default FundamentalCountingPrincipleCalculator;

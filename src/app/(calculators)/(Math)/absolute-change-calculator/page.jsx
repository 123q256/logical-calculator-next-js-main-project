"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useAbsoluteChangeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AbsoluteChangeCalculator = () => {
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
    tech_initial: "5",
    tech_final: "19",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateAbsoluteCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAbsoluteChangeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_initial || !formData.tech_final) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateAbsoluteCalculator({
        tech_initial: Number(formData.tech_initial),
        tech_final: Number(formData.tech_final),
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
      tech_initial: "5",
      tech_final: "19",
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

          <div className="lg:w-[40%] md:w-[40%] mx-auto">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 mx-auto relative">
                <label htmlFor="tech_initial" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <input
                  type="number"
                  name="tech_initial"
                  id="tech_initial"
                  step="any"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_initial}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-12 mx-auto relative">
                <label htmlFor="tech_final" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <input
                  type="number"
                  name="tech_final"
                  step="any"
                  id="tech_final"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_final}
                  onChange={handleChange}
                />
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                          <table className="w-full font-s-18">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[3]} is
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Math.round(result?.tech_answer)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px] mt-2">
                          <p>
                            <strong>{data?.payload?.tech_lang_keys[5]}</strong>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[1]} ={" "}
                            {result.tech_initial}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[2]} ={" "}
                            {result.tech_final}
                          </p>
                          <p className="mt-2">
                            <strong>{data?.payload?.tech_lang_keys[4]}</strong>
                          </p>
                          <p className="mt-2">
                            Formula = {data?.payload?.tech_lang_keys[2]} -{" "}
                            {data?.payload?.tech_lang_keys[1]}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[3]} ={" "}
                            {result.tech_final} - {result.tech_initial}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[3]} ={" "}
                            {Math.round(result?.tech_answer)}
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

export default AbsoluteChangeCalculator;

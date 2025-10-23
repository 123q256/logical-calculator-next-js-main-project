"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useHouseAgeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HouseAgeCalculator = () => {
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
    tech_build_date: "2025-05-14",
    tech_structure_type: "stone",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHouseAgeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_build_date || !formData.tech_structure_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_build_date: formData.tech_build_date,
        tech_structure_type: formData.tech_structure_type,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_build_date: "2025-05-14",
      tech_structure_type: "stone",
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_build_date" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="date"
                    name="tech_build_date"
                    id="tech_build_date"
                    className="input mt-2"
                    value={formData.tech_build_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_want" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_want"
                    id="tech_want"
                    value={formData.tech_want}
                    onChange={handleChange}
                  >
                    <option value="concrete">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="cement-bricks">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="wooden">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="stone">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                  </select>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full p-3 rounded-lg mt-3">
                      <div className="my-1 text-center">
                        <p>{data?.payload?.tech_lang_keys[7]}</p>
                        <div className="flex justify-center text-lg my-2">
                          <div className="pr-5">
                            <p>
                              <strong className="text-[#119154] text-[32px]">
                                {result?.tech_years}
                              </strong>
                            </p>
                            <p>{data?.payload?.tech_lang_keys[8]}</p>
                          </div>
                          <div className="pr-5">
                            <p>
                              <strong className="text-[#119154] text-[32px]">
                                {result?.tech_months}
                              </strong>
                            </p>
                            <p>{data?.payload?.tech_lang_keys[9]}</p>
                          </div>
                          <div>
                            <p>
                              <strong className="text-[#119154] text-[32px]">
                                {result?.tech_days}
                              </strong>
                            </p>
                            <p>{data?.payload?.tech_lang_keys[10]}</p>
                          </div>
                        </div>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys[11]}

                          {formData?.tech_structure_type === "concrete" ? (
                            <>
                              {data?.payload?.tech_lang_keys[12]}{" "}
                              <strong>{result?.tech_predicted_age}</strong>{" "}
                              {data?.payload?.tech_lang_keys[16]}
                            </>
                          ) : formData?.tech_structure_type ===
                            "cement-bricks" ? (
                            <>
                              {data?.payload?.tech_lang_keys[13]}{" "}
                              <strong>{result?.tech_predicted_age}</strong>{" "}
                              {data?.payload?.tech_lang_keys[16]}
                            </>
                          ) : formData?.tech_structure_type === "wooden" ? (
                            <>
                              {data?.payload?.tech_lang_keys[14]}{" "}
                              <strong>{result?.tech_predicted_age}</strong>{" "}
                              {data?.payload?.tech_lang_keys[16]}
                            </>
                          ) : formData?.tech_structure_type === "stone" ? (
                            <>
                              {data?.payload?.tech_lang_keys[15]}{" "}
                              <strong>{result?.tech_predicted_age}</strong>{" "}
                              {data?.payload?.tech_lang_keys[16]}
                            </>
                          ) : null}
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

export default HouseAgeCalculator;

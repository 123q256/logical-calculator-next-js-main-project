"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useUnemploymentRateCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const UnemploymentRateCalculator = () => {
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
    tech_employed_people: 40,
    tech_unemployed_people: 40,
    tech_adult_population: 12,
    tech_calculate: "1", //  1  2
    tech_labor_force: "1.44",
    tech_unemployment_rate: "50",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useUnemploymentRateCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_calculate == 1) {
      if (
        !formData.tech_calculate ||
        !formData.tech_employed_people ||
        !formData.tech_unemployed_people
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_calculate ||
        !formData.tech_labor_force ||
        !formData.tech_unemployment_rate
      ) {
        setFormError("Please fill in field");
        return;
      }
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_employed_people: formData.tech_employed_people,
        tech_unemployed_people: formData.tech_unemployed_people,
        tech_adult_population: formData.tech_adult_population,
        tech_calculate: formData.tech_calculate,
        tech_labor_force: formData.tech_labor_force,
        tech_unemployment_rate: formData.tech_unemployment_rate,
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
      tech_employed_people: 40,
      tech_unemployed_people: 40,
      tech_adult_population: 12,
      tech_calculate: "1", //  1  2
      tech_labor_force: "1.44",
      tech_unemployment_rate: "50",
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_calculate" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calculate"
                    id="tech_calculate"
                    value={formData.tech_calculate}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]} &{" "}
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["4"]} &{" "}
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_calculate == "1" && (
                <>
                  <div className="space-y-2  employed_people">
                    <label htmlFor="tech_employed_people" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_employed_people"
                        id="tech_employed_people"
                        className="input mt-2"
                        aria-label="input"
                        value={formData.tech_employed_people}
                        onChange={handleChange}
                      />
                      <span className="input_unit">
                        {data?.payload?.tech_lang_keys["7"]}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2  unemployed_people">
                    <label htmlFor="tech_unemployed_people" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_unemployed_people"
                        id="tech_unemployed_people"
                        className="input"
                        aria-label="input"
                        value={formData.tech_unemployed_people}
                        onChange={handleChange}
                      />
                      <span className="input_unit">
                        {data?.payload?.tech_lang_keys["7"]}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {formData.tech_calculate == "2" && (
                <>
                  <div className="space-y-2   labor_force">
                    <label htmlFor="tech_labor_force" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_labor_force"
                        id="tech_labor_force"
                        className="input mt-2"
                        aria-label="input"
                        value={formData.tech_labor_force}
                        onChange={handleChange}
                      />
                      <span className="input_unit">
                        {data?.payload?.tech_lang_keys["7"]}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2   unemployment_rate">
                    <label htmlFor="tech_unemployment_rate" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_unemployment_rate"
                        id="tech_unemployment_rate"
                        className="input"
                        aria-label="input"
                        value={formData.tech_unemployment_rate}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2 ">
                <label htmlFor="tech_adult_population" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_adult_population"
                    id="tech_adult_population"
                    className="input"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_adult_population}
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue  rounded-lg mt-6">
                      <div className="w-full mt-4 overflow-auto">
                        <table className="w-full md:w-[60%] lg:w-[60%] lg:text-[18px] text-[16px]">
                          <tbody>
                            {result?.tech_method == "1" && (
                              <>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["2"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_labor_force} (
                                    {data?.payload?.tech_lang_keys["7"]})
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["3"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_unemployment_rate} (%)
                                  </td>
                                </tr>
                              </>
                            )}

                            {result?.tech_method == "2" && (
                              <>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_unemployment} (
                                    {data?.payload?.tech_lang_keys["7"]})
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["5"]} (
                                      {data?.payload?.tech_lang_keys["7"]})
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_employment} (
                                    {data?.payload?.tech_lang_keys["7"]})
                                  </td>
                                </tr>
                              </>
                            )}

                            {result?.tech_labor_force_participation !== "" &&
                              result?.tech_labor_force_participation !==
                                undefined && (
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_labor_force_participation} (%)
                                  </td>
                                </tr>
                              )}
                          </tbody>
                        </table>
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

export default UnemploymentRateCalculator;

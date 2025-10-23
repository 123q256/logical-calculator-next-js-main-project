"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";
import { useHalfBirthdayCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HalfBirthdayCalculator = () => {
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
    tech_year: "1999",
    tech_month: "1",
    tech_day: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHalfBirthdayCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_year || !formData.tech_month || !formData.tech_day) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_year: formData.tech_year,
        tech_month: formData.tech_month,
        tech_day: formData.tech_day,
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
      tech_year: "1999",
      tech_month: "1",
      tech_day: "1",
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 lg:gap-4 md:gap-4 gap-2">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_year" className="label">
                  {data?.payload?.tech_lang_keys["y"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_year"
                    id="tech_year"
                    value={formData.tech_year}
                    onChange={handleChange}
                  >
                    {Array.from(
                      { length: new Date().getFullYear() - 1940 + 1 },
                      (_, index) => {
                        const year = 1940 + index;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      }
                    )}
                  </select>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_month" className="label">
                  {data?.payload?.tech_lang_keys["m"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_month"
                    id="tech_month"
                    value={formData.tech_month}
                    onChange={handleChange}
                  >
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_day" className="label">
                  {data?.payload?.tech_lang_keys["d"]}:
                </label>
                <div className="w-full py-2">
                  <select
                    name="tech_day"
                    id="tech_day"
                    className="input"
                    value={formData.tech_day}
                    onChange={(e) => {
                      handleChange(e); // update formData
                      updateDays("year", "month", "day"); // same as old inline JS
                    }}
                  >
                    {Array.from({ length: 31 }, (_, i) => {
                      const day = i + 1;
                      return (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      );
                    })}
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

                  <div className="rounded-lg  flex items-center ">
                    <div className="w-full lg:w-[80%] md:w-[100%] bg-light-blue p-3 rounded-[10px] mt-3">
                      <div className="my-2">
                        <div className="w-full hidden md:block overflow-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="w-[60%] border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["7"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_next_half}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[11]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_first_Q}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[14]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_third_Q}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[15]}{" "}
                                    <u>{data?.payload?.tech_lang_keys[16]}</u>{" "}
                                    {data?.payload?.tech_lang_keys[17]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_next_bday}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="w-[60%] border-b py-2">
                                  {data?.payload?.tech_lang_keys["10"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_next_half_days}{" "}
                                  {data?.payload?.tech_lang_keys[13]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["12"]}{" "}
                                  {data?.payload?.tech_lang_keys[18]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_first_Q_days}{" "}
                                  {data?.payload?.tech_lang_keys[13]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["12"]}{" "}
                                  {data?.payload?.tech_lang_keys[19]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_third_Q_days}{" "}
                                  {data?.payload?.tech_lang_keys[13]}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full text-sm md:hidden overflow-auto">
                          <p className="pt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["7"]} :
                            </strong>
                          </p>
                          <p className="border-b py-2">
                            {result?.tech_next_half}
                          </p>

                          <p className="pt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys[11]} :
                            </strong>
                          </p>
                          <p className="border-b py-2">
                            {result?.tech_first_Q}
                          </p>

                          <p className="pt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys[14]} :
                            </strong>
                          </p>
                          <p className="border-b py-2">
                            {result?.tech_third_Q}
                          </p>

                          <p className="pt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys[15]}{" "}
                              <u>{data?.payload?.tech_lang_keys[16]}</u>{" "}
                              {data?.payload?.tech_lang_keys[17]} :
                            </strong>
                          </p>
                          <p className="border-b py-2">
                            {result?.tech_next_bday}
                          </p>

                          <p className="pt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["10"]} :
                            </strong>
                          </p>
                          <p className="border-b py-2">
                            {result?.tech_next_half_days}{" "}
                            {data?.payload?.tech_lang_keys[13]}
                          </p>

                          <p className="pt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["12"]}{" "}
                              {data?.payload?.tech_lang_keys[18]} :
                            </strong>
                          </p>
                          <p className="border-b py-2">
                            {result?.tech_first_Q_days}{" "}
                            {data?.payload?.tech_lang_keys[13]}
                          </p>

                          <p className="pt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["12"]}{" "}
                              {data?.payload?.tech_lang_keys[19]} :
                            </strong>
                          </p>
                          <p className="border-b py-2">
                            {result?.tech_third_Q_days}{" "}
                            {data?.payload?.tech_lang_keys[13]}
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

export default HalfBirthdayCalculator;

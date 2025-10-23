"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAgeDifferenceCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AgeDifferenceCalculator = () => {
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
    tech_selection: "1",
    tech_dob_f: "1999-11-05",
    tech_dob_s: "1999-08-07",
    tech_year_1: "2002",
    tech_year_2: "2025",
    tech_age_1: "21",
    tech_age_2: "25",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAgeDifferenceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_selection == 1) {
      if (
        !formData.tech_selection ||
        !formData.tech_dob_f ||
        !formData.tech_dob_s
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_selection == 2) {
      if (
        !formData.tech_selection ||
        !formData.tech_year_1 ||
        !formData.tech_year_2
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_selection ||
        !formData.tech_age_1 ||
        !formData.tech_age_2
      ) {
        setFormError("Please fill in field");
        return;
      }
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_dob_f: formData.tech_dob_f,
        tech_dob_s: formData.tech_dob_s,
        tech_year_1: formData.tech_year_1,
        tech_year_2: formData.tech_year_2,
        tech_age_1: formData.tech_age_1,
        tech_age_2: formData.tech_age_2,
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
      tech_selection: "1",
      tech_dob_f: "1999-11-05",
      tech_dob_s: "1999-08-07",
      tech_year_1: "2002",
      tech_year_2: "2025",
      tech_age_1: "21",
      tech_age_2: "25",
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

  const currentYear = new Date().getFullYear();
  const startYear = 1910;

  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }

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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="w-full mx-auto my-2 ">
              <input
                type="hidden"
                name="tech_selection"
                id="calculator_time"
                value={formData.tech_selection}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_selection === "1" ? "tagsUnit" : ""
                    }`}
                    id="1"
                    onClick={() => {
                      setFormData({ ...formData, tech_selection: "1" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    Birthdates
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_selection === "2" ? "tagsUnit" : ""
                    }`}
                    id="2"
                    onClick={() => {
                      setFormData({ ...formData, tech_selection: "2" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    Years
                  </div>
                </div>
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_selection === "3" ? "tagsUnit" : ""
                    }`}
                    id="3"
                    onClick={() => {
                      setFormData({ ...formData, tech_selection: "3" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    Ages
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 mt-5 lg:grid-cols-2 md:grid-cols-2  gap-4">
              {formData.tech_selection == "1" && (
                <>
                  <div className="space-y-2  ">
                    <label htmlFor="tech_dob_f" className="label">
                      Birthday of First Person:
                    </label>
                    <div className=" relative">
                      <input
                        type="date"
                        name="tech_dob_f"
                        id="tech_dob_f"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_dob_f}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tech_dob_s" className="label">
                      Birthday of Second Person:
                    </label>
                    <div className=" relative">
                      <input
                        type="date"
                        name="tech_dob_s"
                        id="tech_dob_s"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_dob_s}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_selection == "2" && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="year_1" className="font-s-14 text-blue">
                      Birth Year 1:
                    </label>
                    <select
                      name="year_1"
                      id="year_1"
                      className="input mb-4"
                      value={formData.year_1}
                      onChange={handleChange}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="year_2" className="font-s-14 text-blue">
                      Birth Year 2:
                    </label>
                    <select
                      name="year_2"
                      id="year_2"
                      className="input"
                      value={formData.year_2}
                      onChange={handleChange}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {formData.tech_selection == "3" && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="tech_age_1" className="label">
                      Age 1:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_age_1"
                        id="tech_age_1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_age_1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tech_age_2" className="label">
                      Age 2:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_age_2"
                        id="tech_age_2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_age_2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
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
                    <div className="w-full bg-light-blue p-3 rounded-lg mt-3">
                      <div className="my-2">
                        <div className="lg:w-3/4 w-full lg:text-lg md:text-lg text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="w-7/12 border-b py-2 font-semibold">
                                  Age Difference :
                                </td>
                                <td className="border-b py-2">
                                  <b>{result?.tech_age_diff_Year}</b> Years{" "}
                                  {result?.tech_age_diff_Month !==
                                    undefined && (
                                    <>
                                      <b>{result?.tech_age_diff_Month}</b>{" "}
                                      Months{" "}
                                    </>
                                  )}
                                  {result?.tech_age_diff_Day !== undefined && (
                                    <>
                                      <b>{result?.tech_age_diff_Day}</b> Days
                                    </>
                                  )}
                                </td>
                              </tr>

                              {result?.tech_age_diff_remaining_days !==
                                undefined && (
                                <tr>
                                  <td className="border-b py-2 font-semibold">
                                    Age Difference in Weeks :
                                  </td>
                                  <td className="border-b py-2">
                                    <b>{result?.tech_age_diff_weeks}</b> Weeks{" "}
                                    <b>
                                      {result?.tech_age_diff_remaining_days}
                                    </b>{" "}
                                    Days
                                  </td>
                                </tr>
                              )}

                              <tr>
                                <td className="border-b py-2 font-semibold">
                                  Age Difference in Days:
                                </td>
                                <td className="border-b py-2">
                                  <b className="text-2xl text-blue-500">
                                    {result?.tech_age_diff_in_days}
                                  </b>{" "}
                                  Days
                                </td>
                              </tr>

                              {formData?.tech_selection == 1 && (
                                <>
                                  <tr>
                                    <td className="w-7/12 border-b py-2 font-semibold">
                                      First Person is :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_age_diff_Year} Years{" "}
                                      {result?.tech_age_diff_Month} Months{" "}
                                      {result?.tech_age_diff_Day} Days
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 font-semibold">
                                      Age of First Person :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_ageFYear} Years{" "}
                                      {result?.tech_ageFMonth} Months{" "}
                                      {result?.tech_ageFDay} Days
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 font-semibold">
                                      Age of Second Person :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_ageSYear} Years{" "}
                                      {result?.tech_ageSMonth} Months{" "}
                                      {result?.tech_ageSDay} Days
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </table>
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

export default AgeDifferenceCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDatedurationCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DateDurationCalculator = () => {
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

  // console.log(data);

  const [formData, setFormData] = useState({
    tech_s_date: "",
    tech_e_date: "",
    tech_checkbox: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateDateDurationPercentage,
    {
      isLoading: calculateDateDurationLoading,
      isError,
      error: calculateLoveError,
    },
  ] = useDatedurationCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_s_date || !formData.tech_e_date) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateDateDurationPercentage({
        tech_s_date: formData.tech_s_date,
        tech_e_date: formData.tech_e_date,
        tech_checkbox: formData.tech_checkbox,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError("Error calculating.");
      toast.error("Error calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_s_date: "",
      tech_e_date: "",
      tech_checkbox: "",
    });
    setResult(null);
    setFormError(null);
  };

  const handleNowClick = () => {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    setFormData((prev) => ({
      ...prev,
      tech_s_date: today,
    }));
  };

  const handleNowClick1 = () => {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    setFormData((prev) => ({
      ...prev,
      tech_e_date: today,
    }));
  };

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
          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-2  lg:grid-cols-2 md:grid-cols-2 text-center  gap-4">
              <a
                href="/date-duration-calculator"
                className=" cursor-pointer py-2 text-[#2845F5] border-b-2 border-[#2845F5] "
                id="date_cal"
              >
                <strong>{data?.payload?.tech_lang_keys["1"]}</strong>
              </a>
              <a
                href="/date-calculator"
                className=" cursor-pointer py-2"
                id="time_cal"
              >
                <strong>{data?.payload?.tech_lang_keys["2"]}</strong>
              </a>
            </div>
            <div className="grid grid-cols-12  gap-4 mt-7">
              <div className="col-span-12 md:col-span-6">
                <div className="flex justify-between">
                  <label htmlFor="tech_s_date" className="label">
                    {data?.payload?.tech_lang_keys["6"]}:
                  </label>
                  <span
                    className="text-[14px] text-end text-blue underline cursor-pointer"
                    onClick={handleNowClick}
                  >
                    {data?.payload?.tech_lang_keys?.now ?? "Now"}
                  </span>
                </div>
                <input
                  type="date"
                  name="tech_s_date"
                  id="tech_s_date"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_s_date}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="flex justify-between">
                  <label htmlFor="tech_e_date" className="label">
                    {data?.payload?.tech_lang_keys["6"]}:
                  </label>
                  <span
                    className="text-[14px] text-end text-blue underline cursor-pointer"
                    onClick={handleNowClick1}
                  >
                    {data?.payload?.tech_lang_keys?.now ?? "Now"}
                  </span>
                </div>

                <input
                  type="date"
                  name="tech_e_date"
                  id="tech_e_date"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_e_date}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 relative col-span-12">
                <input
                  type="checkbox"
                  name="tech_checkbox"
                  id="tech_checkbox"
                  // onChange={handleChange}

                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      tech_checkbox: isChecked ? "on" : "",
                    }));
                  }}
                />
                <label htmlFor="tech_checkbox" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={calculateDateDurationLoading}>
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
        {calculateDateDurationLoading ? (
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
                    <div className="w-full bg-light-blue rounded-lg p-4 mt-6">
                      <div className="mb-4">
                        <div className="text-base lg:w-2/3">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2 w-3/5">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["10"]}:
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_from}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2 w-3/5">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["11"]}:
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_to}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {result?.tech_years}{" "}
                                  {data?.payload?.tech_lang_keys[12]},{" "}
                                  {result?.tech_months}{" "}
                                  {data?.payload?.tech_lang_keys[13]},{" "}
                                  {result?.tech_days}{" "}
                                  {data?.payload?.tech_lang_keys[14]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {Math.floor(
                                    result?.tech_days / 7
                                  ).toLocaleString()}{" "}
                                  {data?.payload?.tech_lang_keys[15]},{" "}
                                  {Math.floor(
                                    result?.tech_days % 7
                                  ).toLocaleString()}{" "}
                                  {data?.payload?.tech_lang_keys[14]}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {result?.tech_days}{" "}
                                  {data?.payload?.tech_lang_keys[14]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {result?.tech_days * 24}{" "}
                                  {data?.payload?.tech_lang_keys[16]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {result?.tech_days * 24 * 60}{" "}
                                  {data?.payload?.tech_lang_keys[17]}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">
                                  {result?.tech_days * 24 * 60 * 60}{" "}
                                  {data?.payload?.tech_lang_keys[18]}
                                </td>
                              </tr>
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

export default DateDurationCalculator;

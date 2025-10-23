"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useMillitarytimeCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DeadlineCalculator = () => {
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
    tech_conversion: "1",
    tech_military_time: "1234",
    tech_hours: "24h",
    tech_hur: "7",
    tech_min: "17",
    tech_am_pm: "pm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateMilityTime,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useMillitarytimeCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_conversion == 1) {
      if (!formData.tech_conversion || !formData.tech_military_time) {
        setFormError("Please fill in field.");
        return;
      }
    } else {
      if (
        !formData.tech_conversion ||
        !formData.tech_hours ||
        !formData.tech_min ||
        !formData.tech_am_pm
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateMilityTime({
        tech_conversion: formData.tech_conversion,
        tech_military_time: formData.tech_military_time,
        tech_hours: formData.tech_hours,
        tech_hur: formData.tech_hur,
        tech_min: formData.tech_min,
        tech_am_pm: formData.tech_am_pm,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      console.log(err);
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_conversion: "1",
      tech_military_time: "",
      tech_hours: "12h",
      tech_hur: "7",
      tech_min: "17",
      tech_am_pm: "pm",
    });
    setResult(null);
    setFormError(null);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 ">
                <label htmlFor="tech_conversion" className="label">
                  {data?.payload?.tech_lang_keys["1"]}(
                  {data?.payload?.tech_lang_keys["2"]}):
                </label>
                <div className="">
                  <select
                    className="input mt-2"
                    aria-label="select"
                    name="tech_conversion"
                    id="tech_conversion"
                    value={formData.tech_conversion}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["4"]} (%)
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_conversion === "1" ? (
                <div className="space-y-2 formate">
                  <label htmlFor="tech_military_time" className="label">
                    {data?.payload?.tech_lang_keys["5"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_military_time"
                    id="tech_military_time"
                    className="input my-2"
                    aria-label="input"
                    min="100"
                    max="2400"
                    value={formData.tech_military_time}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2 tech_hours ">
                    <input
                      type="hidden"
                      name="tech_hours"
                      id="tech_hours"
                      value={formData.tech_hours}
                    />
                    <label className="label">&nbsp;</label>
                    <div className="flex items-center bg-white text-center mt-3 border rounded-lg p-1">
                      <div
                        className={`w-1/2 py-2 cursor-pointer rounded-md tw_hour  hover_tags ${
                          formData.tech_hours === "12h" ? "tagsUnit" : ""
                        }`}
                        id="12h"
                        onClick={() =>
                          setFormData({ ...formData, tech_hours: "12h" })
                        }
                      >
                        12 Hours
                      </div>
                      <div
                        className={`w-1/2 py-2 cursor-pointer rounded-md tf_hour  hover_tags ${
                          formData.tech_hours === "24h" ? "tagsUnit" : ""
                        }`}
                        id="12h"
                        onClick={() =>
                          setFormData({ ...formData, tech_hours: "24h" })
                        }
                      >
                        24 Hours
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 hours">
                    <label htmlFor="tech_hur" className="text-sm text-blue-500">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className=" flex items-center">
                      <input
                        type="number"
                        step="any"
                        name="tech_hur"
                        id="tech_hur"
                        className="input my-1"
                        aria-label="input"
                        max="12"
                        min="1"
                        placeholder="Hour"
                        value={formData.tech_hur}
                        onChange={handleChange}
                      />
                      <span className="mt-2 px-2">:</span>
                      <input
                        type="number"
                        step="any"
                        name="tech_min"
                        id="tech_min"
                        className="input my-1"
                        aria-label="input"
                        max="59"
                        min="0"
                        placeholder="Minutes"
                        value={formData.tech_min}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 tech_am_pm ">
                    <input
                      type="hidden"
                      name="tech_am_pm"
                      id="tech_am_pm"
                      value={formData.tech_am_pm}
                    />
                    <label className="label">&nbsp;</label>
                    <div className="flex items-center bg-white text-center mt-3 border border-gray-300 rounded-lg p-1">
                      <div
                        className={`w-1/2 py-2 cursor-pointer rounded-md am  hover_tags ${
                          formData.tech_am_pm === "am" ? "tagsUnit" : ""
                        }`}
                        id="am"
                        onClick={() =>
                          setFormData({ ...formData, tech_am_pm: "am" })
                        }
                      >
                        AM
                      </div>
                      <div
                        className={`w-1/2 py-2 cursor-pointer rounded-md pm   hover_tags ${
                          formData.tech_am_pm === "pm" ? "tagsUnit" : ""
                        }`}
                        id="pm"
                        onClick={() =>
                          setFormData({ ...formData, tech_am_pm: "pm" })
                        }
                      >
                        PM
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={calculateDeadlineLoading}>
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
        {calculateDeadlineLoading ? (
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full rounded-lg mt-6">
                      <div className="mt-4">
                        <div className="lg:w-2/3 w-full">
                          <table className="w-full text-lg">
                            <tbody>
                              <tr>
                                <td className="border-b py-2 font-bold">
                                  {data?.payload?.tech_lang_keys["9"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_military_time}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 font-bold">
                                  {data?.payload?.tech_lang_keys["10"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_eng_word}{" "}
                                  {data?.payload?.tech_lang_keys["11"]}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 font-bold">
                                  {data?.payload?.tech_lang_keys["12"]} (12h{" "}
                                  {data?.payload?.tech_lang_keys[13]}) :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_bara_ghante}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 font-bold">
                                  {data?.payload?.tech_lang_keys["12"]} (24h{" "}
                                  {data?.payload?.tech_lang_keys[13]}) :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_chubees_ghante}
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

export default DeadlineCalculator;

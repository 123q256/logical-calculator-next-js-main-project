"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useIpptCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const IPPTCalculator = () => {
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
    tech_gender: "Male",
    tech_type: "NSM",
    tech_age: "25",
    tech_push: 20,
    tech_sit: 30,
    tech_time_value: 0,
    tech_time: 0,
    tech_time_fe: 0,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useIpptCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_gender ||
      !formData.tech_type ||
      !formData.tech_age ||
      !formData.tech_push ||
      !formData.tech_sit
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_gender: formData.tech_gender,
        tech_type: formData.tech_type,
        tech_age: formData.tech_age,
        tech_push: formData.tech_push,
        tech_sit: formData.tech_sit,
        tech_time_value: formData.tech_time_value,
        tech_time: formData.tech_time,
        tech_time_fe: formData.tech_time_fe,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_gender: "Male",
      tech_type: "NSM",
      tech_age: "25",
      tech_push: 20,
      tech_sit: 30,
      tech_time_value: 0,
      tech_time: 0,
      tech_time_fe: 0,
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["gen"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_gender"
                    id="tech_gender"
                    value={formData.tech_gender}
                    onChange={handleChange}
                  >
                    <option value="Male">
                      {data?.payload?.tech_lang_keys["male"]}
                    </option>
                    <option value="Female">
                      {data?.payload?.tech_lang_keys["female"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["type"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type"
                    id="tech_type"
                    value={formData.tech_type}
                    onChange={handleChange}
                  >
                    <option value="NSM">NSMEN</option>
                    <option value="NSF">
                      {data?.payload?.tech_lang_keys["active"]} /NSF
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["age"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_age"
                    id="tech_age"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_age}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {" "}
                    {data?.payload?.tech_lang_keys["year"]}:
                  </span>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_push" className="label">
                  {data?.payload?.tech_lang_keys["push"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_push"
                    id="tech_push"
                    min="1"
                    max="60"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_push}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {" "}
                    {data?.payload?.tech_lang_keys["rep"]}:
                  </span>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_sit" className="label">
                  {data?.payload?.tech_lang_keys["sit"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_sit"
                    id="tech_sit"
                    min="1"
                    max="60"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_sit}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {" "}
                    {data?.payload?.tech_lang_keys["rep"]}:
                  </span>
                </div>
              </div>
              <input type="hidden" name="time_value" id="time_value" />
              {formData.tech_gender == "Male" && (
                <div className="col-span-6 male_run">
                  <label htmlFor="tech_time" className="label">
                    {data?.payload?.tech_lang_keys["run"]} (MM:SS):
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_time"
                      id="tech_time"
                      value={formData.tech_time}
                      onChange={handleChange}
                    >
                      {[
                        "8:30",
                        "8:40",
                        "8:50",
                        "9:00",
                        "9:10",
                        "9:20",
                        "9:30",
                        "9:40",
                        "9:50",
                        "10:00",
                        "10:10",
                        "10:20",
                        "10:30",
                        "10:40",
                        "10:50",
                        "11:00",
                        "11:10",
                        "11:20",
                        "11:30",
                        "11:40",
                        "11:50",
                        "12:00",
                        "12:10",
                        "12:20",
                        "12:30",
                        "12:40",
                        "12:50",
                        "13:00",
                        "13:10",
                        "13:20",
                        "13:30",
                        "13:40",
                        "13:50",
                        "14:00",
                        "14:10",
                        "14:20",
                        "14:30",
                        "14:40",
                        "14:50",
                        "15:00",
                        "15:10",
                        "15:20",
                        "15:30",
                        "15:40",
                        "15:50",
                        "16:00",
                        "16:10",
                        "16:20",
                        "16:30",
                        "16:40",
                        "16:50",
                        "17:00",
                        "17:10",
                        "17:20",
                        "17:30",
                        "17:40",
                        "17:50",
                        "18:00",
                        "18:10",
                        "18:20",
                      ].map((label, index) => (
                        <option key={index} value={index}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {formData.tech_gender == "Female" && (
                <div className="col-span-6 female_run">
                  <label htmlFor="tech_time_fe" className="label">
                    {data?.payload?.tech_lang_keys["run"]} (MM:SS):
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_time_fe"
                      id="tech_time_fe"
                      value={formData.tech_time_fe}
                      onChange={handleChange}
                    >
                      {[
                        { value: "0", label: "10:00" },
                        { value: "1", label: "10:10" },
                        { value: "2", label: "10:20" },
                        { value: "3", label: "10:30" },
                        { value: "4", label: "10:40" },
                        { value: "5", label: "10:50" },
                        { value: "6", label: "11:00" },
                        { value: "7", label: "11:10" },
                        { value: "8", label: "11:20" },
                        { value: "9", label: "11:30" },
                        { value: "10", label: "11:40" },
                        { value: "11", label: "11:50" },
                        { value: "12", label: "12:00" },
                        { value: "13", label: "12:10" },
                        { value: "14", label: "12:20" },
                        { value: "15", label: "12:30" },
                        { value: "16", label: "12:40" },
                        { value: "17", label: "12:50" },
                        { value: "18", label: "13:00" },
                        { value: "19", label: "13:10" },
                        { value: "20", label: "13:20" },
                        { value: "21", label: "13:30" },
                        { value: "22", label: "13:40" },
                        { value: "23", label: "13:50" },
                        { value: "24", label: "14:00" },
                        { value: "25", label: "14:10" },
                        { value: "26", label: "14:20" },
                        { value: "27", label: "14:30" },
                        { value: "28", label: "14:40" },
                        { value: "29", label: "14:50" },
                        { value: "30", label: "15:00" },
                        { value: "31", label: "15:10" },
                        { value: "32", label: "15:20" },
                        { value: "33", label: "15:30" },
                        { value: "34", label: "15:40" },
                        { value: "35", label: "15:50" },
                        { value: "36", label: "16:00" },
                        { value: "37", label: "16:10" },
                        { value: "38", label: "16:20" },
                        { value: "39", label: "16:30" },
                        { value: "40", label: "16:40" },
                        { value: "41", label: "16:50" },
                        { value: "42", label: "17:00" },
                        { value: "43", label: "17:10" },
                        { value: "44", label: "17:20" },
                        { value: "45", label: "17:30" },
                        { value: "46", label: "17:40" },
                        { value: "47", label: "17:50" },
                        { value: "48", label: "18:00" },
                        { value: "49", label: "18:10" },
                        { value: "50", label: "18:20" },
                        { value: "51", label: "18:30" },
                        { value: "52", label: "18:40" },
                        { value: "53", label: "18:50" },
                        { value: "54", label: "19:00" },
                        { value: "55", label: "19:10" },
                        { value: "56", label: "19:20" },
                        { value: "57", label: "19:30" },
                        { value: "58", label: "19:40" },
                        { value: "59", label: "19:50" },
                        { value: "60", label: "20:00" },
                        { value: "61", label: "20:10" },
                        { value: "62", label: "20:20" },
                        { value: "63", label: "20:30" },
                        { value: "64", label: "20:40" },
                        { value: "65", label: "20:50" },
                        { value: "66", label: "21:00" },
                        { value: "67", label: "21:10" },
                        { value: "68", label: "21:20" },
                        { value: "69", label: "21:30" },
                        { value: "70", label: "21:40" },
                        { value: "71", label: "21:50" },
                        { value: "72", label: "22:00" },
                        { value: "73", label: "22:10" },
                      ].map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
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
                    <div className="w-full mt-3">
                      <div className="w-full mt-2">
                        {result?.tech_status === "Fail" && (
                          <>
                            <p className="text-[20px]">
                              <strong className="text-[#119154]">
                                {data?.payload?.tech_lang_keys["fail"]}
                              </strong>{" "}
                              {data?.payload?.tech_lang_keys["with"]}{" "}
                              {result?.tech_score}{" "}
                              {data?.payload?.tech_lang_keys["point"]}.
                            </p>
                            <p className="text-[18px]">
                              {data?.payload?.tech_lang_keys["get_"]}{" "}
                              {result?.tech_to_next}{" "}
                              {data?.payload?.tech_lang_keys["p1"]}{" "}
                              {result?.tech_score + result?.tech_to_next}{" "}
                              {data?.payload?.tech_lang_keys["point"]}.
                            </p>
                          </>
                        )}

                        {result?.tech_status === "Pass" && (
                          <>
                            <p className="text-[20px]">
                              <strong className="text-[#119154]">
                                {data?.payload?.tech_lang_keys["pass"]}
                              </strong>{" "}
                              {data?.payload?.tech_lang_keys["with"]}{" "}
                              {result?.tech_score}{" "}
                              {data?.payload?.tech_lang_keys["point"]}.
                            </p>
                            <p className="text-[30px]">
                              <strong className="text-[#119154]">
                                ($0 {data?.payload?.tech_lang_keys["awa"]})
                              </strong>
                            </p>
                            <p className="text-[18px]">
                              {data?.payload?.tech_lang_keys["get_"]}{" "}
                              {result?.tech_to_next}{" "}
                              {data?.payload?.tech_lang_keys["p2"]}{" "}
                              {result?.tech_score + result?.tech_to_next}{" "}
                              {data?.payload?.tech_lang_keys["point"]}.
                            </p>
                          </>
                        )}

                        {result?.tech_status === "incentive" && (
                          <>
                            <p className="text-[20px]">
                              <strong className="text-[#119154]">
                                {data?.payload?.tech_lang_keys["ipass"]}
                              </strong>{" "}
                              {data?.payload?.tech_lang_keys["with"]}{" "}
                              {result?.tech_score}{" "}
                              {data?.payload?.tech_lang_keys["point"]}.
                            </p>
                            <p className="text-[30px]">
                              <strong className="text-[#119154]">
                                ($200 {data?.payload?.tech_lang_keys["awa"]})
                              </strong>
                            </p>
                            <p className="text-[18px]">
                              {data?.payload?.tech_lang_keys["get_"]}{" "}
                              {result?.tech_to_next}{" "}
                              {data?.payload?.tech_lang_keys["p3"]}{" "}
                              {result?.tech_score + result?.tech_to_next}{" "}
                              {data?.payload?.tech_lang_keys["point"]}.
                            </p>
                          </>
                        )}

                        {result?.tech_status === "Silver" && (
                          <>
                            <p className="text-[20px]">
                              <strong className="text-[#119154]">
                                {data?.payload?.tech_lang_keys["spass"]}
                              </strong>{" "}
                              {data?.payload?.tech_lang_keys["with"]}{" "}
                              {result?.tech_score}{" "}
                              {data?.payload?.tech_lang_keys["point"]}.
                            </p>
                            <p className="text-[30px]">
                              <strong className="text-[#119154]">
                                ($300 {data?.payload?.tech_lang_keys["awa"]})
                              </strong>
                            </p>
                            <p className="text-[18px]">
                              {data?.payload?.tech_lang_keys["get_"]}{" "}
                              {result?.tech_to_next}{" "}
                              {data?.payload?.tech_lang_keys["p4"]}{" "}
                              {result?.tech_score + result?.tech_to_next}{" "}
                              {data?.payload?.tech_lang_keys["point"]}.
                            </p>
                          </>
                        )}

                        {result?.tech_status === "Gold" && (
                          <>
                            <p className="text-[20px]">
                              <strong className="text-[#119154]">
                                {data?.payload?.tech_lang_keys["gpass"]}
                              </strong>{" "}
                              {data?.payload?.tech_lang_keys["with"]}{" "}
                              {result?.tech_score}{" "}
                              {data?.payload?.tech_lang_keys["point"]}.
                            </p>
                            <p className="text-[30px]">
                              <strong className="text-[#119154]">
                                ($500 {data?.payload?.tech_lang_keys["awa"]})
                              </strong>
                            </p>
                            <p className="text-[18px]">
                              {data?.payload?.tech_lang_keys["cong"]}!
                            </p>
                          </>
                        )}

                        {result?.tech_status === "Gold1" && (
                          <>
                            <p className="text-[20px]">
                              <strong className="text-[#119154]">
                                {data?.payload?.tech_lang_keys["p5"]}
                              </strong>{" "}
                              {data?.payload?.tech_lang_keys["with"]}{" "}
                              {result?.tech_score}{" "}
                              {data?.payload?.tech_lang_keys["point"]}.
                            </p>
                            <p className="text-[30px]">
                              <strong className="text-[#119154]">
                                ($500 {data?.payload?.tech_lang_keys["awa"]})
                              </strong>
                            </p>
                            <p className="text-[18px]">
                              {data?.payload?.tech_lang_keys["cong"]}!
                            </p>
                          </>
                        )}

                        <div className="w-full overflow-auto mt-2">
                          <table className="w-full" cellspacing="0">
                            <thead>
                              <tr>
                                <th className="text-blue text-start py-3">
                                  Activity
                                </th>
                                <th className="text-blue text-start">
                                  {data?.payload?.tech_lang_keys["rep"]}
                                </th>
                                <th className="text-blue text-start">
                                  {data?.payload?.tech_lang_keys["score"]}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border-b py-3">
                                  {data?.payload?.tech_lang_keys["push"]}
                                </td>
                                <td className="border-b">
                                  {formData?.tech_push}
                                </td>
                                <td className="border-b">
                                  {result?.tech_push_s}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-3">
                                  {data?.payload?.tech_lang_keys["sit"]}
                                </td>
                                <td className="border-b">
                                  {formData?.tech_sit}
                                </td>
                                <td className="border-b">
                                  {result?.tech_sit_s}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-3">
                                  {data?.payload?.tech_lang_keys["run"]}
                                </td>
                                <td className="border-b">
                                  {formData?.tech_time_value}
                                </td>
                                <td className="border-b">
                                  {result?.tech_run_s}
                                </td>
                              </tr>
                              <tr className="bg_blue_g text-white">
                                <td className="py-3" colSpan="2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["ts"]}
                                  </strong>
                                </td>
                                <td>
                                  <strong>{result?.tech_score}</strong>
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

export default IPPTCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useFatBurningHeartRateMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FatBurningHeartRateCalculator = () => {
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
    tech_age: "30",
    tech_gender: "male", // female  male
    tech_RHR: "70",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFatBurningHeartRateMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_age || !formData.tech_gender) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_age: formData.tech_age,
        tech_gender: formData.tech_gender,
        tech_RHR: formData.tech_RHR,
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
      tech_age: "30",
      tech_gender: "male", // female  male
      tech_RHR: "70",
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
                  <span className="input_unit">years</span>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
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
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_RHR" className="label">
                  {data?.payload?.tech_lang_keys["3"]} (
                  {data?.payload?.tech_lang_keys["4"]}):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_RHR"
                    id="tech_RHR"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_RHR}
                    onChange={handleChange}
                  />
                  <span className="input_unit">bpm</span>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="col-12">
                        {Number(result?.tech_MHR) > 0 && (
                          <>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys[6]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[32px]">
                                {result.tech_MHR}
                              </strong>{" "}
                              <span className="text-[#119154] text-[20px]">
                                bpm
                              </span>
                            </p>
                          </>
                        )}

                        {Number(formData.tech_RHR) > 0 && (
                          <>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys[7]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[32px]">
                                {result.tech_HRR}
                              </strong>{" "}
                              <span className="text-[#119154] text-[20px]">
                                bpm
                              </span>
                            </p>
                          </>
                        )}

                        {result?.tech_res_normal &&
                          result.tech_res_normal.trim() !== "" && (
                            <p className="mt-1">
                              <strong className="text-[#2845F5]">
                                {result.tech_res_normal}
                              </strong>
                            </p>
                          )}

                        <p className="my-2">
                          <strong className="text-[#2845F5] border-b-2">
                            Fat Burning Zone
                          </strong>
                        </p>
                        <div className="w-full overflow-auto">
                          <table
                            className="w-full md:w-[60%] lg:w-[60%]"
                            cellSpacing="0"
                          >
                            <thead>
                              <tr>
                                <th className="text-start border-b py-2">
                                  Method
                                </th>
                                <th className="text-start border-b py-2">
                                  THR in bpm
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  60-80% of maximum heart rate
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {Number(result?.tech_percent_lower)} -{" "}
                                    {Number(result?.tech_percent_upper)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">Zoladz method</td>
                                <td className="border-b py-2">
                                  <strong>
                                    {Number(result?.tech_zoladz_lower)} -{" "}
                                    {Number(result?.tech_zoladz_upper)}
                                  </strong>
                                </td>
                              </tr>
                              {Number(formData.tech_RHR) > 0 &&
                                Number(formData.tech_RHR) > 0 && (
                                  <tr>
                                    <td className="py-2">Karvonen method</td>
                                    <td className="py-2">
                                      <strong>
                                        {Number(result.tech_karvonen_lower)} -{" "}
                                        {Number(result.tech_karvonen_upper)}
                                      </strong>
                                    </td>
                                  </tr>
                                )}
                            </tbody>
                          </table>
                        </div>

                        <p className="mt-3 mb-2">
                          <strong className="text-[#2845F5] border-b-2">
                            {data?.payload?.tech_lang_keys[27]}:
                          </strong>
                        </p>
                        <p>
                          <strong>{data?.payload?.tech_lang_keys[1]}</strong>:{" "}
                          {formData?.tech_age}
                        </p>
                        <p>
                          <strong>{data?.payload?.tech_lang_keys[19]}</strong>:{" "}
                          {formData?.tech_gender}
                        </p>
                        {Number(formData?.tech_RHR) > 0 && (
                          <p>
                            <strong>{data?.payload?.tech_lang_keys[20]}</strong>
                            : {formData?.tech_RHR}
                          </p>
                        )}

                        <p className="mt-3 mb-2">
                          <strong className="text-[#2845F5] border-b-2">
                            {data?.payload?.tech_lang_keys[21]}:
                          </strong>
                        </p>

                        <p>
                          <strong>{data?.payload?.tech_lang_keys[22]}</strong>
                        </p>
                        <p>{data?.payload?.tech_lang_keys[22]}: 220 - Age</p>
                        <p>
                          {data?.payload?.tech_lang_keys[22]}: 220 -{" "}
                          {formData?.tech_age}
                        </p>
                        <p>
                          {data?.payload?.tech_lang_keys[22]}:{" "}
                          {result?.tech_MHR} bpm
                        </p>

                        {Number(formData?.tech_RHR) > 0 && (
                          <>
                            <p className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[23]}
                              </strong>
                            </p>
                            <p>
                              {data?.payload?.tech_lang_keys[23]}:{" "}
                              {data?.payload?.tech_lang_keys[22]} -{" "}
                              {data?.payload?.tech_lang_keys[22]}
                            </p>
                            <p>
                              {data?.payload?.tech_lang_keys[23]}:{" "}
                              {result?.tech_MHR} - {formData?.tech_RHR}
                            </p>
                            <p>
                              {data?.payload?.tech_lang_keys[23]}:{" "}
                              {result?.tech_HRR} bpm
                            </p>
                          </>
                        )}

                        <p className="mt-2">
                          <strong>
                            60-80% {data?.payload?.tech_lang_keys[24]}
                          </strong>
                        </p>
                        <p>
                          THR = [60% x {data?.payload?.tech_lang_keys[22]}] -
                          [80% x {data?.payload?.tech_lang_keys[22]}]
                        </p>
                        <p>
                          THR = [60% x {result?.tech_MHR}] - [80% x{" "}
                          {result?.tech_MHR}]
                        </p>
                        <p>
                          THR = {Number(result?.tech_percent_lower)} -{" "}
                          {Number(result?.tech_percent_upper)} bpm
                        </p>

                        <p className="mt-2">
                          <strong>{data?.payload?.tech_lang_keys[25]}</strong>
                        </p>
                        <p>THR = HRmax − Adjuster ± 5 bpm</p>
                        <p>
                          THR = [{result?.tech_MHR} - 50 ± 5] - [
                          {result?.tech_MHR} - 40 ± 5]
                        </p>
                        <p>
                          THR = [{result?.tech_MHR - 50} ± 5] - [
                          {result?.tech_MHR - 40} ± 5]
                        </p>
                        <p>
                          THR = {result?.tech_zoladz_lower} -{" "}
                          {result?.tech_zoladz_upper} bpm
                        </p>

                        {Number(formData.tech_RHR) > 0 &&
                          Number(formData.tech_RHR) > 0 && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[26]}
                                </strong>
                              </p>
                              <p>
                                THR = [60% of HRR + RHR] - [80% of HRR + RHR]
                              </p>
                              <p>
                                THR = [{Number((result?.tech_HRR * 60) / 100)} +{" "}
                                {formData?.tech_RHR}] - [
                                {Number((result?.tech_HRR * 80) / 100)} +{" "}
                                {formData?.tech_RHR}]
                              </p>
                              <p>
                                THR = {Number(result?.tech_karvonen_lower)} -{" "}
                                {Number(result?.tech_karvonen_upper)} bpm
                              </p>
                            </>
                          )}

                        {result?.tech_res0 && (
                          <>
                            <p className="my-2">
                              <strong className="text-[#2845F5] border-b-2">
                                {data?.payload?.tech_lang_keys[11]}:
                              </strong>
                            </p>

                            <div className="w-full overflow-auto">
                              <table
                                className="w-full md:w-[60%] lg:w-[60%]"
                                cellSpacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[12]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_res0}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[13]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_res1}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[14]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_res2}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[15]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_res3}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[16]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_res4}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[17]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_res5}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">
                                      {data?.payload?.tech_lang_keys[18]}:
                                    </td>
                                    <td className="py-2">
                                      {result?.tech_res6}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
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

export default FatBurningHeartRateCalculator;

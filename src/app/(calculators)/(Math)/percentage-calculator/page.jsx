"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePercentageCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PercentageCalculator = () => {
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
    tech_method: "1",
    tech_p: "",
    tech_x: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePercentageCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_method || !formData.tech_p) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method: formData.tech_method,
        tech_p: formData.tech_p,
        tech_x: formData.tech_x,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_method: "1",
      tech_p: "",
      tech_x: "",
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
            <div className="grid grid-cols-1  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 ">
                <label htmlFor="method" className="font-s-14 text-blue">
                  {data?.payload?.tech_lang_keys["choose"]}:
                </label>
                <div className="w-full py-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method"
                    id="tech_method"
                    value={formData.tech_method}
                    onChange={handleChange}
                  >
                    <optgroup label="Y = P% × X">
                      <option value="1">
                        {data?.payload?.tech_lang_keys["what"]}{" "}
                        {data?.payload?.tech_lang_keys["is"]} P%{" "}
                        {data?.payload?.tech_lang_keys["of"]} X?
                      </option>
                      <option value="2">
                        Y {data?.payload?.tech_lang_keys["what"]}{" "}
                        {data?.payload?.tech_lang_keys["percent"]}{" "}
                        {data?.payload?.tech_lang_keys["of"]} X?
                      </option>
                      <option value="3">
                        Y {data?.payload?.tech_lang_keys["is"]} P%{" "}
                        {data?.payload?.tech_lang_keys["of"]}{" "}
                        {data?.payload?.tech_lang_keys["what"]}?
                      </option>
                    </optgroup>
                    <optgroup label="P% × X = Y">
                      <option value="4">
                        {data?.payload?.tech_lang_keys["what"]} %{" "}
                        {data?.payload?.tech_lang_keys["of"]} X{" "}
                        {data?.payload?.tech_lang_keys["is"]} Y?
                      </option>
                      <option value="5">
                        P% {data?.payload?.tech_lang_keys["of"]}{" "}
                        {data?.payload?.tech_lang_keys["what"]}{" "}
                        {data?.payload?.tech_lang_keys["is"]} Y?
                      </option>
                      <option value="6">
                        P% {data?.payload?.tech_lang_keys["of"]} X{" "}
                        {data?.payload?.tech_lang_keys["is"]}{" "}
                        {data?.payload?.tech_lang_keys["what"]}?
                      </option>
                    </optgroup>
                    <optgroup label="Y ÷ X = P%">
                      <option value="7">
                        Y {data?.payload?.tech_lang_keys["out"]}{" "}
                        {data?.payload?.tech_lang_keys["of"]}{" "}
                        {data?.payload?.tech_lang_keys["what"]}{" "}
                        {data?.payload?.tech_lang_keys["is"]} P%?
                      </option>
                      <option value="8">
                        {data?.payload?.tech_lang_keys["what"]}{" "}
                        {data?.payload?.tech_lang_keys["out"]}{" "}
                        {data?.payload?.tech_lang_keys["of"]} X{" "}
                        {data?.payload?.tech_lang_keys["is"]} P%?
                      </option>
                      <option value="9">
                        Y {data?.payload?.tech_lang_keys["out"]}{" "}
                        {data?.payload?.tech_lang_keys["of"]} X{" "}
                        {data?.payload?.tech_lang_keys["is"]}{" "}
                        {data?.payload?.tech_lang_keys["what"]} %?
                      </option>
                    </optgroup>
                    <optgroup label="X + (X × P%) = Y">
                      <option value="10">
                        X {data?.payload?.tech_lang_keys["plus"]} P%{" "}
                        {data?.payload?.tech_lang_keys["is"]}{" "}
                        {data?.payload?.tech_lang_keys["what"]}?
                      </option>
                      <option value="11">
                        X {data?.payload?.tech_lang_keys["plus"]}{" "}
                        {data?.payload?.tech_lang_keys["what"]} %{" "}
                        {data?.payload?.tech_lang_keys["is"]} Y?
                      </option>
                      <option value="12">
                        {data?.payload?.tech_lang_keys["what"]}{" "}
                        {data?.payload?.tech_lang_keys["plus"]} P%{" "}
                        {data?.payload?.tech_lang_keys["is"]} Y?
                      </option>
                    </optgroup>
                    <optgroup label="X − (X × P%) = Y">
                      <option value="13">
                        X {data?.payload?.tech_lang_keys["minus"]} P%{" "}
                        {data?.payload?.tech_lang_keys["is"]}{" "}
                        {data?.payload?.tech_lang_keys["what"]}?
                      </option>
                      <option value="14">
                        X {data?.payload?.tech_lang_keys["minus"]}{" "}
                        {data?.payload?.tech_lang_keys["what"]} %{" "}
                        {data?.payload?.tech_lang_keys["is"]} Y?
                      </option>
                      <option value="15">
                        {data?.payload?.tech_lang_keys["what"]}{" "}
                        {data?.payload?.tech_lang_keys["minus"]} P%{" "}
                        {data?.payload?.tech_lang_keys["is"]} Y?
                      </option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div className="col-span-12 flex items-center justify-center ">
                {formData.tech_method == "1" && (
                  <>
                    <p id="text1" className="flex">
                      {data?.payload?.tech_lang_keys["what"]}{" "}
                      {data?.payload?.tech_lang_keys["is"]}
                    </p>
                  </>
                )}
                {formData.tech_method == "4" && (
                  <>
                    <p id="text1" className="flex">
                      {data?.payload?.tech_lang_keys["what"]} %{" "}
                      {data?.payload?.tech_lang_keys["of"]}
                    </p>
                  </>
                )}

                {formData.tech_method == "8" && (
                  <>
                    <p id="text1" className="flex">
                      {data?.payload?.tech_lang_keys["what"]}{" "}
                      {data?.payload?.tech_lang_keys["out"]}{" "}
                      {data?.payload?.tech_lang_keys["of"]}
                    </p>
                  </>
                )}

                {formData.tech_method == "12" && (
                  <>
                    <p id="text1" className="flex">
                      {data?.payload?.tech_lang_keys["what"]}{" "}
                      {data?.payload?.tech_lang_keys["plus"]}
                    </p>
                  </>
                )}
                {formData.tech_method == "15" && (
                  <>
                    <p id="text1" className="flex">
                      {data?.payload?.tech_lang_keys["what"]}{" "}
                      {data?.payload?.tech_lang_keys["minus"]}
                    </p>
                  </>
                )}

                <div className="px-3">
                  <input
                    type="number"
                    step="any"
                    name="tech_p"
                    id="tech_p"
                    className="input my-2"
                    aria-label="input"
                    placeholder={
                      formData.tech_method === "1"
                        ? "P"
                        : formData.tech_method === "2"
                        ? "Y"
                        : formData.tech_method === "3"
                        ? "Y"
                        : formData.tech_method === "4"
                        ? "X"
                        : formData.tech_method === "5"
                        ? "P "
                        : formData.tech_method === "6"
                        ? "P "
                        : formData.tech_method === "7"
                        ? "Y "
                        : formData.tech_method === "8"
                        ? "X "
                        : formData.tech_method === "9"
                        ? "Y "
                        : formData.tech_method === "10"
                        ? "X "
                        : formData.tech_method === "11"
                        ? "X "
                        : formData.tech_method === "12"
                        ? "P "
                        : formData.tech_method === "13"
                        ? "X "
                        : formData.tech_method === "14"
                        ? "X "
                        : formData.tech_method === "15"
                        ? "P "
                        : "00"
                    }
                    value={formData.tech_p}
                    onChange={handleChange}
                  />
                </div>

                {formData.tech_method == "1" && (
                  <>
                    <p id="text2" className="flex">
                      % {data?.payload?.tech_lang_keys["of"]}
                    </p>
                  </>
                )}
                {formData.tech_method == "2" && (
                  <>
                    <p id="text2" className="flex">
                      {data?.payload?.tech_lang_keys["is"]}{" "}
                      {data?.payload?.tech_lang_keys["what"]} %{" "}
                      {data?.payload?.tech_lang_keys["of"]}
                    </p>
                  </>
                )}
                {formData.tech_method == "3" && (
                  <>
                    <p id="text2" className="flex">
                      {data?.payload?.tech_lang_keys["is"]}{" "}
                    </p>
                  </>
                )}
                {formData.tech_method == "4" && (
                  <>
                    <p id="text2" className="flex">
                      % {data?.payload?.tech_lang_keys["is"]}{" "}
                    </p>
                  </>
                )}
                {formData.tech_method == "5" && (
                  <>
                    <p id="text2" className="flex">
                      {data?.payload?.tech_lang_keys["is"]}{" "}
                      {data?.payload?.tech_lang_keys["what"]} ?
                    </p>
                  </>
                )}
                {formData.tech_method == "6" && (
                  <>
                    <p id="text2" className="flex">
                      % {data?.payload?.tech_lang_keys["of"]}{" "}
                      {data?.payload?.tech_lang_keys["what"]}{" "}
                      {data?.payload?.tech_lang_keys["is"]}{" "}
                    </p>
                  </>
                )}
                {formData.tech_method == "7" && (
                  <>
                    <p id="text2" className="flex">
                      {" "}
                      {data?.payload?.tech_lang_keys["out"]}{" "}
                      {data?.payload?.tech_lang_keys["of"]}{" "}
                      {data?.payload?.tech_lang_keys["what"]}{" "}
                      {data?.payload?.tech_lang_keys["is"]}{" "}
                    </p>
                  </>
                )}
                {formData.tech_method == "8" && (
                  <>
                    <p id="text2" className="flex">
                      {" "}
                      {data?.payload?.tech_lang_keys["is"]}{" "}
                    </p>
                  </>
                )}
                {formData.tech_method == "9" && (
                  <>
                    <p id="text2" className="flex">
                      {data?.payload?.tech_lang_keys["out"]}{" "}
                      {data?.payload?.tech_lang_keys["of"]}
                    </p>
                  </>
                )}
                {formData.tech_method == "10" && (
                  <>
                    <p id="text2" className="flex">
                      {data?.payload?.tech_lang_keys["plus"]}
                    </p>
                  </>
                )}
                {formData.tech_method == "11" && (
                  <>
                    <p id="text2" className="flex">
                      {data?.payload?.tech_lang_keys["plus"]}{" "}
                      {data?.payload?.tech_lang_keys["what"]} %{" "}
                      {data?.payload?.tech_lang_keys["is"]}
                    </p>
                  </>
                )}
                {formData.tech_method == "12" && (
                  <>
                    <p id="text2" className="flex">
                      % {data?.payload?.tech_lang_keys["is"]}{" "}
                    </p>
                  </>
                )}
                {formData.tech_method == "13" && (
                  <>
                    <p id="text2" className="flex">
                      {data?.payload?.tech_lang_keys["minus"]}{" "}
                    </p>
                  </>
                )}
                {formData.tech_method == "14" && (
                  <>
                    <p id="text2" className="flex">
                      {data?.payload?.tech_lang_keys["minus"]}{" "}
                      {data?.payload?.tech_lang_keys["what"]} %{" "}
                      {data?.payload?.tech_lang_keys["is"]}
                    </p>
                  </>
                )}
                {formData.tech_method == "15" && (
                  <>
                    <p id="text2" className="flex">
                      % {data?.payload?.tech_lang_keys["is"]}{" "}
                    </p>
                  </>
                )}

                <div className="px-3">
                  <input
                    type="number"
                    step="any"
                    name="tech_x"
                    id="tech_x"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_x}
                    onChange={handleChange}
                    placeholder={
                      formData.tech_method === "1"
                        ? "X"
                        : formData.tech_method === "2"
                        ? "X"
                        : formData.tech_method === "3"
                        ? "P"
                        : formData.tech_method === "4"
                        ? "Y"
                        : formData.tech_method === "5"
                        ? "Y"
                        : formData.tech_method === "6"
                        ? "X"
                        : formData.tech_method === "7"
                        ? "P"
                        : formData.tech_method === "8"
                        ? "P"
                        : formData.tech_method === "9"
                        ? "X"
                        : formData.tech_method === "10"
                        ? "P"
                        : formData.tech_method === "11"
                        ? "Y"
                        : formData.tech_method === "12"
                        ? "Y"
                        : formData.tech_method === "13"
                        ? "P"
                        : formData.tech_method === "14"
                        ? "Y"
                        : formData.tech_method === "15"
                        ? "Y"
                        : "00"
                    }
                  />
                </div>

                {formData.tech_method == "1" && (
                  <>
                    <p id="text3" className="flex">
                      ?
                    </p>
                  </>
                )}
                {formData.tech_method == "2" && (
                  <>
                    <p id="text3" className="flex">
                      ?
                    </p>
                  </>
                )}
                {formData.tech_method == "3" && (
                  <>
                    <p id="text3" className="flex">
                      % {data?.payload?.tech_lang_keys["of"]}{" "}
                      {data?.payload?.tech_lang_keys["what"]} ?{" "}
                    </p>
                  </>
                )}
                {formData.tech_method == "4" && (
                  <>
                    <p id="text3" className="flex">
                      % {data?.payload?.tech_lang_keys["is"]}{" "}
                    </p>
                  </>
                )}
                {formData.tech_method == "5" && (
                  <>
                    <p id="text3" className="flex">
                      {" "}
                      ?
                    </p>
                  </>
                )}
                {formData.tech_method == "6" && (
                  <>
                    <p id="text3" className="flex">
                      {" "}
                      {data?.payload?.tech_lang_keys["is"]}{" "}
                      {data?.payload?.tech_lang_keys["what"]} ?
                    </p>
                  </>
                )}
                {formData.tech_method == "7" && (
                  <>
                    <p id="text3" className="flex">
                      {" "}
                      % ?{" "}
                    </p>
                  </>
                )}
                {formData.tech_method == "8" && (
                  <>
                    <p id="text3" className="flex">
                      {" "}
                      % ?
                    </p>
                  </>
                )}
                {formData.tech_method == "9" && (
                  <>
                    <p id="text3" className="flex">
                      {data?.payload?.tech_lang_keys["is"]}{" "}
                      {data?.payload?.tech_lang_keys["what"]} % ?
                    </p>
                  </>
                )}
                {formData.tech_method == "10" && (
                  <>
                    <p id="text3" className="flex">
                      % {data?.payload?.tech_lang_keys["is"]}{" "}
                      {data?.payload?.tech_lang_keys["what"]}
                    </p>
                  </>
                )}
                {formData.tech_method == "11" && (
                  <>
                    <p id="text3" className="flex">
                      ?
                    </p>
                  </>
                )}
                {formData.tech_method == "12" && (
                  <>
                    <p id="text3" className="flex">
                      ?{" "}
                    </p>
                  </>
                )}
                {formData.tech_method == "13" && (
                  <>
                    <p id="text3" className="flex">
                      % {data?.payload?.tech_lang_keys["is"]}{" "}
                      {data?.payload?.tech_lang_keys["what"]} ?
                    </p>
                  </>
                )}
                {formData.tech_method == "14" && (
                  <>
                    <p id="text3" className="flex">
                      ?
                    </p>
                  </>
                )}
                {formData.tech_method == "15" && (
                  <>
                    <p id="text3" className="flex">
                      ?
                    </p>
                  </>
                )}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full">
                          <div className="w-full text-[16px] overflow-auto">
                            <p className="mt-2 text-[18px]">
                              <strong>{result?.tech_ans}</strong>
                            </p>
                            {formData?.tech_method === "1" ? (
                              <>
                                <p className="mt-2">
                                  {result?.tech_ans}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_p}%{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["what"]}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_p}%{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {formData?.tech_x}?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: Y = P%
                                  * X
                                </p>

                                <p className="mt-2">
                                  Y = {formData?.tech_p}% * {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["conv"]}:
                                </p>

                                <p className="mt-2">
                                  Y = ({formData?.tech_p} / 100) *{" "}
                                  {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  Y = {formData?.tech_p / 100} *{" "}
                                  {formData?.tech_x}
                                </p>

                                <p className="mt-2">Y = {result?.tech_ans}</p>
                              </>
                            ) : formData?.tech_method === "2" ? (
                              <>
                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {result?.tech_ans} of {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {data?.payload?.tech_lang_keys["what"]} %{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {formData?.tech_x}?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: P% = Y
                                  / X
                                </p>

                                <p className="mt-2">
                                  P% = {formData?.tech_p} / {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  P% = {formData?.tech_p / formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["dec"]}:
                                </p>

                                <p className="mt-2">
                                  P% ={" "}
                                  {(formData?.tech_p / formData?.tech_x) * 100}
                                </p>

                                <p className="mt-2">P% = {result?.tech_ans}%</p>
                              </>
                            ) : formData?.tech_method === "3" ? (
                              <>
                                <p className="mt-2">
                                  {formData?.tech_p} is {formData?.tech_x}% of{" "}
                                  {result?.tech_ans}
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {data?.payload?.tech_lang_keys["what"]}?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: X = Y /
                                  P%
                                </p>

                                <p className="mt-2">
                                  X = {formData?.tech_p} / {formData?.tech_x}%
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["conv"]}:
                                </p>

                                <p className="mt-2">
                                  X = {formData?.tech_p} / ({formData?.tech_x} /
                                  100)
                                </p>

                                <p className="mt-2">
                                  X = {formData?.tech_p} /{" "}
                                  {formData?.tech_x / 100}
                                </p>

                                <p className="mt-2">= {result?.tech_ans}</p>
                              </>
                            ) : formData?.tech_method === "4" ? (
                              <>
                                <p className="mt-2">
                                  {result?.tech_ans}{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {data?.payload?.tech_lang_keys["what"]} %{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {formData?.tech_x}?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: P% = Y
                                  / X
                                </p>

                                <p className="mt-2">
                                  P% = {formData?.tech_x} / {formData?.tech_p}
                                </p>

                                <p className="mt-2">
                                  P% = {formData?.tech_x / formData?.tech_p}
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["dec"]}:
                                </p>

                                <p className="mt-2">
                                  P% ={" "}
                                  {(formData?.tech_x / formData?.tech_p) * 100}
                                </p>

                                <p className="mt-2">P% = {result?.tech_ans}</p>
                              </>
                            ) : formData?.tech_method === "5" ? (
                              <>
                                <p className="mt-2">
                                  {formData?.tech_p}%{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {result?.tech_ans}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {formData?.tech_p}%{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {data?.payload?.tech_lang_keys["what"]}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: X = Y /
                                  P%
                                </p>

                                <p className="mt-2">
                                  X = {formData?.tech_x} / {formData?.tech_p}%
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["conv"]}:
                                </p>

                                <p className="mt-2">
                                  X = {formData?.tech_x} / ({formData?.tech_p} /
                                  100)
                                </p>

                                <p className="mt-2">
                                  X = {formData?.tech_x} /{" "}
                                  {formData?.tech_p / 100}
                                </p>

                                <p className="mt-2">X = {result?.tech_ans}</p>
                              </>
                            ) : formData?.tech_method === "6" ? (
                              <>
                                <p className="mt-2">
                                  {formData?.tech_p}%{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {formData?.tech_x}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {result?.tech_ans}
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {formData?.tech_p}%{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {formData?.tech_x}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {data?.payload?.tech_lang_keys["what"]}?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: Y = P%
                                  * X
                                </p>

                                <p className="mt-2">
                                  Y = {formData?.tech_p}% * {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["conv"]}:
                                </p>

                                <p className="mt-2">
                                  Y = ({formData?.tech_p} / 100) *{" "}
                                  {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  Y = {formData?.tech_p / 100} *{" "}
                                  {formData?.tech_x}
                                </p>

                                <p className="mt-2">Y = {result?.tech_ans}</p>
                              </>
                            ) : formData?.tech_method === "7" ? (
                              <>
                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["out"]}{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {result?.tech_ans}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}%
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["out"]}{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {data?.payload?.tech_lang_keys["what"]}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x} %?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: X = Y /
                                  P%
                                </p>

                                <p className="mt-2">
                                  X = {formData?.tech_p} / {formData?.tech_x}%
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["conv"]}:
                                </p>

                                <p className="mt-2">
                                  X = {formData?.tech_p} / ({formData?.tech_x} /
                                  100)
                                </p>

                                <p className="mt-2">
                                  X = {formData?.tech_p} /{" "}
                                  {formData?.tech_x / 100}
                                </p>

                                <p className="mt-2">X = {result?.tech_ans}</p>
                              </>
                            ) : formData?.tech_method === "8" ? (
                              <>
                                <p className="mt-2">
                                  {result?.tech_ans}{" "}
                                  {data?.payload?.tech_lang_keys["out"]}{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}%
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["what"]}{" "}
                                  {data?.payload?.tech_lang_keys["out"]}{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}%?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: Y = P%
                                  * X
                                </p>

                                <p className="mt-2">
                                  Y = {formData?.tech_x}% * {formData?.tech_p}
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["conv"]}:
                                </p>

                                <p className="mt-2">
                                  Y = ({formData?.tech_x} / 100) *{" "}
                                  {formData?.tech_p}
                                </p>

                                <p className="mt-2">
                                  Y = {formData?.tech_x / 100} *{" "}
                                  {formData?.tech_p}
                                </p>

                                <p className="mt-2">Y = {result?.tech_ans}</p>
                              </>
                            ) : formData?.tech_method === "9" ? (
                              <>
                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["out"]}{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {formData?.tech_x}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {result?.tech_ans}%
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["out"]}{" "}
                                  {data?.payload?.tech_lang_keys["of"]}{" "}
                                  {formData?.tech_x} %?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: P% = Y
                                  / X
                                </p>

                                <p className="mt-2">
                                  P% = {formData?.tech_p} / {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  P% = {formData?.tech_p / formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["dec"]}:
                                </p>

                                <p className="mt-2">
                                  P% = ({formData?.tech_p / formData?.tech_x}) *
                                  100
                                </p>

                                <p className="mt-2">P% = {result?.tech_ans}</p>
                              </>
                            ) : formData?.tech_method === "10" ? (
                              <>
                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["plus"]}{" "}
                                  {formData?.tech_x}%{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {result?.tech_ans}
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {formData?.tech_p} plus {formData?.tech_x}% is
                                  what?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: Y = X +
                                  (X × P%)
                                </p>

                                <p className="mt-2">Y = X(1 + P%)</p>

                                <p className="mt-2">
                                  Y = {formData?.tech_p} * (1 +{" "}
                                  {formData?.tech_x}%)
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["conv"]}:
                                </p>

                                <p className="mt-2">
                                  Y = {formData?.tech_p} * (1 + (
                                  {formData?.tech_x} / 100))
                                </p>

                                <p className="mt-2">
                                  Y = {formData?.tech_p} * (1 +{" "}
                                  {formData?.tech_x / 100})
                                </p>

                                <p className="mt-2">
                                  Y = {formData?.tech_p} * (
                                  {1 + formData?.tech_x / 100})
                                </p>

                                <p className="mt-2">Y = {result?.tech_ans}</p>
                              </>
                            ) : formData?.tech_method === "11" ? (
                              <>
                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["plus"]}{" "}
                                  {result?.tech_ans}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["plus"]}{" "}
                                  {data?.payload?.tech_lang_keys["what"]} %{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: Y = X +
                                  (X × P%)
                                </p>

                                <p className="mt-2">Y = X(1 + P%)</p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["sol_f"]} P
                                </p>

                                <p className="mt-2">P% = Y / X - 1</p>

                                <p className="mt-2">
                                  P% = {formData?.tech_x} / {formData?.tech_p} -
                                  1
                                </p>

                                <p className="mt-2">
                                  P% = {formData?.tech_x / formData?.tech_p} - 1
                                </p>

                                <p className="mt-2">
                                  P% = {formData?.tech_x / formData?.tech_p - 1}
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["dec"]}:
                                </p>

                                <p className="mt-2">
                                  P% ={" "}
                                  {(formData?.tech_x / formData?.tech_p - 1) *
                                    100}
                                </p>

                                <p className="mt-2">P% = {result?.tech_ans}</p>
                              </>
                            ) : formData?.tech_method === "12" ? (
                              <>
                                <p className="mt-2">
                                  {result?.tech_ans}{" "}
                                  {data?.payload?.tech_lang_keys["plus"]}{" "}
                                  {formData?.tech_p}%{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["what"]}{" "}
                                  {data?.payload?.tech_lang_keys["plus"]}{" "}
                                  {formData?.tech_p}%{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: Y = X +
                                  (X × P%)
                                </p>

                                <p className="mt-2">Y = X(1 + P%)</p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["sol_f"]} X
                                </p>

                                <p className="mt-2">X = Y / (1 + P%)</p>

                                <p className="mt-2">
                                  X = {formData?.tech_x} / (1 +{" "}
                                  {formData?.tech_p}%)
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["conv"]}:
                                </p>

                                <p className="mt-2">
                                  X = {formData?.tech_x} / (1 +{" "}
                                  {formData?.tech_p / 100})
                                </p>

                                <p className="mt-2">
                                  X = {formData?.tech_x} / (
                                  {1 + formData?.tech_p / 100})
                                </p>

                                <p className="mt-2">X = {result?.tech_ans}</p>
                              </>
                            ) : formData?.tech_method === "13" ? (
                              <>
                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["minus"]}{" "}
                                  {formData?.tech_x}%{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {result?.tech_ans}
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["minus"]}{" "}
                                  {formData?.tech_x}%{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {data?.payload?.tech_lang_keys["what"]}?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: Y = X -
                                  (X × P%)
                                </p>

                                <p className="mt-2">Y = X(1 - P%)</p>

                                <p className="mt-2">
                                  Y = {formData?.tech_p} * (1 -{" "}
                                  {formData?.tech_x}%)
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["conv"]}:
                                </p>

                                <p className="mt-2">
                                  Y = {formData?.tech_p} * (1 - (
                                  {formData?.tech_x} / 100))
                                </p>

                                <p className="mt-2">
                                  Y = {formData?.tech_p} * (1 -{" "}
                                  {formData?.tech_x / 100})
                                </p>

                                <p className="mt-2">
                                  Y = {formData?.tech_p} * (
                                  {1 - formData?.tech_x / 100})
                                </p>

                                <p className="mt-2">Y = {result?.tech_ans}</p>
                              </>
                            ) : formData?.tech_method === "14" ? (
                              <>
                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["minus"]}{" "}
                                  {result?.tech_ans}{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {formData?.tech_p}{" "}
                                  {data?.payload?.tech_lang_keys["minus"]}{" "}
                                  {data?.payload?.tech_lang_keys["is"]} %{" "}
                                  {formData?.tech_x}?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: Y = X -
                                  (X × P%)
                                </p>

                                <p className="mt-2">Y = X(1 - P%)</p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["sol_f"]} P
                                </p>

                                <p className="mt-2">P% = 1 - Y / X</p>

                                <p className="mt-2">
                                  P% = 1 - {formData?.tech_x} /{" "}
                                  {formData?.tech_p}
                                </p>

                                <p className="mt-2">
                                  P% = 1 - {formData?.tech_x / formData?.tech_p}
                                </p>

                                <p className="mt-2">
                                  P% = {1 - formData?.tech_x / formData?.tech_p}
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["dec"]}:
                                </p>

                                <p className="mt-2">
                                  P% ={" "}
                                  {(1 - formData?.tech_x / formData?.tech_p) *
                                    100}
                                </p>

                                <p className="mt-2">P% = {result?.tech_ans}</p>
                              </>
                            ) : (
                              <>
                                <p className="mt-2">
                                  {result?.tech_ans}{" "}
                                  {data?.payload?.tech_lang_keys["minus"]}{" "}
                                  {formData?.tech_p}%{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}
                                </p>

                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sol"]}:
                                  </strong>
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["what"]}{" "}
                                  {data?.payload?.tech_lang_keys["minus"]}{" "}
                                  {formData?.tech_p}%{" "}
                                  {data?.payload?.tech_lang_keys["is"]}{" "}
                                  {formData?.tech_x}?
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["eq"]}: Y = X -
                                  (X × P%)
                                </p>

                                <p className="mt-2">Y = X(1 - P%)</p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["sol_f"]} X
                                </p>

                                <p className="mt-2">X = Y / (1 - P%)</p>

                                <p className="mt-2">
                                  X = {formData?.tech_x} / (1 -{" "}
                                  {formData?.tech_p}%)
                                </p>

                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["conv"]}:
                                </p>

                                <p className="mt-2">
                                  X = {formData?.tech_x} / (1 -{" "}
                                  {formData?.tech_p / 100})
                                </p>

                                <p className="mt-2">
                                  X = {formData?.tech_x} / (
                                  {1 - formData?.tech_p / 100})
                                </p>

                                <p className="mt-2">X = {result?.tech_ans}</p>
                              </>
                            )}
                          </div>
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

export default PercentageCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDistanceCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DistanceCalculator = () => {
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
    tech_to_cal: "mint", //  mint  decimal
    tech_submit: true,
    tech_lat1: 31.4504,
    tech_long1: 73.135,
    tech_lat2: 30.7659,
    tech_long2: 72.4376,
    tech_deg1: 31.4504,
    tech_mint1: 73.135,
    tech_sec1: 73.135,
    tech_dir1: "S",
    tech_deg2: 31.4504,
    tech_mint2: 73.135,
    tech_sec2: 73.135,
    tech_dir2: "E",
    tech_deg21: 31,
    tech_mint21: 73,
    tech_sec21: 73,
    tech_dir21: "S",
    tech_deg22: 31,
    tech_mint22: 73,
    tech_sec22: 7,
    tech_dir22: "W",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDistanceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_to_cal || !formData.tech_submit) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_to_cal: formData.tech_to_cal,
        tech_submit: formData.tech_submit,
        tech_lat1: formData.tech_lat1,
        tech_long1: formData.tech_long1,
        tech_lat2: formData.tech_lat2,
        tech_long2: formData.tech_long2,
        tech_deg1: formData.tech_deg1,
        tech_mint1: formData.tech_mint1,
        tech_sec1: formData.tech_sec1,
        tech_dir1: formData.tech_dir1,
        tech_deg2: formData.tech_deg2,
        tech_mint2: formData.tech_mint2,
        tech_sec2: formData.tech_sec2,
        tech_dir2: formData.tech_dir2,
        tech_deg21: formData.tech_deg21,
        tech_mint21: formData.tech_mint21,
        tech_sec21: formData.tech_sec21,
        tech_dir21: formData.tech_dir21,
        tech_deg22: formData.tech_deg22,
        tech_mint22: formData.tech_mint22,
        tech_sec22: formData.tech_sec22,
        tech_dir22: formData.tech_dir22,
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
      tech_to_cal: "mint", //  mint  decimal
      tech_submit: true,
      tech_lat1: 31.4504,
      tech_long1: 73.135,
      tech_lat2: 30.7659,
      tech_long2: 72.4376,
      tech_deg1: 31.4504,
      tech_mint1: 73.135,
      tech_sec1: 73.135,
      tech_dir1: "S",
      tech_deg2: 31.4504,
      tech_mint2: 73.135,
      tech_sec2: 73.135,
      tech_dir2: "E",
      tech_deg21: 31,
      tech_mint21: 73,
      tech_sec21: 73,
      tech_dir21: "S",
      tech_deg22: 31,
      tech_mint22: 73,
      tech_sec22: 7,
      tech_dir22: "W",
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

  const lat1 = formData?.tech_lat1;
  const long1 = formData?.tech_long1;
  const lat2 = formData?.tech_lat2;
  const long2 = formData?.tech_long2;

  const deg1 = formData?.tech_deg1;
  const mint1 = formData?.tech_mint1;
  const sec1 = formData?.tech_sec1;
  const dir1 = formData?.tech_dir1;

  const deg2 = formData?.tech_deg2;
  const mint2 = formData?.tech_mint2;
  const sec2 = formData?.tech_sec2;
  const dir2 = formData?.tech_dir2;

  const deg21 = formData?.tech_deg21;
  const mint21 = formData?.tech_mint21;
  const sec21 = formData?.tech_sec21;
  const dir21 = formData?.tech_dir21;

  const deg22 = formData?.tech_deg22;
  const mint22 = formData?.tech_mint22;
  const sec22 = formData?.tech_sec22;
  const dir22 = formData?.tech_dir22;

  const to_cal = formData?.tech_to_cal;

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 rounded-lg input_form space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
              <div className="row">
                <div className="col-12 col-lg-9 mt-2  w-full mx-auto">
                  <input
                    type="hidden"
                    name="tech_to_cal"
                    id="calculator_time"
                    value={formData.tech_to_cal}
                  />
                  <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                    {/* Date Cal Tab */}
                    <div className="lg:w-1/2 w-full px-2 py-1">
                      <div
                        className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                          formData.tech_to_cal === "decimal" ? "tagsUnit" : ""
                        }`}
                        id="decimal"
                        onClick={() => {
                          setFormData({ ...formData, tech_to_cal: "decimal" });
                          setResult(null);
                          setFormError(null);
                        }}
                      >
                        {data?.payload?.tech_lang_keys["1"]}
                      </div>
                    </div>
                    {/* Time Cal Tab */}
                    <div className="lg:w-1/2 w-full px-2 py-1">
                      <div
                        className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                          formData.tech_to_cal === "mint" ? "tagsUnit" : ""
                        }`}
                        id="mint"
                        onClick={() => {
                          setFormData({ ...formData, tech_to_cal: "mint" });
                          setResult(null);
                          setFormError(null);
                        }}
                      >
                        {data?.payload?.tech_lang_keys["2"]}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" mx-auto">
                  <div className="row">
                    {formData.tech_to_cal == "decimal" && (
                      <>
                        <div className="lg:w-[80%] w-full mx-auto mt-5 decimal">
                          <p className="font-bold mb-4">
                            {data?.payload?.tech_lang_keys["5"]} 1
                          </p>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="">
                              <label htmlFor="tech_lat1" className="label">
                                {data?.payload?.tech_lang_keys["3"]} 1:
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_lat1"
                                  id="tech_lat1"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_lat1}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div className="">
                              <label htmlFor="tech_long1" className="label">
                                {data?.payload?.tech_lang_keys["4"]} 1:
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_long1"
                                  id="tech_long1"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_long1}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <p className="font-bold mt-6 mb-4">
                            {data?.payload?.tech_lang_keys["5"]} 2
                          </p>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="">
                              <label htmlFor="tech_lat2" className="label">
                                {data?.payload?.tech_lang_keys["3"]} 2:
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_lat2"
                                  id="tech_lat2"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_lat2}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div className="">
                              <label htmlFor="tech_long2" className="label">
                                {data?.payload?.tech_lang_keys["4"]} 2:
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_long2"
                                  id="tech_long2"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_long2}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {formData.tech_to_cal == "mint" && (
                      <>
                        <div className="mint  mt-5">
                          <p className="mb-2 font-bold">
                            {data?.payload?.tech_lang_keys["5"]} 1
                          </p>
                          <div className="lg:flex items-center">
                            <div className="lg:w-[10%] w-full mt-0 pt-2 lg:mt-2 lg:pr-2">
                              {data?.payload?.tech_lang_keys["3"]}
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                              <div className=" lg:pr-2">
                                <label htmlFor="tech_deg1" className="label">
                                  {data?.payload?.tech_lang_keys["6"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_deg1"
                                    id="tech_deg1"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_deg1}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className=" lg:pr-2">
                                <label htmlFor="tech_mint1" className="label">
                                  {data?.payload?.tech_lang_keys["7"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_mint1"
                                    id="tech_mint1"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_mint1}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className=" lg:pr-2">
                                <label htmlFor="tech_sec1" className="label">
                                  {data?.payload?.tech_lang_keys["8"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_sec1"
                                    id="tech_sec1"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_sec1}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="">
                                <label htmlFor="tech_dir1" className="label">
                                  &nbsp;
                                </label>
                                <div className="mt-2">
                                  <select
                                    className="input"
                                    aria-label="select"
                                    name="tech_dir1"
                                    id="tech_dir1"
                                    value={formData.tech_dir1}
                                    onChange={handleChange}
                                  >
                                    <option value="N">N</option>
                                    <option value="S">S</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="lg:flex items-center">
                            <div className="lg:w-[10%] w-full mt-0 pt-2 lg:mt-2 lg:pr-2">
                              {data?.payload?.tech_lang_keys["4"]}
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                              <div className="lg:pr-2">
                                <label htmlFor="tech_deg2" className="label">
                                  {data?.payload?.tech_lang_keys["6"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_deg2"
                                    id="tech_deg2"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_deg2}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="lg:pr-2">
                                <label htmlFor="tech_mint2" className="label">
                                  {data?.payload?.tech_lang_keys["7"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_mint2"
                                    id="tech_mint2"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_mint2}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="lg:pr-2">
                                <label htmlFor="tech_sec2" className="label">
                                  {data?.payload?.tech_lang_keys["8"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_sec2"
                                    id="tech_sec2"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_sec2}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="lg:mt-2">
                                <label htmlFor="tech_dir2" className="label">
                                  &nbsp;
                                </label>
                                <div className="mt-2">
                                  <select
                                    className="input"
                                    aria-label="select"
                                    name="tech_dir2"
                                    id="tech_dir2"
                                    value={formData.tech_dir2}
                                    onChange={handleChange}
                                  >
                                    <option value="E">E</option>
                                    <option value="W">W</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="mt-3 mb-2 font-bold">
                            {data?.payload?.tech_lang_keys["5"]} 2
                          </p>
                          <div className="lg:flex items-center">
                            <div className="lg:w-[10%] w-full mt-0 pt-2 lg:mt-2 lg:pr-2">
                              {data?.payload?.tech_lang_keys["3"]}
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                              <div className="lg:pr-2">
                                <label htmlFor="tech_deg21" className="label">
                                  {data?.payload?.tech_lang_keys["6"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_deg21"
                                    id="tech_deg21"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_deg21}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="lg:pr-2">
                                <label htmlFor="tech_mint21" className="label">
                                  {data?.payload?.tech_lang_keys["7"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_mint21"
                                    id="tech_mint21"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_mint21}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="lg:pr-2">
                                <label htmlFor="tech_sec21" className="label">
                                  {data?.payload?.tech_lang_keys["8"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_sec21"
                                    id="tech_sec21"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_sec21}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className=" lg:mt-2">
                                <label htmlFor="tech_dir21" className="label">
                                  &nbsp;
                                </label>
                                <div className="mt-2">
                                  <select
                                    className="input"
                                    aria-label="select"
                                    name="tech_dir21"
                                    id="tech_dir21"
                                    value={formData.tech_dir21}
                                    onChange={handleChange}
                                  >
                                    <option value="N">N</option>
                                    <option value="S">S</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="lg:flex items-center">
                            <div className="lg:w-[10%] w-full mt-0 pt-2 lg:mt-2 lg:pr-2">
                              {data?.payload?.tech_lang_keys["4"]}
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                              <div className="lg:mt-2 lg:pr-2">
                                <label htmlFor="tech_deg22" className="label">
                                  {data?.payload?.tech_lang_keys["6"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_deg22"
                                    id="tech_deg22"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_deg22}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="lg:mt-2 lg:pr-2">
                                <label htmlFor="tech_mint22" className="label">
                                  {data?.payload?.tech_lang_keys["7"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_mint22"
                                    id="tech_mint22"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_mint22}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="lg:mt-2 lg:pr-2">
                                <label htmlFor="tech_sec22" className="label">
                                  {data?.payload?.tech_lang_keys["8"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_sec22"
                                    id="tech_sec22"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_sec22}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className=" mt-0 lg:mt-2">
                                <label htmlFor="tech_dir22" className="label">
                                  &nbsp;
                                </label>
                                <div className="mt-2">
                                  <select
                                    className="input"
                                    aria-label="select"
                                    name="tech_dir22"
                                    id="tech_dir22"
                                    value={formData.tech_dir22}
                                    onChange={handleChange}
                                  >
                                    <option value="E">E</option>
                                    <option value="W">W</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg p-2 flex items-center justify-center">
                    <div className="w-full  p-3 rounded-lg">
                      <div className="my-2">
                        <div className="w-full lg:w-10/12">
                          <p className="font-bold text-lg">
                            {data?.payload?.tech_lang_keys["9"]}
                          </p>
                          <table className="w-full text-lg mt-4">
                            <tbody>
                              {to_cal === "decimal" ? (
                                <>
                                  <tr>
                                    <td colSpan="2" className="py-3">
                                      [{lat1}, {long1}]{" "}
                                      {data?.payload?.tech_lang_keys["10"]} [
                                      {lat2}, {long2}]
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="py-3 pr-4">
                                      {Math.round(result?.tech_mile * 10) / 10}
                                    </td>
                                    <td className="py-3 text-right">Miles</td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="py-3 pr-4">
                                      {Math.round(result?.tech_km * 10) / 10}
                                    </td>
                                    <td className="py-3 text-right">KM</td>
                                  </tr>
                                </>
                              ) : (
                                <>
                                  <tr>
                                    <td colSpan="2" className="py-3">
                                      [{deg1}° {mint1}' {sec1}" {dir1}, {deg2}°{" "}
                                      {mint2}' {sec2}" {dir2}]
                                      <br />
                                      {data?.payload?.tech_lang_keys["10"]}
                                      <br />[{deg21}° {mint21}' {sec21}" {dir21}
                                      , {deg22}° {mint22}' {sec22}" {dir22}]
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="py-3 pr-4">
                                      {Math.round(result?.tech_mile * 10) / 10}
                                    </td>
                                    <td className="py-3 text-right">Miles</td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="py-3 pr-4">
                                      {Math.round(result?.tech_km * 10) / 10}
                                    </td>
                                    <td className="py-3 text-right">KM</td>
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

export default DistanceCalculator;

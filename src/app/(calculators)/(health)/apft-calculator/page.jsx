"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAPFTCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const APFTCalculator = () => {
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
    tech_submit_type: null, // dis  enable
    tech_method: "score", // check  score  multi
    tech_age: "25",
    tech_gender: "Male",
    tech_number: null,
    tech_weight: "1",
    tech_push: "45",
    tech_sit: "55",
    tech_min: "14",
    tech_sec: "35",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAPFTCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_method || !formData.tech_age) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_submit_type: formData.tech_submit_type,
        tech_method: formData.tech_method,
        tech_age: formData.tech_age,
        tech_gender: formData.tech_gender,
        tech_number: formData.tech_number,
        tech_weight: formData.tech_weight,
        tech_push: formData.tech_push,
        tech_sit: formData.tech_sit,
        tech_min: formData.tech_min,
        tech_sec: formData.tech_sec,
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        push: formData.push,
        site: formData.site,
        height: formData.height,
        weight: formData.weight,
        mile: formData.mile,
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
      tech_submit_type: null, // dis  enable
      tech_method: "score", // check  score  multi
      tech_age: "25",
      tech_gender: "Male",
      tech_number: null,
      tech_weight: "1",
      tech_push: "45",
      tech_sit: "55",
      tech_min: "14",
      tech_sec: "35",
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

  // useEffect to update tech_submit_type based on result
  useEffect(() => {
    if (result?.tech_disable) {
      setFormData((prev) => ({ ...prev, tech_submit_type: "dis" }));
    } else if (result?.tech_enable) {
      setFormData((prev) => ({ ...prev, tech_submit_type: "enable" }));
    }
  }, [result?.tech_disable, result?.tech_enable]);

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

          <div className="lg:w-[80%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              {result?.tech_disable ? (
                <>
                  <input
                    type="hidden"
                    name="tech_submit_type"
                    id="tech_submit_type"
                    className="input my-2"
                    value={formData.tech_submit_type}
                  />
                  <p className="col-span-2 text-center">
                    <strong>{data?.payload?.tech_lang_keys["s_name"]}</strong>
                  </p>
                  <p className="col-span-2 text-center">
                    <strong>{data?.payload?.tech_lang_keys["Age"]}</strong>
                  </p>
                  <p className="col-span-2 text-center">
                    <strong>{data?.payload?.tech_lang_keys["gen"]}</strong>
                  </p>
                  <p className="col-span-2 text-center">
                    <strong>{data?.payload?.tech_lang_keys["push"]}</strong>{" "}
                    <br /> 2 / {data?.payload?.tech_lang_keys["mini"]}
                  </p>
                  <p className="col-span-2 text-center">
                    <strong>{data?.payload?.tech_lang_keys["sit"]}</strong>{" "}
                    <br /> 2 / {data?.payload?.tech_lang_keys["mini"]}
                  </p>
                  <p className="col-span-2 text-center">
                    <strong>{data?.payload?.tech_lang_keys["2mil"]}</strong>{" "}
                    <br /> MM:SS
                  </p>

                  <div
                    className="col-span-12 mt-2 overflow-auto weight_h"
                    style={{ height: "400px" }}
                  >
                    <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
                      {Array.from({
                        length: parseInt(result?.tech_input_total || 0),
                      }).map((_, index) => (
                        <React.Fragment key={index}>
                          <div className="col-span-2">
                            <input
                              className="input"
                              type="text"
                              name={`name${index + 1}`}
                              placeholder="Name"
                              value={formData[`name${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              className="input"
                              type="number"
                              min="17"
                              max="56"
                              name={`age${index + 1}`}
                              placeholder="00"
                              value={formData[`age${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-2">
                            <select
                              name={`gender${index + 1}`}
                              className="input"
                              value={formData[`gender${index + 1}`] || ""}
                              onChange={handleChange}
                            >
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>
                          <div className="col-span-2">
                            <input
                              className="input"
                              type="number"
                              name={`push${index + 1}`}
                              placeholder="00"
                              value={formData[`push${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              className="input"
                              type="number"
                              name={`sit${index + 1}`}
                              placeholder="00"
                              value={formData[`sit${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              className="input"
                              type="number"
                              name={`height${index + 1}`}
                              placeholder="00"
                              value={formData[`height${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              className="input"
                              type="number"
                              name={`weight${index + 1}`}
                              placeholder="00"
                              value={formData[`weight${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              className="input"
                              type="text"
                              name={`2mile${index + 1}`}
                              placeholder="MM:SS"
                              value={formData[`2mile${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-12">
                    <p className="p-1">
                      <strong>{data?.payload?.tech_lang_keys["pass"]}</strong>
                    </p>
                    <select name="pass" className="input">
                      <option value="60">60% (Army)</option>
                      <option value="50">50% (BCT/RSP)</option>
                    </select>
                  </div>
                </>
              ) : result?.tech_enable ? (
                <>
                  <input
                    type="hidden"
                    name="tech_submit_type"
                    id="tech_submit_type"
                    className="input my-2"
                    value={formData.tech_submit_type}
                  />

                  <p className="col-span-2 text-center">
                    <strong>{data?.payload?.tech_lang_keys["s_name"]}</strong>
                  </p>
                  <p className="col-span-1 text-center">
                    <strong>{data?.payload?.tech_lang_keys["Age"]}</strong>
                  </p>
                  <p className="col-span-2 text-center">
                    <strong>{data?.payload?.tech_lang_keys["gen"]}</strong>
                  </p>
                  <p className="col-span-2 text-center">
                    <strong>{data?.payload?.tech_lang_keys["push"]}</strong>{" "}
                    <br /> 2 / {data?.payload?.tech_lang_keys["mini"]}
                  </p>
                  <p className="col-span-1 text-center">
                    <strong>{data?.payload?.tech_lang_keys["sit"]}</strong>{" "}
                    <br /> 2 / {data?.payload?.tech_lang_keys["mini"]}
                  </p>
                  <p className="col-span-1 text-center">
                    <strong>Height</strong> <br /> (in)
                  </p>
                  <p className="col-span-1 text-center">
                    <strong>Weight</strong> <br /> (lbs)
                  </p>
                  <p className="col-span-2 text-center">
                    <strong>{data?.payload?.tech_lang_keys["2mil"]}</strong>{" "}
                    <br /> MM:SS
                  </p>

                  <div
                    className="col-span-12 mt-2 overflow-auto weight_h"
                    style={{ height: "400px" }}
                  >
                    <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
                      {Array.from({
                        length: parseInt(result?.tech_input_total || 0),
                      }).map((_, index) => (
                        <React.Fragment key={index}>
                          <div className="col-span-2">
                            <input
                              className="input"
                              type="text"
                              name={`name${index + 1}`}
                              placeholder="Name"
                              value={formData[`name${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              className="input"
                              type="number"
                              min="17"
                              max="56"
                              name={`age${index + 1}`}
                              placeholder="00"
                              value={formData[`age${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-2">
                            <select
                              name={`gender${index + 1}`}
                              className="input"
                              value={formData[`gender${index + 1}`] || ""}
                              onChange={handleChange}
                            >
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>
                          <div className="col-span-2">
                            <input
                              className="input"
                              type="number"
                              name={`push${index + 1}`}
                              placeholder="00"
                              value={formData[`push${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              className="input"
                              type="number"
                              name={`sit${index + 1}`}
                              placeholder="00"
                              value={formData[`sit${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              className="input"
                              type="number"
                              name={`height${index + 1}`}
                              placeholder="00"
                              value={formData[`height${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              className="input"
                              type="number"
                              name={`weight${index + 1}`}
                              placeholder="00"
                              value={formData[`weight${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              className="input"
                              type="text"
                              name={`2mile${index + 1}`}
                              placeholder="MM:SS"
                              value={formData[`2mile${index + 1}`] || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-12">
                    <p className="p-1">
                      <strong>{data?.payload?.tech_lang_keys["pass"]}</strong>
                    </p>
                    <select name="pass" className="input">
                      <option value="60">60% (Army)</option>
                      <option value="50">50% (BCT/RSP)</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="hidden"
                    step="any"
                    name="submit_type"
                    id="submit_type"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.submit_type}
                    onChange={handleChange}
                  />
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_method" className="label">
                      {data?.payload?.tech_lang_keys["for"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_method"
                        id="tech_method"
                        value={formData.tech_method}
                        onChange={handleChange}
                      >
                        <option value="score">
                          {data?.payload?.tech_lang_keys["score"]}
                        </option>
                        <option value="check">
                          {data?.payload?.tech_lang_keys["check"]}{" "}
                        </option>
                        {/* <option value="multi">{data?.payload?.tech_lang_keys["multi"]}</option> */}
                      </select>
                    </div>
                  </div>

                  {formData.tech_method == "score" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 age">
                        <label htmlFor="tech_age" className="label">
                          {data?.payload?.tech_lang_keys["Age"]}:
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
                            {data?.payload?.tech_lang_keys["year"]}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 age">
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
                              {data?.payload?.tech_lang_keys["female"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6 lg:col-span-6 score">
                        <label htmlFor="tech_push" className="label">
                          {data?.payload?.tech_lang_keys["push"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_push"
                            id="tech_push"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_push}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            2 / {data?.payload?.tech_lang_keys["mini"]}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 score">
                        <label htmlFor="tech_sit" className="label">
                          {data?.payload?.tech_lang_keys["sit"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_sit"
                            id="tech_sit"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_sit}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            2 / {data?.payload?.tech_lang_keys["mini"]}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-4 lg:col-span-4 score">
                        <label htmlFor="tech_min" className="label">
                          {data?.payload?.tech_lang_keys["2mil"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_min"
                            id="tech_min"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            min="0"
                            max="59"
                            value={formData.tech_min}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            {data?.payload?.tech_lang_keys["minute"]}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-2 lg:col-span-2 score">
                        <label htmlFor="tech_sec" className="label">
                          &nbsp;
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_sec"
                            id="tech_sec"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            min="0"
                            max="59"
                            value={formData.tech_sec}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            {data?.payload?.tech_lang_keys["sec"]}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.tech_method == "check" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 age">
                        <label htmlFor="tech_age" className="label">
                          {data?.payload?.tech_lang_keys["Age"]}:
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
                            {data?.payload?.tech_lang_keys["year"]}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 age">
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
                              {data?.payload?.tech_lang_keys["female"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.tech_method == "multi" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 multi ">
                        <label htmlFor="tech_number" className="label">
                          {data?.payload?.tech_lang_keys["nbr"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_number"
                            id="tech_number"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_number}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 multi ">
                        <label htmlFor="tech_weight" className="label">
                          {data?.payload?.tech_lang_keys["hw"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_weight"
                            id="tech_weight"
                            value={formData.tech_weight}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["dis"]}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["able"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
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
              {(result?.tech_disable !== "disable" ||
                result?.tech_enable === "") &&
                (result?.tech_disable === "" ||
                  result?.tech_enable !== "enable") && (
                  <>
                    <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                      <div>
                        <ResultActions lang={data?.payload?.tech_lang_keys} />
                        <div className="rounded-lg  flex items-center justify-center">
                          <div className="w-full mt-3">
                            <div className="w-full overflow-auto mt-2 text-[16px]">
                              {result?.tech_dis_res !== undefined ? (
                                <>
                                  <table className="w-full" cellspacing="0">
                                    <tbody>
                                      <tr className="bg-[#2845F5] text-white">
                                        <td className="rounded-l ps-4 pe-3 py-3">
                                          #
                                        </td>
                                        <td className="px-3">
                                          {data?.payload?.tech_lang_keys["s"]}{" "}
                                          <sub className="text-white">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "push"
                                              ]
                                            }{" "}
                                            (
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "rep"
                                              ]
                                            }
                                            )
                                          </sub>
                                        </td>
                                        <td className="px-3">
                                          {data?.payload?.tech_lang_keys["s"]}{" "}
                                          <sub className="text-white">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "sit"
                                              ]
                                            }{" "}
                                            (
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "rep"
                                              ]
                                            }
                                            )
                                          </sub>
                                        </td>
                                        <td className="px-3">
                                          {data?.payload?.tech_lang_keys["s"]}{" "}
                                          <sub className="text-white">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "2mil"
                                              ]
                                            }{" "}
                                            (MM:SS)
                                          </sub>
                                        </td>
                                        <td className="rounded-r px-3">
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "total"
                                            ]
                                          }
                                        </td>
                                      </tr>
                                      {result?.tech_output}
                                      <tr className="bg-[#2845F5] text-white">
                                        <td className="rounded-l ps-4 pe-3 py-3">
                                          {data?.payload?.tech_lang_keys["ave"]}
                                        </td>
                                        <td className="px-3">
                                          {Math.ceil(
                                            result?.tech_total_push /
                                              result?.tech_ave
                                          )}
                                        </td>
                                        <td className="px-3">
                                          {Math.ceil(
                                            result?.tech_total_sit /
                                              result?.tech_ave
                                          )}
                                        </td>
                                        <td className="px-3">
                                          {Math.ceil(
                                            result?.tech_total_run /
                                              result?.tech_ave
                                          )}
                                        </td>
                                        <td className="rounded-r px-3">
                                          {Math.ceil(
                                            result?.tech_total_score /
                                              result?.tech_ave
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </>
                              ) : result?.tech_able_res !== undefined ? (
                                <>
                                  <table className="w-full" cellspacing="0">
                                    <tbody>
                                      <tr className="bg-[#2845F5] text-white">
                                        <td className="rounded-l ps-4 pe-3 py-3">
                                          #
                                        </td>
                                        <td className="px-3">
                                          {data?.payload?.tech_lang_keys["s"]}{" "}
                                          <sub className="text-white">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "push"
                                              ]
                                            }{" "}
                                            (
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "rep"
                                              ]
                                            }
                                            )
                                          </sub>
                                        </td>
                                        <td className="px-3">
                                          {data?.payload?.tech_lang_keys["s"]}{" "}
                                          <sub className="text-white">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "sit"
                                              ]
                                            }{" "}
                                            (
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "rep"
                                              ]
                                            }
                                            )
                                          </sub>
                                        </td>
                                        <td className="px-3">
                                          {data?.payload?.tech_lang_keys["s"]}{" "}
                                          <sub className="text-white">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "2mil"
                                              ]
                                            }{" "}
                                            (MM:SS)
                                          </sub>
                                        </td>
                                        <td className="px-3">
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "total"
                                            ]
                                          }
                                        </td>
                                        <td className="rounded-r px-3">
                                          {data?.payload?.tech_lang_keys["w"]}{" "}
                                          (lbs)
                                        </td>
                                      </tr>
                                      {result?.tech_output}
                                      <tr className="bg-[#2845F5] text-white">
                                        <td className="rounded-l ps-4 pe-3 py-3">
                                          {data?.payload?.tech_lang_keys["ave"]}
                                        </td>
                                        <td className="px-3">
                                          {Math.ceil(
                                            result?.tech_total_push /
                                              result?.tech_ave
                                          )}
                                        </td>
                                        <td className="px-3">
                                          {Math.ceil(
                                            result?.tech_total_sit /
                                              result?.tech_ave
                                          )}
                                        </td>
                                        <td className="px-3">
                                          {Math.ceil(
                                            result?.tech_total_run /
                                              result?.tech_ave
                                          )}
                                        </td>
                                        <td className="px-3">
                                          {Math.ceil(
                                            result?.tech_total_score /
                                              result?.tech_ave
                                          )}
                                        </td>
                                        <td className="rounded-r px-3">
                                          &nbsp;
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </>
                              ) : (
                                <>
                                  {formData.tech_method == "score" ? (
                                    <>
                                      <div className="w-full overflow-auto mt-2">
                                        <table
                                          className="w-full"
                                          cellspacing="0"
                                        >
                                          <tbody>
                                            <tr className="bg-[#2845F5] text-white">
                                              <td className="rounded-l ps-4 pe-3 py-2">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "Activity"
                                                  ]
                                                }
                                              </td>
                                              <td className="px-3">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "rept"
                                                  ]
                                                }
                                              </td>
                                              <td className="px-3">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "pe"
                                                  ]
                                                }
                                              </td>
                                              <td className="rounded-r px-3">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "res"
                                                  ]
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b px-3 py-3">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "push"
                                                  ]
                                                }{" "}
                                                (
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "rep"
                                                  ]
                                                }
                                                )
                                              </td>
                                              <td className="border-b px-3">
                                                {formData?.tech_push}
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_push_s}
                                              </td>
                                              <td className="border-b px-3">
                                                <p
                                                  className={`text-center p-1 rounded-lg ${result?.tech_push_class}`}
                                                >
                                                  {result?.tech_push_s < 60
                                                    ? data?.payload
                                                        ?.tech_lang_keys["fail"]
                                                    : data?.payload
                                                        ?.tech_lang_keys[
                                                        "pass"
                                                      ]}
                                                </p>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b px-3 py-3">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "sit"
                                                  ]
                                                }{" "}
                                                (
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "rep"
                                                  ]
                                                }
                                                )
                                              </td>
                                              <td className="border-b px-3">
                                                {formData?.tech_sit}
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_sit_s}
                                              </td>
                                              <td className="border-b px-3">
                                                <p
                                                  className={`text-center p-1 rounded-lg ${result?.tech_sit_class}`}
                                                >
                                                  {result?.tech_push_s < 60
                                                    ? data?.payload
                                                        ?.tech_lang_keys["fail"]
                                                    : data?.payload
                                                        ?.tech_lang_keys[
                                                        "pass"
                                                      ]}
                                                </p>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b px-3 py-3">
                                                2 Mile Run (Time)
                                              </td>
                                              <td className="border-b px-3">
                                                {formData?.tech_min}:
                                                {formData?.tech_sec}
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_run_s}
                                              </td>
                                              <td className="border-b px-3">
                                                <p
                                                  className={`text-center p-1 rounded-lg ${result?.tech_run_class}`}
                                                >
                                                  {result?.tech_push_s < 60
                                                    ? data?.payload
                                                        ?.tech_lang_keys["fail"]
                                                    : data?.payload
                                                        ?.tech_lang_keys[
                                                        "pass"
                                                      ]}
                                                </p>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                className="border-b px-3 py-3"
                                                colSpan="2"
                                              >
                                                <strong>
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys["ts"]
                                                  }
                                                </strong>
                                              </td>
                                              <td className="border-b px-3">
                                                <strong>
                                                  {result?.tech_total}
                                                </strong>
                                              </td>
                                              <td className="border-b px-3">
                                                <p
                                                  className={`text-center p-1 rounded-lg ${result?.tech_total_class}`}
                                                >
                                                  {result?.tech_push_s < 60
                                                    ? data?.payload
                                                        ?.tech_lang_keys["fail"]
                                                    : data?.payload
                                                        ?.tech_lang_keys[
                                                        "pass"
                                                      ]}
                                                </p>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      <p className="w-full text-[20px] mt-3">
                                        <strong>
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "your"
                                            ]
                                          }{" "}
                                          &{" "}
                                          {data?.payload?.tech_lang_keys["min"]}
                                        </strong>
                                      </p>
                                      <div className="w-full overflow-auto mt-2">
                                        <table
                                          className="w-full"
                                          cellspacing="0"
                                        >
                                          <tbody>
                                            <tr className="bg-[#2845F5] text-white">
                                              <td className="rounded-l ps-4 pe-3 py-2">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "Activity"
                                                  ]
                                                }
                                              </td>
                                              <td className="px-3">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "your"
                                                  ]
                                                }
                                              </td>
                                              <td className="rounded-r px-3">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "min"
                                                  ]
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b px-3 py-3">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "push"
                                                  ]
                                                }
                                              </td>
                                              <td className="border-b px-3">
                                                {formData?.tech_push} (
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "rep"
                                                  ]
                                                }
                                                )
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_min_push} (
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "rep"
                                                  ]
                                                }
                                                )
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b px-3 py-3">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "sit"
                                                  ]
                                                }
                                              </td>
                                              <td className="border-b px-3">
                                                {formData?.tech_sit} (
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "rep"
                                                  ]
                                                }
                                                )
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_min_sit} (
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "rep"
                                                  ]
                                                }
                                                )
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b px-3 py-3">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "2mil"
                                                  ]
                                                }
                                              </td>
                                              <td className="border-b px-3">
                                                {formData?.tech_min}:
                                                {formData?.tech_sec} (MM:SS)
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_min_time} (MM:SS)
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <p className="w-full text-[20px]">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["min"]}
                                        </strong>
                                      </p>
                                      <div className="w-full overflow-auto mt-2">
                                        <table
                                          className="w-full"
                                          cellspacing="0"
                                        >
                                          <tbody>
                                            <tr className="bg-[#2845F5] text-white">
                                              <td className="rounded-l ps-4 pe-3"></td>
                                              <td className="px-3">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "push"
                                                  ]
                                                }
                                              </td>
                                              <td className="px-3">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "sit"
                                                  ]
                                                }
                                              </td>
                                              <td className="rounded-r px-3 py-2">
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "2mil"
                                                  ]
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b px-3 py-3">
                                                <strong>
                                                  APFT{" "}
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys["bad"]
                                                  }
                                                </strong>
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_b_push} (
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "rep"
                                                  ]
                                                }
                                                )
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_b_sit} (
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "rep"
                                                  ]
                                                }
                                                )
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_b_time} (MM:SS)
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b px-3 py-3">
                                                <strong>
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys["bt"]
                                                  }
                                                </strong>
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_basic_push} (
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "rep"
                                                  ]
                                                }
                                                )
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_basic_sit} (
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "rep"
                                                  ]
                                                }
                                                )
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_basic_time}{" "}
                                                (MM:SS)
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="border-b px-3 py-3">
                                                <strong>
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys["main"]
                                                  }
                                                </strong>
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_main_push} (
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "rep"
                                                  ]
                                                }
                                                )
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_main_sit} (
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "rep"
                                                  ]
                                                }
                                                )
                                              </td>
                                              <td className="border-b px-3">
                                                {result?.tech_main_time} (MM:SS)
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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

export default APFTCalculator;

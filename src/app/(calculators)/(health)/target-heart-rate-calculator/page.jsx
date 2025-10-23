"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTargetHeartRateCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TargetHeartRateCalculator = () => {
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
    tech_method: "4", // 1 2 3 4
    tech_formula: "2", // 1 2 3 4 56 7 8 9 10 11
    tech_age: "30",
    tech_rhr: 45,
    tech_hrr: 24,
    tech_mhr: 11,
    tech_rhrm: 22,
    tech_percent: 56,
    tech_ideal: "0.85",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTargetHeartRateCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_method == 1) {
      if (
        !formData.tech_method ||
        !formData.tech_formula ||
        !formData.tech_age ||
        !formData.tech_percent ||
        !formData.tech_ideal
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_method == 2) {
      if (
        !formData.tech_method ||
        !formData.tech_formula ||
        !formData.tech_age ||
        !formData.tech_rhr ||
        !formData.tech_percent ||
        !formData.tech_ideal
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_method == 3) {
      if (
        !formData.tech_method ||
        !formData.tech_mhr ||
        !formData.tech_rhr ||
        !formData.tech_percent ||
        !formData.tech_ideal
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_method ||
        !formData.tech_formula ||
        !formData.tech_age ||
        !formData.tech_hrr ||
        !formData.tech_percent ||
        !formData.tech_ideal
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method: formData.tech_method,
        tech_formula: formData.tech_formula,
        tech_age: formData.tech_age,
        tech_rhr: formData.tech_rhr,
        tech_hrr: formData.tech_hrr,
        tech_mhr: formData.tech_mhr,
        tech_rhrm: formData.tech_rhrm,
        tech_percent: formData.tech_percent,
        tech_ideal: formData.tech_ideal,
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
      tech_method: "4", // 1 2 3 4
      tech_formula: "2", // 1 2 3 4 56 7 8 9 10 11
      tech_age: "30",
      tech_rhr: 45,
      tech_hrr: 24,
      tech_mhr: 11,
      tech_rhrm: 22,
      tech_percent: 56,
      tech_ideal: "0.85",
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

  // resullt
  const method = formData?.tech_method;
  const mhr = result?.tech_mhr;
  const rhr = result?.tech_rhr;

  const getZoneRange = (low, high) => {
    if (method === "1") {
      return `${(mhr * low).toFixed(2)} - ${(mhr * high).toFixed(1)}`;
    } else if (["2", "3", "4"].includes(method)) {
      return `${((mhr - rhr) * low + rhr).toFixed(2)} - ${(
        (mhr - rhr) * high +
        rhr
      ).toFixed(1)}`;
    }
    return "";
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["method"]}:
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
                    <option value="1">
                      {data?.payload?.tech_lang_keys["basic"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["m_2"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["m_3"]}{" "}
                    </option>
                    <option value="4">Karvonen by Age & HRR </option>
                  </select>
                </div>
              </div>
              {formData.tech_method == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  mhr_formula">
                    <label htmlFor="tech_formula" className="label">
                      MHR {data?.payload?.tech_lang_keys["for"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_formula"
                        id="tech_formula"
                        value={formData.tech_formula}
                        onChange={handleChange}
                      >
                        <option value="1">
                          Haskell & Fox (basic, for men)
                        </option>
                        <option value="2">
                          Haskell & Fox (basic, for women){" "}
                        </option>
                        <option value="3">Robergs & Landwehr </option>
                        <option value="4">Londeree and Moeschberger </option>
                        <option value="5">Miller et al. </option>
                        <option value="6">Tanaka, Monahan, & Seals </option>
                        <option value="7">Jackson et al. </option>
                        <option value="8">Nes, et al. </option>
                        <option value="9">Gellish (for men) </option>
                        <option value="10">Gellish (for women) </option>
                        <option value="11">
                          Martha Gulati et al. (for women){" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 age">
                    <label htmlFor="tech_age" className="label">
                      {data?.payload?.tech_lang_keys["your"]}:
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_percent" className="label">
                      {data?.payload?.tech_lang_keys["desire"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_percent"
                        id="tech_percent"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        min="1"
                        max="100"
                        value={formData.tech_percent}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                    <label htmlFor="tech_ideal" className="label">
                      {data?.payload?.tech_lang_keys["train"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_ideal"
                        id="tech_ideal"
                        value={formData.tech_ideal}
                        onChange={handleChange}
                      >
                        <option value="0.65">
                          {data?.payload?.tech_lang_keys["bf"]}
                        </option>
                        <option value="0.75">
                          {data?.payload?.tech_lang_keys["sf"]}
                        </option>
                        <option value="0.85">
                          {data?.payload?.tech_lang_keys["tmax"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {formData.tech_method == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  mhr_formula">
                    <label htmlFor="tech_formula" className="label">
                      MHR {data?.payload?.tech_lang_keys["for"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_formula"
                        id="tech_formula"
                        value={formData.tech_formula}
                        onChange={handleChange}
                      >
                        <option value="1">
                          Haskell & Fox (basic, for men)
                        </option>
                        <option value="2">
                          Haskell & Fox (basic, for women){" "}
                        </option>
                        <option value="3">Robergs & Landwehr </option>
                        <option value="4">Londeree and Moeschberger </option>
                        <option value="5">Miller et al. </option>
                        <option value="6">Tanaka, Monahan, & Seals </option>
                        <option value="7">Jackson et al. </option>
                        <option value="8">Nes, et al. </option>
                        <option value="9">Gellish (for men) </option>
                        <option value="10">Gellish (for women) </option>
                        <option value="11">
                          Martha Gulati et al. (for women){" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 age">
                    <label htmlFor="tech_age" className="label">
                      {data?.payload?.tech_lang_keys["your"]}:
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 rhr">
                    <label htmlFor="tech_rhr" className="label">
                      RHR{" "}
                      <span
                        className="bg-white text-blue radius-circle px-2 ms-1"
                        title={data?.payload?.tech_lang_keys["rhr"]}
                      >
                        ?
                      </span>
                      :
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_rhr"
                        id="tech_rhr"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_rhr}
                        onChange={handleChange}
                      />
                      <span className="input_unit">bpm</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_percent" className="label">
                      {data?.payload?.tech_lang_keys["desire"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_percent"
                        id="tech_percent"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        min="1"
                        max="100"
                        value={formData.tech_percent}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                    <label htmlFor="tech_ideal" className="label">
                      {data?.payload?.tech_lang_keys["train"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_ideal"
                        id="tech_ideal"
                        value={formData.tech_ideal}
                        onChange={handleChange}
                      >
                        <option value="0.65">
                          {data?.payload?.tech_lang_keys["bf"]}
                        </option>
                        <option value="0.75">
                          {data?.payload?.tech_lang_keys["sf"]}
                        </option>
                        <option value="0.85">
                          {data?.payload?.tech_lang_keys["tmax"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {formData.tech_method == "3" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mhr">
                    <label htmlFor="tech_mhr" className="label">
                      MHR{" "}
                      <span
                        className="bg-white text-blue radius-circle px-2 ms-1"
                        title={data?.payload?.tech_lang_keys["mhr"]}
                      >
                        ?
                      </span>
                      :
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_mhr"
                        id="tech_mhr"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_mhr}
                        onChange={handleChange}
                      />
                      <span className="input_unit">bpm</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 rhr">
                    <label htmlFor="tech_rhr" className="label">
                      RHR{" "}
                      <span
                        className="bg-white text-blue radius-circle px-2 ms-1"
                        title={data?.payload?.tech_lang_keys["rhr"]}
                      >
                        ?
                      </span>
                      :
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_rhr"
                        id="tech_rhr"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_rhr}
                        onChange={handleChange}
                      />
                      <span className="input_unit">bpm</span>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_percent" className="label">
                      {data?.payload?.tech_lang_keys["desire"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_percent"
                        id="tech_percent"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        min="1"
                        max="100"
                        value={formData.tech_percent}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                    <label htmlFor="tech_ideal" className="label">
                      {data?.payload?.tech_lang_keys["train"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_ideal"
                        id="tech_ideal"
                        value={formData.tech_ideal}
                        onChange={handleChange}
                      >
                        <option value="0.65">
                          {data?.payload?.tech_lang_keys["bf"]}
                        </option>
                        <option value="0.75">
                          {data?.payload?.tech_lang_keys["sf"]}
                        </option>
                        <option value="0.85">
                          {data?.payload?.tech_lang_keys["tmax"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {formData.tech_method == "4" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  mhr_formula">
                    <label htmlFor="tech_formula" className="label">
                      MHR {data?.payload?.tech_lang_keys["for"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_formula"
                        id="tech_formula"
                        value={formData.tech_formula}
                        onChange={handleChange}
                      >
                        <option value="1">
                          Haskell & Fox (basic, for men)
                        </option>
                        <option value="2">
                          Haskell & Fox (basic, for women){" "}
                        </option>
                        <option value="3">Robergs & Landwehr </option>
                        <option value="4">Londeree and Moeschberger </option>
                        <option value="5">Miller et al. </option>
                        <option value="6">Tanaka, Monahan, & Seals </option>
                        <option value="7">Jackson et al. </option>
                        <option value="8">Nes, et al. </option>
                        <option value="9">Gellish (for men) </option>
                        <option value="10">Gellish (for women) </option>
                        <option value="11">
                          Martha Gulati et al. (for women){" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 age">
                    <label htmlFor="tech_age" className="label">
                      {data?.payload?.tech_lang_keys["your"]}:
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 rhr">
                    <label htmlFor="tech_hrr" className="label">
                      HRR{" "}
                      <span
                        className="bg-white text-blue radius-circle px-2 ms-1"
                        title={data?.payload?.tech_lang_keys["hrr"]}
                      >
                        ?
                      </span>
                      :
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_hrr"
                        id="tech_hrr"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_hrr}
                        onChange={handleChange}
                      />
                      <span className="input_unit">bpm</span>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_percent" className="label">
                      {data?.payload?.tech_lang_keys["desire"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_percent"
                        id="tech_percent"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        min="1"
                        max="100"
                        value={formData.tech_percent}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                    <label htmlFor="tech_ideal" className="label">
                      {data?.payload?.tech_lang_keys["train"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_ideal"
                        id="tech_ideal"
                        value={formData.tech_ideal}
                        onChange={handleChange}
                      >
                        <option value="0.65">
                          {data?.payload?.tech_lang_keys["bf"]}
                        </option>
                        <option value="0.75">
                          {data?.payload?.tech_lang_keys["sf"]}
                        </option>
                        <option value="0.85">
                          {data?.payload?.tech_lang_keys["tmax"]}
                        </option>
                      </select>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />
                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {(formData?.tech_method === "2" ||
                          formData?.tech_method === "3") && (
                          <div className="bg-sky bordered rounded-lg px-3 py-2 mt-2 lg:text-[16px] md:text-[16px] text-[14px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["hrr"]} (HRR) ={" "}
                            </strong>
                            <strong className="text-[#119154] lg:text-[28px] md:text-[28px] text-[20px] px-1">
                              {result?.tech_mhr - result?.tech_rhr}
                            </strong>
                            <strong>bpm</strong>
                          </div>
                        )}

                        {formData?.tech_method === "4" && (
                          <div className="bg-sky bordered rounded-lg px-3 py-2 mt-2 lg:text-[16px] md:text-[16px] text-[14px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["rhr"]} (RHR) ={" "}
                            </strong>
                            <strong className="text-[#119154] lg:text-[28px] md:text-[28px] text-[20px] px-1">
                              {result?.tech_rhr}
                            </strong>
                            <strong>bpm</strong>
                          </div>
                        )}

                        <div className="bg-sky bordered rounded-lg px-3 py-2 mt-2 lg:text-[16px] md:text-[16px] text-[14px]">
                          <strong>
                            {data?.payload?.tech_lang_keys["tar_des"]} ={" "}
                          </strong>
                          <strong className="text-[#119154] lg:text-[28px] md:text-[28px] text-[20px] px-1">
                            {formData?.tech_method === "1"
                              ? Number(
                                  result?.tech_mhr *
                                    (formData?.tech_percent / 100)
                                )
                              : Number(
                                  (result?.tech_mhr - result?.tech_rhr) *
                                    (formData?.tech_percent / 100) +
                                    result?.tech_rhr
                                )}
                          </strong>
                          <strong>bpm</strong>
                        </div>

                        <div className="bg-sky bordered rounded-lg px-3 py-2 mt-2 lg:text-[16px] md:text-[16px] text-[14px]">
                          <strong>
                            {data?.payload?.tech_lang_keys["ihr"]} ={" "}
                          </strong>
                          <strong className="text-[#119154] lg:text-[28px] md:text-[28px] text-[20px] px-1">
                            {formData?.tech_method === "1"
                              ? Number(result?.tech_mhr * formData?.tech_ideal)
                              : Number(
                                  (result?.tech_mhr - result?.tech_rhr) *
                                    formData?.tech_ideal +
                                    result?.tech_rhr
                                )}
                          </strong>
                          <strong>bpm</strong>
                        </div>

                        <div className="bg-sky bordered rounded-lg px-3 py-2 mt-2 lg:text-[16px] md:text-[16px] text-[14px]">
                          <strong>
                            {data?.payload?.tech_lang_keys["mhr"]} (MHR) =
                          </strong>
                          <strong className="text-[#119154] lg:text-[28px] md:text-[28px] text-[20px] px-1">
                            {result?.tech_mhr}
                          </strong>
                          <strong>bpm</strong>
                        </div>
                        <div className="w-full overflow-auto mt-4">
                          <table className="w-full" cellSpacing="0">
                            <tbody>
                              {method !== "1" && (
                                <>
                                  <tr className="bg-[#2845F5] text-white">
                                    <td
                                      className="text-center border-b-4 border-indigo-500 ps-4 px-3 py-2"
                                      colSpan="3"
                                    >
                                      {data?.payload?.tech_lang_keys["chat1"]}
                                    </td>
                                  </tr>
                                </>
                              )}
                              <tr className="bg-[#2845F5] text-white">
                                <td className="ps-4 px-3 py-2">
                                  {data?.payload?.tech_lang_keys["target"]}
                                </td>
                                <td className="px-3">
                                  % {data?.payload?.tech_lang_keys["in"]}
                                </td>
                                <td className="px-3">
                                  {data?.payload?.tech_lang_keys["thr"]}
                                </td>
                              </tr>

                              {/* ZONE ROWS */}
                              <tr>
                                <td className="border-b px-3 py-2">
                                  {data?.payload?.tech_lang_keys["max"]}{" "}
                                  <strong>
                                    VO<sub>2</sub>{" "}
                                    {data?.payload?.tech_lang_keys["max_z"]}
                                  </strong>
                                </td>
                                <td className="border-b px-3 py-2">
                                  90% - 100%
                                </td>
                                <td className="border-b px-3 py-2">
                                  <strong>{getZoneRange(0.9, 1)}</strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b px-3 py-2">
                                  {data?.payload?.tech_lang_keys["Hard"]}{" "}
                                  <strong>
                                    {data?.payload?.tech_lang_keys["an_zone"]}
                                  </strong>
                                </td>
                                <td className="border-b px-3 py-2">
                                  80% - 90%
                                </td>
                                <td className="border-b px-3 py-2">
                                  <strong>{getZoneRange(0.8, 0.9)}</strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b px-3 py-2">
                                  {data?.payload?.tech_lang_keys["mod"]}{" "}
                                  <strong>
                                    {data?.payload?.tech_lang_keys["ar_zone"]}
                                  </strong>
                                </td>
                                <td className="border-b px-3 py-2">
                                  70% - 80%
                                </td>
                                <td className="border-b px-3 py-2">
                                  <strong>{getZoneRange(0.7, 0.8)}</strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b px-3 py-2">
                                  {data?.payload?.tech_lang_keys["Light"]}{" "}
                                  <strong>
                                    {data?.payload?.tech_lang_keys["fat_zone"]}
                                  </strong>
                                </td>
                                <td className="border-b px-3 py-2">
                                  60% - 70%
                                </td>
                                <td className="border-b px-3 py-2">
                                  <strong>{getZoneRange(0.6, 0.7)}</strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="px-3 py-2">
                                  {data?.payload?.tech_lang_keys["v_light"]}{" "}
                                  <strong>
                                    {data?.payload?.tech_lang_keys["w_zone"]}
                                  </strong>
                                </td>
                                <td className="px-3 py-2">50% - 60%</td>
                                <td className="px-3 py-2">
                                  <strong>{getZoneRange(0.5, 0.6)}</strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full overflow-auto mt-4">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-[#2845F5] text-white">
                                <td
                                  className="text-center border-b-2 border-white rounded-t-lg px-4 py-2"
                                  colSpan="3"
                                >
                                  {data?.payload?.tech_lang_keys["chart2"]}
                                </td>
                              </tr>
                              <tr className="bg-[#2845F5] text-white">
                                <td className="rounded-bl-lg px-4 py-2">
                                  {data?.payload?.tech_lang_keys["target"]}
                                </td>
                                <td className="px-4 py-2">
                                  % {data?.payload?.tech_lang_keys["in"]}
                                </td>
                                <td className="rounded-br-lg px-4 py-2">
                                  {data?.payload?.tech_lang_keys["thr"]}
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border-b px-4 py-2">
                                  {data?.payload?.tech_lang_keys["max"]}{" "}
                                  <strong>
                                    VO<sub>2</sub>{" "}
                                    {data?.payload?.tech_lang_keys["max_z"]}
                                  </strong>
                                </td>
                                <td className="border-b px-4 py-2">
                                  {(
                                    ((result?.tech_mhr - 15) /
                                      result?.tech_mhr) *
                                    100
                                  ).toFixed(0)}
                                  % - {(100).toFixed(0)}%
                                </td>
                                <td className="border-b px-4 py-2">
                                  <strong>
                                    {result?.tech_mhr - 15} - {result?.tech_mhr}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b px-4 py-2">
                                  {data?.payload?.tech_lang_keys["Hard"]}{" "}
                                  <strong>
                                    {data?.payload?.tech_lang_keys["an_zone"]}
                                  </strong>
                                </td>
                                <td className="border-b px-4 py-2">
                                  {(
                                    ((result?.tech_mhr - 25) /
                                      result?.tech_mhr) *
                                    100
                                  ).toFixed(0)}
                                  % -{" "}
                                  {(
                                    ((result?.tech_mhr - 15) /
                                      result?.tech_mhr) *
                                    100
                                  ).toFixed(0)}
                                  %
                                </td>
                                <td className="border-b px-4 py-2">
                                  <strong>
                                    {result?.tech_mhr - 25} -{" "}
                                    {result?.tech_mhr - 15}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b px-4 py-2">
                                  {data?.payload?.tech_lang_keys["mod"]}{" "}
                                  <strong>
                                    {data?.payload?.tech_lang_keys["ar_zone"]}
                                  </strong>
                                </td>
                                <td className="border-b px-4 py-2">
                                  {(
                                    ((result?.tech_mhr - 35) /
                                      result?.tech_mhr) *
                                    100
                                  ).toFixed(0)}
                                  % -{" "}
                                  {(
                                    ((result?.tech_mhr - 25) /
                                      result?.tech_mhr) *
                                    100
                                  ).toFixed(0)}
                                  %
                                </td>
                                <td className="border-b px-4 py-2">
                                  <strong>
                                    {result?.tech_mhr - 35} -{" "}
                                    {result?.tech_mhr - 25}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b px-4 py-2">
                                  {data?.payload?.tech_lang_keys["Light"]}{" "}
                                  <strong>
                                    {data?.payload?.tech_lang_keys["fat_zone"]}
                                  </strong>
                                </td>
                                <td className="border-b px-4 py-2">
                                  {(
                                    ((result?.tech_mhr - 45) /
                                      result?.tech_mhr) *
                                    100
                                  ).toFixed(0)}
                                  % -{" "}
                                  {(
                                    ((result?.tech_mhr - 35) /
                                      result?.tech_mhr) *
                                    100
                                  ).toFixed(0)}
                                  %
                                </td>
                                <td className="border-b px-4 py-2">
                                  <strong>
                                    {result?.tech_mhr - 45} -{" "}
                                    {result?.tech_mhr - 35}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2">
                                  {data?.payload?.tech_lang_keys["v_light"]}{" "}
                                  <strong>
                                    {data?.payload?.tech_lang_keys["w_zone"]}
                                  </strong>
                                </td>
                                <td className="px-4 py-2">
                                  {(
                                    ((result?.tech_mhr - 55) /
                                      result?.tech_mhr) *
                                    100
                                  ).toFixed(0)}
                                  % -{" "}
                                  {(
                                    ((result?.tech_mhr - 45) /
                                      result?.tech_mhr) *
                                    100
                                  ).toFixed(0)}
                                  %
                                </td>
                                <td className="px-4 py-2">
                                  <strong>
                                    {result?.tech_mhr - 55} -{" "}
                                    {result?.tech_mhr - 45}
                                  </strong>
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

export default TargetHeartRateCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDistanceFormulaCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DistanceFormulaCalculator = () => {
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
    tech_type: "2P", // 2P 3P  PS  PL
    tech_dimen: "1D",
    tech_2px1: "1",
    tech_2px2: "2",
    tech_3px1: "1",
    tech_3px2: "2",
    tech_3px3: "3",
    tech_x1: "1",
    tech_y1: "2",
    tech_m: "5",
    tech_b: "3",
    tech_m2: "2",
    tech_b2: "4",
    tech_3x1: "1",
    tech_3y1: "2",
    tech_3z1: "3",
    tech_4x1: "1",
    tech_4y1: "2",
    tech_4z1: "3",
    tech_4k1: "4",
    tech_x2: "3",
    tech_y2: "4",
    tech_3x2: "4",
    tech_3y2: "5",
    tech_3z2: "6",
    tech_4x2: "5",
    tech_4y2: "6",
    tech_4z2: "7",
    tech_4k2: "8",
    tech_x3: "5",
    tech_y3: "6",
    tech_3x3: "1",
    tech_3y3: "2",
    tech_3z3: "3",
    tech_4x3: "1",
    tech_4y3: "2",
    tech_4z3: "3",
    tech_4k3: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDistanceFormulaCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_dimen: formData.tech_dimen,
        tech_2px1: formData.tech_2px1,
        tech_2px2: formData.tech_2px2,
        tech_3px1: formData.tech_3px1,
        tech_3px2: formData.tech_3px2,
        tech_3px3: formData.tech_3px3,
        tech_x1: formData.tech_x1,
        tech_y1: formData.tech_y1,
        tech_m: formData.tech_m,
        tech_b: formData.tech_b,
        tech_m2: formData.tech_m2,
        tech_b2: formData.tech_b2,
        tech_3x1: formData.tech_3x1,
        tech_3y1: formData.tech_3y1,
        tech_3z1: formData.tech_3z1,
        tech_4x1: formData.tech_4x1,
        tech_4y1: formData.tech_4y1,
        tech_4z1: formData.tech_4z1,
        tech_4k1: formData.tech_4k1,
        tech_x2: formData.tech_x2,
        tech_y2: formData.tech_y2,
        tech_3x2: formData.tech_3x2,
        tech_3y2: formData.tech_3y2,
        tech_3z2: formData.tech_3z2,
        tech_4x2: formData.tech_4x2,
        tech_4y2: formData.tech_4y2,
        tech_4z2: formData.tech_4z2,
        tech_4k2: formData.tech_4k2,
        tech_x3: formData.tech_x3,
        tech_y3: formData.tech_y3,
        tech_3x3: formData.tech_3x3,
        tech_3y3: formData.tech_3y3,
        tech_3z3: formData.tech_3z3,
        tech_4x3: formData.tech_4x3,
        tech_4y3: formData.tech_4y3,
        tech_4z3: formData.tech_4z3,
        tech_4k3: formData.tech_4k3,
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
      tech_type: "2P", // 2P 3P  PS  PL
      tech_dimen: "1D",
      tech_2px1: "1",
      tech_2px2: "2",
      tech_3px1: "1",
      tech_3px2: "2",
      tech_3px3: "3",
      tech_x1: "1",
      tech_y1: "2",
      tech_m: "5",
      tech_b: "3",
      tech_m2: "2",
      tech_b2: "4",
      tech_3x1: "1",
      tech_3y1: "2",
      tech_3z1: "3",
      tech_4x1: "1",
      tech_4y1: "2",
      tech_4z1: "3",
      tech_4k1: "4",
      tech_x2: "3",
      tech_y2: "4",
      tech_3x2: "4",
      tech_3y2: "5",
      tech_3z2: "6",
      tech_4x2: "5",
      tech_4y2: "6",
      tech_4z2: "7",
      tech_4k2: "8",
      tech_x3: "5",
      tech_y3: "6",
      tech_3x3: "1",
      tech_3y3: "2",
      tech_3z3: "3",
      tech_4x3: "1",
      tech_4y3: "2",
      tech_4z3: "3",
      tech_4k3: "4",
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

  // result
  const m = formData?.tech_m;
  const b = formData?.tech_b;
  const m2 = formData?.tech_m2;
  const b2 = formData?.tech_b2;

  // Calculate denominator and fraction with JS for clarity
  const denominator = Math.sqrt(Math.pow(m, 2) + 1);
  const numerator = b2 - b;
  const fraction = numerator / denominator;

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
            <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
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
                    <option value="2P">
                      2 {data?.payload?.tech_lang_keys["point"]}{" "}
                    </option>
                    <option value="3P">
                      3 {data?.payload?.tech_lang_keys["point"]}{" "}
                    </option>
                    <option value="PS">
                      {data?.payload?.tech_lang_keys["sl"]}{" "}
                    </option>
                    <option value="PL">
                      {data?.payload?.tech_lang_keys["pl"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 dimen">
                <label htmlFor="tech_dimen" className="label">
                  {data?.payload?.tech_lang_keys["dim"]}:
                </label>
                <div className="mt-2">
                  <select
                    className={`input ${
                      formData.tech_type === "PS" || formData.tech_type === "PL"
                        ? "cursor-not-allowed bg-gray-200"
                        : ""
                    }`}
                    aria-label="select"
                    name="tech_dimen"
                    id="tech_dimen"
                    disabled={
                      formData.tech_type === "PS" || formData.tech_type === "PL"
                    } // disable condition
                    value={formData.tech_dimen}
                    onChange={handleChange}
                  >
                    <option value="1D">1D </option>
                    <option value="2D">2D </option>
                    <option value="3D">3D </option>
                    <option value="4D">4D </option>
                  </select>
                </div>
              </div>
            </div>
            {formData.tech_type == "2P" && formData.tech_dimen == "1D" && (
              <>
                <div className="grid grid-cols-2  mt-2 gap-4 twopoint1">
                  <div className="space-y-2">
                    <label htmlFor="tech_2px1" className="label">
                      {data?.payload?.tech_lang_keys["f_point"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_2px1"
                        id="tech_2px1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="x₁"
                        value={formData.tech_2px1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tech_2px2" className="label">
                      {data?.payload?.tech_lang_keys["s_point"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_2px2"
                        id="tech_2px2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="x₂"
                        value={formData.tech_2px2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {formData.tech_type == "3P" && formData.tech_dimen == "1D" && (
              <>
                <div className="grid grid-cols-3 mt-2  gap-4 threepoint1">
                  <div className="space-y-2">
                    <label htmlFor="tech_3px1" className="label">
                      {data?.payload?.tech_lang_keys["f_point"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_3px1"
                        id="tech_3px1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="x₁"
                        value={formData.tech_3px1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tech_3px2" className="label">
                      {data?.payload?.tech_lang_keys["s_point"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_3px2"
                        id="tech_3px2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="x₂"
                        value={formData.tech_3px2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tech_3px3" className="label">
                      {data?.payload?.tech_lang_keys["t_point"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_3px3"
                        id="tech_3px3"
                        className="input my-2"
                        aria-label="input"
                        placeholder="x₃"
                        value={formData.tech_3px3}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {(formData.tech_type == "PS" ||
              (formData.tech_type == "2P" && formData.tech_dimen == "2D") ||
              (formData.tech_type == "3P" && formData.tech_dimen == "2D")) && (
              <>
                <div className="grid grid-cols-1 mt-2  gap-4 threepoint2d twopoint2d sline">
                  <p className="text-[14px] text-blue-800 py-2">
                    {data?.payload?.tech_lang_keys["f_point"]}:
                  </p>
                </div>
                <div className="grid grid-cols-2 mt-2  gap-4 threepoint2d twopoint2d sline">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_x1"
                      id="tech_x1"
                      className="input my-2"
                      aria-label="input"
                      placeholder="x₁"
                      value={formData.tech_x1}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_y1"
                      id="tech_y1"
                      className="input my-2"
                      aria-label="input"
                      placeholder="y₁"
                      value={formData.tech_y1}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {(formData.tech_type == "PL" || formData.tech_type == "PS") && (
              <>
                <div className="grid grid-cols-1 mt-2  gap-4 sline pline">
                  <p className="text-[14px] text-blue-800 py-2">
                    {data?.payload?.tech_lang_keys["line"]} [y = mx + b]:
                  </p>
                </div>
                <div className="grid grid-cols-2 mt-2  gap-4 sline pline">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_m"
                      id="tech_m"
                      className="input my-2"
                      aria-label="input"
                      placeholder="m"
                      value={formData.tech_m}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_b"
                      id="tech_b"
                      className="input my-2"
                      aria-label="input"
                      placeholder="b"
                      value={formData.tech_b}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}
            {formData.tech_type == "PL" && (
              <>
                <div className="grid grid-cols-1 mt-2  gap-4 pline">
                  <p className="py-2 text-[14px] text-blue-800">
                    {data?.payload?.tech_lang_keys["sline"]} [y = m₂x + b₂]:
                  </p>
                </div>
                <div className="grid grid-cols-2 mt-2  gap-4 pline">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_m2"
                      id="tech_m2"
                      className="input my-2"
                      aria-label="input"
                      placeholder="m₂"
                      value={formData.tech_m2}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_b2"
                      id="tech_b2"
                      className="input my-2"
                      aria-label="input"
                      placeholder="b₂"
                      value={formData.tech_b2}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {((formData.tech_type == "2P" && formData.tech_dimen == "3D") ||
              (formData.tech_type == "3P" && formData.tech_dimen == "3D")) && (
              <>
                <div className="grid grid-cols-1 mt-2  gap-4 twopoint3d">
                  <p className="py-2 text-[14px] text-blue-800">
                    {data?.payload?.tech_lang_keys["f_point"]}:
                  </p>
                </div>
                <div className="grid grid-cols-3 mt-2  gap-4 twopoint3d">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_3x1"
                      id="tech_3x1"
                      className="input my-2"
                      aria-label="input"
                      placeholder="x₁"
                      value={formData.tech_3x1}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_3y1"
                      id="tech_3y1"
                      className="input my-2"
                      aria-label="input"
                      placeholder="y₁"
                      value={formData.tech_3y1}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_3z1"
                      id="tech_3z1"
                      className="input my-2"
                      aria-label="input"
                      placeholder="z₁"
                      value={formData.tech_3z1}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {((formData.tech_type == "2P" && formData.tech_dimen == "4D") ||
              (formData.tech_type == "3P" && formData.tech_dimen == "4D")) && (
              <>
                <div className="grid grid-cols-1 mt-2  gap-4 twopoint4d">
                  <p className="py-2 text-[14px] text-blue-800">
                    {data?.payload?.tech_lang_keys["f_point"]}:
                  </p>
                </div>
                <div className="grid grid-cols-4 mt-2  gap-4 twopoint4d">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_4x1"
                      id="tech_4x1"
                      className="input my-2"
                      aria-label="input"
                      placeholder="x₁"
                      value={formData.tech_4x1}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_4y1"
                      id="tech_4y1"
                      className="input my-2"
                      aria-label="input"
                      placeholder="y₁"
                      value={formData.tech_4y1}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_4z1"
                      id="tech_4z1"
                      className="input my-2"
                      aria-label="input"
                      placeholder="z₁"
                      value={formData.tech_4z1}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_4k1"
                      id="tech_4k1"
                      className="input my-2"
                      aria-label="input"
                      placeholder="k₁"
                      value={formData.tech_4k1}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}
            {((formData.tech_type == "2P" && formData.tech_dimen == "2D") ||
              (formData.tech_type == "3P" && formData.tech_dimen == "2D")) && (
              <>
                <div className="grid grid-cols-1 mt-2  gap-4 twopoint2d">
                  <p className="py-2 text-[14px] text-blue-800">
                    {data?.payload?.tech_lang_keys["s_point"]}:
                  </p>
                </div>
                <div className="grid grid-cols-2 mt-2  gap-4 twopoint2d">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_x2"
                      id="tech_x2"
                      className="input my-2"
                      aria-label="input"
                      placeholder="x₂"
                      value={formData.tech_x2}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_y2"
                      id="tech_y2"
                      className="input my-2"
                      aria-label="input"
                      placeholder="y₂"
                      value={formData.tech_y2}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {((formData.tech_type == "2P" && formData.tech_dimen == "3D") ||
              (formData.tech_type == "3P" && formData.tech_dimen == "3D")) && (
              <>
                <div className="grid grid-cols-1 mt-2  gap-4 twopoint3d">
                  <p className="py-2 text-[14px] text-blue-800">
                    {data?.payload?.tech_lang_keys["s_point"]}:
                  </p>
                </div>
                <div className="grid grid-cols-3 mt-2  gap-4 twopoint3d">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_3x2"
                      id="tech_3x2"
                      className="input my-2"
                      aria-label="input"
                      placeholder="x₂"
                      value={formData.tech_3x2}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_3y2"
                      id="tech_3y2"
                      className="input my-2"
                      aria-label="input"
                      placeholder="y₂"
                      value={formData.tech_3y2}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_3z2"
                      id="tech_3z2"
                      className="input my-2"
                      aria-label="input"
                      placeholder="z₂"
                      value={formData.tech_3z2}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {((formData.tech_type == "2P" && formData.tech_dimen == "4D") ||
              (formData.tech_type == "3P" && formData.tech_dimen == "4D")) && (
              <>
                <div className="grid grid-cols-1 mt-2  gap-4 twopoint4d">
                  <p className="py-2 text-[14px] text-blue-800">
                    {data?.payload?.tech_lang_keys["s_point"]}:
                  </p>
                </div>
                <div className="grid grid-cols-4 mt-2  gap-4 twopoint4d">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_4x2"
                      id="tech_4x2"
                      className="input my-2"
                      aria-label="input"
                      placeholder="x₂"
                      value={formData.tech_4x2}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_4y2"
                      id="tech_4y2"
                      className="input my-2"
                      aria-label="input"
                      placeholder="y₂"
                      value={formData.tech_4y2}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_4z2"
                      id="tech_4z2"
                      className="input my-2"
                      aria-label="input"
                      placeholder="z₂"
                      value={formData.tech_4z2}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_4k2"
                      id="tech_4k2"
                      className="input my-2"
                      aria-label="input"
                      placeholder="k₂"
                      value={formData.tech_4k2}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {formData.tech_type == "3P" && formData.tech_dimen == "2D" && (
              <>
                <div className="grid grid-cols-1 mt-2  gap-4 threepoint2d">
                  <p className="py-2 text-[14px] text-blue-800">
                    {data?.payload?.tech_lang_keys["t_point"]}:
                  </p>
                </div>
                <div className="grid grid-cols-2 mt-2  gap-4 threepoint2d">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_x3"
                      id="tech_x3"
                      className="input my-2"
                      aria-label="input"
                      placeholder="x₃"
                      value={formData.tech_x3}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_y3"
                      id="tech_y3"
                      className="input my-2"
                      aria-label="input"
                      placeholder="x₃"
                      value={formData.tech_y3}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {formData.tech_type == "3P" && formData.tech_dimen == "3D" && (
              <>
                <div className="grid grid-cols-1 mt-2  gap-4 threepoint3d">
                  <p className="py-2 text-[14px] text-blue-800">
                    {data?.payload?.tech_lang_keys["t_point"]}:
                  </p>
                </div>
                <div className="grid grid-cols-3 mt-2  gap-4 threepoint3d">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_3x3"
                      id="tech_3x3"
                      className="input my-2"
                      aria-label="input"
                      placeholder="x₃"
                      value={formData.tech_3x3}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_3y3"
                      id="tech_3y3"
                      className="input my-2"
                      aria-label="input"
                      placeholder="x₃"
                      value={formData.tech_3y3}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_3z3"
                      id="tech_3z3"
                      className="input my-2"
                      aria-label="input"
                      placeholder="z₃"
                      value={formData.tech_3z3}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {formData.tech_type == "3P" && formData.tech_dimen == "4D" && (
              <>
                <div className="grid grid-cols-1 mt-2  gap-4 threepoint4d">
                  <p className="py-2 text-[14px] text-blue-800">
                    {data?.payload?.tech_lang_keys["t_point"]}:
                  </p>
                </div>
                <div className="grid grid-cols-4 mt-2  gap-4 threepoint4d">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_4x3"
                      id="tech_4x3"
                      className="input my-2"
                      aria-label="input"
                      placeholder="x₃"
                      value={formData.tech_4x3}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_4y3"
                      id="tech_4y3"
                      className="input my-2"
                      aria-label="input"
                      placeholder="x₃"
                      value={formData.tech_4y3}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_4z3"
                      id="tech_4z3"
                      className="input my-2"
                      aria-label="input"
                      placeholder="z₃"
                      value={formData.tech_4z3}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="any"
                      name="tech_4k3"
                      id="tech_4k3"
                      className="input my-2"
                      aria-label="input"
                      placeholder="k₃"
                      value={formData.tech_4k3}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}
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
              <div className="w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
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

                  <div className="rounded-lg items-center justify-center">
                    <div className="w-full bg-light-blue  p-3 radius-10 mt-3 overflow-auto">
                      {formData?.tech_type == "PS" && (
                        <>
                          <p className="font-s-25">
                            {data?.payload?.tech_lang_keys["dis"]} ={" "}
                            <strong className="text-blue">
                              {result?.tech_ans}
                            </strong>
                          </p>
                          <p className="font-s-20 text-start font-bold">
                            {data?.payload?.tech_lang_keys["sol"]}:
                          </p>
                          <p className="mt-2">
                            (x₁ , y₁) = ({formData?.tech_x1},{" "}
                            {formData?.tech_y1})
                          </p>
                          <p className="mt-2">
                            (m , b) = ({formData?.tech_m}, {formData?.tech_b})
                          </p>

                          <BlockMath
                            math={`d = \\frac{|mx_1 - y_1 + b|}{\\sqrt{m^2 + 1^2}}`}
                          />

                          <BlockMath
                            math={`d = \\frac{|(${formData?.tech_m} \\times ${formData?.tech_x1}) - (${formData?.tech_y1}) + (${formData?.tech_b})|}{\\sqrt{(${formData?.tech_m})^2 + 1^2}}`}
                          />

                          <BlockMath
                            math={`d = \\frac{|${
                              formData?.tech_m * formData?.tech_x1
                            } - ${formData?.tech_y1} + ${
                              formData?.tech_b
                            }|}{\\sqrt{${formData?.tech_m}^2 + 1}}`}
                          />

                          <BlockMath
                            math={`d = \\frac{${Math.abs(
                              formData?.tech_m * formData?.tech_x1 -
                                formData?.tech_y1 +
                                formData?.tech_b
                            )}}{${Math.sqrt(
                              Math.pow(formData?.tech_m, 2) + 1
                            ).toFixed(4)}}`}
                          />

                          <p className="mt-2">
                            <InlineMath math={`d = ${result?.tech_ans}`} />
                          </p>
                        </>
                      )}
                      {formData?.tech_type == "PL" && (
                        <>
                          <p className="font-s-25">
                            {data?.payload?.tech_lang_keys["dis"]} ={" "}
                            <strong className="text-blue">
                              {result?.tech_ans}
                            </strong>
                          </p>
                          <p className="font-s-20 text-start font-bold">
                            {data?.payload?.tech_lang_keys["sol"]}:
                          </p>
                          <p className="mt-2">
                            (m₂ , b₂) = ({m2}, {b2})
                          </p>
                          <p className="mt-2">
                            (m , b) = ({m}, {b})
                          </p>

                          <BlockMath
                            math={`d = \\frac{b_2 - b}{\\sqrt{m^2 + 1^2}}`}
                          />

                          <BlockMath
                            math={`d = \\frac{${b2} - ${b}}{\\sqrt{${m}^2 + 1^2}}`}
                          />

                          <BlockMath
                            math={`d = \\frac{${b2} - ${b}}{\\sqrt{${Math.pow(
                              m,
                              2
                            )}} + 1}`}
                          />

                          <BlockMath
                            math={`d = \\frac{${b2} - ${b}}{${denominator.toFixed(
                              4
                            )}}`}
                          />

                          <p className="mt-2">
                            <InlineMath math={`d = ${result?.tech_ans}`} />
                          </p>
                        </>
                      )}
                      {formData?.tech_type == "2P" &&
                        formData?.tech_dimen == "1D" && (
                          <>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]} ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans}
                              </strong>
                            </p>
                            <p className="font-s-20 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["sol"]}:
                              </strong>
                            </p>
                            <p className="mt-2">
                              (x₁ , x₂) = ({formData?.tech_2px1},{" "}
                              {formData?.tech_2px2})
                            </p>
                            <p className="mt-2">
                              <InlineMath math={`d = \\sqrt{(x_2 - x_1)^2}`} />
                            </p>
                            <p className="mt-2">
                              <InlineMath
                                math={`d = \\sqrt{(${formData?.tech_2px2} - (${formData?.tech_2px1}))^2}`}
                              />
                            </p>
                            <p className="mt-2">
                              <InlineMath
                                math={`d = \\sqrt{(${
                                  formData?.tech_2px2 - formData?.tech_2px1
                                })^2}`}
                              />
                            </p>
                            <p className="mt-2">
                              <InlineMath math={`d = ${result?.tech_ans}`} />
                            </p>
                          </>
                        )}
                      {formData?.tech_type == "2P" &&
                        formData?.tech_dimen == "2D" && (
                          <>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]} ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans}
                              </strong>
                            </p>
                            <p className="font-s-20 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["sol"]}:
                              </strong>
                            </p>
                            <p className="mt-2">
                              (x₁ , x₂) = ({formData?.tech_x1},{" "}
                              {formData?.tech_x2})
                            </p>
                            <p className="mt-2">
                              (y₁ , y₂) = ({formData?.tech_y1},{" "}
                              {formData?.tech_y2})
                            </p>

                            <p className="mt-2">
                              <InlineMath
                                math={`d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`}
                              />
                            </p>
                            <p className="mt-2">
                              <InlineMath
                                math={`d = \\sqrt{(${formData?.tech_x2} - ${formData?.tech_x1})^2 + (${formData?.tech_y2} - ${formData?.tech_y1})^2}`}
                              />
                            </p>
                            <p className="mt-2">
                              <InlineMath
                                math={`d = \\sqrt{(${
                                  formData?.tech_x2 - formData?.tech_x1
                                })^2 + (${
                                  formData?.tech_y2 - formData?.tech_y1
                                })^2}`}
                              />
                            </p>
                            <p className="mt-2">
                              <InlineMath
                                math={`d = \\sqrt{${Math.pow(
                                  formData?.tech_x2 - formData?.tech_x1,
                                  2
                                )} + ${Math.pow(
                                  formData?.tech_y2 - formData?.tech_y1,
                                  2
                                )}}`}
                              />
                            </p>
                            <p className="mt-2">
                              <InlineMath
                                math={`d = \\sqrt{${
                                  Math.pow(
                                    formData?.tech_x2 - formData?.tech_x1,
                                    2
                                  ) +
                                  Math.pow(
                                    formData?.tech_y2 - formData?.tech_y1,
                                    2
                                  )
                                }}`}
                              />
                            </p>
                            <p className="mt-2">
                              <InlineMath math={`d = ${result?.tech_ans}`} />
                            </p>
                          </>
                        )}
                      {formData?.tech_type == "2P" &&
                        formData?.tech_dimen == "3D" && (
                          <>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]} ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans}
                              </strong>
                            </p>
                            <p className="font-s-20 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["sol"]}:
                              </strong>
                            </p>
                            <p className="mt-2">
                              (x₁ , x₂) = ({formData?.tech_3x1},{" "}
                              {formData?.tech_3x2})
                            </p>
                            <p className="mt-2">
                              (y₁ , y₂) = ({formData?.tech_3y1},{" "}
                              {formData?.tech_3y2})
                            </p>
                            <p className="mt-2">
                              (z₁ , z₂) = ({formData?.tech_3z1},{" "}
                              {formData?.tech_3z2})
                            </p>

                            <p className="mt-2">
                              <InlineMath
                                math={`d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}`}
                              />
                            </p>
                            <p className="mt-2">
                              <InlineMath
                                math={`d = \\sqrt{(${formData?.tech_3x2} - ${formData?.tech_3x1})^2 + (${formData?.tech_3y2} - ${formData?.tech_3y1})^2 + (${formData?.tech_3z2} - ${formData?.tech_3z1})^2}`}
                              />
                            </p>
                            <p className="mt-2">
                              <InlineMath
                                math={`d = \\sqrt{(${
                                  formData?.tech_3x2 - formData?.tech_3x1
                                })^2 + (${
                                  formData?.tech_3y2 - formData?.tech_3y1
                                })^2 + (${
                                  formData?.tech_3z2 - formData?.tech_3z1
                                })^2}`}
                              />
                            </p>
                            <p className="mt-2">
                              <InlineMath
                                math={`d = \\sqrt{${Math.pow(
                                  formData?.tech_3x2 - formData?.tech_3x1,
                                  2
                                )} + ${Math.pow(
                                  formData?.tech_3y2 - formData?.tech_3y1,
                                  2
                                )} + ${Math.pow(
                                  formData?.tech_3z2 - formData?.tech_3z1,
                                  2
                                )}}`}
                              />
                            </p>
                            <p className="mt-2">
                              <InlineMath
                                math={`d = \\sqrt{${
                                  Math.pow(
                                    formData?.tech_3x2 - formData?.tech_3x1,
                                    2
                                  ) +
                                  Math.pow(
                                    formData?.tech_3y2 - formData?.tech_3y1,
                                    2
                                  ) +
                                  Math.pow(
                                    formData?.tech_3z2 - formData?.tech_3z1,
                                    2
                                  )
                                }}`}
                              />
                            </p>
                            <p className="mt-2">
                              <InlineMath math={`d = ${result?.tech_ans}`} />
                            </p>
                          </>
                        )}

                      {formData?.tech_type == "2P" &&
                        formData?.tech_dimen == "4D" && (
                          <>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]} ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans}
                              </strong>
                            </p>
                            <p className="font-s-20 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["sol"]}:
                              </strong>
                            </p>
                            <p className="mt-2">
                              (x₁, x₂) = ({formData?.tech_4x1},{" "}
                              {formData?.tech_4x2})
                            </p>
                            <p className="mt-2">
                              (y₁, y₂) = ({formData?.tech_4y1},{" "}
                              {formData?.tech_4y2})
                            </p>
                            <p className="mt-2">
                              (z₁, z₂) = ({formData?.tech_4z1},{" "}
                              {formData?.tech_4z2})
                            </p>
                            <p className="mt-2">
                              (k₁, k₂) = ({formData?.tech_4k1},{" "}
                              {formData?.tech_4k2})
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`d = \\sqrt{(${formData?.tech_4x2} - ${formData?.tech_4x1})^2 + (${formData?.tech_4y2} - ${formData?.tech_4y1})^2 + (${formData?.tech_4z2} - ${formData?.tech_4z1})^2 + (${formData?.tech_4k2} - ${formData?.tech_4k1})^2}`}
                              />
                            </div>

                            <p className="mt-2">
                              <InlineMath math={`d = ${result?.tech_ans}`} />
                            </p>
                          </>
                        )}
                      {formData?.tech_type == "3P" &&
                        formData?.tech_dimen == "1D" && (
                          <>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]}(1-2) ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans1}
                              </strong>
                            </p>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]}(3-2) ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans2}
                              </strong>
                            </p>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]}(1-3) ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans3}
                              </strong>
                            </p>

                            <p className="font-s-20 text-start font-bold">
                              {data?.payload?.tech_lang_keys["sol"]}:
                            </p>

                            <p className="mt-2">
                              (x₁, x₂, x₃) = ({formData?.tech_3px1},{" "}
                              {formData?.tech_3px2}, {formData?.tech_3px3})
                            </p>

                            {/* Distance 1-2 */}
                            <BlockMath
                              math={`d_{(1-2)} = \\sqrt{(x_2 - x_1)^2}`}
                            />
                            <BlockMath
                              math={`d_{(1-2)} = \\sqrt{(${formData?.tech_3px2} - (${formData?.tech_3px1}))^2}`}
                            />
                            <BlockMath
                              math={`d_{(1-2)} = \\sqrt{(${
                                formData?.tech_3px2 - formData?.tech_3px1
                              })^2}`}
                            />
                            <InlineMath
                              math={`d_{(1-2)} = ${result?.tech_ans1}`}
                            />

                            {/* Distance 3-2 */}
                            <div className="mt-3" />
                            <BlockMath
                              math={`d_{(3-2)} = \\sqrt{(x_3 - x_2)^2}`}
                            />
                            <BlockMath
                              math={`d_{(3-2)} = \\sqrt{(${formData?.tech_3px3} - (${formData?.tech_3px2}))^2}`}
                            />
                            <BlockMath
                              math={`d_{(3-2)} = \\sqrt{(${
                                formData?.tech_3px3 - formData?.tech_3px2
                              })^2}`}
                            />
                            <InlineMath
                              math={`d_{(3-2)} = ${result?.tech_ans2}`}
                            />

                            {/* Distance 1-3 */}
                            <div className="mt-3" />
                            <BlockMath
                              math={`d_{(1-3)} = \\sqrt{(x_3 - x_1)^2}`}
                            />
                            <BlockMath
                              math={`d_{(1-3)} = \\sqrt{(${formData?.tech_3px3} - (${formData?.tech_3px1}))^2}`}
                            />
                            <BlockMath
                              math={`d_{(1-3)} = \\sqrt{(${
                                formData?.tech_3px3 - formData?.tech_3px1
                              })^2}`}
                            />
                            <InlineMath
                              math={`d_{(1-3)} = ${result?.tech_ans3}`}
                            />
                          </>
                        )}
                      {formData?.tech_type == "3P" &&
                        formData?.tech_dimen == "2D" && (
                          <>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]}(1-2) ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans1}
                              </strong>
                            </p>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]}(3-2) ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans2}
                              </strong>
                            </p>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]}(1-3) ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans3}
                              </strong>
                            </p>

                            <p className="font-s-20 text-start font-bold">
                              {data?.payload?.tech_lang_keys["sol"]}:
                            </p>

                            <p className="mt-2">
                              (x₁, y₁) = ({formData?.tech_x1},{" "}
                              {formData?.tech_y1})
                            </p>
                            <p className="mt-2">
                              (x₂, y₂) = ({formData?.tech_x2},{" "}
                              {formData?.tech_y2})
                            </p>
                            <p className="mt-2">
                              (x₃, y₃) = ({formData?.tech_x3},{" "}
                              {formData?.tech_y3})
                            </p>

                            {/* Distance 1-2 */}
                            <BlockMath
                              math={`d_{(1-2)} = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`}
                            />
                            <BlockMath
                              math={`d_{(1-2)} = \\sqrt{(${formData?.tech_x2} - ${formData?.tech_x1})^2 + (${formData?.tech_y2} - ${formData?.tech_y1})^2}`}
                            />
                            <BlockMath
                              math={`d_{(1-2)} = \\sqrt{(${
                                formData?.tech_x2 - formData?.tech_x1
                              })^2 + (${
                                formData?.tech_y2 - formData?.tech_y1
                              })^2}`}
                            />
                            <InlineMath
                              math={`d_{(1-2)} = ${result?.tech_ans1}`}
                            />

                            {/* Distance 3-2 */}
                            <div className="mt-3" />
                            <BlockMath
                              math={`d_{(3-2)} = \\sqrt{(x_3 - x_2)^2 + (y_3 - y_2)^2}`}
                            />
                            <BlockMath
                              math={`d_{(3-2)} = \\sqrt{(${formData?.tech_x3} - ${formData?.tech_x2})^2 + (${formData?.tech_y3} - ${formData?.tech_y2})^2}`}
                            />
                            <BlockMath
                              math={`d_{(3-2)} = \\sqrt{(${
                                formData?.tech_x3 - formData?.tech_x2
                              })^2 + (${
                                formData?.tech_y3 - formData?.tech_y2
                              })^2}`}
                            />
                            <InlineMath
                              math={`d_{(3-2)} = ${result?.tech_ans2}`}
                            />

                            {/* Distance 1-3 */}
                            <div className="mt-3" />
                            <BlockMath
                              math={`d_{(1-3)} = \\sqrt{(x_3 - x_1)^2 + (y_3 - y_1)^2}`}
                            />
                            <BlockMath
                              math={`d_{(1-3)} = \\sqrt{(${formData?.tech_x3} - ${formData?.tech_x1})^2 + (${formData?.tech_y3} - ${formData?.tech_y1})^2}`}
                            />
                            <BlockMath
                              math={`d_{(1-3)} = \\sqrt{(${
                                formData?.tech_x3 - formData?.tech_x1
                              })^2 + (${
                                formData?.tech_y3 - formData?.tech_y1
                              })^2}`}
                            />
                            <InlineMath
                              math={`d_{(1-3)} = ${result?.tech_ans3}`}
                            />
                          </>
                        )}
                      {formData?.tech_type == "3P" &&
                        formData?.tech_dimen == "3D" && (
                          <>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]}(1-2) ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans1}
                              </strong>
                            </p>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]}(3-2) ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans2}
                              </strong>
                            </p>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]}(1-3) ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans3}
                              </strong>
                            </p>

                            <p className="font-s-20 text-start font-bold">
                              {data?.payload?.tech_lang_keys["sol"]}:
                            </p>

                            <p className="mt-2">
                              (x₁, y₁, z₁) = ({formData?.tech_3x1},{" "}
                              {formData?.tech_3y1}, {formData?.tech_3z1})
                            </p>
                            <p className="mt-2">
                              (x₂, y₂, z₂) = ({formData?.tech_3x2},{" "}
                              {formData?.tech_3y2}, {formData?.tech_3z2})
                            </p>
                            <p className="mt-2">
                              (x₃, y₃, z₃) = ({formData?.tech_3x3},{" "}
                              {formData?.tech_3y3}, {formData?.tech_3z3})
                            </p>

                            {/* Distance 1-2 */}
                            <BlockMath
                              math={`d_{(1-2)} = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}`}
                            />
                            <BlockMath
                              math={`d_{(1-2)} = \\sqrt{(${formData?.tech_3x2} - ${formData?.tech_3x1})^2 + (${formData?.tech_3y2} - ${formData?.tech_3y1})^2 + (${formData?.tech_3z2} - ${formData?.tech_3z1})^2}`}
                            />
                            <BlockMath
                              math={`d_{(1-2)} = \\sqrt{(${
                                formData?.tech_3x2 - formData?.tech_3x1
                              })^2 + (${
                                formData?.tech_3y2 - formData?.tech_3y1
                              })^2 + (${
                                formData?.tech_3z2 - formData?.tech_3z1
                              })^2}`}
                            />
                            <InlineMath
                              math={`d_{(1-2)} = ${result?.tech_ans1}`}
                            />

                            {/* Distance 3-2 */}
                            <div className="mt-3" />
                            <BlockMath
                              math={`d_{(3-2)} = \\sqrt{(x_3 - x_2)^2 + (y_3 - y_2)^2 + (z_3 - z_2)^2}`}
                            />
                            <BlockMath
                              math={`d_{(3-2)} = \\sqrt{(${formData?.tech_3x3} - ${formData?.tech_3x2})^2 + (${formData?.tech_3y3} - ${formData?.tech_3y2})^2 + (${formData?.tech_3z3} - ${formData?.tech_3z2})^2}`}
                            />
                            <BlockMath
                              math={`d_{(3-2)} = \\sqrt{(${
                                formData?.tech_3x3 - formData?.tech_3x2
                              })^2 + (${
                                formData?.tech_3y3 - formData?.tech_3y2
                              })^2 + (${
                                formData?.tech_3z3 - formData?.tech_3z2
                              })^2}`}
                            />
                            <InlineMath
                              math={`d_{(3-2)} = ${result?.tech_ans2}`}
                            />

                            {/* Distance 1-3 */}
                            <div className="mt-3" />
                            <BlockMath
                              math={`d_{(1-3)} = \\sqrt{(x_3 - x_1)^2 + (y_3 - y_1)^2 + (z_3 - z_1)^2}`}
                            />
                            <BlockMath
                              math={`d_{(1-3)} = \\sqrt{(${formData?.tech_3x3} - ${formData?.tech_3x1})^2 + (${formData?.tech_3y3} - ${formData?.tech_3y1})^2 + (${formData?.tech_3z3} - ${formData?.tech_3z1})^2}`}
                            />
                            <BlockMath
                              math={`d_{(1-3)} = \\sqrt{(${
                                formData?.tech_3x3 - formData?.tech_3x1
                              })^2 + (${
                                formData?.tech_3y3 - formData?.tech_3y1
                              })^2 + (${
                                formData?.tech_3z3 - formData?.tech_3z1
                              })^2}`}
                            />
                            <InlineMath
                              math={`d_{(1-3)} = ${result?.tech_ans3}`}
                            />
                          </>
                        )}
                      {formData?.tech_type == "3P" &&
                        formData?.tech_dimen == "4D" && (
                          <>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]}(1-2) ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans1}
                              </strong>
                            </p>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]}(3-2) ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans2}
                              </strong>
                            </p>
                            <p className="font-s-25">
                              {data?.payload?.tech_lang_keys["dis"]}(1-3) ={" "}
                              <strong className="text-blue">
                                {result?.tech_ans3}
                              </strong>
                            </p>

                            <p className="font-s-20 text-start font-bold">
                              {data?.payload?.tech_lang_keys["sol"]}:
                            </p>

                            <p className="mt-2">
                              (x₁ , y₁ , z₁ , k₁) = ({formData?.tech_4x1},{" "}
                              {formData?.tech_4y1}, {formData?.tech_4z1},{" "}
                              {formData?.tech_4k1})
                            </p>
                            <p className="mt-2">
                              (x₂ , y₂ , z₂ , k₂) = ({formData?.tech_4x2},{" "}
                              {formData?.tech_4y2}, {formData?.tech_4z2},{" "}
                              {formData?.tech_4k2})
                            </p>
                            <p className="mt-2">
                              (x₃ , y₃ , z₃ , k₃) = ({formData?.tech_4x3},{" "}
                              {formData?.tech_4y3}, {formData?.tech_4z3},{" "}
                              {formData?.tech_4k3})
                            </p>

                            <BlockMath
                              math={`d(1-2) = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2 + (k_2 - k_1)^2}`}
                            />
                            <BlockMath
                              math={`d(1-2) = \\sqrt{(${formData?.tech_4x2} - ${formData?.tech_4x1})^2 + (${formData?.tech_4y2} - ${formData?.tech_4y1})^2 + (${formData?.tech_4z2} - ${formData?.tech_4z1})^2 + (${formData?.tech_4k2} - ${formData?.tech_4k1})^2}`}
                            />
                            <BlockMath
                              math={`d(1-2) = \\sqrt{(${
                                formData?.tech_4x2 - formData?.tech_4x1
                              })^2 + (${
                                formData?.tech_4y2 - formData?.tech_4y1
                              })^2 + (${
                                formData?.tech_4z2 - formData?.tech_4z1
                              })^2 + (${
                                formData?.tech_4k2 - formData?.tech_4k1
                              })^2}`}
                            />
                            <BlockMath math={`d(1-2) = ${result?.tech_ans1}`} />

                            <BlockMath
                              math={`d(3-2) = \\sqrt{(x_3 - x_2)^2 + (y_3 - y_2)^2 + (z_3 - z_2)^2 + (k_3 - k_2)^2}`}
                            />
                            <BlockMath
                              math={`d(3-2) = \\sqrt{(${formData?.tech_4x3} - ${formData?.tech_4x2})^2 + (${formData?.tech_4y3} - ${formData?.tech_4y2})^2 + (${formData?.tech_4z3} - ${formData?.tech_4z2})^2 + (${formData?.tech_4k3} - ${formData?.tech_4k2})^2}`}
                            />
                            <BlockMath
                              math={`d(3-2) = \\sqrt{(${
                                formData?.tech_4x3 - formData?.tech_4x2
                              })^2 + (${
                                formData?.tech_4y3 - formData?.tech_4y2
                              })^2 + (${
                                formData?.tech_4z3 - formData?.tech_4z2
                              })^2 + (${
                                formData?.tech_4k3 - formData?.tech_4k2
                              })^2}`}
                            />
                            <BlockMath math={`d(3-2) = ${result?.tech_ans2}`} />

                            <BlockMath
                              math={`d(1-3) = \\sqrt{(x_3 - x_1)^2 + (y_3 - y_1)^2 + (z_3 - z_1)^2 + (k_3 - k_1)^2}`}
                            />
                            <BlockMath
                              math={`d(1-3) = \\sqrt{(${formData?.tech_4x3} - ${formData?.tech_4x1})^2 + (${formData?.tech_4y3} - ${formData?.tech_4y1})^2 + (${formData?.tech_4z3} - ${formData?.tech_4z1})^2 + (${formData?.tech_4k3} - ${formData?.tech_4k1})^2}`}
                            />
                            <BlockMath
                              math={`d(1-3) = \\sqrt{(${
                                formData?.tech_4x3 - formData?.tech_4x1
                              })^2 + (${
                                formData?.tech_4y3 - formData?.tech_4y1
                              })^2 + (${
                                formData?.tech_4z3 - formData?.tech_4z1
                              })^2 + (${
                                formData?.tech_4k3 - formData?.tech_4k1
                              })^2}`}
                            />
                            <BlockMath math={`d(1-3) = ${result?.tech_ans3}`} />
                          </>
                        )}
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

export default DistanceFormulaCalculator;

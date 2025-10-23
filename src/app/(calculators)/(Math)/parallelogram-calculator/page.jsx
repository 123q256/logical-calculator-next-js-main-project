"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useParallelogramCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ParallelogramCalculator = () => {
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
    tech_slct1: "1", // 1 2 3 4 5 6 7 ...  to 19
    tech_rad1: "7",
    tech_side1: "4",
    tech_side2: "6",
    tech_pi: "3.1415926535898",
    tech_unit: "m",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useParallelogramCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_slct1) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_slct1: formData.tech_slct1,
        tech_rad1: formData.tech_rad1,
        tech_side1: formData.tech_side1,
        tech_side2: formData.tech_side2,
        tech_pi: formData.tech_pi,
        tech_unit: formData.tech_unit,
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
      tech_slct1: "1", // 1 2 3 4 5 6 7 ...  to 19
      tech_rad1: "7",
      tech_side1: "4",
      tech_side2: "6",
      tech_pi: "3.1415926535898",
      tech_unit: "m",
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_slct1" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_slct1"
                    id="tech_slct1"
                    value={formData.tech_slct1}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]} (A = C)
                    </option>
                    <option value="2">
                      {" "}
                      {data?.payload?.tech_lang_keys["2"]} (B)
                    </option>
                    <option value="3">
                      {" "}
                      {data?.payload?.tech_lang_keys["2"]} (A = C) &{" "}
                      {data?.payload?.tech_lang_keys[3]} a
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["2"]} (A = C) &{" "}
                      {data?.payload?.tech_lang_keys[4]}
                    </option>
                    <option value="5">
                      {" "}
                      {data?.payload?.tech_lang_keys["5"]} (P) &{" "}
                      {data?.payload?.tech_lang_keys[3]} a
                    </option>
                    <option value="6">
                      {" "}
                      {data?.payload?.tech_lang_keys["5"]} (P) &{" "}
                      {data?.payload?.tech_lang_keys[3]} b
                    </option>
                    <option value="7">
                      {data?.payload?.tech_lang_keys["3"]} a &{" "}
                      {data?.payload?.tech_lang_keys[3]} b
                    </option>
                    <option value="8">
                      {data?.payload?.tech_lang_keys["7"]} (K) &{" "}
                      {data?.payload?.tech_lang_keys[3]} b
                    </option>
                    <option value="9">
                      {" "}
                      {data?.payload?.tech_lang_keys["7"]} (K) &{" "}
                      {data?.payload?.tech_lang_keys[4]} h
                    </option>
                    <option value="10">
                      {" "}
                      {data?.payload?.tech_lang_keys["3"]} (b) &{" "}
                      {data?.payload?.tech_lang_keys[4]} h
                    </option>
                    <option value="11">
                      {data?.payload?.tech_lang_keys["2"]} (A = C) &{" "}
                      {data?.payload?.tech_lang_keys[3]} a & b
                    </option>
                    <option value="12">
                      {" "}
                      {data?.payload?.tech_lang_keys["3"]} a & b,{" "}
                      {data?.payload?.tech_lang_keys[6]} p
                    </option>
                    <option value="13">
                      {" "}
                      {data?.payload?.tech_lang_keys["3"]} a & b,{" "}
                      {data?.payload?.tech_lang_keys[6]} q
                    </option>
                    <option value="14">
                      {" "}
                      {data?.payload?.tech_lang_keys["3"]} a & b,{" "}
                      {data?.payload?.tech_lang_keys[4]} h
                    </option>
                    <option value="15">
                      {data?.payload?.tech_lang_keys["3"]} a & b,{" "}
                      {data?.payload?.tech_lang_keys[7]} (K)
                    </option>
                    <option value="16">
                      {" "}
                      {data?.payload?.tech_lang_keys["2"]} (A = C),{" "}
                      {data?.payload?.tech_lang_keys[3]} a &{" "}
                      {data?.payload?.tech_lang_keys[7]} (K)
                    </option>
                    <option value="17">
                      {data?.payload?.tech_lang_keys["2"]} (A = C),{" "}
                      {data?.payload?.tech_lang_keys[3]} b &{" "}
                      {data?.payload?.tech_lang_keys[7]} (K)
                    </option>
                    <option value="18">
                      {" "}
                      {data?.payload?.tech_lang_keys["3"]} a,{" "}
                      {data?.payload?.tech_lang_keys[6]} p & q
                    </option>
                    <option value="19">
                      {" "}
                      {data?.payload?.tech_lang_keys["3"]} b,{" "}
                      {data?.payload?.tech_lang_keys[6]} p & q
                    </option>
                  </select>
                </div>
              </div>

              <div className="col-span-6">
                {formData.tech_slct1 == "1" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Angle A = C (°):
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "2" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Angle B = D (°):
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "3" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Angle A = C (°):
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "4" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Angle A = C (°):
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "5" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Side Length a:
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "6" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Side Length b:
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "7" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Side Length a:
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "8" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Side Length b:
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "9" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Height h
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "10" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Side Length b:
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "11" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Angle A = C (°):
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "12" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Side Length a:
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "13" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Side Length a:
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "14" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Side Length a:
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "15" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Side Length a:
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "16" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Angle A = C (°):
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "17" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Angle A = C (°):
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "18" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Side Length a:
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "19" && (
                  <>
                    <label htmlFor="tech_rad1" id="heading" className="label">
                      Side Length b:
                    </label>
                  </>
                )}

                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_rad1"
                    id="tech_rad1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_rad1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {(formData.tech_slct1 == "3" ||
                formData.tech_slct1 == "4" ||
                formData.tech_slct1 == "5" ||
                formData.tech_slct1 == "6" ||
                formData.tech_slct1 == "7" ||
                formData.tech_slct1 == "8" ||
                formData.tech_slct1 == "9" ||
                formData.tech_slct1 == "10" ||
                formData.tech_slct1 == "11" ||
                formData.tech_slct1 == "12" ||
                formData.tech_slct1 == "13" ||
                formData.tech_slct1 == "14" ||
                formData.tech_slct1 == "15" ||
                formData.tech_slct1 == "16" ||
                formData.tech_slct1 == "17" ||
                formData.tech_slct1 == "18" ||
                formData.tech_slct1 == "19") && (
                <>
                  <div className="col-span-6 side1">
                    {formData.tech_slct1 == "3" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Side Length a:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "4" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Height h:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "5" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Perimeter P:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "6" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Perimeter P:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "7" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Side Length b:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "8" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Area K:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "9" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Area K:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "10" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Height h:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "11" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Side Lenght a:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "12" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Side Lenght b:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "13" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Side Lenght b:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "14" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Side Lenght b:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "15" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Side Lenght b:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "16" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Side Lenght a:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "17" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Side Lenght b:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "18" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Diagonal p:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "19" && (
                      <>
                        <label
                          htmlFor="tech_side1"
                          id="heading2"
                          className="label"
                        >
                          Diagonal p:
                        </label>
                      </>
                    )}
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_side1"
                        id="tech_side1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_side1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_slct1 == "11" ||
                formData.tech_slct1 == "12" ||
                formData.tech_slct1 == "13" ||
                formData.tech_slct1 == "14" ||
                formData.tech_slct1 == "15" ||
                formData.tech_slct1 == "16" ||
                formData.tech_slct1 == "17" ||
                formData.tech_slct1 == "18" ||
                formData.tech_slct1 == "19") && (
                <>
                  <div className="col-span-6 " id="buttler">
                    {formData.tech_slct1 == "11" && (
                      <>
                        <label
                          htmlFor="tech_side2"
                          id="heading3"
                          className="label"
                        >
                          Side Lenght b:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "12" && (
                      <>
                        <label
                          htmlFor="tech_side2"
                          id="heading3"
                          className="label"
                        >
                          Diagonal p:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "13" && (
                      <>
                        <label
                          htmlFor="tech_side2"
                          id="heading3"
                          className="label"
                        >
                          Diagonal q:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "14" && (
                      <>
                        <label
                          htmlFor="tech_side2"
                          id="heading3"
                          className="label"
                        >
                          Height h:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "15" && (
                      <>
                        <label
                          htmlFor="tech_side2"
                          id="heading3"
                          className="label"
                        >
                          Area K:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "16" && (
                      <>
                        <label
                          htmlFor="tech_side2"
                          id="heading3"
                          className="label"
                        >
                          Area K:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "17" && (
                      <>
                        <label
                          htmlFor="tech_side2"
                          id="heading3"
                          className="label"
                        >
                          Area K:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "18" && (
                      <>
                        <label
                          htmlFor="tech_side2"
                          id="heading3"
                          className="label"
                        >
                          Diagonal q:
                        </label>
                      </>
                    )}
                    {formData.tech_slct1 == "19" && (
                      <>
                        <label
                          htmlFor="tech_side2"
                          id="heading3"
                          className="label"
                        >
                          Diagonal q:
                        </label>
                      </>
                    )}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_side2"
                        id="tech_side2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_side2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-6">
                <label htmlFor="tech_pi" className="label">
                  pi π =
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_pi"
                    id="tech_pi"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_pi}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_unit" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_unit"
                    id="tech_unit"
                    value={formData.tech_unit}
                    onChange={handleChange}
                  >
                    <option value="cm">cm </option>
                    <option value="m">m </option>
                    <option value="in">in </option>
                    <option value="ft">ft </option>
                    <option value="yd">yd </option>
                  </select>
                </div>
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
                      <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                        <table className="w-full text-[16px]">
                          <tbody>
                            {formData?.tech_slct1 == 1 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} A = C =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} B = D =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_c2} {"°"}
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 2 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} A = C =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_c1} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} B = D =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {"°"}
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 3 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_h}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} A = C =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} B = D =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_c2} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 4 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_a} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} A = C =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} B = D =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_b} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 5 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_b} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]} P:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 6 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_a} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]} P:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 7 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]} P:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_p} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 8 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_h} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (k):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                    <sup className="font-s-14">2</sup>
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 9 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_b} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (k):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                    <sup className="font-s-14">2</sup>
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 10 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (k):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_k} {formData?.tech_unit}
                                    <sup className="font-s-14">2</sup>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {formData?.tech_unit}
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 11 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} A = C =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} B = D =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_calculate} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side2} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (p):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_p} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (q):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_q} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_h} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]} (P):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_P} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (k):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_k} {formData?.tech_unit}
                                    <sup className="font-s-14">2</sup>
                                  </td>
                                </tr>
                              </>
                            )}

                            {formData?.tech_slct1 == 12 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} A = C =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} B = D =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_calculate} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (p):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side2} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (q):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_q} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_h} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]} (P):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_P} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (k):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_h * formData?.tech_side1}{" "}
                                    {formData?.tech_unit}
                                    <sup className="font-s-14">2</sup>
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 13 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} A = C =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_a} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} B = D =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_b} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (p):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_p} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (q):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side2} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_h} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]} (P):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_P} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (k):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_h * formData?.tech_side1}{" "}
                                    {formData?.tech_unit}
                                    <sup className="font-s-14">2</sup>
                                  </td>
                                </tr>
                              </>
                            )}

                            {formData?.tech_slct1 == 14 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} A = C =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_a} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} B = D =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_b} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (p):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_p} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (q):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_q} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side2} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]} (P):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_P} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (k):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_k} {formData?.tech_unit}
                                    <sup className="font-s-14">2</sup>
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 15 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} A = C =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_a} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} B = D =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_b} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (p):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_p} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (q):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_q} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_h} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]} (P):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_P} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (k):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side2} {formData?.tech_unit}
                                    <sup className="font-s-14">2</sup>
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 16 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} A = C =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} B = D =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_b_angle} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_b} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (p):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_p} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (q):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_q} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_h} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]} (P):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_P} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (k):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side2} {formData?.tech_unit}
                                    <sup className="font-s-14">2</sup>
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 17 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} A = C =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} B = D =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_b_angle} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_a} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (p):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_p} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (q):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_q} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_h} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]} (P):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_P} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (k):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side2} {formData?.tech_unit}
                                    <sup className="font-s-14">2</sup>
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 18 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} A = C =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_a} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} B = D =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_b_angle} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_sq} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (p):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (q):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side2} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_h} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]} (P):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_P} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (k):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_k} {formData?.tech_unit}
                                    <sup className="font-s-14">2</sup>
                                  </td>
                                </tr>
                              </>
                            )}
                            {formData?.tech_slct1 == 19 && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} A = C =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_an} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} B = D =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_b_angle} {"°"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_sq} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}:
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_rad1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (p):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side1} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]} (q):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {formData?.tech_side2} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} (h):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_h} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]} (P):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_P} {formData?.tech_unit}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (k):
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_k} {formData?.tech_unit}
                                    <sup className="font-s-14">2</sup>
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

export default ParallelogramCalculator;

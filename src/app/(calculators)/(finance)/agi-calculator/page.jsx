"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useAGICalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AgiCalculator = () => {
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
    tech_input1: Number(21),
    tech_input2: Number(19),
    tech_input3: Number(17),
    tech_input4: Number(35),
    tech_input5: Number(45),
    tech_input6: Number(27),
    tech_input7: Number(23),
    tech_input8: Number(13),
    tech_input9: Number(19),
    tech_input10: Number(49),
    tech_input11: Number(12),
    tech_input12: Number(38),
    tech_input13: Number(25),
    tech_input14: Number(22),
    tech_input15: Number(14),
    tech_input16: Number(19),
    tech_input17: Number(23),
    tech_input18: Number(45),
    tech_input19: Number(43),
    tech_input20: Number(67),
    tech_input21: Number(57),
    tech_input22: Number(32),
    tech_input23: Number(32),
    tech_input24: Number(44),
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAGICalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_input1 ||
      !formData.tech_input2 ||
      !formData.tech_input3 ||
      !formData.tech_input4 ||
      !formData.tech_input5 ||
      !formData.tech_input6 ||
      !formData.tech_input7 ||
      !formData.tech_input8 ||
      !formData.tech_input9 ||
      !formData.tech_input10 ||
      !formData.tech_input11 ||
      !formData.tech_input12 ||
      !formData.tech_input13 ||
      !formData.tech_input14 ||
      !formData.tech_input15 ||
      !formData.tech_input16 ||
      !formData.tech_input17 ||
      !formData.tech_input18 ||
      !formData.tech_input19 ||
      !formData.tech_input20 ||
      !formData.tech_input21 ||
      !formData.tech_input22 ||
      !formData.tech_input23 ||
      !formData.tech_input24
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_input1: formData.tech_input1,
        tech_input2: formData.tech_input2,
        tech_input3: formData.tech_input3,
        tech_input4: formData.tech_input4,
        tech_input5: formData.tech_input5,
        tech_input6: formData.tech_input6,
        tech_input7: formData.tech_input7,
        tech_input8: formData.tech_input8,
        tech_input9: formData.tech_input9,
        tech_input10: formData.tech_input10,
        tech_input11: formData.tech_input11,
        tech_input12: formData.tech_input12,
        tech_input13: formData.tech_input13,
        tech_input14: formData.tech_input14,
        tech_input15: formData.tech_input15,
        tech_input16: formData.tech_input16,
        tech_input17: formData.tech_input17,
        tech_input18: formData.tech_input18,
        tech_input19: formData.tech_input19,
        tech_input20: formData.tech_input20,
        tech_input21: formData.tech_input21,
        tech_input22: formData.tech_input22,
        tech_input23: formData.tech_input23,
        tech_input24: formData.tech_input24,
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
      tech_input1: Number(21),
      tech_input2: Number(19),
      tech_input3: Number(17),
      tech_input4: Number(35),
      tech_input5: Number(45),
      tech_input6: Number(27),
      tech_input7: Number(23),
      tech_input8: Number(13),
      tech_input9: Number(19),
      tech_input10: Number(49),
      tech_input11: Number(12),
      tech_input12: Number(38),
      tech_input13: Number(25),
      tech_input14: Number(22),
      tech_input15: Number(14),
      tech_input16: Number(19),
      tech_input17: Number(23),
      tech_input18: Number(45),
      tech_input19: Number(43),
      tech_input20: Number(67),
      tech_input21: Number(57),
      tech_input22: Number(32),
      tech_input23: Number(32),
      tech_input24: Number(44),
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

          <div className="xl:w-[70%] lg:w-[90%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-0 md:gap-4">
              <div className="col-span-12">
                <p className="py-2">
                  <strong>{data?.payload?.tech_lang_keys[1]}:</strong>
                </p>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input1" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input1"
                    id="tech_input1"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input1}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input2" className="label">
                  {data?.payload?.tech_lang_keys["3"]} /{" "}
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input2"
                    id="tech_input2"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input2}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input3" className="label">
                  {data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input3"
                    id="tech_input3"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input3}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input4" className="label">
                  {data?.payload?.tech_lang_keys["6"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input4"
                    id="tech_input4"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input4}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input5" className="label">
                  {data?.payload?.tech_lang_keys["8"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input5"
                    id="tech_input5"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input5}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input6" className="label">
                  {data?.payload?.tech_lang_keys["9"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input6"
                    id="tech_input6"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input6}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input7" className="label">
                  {data?.payload?.tech_lang_keys["9"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input7"
                    id="tech_input7"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input7}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input8" className="label">
                  {data?.payload?.tech_lang_keys["11"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input8"
                    id="tech_input8"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input8}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input9" className="label">
                  {data?.payload?.tech_lang_keys["12"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input9"
                    id="tech_input9"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input9}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input10" className="label">
                  {data?.payload?.tech_lang_keys["13"]} /{" "}
                  {data?.payload?.tech_lang_keys["14"]} / IRA{" "}
                  {data?.payload?.tech_lang_keys["15"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input10"
                    id="tech_input10"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input10}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input11" className="label">
                  {data?.payload?.tech_lang_keys["16"]} /{" "}
                  {data?.payload?.tech_lang_keys["17"]} /{" "}
                  {data?.payload?.tech_lang_keys["18"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input11"
                    id="tech_input11"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input11}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input12" className="label">
                  {data?.payload?.tech_lang_keys["19"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input12"
                    id="tech_input12"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input12}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input13" className="label">
                  {data?.payload?.tech_lang_keys["20"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input13"
                    id="tech_input13"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input13}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>

              <div className="col-span-12">
                <p className="my-2">
                  <strong>Deductions:</strong>
                </p>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input14" className="label">
                  {data?.payload?.tech_lang_keys["21"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input14"
                    id="tech_input14"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input14}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input15" className="label">
                  {data?.payload?.tech_lang_keys["22"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input15"
                    id="tech_input15"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input15}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input16" className="label">
                  {data?.payload?.tech_lang_keys["23"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input16"
                    id="tech_input16"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input16}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input17" className="label">
                  {data?.payload?.tech_lang_keys["24"]} / IRAs:
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input17"
                    id="tech_input17"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input17}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input18" className="label">
                  {data?.payload?.tech_lang_keys["25"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input18"
                    id="tech_input18"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input18}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input19" className="label">
                  {data?.payload?.tech_lang_keys["26"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input19"
                    id="tech_input19"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input19}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input20" className="label">
                  {data?.payload?.tech_lang_keys["27"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input20"
                    id="tech_input20"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input20}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input21" className="label">
                  {data?.payload?.tech_lang_keys["28"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input21"
                    id="tech_input21"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input21}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input22" className="label">
                  {data?.payload?.tech_lang_keys["29"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input22"
                    id="tech_input22"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input22}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input23" className="label">
                  {data?.payload?.tech_lang_keys["30"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input23"
                    id="tech_input23"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input23}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_input24" className="label">
                  {data?.payload?.tech_lang_keys["31"]}
                </label>
                <div className="py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_input24"
                    id="tech_input24"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input24}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
            <div className="animate-pulse">
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                        <table className="w-100 text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["33"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_add1} {currency.symbol}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {" "}
                                  {data?.payload?.tech_lang_keys["34"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Math.abs(result?.tech_add2)} {currency.symbol}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["35"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {result?.tech_minus} {currency.symbol}
                              </td>
                            </tr>
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

export default AgiCalculator;

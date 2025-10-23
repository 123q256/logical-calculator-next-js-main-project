"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useCapRateCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CapRateCalculator = () => {
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
    tech_prop_val: "200000",
    tech_ann_grs_inc: "30000",
    tech_op_exp: "12",
    tech_op_exp_unit: "percent (%)",
    tech_vac_rate: "30000",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCapRateCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_prop_val ||
      !formData.tech_ann_grs_inc ||
      !formData.tech_op_exp ||
      !formData.tech_op_exp_unit ||
      !formData.tech_vac_rate
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_prop_val: formData.tech_prop_val,
        tech_ann_grs_inc: formData.tech_ann_grs_inc,
        tech_op_exp: formData.tech_op_exp,
        tech_op_exp_unit: formData.tech_op_exp_unit,
        tech_vac_rate: formData.tech_vac_rate,
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
      tech_prop_val: "200000",
      tech_ann_grs_inc: "30000",
      tech_op_exp: "12",
      tech_op_exp_unit: "percent (%)",
      tech_vac_rate: "30000",
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

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_op_exp_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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

          <div className="lg:w-[70%] md:w-[80%] w-full mx-auto ">
            <div className="grid lg:grid-cols-12 md:grid-cols-12 grid-cols-6 mt-3  gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_prop_val" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="  relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_prop_val"
                    id="tech_prop_val"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_prop_val}
                    onChange={handleChange}
                  />
                  <span className=" input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_ann_grs_inc" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_ann_grs_inc"
                    id="tech_ann_grs_inc"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_ann_grs_inc}
                    onChange={handleChange}
                  />
                  <span className=" input_unit">{currency.symbol}</span>
                </div>
              </div>

              <div className="col-span-6">
                <label htmlFor="tech_op_exp" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full py-2 ">
                  <input
                    type="number"
                    name="tech_op_exp"
                    step="any"
                    className=" w-full  input"
                    value={formData.tech_op_exp}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_op_exp_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "percent (%)", value: "percent (%)" },
                        {
                          label: `currancy ${currency.symbol}`,
                          value: currency.symbol,
                        },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-6">
                <label htmlFor="tech_vac_rate" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_vac_rate"
                    id="tech_vac_rate"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_vac_rate}
                    onChange={handleChange}
                  />
                  <span className=" input_unit">%</span>
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
                      <div className="w-full md:w-[60%] lg:w-[60%] mt-2 overflow-auto">
                        <table className="w-100 text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="60%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["5"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_cap} %
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="60%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["6"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol} {result?.tech_grs_op_inc}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="60%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["7"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol} {result?.tech_ann_net_inc}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full leading-8 text-[16px]">
                        <p className="my-2">
                          <strong>{data?.payload?.tech_lang_keys["8"]}:</strong>
                        </p>
                        <p className="my-2">
                          {data?.payload?.tech_lang_keys["6"]} = &nbsp;
                          {data?.payload?.tech_lang_keys["9"]} -
                          {data?.payload?.tech_lang_keys["10"]}
                        </p>
                        <p className="my-2">
                          {data?.payload?.tech_lang_keys["6"]} = &nbsp;
                          {currency.symbol} {result?.tech_ann_grs_inc} -
                          {currency.symbol} {result?.tech_vac_rate1} =
                          {currency.symbol} {result?.tech_grs_op_inc}
                        </p>
                        {result?.percent ? (
                          <>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["7"]} = ((100 -
                              {data?.payload?.tech_lang_keys["11"]}) %) * ((100
                              - {data?.payload?.tech_lang_keys["10"]}) %) *
                              {data?.payload?.tech_lang_keys["9"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["7"]} = ((100 -
                              {currency.symbol}
                              {result?.tech_op_exp}) / 100) * ((100 -
                              {currency.symbol}
                              {result?.tech_vac_rate}) / 100) *{currency.symbol}
                              {result?.tech_ann_grs_inc} = {currency.symbol}
                              {result?.tech_ann_net_inc}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["7"]} = &nbsp;
                              {data?.payload?.tech_lang_keys["6"]} -
                              {data?.payload?.tech_lang_keys["11"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["7"]} = &nbsp;
                              {currency.symbol}
                              {result?.tech_grs_op_inc} - {currency.symbol}
                              {result?.tech_op_exp} = {currency.symbol}
                              {result?.tech_ann_net_inc}
                            </p>
                          </>
                        )}

                        <p className="my-2">
                          {data?.payload?.tech_lang_keys["12"]} = &nbsp;(
                          {data?.payload?.tech_lang_keys["7"]} /
                          {data?.payload?.tech_lang_keys["13"]}) * 100
                        </p>
                        <p className="my-2">
                          {data?.payload?.tech_lang_keys["12"]} = &nbsp;(
                          {currency.symbol}
                          {result?.tech_ann_net_inc} / {currency.symbol}
                          {result?.tech_prop_val}) * 100 = {result?.tech_cap}%
                        </p>
                        <p className="my-2">
                          <strong>
                            {" "}
                            {data?.payload?.tech_lang_keys["12"]} = &nbsp;
                            {result?.tech_cap}%
                          </strong>
                        </p>
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

export default CapRateCalculator;

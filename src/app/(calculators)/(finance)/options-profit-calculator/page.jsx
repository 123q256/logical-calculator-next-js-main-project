"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useOptionsProfitCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const OptionsProfitCalculator = () => {
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
    tech_ot: "p", // p   c
    tech_sp: 10,
    tech_op: 10,
    tech_stp: 10,
    tech_nc: 10,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useOptionsProfitCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_ot ||
      !formData.tech_sp ||
      !formData.tech_op ||
      !formData.tech_stp ||
      !formData.tech_nc
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_ot: formData.tech_ot,
        tech_sp: formData.tech_sp,
        tech_op: formData.tech_op,
        tech_stp: formData.tech_stp,
        tech_nc: formData.tech_nc,
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
      tech_ot: "p", // p   c
      tech_sp: 10,
      tech_op: 10,
      tech_stp: 10,
      tech_nc: 10,
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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_ot" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_ot"
                    id="tech_ot"
                    value={formData.tech_ot}
                    onChange={handleChange}
                  >
                    <option value="c">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="p">
                      {data?.payload?.tech_lang_keys["16"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_sp" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_sp"
                    id="tech_sp"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_sp}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_op" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_op"
                    id="tech_op"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_op}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_stp" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_stp"
                    id="tech_stp"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_stp}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_nc" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_nc"
                    id="tech_nc"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_nc}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
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

                  <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                    <table className="w-full text-[18px]">
                      <tbody>
                        <tr>
                          <td className="py-2 border-b" width="60%">
                            <strong>
                              {result?.tech_ans > 0
                                ? data?.payload?.tech_lang_keys["6"]
                                : data?.payload?.tech_lang_keys["7"]}
                            </strong>
                          </td>
                          <td className="py-2 border-b">
                            {currency.symbol} {result?.tech_ans}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="w-full text-[18px]">
                    <>
                      <p className="mt-2">
                        <strong>{data?.payload?.tech_lang_keys["8"]}</strong>
                      </p>

                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys["9"]} ={" "}
                        {data?.payload?.tech_lang_keys["10"]} x 100
                      </p>
                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys["9"]} = {result?.tech_nc}{" "}
                        x 100
                      </p>
                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys["9"]} = {currency.symbol}{" "}
                        {result?.tech_ec}
                      </p>

                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys["11"]} ={" "}
                        {data?.payload?.tech_lang_keys["2"]} x{" "}
                        {data?.payload?.tech_lang_keys["9"]}
                      </p>
                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys["11"]} ={" "}
                        {result?.tech_sp} x {result?.tech_ec}
                      </p>
                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys["11"]} ={" "}
                        {currency.symbol} {result?.tech_sp * result?.tech_ec}
                      </p>

                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys["12"]} ={" "}
                        {data?.payload?.tech_lang_keys["4"]} x{" "}
                        {data?.payload?.tech_lang_keys["9"]}
                      </p>
                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys["12"]} ={" "}
                        {result?.tech_stp} x {result?.tech_ec}
                      </p>
                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys["12"]} ={" "}
                        {currency.symbol} {result?.tech_stp * result?.tech_ec}
                      </p>

                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys["13"]} ={" "}
                        {data?.payload?.tech_lang_keys["1"]} x{" "}
                        {data?.payload?.tech_lang_keys["9"]}
                      </p>
                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys["13"]} ={" "}
                        {result?.tech_op} x {result?.tech_ec}
                      </p>
                      <p className="mt-2">
                        {data?.payload?.tech_lang_keys["13"]} ={" "}
                        {currency.symbol} {result?.tech_op * result?.tech_ec}
                      </p>
                    </>

                    {result?.tech_ot === "c" ? (
                      <>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["14"]} ={" "}
                          {data?.payload?.tech_lang_keys["11"]} -{" "}
                          {data?.payload?.tech_lang_keys["12"]} -{" "}
                          {data?.payload?.tech_lang_keys["13"]}
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["14"]} ={" "}
                          {result?.tech_sp * result?.tech_ec} -{" "}
                          {result?.tech_stp * result?.tech_ec} -{" "}
                          {result?.tech_op * result?.tech_ec}
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["14"]} ={" "}
                          {currency.symbol} {result?.tech_ans}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["14"]} ={" "}
                          {data?.payload?.tech_lang_keys["12"]} -{" "}
                          {data?.payload?.tech_lang_keys["11"]} -{" "}
                          {data?.payload?.tech_lang_keys["13"]}
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["14"]} ={" "}
                          {result?.tech_stp * result?.tech_ec} -{" "}
                          {result?.tech_sp * result?.tech_ec} -{" "}
                          {result?.tech_op * result?.tech_ec}
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["14"]} ={" "}
                          {currency.symbol} {result?.tech_ans}
                        </p>
                      </>
                    )}
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

export default OptionsProfitCalculator;

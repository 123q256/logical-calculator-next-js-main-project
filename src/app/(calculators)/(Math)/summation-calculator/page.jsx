"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useSummationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SummationCalculator = () => {
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
    tech_cal_meth: "simple_sum", //  sigma_sum   simple_sum
    tech_nums: "1,2,3,4,5",
    tech_eq: "x^2",
    tech_x: "1",
    tech_n: "5",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSummationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal_meth) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cal_meth: formData.tech_cal_meth,
        tech_nums: formData.tech_nums,
        tech_eq: formData.tech_eq,
        tech_x: formData.tech_x,
        tech_n: formData.tech_n,
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
      tech_cal_meth: "simple_sum", //  sigma_sum   simple_sum
      tech_nums: "1,2,3,4,5",
      tech_eq: "x^2",
      tech_x: "1",
      tech_n: "5",
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
  const isSimpleSum = formData?.tech_cal_meth === "simple_sum";
  const i_n = result?.tech_i_n || [];
  const solve = result?.tech_solve || [];
  const enter = result?.tech_enter || "";
  const cnvrgnt = result?.tech_cnvrgnt === "True";

  const replacedSum = formData?.tech_nums?.replace(/,/g, "+") || "";

  const evaluatedExpression = i_n
    .map((x, idx) => {
      const expr = enter.replace(/x/g, `(${x})`);
      return `(${expr})`;
    })
    .join(" + ");

  const evaluatedValues = solve
    .map((val, idx) => {
      return Math.round(val * 100) / 100;
    })
    .join(" + ");
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
            <div className="grid grid-cols-12  gap-2 ">
              <div className="col-span-12 ">
                <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                  <p className="col-span-12 label">
                    <strong>
                      {data?.payload?.tech_lang_keys["calculate"]}{" "}
                      {data?.payload?.tech_lang_keys["1"]}:
                    </strong>
                  </p>
                  <p className="col-span-12 md:col-span-4">
                    <label className="pe-2 cursor-pointer" htmlFor="simple_sum">
                      <input
                        type="radio"
                        name="tech_cal_meth"
                        value="simple_sum"
                        id="simple_sum"
                        className="mr-2 border cursor-pointer"
                        onChange={handleChange}
                        checked={formData.tech_cal_meth === "simple_sum"}
                      />
                      <span>{data?.payload?.tech_lang_keys["2"]}</span>
                    </label>
                  </p>
                  <p className="col-span-12 md:col-span-6">
                    <label className="cursor-pointer" htmlFor="sigma_sum">
                      <input
                        type="radio"
                        name="tech_cal_meth"
                        className="mr-2 border cursor-pointer"
                        value="sigma_sum"
                        id="sigma_sum"
                        onChange={handleChange}
                        checked={formData.tech_cal_meth === "sigma_sum"}
                      />
                      <span>
                        {data?.payload?.tech_lang_keys["3"]} (Σ){" "}
                        {data?.payload?.tech_lang_keys["4"]}
                      </span>
                    </label>
                  </p>
                </div>
              </div>
              {formData.tech_cal_meth === "simple_sum" && (
                <>
                  <div className="col-span-12 " id="numsInput">
                    <label htmlFor="tech_nums" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (,):
                    </label>
                    <div className="w-full py-2">
                      <textarea
                        name="tech_nums"
                        id="tech_nums"
                        className="input textareaInput"
                        aria-label="textarea input"
                        placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                        value={formData.tech_nums || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_cal_meth === "sigma_sum" && (
                <>
                  <div className="col-span-12  sigmaInput">
                    <label htmlFor="tech_eq" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="text"
                        step="any"
                        name="tech_eq"
                        id="tech_eq"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_eq}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12  sigmaInput">
                    <label htmlFor="tech_x" className="label">
                      {data?.payload?.tech_lang_keys["7"]} (x) (
                      {data?.payload?.tech_lang_keys["9"]} ∞,{" "}
                      {data?.payload?.tech_lang_keys["10"]} oo):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_x"
                        id="tech_x"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_x}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12  sigmaInput">
                    <label htmlFor="tech_n" className="label">
                      {data?.payload?.tech_lang_keys["8"]} (n) (
                      {data?.payload?.tech_lang_keys["9"]} -∞,{" "}
                      {data?.payload?.tech_lang_keys["10"]} -oo):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_n"
                        id="tech_n"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_n}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3 overflow-auto">
                      <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="60%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["4"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_sum}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="60%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_tn}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="w-full text-[16px] overflow-auto">
                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["12"]}</strong>
                        </p>

                        {isSimpleSum ? (
                          <>
                            <p className="mt-3">
                              ∑({formData?.tech_nums}) = {replacedSum}
                            </p>
                            <p className="mt-3">
                              ∑({formData?.tech_nums}) = {result?.tech_sum}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["13"]} ={" "}
                              {result?.tech_tn}
                            </p>
                          </>
                        ) : cnvrgnt ? (
                          <>
                            <div className="mt-3">
                              <BlockMath
                                math={`x = ${formData?.tech_x} ${data?.payload?.tech_lang_keys["15"]} ${formData?.tech_n}`}
                              />
                            </div>

                            <div className="mt-3">
                              <BlockMath math={`x = ${i_n.join(", ")}`} />
                            </div>

                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["16"]} x{" "}
                              {data?.payload?.tech_lang_keys["17"]} ({enter}):
                            </p>

                            <div className="mt-3">
                              <BlockMath
                                math={`\\sum_{x=${formData?.tech_x}}^{${formData?.tech_n}} ${enter} = ${evaluatedExpression}`}
                              />
                            </div>

                            <div className="mt-3">
                              <BlockMath
                                math={`\\sum_{x=${formData?.tech_x}}^{${formData?.tech_n}} ${enter} = ${evaluatedValues}`}
                              />
                            </div>

                            <div className="mt-3">
                              <BlockMath
                                math={`\\sum_{x=${formData?.tech_x}}^{${formData?.tech_n}} ${enter} = ${result?.tech_sum}`}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["18"]}
                            </p>
                            <div className="mt-3">
                              <BlockMath
                                math={`\\sum_{x=${formData?.tech_x}}^{${formData?.tech_n}} ${enter} ${data?.payload?.tech_lang_keys["19"]}`}
                              />
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

export default SummationCalculator;

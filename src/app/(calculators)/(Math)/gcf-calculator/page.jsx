"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useGcfCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GcfCalculator = ({ numbers, langKeys }) => {
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
    tech_x: "12, 44, 10, 8, 18, 20, 26",
    tech_method: "none", //  none lm  Pf ea bs
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGcfCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x || !formData.tech_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_method: formData.tech_method,
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
      tech_x: "12, 44, 10, 8, 18, 20, 26",
      tech_method: "none", // none lm  Pf gcf cl  dm
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

  const [steps, setSteps] = React.useState([]);
  const [hcf, setHcf] = React.useState(1);
  const [finalResult, setFinalResult] = React.useState("");

  React.useEffect(() => {
    if (
      !Array.isArray(result?.tech_numbers) ||
      result?.tech_numbers.length === 0
    ) {
      setSteps([]);
      setHcf(1);
      setFinalResult("");
      return;
    }

    let arr = [...result?.tech_numbers].sort((a, b) => a - b);
    let tempSteps = [];
    let check = true;
    let tempHCF = 1;

    const stringifyArray = (arr) => arr.join(", ");

    while (arr.length !== 1 && check) {
      const isEven = arr.every((n) => n % 2 === 0);
      const isOdd = arr.every((n) => n % 2 === 1);

      let arr1 = [];

      if (isEven) {
        arr1 = arr.map((n) => n / 2);
        tempHCF *= 2;
        tempSteps.push(
          `\\text{${
            data?.payload?.tech_lang_keys["31"] || "All numbers are even"
          }} \\Rightarrow ${stringifyArray(arr1)} \\\\ \\text{GCF} = ${
            tempHCF / 2
          } \\times 2 = ${tempHCF}`
        );
      } else if (isOdd) {
        if (arr[0] === 1) {
          check = false;
          tempSteps.push(
            `\\text{${
              data?.payload?.tech_lang_keys["32"] || "All numbers reduced to 1"
            }} 1 \\\\ \\text{GCF} = ${tempHCF} \\times 1 = ${tempHCF}`
          );
        } else {
          const first = arr[0];
          tempSteps.push(
            `${
              data?.payload?.tech_lang_keys["33"] ||
              "Subtracting smallest number"
            } ${first}, ${
              data?.payload?.tech_lang_keys["34"] ||
              "and dividing the result by"
            } ${first} ${data?.payload?.tech_lang_keys["35"] || "2"}`
          );
          arr.slice(1).forEach((val) => {
            const reduced = (val - first) / 2;
            arr1.push(reduced);
            tempSteps.push(`(${val} - ${first}) / 2 = ${reduced}`);
          });
          arr1.push(first);
        }
      } else {
        arr1 = arr.map((val) => {
          if (val % 2 === 0) return val / 2;
          return val;
        });
        tempSteps.push(
          `${
            data?.payload?.tech_lang_keys["36"] || "Some numbers even, some odd"
          }: ${stringifyArray(arr1)}`
        );
      }

      arr = [...new Set(arr1)].sort((a, b) => a - b);

      if (arr.length === 1 && arr[0] !== 1) {
        tempHCF *= arr[0];
        tempSteps.push(
          `${data?.payload?.tech_lang_keys["38"] || "Final number"} ${
            arr[0]
          }. ${
            data?.payload?.tech_lang_keys["39"] || "is the GCF"
          } \\\\ \\text{GCF} = ${tempHCF / arr[0]} \\times ${
            arr[0]
          } = ${tempHCF}`
        );
      }
    }

    setSteps(tempSteps);
    setHcf(tempHCF);
    setFinalResult(
      `\\text{${
        data?.payload?.tech_lang_keys["27"] || "Result"
      }} (${result?.tech_numbers.join(", ")}) ${
        data?.payload?.tech_lang_keys["18"] || "GCF"
      }: ${tempHCF}`
    );
  }, [result?.tech_numbers, data]);

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

          <div className="lg:w-[50%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["1"]}{" "}
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                    value={formData.tech_x || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
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
                    <option value="none">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="lm">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="Pf">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                    <option value="ea">
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                    <option value="bs">
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
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
                      <div className="w-full">
                        {formData?.tech_method === "none" && (
                          <div className="w-full text-center text-[20px]">
                            <p>
                              {data?.payload?.tech_lang_keys["40"]}{" "}
                              {formData?.tech_x}
                            </p>
                            <p className="my-3">
                              <strong className="bg-[#2845F5] px-3 py-2 md:text-[32px] rounded-lg text-white">
                                {result?.tech_gcf}
                              </strong>
                            </p>
                          </div>
                        )}
                        {formData?.tech_method === "lm" && (
                          <>
                            <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-2 overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["40"]}{" "}
                                        {formData?.tech_x}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_gcf}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="w-full font-s-15">
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                <span className="text-blue">#1. </span>
                                {data?.payload?.tech_lang_keys["10"]}:
                              </p>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_sl,
                                }}
                              />
                              <p className="mt-2">
                                <span className="text-blue">#2. </span>
                                {data?.payload?.tech_lang_keys["11"]}:{" "}
                                {result?.tech_bl}
                              </p>
                              <p className="mt-2">
                                <span className="text-blue">#3. </span>
                                {data?.payload?.tech_lang_keys["12"]}:{" "}
                                {formData?.tech_x}: {result?.tech_gcf}
                              </p>
                            </div>
                          </>
                        )}
                        {formData?.tech_method === "Pf" && (
                          <>
                            <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-2 overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["40"]}{" "}
                                        {formData?.tech_x}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_gcf}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="w-full font-s-15">
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                <span className="text-blue">#1. </span>
                                {data?.payload?.tech_lang_keys["14"]}:
                              </p>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_al,
                                }}
                              />
                              <p className="mt-2">
                                <span className="text-blue">#2. </span>
                                {data?.payload?.tech_lang_keys["15"]}:{" "}
                                {result?.tech_se} {result?.tech_ss}
                              </p>
                              <p className="mt-2">
                                <span className="text-blue">#3. </span>
                                {data?.payload?.tech_lang_keys["16"]}:{" "}
                                {result?.tech_gcf}
                              </p>
                              <p className="mt-2">
                                <span className="text-blue">#4. </span>
                                {data?.payload?.tech_lang_keys["17"]} (
                                {formData?.tech_x}){" "}
                                {data?.payload?.tech_lang_keys["18"]}:{" "}
                                {result?.tech_gcf}
                              </p>
                            </div>
                          </>
                        )}
                        {formData?.tech_method === "ea" && (
                          <>
                            <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-2 overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["40"]}{" "}
                                        {formData?.tech_x}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_gcf}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="w-full font-s-15">
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["19"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                <span className="text-blue">#1. </span>
                                {data?.payload?.tech_lang_keys["20"]}: (
                                {result?.tech_sg})
                              </p>
                              <p className="mt-2">
                                <span className="text-blue">#2. </span>
                                {data?.payload?.tech_lang_keys["21"]}: (
                                {result?.tech_sm}){" "}
                                {data?.payload?.tech_lang_keys["22"]}
                              </p>
                              <p className="mt-2">
                                <span className="text-blue">#3. </span>
                                {data?.payload?.tech_lang_keys["23"]}:{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: result?.tech_i,
                                  }}
                                />
                              </p>
                              <p className="mt-2">
                                <span className="text-blue">#4. </span>
                                {data?.payload?.tech_lang_keys["24"]}:{" "}
                                {result?.tech_si}
                              </p>
                              <p className="mt-2">
                                <span className="text-blue">#5. </span>
                                {data?.payload?.tech_lang_keys["26"]}:{" "}
                                {result?.tech_gcf}
                              </p>
                              <p className="mt-2">
                                <span className="text-blue">#6. </span>
                                {data?.payload?.tech_lang_keys["27"]}: (
                                {formData?.tech_x}){" "}
                                {data?.payload?.tech_lang_keys["18"]}:{" "}
                                {result?.tech_gcf}
                              </p>
                            </div>
                          </>
                        )}

                        {formData?.tech_method === "bs" && (
                          <>
                            <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-2">
                              <table className="w-full text-[18px]">
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["40"]}{" "}
                                      {formData?.tech_x}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_gcf}
                                  </td>
                                </tr>
                              </table>
                            </div>

                            <div className="w-full font-sans text-[15px] overflow-auto">
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["28"] ||
                                  "Calculation Process"}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["29"] ||
                                  "Input Numbers"}
                                :
                              </p>
                              <p className="mt-2">
                                ({(result?.tech_numbers || []).join(", ")})
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["30"] ||
                                  "Starting GCF"}{" "}
                                = 1
                              </p>

                              {steps.map((step, index) => (
                                <div className="mt-2" key={index}>
                                  <BlockMath math={step} />
                                </div>
                              ))}

                              <div className="mt-2 font-semibold text-blue-600">
                                <BlockMath math={finalResult} />
                              </div>
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

export default GcfCalculator;

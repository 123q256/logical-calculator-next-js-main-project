"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useNewtonsMethodCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const NewtonsMethodCalculator = () => {
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
    tech_fx: "x^2",
    tech_fx1: "",
    tech_x0: 5,
    tech_iter: 20,
    tech_round: 4,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useNewtonsMethodCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_fx: formData.tech_fx,
        tech_fx1: formData.tech_fx1,
        tech_x0: formData.tech_x0,
        tech_iter: formData.tech_iter,
        tech_round: formData.tech_round,
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
      tech_fx: "x^2",
      tech_fx1: "",
      tech_x0: 5,
      tech_iter: 20,
      tech_round: 4,
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

  const sigFig = (value, digits) => {
    const num = Number(value); // Ensure value is a number

    if (isNaN(num)) return ""; // Handle invalid inputs gracefully

    if (num === 0) {
      return Number((0).toFixed(digits - 1));
    } else {
      const decimalPlaces = digits - Math.floor(Math.log10(Math.abs(num))) - 1;
      return Number(num.toFixed(decimalPlaces));
    }
  };

  const enter = result?.tech_enter || "";
  const enter1 = result?.tech_enter1 || "";
  const fxx = result?.tech_fx?.split("###") || [];
  const fxx1 = result?.tech_fx1?.split("###") || [];
  const ress = result?.tech_res?.split("###") || [];

  const round = result?.tech_round ?? 4;

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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_fx" className="label">
                  f(x)
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_fx"
                    id="tech_fx"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_fx}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_fx1" className="label">
                  f'(x) {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_fx1"
                    id="tech_fx1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_fx1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_x0" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (x₀)
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x0"
                    id="tech_x0"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x0}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_iter" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_iter"
                    id="tech_iter"
                    className="input my-2"
                    aria-label="input"
                    min="10"
                    max="200"
                    placeholder="00"
                    value={formData.tech_iter}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_round" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_round"
                    id="tech_round"
                    className="input my-2"
                    aria-label="input"
                    min="3"
                    max="20"
                    placeholder="00"
                    value={formData.tech_round}
                    onChange={handleChange}
                  />
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className=" border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </strong>
                                </td>
                                <td className=" border-b">
                                  <BlockMath math={String.raw`${enter}`} />
                                </td>
                              </tr>
                              <tr>
                                <td className=" border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["6"]}
                                  </strong>
                                </td>
                                <td className=" border-b">
                                  <BlockMath math={String.raw`${enter1}`} />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["7"]}:
                            </strong>
                          </p>

                          {!result?.tech_check && (
                            <p
                              className="mt-2"
                              dangerouslySetInnerHTML={{
                                __html: result?.tech_steps,
                              }}
                            ></p>
                          )}

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["8"]}:
                          </p>

                          <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                            <table className="w-full text-[16px]">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="py-2 border-b text-center">
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </th>
                                  <th className="py-2 border-b text-center">
                                    x
                                  </th>
                                  <th className="py-2 border-b text-center">
                                    f(x)
                                  </th>
                                  <th className="py-2 border-b text-center">
                                    f'(x)
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {ress.slice(0, -1).map((_, i) => (
                                  <tr key={i}>
                                    <td className="py-2 border-b text-center">
                                      {i + 1}
                                    </td>
                                    <td className="py-2 border-b text-center">
                                      {sigFig(ress[i], round)}
                                    </td>
                                    <td className="py-2 border-b text-center">
                                      {Number(fxx[i]).toFixed(round)}
                                    </td>
                                    <td className="py-2 border-b text-center">
                                      {sigFig(fxx1[i], round)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {ress.slice(0, -1).map((_, i) => {
                            const x0 =
                              i === 0
                                ? parseFloat(result?.tech_x0 ?? 0)
                                : sigFig(ress[i - 1], round);
                            const fxVal = Number(fxx[i]).toFixed(round);
                            const fx1Val = sigFig(fxx1[i], round);
                            const xNext = sigFig(ress[i], 4);
                            return (
                              <div key={`mathstep-${i}`}>
                                <BlockMath math={`x_${i + 1}:`} />
                                <BlockMath
                                  math={`f(x_${i}) = f(${x0}) = ${enter.replace(
                                    /x/g,
                                    `(${x0})`
                                  )} = ${fxVal}`}
                                />
                                <BlockMath
                                  math={`f'(x_${i}) = f'(${x0}) = ${enter1.replace(
                                    /x/g,
                                    `(${x0})`
                                  )} = ${fx1Val}`}
                                />
                                <BlockMath
                                  math={`x_${
                                    i + 1
                                  } = x_${i} - \\frac{f(x_${i})}{f'(x_${i})}`}
                                />
                                <BlockMath
                                  math={`x_${
                                    i + 1
                                  } = ${x0} - \\frac{${fxVal}}{${fx1Val}}`}
                                />
                                <BlockMath math={`x_${i + 1} = ${xNext}`} />
                              </div>
                            );
                          })}
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

export default NewtonsMethodCalculator;

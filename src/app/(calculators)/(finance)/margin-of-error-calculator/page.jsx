"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useMarginOfErrorCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MarginOfErrorCalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean); // remove empty strings
  
    let url = "";
  
    if (parts.length === 1) {
      // sirf ek part
      url = parts[0];  // "age-calculator"
    } else {
      // do ya zyada parts
      url = parts[0] + "/" + parts[1];  // "de/age-calculator"
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
    tech_per: "11@70",
    tech_x: 50,
    tech_y: 30,
    tech_z: 60,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMarginOfErrorCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_per ||
      !formData.tech_x ||
      !formData.tech_y ||
      !formData.tech_z
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_per: formData.tech_per,
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_z: formData.tech_z,
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
      tech_per: "11@70",
      tech_x: 50,
      tech_y: 30,
      tech_z: 60,
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

  const z1 = formData?.tech_per?.split("@") || [];
  const p1 = ((formData?.tech_x || 0) / 100).toFixed(2);
  const p1Num = parseFloat(p1);

  const sqrt = Math.sqrt;
  const round = (num, decimals = 2) => parseFloat(num.toFixed(decimals));

  const isFinitePopulation = !!result?.tech_z;

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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_per" className="label">
                  {data?.payload?.tech_lang_keys["a"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_per"
                    id="tech_per"
                    value={formData.tech_per}
                    onChange={handleChange}
                  >
                    <option value="11@70">70%</option>
                    <option value="1.5@75">75%</option>
                    <option value="1.28@80">80%</option>
                    <option value="1.44@85">85%</option>
                    <option value="1.645@90">90%</option>
                    <option value="1.7@91">91%</option>
                    <option value="1.75@92">92%</option>
                    <option value="1.81@93">93%</option>
                    <option value="1.88@94">94%</option>
                    <option value="1.96@95">95%</option>
                    <option value="22@96">96%</option>
                    <option value="2.17@97">97%</option>
                    <option value="2.33@98">98%</option>
                    <option value="2.576@99">99%</option>
                    <option value="2.807@99.5">99.5%</option>
                    <option value="3.29@99.9">99.9%</option>
                    <option value="3.89@99.99">99.99%</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["p"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x"
                    id="tech_x"
                    min="1"
                    max="99"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_x}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_y" className="label">
                  {data?.payload?.tech_lang_keys["n"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_y"
                    id="tech_y"
                    className="input my-2"
                    aria-label="input"
                    placeholder="30"
                    value={formData.tech_y}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_z" className="label">
                  {data?.payload?.tech_lang_keys["pp"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_z"
                    id="tech_z"
                    className="input my-2"
                    aria-label="input"
                    placeholder="20"
                    value={formData.tech_z}
                    onChange={handleChange}
                  />
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%]  mt-2">
                        <table className="w-100 text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["ans"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_ans !== undefined &&
                                result?.tech_ans !== null ? (
                                  <>{result.tech_ans}</>
                                ) : (
                                  <span>0.0</span>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-[16px]">
                        <p className="mt-4">
                          <strong>Solution:</strong>
                        </p>

                        {!isFinitePopulation ? (
                          <>
                            <p className="mt-2">
                              MOE = z ×
                              <span className="quadratic_math-eq-token">
                                <span className="quadratic_square-root">
                                  p × (1 - p)
                                </span>
                                <span className="quadratic_square-root">n</span>
                              </span>
                            </p>
                            <p className="mt-2">
                              Where: z = {z1[0]} for a confidence level (α) of{" "}
                              {z1[1]}%, p = {p1}, and n = {result?.tech_y}
                            </p>
                            <p className="mt-2">
                              MOE = {z1[0]} ×
                              <span className="quadratic_math-eq-token">
                                <span className="quadratic_square-root">
                                  {p1} × (1 - {p1})
                                </span>
                                <span className="quadratic_square-root">
                                  {result?.tech_y}
                                </span>
                              </span>
                            </p>
                            <p className="mt-2">
                              MOE = {z1[0]} ×
                              <span className="quadratic_math-eq-token">
                                <span className="quadratic_square-root">
                                  {p1Num * (1 - p1Num)}
                                </span>
                                <span className="quadratic_square-root">
                                  {result?.tech_y}
                                </span>
                              </span>
                            </p>
                            <p className="mt-2">
                              MOE = {z1[0]} ×
                              <span className="quadratic_math-eq-token">
                                <span>
                                  {round(sqrt(p1Num * (1 - p1Num)), 2)}
                                </span>
                                <span>{round(sqrt(result?.tech_y), 2)}</span>
                              </span>
                            </p>
                            <p className="mt-2">MOE = {result?.ans}</p>
                          </>
                        ) : (
                          <>
                            <p className="mt-2">
                              MOE = z ×
                              <span className="quadratic_math-eq-token">
                                <span className="quadratic_square-root">
                                  p × (1 - p)
                                </span>
                                <span className="quadratic_square-root">
                                  ((N - 1) × n / (N - n))
                                </span>
                              </span>
                            </p>
                            <p className="mt-2">
                              Where: z = {z1[0]} for a confidence level (α) of{" "}
                              {z1[1]}%, p = {p1}, N = {result?.tech_z}, and n ={" "}
                              {result?.tech_y}
                            </p>
                            <p className="mt-2">
                              MOE = {z1[0]} ×
                              <span className="quadratic_math-eq-token">
                                <span className="quadratic_square-root">
                                  {p1} × (1 - {p1})
                                </span>
                                <span className="quadratic_square-root">
                                  ({result?.tech_z - 1} × {result?.tech_y} / (
                                  {result?.tech_z - result?.tech_y}))
                                </span>
                              </span>
                            </p>
                            <p className="mt-2">
                              MOE = {z1[0]} ×
                              <span className="quadratic_math-eq-token">
                                <span className="quadratic_square-root">
                                  {p1Num} × {1 - p1Num}
                                </span>
                                <span className="quadratic_square-root">
                                  {result?.tech_z - 1} × {result?.tech_y} / (
                                  {result?.tech_z - result?.tech_y})
                                </span>
                              </span>
                            </p>
                            <p className="mt-2">
                              MOE = {z1[0]} ×
                              <span className="quadratic_math-eq-token">
                                <span className="quadratic_square-root">
                                  ({round(p1Num * (1 - p1Num), 2)})
                                </span>
                                {result?.tech_z === result?.tech_y ? (
                                  <span className="quadratic_square-root">
                                    0
                                  </span>
                                ) : (
                                  <span className="quadratic_square-root">
                                    {round(sqrt(result?.tech_z - 1), 2)} × (
                                    {round(
                                      result?.tech_y /
                                        (result?.tech_z - result?.tech_y),
                                      2
                                    )}
                                    )
                                  </span>
                                )}
                              </span>
                            </p>
                            <p className="mt-2">
                              MOE = {z1[0]} ×
                              <span className="quadratic_math-eq-token">
                                <span className="quadratic_square-root">
                                  ({round(sqrt(p1Num * (1 - p1Num)), 2)})
                                </span>
                                {result?.tech_z === result?.tech_y ? (
                                  <span>0</span>
                                ) : (
                                  <span>
                                    {sqrt(
                                      round(sqrt(result?.tech_z - 1), 2) *
                                        round(
                                          result?.tech_y /
                                            (result?.tech_z - result?.tech_y),
                                          2
                                        )
                                    ).toFixed(2)}
                                  </span>
                                )}
                              </span>
                            </p>
                            <p className="mt-2">MOE = {result?.tech_ans}</p>
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

export default MarginOfErrorCalculator;

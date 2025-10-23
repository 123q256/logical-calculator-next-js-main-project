"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useDiamondCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DiamondProblemSolver = () => {
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
    tech_factor_a: "",
    tech_factor_b: "6",
    tech_product: "",
    tech_sum: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDiamondCalculatorMutation();

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
        tech_factor_a: formData.tech_factor_a,
        tech_factor_b: formData.tech_factor_b,
        tech_product: formData.tech_product,
        tech_sum: formData.tech_sum,
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
      tech_factor_a: "",
      tech_factor_b: "6",
      tech_product: "",
      tech_sum: "4",
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

  const method = result?.tech_met;
  const product = formData?.tech_product;
  const factors = [];

  for (let i = 1; i * i <= product; i++) {
    if (product % i == 0) {
      const j = product / i;
      const sum = i + j;
      const highlight = sum == result?.tech_su;
      factors.push({ i, j, sum, highlight });
    }
  }

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

          <div className="lg:w-[70%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 flex justify-end items-center text-center">
                <table className="swann div_center">
                  <tbody>
                    <tr>
                      <td></td>
                      <td className="center font_size20">
                        <strong>{data?.payload?.tech_lang_keys["1"]}</strong>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className="center font_size20">
                        <strong>
                          {data?.payload?.tech_lang_keys["2"]}&nbsp;(A)
                        </strong>
                      </td>
                      <td className="answer"></td>
                      <td className="center font_size20">
                        <strong>
                          {data?.payload?.tech_lang_keys["2"]}&nbsp;(B)
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="center font_size20">
                        <strong>{data?.payload?.tech_lang_keys["5"]}</strong>
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="col-span-12">
                <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                  <p className="col-span-12 text-[14px]">
                    <b className="text-blue-800">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </b>{" "}
                    {data?.payload?.tech_lang_keys["4"]}.
                  </p>
                  <div className="col-span-6">
                    <label htmlFor="tech_factor_a" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (A):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_factor_a"
                        id="tech_factor_a"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_factor_a}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_factor_b" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (B):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_factor_b"
                        id="tech_factor_b"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_factor_b}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_product" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_product"
                        id="tech_product"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_product}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_sum" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_sum"
                        id="tech_sum"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_sum}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[50%] lg:w-[50%] overflow-auto mt-2 text-[16px]">
                          <table className="w-full text-center">
                            <tbody>
                              <tr>
                                <td></td>
                                <td>
                                  <b
                                    className={
                                      ["1", "3", "5"].includes(method)
                                        ? "text-blue-800"
                                        : ""
                                    }
                                  >
                                    {data?.payload?.tech_lang_keys["1"]}
                                  </b>
                                  <p className="text-[18px] mt-1">
                                    {result?.tech_pro}
                                  </p>
                                </td>
                                <td></td>
                              </tr>

                              <tr>
                                <td>
                                  <b
                                    className={
                                      ["4", "5", "6"].includes(method)
                                        ? "text-blue-800"
                                        : ""
                                    }
                                  >
                                    {data?.payload?.tech_lang_keys["2"]} A
                                  </b>
                                  <p className="mt-1 text-[18px] text-center">
                                    {result?.tech_facta}
                                  </p>
                                </td>
                                <td className="answer"></td>
                                <td>
                                  <b
                                    className={
                                      ["2", "3", "6"].includes(method)
                                        ? "text-blue-800"
                                        : ""
                                    }
                                  >
                                    {data?.payload?.tech_lang_keys["2"]} B
                                  </b>
                                  <p className="mt-1 text-[18px]">
                                    {result?.tech_factb}
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td></td>
                                <td>
                                  <b
                                    className={
                                      ["1", "2", "4"].includes(method)
                                        ? "text-blue-800"
                                        : ""
                                    }
                                  >
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </b>
                                  <p className="mt-1 text-[18px]">
                                    {result?.tech_su}
                                  </p>
                                </td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px] mt-2">
                          <p className="mt-2 font-bold">
                            {data?.payload?.tech_lang_keys["6"]}:
                          </p>
                          {method == "1" && (
                            <>
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["1"]} = ${data?.payload?.tech_lang_keys["2"]}A \times ${data?.payload?.tech_lang_keys["2"]}B`}
                              />
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["1"]} = ${result?.tech_facta} \times ${result?.tech_factb}`}
                              />
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["1"]
                                } = ${result?.tech_facta * result?.tech_factb}`}
                              />
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["5"]} = ${data?.payload?.tech_lang_keys["2"]}A + ${data?.payload?.tech_lang_keys["2"]}B`}
                              />
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["5"]} = ${result?.tech_facta} + ${result?.tech_factb}`}
                              />
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["5"]
                                } = ${result?.tech_facta + result?.tech_factb}`}
                              />
                            </>
                          )}
                          {method == "2" && (
                            <>
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["2"]}B = ${data?.payload?.tech_lang_keys["1"]} \div ${data?.payload?.tech_lang_keys["2"]}A`}
                              />
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["2"]}B = ${result?.tech_pro} \div ${result?.tech_facta}`}
                              />
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["2"]
                                }B = ${(
                                  result?.tech_pro / result?.tech_facta
                                ).toFixed(2)}`}
                              />
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["5"]} = ${result?.tech_facta} + ${result?.tech_factb}`}
                              />
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["5"]
                                } = ${result?.tech_facta + result?.tech_factb}`}
                              />
                            </>
                          )}
                          {method == "3" && (
                            <>
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["2"]}B = ${data?.payload?.tech_lang_keys["5"]} - ${data?.payload?.tech_lang_keys["2"]}A`}
                              />
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["2"]}B = ${result?.tech_su} - ${result?.tech_facta}`}
                              />
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["2"]
                                }B = ${result?.tech_su - result?.tech_facta}`}
                              />
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["1"]} = ${result?.tech_facta} \times ${result?.tech_factb}`}
                              />
                            </>
                          )}
                          {method == "4" && (
                            <>
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["2"]}A = ${data?.payload?.tech_lang_keys["1"]} \div ${data?.payload?.tech_lang_keys["2"]}B`}
                              />
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["2"]}A = ${result?.tech_pro} \div ${result?.tech_factb}`}
                              />
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["2"]
                                }A = ${(
                                  result?.tech_pro / result?.tech_factb
                                ).toFixed(2)}`}
                              />
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["5"]} = ${result?.tech_facta} + ${result?.tech_factb}`}
                              />
                            </>
                          )}
                          {method == "5" && (
                            <>
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["2"]}A = ${data?.payload?.tech_lang_keys["5"]} - ${data?.payload?.tech_lang_keys["2"]}B`}
                              />
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["2"]}A = ${result?.tech_su} - ${result?.tech_factb}`}
                              />
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["2"]
                                }A = ${result?.tech_su - result?.tech_factb}`}
                              />
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["1"]} = ${result?.tech_facta} \times ${result?.tech_factb}`}
                              />
                            </>
                          )}
                          {method == "6" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["7"]}{" "}
                                {result?.tech_pro} are:
                              </p>
                              {factors.map(({ i, j, sum, highlight }, idx) => (
                                <p
                                  key={idx}
                                  className={`mt-2 ${
                                    highlight ? "text-orange-600 font-bold" : ""
                                  }`}
                                >
                                  [{i}, {j}] and {i} + {j} = {sum}
                                </p>
                              ))}
                            </>
                          )}
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

export default DiamondProblemSolver;

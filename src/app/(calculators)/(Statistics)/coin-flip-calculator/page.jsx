"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useCoinFlipCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CoinFlipCalculator = () => {
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
    tech_flips: 6,
    tech_heads: 2,
    tech_probablity: 0.5,
    tech_type: "1", // 1 2 3
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCoinFlipCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_flips ||
      !formData.tech_heads ||
      !formData.tech_probablity ||
      !formData.tech_heads
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_flips: formData.tech_flips,
        tech_heads: formData.tech_heads,
        tech_probablity: formData.tech_probablity,
        tech_type: formData.tech_type,
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
      tech_flips: 6,
      tech_heads: 2,
      tech_probablity: 0.5,
      tech_type: "1", // 1 2 3
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

  const arrayAwa = result?.tech_array_awa || [];
  const read = arrayAwa.length - 1;

  const renderPMultiple = () => {
    const parts = [];
    for (let i = result.tech_heads; i <= result.tech_flips; i++) {
      parts.push(`P(${i})`);
    }
    return parts.join(" + ");
  };

  const renderSum = () => {
    return [result.tech_ans, ...arrayAwa].join(" + ");
  };

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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
            <div className="grid grid-cols-12 gap-1 md:gap-3">
              <div className="lg:col-span-6 md:col-span-6 col-span-12 relative">
                <label htmlFor="tech_flips" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (n):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_flips"
                    id="tech_flips"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_flips}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_heads" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (X):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_heads"
                    id="tech_heads"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_heads}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_probablity" className="label">
                  {data?.payload?.tech_lang_keys["3"]} (p):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_probablity"
                    id="tech_probablity"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_probablity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
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
                    <option value="1">
                      {data?.payload?.tech_lang_keys["5"]} X{" "}
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["7"]} X{" "}
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["8"]} X{" "}
                      {data?.payload?.tech_lang_keys["6"]}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full">
                      {result?.tech_type === "1" && (
                        <div className="lg:w-[80%] md:w-[90%] mt-2 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  <InlineMath
                                    math={`P(${result?.tech_heads})`}
                                  />{" "}
                                  {data?.payload?.tech_lang_keys["9"]}{" "}
                                  {result?.tech_heads}{" "}
                                  {data?.payload?.tech_lang_keys["6"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_ans}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <InlineMath
                                    math={`P(${result?.tech_heads})`}
                                  />{" "}
                                  {data?.payload?.tech_lang_keys["9"]}{" "}
                                  {result?.tech_heads}{" "}
                                  {data?.payload?.tech_lang_keys["20"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {1 - result?.tech_ans}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {(result?.tech_ans * 100).toFixed(2)}%
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                      {result?.tech_type === "2" && (
                        <div className="lg:w-[90%] md:w-[90%] mt-2 overflow-auto">
                          <table className="w-full text-[18px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  <InlineMath
                                    math={`P(X≥${result?.tech_heads})`}
                                  />{" "}
                                  {data?.payload?.tech_lang_keys["10"]}
                                  {result?.tech_heads}{" "}
                                  {data?.payload?.tech_lang_keys["6"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {(
                                      result?.tech_summer + result?.tech_ans
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <InlineMath
                                    math={`P(X≥${result?.tech_heads})`}
                                  />{" "}
                                  {data?.payload?.tech_lang_keys["10"]}
                                  {result?.tech_heads}{" "}
                                  {data?.payload?.tech_lang_keys["20"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {(
                                      1 -
                                      (result?.tech_summer + result?.tech_ans)
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {(
                                      (result?.tech_summer + result?.tech_ans) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                      {result?.tech_type === "3" && (
                        <div className="lg:w-[90%] md:w-[90%] mt-2 overflow-auto">
                          <table className="w-full text-[18px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  <InlineMath
                                    math={`P(X≤${result?.tech_heads})`}
                                  />{" "}
                                  {data?.payload?.tech_lang_keys["12"]}{" "}
                                  {result?.tech_heads}{" "}
                                  {data?.payload?.tech_lang_keys["6"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_summer}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <InlineMath
                                    math={`P(X≤${result?.tech_heads})`}
                                  />{" "}
                                  {data?.payload?.tech_lang_keys["12"]}{" "}
                                  {result?.tech_heads}{" "}
                                  {data?.payload?.tech_lang_keys["20"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {(1 - result?.tech_summer).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {(result?.tech_summer * 100).toFixed(2)}%
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div>
                        <p className="col-12 mt-3 font-s-20">
                          {data?.payload?.tech_lang_keys["13"]}:
                        </p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys["14"]}:
                        </p>

                        {result?.tech_type === "1" ||
                        result?.tech_type === "2" ? (
                          <>
                            <p className="col-12 mt-2">
                              <InlineMath math="P(X)=\dfrac{n!}{X!(n-X)!} \cdot p^X \cdot (1-p)^{n-X}" />
                            </p>

                            {result?.tech_type === "2" && (
                              <p className="col-12 mt-2">
                                {data?.payload?.tech_lang_keys["15"]} P(
                                {result?.tech_heads})
                              </p>
                            )}

                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys["16"]} : n=
                              {result?.tech_flips}, X={result?.tech_heads}, p=
                              {result?.tech_probablity}{" "}
                              {data?.payload?.tech_lang_keys["21"]}
                            </p>

                            <p className="col-12 mt-2">
                              <InlineMath
                                math={`P(${result?.tech_heads})=\\dfrac{${
                                  result?.tech_flips
                                }!}{${result?.tech_heads}!(${
                                  result?.tech_flips
                                }-${result?.tech_heads})!} \\cdot (${
                                  result?.tech_probablity
                                })^{${result?.tech_heads}} \\cdot (1-${
                                  result?.tech_probablity
                                })^{${
                                  result?.tech_flips - result?.tech_heads
                                }}`}
                              />
                            </p>

                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys["17"]}
                            </p>

                            <p className="col-12 mt-3">
                              <InlineMath
                                math={`P(${result?.tech_heads})=${result?.tech_ans}`}
                              />
                            </p>

                            {result?.tech_type === "2" && (
                              <>
                                <p className="col-12 mt-3 font-s-20 text-blue">
                                  {data?.payload?.tech_lang_keys["18"]}:
                                </p>
                                <p className="col-12 mt-2">
                                  {data?.payload?.tech_lang_keys["19"]}:
                                </p>

                                <p className="col-12 mt-2">
                                  <InlineMath
                                    math={`P(X≥${
                                      result?.tech_heads
                                    }) = ${renderPMultiple()}`}
                                  />
                                </p>

                                <p className="col-12 mt-2">
                                  <InlineMath
                                    math={`P(X≥${
                                      result?.tech_heads
                                    }) = ${renderSum()}`}
                                  />
                                </p>

                                <p className="col-12 mt-2 dk text-blue font-s-20">
                                  <InlineMath
                                    math={`P(X≥${result?.tech_heads}) = ${
                                      Math.round(
                                        (result?.tech_summer +
                                          result?.tech_ans) *
                                          100000
                                      ) / 100000
                                    }`}
                                  />
                                </p>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="col-12 mt-2">
                              <InlineMath math="P(X)=\dfrac{n!}{X!(n-X)!} \cdot p^X \cdot (1-p)^{n-X}" />
                            </p>

                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys["15"]} P(0)
                            </p>

                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys["16"]}: n=
                              {result?.tech_flips}, X=0, p=
                              {result?.tech_probablity}{" "}
                              {data?.payload?.tech_lang_keys["21"]}
                            </p>

                            <p className="col-12 mt-2">
                              <InlineMath
                                math={`P(0)=\\dfrac{${result?.tech_flips}!}{0!(${result?.tech_flips}-0)!} \\cdot (${result?.tech_probablity})^0 \\cdot (1-${result?.tech_probablity})^{${result?.tech_flips}}`}
                              />
                            </p>

                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys["17"]}
                            </p>

                            <p className="col-12 mt-2">
                              <InlineMath math={`P(0) = ${result?.tech_ans}`} />
                            </p>

                            <p className="col-12 mt-3 font-s-20 text-blue">
                              {data?.payload?.tech_lang_keys["18"]}:
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys["19"]}:
                            </p>

                            <p className="col-12 mt-2">
                              <InlineMath
                                math={`P(X≤${
                                  result?.tech_heads
                                }) = ${Array.from(
                                  { length: result?.tech_heads + 1 },
                                  (_, i) => `P(${i})`
                                ).join(" + ")}`}
                              />
                            </p>

                            <p className="col-12 mt-2">
                              <InlineMath
                                math={`P(X≤${
                                  result?.tech_heads
                                }) = ${arrayAwa.join(" + ")}`}
                              />
                            </p>

                            <p className="col-12 mt-2">
                              <InlineMath
                                math={`P(X≤${result?.tech_heads}) = ${
                                  Math.round(result?.tech_summer * 100000) /
                                  100000
                                }`}
                              />
                            </p>
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

export default CoinFlipCalculator;

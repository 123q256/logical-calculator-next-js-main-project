"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  usePythagoreanTheoremCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PythagoreanTheoremCalculator = () => {
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
    tech_for: "a", //  a b c ar
    tech_one: "12",
    tech_two: "23",
    tech_unit: "mm",
    tech_nbr: "6",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePythagoreanTheoremCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_for) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_for: formData.tech_for,
        tech_one: formData.tech_one,
        tech_two: formData.tech_two,
        tech_unit: formData.tech_unit,
        tech_nbr: formData.tech_nbr,
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
      tech_for: "a", //  a b c ar
      tech_one: "12",
      tech_two: "23",
      tech_unit: "mm",
      tech_nbr: "6",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <div className="col-12 mt-0 mt-lg-2">
                  <label htmlFor="tech_for" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_for"
                      id="tech_for"
                      value={formData.tech_for}
                      onChange={handleChange}
                    >
                      <option value="a">
                        {data?.payload?.tech_lang_keys["2"]} a
                      </option>
                      <option value="b">
                        {data?.payload?.tech_lang_keys["2"]} b
                      </option>
                      <option value="c">
                        {data?.payload?.tech_lang_keys["3"]} c
                      </option>
                      <option value="ar">
                        {data?.payload?.tech_lang_keys["6"]} A
                      </option>
                    </select>
                  </div>
                </div>
                <div className="col-12 mt-0 mt-lg-2">
                  <label htmlFor="tech_one" className="label">
                    {data?.payload?.tech_lang_keys["2"]}{" "}
                    {formData?.tech_for !== "a" ? "a" : "b"}
                  </label>

                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_one"
                      id="tech_one"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_one}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-12 mt-0 mt-lg-2">
                  <label htmlFor="tech_two" className="label">
                    {formData?.tech_for === "ar"
                      ? `${data?.payload?.tech_lang_keys["2"]} b`
                      : `${data?.payload?.tech_lang_keys["3"]} c`}
                  </label>

                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_two"
                      id="tech_two"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_two}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-12 mt-0 mt-lg-2">
                  <label htmlFor="tech_unit" className="label">
                    {data?.payload?.tech_lang_keys["4"]}:
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
                      <option value="m">m</option>
                      <option value="cm">cm</option>
                      <option value="mm">mm</option>
                      <option value="yd">yd</option>
                      <option value="ft">ft</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                </div>
                <div className="col-12 mt-0 mt-lg-2">
                  <label htmlFor="tech_nbr" className="label">
                    {data?.payload?.tech_lang_keys["4"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_nbr"
                      id="tech_nbr"
                      value={formData.tech_nbr}
                      onChange={handleChange}
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 overflow-auto">
                <div className="w-full text-[32px] text-center mt-5">
                  {formData?.tech_for === "a" && (
                    <BlockMath math={`a = \\sqrt{c^2 - b^2}`} />
                  )}
                  {formData?.tech_for === "b" && (
                    <BlockMath math={`b = \\sqrt{c^2 - a^2}`} />
                  )}
                  {formData?.tech_for === "c" && (
                    <BlockMath math={`c = \\sqrt{a^2 + b^2}`} />
                  )}
                  {formData?.tech_for === "ar" && (
                    <BlockMath math={`A = \\frac{1}{2} ab`} />
                  )}
                </div>

                <div className="w-full text-center mt-5">
                  <img
                    src="/images/tri-ang.webp"
                    width="220"
                    height="100%"
                    alt="Pythagorean Theorem"
                    loading="lazy"
                    decoding="async"
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                        <table className="w-full text-[16px]">
                          <tbody>
                            {formData?.tech_for === "a" ? (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["2"]} a
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_a).toFixed(2)}{" "}
                                    {formData?.tech_unit}
                                  </td>
                                </tr>
                              </>
                            ) : formData?.tech_for === "b" ? (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["2"]} b
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_b).toFixed(2)}{" "}
                                    {formData?.tech_unit}
                                  </td>
                                </tr>
                              </>
                            ) : formData?.tech_for === "c" ? (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["3"]} c
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_c).toFixed(2)}{" "}
                                    {formData?.tech_unit}
                                  </td>
                                </tr>
                              </>
                            ) : (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_area).toFixed(2)}{" "}
                                    {formData?.tech_unit}²
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                        <table className="w-full text-[16px]">
                          <tbody>
                            {formData?.tech_for !== "ar" && (
                              <>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    {data?.payload?.tech_lang_keys["6"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(result?.tech_area).toFixed(2)}{" "}
                                      {formData?.tech_unit}²
                                    </strong>
                                  </td>
                                </tr>
                              </>
                            )}
                            <tr>
                              <td className="py-2 border-b">
                                {data?.payload?.tech_lang_keys["7"]}
                              </td>
                              <td className="py-2 border-b">
                                <strong>
                                  {Number(result?.tech_peri).toFixed(2)}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">∠α</td>
                              <td className="py-2 border-b">
                                <strong>
                                  {Number(result?.tech_a_deg).toFixed(2)}° (
                                  {Number(result?.tech_alfa).toFixed(2)} rad)
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">∠β</td>
                              <td className="py-2 border-b">
                                <strong>
                                  {Number(result?.tech_b_deg).toFixed(2)}° (
                                  {Number(result?.tech_beta).toFixed(2)} rad)
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">h</td>
                              <td className="py-2 border-b">
                                <strong>
                                  {Number(result?.tech_h).toFixed(2)}
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-[16px] overflow-auto">
                        <p className="mt-3">
                          <strong>Step-by-Step Calculation:</strong>
                        </p>

                        {formData?.tech_for === "a" && (
                          <>
                            <BlockMath math={`a = \\sqrt{c^2 - b^2}`} />
                            <BlockMath
                              math={`a = \\sqrt{${result?.tech_c}^2 - ${result?.tech_b}^2}`}
                            />
                            <BlockMath
                              math={`a = \\sqrt{${Math.pow(
                                result?.tech_c,
                                2
                              )} - ${Math.pow(result?.tech_b, 2)}}`}
                            />
                            <BlockMath
                              math={`a = \\sqrt{${
                                Math.pow(result?.tech_c, 2) -
                                Math.pow(result?.tech_b, 2)
                              }}`}
                            />
                            <BlockMath math={`a = ${result?.tech_a}`} />
                          </>
                        )}

                        {formData?.tech_for === "b" && (
                          <>
                            <BlockMath math={`b = \\sqrt{c^2 - a^2}`} />
                            <BlockMath
                              math={`b = \\sqrt{${result?.tech_c}^2 - ${result?.tech_a}^2}`}
                            />
                            <BlockMath
                              math={`b = \\sqrt{${Math.pow(
                                result?.tech_c,
                                2
                              )} - ${Math.pow(result?.tech_a, 2)}}`}
                            />
                            <BlockMath
                              math={`b = \\sqrt{${
                                Math.pow(result?.tech_c, 2) -
                                Math.pow(result?.tech_a, 2)
                              }}`}
                            />
                            <BlockMath math={`b = ${result?.tech_b}`} />
                          </>
                        )}

                        {formData?.tech_for === "c" && (
                          <>
                            <BlockMath math={`c = \\sqrt{a^2 + b^2}`} />
                            <BlockMath
                              math={`c = \\sqrt{${result?.tech_a}^2 + ${result?.tech_b}^2}`}
                            />
                            <BlockMath
                              math={`c = \\sqrt{${Math.pow(
                                result?.tech_a,
                                2
                              )} + ${Math.pow(result?.tech_b, 2)}}`}
                            />
                            <BlockMath
                              math={`c = \\sqrt{${
                                Math.pow(result?.tech_a, 2) +
                                Math.pow(result?.tech_b, 2)
                              }}`}
                            />
                            <BlockMath math={`c = ${result?.tech_c}`} />
                          </>
                        )}

                        {/* Angle alpha */}
                        <BlockMath
                          math={`\\alpha = \\sin^{-1}\\left(\\frac{a}{c}\\right)`}
                        />
                        <BlockMath
                          math={`\\alpha = \\sin^{-1}\\left(\\frac{${result?.tech_a}}{${result?.tech_c}}\\right)`}
                        />
                        <BlockMath
                          math={`\\alpha = ${result?.tech_a_deg}^\\circ`}
                        />
                        <BlockMath
                          math={`\\alpha = ${result?.tech_alfa}\\ \\text{rad}`}
                        />

                        {/* Angle beta */}
                        <BlockMath
                          math={`\\beta = \\sin^{-1}\\left(\\frac{b}{c}\\right)`}
                        />
                        <BlockMath
                          math={`\\beta = \\sin^{-1}\\left(\\frac{${result?.tech_b}}{${result?.tech_c}}\\right)`}
                        />
                        <BlockMath
                          math={`\\beta = ${result?.tech_b_deg}^\\circ`}
                        />
                        <BlockMath
                          math={`\\beta = ${result?.tech_beta}\\ \\text{rad}`}
                        />

                        {/* Area */}
                        <BlockMath
                          math={`\\text{area} = \\frac{a \\times b}{2}`}
                        />
                        <BlockMath
                          math={`\\text{area} = \\frac{${result?.tech_a} \\times ${result?.tech_b}}{2}`}
                        />
                        <BlockMath
                          math={`\\text{area} = \\frac{${
                            result?.tech_a * result?.tech_b
                          }}{2}`}
                        />
                        <BlockMath
                          math={`\\text{area} = ${result?.tech_area}`}
                        />

                        {/* Perimeter */}
                        <BlockMath
                          math={`\\text{${data?.payload?.tech_lang_keys["7"]}} = a + b + c`}
                        />
                        <BlockMath
                          math={`\\text{${data?.payload?.tech_lang_keys["7"]}} = ${result?.tech_a} + ${result?.tech_b} + ${result?.tech_c}`}
                        />
                        <BlockMath
                          math={`\\text{${data?.payload?.tech_lang_keys["7"]}} = ${result?.tech_peri}`}
                        />

                        {/* Height */}
                        <BlockMath math={`h = \\frac{a \\times b}{c}`} />
                        <BlockMath
                          math={`h = \\frac{${result?.tech_a} \\times ${result?.tech_b}}{${result?.tech_c}}`}
                        />
                        <BlockMath
                          math={`h = \\frac{${
                            result?.tech_a * result?.tech_b
                          }}{${result?.tech_c}}`}
                        />
                        <BlockMath math={`h = ${result?.tech_h}`} />
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

export default PythagoreanTheoremCalculator;

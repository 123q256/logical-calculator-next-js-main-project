"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useEllipseEquationCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EllipseCalculator = () => {
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
    tech_selection: "1",
    tech_d1: "3",
    tech_second_value: "6",
    tech_n2: "8",
    tech_c1: "4",
    tech_c2: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEllipseEquationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_d1: formData.tech_d1,
        tech_second_value: formData.tech_second_value,
        tech_n2: formData.tech_n2,
        tech_c1: formData.tech_c1,
        tech_c2: formData.tech_c2,
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
      tech_selection: "1",
      tech_d1: "3",
      tech_second_value: "6",
      tech_n2: "8",
      tech_c1: "4",
      tech_c2: "4",
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
  const tech_upr = result?.tech_upr ?? 1;
  const tech_btm = result?.tech_btm ?? 1;
  const tech_upr1 = result?.tech_upr1 ?? 1;
  const tech_btm1 = result?.tech_btm1 ?? 1;

  function gcd(a, b) {
    while (b !== 0) {
      let t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  function lcm(a, b) {
    return (a * b) / gcd(a, b);
  }

  // Assuming result.tech_upr, tech_upr1, tech_btm, tech_btm1 are numbers
  let x = Number(result?.tech_upr ?? 1);
  let y = Number(result?.tech_upr1 ?? 1);

  // Swap if x > y
  if (x > y) {
    [x, y] = [y, x];
  }

  const _gcd = gcd(x, y);
  const _lcm = lcm(x, y);

  const calculate_lcm1 = _lcm / x;
  const calculate_lcm2 = _lcm / y;

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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_selection" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_selection"
                    id="tech_selection"
                    value={formData.tech_selection}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 text-[18px] text-center">
                {formData.tech_selection == "1" && (
                  <>
                    <div className="equation">
                      <BlockMath math="Ax^2 + Bx^2 = C" />
                    </div>
                  </>
                )}
                {formData.tech_selection == "2" && (
                  <>
                    <div className="equation1">
                      <BlockMath math="\frac{(x - c1)^2}{a^2} + \frac{(y - c2)^2}{b^2} = 1" />
                    </div>
                  </>
                )}
              </div>

              {(formData.tech_selection == "1" ||
                formData.tech_selection == "2") && (
                <>
                  <div
                    className={`${
                      formData.tech_selection === "2"
                        ? "md:col-span-6 col-span-12"
                        : "md:col-span-4 col-span-12"
                    } aValue`}
                  >
                    {formData.tech_selection == "1" && (
                      <>
                        <label htmlFor="tech_d1" className="label">
                          A:{" "}
                        </label>
                      </>
                    )}
                    {formData.tech_selection == "2" && (
                      <>
                        <label htmlFor="tech_d1" className="label">
                          a:{" "}
                        </label>
                      </>
                    )}
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_d1"
                        id="tech_d1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_d1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {(formData.tech_selection == "1" ||
                formData.tech_selection == "2") && (
                <>
                  <div
                    className={`${
                      formData.tech_selection === "2"
                        ? "md:col-span-6 col-span-12"
                        : "md:col-span-6 col-span-12"
                    } bValue`}
                  >
                    {formData.tech_selection == "1" && (
                      <>
                        <label htmlFor="tech_second_value" className="label">
                          B:{" "}
                        </label>
                      </>
                    )}
                    {formData.tech_selection == "2" && (
                      <>
                        <label htmlFor="tech_second_value" className="label">
                          b:{" "}
                        </label>
                      </>
                    )}
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_second_value"
                        id="tech_second_value"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_second_value}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_selection == "1" && (
                <>
                  <div className="md:col-span-4 col-span-12  cValue">
                    <label htmlFor="tech_n2" className="label">
                      C:{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_n2"
                        id="tech_n2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_n2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_selection == "2" && (
                <>
                  <div className="md:col-span-6 col-span-12  c1">
                    <label htmlFor="tech_c1" className="label">
                      c1:{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_c1"
                        id="tech_c1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_c1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-6 col-span-12  c2">
                    <label htmlFor="tech_c2" className="label">
                      c2:{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_c2"
                        id="tech_c2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_c2}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full overflow-auto">
                      {result?.tech_method === "1" ? (
                        <>
                          <div className="w-full text-[16px] overflow-auto">
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["4"]}
                              </strong>
                            </p>

                            <p className="mt-3">
                              <InlineMath
                                math={`\\dfrac{(x-0)^2}{\\dfrac{${tech_upr}}{${tech_btm}}} + \\dfrac{(y-0)^2}{\\dfrac{${tech_upr1}}{${tech_btm1}}} = 1`}
                              />
                            </p>

                            <div className="print">
                              <p className="mt-3 text-[18px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["5"]}
                                </strong>
                              </p>
                            </div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["3"]}:
                              </strong>
                            </p>

                            <div className="col-12 mt-3 standard_form"></div>

                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["6"]}:
                              </strong>
                            </p>

                            <p className="mt-3">
                              <InlineMath
                                math={`\\dfrac{${
                                  result?.tech_btm ?? 1
                                } x^{2}}{${x}} + \\dfrac{${
                                  result?.tech_btm1 ?? 1
                                } y^{2}}{${y}} = 1`}
                              />
                            </p>

                            <p className="mt-3 font-s18">
                              <strong>
                                {data?.payload?.tech_lang_keys["2"]}:
                              </strong>
                            </p>

                            <p className="mt-3">
                              <InlineMath
                                math={`${
                                  calculate_lcm1 * (result?.tech_btm ?? 1)
                                } x^{2} + ${
                                  calculate_lcm2 * (result?.tech_btm1 ?? 1)
                                } y^{2} - ${_lcm} = 0`}
                              />
                            </p>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]} c
                              </strong>
                            </p>
                            <div className="col-12 mt-3 linear_eccentricity"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["8"]} c
                              </strong>
                            </p>
                            <div className="col-12 mt-3 eccentricity"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["9"]}:
                              </strong>
                            </p>
                            <div className="col-12 mt-3 first_vertex"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["10"]}:
                              </strong>
                            </p>
                            <div className="col-12 mt-3 second_vertex"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["11"]}:
                              </strong>
                            </p>
                            <div className="col-12 mt-3 first_co_vertex"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["12"]}:
                              </strong>
                            </p>
                            <div className="col-12 mt-3 second_co_vertex"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]}:
                              </strong>
                            </p>
                            <div className="col-12 mt-3 first_focus"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]}:
                              </strong>
                            </p>
                            <div className="col-12 mt-3 second_focus"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]}
                              </strong>
                            </p>
                            <div className="col-12 mt-3 area"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["16"]}
                              </strong>
                            </p>

                            <p className="mt-3">
                              <strong>
                                <InlineMath
                                  math={`\\left[ \\begin{array}{ccc} h - a, & h + a \\end{array} \\right] =`}
                                />
                              </strong>
                            </p>

                            <div className="col-12 mt-3 domain"></div>

                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]}
                              </strong>
                            </p>

                            <p className="mt-3">
                              <InlineMath
                                math={`\\left[ \\begin{array}{ccc} k - b, & k + b \\end{array} \\right] =`}
                              />
                            </p>
                            <div className="col-12 mt-3 range"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["18"]}
                              </strong>
                            </p>
                            <p className="mt-3">(0,0)</p>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["19"]}
                              </strong>
                            </p>
                            <div className="col-12 mt-3 major_axis"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["20"]}
                              </strong>
                            </p>
                            <div className="col-12 mt-3 semi_major_axis"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["21"]}
                              </strong>
                            </p>
                            <div className="col-12 mt-3 minor_axis"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["22"]}
                              </strong>
                            </p>
                            <div className="col-12 mt-3 semi_minor_axis"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["23"]}:{" "}
                              </strong>
                            </p>
                            <div className="col-12 mt-3 first_latus_rectum"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["24"]}:{" "}
                              </strong>
                            </p>
                            <div className="col-12 mt-3 second_latus_rectum"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                x-{data?.payload?.tech_lang_keys["25"]}:
                              </strong>
                            </p>
                            <div className="col-12 mt-3 x-intercepts"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                y-{data?.payload?.tech_lang_keys["25"]}:
                              </strong>
                            </p>
                            <div className="col-12 mt-3 y-intercepts"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["26"]}:
                              </strong>
                            </p>
                            <div className="col-12 mt-3 circumference"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["27"]}:
                              </strong>
                            </p>
                            <div className="col-12 mt-3 first_directix"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["28"]}:
                              </strong>
                            </p>
                            <div className="col-12 mt-3 second_directix"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["29"]}:
                              </strong>
                            </p>
                            <div className="col-12 mt-3 focal_parameter"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["30"]}:
                              </strong>
                            </p>
                            <div className="col-12 mt-3 latera_recta"></div>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["31"]}:
                              </strong>
                            </p>
                            <div
                              id="box1"
                              className="col-lg-8 mx-auto mt-4"
                            ></div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full text-[16px] overflow-auto">
                            {result?.tech_d1 >= result?.tech_c2 ? (
                              <>
                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["32"]}
                                  </strong>
                                </p>
                                <BlockMath math="=\dfrac{2b^2}{a}" />
                                <BlockMath
                                  math={`=\\dfrac{2\\cdot ${result?.tech_c2}^2}{${result?.tech_d1}}`}
                                />
                                <BlockMath
                                  math={`=\\dfrac{${
                                    2 * result?.tech_c2 * result?.tech_c2
                                  }}{${result?.tech_d1}}`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["7"]}
                                  </strong>
                                </p>
                                <BlockMath math="=\\sqrt{a^2 - b^2}" />
                                <BlockMath
                                  math={`=\\sqrt{${result?.tech_d1 ** 2} - ${
                                    result?.tech_c2 ** 2
                                  }}`}
                                />
                                <BlockMath
                                  math={`=${result?.tech_calculate_eccentricity}`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["8"]}
                                  </strong>
                                </p>
                                <BlockMath math="=\\dfrac{\\sqrt{a^2 - b^2}}{a}" />
                                <BlockMath
                                  math={`=\\dfrac{\\sqrt{${
                                    result?.tech_d1 ** 2
                                  } - ${result?.tech_c2 ** 2}}}{${
                                    result?.tech_d1
                                  }}`}
                                />
                                <BlockMath
                                  math={`=${Math.sqrt(
                                    result?.tech_d1 ** 2 - result?.tech_c2 ** 2
                                  )}`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["19"]}
                                  </strong>
                                </p>
                                <BlockMath math={`=${2 * result?.tech_d1}`} />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["20"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=${(2 * result?.tech_d1) / 2}`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["21"]}
                                  </strong>
                                </p>
                                <BlockMath math={`=${2 * result?.tech_c2}`} />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["22"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=${(2 * result?.tech_c2) / 2}`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["16"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=\\Bigg(-${result?.tech_d1}, ${result?.tech_d1}\\Bigg)`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["17"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=\\Bigg(-${result?.tech_c2}, ${result?.tech_c2}\\Bigg)`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    x-{data?.payload?.tech_lang_keys["25"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=\\Bigg(-${result?.tech_d1}, 0\\Bigg) \\Bigg(${result?.tech_d1}, 0\\Bigg)`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    y-{data?.payload?.tech_lang_keys["25"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=\\Bigg(0, -${result?.tech_c2}\\Bigg) \\Bigg(0, ${result?.tech_c2}\\Bigg)`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["23"]} y=
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=-${Math.sqrt(
                                    result?.tech_c2 ** 2 - result?.tech_d1 ** 2
                                  )}`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["24"]} y=
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=${Math.sqrt(
                                    result?.tech_c2 ** 2 - result?.tech_d1 ** 2
                                  )}`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["13"]} F1
                                  </strong>
                                </p>
                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    Y-{data?.payload?.tech_lang_keys["33"]}
                                  </strong>
                                </p>
                                <p className="mt-3">{result?.tech_center2}</p>

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    X-{data?.payload?.tech_lang_keys["33"]}
                                  </strong>
                                </p>
                                <p className="mt-3">
                                  {-Math.sqrt(
                                    result?.tech_d1 ** 2 - result?.tech_c2 ** 2
                                  ) + result?.tech_center1}
                                </p>

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["13"]} F2
                                  </strong>
                                </p>
                                <p className="mt-3">
                                  Y-{data?.payload?.tech_lang_keys["33"]}
                                </p>
                                <p className="mt-3">{result?.tech_center2}</p>

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    X-{data?.payload?.tech_lang_keys["33"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=\\Bigg(\\sqrt{a^2 - b^2} + c2, c1\\Bigg)`}
                                />
                                <p className="mt-3">
                                  {Math.sqrt(
                                    result?.tech_d1 ** 2 - result?.tech_c2 ** 2
                                  ) + result?.tech_center1}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["34"]}
                                  </strong>
                                </p>
                                <BlockMath math="=\\dfrac{2b^2}{a}" />

                                <BlockMath
                                  math={`=\\dfrac{2\\cdot (${result?.tech_d1})^2}{${result?.tech_c2}}`}
                                />

                                <p className="mt-3">
                                  ={" "}
                                  {(
                                    (2 * result?.tech_d1 * result?.tech_d1) /
                                    result?.tech_c2
                                  ).toFixed(4)}
                                </p>

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["7"]}
                                  </strong>
                                </p>
                                {/* <BlockMath math="=\\sqrt{b^2 - a^2}" />

                                <BlockMath math={`=\\sqrt{${(result?.tech_c2 ** 2).toFixed(2)} - ${(result?.tech_d1 ** 2).toFixed(2)}}`} />
                              <BlockMath math={`=\\sqrt{(${result?.tech_c2})^2 - (${result?.tech_d1})^2}`} /> */}

                                <BlockMath
                                  math={`=\\sqrt{${(
                                    result?.tech_c2 ** 2
                                  ).toFixed(2)} - ${(
                                    result?.tech_d1 ** 2
                                  ).toFixed(2)}}`}
                                />
                                <BlockMath
                                  math={`=\\sqrt{${(
                                    result?.tech_c2 ** 2 -
                                    result?.tech_d1 ** 2
                                  ).toFixed(2)}}`}
                                />

                                <p className="mt-3">
                                  ={" "}
                                  {Math.sqrt(
                                    result?.tech_c2 ** 2 - result?.tech_d1 ** 2
                                  ).toFixed(4)}
                                </p>

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["8"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={"=\\dfrac{\\sqrt{b^2 - a^2}}{b}"}
                                />
                                <p className="mt-3">
                                  ={" "}
                                  {Number(
                                    result?.tech_calculate_eccentricity
                                  ).toFixed(4)}
                                </p>

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["19"]}
                                  </strong>
                                </p>
                                <BlockMath math={`=${2 * result?.tech_c2}`} />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["20"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=${(2 * result?.tech_c2) / 2}`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["21"]}
                                  </strong>
                                </p>
                                <BlockMath math={`=${2 * result?.tech_d1}`} />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["22"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=${(2 * result?.tech_d1) / 2}`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["16"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=\\Bigg(-${result?.tech_d1}, ${result?.tech_d1}\\Bigg)`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["17"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=\\Bigg(-${result?.tech_c2}, ${result?.tech_c2}\\Bigg)`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    x-{data?.payload?.tech_lang_keys["25"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=\\Bigg(-${result?.tech_d1}, 0\\Bigg) \\Bigg(${result?.tech_d1}, 0\\Bigg)`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    y-{data?.payload?.tech_lang_keys["25"]}
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=\\Bigg(0, -${result?.tech_c2}\\Bigg) \\Bigg(0, ${result?.tech_c2}\\Bigg)`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["23"]} y=
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=-${Math.sqrt(
                                    result?.tech_c2 ** 2 - result?.tech_d1 ** 2
                                  )}`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["24"]} y=
                                  </strong>
                                </p>
                                <BlockMath
                                  math={`=${Math.sqrt(
                                    result?.tech_c2 ** 2 - result?.tech_d1 ** 2
                                  )}`}
                                />

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["13"]} F1
                                  </strong>
                                </p>
                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    X-{data?.payload?.tech_lang_keys["33"]}
                                  </strong>
                                </p>
                                <p className="mt-3">{result?.tech_center1}</p>

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    Y-{data?.payload?.tech_lang_keys["33"]}
                                  </strong>
                                </p>
                                <p className="mt-3">
                                  {-Math.sqrt(
                                    result?.tech_c2 ** 2 - result?.tech_d1 ** 2
                                  ) + result?.tech_center2}
                                </p>

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["13"]} F2
                                  </strong>
                                </p>
                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    Y-{data?.payload?.tech_lang_keys["33"]}
                                  </strong>
                                </p>
                                <p className="mt-3">{result?.tech_center1}</p>

                                <p className="mt-3 text-[18px]">
                                  <strong>
                                    Y-{data?.payload?.tech_lang_keys["33"]}
                                  </strong>
                                </p>
                                <p className="mt-3">
                                  {Math.sqrt(
                                    result?.tech_c2 ** 2 - result?.tech_d1 ** 2
                                  ) + result?.tech_center2}
                                </p>
                              </>
                            )}

                            {/* Area */}
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]}
                              </strong>
                            </p>
                            <BlockMath math="=\\pi ab" />
                            <BlockMath
                              math={`=\\pi \\cdot ${result?.tech_d1} \\cdot ${result?.tech_c2}`}
                            />
                            <p className="mt-3">{result?.tech_area}</p>

                            {/* Approximate perimeter using Ramanujan formula (π(a+b)) */}
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["35"]}
                              </strong>
                            </p>
                            <p className="mt-3">
                              {3.14 * (result?.tech_d1 + result?.tech_c2)}
                            </p>

                            {/* Center */}
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["18"]}
                              </strong>
                            </p>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                X-{data?.payload?.tech_lang_keys["33"]}
                              </strong>
                            </p>
                            <p className="mt-3">{result?.tech_center1}</p>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                Y-{data?.payload?.tech_lang_keys["33"]}
                              </strong>
                            </p>
                            <p className="mt-3">{result?.tech_center2}</p>

                            {/* Vertex 1 (left horizontal vertex) */}
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} V1 (
                                {data?.payload?.tech_lang_keys["37"]})
                              </strong>
                            </p>
                            <BlockMath math="=(-a + c_1,\ c_2)" />
                            <p className="mt-3 text-[18px]">
                              <strong>
                                X-{data?.payload?.tech_lang_keys["33"]}
                              </strong>
                            </p>
                            <p className="mt-3">
                              {-result?.tech_d1 + result?.tech_center1}
                            </p>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                Y-{data?.payload?.tech_lang_keys["33"]}
                              </strong>
                            </p>
                            <p className="mt-3">{result?.tech_center2}</p>

                            {/* Vertex 2 (right horizontal vertex) */}
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} V2 (
                                {data?.payload?.tech_lang_keys["37"]})
                              </strong>
                            </p>
                            <BlockMath math="=(a + c_1,\ c_2)" />
                            <p className="mt-3 text-[18px]">
                              <strong>
                                X-{data?.payload?.tech_lang_keys["33"]}
                              </strong>
                            </p>
                            <p className="mt-3">
                              {result?.tech_d1 + result?.tech_center1}
                            </p>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                Y-{data?.payload?.tech_lang_keys["33"]}
                              </strong>
                            </p>
                            <p className="mt-3">{result?.tech_center2}</p>

                            {/* Vertex 3 (bottom vertical vertex) */}
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} V3 (
                                {data?.payload?.tech_lang_keys["38"]})
                              </strong>
                            </p>
                            <BlockMath math="=(c_1,\ -b + c_2)" />
                            <p className="mt-3 text-[18px]">
                              <strong>
                                X-{data?.payload?.tech_lang_keys["33"]}
                              </strong>
                            </p>
                            <p className="mt-3">{result?.tech_center1}</p>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                Y-{data?.payload?.tech_lang_keys["33"]}
                              </strong>
                            </p>
                            <p className="mt-3">
                              {-result?.tech_c2 + result?.tech_center2}
                            </p>

                            {/* Vertex 4 (top vertical vertex) */}
                            <p className="mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} V4 (
                                {data?.payload?.tech_lang_keys["38"]})
                              </strong>
                            </p>
                            <BlockMath math="=(c_1,\ b + c_2)" />
                            <p className="mt-3 text-[18px]">
                              <strong>
                                X-{data?.payload?.tech_lang_keys["33"]}
                              </strong>
                            </p>
                            <p className="mt-3">{result?.tech_center1}</p>
                            <p className="mt-3 text-[18px]">
                              <strong>
                                Y-{data?.payload?.tech_lang_keys["33"]}
                              </strong>
                            </p>
                            <p className="mt-3">
                              {result?.tech_c2 + result?.tech_center2}
                            </p>
                          </div>
                        </>
                      )}
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

export default EllipseCalculator;

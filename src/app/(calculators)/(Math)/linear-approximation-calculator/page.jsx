"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useLinearApproximationCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LinearApproximationCalculator = () => {
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
    tech_type: "1", // 1 2 3
    tech_EnterEq: "t^2 + 3t",
    tech_EnterEq1: "2t",
    tech_point: 3,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLinearApproximationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_EnterEq: formData.tech_EnterEq,
        tech_EnterEq1: formData.tech_EnterEq1,
        tech_point: formData.tech_point,
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
      tech_type: "1", // 1 2 3
      tech_EnterEq: "t^2 + 3t",
      tech_EnterEq1: "2t",
      tech_point: 3,
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

  // Pre-calculate the sign
  const sign = result?.tech_final > 0 ? "+" : "";

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
          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["main"]}:
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
                      {data?.payload?.tech_lang_keys["2"]} : y=f(x)
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]} : x=x(t), y=y(t)
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["3"]} : r=r(t)
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                {formData?.tech_type == "2" ? (
                  <>
                    <label htmlFor="tech_EnterEq" className="label">
                      {data?.payload?.tech_lang_keys["4"]}: x(t)
                    </label>
                  </>
                ) : formData?.tech_type == "3" ? (
                  <>
                    <label htmlFor="tech_EnterEq" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["4"]}: r(t)
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_EnterEq" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["4"]}: y = f(x)
                    </label>
                  </>
                )}
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_EnterEq"
                    id="tech_EnterEq"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_EnterEq}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_type == "2" && (
                <>
                  <div className="col-span-12 sec_fun">
                    <label htmlFor="tech_EnterEq1" className="label">
                      y(t) =
                    </label>
                    <div className=" relative">
                      <input
                        type="text"
                        step="any"
                        name="tech_EnterEq1"
                        id="tech_EnterEq1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_EnterEq1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-12">
                {formData?.tech_type == "2" || formData?.tech_type == "3" ? (
                  <>
                    <label htmlFor="tech_point" className="label">
                      {" "}
                      t =
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_point" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["5"]}: x₀
                    </label>
                  </>
                )}
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_point"
                    id="tech_point"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_point}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full overflow-auto">
                        {formData?.tech_type === "1" ? (
                          <>
                            <div className="w-full text-[16px]">
                              <p className="mt-2 text-[18px]">
                                <strong>
                                  <InlineMath
                                    math={`L(x) \\approx ${result?.tech_res}`}
                                  />
                                </strong>
                              </p>

                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["7"]}:
                                </strong>
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]}{" "}
                                <InlineMath
                                  math={`f(x) = ${result?.tech_enter} \\text{ at } x_0 = ${formData?.tech_point}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["9"]}{" "}
                                <InlineMath
                                  math={`L(x) \\approx f(x_0) + f'(x_0)(x - x_0)`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}:{" "}
                                <InlineMath
                                  math={`y_0 = f(x_0) = ${result?.tech_fun}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]}:{" "}
                                <InlineMath
                                  math={`f'(x) = ${result?.tech_deri}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["12"]}. <br />
                                <InlineMath
                                  math={`f'(${formData?.tech_point}) = ${result?.tech_simple}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["13"]}: <br />
                                <InlineMath
                                  math={`L(x) \\approx ${result?.tech_fun} + ${result?.tech_simple}(x - (${formData?.tech_point}))`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["6"]}:{" "}
                                <InlineMath
                                  math={`L(x) \\approx ${result?.tech_res}`}
                                />
                              </p>
                            </div>
                          </>
                        ) : formData?.tech_type === "2" ? (
                          <>
                            <div className="w-full text-[16px] overflow-auto">
                              <p className="mt-2 text-[18px]">
                                <strong>
                                  <InlineMath
                                    math={`L(x) \\approx ${result?.tech_res}`}
                                  />
                                </strong>
                              </p>

                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["7"]}:
                                </strong>
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]}{" "}
                                <InlineMath
                                  math={`x(t) = ${result?.tech_enter},\\ y(t) = ${result?.tech_enter1} \\text{ at } x_0 = ${formData?.tech_point}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["9"]}{" "}
                                <InlineMath
                                  math={`L(x) \\approx f(x_0) + \\left.\\frac{dy}{dx}\\right|_{x_0,y_0}(x - x_0)`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["14"]}{" "}
                                <InlineMath math={`t`} />: <br />
                                <InlineMath
                                  math={`x_0 = ${result?.tech_fun},\\ y_0 = ${result?.tech_fun1}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["15"]}:{" "}
                                <InlineMath
                                  math={`\\left.\\frac{dy}{dx}\\right|_{t = ${formData?.tech_point}}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["16"]}:{" "}
                                <InlineMath
                                  math={`\\frac{dy}{dx} = \\frac{\\frac{dy}{dt}}{\\frac{dx}{dt}}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["17"]}{" "}
                                <InlineMath math={`t`} />:{" "}
                                <InlineMath
                                  math={`\\frac{dx}{dt} = ${result?.tech_deri}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <InlineMath math={`t`} />:{" "}
                                <InlineMath
                                  math={`\\frac{dy}{dt} = ${result?.tech_deri1}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["19"]}:{" "}
                                <InlineMath
                                  math={`\\frac{dy}{dx} = \\frac{${result?.tech_deri1}}{${result?.tech_deri}}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["12"]}. <br />
                                <InlineMath
                                  math={`\\left.\\frac{dy}{dx}\\right|_{t=${formData?.tech_point}} = \\frac{${result?.tech_uper}}{${result?.tech_lower}} = ${result?.tech_simple}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["13"]}: <br />
                                <InlineMath
                                  math={`L(x) \\approx ${result?.tech_fun1} + \\frac{${result?.tech_uper}}{${result?.tech_lower}}(x - (${result?.tech_fun}))`}
                                />
                                <br />
                                <InlineMath
                                  math={`L(x) \\approx ${result?.tech_fun1} + ${result?.tech_simple}(x - (${result?.tech_fun}))`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["6"]}:{" "}
                                <InlineMath
                                  math={`L(x) \\approx ${result?.tech_res}`}
                                />
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full text-[16px] overflow-auto">
                              <p className="mt-2 text-[18px]">
                                <strong>
                                  <InlineMath
                                    math={`L(x) \\approx ${result?.tech_soc}x ${sign} ${result?.tech_final}`}
                                  />
                                </strong>
                              </p>

                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["7"]}:
                                </strong>
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]}{" "}
                                <InlineMath
                                  math={`r(t) = ${result?.tech_enter} \\text{ at } t = ${formData?.tech_point}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["9"]}{" "}
                                <InlineMath
                                  math={`L(x) \\approx y_0 + \\left.\\frac{dy}{dx}\\right|_{x_0,y_0}(x - x_0)`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}:{" "}
                                <InlineMath
                                  math={`r(${formData?.tech_point}) = ${result?.tech_point}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["20"]}: <br />
                                <InlineMath
                                  math={`x_0 = r(${formData?.tech_point}) \\cdot \\cos(${formData?.tech_point}) = ${result?.tech_point} \\cos(${formData?.tech_point}),\\ y_0 = r(${formData?.tech_point}) \\cdot \\sin(${formData?.tech_point}) = ${result?.tech_point} \\sin(${formData?.tech_point})`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["15"]}:{" "}
                                <InlineMath
                                  math={`\\left.\\frac{dy}{dx}\\right|_{t = ${formData?.tech_point}}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["21"]}:{" "}
                                <InlineMath
                                  math={`\\frac{dy}{dx} = \\frac{\\frac{dr}{dt} \\sin(t) + r \\cos(t)}{\\frac{dr}{dt} \\cos(t) - r \\sin(t)}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["22"]}{" "}
                                <InlineMath math={`t`} />:{" "}
                                <InlineMath
                                  math={`\\frac{dr}{dt} = ${result?.tech_deri}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["19"]},{" "}
                                <InlineMath
                                  math={`\\left.\\frac{dy}{dx}\\right|_{t = ${formData?.tech_point}} = \\frac{(${result?.tech_deri}) \\sin(${formData?.tech_point}) + (${result?.tech_enter}) \\cos(${formData?.tech_point})}{(${result?.tech_deri}) \\cos(${formData?.tech_point}) - (${result?.tech_enter}) \\sin(${formData?.tech_point})}`}
                                />
                                <br />
                                <InlineMath
                                  math={`= \\frac{${result?.tech_fun_deri} \\sin(${formData?.tech_point}) + ${result?.tech_point} \\cos(${formData?.tech_point})}{${result?.tech_fun_deri} \\cos(${formData?.tech_point}) - ${result?.tech_point} \\sin(${formData?.tech_point})}`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["13"]}: <br />
                                <InlineMath
                                  math={`L(x) \\approx ${result?.tech_point} \\sin(${formData?.tech_point}) + \\frac{${result?.tech_fun_deri} \\sin(${formData?.tech_point}) + ${result?.tech_point} \\cos(${formData?.tech_point})}{${result?.tech_fun_deri} \\cos(${formData?.tech_point}) - ${result?.tech_point} \\sin(${formData?.tech_point})}(x - (${result?.tech_point} \\cos(${formData?.tech_point})))`}
                                />
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["6"]}:{" "}
                                <InlineMath
                                  math={`L(x) \\approx ${result?.tech_soc}x ${sign} ${result?.tech_final}`}
                                />
                              </p>
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

export default LinearApproximationCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useDivergenceCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DivergenceCalculator = () => {
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
    tech_xeq: "cos(x)",
    tech_yeq: "sin(xyz)",
    tech_zeq: "(6x + 4)",
    tech_x: 1,
    tech_y: 2,
    tech_z: 3,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDivergenceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_xeq || !formData.tech_yeq || !formData.tech_zeq) {
      setFormError("Please fill in input.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_xeq: formData.tech_xeq,
        tech_yeq: formData.tech_yeq,
        tech_zeq: formData.tech_zeq,
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_z: formData.tech_z,
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
      tech_xeq: "cos(x)",
      tech_yeq: "sin(xyz)",
      tech_zeq: "(6x + 4)",
      tech_x: 1,
      tech_y: 2,
      tech_z: 3,
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
              <div className="col-span-12">
                <p>
                  <InlineMath math={`\\mathbf{\\vec{F}}\\left(x,y,z\\right)`} />
                </p>
              </div>
              <div className="col-span-4">
                <label htmlFor="tech_xeq" className="label">
                  x:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_xeq"
                    id="tech_xeq"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_xeq}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-4">
                <label htmlFor="tech_yeq" className="label">
                  y:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_yeq"
                    id="tech_yeq"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_yeq}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-4">
                <label htmlFor="tech_zeq" className="label">
                  z:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_zeq"
                    id="tech_zeq"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_zeq}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <p>
                  <InlineMath math={`\\left(x_{0}, y_{0}, z_{0}\\right)`} /> (
                  {data?.payload?.tech_lang_keys["1"]})
                </p>
              </div>
              <div className="col-span-4">
                <label htmlFor="tech_x" className="label">
                  <InlineMath math={`\\mathbf{x_{0}}`} />
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
              <div className="col-span-4">
                <label htmlFor="tech_y" className="label">
                  <InlineMath math={`y_{0}`} />:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_y"
                    id="tech_y"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_y}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-4">
                <label htmlFor="tech_z" className="label">
                  <InlineMath math={`z_{0}`} />:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_z"
                    id="tech_z"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_z}
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[16px] overflow-auto">
                        <p className="mt-3 text-[18px] font-bold">
                          <InlineMath
                            math={`\\left(${result?.tech_one}+${result?.tech_two}+${result?.tech_three}\\right)`}
                          />
                        </p>

                        {result?.tech_ev1 && (
                          <p className="mt-3 text-[18px] font-bold">
                            <InlineMath
                              math={`\\left(${
                                result?.tech_ev1 +
                                result?.tech_ev2 +
                                result?.tech_ev3
                              }\\right)`}
                            />
                          </p>
                        )}

                        <p className="mt-3 font-bold">
                          {data?.payload?.tech_lang_keys["3"]}
                        </p>
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["calculate"]}{" "}
                          <InlineMath
                            math={`\\operatorname{div}{\\left(${result?.tech_enx},${result?.tech_eny},${result?.tech_enz}\\right)}`}
                          />{" "}
                          {result?.tech_ev1 && (
                            <>
                              and evaluate it at{" "}
                              <InlineMath
                                math={`(x_0,y_0,z_0) = \\left(${formData?.tech_x},${formData?.tech_y},${formData?.tech_z}\\right)`}
                              />
                            </>
                          )}
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["5"]},{" "}
                          <InlineMath
                            math={`\\operatorname{div}{\\left(${result?.tech_enx},${result?.tech_eny},${result?.tech_enz}\\right)} = \\nabla\\cdot \\left(${result?.tech_enx},${result?.tech_eny},${result?.tech_enz}\\right)`}
                          />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["6"]},{" "}
                          <InlineMath
                            math={`\\operatorname{div}{\\left(${result?.tech_enx},${result?.tech_eny},${result?.tech_enz}\\right)} = \\left(\\frac{\\partial}{\\partial x}, \\frac{\\partial}{\\partial y}, \\frac{\\partial}{\\partial z}\\right) \\cdot \\left(${result?.tech_enx}, ${result?.tech_eny}, ${result?.tech_enz}\\right)`}
                          />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["7"]},{" "}
                          <InlineMath
                            math={`\\operatorname{div}{\\left(${result?.tech_enx},${result?.tech_eny},${result?.tech_enz}\\right)} = \\frac{\\partial}{\\partial x}(${result?.tech_enx}) + \\frac{\\partial}{\\partial y}(${result?.tech_eny}) + \\frac{\\partial}{\\partial z}(${result?.tech_enz})`}
                          />
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["8"]}:
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`\\frac{\\partial}{\\partial x}(${result?.tech_enx}) = ${result?.tech_one}`}
                          />{" "}
                          ({data?.payload?.tech_lang_keys["9"]}{" "}
                          <a
                            href="https://calculator-logical.com/partial-derivative-calculator"
                            className="text-blue-800"
                            target="_blank"
                          >
                            {data?.payload?.tech_lang_keys["10"]}
                          </a>
                          )
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`\\frac{\\partial}{\\partial y}(${result?.tech_eny}) = ${result?.tech_two}`}
                          />{" "}
                          ({data?.payload?.tech_lang_keys["9"]}{" "}
                          <a
                            href="https://calculator-logical.com/partial-derivative-calculator"
                            className="text-blue-800"
                            target="_blank"
                          >
                            {data?.payload?.tech_lang_keys["10"]}
                          </a>
                          )
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`\\frac{\\partial}{\\partial z}(${result?.tech_enz}) = ${result?.tech_three}`}
                          />{" "}
                          ({data?.payload?.tech_lang_keys["9"]}{" "}
                          <a
                            href="https://calculator-logical.com/partial-derivative-calculator"
                            className="text-blue-800"
                            target="_blank"
                          >
                            {data?.payload?.tech_lang_keys["10"]}
                          </a>
                          )
                        </p>

                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["11"]}:
                        </p>

                        <p className="mt-3">
                          <InlineMath
                            math={`\\operatorname{div}{\\left(${result?.tech_enx},${result?.tech_eny},${result?.tech_enz}\\right)} = \\left(${result?.tech_one}+${result?.tech_two}+${result?.tech_three}\\right)`}
                          />
                        </p>

                        {result?.tech_ev1 && (
                          <>
                            <p className="mt-3 font-bold">
                              {data?.payload?.tech_lang_keys["12"]}:
                            </p>

                            <p className="mt-3">
                              <InlineMath
                                math={`\\operatorname{div}{\\left(${result?.tech_enx},${result?.tech_eny},${result?.tech_enz}\\right)}|_{(x_0,y_0,z_0) = \\left(${formData?.tech_x},${formData?.tech_y},${formData?.tech_z}\\right)} = \\left(${result?.tech_ev1}+${result?.tech_ev2}+${result?.tech_ev3}\\right)`}
                              />
                            </p>

                            <p className="mt-3">
                              <InlineMath
                                math={`\\operatorname{div}{\\left(${
                                  result?.tech_enx
                                },${result?.tech_eny},${
                                  result?.tech_enz
                                }\\right)}|_{(x_0,y_0,z_0) = \\left(${
                                  formData?.tech_x
                                },${formData?.tech_y},${
                                  formData?.tech_z
                                }\\right)} = \\left(${
                                  result?.tech_ev1 +
                                  result?.tech_ev2 +
                                  result?.tech_ev3
                                }\\right)`}
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

export default DivergenceCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useHyperbolaCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HyperbolaCalculator = () => {
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
    tech_x: 1,
    tech_y: 4,
    tech_a: 7,
    tech_b: 11,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHyperbolaCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x || !formData.tech_y) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
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
      tech_x: 1,
      tech_y: 4,
      tech_a: 7,
      tech_b: 11,
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 ">
              <div className="col-span-12 text-center text-[18px]">
                <p className="mt-5">
                  <strong>{data?.payload?.tech_lang_keys["1"]}</strong>
                </p>
                <p className="mt-2">
                  <strong>
                    <InlineMath
                      math={`\\frac{(x - x_0)^2}{a} - \\frac{(y - y_0)^2}{b} = 1`}
                    />
                  </strong>
                </p>
              </div>

              <div className="col-span-12">
                <div className="grid grid-cols-12 mt-3   gap-2 md">
                  <p className="col-span-12 mt-2 px-2">
                    <strong>
                      {data?.payload?.tech_lang_keys["2"]}(C)(x
                      <sub className="font-s-12">0</sub>, y
                      <sub className="font-s-12">0</sub>)
                    </strong>
                  </p>
                  <div className="col-span-6">
                    <label htmlFor="tech_x" className="label">
                      {data?.payload?.tech_lang_keys["3"]} x
                      <sub className="font-s-12 text-blue">0</sub>:
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
                  <div className="col-span-6">
                    <label htmlFor="tech_y" className="label">
                      {data?.payload?.tech_lang_keys["3"]} y
                      <sub className="font-s-12 text-blue">0</sub>:
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
                  <div className="col-span-6">
                    <label htmlFor="tech_a" className="label">
                      {data?.payload?.tech_lang_keys["3"]} a:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_a"
                        min="1"
                        id="tech_a"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_a}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_b" className="label">
                      {data?.payload?.tech_lang_keys["3"]} b:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_b"
                        min="1"
                        id="tech_b"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_b}
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
                      <div className="w-full text-[18px] overflow-auto">
                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["1"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`\\frac{(x - (${formData?.tech_x}))^2}{${formData?.tech_a}} - \\frac{(y - (${formData?.tech_y}))^2}{${formData?.tech_b}} = 1`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["4"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`(${formData?.tech_x}, ${formData?.tech_y})`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["5"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`(${formData?.tech_x} - ${result?.tech_ashow}, ${formData?.tech_y}) \\approx (${result?.tech_v1}),\\; (${formData?.tech_x} + ${result?.tech_ashow}, ${formData?.tech_y}) \\approx (${result?.tech_v2})`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["6"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`(${formData?.tech_x}, ${formData?.tech_y} - ${result?.tech_bshow}) \\approx (${formData?.tech_x}, ${result?.tech_v21}),\\; (${formData?.tech_x}, ${formData?.tech_y} + ${result?.tech_bshow}) \\approx (${formData?.tech_x}, ${result?.tech_v22})`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["7"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`\\frac{${result?.tech_cshow}}{${result?.tech_ashow}} \\approx ${result?.tech_ecc}`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["8"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={
                              result?.tech_cshow === result?.tech_c
                                ? `${result?.tech_c}`
                                : `${result?.tech_cshow} \\approx ${result?.tech_c}`
                            }
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["9"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`\\frac{${formData?.tech_b} \\times ${result?.tech_cshow}}{${formData?.tech_a} + ${formData?.tech_b}} \\approx ${result?.tech_fp}`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["10"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`2 \\times ${result?.tech_ashow} \\approx ${
                              2 * result?.tech_as
                            }`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["11"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={
                              result?.tech_ashow === result?.tech_as
                                ? `${result?.tech_as}`
                                : `${result?.tech_ashow} \\approx ${result?.tech_as}`
                            }
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["12"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`2 \\times ${result?.tech_bshow} \\approx ${
                              2 * result?.tech_bs
                            }`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["11"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={
                              result?.tech_bshow === result?.tech_bs
                                ? `${result?.tech_bs}`
                                : `${result?.tech_bshow} \\approx ${result?.tech_bs}`
                            }
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["13"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`y = - \\frac{${result?.tech_bshow} \\times ${result?.tech_ashow} (x - (${formData?.tech_x}))}{${formData?.tech_a}} + (${formData?.tech_y})`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["14"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`y = \\frac{${result?.tech_bshow} \\times ${result?.tech_ashow} (x - (${formData?.tech_x}))}{${formData?.tech_a}} + (${formData?.tech_y})`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["15"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`x = ${formData?.tech_x} - \\frac{${formData?.tech_a} \\times ${result?.tech_cshow}}{${formData?.tech_a} + ${formData?.tech_b}} \\approx ${result?.tech_dir1}`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["16"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`x = ${formData?.tech_x} + \\frac{${formData?.tech_a} \\times ${result?.tech_cshow}}{${formData?.tech_a} + ${formData?.tech_b}} \\approx ${result?.tech_dir2}`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["17"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`x = ${formData?.tech_x} - ${result?.tech_cshow} \\approx ${result?.tech_fl1}`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["18"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`x = ${formData?.tech_x} + ${result?.tech_cshow} \\approx ${result?.tech_fl2}`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["19"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`\\frac{2 \\times ${
                              formData?.tech_b
                            } \\times ${result?.tech_ashow}}{${
                              formData?.tech_a
                            }} \\approx ${
                              (2 * formData?.tech_b * result?.tech_as) /
                              formData?.tech_a
                            }`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["20"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`\\left(${formData?.tech_x} - \\frac{${
                              formData?.tech_y
                            } \\times ${result?.tech_ashow}}{${
                              result?.tech_bshow
                            }}, 0\\right) \\approx (${
                              formData?.tech_x -
                              (formData?.tech_y * result?.tech_as) /
                                result?.tech_bs
                            }, 0), \\left(${formData?.tech_x} + \\frac{${
                              formData?.tech_y
                            } \\times ${result?.tech_ashow}}{${
                              result?.tech_bshow
                            }}, 0\\right) \\approx (${
                              formData?.tech_x +
                              (formData?.tech_y * result?.tech_as) /
                                result?.tech_bs
                            }, 0)`}
                          />
                        </div>

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["20"]}</strong>
                        </p>
                        <div className="mt-2">
                          <InlineMath
                            math={`\\left(0, ${formData?.tech_y} - \\frac{${
                              formData?.tech_x
                            } \\times ${result?.tech_bshow}}{${
                              result?.tech_ashow
                            }}\\right) \\approx (0, ${
                              formData?.tech_y -
                              (formData?.tech_x * result?.tech_bs) /
                                result?.tech_as
                            }), \\left(0, ${formData?.tech_y} + \\frac{${
                              formData?.tech_x
                            } \\times ${result?.tech_bshow}}{${
                              result?.tech_ashow
                            }}\\right) \\approx (0, ${
                              formData?.tech_y +
                              (formData?.tech_x * result?.tech_bs) /
                                result?.tech_as
                            })`}
                          />
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

export default HyperbolaCalculator;

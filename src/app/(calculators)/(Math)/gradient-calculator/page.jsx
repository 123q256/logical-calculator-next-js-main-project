"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useGradientCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GradientCalculator = () => {
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
    tech_type: "two", //  two  three
    tech_EnterEq: "x^2+y^3+z^4",
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
  ] = useGradientCalculatorMutation();

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
      tech_type: "two", //  two  three
      tech_EnterEq: "x^2+y^3+z^4",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2 w-full">
              <input
                type="hidden"
                name="tech_type"
                id="calculator_time"
                value={formData.tech_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_type === "two" ? "tagsUnit" : ""
                    }`}
                    id="two"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "two" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["1"]} (x , y)
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_type === "three" ? "tagsUnit" : ""
                    }`}
                    id="three"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "three" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["1"]} (x , y , z)
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                {formData.tech_type == "three" ? (
                  <>
                    <label
                      htmlFor="EnterEq"
                      className="font-s-14 text-blue"
                      id="functionText"
                    >
                      {" "}
                      {data?.payload?.tech_lang_keys["2"]} f(x, y, z):
                    </label>
                  </>
                ) : (
                  <>
                    <label
                      htmlFor="EnterEq"
                      className="font-s-14 text-blue"
                      id="functionText"
                    >
                      {" "}
                      {data?.payload?.tech_lang_keys["2"]} f(x, y):
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
              <div
                className={
                  formData.tech_type == "three" ? "col-span-4" : "col-span-6"
                }
                id="xValue"
              >
                <label htmlFor="tech_x" className="label">
                  x :
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
              <div
                className={
                  formData.tech_type == "three" ? "col-span-4" : "col-span-6"
                }
                id="yValue"
              >
                <label htmlFor="tech_y" className="label">
                  y:
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
              {formData.tech_type == "three" && (
                <>
                  <div className="col-span-4" id="zValue">
                    <label htmlFor="tech_z" className="label">
                      z
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
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full  overflow-auto">
                          {formData?.tech_type === "two" ? (
                            <>
                              <p className="mt-3 text-[18px]">
                                <BlockMath
                                  math={`\\nabla(${result?.tech_enter})\\big|_{(x,y)=(${formData?.tech_x},${formData?.tech_y})} = (${result?.tech_x1}, ${result?.tech_y1})`}
                                />
                              </p>

                              <p className="mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["4"]}
                                </strong>
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right)`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`\\frac{\\partial f}{\\partial x} = ${result?.tech_difs1}`}
                                />
                              </div>

                              <div className="w-full mt-3">
                                <button
                                  type="button"
                                  className="calculate repeat"
                                  style={{
                                    fontSize: 16,
                                    padding: 10,
                                    cursor: "pointer",
                                  }}
                                >
                                  {data?.payload?.tech_lang_keys["5"]}
                                </button>
                              </div>

                              <div
                                className="w-full res_step hidden"
                                id="step_cal"
                              >
                                {result?.tech_steps}
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`\\frac{\\partial f}{\\partial y} = ${result?.tech_difs2}`}
                                />
                              </div>

                              <div className="w-full mt-3">
                                <button
                                  type="button"
                                  className="calculate repeat1"
                                  style={{
                                    fontSize: 16,
                                    padding: 10,
                                    cursor: "pointer",
                                  }}
                                >
                                  {data?.payload?.tech_lang_keys["5"]}
                                </button>
                              </div>

                              <div
                                className="w-full res_step hidden"
                                id="step_cal1"
                              >
                                {result?.tech_steps1}
                              </div>

                              <div className="mt-3">
                                {data?.payload?.tech_lang_keys["6"]}
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`\\nabla f(${formData?.tech_x}, ${formData?.tech_y}) = (${result?.tech_x1}, ${result?.tech_y1})`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`\\nabla(${result?.tech_enter})(x,y) = (${result?.tech_difs1}, ${result?.tech_difs2})`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["3"]}
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`\\nabla(${result?.tech_enter})\\big|_{(x,y)=(${formData?.tech_x},${formData?.tech_y})} = (${result?.tech_x1}, ${result?.tech_y1})`}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="mt-3 text-[18px]">
                                <BlockMath
                                  math={`\\nabla(${result?.tech_enter})\\Big|_{(x,y,z)=(${formData?.tech_x},${formData?.tech_y},${formData?.tech_z})} = (${result?.tech_x1}, ${result?.tech_y1}, ${result?.tech_z1})`}
                                />
                              </div>

                              <p className="mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["4"]}
                                </strong>
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right)`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`\\frac{\\partial f}{\\partial x} = ${result?.tech_difs1}`}
                                />
                              </div>

                              <div className="w-full mt-3">
                                <button
                                  type="button"
                                  className="calculate repeat"
                                  style={{
                                    fontSize: 16,
                                    padding: 10,
                                    cursor: "pointer",
                                  }}
                                >
                                  {data?.payload?.tech_lang_keys["5"]}
                                </button>
                              </div>
                              <div
                                className="w-full res_step hidden"
                                id="step_cal"
                              >
                                {result?.tech_steps}
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`\\frac{\\partial f}{\\partial y} = ${result?.tech_difs2}`}
                                />
                              </div>

                              <div className="w-full mt-3">
                                <button
                                  type="button"
                                  className="calculate repeat1"
                                  style={{
                                    fontSize: 16,
                                    padding: 10,
                                    cursor: "pointer",
                                  }}
                                >
                                  {data?.payload?.tech_lang_keys["5"]}
                                </button>
                              </div>
                              <div
                                className="w-full res_step hidden"
                                id="step_cal1"
                              >
                                {result?.tech_steps1}
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`\\frac{\\partial f}{\\partial z} = ${result?.tech_difs3}`}
                                />
                              </div>

                              <div className="w-full mt-3">
                                <button
                                  type="button"
                                  className="calculate repeat2"
                                  style={{
                                    fontSize: 16,
                                    padding: 10,
                                    cursor: "pointer",
                                  }}
                                >
                                  {data?.payload?.tech_lang_keys["5"]}
                                </button>
                              </div>
                              <div
                                className="w-full res_step hidden"
                                id="step_cal2"
                              >
                                {result?.tech_steps2}
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["6"]}
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`\\nabla f(${formData?.tech_x}, ${formData?.tech_y}, ${formData?.tech_z}) = (${result?.tech_x1}, ${result?.tech_y1}, ${result?.tech_z1})`}
                                />
                              </div>

                              <div className="mt-3">
                                <BlockMath
                                  math={`\\nabla(${result?.tech_enter})(x,y,z) = (${result?.tech_difs1}, ${result?.tech_difs2}, ${result?.tech_difs3})`}
                                />
                              </div>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["3"]}
                              </p>

                              <div className="mt-3">
                                <BlockMath
                                  math={`\\nabla(${result?.tech_enter})\\Big|_{(x,y,z)=(${formData?.tech_x},${formData?.tech_y},${formData?.tech_z})} = (${result?.tech_x1}, ${result?.tech_y1}, ${result?.tech_z1})`}
                                />
                              </div>
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

export default GradientCalculator;

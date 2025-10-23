"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LinearScale, PointElement, Title, Tooltip, Legend);

import {
  useGetSingleCalculatorDetailsMutation,
  useLinearInterpolationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LinearInterpolationCalculator = () => {
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
    tech_x1: "200",
    tech_y1: "15",
    tech_x2: "300",
    tech_y2: "20",
    tech_x3: "250",
    tech_y3: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLinearInterpolationCalculatorMutation();

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
        tech_x1: formData.tech_x1,
        tech_y1: formData.tech_y1,
        tech_x2: formData.tech_x2,
        tech_y2: formData.tech_y2,
        tech_x3: formData.tech_x3,
        tech_y3: formData.tech_y3,
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
      tech_x1: "200",
      tech_y1: "15",
      tech_x2: "300",
      tech_y2: "20",
      tech_x3: "250",
      tech_y3: "",
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

  // chart js

  let points = [];

  if (result?.tech_x1 != undefined) {
    points = [
      { x: result.tech_x1, y: formData?.tech_y1 },
      { x: formData?.tech_x3, y: formData?.tech_y3 },
      { x: formData?.tech_x2, y: formData?.tech_y2 },
    ];
  } else if (result?.tech_y1 != undefined) {
    points = [
      { x: formData?.tech_x1, y: result.tech_y1 },
      { x: formData?.tech_x3, y: formData?.tech_y3 },
      { x: formData?.tech_x2, y: formData?.tech_y2 },
    ];
  } else if (result?.tech_x2 != undefined) {
    points = [
      { x: formData?.tech_x1, y: formData?.tech_y1 },
      { x: formData?.tech_x3, y: formData?.tech_y3 },
      { x: result.tech_x2, y: formData?.tech_y2 },
    ];
  } else if (result?.tech_y2 != undefined) {
    points = [
      { x: formData?.tech_x1, y: formData?.tech_y1 },
      { x: formData?.tech_x3, y: formData?.tech_y3 },
      { x: formData?.tech_x2, y: result.tech_y2 },
    ];
  } else if (result?.tech_x3 != undefined) {
    points = [
      { x: formData?.tech_x1, y: formData?.tech_y1 },
      { x: result.tech_x3, y: formData?.tech_y3 },
      { x: formData?.tech_x2, y: formData?.tech_y2 },
    ];
  } else if (result?.tech_y3 != undefined) {
    points = [
      { x: formData?.tech_x1, y: formData?.tech_y1 },
      { x: formData?.tech_x3, y: result.tech_y3 },
      { x: formData?.tech_x2, y: formData?.tech_y2 },
    ];
  }

  const datachart = {
    datasets: [
      {
        label: "Interpolation Points",
        data: points,
        backgroundColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "The point of interpolation is plotted on a line",
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "x",
        },
        type: "linear",
        position: "bottom",
      },
      y: {
        title: {
          display: true,
          text: "y",
        },
      },
    },
  };

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
            <p className="my-2 text-[16px] px-2">
              {data?.payload?.tech_lang_keys["1"]}
            </p>
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_x1" className="label">
                  x₁:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x1"
                    id="tech_x1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_y1" className="label">
                  y₁:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_y1"
                    id="tech_y1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_y1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_x2" className="label">
                  x₂:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x2"
                    id="tech_x2"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x2}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_y2" className="label">
                  y₂:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_y2"
                    id="tech_y2"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_y2}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_x3" className="label">
                  x₃:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x3"
                    id="tech_x3"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x3}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_y3" className="label">
                  y₃:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_y3"
                    id="tech_y3"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_y3}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[60%] lg:w-[60%] mt-2 overflow-auto">
                          <table className="w-full md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {result?.tech_x1 !== undefined
                                      ? "x1"
                                      : result?.tech_y1 !== undefined
                                      ? "y1"
                                      : result?.tech_x2 !== undefined
                                      ? "x2"
                                      : result?.tech_y2 !== undefined
                                      ? "y2"
                                      : result?.tech_x3 !== undefined
                                      ? "x3"
                                      : result?.tech_y3 !== undefined
                                      ? "y3"
                                      : ""}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_x1 !== undefined
                                    ? result.tech_x1
                                    : result?.tech_y1 !== undefined
                                    ? result.tech_y1
                                    : result?.tech_x2 !== undefined
                                    ? result.tech_x2
                                    : result?.tech_y2 !== undefined
                                    ? result.tech_y2
                                    : result?.tech_x3 !== undefined
                                    ? result.tech_x3
                                    : result?.tech_y3 !== undefined
                                    ? result.tech_y3
                                    : ""}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full overflow-auto">
                          <p className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["2"]}
                            </strong>
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["3"]}
                          </p>

                          <p className="mt-3">
                            <InlineMath
                              math={`x₁ = ${
                                result?.tech_x1 == " " ? "?" : formData?.tech_x1
                              }`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`y₁ = ${
                                result?.tech_y1 == " " ? "?" : formData?.tech_y1
                              }`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`x₂ = ${
                                result?.tech_x2 == " " ? "?" : formData?.tech_x2
                              }`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`y₂ = ${
                                result?.tech_y2 == " " ? "?" : formData?.tech_y2
                              }`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`x₃ = ${
                                result?.tech_x3 == " " ? "?" : formData?.tech_x3
                              }`}
                            />
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`y₃ = ${
                                result?.tech_y3 == " " ? "?" : formData?.tech_y3
                              }`}
                            />
                          </p>

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["4"]}
                          </p>

                          <>
                            {result?.tech_x1 ? (
                              <>
                                <BlockMath
                                  math={`x_1 = \\frac{( y_3 - y_1 ) \\cdot ( x_2 - x_3 )}{( y_3 - y_2 )} + x_3`}
                                />
                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </p>
                                <BlockMath
                                  math={`x_1 = \\frac{( ${formData?.tech_y3} - ${formData?.tech_y1} ) \\cdot ( ${formData?.tech_x2} - ${formData?.tech_x3} )}{( ${formData?.tech_y3} - ${formData?.tech_y2} )} + ${formData?.tech_x3}`}
                                />
                                <BlockMath
                                  math={`x_1 = \\frac{( ${result?.tech_s1} ) \\cdot ( ${result?.tech_s2} )}{( ${result?.tech_s3} )} + ${formData?.tech_x3}`}
                                />
                                <BlockMath
                                  math={`x_1 = \\frac{( ${result?.tech_s4} )}{( ${result?.tech_s3} )} + ${formData?.tech_x3}`}
                                />
                                <BlockMath
                                  math={`x_1 = ${result?.tech_s5} + ${formData?.tech_x3}`}
                                />
                                <BlockMath math={`x_1 = ${result?.tech_x1}`} />
                              </>
                            ) : result?.tech_y1 ? (
                              <>
                                <BlockMath
                                  math={`y_1 = \\frac{( x_2 - x_1 ) \\cdot ( y_3 - y_2 )}{( x_3 - x_1 )} + y_2`}
                                />
                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </p>
                                <BlockMath
                                  math={`y_1 = \\frac{( ${formData?.tech_x2} - ${formData?.tech_x1} ) \\cdot ( ${formData?.tech_y3} - ${formData?.tech_y2} )}{( ${formData?.tech_x3} - ${formData?.tech_x1} )} + ${formData?.tech_y2}`}
                                />
                                <BlockMath
                                  math={`y_1 = \\frac{( ${result?.tech_s1} ) \\cdot ( ${result?.tech_s2} )}{( ${result?.tech_s3} )} + ${formData?.tech_y2}`}
                                />
                                <BlockMath
                                  math={`y_1 = \\frac{( ${result?.tech_s4} )}{( ${result?.tech_s3} )} + ${formData?.tech_y2}`}
                                />
                                <BlockMath
                                  math={`y_1 = ${result?.tech_s5} + ${formData?.tech_y2}`}
                                />
                                <BlockMath math={`y_1 = ${result?.tech_y1}`} />
                              </>
                            ) : result?.tech_x2 ? (
                              <>
                                <BlockMath
                                  math={`x_2 = \\frac{( y_1 - y_2 ) \\cdot ( x_3 - x_1 )}{( y_1 - y_3 )} + x_1`}
                                />
                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </p>
                                <BlockMath
                                  math={`x_2 = \\frac{( ${formData?.tech_y1} - ${formData?.tech_y2} ) \\cdot ( ${formData?.tech_x3} - ${formData?.tech_x1} )}{( ${formData?.tech_y1} - ${formData?.tech_y3} )} + ${formData?.tech_x1}`}
                                />
                                <BlockMath
                                  math={`x_2 = \\frac{( ${result?.tech_s1} ) \\cdot ( ${result?.tech_s2} )}{( ${result?.tech_s3} )} + ${formData?.tech_x1}`}
                                />
                                <BlockMath
                                  math={`x_2 = \\frac{( ${result?.tech_s4} )}{( ${result?.tech_s3} )} + ${formData?.tech_x1}`}
                                />
                                <BlockMath
                                  math={`x_2 = ${result?.tech_s5} + ${formData?.tech_x1}`}
                                />
                                <BlockMath math={`x_2 = ${result?.tech_x2}`} />
                              </>
                            ) : result?.tech_y2 ? (
                              <>
                                <BlockMath
                                  math={`y_2 = \\frac{( x_3 - x_2 ) \\cdot ( y_3 - y_1 )}{( x_3 - x_2 )} + y_3`}
                                />
                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </p>
                                <BlockMath
                                  math={`y_2 = \\frac{( ${formData?.tech_x3} - ${formData?.tech_x2} ) \\cdot ( ${formData?.tech_y3} - ${formData?.tech_y1} )}{( ${formData?.tech_x3} - ${formData?.tech_x2} )} + ${formData?.tech_y3}`}
                                />
                                <BlockMath
                                  math={`y_2 = \\frac{( ${result?.tech_s1} ) \\cdot ( ${result?.tech_s2} )}{( ${result?.tech_s3} )} + ${formData?.tech_y3}`}
                                />
                                <BlockMath
                                  math={`y_2 = \\frac{( ${result?.tech_s4} )}{( ${result?.tech_s3} )} + ${formData?.tech_y3}`}
                                />
                                <BlockMath
                                  math={`y_2 = ${result?.tech_s5} + ${formData?.tech_y3}`}
                                />
                                <BlockMath math={`y_2 = ${result?.tech_y2}`} />
                              </>
                            ) : result?.tech_x3 ? (
                              <>
                                <BlockMath
                                  math={`x_3 = \\frac{( y_3 - y_2 ) \\cdot ( x_1 - x_2 )}{( y_1 - y_2 )} + x_2`}
                                />
                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </p>
                                <BlockMath
                                  math={`x_3 = \\frac{( ${formData?.tech_y3} - ${formData?.tech_y2} ) \\cdot ( ${formData?.tech_x1} - ${formData?.tech_x2} )}{( ${formData?.tech_y1} - ${formData?.tech_y2} )} + ${formData?.tech_x2}`}
                                />
                                <BlockMath
                                  math={`x_3 = \\frac{( ${result?.tech_s1} ) \\cdot ( ${result?.tech_s2} )}{( ${result?.tech_s3} )} + ${formData?.tech_x2}`}
                                />
                                <BlockMath
                                  math={`x_3 = \\frac{( ${result?.tech_s4} )}{( ${result?.tech_s3} )} + ${formData?.tech_x2}`}
                                />
                                <BlockMath
                                  math={`x_3 = ${result?.tech_s5} + ${formData?.tech_x2}`}
                                />
                                <BlockMath math={`x_3 = ${result?.tech_x3}`} />
                              </>
                            ) : result?.tech_y3 ? (
                              <>
                                <BlockMath
                                  math={`y_3 = \\frac{( x_3 - x_1 ) \\cdot ( y_2 - y_1 )}{( x_2 - x_1 )} + y_1`}
                                />
                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </p>
                                <BlockMath
                                  math={`y_3 = \\frac{( ${formData?.tech_x3} - ${formData?.tech_x1} ) \\cdot ( ${formData?.tech_y2} - ${formData?.tech_y1} )}{( ${formData?.tech_x2} - ${formData?.tech_x1} )} + ${formData?.tech_y1}`}
                                />
                                <BlockMath
                                  math={`y_3 = \\frac{( ${result?.tech_s1} ) \\cdot ( ${result?.tech_s2} )}{( ${result?.tech_s3} )} + ${formData?.tech_y1}`}
                                />
                                <BlockMath
                                  math={`y_3 = \\frac{( ${result?.tech_s4} )}{( ${result?.tech_s3} )} + ${formData?.tech_y1}`}
                                />
                                <BlockMath
                                  math={`y_3 = ${result?.tech_s5} + ${formData?.tech_y1}`}
                                />
                                <BlockMath math={`y_3 = ${result?.tech_y3}`} />
                              </>
                            ) : null}
                          </>

                          <div id="box1" className="col-lg-8 mt-4 mx-auto">
                            <Scatter data={datachart} options={options} />
                          </div>
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

export default LinearInterpolationCalculator;

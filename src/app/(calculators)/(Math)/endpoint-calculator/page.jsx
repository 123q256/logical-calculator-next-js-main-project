"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(PointElement, LinearScale, Tooltip, Legend);

import {
  useGetSingleCalculatorDetailsMutation,
  useEndpointCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EndpointCalculator = () => {
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
    tech_x1: 1,
    tech_y1: 3,
    tech_x: 3,
    tech_y: 4,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEndpointCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x1) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x1: formData.tech_x1,
        tech_y1: formData.tech_y1,
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
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
      tech_x1: 1,
      tech_y1: 3,
      tech_x: 3,
      tech_y: 4,
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
  const datachart = {
    datasets: [
      {
        label: "Points",
        data: [
          { x: formData?.tech_x1, y: formData?.tech_y1, name: "(x1, y1)" },
          { x: formData?.tech_x, y: formData?.tech_y, name: "(x, y)" },
          { x: result?.x2, y: result?.y2, name: "(x2, y2)" },
        ],
        backgroundColor: "rgba(75, 192, 192, 1)",
        pointRadius: 7,
      },
    ],
  };

  // Chart options with tooltips showing point names
  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "X Axis",
        },
      },
      y: {
        title: {
          display: true,
          text: "Y Axis",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const point = context.raw;
            return `${point.name}: (${point.x}, ${point.y})`;
          },
        },
      },
      legend: {
        display: false,
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
            <div className="grid grid-cols-12   gap-2">
              <p className="col-span-12 text[16px]">
                <strong>{data?.payload?.tech_lang_keys["start"]}</strong>
              </p>
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
              <p className="col-span-12 text[16px] ">
                <strong>{data?.payload?.tech_lang_keys["mid"]}</strong>
              </p>
              <div className="col-span-6">
                <label htmlFor="tech_x" className="label">
                  x:
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
                      <div className="w-full">
                        <div className="w-full md:w-[60%] lg:w-[60%] mt-2 overflow-auto">
                          <table className="w-full text-[18px]">
                            <tbody>
                              <tr>
                                <td
                                  className="py-2 border-b"
                                  style={{ width: "60%" }}
                                >
                                  <strong>
                                    {data?.payload?.tech_lang_keys["end"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  ( x_2 , y_2 ) = ({result?.tech_x2} ,{" "}
                                  {result?.tech_y2})
                                </td>
                              </tr>
                              <tr>
                                <td
                                  className="py-2 border-b"
                                  style={{ width: "60%" }}
                                >
                                  <strong>
                                    {data?.payload?.tech_lang_keys["dis"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_dis}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["exp"]}
                            </strong>
                          </p>
                          <p className="mt-2">
                            You entered the following points:
                          </p>
                          <p className="mt-2">
                            (x_1 , y_1) = ({formData?.tech_x1} ,{" "}
                            {formData?.tech_y1})
                          </p>
                          <p className="mt-2">
                            (x , y) = ({formData?.tech_x} , {formData?.tech_y})
                          </p>

                          {/* Formula with InlineMath */}
                          <p className="mt-2">
                            (x_2, y_2) = (2 × x - x_1, 2 × y - y_1)
                          </p>

                          <p className="mt-2">
                            (x_2, y_2) = (2 × {formData?.tech_x} -{" "}
                            {formData?.tech_x1}, 2 × {formData?.tech_y} -{" "}
                            {formData?.tech_y1})
                          </p>

                          <p className="mt-2">
                            (x_2, y_2) = (
                            {2 * formData?.tech_x - formData?.tech_x1} ,{" "}
                            {2 * formData?.tech_y - formData?.tech_y1})
                          </p>

                          <p className="mt-2">
                            (x_2, y_2) = ({result?.tech_x2} , {result?.tech_y2})
                          </p>

                          <p className="mt-2">Distance Equation Solution:</p>

                          {/* Use InlineMath for math expressions */}
                          <p className="mt-2">
                            d ={" "}
                            <InlineMath math=" \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} " />
                          </p>

                          <p className="mt-2">
                            d ={" "}
                            <InlineMath
                              math={` \\sqrt{(${result?.tech_x2} - ${formData?.tech_x1})^2 + (${result?.tech_y2} - ${formData?.tech_y1})^2}`}
                            />
                          </p>

                          <p className="mt-2">
                            d ={" "}
                            <InlineMath
                              math={` \\sqrt{(${
                                result?.tech_x2 - formData?.tech_x1
                              })^2 + (${
                                result?.tech_y2 - formData?.tech_y1
                              })^2}`}
                            />
                          </p>

                          <p className="mt-2">
                            d ={" "}
                            <InlineMath
                              math={` \\sqrt{${
                                Math.pow(
                                  result?.tech_x2 - formData?.tech_x1,
                                  2
                                ) +
                                Math.pow(result?.tech_y2 - formData?.tech_y1, 2)
                              }}`}
                            />
                          </p>

                          <p className="mt-2">d = {result?.tech_dis}</p>
                        </div>
                      </div>
                      <div>
                        <Scatter data={datachart} options={options} />
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

export default EndpointCalculator;

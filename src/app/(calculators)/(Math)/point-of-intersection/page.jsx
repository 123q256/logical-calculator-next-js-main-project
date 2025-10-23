"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

import {
  useGetSingleCalculatorDetailsMutation,
  usePointOfIntersectionMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PointOfIntersectionCalculator = () => {
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
    tech_x1: "2",
    tech_y1: "3",
    tech_c1: "4",
    tech_x2: "3",
    tech_y2: "4",
    tech_c2: "5",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePointOfIntersectionMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x1 || !formData.tech_y1) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x1: formData.tech_x1,
        tech_y1: formData.tech_y1,
        tech_c1: formData.tech_c1,
        tech_x2: formData.tech_x2,
        tech_y2: formData.tech_y2,
        tech_c2: formData.tech_c2,
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
      tech_x1: "2",
      tech_y1: "3",
      tech_c1: "4",
      tech_x2: "3",
      tech_y2: "4",
      tech_c2: "5",
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

  const xIsNumeric = !isNaN(result?.tech_x);
  const yIsNumeric = !isNaN(result?.tech_y);

  // chart js

  const th = result?.tech_th;

  const x1 = -th;
  const x2 = th - 1;
  const y1 = result?.tech_Line1[x1];
  const y2 = result?.tech_Line1[x2];
  const y3 = result?.tech_Line2[x1];
  const y4 = result?.tech_Line2[x2];

  const intersectionX = result?.tech_x;
  const intersectionY = result?.tech_y;

  const datachart = {
    labels: Array.from({ length: 101 }, (_, i) => i - 50),
    datasets: [
      {
        label: "Line 1",
        data: [
          { x: x1, y: y1 },
          { x: x2, y: y2 },
        ],
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      },
      {
        label: "Line 2",
        data: [
          { x: x1, y: y3 },
          { x: x2, y: y4 },
        ],
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      },
      {
        label: "Point of Intersection",
        data: [{ x: intersectionX, y: intersectionY }],
        borderColor: "rgba(0, 0, 0, 1)",
        backgroundColor: "rgba(0, 0, 0, 1)",
        borderWidth: 0,
        pointRadius: 5,
        pointHoverRadius: 7,
        type: "scatter",
        showLine: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        min: -50,
        max: 50,
        title: {
          display: true,
          text: "X Axis",
        },
      },
      y: {
        min: -50,
        max: 50,
        title: {
          display: true,
          text: "Y Axis",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "nearest",
        intersect: false,
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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <p className="col-span-12 mx-2 text-center mb-1">
                <strong>{data?.payload?.tech_lang_keys[1]}</strong>
              </p>
              <div className="col-span-12 flex items-center justify-center">
                <div className="md:mx-2 py-2 relative">
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
                    <span className="input_unit">x</span>
                  </div>
                </div>
                <div className="md:mx-2">+</div>
                <div className="md:mx-2 py-2 relative">
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
                    <span className="input_unit">y</span>
                  </div>
                </div>
                <div className="md:mx-2">=</div>
                <div className="md:mx-2 py-2">
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
              </div>
              <p className="col-span-12 mx-2 text-center mb-1 mt-2">
                <strong>{data?.payload?.tech_lang_keys[2]}</strong>
              </p>
              <div className="col-span-12 flex items-center justify-center">
                <div className="md:mx-2 py-2 relative">
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
                    <span className="input_unit">x</span>
                  </div>
                </div>
                <div className="md:mx-2">+</div>
                <div className="md:mx-2 py-2 relative">
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
                    <span className="input_unit">y</span>
                  </div>
                </div>
                <div className="md:mx-2">=</div>
                <div className="md:mx-2 py-2">
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
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              {xIsNumeric && (
                                <tr>
                                  <td className="py-2 border-b w-[80%]">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["3"]} x =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_x}
                                  </td>
                                </tr>
                              )}
                              {yIsNumeric && (
                                <tr>
                                  <td className="py-2 border-b w-[80%]">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["3"]} y =
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_y}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[20px] md:text-[25px]">
                          <p className="mt-2 font-semibold">
                            {data?.payload?.tech_lang_keys["6"]}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["5"]}
                          </p>

                          <p className="mt-2">
                            <InlineMath
                              math={`x = \\frac{(y_1 \\cdot c_2) - (y_2 \\cdot c_1)}{(x_1 \\cdot y_2) - (x_2 \\cdot y_1)}`}
                            />
                          </p>

                          <p className="mt-2">
                            <InlineMath
                              math={`y = \\frac{(x_2 \\cdot c_1) - (x_1 \\cdot c_2)}{(x_1 \\cdot y_2) - (x_2 \\cdot y_1)}`}
                            />
                          </p>

                          <p className="mt-2">
                            <InlineMath
                              math={`x = \\frac{(${formData?.tech_y1} \\cdot ${formData?.tech_c2}) - (${formData?.tech_y2} \\cdot ${formData?.tech_c1})}{(${formData?.tech_x1} \\cdot ${formData?.tech_y2}) - (${formData?.tech_x2} \\cdot ${formData?.tech_y1})}`}
                            />
                          </p>

                          <p className="mt-2">
                            <InlineMath
                              math={`x = \\frac{${result?.tech_x1num}}{${result?.tech_x1den}}`}
                            />
                          </p>

                          <p className="mt-2">x = {result?.tech_x}</p>

                          <p className="mt-2">
                            <InlineMath
                              math={`y = \\frac{(${formData?.tech_x2} \\cdot ${formData?.tech_c1}) - (${formData?.tech_x1} \\cdot ${formData?.tech_c2})}{(${formData?.tech_x1} \\cdot ${formData?.tech_y2}) - (${formData?.tech_x2} \\cdot ${formData?.tech_y1})}`}
                            />
                          </p>

                          <p className="mt-2">
                            <InlineMath
                              math={`y = \\frac{${result?.tech_y1num}}{${result?.tech_y1den}}`}
                            />
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["4"]}
                          </p>
                        </div>

                        {/* Plot Container */}
                        <div
                          id="box1"
                          className="w-full md:w-[80%] lg:w-[80%] mt-4 mx-auto"
                          style={{ height: "350px" }}
                        >
                          {" "}
                          <Line data={datachart} options={options} />
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

export default PointOfIntersectionCalculator;

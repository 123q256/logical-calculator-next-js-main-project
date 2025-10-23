"use client";

import React, { useRef, useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  LineElement,
  Legend,
} from "chart.js";

ChartJS.register(LinearScale, PointElement, Tooltip, LineElement, Legend);

import {
  useGetSingleCalculatorDetailsMutation,
  usePointSlopeFormCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PointSlopeFormCalculator = () => {
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
    tech_point_unit: "1",
    tech_x1: 2,
    tech_y1: 4,
    tech_m: 1.5,
    tech_sec_x1: 2,
    tech_sec_y1: 4,
    tech_sec_x2: 6,
    tech_sec_y2: 8,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePointSlopeFormCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_point_unit) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_point_unit: formData.tech_point_unit,
        tech_x1: formData.tech_x1,
        tech_y1: formData.tech_y1,
        tech_m: formData.tech_m,
        tech_sec_x1: formData.tech_sec_x1,
        tech_sec_y1: formData.tech_sec_y1,
        tech_sec_x2: formData.tech_sec_x2,
        tech_sec_y2: formData.tech_sec_y2,
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
      tech_point_unit: "1",
      tech_x1: 2,
      tech_y1: 4,
      tech_m: 1.5,
      tech_sec_x1: 2,
      tech_sec_y1: 4,
      tech_sec_x2: 6,
      tech_sec_y2: 8,
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

  const chartRef = useRef(null);
  const [points, setPoints] = useState([
    { x: formData?.tech_x1, y: formData?.tech_y1 },
    { x: formData?.tech_m, y: 0 },
  ]);

  // Update chart data
  const datachart = {
    datasets: [
      {
        label: "Draggable Points",
        data: points,
        pointBackgroundColor: "blue",
        pointRadius: 8,
        showLine: true,
        borderColor: "black",
      },
    ],
  };

  // Handle drag
  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) return;

    const canvas = chart.canvas;

    let draggingPointIndex = null;

    const getMousePos = (event) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const getValueForPixel = (pixelX, pixelY) => {
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      return {
        x: xScale.getValueForPixel(pixelX),
        y: yScale.getValueForPixel(pixelY),
      };
    };

    const handleMouseDown = (e) => {
      const pos = getMousePos(e);
      const value = getValueForPixel(pos.x, pos.y);

      // Find nearest point
      chart.data.datasets[0].data.forEach((point, index) => {
        const dx = value.x - point.x;
        const dy = value.y - point.y;
        if (Math.sqrt(dx * dx + dy * dy) < 1) {
          // Tolerance
          draggingPointIndex = index;
        }
      });
    };

    const handleMouseMove = (e) => {
      if (draggingPointIndex !== null) {
        const pos = getMousePos(e);
        const value = getValueForPixel(pos.x, pos.y);

        const newPoints = [...points];
        newPoints[draggingPointIndex] = { x: value.x, y: value.y };
        setPoints(newPoints);
      }
    };

    const handleMouseUp = () => {
      draggingPointIndex = null;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [points]);

  const options = {
    scales: {
      x: {
        type: "linear",
        min: -15,
        max: 15,
      },
      y: {
        min: -15,
        max: 15,
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 mt-0 mt-lg-2">
                <label htmlFor="tech_point_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_point_unit"
                    id="tech_point_unit"
                    value={formData.tech_point_unit}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_point_unit == "1" && (
                <>
                  <div className="col-span-12 " id="firstInput">
                    <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_x1" className="label">
                          X<sub className="text-[14px]">1</sub>:
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
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_y1" className="label">
                          Y<sub className="text-[14px]">1</sub>:
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
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_m" className="label">
                          {data?.payload?.tech_lang_keys["m"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_m"
                            id="tech_m"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_m}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_point_unit == "2" && (
                <>
                  <div className="col-span-12" id="secondInput">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_sec_x1" className="label">
                          X<sub className="text-[14px]">1</sub>
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_sec_x1"
                            id="tech_sec_x1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_sec_x1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_sec_y1" className="label">
                          Y<sub className="text-[14px]">1</sub>:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_sec_y1"
                            id="tech_sec_y1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_sec_y1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_sec_x2" className="label">
                          X<sub className="text-[14px]">2</sub>:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_sec_x2"
                            id="tech_sec_x2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_sec_x2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_sec_y2" className="label">
                          X<sub className="text-[14px]">2</sub>:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_sec_y2"
                            id="tech_sec_y2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_sec_y2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
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

                  <div className="w-full mt-3">
                    <div className="w-full">
                      {formData?.tech_point_unit == "1" ? (
                        <>
                          <div className="w-full md:w-[60%] lg:w-[60%] mt-2 overflow-auto">
                            <table className="w-full font-s-18">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["ans"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_s}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["4"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_s3}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="w-full text-[18px] md:text-[20px] mt-3">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["5"]}
                              </strong>
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["7"]}
                            </p>
                            <p className="mt-3">
                              y - y<sub className="text-[14px]">1</sub> = m(x -
                              x<sub className="text-[14px]">1</sub>)
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["8"]}:
                            </p>
                            <p className="mt-3">{result?.tech_s}</p>
                            <p className="mt-3">{result?.tech_s1}</p>
                            <p className="mt-3">{result?.tech_s2}</p>
                            <p className="mt-3">{result?.tech_s3}</p>
                            <p className="mt-3">{result?.tech_s4}</p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["graph"]}:
                            </p>
                          </div>
                          <div className="w-full h-[400px]">
                            <Scatter
                              ref={chartRef}
                              data={datachart}
                              options={options}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                            <table className="w-full font-s-18">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["ans"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_s}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="w-full text-[18px] md:text-[20px] mt-3">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["5"]}:
                              </strong>
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["9"]}:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["m"]} = (y
                              <sub className="text-[14px]">2</sub> - y
                              <sub className="text-[14px]">1</sub>)/(x
                              <sub className="text-[14px]">2</sub> - x
                              <sub className="text-[14px]">1</sub>)
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["8"]}:
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["m"]} ={" "}
                              {formData?.tech_sec_y2} - {formData?.tech_sec_y1}{" "}
                              / ({formData?.tech_sec_x2} -{" "}
                              {formData?.tech_sec_x1})
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["m"]} ={" "}
                              {result?.tech_slope}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["12"]}:
                            </p>
                            <p className="mt-3">
                              y - y<sub className="text-[14px]">1</sub> = m(x -
                              x<sub className="text-[14px]">1</sub>)
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["11"]}:
                            </p>
                            <p className="mt-3">{result?.tech_s}</p>
                            <p className="mt-3">{result?.tech_s1}</p>
                            <p className="mt-3">{result?.tech_s2}</p>
                            <p className="mt-3">{result?.tech_s3}</p>
                            <p className="mt-3">{result?.tech_s4}</p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["graph"]}:
                            </p>
                          </div>
                          <div className="w-full h-[400px]">
                            <Scatter
                              ref={chartRef}
                              data={datachart}
                              options={options}
                            />
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

export default PointSlopeFormCalculator;

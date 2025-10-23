"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

import {
  useGetSingleCalculatorDetailsMutation,
  useSlopeInterceptFormCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SlopeInterceptFormCalculator = () => {
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
    tech_type: "1",
    tech_x1: 2,
    tech_y1: 21,
    tech_x2: 11,
    tech_y2: 5,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSlopeInterceptFormCalculatorMutation();

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
        tech_x1: formData.tech_x1,
        tech_y1: formData.tech_y1,
        tech_x2: formData.tech_x2,
        tech_y2: formData.tech_y2,
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
      tech_type: "1",
      tech_x1: 2,
      tech_y1: 21,
      tech_x2: 11,
      tech_y2: 5,
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

  // result
  const slope = result?.tech_slope ?? 0;
  const b = result?.tech_b ?? 0;
  const xIntercept = slope !== 0 ? roundToTwo((-1 * b) / slope) : "Undefined";
  const angle = result?.tech_angle ?? "0 deg";
  const percentage = slope * 100;

  function roundToTwo(num) {
    return Math.round(num * 100) / 100;
  }

  // chart js

  // Coordinates from props
  const x1 = parseFloat(formData?.tech_x1) || 0;
  const y1 = parseFloat(formData?.tech_y1) || 0;
  const x2 = parseFloat(formData?.tech_x2) || 0;
  const y2 = parseFloat(formData?.tech_y2) || 0;

  const datachart = {
    labels: [x1, x2],
    datasets: [
      {
        label: "Line between two points",
        data: [
          { x: x1, y: y1 },
          { x: x2, y: y2 },
        ],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0,
        pointBackgroundColor: "red",
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: { display: true, text: "X Axis" },
      },
      y: {
        type: "linear",
        title: { display: true, text: "Y Axis" },
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
          <div className="lg:w-[50%] md:w-[50%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
                    <option value="2">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["3"]} &{" "}
                      {data?.payload?.tech_lang_keys["4"]} (m){" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["3"]} (c) &{" "}
                      {data?.payload?.tech_lang_keys["4"]} (m){" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                {formData?.tech_type == "1" ? (
                  <>
                    <label htmlFor="tech_x1" className="label">
                      {data?.payload?.tech_lang_keys[5]} (c)
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_x1" className="label">
                      {" "}
                      X₁:
                    </label>
                  </>
                )}
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
                {formData?.tech_type == "3" ? (
                  <>
                    <label htmlFor="tech_y1" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys[4]} (m)
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_y1" className="label">
                      {" "}
                      Y₁:
                    </label>
                  </>
                )}

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
              {(formData.tech_type == "2" || formData.tech_type == "1") && (
                <>
                  <div className="col-span-6 x2Input">
                    {formData?.tech_type == "1" ? (
                      <>
                        <label htmlFor="tech_x2" className="label">
                          {" "}
                          {data?.payload?.tech_lang_keys[4]} (m)
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_x2" className="label">
                          {" "}
                          X₂:{" "}
                        </label>
                      </>
                    )}

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
                </>
              )}
              {formData.tech_type == "2" && (
                <>
                  <div className="col-span-6  x3Input">
                    <label htmlFor="tech_y2" className="label">
                      Y₂:
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
                        <div className="w-full">
                          <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="55%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} -{" "}
                                      {data?.payload?.tech_lang_keys[6]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    y = {slope}x {b < 0 ? b : `+ ${b}`}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="55%">
                                  {data?.payload?.tech_lang_keys[4]} (m)
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{slope}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="55%">
                                  Y - {data?.payload?.tech_lang_keys[5]} (c)
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{b}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="55%">
                                  X - {data?.payload?.tech_lang_keys[5]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{xIntercept}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="55%">
                                  {data?.payload?.tech_lang_keys[7]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{percentage}%</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="55%">
                                  {data?.payload?.tech_lang_keys[8]} (θ)
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{angle}</strong>
                                </td>
                              </tr>

                              {formData?.tech_type == "2" && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="55%">
                                      Δx
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result?.tech_x ?? "0"}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="55%">
                                      Δy
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result?.tech_y ?? "0"}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="55%">
                                      {data?.payload?.tech_lang_keys[9]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_distance ?? "0"}
                                      </strong>
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                        {formData?.tech_type == "2" && (
                          <div id="box1" className="col-lg-10 mt-4 mx-auto">
                            <Line data={datachart} options={options} />
                          </div>
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

export default SlopeInterceptFormCalculator;

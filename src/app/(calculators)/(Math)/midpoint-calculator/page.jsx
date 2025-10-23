"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import dragDataPlugin from "chartjs-plugin-dragdata";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  dragDataPlugin
);

import {
  useGetSingleCalculatorDetailsMutation,
  useMidpointCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MidpointCalculator = () => {
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
    tech_x1: 9,
    tech_x2: 15,
    tech_y1: 13,
    tech_y2: -9,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMidpointCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_x1 ||
      !formData.tech_x2 ||
      !formData.tech_y1 ||
      !formData.tech_y2
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x1: formData.tech_x1,
        tech_x2: formData.tech_x2,
        tech_y1: formData.tech_y1,
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
      tech_x1: 9,
      tech_x2: 15,
      tech_y1: 13,
      tech_y2: -9,
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
  const xMin = Math.min(result?.tech_x1, result?.tech_x2) - 10;
  const xMax = Math.max(result?.tech_x1, result?.tech_x2) + 10;
  const yMin = Math.min(result?.tech_y1, result?.tech_y2) - 10;
  const yMax = Math.max(result?.tech_y1, result?.tech_y2) + 10;

  const datachart = {
    datasets: [
      {
        label: "Line between X and Y",
        data: [
          { x: result?.tech_x1, y: result?.tech_y1 },
          { x: result?.tech_x2, y: result?.tech_y2 },
        ],
        showLine: true,
        borderColor: "blue",
        backgroundColor: "blue",
        pointRadius: 5,
        dragData: true,
      },
      {
        label: "Midpoint",
        data: [{ x: result?.tech_x, y: result?.tech_y }],
        borderColor: "red",
        backgroundColor: "red",
        pointRadius: 6,
        dragData: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "linear",
        min: xMin,
        max: xMax,
      },
      y: {
        min: yMin,
        max: yMax,
      },
    },
    plugins: {
      dragData: {
        round: 2,
        showTooltip: true,
        onDragEnd: (e, datasetIndex, index, value) => {
          console.log(
            `Point moved in dataset ${datasetIndex} at index ${index}:`,
            value
          );
          if (onPointMove) {
            onPointMove(datasetIndex, index, value);
          }
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
            <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_x1" className="label">
                  {data?.payload?.tech_lang_keys["x1"]}:
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
              <div className="col-span-6 d2">
                <label htmlFor="tech_y1" className="label">
                  {data?.payload?.tech_lang_keys["y1"]}:
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
                  {data?.payload?.tech_lang_keys["x2"]}:
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

              <div className="col-span-6 d2">
                <label htmlFor="tech_y2" className="label">
                  {data?.payload?.tech_lang_keys["y2"]}:
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
                        <div className="w-full md:w-[80%] lg:w-[80%] mt-2 overflow-auto">
                          <table className="w-full text-[18px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["mid"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  (x , y) = (
                                  {result?.tech_x !== undefined &&
                                  result?.tech_y !== undefined
                                    ? `${result?.tech_x} , ${result?.tech_y}`
                                    : "0 , 0"}
                                  )
                                </td>
                              </tr>

                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["dis"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  (
                                  {result?.tech_dis !== undefined
                                    ? result?.tech_dis
                                    : "0.0"}
                                  )
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full overflow-auto">
                          <div className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["exp"]}
                            </strong>
                          </div>
                          <div className="mt-2">
                            {data?.payload?.tech_lang_keys["to_find"]} X(x₁,x₂){" "}
                            {data?.payload?.tech_lang_keys["use"]}:
                          </div>

                          <div className="mt-2">
                            <BlockMath
                              math={`M = \\left( \\frac{x_1 + x_2}{2} , \\frac{y_1 + y_2}{2} \\right)`}
                            />
                          </div>

                          <div className="mt-2">
                            <BlockMath
                              math={`M = \\left( \\frac{${formData?.tech_x1} + ${formData?.tech_x2}}{2} , \\frac{${formData?.tech_y1} + ${formData?.tech_y2}}{2} \\right)`}
                            />
                          </div>

                          <div className="mt-2">
                            <BlockMath
                              math={`M = \\left( \\frac{${
                                formData?.tech_x1 + formData?.tech_x2
                              }}{2} , \\frac{${
                                formData?.tech_y1 + formData?.tech_y2
                              }}{2} \\right)`}
                            />
                          </div>

                          <div className="mt-2">
                            <BlockMath
                              math={`M = \\left( ${result?.tech_x} , ${result?.tech_y} \\right)`}
                            />
                          </div>
                        </div>

                        <div id="box1" className="w-full mt-4 mx-auto">
                          <Scatter data={datachart} options={options} />
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

export default MidpointCalculator;

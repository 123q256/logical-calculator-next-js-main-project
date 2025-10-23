"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useLinearRegressionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LinearRegressionCalculator = () => {
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
    tech_x: "43, 21, 25, 42, 57, 59",
    tech_y: "99, 65, 79, 75, 87, 81",
    tech_estimate: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLinearRegressionCalculatorMutation();

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
        tech_estimate: formData.tech_estimate,
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
      tech_x: "43, 21, 25, 42, 57, 59",
      tech_y: "99, 65, 79, 75, 87, 81",
      tech_estimate: "",
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

  const numbers = result?.tech_numbers ?? [];
  const numbersY = result?.tech_numbersy ?? [];

  const dataPoints = numbers.map((x, i) => ({
    x,
    y: numbersY[i] ?? 0, // fallback in case Y value is missing
  }));

  const calculateTrendline = () => {
    const n = dataPoints.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;

    dataPoints.forEach((point) => {
      sumX += point.x;
      sumY += point.y;
      sumXY += point.x * point.y;
      sumXX += point.x * point.x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const xMin = Math.min(...numbers);
    const xMax = Math.max(...numbers);

    return [
      { x: xMin, y: slope * xMin + intercept },
      { x: xMax, y: slope * xMax + intercept },
    ];
  };

  const datachart = {
    datasets: [
      {
        label: "Data Points",
        data: dataPoints,
        backgroundColor: "#13699E",
        pointRadius: 4,
      },
      {
        label: "Trendline",
        data: calculateTrendline(),
        borderColor: "lightblue",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        type: "line",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Scatter Chart with Trendline" },
      datalabels: {
        display: false, // ✅ Disable value labels on bars
      },
    },
    scales: {
      x: { title: { display: true, text: "x-axis" } },
      y: { title: { display: true, text: "y-axis" } },
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-1">
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (
                  {data?.payload?.tech_lang_keys["3"]}):
                </label>
                <div className="w-full py-1">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 43, 21, 25, 42, 57, 59"
                    value={formData.tech_x || " 43, 21, 25, 42, 57, 59"}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_y" className="label">
                  {data?.payload?.tech_lang_keys["3"]} (
                  {data?.payload?.tech_lang_keys["2"]}):
                </label>
                <div className="w-full py-1">
                  <textarea
                    name="tech_y"
                    id="tech_y"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 43, 21, 25, 42, 57, 59"
                    value={formData.tech_y || " 43, 21, 25, 42, 57, 59"}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_estimate" className="label">
                  {data?.payload?.tech_lang_keys["4"]} (
                  {data?.payload?.tech_lang_keys["2"]}) optional:
                </label>
                <div className="w-full py-1">
                  <textarea
                    name="tech_estimate"
                    id="tech_estimate"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 43, 21, 25, 42, 57, 59"
                    value={formData.tech_estimate || " "}
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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
                      <div className="text-center">
                        <p className="text-[18px]">
                          <strong>{data?.payload?.tech_lang_keys["6"]}</strong>
                        </p>
                        <div className="flex justify-center">
                          <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                            <strong className="text-blue">
                              ŷ = {result?.tech_b?.toFixed(5)}x +{" "}
                              {result?.tech_a?.toFixed(5)}
                            </strong>
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 font-s-20 w-full">
                        <strong className="text-blue">
                          {data?.payload?.tech_lang_keys["7"]}:
                        </strong>
                      </p>

                      <p className="mt-2 text-[18px] w-full">
                        {data?.payload?.tech_lang_keys["8"]} x:{" "}
                        {result?.tech_numbers?.join(", ")}
                      </p>

                      <p className="mt-2 text-[18px] w-full">
                        {data?.payload?.tech_lang_keys["8"]} y:{" "}
                        {result?.tech_numbersy?.join(", ")}
                      </p>

                      <p className="mt-2 text-[18px] w-full">
                        {data?.payload?.tech_lang_keys["9"]}:{" "}
                        {result?.tech_numbers?.length}
                      </p>

                      <p className="mt-3 font-s-20 w-full">
                        <strong className="text-blue">Solution:</strong>
                      </p>

                      <p className="mt-2 text-[18px] w-full">
                        {data?.payload?.tech_lang_keys["10"]} X:{" "}
                        {result?.tech_numbers?.reduce((a, b) => a + b, 0)}
                      </p>

                      <p className="mt-2 text-[18px] w-full">
                        {data?.payload?.tech_lang_keys["10"]} Y:{" "}
                        {result?.tech_numbersy?.reduce((a, b) => a + b, 0)}
                      </p>

                      <p className="mt-2 text-[18px] w-full">
                        {data?.payload?.tech_lang_keys["11"]} X:{" "}
                        {result?.tech_meanx}
                      </p>

                      <p className="mt-2 text-[18px] w-full">
                        {data?.payload?.tech_lang_keys["11"]} Y:{" "}
                        {result?.tech_meany}
                      </p>

                      <div className="mt-2 overflow-auto w-full">
                        <table
                          className="w-full text-[18px]"
                          style={{ borderCollapse: "collapse" }}
                        >
                          <thead>
                            <tr className="bg-[#2845F5] text-white">
                              <td className="border p-2 text-center text-blue">
                                X - M<sub>x</sub>
                              </td>
                              <td className="border p-2 text-center text-blue">
                                Y - M<sub>y</sub>
                              </td>
                              <td className="border p-2 text-center text-blue">
                                (X - M<sub>x</sub>)²
                              </td>
                              <td className="border p-2 text-center text-blue">
                                (X - M<sub>x</sub>) * (Y - M<sub>y</sub>)
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {result?.tech_numbers?.map((_, i) => (
                              <tr key={i} className="">
                                <td className="border p-2 text-center">
                                  {result.tech_arr1[i]}
                                </td>
                                <td className="border p-2 text-center">
                                  {result.tech_arr3[i]}
                                </td>
                                <td className="border p-2 text-center">
                                  {result.tech_arr2[i]}
                                </td>
                                <td className="border p-2 text-center">
                                  {result.tech_arr5[i]}
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-gray-100">
                              <td className="border p-2 text-center">&nbsp;</td>
                              <td className="border p-2 text-center">&nbsp;</td>
                              <td className="border p-2 text-center text-blue">
                                <strong>
                                  SS<sub>x</sub> (∑x²) = {result?.tech_ssx}
                                </strong>
                              </td>
                              <td className="border p-2 text-center text-blue">
                                <strong>SP (∑xy) = {result?.tech_sp}</strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <p className="mt-3 font-s-20 text-center w-full text-blue">
                        <strong>
                          {data?.payload?.tech_lang_keys["12"]}:{" "}
                          <InlineMath math="ŷ = bX + a" />
                        </strong>
                      </p>

                      <p className="mt-2 text-[18px] w-full">
                        <strong>
                          {data?.payload?.tech_lang_keys["13"]} b:
                        </strong>
                      </p>
                      <p className="mt-2 text-[18px] w-full">
                        <strong>
                          <InlineMath math="b = \dfrac{SP}{SS_x}" />
                        </strong>
                      </p>
                      <p className="mt-2 text-[18px] w-full">
                        <strong>
                          <InlineMath
                            math={`b = \\dfrac{${result?.tech_sp}}{${result?.tech_ssx}}`}
                          />
                        </strong>
                      </p>
                      <p className="mt-2 text-[18px] w-full">
                        <strong>
                          <InlineMath math={`b = ${result?.tech_b}`} />
                        </strong>
                      </p>

                      <p className="mt-2 text-[18px] w-full">
                        <strong>
                          {data?.payload?.tech_lang_keys["13"]} a:
                        </strong>
                      </p>
                      <p className="mt-2 text-[18px] w-full">
                        <strong>
                          <InlineMath math="a = M_Y - (b \times M_X)" />
                        </strong>
                      </p>
                      <p className="mt-2 text-[18px] w-full">
                        <strong>
                          <InlineMath
                            math={`a = ${result?.tech_meany} - (${(
                              result?.tech_sp / result?.tech_ssx
                            ).toFixed(4)} \\times ${result?.tech_meanx})`}
                          />
                        </strong>
                      </p>
                      <p className="mt-2 text-[18px] w-full">
                        <strong>
                          <InlineMath math={`a = ${result?.tech_a}`} />
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="w-full overflow-auto">
                    <div
                      id="chart_div"
                      className="w-full mt-3"
                      style={{ height: "400px" }}
                    >
                      <Scatter data={datachart} options={options} />
                    </div>

                    {result?.tech_estimate &&
                      result.tech_estimate.length > 0 && (
                        <div className="w-full mt-3 overflow-auto">
                          <table
                            className="w-full text-[18px]"
                            style={{ borderCollapse: "collapse" }}
                          >
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border p-2 text-center text-blue">
                                  {data?.payload?.tech_lang_keys["4"]}
                                </th>
                                <th className="border p-2 text-center text-blue">
                                  {data?.payload?.tech_lang_keys["15"]} Y
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.tech_estimate.map((x, i) => (
                                <tr key={i} className="bg-white">
                                  <td className="border p-2 text-center">
                                    {x}
                                  </td>
                                  <td className="border p-2 text-center">
                                    {(
                                      result?.tech_b * x +
                                      result?.tech_a
                                    ).toFixed(5)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
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

export default LinearRegressionCalculator;

"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

import {
  useGetSingleCalculatorDetailsMutation,
  useAverageCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AverageCalculator = () => {
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
    tech_x: "55, 62, 35, 32, 50, 57, 54",
    tech_more: ",",
    tech_seprate: ",",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAverageCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updated = {
        ...prevData,
        [name]: value,
      };

      // Agar select box change hua hai
      if (name === "tech_more" && prevData.tech_x) {
        const cleaned = prevData.tech_x
          .split(/[\s,]+/)
          .filter((x) => x !== "")
          .join(value === "space" ? " " : ",");
        updated.tech_x = cleaned;
      }

      // Agar textarea change hua hai
      if (name === "tech_x") {
        const cleaned = value
          .split(/[\s,]+/)
          .filter((x) => x !== "")
          .join(prevData.tech_more === "space" ? " " : ",");
        updated.tech_x = cleaned;
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_more: formData.tech_more,
        tech_seprate: formData.tech_seprate,
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
      tech_x: "55, 62, 35, 32, 50, 57, 54",
      tech_more: ",",
      tech_seprate: ",",
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
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!result?.tech_numbers || !data?.payload?.tech_lang_keys) return;

    // Calculate frequency of numbers
    const repeat = {};
    result.tech_numbers.forEach((num) => {
      repeat[num] = (repeat[num] || 0) + 1;
    });

    // Sort numbers
    const sortedNumbers = [...result.tech_numbers].sort((a, b) => a - b);

    // Prepare data
    const labels = [...new Set(sortedNumbers)];
    const dataCounts = labels.map((num) => repeat[num]);

    // Destroy old chart if exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create chart
    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        // ✅ yaha theek kiya gaya
        labels,
        datasets: [
          {
            label: `# ${data.payload.tech_lang_keys[17]}`,
            data: dataCounts,
            backgroundColor: "#009688",
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `Count: ${tooltipItem.raw}`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: data.payload.tech_lang_keys[18],
            },
          },
          y: {
            title: {
              display: true,
              text: `# ${data.payload.tech_lang_keys[17]}`,
            },
            beginAtZero: true,
          },
        },
      },
      plugins: [
        {
          id: "averageLine",
          afterDatasetsDraw(chart) {
            const {
              ctx,
              chartArea: { top, bottom },
              scales: { x },
            } = chart;
            if (x.getPixelForValue) {
              const xPos = x.getPixelForValue(result.tech_average);
              ctx.save();
              ctx.strokeStyle = "#009688";
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.moveTo(xPos, top);
              ctx.lineTo(xPos, bottom);
              ctx.stroke();
              ctx.restore();
            }
          },
        },
      ],
    });
  }, [
    result?.tech_numbers,
    result?.tech_average,
    data?.payload?.tech_lang_keys,
  ]);

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

          <div className="lg:w-[50%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-1   gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_more" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_more"
                    id="tech_more"
                    value={formData.tech_more}
                    onChange={handleChange}
                  >
                    <option value="space">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value=",">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 hidden">
                <label htmlFor="tech_seprate" className="label">
                  &nbsp;
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_seprate"
                    id="tech_seprate"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_seprate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_x" className="label">
                  Please provide numbers separated by a comma:
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                    value={formData.tech_x || ""}
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full bg-light-blue rounded-lg mt-3">
                      <div className="w-full flex-wrap">
                        <div className="w-full lg:w-[70%] md:w-[90%] overflow-auto mt-2">
                          <table className="w-full text-lg">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b ">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["a"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_average}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_median}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["6"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {(result?.tech_mode || []).join(" , ")}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["7"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Math.max(...(result?.tech_numbers || [])) -
                                    Math.min(...(result?.tech_numbers || []))}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full lg:w-[70%] md:w-[90%] overflow-auto mt-2">
                          <table className="w-full text-base">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b ">
                                  {data?.payload?.tech_lang_keys["8"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    (
                                    {(result?.tech_numbers || []).reduce(
                                      (a, b) => a + b,
                                      0
                                    )}
                                    ) / {(result?.tech_numbers || []).length} ={" "}
                                    {result?.tech_average}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">
                                  {data?.payload?.tech_lang_keys["9"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Math.pow(
                                      (result?.tech_numbers || []).reduce(
                                        (a, b) => a * b,
                                        1
                                      ),
                                      1 / (result?.tech_count || 1)
                                    ).toFixed(4)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">
                                  {data?.payload?.tech_lang_keys["10"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {(result?.tech_numbers || []).join(" , ")}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {[...(result?.tech_numbers || [])]
                                      .sort((a, b) => b - a)
                                      .join(" , ")}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">
                                  {data?.payload?.tech_lang_keys["12"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {(result?.tech_numbers || [])
                                      .filter((v) => v % 2 === 0)
                                      .join(" , ")}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">
                                  {data?.payload?.tech_lang_keys["13"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {(result?.tech_numbers || [])
                                      .filter((v) => v % 2 !== 0)
                                      .join(" , ")}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">
                                  {data?.payload?.tech_lang_keys["sum"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {(result?.tech_numbers || []).reduce(
                                      (a, b) => a + b,
                                      0
                                    )}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">
                                  {data?.payload?.tech_lang_keys["d"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_d}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">
                                  {data?.payload?.tech_lang_keys["14"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_s_d_p}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">
                                  {data?.payload?.tech_lang_keys["15"]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_s_d_s}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">Largest</td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Math.max(...(result?.tech_numbers || []))}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">Smallest</td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Math.min(...(result?.tech_numbers || []))}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b ">Count</td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {(result?.tech_numbers || []).length}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full md:w-[90%] lg:w-[50%] text-base mt-2 overflow-auto">
                          <p className="mt-2">
                            <strong>{data?.payload?.tech_lang_keys[20]}</strong>
                          </p>

                          <div>
                            <table className="w-full text-center border-collapse">
                              <thead>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[21]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[22]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[23]}
                                    </strong>
                                  </td>
                                </tr>
                              </thead>

                              <tbody
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_table || "",
                                }}
                              />

                              <tfoot>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["sum"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>{result?.tech_count}</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {(result?.tech_numbers || []).reduce(
                                        (a, b) => a + b,
                                        0
                                      )}
                                    </strong>
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>

                        {/* <div className="w-full md:w-[90%] lg:w-[50%] text-base mt-2 overflow-auto">
                          <p className="mt-2">
                            <strong>{data?.payload?.tech_lang_keys[20]}</strong>
                          </p>
                          <div>
                            <table className="w-full text-center">
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[21]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[22]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[23]}
                                  </strong>
                                </td>
                              </tr>
                              <tbody
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_table || "",
                                }}
                              />
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["sum"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_count}</strong>
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {(result?.tech_numbers || []).reduce(
                                      (a, b) => a + b,
                                      0
                                    )}
                                  </strong>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div> */}

                        <div className="w-full overflow-x-auto">
                          <canvas ref={chartRef}></canvas>
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

export default AverageCalculator;

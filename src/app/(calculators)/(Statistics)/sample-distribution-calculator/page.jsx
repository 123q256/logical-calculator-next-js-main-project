"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useSampleDistributionCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SamplingDistributionCalculator = () => {
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
    tech_mean: "0.5",
    tech_deviation: "1.5",
    tech_size: "65",
    tech_probability: "two_tailed", // two_tailed   left_tailed   right_tailed
    tech_x1: ".2",
    tech_x2: ".8",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSampleDistributionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_mean || !formData.tech_deviation) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_mean: formData.tech_mean,
        tech_deviation: formData.tech_deviation,
        tech_size: formData.tech_size,
        tech_probability: formData.tech_probability,
        tech_x1: formData.tech_x1,
        tech_x2: formData.tech_x2,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_mean: "0.5",
      tech_deviation: "1.5",
      tech_size: "65",
      tech_probability: "two_tailed", // two_tailed   left_tailed   right_tailed
      tech_x1: ".2",
      tech_x2: ".8",
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

  function sigFig(value, digits) {
    if (value !== "" && value !== null && !isNaN(value)) {
      if (value === 0) {
        return 0;
      } else {
        const decimalPlaces =
          digits - Math.floor(Math.log10(Math.abs(value))) - 1;
        return +value.toFixed(decimalPlaces);
      }
    }
    return "";
  }

  const u = result?.tech_mean;
  const o = result?.tech_deviation;
  const n = result?.tech_size;
  const x1 = result?.tech_x1;
  const x2 = result?.tech_x2;
  const sd = result?.tech_sd;
  const zl = result?.tech_zl;
  const pr2 = result?.tech_pr2;
  const probability = result?.tech_probability;
  const standardError = result?.tech_standard_error;

  let res = "",
    ans = "";
  if (probability === "two_tailed") {
    const pr = result?.tech_pr;
    res = `${x1} \\le \\bar{X} \\le ${x2}`;
    ans = pr;
  } else if (probability === "left_tailed") {
    res = `\\bar{X} \\le ${x1}`;
    ans = pr2;
  } else {
    res = `\\bar{X} \\ge ${x1}`;
    ans = pr2;
  }

  // chart js

  let labels = [];
  let label1 = "";
  let label2 = "";

  if (probability === "two_tailed") {
    labels = ["x₁", "", "", "", "", "", "", "", "", "", "x₂"];
    label1 = "P(X̄ ≥ X₁ & X̄ > X₂)";
    label2 = "P(X₁ < X̄ < X₂)";
  } else if (probability === "left_tailed") {
    labels = ["x", "", "", "", "", "", "", "", "", "", "←"];
    label1 = "P(X̄ ≥ X), PDF";
    label2 = "P(X̄ < X), PDF";
  } else {
    labels = ["→", "", "", "", "", "", "", "", "", "", "x"];
    label1 = "P(X̄ > X), PDF";
    label2 = "P(X̄ ≤ X), PDF";
  }

  const datachart = {
    labels,
    datasets: [
      {
        label: label1,
        data: result?.tech_chartData,
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.4,
      },
      {
        label: label2,
        data: result?.tech_chartData2,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}, PDF: ${context.parsed.y}`;
          },
        },
      },
      title: {
        display: true,
        text: "Probability Density Function (PDF)",
      },
      datalabels: {
        display: false, // ✅ Disable value labels on bars
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
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-6">
                <label htmlFor="tech_mean" className="label">
                  {data?.payload?.tech_lang_keys["mean"]} (μ)
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_mean"
                    id="tech_mean"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_mean}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_deviation" className="label">
                  {data?.payload?.tech_lang_keys["st_dev"]} (σ)
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_deviation"
                    id="tech_deviation"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_deviation}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_size" className="label">
                  {data?.payload?.tech_lang_keys["size"]} (n)
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_size"
                    id="tech_size"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_size}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_probability" className="label">
                  {data?.payload?.tech_lang_keys["prob"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_probability"
                    id="tech_probability"
                    value={formData.tech_probability}
                    onChange={handleChange}
                  >
                    <option value="two_tailed">Between</option>
                    <option value="left_tailed">Below</option>
                    <option value="right_tailed">Above</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6 x1">
                <label htmlFor="tech_x1" className="label">
                  X₁
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
              {formData.tech_probability == "two_tailed" && (
                <>
                  <div className="col-span-6 x2">
                    <label htmlFor="tech_x2" className="label">
                      X₂
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-center">
                        <div className="text-[20px] font-bold text-center justify-center flex">
                          <BlockMath math={`Pr(${res})`} />
                        </div>
                        <div className="flex justify-center">
                          <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                            <strong className="text-blue">
                              {sigFig(ans, 4)}
                            </strong>
                          </p>
                        </div>
                      </div>

                      <p className="w-full mt-3 text-[20px]">
                        {data?.payload?.tech_lang_keys["statement1"]}:
                      </p>

                      <div className="w-full md:w-[80%] lg:w-[60%] mt-2 overflow-auto">
                        <table className="w-full">
                          <tbody>
                            <tr>
                              <td className="p-2 border-b text-blue">
                                {data?.payload?.tech_lang_keys["st_d"]} (μX̄)
                              </td>
                              <td className="p-2 border-b">{u}</td>
                            </tr>
                            <tr>
                              <td className="p-2 border-b text-blue">
                                {data?.payload?.tech_lang_keys["st_er"]} (σX̄)
                              </td>
                              <td className="p-2 border-b">{standardError}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["statement5"]}:
                      </p>

                      <div id="myChart" className="mt-3 col-12">
                        <Line data={datachart} options={options} />
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

export default SamplingDistributionCalculator;

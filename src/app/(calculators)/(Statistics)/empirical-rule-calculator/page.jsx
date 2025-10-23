"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

import {
  useGetSingleCalculatorDetailsMutation,
  useEmpiricalRuleCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EmpiricalRuleCalculator = ({ mean, deviation }) => {
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
    tech_form: "summary", // raw  summary
    tech_mean: 105,
    tech_deviation: 25,
    tech_x: "12,43,11,2,33,76,12",
    tech_type_r: "1", // use "2" for population SD
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEmpiricalRuleCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_form) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_form: formData.tech_form,
        tech_mean: formData.tech_mean,
        tech_deviation: formData.tech_deviation,
        tech_x: formData.tech_x,
        tech_type_r: formData.tech_type_r,
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
      tech_form: "summary", // raw  summary
      tech_mean: 105,
      tech_deviation: 25,
      tech_x: "12,43,11,2,33,76,12",
      tech_type_r: "1", // use "2" for population SD
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

  const [chartData, setChartData] = useState({});

  const fnor = (x, mu, sigma) => {
    const diff = x - mu;
    return (
      Math.exp(-(diff * diff) / (2 * sigma * sigma)) /
      (Math.sqrt(2 * Math.PI) * sigma)
    );
  };

  useEffect(() => {
    const m1 = parseFloat(formData.tech_mean);
    const sd1 = parseFloat(formData.tech_deviation);
    const s = 3.2 * sd1;
    const d = sd1 <= 5 ? 0.008 : 0.08;

    let labels = [];
    let values = [];

    const region1 = { x: [], y: [] }; // ±1σ
    const region2 = { x: [], y: [] }; // ±2σ
    const region3 = { x: [], y: [] }; // ±3σ

    for (let x = m1 - s; x <= m1 + s + d; x += d) {
      const y = fnor(x, m1, sd1);
      labels.push(x.toFixed(2));
      values.push(y);

      if (x >= m1 - sd1 && x <= m1 + sd1) {
        region1.x.push(x.toFixed(2));
        region1.y.push(y);
      } else if (
        (x >= m1 - 2 * sd1 && x < m1 - sd1) ||
        (x > m1 + sd1 && x <= m1 + 2 * sd1)
      ) {
        region2.x.push(x.toFixed(2));
        region2.y.push(y);
      } else if (
        (x >= m1 - 3 * sd1 && x < m1 - 2 * sd1) ||
        (x > m1 + 2 * sd1 && x <= m1 + 3 * sd1)
      ) {
        region3.x.push(x.toFixed(2));
        region3.y.push(y);
      }
    }

    const getBackgroundDataset = (region, color) => ({
      label: "",
      data: region.y,
      backgroundColor: color,
      borderColor: color,
      pointRadius: 0,
      fill: true,
      tension: 0.3,
    });

    setChartData({
      labels,
      datasets: [
        {
          label: "Normal Distribution",
          data: values,
          borderColor: "#000",
          pointRadius: 0,
          tension: 0.3,
          fill: false,
        },
        getBackgroundDataset(region3, "rgba(183, 28, 28, 0.4)"), // ±3σ
        getBackgroundDataset(region2, "rgba(62, 39, 35, 0.4)"), // ±2σ
        getBackgroundDataset(region1, "rgba(0, 130, 177, 0.4)"), // ±1σ
      ],
    });
  }, [mean, deviation]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `(${context.label}, ${context.raw.toFixed(4)})`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "x",
        },
      },
      y: {
        title: {
          display: true,
          text: "f(x)",
        },
      },
    },
  };

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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
            <div className="w-full  mb-lg-3 mb-2 mt-0 mt-lg-2 d-flex items-center">
              <p className="font-s-14 pe-lg-5">To Calculate:</p>
              <div className="flex align-items-center mt-lg-0 mt-1 align-items-center cursor-pointer">
                <label className="pe-2" htmlFor="summary">
                  <input
                    type="radio"
                    name="tech_form"
                    value="summary"
                    id="summary"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_form === "summary"}
                  />
                  <span>{data?.payload?.tech_lang_keys["s_data"]}</span>
                </label>
                <label className="pe-2" htmlFor="raw">
                  <input
                    type="radio"
                    name="tech_form"
                    value="raw"
                    id="raw"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_form === "raw"}
                  />
                  <span>{data?.payload?.tech_lang_keys["r_data"]}</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1   mt-1 gap-1  md:gap-2">
              {formData.tech_form == "summary" && (
                <>
                  <div className="w-full summary ">
                    <div className="grid grid-cols-12   mt-1 gap-1  md:gap-2">
                      <div className="col-span-12 md:col-span-6">
                        <label htmlFor="tech_mean" className="label">
                          {data?.payload?.tech_lang_keys["x"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_mean"
                            id="tech_mean"
                            className="input my-2"
                            aria-label="input"
                            placeholder="e.g. 20.75"
                            value={formData.tech_mean}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <label htmlFor="tech_deviation" className="label">
                          {data?.payload?.tech_lang_keys["y"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_deviation"
                            id="tech_deviation"
                            className="input my-2"
                            aria-label="input"
                            placeholder="e.g. 20.75"
                            value={formData.tech_deviation}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_form == "raw" && (
                <>
                  <div className="w-full raw ">
                    <div className="grid grid-cols-12 gap-1 md:gap-2">
                      <div className="col-span-12">
                        <label htmlFor="tech_type_r" className="label">
                          {data?.payload?.tech_lang_keys["d_type"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_type_r"
                            id="tech_type_r"
                            value={formData.tech_type_r}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["Sample"]}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["Population"]}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 raw_mean">
                        <label htmlFor="tech_x" className="label">
                          {data?.payload?.tech_lang_keys["enter"]}{" "}
                          {data?.payload?.tech_lang_keys["note_des"]}:
                        </label>
                        <div className="w-full py-2">
                          <textarea
                            name="tech_x"
                            id="tech_x"
                            className="input textareaInput"
                            aria-label="textarea input"
                            placeholder="e.g. 12, 23, 45, 33, 65, 54, 54"
                            value={
                              formData.tech_x ||
                              "e.g. 12, 23, 45, 33, 65, 54, 54"
                            }
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  68% {data?.payload?.tech_lang_keys["ans"]}
                                </td>
                                <td className="py-2 border-b">
                                  <b className="color_blue">
                                    {result?.tech_first}
                                  </b>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  95% {data?.payload?.tech_lang_keys["ans"]}
                                </td>
                                <td className="py-2 border-b">
                                  <b className="color_blue">
                                    {result?.tech_second}
                                  </b>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  99.7% {data?.payload?.tech_lang_keys["ans"]}
                                </td>
                                <td className="py-2 border-b">
                                  <b className="color_blue">
                                    {result?.tech_third}
                                  </b>
                                </td>
                              </tr>
                              {formData?.tech_form == "raw" && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["b"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b className="color_blue">
                                        {result?.tech_mean}
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["c"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b className="color_blue">
                                        {result?.tech_devi}
                                      </b>
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_count && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      Total Numbers:
                                    </td>
                                    <td className="py-2 border-b">
                                      <b className="color_blue">
                                        {result?.tech_count}
                                      </b>
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <p className="w-full mt-1 font-s-18 text-blue">
                          <strong>
                            To further divide up the percentages of the bell
                            curve:
                          </strong>
                        </p>
                        <ul className="w-full ps-3">
                          <li className="mt-1 ms-1">
                            2.35% of data will be between{" "}
                            {Number(
                              result?.tech_mean - result?.tech_devi * 3
                            ).toFixed(2)}{" "}
                            &{" "}
                            {Number(
                              result?.tech_mean - result?.tech_devi * 2
                            ).toFixed(2)}
                          </li>
                          <li className="mt-1 ms-1">
                            13.5% of data will be between{" "}
                            {Number(
                              result?.tech_mean - result?.tech_devi * 2
                            ).toFixed(2)}{" "}
                            &{" "}
                            {Number(
                              result?.tech_mean - result?.tech_devi
                            ).toFixed(2)}
                          </li>
                          <li className="mt-1 ms-1">
                            34% of data will be between{" "}
                            {Number(
                              result?.tech_mean - result?.tech_devi
                            ).toFixed(2)}{" "}
                            & {Number(result?.tech_mean).toFixed(2)}
                          </li>
                          <li className="mt-1 ms-1">
                            34% of data will be between{" "}
                            {Number(result?.tech_mean).toFixed(2)} &{" "}
                            {Number(
                              result?.tech_mean + result?.tech_devi
                            ).toFixed(2)}
                          </li>
                          <li className="mt-1 ms-1">
                            13.5% of data will be between{" "}
                            {Number(
                              result?.tech_mean + result?.tech_devi
                            ).toFixed(2)}{" "}
                            &{" "}
                            {Number(
                              result?.tech_mean + result?.tech_devi * 2
                            ).toFixed(2)}
                          </li>
                          <li className="mt-1 ms-1">
                            2.35% of data will be between{" "}
                            {Number(
                              result?.tech_mean + result?.tech_devi * 2
                            ).toFixed(2)}{" "}
                            &{" "}
                            {Number(
                              result?.tech_mean + result?.tech_devi * 3
                            ).toFixed(2)}
                          </li>
                        </ul>
                        <div className="w-full mt-3 overflow-auto">
                          <div style={{ height: "auto" }}>
                            <Line data={chartData} options={options} />
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

export default EmpiricalRuleCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

import {
  useGetSingleCalculatorDetailsMutation,
  useBinomialDistributionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BinomialDistributionCalculator = () => {
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
    tech_n: 20,
    tech_p: 0.13,
    tech_x: 4,
    tech_con: "1", // 1 2 3 4 5
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBinomialDistributionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_n ||
      !formData.tech_p ||
      !formData.tech_x ||
      !formData.tech_con
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_n: formData.tech_n,
        tech_p: formData.tech_p,
        tech_x: formData.tech_x,
        tech_con: formData.tech_con,
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
      tech_n: 20,
      tech_p: 0.13,
      tech_x: 4,
      tech_con: "1", // 1 2 3 4 5
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

  var p = formData?.tech_p;
  var x = formData?.tech_x;
  var n = formData?.tech_n;

  const roundto = (num, digits) => {
    return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
  };

  const choice = (n, k) => {
    let result = 1;
    for (let i = 1; i <= k; i++) {
      result *= (n + 1 - i) / i;
    }
    return result;
  };

  const equalto = (p, n, x) => {
    return choice(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
  };

  const lessthan = (p, n, x) => {
    let result = 0;
    for (let i = 0; i < x; i++) {
      result += equalto(p, n, i);
    }
    return result;
  };

  const greaterthan = (p, n, x) => {
    let result = 0;
    for (let i = n; i > x; i--) {
      result += equalto(p, n, i);
    }
    return result;
  };

  // --- PIE DATA ---
  const pieData = {
    labels: ["P(X=x)", "P(X<x)", "P(X>x)"],
    datasets: [
      {
        display: false, // ✅ disable labels on pie slices
        label: "Probability",
        data: [
          roundto(equalto(p, n, x), 5),
          roundto(lessthan(p, n, x), 5),
          roundto(greaterthan(p, n, x), 5),
        ],
        backgroundColor: ["#1e5b80", "#800000", "#0086F2"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `${data?.payload?.tech_lang_keys[33]} x`,
        color: "#333",
      },
      legend: {
        labels: {
          color: "#333",
        },
      },
      datalabels: {
        display: false, // ✅ disable labels on pie slices
      },
    },
  };

  // --- BAR DATA ---
  const barLabels = Array.from({ length: n + 1 }, (_, i) => i);
  const barDataPoints = barLabels.map((i) => equalto(p, n, i));
  const barColors = barLabels.map((i) =>
    i === x ? "#1e5b80" : i > x ? "#0086F2" : "#800000"
  );

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: "P(x)",
        data: barDataPoints,
        backgroundColor: barColors,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: data?.payload?.tech_lang_keys[31],
        color: "#333",
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: false, // disable labels on the bars
      },
    },

    scales: {
      x: {
        title: {
          display: true,
          text: `${data?.payload?.tech_lang_keys[32]} x`,
          color: "#333",
        },
        ticks: {
          color: "#333",
        },
      },
      y: {
        title: {
          display: true,
          text: "P(x)",
          color: "#333",
        },
        ticks: {
          color: "#333",
        },
      },
    },
  };

  // resut

  // Generate an array from 0 to tech_x - 1
  const xRange = Array.from({ length: formData.tech_x }, (_, i) => i);

  const mu = formData.tech_n * formData.tech_p;
  const variance = formData.tech_n * formData.tech_p * (1 - formData.tech_p);
  const sigma = Math.sqrt(variance);

  // Utility to calculate sqrt (make sure to import or define this)
  const sqrt = Math.sqrt;

  // Build array for P(X) terms for X = tech_x+1 to tech_n
  const start = formData.tech_x + 1;
  const end = formData.tech_n;
  const pTerms = [];
  for (let i = start; i <= end; i++) {
    pTerms.push(i);
  }

  // Pre-calc values for readability
  // const n = formData?.tech_n ?? 0;
  // const p = formData?.tech_p ?? 0;
  // const x = formData?.tech_x ?? 0;

  // Calculate mean and variance
  // const mean = n * p;
  // const variances = n * p * (1 - p);
  // const sigma = Math.sqrt(variances);

  // Create array for range x to n
  // const xRange = Array.from({ length: n - x + 1 }, (_, i) => i + x);

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
            <div className="grid grid-cols-12 gap-1  md:gap-2">
              <div className="col-span-12 md:col-span-6 relative">
                <label htmlFor="tech_n" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (n):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_n"
                    id="tech_n"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_n}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 relative">
                <label htmlFor="tech_p" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (p):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_p"
                    id="tech_p"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    min="0"
                    max="1"
                    value={formData.tech_p}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12  relative">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["3"]} (X):
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
              <div className="col-span-12  relative">
                <label htmlFor="tech_con" className="label">
                  {data?.payload?.tech_lang_keys["34"]}:
                </label>
                <div className="mt-1">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_con"
                    id="tech_con"
                    value={formData.tech_con}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["5"]} X{" "}
                      {data?.payload?.tech_lang_keys["4"]} P(X = x)
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["6"]} X{" "}
                      {data?.payload?.tech_lang_keys["4"]} P(X &lt; x)
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["7"]} X{" "}
                      {data?.payload?.tech_lang_keys["4"]} P(X &le; x)
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["8"]} X{" "}
                      {data?.payload?.tech_lang_keys["4"]} P(X &gt; x)
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["9"]} X{" "}
                      {data?.payload?.tech_lang_keys["4"]} P(X &ge; x)
                    </option>
                  </select>
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-5 overflow-auto">
                      {formData?.tech_con == "1" ? (
                        <>
                          <div className="text-center">
                            <p className="text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["10"]}{" "}
                                {formData?.tech_x}{" "}
                                {data?.payload?.tech_lang_keys["4"]} P(X ={" "}
                                {formData?.tech_x})
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  {result?.tech_ans}
                                </strong>
                              </p>
                            </div>
                          </div>

                          <p className="col-12 mt-3 text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["11"]}:
                            </strong>{" "}
                            <InlineMath
                              math={`\\mu = np = (${formData?.tech_n} \\times ${
                                formData?.tech_p
                              }) = ${formData?.tech_n * formData?.tech_p}`}
                            />
                          </p>

                          <p className="col-12 mt-3 text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["12"]}:
                            </strong>{" "}
                            <InlineMath
                              math={`\\sigma^2 = np(1-p) = (${
                                formData?.tech_n
                              })(${formData?.tech_p})(1 - ${
                                formData?.tech_p
                              }) = ${
                                formData?.tech_n *
                                formData?.tech_p *
                                (1 - formData?.tech_p)
                              }`}
                            />
                          </p>

                          <p className="col-12 mt-3 text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["13"]}:
                            </strong>{" "}
                            <InlineMath
                              math={`\\sigma = \\sqrt{np(1-p)} = \\sqrt{(${
                                formData?.tech_n
                              })(${formData?.tech_p})(1 - ${
                                formData?.tech_p
                              })} = ${Math.sqrt(
                                formData?.tech_n *
                                  formData?.tech_p *
                                  (1 - formData?.tech_p)
                              ).toFixed(5)}`}
                            />
                          </p>

                          <p className="col-12 text-[20px] mt-3">
                            <strong className="text-blue">
                              {data?.payload?.tech_lang_keys["14"]}:
                            </strong>
                          </p>

                          <p className="col-12 mt-2">
                            {data?.payload?.tech_lang_keys["15"]}:{" "}
                            <strong>
                              <InlineMath
                                math={`\\text{trials} = ${formData?.tech_n},\\ p = ${formData?.tech_p},\\ X = ${formData?.tech_x}`}
                              />
                            </strong>
                          </p>

                          <p className="col-12 mt-2">
                            {data?.payload?.tech_lang_keys["30"]}:{" "}
                            <BlockMath
                              math={`P(X) = \\binom{n}{X} \\cdot p^X \\cdot (1 - p)^{n - X}`}
                            />
                          </p>

                          <p className="col-12 mt-2">
                            {data?.payload?.tech_lang_keys["18"]},{" "}
                            <InlineMath math={`\\binom{n}{X}`} />{" "}
                            {data?.payload?.tech_lang_keys["29"]}:{" "}
                            <BlockMath
                              math={`\\binom{n}{X} = \\frac{n!}{X!(n - X)!}`}
                            />
                          </p>

                          <p className="col-12 mt-2">
                            {data?.payload?.tech_lang_keys["17"]}:{" "}
                            <BlockMath
                              math={`P(X) = \\frac{n!}{X!(n - X)!} \\cdot p^X \\cdot (1 - p)^{n - X}`}
                            />
                          </p>

                          <p className="col-12 mt-2">
                            {data?.payload?.tech_lang_keys["16"]} (n ={" "}
                            {formData?.tech_n}, p = {formData?.tech_p}, X ={" "}
                            {formData?.tech_x}):{" "}
                            <BlockMath
                              math={`P(${formData?.tech_x}) = \\frac{${formData?.tech_n}!}{${formData?.tech_x}!(${formData?.tech_n} - ${formData?.tech_x})!} \\cdot ${formData?.tech_p}^{${formData?.tech_x}} \\cdot (1 - ${formData?.tech_p})^{${formData?.tech_n} - ${formData?.tech_x}}`}
                            />
                          </p>

                          <p className="col-12 mt-2">
                            {data?.payload?.tech_lang_keys["19"]}:{" "}
                            <InlineMath
                              math={`P(${formData?.tech_x}) = ${result?.tech_ans}`}
                            />
                          </p>
                        </>
                      ) : formData?.tech_con == "2" ? (
                        <>
                          <div>
                            {/* Heading with P('X' < value) */}
                            <div className="text-center">
                              <p className="text-[18px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["20"]}{" "}
                                  {formData?.tech_x}{" "}
                                  {data?.payload?.tech_lang_keys["4"]}:{" "}
                                  {`P('X' < ${formData?.tech_x})`}
                                </strong>
                              </p>
                              <div className="flex justify-center">
                                <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    {result?.tech_ans}
                                  </strong>
                                </p>
                              </div>
                            </div>

                            {/* Mean */}
                            <p className="col-12 mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["11"]}:{" "}
                              </strong>
                              <InlineMath
                                math={`\\mu = np = ((${
                                  formData?.tech_n
                                }) \\times (${formData?.tech_p})) = ${
                                  formData?.tech_n * formData?.tech_p
                                }`}
                              />
                            </p>

                            {/* Variance */}
                            <p className="col-12 mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["12"]}:{" "}
                              </strong>
                              <InlineMath
                                math={`\\sigma^2 = np(1-p) = (${
                                  formData?.tech_n
                                })(${formData?.tech_p})(1-${
                                  formData?.tech_p
                                }) = ${
                                  formData?.tech_n *
                                  formData?.tech_p *
                                  (1 - formData?.tech_p)
                                }`}
                              />
                            </p>

                            {/* Standard Deviation */}
                            <p className="col-12 mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]}:{" "}
                              </strong>
                              <InlineMath
                                math={`\\sigma = \\sqrt{np(1-p)} = \\sqrt{(${
                                  formData?.tech_n
                                })(${formData?.tech_p})(1-${
                                  formData?.tech_p
                                })} = ${Math.sqrt(
                                  formData?.tech_n *
                                    formData?.tech_p *
                                    (1 - formData?.tech_p)
                                ).toFixed(4)}`}
                              />
                            </p>

                            {formData?.tech_x > 1 && (
                              <>
                                <p className="col-12 mt-3 text-[20px]">
                                  <strong className="text-blue">
                                    {data?.payload?.tech_lang_keys["14"]}:
                                  </strong>
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["15"]}:{" "}
                                  <strong>{`trials = ${formData?.tech_n}, p = ${formData?.tech_p} and X = ${formData?.tech_x}`}</strong>
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["6"]}{" "}
                                  {formData?.tech_x}{" "}
                                  {data?.payload?.tech_lang_keys["24"]}:{" "}
                                  <strong>X = {xRange.join(", ")}</strong>{" "}
                                  {data?.payload?.tech_lang_keys["21"]} P (X).
                                </p>

                                <p className="col-12 mt-2 text-[18px] text-center">
                                  <strong>
                                    <InlineMath
                                      math={xRange
                                        .map((i, idx) =>
                                          idx !== xRange.length - 1
                                            ? `P(${i}) + `
                                            : `P(${i})`
                                        )
                                        .join("")}
                                    />
                                  </strong>
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["22"]}
                                  </strong>
                                </p>
                                <p className="col-12 mt-2 text-[18px]">
                                  <strong>P(0)</strong>
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["30"]}:{" "}
                                  <InlineMath
                                    math={`P(X) = \\dbinom{n}{X} \\cdot p^{X} \\cdot (1-p)^{n-X}`}
                                  />
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["18"]},{" "}
                                  {"\\(\\dbinom{n}{X}\\)"}{" "}
                                  {data?.payload?.tech_lang_keys["29"]}:
                                  <InlineMath math="\\dbinom{n}{X} = \\dfrac{n!}{X! (n - X)!}" />
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["17"]}:{" "}
                                  <InlineMath
                                    math={`P(X) = \\dfrac{n!}{X! (n-X)!} \\cdot p^{X} \\cdot (1-p)^{n-X}`}
                                  />
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["16"]}{" "}
                                  {`n = ${formData?.tech_n}, p = ${formData?.tech_p} \\text{ and } X = 0`}
                                  :{" "}
                                  <InlineMath
                                    math={`P(0) = \\dfrac{${formData?.tech_n}!}{0! (${formData?.tech_n} - 0)!} \\cdot ${formData?.tech_p}^{0} \\cdot (1 - ${formData?.tech_p})^{${formData?.tech_n} - 0}`}
                                  />
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["19"]}:{" "}
                                  <InlineMath
                                    math={`P(0) = ${result?.tech_table[0]}`}
                                  />
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["25"]}:
                                  </strong>
                                </p>

                                <p className="col-12 mt-2 text-[18px] text-center">
                                  <strong>
                                    <InlineMath
                                      math={xRange
                                        .map((i, idx) =>
                                          idx !== xRange.length - 1
                                            ? `P(${i}) + `
                                            : `P(${i})`
                                        )
                                        .join("")}
                                    />
                                  </strong>
                                </p>

                                <p className="col-12 mt-2 text-[18px] text-center">
                                  <strong>
                                    {xRange.map((i, idx) => (
                                      <React.Fragment key={i}>
                                        <InlineMath
                                          math={`${result?.tech_table[i]}`}
                                        />
                                        {idx !== xRange.length - 1 && (
                                          <span>
                                            {" "}
                                            + <br />
                                          </span>
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </strong>
                                </p>

                                <p className="col-12 mt-3 text-[20px]">
                                  <strong className="text-blue">
                                    = {result?.tech_ans}
                                  </strong>
                                </p>
                              </>
                            )}
                          </div>
                        </>
                      ) : formData?.tech_con == "3" ? (
                        <>
                          <div className="text-center">
                            <p className="text-[18px] font-bold">
                              {data?.payload?.tech_lang_keys["23"]}{" "}
                              {formData?.tech_x}{" "}
                              {data?.payload?.tech_lang_keys["4"]} P(X ≤{" "}
                              {formData?.tech_x})
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  {result?.tech_ans}
                                </strong>
                              </p>
                            </div>

                            <p className="col-12 mt-3 text-[18px] font-bold">
                              {data?.payload?.tech_lang_keys["11"]}:{" "}
                              <InlineMath
                                math={`\\mu = np = (${formData.tech_n}) \\times (${formData.tech_p}) = ${mu}`}
                              />
                            </p>

                            <p className="col-12 mt-3 text-[18px] font-bold">
                              {data?.payload?.tech_lang_keys["12"]}:{" "}
                              <InlineMath
                                math={`\\sigma^2 = np(1-p) = (${formData.tech_n})(${formData.tech_p})(1 - ${formData.tech_p}) = ${variance}`}
                              />
                            </p>

                            <p className="col-12 mt-3 text-[18px] font-bold">
                              {data?.payload?.tech_lang_keys["13"]}:{" "}
                              <InlineMath
                                math={`\\sigma = \\sqrt{np(1-p)} = \\sqrt{(${
                                  formData.tech_n
                                })(${formData.tech_p})(1 - ${
                                  formData.tech_p
                                })} = ${sigma.toFixed(4)}`}
                              />
                            </p>

                            {/* Additional conditional rendering if tech_x > 1 */}
                            {formData.tech_x > 1 && (
                              <>
                                <p className="col-12 mt-3 text-[20px] text-blue font-bold">
                                  {data?.payload?.tech_lang_keys["14"]}:
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["15"]}:{" "}
                                  <InlineMath
                                    math={`\\text{trials } = ${formData.tech_n}, p = ${formData.tech_p} \\text{ and } X = ${formData.tech_x}`}
                                  />
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["7"]}{" "}
                                  {formData.tech_x}{" "}
                                  {data?.payload?.tech_lang_keys["24"]}:{" "}
                                  <strong>
                                    X ={" "}
                                    {Array.from(
                                      { length: formData.tech_x + 1 },
                                      (_, i) => i
                                    ).join(", ")}
                                  </strong>{" "}
                                  {data?.payload?.tech_lang_keys["21"]} P(X).
                                </p>

                                <p className="col-12 mt-2 text-[18px] text-center font-bold">
                                  <InlineMath
                                    math={Array.from(
                                      { length: formData.tech_x + 1 },
                                      (_, i) =>
                                        i !== formData.tech_x
                                          ? `P(${i}) + `
                                          : `P(${i})`
                                    ).join("")}
                                  />
                                </p>

                                <p className="col-12 mt-2 text-[18px] font-bold">
                                  {data?.payload?.tech_lang_keys["22"]}
                                </p>
                                <p className="col-12 mt-2 text-[18px] font-bold">
                                  P(0)
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["30"]}:{" "}
                                  <BlockMath
                                    math={`P(X) = \\binom{n}{X} \\cdot p^X \\cdot (1-p)^{n-X}`}
                                  />
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["18"]},{" "}
                                  <InlineMath math={`\\binom{n}{X}`} />{" "}
                                  {data?.payload?.tech_lang_keys["29"]}:{" "}
                                  <BlockMath
                                    math={`\\binom{n}{X} = \\frac{n!}{X!(n-X)!}`}
                                  />
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["17"]}:{" "}
                                  <BlockMath
                                    math={`P(X) = \\frac{n!}{X!(n-X)!} \\cdot p^X \\cdot (1-p)^{n-X}`}
                                  />
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["16"]}{" "}
                                  <InlineMath
                                    math={`n = ${formData.tech_n}, p = ${formData.tech_p}, \\text{ and } X = 0`}
                                  />
                                  :
                                </p>

                                <p className="col-12 mt-2 text-[18px]">
                                  {data?.payload?.tech_lang_keys["19"]}:{" "}
                                  <strong>{result?.tech_table[0]}</strong>
                                </p>

                                <p className="col-12 mt-2 text-[18px] font-bold">
                                  {data?.payload?.tech_lang_keys["25"]}:
                                </p>

                                <p className="col-12 mt-2 text-[18px] text-center font-bold">
                                  <InlineMath
                                    math={Array.from(
                                      { length: formData.tech_x + 1 },
                                      (_, i) =>
                                        i !== formData.tech_x
                                          ? `P(${i}) + `
                                          : `P(${i})`
                                    ).join("")}
                                  />
                                </p>

                                <p className="col-12 mt-2 text-[18px] text-center font-bold">
                                  {Array.from(
                                    { length: formData.tech_x + 1 },
                                    (_, i) => (
                                      <React.Fragment key={i}>
                                        {i !== formData.tech_x ? (
                                          <InlineMath
                                            math={`${result.tech_table[i]} +`}
                                          />
                                        ) : (
                                          <InlineMath
                                            math={`${result.tech_table[i]}`}
                                          />
                                        )}
                                        <br />
                                      </React.Fragment>
                                    )
                                  )}
                                </p>

                                <p className="col-12 text-[20px] mt-3 font-bold text-blue">
                                  = {result.tech_ans}
                                </p>
                              </>
                            )}
                          </div>
                        </>
                      ) : formData?.tech_con == "4" ? (
                        <>
                          <div>
                            <div className="text-center">
                              <p className="text-[18px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["26"]}{" "}
                                  {formData?.tech_x}{" "}
                                  {data?.payload?.tech_lang_keys["4"]} P(X &gt;{" "}
                                  {formData?.tech_x})
                                </strong>
                              </p>
                              <div className="flex justify-center">
                                <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    {result?.tech_ans}
                                  </strong>
                                </p>
                              </div>
                            </div>

                            <p className="col-12 mt-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["11"]}:{" "}
                              </strong>
                              <InlineMath
                                math={`\\mu = np = (${
                                  formData?.tech_n
                                })\\times(${formData?.tech_p}) = ${
                                  formData?.tech_n * formData?.tech_p
                                }`}
                              />
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["12"]}:{" "}
                              </strong>
                              <InlineMath
                                math={`\\sigma^2 = np(1-p) = (${
                                  formData?.tech_n
                                })(${formData?.tech_p})(1-${
                                  formData?.tech_p
                                }) = ${
                                  formData?.tech_n *
                                  formData?.tech_p *
                                  (1 - formData?.tech_p)
                                }`}
                              />
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]}:{" "}
                              </strong>
                              <InlineMath
                                math={`\\sigma = \\sqrt{np(1-p)} = \\sqrt{(${
                                  formData?.tech_n
                                })(${formData?.tech_p})(1-${
                                  formData?.tech_p
                                })} = ${sqrt(
                                  formData?.tech_n *
                                    formData?.tech_p *
                                    (1 - formData?.tech_p)
                                )}`}
                              />
                            </p>

                            <p className="col-12 mt-3 text-[20px]">
                              <strong className="text-blue">
                                {data?.payload?.tech_lang_keys["14"]}:
                              </strong>
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              {data?.payload?.tech_lang_keys["15"]}:{" "}
                              <strong>
                                <InlineMath
                                  math={`\\text{trials } = ${formData?.tech_n}, p = ${formData?.tech_p} \\text{ and } X = ${formData?.tech_x}`}
                                />
                              </strong>
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              {data?.payload?.tech_lang_keys["8"]}{" "}
                              {formData?.tech_x}{" "}
                              {data?.payload?.tech_lang_keys["24"]}:{" "}
                              <strong>
                                {pTerms.join(", ")}{" "}
                                {data?.payload?.tech_lang_keys["21"]} P (X).
                              </strong>
                            </p>

                            <p className="col-12 mt-2 text-[18px] text-center">
                              <strong>
                                <InlineMath
                                  math={pTerms
                                    .map((i) => `P(${i})`)
                                    .join(" + ")}
                                />
                              </strong>
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["22"]}
                              </strong>
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              <strong>P({formData?.tech_x + 1})</strong>
                            </p>

                            <p className="col-12 mt-3 text-[18px]">
                              {data?.payload?.tech_lang_keys["30"]}:{" "}
                              <BlockMath
                                math={`P(X) = \\dbinom{n}{X} \\cdot p^{X} \\cdot (1-p)^{n-X}`}
                              />
                            </p>

                            <p className="col-12 mt-3 text-[18px]">
                              {data?.payload?.tech_lang_keys["18"]},{" "}
                              <InlineMath math={`\\dbinom{n}{X}`} />{" "}
                              {data?.payload?.tech_lang_keys["29"]}:{" "}
                              <BlockMath
                                math={`\\dbinom{n}{X} = \\dfrac{n!}{X!(n-X)!}`}
                              />
                            </p>

                            <p className="col-12 mt-3 text-[18px]">
                              {data?.payload?.tech_lang_keys["17"]}:{" "}
                              <BlockMath
                                math={`P(X) = \\dfrac{n!}{X!(n-X)!} \\cdot p^{X} \\cdot (1-p)^{n-X}`}
                              />
                            </p>

                            <p className="col-12 mt-3 text-[18px]">
                              {data?.payload?.tech_lang_keys["16"]}{" "}
                              <InlineMath
                                math={`n = ${formData?.tech_n}, p = ${
                                  formData?.tech_p
                                } \\text{ and } X = ${formData?.tech_x + 1}`}
                              />
                              :{" "}
                              <BlockMath
                                math={`P(${formData?.tech_x + 1}) = \\dfrac{${
                                  formData?.tech_n
                                }!}{(${formData?.tech_x + 1})! (${
                                  formData?.tech_n
                                } - ${formData?.tech_x + 1})!} \\cdot ${
                                  formData?.tech_p
                                }^{${formData?.tech_x + 1}} \\cdot (1-${
                                  formData?.tech_p
                                })^{${formData?.tech_n} - ${
                                  formData?.tech_x + 1
                                }}`}
                              />
                            </p>

                            <p className="col-12 mt-3 text-[18px]">
                              {data?.payload?.tech_lang_keys["19"]}:{" "}
                              <BlockMath
                                math={`P(${formData?.tech_x + 1}) = ${
                                  result?.tech_table?.[formData?.tech_x + 1]
                                }`}
                              />
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["25"]}:
                              </strong>
                            </p>

                            <p className="col-12 mt-2 text-[18px] text-center">
                              <strong>
                                <InlineMath
                                  math={pTerms
                                    .map((i) => `P(${i})`)
                                    .join(" + ")}
                                />
                              </strong>
                            </p>

                            <p className="col-12 mt-2 text-[18px] text-center">
                              <strong>
                                {pTerms.map((i, index) => (
                                  <span key={i}>
                                    <InlineMath
                                      math={`${result?.tech_table?.[i]}`}
                                    />
                                    {index !== pTerms.length - 1 ? " + " : ""}
                                    <br />
                                  </span>
                                ))}
                              </strong>
                            </p>

                            <p className="col-12 mt-3 text-[20px]">
                              <strong className="text-blue">
                                = {result?.tech_ans}
                              </strong>
                            </p>
                          </div>
                        </>
                      ) : formData?.tech_con == "5" ? (
                        <>
                          <div>
                            <div className="text-center">
                              <p className="text-[18px]">
                                <strong>
                                  {`${data?.payload?.tech_lang_keys["27"]} ${x} ${data?.payload?.tech_lang_keys["4"]} P(X ≥ ${x})`}
                                </strong>
                              </p>
                              <div className="flex justify-center">
                                <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    {result?.tech_ans}
                                  </strong>
                                </p>
                              </div>
                            </div>

                            <p className="col-12 mt-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["11"]}:{" "}
                              </strong>
                              <InlineMath
                                math={`\\mu = np = (${n}) \\times (${p}) = ${mu}`}
                              />
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["12"]}:{" "}
                              </strong>
                              <InlineMath
                                math={`\\sigma^2 = np(1-p) = (${n})(${p})(1 - ${p}) = ${variance}`}
                              />
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]}:{" "}
                              </strong>
                              <InlineMath
                                math={`\\sigma = \\sqrt{np(1-p)} = \\sqrt{(${n})(${p})(1 - ${p})} = ${sigma.toFixed(
                                  4
                                )}`}
                              />
                            </p>

                            <p className="col-12 mt-3 text-[20px]">
                              <strong className="text-blue">
                                {data?.payload?.tech_lang_keys["14"]}:
                              </strong>
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              {data?.payload?.tech_lang_keys["15"]}:{" "}
                              <strong>
                                <InlineMath
                                  math={`\\text{trials} = ${n},\\ p = ${p},\\ \\text{and}\\ X = ${x}`}
                                />
                              </strong>
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              {data?.payload?.tech_lang_keys["9"]} {x}{" "}
                              {data?.payload?.tech_lang_keys["24"]}:{" "}
                              <strong>X = {xRange.join(", ")}</strong>{" "}
                              {data?.payload?.tech_lang_keys["21"]} P(X).
                            </p>

                            <p className="col-12 mt-2 text-[18px] text-center">
                              <strong>
                                <InlineMath
                                  math={xRange
                                    .map((i, idx) =>
                                      idx !== xRange.length - 1
                                        ? `P(${i}) +`
                                        : `P(${i})`
                                    )
                                    .join(" ")}
                                />
                              </strong>
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["22"]}
                              </strong>
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              <strong>P({x})</strong>
                            </p>

                            <p className="col-12 mt-3 text-[18px]">
                              {data?.payload?.tech_lang_keys["30"]}:
                              <BlockMath
                                math={`P(X) = \\binom{n}{X} p^{X} (1-p)^{n-X}`}
                              />
                            </p>

                            <p className="col-12 mt-3 text-[18px]">
                              {data?.payload?.tech_lang_keys["18"]},{" "}
                              <InlineMath math={`\\binom{n}{${x}}`} />{" "}
                              {data?.payload?.tech_lang_keys["29"]}:
                              <BlockMath
                                math={`\\binom{n}{${x}} = \\frac{n!}{${x}! (n-${x})!}`}
                              />
                            </p>
                            <p className="col-12 mt-3 text-[18px]">
                              {data?.payload?.tech_lang_keys["17"]}:
                              <BlockMath
                                math={`P(X) = \\frac{n!}{X! (n-X)!} p^{X} (1-p)^{n-X}`}
                              />
                            </p>

                            <p className="col-12 mt-3 text-[18px]">
                              {data?.payload?.tech_lang_keys["16"]}{" "}
                              <InlineMath
                                math={`n = ${n},\\ p = ${p},\\ \\text{and}\\ X = ${x}`}
                              />
                              :
                              <BlockMath
                                math={`P(${x}) = \\frac{${n}!}{${x}! (${n}-${x})!} \\cdot ${p}^{${x}} \\cdot (1 - ${p})^{${n} - ${x}}`}
                              />
                            </p>

                            <p className="col-12 mt-3 text-[18px]">
                              {data?.payload?.tech_lang_keys["19"]}:
                              <BlockMath
                                math={`P(${x}) = ${
                                  result?.tech_table?.[x] ?? "N/A"
                                }`}
                              />
                            </p>

                            <p className="col-12 mt-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["25"]}:
                              </strong>
                            </p>

                            <p className="col-12 mt-2 text-[18px] text-center">
                              <strong>
                                <InlineMath
                                  math={xRange
                                    .map((i, idx) =>
                                      idx !== xRange.length - 1
                                        ? `P(${i}) +`
                                        : `P(${i})`
                                    )
                                    .join(" ")}
                                />
                              </strong>
                            </p>

                            <p className="col-12 mt-2 text-[18px] text-center">
                              <strong>
                                {xRange.map((i, idx) => (
                                  <React.Fragment key={i}>
                                    {`(${result?.tech_table?.[i] ?? "N/A"})`}
                                    {idx !== xRange.length - 1 ? " + " : ""}
                                    <br />
                                  </React.Fragment>
                                ))}
                              </strong>
                            </p>

                            <p className="col-12 mt-3 text-[20px]">
                              <strong className="text-blue">
                                = {result?.tech_ans}
                              </strong>
                            </p>
                          </div>
                        </>
                      ) : null}
                      <p className="col-12 mt-3 text-[18px]">
                        <strong>
                          {data?.payload?.tech_lang_keys["28"]}:{" "}
                          <InlineMath
                            math={`n = ${formData?.tech_n},\\ p = ${formData?.tech_p}`}
                          />
                        </strong>
                      </p>

                      {result?.tech_table &&
                        Object.entries(result.tech_table).map(
                          ([key, value]) => (
                            <p key={key} className="col-12 mt-3 text-[18px]">
                              <InlineMath math={`P(${key}) = ${value}`} />
                            </p>
                          )
                        )}

                      <p>&nbsp;</p>

                      <div className="col-12 mt-3" style={{ height: "250px" }}>
                        <Pie data={pieData} options={pieOptions} />
                      </div>
                      <div className="col-12 mt-3" style={{ height: "250px" }}>
                        <Bar data={barData} options={barOptions} />
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

export default BinomialDistributionCalculator;

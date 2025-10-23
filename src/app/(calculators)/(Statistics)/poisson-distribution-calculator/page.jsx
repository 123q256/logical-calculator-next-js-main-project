"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

import {
  useGetSingleCalculatorDetailsMutation,
  usePoissonDistributionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PoissonDistributionCalculator = () => {
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
    tech_x: "4",
    tech_mean: "5",
    tech_con: "1", //  1 2 3 4 5
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePoissonDistributionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x || !formData.tech_mean || !formData.tech_con) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_mean: formData.tech_mean,
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
      tech_x: "4",
      tech_mean: "5",
      tech_con: "1", //  1 2 3 4 5
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

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (!result?.tech_chart) return;

    // Step 1: Parse comma-separated values
    const parsedData = result.tech_chart
      .split(",")
      .map((val) => parseFloat(val))
      .filter((val) => !isNaN(val));

    const xValue = parseInt(formData?.tech_x ?? 0);

    // Step 2: Highlight xValue
    const backgroundColors = parsedData.map((_, i) =>
      i === xValue ? "#ca8d8d" : "#4a90e2"
    );

    // Step 3: Set chart data
    setChartData({
      labels: parsedData.map((_, i) => i),
      datasets: [
        {
          label: "P(X = x)",
          data: parsedData,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    });
  }, [result, formData]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        display: false, // ✅ Disable value labels on bars
      },
    },
    scales: {
      x: {
        title: { display: true, text: "x" },
      },
      y: {
        title: { display: true, text: "P(X = x)" },
        beginAtZero: true,
      },
    },
  };

  // result

  const xValue = formData?.tech_x;
  const lambda = formData?.tech_mean;

  // Example: agar formData.tech_x number hai
  const techX = Number(formData?.tech_x) || 0;
  const techMean = formData?.tech_mean;

  // P(x) ke liye ek function banate hain jo LaTeX formula return kare
  const getPFormula = (x) => {
    return `P(${x})=\\dfrac{e^{- ${techMean}} \\cdot ${techMean}^{${x}}}{${x}!}`;
  };

  const x = formData?.tech_x || 0;
  const techKeys = data?.payload?.tech_lang_keys || {};
  const details = result?.tech_details || [];

  // Generate array 0 to x
  const range = [...Array(x + 1).keys()];

  const techDetails = result?.tech_details ?? [];
  const techAns = result?.tech_ans ?? 0;
  const lang = data?.payload?.tech_lang_keys ?? {};

  // Create an array [0, 1, 2, ..., techX-1] for looping
  const xs = [...Array(techX).keys()];

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12 ga-1  md:gap-2">
              <div className="col-span-12 md:col-span-6 ">
                <label htmlFor="tech_mean" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (λ):
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
              <div className="col-span-12 md:col-span-6 ">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (x):
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
            </div>
            <div className="grid grid-cols-12  mt-1 gap-1 md:gap-2">
              <div className="col-span-12 md:col-span-6  ">
                <label htmlFor="tech_con" className="label">
                  {data?.payload?.tech_lang_keys["25"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_con"
                    id="tech_con"
                    value={formData.tech_con}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["3"]} P(X = x)
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["4"]} P(X &lt; x)
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["5"]} P(X &#8804; x)
                    </option>{" "}
                    {/* ≤ */}
                    <option value="4">
                      {data?.payload?.tech_lang_keys["6"]} P(X &gt; x)
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["7"]} P(X &#8805; x)
                    </option>{" "}
                    {/* ≥ */}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg mt-4 flex items-center justify-center">
                    <div className="w-full">
                      {formData?.tech_con == "1" ? (
                        <>
                          <div className="text-center">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["8"]}{" "}
                                {formData?.tech_x}{" "}
                                {data?.payload?.tech_lang_keys["21"]} P(X ={" "}
                                {formData?.tech_x})
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue text-[18px]">
                                  {result?.tech_ans}
                                </strong>
                              </p>
                            </div>
                          </div>

                          <p className="col-12 mt-3">
                            <strong className="text-blue text-[18px]">
                              {data?.payload?.tech_lang_keys["10"]}:
                            </strong>
                          </p>
                          <p className="col-12 mt-3">
                            {data?.payload?.tech_lang_keys["11"]}:{" "}
                            <strong>
                              λ = {formData?.tech_mean} , x = {formData?.tech_x}
                            </strong>
                          </p>

                          <p className="col-12 mt-3">
                            <InlineMath
                              math={`P(x)=\\dfrac{e^{-\\lambda} \\cdot \\lambda^x}{x!}`}
                            />
                          </p>

                          <p className="col-12 mt-3">
                            <InlineMath
                              math={`P(${formData?.tech_x})=\\dfrac{e^{-${formData?.tech_mean}} \\cdot ${formData?.tech_mean}^{${formData?.tech_x}}}{${formData?.tech_x}!}`}
                            />
                          </p>

                          <p className="col-12 mt-3">
                            <InlineMath
                              math={`P(${formData?.tech_x})=\\dfrac{2.718^{-${formData?.tech_mean}} \\cdot ${formData?.tech_mean}^{${formData?.tech_x}}}{${formData?.tech_x}!}`}
                            />
                          </p>

                          <p className="col-12 mt-3">
                            <InlineMath
                              math={`P(${formData?.tech_x})=\\dfrac{${result?.tech_expo} \\cdot ${result?.tech_power}}{${formData?.tech_x}!}`}
                            />
                          </p>

                          <p className="col-12 mt-3">
                            <InlineMath
                              math={`P(${formData?.tech_x})=\\dfrac{${result?.tech_sumofex}}{${result?.tech_fact}}`}
                            />
                          </p>

                          <p className="col-12 mt-3">
                            <InlineMath
                              math={`P(${formData?.tech_x})=${result?.tech_ans}`}
                            />
                          </p>
                        </>
                      ) : formData?.tech_con == "2" ? (
                        <>
                          <div className="">
                            <div className="text-center">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["9"]} {xValue}{" "}
                                  {data?.payload?.tech_lang_keys["21"]} P(X &lt;{" "}
                                  {xValue})
                                </strong>
                              </p>

                              <p className="bg-sky px-3 py-2  rounded-lg bordered d-inline-block my-3">
                                <strong className="text-blue text-[18px]">
                                  {result?.tech_ans}
                                </strong>
                              </p>
                            </div>

                            {xValue > 1 && (
                              <>
                                <p className="col-12 mt-3">
                                  <strong className="text-blue text-[18px]">
                                    {data?.payload?.tech_lang_keys["10"]}:
                                  </strong>
                                </p>
                                <p className="col-12 mt-3">
                                  {data?.payload?.tech_lang_keys["11"]}:{" "}
                                  <strong>
                                    λ = {lambda}, x = {xValue}
                                  </strong>
                                </p>
                                <p className="col-12 mt-3">
                                  {data?.payload?.tech_lang_keys["14"]} {xValue}{" "}
                                  {data?.payload?.tech_lang_keys["15"]}:{" "}
                                  <strong>
                                    X = {[...Array(xValue).keys()].join(", ")}
                                  </strong>{" "}
                                  {data?.payload?.tech_lang_keys["17"]} P(X).
                                </p>

                                <p className="col-12 mt-3">
                                  <strong>
                                    <InlineMath
                                      math={[...Array(xValue).keys()]
                                        .map((i) => `P(${i})`)
                                        .join(" + ")}
                                    />
                                  </strong>
                                </p>

                                <p className="col-12 mt-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["13"]}
                                  </strong>
                                </p>

                                <p className="col-12 mt-3">
                                  <strong>P(0)</strong>
                                </p>

                                <p className="col-12 mt-3">
                                  {data?.payload?.tech_lang_keys["12"]}:{" "}
                                  <InlineMath math="P(x)=\dfrac{e^{-\lambda} \lambda^x}{x!}" />
                                </p>

                                <p className="col-12 mt-3">
                                  <InlineMath
                                    math={`P(0)=\\dfrac{e^{- ${lambda}} \\cdot ${lambda}^0}{0!}`}
                                  />
                                </p>

                                {result?.tech_details ? (
                                  Object.entries(result.tech_details).map(
                                    ([currentX, item], index) => (
                                      <React.Fragment key={index}>
                                        <p className="col-12 mt-3">
                                          <InlineMath
                                            math={`P(${currentX})=\\dfrac{e^{- ${lambda}} \\cdot ${lambda}^{${currentX}}}{${currentX}!}`}
                                          />
                                        </p>
                                        <p className="col-12 mt-3">
                                          <InlineMath
                                            math={`P(${currentX})=\\dfrac{ ${item.expo} \\cdot ${item.power} }{${currentX}!}`}
                                          />
                                        </p>
                                        <p className="col-12 mt-3">
                                          <InlineMath
                                            math={`P(${currentX})=\\dfrac{ ${item.sumofex} }{${item.fact}}`}
                                          />
                                        </p>
                                        <p className="col-12 mt-3">
                                          <strong>
                                            <InlineMath
                                              math={`P(${currentX}) = ${item.value}`}
                                            />
                                          </strong>
                                        </p>
                                      </React.Fragment>
                                    )
                                  )
                                ) : (
                                  <p>No details found.</p>
                                )}

                                <p className="col-12 mt-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["16"]}
                                  </strong>
                                </p>

                                <p className="col-12 mt-3">
                                  <strong>
                                    <InlineMath
                                      math={[...Array(xValue).keys()]
                                        .map((i) => `P(${i})`)
                                        .join(" + ")}
                                    />
                                  </strong>
                                </p>

                                <p
                                  className="col-12 mt-3"
                                  dangerouslySetInnerHTML={{
                                    __html: result?.tech_sum,
                                  }}
                                ></p>

                                <p className="col-12 mt-3">
                                  <strong className="text-blue text-[18px]">
                                    = {result?.tech_ans}
                                  </strong>
                                </p>
                              </>
                            )}
                          </div>
                        </>
                      ) : formData?.tech_con == "3" ? (
                        <>
                          <div className="">
                            <div className="text-center">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["22"]} {techX}{" "}
                                  {data?.payload?.tech_lang_keys["21"]} P(X ≤{" "}
                                  {techX})
                                </strong>
                              </p>

                              <p className="bg-sky-100 px-3 py-2 radius-10 d-inline-block my-3">
                                <strong className="text-blue text-[18px]">
                                  {result?.tech_ans}
                                </strong>
                              </p>
                            </div>

                            <p className="col-12 mt-3">
                              <strong className="text-blue text-[18px]">
                                {data?.payload?.tech_lang_keys["10"]}:
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              {data?.payload?.tech_lang_keys["11"]}:{" "}
                              <strong>
                                λ = {techMean} , x = {techX}
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              {data?.payload?.tech_lang_keys["14"]} {techX}{" "}
                              {data?.payload?.tech_lang_keys["15"]}:{" "}
                              <strong>
                                X = {[...Array(techX + 1).keys()].join(", ")}
                              </strong>{" "}
                              {data?.payload?.tech_lang_keys["17"]} P (X).
                            </p>

                            <p className="col-12 mt-3">
                              <strong>
                                {"("}
                                {[...Array(techX + 1).keys()]
                                  .map((i) =>
                                    i !== techX ? `P(${i}) + ` : `P(${i})`
                                  )
                                  .join("")}
                                {")"}
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]}
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              <strong>P(0)</strong>
                            </p>

                            <p className="col-12 mt-3">
                              {data?.payload?.tech_lang_keys["12"]}:{" "}
                              <InlineMath
                                math={`P(x)=\\dfrac{e^{-\\lambda} \\lambda^{x}}{x!}`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <InlineMath
                                math={`P(0)=\\dfrac{e^{- ${techMean}} \\cdot ${techMean}^{0}}{0!}`}
                              />
                            </p>

                            {/* Agar result.tech_details array hai to map karke display karo */}
                            {result?.tech_details &&
                            result.tech_details.length > 0 ? (
                              result.tech_details.map((item, index) => (
                                <div key={index}>
                                  <p className="col-12 mt-3">
                                    <InlineMath
                                      math={`P(${index})=\\dfrac{e^{- ${techMean}} \\cdot ${techMean}^{${index}}}{${index}!}`}
                                    />
                                  </p>
                                  <p className="col-12 mt-3">
                                    <InlineMath
                                      math={`P(${index})=\\dfrac{${item.expo} * ${item.power} ${index}!}`}
                                    />
                                  </p>
                                  <p className="col-12 mt-3">
                                    <InlineMath
                                      math={`P(${index})=\\dfrac{${item.sumofex}}{${item.fact}}`}
                                    />
                                  </p>
                                  <p className="col-12 mt-3">
                                    <strong>
                                      <InlineMath
                                        math={`P(${index})=${item.value}`}
                                      />
                                    </strong>
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p>No details found.</p>
                            )}

                            {/* Conditional rendering agar tech_x != 0 */}
                            {techX !== 0 && (
                              <>
                                <p className="col-12 mt-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["16"]}
                                  </strong>
                                </p>
                                <p className="col-12 mt-3">
                                  <strong>
                                    {"("}
                                    {[...Array(techX + 1).keys()]
                                      .map((i) =>
                                        i !== techX ? `P(${i}) + ` : `P(${i})`
                                      )
                                      .join("")}
                                    {")"}
                                  </strong>
                                </p>
                                <p
                                  className="col-12 mt-3"
                                  dangerouslySetInnerHTML={{
                                    __html: result?.tech_sum,
                                  }}
                                ></p>
                                <p className="col-12 mt-3">
                                  <strong className="text-blue text-[18px]">
                                    = {result?.tech_ans}
                                  </strong>
                                </p>
                              </>
                            )}
                          </div>
                        </>
                      ) : formData?.tech_con == "4" ? (
                        <>
                          <div>
                            <div className="text-center">
                              <p>
                                <strong>
                                  {techKeys["20"]} {x} {techKeys["21"]} P(X &gt;{" "}
                                  {x})
                                </strong>
                              </p>
                              <p className="bg-sky-100 px-3 py-2 radius-10 d-inline-block my-3">
                                <strong className="text-blue text-[18px]">
                                  {1 - result?.tech_ans}
                                </strong>
                              </p>
                            </div>

                            <p className="col-12 mt-2">
                              <strong className="text-blue text-[18px]">
                                {techKeys["10"]}
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              {techKeys["11"]}:{" "}
                              <strong>
                                λ = {lambda} , x = {x}
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              {techKeys["18"]} {x} {techKeys["19"]} 1.
                            </p>

                            <p className="col-12 mt-3">
                              <InlineMath
                                math={`P(X > ${x}) = 1 - P(X \\leq ${x})`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              {techKeys["14"]} {x} {techKeys["15"]}:{" "}
                              <strong>X = {range.join(", ")}</strong>{" "}
                              {techKeys["17"]} P(X).
                            </p>

                            <p className="col-12 mt-3">
                              <strong>
                                <InlineMath
                                  math={range
                                    .map((i) =>
                                      i !== x ? `P(${i}) + ` : `P(${i})`
                                    )
                                    .join("")}
                                />
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              <strong>{techKeys["13"]}</strong>
                            </p>

                            <p className="col-12 mt-3">
                              <strong>P(0)</strong>
                            </p>

                            <p className="col-12 mt-3">
                              {techKeys["12"]}:{" "}
                              <InlineMath
                                math={`P(x) = \\frac{e^{-\\lambda} \\lambda^{x}}{x!}`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <InlineMath
                                math={`P(0) = \\frac{e^{- ${lambda}} ${lambda}^{0}}{0!}`}
                              />
                            </p>

                            {details.length > 0 ? (
                              details.map((item, currentX) => (
                                <React.Fragment key={currentX}>
                                  <p className="col-12 mt-3">
                                    <InlineMath
                                      math={`P(${currentX}) = \\frac{e^{- ${lambda}} ${lambda}^{${currentX}}}{${currentX}!}`}
                                    />
                                  </p>
                                  <p className="col-12 mt-3">
                                    <InlineMath
                                      math={`P(${currentX}) = \\frac{${item.expo} \\times ${item.power}}{${currentX}!}`}
                                    />
                                  </p>
                                  <p className="col-12 mt-3">
                                    <InlineMath
                                      math={`P(${currentX}) = \\frac{${item.sumofex}}{${item.fact}}`}
                                    />
                                  </p>
                                  <p className="col-12 mt-3">
                                    <strong>
                                      <InlineMath
                                        math={`P(${currentX}) = ${item.value}`}
                                      />
                                    </strong>
                                  </p>
                                </React.Fragment>
                              ))
                            ) : (
                              <p>No details found.</p>
                            )}

                            {x !== 0 && (
                              <>
                                <p className="col-12 mt-3">
                                  <strong>{techKeys["16"]}</strong>
                                </p>

                                <p className="col-12 mt-3">
                                  <strong>
                                    <InlineMath
                                      math={range
                                        .map((i) =>
                                          i !== x ? `P(${i}) + ` : `P(${i})`
                                        )
                                        .join("")}
                                    />
                                  </strong>
                                </p>
                                <p
                                  className="col-12 mt-3"
                                  dangerouslySetInnerHTML={{
                                    __html: result?.tech_sum,
                                  }}
                                ></p>

                                <p className="col-12 mt-3">
                                  <strong className="text-blue text-[18px]">
                                    = {result?.tech_ans}
                                  </strong>
                                </p>
                              </>
                            )}

                            <p className="col-12 mt-3">
                              <strong>{techKeys["24"]} 1</strong>
                            </p>

                            <p className="col-12 mt-3">
                              <InlineMath
                                math={`P(X > ${x}) = 1 - P(X \\leq ${x})`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <InlineMath
                                math={`P(X > ${x}) = 1 - ${result?.tech_ans}`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <InlineMath
                                math={`P(X > ${x}) = ${1 - result?.tech_ans}`}
                              />
                            </p>
                          </div>
                        </>
                      ) : formData?.tech_con == "5" ? (
                        <>
                          <div>
                            <div className="text-center">
                              <p>
                                <strong>
                                  Probability of at least {techX}{" "}
                                  {data?.payload?.tech_lang_keys["21"]} P(X ≥{" "}
                                  {techX})
                                </strong>
                              </p>
                              <p className="bg-sky-100 px-3 py-2 radius-10 d-inline-block my-3">
                                <strong className="text-blue text-[18px]">
                                  {(1 - techAns).toFixed(4)}
                                </strong>
                              </p>
                            </div>

                            <p className="col-12 mt-3">
                              <strong className="text-blue text-[18px]">
                                {data?.payload?.tech_lang_keys["10"]}
                              </strong>
                            </p>
                            <p className="col-12 mt-3">
                              {data?.payload?.tech_lang_keys["11"]}:{" "}
                              <strong>
                                λ = {techMean} , x = {techX}
                              </strong>
                            </p>
                            <p className="col-12 mt-3">
                              {data?.payload?.tech_lang_keys["23"]} {techX}{" "}
                              {data?.payload?.tech_lang_keys["19"]} 1.
                            </p>
                            <p className="col-12 mt-3">
                              <InlineMath
                                math={`P(X \\geq ${techX}) = 1 - P(X < ${techX})`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              {data?.payload?.tech_lang_keys["14"]} {techX}{" "}
                              {data?.payload?.tech_lang_keys["15"]}:{" "}
                              <strong>X = {xs.join(", ")}</strong>
                              {data?.payload?.tech_lang_keys["17"]} P (X).
                            </p>

                            <p className="col-12 mt-3">
                              <strong>
                                <InlineMath
                                  math={xs
                                    .map((x, i) =>
                                      i !== xs.length - 1
                                        ? `P(${x}) + `
                                        : `P(${x})`
                                    )
                                    .join("")}
                                />
                              </strong>
                            </p>

                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]}
                              </strong>
                            </p>
                            <p className="col-12 mt-3">
                              <strong>P(0)</strong>
                            </p>
                            <p className="col-12 mt-3">
                              {data?.payload?.tech_lang_keys["12"]}:{" "}
                              <InlineMath
                                math={`P(x)=\\frac{e^{-\\lambda} \\lambda^x}{x!}`}
                              />
                            </p>

                            <p className="col-12 mt-3">
                              <InlineMath
                                math={`P(0)=\\frac{e^{- ${techMean}} {${techMean}}^{0}}{0!}`}
                              />
                            </p>

                            {techDetails.length > 0 ? (
                              techDetails.map(
                                (
                                  { expo, power, sumofex, fact, value },
                                  currentX
                                ) => (
                                  <React.Fragment key={currentX}>
                                    <p className="col-12 mt-3">
                                      <InlineMath
                                        math={`P(${currentX})=\\frac{e^{- ${techMean}} {${techMean}}^{${currentX}}}{${currentX}!}`}
                                      />
                                    </p>
                                    <p className="col-12 mt-3">
                                      <InlineMath
                                        math={`P(${currentX})=\\frac{${expo} * ${power}}{${currentX}!}`}
                                      />
                                    </p>
                                    <p className="col-12 mt-3">
                                      <InlineMath
                                        math={`P(${currentX})=\\frac{${sumofex}}{${fact}}`}
                                      />
                                    </p>
                                    <p className="col-12 mt-3">
                                      <strong>
                                        <InlineMath
                                          math={`P(${currentX})=${value}`}
                                        />
                                      </strong>
                                    </p>
                                  </React.Fragment>
                                )
                              )
                            ) : (
                              <p>No details found.</p>
                            )}

                            {techX !== 0 && (
                              <>
                                <p className="col-12 mt-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["16"]}
                                  </strong>
                                </p>
                                <p className="col-12 mt-3">
                                  <strong>
                                    <InlineMath
                                      math={xs
                                        .map((x, i) =>
                                          i !== xs.length - 1
                                            ? `P(${x}) + `
                                            : `P(${x})`
                                        )
                                        .join("")}
                                    />
                                  </strong>
                                </p>
                                <p
                                  className="col-12 mt-3"
                                  dangerouslySetInnerHTML={{
                                    __html: result?.tech_sum,
                                  }}
                                ></p>

                                <p className="col-12 mt-3 ">
                                  <strong className="text-blue text-[18px]">
                                    = {techAns}
                                  </strong>
                                </p>
                              </>
                            )}

                            <p className="col-12 mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["24"]} 1
                              </strong>
                            </p>
                            <p className="col-12 mt-3">
                              <InlineMath
                                math={`P(X \\geq ${techX}) = 1 - P(X < ${techX})`}
                              />
                            </p>
                            <p className="col-12 mt-3">
                              <InlineMath
                                math={`P(X \\geq ${techX}) = 1 - ${techAns}`}
                              />
                            </p>
                            <p className="col-12 mt-3">
                              <InlineMath
                                math={`P(X \\geq ${techX}) = ${(
                                  1 - techAns
                                ).toFixed(4)}`}
                              />
                            </p>
                          </div>
                        </>
                      ) : null}
                      <div id="container" className="col-12 mt-3">
                        <Bar data={chartData} options={options} />
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

export default PoissonDistributionCalculator;

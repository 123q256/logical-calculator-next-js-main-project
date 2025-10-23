"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend
);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useHypergeometricCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HypergeometricCalculator = () => {
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
    tech_method: "1", //  1 2
    tech_fun: "3",
    tech_p: "52",
    tech_sp: "26",
    tech_s: "5",
    tech_ss: "2",
    tech_inc: "1",
    tech_rep: "10",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHypergeometricCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method: formData.tech_method,
        tech_fun: formData.tech_fun,
        tech_p: formData.tech_p,
        tech_sp: formData.tech_sp,
        tech_s: formData.tech_s,
        tech_ss: formData.tech_ss,
        tech_inc: formData.tech_inc,
        tech_rep: formData.tech_rep,
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
      tech_method: "1", //  1 2
      tech_fun: "3",
      tech_p: "52",
      tech_sp: "26",
      tech_s: "5",
      tech_ss: "2",
      tech_inc: "1",
      tech_rep: "10",
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

  const N = formData?.tech_p;
  const K = formData?.tech_sp;
  const n = formData?.tech_s;
  const k = formData?.tech_ss;

  const meanExpr = `${n} * ${K} / ${N}`;
  const meanCalc = `${n * K} / ${N}`;
  const varianceExpr = `${n} * ${K} / ${N} * (${N} - ${K}) / ${N} * (${N} - ${n}) / (${N} - 1)`;
  const varianceCalc = `(${n * K * (N - K) * (N - n)}) / (${N * N * (N - 1)})`;
  const stdDevExpr = `\\sqrt{${varianceCalc}}`;

  // ?chart js

  // categories
  const categories =
    formData?.tech_method === "1"
      ? [
          `P(X = ${formData?.tech_ss})`,
          `P(X < ${formData?.tech_ss})`,
          `P(X ≤ ${formData?.tech_ss})`,
          `P(X ≥ ${formData?.tech_ss})`,
          `P(X > ${formData?.tech_ss})`,
        ]
      : result?.tech_xval || [];

  // data
  const dataValues =
    formData?.tech_method === "1"
      ? [
          result?.tech_a,
          result?.tech_b,
          result?.tech_c,
          result?.tech_e,
          result?.tech_d,
        ]
      : result?.tech_chart || [];

  const datachart = {
    labels: categories,
    datasets: [
      {
        label: "P(X = x)",
        data: dataValues,
        backgroundColor: "#007bff",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
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
          text: "P(X = x)",
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
            <div className="grid grid-cols-1   gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method"
                    id="tech_method"
                    value={formData.tech_method}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["hyper"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["hyper"]} (
                      {data?.payload?.tech_lang_keys["chart"]}){" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            {formData.tech_method == "2" && (
              <>
                <div className="grid grid-cols-1 mt-4 gap-4">
                  <div className="space-y-2 function ">
                    <label htmlFor="tech_fun" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_fun"
                        id="tech_fun"
                        value={formData.tech_fun}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["mass"]} f
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["lcd"]} P
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["ucd"]} Q
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-4 gap-4">
              {(formData.tech_method == "1" || formData.tech_method == "2") && (
                <>
                  <div className="relative">
                    <label htmlFor="tech_p" className="label">
                      {data?.payload?.tech_lang_keys["p"]}:
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
                        value={formData.tech_p}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="tech_sp" className="label">
                      {data?.payload?.tech_lang_keys["sp"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_sp"
                        id="tech_sp"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_sp}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="tech_s" className="label">
                      {data?.payload?.tech_lang_keys["s"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_s"
                        id="tech_s"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_s}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="tech_ss" className="label">
                      {data?.payload?.tech_lang_keys["ss"]}{" "}
                      <span id="text"></span>
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_ss"
                        id="tech_ss"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_ss}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_method == "2" && (
                <>
                  <div className=" relative">
                    <label htmlFor="tech_inc" className="label">
                      {data?.payload?.tech_lang_keys["inc"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_inc"
                        id="tech_inc"
                        className="input my-2"
                        aria-label="input"
                        min="1"
                        max="4"
                        placeholder="00"
                        value={formData.tech_inc}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className=" relative">
                    <label htmlFor="tech_rep" className="label">
                      {data?.payload?.tech_lang_keys["rep"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_rep"
                        id="tech_rep"
                        className="input my-2"
                        aria-label="input"
                        min="1"
                        max="20"
                        placeholder="00"
                        value={formData.tech_rep}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full">
                      {result?.tech_method == 1 ? (
                        <>
                          <div className="w-full mt-2 overflow-auto">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    <p>
                                      {data?.payload?.tech_lang_keys["a"]}
                                      {formData?.tech_ss !== ""
                                        ? ` = ${formData.tech_ss})`
                                        : "= x)"}
                                    </p>
                                  </td>
                                  <td className="py-2 border-b">
                                    <b>{result?.tech_a}</b>
                                  </td>
                                  <td className="p-2 border-b">
                                    <b>{(result?.tech_a * 100).toFixed(4)}%</b>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    <p>
                                      {data?.payload?.tech_lang_keys["b"]}
                                      {formData?.tech_ss !== ""
                                        ? ` < ${formData.tech_ss})`
                                        : " < x)"}
                                    </p>
                                  </td>
                                  <td className="py-2 border-b">
                                    <b>{result?.tech_b}</b>
                                  </td>
                                  <td className="p-2 border-b">
                                    <b>{(result?.tech_b * 100).toFixed(4)}%</b>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    <p>
                                      {data?.payload?.tech_lang_keys["b"]}
                                      {formData?.tech_ss !== ""
                                        ? ` ≤ ${formData.tech_ss})`
                                        : " ≤ x)"}
                                    </p>
                                  </td>
                                  <td className="py-2 border-b">
                                    <b>{result?.tech_c}</b>
                                  </td>
                                  <td className="p-2 border-b">
                                    <b>{(result?.tech_c * 100).toFixed(4)}%</b>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    <p>
                                      {data?.payload?.tech_lang_keys["b"]}
                                      {formData?.tech_ss !== ""
                                        ? ` > ${formData.tech_ss})`
                                        : " > x)"}
                                    </p>
                                  </td>
                                  <td className="py-2 border-b">
                                    <b>{result?.tech_d}</b>
                                  </td>
                                  <td className="p-2 border-b">
                                    <b>{(result?.tech_d * 100).toFixed(4)}%</b>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    <p>
                                      {data?.payload?.tech_lang_keys["b"]}
                                      {formData?.tech_ss !== ""
                                        ? ` ≥ ${formData.tech_ss})`
                                        : " ≥ x)"}
                                    </p>
                                  </td>
                                  <td className="py-2 border-b">
                                    <b>{result?.tech_e}</b>
                                  </td>
                                  <td className="p-2 border-b">
                                    <b>{(result?.tech_e * 100).toFixed(4)}%</b>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full mt-2 overflow-auto">
                            <table className="w-full">
                              <tr>
                                <td className="py-2 border-b">
                                  <b>x</b>
                                </td>
                                <td className="py-2 border-b">
                                  <b>{data?.payload?.tech_lang_keys["geo"]}</b>
                                </td>
                                <td className="py-2 border-b">
                                  <b>
                                    {data?.payload?.tech_lang_keys["geo"]} %
                                  </b>
                                </td>
                              </tr>
                              <tbody
                                dangerouslySetInnerHTML={{
                                  __html: result.tech_table,
                                }}
                              />
                            </table>
                          </div>
                        </>
                      )}
                      <div className="w-full mt-3 overflow-auto">
                        <p className="col-12 text-blue">
                          <InlineMath
                            math={`Your\\ Input:\\ N = ${N},\\ K = ${K},\\ n = ${n},\\ k = ${k}`}
                          />
                        </p>

                        <p className="col-12 mt-3">
                          <InlineMath
                            math={`Mean\\ (\\mu) = n * K / N = ${meanExpr}`}
                          />
                        </p>

                        <p className="col-12 mt-3">
                          <InlineMath math={`= ${meanCalc}`} />
                        </p>

                        <p className="col-12 mt-3">
                          <InlineMath math={`= ${result?.tech_mean}`} />
                        </p>

                        <p className="col-12 mt-3">
                          <InlineMath
                            math={`Variance\\ (\\sigma^2) = n * K / N * (N - K)/N * (N - n)/(N - 1)`}
                          />
                        </p>

                        <p className="col-12 mt-3">
                          <InlineMath math={`= ${varianceExpr}`} />
                        </p>

                        <p className="col-12 mt-3">
                          <InlineMath
                            math={`= ${varianceCalc} \\approx ${result?.tech_variance}`}
                          />
                        </p>

                        <p className="col-12 mt-3">
                          <InlineMath
                            math={`\\text{Standard\\ deviation}\\ (\\sigma) = \\sqrt{n * K / N * (N - K)/N * (N - n)/(N - 1)}`}
                          />
                        </p>

                        <p className="col-12 mt-3">
                          <InlineMath
                            math={`= ${stdDevExpr} \\approx ${result?.tech_sd}`}
                          />
                        </p>

                        <p className="col s12 mt-5 text-lg font-bold">
                          So, Mean (μ) = {result?.tech_mean} , Variance (σ
                          <sup>2</sup>) ≈ {result?.tech_variance} , Standard
                          deviation (σ) ≈ {result?.tech_sd}
                        </p>

                        <div id="container" className="col-12 mt-3">
                          <Bar data={datachart} options={options} />
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

export default HypergeometricCalculator;

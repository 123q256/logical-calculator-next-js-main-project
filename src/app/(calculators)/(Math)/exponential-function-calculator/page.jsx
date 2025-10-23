"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

import {
  useGetSingleCalculatorDetailsMutation,
  useExponentialFunctionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ExponentialFunctionCalculator = () => {
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
    tech_t1: "2",
    tech_y1: "4",
    tech_t2: "5",
    tech_y2: "5",
    tech_point_optional: "34",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useExponentialFunctionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_t1 ||
      !formData.tech_y1 ||
      !formData.tech_t2 ||
      !formData.tech_y2
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_t1: formData.tech_t1,
        tech_y1: formData.tech_y1,
        tech_t2: formData.tech_t2,
        tech_y2: formData.tech_y2,
        tech_point_optional: formData.tech_point_optional,
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
      tech_t1: "2",
      tech_y1: "4",
      tech_t2: "5",
      tech_y2: "5",
      tech_point_optional: "34",
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

  const A = result?.tech_A;
  const k = result?.tech_k;
  const t1 = formData?.tech_t1;
  const t2 = formData?.tech_t2;
  const y1 = formData?.tech_y1;
  const y2 = formData?.tech_y2;
  const A0 = result?.tech_A;
  const f = result?.tech_f;
  const optionalPoint = formData?.tech_point_optional || 2;

  // chart js

  const t = isNaN(optionalPoint) ? 2 : parseFloat(optionalPoint);
  const time = t + 8;
  const xValues = [];
  const yValues = [];

  for (let i = 0.01; i <= time; i += 0.1) {
    const fx = parseFloat(A) * Math.exp(parseFloat(k) * i);
    xValues.push(parseFloat(i.toFixed(2)));
    yValues.push(parseFloat(fx.toFixed(2)));
  }

  const datachart = {
    labels: xValues,
    datasets: [
      {
        label: "f(x) = Ae^{kt}",
        data: yValues,
        borderColor: "#13699E",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    datalabels: {
      display: false, // ✅ Disable value labels on bars
    },

    scales: {
      x: { title: { display: true, text: "x" } },
      y: { title: { display: true, text: "f(x)" } },
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_t1" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_t1"
                    id="tech_t1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_t1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_y1" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
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
                <label htmlFor="tech_t2" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_t2"
                    id="tech_t2"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_t2}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_y2" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_point_optional" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_point_optional"
                    id="tech_point_optional"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_point_optional}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b w-[60%]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[6]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <InlineMath math={`${A}x e^{${k}t}`} />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-3">
                            <strong>{data?.payload?.tech_lang_keys[16]}</strong>
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[11]}
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[12]} (t₁) = {t1}
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[14]} (y₁) = {y1}
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[13]} (t₂) = {t2}
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[15]} (y₂) = {y2}
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[17]}
                          </p>
                          <BlockMath math={`f(t) = A_0e^{kt}`} />
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[18]}₀
                            {data?.payload?.tech_lang_keys[19]}
                          </p>
                          <BlockMath math={`y_1 = A_0e^{kt_1}`} />
                          <BlockMath math={`y_2 = A_0e^{kt_2}`} />
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[20]} Divide y₁ by y₂
                            to cancel A₀
                          </p>
                          <BlockMath
                            math={`\\frac{y_1}{y_2} = \\frac{A_0 e^{kt_1}}{A_0 e^{kt_2}}`}
                          />
                          <BlockMath
                            math={`\\frac{y_1}{y_2} = \\frac{e^{kt_1}}{e^{kt_2}}`}
                          />
                          <BlockMath
                            math={`\\frac{y_1}{y_2} = e^{k(t_1 - t_2)}`}
                          />
                          <BlockMath
                            math={`\\ln\\left(\\frac{y_1}{y_2}\\right) = k(t_1 - t_2)`}
                          />
                          <BlockMath
                            math={`k = \\frac{1}{t_1 - t_2} \\ln\\left(\\frac{y_1}{y_2}\\right)`}
                          />

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[24]}{" "}
                            {data?.payload?.tech_lang_keys[25]}
                          </p>

                          <BlockMath math={`A_0 = y_1 e^{-kt_1}`} />
                          <BlockMath math={`A_0 = y_2 e^{-kt_2}`} />
                          <BlockMath
                            math={`k = \\frac{1}{${formData?.tech_t1} - ${formData?.tech_t2}} \\ln\\left(\\frac{${formData?.tech_y1}}{${formData?.tech_y2}}\\right)`}
                          />
                          <BlockMath math={`k = ${k}`} />
                          <BlockMath
                            math={`A_0 = ${y2} \times e^{-(${k} \times ${t2})}`}
                          />
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[31]}{" "}
                            {data?.payload?.tech_lang_keys[32]}
                          </p>
                          <BlockMath math={`f(t) = A_0e^{kt}`} />
                          <BlockMath math={`f(t) = ${A}e^{${k}t}`} />
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[33]}{" "}
                            {data?.payload?.tech_lang_keys[34]} {optionalPoint},
                            so we have:
                          </p>
                          <BlockMath
                            math={`f(${optionalPoint}) = ${A}e^{${k}\times${optionalPoint}}`}
                          />
                          <BlockMath math={`f(${optionalPoint}) = ${f}`} />
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[7]}
                          </p>
                          <p className="mt-3">
                            {k > 0
                              ? data?.payload?.tech_lang_keys[8]
                              : data?.payload?.tech_lang_keys[9]}
                          </p>
                          <div
                            id="curve_chart"
                            className="col-lg-8 mx-auto my-3 overflow-auto"
                          >
                            <Line data={datachart} options={options} />
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

export default ExponentialFunctionCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LinearScale, PointElement, Title, Tooltip, Legend);

import {
  useGetSingleCalculatorDetailsMutation,
  useResidualCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ResidualCalculator = () => {
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
    tech_x: "1, 13, 5, 7, 9",
    tech_y: "2, 4, 6, 18, 10",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useResidualCalculatorMutation();

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
      tech_x: "1, 13, 5, 7, 9",
      tech_y: "2, 4, 6, 18, 10",
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

  const sigFig = (value, digits) => {
    if (value === "") return "";
    if (value === 0) {
      return value.toFixed(digits - 1);
    }
    const decimalPlaces =
      value < 0
        ? digits - Math.floor(Math.log10(-value)) - 1
        : digits - Math.floor(Math.log10(value)) - 1;
    return parseFloat(value.toFixed(decimalPlaces));
  };

  const x = result?.tech_x || [];
  const y = result?.tech_y || [];
  const x_sum = result?.tech_x_sum || 0;
  const xi_sum = result?.tech_xi_sum || 0;
  const y_sum = result?.tech_y_sum || 0;
  const yi_sum = result?.tech_yi_sum || 0;
  const xy_sum = result?.tech_xy_sum || 0;
  const n = result?.tech_n || 0;
  const ss_xx = result?.tech_ss_xx || 0;
  const ss_yy = result?.tech_ss_yy || 0;
  const ss_xy = result?.tech_ss_xy || 0;
  const beta_1 = result?.tech_beta_1 || 0;
  const beta_0 = result?.tech_beta_0 || 0;
  const y_bar = result?.tech_y_bar || 0;
  const yy_bar = result?.tech_yy_bar || 0;

  // LaTeX expression banayein dynamically
  const latex = `\\hat{Y} = ${beta_0} + ${beta_1}X`;

  // chart js
  const xyValues = result?.tech_y_bar.map((value, index) => ({
    x: value,
    y: result?.tech_yy_bar[index],
  }));

  const datachart = {
    datasets: [
      {
        label: "Residuals vs Predicted Values",
        data: xyValues,
        pointRadius: 4,
        pointBackgroundColor: "rgba(0,0,255,1)",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Scatterplot of Residuals versus Predicted Values",
        font: {
          size: 20,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Predicted Values",
        },
      },
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Residuals",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["var_x"]} (,):
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
              <div className="col-span-12">
                <label htmlFor="tech_y" className="label">
                  {data?.payload?.tech_lang_keys["var_y"]} (,):
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_y"
                    id="tech_y"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                    value={formData.tech_y || ""}
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

                  <div className="rounded-lg  flex items-center justify-center ">
                    <div className="w-full  mt-3">
                      <div className="w-full ">
                        <p className="w-full">
                          {data?.payload?.tech_lang_keys["satement1"]}:
                        </p>
                        <div className="w-full mt-2 overflow-auto">
                          <table className="w-full border-collapse">
                            <thead className="bg-[#2845F5] text-white">
                              <tr>
                                <th className="p-2 bordered text-center text-blue">
                                  Obs.
                                </th>
                                <th className="p-2 bordered text-center text-blue">
                                  X
                                </th>
                                <th className="p-2 bordered text-center text-blue">
                                  Y
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {x.map((value, index) => (
                                <tr className="bg-white" key={index}>
                                  <td className="p-2 bordered text-center">
                                    {index + 1}
                                  </td>
                                  <td className="p-2 bordered text-center">
                                    {value}
                                  </td>
                                  <td className="p-2 bordered text-center">
                                    {y[index]}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <p className="w-full mt-3">
                          {data?.payload?.tech_lang_keys["satement2"]}:
                        </p>
                        <div className="w-full mt-2 overflow-auto">
                          <table className="w-full border-collapse">
                            <thead className="bg-[#2845F5] text-white">
                              <tr>
                                <th className="p-2 bordered text-center text-blue">
                                  Obs.
                                </th>
                                <th className="p-2 bordered text-center text-blue">
                                  X
                                </th>
                                <th className="p-2 bordered text-center text-blue">
                                  Y
                                </th>
                                <th className="p-2 bordered text-center text-blue">
                                  Xᵢ²
                                </th>
                                <th className="p-2 bordered text-center text-blue">
                                  Yᵢ²
                                </th>
                                <th className="p-2 bordered text-center text-blue">
                                  Xᵢ·Yᵢ
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {x.map((xi, index) => {
                                const yi = y[index];
                                return (
                                  <tr className="bg-white" key={index}>
                                    <td className="p-2 bordered text-center">
                                      {index + 1}
                                    </td>
                                    <td className="p-2 bordered text-center">
                                      {xi}
                                    </td>
                                    <td className="p-2 bordered text-center">
                                      {yi}
                                    </td>
                                    <td className="p-2 bordered text-center">
                                      {Math.pow(xi, 2)}
                                    </td>
                                    <td className="p-2 bordered text-center">
                                      {Math.pow(yi, 2)}
                                    </td>
                                    <td className="p-2 bordered text-center">
                                      {xi * yi}
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr className="bg-gay-200">
                                <td className="p-2 bordered text-blue text-center">
                                  Sum =
                                </td>
                                <td className="p-2 bordered text-blue text-center">
                                  {x_sum}
                                </td>
                                <td className="p-2 bordered text-blue text-center">
                                  {y_sum}
                                </td>
                                <td className="p-2 bordered text-blue text-center">
                                  {xi_sum}
                                </td>
                                <td className="p-2 bordered text-blue text-center">
                                  {yi_sum}
                                </td>
                                <td className="p-2 bordered text-blue text-center">
                                  {xy_sum}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className=" lg:p-3 md:p-3 p-0 mt-4">
                          <div className="overflow-auto lg:p-3 md:p-3 p-0 mt-4">
                            <p className="w-full mt-3">
                              {data?.payload?.tech_lang_keys["satement3"]}:
                            </p>

                            <BlockMath
                              math={`SS_{XX} = \\sum_{i=1}^n X_i^2 - \\frac{1}{n} \\left(\\sum_{i=1}^n X_i \\right)^2`}
                            />
                            <BlockMath
                              math={`= ${xi_sum} - \\frac{1}{${n}} (${x_sum})^2`}
                            />
                            <BlockMath math={`= ${ss_xx}`} />

                            <BlockMath
                              math={`SS_{YY} = \\sum_{i=1}^n Y_i^2 - \\frac{1}{n} \\left(\\sum_{i=1}^n Y_i \\right)^2`}
                            />
                            <BlockMath
                              math={`= ${yi_sum} - \\frac{1}{${n}} (${y_sum})^2`}
                            />
                            <BlockMath math={`= ${ss_yy}`} />

                            <BlockMath
                              math={`SS_{XY} = \\sum_{i=1}^n X_i Y_i - \\frac{1}{n} \\left(\\sum_{i=1}^n X_i \\right) \\left(\\sum_{i=1}^n Y_i \\right)`}
                            />
                            <BlockMath
                              math={`= ${xy_sum} - \\frac{1}{${n}} (${x_sum}) (${y_sum})`}
                            />
                            <BlockMath math={`= ${ss_xy}`} />

                            <p className="w-full mt-3">
                              {data?.payload?.tech_lang_keys["satement4"]}:
                            </p>

                            <BlockMath
                              math={`\\hat{\\beta}_1 = \\frac{SS_{XY}}{SS_{XX}}`}
                            />
                            <BlockMath math={`= \\frac{${ss_xy}}{${ss_xx}}`} />
                            <BlockMath math={`= ${beta_1}`} />

                            <BlockMath
                              math={`\\hat{\\beta}_0 = \\bar{Y} - \\hat{\\beta}_1 \\times \\bar{X}`}
                            />
                            <BlockMath
                              math={`= ${(y_sum / n).toFixed(
                                5
                              )} - ${beta_1} \\times ${(x_sum / n).toFixed(5)}`}
                            />
                            <BlockMath math={`= ${beta_0}`} />

                            <p className="w-full mt-3">
                              {data?.payload?.tech_lang_keys["satement5"]}:
                            </p>
                            <BlockMath
                              math={`\\hat{Y} = ${beta_0} + ${beta_1} X`}
                            />

                            <div>
                              <p className="w-full mt-3">
                                {data?.payload?.tech_lang_keys["satement6"]}:
                              </p>
                              <BlockMath math={latex} />
                            </div>

                            <p className="w-full mt-3 mb-10">
                              {data?.payload?.tech_lang_keys["satement7"]}:
                            </p>
                          </div>

                          <div className="w-full mt-2 overflow-auto">
                            <table
                              className="w-full"
                              style={{ borderCollapse: "collapse" }}
                            >
                              <thead>
                                <tr className="bg-[#2845F5] text-white">
                                  <th className="p-2 bordered text-center">
                                    Obs.
                                  </th>
                                  <th className="p-2 bordered text-center">
                                    X
                                  </th>
                                  <th className="p-2 bordered text-center">
                                    Y
                                  </th>
                                  <th className="p-2 bordered text-center">
                                    Predicted Values{" "}
                                    <InlineMath math={"\\hat{Y}"} />
                                  </th>
                                  <th className="p-2 bordered text-center">
                                    Residuals{" "}
                                    <InlineMath math={"Y - \\hat{Y}"} />
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {x.map((xi, key) => {
                                  const yi = y[key];
                                  return (
                                    <tr key={key} className="bg-white">
                                      <td className="p-2 bordered text-center">
                                        {key + 1}
                                      </td>
                                      <td className="p-2 bordered text-center">
                                        {xi}
                                      </td>
                                      <td className="p-2 bordered text-center">
                                        {yi}
                                      </td>
                                      <td className="p-2 bordered text-center">
                                        <InlineMath
                                          math={`${beta_0} + ${beta_1} \\times ${xi} = ${y_bar[key]}`}
                                        />
                                      </td>
                                      <td className="p-2 bordered text-center">
                                        <InlineMath
                                          math={`${yi} - ${y_bar[key]} = ${yy_bar[key]}`}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          <p className="w-full my-3">
                            {data?.payload?.tech_lang_keys["satement8"]}:
                          </p>

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

export default ResidualCalculator;

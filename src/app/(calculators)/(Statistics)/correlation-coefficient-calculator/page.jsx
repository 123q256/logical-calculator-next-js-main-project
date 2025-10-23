"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCorrelationCoefficientCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CorrelationCoefficientCalculator = () => {
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
    tech_x: "43, 21, 25, 42, 57, 59",
    tech_y: "99, 65, 79, 75, 87, 81",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCorrelationCoefficientCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x || !formData.tech_y || !formData.tech_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method: formData.tech_method,
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
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
      tech_x: "43, 21, 25, 42, 57, 59",
      tech_y: "99, 65, 79, 75, 87, 81",
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

  // result\
  const array_sum = (arr) => arr?.reduce((a, b) => a + b, 0) || 0;

  const sdigFig = (value, digits) => {
    if (value === 0) return value.toFixed(digits - 1);
    const decimalPlaces = digits - Math.floor(Math.log10(Math.abs(value))) - 1;
    return Number(value).toFixed(decimalPlaces);
  };

  // chart
  const dataset = result?.tech_numbers.map((x, index) => ({
    x: x,
    y: result?.tech_numbersy[index] ?? 0,
  }));

  const datachart = {
    datasets: [
      {
        label: "Scatter Dataset",
        data: dataset,
        backgroundColor: "#13699E",
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Scatter Plot",
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: { display: true, text: "x-axis" },
      },
      y: {
        title: { display: true, text: "y-axis" },
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
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12">
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
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["4"]} (
                  {data?.payload?.tech_lang_keys["5"]}):
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
                  {data?.payload?.tech_lang_keys["6"]} (
                  {data?.payload?.tech_lang_keys["5"]}):
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="text-center">
                        <p className="text-[16px]">
                          <strong>{data?.payload?.tech_lang_keys["7"]}</strong>
                        </p>
                        <div className="flex justify-center">
                          <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                            <strong className="text-blue">
                              {Number(result?.tech_final).toFixed(2)}
                            </strong>
                          </p>
                        </div>
                      </div>

                      <div className="col-lg-7 mt-2 overflow-auto">
                        <table className="w-full">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["8"]} (
                                  <InlineMath math="n" />)
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_numbers?.length}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["9"]}{" "}
                                  <InlineMath math="\mu_X" />
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {Number(result?.tech_meanx).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["9"]}{" "}
                                  <InlineMath math="\mu_Y" />
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {Number(result?.tech_meany).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">
                                <strong className="text-blue">
                                  <InlineMath math="\sigma_x" />
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {Number(
                                  Math.sqrt(
                                    array_sum(result?.tech_arr2) /
                                      result?.tech_countx
                                  )
                                ).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">
                                <strong className="text-blue">
                                  <InlineMath math="\sigma_y" />
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {Number(
                                  Math.sqrt(
                                    array_sum(result?.tech_arr4) /
                                      result?.tech_countx
                                  )
                                ).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <p className="w-full mt-3 text-[12px] overflow-auto">
                        <strong className="text-blue">
                          {data?.payload?.tech_lang_keys["10"]}:
                        </strong>
                      </p>
                      <p className="w-full mt-2 text-[18px] overflow-auto">
                        <strong>
                          {data?.payload?.tech_lang_keys["11"]} X ={" "}
                          {result?.tech_x}
                        </strong>
                      </p>
                      <p className="w-full mt-2 text-[18px] overflow-auto">
                        <strong>
                          {data?.payload?.tech_lang_keys["11"]} Y ={" "}
                          {result?.tech_y}
                        </strong>
                      </p>
                      <p className="w-full mt-3 text-[12px] overflow-auto">
                        <strong className="text-blue">
                          {data?.payload?.tech_lang_keys["12"]}:
                        </strong>
                      </p>

                      {result?.tech_method === "2" && (
                        <>
                          <p className="w-full mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["13"]}:
                            </strong>
                          </p>
                          <div className="col-lg-6 mt-2 overflow-auto">
                            <table
                              className="w-full text-[18px]"
                              style={{ borderCollapse: "collapse" }}
                            >
                              <thead className="bg-gray-100">
                                <tr>
                                  <td className="border p-2 text-center text-blue">
                                    X
                                  </td>
                                  <td className="border p-2 text-center text-blue">
                                    Y
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                {result?.tech_numbers?.map((x, i) => (
                                  <tr key={i} className="bg-white">
                                    <td className="border p-2 text-center">
                                      {Number(x).toFixed(2)}
                                    </td>
                                    <td className="border p-2 text-center">
                                      {Number(result?.tech_numbersy[i]).toFixed(
                                        2
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                      <p className="w-full mt-2">
                        <InlineMath math="\sum x =" />{" "}
                        {array_sum(result?.tech_numbers)}
                      </p>

                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["9"]}{" "}
                        <InlineMath math="\mu_X =" />{" "}
                        <strong>
                          <InlineMath
                            math={`\\dfrac{${array_sum(
                              result?.tech_numbers
                            )}}{${result?.tech_countx}} = ${Number(
                              result?.tech_meanx
                            ).toFixed(4)}`}
                          />
                        </strong>
                      </p>

                      <p className="w-full mt-2">
                        <InlineMath math="\sum y =" />{" "}
                        {array_sum(result?.tech_numbersy)}
                      </p>

                      <p className="w-full mt-2">
                        {data?.payload?.tech_lang_keys["9"]}{" "}
                        <InlineMath math="\mu_Y =" />{" "}
                        <strong>
                          <InlineMath
                            math={`\\dfrac{${array_sum(
                              result?.tech_numbersy
                            )}}{${result?.tech_countx}} = ${Number(
                              result?.tech_meany
                            ).toFixed(4)}`}
                          />
                        </strong>
                      </p>

                      <div className="w-full mt-2 overflow-auto">
                        <table
                          className="w-full font-s-18"
                          style={{ borderCollapse: "collapse" }}
                        >
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border p-2 text-center">
                                <InlineMath math="(x_i - \mu_X)" />
                              </th>
                              <th className="border p-2 text-center">
                                <InlineMath math="(x_i - \mu_X)^2" />
                              </th>
                              <th className="border p-2 text-center">
                                <InlineMath math="(y_i - \mu_Y)" />
                              </th>
                              <th className="border p-2 text-center">
                                <InlineMath math="(y_i - \mu_Y)^2" />
                              </th>
                              <th className="border p-2 text-center">
                                <InlineMath math="(x_i - \mu_X)(y_i - \mu_Y)" />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.from({ length: result?.tech_countx }).map(
                              (_, i) => (
                                <tr className="bg-white" key={i}>
                                  <td className="border p-2 text-center">
                                    {Number(result?.tech_arr1[i]).toFixed(4)}
                                  </td>
                                  <td className="border p-2 text-center">
                                    {Number(result?.tech_arr2[i]).toFixed(4)}
                                  </td>
                                  <td className="border p-2 text-center">
                                    {Number(result?.tech_arr3[i]).toFixed(4)}
                                  </td>
                                  <td className="border p-2 text-center">
                                    {Number(result?.tech_arr4[i]).toFixed(4)}
                                  </td>
                                  <td className="border p-2 text-center">
                                    {Number(result?.tech_arr5[i]).toFixed(4)}
                                  </td>
                                </tr>
                              )
                            )}
                            <tr className="bg-gray-100">
                              <td className="border p-2 text-center"></td>
                              <td className="border p-2 text-center">
                                <InlineMath math="\sum =" />{" "}
                                {Number(
                                  array_sum(result?.tech_arr2).toFixed(2)
                                )}
                              </td>
                              <td className="border p-2 text-center"></td>
                              <td className="border p-2 text-center">
                                <InlineMath math="\sum =" />{" "}
                                {Number(
                                  array_sum(result?.tech_arr4).toFixed(2)
                                )}
                              </td>
                              <td className="border p-2 text-center">
                                <InlineMath math="\sum =" />{" "}
                                {Number(
                                  array_sum(result?.tech_arr5).toFixed(2)
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <p className="w-full mt-3 text-[12px]">
                        <strong className="text-blue">
                          {data?.payload?.tech_lang_keys["14"]}
                        </strong>
                      </p>

                      <BlockMath
                        math={`r = \\dfrac{\\sum{(x_i - \\bar{x})(y_i - \\bar{y})}}{\\sqrt{\\sum{(x_i - \\bar{x})^2} \\sum{(y_i - \\bar{y})^2}}}`}
                      />

                      <BlockMath
                        math={`r = \\dfrac{${Number(
                          array_sum(result?.tech_arr5).toFixed(2)
                        )}}{\\sqrt{${Number(
                          array_sum(result?.tech_arr2).toFixed(2)
                        )} \\times ${Number(
                          array_sum(result?.tech_arr4).toFixed(2)
                        )}}}`}
                      />

                      <BlockMath
                        math={`r = ${Number(result?.tech_final).toFixed(4)}`}
                      />

                      <div className="w-full overflow-auto">
                        <Scatter data={datachart} options={options} />
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

export default CorrelationCoefficientCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

import {
  useGetSingleCalculatorDetailsMutation,
  useQuartileCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const QuartileCalculator = () => {
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
    tech_x: "12, 32, 12, 33, 4",
    tech_seprate: ",",
    tech_seprateby: ",",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useQuartileCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tech_seprateby") {
      setFormData((prevData) => {
        // Determine old and new separators
        const oldSep = prevData.tech_seprateby === "space" ? " " : ",";
        // Your select value is either "space" or ","
        const newSep = value === "space" ? " " : ",";

        // Split existing tech_x by either space or comma, filtering empty
        const rawValues = prevData.tech_x
          ? prevData.tech_x.split(/\s|,/g).filter(Boolean)
          : [];

        // Join with new separator
        const newTextAreaValue = rawValues.join(newSep);

        return {
          ...prevData,
          tech_seprateby: value,
          tech_x: newTextAreaValue,
          tech_seprate: value === "space" ? "" : ",", // Update input value accordingly
        };
      });

      setResult(null);
      setFormError(null);
    } else {
      // other inputs: textarea, etc.
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      setResult(null);
      setFormError(null);
    }
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
        tech_seprate: formData.tech_seprate,
        tech_seprateby: formData.tech_seprateby,
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
      tech_x: "12, 32, 12, 33, 4",
      tech_seprate: ",",
      tech_seprateby: ",",
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

  const first = [
    { x: result?.tech_a1, y: 1 },
    // { x: result?.tech_first, y: 1 }
  ];
  const second = [
    { x: result?.tech_first, y: 1 },
    // { x: result?.tech_second, y: 1 }
  ];
  const third = [
    { x: result?.tech_second, y: 1 },
    // { x: result?.tech_third, y: 1 }
  ];
  const fourth = [
    { x: result?.tech_third, y: 1 },
    // { x: result?.tech_a2, y: 1 }
  ];

  const datachart = {
    datasets: [
      {
        label: `${data?.payload?.tech_lang_keys.qu} Q1 (${result?.tech_a1} – ${result?.tech_first})`,
        data: first,
        borderColor: "#fda400",
        backgroundColor: "#fda400",
        tension: 0,
        showLine: true,
      },
      {
        label: `${data?.payload?.tech_lang_keys.qu} Q2 (${result?.tech_first} – ${result?.tech_second})`,
        data: second,
        borderColor: "#0081B0",
        backgroundColor: "#0081B0",
        tension: 0,
        borderWidth: 2,
        showLine: true,
      },
      {
        label: `${data?.payload?.tech_lang_keys.qu} Q3 (${result?.tech_second} – ${result?.tech_third})`,
        data: third,
        borderColor: "#9ccc65",
        backgroundColor: "#9ccc65",
        tension: 0,
        showLine: true,
      },
      {
        label: `${data?.payload?.tech_lang_keys.qu} Q4 (${result?.tech_third} – ${result?.tech_a2})`,
        data: fourth,
        borderColor: "#795548",
        backgroundColor: "#795548",
        tension: 0,
        showLine: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      x: {
        min: result?.tech_numbers[0] - 1,
        max: result?.tech_numbers[result?.tech_count - 1] + 1,
        title: {
          display: true,
          text: "X Axis",
        },
      },
      y: {
        min: 0,
        max: 2,
        ticks: {
          callback: () => "",
        },
        title: {
          display: true,
          text: "Y Axis",
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
            <div className="grid grid-cols-12 gap-1  md:gap-3">
              <div className="col-span-8">
                <label htmlFor="tech_seprateby" className="label">
                  {data?.payload?.tech_lang_keys["by"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_seprateby"
                    id="tech_seprateby"
                    value={formData.tech_seprateby}
                    onChange={handleChange}
                  >
                    <option value="space">
                      {data?.payload?.tech_lang_keys["space"]}
                    </option>
                    <option value=",">
                      {data?.payload?.tech_lang_keys["coma"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-4 ">
                <label htmlFor="tech_seprate" className="label">
                  &nbsp;
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_seprate"
                    id="tech_seprate"
                    className="input my-2"
                    aria-label="input"
                    readOnly
                    value={formData.tech_seprate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 raw_mean">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["enter"]} :
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 12 32 12 33 4 21"
                    value={formData.tech_x || "e.g. 12 32 12 33 4 21"}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                            <span className="text-[18px]">
                              {data?.payload?.tech_lang_keys["qu"]} Q1
                            </span>
                            <strong className="text-green-700 text-[25px] ps-2">
                              {result?.tech_first}
                            </strong>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                            <span className="text-[18px]">
                              {data?.payload?.tech_lang_keys["qu"]} Q2
                            </span>
                            <strong className="text-green-700 text-[25px] ps-2">
                              {result?.tech_second}
                            </strong>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                            <span className="text-[18px]">
                              {data?.payload?.tech_lang_keys["qu"]} Q3
                            </span>
                            <strong className="text-green-700 text-[25px] ps-2">
                              {result?.tech_third}
                            </strong>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                            <span className="text-[18px]">
                              {data?.payload?.tech_lang_keys["iqr"]} IQR
                            </span>
                            <strong className="text-green-700 text-[25px] ps-2">
                              {result?.tech_iter}
                            </strong>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1   mt-3  gap-4">
                        <div className="w-full md:w-[90%] lg:w-[60%] mt-2 px-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["ave"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_average}</strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["geo"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_numbers && result?.tech_count
                                      ? Math.round(
                                          Math.pow(
                                            result.tech_numbers.reduce(
                                              (acc, num) => acc * num,
                                              1
                                            ),
                                            1 / result.tech_count
                                          ) * 10000
                                        ) / 10000
                                      : ""}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["sum"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_numbers
                                      ? result.tech_numbers.reduce(
                                          (a, b) => a + b,
                                          0
                                        )
                                      : ""}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["psd"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_s_d_p}</strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["ssd"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_s_d_s}</strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["range"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_numbers
                                      ? Math.max(...result.tech_numbers) -
                                        Math.min(...result.tech_numbers)
                                      : ""}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["count"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_numbers?.length}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full overflow-auto">
                          <div className="w-full">
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

export default QuartileCalculator;

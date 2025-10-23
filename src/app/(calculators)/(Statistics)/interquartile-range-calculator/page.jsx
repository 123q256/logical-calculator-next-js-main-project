"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

import {
  useGetSingleCalculatorDetailsMutation,
  useInterquartileRangeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const IqrCalculator = () => {
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
    tech_seprateby: ",",
    tech_seprate: ",",
    tech_x: "5,10,15,20,25,30",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useInterquartileRangeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResult(null);
    setFormError(null);

    // Separator dropdown change
    if (name === "tech_seprateby") {
      let sep = "";
      let updatedTechX = formData.tech_x;

      if (value === "space") {
        sep = " ";
        updatedTechX = formData.tech_x.replaceAll(",", " ");
      } else if (value === ",") {
        sep = ",";
        updatedTechX = formData.tech_x.replaceAll(" ", ",");
      } else if (value === "user") {
        sep = "";
      }

      setFormData((prev) => ({
        ...prev,
        tech_seprateby: value,
        tech_seprate: sep,
        tech_x: updatedTechX,
      }));
      return;
    }

    // Custom separator input
    if (name === "tech_seprate") {
      const sep = value;
      const parts = formData.tech_x
        .split(sep)
        .map((val) => val.trim())
        .filter((val) => val !== "");

      setFormData((prev) => ({
        ...prev,
        tech_seprate: sep,
        tech_x: parts.join(" "),
      }));
      return;
    }

    // Textarea input
    if (name === "tech_x") {
      let updatedValue = value;

      if (formData.tech_seprateby === "space") {
        updatedValue = value.replaceAll(",", " ");
      } else if (formData.tech_seprateby === ",") {
        updatedValue = value.replaceAll(" ", ",");
      } else if (formData.tech_seprateby === "user") {
        const sep = formData.tech_seprate;
        const parts = value
          .split(sep)
          .map((val) => val.trim())
          .filter((val) => val !== "");

        updatedValue = parts.join(" ");
      }

      setFormData((prev) => ({
        ...prev,
        [name]: updatedValue,
      }));
      return;
    }

    // Default case
    setFormData((prev) => ({ ...prev, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_seprateby) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_seprateby: formData.tech_seprateby,
        tech_seprate: formData.tech_seprate,
        tech_x: formData.tech_x,
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
      tech_seprateby: ",",
      tech_seprate: ",",
      tech_x: "5,10,15,20,25,30",
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

  const numbers = result?.tech_numbers || [];
  const count = result?.tech_count || numbers.length;
  const product = numbers.reduce((acc, val) => acc * val, 1);
  const geometricMean = count > 0 ? Math.pow(product, 1 / count).toFixed(4) : 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  const range = Math.max(...numbers) - Math.min(...numbers);

  // chart js

  // Convert segments into datasets
  const datasets = [
    {
      label: `${data?.payload?.tech_lang_keys.qu} Q1 (${result?.tech_a1} – ${result?.tech_first})`,
      data: [
        { x: result?.tech_a1, y: 1 },
        // { x: result?.tech_first, y: 1 },
      ],
      borderColor: "#fda400",
      backgroundColor: "#fda400",
      borderWidth: 2,
      fill: false,
    },
    {
      label: `${data?.payload?.tech_lang_keys.qu} Q2 (${result?.tech_first} – ${result?.tech_second})`,
      data: [
        { x: result?.tech_first, y: 1 },
        // { x: result?.tech_second, y: 1 },
      ],
      borderColor: "#0081B0",
      backgroundColor: "#0081B0",
      borderWidth: 2,
      fill: false,
    },
    {
      label: `${data?.payload?.tech_lang_keys.qu} Q3 (${result?.tech_second} – ${result?.tech_third})`,
      data: [
        { x: result?.tech_second, y: 1 },
        // { x: result?.tech_third, y: 1 },
      ],
      borderColor: "#9ccc65",
      backgroundColor: "#9ccc65",
      borderWidth: 2,
      fill: false,
    },
    {
      label: `${data?.payload?.tech_lang_keys.qu} Q4 (${result?.tech_third} – ${result?.tech_a2})`,
      data: [
        { x: result?.tech_third, y: 1 },
        // { x: result?.tech_a2, y: 1 },
      ],
      borderColor: "#795548",
      backgroundColor: "#795548",
      borderWidth: 2,
      fill: false,
    },
  ];

  const datachart = {
    datasets: datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 20,
        },
      },
    },
    scales: {
      x: {
        min: result?.tech_numbers[0] - 1,
        max: result?.tech_numbers[result?.tech_count - 1] + 1,
        title: {
          display: true,
          text: "Values",
        },
      },
      y: {
        min: 0,
        max: 2,
        ticks: {
          stepSize: 1,
          callback: () => "",
        },
        title: {
          display: false,
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
            <div className="grid grid-cols-12 gap-2">
              {/* Dropdown */}
              <div className="col-span-8 px-2">
                <label htmlFor="tech_seprateby" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
                    {/* <option value="user">{data?.payload?.tech_lang_keys["user"]}</option> */}
                  </select>
                </div>
              </div>
              {/* Separator Input */}
              <div className="col-span-4 px-2">
                <label htmlFor="tech_seprate" className="label">
                  &nbsp;
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="tech_seprate"
                    id="tech_seprate"
                    className="input my-2"
                    aria-label="input"
                    readOnly={formData.tech_seprateby !== "user"}
                    maxLength={1}
                    value={formData.tech_seprate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Textarea */}
              <div className="col-span-12 px-2">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["enter"]}:
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 12 32 12 33 4 21"
                    value={formData.tech_x}
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="row">
                        <div className="text-center">
                          <p className="text-[20px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["iqr"]} (IQR)
                            </strong>
                          </p>
                          <p className="text-[25px] bg-[#2845F5] px-3 py-2 rounded-lg inline-block my-3">
                            <strong className="text-white">
                              {result?.tech_iter}
                            </strong>
                          </p>
                        </div>

                        <div className="w-full md:w-[80%] lg:w-[50%] mt-2 px-lg-2 px-0">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["qu"]} Q1:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_first}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["qu"]} Q2:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_second}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["qu"]} Q3:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_third}</strong>
                                </td>
                              </tr>
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
                                  <strong>{geometricMean}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["sum"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{sum}</strong>
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
                                  <strong>{range}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys["count"]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{count}</strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full overflow-auto">
                          <Line data={datachart} options={options} />
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

export default IqrCalculator;

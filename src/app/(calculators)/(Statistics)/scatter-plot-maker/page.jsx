"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

// Register required Chart.js components
ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

import {
  useGetSingleCalculatorDetailsMutation,
  useScatterPlotMakerMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ScatterPlotMakerCalculator = () => {
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
    tech_title: "Scatter Plot",
    tech_xaxis: "X",
    tech_yaxis: "Y",
    tech_xmin: "4",
    tech_xmax: "4",
    tech_ymin: "4",
    tech_ymax: "4",
    tech_position: "right", // bottom top  right left
    tech_center: "start", // center start  end
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useScatterPlotMakerMutation();

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
        tech_title: formData.tech_title,
        tech_xaxis: formData.tech_xaxis,
        tech_yaxis: formData.tech_yaxis,
        tech_xmin: formData.tech_xmin,
        tech_xmax: formData.tech_xmax,
        tech_ymin: formData.tech_ymin,
        tech_ymax: formData.tech_ymax,
        tech_position: formData.tech_position,
        tech_center: formData.tech_center,
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
      tech_x: "",
      tech_y: "",
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

  // chart

  // Prepare xy values
  const xyValues = result?.tech_x.map((value, index) => ({
    x: parseFloat(value),
    y: parseFloat(result?.tech_y[index]),
  }));

  // Chart.js data
  const datachart = {
    datasets: [
      {
        label: result?.tech_title,
        pointRadius: 4,
        pointBackgroundColor: "rgba(0,0,255,1)",
        data: xyValues,
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        align: result?.tech_align || "center",
        position: result?.tech_position || "top",
        labels: {
          boxWidth: 0,
        },
      },
      title: {
        display: true,
        text: result?.tech_title || "",
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: result?.tech_xaxis,
        },
        ...(isFinite(result?.tech_xmin) && { min: result?.tech_xmin }),
        ...(isFinite(result?.tech_xmax) && { max: result?.tech_xmax }),
      },
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: result?.tech_yaxis,
        },
        ...(isFinite(result?.tech_ymin) && { min: result?.tech_ymin }),
        ...(isFinite(result?.tech_ymax) && { max: result?.tech_ymax }),
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

          <div className="lg:w-[70%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  X {data?.payload?.tech_lang_keys["data"]} (,):
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
                  Y {data?.payload?.tech_lang_keys["data"]} (,):
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
              <div className="col-span-12">
                <label htmlFor="tech_title" className="label">
                  {data?.payload?.tech_lang_keys["g_title"]} (
                  {data?.payload?.tech_lang_keys["optional"]}):
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_title"
                    id="tech_title"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_title}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_xaxis" className="label">
                  {data?.payload?.tech_lang_keys["horizontal"]}{" "}
                  {data?.payload?.tech_lang_keys["axis_label"]} (
                  {data?.payload?.tech_lang_keys["optional"]}):
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_xaxis"
                    id="tech_xaxis"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_xaxis}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_yaxis" className="label">
                  {data?.payload?.tech_lang_keys["vertical"]}{" "}
                  {data?.payload?.tech_lang_keys["axis_label"]} (
                  {data?.payload?.tech_lang_keys["optional"]}):
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_yaxis"
                    id="tech_yaxis"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_yaxis}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_xmin" className="label">
                  X {data?.payload?.tech_lang_keys["min"]} (
                  {data?.payload?.tech_lang_keys["optional"]}):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_xmin"
                    id="tech_xmin"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_xmin}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_xmax" className="label">
                  X {data?.payload?.tech_lang_keys["max"]} (
                  {data?.payload?.tech_lang_keys["optional"]}):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_xmax"
                    id="tech_xmax"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_xmax}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_ymin" className="label">
                  Y {data?.payload?.tech_lang_keys["min"]} (
                  {data?.payload?.tech_lang_keys["optional"]}):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_ymin"
                    id="tech_ymin"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_ymin}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_ymax" className="label">
                  Y {data?.payload?.tech_lang_keys["max"]} (
                  {data?.payload?.tech_lang_keys["optional"]}):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_ymax"
                    id="tech_ymax"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_ymax}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_position" className="label">
                  {data?.payload?.tech_lang_keys["position"]} (
                  {data?.payload?.tech_lang_keys["optional"]}):
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_position"
                    id="tech_position"
                    value={formData.tech_position}
                    onChange={handleChange}
                  >
                    <option value="top">
                      {data?.payload?.tech_lang_keys["top"]}
                    </option>
                    <option value="left">
                      {data?.payload?.tech_lang_keys["left"]}
                    </option>
                    <option value="right">
                      {data?.payload?.tech_lang_keys["right"]}
                    </option>
                    <option value="bottom">
                      {data?.payload?.tech_lang_keys["bottom"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_center" className="label">
                  {data?.payload?.tech_lang_keys["align"]} (
                  {data?.payload?.tech_lang_keys["optional"]}):
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_center"
                    id="tech_center"
                    value={formData.tech_center}
                    onChange={handleChange}
                  >
                    <option value="start">
                      {data?.payload?.tech_lang_keys["start"]}
                    </option>
                    <option value="center">
                      {data?.payload?.tech_lang_keys["center"]}
                    </option>
                    <option value="end">
                      {data?.payload?.tech_lang_keys["end"]}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <p className="w-full">
                          {data?.payload?.tech_lang_keys["statement1"]}{" "}
                          {result.tech_xaxis}{" "}
                          {data?.payload?.tech_lang_keys["and"]}{" "}
                          {result.tech_yaxis}{" "}
                          {data?.payload?.tech_lang_keys["variables"]}:
                        </p>

                        <div className="w-full mt-2 overflow-auto bg-[#1670a712]">
                          <table
                            className="w-full"
                            style={{ borderCollapse: "collapse" }}
                          >
                            <thead>
                              <tr className="bg-[#2845F5] text-white">
                                <td className="p-2 bordered text-center">
                                  <strong className="text-blue">
                                    {result.tech_xaxis}
                                  </strong>
                                </td>
                                <td className="p-2 bordered text-center">
                                  <strong className="text-blue">
                                    {result.tech_yaxis}
                                  </strong>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              {result.tech_x.map((value, key) => (
                                <tr className="bg-white" key={key}>
                                  <td className="p-2 bordered text-center">
                                    {value}
                                  </td>
                                  <td className="p-2 bordered text-center">
                                    {result.tech_y[key]}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <p className="mt-3 w-full">
                          {data?.payload?.tech_lang_keys["statement2"]}:
                        </p>
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

export default ScatterPlotMakerCalculator;

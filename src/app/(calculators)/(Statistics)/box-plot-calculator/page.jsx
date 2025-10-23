"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
} from "chart.js";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import { Chart, Bar } from "react-chartjs-2";

// Register only once, all needed components
ChartJS.register(
  BoxPlotController,
  BoxAndWiskers,
  LinearScale,
  CategoryScale,
  Tooltip,
  Title,
  ChartDataLabels
);

import {
  useGetSingleCalculatorDetailsMutation,
  useBoxPlotCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BoxPlotCalculator = () => {
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
    tech_seprateby: "space",
    tech_x: "3 8 10 17 24 27",
    tech_seprate: " ",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBoxPlotCalculatorMutation();

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

    if (!formData.tech_x || !formData.tech_seprate) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_seprate: formData.tech_seprate,
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
      tech_seprateby: "space",
      tech_x: "3 8 10 17 24 27",
      tech_seprate: " ",
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

  // chart js two
  const minValue = Math.min(...(result?.tech_numbers || []));
  const maxValue = Math.max(...(result?.tech_numbers || []));

  const datachart2 = {
    labels: ["5 Number Summary"],
    datasets: [
      {
        label: "Box And Whisker Plot",
        backgroundColor: "#008FFB",
        borderColor: "#1E88E5",
        borderWidth: 1,
        outlierColor: "#FEB019",
        padding: 10,
        itemRadius: 0,
        data: [
          {
            min: minValue,
            q1: result?.tech_first,
            median: result?.tech_median,
            q3: result?.tech_third,
            max: maxValue,
          },
        ],
      },
    ],
  };

  const options2 = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "boxAndWhisker",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // chart js two

  // result
  const numbers = result?.tech_numbers || [];
  const sortedNumbers = [...numbers].sort((a, b) => b - a);
  const joinedNumbers = numbers.join(", ");
  const joinedSorted = sortedNumbers.join(", ");
  const max = numbers.length ? Math.max(...numbers) : null;
  const min = numbers.length ? Math.min(...numbers) : null;

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
            <div className="grid grid-cols-12 lg:gap-4 md:gap-4">
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
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value=",">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    {/* <option value="user">{data?.payload?.tech_lang_keys["4"]}</option> */}
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
                  {data?.payload?.tech_lang_keys["5"]}:
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="col">
                        <div className="w-full md:w-[80%] lg:w-[60%] mt-2 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys[7]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {joinedNumbers}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys[8]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {joinedSorted}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys[9]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">{max}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys[10]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">{min}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys[11]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result.tech_third}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys[12]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result.tech_first}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys[13]}:
                                </td>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result.tech_median}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Chart container */}
                        <div className="w-full overflow-auto">
                          <div className="w-full mt-3" id="chartContainer">
                            <Chart
                              type="boxplot"
                              data={datachart2}
                              options={options2}
                            />
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

export default BoxPlotCalculator;

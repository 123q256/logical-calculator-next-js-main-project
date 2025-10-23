"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

import {
  useGetSingleCalculatorDetailsMutation,
  usePieChartCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PieChartCalculator = () => {
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
    tech_choices: [23, 45, 16, 26, 36, 27, 35, 64, 16],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePieChartCalculatorMutation();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  //       setResult(null);
  //   setFormError(null);
  // };

  // Helper function to get alphabet label from index
  const getGroupLabel = (index) => String.fromCharCode(65 + index); // 65 = 'A'

  const handleChange = (index, event) => {
    const updatedChoices = [...formData.tech_choices];
    updatedChoices[index] = event.target.value;
    setFormData({ ...formData, tech_choices: updatedChoices });

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_choices) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_choices: formData.tech_choices,
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
      tech_choices: [23, 45, 16, 26, 36, 27, 35, 64, 16],
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

  const handleAddInput = () => {
    setFormData({
      ...formData,
      tech_choices: [...formData.tech_choices, ""],
    });
  };

  const handleRemoveInput = (index) => {
    const updatedChoices = [...formData.tech_choices];
    updatedChoices.splice(index, 1);
    setFormData({ ...formData, tech_choices: updatedChoices });
  };

  // result

  // Calculate max rows based on array lengths
  const totalRows = Math.max(
    result?.tech_letters?.length || 0,
    result?.tech_values?.length || 0,
    result?.tech_percentage?.length || 0,
    result?.tech_degree?.length || 0
  );

  // Prepare rows array
  const rows = Array.from({ length: totalRows }).map((_, i) => ({
    letter: result?.tech_letters?.[i] || "",
    value: result?.tech_values?.[i] || "",
    percentage:
      result?.tech_percentage?.[i] !== undefined
        ? result.tech_percentage[i] + " %"
        : "",
    degree:
      result?.tech_degree?.[i] !== undefined ? result.tech_degree[i] + "°" : "",
  }));

  // chart

  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    if (result?.tech_new_combine) {
      // Convert JSON string to object
      const parsed = JSON.parse(result?.tech_new_combine);

      setLabels(parsed.map((item) => item.label));
      setValues(parsed.map((item) => item.y));
    }
  }, [result]);

  const datachart = {
    labels,
    datasets: [
      {
        label: "Pie Chart",
        data: values,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8AC926",
          "#FF595E",
          "#6A4C93",
        ],
        hoverOffset: 20,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label} - ${context.formattedValue}`;
          },
        },
      },
      legend: {
        position: "bottom",
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto">
            <div className="grid grid-cols-1 mt-3 gap-4">
              <div className="w-full">
                <div className="grid grid-cols-12 gap-4" id="myForm">
                  {formData.tech_choices.map((choice, index) => (
                    <div className="col-span-6 " key={index}>
                      <div className="flex justify-between">
                        <div className="">
                          <label
                            htmlFor={`tech_choices_${index}`}
                            className="label block mb-1"
                          >
                            Group {getGroupLabel(index)} :
                          </label>
                        </div>
                        <div className="">
                          {formData.tech_choices.length > 2 && (
                            <img
                              src="/belete_btn.png"
                              alt="delete"
                              className="  w-4 h-4 cursor-pointer"
                              onClick={() => handleRemoveInput(index)}
                            />
                          )}
                        </div>
                      </div>

                      <input
                        type="number"
                        step="any"
                        name="tech_choices[]"
                        id={`tech_choices_${index}`}
                        className="input my-2 w-full border px-3 py-2 rounded"
                        aria-label="input"
                        placeholder="00"
                        value={choice}
                        onChange={(e) => handleChange(index, e)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full flex justify-end px-2">
                <button
                  type="button"
                  id="addInputButton"
                  className="bg-[#2845F5] text-white border rounded-lg px-4 py-1 cursor-pointer"
                  onClick={handleAddInput}
                >
                  <strong className="text-blue">
                    <span className="text-[18px] text-blue">+</span> &nbsp;Add
                  </strong>
                </button>
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
              <div className="w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
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
                    <div className="w-full mt-2">
                      <div className="w-full overflow-auto mt-3">
                        <table
                          className="w-full"
                          style={{ borderCollapse: "collapse" }}
                        >
                          <thead>
                            <tr className="bg-[#2845F5] text-white">
                              <th className="p-2 bordered text-center text-blue font-bold">
                                {data?.payload?.tech_lang_keys?.[5]}
                              </th>
                              <th className="p-2 bordered text-center text-blue font-bold">
                                {data?.payload?.tech_lang_keys?.[6]}
                              </th>
                              <th className="p-2 bordered text-center text-blue font-bold">
                                {data?.payload?.tech_lang_keys?.[7]}
                              </th>
                              <th className="p-2 bordered text-center text-blue font-bold">
                                {data?.payload?.tech_lang_keys?.[8]}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, index) => (
                              <tr className="bg-white" key={index}>
                                <td className="p-2 bordered text-center">
                                  {row.letter}
                                </td>
                                <td className="p-2 bordered text-center">
                                  {row.value}
                                </td>
                                <td className="p-2 bordered text-center">
                                  {row.percentage}
                                </td>
                                <td className="p-2 bordered text-center">
                                  {row.degree}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full mt-3 mb-5">
                        <div className="max-w-xl mx-auto">
                          <h2 className="text-center text-2xl font-bold mb-4">
                            Pie Chart
                          </h2>
                          <Pie data={datachart} options={options} />
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

export default PieChartCalculator;

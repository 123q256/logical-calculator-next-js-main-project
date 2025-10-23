"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useOvulationCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const OvulationCalculator = ({ initialDate, events = [], eventsInfo = [] }) => {
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
    tech_date: "2025-04-28",
    tech_days: "28",
    tech_Luteal: "23",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useOvulationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_date || !formData.tech_days) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_date: formData.tech_date,
        tech_days: formData.tech_days,
        tech_Luteal: formData.tech_Luteal,
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
      tech_date: "2025-04-28",
      tech_days: "28",
      tech_Luteal: "23",
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

  useEffect(() => {
    if (result) {
      const events = [];
      for (let i = 3; i <= 32; i++) {
        const key = `tech_event${i}`;
        if (result[key]) events.push(result[key]);
      }

      const eventsInfo = [
        "Fertile Period",
        "Fertile Period",
        "Ovulation Date",
        "Fertile Period",
        "Fertile Period",
        "Fertile Period",
        "Fertile Period",
        "Ovulation Date",
        "Fertile Period",
        "Fertile Period",
        "Fertile Period",
        "Fertile Period",
        "Ovulation Date",
        "Fertile Period",
        "Fertile Period",
        "Fertile Period",
        "Fertile Period",
        "Ovulation Date",
        "Fertile Period",
        "Fertile Period",
        "Fertile Period",
        "Fertile Period",
        "Ovulation Date",
        "Fertile Period",
        "Fertile Period",
        "Fertile Period",
        "Fertile Period",
        "Ovulation Date",
        "Fertile Period",
        "Fertile Period",
      ];

      const initCalendar = () => {
        if (window.$ && window.$(".calendar").simpleCalendar) {
          window.$(".calendar").simpleCalendar({
            events,
            eventsInfo,
            arrowLeft: "/images/tarrow-left.png",
            arrowRight: "/images/tarrow-right.png",
          });
        }
      };

      setTimeout(() => {
        initCalendar();
      }, 300);
    } else {
      const today = new Date().toISOString().split("T")[0];
      const dateInput = document.getElementById("date");
      if (dateInput) dateInput.value = today;
    }
  }, [result]);

  // const [currentDate, setCurrentDate] = useState(new Date(initialDate));
  //   const [calendarDays, setCalendarDays] = useState([]);

  //   useEffect(() => {
  //     generateCalendar(currentDate);
  //   }, [currentDate]);

  //   const formatDate = (date) => {
  //     return date.toISOString().split("T")[0];
  //   };

  //   const generateCalendar = (date) => {
  //     const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  //     const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  //     const startDay = new Date(startOfMonth);
  //     while (startDay.getDay() !== 1) {
  //       startDay.setDate(startDay.getDate() - 1);
  //     }

  //     const endDay = new Date(endOfMonth);
  //     while (endDay.getDay() !== 0) {
  //       endDay.setDate(endDay.getDate() + 1);
  //     }

  //     const daysArr = [];
  //     const dateIterator = new Date(startDay);
  //     while (dateIterator <= endDay) {
  //       const formatted = formatDate(dateIterator);
  //       const eventIndex = events.indexOf(formatted);
  //       const event = eventIndex !== -1 ? eventsInfo[eventIndex] : null;

  //       daysArr.push({
  //         date: new Date(dateIterator),
  //         isCurrentMonth: dateIterator.getMonth() === date.getMonth(),
  //         isToday: formatDate(dateIterator) === formatDate(new Date()),
  //         event,
  //       });

  //       dateIterator.setDate(dateIterator.getDate() + 1);
  //     }

  //     setCalendarDays(daysArr);
  //   };

  // const goToNextMonth = () => {
  //   const next = new Date(currentDate);
  //   next.setMonth(next.getMonth() + 1);
  //   setCurrentDate(next);
  // };

  // const goToPreviousMonth = () => {
  //   const prev = new Date(currentDate);
  //   prev.setMonth(prev.getMonth() - 1);
  //   setCurrentDate(prev);
  // };

  // chart js

  const chartData = {
    labels: [
      data?.payload?.tech_lang_keys["fertile"],
      data?.payload?.tech_lang_keys["next_period"],
      data?.payload?.tech_lang_keys["inter_w"],
      data?.payload?.tech_lang_keys["save"],
      data?.payload?.tech_lang_keys["due_date"],
      data?.payload?.tech_lang_keys["p_t"],
    ],
    datasets: [
      {
        label: "Days",
        data: [
          result?.tech_First_day ? 1 : 0,
          result?.tech_Next_period ? 1 : 0,
          result?.tech_First_day + "" + result?.tech_Last_day ? 1 : 0,
          result?.tech_save ? 1 : 0,
          result?.tech_Due_date ? 1 : 0,
          result?.tech_test ? 1 : 0,
        ],
        backgroundColor: [
          "#4F46E5", // Indigo
          "#10B981", // Emerald
          "#F59E0B", // Amber
          "#3B82F6", // Blue
          "#EC4899", // Pink
          "#8B5CF6", // Violet
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
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
          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_date" className="label">
                  {data?.payload?.tech_lang_keys["first_date"]}:
                </label>
                <div className=" relative">
                  <input
                    type="date"
                    step="any"
                    name="tech_date"
                    id="tech_date"
                    className="input my-2"
                    aria-label="input"
                    placeholder="MMM DD, YYYY"
                    value={formData.tech_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_days" className="label">
                  {data?.payload?.tech_lang_keys["number_days"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_days"
                    id="tech_days"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_days}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_Luteal" className="label">
                  {data?.payload?.tech_lang_keys["l_p"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_Luteal"
                    id="tech_Luteal"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_Luteal}
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

                  <div className="rounded-lg p-1  flex items-center justify-center">
                    <div className="w-full  rounded-lg mt-3">
                      <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                        <div className="col-span-12">
                          <div className="bg-[#6fab4d12] text-center bordered rounded-lg px-3 py-4">
                            <div className="w-full mx-auto">
                              <p>
                                <strong>Your Ovulation Day is</strong>
                              </p>
                              <p className="text-2xl mt-3">
                                <strong className="text-green-500">
                                  {result?.tech_Ovu_date}
                                </strong>
                              </p>
                              <div className="bg-white text-sm rounded-lg p-3 mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["last_date"]}{" "}
                                  <span className="text-gray-500 ml-2">
                                    {formData?.tech_date}
                                  </span>
                                </strong>
                              </div>
                              <div className="bg-white text-sm rounded-lg p-3 mt-3 mb-10">
                                <strong>
                                  {data?.payload?.tech_lang_keys["c_l"]}{" "}
                                  <span className="text-gray-500 ml-2">
                                    {formData?.tech_days}{" "}
                                    {data?.payload?.tech_lang_keys["days"]}
                                  </span>
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Ovulation Calendar  */}
                        {/* <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                      <div className="bg-[#6fab4d12] text-center border rounded-lg p-2">
                                        <p><strong className="text-blue-500">Ovulation Calendar</strong></p>
                                        <div className="calendar"></div>
                                      </div>
                                    </div> */}

                        {/* Fertile Period & Next Period  */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <div className="bg-[#6fab4d12] text-center border rounded-lg p-2">
                            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-white text-sm rounded-lg p-2">
                                  <img
                                    src="/images/fertile.png"
                                    alt="Fertile Period"
                                    className="w-[30px] h-15 mt-3 object-cover mx-auto"
                                  />
                                  <p className="text-blue-500 mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["fertile"]}
                                    </strong>
                                  </p>
                                  <p>
                                    {result?.tech_First_day} to{" "}
                                    {result?.tech_Last_day}
                                  </p>
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-white text-sm rounded-lg p-2">
                                  <img
                                    src="/images/next_period.png"
                                    alt="Next Period"
                                    className="w-[30px]  mx-auto"
                                  />
                                  <p className="text-blue-500">
                                    <strong>
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "next_period"
                                        ]
                                      }
                                    </strong>
                                  </p>
                                  <p>{result?.tech_Next_period}</p>
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-white text-sm rounded-lg p-2">
                                  <img
                                    src="/images/window.png"
                                    alt="Intercourse Window for Pregnancy"
                                    className="w-[30px]  mx-auto"
                                  />
                                  <p className="text-blue-500 mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["inter_w"]}
                                    </strong>
                                  </p>
                                  <p>
                                    {result?.tech_First_day}{" "}
                                    {result?.tech_Last_day}
                                  </p>
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-white text-sm rounded-lg p-2">
                                  <img
                                    src="/images/safe.png"
                                    alt="Safe Period"
                                    className="w-[30px]  mx-auto"
                                  />
                                  <p className="text-blue-500">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["save"]}
                                    </strong>
                                  </p>
                                  <p>{result?.tech_save}</p>
                                  <p>{result?.tech_saven}</p>
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-white text-sm rounded-lg p-2">
                                  <img
                                    src="/images/expected_date.png"
                                    alt="Due Date"
                                    className="w-[30px]  mx-auto"
                                  />
                                  <p className="text-blue-500">
                                    <strong>
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "due_date"
                                        ]
                                      }
                                    </strong>
                                  </p>
                                  <p>{result?.tech_Due_date}</p>
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <div className="bg-white text-sm rounded-lg p-2">
                                  <img
                                    src="/images/test.png"
                                    alt="Pregnancy Test"
                                    className="w-[30px]  mx-auto"
                                  />
                                  <p className="text-blue-500 mt-4">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["p_t"]}
                                    </strong>
                                  </p>
                                  <p>{result?.tech_test}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 6 Cycle Table */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <div className="bg-[#6fab4d12] border rounded-lg p-2 pt-3">
                            <p className="text-center">
                              <strong className="text-blue-500">
                                {data?.payload?.tech_lang_keys["6cycle"]}
                              </strong>
                            </p>
                            <div className="w-full overflow-auto cycle6_table">
                              <table
                                className="w-full mt-2 border"
                                cellspacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b border-gray-400 text-xs">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["p_s"]}
                                      </strong>
                                    </td>
                                    <td className="border-b border-l border-gray-400 text-xs">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["o_w"]}
                                      </strong>
                                    </td>
                                    <td className="border-b border-l border-gray-400 text-xs">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["d_d"]}
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                                <tbody
                                  className="space-y-7 border"
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_table,
                                  }}
                                />
                              </table>
                            </div>
                          </div>
                        </div>
                        {/* Chart (right) */}
                        <div className="col-span-12 ">
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Note:</strong> In the chart below,{" "}
                            <span className="text-green-600 font-semibold">
                              1
                            </span>{" "}
                            means data is available, and{" "}
                            <span className="text-red-600 font-semibold">
                              0
                            </span>{" "}
                            means data is missing or not calculated.
                          </p>

                          <div className="bg-white p-4 rounded-lg">
                            <h3 className="text-blue-500 font-semibold mb-2">
                              Overview Chart
                            </h3>
                            <Bar data={chartData} options={chartOptions} />
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

export default OvulationCalculator;

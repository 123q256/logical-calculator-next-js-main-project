"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register necessary Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

import {
  useGetSingleCalculatorDetailsMutation,
  usePropertyDepreciationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PropertyDepreciationCalculator = () => {
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

  const [formData, setFormData] = useState({
    tech_hiddent_currency: currency.symbol,
    tech_basis: "21000",
    tech_recovery: "5",
    tech_round: "4",
    tech_date1: "2025-08-25",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePropertyDepreciationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_basis ||
      !formData.tech_recovery ||
      !formData.tech_round ||
      !formData.tech_date1
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_hiddent_currency: formData.tech_hiddent_currency,
        tech_basis: formData.tech_basis,
        tech_recovery: formData.tech_recovery,
        tech_round: formData.tech_round,
        tech_date1: formData.tech_date1,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_hiddent_currency: currency.symbol,
      tech_basis: "21000",
      tech_recovery: "5",
      tech_round: "4",
      tech_date1: "2025-08-25",
    });
    setResult(null);
    setFormError(null);
  };

  // chart

  const detail = {
    total_years: result?.tech_total_years
      ?.split(",")
      .filter(Boolean)
      .map(Number),
    total_ev: result?.tech_total_book_value
      ?.split(",")
      .filter(Boolean)
      .map(Number),
  };

  const lang = {
    rv: data?.payload?.tech_lang_keys["r_v"],
    year: data?.payload?.tech_lang_keys["Year"],
    b_v: data?.payload?.tech_lang_keys["eb_v"],
  };

  const currencys = currency.symbol;

  const labels = Array.isArray(detail?.total_years) ? detail.total_years : [];
  const dataValues = Array.isArray(detail?.total_ev) ? detail.total_ev : [];

  const chatdata = {
    labels,
    datasets: [
      {
        label: lang?.b_v || "Value",
        data: dataValues,
        borderColor: "#3e95cd",
        backgroundColor: "rgba(62, 149, 205, 0.2)",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1000,
    },
    plugins: {
      title: {
        display: false,
        text: "",
      },
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
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
          text: lang?.year || "Year",
        },
      },
      y: {
        title: {
          display: true,
          text: `${lang?.rv || "Y Axis"} (${currencys || ""})`,
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
          <div className="col-12  mx-auto mt-2 w-full lg:w-[80%] md:w-[80%]">
            <input
              type="hidden"
              name="tech_hiddent_currency"
              id="tech_hiddent_currency"
              className="input my-2"
              aria-label="input"
              value={currency.symbol}
            />
            <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
              <div className="lg:w-1/3 w-full px-2 py-1">
                <div
                  className="bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300  hover_tags hover:text-white  imperial"
                  id="imperial"
                >
                  <a
                    href="/calculator/depreciation-calculator"
                    className="text-decoration-none col-4 py-2  cursor-pointer radius-5 test11"
                  >
                    {" "}
                    {data?.payload?.tech_lang_keys["simple"]}
                  </a>
                </div>
              </div>
              <div className="lg:w-1/3 w-full px-2 py-1">
                <div
                  className="bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300   hover_tags hover:text-white metric"
                  id="metric"
                >
                  <a
                    href="/calculator/car-depreciation-calculator"
                    className="text-decoration-none col-4 py-2  cursor-pointer radius-5 test12"
                  >
                    {" "}
                    {data?.payload?.tech_lang_keys["Auto"]}
                  </a>
                </div>
              </div>
              <div className="lg:w-1/3 w-full px-2 py-1">
                <div
                  className="bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300  hover_tags hover:text-white metric tagsUnit"
                  id="metric"
                >
                  <a
                    href="/calculator/property-depreciation-calculator"
                    className="text-decoration-none col-4 py-2 cursor-pointer radius-5 test13"
                  >
                    {" "}
                    {data?.payload?.tech_lang_keys["Property"]}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_basis" className="label">
                  {data?.payload?.tech_lang_keys["b_c"]}:
                </label>
                <div className="mt-1 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_basis"
                    id="tech_basis"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_basis}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_recovery" className="label">
                  {data?.payload?.tech_lang_keys["r_p_y"]}:
                </label>
                <div className="mt-1 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_recovery"
                    id="tech_recovery"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_recovery}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_round" className="label">
                  {data?.payload?.tech_lang_keys["r_d"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_round"
                    id="tech_round"
                    value={formData.tech_round}
                    onChange={handleChange}
                  >
                    <option value="yes">
                      {data?.payload?.tech_lang_keys["Yes"]}
                    </option>
                    <option value="No">
                      {data?.payload?.tech_lang_keys["No"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_date1" className="label">
                  {data?.payload?.tech_lang_keys["start_d"]}:
                </label>
                <div className="mt-1 relative">
                  <input
                    type="date"
                    step="any"
                    name="tech_date1"
                    id="tech_date1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_date1}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-3 mb-6 mt-10">
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full mt-2 overflow-auto">
                        <table className="w-full text-[14px]">
                          <thead>
                            <tr>
                              <td className="py-2 border-b text-[14px]">
                                <b>{data?.payload?.tech_lang_keys["Year"]}</b>
                              </td>
                              <td className="py-2 border-b text-[14px]">
                                <b>{data?.payload?.tech_lang_keys["bb_v"]}</b>
                              </td>
                              <td className="py-2 border-b text-[14px]">
                                <b>{data?.payload?.tech_lang_keys["depp"]}</b>
                              </td>
                              <td className="py-2 border-b text-[14px]">
                                <b>{data?.payload?.tech_lang_keys["d_a"]}</b>
                              </td>
                              <td className="py-2 border-b text-[14px]">
                                <b>{data?.payload?.tech_lang_keys["a_d_a"]}</b>
                              </td>
                              <td className="py-2 border-b text-[14px]">
                                <b>{data?.payload?.tech_lang_keys["eb_v"]}</b>
                              </td>
                            </tr>
                          </thead>

                          <tbody
                            dangerouslySetInnerHTML={{
                              __html: result.tech_table,
                            }}
                          />
                        </table>
                      </div>
                      <div className="w-full">
                        <Line data={chatdata} options={options} />
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

export default PropertyDepreciationCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useEnterpriseValueCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EnterpriseValueCalculator = () => {
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
    tech_cs: Number("10"),
    tech_ps: Number("15"),
    tech_mvd: Number("25"),
    tech_mi: Number("30"),
    tech_ce: Number("35"),
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEnterpriseValueCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_cs ||
      !formData.tech_ps ||
      !formData.tech_mvd ||
      !formData.tech_mi ||
      !formData.tech_ce
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cs: Number(formData.tech_cs),
        tech_ps: Number(formData.tech_ps),
        tech_mvd: Number(formData.tech_mvd),
        tech_mi: Number(formData.tech_mi),
        tech_ce: Number(formData.tech_ce),
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
      tech_cs: Number("10"),
      tech_ps: Number("15"),
      tech_mvd: Number("25"),
      tech_mi: Number("30"),
      tech_ce: Number("35"),
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

  const dataChart = {
    labels: ["MC", "PS", "MVD", "MI", "CCE"],
    datasets: [
      {
        label: "Enterprise Value",
        data: [
          formData?.tech_cs,
          formData?.tech_ps,
          formData?.tech_mvd,
          formData?.tech_mi,
          formData?.tech_ce,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Enterprise Value",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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
            <div className="grid grid-cols-12 mt-3 gap-2  md:gap-4">
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_cs" className="label">
                  {data?.payload?.tech_lang_keys["cs"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_cs"
                    id="tech_cs"
                    className="input my-2"
                    aria-label="input"
                    placeholder="10"
                    value={formData.tech_cs}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>

              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_ps" className="label">
                  {data?.payload?.tech_lang_keys["ps"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_ps"
                    id="tech_ps"
                    className="input my-2"
                    aria-label="input"
                    placeholder="10"
                    value={formData.tech_ps}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>

              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_mvd" className="label">
                  {data?.payload?.tech_lang_keys["mvd"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_mvd"
                    id="tech_mvd"
                    className="input my-2"
                    aria-label="input"
                    placeholder="20"
                    value={formData.tech_mvd}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>

              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_mi" className="label">
                  {data?.payload?.tech_lang_keys["mi"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_mi"
                    id="tech_mi"
                    className="input my-2"
                    aria-label="input"
                    placeholder="30"
                    value={formData.tech_mi}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>

              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_ce" className="label">
                  {data?.payload?.tech_lang_keys["ce"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_ce"
                    id="tech_ce"
                    className="input my-2"
                    aria-label="input"
                    placeholder="35"
                    value={formData.tech_ce}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[25px] text-center my-3">
                        <p>{data?.payload?.tech_lang_keys["ev"]}</p>

                        <p className="my-3">
                          <strong className="bg-sky bordered px-3 py-2 lg:text-[32px] md:text-[32px] text-[22px] rounded-[10px] text-[#2845F5]">
                            {result?.tech_ev ? (
                              <>
                                {currency.symbol} {result?.tech_ev}
                              </>
                            ) : (
                              <span>{currency.symbol} 0.0</span>
                            )}
                          </strong>
                        </p>
                      </div>
                      <div className="w-full md:w-[60%] lg:w-[60%] mx-auto">
                        <div>
                          <Bar data={dataChart} options={options} />
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

export default EnterpriseValueCalculator;

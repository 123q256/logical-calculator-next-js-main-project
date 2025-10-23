"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

import {
  useGetSingleCalculatorDetailsMutation,
  useRelativeFrequencyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RelativeFrequencyCalculator = () => {
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
    tech_data: "4,5,6,7,8,9,1,2,3,4,5,6",
    tech_freq: "grp", // ind  grp
    tech_k: 2,
    tech_st_val: 1,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRelativeFrequencyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_data ||
      !formData.tech_freq ||
      !formData.tech_k ||
      !formData.tech_st_val
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_data: formData.tech_data,
        tech_freq: formData.tech_freq,
        tech_k: formData.tech_k,
        tech_st_val: formData.tech_st_val,
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
      tech_data: "4,5,6,7,8,9,1,2,3,4,5,6",
      tech_freq: "grp", // ind  grp
      tech_k: 2,
      tech_st_val: 1,
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

  const {
    tech_set: set,
    tech_ds: ds,
    tech_sds: sds,
    tech_n: n,
    tech_count: count,
    tech_table: table,
    tech_mean: mean,
    tech_median: median,
    tech_mode: mode,
    tech_min: min,
    tech_max: max,
    tech_range: range,
    tech_sum: sum,
    tech_ss: ss,
    tech_asum: asum,
    tech_s_d: s_d,
    tech_s_d1: s_d1,
    tech_c_v: c_v,
    tech_snr: snr,
    tech_variance: variance,
    tech_gm: gm,
    tech_hm: hm,
    tech_ad: ad,
    tech_mad: mad,
    tech_q1: q1,
    tech_q2: q2,
    tech_q3: q3,
    tech_iqr: iqr,
    tech_qd: qd,
    tech_cqd: cqd,
    tech_uf: uf,
    tech_lf: lf,
    tech_z: z,
  } = result || {};

  // Prepare mode string with commas between, similar to PHP's foreach + end check
  const modeString = mode?.join(" , ") || "";
  let datachart = null;
  let options = null;

  if (result) {
    // Prepare categories based on freq
    const categories =
      formData?.tech_freq === "ind"
        ? Object.keys(count) // from count keys
        : result?.tech_group.map((g) => g); // group values as strings

    // Prepare first dataset data
    const dataSet1 =
      formData?.tech_freq === "ind"
        ? Object.values(result?.tech_rf_values)
        : result?.tech_rf1_values;

    // Prepare second dataset data
    const dataSet2 =
      formData?.tech_freq === "ind"
        ? Object.keys(count) // seems repeated keys as data (original PHP logic)
        : result?.tech_group;

    // Now assign datachart and options inside the block
    datachart = {
      labels: categories,
      datasets: [
        {
          label: data?.payload?.tech_lang_keys[2],
          data: dataSet1,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderWidth: 1,
        },
        {
          label: data?.payload?.tech_lang_keys[38],
          data: dataSet2,
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderWidth: 1,
        },
      ],
    };

    options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: data?.payload?.tech_lang_keys[40],
          align: "start",
        },
        subtitle: {
          display: true,
          text: "Source: indexmundi (https://www.indexmundi.com/agriculture/?commodity=corn)",
          align: "start",
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              return context.parsed.y || context.parsed || "";
            },
          },
        },
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Countries",
          },
          ticks: {
            autoSkip: false,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: data?.payload?.tech_lang_keys[2],
          },
        },
      },
    };
  }

  // Now you can safely use datachart and options below

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
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-12  mb-2 text-center flex items-center justify-between">
                <div className="flex items-center">
                  <p className="font-s-14 me-2">
                    {data?.payload?.tech_lang_keys["2"]}:
                  </p>

                  <label className="pe-2" htmlFor="ind">
                    <input
                      type="radio"
                      name="tech_freq"
                      value="ind"
                      id="ind"
                      className="mr-2 border"
                      onChange={handleChange}
                      checked={formData.tech_freq === "ind"}
                    />
                    <span>{data?.payload?.tech_lang_keys["3"]}</span>
                  </label>
                  <label className="pe-2" htmlFor="grp">
                    <input
                      type="radio"
                      name="tech_freq"
                      value="grp"
                      id="grp"
                      className="mr-2 border"
                      onChange={handleChange}
                      checked={formData.tech_freq === "grp"}
                    />
                    <span>{data?.payload?.tech_lang_keys["4"]}</span>
                  </label>
                </div>
              </div>
              {formData.tech_freq === "grp" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12">
                    <label htmlFor="tech_st_val" className="label">
                      Starting Value:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_st_val"
                        id="tech_st_val"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_st_val}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12">
                    <label htmlFor="tech_k" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_k"
                        id="tech_k"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_k}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-12 ">
                <label htmlFor="tech_data" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_data"
                    id="tech_data"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 4, 14, 16, 22, 24, 25, 37, 38, 38, 40, 42, 42, 45, 44"
                    value={
                      formData.tech_data ||
                      " 4, 14, 16, 22, 24, 25, 37, 38, 38, 40, 42, 42, 45, 44"
                    }
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div>
                          <div className="text-center">
                            <p className="text-[20px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["6"]}
                              </strong>
                            </p>
                          </div>

                          <div
                            className="w-full mt-2 overflow-auto"
                            dangerouslySetInnerHTML={{ __html: table }}
                          ></div>

                          <p className="w-full mt-3 text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["37"]}
                            </strong>
                          </p>

                          <div
                            id="container"
                            style={{ height: 350 }}
                            className="w-full mt-3"
                          >
                            <Bar data={datachart} options={options} />
                          </div>

                          <p className="w-full mt-3 text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["7"]}
                            </strong>
                          </p>

                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["8"]} = {ds}
                          </p>

                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["9"]} = {sds}
                          </p>

                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["10"]} (
                            {data?.payload?.tech_lang_keys["11"]}): μ = {mean}
                          </p>

                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["12"]} = {median}
                          </p>

                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["13"]} = {modeString}{" "}
                            - multimodal
                          </p>
                        </div>

                        <div className="bg-sky bordered p-3 mt-2 rounded-lg">
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["14"]} = {min}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["15"]} = {max}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["16"]} = {range}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["17"]} = {n}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["21"]} ={" "}
                            {Number(variance).toFixed(2)}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["23"]} (s) ={" "}
                            {Number(s_d1).toFixed(2)}
                          </p>

                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["18"]} = {sum}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["19"]} = {ss}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["20"]} = {asum}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["22"]} (σ) = {s_d}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["24"]} (C<sub>v</sub>
                            ) = {c_v}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["25"]} (SNR) = {snr}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["26"]} = {gm}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["27"]} = {hm}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["28"]} = {ad}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["29"]} = {mad}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["30"]} Q1 = {q1}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["30"]} Q2 = {q2}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["30"]} Q3 = {q3}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["31"]} (IQR) = {iqr}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["32"]} (QD) = {qd}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["33"]} (CQD) = {cqd}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["34"]} = {uf}
                          </p>
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys["35"]} = {lf}
                          </p>
                          <p className="w-full mt-2">
                            Z {data?.payload?.tech_lang_keys["36"]} = {z}
                          </p>
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

export default RelativeFrequencyCalculator;

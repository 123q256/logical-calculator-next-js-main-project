"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

import {
  useGetSingleCalculatorDetailsMutation,
  useMarginalCostCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MarginalCostCalculator = () => {
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
    tech_unit_type: "sr",
    tech_dc: 50,
    tech_dq: 40,
    tech_dq_unit: "dozens", // decades  dozens   pairs
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMarginalCostCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_unit_type ||
      !formData.tech_dc ||
      !formData.tech_dq ||
      !formData.tech_dq_unit
    ) {
      setFormError("Please fill in field.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_dc: formData.tech_dc,
        tech_dq: formData.tech_dq,
        tech_dq_unit: formData.tech_dq_unit,
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
      tech_unit_type: "sr",
      tech_dc: 50,
      tech_dq: 40,
      tech_dq_unit: "dozens", // decades  dozens   pairs
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

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dq_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // chart
  const detail = {
    good: result?.tech_dc,
    neutral: result?.tech_mc,
  };

  const chartData = {
    labels: ["Total Cost", "Marginal Cost"],
    datasets: [
      {
        data: [detail.good, detail.neutral],
        backgroundColor: ["#f39c12", "#1abc9c"], // Orange and Cyan
        borderColor: ["#f39c12", "#1abc9c"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Marginal Cost Chart",
        font: {
          size: 18,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
          boxWidth: 20,
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              {/* <div className="col-span-12 hidden">
                          <div className="row align-items-center bg-white text-center border radius-10 p-1">
                              <div className="col-6 py-2 units_active cursor-pointer radius-5 imperial tb1" id="tb1">
                                  { data?.payload?.tech_lang_keys['1'] }
                              </div>
                              <div className="col-6 py-2 cursor-pointer radius-5 metric tb2" id="tb2">
                                  { data?.payload?.tech_lang_keys['2'] }
                              </div>
                              <input type="hidden" name="unit_type" id="unit_type" value="sr" />
                          </div>
                      </div> */}
              <div className="col-span-12" id="sr">
                <div className="grid grid-cols-12 mt-3  gap-4">
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_dc" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_dc"
                        id="tech_dc"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_dc}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_dq" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_dq"
                        step="any"
                        className="mt-2 input"
                        value={formData.tech_dq}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-5"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_dq_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            {
                              label: data?.payload?.tech_lang_keys[5],
                              value: "units",
                            },
                            {
                              label: data?.payload?.tech_lang_keys[6],
                              value: "pairs",
                            },
                            {
                              label: data?.payload?.tech_lang_keys[7],
                              value: "decades",
                            },
                            {
                              label: data?.payload?.tech_lang_keys[8],
                              value: "dozens",
                            },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="col-span-12 hidden" id="gr">
                      <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label for="cc" className="font-s-14 text-blue">{ data?.payload?.tech_lang_keys['9'] }:</label>
                          <div className="w-full py-2 relative">
                              <input type="number" step="any" name="cc" id="cc" className="input"
                                  aria-label="input" placeholder="50"
                                  value="{ isset($_POST['cc']) ? $_POST['cc'] : '50' }" />
                              <span className="text-blue input_unit">{ $currancy }</span>
                          </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label for="fc" className="font-s-14 text-blue">{ data?.payload?.tech_lang_keys['10'] }:</label>
                          <div className="w-full py-2 relative">
                              <input type="number" step="any" name="fc" id="fc" className="input"
                                  aria-label="input" placeholder="50"
                                  value="{ isset($_POST['fc']) ? $_POST['fc'] : '50' }" />
                              <span className="text-blue input_unit">{ $currancy }</span>
                          </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label for="cq" className="font-s-14 text-blue">{ data?.payload?.tech_lang_keys['11'] }:</label>
                          <div className="w-full py-2 relative">
                              <input type="number" step="any" name="cq" id="cq"
                                  value="{ isset($_POST['cq']) ? $_POST['cq'] : '30' }" className="input" aria-label="input"
                                  placeholder="50" />
                              <label for="cq_unit"
                                  className="text-blue input_unit text-decoration-underline">{ isset($_POST['cq_unit']) ? $_POST['cq_unit'] : 'units' }
                                  ▾</label>
                              <input type="text" name="cq_unit"
                                  value="{ isset($_POST['cq_unit']) ? $_POST['cq_unit'] : 'units' }" id="cq_unit"
                                  className="hidden" />
                              <div className="units cq_unit hidden" to="cq_unit">
                                  <p value="units">{ data?.payload?.tech_lang_keys[5] }</p>
                                  <p value="pairs">{ data?.payload?.tech_lang_keys[6] }</p>
                                  <p value="decades">{ data?.payload?.tech_lang_keys[7] }</p>
                                  <p value="dozens">{ data?.payload?.tech_lang_keys[8] }</p>
                              </div>
                          </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label for="fq" className="font-s-14 text-blue">{ data?.payload?.tech_lang_keys['12'] }:</label>
                          <div className="w-full py-2 relative">
                              <input type="number" step="any" name="fq" id="fq"
                                  value="{ isset($_POST['fq']) ? $_POST['fq'] : '20' }" className="input"
                                  aria-label="input" placeholder="50" />
                              <label for="fq_unit"
                                  className="text-blue input_unit text-decoration-underline">{ isset($_POST['fq_unit']) ? $_POST['fq_unit'] : 'units' }
                                  ▾</label>
                              <input type="text" name="fq_unit"
                                  value="{ isset($_POST['fq_unit']) ? $_POST['fq_unit'] : 'units' }" id="fq_unit"
                                  className="hidden" />
                              <div className="units fq_unit hidden" to="fq_unit">
                                  <p value="units">{ data?.payload?.tech_lang_keys[5] }</p>
                                  <p value="pairs">{ data?.payload?.tech_lang_keys[6] }</p>
                                  <p value="decades">{ data?.payload?.tech_lang_keys[7] }</p>
                                  <p value="dozens">{ data?.payload?.tech_lang_keys[8] }</p>
                              </div>
                          </div>
                      </div>
                      </div>
                  </div> */}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                        <table className="w-full text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[13]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_mc).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-[16px]">
                        <p className="mt-3">
                          <strong>
                            {data?.payload?.tech_lang_keys["14"]}:
                          </strong>
                        </p>
                        <p className="mt-2">
                          <strong>{data?.payload?.tech_lang_keys["15"]}</strong>
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["13"]} ={" "}
                          {data?.payload?.tech_lang_keys["3"]} /{" "}
                          {data?.payload?.tech_lang_keys["4"]}
                        </p>
                        <p className="mt-2">MC = ΔTC / ΔQ</p>
                        {result?.tech_check == "m2" && (
                          <>
                            <p className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["16"]} ΔTC
                              </strong>
                            </p>
                            <p className="mt-2">
                              ΔTC = {data?.payload?.tech_lang_keys["10"]} -{" "}
                              {data?.payload?.tech_lang_keys["9"]}
                            </p>
                            <p className="mt-2">
                              ΔTC = {result?.tech_fc} - {result?.tech_cc}
                            </p>
                            <p className="mt-2">
                              ΔTC = {Number(result?.tech_dc).toFixed(2)}
                            </p>
                            <p className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["16"]} ΔQ
                              </strong>
                            </p>
                            <p className="mt-2">
                              ΔTC = {data?.payload?.tech_lang_keys["12"]} -{" "}
                              {data?.payload?.tech_lang_keys["11"]}
                            </p>
                            <p className="mt-2">
                              ΔTC = {result?.tech_fq} - {result?.tech_cq}
                            </p>
                            <p className="mt-2">ΔTC = {result?.tech_dq} </p>
                          </>
                        )}

                        <p className="mt-2">
                          <strong>{data?.payload?.tech_lang_keys["17"]}</strong>
                        </p>
                        <p className="mt-2">MC = ΔTC / ΔQ</p>
                        <p className="mt-2">
                          MC = {Number(result?.tech_dc).toFixed(2)} /{" "}
                          {result?.tech_dq}
                        </p>
                        <p className="mt-2">
                          MC = {Number(result?.tech_mc).toFixed(2)}
                        </p>
                        <div className="mt-4 ">
                          <strong>
                            {data?.payload?.tech_lang_keys["13"]}{" "}
                            {data?.payload?.tech_lang_keys["18"]}
                          </strong>
                        </div>
                        <div className="w-full lg:w-1/2 mt-4 flex justify-center items-center">
                          <div className="w-[300px] h-[300px]">
                            <Doughnut data={chartData} options={options} />
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

export default MarginalCostCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register necessary components including ArcElement for Pie chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useRatioCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RatioCalculator = () => {
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
    tech_method: "0", // 0 1  3 4 5
    tech_method1: "0",
    tech_ratio_of: "r2",
    tech_a: 1,
    tech_b: 2,
    tech_c1: 1,
    tech_c: "3",
    tech_d: "",
    tech_e: "",
    tech_f: "",
    tech_i: 2,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRatioCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method: formData.tech_method,
        tech_method1: formData.tech_method1,
        tech_ratio_of: formData.tech_ratio_of,
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_c1: formData.tech_c1,
        tech_c: formData.tech_c,
        tech_d: formData.tech_d,
        tech_e: formData.tech_e,
        tech_f: formData.tech_f,
        tech_i: formData.tech_i,
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
      tech_method: "0", // 0 1  3 4 5
      tech_method1: "0",
      tech_ratio_of: "r2",
      tech_a: 1,
      tech_b: 2,
      tech_c1: 1,
      tech_c: "3",
      tech_d: "",
      tech_e: "",
      tech_f: "",
      tech_i: 2,
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
  const a = formData?.tech_a;
  const b = formData?.tech_b;
  const c = formData?.tech_c;
  const c1 = formData?.tech_c1;
  const d = formData?.tech_d;
  const f = formData?.tech_f;
  const e = formData?.tech_e;

  const r2 = result?.tech_r2 || "";
  const r3 = result?.tech_r3 || "";

  const a_val = result?.tech_a_val || "";
  const a_val1 = result?.tech_a_val1 || "";
  const a_val2 = result?.tech_a_val2 || "";
  const a_val3 = result?.tech_a_val3 || "";
  const a_val4 = result?.tech_a_val4 || "";
  const a_val5 = result?.tech_a_val5 || "";
  const a_val6 = result?.tech_a_val6 || "";

  const b_val = result?.tech_b_val || "";
  const b_val1 = result?.tech_b_val1 || "";
  const b_val2 = result?.tech_b_val2 || "";
  const b_val3 = result?.tech_b_val3 || "";
  const b_val4 = result?.tech_b_val4 || "";
  const b_val5 = result?.tech_b_val5 || "";
  const b_val6 = result?.tech_b_val6 || "";

  const c_val = result?.tech_c_val || "";
  const c_val1 = result?.tech_c_val1 || "";
  const c_val2 = result?.tech_c_val2 || "";
  const c_val3 = result?.tech_c_val3 || "";
  const c_val4 = result?.tech_c_val4 || "";
  const c_val5 = result?.tech_c_val5 || "";
  const c_val6 = result?.tech_c_val6 || "";

  const d_val = result?.tech_d_val || "";
  const e_val = result?.tech_e_val || "";
  const f_val = result?.tech_f_val || "";

  // Helper to check if value is a number (float or int)
  const isNumber = (val) => typeof val == "number";
  function round(value, decimals = 0) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  }

  // Get values from result (instead of detail)
  // const r2 = result?.r2 || '';
  // const r3 = result?.r3 || '';
  // const a_val = result?.a_val || '';
  // const b_val = result?.b_val || '';

  // Calculate w2 and w1
  let w2, w1;
  if (result?.tech_a_val != undefined && result?.tech_a_val != "") {
    w2 = a_val;
    w1 = a_val + b;
  } else if (result?.tech_b_val != undefined && result?.tech_b_val != "") {
    w2 = a;
    w1 = a + b_val;
  } else {
    w2 = a;
    w1 = a + b;
  }

  // Calculate w (percentage)
  let w;
  if (w1 > w2) {
    w = (w2 / w1) * 100;
  } else {
    w = (w2 / w1) * 100; // I put *100 here to keep consistent percentage
  }

  // Calculate h (height)
  let h = 0;
  if (result?.tech_a_val != undefined && result?.tech_a_val != "") {
    if (a_val > b) {
      h = (b / a_val) * 150;
    } else {
      h = (a_val / b) * 150;
    }
  } else if (result?.tech_b_val != undefined && result?.tech_b_val != "") {
    if (a > b_val) {
      h = (b_val / a) * 150;
    } else {
      h = (a / b_val) * 150;
    }
  } else {
    if (a > b) {
      h = (b / a) * 150;
    } else {
      h = (a / b) * 150;
    }
  }
  h = Math.round(h);

  // chart js
  // Prepare data dynamically (aap apne logic ke hisab se yahan adjust kar sakte hain)
  let labels = [];
  let pieDataValues = [];
  let barDataValues = [];

  if (result?.tech_r2 != undefined) {
    if (a != undefined) {
      labels = ["b", "a"];
      pieDataValues = [Number(b), Number(a)];
      barDataValues = [Number(b), Number(a)];
    } else if (b != undefined) {
      labels = ["b", "a"];
      pieDataValues = [Number(b), Number(a)];
      barDataValues = [Number(b), Number(a)];
    } else {
      labels = ["b", "a"];
      pieDataValues = [Number(b), Number(a)];
      barDataValues = [Number(b), Number(a)];
    }
  } else {
    labels = ["c", "a", "b"];
    pieDataValues = [Number(c), Number(a), Number(b)];
    barDataValues = [Number(c), Number(a), Number(b)];
  }

  // Pie chart data
  const pieData = {
    labels,
    datasets: [
      {
        label: "Pie Dataset",
        data: pieDataValues,
        backgroundColor: ["#FF6F61", "#6B5B95", "#88B04B"],
        hoverOffset: 30,
      },
    ],
  };

  // Bar chart data
  const barData = {
    labels,
    datasets: [
      {
        label: "Bar Dataset",
        data: barDataValues,
        backgroundColor: "#6B5B95",
      },
    ],
  };

  // Chart options (optional)
  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  const barOptions = {
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              {formData.tech_ratio_of == "r2" && (
                <>
                  <div
                    className="col-span-12 md:col-span-8 lg:col-span-8 "
                    id="method"
                  >
                    <label htmlFor="tech_method" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_method"
                        id="tech_method"
                        value={formData.tech_method}
                        onChange={handleChange}
                      >
                        <option value="0">
                          {data?.payload?.tech_lang_keys["2"]}{" "}
                        </option>
                        <option value="1">
                          {data?.payload?.tech_lang_keys["3"]}{" "}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["4"]}{" "}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                        </option>
                        <option value="4">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                        </option>
                        <option value="5">
                          {data?.payload?.tech_lang_keys["7"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_ratio_of == "r3" && (
                <>
                  <div
                    className="col-span-12 md:col-span-8 lg:col-span-8"
                    id="method1"
                  >
                    <label htmlFor="tech_method1" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_method1"
                        id="tech_method1"
                        value={formData.tech_method1}
                        onChange={handleChange}
                      >
                        <option value="0">
                          {data?.payload?.tech_lang_keys["2"]}{" "}
                        </option>
                        <option value="1">
                          {data?.payload?.tech_lang_keys["3"]}{" "}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["4"]}{" "}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                        </option>
                        <option value="4">
                          {data?.payload?.tech_lang_keys["8"]}{" "}
                        </option>
                        <option value="5">
                          {data?.payload?.tech_lang_keys["9"]}{" "}
                        </option>
                        <option value="6">
                          {data?.payload?.tech_lang_keys["10"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-12 md:col-span-4 lg:col-span-4 text-center flex items-center justify-end">
                <label className="pe-2" htmlFor="r2">
                  <input
                    type="radio"
                    name="tech_ratio_of"
                    value="r2"
                    id="r2"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_ratio_of == "r2"}
                  />
                  <span>A:B </span>
                </label>

                <label className="pe-2" htmlFor="r3">
                  <input
                    type="radio"
                    name="tech_ratio_of"
                    value="r3"
                    id="r3"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_ratio_of == "r3"}
                  />
                  <span>A:B:C</span>
                </label>
              </div>
              {formData.tech_ratio_of == "r2" && (
                <>
                  <div id="txt1" className="txt_set my-2 col-span-12">
                    {data?.payload?.tech_lang_keys["12"]}
                  </div>
                </>
              )}
              {formData.tech_ratio_of == "r3" && (
                <>
                  <div id="txt2" className="txt_set my-2 col-span-12">
                    {data?.payload?.tech_lang_keys["13"]}
                  </div>
                </>
              )}
              <div className="col-span-12 items-center mt-2">
                <div className="grid grid-cols-12 gap-3">
                  {((formData.tech_method == "0" &&
                    formData.tech_ratio_of == "r2") ||
                    (formData.tech_method == "1" &&
                      formData.tech_ratio_of == "r2") ||
                    (formData.tech_method == "2" &&
                      formData.tech_ratio_of == "r2") ||
                    (formData.tech_method == "3" &&
                      formData.tech_ratio_of == "r2") ||
                    (formData.tech_method == "4" &&
                      formData.tech_ratio_of == "r2") ||
                    (formData.tech_method == "5" &&
                      formData.tech_ratio_of == "r2") ||
                    (formData.tech_method1 == "0" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "1" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "2" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "3" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "4" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "5" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "6" &&
                      formData.tech_ratio_of == "r3")) && (
                    <>
                      <div className="col-span-3 p_set" id="a">
                        <p className="text-center">
                          <strong>A</strong>
                        </p>
                        <input
                          type="number"
                          step="any"
                          name="tech_a"
                          id="tech_a"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_a}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}
                  {((formData.tech_method == "0" &&
                    formData.tech_ratio_of == "r2") ||
                    (formData.tech_method == "1" &&
                      formData.tech_ratio_of == "r2") ||
                    (formData.tech_method == "2" &&
                      formData.tech_ratio_of == "r2") ||
                    (formData.tech_method == "3" &&
                      formData.tech_ratio_of == "r2") ||
                    (formData.tech_method == "4" &&
                      formData.tech_ratio_of == "r2") ||
                    (formData.tech_method == "5" &&
                      formData.tech_ratio_of == "r2") ||
                    (formData.tech_method1 == "0" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "1" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "2" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "3" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "4" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "5" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "6" &&
                      formData.tech_ratio_of == "r3")) && (
                    <>
                      <div
                        className="col-span-1 text-center mt-3 flex items-center"
                        id="dot1"
                      >
                        <div className="eq_set">:</div>
                      </div>
                      <div className="col-span-3 p_set" id="b">
                        <p className="text-center">
                          <strong>B</strong>
                        </p>
                        <input
                          type="number"
                          step="any"
                          name="tech_b"
                          id="tech_b"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_b}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

                  {((formData.tech_method1 == "0" &&
                    formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "1" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "2" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "3" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "4" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "5" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "6" &&
                      formData.tech_ratio_of == "r3")) && (
                    <>
                      <div
                        className="col-span-1 text-center mt-3 flex items-center"
                        id="eq"
                      >
                        <div className="eq_set">:</div>
                      </div>
                      <div className="col-span-3">
                        <p className="text-center">
                          <strong>C</strong>
                        </p>
                        <input
                          type="number"
                          step="any"
                          name="tech_c1"
                          id="tech_c1"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_c1}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

                  {formData.tech_method == "0" &&
                    formData.tech_ratio_of == "r2" && (
                      <>
                        <div
                          className="col-span-1 text-center mt-3 flex items-center"
                          id="eq"
                        >
                          <div className="eq_set">=</div>
                        </div>
                        <div className="col-span-3 p_set" id="c">
                          <p className="text-center">
                            <strong>C</strong>
                          </p>
                          <input
                            type="number"
                            step="any"
                            name="tech_c"
                            id="tech_c"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_c}
                            onChange={handleChange}
                          />
                        </div>
                      </>
                    )}

                  {((formData.tech_method == "0" &&
                    formData.tech_ratio_of == "r2") ||
                    (formData.tech_method1 == "0" &&
                      formData.tech_ratio_of == "r3")) && (
                    <>
                      {formData.tech_method1 == "0" &&
                      formData.tech_ratio_of == "r3" ? (
                        <>
                          <div
                            className="col-span-1 text-center mt-3 flex items-center"
                            id="eq"
                          >
                            <div className="eq_set">=</div>
                          </div>
                        </>
                      ) : (
                        <div
                          className="col-span-1 text-center mt-3 flex items-center"
                          id="dot3"
                        >
                          <div className="eq_set">:</div>
                        </div>
                      )}

                      <div className="col-span-3 p_set" id="d">
                        <p className="text-center">
                          <strong>D</strong>
                        </p>
                        <input
                          type="number"
                          step="any"
                          name="tech_d"
                          id="tech_d"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_d}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

                  {formData.tech_method1 == "0" &&
                    formData.tech_ratio_of == "r3" && (
                      <>
                        <div
                          className="col-span-1 text-center mt-3 flex items-center"
                          id="dot3"
                        >
                          <div className="eq_set">:</div>
                        </div>
                        <div className="col-span-3 p_set" id="e">
                          <p className="text-center">
                            <strong>E</strong>
                          </p>
                          <input
                            type="number"
                            step="any"
                            name="tech_e"
                            id="tech_e"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_e}
                            onChange={handleChange}
                          />
                        </div>
                      </>
                    )}
                  {formData.tech_method1 == "0" &&
                    formData.tech_ratio_of == "r3" && (
                      <>
                        <div
                          className="col-span-1 text-center mt-3 flex items-center"
                          id="dot5"
                        >
                          <div className="eq_set">:</div>
                        </div>
                        <div className="col-span-3 p_set" id="f">
                          <p className="text-center">
                            <strong>F</strong>
                          </p>
                          <input
                            type="number"
                            step="any"
                            name="tech_f"
                            id="tech_f"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_f}
                            onChange={handleChange}
                          />
                        </div>
                      </>
                    )}

                  {((formData.tech_method == "1" &&
                    formData.tech_ratio_of == "r2") ||
                    (formData.tech_method == "2" &&
                      formData.tech_ratio_of == "r2") ||
                    (formData.tech_method1 == "1" &&
                      formData.tech_ratio_of == "r3") ||
                    (formData.tech_method1 == "2" &&
                      formData.tech_ratio_of == "r3")) && (
                    <>
                      <div className="col-span-6 p_set ps-lg-2" id="i">
                        {((formData.tech_method == "1" &&
                          formData.tech_ratio_of == "r2") ||
                          (formData.tech_method1 == "1" &&
                            formData.tech_ratio_of == "r3")) && (
                          <>
                            <p className="text-center font-s-14">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]}
                              </strong>
                            </p>
                          </>
                        )}
                        {((formData.tech_method == "2" &&
                          formData.tech_ratio_of == "r2") ||
                          (formData.tech_method1 == "2" &&
                            formData.tech_ratio_of == "r3")) && (
                          <>
                            <p className="text-center font-s-14">
                              <strong>Times Smaller</strong>
                            </p>
                          </>
                        )}
                        <input
                          type="number"
                          step="any"
                          name="tech_i"
                          id="tech_i"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_i}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
                      <div className="row my-2 text-[18px] text-center">
                        {formData?.tech_method == "0" &&
                        formData?.tech_ratio_of == "r2" ? (
                          <>
                            {result?.tech_a_val ? (
                              <>
                                <p className="text-[20px]">
                                  <b>{data?.payload?.tech_lang_keys["15"]}</b>
                                </p>
                                <p
                                  className="text-[25px] text-[#2845F5]"
                                  id="res"
                                >
                                  <b>
                                    <span className="text-accent-4 orange-text">
                                      {a_val}
                                    </span>{" "}
                                    : {b} = {c} : {d}
                                  </b>
                                </p>
                                <div className="col s12 margin_top_10">
                                  {typeof a_val == "number" && (
                                    <>
                                      <p className="text-[20px]">
                                        <b>
                                          {data?.payload?.tech_lang_keys["16"]}:
                                        </b>
                                      </p>
                                      <p className="text-[25px] text-[#2845F5]">
                                        <b>
                                          {a_val} : {b} = {c} : {d}
                                        </b>
                                      </p>
                                    </>
                                  )}
                                </div>
                              </>
                            ) : result?.tech_b_val ? (
                              <>
                                <>
                                  <p className="text-[20px]">
                                    <b>{data?.payload?.tech_lang_keys["15"]}</b>
                                  </p>
                                  <p
                                    className="text-[25px] text-[#2845F5]"
                                    id="res"
                                  >
                                    <b>
                                      {a} :{" "}
                                      <span className="text-accent-4 orange-text">
                                        {b_val ? b_val.toFixed(3) : ""}
                                      </span>{" "}
                                      = {c} : {d}
                                    </b>
                                  </p>
                                  <div className="col s12 margin_top_10">
                                    {typeof b_val == "number" && (
                                      <>
                                        <p className="text-[20px]">
                                          <b>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "16"
                                              ]
                                            }
                                            :
                                          </b>
                                        </p>
                                        <p className="text-[25px] text-[#2845F5]">
                                          <b>
                                            {a} :{" "}
                                            {b_val ? Math.round(b_val) : ""} ={" "}
                                            {c} : {d}
                                          </b>
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </>
                              </>
                            ) : result?.tech_c_val ? (
                              <>
                                <>
                                  <p className="text-[20px]">
                                    <b>{data?.payload?.tech_lang_keys["15"]}</b>
                                  </p>
                                  <p
                                    className="text-[25px] text-[#2845F5]"
                                    id="res"
                                  >
                                    <b>
                                      {a} : {b} ={" "}
                                      <span className="text-accent-4 orange-text">
                                        {c_val ? c_val.toFixed(3) : ""}
                                      </span>{" "}
                                      : {d}
                                    </b>
                                  </p>
                                  <div className="col s12 margin_top_10">
                                    {typeof c_val == "number" && (
                                      <>
                                        <p className="text-[20px]">
                                          <b>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "16"
                                              ]
                                            }
                                            :
                                          </b>
                                        </p>
                                        <p className="text-[25px] text-[#2845F5]">
                                          <b>
                                            {a} : {b} ={" "}
                                            {c_val ? Math.round(c_val) : ""} :{" "}
                                            {d}
                                          </b>
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </>
                              </>
                            ) : result?.tech_d_val ? (
                              <>
                                <p className="text-[20px]">
                                  <b>{data?.payload?.tech_lang_keys["15"]}</b>
                                </p>
                                <p
                                  className="text-[25px] text-[#2845F5]"
                                  id="res"
                                >
                                  <b>
                                    {a} : {b} = {c} :{" "}
                                    <span className="text-accent-4 orange-text">
                                      {d_val ? d_val.toFixed(3) : ""}
                                    </span>
                                  </b>
                                </p>
                                <div className="col s12 margin_top_10">
                                  {typeof d_val == "number" && (
                                    <>
                                      <p className="text-[20px]">
                                        <b>
                                          {data?.payload?.tech_lang_keys["16"]}:
                                        </b>
                                      </p>
                                      <p className="text-[25px] text-[#2845F5]">
                                        <b>
                                          {a} : {b} = {c} :{" "}
                                          {d_val ? Math.round(d_val) : ""}
                                        </b>
                                      </p>
                                    </>
                                  )}
                                </div>
                              </>
                            ) : null}
                          </>
                        ) : formData?.tech_method == "1" &&
                          formData?.tech_ratio_of == "r2" ? (
                          <>
                            <p className="text-[20px]">
                              <b>{data?.payload?.tech_lang_keys["15"]}</b>
                            </p>
                            <p className="text-[25px] text-[#2845F5]" id="res">
                              <b>
                                {a} : {b} ={" "}
                                <span className="text-accent-4 orange-text">
                                  {a_val1?.toFixed(3)} : {b_val1?.toFixed(3)}
                                </span>
                              </b>
                            </p>
                            <div className="col s12 margin_top_10">
                              {(typeof result?.tech_a_val1 == "number" ||
                                typeof b_val1 == "number") && (
                                <>
                                  <p className="text-[20px]">
                                    <b>
                                      {data?.payload?.tech_lang_keys["16"]}:
                                    </b>
                                  </p>
                                  <p className="text-[25px] text-[#2845F5]">
                                    <b>
                                      {a} : {b} = {Math.round(a_val1)} :{" "}
                                      {Math.round(b_val1)}
                                    </b>
                                  </p>
                                </>
                              )}
                            </div>
                          </>
                        ) : formData?.tech_method == "2" &&
                          formData?.tech_ratio_of == "r2" ? (
                          <>
                            <p className="text-[20px]">
                              <b>{data?.payload?.tech_lang_keys["15"]}</b>
                            </p>
                            <p className="text-[25px] text-[#2845F5]" id="res">
                              <b>
                                {a} : {b} ={" "}
                                <span className="text-accent-4 orange-text">
                                  {a_val2?.toFixed(3)} : {b_val2?.toFixed(3)}
                                </span>
                              </b>
                            </p>
                            <div className="col s12 margin_top_10">
                              {(typeof result?.tech_a_val2 == "number" ||
                                typeof b_val2 == "number") && (
                                <>
                                  <p className="text-[20px]">
                                    <b>
                                      {data?.payload?.tech_lang_keys["16"]}:
                                    </b>
                                  </p>
                                  <p className="text-[25px] text-[#2845F5]">
                                    <b>
                                      {a} : {b} = {Math.round(a_val2)} :{" "}
                                      {Math.round(b_val2)}
                                    </b>
                                  </p>
                                </>
                              )}
                            </div>
                          </>
                        ) : formData?.tech_method == "3" &&
                          formData?.tech_ratio_of == "r2" ? (
                          <>
                            <p className="text-[25px] text-[#2845F5]" id="res">
                              <b>
                                {a} : {b} ={" "}
                                <span className="text-accent-4 orange-text">
                                  {a_val3} : {b_val3}
                                </span>
                              </b>
                            </p>
                            <div className="col s12 margin_top_10">
                              {(typeof result?.tech_a_val3 == "number" ||
                                typeof b_val3 == "number") && (
                                <>
                                  <p className="text-[20px]">
                                    <b>
                                      {data?.payload?.tech_lang_keys["16"]}:
                                    </b>
                                  </p>
                                  <p className="text-[25px] text-[#2845F5]">
                                    <b>
                                      {a} : {b} = {Math.round(a_val3)} :{" "}
                                      {Math.round(b_val3)}
                                    </b>
                                  </p>
                                </>
                              )}
                            </div>
                            {result?.tech_gcf ? (
                              <>
                                <p className="col s12 font_s20 margin_top_15 center">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["17"]}{" "}
                                    <a
                                      href={data?.payload?.tech_lang_keys["18"]}
                                      target="_blank"
                                      rel="noopener"
                                    >
                                      {data?.payload?.tech_lang_keys["19"]}
                                    </a>{" "}
                                    {data?.payload?.tech_lang_keys["20"]}
                                  </strong>
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="col s12 font_s20 margin_top_15 center">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["21"]}{" "}
                                    <a
                                      href={data?.payload?.tech_lang_keys["18"]}
                                      target="_blank"
                                      rel="noopener"
                                    >
                                      {data?.payload?.tech_lang_keys["19"]}
                                    </a>{" "}
                                    {data?.payload?.tech_lang_keys["22"]}
                                  </strong>
                                </p>
                              </>
                            )}
                            <p className="text-[20px]">
                              <b>{data?.payload?.tech_lang_keys["15"]}</b>
                            </p>
                          </>
                        ) : formData?.tech_method == "4" &&
                          formData?.tech_ratio_of == "r2" ? (
                          <>
                            <p className="text-[20px]">
                              <b>{data?.payload?.tech_lang_keys["15"]}</b>
                            </p>

                            <p className="text-[25px] text-[#2845F5]" id="res">
                              <b>
                                {a} : {b} ={" "}
                                <span className="text-accent-4 orange-text">
                                  {" "}
                                  {a_val4?.toFixed(3)} : {b_val4?.toFixed(3)}
                                </span>
                              </b>
                            </p>

                            <div className="col s12 margin_top_10">
                              {(typeof result?.tech_a_val4 == "number" ||
                                typeof b_val4 == "number") && (
                                <>
                                  <p className="text-[20px]">
                                    <b>
                                      {data?.payload?.tech_lang_keys["16"]}:
                                    </b>
                                  </p>
                                  <p className="text-[25px] text-[#2845F5]">
                                    <b>
                                      {a} : {b} = {Math.round(a_val4)} :{" "}
                                      {Math.round(b_val4)}
                                    </b>
                                  </p>
                                </>
                              )}
                            </div>
                          </>
                        ) : formData?.tech_method == "5" &&
                          formData?.tech_ratio_of == "r2" ? (
                          <>
                            <p className="text-[20px]">
                              <b>{data?.payload?.tech_lang_keys["15"]}</b>
                            </p>

                            <p className="text-[25px] text-[#2845F5]" id="res">
                              <b>
                                {a} : {b} ={" "}
                                <span className="text-accent-4 orange-text">
                                  {" "}
                                  {a_val5?.toFixed(3)} : {b_val5?.toFixed(3)}
                                </span>
                              </b>
                            </p>

                            <div className="col s12 margin_top_10">
                              {(typeof result?.tech_a_val6 == "number" ||
                                typeof b_val5 == "number") && (
                                <>
                                  <p className="text-[20px]">
                                    <b>
                                      {data?.payload?.tech_lang_keys["16"]}:
                                    </b>
                                  </p>
                                  <p className="text-[25px] text-[#2845F5]">
                                    <b>
                                      {a} : {b} = {Math.round(a_val5)} :{" "}
                                      {Math.round(b_val5)}
                                    </b>
                                  </p>
                                </>
                              )}
                            </div>
                          </>
                        ) : formData?.tech_method1 == "0" &&
                          formData?.tech_ratio_of == "r3" ? (
                          <>
                            <p className="text-[20px]">
                              <b>{data?.payload?.tech_lang_keys["15"]}</b>
                            </p>

                            <p className="text-[25px] text-[#2845F5]" id="res">
                              <b>
                                {a} : {b} : {c1} = {d} :{" "}
                                <span className="text-accent-4 orange-text">
                                  {e_val?.toFixed(3)} : {f_val?.toFixed(3)}
                                </span>
                              </b>
                            </p>

                            <div className="col s12 margin_top_10">
                              {result?.tech_dbl && (
                                <>
                                  <p className="text-[20px]">
                                    <b>
                                      {data?.payload?.tech_lang_keys["16"]}:
                                    </b>
                                  </p>
                                  <p className="text-[25px] text-[#2845F5]">
                                    <b>
                                      {a} : {b} : {c1} = {d} :{" "}
                                      {Math.round(e_val)} : {Math.round(f_val)}
                                    </b>
                                  </p>
                                </>
                              )}
                            </div>
                          </>
                        ) : formData?.tech_method1 == "1" &&
                          formData?.tech_ratio_of == "r3" ? (
                          <>
                            <p className="text-[20px]">
                              <b>{data?.payload?.tech_lang_keys["15"]}</b>
                            </p>

                            <p className="text-[25px] text-[#2845F5]" id="res">
                              <b>
                                {a} : {b} : {c1} ={" "}
                                <span className="text-accent-4 orange-text">
                                  {a_val1?.toFixed(3)} : {b_val1?.toFixed(3)} :{" "}
                                  {c_val1?.toFixed(3)}
                                </span>
                              </b>
                            </p>

                            <div className="col s12 margin_top_10">
                              {result?.tech_dbl && (
                                <>
                                  <p className="text-[20px]">
                                    <b>
                                      {data?.payload?.tech_lang_keys["16"]}:
                                    </b>
                                  </p>
                                  <p
                                    className="text-[25px] text-[#2845F5]"
                                    id="res"
                                  >
                                    <b>
                                      {a} : {b} : {c1} = {Math.round(a_val1)} :{" "}
                                      {Math.round(b_val1)} :{" "}
                                      {Math.round(c_val1)}
                                    </b>
                                  </p>
                                </>
                              )}
                            </div>
                          </>
                        ) : formData?.tech_method1 == "2" &&
                          formData?.tech_ratio_of == "r3" ? (
                          <>
                            <p className="text-[20px]">
                              <b>{data?.payload?.tech_lang_keys["15"]}</b>
                            </p>

                            <p className="text-[25px] text-[#2845F5]" id="res">
                              <b>
                                {a} : {b} : {c1} ={" "}
                                <span className="text-accent-4 orange-text">
                                  {a_val2?.toFixed(3)} : {b_val2?.toFixed(3)} :{" "}
                                  {c_val2?.toFixed(3)}
                                </span>
                              </b>
                            </p>

                            <div className="col s12 margin_top_10">
                              {result?.tech_dbl && (
                                <>
                                  <p className="text-[20px]">
                                    <b>
                                      {data?.payload?.tech_lang_keys["16"]}:
                                    </b>
                                  </p>
                                  <p
                                    className="text-[25px] text-[#2845F5]"
                                    id="res"
                                  >
                                    <b>
                                      {a} : {b} : {c1} = {Math.round(a_val2)} :{" "}
                                      {Math.round(b_val2)} :{" "}
                                      {Math.round(c_val2)}
                                    </b>
                                  </p>
                                </>
                              )}
                            </div>
                          </>
                        ) : formData?.tech_method1 == "3" &&
                          formData?.tech_ratio_of == "r3" ? (
                          <>
                            <p className="text-[20px]">
                              <b>{data?.payload?.tech_lang_keys["15"]}</b>
                            </p>

                            <p className="text-[25px] text-[#2845F5]" id="res">
                              <b>
                                {a} : {b} : {c1} ={" "}
                                <span className="text-accent-4 orange-text">
                                  {a_val3?.toFixed(3)} : {b_val3?.toFixed(3)} :{" "}
                                  {c_val3?.toFixed(3)}
                                </span>
                              </b>
                            </p>

                            <div className="col s12 margin_top_10">
                              {result?.tech_dbl && (
                                <>
                                  <p className="text-[20px]">
                                    <b>
                                      {data?.payload?.tech_lang_keys["16"]}:
                                    </b>
                                  </p>
                                  <p
                                    className="text-[25px] text-[#2845F5]"
                                    id="res"
                                  >
                                    <b>
                                      {a} : {b} : {c1} = {Math.round(a_val3)} :{" "}
                                      {Math.round(b_val3)} :{" "}
                                      {Math.round(c_val3)}
                                    </b>
                                  </p>
                                </>
                              )}
                            </div>

                            {result?.tech_gcf ? (
                              <>
                                <p className="col s12 font_s20 margin_top_15 center">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["17"]}{" "}
                                    <a
                                      href={data?.payload?.tech_lang_keys["18"]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {data?.payload?.tech_lang_keys["19"]}
                                    </a>{" "}
                                    {data?.payload?.tech_lang_keys["20"]}
                                  </strong>
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="col s12 font_s20 margin_top_15 center">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["21"]}{" "}
                                    <a
                                      href={data?.payload?.tech_lang_keys["18"]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {data?.payload?.tech_lang_keys["19"]}
                                    </a>{" "}
                                    {data?.payload?.tech_lang_keys["22"]}
                                  </strong>
                                </p>
                              </>
                            )}
                          </>
                        ) : formData?.tech_method1 == "4" &&
                          formData?.tech_ratio_of == "r3" ? (
                          <>
                            <p className="text-[20px]">
                              <b>{data?.payload?.tech_lang_keys["15"]}</b>
                            </p>

                            <p className="text-[25px] text-[#2845F5]" id="res">
                              <b>
                                {`${a} : ${b} : ${c1} = `}
                                <span className="text-accent-4 orange-text">
                                  {`${round(a_val4, 3)} : ${round(
                                    b_val4,
                                    3
                                  )} : ${round(c_val4, 3)}`}
                                </span>
                              </b>
                              <br />
                            </p>

                            <div className="col s12 margin_top_10">
                              {result?.tech_dbl && (
                                <>
                                  <p className="text-[20px]">
                                    <b>
                                      {data?.payload?.tech_lang_keys["16"]}:
                                    </b>
                                  </p>
                                  <p
                                    className="text-[25px] text-[#2845F5]"
                                    id="res"
                                  >
                                    <b>{`${a} : ${b} : ${c1} = ${round(
                                      a_val4
                                    )} : ${round(b_val4)} : ${round(
                                      c_val4
                                    )}`}</b>
                                    <br />
                                  </p>
                                </>
                              )}
                            </div>
                          </>
                        ) : formData?.tech_method1 == "5" &&
                          formData?.tech_ratio_of == "r3" ? (
                          <>
                            <p className="text-[20px]">
                              <b>{data?.payload?.tech_lang_keys["15"]}</b>
                            </p>
                            <p className="text-[25px] text-[#2845F5]" id="res">
                              <b>
                                {`${a} : ${b} : ${c1} = `}
                                <span className="text-accent-4 orange-text">
                                  {`${round(a_val5, 3)} : ${round(
                                    b_val5,
                                    3
                                  )} : ${round(c_val5, 3)}`}
                                </span>
                                <br />
                              </b>
                            </p>

                            <div className="col s12 margin_top_10">
                              {result?.tech_dbl && (
                                <>
                                  <p className="text-[20px]">
                                    <b>
                                      {data?.payload?.tech_lang_keys["16"]}:
                                    </b>
                                  </p>
                                  <p
                                    className="text-[25px] text-[#2845F5]"
                                    id="res"
                                  >
                                    <b>
                                      {`${a} : ${b} : ${c1} = ${round(
                                        a_val5
                                      )} : ${round(b_val5)} : ${round(c_val5)}`}
                                      <br />
                                    </b>
                                  </p>
                                </>
                              )}
                            </div>
                          </>
                        ) : formData?.tech_method1 == "6" &&
                          formData?.tech_ratio_of == "r3" ? (
                          <>
                            <p className="text-[20px]">
                              <b>{data?.payload?.tech_lang_keys["15"]}</b>
                            </p>
                            <p className="text-[25px] text-[#2845F5]" id="res">
                              <b>
                                {`${a} : ${b} : ${c1} = `}
                                <span className="text-accent-4 orange-text">
                                  {`${round(a_val6, 3)} : ${round(
                                    b_val6,
                                    3
                                  )} : ${round(c_val6, 3)}`}
                                </span>
                                <br />
                              </b>
                            </p>

                            <div className="col s12 margin_top_10">
                              {result?.tech_dbl && (
                                <>
                                  <p className="text-[20px]">
                                    <b>
                                      {data?.payload?.tech_lang_keys["16"]}:
                                    </b>
                                  </p>
                                  <p
                                    className="text-[25px] text-[#2845F5]"
                                    id="res"
                                  >
                                    <b>{`${a} : ${b} : ${c1} = ${round(
                                      a_val6
                                    )} : ${round(b_val6)} : ${round(
                                      c_val6
                                    )}`}</b>
                                    <br />
                                  </p>
                                </>
                              )}
                            </div>
                          </>
                        ) : null}

                        <p className="my-2">
                          <strong>
                            {data?.payload?.tech_lang_keys["23"]}:
                          </strong>
                        </p>
                        <div className="col-span-12  pe-lg-3">
                          <p className="text-center mb-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["24"]}:
                            </strong>
                          </p>
                          <div
                            id="piechart"
                            style={{
                              width: "200px",
                              height: "200px",
                              margin: "0 auto",
                            }}
                          >
                            <Pie
                              data={pieData}
                              options={pieOptions}
                              style={{ width: "100%", height: "50%" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-12  p_set3 ps-lg-3 mt-10">
                          {r2 ? (
                            <>
                              {a_val ? (
                                <>
                                  <div className="text-center mb-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["25"]}{" "}
                                      {a_val},{" "}
                                      {data?.payload?.tech_lang_keys["26"]} {b}
                                    </strong>
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        backgroundColor: "#FF6F61",
                                        width: "150px",
                                        height: "50px",
                                        margin: "0 auto",
                                      }}
                                    >
                                      <div
                                        style={{
                                          backgroundColor: "#6B5B95",
                                          width: `${w}%`,
                                          height: "50px",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : b_val ? (
                                <>
                                  <div className="text-center mb-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["25"]} {a},{" "}
                                      {data?.payload?.tech_lang_keys["26"]}{" "}
                                      {Math.round(b_val)}
                                    </strong>
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        backgroundColor: "#FF6F61",
                                        width: "150px",
                                        height: "50px",
                                        margin: "0 auto",
                                      }}
                                    >
                                      <div
                                        style={{
                                          backgroundColor: "#6B5B95",
                                          width: `${w}%`,
                                          height: "50px",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="text-center mb-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["25"]} {a},{" "}
                                      {data?.payload?.tech_lang_keys["26"]} {b}
                                    </strong>
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        backgroundColor: "#FF6F61",
                                        width: "150px",
                                        height: "50px",
                                        margin: "0 auto",
                                      }}
                                    >
                                      <div
                                        style={{
                                          backgroundColor: "#6B5B95",
                                          width: `${w}%`,
                                          height: "50px",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          ) : r3 ? (
                            <>
                              <div className="text-center mb-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["25"]} {a},{" "}
                                  {data?.payload?.tech_lang_keys["26"]} {b}
                                </strong>
                              </div>
                              <div>
                                <div
                                  style={{
                                    backgroundColor: "#FF6F61",
                                    width: "150px",
                                    height: "50px",
                                    margin: "0 auto",
                                  }}
                                >
                                  <div
                                    style={{
                                      backgroundColor: "#6B5B95",
                                      width: `${w}%`,
                                      height: "50px",
                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          ) : null}

                          <div className="text-center mb-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["27"]} {a},{" "}
                              {data?.payload?.tech_lang_keys["28"]} {b}
                            </strong>
                          </div>
                          <div>
                            <div
                              className="padding_0"
                              style={{
                                backgroundColor: "#6B5B95",
                                width: "150px",
                                height: `${h}px`,
                                maxHeight: "135px",
                                margin: "0 auto",
                              }}
                            ></div>
                          </div>
                        </div>
                        {/* <div className="col-span-12  pe-lg-3">
                                    <p className="text-center mb-2"><strong>{data?.payload?.tech_lang_keys['24']}:</strong></p>
                                  <div id="piechart"style={{ width: "300px", height: "300px", margin: "0 auto" }} >
                                    <h2>Bar Chart</h2>
                                    <Bar data={barData} options={barOptions} style={{ width: "100%", height: "50%" }} />
                                  </div>
                                  </div> */}
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

export default RatioCalculator;

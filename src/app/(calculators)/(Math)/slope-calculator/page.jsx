"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register chart components
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

import {
  useGetSingleCalculatorDetailsMutation,
  useSlopeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SlopeCalculator = () => {
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
    tech_type: "1", // 1 2 3 4  line
    tech_x1: 2,
    tech_y1: 3,
    tech_x2: 4,
    tech_y2: 5,
    tech_m: 12,
    tech_angle: 5,
    tech_dis: 13,
    tech_x: 3,
    tech_y: -9,
    tech_b: 11,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSlopeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_x1: formData.tech_x1,
        tech_y1: formData.tech_y1,
        tech_x2: formData.tech_x2,
        tech_y2: formData.tech_y2,
        tech_m: formData.tech_m,
        tech_angle: formData.tech_angle,
        tech_dis: formData.tech_dis,
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_b: formData.tech_b,
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
      tech_type: "1", // 1 2 3 4  line
      tech_x1: 2,
      tech_y1: 3,
      tech_x2: 4,
      tech_y2: 5,
      tech_m: 12,
      tech_angle: 5,
      tech_dis: 13,
      tech_x: 3,
      tech_y: -9,
      tech_b: 11,
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

  const type = formData?.tech_type;

  // Prepare separate datasets
  const rightSideDataset = [
    {
      label: "Right Side Line",
      data: [
        { x: result?.tech_xr, y: result?.tech_yr },
        { x: result?.tech_x2r, y: result?.tech_y2r },
      ],
      borderColor: "blue",
      backgroundColor: "blue",
      tension: 0,
    },
  ];

  const leftSideDataset = [
    {
      label: "Left Side Line",
      data: [
        { x: result?.tech_xl, y: result?.tech_yl },
        { x: result?.tech_x2l, y: result?.tech_y2r },
      ],
      borderColor: "green",
      backgroundColor: "green",
      tension: 0,
    },
  ];

  const singleLineDataset = [
    {
      label: "Line",
      data: [
        { x: formData?.tech_x1, y: formData?.tech_y1 },
        { x: formData?.tech_x2, y: formData?.tech_y2 },
      ],
      borderColor: "red",
      backgroundColor: "red",
      tension: 0,
    },
  ];

  const chartOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: { title: { display: true, text: "X Axis" } },
      y: { title: { display: true, text: "Y Axis" } },
    },
  });

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
            <div className="grid grid-cols-1 mb-3  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["type"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type"
                    id="tech_type"
                    value={formData.tech_type}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["1p"]},{" "}
                      {data?.payload?.tech_lang_keys["slope"]} {" & "}{" "}
                      {data?.payload?.tech_lang_keys["distance"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["2p"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["1p"]},{" "}
                      {data?.payload?.tech_lang_keys["slope"]}
                      {" & X or Y"}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["1p"]} &{" "}
                      {data?.payload?.tech_lang_keys["slope"]}
                    </option>
                    <option value="line">
                      {data?.payload?.tech_lang_keys["line"]}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            {(formData.tech_type == "1" ||
              formData.tech_type == "2" ||
              formData.tech_type == "3" ||
              formData.tech_type == "4") && (
              <>
                <div className="grid grid-cols-12  gap-4 common">
                  <div className="col-span-6">
                    <label htmlFor="tech_x1" className="label">
                      {data?.payload?.tech_lang_keys["x1"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_x1"
                        id="tech_x1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_x1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_y1" className="label">
                      {data?.payload?.tech_lang_keys["x1"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_y1"
                        id="tech_y1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_y1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {(formData.tech_type == "2" || formData.tech_type == "3") && (
              <>
                <div className="grid grid-cols-12  gap-4 twopoint">
                  <div className="col-span-6">
                    <label htmlFor="tech_x2" className="label">
                      {data?.payload?.tech_lang_keys["x2"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_x2"
                        id="tech_x2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_x2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_y2" className="label">
                      or {data?.payload?.tech_lang_keys["y2"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_y2"
                        id="tech_y2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_y2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {(formData.tech_type == "1" ||
              formData.tech_type == "4" ||
              formData.tech_type == "3") && (
              <>
                <div className="grid grid-cols-12 mt-2  gap-4   onepoint">
                  {(formData.tech_type == "1" ||
                    formData.tech_type == "4" ||
                    formData.tech_type == "3") && (
                    <>
                      <div
                        className={`${
                          formData.tech_type == "4" || formData.tech_type == "3"
                            ? "col-span-6"
                            : "col-span-4"
                        }`}
                      >
                        <label htmlFor="tech_m" className="label">
                          {data?.payload?.tech_lang_keys["slope"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_m"
                            id="tech_m"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_m}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div
                        className={`${
                          formData.tech_type == "4" || formData.tech_type == "3"
                            ? "col-span-6"
                            : "col-span-4"
                        }`}
                      >
                        <i className="col-1 ps-4 pt-3">or</i>
                        <label htmlFor="tech_angle" className="label">
                          {data?.payload?.tech_lang_keys["angle"]}°:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_angle"
                            id="tech_angle"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_angle}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_type == "1" && (
                    <>
                      <div className="col-span-4 distance">
                        <label htmlFor="tech_dis" className="label">
                          {data?.payload?.tech_lang_keys["distance"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_dis"
                            id="tech_dis"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_dis}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
            {formData.tech_type == "line" && (
              <>
                <div className="grid grid-cols-12  mt-2 gap-4  pline">
                  <div className="col-span-4">
                    <label htmlFor="tech_x" className="label">
                      {data?.payload?.tech_lang_keys["enter"]}{" "}
                      <i className="ps-2">x</i>:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_x"
                        id="tech_x"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_x}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <label htmlFor="tech_y" className="label">
                      <i className="ps-2">y</i>
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_y"
                        id="tech_y"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_y}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <label htmlFor="tech_b" className="label">
                      <span className="ps-2">=0</span>
                    </label>
                    <div className=" relative">
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
                  </div>
                </div>
              </>
            )}
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 rounded-lg result_calculator space-y-6 result">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 rounded-lg result_calculator space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue result p-3 radius-10 mt-3">
                      <div className="row text-[16px]">
                        {formData?.tech_type == "2" && (
                          <>
                            <div className="overflow-auto w-full">
                              <div className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["slope"]}
                                </strong>
                              </div>
                              <div className="mt-2">
                                <strong>
                                  <InlineMath
                                    math={String(result?.tech_slope)}
                                  />
                                </strong>
                              </div>
                              <div className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["si"]}:{" "}
                                  <InlineMath math="y = mx + b" />
                                </strong>
                              </div>
                              <div className="mt-2">
                                <strong>
                                  <InlineMath
                                    math={`y = ${result?.tech_slope}x ${
                                      result?.tech_b < 0
                                        ? result?.tech_b
                                        : "+ " + result?.tech_b
                                    }`}
                                  />
                                </strong>
                              </div>

                              <p className="mt-2 font-s-25 text-blue text-center">
                                {data?.payload?.tech_lang_keys["ans"]}
                              </p>

                              <p className="mt-2 font-s-25">Solution:</p>
                              <div className="mt-2">
                                <strong>
                                  <InlineMath math={`P = (x_1, y_1)`} /> and{" "}
                                  <InlineMath math={`Q = (x_2, y_2)`} />,{" "}
                                  <InlineMath
                                    math={`P = (${formData?.tech_x1}, ${formData?.tech_y1})`}
                                  />{" "}
                                  and{" "}
                                  <InlineMath
                                    math={`Q = (${formData?.tech_x2}, ${formData?.tech_y2})`}
                                  />
                                </strong>
                              </div>

                              <div className="mt-2">
                                Formula to find Slope:
                                <BlockMath
                                  math={`m = \\frac{y_2 - y_1}{x_2 - x_1}`}
                                />
                              </div>

                              <div className="mt-2">
                                We have:{" "}
                                <InlineMath
                                  math={`x_1 = ${formData?.tech_x1},\\ y_1 = ${formData?.tech_y1},\\ x_2 = ${formData?.tech_x2},\\ y_2 = ${formData?.tech_y2}`}
                                />
                              </div>

                              <div className="mt-2">
                                Plug the given values into the formula:
                                <BlockMath
                                  math={`m = \\frac{(${formData?.tech_y2}) - (${formData?.tech_y1})}{(${formData?.tech_x2}) - (${formData?.tech_x1})} = ${result?.tech_slope}`}
                                />
                              </div>
                            </div>
                            <div className="overflow-auto">
                              <table className="w-full md:w-[50%] lg:w-[50%]">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>Percentage Grade:</b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_slope * 100} %
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["angle"]}
                                        :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_angle !== ""
                                        ? result?.tech_angle
                                        : "0.0 deg"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {
                                          data?.payload?.tech_lang_keys[
                                            "distance"
                                          ]
                                        }
                                        :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_distance !== ""
                                        ? result?.tech_distance
                                        : "0.0"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["x"]}:
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_x !== ""
                                        ? result?.tech_x
                                        : "0.0"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["y"]}:
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_y !== ""
                                        ? result?.tech_y
                                        : "0.0"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        X -{" "}
                                        {data?.payload?.tech_lang_keys["in"]}:
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_slope !== 0
                                        ? Math.round(
                                            ((-1 * result?.tech_b) /
                                              result?.tech_slope) *
                                              100
                                          ) / 100
                                        : "undefined"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        Y -{" "}
                                        {data?.payload?.tech_lang_keys["in"]}:
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_b}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div
                              className="col-lg-8"
                              style={{ float: "none", margin: "15px auto" }}
                            >
                              <div id="box1" className="col s12 padding_0">
                                <Line
                                  data={{ datasets: singleLineDataset }}
                                  options={chartOptions("Line Graph")}
                                />
                              </div>
                            </div>
                          </>
                        )}
                        {formData?.tech_type == "line" && (
                          <>
                            <p className="mt-2 font-s-25 text-blue text-center">
                              {data?.payload?.tech_lang_keys["ans"]}
                            </p>
                            <div className="overflow-auto">
                              <table className="w-full md:w-[50%] lg:w-[50%]">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["slope"]}{" "}
                                        :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_slope !== ""
                                        ? result?.tech_slope
                                        : "0.0"}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <b>Percentage Grade :</b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_slope
                                        ? result?.tech_slope * 100
                                        : 0}{" "}
                                      %
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["angle"]}{" "}
                                        :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_angle !== ""
                                        ? result?.tech_angle
                                        : "0.0 deg"}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        X -{" "}
                                        {data?.payload?.tech_lang_keys["in"]} :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_slope !== 0
                                        ? Math.round(
                                            ((-1 * result?.tech_b) /
                                              result?.tech_slope) *
                                              100
                                          ) / 100
                                        : "undefined"}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        Y -{" "}
                                        {data?.payload?.tech_lang_keys["in"]} :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_b}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["si"]}: y
                                        = mx + b :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      <InlineMath
                                        math={`y = ${result?.tech_slope}x ${
                                          result?.tech_b < 0
                                            ? result?.tech_b
                                            : "+ " + result?.tech_b
                                        }`}
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_type == "3" && (
                          <>
                            <div className="overflow-auto">
                              <table className="w-full md:w-[50%] lg:w-[50%]">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>X₂ :</b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_x2}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>Y₂ :</b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_y2}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["x"]} :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_x !== ""
                                        ? result?.tech_x
                                        : "0.0"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["y"]} :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_y !== ""
                                        ? result?.tech_y
                                        : "0.0"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["slope"]}{" "}
                                        :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_slope !== ""
                                        ? result?.tech_slope
                                        : "0.0"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>Percentage Grade :</b>
                                    </td>
                                    <td className="border-b py-2">
                                      {(result?.tech_slope * 100).toFixed(2)} %
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["angle"]}{" "}
                                        :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_angle !== ""
                                        ? result?.tech_angle
                                        : "0.0 deg"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {
                                          data?.payload?.tech_lang_keys[
                                            "distance"
                                          ]
                                        }{" "}
                                        :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_distance !== ""
                                        ? result?.tech_distance
                                        : "0.0"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        X -{" "}
                                        {data?.payload?.tech_lang_keys["in"]} :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_slope !== 0
                                        ? Math.round(
                                            ((-1 * result?.tech_b) /
                                              result?.tech_slope) *
                                              100
                                          ) / 100
                                        : "undefined"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        Y -{" "}
                                        {data?.payload?.tech_lang_keys["in"]} :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_b}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["si"]}: y
                                        = mx + b :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      y = {result?.tech_slope}x{" "}
                                      {result?.tech_b < 0
                                        ? result?.tech_b
                                        : `+ ${result?.tech_b}`}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-lg-8">
                              <div id="box1" className="col s12 padding_0">
                                <Line
                                  data={{ datasets: singleLineDataset }}
                                  options={chartOptions("Line Graph")}
                                />
                              </div>
                            </div>
                          </>
                        )}
                        {formData?.tech_type == "4" && (
                          <>
                            <div className="overflow-auto">
                              <table className="w-full md:w-[50%] lg:w-[50%]">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["slope"]}{" "}
                                        :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_slope !== ""
                                        ? result?.tech_slope
                                        : "0.0"}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <b>Percentage Grade :</b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_slope
                                        ? (result?.tech_slope * 100).toFixed(2)
                                        : "0.0"}{" "}
                                      %
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["angle"]}{" "}
                                        :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_angle !== ""
                                        ? result?.tech_angle
                                        : "0.0 deg"}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        X -{" "}
                                        {data?.payload?.tech_lang_keys["in"]} :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_slope !== 0
                                        ? (
                                            -result?.tech_b / result?.tech_slope
                                          ).toFixed(2)
                                        : "undefined"}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        Y -{" "}
                                        {data?.payload?.tech_lang_keys["in"]} :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_b}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["si"]}: y
                                        = mx + b :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      y = {result?.tech_slope}x{" "}
                                      {result?.tech_b < 0
                                        ? result?.tech_b
                                        : `+ ${result?.tech_b}`}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_type == "1" && (
                          <>
                            <p className="mt-2 font-s-25 text-blue text-center">
                              Right Side
                            </p>
                            <table className="w-full md:w-[50%] lg:w-[50%]">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    <b>X₂ :</b>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_x2r}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <b>Y₂ :</b>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_y2r}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <b>
                                      {data?.payload?.tech_lang_keys["x"]} :
                                    </b>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_xr}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <b>
                                      {data?.payload?.tech_lang_keys["y"]} :
                                    </b>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_yr}
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <div className="col-lg-8">
                              <div id="box1" className="col s12 padding_0">
                                <Line
                                  data={{ datasets: rightSideDataset }}
                                  options={chartOptions("Right Side Line")}
                                />
                              </div>
                            </div>

                            <p className="mt-2 font-s-25 text-blue text-center">
                              Left Side
                            </p>
                            <table className="w-full md:w-[50%] lg:w-[50%]">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    <b>X₂ :</b>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_x2l}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <b>Y₂ :</b>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_y2l}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <b>
                                      {data?.payload?.tech_lang_keys["x"]} :
                                    </b>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_xl}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <b>
                                      {data?.payload?.tech_lang_keys["y"]} :
                                    </b>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_yl}
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <div className="col s12 margin_top_15">
                              <div id="box" className="col s12 padding_0">
                                <Line
                                  data={{ datasets: leftSideDataset }}
                                  options={chartOptions("Left Side Line")}
                                />
                              </div>
                            </div>

                            <p className="col s12 text-center text-blue font-s-25">
                              &nbsp;
                            </p>
                            <div className="overflow-auto">
                              <table className="w-full md:w-[50%] lg:w-[50%]">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["slope"]}{" "}
                                        :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_slope !== ""
                                        ? result?.tech_slope
                                        : "0.0"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>Percentage Grade :</b>
                                    </td>
                                    <td className="border-b py-2">
                                      {(result?.tech_slope * 100).toFixed(2)} %
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["angle"]}{" "}
                                        :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_angle !== ""
                                        ? result?.tech_angle
                                        : "0.0 deg"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {
                                          data?.payload?.tech_lang_keys[
                                            "distance"
                                          ]
                                        }{" "}
                                        :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_distance !== ""
                                        ? result?.tech_distance
                                        : "0.0"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        X -{" "}
                                        {data?.payload?.tech_lang_keys["in"]} :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_slope !== 0
                                        ? (
                                            -result?.tech_b / result?.tech_slope
                                          ).toFixed(2)
                                        : "undefined"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        Y -{" "}
                                        {data?.payload?.tech_lang_keys["in"]} :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_b}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <b>
                                        {data?.payload?.tech_lang_keys["si"]}: y
                                        = mx + b :
                                      </b>
                                    </td>
                                    <td className="border-b py-2">
                                      y = {result?.tech_slope}x{" "}
                                      {result?.tech_b < 0
                                        ? result?.tech_b
                                        : `+ ${result?.tech_b}`}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
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

export default SlopeCalculator;

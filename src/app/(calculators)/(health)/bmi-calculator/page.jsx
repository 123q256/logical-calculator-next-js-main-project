"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useBMICalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
const BMICalculator = () => {
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
    tech_unit_type: "lbs", // lbs  kg
    tech_stage: "child",
    tech_gender: "Male",
    tech_age: "15",
    tech_ft_in: "69",
    tech_height_cm: "175",
    tech_weight: "160",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBMICalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_unit_type ||
      !formData.tech_stage ||
      !formData.tech_gender ||
      !formData.tech_age ||
      !formData.tech_ft_in ||
      !formData.tech_height_cm ||
      !formData.tech_weight
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_stage: formData.tech_stage,
        tech_gender: formData.tech_gender,
        tech_age: formData.tech_age,
        tech_ft_in: formData.tech_ft_in,
        tech_height_cm: formData.tech_height_cm,
        tech_weight: formData.tech_weight,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_unit_type: "lbs", // lbs  kg
      tech_stage: "child",
      tech_gender: "Male",
      tech_age: "15",
      tech_ft_in: "69",
      tech_height_cm: "175",
      tech_weight: "160",
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

          <div className="row">
            <div className="mt-2 lg:w-[70%] w-full mx-auto">
              <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-2 mt-4">
                <div className="px-2 py-1 flex items-end">
                  <div className="col-12  mx-auto mt-2 w-full">
                    <input
                      type="hidden"
                      name="tech_unit_type"
                      id="calculator_time"
                      value={formData.tech_unit_type}
                    />
                    <div className="grid grid-cols-12 gap-2 p-1 items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                      <div className="col-span-6">
                        <div
                          className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                            formData.tech_unit_type === "lbs" ? "tagsUnit" : ""
                          }`}
                          id="lbs"
                          onClick={() => {
                            setFormData({ ...formData, tech_unit_type: "lbs" });
                            setResult(null);
                            setFormError(null);
                          }}
                        >
                          {data?.payload?.tech_lang_keys["imperial"]}
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div
                          className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                            formData.tech_unit_type === "kg" ? "tagsUnit" : ""
                          }`}
                          id="kg"
                          onClick={() => {
                            setFormData({ ...formData, tech_unit_type: "kg" });
                            setResult(null);
                            setFormError(null);
                          }}
                        >
                          {data?.payload?.tech_lang_keys["metric"]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-2 py-1">
                  <label htmlFor="tech_stage" className="label">
                    {data?.payload?.tech_lang_keys["age_stages"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_stage"
                      id="tech_stage"
                      value={formData.tech_stage}
                      onChange={handleChange}
                    >
                      <option value="child">Child & Teen</option>
                      <option value="adult">Adult</option>
                    </select>
                  </div>
                </div>

                {formData.tech_unit_type == "lbs" && (
                  <>
                    <div className="px-2 py-1">
                      <label htmlFor="tech_gender" className="label">
                        {data?.payload?.tech_lang_keys["gen"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_gender"
                          id="tech_gender"
                          value={formData.tech_gender}
                          onChange={handleChange}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                    {formData.tech_stage == "child" && (
                      <>
                        <div className="px-2 py-1 ">
                          <label htmlFor="tech_age" className="label">
                            {data?.payload?.tech_lang_keys["age"]}:
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_age"
                              id="tech_age"
                              className="input my-2"
                              aria-label="input"
                              min="1"
                              max="20"
                              value={formData.tech_age}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="px-2 py-1 ">
                      <label htmlFor="tech_ft_in" className="label">
                        {data?.payload?.tech_lang_keys["height"]} (ft/in)
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_ft_in"
                          id="tech_ft_in"
                          value={formData.tech_ft_in}
                          onChange={handleChange}
                        >
                          <option value="55">4ft 7in</option>
                          <option value="56">4ft 8in</option>
                          <option value="57">4ft 9in</option>
                          <option value="58">4ft 10in</option>
                          <option value="59">4ft 11in</option>
                          <option value="60">5ft 0in</option>
                          <option value="61">5ft 1in</option>
                          <option value="62">5ft 2in</option>
                          <option value="63">5ft 3in</option>
                          <option value="64">5ft 4in</option>
                          <option value="65">5ft 5in</option>
                          <option value="66">5ft 6in</option>
                          <option value="67">5ft 7in</option>
                          <option value="68">5ft 8in</option>
                          <option value="69">5ft 9in</option>
                          <option value="70">5ft 10in</option>
                          <option value="71">5ft 11in</option>
                          <option value="72">6ft 0in</option>
                          <option value="73">6ft 1in</option>
                          <option value="74">6ft 2in</option>
                          <option value="75">6ft 3in</option>
                          <option value="76">6ft 4in</option>
                          <option value="77">6ft 5in</option>
                          <option value="78">6ft 6in</option>
                          <option value="79">6ft 7in</option>
                          <option value="80">6ft 8in</option>
                          <option value="81">6ft 9in</option>
                          <option value="82">6ft 10in</option>
                          <option value="83">6ft 11in</option>
                          <option value="84">7ft 0in</option>
                        </select>
                      </div>
                    </div>
                    <div className="px-2 py-1 ">
                      <label htmlFor="tech_weight" className="label">
                        {data?.payload?.tech_lang_keys["weight"]} (lbs):
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_weight"
                          id="tech_weight"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_weight}
                          onChange={handleChange}
                        />
                        <span className="input_unit">lbs</span>
                      </div>
                    </div>
                  </>
                )}

                {formData.tech_unit_type == "kg" && (
                  <>
                    <div className="px-2 py-1">
                      <label htmlFor="tech_gender" className="label">
                        {data?.payload?.tech_lang_keys["gen"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_gender"
                          id="tech_gender"
                          value={formData.tech_gender}
                          onChange={handleChange}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                    {formData.tech_stage == "child" && (
                      <>
                        <div className="px-2 py-1 ">
                          <label htmlFor="tech_age" className="label">
                            {data?.payload?.tech_lang_keys["age"]}:
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_age"
                              id="tech_age"
                              className="input my-2"
                              aria-label="input"
                              min="1"
                              max="20"
                              value={formData.tech_age}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="px-2 py-1  ">
                      <label htmlFor="tech_height_cm" className="label">
                        {data?.payload?.tech_lang_keys["height"]} (cm):
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_height_cm"
                          id="tech_height_cm"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_height_cm}
                          onChange={handleChange}
                        />
                        <span className="input_unit">cm</span>
                      </div>
                    </div>
                    <div className="px-2 py-1 ">
                      <label htmlFor="tech_weight" className="label">
                        {data?.payload?.tech_lang_keys["weight"]} (kg):
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_weight"
                          id="tech_weight"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_weight}
                          onChange={handleChange}
                        />
                        <span className="input_unit">kg</span>
                      </div>
                    </div>
                  </>
                )}
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
              <div className="w-full  mx-auto px-1 py-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />
                  <div className="rounded-lg p-1 flex items-center justify-center">
                    <div className="col-12  rounded-lg ">
                      <div className="flex flex-wrap justify-center my-2 ">
                        {result?.tech_BMI ? (
                          <>
                            <div className="lg:w-7/12 lg:pr-3">
                              <div className="text-center pt-1 pb-2">
                                <p className="bg-blue-500 text-white font-s-13 relative inline-block rounded-full shadow-lg p-3">
                                  {data?.payload?.tech_lang_keys["your_bmi"]}
                                </p>
                                <p className="font-s-13 text-xl font-bold text-gray-700">
                                  {Math.round(result?.tech_BMI * 10) / 10}
                                </p>
                              </div>

                              <div className="grid grid-cols-4 mt-6 relative">
                                <div
                                  className="speech-bubble-area text-center radius-5 pt-2px rounded"
                                  style={{
                                    position: "absolute",
                                    width: "18%",
                                    top: "-29px",
                                    background: result?.tech_color,
                                    left: `${result?.tech_left}%`,
                                  }}
                                >
                                  <div className="speech-bubble text-white font-s-13 relative">
                                    <div
                                      style={{
                                        content: '""',
                                        position: "absolute",
                                        width: 0,
                                        height: 0,
                                        bottom: 0,
                                        left: "40%",
                                        border: "8px solid transparent",
                                        borderBottom: 0,
                                        marginBottom: "-7px",
                                        borderTopColor: result?.tech_color,
                                      }}
                                    ></div>
                                    {result?.tech_BMI}
                                  </div>
                                </div>

                                <div className="text-center bg-blue-500 py-2 px-1 transition transform hover:scale-105 rounded-tl-[25px] rounded-bl-[25px]">
                                  <p className="text-white text-sm">
                                    {data?.payload?.tech_lang_keys["underw"]}
                                  </p>
                                  <p className="text-white text-sm">&lt;5</p>
                                </div>

                                <div className="text-center bg-green-500 py-2 px-1 transition transform hover:scale-105">
                                  <p className="text-white text-sm">
                                    {data?.payload?.tech_lang_keys["health"]}
                                  </p>
                                  <p className="text-white text-sm">5 - 84.9</p>
                                </div>

                                <div className="text-center bg-yellow-500 py-2 px-1 transition transform hover:scale-105">
                                  <p className="text-white text-sm">
                                    {data?.payload?.tech_lang_keys["overw"]}
                                  </p>
                                  <p className="text-white text-sm">
                                    85 - 94.9
                                  </p>
                                </div>

                                <div className="text-center bg-red-200 py-2 px-1 transition transform hover:scale-105 rounded-tr-[25px] rounded-br-[25px]">
                                  <p className="text-white text-sm">
                                    {data?.payload?.tech_lang_keys["ob"]}
                                  </p>
                                  <p className="text-white text-sm">&gt;95</p>
                                </div>
                              </div>
                              <p className="mt-4 text-center text-lg text-gray-700">
                                {result?.tech_under
                                  ? data?.payload?.tech_lang_keys["under"]
                                  : result?.tech_healthy
                                  ? data?.payload?.tech_lang_keys["healthy"]
                                  : result?.tech_over
                                  ? data?.payload?.tech_lang_keys["over"]
                                  : result?.tech_obese1
                                  ? data?.payload?.tech_lang_keys["obese1"]
                                  : result?.tech_obese2
                                  ? data?.payload?.tech_lang_keys["obese2"]
                                  : result?.tech_obese3
                                  ? data?.payload?.tech_lang_keys["obese3"]
                                  : null}
                              </p>

                              <p className="mt-2 text-center text-xl font-bold text-blue-600">
                                {data?.payload?.tech_lang_keys["range"]}
                              </p>

                              <p className="mt-1 text-center text-gray-600">
                                {data?.payload?.tech_lang_keys["w_r"]}
                              </p>

                              <p className="text-center text-2xl font-bold text-gray-800">
                                {result?.tech_ibw}
                              </p>
                              <p className="mt-4 text-center">
                                <strong>
                                  <span className="text-blue-500 text-lg">
                                    {data?.payload?.tech_lang_keys["your_pi"]}
                                  </span>
                                  <br />
                                  <span className="text-2xl">
                                    {result?.tech_PI} kg/m<sup>3</sup>
                                  </span>
                                </strong>
                              </p>
                            </div>
                            <div className="lg:w-5/12 lg:pl-3 mt-6 lg:mt-0">
                              <div className="w-full overflow-auto">
                                <table className="w-full border border-blue-500 rounded-lg text-sm">
                                  <thead>
                                    <tr className="bg-blue-500  text-white text-center">
                                      <th className="p-2 rounded-tl-lg">BMI</th>
                                      <th className="p-2 rounded-tr-lg">
                                        {
                                          data?.payload?.tech_lang_keys[
                                            "classi"
                                          ]
                                        }
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr
                                      className={`text-center ${
                                        result?.tech_under
                                          ? result.tech_under
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2 border-b border-gray-300 text-center">
                                        &lt; 18.5
                                      </td>
                                      <td className="p-2 border-b border-gray-300 text-center">
                                        {
                                          data?.payload?.tech_lang_keys[
                                            "underw"
                                          ]
                                        }
                                      </td>
                                    </tr>
                                    <tr
                                      className={`text-center ${
                                        result?.tech_healthy
                                          ? result.tech_healthy
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2 border-b border-gray-300 text-center">
                                        18.5 - 24.9
                                      </td>
                                      <td className="p-2 border-b border-gray-300 text-center">
                                        {
                                          data?.payload?.tech_lang_keys[
                                            "healthyw"
                                          ]
                                        }
                                      </td>
                                    </tr>
                                    <tr
                                      className={`text-center ${
                                        result?.tech_over
                                          ? result.tech_over
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2 border-b border-gray-300 text-center">
                                        25 - 29.9
                                      </td>
                                      <td className="p-2 border-b border-gray-300 text-center">
                                        {data?.payload?.tech_lang_keys["overw"]}
                                      </td>
                                    </tr>
                                    <tr
                                      className={`text-center ${
                                        result?.tech_obese1
                                          ? result.tech_obese1
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2 border-b border-gray-300 text-center">
                                        &gt;30 - 34.9
                                      </td>
                                      <td className="p-2 border-b border-gray-300 text-center">
                                        {
                                          data?.payload?.tech_lang_keys[
                                            "obese1w"
                                          ]
                                        }
                                      </td>
                                    </tr>
                                    <tr
                                      className={`text-center ${
                                        result?.tech_obese2
                                          ? result.tech_obese2
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2 border-b border-gray-300 text-center">
                                        &gt;35 - 39.9
                                      </td>
                                      <td className="p-2 border-b border-gray-300 text-center">
                                        {
                                          data?.payload?.tech_lang_keys[
                                            "obese2w"
                                          ]
                                        }
                                      </td>
                                    </tr>
                                    <tr
                                      className={`text-center ${
                                        result?.tech_obese3
                                          ? result.tech_obese3
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2 border-b border-gray-300 text-center rounded-bl-lg">
                                        40 &gt;
                                      </td>
                                      <td className="p-2 border-b border-gray-300 text-center rounded-br-lg">
                                        {
                                          data?.payload?.tech_lang_keys[
                                            "obese3w"
                                          ]
                                        }
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="w-full mt-4">
                                <p className="text-lg text-blue-500 font-bold">
                                  {data?.payload?.tech_lang_keys["metter"]}
                                </p>
                                <ul className="list-disc pl-6 mt-2 text-gray-700">
                                  <li className="py-1">
                                    {data?.payload?.tech_lang_keys["metter1"]}
                                  </li>
                                  <li className="py-1">
                                    {data?.payload?.tech_lang_keys["metter2"]}
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="w-full mt-6 py-4">
                              <div className="flex flex-col md:flex-row gap-3">
                                <img
                                  src="/images/all_calculators/bmitable.webp"
                                  className="md:w-1/2 rounded-lg shadow-md"
                                  alt="Body Mass Index (BMI) Table"
                                />
                                <img
                                  src="/images/all_calculators/bmigraph.png"
                                  className="md:w-1/2 rounded-lg shadow-md"
                                  alt="Body Mass Index (BMI) Chart"
                                />
                              </div>
                              <div className="md:w-2/3 text-center mt-4 mx-auto">
                                <p className="w-full text-gray-800">
                                  <b>{data?.payload?.tech_lang_keys["wthr"]}</b>
                                </p>
                              </div>
                            </div>
                          </>
                        ) : result?.tech_BMI_kid ? (
                          <>
                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-12 md:col-span-6  bg-sky bordered rounded-lg  lg:p-4 md:p-4 p-2">
                                <div className="text-center mb-5">
                                  <p className="inline-block bg-blue-500 text-white text-lg px-4 py-1 rounded-full shadow-lg">
                                    <strong className="text-white">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "child_bmi"
                                        ]
                                      }
                                    </strong>
                                  </p>
                                </div>
                                <div className="text-center mb-9">
                                  <p className="text-4xl font-bold text-green-500">
                                    {Number(result?.tech_BMI_kid).toFixed(2)}
                                  </p>
                                  <p className="text-2xl font-semibold text-blue-500">
                                    {result?.tech_Status}
                                  </p>
                                </div>

                                <div className="flex mt-5 relative">
                                  <div
                                    className="speech-bubble-area text-center radius-5 pt-2px rounded"
                                    style={{
                                      position: "absolute",
                                      width: "18%",
                                      top: "-29px",
                                      background: result?.tech_color,
                                      left: `${result?.tech_left}%`,
                                    }}
                                  >
                                    <div className="speech-bubble text-white font-s-13 relative">
                                      <div
                                        style={{
                                          content: '""',
                                          position: "absolute",
                                          width: 0,
                                          height: 0,
                                          bottom: 0,
                                          left: "40%",
                                          border: "8px solid transparent",
                                          borderBottom: 0,
                                          marginBottom: "-7px",
                                          borderTopColor: result?.tech_color,
                                        }}
                                      ></div>
                                      {result?.tech_percent}%
                                    </div>
                                  </div>
                                  <div className="w-1/6 bg-blue-500 text-white text-sm py-2 rounded-l-full text-center">
                                    <p className="text-white">&lt; 5%</p>
                                  </div>
                                  <div className="w-5/12 bg-green-500 text-white text-sm py-2 text-center">
                                    <p className="text-white">5 - 84.9%</p>
                                  </div>
                                  <div className="w-3/12 bg-yellow-500 text-white text-sm py-2 text-center">
                                    <p className="text-white">85 - 94.9%</p>
                                  </div>
                                  <div className="w-1/6 bg-red-500 text-white text-sm py-2 rounded-r-full text-center">
                                    <p className="text-white">&gt; 95%</p>
                                  </div>
                                </div>

                                <p className="w-full mt-4 text-center text-lg">
                                  <strong className="text-blue-500">
                                    {data?.payload?.tech_lang_keys["range1"]}
                                  </strong>
                                </p>
                              </div>
                              <div className="col-span-12 md:col-span-6  bordered bg-sky rounded-lg lg:p-4 md:p-4 p-2">
                                <div className="overflow-auto">
                                  <table className="w-full bordered text-sm">
                                    <thead className="bg-blue-600  text-white text-center">
                                      <tr>
                                        <th className="py-2 rounded-tl-lg text-white">
                                          {data?.payload?.tech_lang_keys["per"]}
                                        </th>
                                        <th className="py-2 rounded-tr-lg text-white">
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "classi"
                                            ]
                                          }
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr
                                        className={`text-center ${
                                          result?.tech_under
                                            ? result.tech_under
                                            : ""
                                        }`}
                                      >
                                        <td className="py-2 border-b text-center">
                                          &lt; 5%
                                        </td>
                                        <td className="py-2 border-b text-center">
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "underw"
                                            ]
                                          }
                                        </td>
                                      </tr>
                                      <tr
                                        className={`text-center ${
                                          result?.tech_healthy
                                            ? result.tech_healthy
                                            : ""
                                        }`}
                                      >
                                        <td className="py-2 border-b text-center">
                                          5% - 84.9%
                                        </td>
                                        <td className="py-2 border-b text-center">
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "healthyw"
                                            ]
                                          }
                                        </td>
                                      </tr>
                                      <tr
                                        className={`text-center ${
                                          result?.tech_over
                                            ? result.tech_over
                                            : ""
                                        }`}
                                      >
                                        <td className="py-2 border-b text-center">
                                          85% - 94.9%
                                        </td>
                                        <td className="py-2 border-b text-center">
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "overw"
                                            ]
                                          }
                                        </td>
                                      </tr>
                                      <tr
                                        className={`text-center ${
                                          result?.tech_obese1
                                            ? result.tech_obese1
                                            : ""
                                        }`}
                                      >
                                        <td className="py-2 border-b text-center rounded-bl-lg">
                                          &gt; 95%
                                        </td>
                                        <td className="py-2 border-b text-center rounded-br-lg">
                                          {data?.payload?.tech_lang_keys["ob"]}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <p className="col-span-12 text-lg text-center mt-4">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["per"]}:
                                  </strong>
                                  <strong className="text-green-500">
                                    {result?.tech_percent}%
                                  </strong>
                                </p>
                              </div>
                            </div>
                            <div className="w-full text-center mt-4">
                              <strong className="text-green-500 text-lg">
                                {result?.tech_under
                                  ? data?.payload?.tech_lang_keys["child1"]
                                  : result?.tech_healthy
                                  ? data?.payload?.tech_lang_keys["child2"]
                                  : result?.tech_over
                                  ? data?.payload?.tech_lang_keys["child3"]
                                  : result?.tech_obese1
                                  ? data?.payload?.tech_lang_keys["child4"]
                                  : ""}
                              </strong>
                            </div>
                          </>
                        ) : null}
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

export default BMICalculator;

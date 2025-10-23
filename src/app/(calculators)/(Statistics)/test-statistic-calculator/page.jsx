"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTestStatisticCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TestStatisticCalculator = () => {
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
    tech_test_radio: "data", // data sem  sd
    tech_row_data: "78\n\n82\n\n86\n\n85\n\n73\n\n82",
    tech_row_data1: "69\n\n50\n\n34\n\n18\n\n66\n\n55",
    tech_mean: "100",
    tech_sem: "3",
    tech_n: "5",
    tech_mean1: "50",
    tech_sem1: "30",
    tech_n1: "17",
    tech_mean_sec: "100",
    tech_sd_sec: "3",
    tech_n_sec: "5",
    tech_mean_sec1: "50",
    tech_sd_sec1: "30",
    tech_n_sec2: "17",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTestStatisticCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_test_radio) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_test_radio: formData.tech_test_radio,
        tech_row_data: formData.tech_row_data,
        tech_row_data1: formData.tech_row_data1,
        tech_mean: formData.tech_mean,
        tech_sem: formData.tech_sem,
        tech_n: formData.tech_n,
        tech_mean1: formData.tech_mean1,
        tech_sem1: formData.tech_sem1,
        tech_n1: formData.tech_n1,
        tech_mean_sec: formData.tech_mean_sec,
        tech_sd_sec: formData.tech_sd_sec,
        tech_n_sec: formData.tech_n_sec,
        tech_mean_sec1: formData.tech_mean_sec1,
        tech_sd_sec1: formData.tech_sd_sec1,
        tech_n_sec2: formData.tech_n_sec2,
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
      tech_test_radio: "data", // data sem  sd
      tech_row_data: "78\n\n82\n\n86\n\n85\n\n73\n\n82",
      tech_row_data1: "69\n\n50\n\n34\n\n18\n\n66\n\n55",
      tech_mean: "100",
      tech_sem: "3",
      tech_n: "5",
      tech_mean1: "50",
      tech_sem1: "30",
      tech_n1: "17",
      tech_mean_sec: "100",
      tech_sd_sec: "3",
      tech_n_sec: "5",
      tech_mean_sec1: "50",
      tech_sd_sec1: "30",
      tech_n_sec2: "17",
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

  const formatNumber = (num, decimals = 2) => {
    const number = Number(num);
    return isNaN(number) ? "-" : number.toFixed(decimals);
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  mt-3  gap-2">
              <label htmlFor="operations" className="col-span-12 label my-4">
                Select Format
              </label>
              <div className="col-span-12 position-relative">
                <label className="pe-2" htmlFor="data">
                  <input
                    type="radio"
                    name="tech_test_radio"
                    value="data"
                    id="data"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_test_radio === "data"}
                  />
                  <span>Enter the data in row</span>
                </label>
              </div>
              <div className="col-span-12 position-relative">
                <label className="pe-2" htmlFor="sem">
                  <input
                    type="radio"
                    name="tech_test_radio"
                    value="sem"
                    id="sem"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_test_radio === "sem"}
                  />
                  <span>Enter mean, SEM and n</span>
                </label>
              </div>
              <div className="col-span-12 position-relative">
                <label className="pe-2" htmlFor="sd">
                  <input
                    type="radio"
                    name="tech_test_radio"
                    value="sd"
                    id="sd"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_test_radio === "sd"}
                  />
                  <span>Enter mean, SD and n</span>
                </label>
              </div>

              <div className="col-span-12">
                {formData.tech_test_radio === "data" && (
                  <>
                    <div
                      className="grid grid-cols-12  mt-3  lg:gap-8 md:gap-8 gap-1"
                      id="section1"
                    >
                      <div className="col-span-6 px-2" id="div1">
                        <label htmlFor="tech_row_data" className="label">
                          Group One
                        </label>
                        <div className="w-full py-2">
                          <textarea
                            name="tech_row_data"
                            id="tech_row_data"
                            rows="15"
                            className="input textareaInput"
                            aria-label="textarea input"
                            value={formData.tech_row_data || ""}
                            onChange={handleChange}
                            placeholder="78
82
86
85
73
82"
                            style={{ height: "300px" }} // 👈 inline style added here
                          />
                        </div>
                      </div>
                      <div className="col-span-6 px-2" id="div1">
                        <label htmlFor="tech_row_data1" className="label">
                          Group Two
                        </label>
                        <div className="w-full py-2">
                          <textarea
                            name="tech_row_data1"
                            id="tech_row_data1"
                            rows="15"
                            className="input textareaInput"
                            aria-label="textarea input"
                            value={formData.tech_row_data1 || ""}
                            onChange={handleChange}
                            placeholder="69
50
34
18
66
55"
                            style={{ height: "300px" }} // 👈 inline style added here
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="col-span-12">
                  {formData.tech_test_radio === "sem" && (
                    <>
                      <div className="col " id="section2">
                        <div className="grid grid-cols-12 mt-3 lg:gap-8 md:gap-8 gap-1">
                          <div className="col-span-6">
                            <div
                              className="col-6 col-lg-12 px-2 my-3"
                              id="div2"
                            >
                              <label
                                htmlFor="first"
                                className="font-s-14 text-blue"
                                id="text2"
                              >
                                Group 1
                              </label>
                            </div>
                            <div className="col-6 col-lg-12 px-2" id="div3">
                              <label htmlFor="tech_mean" className="label">
                                Mean (x̄)
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_mean"
                                  id="tech_mean"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_mean}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-6 col-lg-12 px-2" id="div4">
                              <label htmlFor="tech_sem" className="label">
                                SEM
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_sem"
                                  id="tech_sem"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_sem}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-6 col-lg-12 px-2" id="div5">
                              <label htmlFor="tech_n" className="label">
                                Sample Size (n)
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_n"
                                  id="tech_n"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_n}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-span-6">
                            <div
                              className="col-6 col-lg-12 px-2 my-3"
                              id="group2-container"
                            >
                              <label
                                htmlFor="group2"
                                id="group2-label"
                                className="font-s-14 text-blue"
                              >
                                Group 2
                              </label>
                            </div>

                            <div className="col-6 col-lg-12 px-2" id="div3">
                              <label htmlFor="tech_mean1" className="label">
                                Mean (x̄)
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_mean1"
                                  id="tech_mean1"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_mean1}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-6 col-lg-12 px-2" id="div4">
                              <label htmlFor="tech_sem1" className="label">
                                SEM
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_sem1"
                                  id="tech_sem1"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_sem1}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-6 col-lg-12 px-2" id="div5">
                              <label htmlFor="tech_n1" className="label">
                                Sample Size (n)
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_n1"
                                  id="tech_n1"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_n1}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.tech_test_radio === "sd" && (
                    <>
                      <div className="col " id="section3">
                        <div className="grid grid-cols-12 mt-3 lg:gap-8 md:gap-8 gap-1">
                          <div className="col-span-6">
                            <div
                              className="col-6 col-lg-12 px-2 my-3"
                              id="div6"
                            >
                              <label
                                htmlFor="first"
                                className="font-s-14 text-blue"
                                id="text6"
                              >
                                {" "}
                                Group 1
                              </label>
                            </div>
                            <div className="col-6 col-lg-12 px-2" id="div7">
                              <label htmlFor="tech_mean_sec" className="label">
                                Mean (x̄)
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_mean_sec"
                                  id="tech_mean_sec"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_mean_sec}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-6 col-lg-12 px-2" id="div8">
                              <label htmlFor="tech_sd_sec" className="label">
                                Standard Deviation (SD)
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_sd_sec"
                                  id="tech_sd_sec"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_sd_sec}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-6 col-lg-12 px-2" id="div9">
                              <label htmlFor="tech_n_sec" className="label">
                                Sample Size (n)
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_n_sec"
                                  id="tech_n_sec"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_n_sec}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-span-6">
                            <div
                              className="col-6 col-lg-12 px-2 my-3"
                              id="group3-container"
                            >
                              <label
                                htmlFor="group3"
                                id="group3-label"
                                className="font-s-14 text-blue"
                              >
                                Group 2
                              </label>
                            </div>
                            <div className="col-6 col-lg-12 px-2 " id="div7">
                              <label htmlFor="tech_mean_sec1" className="label">
                                Mean (x̄)
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_mean_sec1"
                                  id="tech_mean_sec1"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_mean_sec1}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-6 col-lg-12 px-2 " id="div8">
                              <label htmlFor="tech_sd_sec1" className="label">
                                Standard Deviation (SD)
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_sd_sec1"
                                  id="tech_sd_sec1"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_sd_sec1}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-6 col-lg-12 px-2 " id="div9">
                              <label htmlFor="tech_n_sec2" className="label">
                                Sample Size (n)
                              </label>
                              <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_n_sec2"
                                  id="tech_n_sec2"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_n_sec2}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
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
                      {result?.tech_test_radio == "data" ? (
                        <>
                          <div className="w-full">
                            <div className="w-full md:w-[70%] lg:w-[70%] mt-2 overflow-auto">
                              <p className="my-2">
                                Values derived from inputs are:
                              </p>
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b w-[70%]">
                                      <strong>T-test</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {formatNumber(result?.tech_tValue)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b w-[70%]">
                                      <strong>Df</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {formatNumber(result?.tech_df)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b w-[70%]">
                                      <strong>
                                        Standard Error of Difference
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {formatNumber(result?.tech_standardError)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b w-[70%]">
                                      <strong>P value</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {formatNumber(result?.tech_pValue, 5)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="w-full mt-3">
                            <div className="w-full md:w-[70%] lg:w-[70%] mt-2 overflow-auto">
                              <table className="w-full text-[16px] text-center">
                                <thead>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>Group</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>Group One</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>Group Two</strong>
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>Mean</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {formatNumber(result?.tech_mean1)}
                                    </td>
                                    <td className="py-2 border-b">
                                      {formatNumber(result?.tech_mean2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>SD</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {formatNumber(result?.tech_sd1)}
                                    </td>
                                    <td className="py-2 border-b">
                                      {formatNumber(result?.tech_sd2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>SEM</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {formatNumber(result?.tech_sem1)}
                                    </td>
                                    <td className="py-2 border-b">
                                      {formatNumber(result?.tech_sem2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>N</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {formatNumber(result?.tech_n1)}
                                    </td>
                                    <td className="py-2 border-b">
                                      {formatNumber(result?.tech_n2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      ) : result?.tech_test_radio == "sem" ? (
                        <>
                          <div className="w-full">
                            <div className="w-full md:w-[70%] lg:w-[70%] mt-2 overflow-auto">
                              <p className="my-2">
                                Values derived from inputs are:
                              </p>
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>T-test</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_tValue).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>Df</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_df).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        Standard Error of Difference
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(
                                        result?.tech_standardError
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>P value</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_pValue).toFixed(5)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="w-full mt-3">
                            <div className="w-full md:w-[70%] lg:w-[70%] mt-2 overflow-auto">
                              <table className="w-full text-[16px] text-center">
                                <thead>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>Group</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>Group One</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>Group Two</strong>
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>Mean</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_mean1).toFixed(2)}
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_mean2).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>SD</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_sd1).toFixed(2)}
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_sd2).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>SEM</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_sem1).toFixed(2)}
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_sem2).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>N</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_n1).toFixed(2)}
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_n2).toFixed(2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      ) : result?.tech_test_radio == "sd" ? (
                        <>
                          <div className="w-full">
                            <div className="w-full md:w-[70%] lg:w-[70%] mt-2 overflow-auto">
                              <p className="my-2">
                                Values derived from inputs are:
                              </p>
                              <table className="w-full text-[16px]">
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>T-test</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_tValue).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>Df</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_df).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      Standard Error of Difference
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_standardError).toFixed(
                                      2
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>P value</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_pValue).toFixed(5)}
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>
                          <div className="w-full mt-3">
                            <div className="w-full md:w-[70%] lg:w-[70%] mt-2 overflow-auto">
                              <table className="w-full text-[16px] text-center">
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>Group</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>Group One</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>Group Two</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>Mean</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_mean1).toFixed(2)}
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_mean2).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>SD</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_sd1).toFixed(2)}
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_sd2).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>SEM</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_sem1).toFixed(2)}
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_sem2).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>N</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_n1).toFixed(2)}
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result?.tech_n2).toFixed(2)}
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>
                        </>
                      ) : null}
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

export default TestStatisticCalculator;

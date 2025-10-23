"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useWordsperminuteCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WordsperMinuteCalculator = () => {
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
    tech_speak_speed: "130",
    tech_ss: "160",
    tech_reading_speed: "230",
    tech_rs: "140",
    tech_select: "2",
    tech_words: "3400",
    tech_x: "34",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWordsperminuteCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_select == 1) {
      if (
        !formData.tech_select ||
        !formData.tech_speak_speed ||
        !formData.tech_ss ||
        !formData.tech_reading_speed ||
        !formData.tech_rs ||
        !formData.tech_words
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_select ||
        !formData.tech_speak_speed ||
        !formData.tech_ss ||
        !formData.tech_reading_speed ||
        !formData.tech_rs ||
        !formData.tech_x
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_speak_speed: formData.tech_speak_speed,
        tech_ss: formData.tech_ss,
        tech_reading_speed: formData.tech_reading_speed,
        tech_rs: formData.tech_rs,
        tech_select: formData.tech_select,
        tech_words: formData.tech_words,
        tech_x: formData.tech_x,
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
      tech_speak_speed: "130",
      tech_ss: "160",
      tech_reading_speed: "230",
      tech_rs: "140",
      tech_select: "2",
      tech_words: "3400",
      tech_x: "34",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  lg:gap-4 md:gap-4 gap-1">
              <p className="mt-2 col-span-12">
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys["1"]}
                </strong>
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_speak_speed" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_speak_speed"
                    id="tech_speak_speed"
                    value={formData.tech_speak_speed}
                    onChange={handleChange}
                  >
                    <option value="100">
                      {data?.payload?.tech_lang_keys["3"]} (100 wpm)
                    </option>
                    <option value="130">
                      {data?.payload?.tech_lang_keys["4"]} (130 wpm)
                    </option>
                    <option value="160">
                      {data?.payload?.tech_lang_keys["5"]} (160 wpm){" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_ss" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_ss"
                    id="tech_ss"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_ss}
                    onChange={handleChange}
                  />
                  <span className="input_unit">wpm</span>
                </div>
              </div>
              <p className="col-span-12">
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys[6]}
                </strong>
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_reading_speed" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_reading_speed"
                    id="tech_reading_speed"
                    value={formData.tech_reading_speed}
                    onChange={handleChange}
                  >
                    <option value="170">
                      {data?.payload?.tech_lang_keys["3"]}(170 wpm)
                    </option>
                    <option value="200">
                      {data?.payload?.tech_lang_keys["4"]}(200 wpm)
                    </option>
                    <option value="230">
                      {data?.payload?.tech_lang_keys["5"]}(230 wpm)
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_rs" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_rs"
                    id="tech_rs"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_rs}
                    onChange={handleChange}
                  />
                  <span className="input_unit">wpm</span>
                </div>
              </div>
              <p className="col-span-12">
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys[8]}
                </strong>
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_select" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_select"
                    id="tech_select"
                    value={formData.tech_select}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_select == "1" && (
                <>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6 words ">
                    <label htmlFor="tech_words" className="label">
                      {data?.payload?.tech_lang_keys["10"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_words"
                        id="tech_words"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_words}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_select == "2" && (
                <>
                  <div className="col-span-12 paragraph ">
                    <label htmlFor="tech_x" className="label">
                      {data?.payload?.tech_lang_keys["10"]}:
                    </label>
                    <div className="w-full py-2">
                      <textarea
                        name="tech_x"
                        id="tech_x"
                        className="input textareaInput"
                        aria-label="textarea input"
                        placeholder="2, 4, 6, 18, 10"
                        value={formData.tech_x || "2, 4, 6, 18, 10"}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="grid grid-cols-12 mt-3  gap-4">
                        <div className="col-span-12 md:col-span-12 lg:col-span-6 text-[16px] border-lg-end pe-lg-3">
                          <p>{data?.payload?.tech_lang_keys[13]}</p>
                          <p className="font-s-25 mt-2">
                            <strong className="text-[#119154]">
                              {result?.tech_speak_time}
                            </strong>
                          </p>
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td width="70%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["13"]} (sec)
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_speak_ans * 60).toFixed(
                                    2
                                  )}
                                  <span className="font-s-14"> sec</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["13"]} (min)
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_speak_ans).toFixed(2)}
                                  <span className="font-s-14"> min</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["13"]} (hrs)
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_speak_ans / 60).toFixed(
                                    2
                                  )}
                                  <span className="font-s-14"> hrs</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["13"]} (days)
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_speak_ans / 1440
                                  ).toFixed(2)}
                                  <span className="font-s-14"> days</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="col-span-12 md:col-span-12 lg:col-span-6 text-[16px] ps-lg-3">
                          <p>{data?.payload?.tech_lang_keys[14]}</p>
                          <p className="font-s-25 mt-2">
                            <strong className="text-[#119154]">
                              {result?.tech_read_time}
                            </strong>
                          </p>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="70%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]} (sec)
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_read_ans * 60).toFixed(
                                    2
                                  )}
                                  <span className="font-s-14"> sec</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]} (min)
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_read_ans, 2).toFixed(2)}
                                  <span className="font-s-14"> min</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]} (hrs)
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_read_ans / 60).toFixed(
                                    2
                                  )}
                                  <span className="font-s-14"> hrs</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]} (days)
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_read_ans / 1440).toFixed(
                                    2
                                  )}
                                  <span className="font-s-14"> days</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
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

export default WordsperMinuteCalculator;

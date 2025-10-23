"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useAngleOfDeviationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AngleOfDeviationCalculator = () => {
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
    tech_incidence: "10",
    tech_incidence_unit: "sign",
    tech_emergence: "35",
    tech_emergence_unit: "right angle",
    tech_prism: "35",
    tech_prism_unit: "minute",
    tech_deviation_unit: "degree",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAngleOfDeviationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_incidence) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_incidence: formData.tech_incidence,
        tech_incidence_unit: formData.tech_incidence_unit,
        tech_emergence: formData.tech_emergence,
        tech_emergence_unit: formData.tech_emergence_unit,
        tech_prism: formData.tech_prism,
        tech_prism_unit: formData.tech_prism_unit,
        tech_deviation_unit: formData.tech_deviation_unit,
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
      tech_incidence: "10",
      tech_incidence_unit: "sign",
      tech_emergence: "35",
      tech_emergence_unit: "right angle",
      tech_prism: "35",
      tech_prism_unit: "minute",
      tech_deviation_unit: "degree",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-8">
                <label htmlFor="tech_incidence" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (I):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_incidence"
                    id="tech_incidence"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_incidence}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-4">
                <label htmlFor="tech_incidence_unit" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_incidence_unit"
                    id="tech_incidence_unit"
                    value={formData.tech_incidence_unit}
                    onChange={handleChange}
                  >
                    <option value="circle">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="cycle">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="degree">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="gon">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="gradian">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="mil">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="milliradian">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="minute">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="minutes of arc">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="point">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="quadrant">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="quartercircle">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="radian">
                      {data?.payload?.tech_lang_keys["18"]}
                    </option>
                    <option value="revolution">
                      {data?.payload?.tech_lang_keys["19"]}
                    </option>
                    <option value="right angle">
                      {data?.payload?.tech_lang_keys["20"]}
                    </option>
                    <option value="second">
                      {data?.payload?.tech_lang_keys["21"]}
                    </option>
                    <option value="semicircle">
                      {data?.payload?.tech_lang_keys["22"]}
                    </option>
                    <option value="sextant">
                      {data?.payload?.tech_lang_keys["23"]}
                    </option>
                    <option value="sign">
                      {data?.payload?.tech_lang_keys["24"]}
                    </option>
                    <option value="turn">
                      {data?.payload?.tech_lang_keys["25"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-8">
                <label htmlFor="tech_emergence" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (E):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_emergence"
                    id="tech_emergence"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_emergence}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-4">
                <label htmlFor="tech_emergence_unit" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_emergence_unit"
                    id="tech_emergence_unit"
                    value={formData.tech_emergence_unit}
                    onChange={handleChange}
                  >
                    <option value="circle">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="cycle">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="degree">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="gon">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="gradian">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="mil">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="milliradian">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="minute">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="minutes of arc">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="point">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="quadrant">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="quartercircle">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="radian">
                      {data?.payload?.tech_lang_keys["18"]}
                    </option>
                    <option value="revolution">
                      {data?.payload?.tech_lang_keys["19"]}
                    </option>
                    <option value="right angle">
                      {data?.payload?.tech_lang_keys["20"]}
                    </option>
                    <option value="second">
                      {data?.payload?.tech_lang_keys["21"]}
                    </option>
                    <option value="semicircle">
                      {data?.payload?.tech_lang_keys["22"]}
                    </option>
                    <option value="sextant">
                      {data?.payload?.tech_lang_keys["23"]}
                    </option>
                    <option value="sign">
                      {data?.payload?.tech_lang_keys["24"]}
                    </option>
                    <option value="turn">
                      {data?.payload?.tech_lang_keys["25"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-8">
                <label htmlFor="tech_prism" className="label">
                  {data?.payload?.tech_lang_keys["3"]} (A):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_prism"
                    id="tech_prism"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_prism}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-4">
                <label htmlFor="tech_prism_unit" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_prism_unit"
                    id="tech_prism_unit"
                    value={formData.tech_prism_unit}
                    onChange={handleChange}
                  >
                    <option value="circle">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="cycle">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="degree">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="gon">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="gradian">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="mil">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="milliradian">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="minute">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="minutes of arc">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="point">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="quadrant">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="quartercircle">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="radian">
                      {data?.payload?.tech_lang_keys["18"]}
                    </option>
                    <option value="revolution">
                      {data?.payload?.tech_lang_keys["19"]}
                    </option>
                    <option value="right angle">
                      {data?.payload?.tech_lang_keys["20"]}
                    </option>
                    <option value="second">
                      {data?.payload?.tech_lang_keys["21"]}
                    </option>
                    <option value="semicircle">
                      {data?.payload?.tech_lang_keys["22"]}
                    </option>
                    <option value="sextant">
                      {data?.payload?.tech_lang_keys["23"]}
                    </option>
                    <option value="sign">
                      {data?.payload?.tech_lang_keys["24"]}
                    </option>
                    <option value="turn">
                      {data?.payload?.tech_lang_keys["25"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_deviation_unit" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_deviation_unit"
                    id="tech_deviation_unit"
                    value={formData.tech_deviation_unit}
                    onChange={handleChange}
                  >
                    <option value="circle">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="cycle">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="degree">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="gon">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="gradian">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="mil">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="milliradian">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="minute">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="minutes of arc">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="point">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="quadrant">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="quartercircle">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="radian">
                      {data?.payload?.tech_lang_keys["18"]}
                    </option>
                    <option value="revolution">
                      {data?.payload?.tech_lang_keys["19"]}
                    </option>
                    <option value="right angle">
                      {data?.payload?.tech_lang_keys["20"]}
                    </option>
                    <option value="second">
                      {data?.payload?.tech_lang_keys["21"]}
                    </option>
                    <option value="semicircle">
                      {data?.payload?.tech_lang_keys["22"]}
                    </option>
                    <option value="sextant">
                      {data?.payload?.tech_lang_keys["23"]}
                    </option>
                    <option value="sign">
                      {data?.payload?.tech_lang_keys["24"]}
                    </option>
                    <option value="turn">
                      {data?.payload?.tech_lang_keys["25"]}
                    </option>
                  </select>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="text-center">
                          <p className="text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["5"]} (D)
                            </strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="md:text-[25px] text-[18px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong>
                                {result?.tech_deviation}{" "}
                                {formData?.tech_deviation_unit}
                              </strong>
                            </p>
                          </div>
                        </div>

                        <p className="col-12 mt-3 text-[18px]">
                          <strong>{data?.payload?.tech_lang_keys[31]}</strong>
                        </p>
                        <p className="col-12 mt-2">
                          ({data?.payload?.tech_lang_keys[26]})
                        </p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[5]} ={" "}
                          {data?.payload?.tech_lang_keys[1]} +{" "}
                          {data?.payload?.tech_lang_keys[2]} -{" "}
                          {data?.payload?.tech_lang_keys[3]}
                        </p>
                        <p className="col-12 mt-2">D= I + E - A</p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[27]}
                        </p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[1]}:{" "}
                          {formData?.tech_incidence} {"->"}{" "}
                          {result?.tech_incidence} (
                          {formData?.tech_incidence_unit})
                        </p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[2]}:{" "}
                          {formData?.tech_emergence} {"->"}{" "}
                          {result?.tech_emergence} (
                          {formData?.tech_emergence_unit})
                        </p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[3]}:{" "}
                          {formData?.tech_prism} {"->"} {result?.tech_prism} (
                          {formData?.tech_prism_unit})
                        </p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[28]}
                        </p>
                        <p className="col-12 mt-2">
                          D= I + E - A {"->"} {result?.tech_incidence} +{" "}
                          {result?.tech_emergence} - {formData?.tech_prism}
                        </p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[29]}
                        </p>
                        <p className="col-12 mt-2">
                          D= {result?.tech_deviation}
                        </p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[30]}
                        </p>
                        <p className="col-12 mt-2">
                          D = {result?.tech_deviation}{" "}
                          {formData?.tech_deviation_unit}
                        </p>
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

export default AngleOfDeviationCalculator;

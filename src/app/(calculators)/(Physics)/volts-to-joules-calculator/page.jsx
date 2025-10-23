"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useVoltsToJoulesCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VoltsToJoulesCalculator = () => {
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
    tech_Solve_unit: "Joules",
    tech_volts: "5",
    tech_coulombs: "12",
    tech_joules: "15",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVoltsToJoulesCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_Solve_unit) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_Solve_unit: formData.tech_Solve_unit,
        tech_volts: formData.tech_volts,
        tech_coulombs: formData.tech_coulombs,
        tech_joules: formData.tech_joules,
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
      tech_Solve_unit: "Joules",
      tech_volts: "5",
      tech_coulombs: "12",
      tech_joules: "15",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[50%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-12">
                <label htmlFor="tech_Solve_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_Solve_unit"
                    id="tech_Solve_unit"
                    value={formData.tech_Solve_unit}
                    onChange={handleChange}
                  >
                    <option value="Joules">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="Volts">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="Coulombs">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_Solve_unit == "Joules" ||
                formData.tech_Solve_unit == "Coulombs") && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="volte"
                  >
                    <label htmlFor="tech_volts" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_volts"
                        id="tech_volts"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_volts}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_Solve_unit == "Joules" ||
                formData.tech_Solve_unit == "Volts") && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="coulomb"
                  >
                    <label htmlFor="tech_coulombs" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_coulombs"
                        id="tech_coulombs"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_coulombs}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_Solve_unit == "Volts" ||
                formData.tech_Solve_unit == "Coulombs") && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="joule"
                  >
                    <label htmlFor="tech_joules" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_joules"
                        id="tech_joules"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_joules}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
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
                            <strong>{formData?.tech_Solve_unit}</strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong className="text-blue">
                                {Number(result?.tech_answer).toFixed(2)}
                              </strong>
                            </p>
                          </div>
                        </div>

                        {formData?.tech_Solve_unit === "Joules" && (
                          <>
                            <p className="col-12 mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[8]}
                              </strong>
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[9]}
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[10]}.
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[7]} ={" "}
                              {data?.payload?.tech_lang_keys[5]} ∗{" "}
                              {data?.payload?.tech_lang_keys[6]}
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[7]} ={" "}
                              {formData?.tech_volts} ∗ {formData?.tech_coulombs}
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[7]} ={" "}
                              {Number(result?.tech_answer).toFixed(2)}
                            </p>
                          </>
                        )}

                        {formData?.tech_Solve_unit === "Volts" && (
                          <>
                            <p className="col-12 mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[8]}
                              </strong>
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[11]}
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[12]}.
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[5]} ={" "}
                              {data?.payload?.tech_lang_keys[7]} /{" "}
                              {data?.payload?.tech_lang_keys[6]}
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[5]} ={" "}
                              {formData?.tech_joules} /{" "}
                              {formData?.tech_coulombs}
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[5]} ={" "}
                              {Number(result?.tech_answer).toFixed(2)}
                            </p>
                          </>
                        )}

                        {formData?.tech_Solve_unit === "Coulombs" && (
                          <>
                            <p className="col-12 mt-3 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[8]}
                              </strong>
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[13]}
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[14]}.
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[6]} ={" "}
                              {data?.payload?.tech_lang_keys[7]} /{" "}
                              {data?.payload?.tech_lang_keys[5]}
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[6]} ={" "}
                              {formData?.tech_joules} / {formData?.tech_volts}
                            </p>
                            <p className="col-12 mt-2">
                              {data?.payload?.tech_lang_keys[6]} ={" "}
                              {Number(result?.tech_answer).toFixed(2)}
                            </p>
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

export default VoltsToJoulesCalculator;

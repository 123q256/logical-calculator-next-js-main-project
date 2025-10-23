"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useAtomicMassCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AtomicMassCalculator = () => {
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
    tech_z: "115",
    tech_n: "34",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAtomicMassCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_z || !formData.tech_n) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_z: Number(formData.tech_z),
        tech_n: Number(formData.tech_n),
      }).unwrap();
      setResult(response?.payload); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_z: "115",
      tech_n: "34",
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
  {
    /* <span className="text-blue input_unit">{currency.symbol}</span> */
  }
  // currency code

  const formatNumberSmart = (num) => {
    const number = Number(num);
    if (isNaN(number)) return "0";
    return Math.abs(number) >= 1e6 || (Math.abs(number) < 1e-4 && number !== 0)
      ? number.toExponential(6)
      : number.toLocaleString(undefined, { maximumFractionDigits: 6 });
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  gap-1 md:gap-2">
              <div className="relative">
                <label htmlFor="tech_z" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (Z):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_z"
                    id="tech_z"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_z}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="relative">
                <label htmlFor="tech_n" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (N):
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  p-3 rounded-lg mt-3">
                      <div className="w-full mt-2">
                        <p>
                          <strong>{data?.payload?.tech_lang_keys["3"]}</strong>
                        </p>
                        <p className="text-[#119154] text-3xl font-semibold">
                          {result?.tech_a}{" "}
                          <span className="text-[#119154] text-xl">u</span>
                        </p>
                        <p>
                          <strong>
                            {data?.payload?.tech_lang_keys["3"]} (SI)
                          </strong>
                        </p>
                        <p className="text-[#119154] text-3xl font-semibold">
                          {formatNumberSmart(result?.tech_asi)} x10
                          <sup className="text-[#119154]">-27</sup>{" "}
                          <span className="text-[#119154] text-xl">kg</span>
                        </p>

                        <div className="w-full overflow-auto mt-2">
                          <table className="w-full border-collapse">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["4"]}
                                </td>
                                <td className="border-b py-2 font-semibold">
                                  {result?.tech_a}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </td>
                                <td className="border-b py-2 font-semibold">
                                  <sup>{result?.tech_a}</sup>
                                  <sub>{formData?.tech_z}</sub>
                                  {result?.tech_symbol}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  className="py-2 text-blue-600 font-semibold"
                                  colSpan="2"
                                >
                                  {result?.tech_stable
                                    ? "Stable atom"
                                    : result?.tech_unstable
                                    ? "Unstable, radioactive atom."
                                    : result?.tech_unobserved
                                    ? "Unobserved atom. Try another combination of protons and neutrons."
                                    : ""}
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

export default AtomicMassCalculator;

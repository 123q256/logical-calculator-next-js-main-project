"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useWaterWeightCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WaterWeightCalculator = () => {
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
    tech_from: "1.0E+16",
    tech_vol: 12,
    tech_temp: 0.98338,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWaterWeightCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_from || !formData.tech_vol || !formData.tech_temp) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_from: formData.tech_from,
        tech_vol: formData.tech_vol,
        tech_temp: formData.tech_temp,
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
      tech_from: "1.0E+16",
      tech_vol: 12,
      tech_temp: 0.98338,
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_from" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_from"
                    id="tech_from"
                    value={formData.tech_from}
                    onChange={handleChange}
                  >
                    <option value="353146667214.89">Cubic Feet [ft³]</option>
                    <option value="6.1023744094732E+14">
                      Cubic Inch [in³]
                    </option>
                    <option value="42267528377304">Cups (US)</option>
                    <option value="40000000000000">Cups (Metric)</option>
                    <option value="2641720523581.5">Gallons (US)</option>
                    <option value="2199692482990.9">Gallons (UK)</option>
                    <option value="10000000000000">Liter [L]</option>
                    <option value="1.0E+16">Milliliters [mL]</option>
                    <option value="21133764188652">Pints (US)</option>
                    <option value="17597539863927">Pints (UK)</option>
                    <option value="10566882094326">Quarts (US) [qt]</option>
                    <option value="8798769931963.5">Quarts (UK)</option>
                    <option value="6.7628045403686E+14">
                      Tablespoons (US)
                    </option>
                    <option value="5.6312127564566E+14">
                      Tablespoons (UK)
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_vol" className="label">
                  {data?.payload?.tech_lang_keys["12"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_vol"
                    id="tech_vol"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_vol}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_temp" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_temp"
                    id="tech_temp"
                    value={formData.tech_temp}
                    onChange={handleChange}
                  >
                    <option value="0.99987">32°F / 0°C</option>
                    <option value="1.00000">39.2°F / 4.0°C</option>
                    <option value="0.99999">40°F / 4.4°C</option>
                    <option value="0.99975">50°F / 10°C</option>
                    <option value="0.99907">60°F / 15.6°C</option>
                    <option value="0.99802">70°F / 21°C (room temp)</option>
                    <option value="0.99669">80°F / 26.7°C</option>
                    <option value="0.99510">90°F / 32.2°C</option>
                    <option value="0.99318">100°F / 37.8°C</option>
                    <option value="0.98870">120°F / 48.9°C</option>
                    <option value="0.98338">140°F / 60°C</option>
                    <option value="0.97729">160°F / 71.1°C</option>
                    <option value="0.97056">180°F / 82.2°C</option>
                    <option value="0.96333">200°F / 93.3°C</option>
                    <option value="0.95865">212°F / 100°C</option>
                  </select>
                </div>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto ">
                          <p className="ftext-[20px] mt-1">
                            <strong>{data?.payload?.tech_lang_keys[14]}</strong>
                          </p>
                          <table className="w-full  lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys[15]} :
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_gram).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys[16]} :
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_lbs).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys[17]} :
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_onz).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys[18]} :
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_kg).toFixed(2)}
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

export default WaterWeightCalculator;

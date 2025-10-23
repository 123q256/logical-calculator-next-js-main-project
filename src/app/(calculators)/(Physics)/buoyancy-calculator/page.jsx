"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBuoyancyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BuoyancyCalculator = () => {
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
    tech_density: "15",
    tech_volume: "10",
    tech_gravity: "5",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBuoyancyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_density ||
      !formData.tech_volume ||
      !formData.tech_gravity
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_density: formData.tech_density,
        tech_volume: formData.tech_volume,
        tech_gravity: formData.tech_gravity,
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
      tech_density: "15",
      tech_volume: "10",
      tech_gravity: "5",
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

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-12 px-2">
                <label htmlFor="tech_gravity" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (g) (m/s^2):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_gravity"
                    id="tech_gravity"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_gravity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 px-2">
                <label htmlFor="tech_volume" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (m^3):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_volume"
                    id="tech_volume"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_volume}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 px-2">
                <label htmlFor="tech_density" className="label">
                  {data?.payload?.tech_lang_keys["3"]} (kg/m^3):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_density"
                    id="tech_density"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_density}
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

                  <div className="rounded-lg ">
                    <div className="w-full  mt-3">
                      <div className="w-full">
                        <div className="text-center">
                          <p className="text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["4"]} (N)
                            </strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong className="text-blue">
                                {Number(result?.tech_answer).toFixed(2)}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <p className="w-full mt-3 text-[18px]">
                          <strong>{data?.payload?.tech_lang_keys[5]}</strong>
                        </p>
                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys[6]}.
                        </p>
                        <p className="w-full mt-2">B=P∗V∗G</p>
                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys[7]}
                        </p>
                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys[8]}
                        </p>
                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys[9]}
                        </p>
                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys[10]}
                        </p>
                        <p className="w-full mt-2">
                          B={formData?.tech_density}∗{formData?.tech_volume}∗
                          {formData?.tech_gravity}
                        </p>
                        <p className="w-full mt-2">B = {result?.tech_answer}</p>
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

export default BuoyancyCalculator;

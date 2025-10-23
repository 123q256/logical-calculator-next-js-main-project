"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDegreesOfFreedomCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DegreesOfFreedomCalculator = () => {
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
    selection: "1", //1 2 3 4 5 6
    sample_size: 2,
    sample_size_one: 5,
    sample_size_two: 4,
    variance_one: 6,
    variance_two: 3,
    c1: 7,
    r1: 2,
    k1: 1.5,
    d1: 2.5,
    d2: 2.7,
    h: 7,
    sample_mean: 3,
    standard_deviation_three: 5,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDegreesOfFreedomCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        selection: formData.selection,
        sample_size: formData.sample_size,
        sample_size_one: formData.sample_size_one,
        sample_size_two: formData.sample_size_two,
        variance_one: formData.variance_one,
        variance_two: formData.variance_two,
        c1: formData.c1,
        r1: formData.r1,
        k1: formData.k1,
        d1: formData.d1,
        d2: formData.d2,
        h: formData.h,
        sample_mean: formData.sample_mean,
        standard_deviation_three: formData.standard_deviation_three,
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
      selection: "1", //1 2 3 4 5 6
      sample_size: 2,
      sample_size_one: 5,
      sample_size_two: 4,
      variance_one: 6,
      variance_two: 3,
      c1: 7,
      r1: 2,
      k1: 1.5,
      d1: 2.5,
      d2: 2.7,
      h: 7,
      sample_mean: 3,
      standard_deviation_three: 5,
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
            <div className="grid grid-cols-12 gap-1 md:gap-2">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="selection" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="selection"
                    id="selection"
                    value={formData.selection}
                    onChange={handleChange}
                  >
                    <option value="1">
                      1-{data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      2-{data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="3">
                      2-{data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                  </select>
                </div>
              </div>
              {(formData.selection == "1" ||
                formData.selection == "5" ||
                formData.selection == "6") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 n">
                    <label htmlFor="sample_size" className="label">
                      {data?.payload?.tech_lang_keys["8"]} (N)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="sample_size"
                        id="sample_size"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.sample_size}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.selection == "2" || formData.selection == "3") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 n1">
                    <label htmlFor="sample_size_one" className="label">
                      {data?.payload?.tech_lang_keys["8"]} (N₁)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="sample_size_one"
                        id="sample_size_one"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.sample_size_one}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 n2">
                    <label htmlFor="sample_size_two" className="label">
                      {data?.payload?.tech_lang_keys["8"]} (N₂)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="sample_size_two"
                        id="sample_size_two"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.sample_size_two}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.selection == "3" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 v1">
                    <label htmlFor="variance_one" className="label">
                      {data?.payload?.tech_lang_keys["9"]} (σ₁)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="variance_one"
                        id="variance_one"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.variance_one}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 v2">
                    <label htmlFor="variance_two" className="label">
                      {data?.payload?.tech_lang_keys["9"]} (σ₂)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="variance_two"
                        id="variance_two"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.variance_two}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.selection == "4" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 c">
                    <label htmlFor="c1" className="label">
                      {data?.payload?.tech_lang_keys["10"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="c1"
                        id="c1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.c1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 r">
                    <label htmlFor="r1" className="label">
                      {data?.payload?.tech_lang_keys["11"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="r1"
                        id="r1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.r1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.selection == "5" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 k">
                    <label htmlFor="k1" className="label">
                      {data?.payload?.tech_lang_keys["12"]} (k)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="k1"
                        id="k1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.k1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* <div className="col-span-6 d1">
                <label htmlFor="d1" className="label">
                    {data?.payload?.tech_lang_keys["13"]}
                      </label>
                      <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="d1"
                        id="d1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.d1}
                        onChange={handleChange}
                      />
                  </div>
            </div>
            <div className="col-span-6 d2">
                <label htmlFor="d2" className="label">
                    {data?.payload?.tech_lang_keys["14"]}
                      </label>
                      <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="d2"
                        id="d2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.d2}
                        onChange={handleChange}
                      />
                  </div>

               
            </div> */}
              {formData.selection == "6" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 h">
                    <label htmlFor="h" className="label">
                      {data?.payload?.tech_lang_keys["15"]} (h)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="h"
                        id="h"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.h}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 x">
                    <label htmlFor="sample_mean" className="label">
                      {data?.payload?.tech_lang_keys["16"]} (x)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="sample_mean"
                        id="sample_mean"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.sample_mean}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 three">
                    <label htmlFor="standard_deviation_three" className="label">
                      {data?.payload?.tech_lang_keys["17"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="standard_deviation_three"
                        id="standard_deviation_three"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.standard_deviation_three}
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
                          <p className="text-[16px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["18"]}
                            </strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong className="text-blue">
                                {result?.tech_degrees_of_freedom}
                              </strong>
                            </p>
                          </div>
                        </div>

                        {result?.tech_t_statistic && (
                          <div className="text-center">
                            <p className="text-[16px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]}
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  {result?.tech_t_statistic}
                                </strong>
                              </p>
                            </div>
                          </div>
                        )}

                        {result?.tech_v1 && (
                          <div className="text-center">
                            <p className="text-[16px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["19"]} (s₁)
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  {result?.tech_v1}
                                </strong>
                              </p>
                            </div>
                          </div>
                        )}

                        {result?.tech_v2 && (
                          <div className="text-center">
                            <p className="text-[16px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["19"]} (s₂)
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  {result?.tech_v2}
                                </strong>
                              </p>
                            </div>
                          </div>
                        )}

                        {result?.tech_d3 && (
                          <div className="text-center">
                            <p className="text-[16px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]}
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  {result?.tech_d3}
                                </strong>
                              </p>
                            </div>
                          </div>
                        )}

                        {result?.tech_d2 && (
                          <div className="text-center">
                            <p className="text-[16px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]}
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  {result?.tech_d2}
                                </strong>
                              </p>
                            </div>
                          </div>
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

export default DegreesOfFreedomCalculator;

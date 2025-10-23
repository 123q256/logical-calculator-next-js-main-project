"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePriceElasticityOfDemandCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PriceElasticityOfDemandCalculator = () => {
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
    tech_unit_type: "", //  Revenue
    tech_method: "1", //  1  2  3
    tech_prince: 16.66,
    tech_quantity: 8.823,
    tech_n_q: 234,
    tech_i_q: 56,
    tech_n_p: 234,
    tech_i_p: 13,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePriceElasticityOfDemandCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_i_p ||
      !formData.tech_n_p ||
      !formData.tech_i_q ||
      !formData.tech_n_q
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_method: formData.tech_method,
        tech_prince: formData.tech_prince,
        tech_quantity: formData.tech_quantity,
        tech_i_p: formData.tech_i_p,
        tech_n_p: formData.tech_n_p,
        tech_i_q: formData.tech_i_q,
        tech_n_q: formData.tech_n_q,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_unit_type: "", //  Revenue
      tech_method: "1", //  1  2  3
      tech_prince: 16.66,
      tech_quantity: 8.823,
      tech_n_q: 234,
      tech_i_q: 56,
      tech_n_p: 234,
      tech_i_p: 13,
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div
              className="grid grid-cols-12 mt-3  gap-4"
              id="price-elasticity"
            >
              <div className="col-span-12 input-field hidden">
                <div className="col-lg-12 col-12 px-2 pe-lg-12">
                  <label htmlFor="tech_method" className="label">
                    {data?.payload?.tech_lang_keys["met"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_method"
                      id="tech_method"
                      value={formData.tech_method}
                      onChange={handleChange}
                    >
                      <option value="1">
                        {data?.payload?.tech_lang_keys["m1"]}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-span-12  midpoint">
                <div className="grid grid-cols-12 mt-3  gap-4">
                  <div className="col-span-6">
                    <label htmlFor="tech_i_p" className="label">
                      {data?.payload?.tech_lang_keys["i_p"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_i_p"
                        id="tech_i_p"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_i_p}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_n_p" className="label">
                      {data?.payload?.tech_lang_keys["n_p"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_n_p"
                        id="tech_n_p"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_n_p}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_i_q" className="label">
                      {data?.payload?.tech_lang_keys["i_q"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_i_q"
                        id="tech_i_q"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_i_q}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_n_q" className="label">
                      {data?.payload?.tech_lang_keys["n_q"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_n_q"
                        id="tech_n_q"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_n_q}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12   hidden change">
                <div className="col-lg-6 col-12 px-2 pe-lg-4">
                  <label htmlFor="tech_quantity" className="label">
                    {data?.payload?.tech_lang_keys["n_q"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_quantity"
                      id="tech_quantity"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_quantity}
                      onChange={handleChange}
                    />
                    <span className="text-blue input_unit">%</span>
                  </div>
                </div>
                <div className="col-lg-6 col-12 px-2 ps-lg-4">
                  <label htmlFor="tech_prince" className="label">
                    {data?.payload?.tech_lang_keys["q_ch"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_prince"
                      id="tech_prince"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_prince}
                      onChange={handleChange}
                    />
                    <span className="text-blue input_unit">%</span>
                  </div>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[16px]">
                        {!result?.tech_rev && (
                          <>
                            <p className="col py-3 border-b">
                              {data?.payload?.tech_lang_keys["ans"]} ={" "}
                              <strong>{result?.tech_PED}</strong>
                            </p>
                            <p className="col py-3 border-b">
                              {data?.payload?.tech_lang_keys["ans_type"]} ={" "}
                              <strong>{result?.tech_type}</strong>
                            </p>
                            <div className="w-full md:w-[60%] lg:w-[60%] my-2">
                              <img
                                src={`/images/all_calculators/${result?.tech_type}.png`}
                                alt={`${result?.tech_type} Image`}
                                width="250px"
                                height="100%"
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                            <p className="col py-3 border-b">
                              {data?.payload?.tech_lang_keys["sum"]}{" "}
                              <span>
                                {data?.payload?.tech_lang_keys["aone"]}{" "}
                                {result?.tech_PED}%{" "}
                                {data?.payload?.tech_lang_keys["bcz"]}
                              </span>
                            </p>
                          </>
                        )}

                        {(formData?.tech_method === "1" ||
                          formData?.tech_method === "2" ||
                          result?.tech_rev) && (
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="py-3 border-b" width="50%">
                                  {data?.payload?.tech_lang_keys["i_r"]}
                                </td>
                                <td className="py-3 border-b">
                                  ={" "}
                                  {result?.tech_i_r
                                    ? result.tech_i_r + currency.symbol
                                    : "00 " + currency.symbol}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3 border-b" width="50%">
                                  {data?.payload?.tech_lang_keys["f_r"]}
                                </td>
                                <td className="py-3 border-b">
                                  ={" "}
                                  {result?.tech_f_r
                                    ? result.tech_f_r + currency.symbol
                                    : "00 " + currency.symbol}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3 border-b" width="50%">
                                  {data?.payload?.tech_lang_keys["i_rev"]}
                                </td>
                                <td className="py-3 border-b">
                                  ={" "}
                                  {result?.tech_r_percent
                                    ? result.tech_r_percent + "% "
                                    : "00 %"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
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

export default PriceElasticityOfDemandCalculator;

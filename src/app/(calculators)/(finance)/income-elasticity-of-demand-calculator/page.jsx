"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useIncomeElasticityOfDemandCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const IncomeElasticityOfDemandCalculator = () => {
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
    tech_i_p: 40000,
    tech_n_p: 60000,
    tech_i_q: 4000,
    tech_n_q: 5000,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useIncomeElasticityOfDemandCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
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
      tech_i_p: 40000,
      tech_n_p: 60000,
      tech_i_q: 4000,
      tech_n_q: 5000,
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

          <div className="lg:w-[70%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_i_p" className="label">
                  {data?.payload?.tech_lang_keys["ip"]}:
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
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_n_p" className="label">
                  {data?.payload?.tech_lang_keys["np"]}:
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
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_i_q" className="label">
                  {data?.payload?.tech_lang_keys["iq"]}:
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
                  {data?.payload?.tech_lang_keys["nq"]}:
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
                      <div className="w-full md:w-[80%] lg:w-[80%]  mt-2">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["ans"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.ie).toFixed(4)}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["type"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">{result?.sr}</td>
                            </tr>
                          </tbody>
                        </table>
                        <table className="w-full text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                {data?.payload?.tech_lang_keys["qc"]}
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                <strong> {result?.cq} %</strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                {data?.payload?.tech_lang_keys["ic"]}
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                <strong> {result?.cp} %</strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                {data?.payload?.tech_lang_keys["ir"]}
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                <strong>
                                  {" "}
                                  {currency.symbol}{" "}
                                  {Number(result?.ir).toFixed(2)}{" "}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                {data?.payload?.tech_lang_keys["fr"]}
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                <strong>
                                  {currency.symbol}{" "}
                                  {Number(result?.fr).toFixed(2)}{" "}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                {data?.payload?.tech_lang_keys["ri"]}
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                <strong>{result?.rin} %</strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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

export default IncomeElasticityOfDemandCalculator;

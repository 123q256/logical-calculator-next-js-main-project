"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useAlleleFrequencyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AlleleFrequencyCalculator = () => {
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
    tech_type: "scnd", //  frst   scnd
    tech_operations: 1,
    tech_first: 56,
    tech_second: 54,
    tech_third: 7,
    tech_four: Number(54.67),
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAlleleFrequencyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type || !formData.tech_operations) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_operations: formData.tech_operations,
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
        tech_third: formData.tech_third,
        tech_four: formData.tech_four,
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
      tech_type: "frst", //  frst   scnd
      tech_operations: 1,
      tech_first: 56,
      tech_second: 54,
      tech_third: 7,
      tech_four: 54.67,
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <span className="me-3">
                  <strong>{data?.payload?.tech_lang_keys[1]}:</strong>
                </span>
                <label className="pe-2" htmlFor="frst">
                  <input
                    type="radio"
                    name="tech_type"
                    value="frst"
                    id="frst"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_type === "frst"}
                  />
                  <span>{data?.payload?.tech_lang_keys["2"]}</span>
                </label>

                <label htmlFor="scnd">
                  <input
                    type="radio"
                    name="tech_type"
                    className="mr-2 border"
                    value="scnd"
                    id="scnd"
                    onChange={handleChange}
                    checked={formData.tech_type === "scnd"}
                  />
                  <span>{data?.payload?.tech_lang_keys["3"]}</span>
                </label>
              </div>
              {formData.tech_type === "frst" && (
                <>
                  <div className="col-span-12 mt-3">
                    <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_first"
                            id="tech_first"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_first}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_second" className="label">
                          {data?.payload?.tech_lang_keys["5"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_second"
                            id="tech_second"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_second}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_third" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_third"
                            id="tech_third"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_third}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type === "scnd" && (
                <>
                  <div className="col-span-12 mt-3 ">
                    <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_operations" className="label">
                          {data?.payload?.tech_lang_keys["7"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_operations"
                            id="tech_operations"
                            value={formData.tech_operations}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["8"]}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["9"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_four" className="label">
                          {data?.payload?.tech_lang_keys["10"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_four"
                            id="tech_four"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_four}
                            onChange={handleChange}
                          />
                          <span className="input_unit">%</span>
                        </div>
                      </div>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {formData?.tech_type == "scnd" && (
                          <>
                            {formData?.tech_operations == 1 && (
                              <p className="bg-sky bordered text-[18px] rounded-lg px-3 py-2 mt-2">
                                <span className="text-green font-s-28">
                                  {formData?.tech_four}
                                </span>
                                % = 1 in{" "}
                                <strong className="font-s-20">
                                  {Number(result?.tech_f_ans).toFixed(4)}
                                </strong>{" "}
                                {data?.payload?.tech_lang_keys[12]}
                              </p>
                            )}
                            {formData?.tech_operations == 2 && (
                              <p className="bg-sky bordered text-[18px] rounded-lg px-3 py-2 mt-2">
                                <span className="text-green font-s-28">
                                  {Number(result?.tech_f_ans).toFixed(4)}
                                </span>
                                % = 1 in <strong>{formData?.tech_four}</strong>{" "}
                                {data?.payload?.tech_lang_keys[12]}
                              </p>
                            )}
                          </>
                        )}

                        <p className="bg-sky bordered text-[18px] rounded-lg px-3 py-2 mt-2">
                          <span>{data?.payload?.tech_lang_keys[13]}</span> (p) ={" "}
                          <span className="text-[28px] text-[#119154]">
                            {Number(result?.tech_pfreq).toFixed(4)}
                          </span>{" "}
                          (%)
                        </p>

                        <p className="bg-sky bordered text-[18px] rounded-lg px-3 py-2 mt-2">
                          <span>{data?.payload?.tech_lang_keys[14]}</span> (q) ={" "}
                          <span className="text-[28px] text-[#119154]">
                            {Number(result?.tech_qfreq).toFixed(4)}
                          </span>{" "}
                          (%)
                        </p>

                        <table className="w-full md:w-[80%] lg:w-[80%] mt-3 text-[18px]">
                          <tbody>
                            <tr>
                              <td className="p-2">
                                <span>{data?.payload?.tech_lang_keys[15]}</span>
                              </td>
                              <td>
                                <strong>
                                  p² ={" "}
                                  <span className="text-[#119154]">
                                    {Number(result?.tech_p_square).toFixed(4)}
                                  </span>
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2">
                                <span>{data?.payload?.tech_lang_keys[16]}</span>
                              </td>
                              <td>
                                <strong>
                                  2pq ={" "}
                                  <span className="text-[#119154]">
                                    {Number(result?.tech_p_q).toFixed(4)}
                                  </span>
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2">
                                <span>{data?.payload?.tech_lang_keys[17]}</span>
                              </td>
                              <td>
                                <strong>
                                  q² ={" "}
                                  <span className="text-[#119154]">
                                    {Number(result?.tech_q_square).toFixed(4)}
                                  </span>
                                </strong>
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

export default AlleleFrequencyCalculator;

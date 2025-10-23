"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useLeastToGreatestCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LeastToGreatestCalculator = () => {
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
    tech_x: "5/3, 3 1/2, 33%, 1.33, -3/8, 13",
    tech_order: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLeastToGreatestCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x || !formData.tech_order) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_order: formData.tech_order,
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
      tech_x: "5/3, 3 1/2, 33%, 1.33, -3/8, 13",
      tech_order: "1",
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

          <div className="lg:w-[50%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (,):
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                    value={formData.tech_x || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_order" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_order"
                    id="tech_order"
                    value={formData.tech_order}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
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
                        <div className="w-full mt-2 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="45%">
                                  <strong>
                                    {formData?.tech_order === "1"
                                      ? data?.payload?.tech_lang_keys["5"]
                                      : data?.payload?.tech_lang_keys["6"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Object.keys(result?.tech_ans || {}).map(
                                    (key, index, arr) => {
                                      const isLast = index === arr.length - 1;
                                      const sep =
                                        formData?.tech_order === "1"
                                          ? " < "
                                          : " > ";
                                      return key + (isLast ? "" : sep);
                                    }
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px]">
                          <p className="mt-2 font-bold">
                            {data?.payload?.tech_lang_keys[7]}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[9]}
                          </p>

                          <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                            <table className="w-full text-[16px]">
                              <thead>
                                <tr>
                                  <td className="py-2 border-b" width="45%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}
                                    </strong>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(result?.tech_solve || {}).map(
                                  ([key, value], idx) => (
                                    <tr key={`solve-${idx}`}>
                                      <td className="py-2 border-b">{key}</td>
                                      <td className="py-2 border-b">{value}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[12]}{" "}
                            {formData?.tech_order === "1"
                              ? "Least to Greatest"
                              : "Greatest to Least"}
                          </p>

                          <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                            <table className="w-full text-[16px]">
                              <thead>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}
                                    </strong>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(result?.tech_ans || {}).map(
                                  ([key, value], idx) => (
                                    <tr key={`ans-${idx}`}>
                                      <td className="py-2 border-b">{key}</td>
                                      <td className="py-2 border-b">{value}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[13]}{" "}
                            {formData?.tech_order === "1"
                              ? "Least to Greatest"
                              : "Greatest to Least"}
                          </p>

                          <p className="mt-2">
                            {Object.keys(result?.tech_ans || {}).map(
                              (key, index, arr) => {
                                const isLast = index === arr.length - 1;
                                const sep =
                                  formData?.tech_order === "1" ? " < " : " > ";
                                return key + (isLast ? "" : sep);
                              }
                            )}
                          </p>
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

export default LeastToGreatestCalculator;

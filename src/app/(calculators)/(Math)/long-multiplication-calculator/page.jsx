"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useLongMultiplicationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LongMultiplicationCalculator = () => {
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
    tech_first: "1234",
    tech_second: "123",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLongMultiplicationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_first || !formData.tech_second) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
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
      tech_first: "1234",
      tech_second: "123",
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

  // result

  // JavaScript mein arrays ki length
  const upper = result?.tech_upper || [];
  const lower = result?.tech_lower || [];
  const tech_m_j = result?.tech_m_j || [];
  const final = result?.tech_final || [];
  const tech_col = result?.tech_col || 0;

  const upperCount = upper.length;
  const lowerCount = lower.length;
  const finalCount = final.length;

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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_first" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
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
              <div className="col-span-12">
                <label htmlFor="tech_second" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full font-s-18">
                            <tbody>
                              <tr>
                                <td
                                  className="py-2 border-b"
                                  style={{ width: "60%" }}
                                >
                                  <strong>
                                    {data?.payload?.tech_lang_keys["3"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_answer1}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px]">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["4"]}
                            </strong>
                          </p>
                          {result?.tech_line1 && (
                            <>
                              <p className="mt-2">{result.tech_line1}</p>
                              <p className="mt-2">{result.tech_line2}</p>
                            </>
                          )}

                          <div className="w-full md:w-[60%] lg:w-[60%] my-3 tableAns overflow-auto">
                            <table style={{ borderCollapse: "collapse" }}>
                              <tbody>
                                <tr>
                                  <td style={{ width: 10, height: 10 }}></td>
                                  {Array(tech_col - upperCount)
                                    .fill(null)
                                    .map((_, i) => (
                                      <td
                                        key={"u-empty-" + i}
                                        style={{ width: 20, height: 20 }}
                                      ></td>
                                    ))}
                                  {upper.map((val, i) => (
                                    <td
                                      key={"u-" + i}
                                      style={{ width: 10, height: 10 }}
                                    >
                                      {val}
                                    </td>
                                  ))}
                                </tr>

                                <tr className="bdr_btm">
                                  <td>x</td>
                                  {Array(tech_col - lowerCount)
                                    .fill(null)
                                    .map((_, i) => (
                                      <td key={"l-empty-" + i}></td>
                                    ))}
                                  {lower.map((val, i) => (
                                    <td key={"l-" + i}>{val}</td>
                                  ))}
                                </tr>

                                {tech_m_j.map((row, rowIndex) => {
                                  const rowStr = row.toString();
                                  const countLen = rowStr.length;
                                  const nbrs = rowStr.split("");
                                  return (
                                    <tr key={"mj-" + rowIndex}>
                                      <td>+</td>
                                      {Array(tech_col - countLen - rowIndex)
                                        .fill(null)
                                        .map((_, i) => (
                                          <td key={"mj-empty1-" + i}></td>
                                        ))}
                                      {nbrs.map((val, i) => (
                                        <td key={"mj-val-" + i}>{val}</td>
                                      ))}
                                      {Array(rowIndex)
                                        .fill(null)
                                        .map((_, i) => (
                                          <td key={"mj-empty2-" + i}></td>
                                        ))}
                                    </tr>
                                  );
                                })}

                                <tr className="bdr_top">
                                  <td>=</td>
                                  {Array(tech_col - finalCount)
                                    .fill(null)
                                    .map((_, i) => (
                                      <td key={"f-empty-" + i}></td>
                                    ))}
                                  {final.map((val, i) => (
                                    <td key={"f-" + i}>{val}</td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>

                            {result?.tech_line3 && (
                              <>
                                <p className="mt-2">{result.tech_line3}</p>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys[3]} ={" "}
                                  {result.tech_answer1}
                                </p>
                              </>
                            )}

                            <p className="mb-3 mt-2 text-center">
                              {formData?.tech_first} × {formData?.tech_second} ={" "}
                              {result.tech_answer1}
                            </p>
                          </div>
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

export default LongMultiplicationCalculator;

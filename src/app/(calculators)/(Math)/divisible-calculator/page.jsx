"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDivisibleCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DivisibleCalculator = () => {
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
    tech_no: 45,
    tech_divisible: 5,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDivisibleCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_no: Number(formData.tech_no),
        tech_divisible: Number(formData.tech_divisible),
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
      tech_no: 45,
      tech_divisible: 5,
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

  const counter1 = result?.tech_divisible_array || [];
  const counter2 = result?.tech_number_array || [];
  const counter3 = String(result?.tech_division || "").split("");
  const counter4 = result?.tech_multiply || [];
  const counter5 = result?.tech_read || [];
  const p_length = result?.tech_p_length || [];

  const divisibleNumber = formData?.tech_divisible;
  const divisibilityRules = {
    2: "If the last digit of a number is even (i.e., 0, 2, 4, 6, or 8), then the number is divisible by 2.",
    3: "If you have a number whose sum of the digits is divisible by 3, it means the number is divisible by 3.",
    4: "When the last two digits of a number are divisible by 4, then that number is completely divisible by 4.",
    5: "If the last digit of a number is 0 or 5, it means that the number is perfectly divisible by 5.",
    6: "When a number is divisible by 2 and 3, it means the original number is divisible by 6.",
    7: "If you double the last digit of a number and subtract it from the rest of the number, now if the result is divisible by 7, the original number is divisible by 7.",
    8: "If you have a number whose last three digits form a number divisible by 8, it means the original number is completely divisible by 8.",
    9: "When the sum of the digits of a number is divisible by 9, the original number is completely divisible by 9.",
    10: "When the last digit of a number is 0, then the original number is divisible by 10.",
    11: "A number is divisible by 11 if the difference between the sum of its digits in odd and even positions is divisible by 11.",
    12: "If you have a number that is divisible by both 3 and 4, it means the original number is completely divisible by 12.",
    13: "To determine the divisibility of a number by 13, multiply the last digit of the number by 9, subtract the result from the rest of the number, and if the result is divisible by 13, the original number is also divisible by 13.",
  };

  const summaryText = divisibilityRules[divisibleNumber];

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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_no" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_no"
                    id="tech_no"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_no}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_divisible" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_divisible"
                    id="tech_divisible"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_divisible}
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
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
                      <div className="w-full text-[16px] overflow-auto">
                        <p className="mt-2 text-[20px] mb-2">
                          <strong>
                            {result?.tech_number}{" "}
                            <span className="black-text">
                              {data?.payload?.tech_lang_keys[4]}{" "}
                              {result?.tech_modulus === 0
                                ? data?.payload?.tech_lang_keys[5]
                                : data?.payload?.tech_lang_keys[6]}{" "}
                              {data?.payload?.tech_lang_keys[7]}
                            </span>{" "}
                            {result?.tech_divisible}
                          </strong>
                        </p>

                        <p className="mb-2 text-[20px] text-blue">
                          <strong>Summary:</strong>
                        </p>

                        {summaryText && (
                          <>
                            <strong>
                              Divisibility Rule For {divisibleNumber}:
                            </strong>
                            <p className="mb-3">{summaryText}</p>
                          </>
                        )}

                        <table className="w-full border border-gray-400 border-collapse text-center divisible_calculator">
                          <thead>
                            <tr className="bg-[#2845F5] text-white">
                              <th className="py-2 px-4 bordered border-gray-400">
                                Number
                              </th>
                              <th className="py-2 px-4 bordered border-gray-400">
                                Divisor?
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...Array(12)].map((_, i) => {
                              const divisor = i + 2;
                              const divisible =
                                formData?.tech_no % divisor === 0;
                              return (
                                <tr key={divisor} className="hover:bg-gray-50">
                                  <td className="py-2 px-4 bordered text-center ">
                                    {divisor}
                                  </td>
                                  <td className="py-2 px-4 bordered text-center">
                                    {divisible ? "✅" : "—"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* // <p className="mt-2 font-s-20">
                    //   <strong>
                    //     {result?.tech_number}{" "}
                    //     <span className="black-text">
                    //       {data?.payload?.tech_lang_keys[4]}{" "}
                    //       {result?.tech_modulus === 0
                    //         ? data?.payload?.tech_lang_keys[5]
                    //         : data?.payload?.tech_lang_keys[6]}{" "}
                    //       {data?.payload?.tech_lang_keys[7]}
                    //     </span>{" "}
                    //     {result?.tech_divisible}
                    //   </strong>
                    // </p>
                    // <p className="mt-2 font-bold">Solution</p>
                    // <div className="w-full md:w-[60%] lg:w-[60%] my-3 tableAns">
                    //   <table style={{ borderCollapse: "collapse" }}>
                    //     <tbody>
                    //       <tr>
                    //         {counter1.map((_, i) => (
                    //           <td key={`empty-${i}`} width="20px" height="20px"></td>
                    //         ))}
                    //         {counter3.map((val, i) => (
                    //           <td key={`div-${i}`} className="bdr_btm" width="20px" height="20px">{val}</td>
                    //         ))}
                    //         {(counter2.length - counter3.length > 0) &&
                    //           [...Array(counter2.length - counter3.length)].map((_, i) => (
                    //             <td key={`div-pad-${i}`} className="bdr_btm" width="20px" height="20px"></td>
                    //           ))}
                    //       </tr>

                    //       <tr>
                    //         {counter1.map((val, i) => (
                    //           <td key={`divisor-${i}`} width="20px" height="20px">{val}</td>
                    //         ))}
                    //         {counter2.map((val, i) => (
                    //           <td
                    //             key={`num-${i}`}
                    //             className={i === 0 ? "bdr_rht" : ""}
                    //             width="20px"
                    //             height="20px"
                    //           >
                    //             {val}
                    //           </td>
                    //         ))}
                    //       </tr>

                    //       {counter4.map((mulVal, idx) => {
                    //         const subVal = counter5[idx] || "";
                    //         const mulDigits = String(mulVal).split("");
                    //         const subDigits = String(subVal).split("");
                    //         const space = idx;
                    //         const countLen = counter1.length;

                    //         return (
                    //           <React.Fragment key={`step-${idx}`}>
                    //             <tr>
                    //               {[...Array(countLen + space)].map((_, i) => (
                    //                 <td key={`msp-${i}`} width="10px" height="20px">
                    //                   {i === countLen + space - 1 ? "-" : ""}
                    //                 </td>
                    //               ))}
                    //               {mulDigits.map((digit, i) => (
                    //                 <td
                    //                   key={`mul-${i}`}
                    //                   width="20px"
                    //                   height="20px"
                    //                   style={{ borderBottom: "3px solid black" }}
                    //                 >
                    //                   {digit}
                    //                 </td>
                    //               ))}
                    //               {(counter2.length - space - mulDigits.length + (idx > 0 ? 1 : 0) > 0) &&
                    //                 [...Array(counter2.length - space - mulDigits.length + (idx > 0 ? 1 : 0))].map((_, i) => (
                    //                   <td key={`padm-${i}`} width="20px" height="20px"></td>
                    //                 ))}
                    //             </tr>

                    //             <tr>
                    //               {[...Array(countLen + space)].map((_, i) => (
                    //                 <td key={`ssp-${i}`} width="20px" height="20px"></td>
                    //               ))}
                    //               {subDigits.map((digit, i) => (
                    //                 <td key={`sub-${i}`} width="20px" height="20px">{digit}</td>
                    //               ))}
                    //               {(counter2.length - space - subDigits.length > 0) &&
                    //                 [...Array(counter2.length - space - subDigits.length)].map((_, i) => (
                    //                   <td key={`pads-${i}`} width="20px" height="20px"></td>
                    //                 ))}
                    //             </tr>
                    //           </React.Fragment>
                    //         );
                    //       })}
                    //     </tbody>
                    //   </table>
                    // </div> */}
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

export default DivisibleCalculator;

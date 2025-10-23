"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAnniversaryCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AnniversaryCalculator = () => {
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
    tech_one: "three", // one  two  three
    tech_date: "2025-05-10",
    tech_current_date: "2025-05-16",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAnniversaryCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_one ||
      !formData.tech_date ||
      !formData.tech_current_date
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_one: formData.tech_one,
        tech_date: formData.tech_date,
        tech_current_date: formData.tech_current_date,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_one: "three", // one  two  three
      tech_date: "2025-05-10",
      tech_current_date: "2025-05-16",
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

          <div className="lg:w-[70%] md:w-[95%] mt-4 w-full mx-auto ">
            <div className="w-full mx-auto my-2 ">
              <input
                type="hidden"
                name="tech_one"
                id="calculator_time"
                value={formData.tech_one}
              />
              <div className="grid grid-cols-1  lg:grid-cols-3 md:grid-cols-3  gap-4 flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                <div className="space-y-2  px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_one === "one" ? "tagsUnit" : ""
                    }`}
                    id="one"
                    onClick={() => {
                      setFormData({ ...formData, tech_one: "one" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </div>
                </div>
                <div className="space-y-2  px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_one === "two" ? "tagsUnit" : ""
                    }`}
                    id="two"
                    onClick={() => {
                      setFormData({ ...formData, tech_one: "two" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["3"]}
                  </div>
                </div>
                <div className="space-y-2  px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_one === "three" ? "tagsUnit" : ""
                    }`}
                    id="three"
                    onClick={() => {
                      setFormData({ ...formData, tech_one: "three" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["4"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1  mt-5 lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_date" className="label">
                  {formData?.tech_one === "one"
                    ? data?.payload?.tech_lang_keys["5"]
                    : formData?.tech_one === "two"
                    ? data?.payload?.tech_lang_keys["38"]
                    : data?.payload?.tech_lang_keys["39"]}
                </label>
                <div className=" relative">
                  <input
                    type="date"
                    name="tech_date"
                    id="tech_date"
                    className="input my-2"
                    value={formData.tech_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_current_date" className="label">
                  {data?.payload?.tech_lang_keys["37"]}:
                </label>
                <div className=" relative">
                  <input
                    type="date"
                    name="tech_current_date"
                    id="tech_current_date"
                    className="input my-2"
                    value={formData.tech_current_date}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center ">
                    <div className="w-full bg-light-blue p-3 rounded-lg mt-3">
                      <div className="flex flex-col md:flex-row">
                        <div className=" w-full md:w-[60%] lg:w-[60%] overflow-auto text-[16px]">
                          {formData?.tech_one === "one" ? (
                            <>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="w-3/5 border-b py-2 font-semibold">
                                      {data?.payload?.tech_lang_keys["7"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_anniversaryDate}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 font-semibold">
                                      {data?.payload?.tech_lang_keys["8"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_daysUntilAnniversary} Days
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table className="w-full mt-3">
                                <tbody>
                                  <tr>
                                    <td className="w-3/5 border-b py-2">
                                      {data?.payload?.tech_lang_keys["9"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_yearsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["11"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_yearsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["12"]},{" "}
                                      {result?.tech_monthsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["13"]}, and{" "}
                                      {result?.tech_daysMarried}{" "}
                                      {data?.payload?.tech_lang_keys["14"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["15"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_yearsMarried + 1}{" "}
                                      {data?.payload?.tech_lang_keys["16"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["17"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_yearsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["12"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["18"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_monthsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["13"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["19"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_marriage_age_weeks - 1}{" "}
                                      {data?.payload?.tech_lang_keys["20"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["21"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_marriage_age_days}{" "}
                                      {data?.payload?.tech_lang_keys["14"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["22"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["23"]}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          ) : formData?.tech_one === "two" ? (
                            <>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="w-3/5 border-b py-2 font-semibold">
                                      {data?.payload?.tech_lang_keys["7"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_anniversaryDate}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 font-semibold">
                                      {data?.payload?.tech_lang_keys["8"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_daysUntilAnniversary} Days
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table className="w-full mt-3">
                                <tbody>
                                  <tr>
                                    <td className="w-3/5 border-b py-2">
                                      {data?.payload?.tech_lang_keys["9"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_yearsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["24"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["25"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_yearsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["12"]},{" "}
                                      {result?.tech_monthsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["13"]}, and{" "}
                                      {result?.tech_daysMarried}{" "}
                                      {data?.payload?.tech_lang_keys["14"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["26"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_yearsMarried + 1}{" "}
                                      {data?.payload?.tech_lang_keys["16"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["27"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_yearsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["12"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["28"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_monthsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["13"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["29"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_marriage_age_weeks - 1}{" "}
                                      {data?.payload?.tech_lang_keys["20"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["30"]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_marriage_age_days} Days
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          ) : (
                            <>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="w-3/5 border-b py-2 font-semibold">
                                      {data?.payload?.tech_lang_keys["7"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_anniversaryDate}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 font-semibold">
                                      {data?.payload?.tech_lang_keys["8"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_daysUntilAnniversary} Days
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table className="w-full mt-3">
                                <tbody>
                                  <tr>
                                    <td className="w-3/5 border-b py-2">
                                      {data?.payload?.tech_lang_keys["9"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_yearsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["31"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["32"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_yearsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["12"]},{" "}
                                      {result?.tech_monthsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["13"]}, and{" "}
                                      {result?.tech_daysMarried}{" "}
                                      {data?.payload?.tech_lang_keys["14"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["33"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_yearsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["12"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["34"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_monthsMarried}{" "}
                                      {data?.payload?.tech_lang_keys["13"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["35"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_marriage_age_weeks - 1}{" "}
                                      {data?.payload?.tech_lang_keys["20"]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["36"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_marriage_age_days}{" "}
                                      {data?.payload?.tech_lang_keys["14"]}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          )}
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

export default AnniversaryCalculator;

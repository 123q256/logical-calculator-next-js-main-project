"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePrimeFactorizationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PrimeFactorizationCalculator = () => {
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
    tech_from: 1,
    tech_num: 60,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePrimeFactorizationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_from || !formData.tech_num) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_from: formData.tech_from,
        tech_num: formData.tech_num,
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
      tech_from: 1,
      tech_num: 60,
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

  const lang = data?.payload?.tech_lang_keys;
  // Exponents
  const getExponents = () => {
    if (!result?.tech_Factors) return "";
    const csv = result.tech_Factors.split(" × ");
    const exp = {};
    csv.forEach((val) => {
      exp[val] = (exp[val] || 0) + 1;
    });
    return Object.entries(exp)
      .map(([key, val]) => `${key}<sup className="text-[14px]">${val}</sup>`)
      .join(" × ");
  };

  // Divisors
  const getDivisors = () => {
    const num = formData?.tech_num;
    if (!num) return "";
    const divisors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i == 0) divisors.push(i);
    }
    return divisors.join(", ");
  };

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
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_from" className="label">
                  {data?.payload?.tech_lang_keys["to"]}:
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
                    <option value="1">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_num" className="label">
                  {data?.payload?.tech_lang_keys["input"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_num"
                    id="tech_num"
                    min="1"
                    max="10000000"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_num}
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
                        {result?.tech_prime == 1 ? (
                          <div className="w-full text-center my-2">
                            <p>
                              <strong className="bg-[#2845F5] px-3 py-2 text-[21px] rounded-lg text-white">
                                {result?.tech_Factors}
                              </strong>
                            </p>
                          </div>
                        ) : (
                          <>
                            {formData?.tech_from == 1 ? (
                              <>
                                <div className="w-full mt-2 overflow-auto">
                                  <table className="w-full text-[16px]">
                                    <tbody>
                                      <tr>
                                        <td className="py-2 border-b w-1/2">
                                          <strong>{lang?.prime}</strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_Factors}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="py-2 border-b">
                                          <strong>{lang?.exp}</strong>
                                        </td>
                                        <td
                                          className="py-2 border-b"
                                          dangerouslySetInnerHTML={{
                                            __html: getExponents(),
                                          }}
                                        ></td>
                                      </tr>
                                      <tr>
                                        <td className="py-2 border-b">
                                          <strong>{lang?.csv}</strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_csv}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="py-2 border-b">
                                          <strong>
                                            {lang?.all} {formData?.tech_num}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {getDivisors()}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <div className="w-full text-[16px] overflow-auto">
                                  <p className="my-2">
                                    <strong>{lang?.[7]}</strong>
                                  </p>
                                  <table className="col-2 text-[16px]">
                                    <tbody>
                                      <tr>
                                        <td
                                          dangerouslySetInnerHTML={{
                                            __html: result?.tech_tree || "",
                                          }}
                                        ></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </>
                            ) : formData?.tech_from == 2 ? (
                              <div className="w-full mt-2 overflow-auto">
                                <table
                                  className="w-full text-[16px] text-center"
                                  dangerouslySetInnerHTML={{
                                    __html: result?.tech_table,
                                  }}
                                ></table>
                              </div>
                            ) : formData?.tech_from == 3 ? (
                              <div className="w-full text-center text-[20px]">
                                <p>
                                  {lang?.[8]} {formData?.tech_num}
                                </p>
                                <p className="my-3">
                                  <strong className="bg-[#2845F5] px-3 py-2 text-[21px] rounded-lg text-white">
                                    {result?.tech_list}
                                  </strong>
                                </p>
                              </div>
                            ) : formData?.tech_from == 4 ? (
                              <div className="w-full text-center text-[20px]">
                                <p>
                                  {lang?.["9"]} {formData?.tech_num}{" "}
                                  {lang?.["10"]}
                                </p>
                                <p className="my-3">
                                  <strong className="bg-[#2845F5] px-3 py-2 text-[32px] rounded-lg text-white">
                                    {result?.tech_total}
                                  </strong>
                                </p>
                              </div>
                            ) : formData?.tech_from == 5 ? (
                              <div className="w-full text-center">
                                <p>
                                  <strong className="bg-[#2845F5] px-3 py-2 text-[32px] rounded-lg text-white">
                                    {formData?.tech_num}:{" "}
                                    {result?.tech_prime_check == 0
                                      ? lang?.["11"]
                                      : ""}{" "}
                                    {lang?.["12"]}
                                  </strong>
                                </p>
                              </div>
                            ) : (
                              <div className="w-full md:w-4/5 lg:w-4/5 mt-2 overflow-auto">
                                <table className="w-full text-[16px]">
                                  <tbody>
                                    {result?.tech_prev && (
                                      <tr>
                                        <td className="py-2 border-b w-4/5">
                                          <strong>{lang?.["13"]}</strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_prev}
                                        </td>
                                      </tr>
                                    )}
                                    <tr>
                                      <td className="py-2 border-b w-4/5">
                                        <strong>{lang?.["14"]}</strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {result?.tech_next}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </>
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

export default PrimeFactorizationCalculator;

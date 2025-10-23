"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTaxCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const IncomeTaxCalculator = () => {
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
    tech_tax_year: "2020",
    tech_income: "10",
    tech_f_state: "s",
    tech_age: "20",
    tech_k_con: "12",
    tech_ira: "10",
    tech_tax_with: "15",
    tech_ded: "i", //  s  i
    tech_item: "33",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTaxCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_tax_year ||
      !formData.tech_income ||
      !formData.tech_f_state ||
      !formData.tech_age ||
      !formData.tech_k_con ||
      !formData.tech_ira ||
      !formData.tech_tax_with ||
      !formData.tech_ded
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_tax_year: formData.tech_tax_year,
        tech_income: formData.tech_income,
        tech_f_state: formData.tech_f_state,
        tech_age: formData.tech_age,
        tech_k_con: formData.tech_k_con,
        tech_ira: formData.tech_ira,
        tech_tax_with: formData.tech_tax_with,
        tech_ded: formData.tech_ded,
        tech_item: formData.tech_item,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_tax_year: "2020",
      tech_income: "10",
      tech_f_state: "s",
      tech_age: "20",
      tech_k_con: "12",
      tech_ira: "10",
      tech_tax_with: "15",
      tech_ded: "i", //  s  i
      tech_item: "33",
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_tax_year" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_tax_year"
                    id="tech_tax_year"
                    value={formData.tech_tax_year}
                    onChange={handleChange}
                  >
                    <option value="2020">
                      2020 ({data?.payload?.tech_lang_keys["2"]} 2021)
                    </option>
                    <option value="2019">
                      2019 ({data?.payload?.tech_lang_keys["2"]} 2020){" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 ">
                <label htmlFor="tech_income" className="label">
                  {data?.payload?.tech_lang_keys["quantity"]}:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_income"
                    id="tech_income"
                    className="input mt-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_income}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_f_state" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_f_state"
                    id="tech_f_state"
                    value={formData.tech_f_state}
                    onChange={handleChange}
                  >
                    <option value="s">
                      {data?.payload?.tech_lang_keys["single"]}
                    </option>
                    <option value="m_j">
                      {data?.payload?.tech_lang_keys["m_join"]}
                    </option>
                    <option value="m_s">
                      {data?.payload?.tech_lang_keys["m_sep"]}
                    </option>
                    <option value="h">
                      {data?.payload?.tech_lang_keys["h_onwer"]}
                    </option>
                    <option value="w">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["age"]}:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_age"
                    id="tech_age"
                    min="18"
                    max="99"
                    className="input mt-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_age}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2 ">
                <label htmlFor="tech_k_con" className="label">
                  {data?.payload?.tech_lang_keys["k_con"]}:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_k_con"
                    id="tech_k_con"
                    className="input "
                    aria-label="input"
                    value={formData.tech_k_con}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="space-y-2 ">
                <label htmlFor="tech_ira" className="label">
                  {data?.payload?.tech_lang_keys["ira"]}:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_ira"
                    id="tech_ira"
                    className="input "
                    aria-label="input"
                    value={formData.tech_ira}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="space-y-2 ">
                <label htmlFor="tech_tax_with" className="label">
                  {data?.payload?.tech_lang_keys["tax_with"]}:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_tax_with"
                    id="tech_tax_with"
                    className="input mt-2"
                    aria-label="input"
                    value={formData.tech_tax_with}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_ded" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_ded"
                    id="tech_ded"
                    value={formData.tech_ded}
                    onChange={handleChange}
                  >
                    <option value="s">
                      {data?.payload?.tech_lang_keys["stand"]}
                    </option>
                    <option value="i">
                      {data?.payload?.tech_lang_keys["item"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_item" className="label">
                  {data?.payload?.tech_lang_keys["item"]}:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_item"
                    id="tech_item"
                    className="input "
                    aria-label="input"
                    value={formData.tech_item}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
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

                  <div className="rounded-lg  flex items-center ">
                    <div className="w-full md:w-[50%] bg-light-blue  rounded-lg mt-6">
                      {result?.tech_e && (
                        <div className=" w-full mt-4 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["e"]}
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol} {result?.tech_e ?? 0}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["a"]}
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol} {result?.tech_a ?? 0}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["3"]}
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol}{" "}
                                  {Number(result?.tech_s ?? 0).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["4"]}
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_m_tax ?? 0).toFixed(2)} %
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["b"]}
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_b ?? 0).toFixed(2)} %
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["c"]}
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol} {result?.tech_c ?? 0}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["d"]}
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol} {result?.tech_d ?? 0}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {result?.tech_f && (
                        <div className="w-full mt-4">
                          <table className="w-full text-lg">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["f"]}
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol} {result?.tech_f ?? 0}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["a"]}
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol} {result?.tech_a ?? 0}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["3"]}
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol}{" "}
                                  {Number(result?.tech_s ?? 0).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["4"]}
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_m_tax ?? 0).toFixed(2)} %
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["b"]}
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_b ?? 0).toFixed(2)} %
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["c"]}
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol} {result?.tech_c ?? 0}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-4/5 font-bold">
                                  {data?.payload?.tech_lang_keys["d"]}
                                </td>
                                <td className="py-2 border-b">
                                  {currency.symbol} {result?.tech_d ?? 0}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
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

export default IncomeTaxCalculator;

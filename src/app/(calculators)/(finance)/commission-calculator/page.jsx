"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useCommissionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CommissionCalculator = () => {
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
    tech_find: "1", //  1  2
    tech_select1: "commission", ///  sale_price  commission   commission_rate
    tech_sale_price: 10,
    tech_commission_rate: 20,
    tech_commission_amount: 30,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCommissionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_find || !formData.tech_select1) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_find: formData.tech_find,
        tech_select1: formData.tech_select1,
        tech_sale_price: formData.tech_sale_price,
        tech_commission_rate: formData.tech_commission_rate,
        tech_commission_amount: formData.tech_commission_amount,
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
      tech_find: "1", //  1  2
      tech_select1: "commission_rate", ///  sale_price  commission   commission_rate
      tech_sale_price: 10,
      tech_commission_rate: 20,
      tech_commission_amount: 30,
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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_find" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_find"
                    id="tech_find"
                    value={formData.tech_find}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="input-field  col-span-12 m-set" id="g-hide">
                <p className="col med-set">
                  <label className="font_size16">
                    <strong>{data?.payload?.tech_lang_keys["4"]} : </strong>
                  </label>
                </p>

                <label className="pe-2" htmlFor="commission">
                  <input
                    type="radio"
                    name="tech_select1"
                    value="commission"
                    id="commission"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_select1 == "commission"}
                  />
                  <span>{data?.payload?.tech_lang_keys["5"]}</span>
                </label>

                <label htmlFor="sale_price">
                  <input
                    type="radio"
                    name="tech_select1"
                    className="mx-2 border"
                    value="sale_price"
                    id="sale_price"
                    onChange={handleChange}
                    checked={formData.tech_select1 == "sale_price"}
                  />
                  <span>{data?.payload?.tech_lang_keys["6"]}</span>
                </label>
                <label htmlFor="commission_rate">
                  <input
                    type="radio"
                    name="tech_select1"
                    className="mx-2 border"
                    value="commission_rate"
                    id="commission_rate"
                    onChange={handleChange}
                    checked={formData.tech_select1 == "commission_rate"}
                  />
                  <span>{data?.payload?.tech_lang_keys["7"]}</span>
                </label>
              </div>

              {(formData?.tech_select1 == "commission" ||
                formData?.tech_select1 == "commission_rate") && (
                <div className="col-span-12" id="sp">
                  <label htmlFor="tech_sale_price" className="label">
                    {data?.payload?.tech_lang_keys["6"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_sale_price"
                      id="tech_sale_price"
                      className="input my-2"
                      aria-label="input"
                      placeholder="50"
                      value={formData.tech_sale_price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              {(formData?.tech_select1 == "commission" ||
                formData?.tech_select1 == "sale_price") && (
                <div className="col-span-12" id="cr">
                  <label htmlFor="tech_commission_rate" className="label">
                    {data?.payload?.tech_lang_keys["7"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_commission_rate"
                      id="tech_commission_rate"
                      className="input my-2"
                      aria-label="input"
                      placeholder="50"
                      value={formData.tech_commission_rate}
                      onChange={handleChange}
                    />
                    <span className=" input_unit">%</span>
                  </div>
                </div>
              )}

              {(formData?.tech_select1 == "sale_price" ||
                formData?.tech_select1 == "commission_rate") && (
                <div className="col-span-12" id="c">
                  <label htmlFor="tech_commission_amount" className="label">
                    {data?.payload?.tech_lang_keys["5"]}:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_commission_amount"
                      id="tech_commission_amount"
                      className="input my-2"
                      aria-label="input"
                      placeholder="50"
                      value={formData.tech_commission_amount}
                      onChange={handleChange}
                    />
                    <span className="input_unit">%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
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
                      {(formData?.tech_find == "1" ||
                        formData?.tech_find == "2") && (
                        <div className="w-full md:w-[90%] lg:w-[80%] mt-2 overflow-auto">
                          {/* If tech_method is 1 */}
                          {result?.tech_method == "1" && (
                            <table className="w-full text-[16px]">
                              <tbody>
                                {formData?.tech_find == "1" && (
                                  <tr>
                                    <td className="py-2 border-b" width="80%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["5"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_answer).toFixed(2)}
                                    </td>
                                  </tr>
                                )}

                                {formData?.tech_find == "2" && (
                                  <>
                                    <tr>
                                      <td className="py-2 border-b" width="80%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["8"]}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        {Number(result?.tech_answer).toFixed(2)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="80%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["9"]}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        {result?.tech_sale_price -
                                          result?.tech_answer}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="80%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["10"]}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        {result?.tech_sale_price +
                                          result?.tech_answer}
                                      </td>
                                    </tr>
                                  </>
                                )}
                              </tbody>
                            </table>
                          )}

                          {/* If tech_method is 2 */}
                          {result?.tech_method == "2" && (
                            <table className="w-full text-[18px]">
                              <tbody>
                                {(formData?.tech_find == "1" ||
                                  formData?.tech_find == "2") && (
                                  <tr>
                                    <td className="py-2 border-b" width="80%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["6"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_answer).toFixed(2)}
                                    </td>
                                  </tr>
                                )}
                                {formData?.tech_find == "2" && (
                                  <>
                                    <tr>
                                      <td className="py-2 border-b" width="80%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["9"]}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        {result?.tech_answer -
                                          result?.tech_commission_amount}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="80%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["10"]}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        {result?.tech_answer +
                                          result?.tech_commission_amount}
                                      </td>
                                    </tr>
                                  </>
                                )}
                              </tbody>
                            </table>
                          )}

                          {/* If tech_method is 3 */}
                          {result?.tech_method == "3" && (
                            <table className="w-full text-[18px]">
                              <tbody>
                                {formData?.tech_find == "1" && (
                                  <tr>
                                    <td className="py-2 border-b" width="80%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["7"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_answer).toFixed(2)} %
                                    </td>
                                  </tr>
                                )}
                                {formData?.tech_find == "2" && (
                                  <>
                                    <tr>
                                      <td className="py-2 border-b" width="80%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["11"]}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {Number(result?.tech_answer).toFixed(2)}{" "}
                                        %
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="80%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["9"]}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        {Number(
                                          result?.tech_sale_price -
                                            result?.tech_commission_amount
                                        ).toFixed(2)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="80%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["10"]}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {currency.symbol}{" "}
                                        {Number(
                                          result?.tech_sale_price +
                                            result?.tech_commission_amount
                                        ).toFixed(2)}
                                      </td>
                                    </tr>
                                  </>
                                )}
                              </tbody>
                            </table>
                          )}
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

export default CommissionCalculator;

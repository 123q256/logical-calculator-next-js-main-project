"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePaybackPeriodCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PaybackPeriodCalculator = () => {
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

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    tech_unit_type: "same", // same not_same
    tech_currency: currency.symbol,
    tech_initial: Number(100000),
    tech_cash: Number(30000),
    tech_add_sub: "in",
    tech_in_de: Number(5),
    tech_year_first: Number(5),
    tech_discount: Number(5),
    tech_currency1: currency.symbol,
    tech_count: 1, // initial value
    tech_initial2: 5,
    tech_discount2: 5,
    tech_year: [""], // ✅ initialize as array
  });

  // ✅ This useEffect updates tech_count when tech_year changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      tech_count: formData.tech_year.length,
    }));
  }, [formData.tech_year]);

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePaybackPeriodCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const yearFields = {};
      formData.tech_year.forEach((value, index) => {
        yearFields[`tech_year${index + 1}`] = Number(value); // Convert to number if needed
      });

      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_currency: formData.tech_currency,
        tech_initial: Number(formData.tech_initial),
        tech_cash: Number(formData.tech_cash),
        tech_add_sub: formData.tech_add_sub,
        tech_in_de: Number(formData.tech_in_de),
        tech_year_first: Number(formData.tech_year_first),
        tech_discount: Number(formData.tech_discount),
        tech_currency1: formData.tech_currency1,
        tech_count: formData.tech_count,
        tech_initial2: formData.tech_initial2,
        tech_discount2: formData.tech_discount2,
        ...yearFields, // 🟢 Spread dynamic year fields
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      console.log(err);
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_unit_type: "same", // same not_same
      tech_currency: currency.symbol,
      tech_initial: Number(100000),
      tech_cash: Number(30000),
      tech_add_sub: "in",
      tech_in_de: Number(5),
      tech_year_first: Number(5),
      tech_discount: Number(5),
      tech_currency1: currency.symbol,
      tech_count: 1, // initial value
      tech_initial2: 5,
      tech_discount2: 5,
      tech_year: [""], // ✅ initialize as array
    });
    setResult(null);
    setFormError(null);
  };

  const handleRemoveYear = (index) => {
    const updatedYears = formData.tech_year.filter((_, i) => i !== index);
    setFormData({ ...formData, tech_year: updatedYears });
  };

  return (
    <Calculator
      isLoading={isLoading}
      data={data}
      links={[
        { name: "Home", path: "/" },
        {
          name: data?.payload?.tech_cal_cat,
          path: "/category/Finance",
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="tech_currancy"
                id="calculator_time"
                value={currency.symbol}
              />
              <input
                type="hidden"
                name="tech_unit_type"
                id="calculator_time"
                value={formData.tech_unit_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_unit_type === "same" ? "tagsUnit" : ""
                    }`}
                    id="same"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "same" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["1"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit_type === "not_same" ? "tagsUnit" : ""
                    }`}
                    id="not_same"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "not_same" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["8"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-3  gap-4">
              {formData.tech_unit_type == "same" && (
                <div className="col-span-12 " id="firsts">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <p className="py-2 col-span-12">
                      <strong>{data?.payload?.tech_lang_keys[1]}</strong>
                    </p>
                    <div className="col-span-6">
                      <label htmlFor="tech_initial" className="label">
                        {data?.payload?.tech_lang_keys["2"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_initial"
                          id="tech_initial"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_initial}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_cash" className="label">
                        {data?.payload?.tech_lang_keys["4"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_cash"
                          id="tech_cash"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_cash}
                          onChange={handleChange}
                        />
                        <span className="input_unit">/ year</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_want" className="label">
                        &nbsp;
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_want"
                          id="tech_want"
                          value={formData.tech_want}
                          onChange={handleChange}
                        >
                          <option value="in">
                            {data?.payload?.tech_lang_keys["5"]}
                          </option>
                          <option value="de">
                            {data?.payload?.tech_lang_keys["6"]}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_in_de" className="label">
                        {data?.payload?.tech_lang_keys["4"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_in_de"
                          id="tech_in_de"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_in_de}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%/ year</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_year_first" className="label">
                        {data?.payload?.tech_lang_keys["7"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_year_first"
                          id="tech_year_first"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_year_first}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_discount" className="label">
                        {data?.payload?.tech_lang_keys["3"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_discount"
                          id="tech_discount"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_discount}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {formData.tech_unit_type == "not_same" && (
                <>
                  <div className="col-span-12 mt-5" id="second">
                    <div className="grid grid-cols-12 mt-3  gap-4  more_years">
                      <p className="col-span-12">
                        <strong>{data?.payload?.tech_lang_keys[8]}</strong>
                      </p>
                      <div className="col-span-6">
                        <label htmlFor="tech_initial2" className="label">
                          {data?.payload?.tech_lang_keys["2"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_initial2"
                            id="tech_initial2"
                            className="input my-2"
                            aria-label="input"
                            value={formData.tech_initial2}
                            onChange={handleChange}
                          />
                          <span className="input_unit">{currency.symbol}</span>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_discount2" className="label">
                          {data?.payload?.tech_lang_keys["3"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_discount2"
                            id="tech_discount2"
                            className="input my-2"
                            aria-label="input"
                            value={formData.tech_discount2}
                            onChange={handleChange}
                          />
                          <span className="input_unit">%</span>
                        </div>
                      </div>
                      <p className="col-span-12 mb-3">
                        <strong>{data?.payload?.tech_lang_keys[4]}</strong>
                      </p>
                    </div>

                    <input
                      type="hidden"
                      name="tech_count"
                      id="tech_count"
                      value={formData.tech_year.length}
                    />

                    <div className="grid grid-cols-12 gap-4">
                      {formData.tech_year.map((value, index) => (
                        <div key={index} className="col-span-6 relative">
                          <div className="flex justify-between">
                            <label
                              htmlFor={`tech_year${index + 1}`}
                              className="label block"
                            >
                              {data?.payload?.tech_lang_keys["9"]} {index + 1}
                            </label>
                            {formData.tech_year.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveYear(index)}
                                title="Remove"
                              >
                                <img
                                  src="/images/images_mix/belete_btn.png"
                                  width="15"
                                  height="20"
                                  className="cursor-pointer"
                                  alt="Delete"
                                />
                              </button>
                            )}
                          </div>
                          <div className="w-full py-2 relative">
                            <input
                              type="number"
                              step="any"
                              name={`tech_year${index + 1}`} // 👈 Important
                              id={`tech_year${index + 1}`}
                              className="input w-full pr-10"
                              placeholder="00"
                              min="1"
                              value={value}
                              onChange={(e) => {
                                const updatedYears = [...formData.tech_year];
                                updatedYears[index] = e.target.value;
                                setFormData({
                                  ...formData,
                                  tech_year: updatedYears,
                                });
                              }}
                            />
                            <span className="text-blue input_unit ">
                              {currency.symbol}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="col-12 text-end mt-3">
                      <button
                        type="button"
                        id="add_year"
                        className="px-3 py-2 mx-1 addmore bg-[#2845F5] text-white cursor-pointer rounded-lg"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            tech_year: [...formData.tech_year, ""],
                          });
                        }}
                      >
                        {data?.payload?.tech_lang_keys[10]}
                      </button>
                    </div>
                  </div>
                </>
              )}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full mt-2">
                        <table className="w-full text-[16px] md:text-[18px]">
                          <tbody>
                            {result?.tech_not_back ? (
                              <>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys[11]}{" "}
                                  <strong>{result?.tech_ave_i} years</strong>{" "}
                                  {data?.payload?.tech_lang_keys[12]}{" "}
                                  <strong>
                                    {currency?.result?.tech_ave_cash} / year
                                  </strong>
                                </p>
                                <p>
                                  {data?.payload?.tech_lang_keys[13]}{" "}
                                  <strong>{result?.tech_ave_i}</strong>{" "}
                                  <strong>
                                    {data?.payload?.tech_lang_keys[14]}
                                  </strong>{" "}
                                  {result?.tech_back} years
                                </p>
                              </>
                            ) : (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[15]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_back} years
                                </td>
                              </tr>
                            )}

                            {result?.tech_dis_not_back ? (
                              <>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys[16]}{" "}
                                  {formData?.tech_discount2}%,{" "}
                                  {data?.payload?.tech_lang_keys[17]}{" "}
                                  <strong>{result?.tech_ave_i} years</strong>{" "}
                                  {data?.payload?.tech_lang_keys[18]}{" "}
                                  <strong>
                                    {currency?.result?.tech_ave_cash_d} / year
                                  </strong>
                                </p>
                                <p>
                                  {data?.payload?.tech_lang_keys[13]}{" "}
                                  <strong>{result?.tech_ave_i}</strong>{" "}
                                  {data?.payload?.tech_lang_keys[14]}{" "}
                                  <strong>{result?.tech_dis_back} years</strong>
                                </p>
                              </>
                            ) : (
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[19]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_dis_back} years
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full   text-[14px] md:text-[16px] mt-3 overflow-auto">
                        <table className="w-full ">
                          <tbody>
                            <tr className="">
                              <td className="py-2 border-b">
                                <strong>Years</strong>
                              </td>
                              <td className="py-2 border-b">
                                <strong>
                                  {data?.payload?.tech_lang_keys[4]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                <strong>
                                  {data?.payload?.tech_lang_keys[20]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                <strong>
                                  {data?.payload?.tech_lang_keys[21]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                <strong>
                                  {data?.payload?.tech_lang_keys[22]}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b">Year 0</td>
                              <td className="py-2 border-b">
                                {currency.symbol}-
                                {Number(result?.tech_total).toFixed(2)}
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol}-
                                {Number(result?.tech_total).toFixed(2)}
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol}-
                                {Number(result?.tech_total).toFixed(2)}
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol}-
                                {Number(result?.tech_total).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                          <tbody
                            dangerouslySetInnerHTML={{
                              __html: result?.tech_table || "",
                            }}
                          />
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

export default PaybackPeriodCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useCostOfEquityCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CostOfEquityCalculator = () => {
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
    tech_pay: "2", //  1  2
    tech_dividend_per_share: 50,
    tech_current_market_value: 50,
    tech_growth_rate_dividend: 50,
    tech_risk_rate_return: "7",
    tech_market_rate_return: "7",
    tech_beta: "0",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCostOfEquityCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_pay == 1) {
      if (
        !formData.tech_pay ||
        !formData.tech_dividend_per_share ||
        !formData.tech_current_market_value ||
        !formData.tech_growth_rate_dividend
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_pay ||
        !formData.tech_risk_rate_return ||
        !formData.tech_market_rate_return ||
        !formData.tech_beta
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_pay: formData.tech_pay,
        tech_dividend_per_share: formData.tech_dividend_per_share,
        tech_current_market_value: formData.tech_current_market_value,
        tech_growth_rate_dividend: formData.tech_growth_rate_dividend,
        tech_risk_rate_return: formData.tech_risk_rate_return,
        tech_market_rate_return: formData.tech_market_rate_return,
        tech_beta: formData.tech_beta,
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
      tech_pay: "2", //  1  2
      tech_dividend_per_share: 50,
      tech_current_market_value: 50,
      tech_growth_rate_dividend: 50,
      tech_risk_rate_return: "7",
      tech_market_rate_return: "7",
      tech_beta: "0",
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

          <div className="lg:w-[75%] md:w-[90%] w-full mx-auto ">
            <div className="grid lg:grid-cols-12 md:grid-cols-12 grid-cols-6mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_pay" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_pay"
                    id="tech_pay"
                    value={formData.tech_pay}
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

              {formData.tech_pay == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 a">
                    <label htmlFor="tech_dividend_per_share" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_dividend_per_share"
                        id="tech_dividend_per_share"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_dividend_per_share}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 a">
                    <label
                      htmlFor="tech_current_market_value"
                      className="label"
                    >
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_current_market_value"
                        id="tech_current_market_value"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_current_market_value}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 a">
                    <label
                      htmlFor="tech_growth_rate_dividend"
                      className="label"
                    >
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_growth_rate_dividend"
                        id="tech_growth_rate_dividend"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_growth_rate_dividend}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_pay == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 aa ">
                    <label htmlFor="tech_risk_rate_return" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_risk_rate_return"
                        id="tech_risk_rate_return"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_risk_rate_return}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 aa ">
                    <label htmlFor="tech_market_rate_return" className="label">
                      {data?.payload?.tech_lang_keys["8"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_market_rate_return"
                        id="tech_market_rate_return"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_market_rate_return}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 aa ">
                    <label htmlFor="tech_beta" className="label">
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_beta"
                        id="tech_beta"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_beta}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />
                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-ful mt-3">
                      <div className="cw-full text-center text-[20px]">
                        <p>{data?.payload?.tech_lang_keys["10"]}</p>
                        <p className="my-3">
                          <strong className="bg-[#2845F5] text-white bordered rounded-md px-3 py-2 text-[25px]">
                            {result?.tech_ans} (%)
                          </strong>
                        </p>
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

export default CostOfEquityCalculator;

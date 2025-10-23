"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useScientificNotationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ScientificNotationCalculator = () => {
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
    tech_type: "calculator1", // converter calculator
    tech_decimal: "1.356 x 10^5",
    tech_nbr1: 3.12,
    tech_pwr1: 4,
    tech_opr: "/", // + - *
    tech_nbr2: 1.52,
    tech_pwr2: -2,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useScientificNotationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_decimal: formData.tech_decimal,
        tech_nbr1: formData.tech_nbr1,
        tech_pwr1: formData.tech_pwr1,
        tech_opr: formData.tech_opr,
        tech_nbr2: formData.tech_nbr2,
        tech_pwr2: formData.tech_pwr2,
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
      tech_type: "calculator1", // converter calculator
      tech_decimal: "1.356 x 10^5",
      tech_nbr1: 3.12,
      tech_pwr1: 4,
      tech_opr: "/", // + - *
      tech_nbr2: 1.52,
      tech_pwr2: -2,
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

  const [power, setPower] = useState(
    Number(result?.tech_right ?? formData?.tech_right ?? 0)
  );
  const [mantissa, setMantissa] = useState(
    Number(result?.tech_left ?? formData?.tech_left ?? 0)
  );

  const baseNumber = Number(result?.tech_ans ?? formData?.tech_real ?? 0);

  const updateMantissa = (num, pow) => {
    if (!num) {
      setMantissa(0);
      return;
    }
    const str = num.toString().split(".");
    let dp = str.length > 1 ? str[1].length : 0;

    dp += pow;
    if (dp < 0) dp = 0;
    if (dp > 20) dp = 20;

    const m = (num / Math.pow(10, pow)).toFixed(dp);
    setMantissa(m);
  };

  useEffect(() => {
    updateMantissa(baseNumber, power);
  }, [baseNumber, power]);

  const raisePower = () => setPower((prev) => prev + 1);
  const lowerPower = () => setPower((prev) => prev - 1);

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

          <div className="col-12 col-lg-9 mx-auto mt-2 lg:w-[80%] w-full">
            <input
              type="hidden"
              name="tech_type"
              id="calculator_time"
              value={formData.tech_type}
            />
            <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
              {/* Date Cal Tab */}
              <div className="lg:w-1/2 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                    formData.tech_type === "calculator1" ? "tagsUnit" : ""
                  }`}
                  id="calculator1"
                  onClick={() => {
                    setFormData({ ...formData, tech_type: "calculator1" });
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
                    formData.tech_type === "calculator" ? "tagsUnit" : ""
                  }`}
                  id="calculator"
                  onClick={() => {
                    setFormData({ ...formData, tech_type: "calculator" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_calculator_title}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              {formData.tech_type == "calculator1" && (
                <>
                  <div className="col-span-12">
                    <p className="font-s-14">
                      <strong>{data?.payload?.tech_lang_keys["4"]}:</strong>{" "}
                      {data?.payload?.tech_lang_keys["5"]}
                    </p>
                    <div className="col-12 mt-0 mt-lg-2">
                      <label htmlFor="tech_decimal" className="label">
                        {data?.payload?.tech_lang_keys["1"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="text"
                          step="any"
                          name="tech_decimal"
                          id="tech_decimal"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_decimal}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type == "calculator" && (
                <>
                  <div className="col-span-12 ">
                    <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-2 hidden md:block lg:block"></div>
                      <div className="col-span-6 md:col-span-4 lg:col-span-4">
                        <label htmlFor="tech_nbr1" className="label">
                          {data?.payload?.tech_lang_keys["2"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_nbr1"
                            id="tech_nbr1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_nbr1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <p className="mt-4 text-center">
                          <strong>x 10 ^</strong>
                        </p>
                      </div>
                      <div className="col-span-4">
                        <label htmlFor="tech_pwr1" className="label">
                          &nbsp;
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_pwr1"
                            id="tech_pwr1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_pwr1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-2 lg:col-span-2">
                        <label htmlFor="tech_opr" className="label">
                          &nbsp;
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_opr"
                            id="tech_opr"
                            value={formData.tech_opr}
                            onChange={handleChange}
                          >
                            <option value="+">+</option>
                            <option value="-">-</option>
                            <option value="*">*</option>
                            <option value="/">/</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-4 lg:col-span-4">
                        <label htmlFor="tech_nbr2" className="label">
                          {data?.payload?.tech_lang_keys["3"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_nbr2"
                            id="tech_nbr2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_nbr2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <p className="mt-4 text-center">
                          <strong>x 10 ^</strong>
                        </p>
                      </div>
                      <div className="col-span-4">
                        <label htmlFor="tech_pwr2" className="label">
                          &nbsp;
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_pwr2"
                            id="tech_pwr2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_pwr2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 rounded-lg result_calculator space-y-6 result">
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
                        <div className="w-full text-[16px]">
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[6]}
                          </p>

                          <p className="mt-2 text-[20px]">
                            <strong>
                              <span>{mantissa}</span>{" "}
                              <span className="text-muted">x 10</span>
                              <sup className="text-[16px]">{power}</sup>
                            </strong>
                          </p>

                          <button
                            type="button"
                            className="calculate mt-2 right cursor-pointer bg-[#2845F5] text-white rounded-lg"
                            style={{ padding: "10px 15px" }}
                            onClick={raisePower}
                          >
                            ←
                          </button>

                          <button
                            type="button"
                            className="calculate mt-2 ms-2 left bg-[#2845F5] text-white rounded-lg cursor-pointer"
                            style={{ padding: "10px 15px" }}
                            onClick={lowerPower}
                          >
                            →
                          </button>

                          <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys[7]}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_e_ans ?? formData?.tech_en}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys[9]}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_ee_ans ?? formData?.tech_een}{" "}
                                    x10
                                    <sup className="font-s-12">
                                      {result?.tech_ee_p ?? formData?.tech_eep}
                                    </sup>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    className="py-2 border-b"
                                    width="40%"
                                  ></td>
                                  <td className="py-2 border-b">
                                    {mantissa} x 10
                                    <sup className="font-s-12">{power}</sup>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys[8]}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_ans ?? formData?.tech_real}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys[13]}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_right ?? formData?.tech_right}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <input
                            type="hidden"
                            step="any"
                            name="tech_ans"
                            id="tech_ans"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={result?.tech_ans}
                            onChange={handleChange}
                          />
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

export default ScientificNotationCalculator;

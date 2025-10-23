"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useStandardFormCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const StandardFormCalculator = () => {
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
    tech_x: "135900000",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useStandardFormCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
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
      tech_x: "135900000",
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

  // power ko state mein rakho
  const [power, setPower] = useState(result?.tech_right ?? 0);

  // mantissa calculate karne ke liye state
  const [mantissa, setMantissa] = useState("0");

  useEffect(() => {
    if (!result?.tech_number) {
      setMantissa("0");
      return;
    }

    const str = result.tech_number.toString().split(".");
    let dp = 0;
    if (str.length > 1) dp = str[1].length;

    dp += power;
    if (dp < 0) dp = 0;
    if (dp > 20) dp = 20;

    const num = Number(result.tech_number) / Math.pow(10, power);
    setMantissa(num.toFixed(dp));
  }, [power, result?.tech_number]);

  const raisePower = () => setPower((p) => p + 1);
  const lowerPower = () => setPower((p) => p - 1);

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
            <div className="grid grid-cols-1   gap-2 md:gap-4 lg:gap-4">
              <div className=" mt-0 mt-lg-2">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["enter"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x"
                    id="tech_x"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x}
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
                        <div className="w-full text-[16px]">
                          <div className="mt-2">
                            {data?.payload?.tech_lang_keys[2]}
                          </div>

                          <p className="mt-2 font-s-21">
                            <strong>
                              <span id="mantissa">{mantissa}</span>{" "}
                              <span className="text-muted">x 10</span>{" "}
                              <sup className="text-[12px]" id="exponent">
                                {power}
                              </sup>
                            </strong>
                          </p>

                          <button
                            type="button"
                            className="calculate mt-2 right cursor-pointer bg-[#2845F5] text-white rounded-lg"
                            style={{ padding: "10px 15px", cursor: "pointer" }}
                            onClick={raisePower}
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            className="calculate mt-2 ms-2 left bg-[#2845F5] text-white rounded-lg"
                            style={{ padding: "10px 15px", cursor: "pointer" }}
                            onClick={lowerPower}
                          >
                            →
                          </button>

                          <p className="mt-3">
                            Standard form is also known as Scientific Notation.{" "}
                            <a
                              href="https://calculator-logical.com/scientific-notation-calculator"
                              className="text-blue-800"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Scientific Notation Calculator
                            </a>
                          </p>

                          <div className="w-full md:w-[90%] lg:w-[60%] mt-2 overflow-auto">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    {data?.payload?.tech_lang_keys["e_n"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_e_ans}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {data?.payload?.tech_lang_keys["en_n"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_ee_ans} x10
                                    <sup className="text-[12px]">
                                      {result?.tech_ee_p}
                                    </sup>
                                  </td>
                                </tr>

                                {result?.tech_real_num === 0 ? (
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["r_n"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_number ?? result?.tech_real}
                                    </td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["sc_n"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <span id="mantissa">
                                        {result?.tech_left ?? result?.tech_left}
                                      </span>{" "}
                                      <span className="text-muted">x 10</span>{" "}
                                      <sup
                                        className="text-[12px]"
                                        id="exponent"
                                      >
                                        {result?.tech_right ??
                                          result?.tech_right}
                                      </sup>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
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

export default StandardFormCalculator;
